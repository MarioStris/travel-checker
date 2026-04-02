#!/usr/bin/env bash
# =============================================================================
# Travel Checker — API Health Check Script
#
# Usage:
#   ./infra/monitoring/health-check.sh [BASE_URL]
#
# Examples:
#   ./infra/monitoring/health-check.sh                          # local
#   ./infra/monitoring/health-check.sh https://api.example.com  # remote
#
# Exit codes:
#   0 — all checks passed
#   1 — one or more checks failed
# =============================================================================

set -euo pipefail

BASE_URL="${1:-http://localhost:3001}"
TIMEOUT=10
FAILURES=0

# Terminal colours
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass()  { echo -e "${GREEN}[PASS]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; FAILURES=$((FAILURES + 1)); }
info()  { echo -e "${YELLOW}[INFO]${NC} $1"; }

# ---------------------------------------------------------------------------
# Helper: HTTP GET with timeout
# ---------------------------------------------------------------------------
http_get() {
  curl -sf --max-time "$TIMEOUT" "$1" 2>/dev/null
}

http_status() {
  curl -so /dev/null --max-time "$TIMEOUT" -w "%{http_code}" "$1" 2>/dev/null || echo "000"
}

# ---------------------------------------------------------------------------
# Check 1: Basic liveness (/health)
# ---------------------------------------------------------------------------
info "Checking liveness endpoint..."
STATUS=$(http_status "${BASE_URL}/health")
if [ "$STATUS" = "200" ]; then
  BODY=$(http_get "${BASE_URL}/health")
  SERVICE=$(echo "$BODY" | grep -o '"service":"[^"]*"' | cut -d'"' -f4 || echo "unknown")
  pass "GET /health — HTTP 200 (service: ${SERVICE})"
else
  fail "GET /health — HTTP ${STATUS} (expected 200)"
fi

# ---------------------------------------------------------------------------
# Check 2: Response time (< 500ms)
# ---------------------------------------------------------------------------
info "Checking response latency..."
LATENCY=$(curl -so /dev/null --max-time "$TIMEOUT" \
  -w "%{time_total}" "${BASE_URL}/health" 2>/dev/null || echo "999")
LATENCY_MS=$(echo "$LATENCY * 1000" | bc 2>/dev/null || echo "999")
LATENCY_INT=${LATENCY_MS%.*}

if [ "${LATENCY_INT:-999}" -lt 500 ]; then
  pass "Latency — ${LATENCY_INT}ms (threshold: 500ms)"
else
  fail "Latency — ${LATENCY_INT}ms exceeds 500ms threshold"
fi

# ---------------------------------------------------------------------------
# Check 3: 404 handler (route not found returns JSON)
# ---------------------------------------------------------------------------
info "Checking 404 handler..."
STATUS=$(http_status "${BASE_URL}/api/__nonexistent__")
if [ "$STATUS" = "404" ]; then
  pass "GET /api/__nonexistent__ — HTTP 404 (expected)"
else
  fail "GET /api/__nonexistent__ — HTTP ${STATUS} (expected 404)"
fi

# ---------------------------------------------------------------------------
# Check 4: CORS headers present
# ---------------------------------------------------------------------------
info "Checking CORS headers..."
CORS_HEADER=$(curl -sf --max-time "$TIMEOUT" -I \
  -H "Origin: http://localhost:8081" \
  "${BASE_URL}/health" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_HEADER" ]; then
  pass "CORS headers present"
else
  fail "CORS headers missing on /health"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo -e "${GREEN}All health checks passed.${NC}"
  exit 0
else
  echo -e "${RED}${FAILURES} health check(s) failed.${NC}"
  exit 1
fi
