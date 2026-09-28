# Environment Variables Reference

| Variable Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `3000` | Port on which the HTTP server listens. |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`). |
| `APP_URL` | Yes | `https://couponbeee.org` | Base URL used to resolve canonical tags and sitemaps. |
| `DATABASE_URL` | No | (In-Memory default) | PostgreSQL connection string for Prisma ORM. |
| `GEMINI_API_KEY` | Optional | `""` | Gemini API key for automated editorial review. |
| `ADMIN_SESSION_SECRET` | Recommended in prod | `""` | Secret key for administrative JWT/session encryption. |

Ensure no secrets or database credentials are ever committed to version control.
