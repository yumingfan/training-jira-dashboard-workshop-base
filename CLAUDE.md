# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jira Dashboard training workshop application built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The project uses shadcn/ui for UI components and is designed for rapid prototyping and AI-driven development workshops.

## Development Commands

- **Development server**: `pnpm dev` or `npm run dev`
- **Build**: `pnpm build` or `npm run build`
- **Production server**: `pnpm start` or `npm run start`
- **Linting**: `pnpm lint` or `npm run lint`

Note: ESLint and TypeScript errors are ignored during builds (configured in next.config.mjs).

## Architecture

### Core Structure
- **App Router**: Uses Next.js 13+ app directory structure
- **Components**: Organized in `/components` with shadcn/ui components in `/components/ui`
- **Styling**: Tailwind CSS with custom configuration and CSS variables
- **Path Aliases**: Uses `@/*` for imports (configured in tsconfig.json and components.json)

### Key Components
- `components/jira-dashboard.tsx`: Main dashboard component with issue tracking, filtering, charts, and activity feeds
- `components/theme-provider.tsx`: Theme provider for dark/light mode support
- `app/layout.tsx`: Root layout with metadata configuration

### UI Library
Built on shadcn/ui with extensive component library including:
- Form components (Input, Select, Button, etc.)
- Data display (Table, Card, Badge, Avatar)
- Charts (using Recharts)
- Layout components (Accordion, Tabs, Sidebar)
- Feedback components (Toast, Alert, Dialog)

### Data Layer
Currently uses mock data arrays in the dashboard component. No external API integration or database is configured.

## Key Configuration Files
- `components.json`: shadcn/ui configuration with aliases and styling preferences
- `tailwind.config.ts`: Tailwind configuration with custom theme
- `next.config.mjs`: Next.js config with build optimizations and image settings
- Images are set to unoptimized mode

## Package Manager
Uses pnpm as the primary package manager (pnpm-lock.yaml present).