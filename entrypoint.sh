#!/bin/sh
set -e  # Exit on error

# Start local blockchain in the background
echo "Starting local blockchain..."
yarn chain &

# Wait for the blockchain to be ready on 0.0.0.0:8545
BLOCKCHAIN_PORT=8545
BLOCKCHAIN_HOST="0.0.0.0"

echo "Waiting for blockchain to be ready at ${BLOCKCHAIN_HOST}:${BLOCKCHAIN_PORT}..."

# Loop until the port is open
while ! nc -z ${BLOCKCHAIN_HOST} ${BLOCKCHAIN_PORT}; do   
  echo "Still waiting for blockchain to be ready..."
  sleep 1
done

echo "Blockchain is ready."

# Deploy smart contract
echo "Deploying smart contracts..."
yarn deploy

# Start the NextJS application
echo "Starting the Next.js application..."
yarn start
