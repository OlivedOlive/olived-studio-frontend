# olived-studio-frontend

OLIVED Studio website. Setup is in the [main README](../README.md).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the site on port 3100 |
| `npm run build` | Builds for production |
| `npm run lint` | Checks the code |
| `npm run typecheck` | Checks the types |

Copy `.env.example` to `.env.local` if the backend is not on `http://localhost:4100`.

## How it fits together

- Pages behind login are in `src/app/(studio)`. They read data with `apiGet` in `src/lib/api.ts`,
  which sends the visitor to `/login` if their session has ended.
- Forms send changes with `postJson` in `src/lib/post.ts`. Requests to `/api` go to the backend, so the
  browser only ever talks to this site.
- `src/components/LabelPreview.tsx` is a placeholder for the real editor.
- Security headers are in `next.config.ts`. Allow a third-party editor's origin there when you add one.
