#!/bin/bash
# OpenSEO Import Migration Script
# Imports exported data into self-hosted instance

set -e

SELF_HOSTED_URL="${SELF_HOSTED_URL:-http://localhost:3000}"
EXPORT_DIR="${EXPORT_DIR:-./migration-export}"
MANIFEST=$(ls -t "$EXPORT_DIR"/manifest_*.json 2>/dev/null | head -1)

if [ -z "$MANIFEST" ]; then
    echo "Error: No migration manifest found in $EXPORT_DIR"
    echo "Please run migrate-to-selfhosted.sh first"
    exit 1
fi

TIMESTAMP=$(basename "$MANIFEST" | sed 's/manifest_//' | sed 's/.json//')

echo "========================================"
echo "OpenSEO: Import Migration"
echo "========================================"
echo "Using manifest: $MANIFEST"

echo "[1/5] Importing sites..."
curl -s -X POST "$SELF_HOSTED_URL/api/import/sites" \
  -H "Content-Type: application/json" \
  -d @"$EXPORT_DIR/sites_$TIMESTAMP.json" | jq '.'

echo "[2/5] Importing keywords..."
curl -s -X POST "$SELF_HOSTED_URL/api/import/keywords" \
  -H "Content-Type: application/json" \
  -d @"$EXPORT_DIR/keywords_$TIMESTAMP.json" | jq '.'

echo "[3/5] Importing audits..."
curl -s -X POST "$SELF_HOSTED_URL/api/import/audits" \
  -H "Content-Type: application/json" \
  -d @"$EXPORT_DIR/audits_$TIMESTAMP.json" | jq '.'

echo "[4/5] Importing backlinks..."
curl -s -X POST "$SELF_HOSTED_URL/api/import/backlinks" \
  -H "Content-Type: application/json" \
  -d @"$EXPORT_DIR/backlinks_$TIMESTAMP.json" | jq '.'

echo "[5/5] Importing reports..."
curl -s -X POST "$SELF_HOSTED_URL/api/import/reports" \
  -H "Content-Type: application/json" \
  -d @"$EXPORT_DIR/reports_$TIMESTAMP.json" | jq '.'

echo ""
echo "========================================"
echo "Import complete!"
echo "========================================"
