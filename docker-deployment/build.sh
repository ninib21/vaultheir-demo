#!/bin/bash
echo "========================================"
echo "VaultHeir Docker Build Script"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/3] Building Docker images..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Docker build failed!"
    exit 1
fi

echo ""
echo "[2/3] Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to start containers!"
    exit 1
fi

echo ""
echo "[3/3] Checking container status..."
docker-compose ps

echo ""
echo "========================================"
echo "SUCCESS! VaultHeir is now running:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "========================================"
echo ""
echo "Commands:"
echo "  Stop:    docker-compose down"
echo "  Logs:    docker-compose logs -f"
echo "  Restart: docker-compose restart"
