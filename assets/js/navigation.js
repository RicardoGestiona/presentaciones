/**
 * Presentation Navigation
 * Navegación horizontal con transición suave y soporte de fases
 */
(function () {
    "use strict";

    var main = document.querySelector('main[role="presentation"]');
    if (!main) return;

    /* Inyecta wrapper .stage que escala uniformemente el deck al viewport.
       No requiere cambios en el HTML de cada presentación. */
    if (!main.parentElement || !main.parentElement.classList.contains("stage")) {
        var newStage = document.createElement("div");
        newStage.className = "stage";
        main.parentNode.insertBefore(newStage, main);
        newStage.appendChild(main);
    }
    var stage = main.parentElement; // .stage (recién inyectado o preexistente)

    var slides = main.querySelectorAll(".slide-container");
    var total = slides.length;
    var current = 0;
    var SLIDE_WIDTH = 1280;

    /* Paginación visual (bullets): indicador de la diapositiva activa. Se genera
       dinámicamente (un dot por slide) y se ancla a .stage, por lo que flota sobre
       el área visible y escala con el deck. Estilos en corporate.css (.slide-dots).
       Es de solo lectura; goToSlide() actualiza el dot activo. */
    var dots = [];
    if (total > 1) {
        var dotsNav = document.createElement("nav");
        dotsNav.className = "slide-dots";
        dotsNav.setAttribute("aria-label", "Paginación de diapositivas");
        for (var d = 0; d < total; d++) {
            var dot = document.createElement("span");
            dot.className = "slide-dot";
            dot.setAttribute("aria-hidden", "true");
            dotsNav.appendChild(dot);
            dots.push(dot);
        }
        stage.appendChild(dotsNav);
    }

    function updateDots(index) {
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle("is-active", i === index);
        }
    }

    /** Obtiene las fases de una slide, ordenadas por data-phase */
    function getPhases(slideIndex) {
        return Array.from(slides[slideIndex].querySelectorAll(".phase[data-phase]"))
            .sort(function (a, b) {
                return Number(a.dataset.phase) - Number(b.dataset.phase);
            });
    }

    /** Devuelve cuántas fases son visibles en la slide actual */
    function visiblePhaseCount(slideIndex) {
        return slides[slideIndex].querySelectorAll(".phase.visible").length;
    }

    /** Muestra todas las fases de una slide (para navegación hacia atrás) */
    function showAllPhases(slideIndex) {
        getPhases(slideIndex).forEach(function (el) { el.classList.add("visible"); });
    }

    /** Oculta todas las fases de una slide */
    function hideAllPhases(slideIndex) {
        getPhases(slideIndex).forEach(function (el) { el.classList.remove("visible"); });
    }

    /** Muestra la siguiente fase de la slide actual. Devuelve true si había fase pendiente */
    function advancePhase() {
        var phases = getPhases(current);
        if (phases.length === 0) return false;

        var nextPhase = phases.find(function (el) { return !el.classList.contains("visible"); });
        if (nextPhase) {
            var phaseNum = nextPhase.dataset.phase;
            // Mostrar todos los elementos con el mismo data-phase en paralelo
            phases.forEach(function (el) {
                if (el.dataset.phase === phaseNum) {
                    el.classList.add("visible");
                }
            });
            return true;
        }
        return false;
    }

    function goToSlide(index) {
        if (index < 0 || index >= total) return;
        var prev = current;
        current = index;
        main.style.transform = "translateX(-" + (current * SLIDE_WIDTH) + "px)";
        updateDots(current);

        // Al retroceder, mostrar todas las fases de la slide destino
        if (index < prev) {
            showAllPhases(current);
        }
        // Al avanzar, ocultar todas las fases (se revelan con siguiente pulsación)
        if (index > prev) {
            var phases = getPhases(current);
            if (phases.length > 0) {
                hideAllPhases(current);
            }
        }
    }

    function handleNext() {
        if (!advancePhase()) {
            goToSlide(current + 1);
        }
    }

    function handlePrev() {
        goToSlide(current - 1);
    }

    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
            case " ":
            case "PageDown":
                e.preventDefault();
                handleNext();
                break;
            case "ArrowLeft":
            case "ArrowUp":
            case "PageUp":
                e.preventDefault();
                handlePrev();
                break;
            case "Home":
                e.preventDefault();
                goToSlide(0);
                break;
            case "End":
                e.preventDefault();
                goToSlide(total - 1);
                break;
        }
    });

    window.addEventListener("wheel", function (e) {
        e.preventDefault();
    }, { passive: false });

    // Inicializar: mostrar fase 1 de la primera slide con fases
    slides.forEach(function (slide, i) {
        var phases = slide.querySelectorAll(".phase[data-phase]");
        if (phases.length > 0 && i === 0) {
            phases[0].classList.add("visible");
        } else if (phases.length > 0) {
            // Ocultas por defecto (CSS ya las oculta)
        }
    });

    goToSlide(0);
})();
