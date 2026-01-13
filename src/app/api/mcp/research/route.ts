
import { NextRequest, NextResponse } from 'next/server';

// Constants
const SEARCH_PROVIDER = 'tavily'; // Default provider

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

// Tool definitions
const TOOLS = [
  {
    name: "search_web",
    description: "Search the web for information using a search engine",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query" },
        max_results: { type: "number", description: "Maximum number of results (default 5)" },
        include_domains: { type: "array", items: { type: "string" }, description: "Specific domains to search" },
      },
      required: ["query"],
    },
  },
  {
    name: "scrape_url",
    description: "Extract text content from a specific URL",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL to scrape" },
      },
      required: ["url"],
    },
  },
];

async function executeResearchTool(
  name: string,
  args: Record<string, unknown>,
  apiKey: string | null
): Promise<{ content: Array<{ type: string; text: string }> }> {
  if (!apiKey) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Configuration Error',
          message: 'TAVILY_API_KEY is not configured.',
        }),
      }],
    };
  }

  try {
    switch (name) {
      case "search_web": {
        const { query, max_results = 5, include_domains } = args;
        
        // Tavily API implementation
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // Tavily uses Bearer auth mostly, or api_key in body
          },
          body: JSON.stringify({
            query,
            max_results,
            include_domains,
            api_key: apiKey, // Some endpoints take it here
          }),
        });

        if (!response.ok) {
           return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: `Search failed: ${response.statusText}` }),
            }],
          };
        }

        const data = await response.json();
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(data.results || data, null, 2),
          }],
        };
      }

      case "scrape_url": {
        // Placeholder for scraping logic or using Tavily's extract capability if available
        // For now, let's mock a simple fetch-text capability which is useful but brittle
        // In production, use a dedicated scraper API like FireCrawl or Tavily Extract
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ 
              message: "Direct scraping not implemented in this version. Use search_web to find summaries." 
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
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
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
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'research-mcp',
              version: '1.0.0',
            },
            capabilities: { tools: {} },
          },
        });

      case 'tools/list':
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: { tools: TOOLS },
        });

      case 'tools/call':
        const toolName = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown>;
        const apiKey = process.env.TAVILY_API_KEY || null; // Lazy load
        
        const result = await executeResearchTool(toolName, toolArgs, apiKey);
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result,
        });

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: "Method not found" },
        });
    }
  } catch (error) {
    console.error('Research MCP Error:', error);
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
    service: 'research-mcp',
    configured: !!process.env.TAVILY_API_KEY,
    tools: TOOLS.map(t => t.name),
  });
}
