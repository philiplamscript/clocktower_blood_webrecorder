# AI Rules & Project Guidelines

## Tech Stack
- **Framework**: React 18 with TypeScript for type-safe UI development.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for all layout, spacing, and component styling.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **UI Components**: Shadcn/UI (Radix UI primitives) for accessible, reusable components.
- **State Management**: React's built-in hooks (`useState`, `useMemo`, `useCallback`) for local and lifting state.
- **Navigation**: React Router for client-side routing.

## Development Rules

### 1. Styling & Layout
- Always use **Tailwind CSS** utility classes. Avoid writing custom CSS in `.css` files unless handling specific browser overrides (e.g., scrollbars, mobile Safari hacks).
- Ensure all designs are **mobile-responsive** using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- Maintain the "dark/slate" aesthetic established in the header and sidebars.

### 2. Component Structure
- Keep components small and focused (under 100 lines where possible).
- Store reusable UI pieces in `src/components/` and full views in `src/pages/`.
- Every new component or hook must reside in its own file.

### 3. Iconography
- Use **Lucide React** exclusively. Do not import other icon libraries to keep the bundle size small and the design language unified.

### 4. Data & State
- Define all shared interfaces and constants in `src/type.tsx`.
- Use `useMemo` for derived data (like filtering dead players) to optimize performance.
- When updating complex state (like arrays of objects), always use functional updates to ensure state consistency.

### 5. Best Practices
- Use **Toasts** for important user feedback (success/error).
- Avoid `try/catch` blocks for general logic to allow errors to bubble up during development for easier debugging.
- Keep the "Ledger" aesthetic: compact, high-density information, and monospaced fonts for numerical data.

## Project Structure

```
src/
├── components/
│   ├── ledger/           # Main ledger components
│   │   ├── PlayerGrid.tsx
│   │   ├── VoteLedger.tsx
│   │   └── DeathLedger.tsx
│   ├── pickers/          # Interactive picker components
│   │   ├── RotaryPicker/
│   │   │   ├── RotaryPicker.tsx
│   │   │   └── TextRotaryPicker.tsx
│   │   └── ClockPicker/
│   │       └── ClockPicker.tsx
│   ├── tabs/             # Tab content components
│   │   ├── PlayersTab.tsx
│   │   ├── VotesTab.tsx
│   │   ├── DeathsTab.tsx
│   │   ├── CharsTab.tsx
│   │   └── NotesTab.tsx
│   └── ui/               # UI components and popups
│       ├── popups/
│       │   ├── PlayerInfoPopup.tsx
│       │   ├── RoleSelectorPopup.tsx
│       │   ├── RoleUpdatePopup.tsx
│       │   └── ResetConfirmation.tsx
│       ├── VoteHistoryClock.tsx
│       └── FAB.tsx
├── type.tsx              # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles