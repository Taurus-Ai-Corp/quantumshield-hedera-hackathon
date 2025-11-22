# 🚀 GitHub Setup Guide - QuantumShield

## Current Status

**❌ NOT PUSHED TO GITHUB YET**

All files are currently **local only** on your machine at:
```
/Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/QUANTUMSHIELD-HEDERA-HACKATHON/
```

## 🎯 Your GitHub Organization

Based on [your GitHub org](https://github.com/orgs/Taurus-Ai-Corp/repositories), you have:
- **Organization:** `Taurus-Ai-Corp`
- **Current Repos:** 1 (propertyvet-background-system)
- **Target Repo:** `quantumshield-hedera-hackathon` (to be created)

## 📋 Quick Setup Steps

### Option 1: Automated Script (Recommended)

```bash
cd /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/QUANTUMSHIELD-HEDERA-HACKATHON
./scripts/push-to-github.sh
```

The script will:
1. Initialize git repository
2. Add all files
3. Create initial commit
4. Guide you to create GitHub repo
5. Push to GitHub

### Option 2: Manual Setup

#### Step 1: Initialize Git
```bash
cd /Users/user/Documents/TAURUS-LOCAL-WORKSPACE/active-projects/QUANTUMSHIELD-HEDERA-HACKATHON
git init
git add .
git commit -m "Initial commit: QuantumShield - Hedera Hackathon 2025 Submission"
```

#### Step 2: Create Repository on GitHub

**Via Web UI:**
1. Go to: https://github.com/organizations/Taurus-Ai-Corp/repositories/new
2. Repository name: `quantumshield-hedera-hackathon`
3. Description: `World's first quantum-resistant NFT marketplace on Hedera Hashgraph`
4. Visibility: **Public** (required for hackathon)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Via GitHub CLI:**
```bash
gh repo create Taurus-Ai-Corp/quantumshield-hedera-hackathon \
  --public \
  --description "World's first quantum-resistant NFT marketplace on Hedera Hashgraph" \
  --source=. \
  --remote=origin \
  --push
```

#### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/Taurus-Ai-Corp/quantumshield-hedera-hackathon.git
git branch -M main
git push -u origin main
```

## 🔐 Authentication

If you get authentication errors:

### Option A: GitHub CLI (Easiest)
```bash
gh auth login
# Follow prompts to authenticate
```

### Option B: Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `write:org`
4. Use token as password when pushing

### Option C: SSH Keys
```bash
# Use SSH URL instead
git remote set-url origin git@github.com:Taurus-Ai-Corp/quantumshield-hedera-hackathon.git
```

## ✅ After Pushing

### 1. Verify Files on GitHub
Visit: https://github.com/Taurus-Ai-Corp/quantumshield-hedera-hackathon

### 2. Enable GitHub Pages (for Demo)
1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: `main` / `demos` folder
4. Save
5. Demo will be available at: `https://taurus-ai-corp.github.io/quantumshield-hedera-hackathon/`

### 3. Update Submission Form
- **GitHub Repo URL:** `https://github.com/Taurus-Ai-Corp/quantumshield-hedera-hackathon`
- **Demo URL:** `https://taurus-ai-corp.github.io/quantumshield-hedera-hackathon/` (after Pages setup)

## 📊 Repository Structure on GitHub

After pushing, your GitHub repo will have:

```
quantumshield-hedera-hackathon/
├── README.md                    ✅
├── LICENSE                      ✅
├── package.json                 ✅
├── src/                         ✅
│   ├── quantum-crypto/
│   ├── hedera/
│   ├── ai-agents/
│   └── ...
├── demos/                       ✅
│   └── index.html              ✅
├── contracts/                   ✅
├── submission/                  ✅
│   ├── PROJECT_DETAILS.md     ✅
│   ├── PITCH_DECK.md          ✅
│   └── ...
└── scripts/                     ✅
```

## 🆘 Troubleshooting

### "Repository not found"
- Make sure you created the repo on GitHub first
- Check org name: `Taurus-Ai-Corp` (case-sensitive)

### "Permission denied"
- Check you have write access to the org
- Use GitHub CLI: `gh auth login`
- Or use Personal Access Token

### "Authentication failed"
- Use GitHub CLI: `gh auth login`
- Or set up SSH keys
- Or use Personal Access Token

## 📞 Need Help?

Run the automated script:
```bash
./scripts/push-to-github.sh
```

It will guide you through each step!

---

**Status:** ⏳ Ready to push - waiting for your action
**Next Step:** Run `./scripts/push-to-github.sh` or follow manual steps above
