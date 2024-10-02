#!/bin/bash


# Ask for confirmation before pruning Docker system
echo "This will remove all stopped containers, unused networks, dangling images, and build caches."
read -p "Are you sure you want to continue? (y/n): " -r
echo    # Move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Prune the Docker system
    echo "Running Docker system prune..."
    docker system prune -f

    # Build and run the docker-compose services
    echo "Building and starting services with docker-compose..."
    docker compose -f docker-compose.dev.yml up --build
else
    echo "Docker system prune cancelled."
fi