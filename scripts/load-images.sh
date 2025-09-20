#!/bin/bash

# Script to download and load Docker images from GitHub Actions artifacts
echo "=== GloSleep Docker Image Loader ==="

# Create temporary directory
mkdir -p /tmp/glosleep-images
cd /tmp/glosleep-images

echo "Please download the latest artifacts from GitHub Actions:"
echo "1. Go to https://github.com/anshumandash1506/glosleep-platform/actions"
echo "2. Click on the latest workflow run"
echo "3. Download the following artifacts:"
echo "   - auth-service-image"
echo "   - inventory-service-image"
echo "   - order-service-image" 
echo "   - procurement-service-image"
echo "   - analytics-service-image"
echo ""
echo "Place all downloaded ZIP files in /tmp/glosleep-images/"
echo "Press Enter when ready..."
read

# Extract and load each image
for service in auth inventory order procurement analytics; do
    echo "Processing $service-service..."
    
    # Unzip the artifact
    unzip -o "${service}-service-image.zip"
    
    # Find the .tar file and load it
    tar_file=$(find . -name "*.tar" | head -1)
    if [ -f "$tar_file" ]; then
        docker load -i "$tar_file"
        
        # Tag with latest
        docker tag "${service}-service:${GITHUB_SHA}" "${service}-service:latest"
        
        # Load into Kind
        kind load docker-image "${service}-service:latest"
        
        echo "✓ ${service}-service loaded successfully"
    else
        echo "✗ Failed to find .tar file for ${service}-service"
    fi
done

echo ""
echo "=== Image Loading Complete ==="
echo "You can now deploy using: kubectl apply -f k8s/"