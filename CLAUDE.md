# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CSRD-COLLECT is a French-language Next.js 16.1.0 application for CSRD data collection. Uses React 19.2.3, Tailwind CSS 4, and TypeScript.

## Commands

```bash
pnpm run dev      # Start dev server at http://localhost:3000 (Turbopack)
pnpm run build    # Production build
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

## Mandatory Requirements

- Use pnpm as package manager
- Use file-system routing (Next.js App Router)
- All UI content must be in French
- Store application code in `src/` folder
- Keep `src/app/` purely for routing (layouts, pages)
- Static assets go in `public/`

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router (routing only)
- `src/components/` - Reusable UI components
- `src/lib/` - Utility components and shared code

### Path Aliases
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`

### Styling
Tailwind CSS 4 with custom theme variables in `src/app/globals.css` using `@theme` block. Color namespaces:
- `sidebar-*` - Sidebar colors (bg, text, muted, border, hover)
- `primary-*` - Primary action colors
- `content-*` - Main content area colors

### Component Patterns
- Client components use `"use client"` directive for interactivity
- Root layout is a server component
- Sidebar supports collapse/expand with smooth transitions
