# Crowe Logic CLI integration

This repo includes a backend wrapper for the Crowe Logic CLI at:

`services/crowe-logic-cli-api`

## Why a separate service

The CLI is a Python application with local configuration and model credentials. A dedicated service isolates CLI execution and keeps keys off the browser.

## Deployment

Deploy the service separately (Railway, Fly, Azure App Service, or a VM). Set environment variables as needed:

- `CROWELOGIC_CONFIG_PATH`
- `CROWELOGIC_WORKDIR`
- `CROWELOGIC_CLI_TIMEOUT`

## Next.js usage

Point the web app to the service using an environment variable:

- `NEXT_PUBLIC_CROWELOGIC_CLI_API_URL`

Your UI can call `POST /chat`, `POST /agent`, and `POST /doctor`.
