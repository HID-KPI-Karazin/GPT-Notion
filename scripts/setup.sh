#!/usr/bin/env bash
# Setup script for Codex/CI
set -euo pipefail
NPM_CACHE_DIR="${NPM_CACHE_DIR:-$HOME/.npm}"
mkdir -p "$NPM_CACHE_DIR"
npm config set cache "$NPM_CACHE_DIR" --global
npm ci --no-audit --progress=false --prefer-offline
