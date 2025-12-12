#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Building application..."
npx vite build

echo "Build completed successfully!"