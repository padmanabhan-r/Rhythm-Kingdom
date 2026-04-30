#!/bin/bash
cd "$(dirname "$0")"
echo "Deploying Rhythm Kingdom to Cloudflare Pages..."
wrangler pages deploy . --project-name rhythm-kingdom --branch main --commit-dirty=true
