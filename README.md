# Clocktower Ledger Pro

A comprehensive web application for tracking and managing Clocktower (Blood on the Clocktower) game sessions, built with React, TypeScript, and Tailwind CSS.

## Features

- **Player Management**: Track player information, status, and roles
- **Vote Ledger**: Record and analyze voting patterns with interactive clock pickers
- **Death Ledger**: Log player deaths with reasons and notes
- **Role Management**: Organize and track character roles and distributions
- **Notes System**: Keep detailed social reads and game observations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Automatic local storage of all game data

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
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **State Management**: React hooks (useState, useMemo, useCallback)

## Development Rules

### Component Organization
- **Ledger Components** (`src/components/ledger/`): Core data display components like PlayerGrid, VoteLedger, DeathLedger
- **Pickers** (`src/components/pickers/`): Interactive selection components (RotaryPicker, ClockPicker)
- **Tabs** (`src/components/tabs/`): Content components for each main tab
- **UI Components** (`src/components/ui/`): Reusable UI elements, popups, and overlays

### Styling Guidelines
- Use Tailwind CSS utility classes exclusively
- Maintain the "dark/slate" aesthetic for headers and sidebars
- Ensure mobile-responsive design with Tailwind's responsive prefixes
- Keep components small and focused (under 100 lines where possible)

### Best Practices
- Use toasts for important user feedback
- Avoid try/catch blocks for general logic to allow errors to bubble up
- Keep the "Ledger" aesthetic: compact, high-density information, and monospaced fonts for numerical data

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

## Usage

- Click on player numbers to open detailed player info popups
- Use the day controls to navigate through game days
- Add nominations and deaths using the FAB (Floating Action Button)
- Track voting patterns with the interactive vote ledger
- Manage roles and distributions in the Roles tab
- Keep notes for social reads and observations

## Contributing

1. Follow the established component organization structure
2. Maintain TypeScript type safety
3. Use Tailwind CSS for all styling
4. Keep components modular and reusable
5. Test on both desktop and mobile devices

## License

This project is licensed under the MIT License.