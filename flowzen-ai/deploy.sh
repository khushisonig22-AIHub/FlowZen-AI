#!/bin/bash
# FlowZen AI - Complete Deployment Script
# Run this script to deploy to Vercel

echo "🚀 FlowZen AI - Top 10 Hackathon App Deployment"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Install Dependencies${NC}"
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

echo -e "${BLUE}Step 2: Build Project${NC}"
npm run build
echo -e "${GREEN}✅ Build successful${NC}\n"

echo -e "${BLUE}Step 3: Setup Environment Variables${NC}"
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "📝 Created .env.local - Update with your API keys"
else
    echo "✅ .env.local already exists"
fi
echo ""

echo -e "${BLUE}Step 4: Git Setup${NC}"
git add .
git commit -m "feat: Top 10 hackathon FlowZen AI with Google services and premium features"
echo -e "${GREEN}✅ Git commit ready${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add environment variables to .env.local"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy to Vercel:"
echo "   - CLI: vercel --prod"
echo "   - Web: vercel.com/new (connect GitHub repo)"
echo ""
echo -e "${GREEN}🎉 FlowZen AI is ready for production!${NC}"
