#!/bin/bash
echo "=========================================="
echo "  MailGenie Backend Launcher"
echo "=========================================="
echo ""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/email-writer-s"
echo "Running mvn spring-boot:run inside email-writer-s..."
mvn spring-boot:run
