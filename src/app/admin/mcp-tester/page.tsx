'use client';

import { useState } from 'react';

type MCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

const MCP_SERVICES = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'crm', name: 'HubSpot CRM' },
  { id: 'research', name: 'Research' },
  { id: 'calendar', name: 'Calendar' },
];

export default function MCPTester() {
  const [selectedService, setSelectedService] = useState(MCP_SERVICES[0].id);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolArgs, setToolArgs] = useState<string>('{}');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load tools when service changes
  const fetchTools = async (service: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mcp/${service}`, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'init-1',
          method: 'tools/list',
        }),
      });
      const data = await res.json();
      if (data.result?.tools) {
        setTools(data.result.tools);
        setSelectedTool(data.result.tools[0]?.name || '');
      } else {
        setTools([]);
      }
    } catch (err) {
      setOutput(`Error listing tools: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const executeTool = async () => {
    setLoading(true);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgs);
      } catch {
        throw new Error('Invalid JSON in arguments');
      }

      const res = await fetch(`/api/mcp/${selectedService}`, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'call-1',
          method: 'tools/call',
          params: {
            name: selectedTool,
            arguments: parsedArgs,
          },
        }),
      });
      
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setOutput(`Error executing tool: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white p-8 font-mono cursor-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d4a15f] to-[#6fd6cc] bg-clip-text text-transparent">
            MCP Debugger
          </h1>
          <div className="text-xs text-white/40">Crowe Logic</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Service</label>
              <select 
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  fetchTools(e.target.value);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#d4a15f]/50"
              >
                {MCP_SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Tool</label>
              <select 
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#d4a15f]/50"
              >
                {tools.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchTools(selectedService)}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              Refresh Tools
            </button>
          </div>

          {/* Main Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Arguments (JSON)</label>
              <textarea
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                className="w-full h-32 bg-[#0b0c0f] border border-white/10 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a15f]/50"
                placeholder="{}"
              />
            </div>

            <button
              onClick={executeTool}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#d4a15f] to-[#6fd6cc] rounded-lg font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Run Tool'}
            </button>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Output</label>
              <div className="w-full h-96 bg-[#0a0a0c] border border-white/10 rounded-lg p-4 overflow-auto">
                <pre className="text-xs text-green-400 whitespace-pre-wrap">
                  {output || '// Waiting for execution...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
