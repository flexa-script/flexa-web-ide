#!/bin/bash

echo "Building and starting Flexa Web containers..."
docker compose -f docker-compose.yml up --build -d

echo "Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment complete."
