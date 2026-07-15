# 🔧 Git Setup Guide - SoftMarket

Complete guide to set up Git and push to GitHub/GitLab/BitBucket.

---

## ✅ Git Repository Initialized!

Your project is now a Git repository. Here's how to connect it to a remote repository.

---

## 🚀 Quick Start (Push to GitHub)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `softmarket-platform` (or your choice)
3. Description: "Enterprise Software Marketplace Platform"
4. **Don't** initialize with README (we already have files)
5. Click "Create repository"

### Step 2: Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --global --list
```

### Step 3: Add Files and Commit

```bash
# Check status
git status

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Enterprise software marketplace platform with React, TypeScript, and Spring Boot"
```

### Step 4: Connect to GitHub

```bash
# Add remote repository (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/softmarket-platform.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📋 Detailed Instructions

### Option 1: GitHub (Recommended)

#### A. Using HTTPS (Simple)

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

**Note**: GitHub may ask for authentication. Use a Personal Access Token (PAT) instead of password.

**To create PAT:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy token and use as password

#### B. Using SSH (Secure)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

---

### Option 2: GitLab

```bash
# HTTPS
git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git

# Or SSH
git remote add origin git@gitlab.com:YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

---

### Option 3: BitBucket

```bash
# HTTPS
git remote add origin https://bitbucket.org/YOUR_USERNAME/REPO_NAME.git

# Or SSH
git remote add origin git@bitbucket.org:YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

---

## 🔄 Daily Git Workflow

### Making Changes

```bash
# Check status
git status

# See changes
git diff

# Add specific files
git add src/components/NewComponent.tsx

# Or add all changes
git add .

# Commit with message
git commit -m "feat: add new component for product listing"

# Push to remote
git push
```

### Commit Message Convention

Use semantic commit messages:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

**Examples:**
```bash
git commit -m "feat: implement 2FA authentication with SMS"
git commit -m "fix: resolve payment gateway integration issue"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
```

---

## 🌿 Branching Strategy

### Feature Branch Workflow

```bash
# Create new branch for feature
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: implement user login"

# Push branch
git push -u origin feature/user-authentication

# After review, merge to main (via PR/MR on GitHub)
```

### Recommended Branch Names

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent production fixes
- `docs/documentation-update` - Documentation
- `refactor/code-improvement` - Code refactoring

---

## 📊 Useful Git Commands

### Status & History

```bash
# Check status
git status

# View commit history
git log

# Compact history
git log --oneline

# Graphical history
git log --oneline --graph --all

# Show changes in last commit
git show
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- filename.ts

# Unstage file (keep changes)
git reset HEAD filename.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit that undoes)
git revert HEAD
```

### Branches

```bash
# List branches
git branch

# List all branches (including remote)
git branch -a

# Create new branch
git branch feature-name

# Switch branch
git checkout feature-name

# Create and switch in one command
git checkout -b feature-name

# Delete branch
git branch -d feature-name

# Delete remote branch
git push origin --delete feature-name
```

### Remote Operations

```bash
# Show remotes
git remote -v

# Add remote
git remote add origin URL

# Change remote URL
git remote set-url origin NEW_URL

# Remove remote
git remote remove origin

# Fetch from remote
git fetch origin

# Pull from remote
git pull origin main

# Push to remote
git push origin main
```

---

## 🔒 .gitignore (Already Configured)

Your `.gitignore` is already set up to exclude:

- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env` - Environment variables (NEVER commit secrets!)
- `.vscode/` - Editor settings
- `*.log` - Log files

**Critical**: NEVER commit:
- API keys
- Passwords
- Tokens
- `.env` files with secrets

---

## 🔐 Protecting Sensitive Data

### If You Accidentally Committed Secrets

```bash
# Remove from Git history (USE WITH CAUTION)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if already pushed)
git push origin --force --all

# Then: Rotate all exposed secrets immediately!
```

### Better Approach: Prevent It

1. Use `.env.example` for templates
2. Never commit `.env` files
3. Use environment variables on hosting platforms
4. Enable secret scanning on GitHub

---

## 👥 Collaboration Workflow

### Pull Request / Merge Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: implement new feature"
   ```

3. **Push branch**
   ```bash
   git push -u origin feature/new-feature
   ```

4. **Create PR/MR on GitHub/GitLab**
   - Go to repository on web
   - Click "New Pull Request"
   - Select your branch
   - Add description
   - Request review

5. **After approval, merge**
   - Merge via web interface
   - Or locally:
   ```bash
   git checkout main
   git merge feature/new-feature
   git push
   ```

6. **Delete feature branch**
   ```bash
   git branch -d feature/new-feature
   git push origin --delete feature/new-feature
   ```

---

## 🚨 Common Issues & Solutions

### Issue: "fatal: remote origin already exists"

```bash
# Solution: Remove and re-add
git remote remove origin
git remote add origin YOUR_URL
```

### Issue: Merge Conflicts

```bash
# Pull latest changes
git pull origin main

# If conflicts occur:
# 1. Open conflicted files
# 2. Resolve conflicts (choose which changes to keep)
# 3. Remove conflict markers (<<<<<<<, =======, >>>>>>>)
# 4. Stage resolved files
git add resolved-file.ts

# Continue merge
git commit -m "resolve merge conflicts"
```

### Issue: Need to undo a push

```bash
# If nothing critical pushed yet
git reset --hard HEAD~1
git push --force

# WARNING: Force push rewrites history!
# Only do this on your own branches
```

### Issue: Wrong branch

```bash
# Stash changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply stashed changes
git stash pop
```

---

## 📈 Git Best Practices

### ✅ DO

- ✅ Commit often with meaningful messages
- ✅ Pull before you push
- ✅ Use branches for features
- ✅ Write descriptive commit messages
- ✅ Review changes before committing (`git diff`)
- ✅ Keep commits small and focused
- ✅ Use `.gitignore` properly
- ✅ Test before committing

### ❌ DON'T

- ❌ Commit secrets or credentials
- ❌ Commit `node_modules/`
- ❌ Force push to main branch
- ❌ Commit directly to main (use branches)
- ❌ Use generic messages ("fixed stuff", "update")
- ❌ Commit untested code
- ❌ Commit personal config files

---

## 🎯 Project-Specific Git Workflow

### For This SoftMarket Project

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/implement-2fa

# 3. Work on feature
# ... make changes ...

# 4. Test your changes
npm run dev
npm run build

# 5. Stage and commit
git add .
git commit -m "feat: implement two-factor authentication with SMS"

# 6. Push feature branch
git push -u origin feature/implement-2fa

# 7. Create Pull Request on GitHub

# 8. After merge, update main
git checkout main
git pull origin main

# 9. Delete feature branch
git branch -d feature/implement-2fa
```

---

## 📦 Recommended Repository Structure

```
your-repo/
├── frontend/          # This React project (optional organization)
├── backend/           # Spring Boot project (to be added)
├── docs/              # Additional documentation
├── .github/
│   └── workflows/     # CI/CD workflows
└── README.md          # Main project README
```

Or keep frontend as root:
```
your-repo/            # This React project (current setup)
└── README.md         # Already created
```

---

## 🔗 GitHub Features to Enable

After pushing to GitHub:

1. **Branch Protection Rules**
   - Settings → Branches → Add rule
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks

2. **Issues & Projects**
   - Enable Issues for bug tracking
   - Create Project board for task management

3. **GitHub Actions (CI/CD)**
   - Will be set up later
   - Automatic testing on PR
   - Automatic deployment

4. **Secret Scanning**
   - Automatically enabled on public repos
   - Detects committed secrets

---

## 🎓 Learning Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Interactive Git Tutorial**: https://learngitbranching.js.org/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

---

## 🆘 Need Help?

### Check Git Status
```bash
git status
```

### View Remote URL
```bash
git remote -v
```

### View Configuration
```bash
git config --list
```

### Get Help
```bash
git help
git help commit
git help push
```

---

**Happy Coding with Git!** 🚀

---

**Quick Commands Reference:**

```bash
# First time setup
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize and push
git add .
git commit -m "Initial commit"
git remote add origin YOUR_URL
git push -u origin main

# Daily workflow
git pull
git add .
git commit -m "your message"
git push
```
