#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install: https://cli.github.com/"
  exit 1
fi

if [ "$#" -lt 1 ] || [ "$#" -gt 4 ]; then
  echo "Usage:"
  echo "  $0 <owner/repo> [ec2_host] [ec2_user] [pem_file]"
  echo ""
  echo "Defaults:"
  echo "  ec2_host = 18.117.134.64"
  echo "  ec2_user = ec2-user"
  echo "  pem_file = /Users/cjl/Downloads/ec2-key.pem"
  exit 1
fi

REPO="$1"
EC2_HOST="${2:-18.117.134.64}"
EC2_USER="${3:-ec2-user}"
PEM_FILE="${4:-/Users/cjl/Downloads/ec2-key.pem}"

if [ ! -f "$PEM_FILE" ]; then
  echo "PEM file not found: $PEM_FILE"
  exit 1
fi

gh secret set EC2_HOST --repo "$REPO" --body "$EC2_HOST"
gh secret set EC2_USER --repo "$REPO" --body "$EC2_USER"
gh secret set EC2_SSH_KEY --repo "$REPO" < "$PEM_FILE"

echo "Done. Secrets set for $REPO:"
gh secret list --repo "$REPO" | rg '^EC2_(HOST|USER|SSH_KEY)\b' || true
