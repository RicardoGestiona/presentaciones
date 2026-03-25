/**
 * Presentation Navigation
 * Navegación horizontal con transición suave
 */
(function () {
    "use strict";

    var main = document.querySelector('main[role="presentation"]');
    if (!main) return;

    var slides = main.querySelectorAll(".slide-container");
    var total = slides.length;
    var current = 0;

    function goToSlide(index) {
        if (index < 0 || index >= total) return;
        current = index;
        main.style.transform = "translateX(-" + (current * 100) + "vw)";
    }

    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
            case " ":
            case "PageDown":
                e.preventDefault();
                goToSlide(current + 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
            case "PageUp":
                e.preventDefault();
                goToSlide(current - 1);
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

    goToSlide(0);
})();
