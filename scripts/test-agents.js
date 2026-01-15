#!/usr/bin/env node

/**
 * Agent Interface Development Utility
 * 
 * This script helps developers test and preview agent-specific interfaces
 * during development without needing full authentication or backend setup.
 */

const fs = require('fs');
const path = require('path');

// Load agent configs
const configPath = path.join(__dirname, '../src/config/agentInterfaces.ts');

console.log('🤖 Agent Interface Development Utility\n');
console.log('=====================================\n');

// Parse and display available agents
console.log('Available Agent Interfaces:\n');

const agentIds = [
  'cultivation',
  'sales-director',
  'ai-strategy',
  'extraction',
  'mycology-research',
  'computational-chemist',
  'drug-discovery'
];

agentIds.forEach((id, index) => {
  console.log(`${index + 1}. ${id}`);
});

console.log('\n📝 To test an agent interface:');
console.log('   1. Start the dev server: npm run dev');
console.log('   2. Navigate to http://localhost:3000');
console.log('   3. Click "Start Deep Dive"');
console.log('   4. Select the agent you want to test\n');

console.log('🎨 To customize an agent interface:');
console.log('   1. Edit src/config/agentInterfaces.ts');
console.log('   2. Modify theme colors, suggested topics, or features');
console.log('   3. Changes will hot-reload automatically\n');

console.log('🔧 Configuration file location:');
console.log(`   ${configPath}\n`);

console.log('📚 Documentation:');
console.log('   See docs/ELEVENLABS_FORKS.md for more information\n');

// Validate configuration file exists
if (!fs.existsSync(configPath)) {
  console.error('❌ Error: Agent interface configuration file not found!');
  console.error(`   Expected: ${configPath}`);
  process.exit(1);
}

console.log('✅ Configuration file found and ready\n');

// Check if components exist
const componentPaths = [
  '../src/components/agents/interfaces/CustomVoiceConversation.tsx',
  '../src/components/agents/interfaces/CustomStatusOrb.tsx',
  '../src/components/agents/interfaces/CustomSuggestedTopics.tsx'
];

console.log('📦 Component Status:\n');

let allComponentsExist = true;
componentPaths.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  const name = path.basename(relPath);
  console.log(`   ${status} ${name}`);
  if (!exists) allComponentsExist = false;
});

console.log();

if (!allComponentsExist) {
  console.error('❌ Error: Some components are missing!');
  console.error('   Run: npm install or check component paths');
  process.exit(1);
}

console.log('🚀 All components ready! Start development with: npm run dev\n');
