# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jira Dashboard training workshop application demonstrating AI-driven full-stack development. The project is structured as a monorepo with separate frontend and backend applications, designed for rapid prototyping workshops.

### 在開始任何任務之前

- 請用平輩的方式跟我說話討論，不要對我用您這類敬語。
- 不要因爲我的語氣而去揣測我想聽什麼樣的答案。
- 如果你認爲自己是對的，請堅持立場，不用爲了討好我而改變回答。
- 請保持直接、清楚、理性。
- 如果不知道，請跟我討論。

## Monorepo Structure

```
training-jira-dashboard-workshop-base/
├── frontend/                    # Next.js 15 + React 19 + TypeScript
├── backend/                     # Node.js + Express + TypeScript
├── shared/                      # Shared TypeScript types and constants
├── mock-data/                   # JSON files for development data
├── workshop-guide/              # Step-by-step tutorial documentation
├── docs/                        # Technical documentation
└── scripts/                     # Development scripts
```

## Development Commands

**Root level (runs both frontend and backend):**
- **Development server**: `npm run dev` (starts both frontend and backend)
- **Build**: `npm run build` (builds both applications)
- **Setup**: `npm run setup` (installs all dependencies)

**Frontend specific (`cd frontend`):**
- **Development**: `npm run dev` (Next.js dev server on :3000)
- **Build**: `npm run build`
- **Linting**: `npm run lint`

**Backend specific (`cd backend`):**
- **Development**: `npm run dev` (Express server on :3001)
- **Build**: `npm run build` (TypeScript compilation)

## Architecture

### Frontend (v0.dev Generated)
- **Framework**: Next.js 15 with app router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Key Component**: `frontend/components/jira-dashboard.tsx` - Main dashboard with issue tracking, filtering, charts, and activity feeds
- **API Integration**: Custom hooks in `frontend/hooks/use-api.ts` for backend communication

### Backend (Express API)
- **Framework**: Node.js + Express + TypeScript
- **Data Source**: JSON files in `/mock-data` directory
- **API Structure**: RESTful endpoints for issues, projects, users
- **Key Files**:
  - `backend/src/app.ts`: Express app configuration
  - `backend/src/controllers/issueController.ts`: Issue CRUD operations
  - `backend/src/models/DataService.ts`: JSON file data access layer

### Shared Data
- **Mock Data**: Structured JSON files in `/mock-data` directory
- **API Integration**: Frontend consumes backend APIs instead of hardcoded data
- **Real-time Features**: Create, update, delete operations with immediate UI updates

## Configuration Files

**Frontend:**
- `frontend/components.json`: shadcn/ui configuration
- `frontend/tailwind.config.ts`: Tailwind CSS configuration
- `frontend/next.config.mjs`: Next.js config (ESLint/TypeScript errors ignored for workshop)
- `frontend/.env.local`: Environment variables (API_URL)

**Backend:**
- `backend/tsconfig.json`: TypeScript configuration for Node.js
- `backend/.env`: Environment variables (PORT, NODE_ENV)

## Workshop Learning Path

The repository includes a complete workshop guide in `/workshop-guide/`:
1. Environment setup and repository structure
2. Frontend exploration (v0.dev generated components)
3. Backend API development (Express + TypeScript)
4. API integration and real-time features

## Development Notes

- **Package Manager**: Uses npm workspaces for monorepo management
- **API Base URL**: Frontend calls backend at `http://localhost:3002/api`
- **Data Persistence**: Mock data changes are saved to JSON files
- **Error Handling**: Comprehensive error handling in API calls and UI
- **TypeScript**: Fully typed throughout frontend and backend