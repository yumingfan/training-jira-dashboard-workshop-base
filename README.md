# AI-driven Agile Development Workshop
## Rapid Prototyping with Jira Dashboard

Welcome to this comprehensive workshop on building full-stack applications using AI-powered development tools! This repository demonstrates how to rapidly prototype and develop a Jira-like dashboard using modern technologies and AI assistance.

## 🎯 Workshop Objectives

Learn how to:
- **Rapid UI Prototyping** with v0.dev for instant React component generation
- **Full-stack Development** using Next.js 15 and Node.js/Express
- **Monorepo Management** with shared types and data structures
- **API Integration** with real-time data updates
- **AI-assisted Development** workflow for faster iteration

## 🏗️ Project Structure

```
training-jira-dashboard-workshop-base/
├── 📂 frontend/                 # Next.js + React + TypeScript + shadcn/ui
├── 📂 backend/                  # Node.js + Express + TypeScript API
├── 📂 shared/                   # Shared types and constants
├── 📂 mock-data/               # JSON files for development data
├── 📂 workshop-guide/          # Step-by-step tutorial (START HERE!)
├── 📂 docs/                    # Technical documentation
├── 📂 scripts/                 # Development automation scripts
├── 📄 CLAUDE.md                # Guidance for Claude Code AI assistant
└── 📄 package.json             # Monorepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Git
- Text editor (VS Code recommended)

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/training-jira-dashboard-workshop-base.git
cd training-jira-dashboard-workshop-base

# Install dependencies for entire monorepo
npm run setup

# Start both frontend and backend
npm run dev
```

Visit:
- 🖥️ **Frontend**: http://localhost:3001 (Jira Dashboard)
- 🔧 **Backend API**: http://localhost:3002/api/health

## 📚 Workshop Guide

**New to this workshop?** Start with the comprehensive guide:

👉 **[Begin Workshop: Environment Setup](./workshop-guide/README.md)**

### Learning Path
1. **[01 - Environment Setup](./workshop-guide/01-setup.md)** ⏱️ 30 min
   - Tool installation and repository overview
   
2. **[02 - Frontend Exploration](./workshop-guide/02-frontend-setup.md)** ⏱️ 45 min
   - Understanding v0.dev generated components
   - Customizing the dashboard interface
   
3. **[03 - Backend Development](./workshop-guide/03-backend-setup.md)** ⏱️ 90 min
   - Building Express API with TypeScript
   - Creating RESTful endpoints
   
4. **[04 - API Integration](./workshop-guide/04-api-integration.md)** ⏱️ 60 min
   - Connecting frontend to backend
   - Implementing real-time features

**Total Duration**: ~4 hours

## 🛠️ Technology Stack

### Frontend (v0.dev Generated)
- **⚛️ Next.js 15** - React framework with app router
- **🎨 shadcn/ui** - High-quality component library
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📊 Recharts** - Data visualization
- **🔷 TypeScript** - Type safety

### Backend (Workshop Built)
- **🟢 Node.js + Express** - Server and API framework
- **🔷 TypeScript** - Type safety for backend
- **📄 JSON File Storage** - Mock data persistence
- **🔄 RESTful APIs** - Standard HTTP endpoints

### Development Tools
- **🤖 v0.dev** - AI-powered UI component generation
- **🤖 Claude Code** - AI assistant for development
- **📦 npm workspaces** - Monorepo management

## ✨ Key Features

### Dashboard Features
- 📊 **Issue Management** - Create, update, and track issues
- 📈 **Data Visualization** - Charts and statistics
- 🔍 **Filtering & Search** - Advanced issue filtering
- 👥 **User Management** - User profiles and assignments
- 📱 **Responsive Design** - Mobile-friendly interface

### Technical Features
- 🔄 **Real-time Updates** - Immediate UI feedback
- 🚀 **Optimistic Updates** - Smooth user experience
- 🛡️ **Error Handling** - Comprehensive error management
- 🔧 **Auto-refresh** - Keep data current
- 📡 **RESTful API** - Standard backend architecture

## 🎓 Learning Outcomes

After completing this workshop, you'll understand:

- ✅ How to leverage AI tools for rapid prototyping
- ✅ Modern React patterns with Next.js 15
- ✅ Building type-safe APIs with Express and TypeScript
- ✅ Monorepo structure and management
- ✅ Full-stack application architecture
- ✅ Real-time data synchronization patterns
- ✅ Professional development workflow with AI assistance

## 🔧 Development Commands

```bash
# Root level commands
npm run dev           # Start both frontend & backend
npm run build         # Build both applications
npm run setup         # Install all dependencies

# Frontend specific
cd frontend && npm run dev    # Next.js dev server
cd frontend && npm run build  # Production build
cd frontend && npm run lint   # Code linting

# Backend specific
cd backend && npm run dev     # Express dev server
cd backend && npm run build   # TypeScript compilation
```

## 📖 Documentation

- **[Workshop Guide](./workshop-guide/README.md)** - Complete tutorial
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant guidance
- **[Mock Data](./mock-data/README.md)** - Data structure reference

## 🤝 Contributing

This workshop is designed for learning. Feel free to:
- Experiment with the code
- Add new features
- Improve the documentation
- Share your learning experience

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **v0.dev** - For generating the beautiful frontend components
- **shadcn/ui** - For the excellent component library
- **Claude Code** - For AI-assisted development guidance

---

**Ready to start building?** 👉 **[Begin the Workshop](./workshop-guide/README.md)**
