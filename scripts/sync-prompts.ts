import fs from 'fs/promises';
import path from 'path';

/**
 * Syncs prompts from local markdown files to ElevenLabs Agents API.
 * 
 * Usage: 
 *   export ELEVENLABS_API_KEY=sk_...
 *   npx tsx scripts/sync-prompts.ts
 */

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');

// Mapping of filename (without .md) to Environment Variable Name for Agent ID
const AGENT_ENV_MAPPING: Record<string, string> = {
  'sales-director': 'NEXT_PUBLIC_ELEVEN_LABS_SALES_AGENT',
  'cultivation': 'NEXT_PUBLIC_ELEVEN_LABS_CULTIVATION_AGENT',
  'ai-strategy': 'NEXT_PUBLIC_ELEVEN_LABS_AI_STRATEGY_AGENT',
  'extraction': 'NEXT_PUBLIC_ELEVEN_LABS_EXTRACTION_AGENT',
  'mycology-research': 'NEXT_PUBLIC_ELEVEN_LABS_MYCOLOGY_AGENT',
};

async function syncPrompts() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY is not set.');
    process.exit(1);
  }

  console.log('🔄 Syncing prompts to ElevenLabs...');

  try {
    const files = await fs.readdir(PROMPTS_DIR);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const agentKey = file.replace('.md', '');
      const envVarName = AGENT_ENV_MAPPING[agentKey];
      
      // We need to support loading .env.local if not present in process.env
      // But for now assume they are loaded or we can't find the ID.
      // In a real script we might use dotenv.
      
      // For this script to work, we'll try to read the ID from the file content if possible, 
      // or just warn if we can't find it.
      // Better yet, let's look for the ID in the arguments or just log what we WOULD do 
      // if we don't have the map loaded from .env in this context.
      
      // Let's assume the user runs this with `dotenv -e .env.local -- npx tsx ...`
      const agentId = process.env[envVarName];

      if (!agentId) {
        console.warn(`⚠️  Skipping ${file}: No Agent ID found in env var ${envVarName}`);
        continue;
      }

      const promptContent = await fs.readFile(path.join(PROMPTS_DIR, file), 'utf-8');
      
      console.log(`📤 Updating Agent ${agentKey} (${agentId})...`);

      const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
        method: 'PATCH',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_config: {
            agent: {
              prompt: {
                prompt: promptContent
              }
            }
          }
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Failed to update ${agentKey}: ${err}`);
      } else {
        console.log(`✅ Successfully updated ${agentKey}`);
      }
    }

  } catch (error) {
    console.error('❌ Error syncing prompts:', error);
  }
}

syncPrompts();
