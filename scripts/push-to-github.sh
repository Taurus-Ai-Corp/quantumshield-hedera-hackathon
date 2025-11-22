#!/bin/bash

# QuantumShield - Push to GitHub Script
# This script will initialize git and push to Taurus-Ai-Corp organization

set -e

PROJECT_DIR="/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/QUANTUMSHIELD-HEDERA-HACKATHON"
REPO_NAME="quantumshield-hedera-hackathon"
ORG_NAME="Taurus-Ai-Corp"
GITHUB_URL="https://github.com/${ORG_NAME}/${REPO_NAME}"

cd "$PROJECT_DIR"

echo "🚀 QuantumShield - GitHub Push Script"
echo "======================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if already a git repo
if [ -d ".git" ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
else
    echo "💾 Committing files..."
    git commit -m "Initial commit: QuantumShield - Hedera Hackathon 2025 Submission

- World's first quantum-resistant NFT marketplace
- ML-DSA signatures (NIST FIPS 204 compliant)
- Verifiable AI agents with quantum signatures
- NVIDIA quantum computing integration
- Cross-chain quantum bridge
- Production-ready implementation

Hackathon Tracks: AI & Agents, DeFi & Tokenization, Open Track, Legacy Builders"
    echo "✅ Files committed"
fi

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo ""
    echo "✅ Remote 'origin' already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Current remote: $REMOTE_URL"
else
    echo ""
    echo "🔗 Setting up GitHub remote..."
    echo ""
    echo "⚠️  IMPORTANT: You need to create the repository on GitHub first!"
    echo ""
    echo "Option 1: Create via GitHub Web UI"
    echo "   1. Go to: https://github.com/organizations/${ORG_NAME}/repositories/new"
    echo "   2. Repository name: ${REPO_NAME}"
    echo "   3. Description: World's first quantum-resistant NFT marketplace on Hedera"
    echo "   4. Visibility: Public"
    echo "   5. DO NOT initialize with README, .gitignore, or license"
    echo "   6. Click 'Create repository'"
    echo ""
    echo "Option 2: Use GitHub CLI (if installed)"
    echo "   Run: gh repo create ${ORG_NAME}/${REPO_NAME} --public --source=. --remote=origin --push"
    echo ""
    read -p "Press Enter after you've created the repository on GitHub..."
    
    # Set remote
    git remote add origin "https://github.com/${ORG_NAME}/${REPO_NAME}.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/${ORG_NAME}/${REPO_NAME}.git"
    echo "✅ Remote configured: ${GITHUB_URL}"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
echo "   Repository: ${GITHUB_URL}"
echo "   Branch: ${CURRENT_BRANCH}"
echo ""

# Try to push
if git push -u origin "${CURRENT_BRANCH}" 2>&1; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Repository URL: ${GITHUB_URL}"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Verify files on GitHub: ${GITHUB_URL}"
    echo "   2. Enable GitHub Pages for demo (Settings > Pages > Source: /demos)"
    echo "   3. Copy repository URL for hackathon submission"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist on GitHub - create it first"
    echo "   2. Authentication required - use GitHub CLI or SSH keys"
    echo "   3. Permission denied - check org permissions"
    echo ""
    echo "💡 Try using GitHub CLI:"
    echo "   gh auth login"
    echo "   gh repo create ${ORG_NAME}/${REPO_NAME} --public --source=. --remote=origin --push"
    echo ""
    echo "Or use SSH:"
    echo "   git remote set-url origin git@github.com:${ORG_NAME}/${REPO_NAME}.git"
    echo "   git push -u origin ${CURRENT_BRANCH}"
    echo ""
fi

echo "✨ Done!"
