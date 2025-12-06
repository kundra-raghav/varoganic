# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Varoganic Store is a React-based e-commerce storefront built with TypeScript, Vite, and Tailwind CSS. It's designed for an organic skincare/beauty brand with a focus on ingredients, rituals, and wellness-oriented product discovery. The project uses a custom client-side router and emphasizes performance through code-splitting and lazy loading.

**Important**: This is a **catalog/showcase site** that redirects customers to external marketplaces (Flipkart/Amazon) for purchases. There is no internal checkout flow—the cart is used for browsing only.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3 with custom design tokens
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **UI Motion**: Framer Motion
- **Carousels**: Embla Carousel
- **SEO**: React Helmet Async
- **Icons**: Lucide React

## Common Commands

```bash
# Development server with HMR
npm run dev

# Type-check and build for production
npm run build

# Preview production build locally
npm run preview

# Lint all files
npm run lint

# Format code (if prettier is configured as a script)
npx prettier --write .
```

## Project Structure

```
src/
├── components/       # UI components organized by domain
│   ├── commerce/    # Cart, products, pricing components
│   ├── common/      # Reusable UI primitives (Button, Skeleton, Toast)
│   ├── home/        # Homepage-specific sections
│   ├── layout/      # Header, Footer, Navigation
│   ├── pdp/         # Product detail page components
│   └── plp/         # Product listing page components
├── routes/          # Page-level route components (lazy loaded)
├── store/           # Zustand stores (cart, filters, auth, ui)
├── hooks/           # Custom React hooks
├── lib/             # Utilities (analytics, api, formatters, seo, toasts)
├── types/           # TypeScript type definitions
├── styles/          # Additional CSS files
├── data/            # Static data/mock data
└── assets/          # Images and static assets
```

## Architecture

### Routing System

This project uses a **custom minimal client-side router** (`AppRouter.tsx`) instead of React Router. The router:
- Maps URL paths to lazy-loaded route components via a `routeMap` object
- Handles browser navigation events (popstate)
- Includes a splash screen animation on initial load
- Falls back to `NotFoundRoute` for unknown paths

To add a new route:
1. Create the route component in `src/routes/`
2. Lazy import it in `AppRouter.tsx`
3. Add the path mapping to the `routeMap` object

### State Management

**Zustand stores** (located in `src/store/`) manage client-side state:
- `cart.ts`: Shopping cart with localStorage persistence
- `filters.ts`: Product filtering state
- `ui.ts`: UI state (sidebar open/close, reduced motion preferences)
- `auth.ts`: Authentication state

Cart updates dispatch custom events (`cart:item-added`) that other components can listen to.

### Data Fetching

The project is set up for **TanStack Query** but currently uses static data from `src/data/products.ts`. Products include external marketplace links (Flipkart/Amazon) stored in the `links` property. API utilities exist in `src/lib/api.ts` for future backend integration.

Query client configuration (in `AppProviders.tsx`):
- `staleTime: 5 minutes`
- `gcTime: 30 minutes`
- `retry: 2 attempts`
- Window focus refetch disabled

### Purchase Flow

The application **does not process payments internally**. Instead:
- Product pages show "Buy Now on Flipkart/Amazon" buttons that open external marketplace links in new tabs
- Cart page has a "Shop on Flipkart" button that redirects to the Flipkart store search
- The cart functionality is preserved for browsing and product comparison only
- Each product in `src/data/products.ts` includes `amazonLink` and `flipkartLink` fields
- The Buy Now button prioritizes Flipkart links, falling back to Amazon if Flipkart is unavailable

### Design System

Tailwind is configured with a **custom design token system** using CSS variables:
- Colors: `primary`, `accent`, `ink`, `body`, `muted`, `lines`, `paper`
- Typography: Custom heading sizes (`h1`, `h2`, `h3`) with Playfair Display font
- Spacing: Custom scale (`--space-*` variables)
- Breakpoints: `xs:360px`, `sm:600px`, `md:900px`, `lg:1200px`, `xl:1536px`

All design tokens are defined as CSS variables in `src/app.css` and referenced in `tailwind.config.js` using the `withOpacity` function for alpha channel support.

### Component Patterns

- Components use **named exports** (not default exports) except for route components
- Route components are default exported for lazy loading compatibility
- Type definitions use `readonly` for immutability
- Props are defined as TypeScript types with `Readonly<>` wrapper
- React element return types are explicitly typed as `ReactElement`

### Lazy Loading Strategy

All route components are lazy loaded via `React.lazy()` to optimize initial bundle size. The `AppRouter` component handles suspense boundaries with a custom `RouteSkeleton` fallback.

### Analytics

Analytics tracking is initialized in `main.tsx` via `initAnalytics()` and tracks page views on route changes. Implementation is in `src/lib/analytics.ts`.

### Accessibility

- Reduced motion preferences are detected via `useReducedMotionSafe` hook and stored in UI state
- Focus ring styles use a custom `focus` color token
- ARIA utilities available in `src/lib/a11y.ts`

## Type Definitions

Core domain types are in `src/types/`:
- `product.ts`: Product, ProductCollection, ProductLinks
- `cart.ts`: CartItem (note: separate from store definition)
- `order.ts`: Order and checkout types
- `cms.ts`: Content types

## Key Files to Understand

- `src/AppRouter.tsx`: Custom routing implementation
- `src/AppProviders.tsx`: Provider composition (Query Client, Helmet, Toast)
- `src/store/cart.ts`: Cart state management with persistence
- `tailwind.config.js`: Design system configuration
- `src/lib/analytics.ts`: Analytics event tracking
- `src/lib/seo.ts`: SEO utilities and meta tag helpers

## Import Aliases

The `@/` alias maps to `src/` directory (configured in `vite.config.ts` and `tsconfig.app.json`).

## ESLint Configuration

ESLint is configured with:
- TypeScript ESLint
- React hooks rules
- React refresh plugin
- JSX a11y for accessibility
- Import ordering rules
- Tailwind CSS class ordering
- Prettier integration

## Environment Setup

No `.env` file is currently required. The project uses static data and doesn't connect to external APIs yet.

## Testing

No test framework is currently configured in this project.

## Browser Support

Targets modern browsers via Vite's default esbuild configuration. Check `package.json` `browserslist` if specific support is needed.
