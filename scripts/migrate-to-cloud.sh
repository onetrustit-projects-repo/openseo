#!/bin/bash
# OpenSEO Migration Script: Self-Hosted to Cloud
# This script exports data from self-hosted and imports into cloud

set -e

# Configuration
SELF_HOSTED_URL="${SELF_HOSTED_URL:-http://localhost:3000}"
CLOUD_API_URL="${CLOUD_API_URL:-https://api.openseo.io}"
EXPORT_DIR="${EXPORT_DIR:-./migration-export}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "========================================"
echo "OpenSEO: Self-Hosted to Cloud Migration"
echo "========================================"

# Create export directory
mkdir -p "$EXPORT_DIR"

echo "[1/5] Exporting sites..."
curl -s "$SELF_HOSTED_URL/api/sites" | jq '.' > "$EXPORT_DIR/sites_$TIMESTAMP.json"
echo "   Sites exported"

echo "[2/5] Exporting keywords..."
curl -s "$SELF_HOSTED_URL/api/keywords" | jq '.' > "$EXPORT_DIR/keywords_$TIMESTAMP.json"
echo "   Keywords exported"

echo "[3/5] Exporting audits..."
curl -s "$SELF_HOSTED_URL/api/audits" | jq '.' > "$EXPORT_DIR/audits_$TIMESTAMP.json"
echo "   Audits exported"

echo "[4/5] Exporting backlinks..."
curl -s "$SELF_HOSTED_URL/api/backlinks" | jq '.' > "$EXPORT_DIR/backlinks_$TIMESTAMP.json"
echo "   Backlinks exported"

echo "[5/5] Uploading to cloud..."
for file in "$EXPORT_DIR"/*_"$TIMESTAMP".json; do
  TYPE=$(basename "$file" | cut -d'_' -f1)
  echo "   Uploading $TYPE..."
  curl -s -X POST "$CLOUD_API_URL/api/import/$TYPE" \
    -H "Authorization: Bearer $CLOUD_API_KEY" \
    -H "Content-Type: application/json" \
    -d @"$file"
done

echo ""
echo "========================================"
echo "Migration to cloud complete!"
echo "========================================"
