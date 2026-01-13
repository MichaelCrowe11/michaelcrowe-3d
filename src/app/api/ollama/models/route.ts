import { NextRequest } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch models from Ollama' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const models: OllamaModel[] = data.models || [];

    // Format models with friendly names and metadata
    const formattedModels = models.map((model: OllamaModel) => ({
      id: model.name,
      name: formatModelName(model.name),
      size: formatSize(model.size),
      family: model.details?.family || 'unknown',
      parameters: model.details?.parameter_size || 'unknown',
      quantization: model.details?.quantization_level || 'unknown',
      modified: model.modified_at,
    }));

    return new Response(
      JSON.stringify({ models: formattedModels }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Ollama models error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to connect to Ollama',
        models: getDefaultModels(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function formatModelName(name: string): string {
  // Convert model name to friendly display name
  const cleanName = name.replace(':latest', '').replace(/-/g, ' ');
  return cleanName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getDefaultModels() {
  return [
    { id: 'llama3.2', name: 'Llama 3.2', size: '~2GB', family: 'llama', parameters: '3B' },
    { id: 'llama3.2:1b', name: 'Llama 3.2 1B', size: '~1GB', family: 'llama', parameters: '1B' },
    { id: 'mistral', name: 'Mistral', size: '~4GB', family: 'mistral', parameters: '7B' },
    { id: 'codellama', name: 'Code Llama', size: '~4GB', family: 'llama', parameters: '7B' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', size: '~4GB', family: 'deepseek', parameters: '6.7B' },
  ];
}

export async function POST(request: NextRequest) {
  // Pull a model
  try {
    const { model } = await request.json();

    if (!model) {
      return new Response(
        JSON.stringify({ error: 'Model name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: model }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to pull model' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the pull progress
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Ollama pull error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to pull model from Ollama' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
