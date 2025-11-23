# QANOON - Technical Documentation

**Version**: 1.0  
**Last Updated**: November 2025  
**Project Name**: Qanoon - AI-Powered Legal Reference System  
**Author**: HCI Project Team

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Development Guide](#development-guide)
7. [API Documentation](#api-documentation)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Internationalization (i18n)](#internationalization-i18n)
11. [Styling System](#styling-system)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Environment Configuration](#environment-configuration)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**QANOON** is a comprehensive legal reference platform that provides access to UAE legal information with an integrated AI-powered assistant. The application allows users to browse legal categories, search for specific laws, view detailed law information, and interact with an AI assistant for legal guidance.

### Key Features

- **Multi-category Legal Database**: Organized legal information across 6 practice areas:
  - Labour Law
  - Civil Law
  - Criminal Law
  - Family Law
  - Corporate Law
  - Intellectual Property Law

- **Full-Text Search**: Semantic search with relevance scoring across law titles, descriptions, content, and keywords

- **AI Legal Assistant**: 24/7 chatbot that answers legal questions and provides law references

- **Bilingual Support**: Complete English and Arabic interface with RTL support

- **Responsive Design**: Mobile-first design using TailwindCSS

- **Law Saving**: Users can bookmark and save frequently referenced laws

- **Version History**: Track changes and updates to laws

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React SPA)                      │
│  - React 18 + React Router 6                                │
│  - Vite dev server on port 8080                             │
│  - TailwindCSS + Radix UI components                        │
│  - i18next for internationalization                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/REST
                 │
┌────────────────▼────────────────────────────────────────────┐
│                 Backend (Express Server)                     │
│  - Express 5.1 with CORS enabled                            │
│  - API routes: /api/*                                       │
│  - Integrated with Vite dev server                          │
│  - TypeScript for type safety                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Data Access
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Shared Data Layer (TypeScript)                  │
│  - Laws database (in-memory)                                │
│  - Categories definitions                                   │
│  - Shared type interfaces                                   │
│  - AI assistant logic                                       │
└─────────────────────────────────────────────────────────────┘
```

### Single-Port Development

During development, both frontend and backend run on port **8080**:

- **Frontend**: Served by Vite dev server
- **Backend**: Express middleware integrated via Vite plugin
- **API calls**: Proxied through Vite to Express

### Production Build

```
Frontend (SPA)          Backend (Server)
┌──────────────┐       ┌─────────────────┐
│ dist/spa     │       │ dist/server     │
│ - index.html │       │ - server.mjs    │
│ - JS/CSS     │       │ - Node.js app   │
│ - Assets     │       │                 │
└──────────────┘       └─────────────────┘
```

---

## Tech Stack

### Frontend

- **Framework**: React 18.3.23
- **Router**: React Router 6 (SPA mode)
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Styling**: TailwindCSS 3.x
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Internationalization**: i18next 25.x + react-i18next 16.x
- **State Management**: React Query (TanStack Query 5.x)
- **Form Handling**: React Hook Form 7.x
- **Schema Validation**: Zod 3.x
- **HTTP Client**: Fetch API
- **Animations**: Framer Motion 12.x

### Backend

- **Runtime**: Node.js 22+
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.x
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.x

### Development Tools

- **Package Manager**: pnpm
- **Testing**: Vitest
- **Code Format**: Prettier
- **Type Checking**: TypeScript Compiler (tsc)
- **Module Bundler**: SWC (@swc/core)

### Deployment

- **Hosting**: Netlify or Vercel
- **Build Output**: SPA + Server bundle

---

## Project Structure

```
hci-proj/
├── client/                      # React Frontend (SPA)
│   ├── pages/                   # Route components
│   │   ├── Index.tsx            # Home page
│   │   ├── Category.tsx         # Category detail page
│   │   ├── Law.tsx              # Individual law detail page
│   │   ├── Search.tsx           # Search results page
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── components/              # Reusable React components
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── ChatDrawer.tsx       # AI assistant chat UI
│   │   ├── LanguageSwitcher.tsx # i18n language toggle
│   │   └── ui/                  # Pre-built UI component library
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       └── ... (40+ components)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile breakpoint detection
│   │   └── use-toast.ts         # Toast notifications
│   │
│   ├── i18n/                    # Internationalization
│   │   ├── config.ts            # i18next configuration
│   │   └── translations.ts      # EN/AR translations
│   │
│   ├── lib/                     # Utilities
│   │   ├── utils.ts             # Helper functions (cn, etc)
│   │   └── utils.spec.ts        # Unit tests
│   │
│   ├── data/                    # Static data
│   │   └── laws.ts              # Laws data import
│   │
│   ├── App.tsx                  # App root with routing
│   ├── global.css               # Global styles + TailwindCSS
│   └── vite-env.d.ts            # Vite environment types
│
├── server/                      # Express Backend
│   ├── index.ts                 # Server creation & routes setup
│   ├── node-build.ts            # Production entry point
│   └── routes/                  # API route handlers
│       ├── demo.ts              # Demo endpoint
│       ├── ai-assistant.ts      # AI chat handler
│       └── ai-assistant-clean.ts # Alternative AI handler
│
├── shared/                      # Shared Code (Client + Server)
│   ├── api.ts                   # Shared API type interfaces
│   └── laws.ts                  # Law & Category data types
│
├── api/                         # Serverless Functions
│   └── ai-assistant.ts          # Netlify function
│
├── netlify/                     # Netlify Configuration
│   └── functions/
│       └── api.ts               # Netlify serverless handler
│
├── public/                      # Static assets
│   └── robots.txt
│
├── Configuration Files
│   ├── vite.config.ts           # Frontend build config
│   ├── vite.config.server.ts    # Backend build config
│   ├── tailwind.config.ts       # TailwindCSS config
│   ├── tsconfig.json            # TypeScript config
│   ├── postcss.config.js        # PostCSS config
│   ├── components.json          # Shadcn/ui config
│   ├── package.json             # Dependencies
│   ├── pnpm-workspace.yaml      # pnpm workspace
│   ├── pnpm-lock.yaml           # Dependency lock file
│   ├── netlify.toml             # Netlify config
│   ├── vercel.json              # Vercel config
│   └── index.html               # HTML entry point
│
├── Documentation
│   ├── README.md                # Project readme
│   ├── AGENTS.md                # Agent instructions
│   └── TECHNICAL_DOCUMENTATION.md (this file)
```

---

## Setup & Installation

### Prerequisites

- **Node.js**: v22 or higher
- **pnpm**: v8 or higher (install via `npm install -g pnpm`)
- **Git**: For version control

### Initial Setup

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd hci-proj
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Create Environment File** (Optional)

   ```bash
   cp .env.example .env
   ```

   Available environment variables:
   - `PING_MESSAGE`: Custom message for /api/ping endpoint

4. **Verify Setup**
   ```bash
   pnpm typecheck
   ```

### Quick Start

**Development Mode**:

```bash
pnpm dev
```

- Frontend: http://localhost:8080
- Backend: http://localhost:8080/api
- Hot reload enabled for both client and server

**Production Build**:

```bash
pnpm build
```

Outputs:

- `dist/spa/` - Frontend bundle
- `dist/server/` - Backend bundle

**Start Production Server**:

```bash
pnpm start
```

Runs the production server on port 8080

---

## Development Guide

### Adding a New Page Route

1. **Create Page Component** in `client/pages/MyPage.tsx`:

   ```tsx
   import { Layout } from "@/components/Layout";
   import { useTranslation } from "react-i18next";

   export default function MyPage() {
     const { t, i18n } = useTranslation();
     const isRTL = i18n.language === "ar";

     return (
       <Layout>
         <div>Your page content</div>
       </Layout>
     );
   }
   ```

2. **Add Route** in `client/App.tsx`:

   ```tsx
   import MyPage from "./pages/MyPage";

   // Inside <Routes>
   <Route path="/my-page" element={<MyPage />} />;
   ```

### Adding a New API Endpoint

1. **Create Route Handler** in `server/routes/my-route.ts`:

   ```typescript
   import { RequestHandler } from "express";

   export const handleMyRoute: RequestHandler = (req, res) => {
     res.json({ message: "Response data" });
   };
   ```

2. **Register Route** in `server/index.ts`:

   ```typescript
   import { handleMyRoute } from "./routes/my-route";

   app.get("/api/my-route", handleMyRoute);
   ```

3. **Use in React**:
   ```tsx
   const response = await fetch("/api/my-route");
   const data = await response.json();
   ```

### Adding Translations

1. **Update** `client/i18n/translations.ts`:

   ```typescript
   en: {
     translation: {
       myFeature: {
         title: "Feature Title",
         description: "Feature description"
       }
     }
   },
   ar: {
     translation: {
       myFeature: {
         title: "عنوان الميزة",
         description: "وصف الميزة"
       }
     }
   }
   ```

2. **Use in Components**:

   ```tsx
   import { useTranslation } from "react-i18next";

   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t("myFeature.title")}</h1>;
   }
   ```

### Adding UI Components

Components are pre-built in `client/components/ui/`. They use Radix UI primitives with TailwindCSS styling.

**Example - Using Button Component**:

```tsx
import { Button } from "@/components/ui/button";

<Button
  onClick={() => console.log("clicked")}
  className="bg-blue-500 hover:bg-blue-600"
>
  Click Me
</Button>;
```

### Conditional Styling

Use the `cn()` utility function for conditional class merging:

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-classes",
    { "conditional-class": isActive },
    isRTL ? "text-right" : "text-left",
    props.className,
  )}
>
  Content
</div>;
```

### RTL Support

Handle RTL (Right-to-Left) for Arabic:

```tsx
const { i18n } = useTranslation();
const isRTL = i18n.language === "ar";

// Apply RTL classes
className={isRTL ? "flex-row-reverse" : ""}

// Set document direction
document.documentElement.dir = isRTL ? "rtl" : "ltr";
document.documentElement.lang = i18n.language;
```

---

## API Documentation

### Base URL

**Development**: `http://localhost:8080/api`  
**Production**: `https://your-domain.com/api`

### Endpoints

#### 1. GET `/api/ping`

**Description**: Health check endpoint

**Query Parameters**: None

**Response**:

```json
{
  "message": "ping"
}
```

**Example**:

```bash
curl http://localhost:8080/api/ping
```

---

#### 2. GET `/api/demo`

**Description**: Demo endpoint with sample data

**Query Parameters**: None

**Response**:

```json
{
  "message": "Demo response",
  "timestamp": "2025-11-23T10:30:00Z"
}
```

**Example**:

```bash
curl http://localhost:8080/api/demo
```

---

#### 3. POST `/api/ai-assistant`

**Description**: AI-powered legal assistant that answers questions about UAE law

**Request Body**:

```json
{
  "question": "What are the requirements for a student visa in UAE?"
}
```

**Response**:

```json
{
  "answer": "To obtain a student visa in the UAE, follow these steps:\n\n1. **Get an Admission Letter**: ...",
  "references": [
    {
      "lawId": "labor-1",
      "title": "UAE Labour Law",
      "legalReference": "Federal Decree No. 8 of 1980",
      "excerpt": "Relevant excerpt from the law..."
    }
  ]
}
```

**Response Fields**:

- `answer` (string): Detailed answer with markdown formatting
  - Supports bold text: `**text**`
  - Supports law references: `[law-id]`
- `references` (array): Related laws and articles
  - `lawId`: Unique law identifier (e.g., "labor-1")
  - `title`: Full law title
  - `legalReference`: Official legal reference
  - `excerpt`: Relevant text from the law

**Example**:

```bash
curl -X POST http://localhost:8080/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I start a business in UAE?"}'
```

**Mock Response Examples**:

- Student visa questions
- Work visa questions
- Business establishment queries
- Employment law inquiries
- Legal procedure questions

---

### API Error Handling

All endpoints return appropriate HTTP status codes:

| Status | Meaning                            |
| ------ | ---------------------------------- |
| 200    | Success                            |
| 400    | Bad Request (invalid parameters)   |
| 404    | Not Found (endpoint doesn't exist) |
| 500    | Server Error                       |

**Error Response Format**:

```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

---

### Request/Response Validation

Use **Zod** schemas for validation:

```typescript
import { z } from "zod";

const RequestSchema = z.object({
  question: z.string().min(1).max(500),
});

const request = RequestSchema.parse(req.body);
```

---

## Frontend Architecture

### Component Structure

#### Layout Component (`Layout.tsx`)

Wraps all pages with:

- **Header**: Sticky navigation with search and language switcher
- **Main Content**: Page-specific content
- **Footer**: Links and copyright
- **Chat Drawer**: AI assistant modal

#### Page Components

- **Index.tsx** (Home): Hero section, categories, recent updates
- **Category.tsx**: Laws in a specific category
- **Law.tsx**: Detailed law information with sections and version history
- **Search.tsx**: Search results with semantic ranking
- **NotFound.tsx**: 404 error page

### Routing

**React Router 6 Configuration**:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/category/:categoryId" element={<Category />} />
    <Route path="/law/:lawId" element={<Law />} />
    <Route path="/search" element={<Search />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Route Parameters**:

- `/category/:categoryId` - Display laws in a category (e.g., `/category/labor`)
- `/law/:lawId` - Display specific law details (e.g., `/law/labor-1`)
- `/search?q=query` - Search results

### State Management

**React Query (TanStack Query)**:

```tsx
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  {/* App content */}
</QueryClientProvider>;
```

**Local State**:

- Search query: `useState`
- Language preference: `localStorage`
- Saved laws: `localStorage` as `Set<string>`
- Chat state: `useState` with `useRef` for scroll

### Custom Hooks

**`use-mobile.tsx`**: Detect mobile breakpoint

```tsx
const isMobile = useMobile(); // true if screen < 768px
```

**`use-toast.ts`**: Show toast notifications

```tsx
const { toast } = useToast();
toast({
  title: "Success",
  description: "Law saved successfully",
});
```

### Data Flow

```
User Input
    ↓
Component State (useState)
    ↓
Event Handler (onClick, onChange)
    ↓
API Call or Data Lookup
    ↓
Update State
    ↓
Re-render
```

### Search Implementation

**Semantic Search Algorithm** (`Search.tsx`):

1. **Parse Query**: Split into terms, lowercase
2. **Score Laws**: For each law, calculate score based on:
   - Title matches (weight: 30)
   - Description matches (weight: 20)
   - Content matches (weight: 10)
   - Keyword matches (weight: 15)
3. **Filter**: Only laws with matches
4. **Sort**: By relevance score (descending)
5. **Extract Context**: Show matched excerpt

**Scoring Formula**:

```
totalScore = (titleMatches × 30) + (descriptionMatches × 20)
           + (contentMatches × 10) + (keywordMatches × 15)
normalizedScore = min(100, (totalScore / (queryTerms.length × 30)) × 100)
```

---

## Backend Architecture

### Express Server Setup

**Entry Point**: `server/index.ts`

```typescript
import express from "express";
import cors from "cors";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.get("/api/ping", handler);
  app.post("/api/ai-assistant", handleAiAssistant);

  return app;
}
```

### Middleware Stack

1. **CORS**: Enable cross-origin requests
2. **JSON Parser**: Parse request bodies as JSON
3. **URL-encoded Parser**: Handle form data

### Production Entry Point

**`server/node-build.ts`**: Creates server and listens on port

```typescript
import { createServer } from "./index";

const app = createServer();
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Route Organization

Routes are organized in `server/routes/`:

```
routes/
├── demo.ts          # Demo endpoint handler
├── ai-assistant.ts  # Main AI logic
└── ai-assistant-clean.ts  # Alternative implementation
```

Each route exports a `RequestHandler`:

```typescript
import { RequestHandler } from "express";

export const handleDemo: RequestHandler = (req, res) => {
  res.json({ message: "Demo" });
};
```

### AI Assistant Logic

**Location**: `server/routes/ai-assistant.ts`

**Mock Response Generation**:

1. Convert question to lowercase
2. Split into keywords
3. Find relevant laws using keyword matching
4. Generate contextual answer based on question type
5. Return answer + references

**Question Categories**:

- Visa-related (student, work, residency)
- Business establishment
- Employment matters
- Legal procedures

**Reference Extraction**:

- Returns up to 3 most relevant laws
- Includes lawId, title, legal reference, and excerpt

---

## Internationalization (i18n)

### Configuration

**`client/i18n/config.ts`**: i18next setup

```typescript
import i18next from "i18next";
import { resources } from "./translations";

i18next.init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
```

### Translation Structure

**`client/i18n/translations.ts`**:

```typescript
export const resources = {
  en: {
    translation: {
      header: { browse: "Browse", ... },
      hero: { title: "...", ... },
      ...
    }
  },
  ar: {
    translation: {
      header: { browse: "تصفح", ... },
      hero: { title: "...", ... },
      ...
    }
  }
}
```

### Language Switching

**UI Component**: `LanguageSwitcher.tsx`

```tsx
const { i18n } = useTranslation();

const toggleLanguage = () => {
  const newLang = i18n.language === "en" ? "ar" : "en";
  i18n.changeLanguage(newLang);
  localStorage.setItem("language", newLang);
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
};
```

### Available Languages

- **English** (en): Default language
- **Arabic** (ar): Full RTL support

### Translation Keys by Section

- `header.*`: Navigation and header text
- `hero.*`: Home page hero section
- `features.*`: Feature descriptions
- `categories.*`: Category section
- `search.*`: Search functionality
- `law.*`: Law detail page
- `footer.*`: Footer links
- `common.*`: Shared labels

---

## Styling System

### TailwindCSS Configuration

**`tailwind.config.ts`**: Main configuration

```typescript
export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors from CSS variables
      },
    },
  },
};
```

### Global Styles

**`client/global.css`**:

- CSS variables for theming
- TailwindCSS directives (`@tailwind`)
- Global typography styles
- Custom utility classes

### Color Scheme

**Primary Colors**:

- Gold/Accent: `#BF9140` (used for highlights and CTAs)
- Green: `#08AA78` (check marks and success)
- Dark Background: `#000000` to `#1F1F23`
- White Text: `#FFFFFF`

**CSS Variables** (HSL format):

```css
:root {
  --primary: 39 89% 49%; /* #BF9140 */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 0%;
  --accent: 163 83% 31%; /* #08AA78 */
  /* ... more variables */
}
```

### Responsive Design

**Breakpoints** (Tailwind default):

```
sm:  640px   (tablets)
md:  768px   (small desktops)
lg:  1024px  (desktops)
xl:  1280px  (large screens)
2xl: 1536px  (extra large)
```

**Usage**:

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<nav className="hidden md:flex">Hidden on mobile</nav>
```

### Component Styling

**Radix UI + TailwindCSS Pattern**:

```tsx
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

<Dialog.Content
  className={cn(
    "fixed z-50 gap-4 border bg-white shadow-lg rounded-lg",
    "w-full max-w-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
  )}
>
```

### Theme Customization

**Adding Custom Color**:

1. Update `tailwind.config.ts`:

```typescript
extend: {
  colors: {
    myColor: "hsl(var(--my-color))";
  }
}
```

2. Update `client/global.css`:

```css
:root {
  --my-color: 220 90% 50%; /* Adjust to your color */
}
```

3. Use in components:

```tsx
<div className="bg-myColor text-myColor-foreground">
```

### Utility Classes

**Common Utility Function** (`lib/utils.ts`):

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Testing

### Testing Framework: Vitest

**Setup**: `vitest` is configured in `package.json`

### Running Tests

```bash
# Run all tests once
pnpm test

# Run specific test file
pnpm test utils.spec.ts

# Watch mode
pnpm test --watch
```

### Example Test File

**`client/lib/utils.spec.ts`**:

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("px-2 py-1", "px-3");
    expect(result).toBe("py-1 px-3");
  });
});
```

### Test Coverage

Run tests with coverage:

```bash
pnpm test --coverage
```

### Writing Tests

**Component Test Example**:

```typescript
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });
});
```

---

## Deployment

### Build Process

```bash
# Clean build
pnpm build

# Outputs:
# - dist/spa/      (React SPA)
# - dist/server/   (Express server)
```

### Deployment Options

#### Option 1: Netlify

**Configuration**: `netlify.toml`

```toml
[build]
  command = "pnpm build"
  publish = "dist/spa"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy**:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/spa
```

#### Option 2: Vercel

**Configuration**: `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/spa",
  "framework": "react"
}
```

**Deploy**:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: Self-Hosted (Node.js Server)

1. **Build**:

   ```bash
   pnpm build
   ```

2. **Start Server**:

   ```bash
   pnpm start
   ```

3. **Process Manager** (PM2):

   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name "qanoon"
   pm2 save
   ```

4. **Reverse Proxy** (Nginx):

   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:8080;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

### Environment Variables for Deployment

Create `.env.production`:

```
PING_MESSAGE=Production ping response
NODE_ENV=production
```

### Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 8080
CMD ["pnpm", "start"]
```

Build and run:

```bash
docker build -t qanoon .
docker run -p 8080:8080 qanoon
```

---

## Environment Configuration

### Development Environment

**`.env` file** (optional):

```
PING_MESSAGE=Development ping
NODE_ENV=development
```

### Build Configuration Files

**`tsconfig.json`**: TypeScript compilation settings

- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases: `@`, `@shared`

**`vite.config.ts`**: Frontend build

- Dev server on port 8080
- React SWC transpilation
- Output: `dist/spa/`

**`vite.config.server.ts`**: Backend build

- Target: Node 22
- Output: `dist/server/`
- External dependencies not bundled

**`postcss.config.js`**: CSS processing

- Autoprefixer for vendor prefixes
- TailwindCSS processing

### Feature Flags

Can be added via environment:

```typescript
const isFeatureEnabled = process.env.FEATURE_NAME === "true";
```

---

## Troubleshooting

### Development Issues

#### Port 8080 Already in Use

**Solution**:

```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F

# Or specify different port
pnpm dev -- --port 3000
```

#### Module Not Found Error

**Solution**:

- Check path aliases in `tsconfig.json` and `vite.config.ts`
- Verify import path: `@/` for client, `@shared/` for shared
- Restart dev server

#### Hot Reload Not Working

**Solution**:

- Check Vite plugin configuration
- Verify file is in `content` array in `tailwind.config.ts`
- Restart dev server

### TypeScript Errors

**Run Type Check**:

```bash
pnpm typecheck
```

**Common Issues**:

- Missing type definitions: Run `npm install --save-dev @types/package-name`
- Circular dependencies: Refactor module imports
- Strict mode violations: Add proper type annotations

### Build Issues

#### Build Fails with Memory Error

**Solution**:

```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

#### Large Bundle Size

**Analysis**:

```bash
pnpm build -- --analyze
```

**Optimization**:

- Use dynamic imports for large components
- Enable code splitting
- Remove unused dependencies

### API Issues

#### CORS Error in Development

**Check**:

- Express has `cors()` middleware
- API calls use correct URL path
- Request headers are correct

#### API Response is Empty

**Debug**:

```typescript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

#### Mock AI Assistant Not Responding

**Solution**:

- Check `/api/ai-assistant` endpoint is registered
- Verify request body format: `{ question: "..." }`
- Check browser console for fetch errors

### Deployment Issues

#### Build Command Fails

**Solution**:

- Run `pnpm install` to ensure all dependencies
- Check for TypeScript errors: `pnpm typecheck`
- Verify environment variables are set

#### Environment Variables Not Set

**Netlify**:

- Go to Site Settings → Build & Deploy → Environment
- Add variables there

**Vercel**:

- Go to Settings → Environment Variables
- Add variables for production, preview, development

#### Incorrect Build Output Path

**Check**:

- Frontend: `dist/spa/`
- Backend: `dist/server/`
- Update deployment config if paths differ

### Performance Issues

#### Slow Page Load

**Diagnostics**:

- Check Network tab in DevTools
- Look for large bundle files
- Check API response times

**Optimization**:

- Enable gzip compression on server
- Use CDN for static assets
- Implement lazy loading for components

#### High Memory Usage

**Solution**:

- Check for memory leaks in React components
- Use `useCallback` and `useMemo` appropriately
- Clear event listeners in cleanup functions

### Mobile Issues

#### Touch Events Not Working

**Solution**:

- Check for `pointer-events: none` in CSS
- Verify event handlers are attached
- Test on actual device (not just DevTools)

#### RTL Layout Broken

**Check**:

- `document.documentElement.dir = "rtl"`
- All flex-row reversed with `flex-row-reverse`
- Text alignment consistent with direction

---

## Quick Reference

### Common Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Run production build
pnpm test             # Run tests
pnpm typecheck        # TypeScript validation
pnpm format.fix       # Format code with Prettier
```

### Directory Aliases

```
@ → client/
@shared → shared/
```

### Important Files

| File                          | Purpose              |
| ----------------------------- | -------------------- |
| `client/App.tsx`              | App root and routing |
| `server/index.ts`             | Server setup         |
| `shared/api.ts`               | Type interfaces      |
| `shared/laws.ts`              | Law data types       |
| `client/i18n/translations.ts` | i18n strings         |
| `tailwind.config.ts`          | Styling theme        |
| `vite.config.ts`              | Build config         |

### Common Patterns

**Fetch API Call**:

```tsx
const response = await fetch("/api/endpoint");
const data = await response.json();
```

**Update State**:

```tsx
setState((prev) => ({ ...prev, key: newValue }));
```

**Conditional Rendering**:

```tsx
{
  condition ? <ComponentA /> : <ComponentB />;
}
```

**Responsive Classes**:

```tsx
className = "block md:hidden"; // Show on mobile, hide on desktop
className = "hidden md:block"; // Hide on mobile, show on desktop
```

---

## Support & Resources

### Documentation Links

- [React Documentation](https://react.dev)
- [React Router 6](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [i18next](https://www.i18next.com)
- [Express.js](https://expressjs.com)

### Community & Help

- Check existing GitHub issues
- Review project README
- Check error messages in console
- Use browser DevTools for debugging

---

## Changelog

### Version 1.0 (November 2025)

- Initial release
- Complete frontend with React Router
- Express backend with AI assistant
- Bilingual support (EN/AR)
- Search functionality
- Law browsing and details
- Responsive design

---

**End of Technical Documentation**

For questions or issues, please refer to the troubleshooting section or create an issue in the project repository.
