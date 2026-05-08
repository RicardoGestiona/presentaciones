#!/bin/bash
set -e

echo "Cleaning environment..."
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY

echo "Configuring npm..."
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/

echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps

echo "✓ Installation complete!"
ls -lh node_modules | head -5
