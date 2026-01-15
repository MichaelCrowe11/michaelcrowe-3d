# Crowe Logic CLI API

A small FastAPI wrapper that executes the `crowelogic` CLI for use by the platform.

## Local run

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Environment

- `CROWELOGIC_CONFIG_PATH` - Optional path to `.crowelogic.toml`
- `CROWELOGIC_WORKDIR` - Optional working directory for CLI execution
- `CROWELOGIC_CLI_TIMEOUT` - Optional timeout in seconds (default: 120)

## Endpoints

- `GET /health`
- `POST /chat` `{ "prompt": "...", "system": "..." }`
- `POST /agent` `{ "agent": "name", "prompt": "...", "file_path": "...", "system": "..." }`
- `POST /doctor`
