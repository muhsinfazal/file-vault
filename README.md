# File Vault (React + Rails monolith, API-style)

A minimal file vault system that lets verified users upload large/sensitive files, list privately, delete, and share publicly via tiny URL. Text-like files are gzipped on upload to save space.

## Tech-stack
- Rails 7, PostgreSQL
- Devise (email/password)
- Active Storage (local disk; can swap to S3 in prod)
- React + Vite

## Features
- Sign up, sign in, sign out.
- Private list of your files.
- Upload (title, description, file). Detects MIME via Marcel. If content-type starts with `text/` or is `application/json`, stored as `application/gzip` with `.gz` suffix.
- Delete a file you own.
- Public tiny URL (`/p/:token`) to share your file. You can rotate the token.

## Local setup
```bash
git clone https://github.com/muhsinfazal/file-vault
cd file-vault
bin/setup    # Installs gems, JS packages, prepares DB
bin/dev      # Runs Rails + Vite
```
Note: Use `chmod +x bin/*` if `bin` doesn’t have executable permission yet.

## App
Head over to http://localhost:3000/ to access the app.
