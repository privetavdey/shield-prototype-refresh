# Provable Loader

A React application built from Figma designs.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

- `src/constants/` - Design system constants (colors, spacing, typography, etc.)
- `src/pages/` - Page components
- `src/App.tsx` - Main app component
- `src/main.tsx` - Entry point

## Design System

The project uses centralized design system constants from:
- `/src/constants/config.ts` - Core constants (COLORS, OPACITY, SPACING, BORDER_RADIUS, TYPOGRAPHY)
- `/src/constants/styles.ts` - Reusable component styles

All components should use these constants instead of hardcoded values to ensure consistency.

