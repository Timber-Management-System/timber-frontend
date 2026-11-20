# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Use **Security → Report a vulnerability** on this repository (private vulnerability reporting). Only the maintainers can see the report.

## Rules for contributors

- Never commit secrets: passwords, API keys, tokens or `.env.local`.
- Never download or run files linked in issues, comments or PRs from people outside the team, even if they look like a "fix".
- Don't add a new npm package without admin approval. Check its age, weekly downloads, maintainer and exact spelling first.
- Don't remove the security settings in `.npmrc` or `.github/workflows/`.
- Turn on two-factor authentication (2FA) on your GitHub account.
