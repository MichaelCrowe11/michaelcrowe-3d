type CroweLogicCliResponse = {
  output: string;
};

const baseUrl = process.env.NEXT_PUBLIC_CROWELOGIC_CLI_API_URL;

if (!baseUrl) {
  // Keep this as a runtime check so local dev does not silently fail.
  console.warn('NEXT_PUBLIC_CROWELOGIC_CLI_API_URL is not set');
}

async function post<T>(path: string, payload: unknown): Promise<T> {
  if (!baseUrl) {
    throw new Error('Crowe Logic CLI API URL is not configured');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Crowe Logic CLI request failed');
  }

  return response.json() as Promise<T>;
}

export async function runCroweLogicChat(prompt: string, system?: string): Promise<CroweLogicCliResponse> {
  return post<CroweLogicCliResponse>('/chat', { prompt, system });
}

export async function runCroweLogicAgent(agent: string, prompt: string, filePath?: string, system?: string): Promise<CroweLogicCliResponse> {
  return post<CroweLogicCliResponse>('/agent', { agent, prompt, file_path: filePath, system });
}

export async function runCroweLogicDoctor(): Promise<CroweLogicCliResponse> {
  return post<CroweLogicCliResponse>('/doctor', {});
}
