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

    # Copy the local env file for foundry if it doens't exist
    cp -u packages/foundry/.env.example packages/foundry/.env

    # Build and run the docker-compose services
    echo "Building and starting services with docker-compose..."
    docker compose up --build
else
    echo "Docker system prune cancelled."
fi
