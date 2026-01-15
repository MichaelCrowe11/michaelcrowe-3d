from __future__ import annotations

import os
import subprocess
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Crowe Logic CLI API", version="0.1.0")

DEFAULT_TIMEOUT = int(os.getenv("CROWELOGIC_CLI_TIMEOUT", "120"))
WORKDIR = os.getenv("CROWELOGIC_WORKDIR", os.getcwd())
CONFIG_PATH = os.getenv("CROWELOGIC_CONFIG_PATH")


class ChatRequest(BaseModel):
    prompt: str
    system: Optional[str] = None


class AgentRequest(BaseModel):
    agent: str
    prompt: str
    file_path: Optional[str] = None
    system: Optional[str] = None


def _run_cli(args: list[str]) -> str:
    env = os.environ.copy()
    if CONFIG_PATH:
        env["CROWELOGIC_CONFIG_PATH"] = CONFIG_PATH
    try:
        completed = subprocess.run(
            args,
            cwd=WORKDIR,
            env=env,
            capture_output=True,
            text=True,
            timeout=DEFAULT_TIMEOUT,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(status_code=504, detail="CLI command timed out") from exc

    if completed.returncode != 0:
        message = completed.stderr.strip() or "CLI command failed"
        raise HTTPException(status_code=500, detail=message)

    return completed.stdout.strip()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest) -> dict[str, str]:
    args = ["crowelogic", "chat", "run", request.prompt]
    if request.system:
        args.extend(["-s", request.system])
    output = _run_cli(args)
    return {"output": output}


@app.post("/agent")
def agent(request: AgentRequest) -> dict[str, str]:
    if not request.agent:
        raise HTTPException(status_code=400, detail="agent is required")
    args = ["crowelogic", "agent", "run", request.agent, request.prompt]
    if request.file_path:
        args.extend(["-f", request.file_path])
    if request.system:
        args.extend(["-s", request.system])
    output = _run_cli(args)
    return {"output": output}


@app.post("/doctor")
def doctor() -> dict[str, str]:
    output = _run_cli(["crowelogic", "doctor", "run"])
    return {"output": output}
