# CI/CD Pipeline

## Overview
This project uses GitHub Actions to build Docker images for all services. Images are built on every push to the `develop` or `main` branches.

## Workflow
1. Code is pushed to GitHub
2. GitHub Actions automatically triggers the build process
3. Docker images are built for all 5 services
4. Images are saved as artifacts that can be downloaded

## Local Deployment Process
1. Download artifacts from the latest GitHub Actions run
2. Run the image loading script:
   ```bash
   chmod +x scripts/load-images.sh
   scripts/load-images.sh