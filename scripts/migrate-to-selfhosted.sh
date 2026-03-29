#!/bin/bash
# OpenSEO Migration Script: Cloud to Self-Hosted
# This script exports data from cloud and imports into self-hosted

set -e

# Configuration
CLOUD_API_URL="${CLOUD_API_URL:-https://api.openseo.io}"
SELF_HOSTED_URL="${SELF_HOSTED_URL:-http://localhost:3000}"
EXPORT_DIR="${EXPORT_DIR:-./migration-export}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "========================================"
echo "OpenSEO: Cloud to Self-Hosted Migration"
echo "========================================"

# Create export directory
mkdir -p "$EXPORT_DIR"

echo "[1/6] Exporting sites..."
curl -s "$CLOUD_API_URL/api/sites" -H "Authorization: Bearer $CLOUD_API_KEY" | \
  jq '.' > "$EXPORT_DIR/sites_$TIMESTAMP.json"
echo "   Sites exported: $EXPORT_DIR/sites_$TIMESTAMP.json"

echo "[2/6] Exporting keywords..."
curl -s "$CLOUD_API_URL/api/keywords" -H "Authorization: Bearer $CLOUD_API_KEY" | \
  jq '.' > "$EXPORT_DIR/keywords_$TIMESTAMP.json"
echo "   Keywords exported: $EXPORT_DIR/keywords_$TIMESTAMP.json"

echo "[3/6] Exporting audits..."
curl -s "$CLOUD_API_URL/api/audits" -H "Authorization: Bearer $CLOUD_API_KEY" | \
  jq '.' > "$EXPORT_DIR/audits_$TIMESTAMP.json"
echo "   Audits exported: $EXPORT_DIR/audits_$TIMESTAMP.json"

echo "[4/6] Exporting backlinks..."
curl -s "$CLOUD_API_URL/api/backlinks" -H "Authorization: Bearer $CLOUD_API_KEY" | \
  jq '.' > "$EXPORT_DIR/backlinks_$TIMESTAMP.json"
echo "   Backlinks exported: $EXPORT_DIR/backlinks_$TIMESTAMP.json"

echo "[5/6] Exporting reports..."
curl -s "$CLOUD_API_URL/api/reports" -H "Authorization: Bearer $CLOUD_API_KEY" | \
  jq '.' > "$EXPORT_DIR/reports_$TIMESTAMP.json"
echo "   Reports exported: $EXPORT_DIR/reports_$TIMESTAMP.json"

echo "[6/6] Creating backup manifest..."
cat > "$EXPORT_DIR/manifest_$TIMESTAMP.json" <<-MANIFEST
{
  "exported_at": "$(date -Iseconds)",
  "cloud_url": "$CLOUD_API_URL",
  "version": "1.0.0",
  "files": [
    "sites_$TIMESTAMP.json",
    "keywords_$TIMESTAMP.json",
    "audits_$TIMESTAMP.json",
    "backlinks_$TIMESTAMP.json",
    "reports_$TIMESTAMP.json"
  ]
}
MANIFEST

echo ""
echo "========================================"
echo "Export complete! Files saved to: $EXPORT_DIR"
echo ""
echo "To import into self-hosted:"
echo "  1. Copy $EXPORT_DIR to your server"
echo "  2. Run: ./import-migration.sh"
echo "========================================"
