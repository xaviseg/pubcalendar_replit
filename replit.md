# Editorial Calendar Generator

## Overview

This is a full-stack web application that helps content creators generate editorial calendars for their blogs. Users can enter a blog subject, receive AI-generated title suggestions with SEO keywords via OpenAI, select their preferred titles, and download a scheduled calendar in iCal format. The application uses a three-step workflow: subject input, title selection, and calendar generation/download.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui components built on top of Radix UI primitives, providing a comprehensive set of accessible, customizable UI components styled with Tailwind CSS.

**Styling**: Tailwind CSS with a custom design system defined in `tailwind.config.ts`. The application supports light/dark mode themes with CSS variables for colors and theming.

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management, data fetching, and caching
- No global state management library (Redux, Zustand, etc.) is used

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**Form Handling**: React Hook Form with Zod for validation via @hookform/resolvers

**Key Design Patterns**:
- Component composition with separate page components (`Home.tsx`, `SubjectInput.tsx`, `TitleSelection.tsx`, `CalendarView.tsx`)
- Layout wrapper pattern for consistent header/footer across pages
- Custom hooks for reusable logic (`use-toast.ts`, `use-mobile.tsx`)

### Backend Architecture

**Framework**: Express.js server running on Node.js with TypeScript.

**API Design**: RESTful API endpoints under `/api` namespace:
- `POST /api/titles/generate` - Generate blog title suggestions using OpenAI
- `GET /api/titles?subject=...` - Fetch blog titles for a subject
- `GET /api/calendar?subject=...` - Get selected titles for calendar generation
- Title selection/deselection endpoints (inferred from frontend code)

**Development Mode**: Vite middleware integration for hot module replacement and development server.

**Production Mode**: Static file serving from built assets in `dist/public`.

**Error Handling**: Centralized error middleware that captures errors and returns standardized JSON responses.

**Logging**: Custom request/response logging middleware that tracks API request duration and response data.

### Data Storage Solutions

**ORM**: Drizzle ORM for type-safe database operations and schema management.

**Database**: PostgreSQL via Neon serverless database (@neondatabase/serverless).

**Schema Design**:
- `blog_title_suggestions` table: Stores AI-generated title suggestions with columns for id, title, keywords (array), and subject
- `blog_titles` table: Stores user-selected titles with a `selected` boolean flag for calendar inclusion

**Migration Strategy**: Drizzle Kit for schema migrations with configuration in `drizzle.config.ts`. Schema definitions in `shared/schema.ts` ensure type sharing between client and server.

**In-Memory Fallback**: `MemStorage` class provides an in-memory implementation of the storage interface for development/testing without database dependency.

### External Dependencies

**OpenAI API**: Integration via the official OpenAI Node.js SDK for generating blog post title suggestions and SEO keywords. Configured in `server/openai.ts` with API key from environment variables (`OPENAI_API_KEY` or `VITE_OPENAI_API_KEY`).

**iCal Generation**: `ical-generator` library creates RFC-compliant iCalendar files from scheduled blog posts for calendar application import.

**Date Utilities**: `date-fns` library for date manipulation, formatting, and scheduling logic (calculating next Monday, generating publication schedules on specific weekdays).

**Database**: Neon Serverless PostgreSQL accessed via `DATABASE_URL` environment variable. The application throws an error at startup if this variable is not configured.

**Session Management**: `connect-pg-simple` for PostgreSQL-backed session storage (dependency present but implementation not shown in provided code).

**Font Loading**: Google Fonts (Inter font family) loaded via CDN in `client/index.html`.

**Development Tools**:
- Replit-specific plugins for development environment integration
- Runtime error overlay for better debugging experience
- Cartographer plugin for Replit environment

### Key Architectural Decisions

**Monorepo Structure**: The codebase uses a monorepo pattern with shared types/schemas in `shared/` directory, backend code in `server/`, and frontend code in `client/`. This enables type safety across the full stack.

**Type Safety**: TypeScript throughout with Zod schemas for runtime validation and type inference. Drizzle Zod integration auto-generates Zod schemas from database table definitions.

**Code Sharing**: Path aliases (`@/`, `@shared/`, `@assets/`) configured in both `tsconfig.json` and `vite.config.ts` enable clean imports across the application.

**API Client Pattern**: Centralized API request utilities in `client/src/lib/queryClient.ts` provide consistent error handling and credential management for all API calls.

**Build Process**: 
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js` with external packages
- Single production command runs the bundled server which serves static assets

**Environment-Specific Behavior**: The application detects `NODE_ENV` and `REPL_ID` to adjust behavior for development vs. production and Replit environments.