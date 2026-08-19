# Efatura Amigo

Frontend for **Efatura Amigo** — a dashboard to search Portuguese companies by NIF, backed by the [Efatura Amigo API](https://github.com/PedroS11/efatura-amigo-be).

## Features

- **Google sign-in** — authenticate with a Google account and store a JWT in `localStorage`
- **Company search** — look up companies by NIF/name with paginated results
- **Metadata overview** — indexed company counts, unprocessed queue size, and NIF.PT API credit usage


![Dashboard](./assets/dashboard.png)

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev and build
- [React Router](https://reactrouter.com/) for routing
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) components
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) for authentication
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting and formatting

## Prerequisites

- Node.js 22+
- Yarn (or npm)
- A Google OAuth client ID
- Access to the Efatura Amigo API

## Getting started

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=__VITE_API_URL__
```

| Variable | Description |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID for the sign-in button |
| `VITE_API_URL` | Base URL of the Efatura Amigo API |

### 3. Run the dev server

```bash
yarn dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Run ESLint with auto-fix |
| `yarn format` | Format the codebase with Prettier |
| `yarn format:check` | Check formatting without writing files |

## Project structure

```
src/
├── main.tsx              # App entry, routing, providers
├── Login.tsx             # Google sign-in page
├── Dashboard.tsx         # Search UI, metadata, results
├── Footer.tsx
├── components/ui/        # shadcn/ui components
└── lib/
    ├── api/
    │   ├── apiFetch.ts   # Authenticated fetch wrapper
    │   ├── getMetadata.ts
    │   └── searchCompanies.ts
    └── utils.ts
```

## API

All requests send `Authorization: Bearer <idToken>` using the Google credential stored at login.

| Endpoint | Used for |
| --- | --- |
| `GET /api/metadata` | Dashboard stats (company counts, NIF.PT credits) |
| `GET /api/search?query=&page=` | Paginated company search |

On `401` or `403`, the app shows a session-expired message and redirects to `/`.

## Build for production

```bash
yarn build
```

Output is written to `dist/`. Serve it with any static host, or preview locally:

```bash
yarn preview
```
