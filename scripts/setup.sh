#!/usr/bin/env bash
# Setup script for Codex/CI
set -euo pipefail
npm ci --no-audit --progress=false --prefer-offline
