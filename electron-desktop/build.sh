#!/bin/bash
echo "========================================"
echo "VaultHeir Electron Build Script"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/4] Installing Electron dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "[2/4] Building Next.js application..."
cd ..
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Next.js build failed!"
    exit 1
fi

cd electron-desktop

echo ""
echo "[3/4] Building application..."

# Detect platform and build
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building for macOS..."
    npm run build:mac
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Building for Linux..."
    npm run build:linux
else
    echo "Building for current platform..."
    npm run build
fi

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Electron build failed!"
    exit 1
fi

echo ""
echo "[4/4] Build complete!"
echo ""
echo "========================================"
echo "SUCCESS! Built files are in: dist/"
echo "========================================"
ls -la dist/
