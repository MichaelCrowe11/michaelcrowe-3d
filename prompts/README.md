# Agent Prompting Guide

This project maintains agent system prompts in the `prompts/` directory to ensure version control and syncing with ElevenLabs.

## Workflow

1.  **Edit Prompts**: Modify the markdown files in `prompts/`.
    *   `prompts/sales-director.md`
    *   `prompts/cultivation.md`
2.  **Sync to ElevenLabs**: Run the sync script.
    ```bash
    export ELEVENLABS_API_KEY=your_key_here
    npx tsx scripts/sync-prompts.ts
    ```

## Adding New Agents

1.  Create a new `[agent-id].md` file in `prompts/`.
2.  Add the mapping in `scripts/sync-prompts.ts` linking the ID to the environment variable containing the ElevenLabs Agent ID.
3.  Run the sync script.
