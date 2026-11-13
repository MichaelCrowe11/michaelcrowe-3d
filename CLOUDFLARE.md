# Cloudflare deployment

This repository is being migrated from Vercel to Cloudflare Workers using vinext.

The `cloudflare:build` script runs the vinext compatibility check, initializes the Cloudflare Workers target non-destructively, and builds the app. The `cloudflare:deploy` script publishes the built Worker.

The Cloudflare Workers Build integration is configured for the `cloudflare/vinext-migration` branch while the first build is validated. The production hostname is not switched until the Worker build is successful and the DNS records have been checked.

Cloudflare migration reference:
https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/nextjs/
