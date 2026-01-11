#!/bin/bash
# Simli Avatar Setup Script
# Creates avatar from extracted video frame and configures Vercel

echo "=== Simli Avatar Setup ==="
echo ""

# Check for API key
if [ -z "$1" ]; then
    echo "Usage: ./setup-simli-avatar.sh YOUR_SIMLI_API_KEY"
    echo ""
    echo "Get your API key from: https://app.simli.com/apikey"
    exit 1
fi

SIMLI_API_KEY="$1"
IMAGE_PATH="C:/Users/micha/michaelcrowe-3d/public/michael-frame-2min.jpg"

echo "1. Creating avatar from: $IMAGE_PATH"
echo ""

# Create avatar via API
RESPONSE=$(curl -s --request POST \
  --url "https://api.simli.ai/generateFaceID?face_name=michael_crowe" \
  --header "Content-Type: multipart/form-data" \
  --header "api-key: $SIMLI_API_KEY" \
  --form "image=@$IMAGE_PATH")

echo "API Response: $RESPONSE"
echo ""

# Extract face_id from response (assumes JSON response with face_id field)
FACE_ID=$(echo $RESPONSE | grep -o '"face_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$FACE_ID" ]; then
    echo "Could not extract face_id. Full response:"
    echo "$RESPONSE"
    echo ""
    echo "Avatar creation may take a few hours. Check https://app.simli.com for your face_id"
    exit 1
fi

echo "2. Face ID created: $FACE_ID"
echo ""

echo "3. Adding environment variables to Vercel..."
cd /c/Users/micha/michaelcrowe-3d

# Add to Vercel
echo "$SIMLI_API_KEY" | vercel env add NEXT_PUBLIC_SIMLI_API_KEY production --yes
echo "$FACE_ID" | vercel env add NEXT_PUBLIC_SIMLI_FACE_ID production --yes

echo ""
echo "4. Redeploying to production..."
vercel --prod

echo ""
echo "=== Setup Complete ==="
echo "API Key: $SIMLI_API_KEY"
echo "Face ID: $FACE_ID"
echo ""
echo "Your avatar should now be live at https://www.michaelcrowe.ai"
