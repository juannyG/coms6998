#!/bin/bash

echo "Deploying the following contracts to the local chain:"
echo ""
ls ../packages/foundry/contracts

read -p "Are you sure you want to continue? (y/n): " -r
echo    # Move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker exec -ti coms6998_yarn-chain_1 forge clean
    docker exec -ti coms6998_yarn-chain_1 yarn deploy
else
    echo "Local deployment aborted."
fi
