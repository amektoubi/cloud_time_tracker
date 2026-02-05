#!/bin/bash

# Stop execution on any error
set -e

# --- 0. Configure Android SDK Environment ---
# Capacitor and Gradle need to know where the SDK is.
# If it's not already set in your shell, we try to find it.

if [ -z "$ANDROID_SDK_ROOT" ]; then
  if [ -d "$HOME/Android/Sdk" ]; then
    # Standard Linux Path
    export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
  elif [ -d "$HOME/Library/Android/sdk" ]; then
    # Standard macOS Path
    export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
  else
    echo "❌ Error: ANDROID_SDK_ROOT is not set and standard paths were not found."
    echo "   Please install Android Studio or set the path manually."
    exit 1
  fi
fi

# Many tools use ANDROID_HOME interchangeably
export ANDROID_HOME="$ANDROID_SDK_ROOT"

echo "📱 Using Android SDK at: $ANDROID_SDK_ROOT"

# --- 1. Detect Local IP (Critical for Physical Devices) ---
# This tries to find your computer's LAN IP to point the App's API calls to it.
# If detection fails, it defaults to localhost (which will likely fail on physical device).
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  LOCAL_IP=$(ipconfig getifaddr en0)
else
  # Linux (Devbox standard)
  LOCAL_IP=$(hostname -I | awk '{print $1}')
fi

if [ -z "$LOCAL_IP" ]; then
  echo "⚠️  Could not detect Local IP. Defaulting to localhost."
  echo "   (If using a physical device, API calls might fail)"
  API_URL="http://localhost:8080"
else
  API_URL="http://${LOCAL_IP}:8080"
  echo "✅ Detected Host IP: ${LOCAL_IP}"
  echo "   Pointing Android App to Backend at: ${API_URL}"
fi

# --- 2. Create Temporary Environment File ---
# We create a .env.local temporarily to force Vite to build with this IP
echo "VITE_API_URL=${API_URL}" >.env.local

echo "------------------------------------------------"
echo "🛠️  1/3 Building React Application..."
echo "------------------------------------------------"
# Build the TypeScript/React code to /dist
npm run build

echo "------------------------------------------------"
echo "🔄 2/3 Syncing with Capacitor..."
echo "------------------------------------------------"
# Copy /dist to /android/app/src/main/assets/public
npx cap sync android

echo "------------------------------------------------"
echo "🚀 3/3 Launching on Device..."
echo "------------------------------------------------"
# Clean up the temp env file before running so it doesn't persist accidentally
rm .env.local

# This command builds the APK, installs it, and launches the Activity
npx cap run android

echo "------------------------------------------------"
echo "🎉 App launched! Check your device."
echo "   Backend should be running on: ${API_URL}"
echo "------------------------------------------------"
