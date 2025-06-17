#!/bin/bash

# Install Chromium and dependencies
sudo apt-get update
# sudo apt-get install -y chromium

# Install Playwright browsers
npx playwright install --with-deps chromium

echo "Dev container setup complete!"
