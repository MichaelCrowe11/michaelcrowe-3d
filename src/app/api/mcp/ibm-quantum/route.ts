import { NextRequest, NextResponse } from 'next/server';

// IBM Quantum API integration
const IBM_QUANTUM_API_KEY = process.env.IBM_QUANTUM_API_KEY;
const IBM_QUANTUM_URL = 'https://api.quantum-computing.ibm.com';

// MCP Protocol types
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string };
}

// IBM Quantum tool definitions
const QUANTUM_TOOLS = [
  {
    name: 'list_backends',
    description: 'List available IBM Quantum backends (quantum computers and simulators)',
    inputSchema: {
      type: 'object',
      properties: {
        operational: { type: 'boolean', description: 'Only show operational backends' },
        simulator: { type: 'boolean', description: 'Include simulators' },
      },
    },
  },
  {
    name: 'get_backend_status',
    description: 'Get the current status of a specific quantum backend',
    inputSchema: {
      type: 'object',
      properties: {
        backend: { type: 'string', description: 'Backend name (e.g., ibm_brisbane)' },
      },
      required: ['backend'],
    },
  },
  {
    name: 'get_backend_properties',
    description: 'Get detailed properties and calibration data for a backend',
    inputSchema: {
      type: 'object',
      properties: {
        backend: { type: 'string', description: 'Backend name' },
      },
      required: ['backend'],
    },
  },
  {
    name: 'submit_circuit',
    description: 'Submit a quantum circuit for execution (OpenQASM 3.0)',
    inputSchema: {
      type: 'object',
      properties: {
        backend: { type: 'string', description: 'Backend to run on' },
        qasm: { type: 'string', description: 'OpenQASM 3.0 circuit code' },
        shots: { type: 'number', description: 'Number of shots (default 1024)' },
        name: { type: 'string', description: 'Job name (optional)' },
      },
      required: ['backend', 'qasm'],
    },
  },
  {
    name: 'get_job_status',
    description: 'Check the status of a submitted quantum job',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', description: 'Job ID from submit_circuit' },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'get_job_results',
    description: 'Get results from a completed quantum job',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', description: 'Job ID' },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'estimate_cost',
    description: 'Estimate the cost/time for running a circuit on a backend',
    inputSchema: {
      type: 'object',
      properties: {
        backend: { type: 'string', description: 'Backend name' },
        shots: { type: 'number', description: 'Number of shots' },
        circuits: { type: 'number', description: 'Number of circuits' },
      },
      required: ['backend'],
    },
  },
];

async function executeQuantumTool(
  name: string,
  args: Record<string, unknown>,
  apiKey: string | null
): Promise<{ content: Array<{ type: string; text: string }> }> {
  if (!apiKey) {
    // Return simulated data when not configured
    return getSimulatedResponse(name, args);
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    switch (name) {
      case 'list_backends': {
        const { operational = true, simulator = true } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/backends`, { headers });
        const data = await res.json();

        let backends = data.backends || [];

        if (operational) {
          backends = backends.filter((b: { status?: string }) => b.status === 'online');
        }
        if (!simulator) {
          backends = backends.filter((b: { simulator?: boolean }) => !b.simulator);
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              backends: backends.map((b: Record<string, unknown>) => ({
                name: b.name,
                qubits: b.n_qubits,
                status: b.status,
                simulator: b.simulator,
                version: b.version,
              })),
            }),
          }],
        };
      }

      case 'get_backend_status': {
        const { backend } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/backends/${backend}/status`, { headers });
        const data = await res.json();

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              backend: backend,
              status: data.state || 'unknown',
              pending_jobs: data.pending_jobs,
              status_msg: data.status_msg,
            }),
          }],
        };
      }

      case 'get_backend_properties': {
        const { backend } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/backends/${backend}/properties`, { headers });
        const data = await res.json();

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              backend: backend,
              qubits: data.qubits?.length || 0,
              gates: data.gates?.length || 0,
              last_update: data.last_update_date,
              t1_avg: calculateAverage(data.qubits, 'T1'),
              t2_avg: calculateAverage(data.qubits, 'T2'),
            }),
          }],
        };
      }

      case 'submit_circuit': {
        const { backend, qasm, shots = 1024, name: jobName } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/jobs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            backend: String(backend),
            qasm: String(qasm),
            shots: Number(shots),
            name: jobName ? String(jobName) : undefined,
          }),
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              jobId: data.id,
              backend: backend,
              status: 'queued',
              message: 'Circuit submitted successfully',
            }),
          }],
        };
      }

      case 'get_job_status': {
        const { jobId } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/jobs/${jobId}`, { headers });
        const data = await res.json();

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              jobId: data.id,
              status: data.status,
              backend: data.backend,
              created: data.created,
              running: data.running,
              completed: data.completed,
              queue_position: data.queue_position,
            }),
          }],
        };
      }

      case 'get_job_results': {
        const { jobId } = args;

        const res = await fetch(`${IBM_QUANTUM_URL}/api/jobs/${jobId}/results`, { headers });
        const data = await res.json();

        if (data.status !== 'completed') {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                error: 'Job not completed',
                status: data.status,
              }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              jobId: jobId,
              results: data.results,
              counts: data.results?.[0]?.counts,
              shots: data.shots,
            }),
          }],
        };
      }

      case 'estimate_cost': {
        const { backend, shots = 1024, circuits = 1 } = args;

        // Rough estimation based on typical queue times and pricing
        const estimatedSeconds = Number(circuits) * (Number(shots) / 100);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              backend: backend,
              shots: shots,
              circuits: circuits,
              estimated_time_seconds: estimatedSeconds,
              estimated_queue_minutes: 5, // Typical queue time
              note: 'Actual time depends on queue length and circuit complexity',
            }),
          }],
        };
      }

      default:
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` }),
          }],
        };
    }
  } catch (err) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: String(err) }),
      }],
    };
  }
}

function calculateAverage(qubits: Array<Array<{ name: string; value: number }>>, property: string): number | null {
  if (!qubits?.length) return null;

  const values = qubits
    .flatMap((q) => q.filter((p) => p.name === property).map((p) => p.value))
    .filter((v) => typeof v === 'number' && !isNaN(v));

  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function getSimulatedResponse(
  name: string,
  args: Record<string, unknown>
): { content: Array<{ type: string; text: string }> } {
  switch (name) {
    case 'list_backends':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            backends: [
              { name: 'ibm_brisbane', qubits: 127, status: 'online', simulator: false },
              { name: 'ibm_kyoto', qubits: 127, status: 'online', simulator: false },
              { name: 'ibm_osaka', qubits: 127, status: 'online', simulator: false },
              { name: 'ibmq_qasm_simulator', qubits: 32, status: 'online', simulator: true },
            ],
            note: 'Simulated data - configure IBM_QUANTUM_API_KEY for live data',
          }),
        }],
      };

    case 'get_backend_status':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            backend: args.backend || 'unknown',
            status: 'online',
            pending_jobs: 42,
            status_msg: 'Active',
            note: 'Simulated data',
          }),
        }],
      };

    case 'get_backend_properties':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            backend: args.backend || 'unknown',
            qubits: 127,
            gates: 1200,
            t1_avg: 150.5,
            t2_avg: 75.2,
            note: 'Simulated data',
          }),
        }],
      };

    case 'submit_circuit':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: 'Cannot submit circuits without IBM Quantum API key',
            message: 'Configure IBM_QUANTUM_API_KEY to submit real jobs',
          }),
        }],
      };

    default:
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: 'IBM Quantum API not configured',
            message: 'Set IBM_QUANTUM_API_KEY for full functionality',
          }),
        }],
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json();
    const { id, method, params } = body;

    let response: MCPResponse;

    switch (method) {
      case 'initialize':
        response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'ibm-quantum-mcp',
              version: '1.0.0',
            },
            capabilities: { tools: {} },
          },
        };
        break;

      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          id,
          result: { tools: QUANTUM_TOOLS },
        };
        break;

      case 'tools/call':
        const toolName = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown>;
        const toolResult = await executeQuantumTool(toolName, toolArgs, IBM_QUANTUM_API_KEY ?? null);
        response = {
          jsonrpc: '2.0',
          id,
          result: toolResult,
        };
        break;

      default:
        response = {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('IBM Quantum MCP error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: 'Internal error' },
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ibm-quantum-mcp',
    configured: !!IBM_QUANTUM_API_KEY,
    tools: QUANTUM_TOOLS.map((t) => t.name),
    mode: IBM_QUANTUM_API_KEY ? 'live' : 'simulated',
  });
}
