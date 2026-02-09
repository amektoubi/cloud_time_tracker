#!/bin/bash

# Docker Build Validation Script for Cloud Time Tracker
set -euo pipefail

echo "🔍 Validating Cloud Time Tracker Docker configuration..."

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
fi

echo "✅ Dockerfile found"

# Check if docker-compose.yml exists and has app service
if ! grep -q "app:" docker-compose.yml; then
    echo "❌ 'app' service not found in docker-compose.yml"
    exit 1
fi

echo "✅ App service found in docker-compose.yml"

# Check if frontend directory exists
if [ ! -d "front" ]; then
    echo "❌ Frontend directory not found"
    exit 1
fi

echo "✅ Frontend directory found"

# Check if backend directory exists
if [ ! -d "back" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

echo "✅ Backend directory found"

# Check if backend has pom.xml
if [ ! -f "back/pom.xml" ]; then
    echo "❌ Backend pom.xml not found"
    exit 1
fi

echo "✅ Backend pom.xml found"

# Check if frontend has package.json
if [ ! -f "front/package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

echo "✅ Frontend package.json found"

# Check if application.properties exists
if [ ! -f "back/src/main/resources/application.properties" ]; then
    echo "❌ Backend application.properties not found"
    exit 1
fi

echo "✅ Backend application.properties found"

# Check Dockerfile syntax (basic validation)
if ! grep -q "FROM eclipse-temurin:21-jre-alpine" Dockerfile; then
    echo "⚠️  Warning: Expected base image 'eclipse-temurin:21-jre-alpine' not found"
else
    echo "✅ Correct base image found in Dockerfile"
fi

# Check for multi-stage build
if ! grep -q "FROM.*AS" Dockerfile; then
    echo "⚠️  Warning: Multi-stage build not detected"
else
    echo "✅ Multi-stage build detected"
fi

echo ""
echo "🎉 All validation checks passed! The Docker configuration should work."
echo ""
echo "To build and run locally:"
echo "  docker-compose up --build"
echo ""
echo "To test the application:"
echo "  curl http://localhost:8080/persons"
echo "  curl http://localhost:8080/health"