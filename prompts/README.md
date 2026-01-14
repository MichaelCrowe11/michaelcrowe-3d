# Agent Prompting Guide

This project maintains agent system prompts in the `prompts/` directory to ensure version control and syncing with ElevenLabs.

## Standard Prompt Format
Each prompt should follow this structure for consistency:
- Role
- Mission
- Inputs
- Operating Principles
- Safety and Compliance
- Workflow
- Output Style
- Escalation

## Workflow

1. Edit prompts in `prompts/`.
2. Map the file name to an environment variable in `scripts/sync-prompts.ts`.
3. Run the sync script:

```bash
export ELEVENLABS_API_KEY=your_key_here
npx tsx scripts/sync-prompts.ts
```

## Agent Files
- `prompts/sales-director.md`
- `prompts/cultivation.md`
- `prompts/ai-strategy.md`
- `prompts/extraction.md`
- `prompts/mycology-research.md`
- `prompts/computational-chemist.md`
- `prompts/drug-discovery.md`
