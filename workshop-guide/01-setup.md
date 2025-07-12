# 01 - Environment Setup

This guide will help you set up your development environment for the Jira Dashboard workshop.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Package Manager** (npm or pnpm)
   ```bash
   npm --version   # Should be 8.0.0 or higher
   # OR
   pnpm --version  # Recommended for this workshop
   ```

3. **Git**
   ```bash
   git --version
   ```

### Recommended Tools

- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Claude Code (if available)

## Repository Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/training-jira-dashboard-workshop-base.git
cd training-jira-dashboard-workshop-base
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Verify Installation

```bash
# Check if frontend can start
cd frontend
npm run dev
```

Visit http://localhost:3000 to see the Jira dashboard interface.

## Project Structure Overview

```
training-jira-dashboard-workshop-base/
├── README.md                    # Project overview
├── CLAUDE.md                    # Claude Code guidance
├── package.json                 # Root package.json for monorepo
├── workshop-guide/              # This guide you're reading
├── frontend/                    # Next.js application (created by v0.dev)
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   ├── lib/                    # Utilities and configuration
│   └── package.json           # Frontend dependencies
├── backend/                     # Backend API (to be created)
├── shared/                      # Shared TypeScript types
├── mock-data/                   # JSON mock data files
├── docs/                        # Technical documentation
└── scripts/                     # Development scripts
```

## Development Commands

From the root directory:

```bash
# Start frontend only
npm run dev:frontend

# Start backend only (after creation)
npm run dev:backend

# Start both frontend and backend
npm run dev

# Build everything
npm run build

# Run linting
npm run lint
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill
   ```

2. **Node version issues**
   ```bash
   # Use nvm to manage Node versions
   nvm install 18
   nvm use 18
   ```

3. **Permission errors**
   ```bash
   # Fix npm permissions (macOS/Linux)
   sudo chown -R $(whoami) ~/.npm
   ```

### Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] Frontend starts on http://localhost:3000
- [ ] Dashboard displays with mock data
- [ ] No console errors in browser

## Next Steps

Once your environment is set up, proceed to [02 - Frontend Setup](./02-frontend-setup.md) to explore the v0.dev generated interface.