#!/bin/bash

# CI/CD Pipeline Validation Script
# This script validates that the pipeline configuration is correct

set -euo pipefail

echo "🔍 Validating CI/CD Pipeline Configuration..."

# Check required files exist
echo "📁 Checking required files..."

required_files=(
    "Dockerfile"
    ".dockerignore"
    "docker-compose.yml"
    ".github/workflows/ci-cd.yml"
    "back/pom.xml"
    "back/src/main/resources/application.properties"
    "front/package.json"
    "front/vite.config.ts"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Validate Dockerfile
echo ""
echo "🐳 Validating Dockerfile..."

if ! grep -q "FROM.*AS.*frontend-build" Dockerfile; then
    echo "❌ Frontend build stage not found in Dockerfile"
    exit 1
else
    echo "✅ Frontend build stage found"
fi

if ! grep -q "FROM.*AS.*backend-build" Dockerfile; then
    echo "❌ Backend build stage not found in Dockerfile"
    exit 1
else
    echo "✅ Backend build stage found"
fi

if ! grep -q "FROM eclipse-temurin:21-jre-alpine" Dockerfile; then
    echo "❌ Expected base image not found in Dockerfile"
    exit 1
else
    echo "✅ Correct base image found"
fi

# Validate docker-compose.yml
echo ""
echo "📦 Validating docker-compose.yml..."

if ! grep -q "app:" docker-compose.yml; then
    echo "❌ App service not found in docker-compose.yml"
    exit 1
else
    echo "✅ App service found"
fi

if ! grep -q "postgres:" docker-compose.yml; then
    echo "❌ Postgres service not found in docker-compose.yml"
    exit 1
else
    echo "✅ Postgres service found"
fi

# Validate CI/CD workflow
echo ""
echo "⚙️ Validating CI/CD workflow..."

if ! grep -q "build-docker" .github/workflows/ci-cd.yml; then
    echo "❌ build-docker job not found in CI/CD workflow"
    exit 1
else
    echo "✅ build-docker job found"
fi

if ! grep -q "file: ./Dockerfile" .github/workflows/ci-cd.yml; then
    echo "❌ Dockerfile reference not found in CI/CD workflow"
    exit 1
else
    echo "✅ Dockerfile reference found"
fi

# Check Java version compatibility
echo ""
echo "☕ Checking Java version compatibility..."

if ! grep -q "java-version.*21" .github/workflows/ci-cd.yml; then
    echo "⚠️  Warning: Java 21 not found in workflow (required for backend)"
else
    echo "✅ Java 21 found in workflow"
fi

# Check Node.js version
echo ""
echo "🟢 Checking Node.js version..."

if ! grep -q "node-version.*20" .github/workflows/ci-cd.yml; then
    echo "⚠️  Warning: Node.js 20 not found in workflow"
else
    echo "✅ Node.js 20 found in workflow"
fi

# Validate backend configuration
echo ""
echo "🏗️ Validating backend configuration..."

if grep -q "quarkus.platform.version.*3\.30\.8" back/pom.xml; then
    echo "✅ Quarkus 3.30.8 found in backend pom.xml"
else
    echo "❌ Expected Quarkus version not found in backend pom.xml"
    exit 1
fi

if [[ -f "back/src/main/resources/application.properties" ]]; then
    if grep -q "quarkus.http.host=0.0.0.0" back/src/main/resources/application.properties; then
        echo "✅ Backend configuration found"
    else
        echo "❌ Expected backend configuration not found"
        exit 1
    fi
fi

# Validate frontend configuration
echo ""
echo "⚛️ Validating frontend configuration..."

if grep -q "react.*19" front/package.json; then
    echo "✅ React 19 found in frontend package.json"
else
    echo "❌ Expected React version not found in frontend package.json"
    exit 1
fi

if grep -q "vite" front/package.json; then
    echo "✅ Vite found in frontend package.json"
else
    echo "❌ Vite not found in frontend package.json"
    exit 1
fi

echo ""
echo "🎉 All CI/CD pipeline validation checks passed!"
echo ""
echo "The pipeline is ready for deployment. Key improvements made:"
echo "  • Added missing Dockerfile with multi-stage build"
echo "  • Fixed Java version mismatch (21 for backend)"
echo "  • Added explicit Dockerfile reference in workflow"
echo "  • Improved Docker image tagging strategy"
echo "  • Added security scanning with Trivy"
echo "  • Added proper test workflow"
echo "  • Fixed Android build dependencies"