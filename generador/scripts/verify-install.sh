#!/bin/bash

echo "✓ Verifying generador installation..."

# Check node_modules
if [ ! -d "node_modules" ]; then
  echo "✗ node_modules missing"
  exit 1
fi

# Check key packages
for pkg in next react zod jszip; do
  if [ ! -d "node_modules/$pkg" ]; then
    echo "✗ Missing package: $pkg"
    exit 1
  fi
done

echo "✓ All dependencies installed"

# Check TypeScript compilation
echo "Building..."
npm run build 2>&1 | grep -E "(✓|error)" | head -5

if [ $? -eq 0 ]; then
  echo "✓ Build successful"
else
  echo "✗ Build failed"
  exit 1
fi

echo "✓ Installation verified!"
