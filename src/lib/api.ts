const API_BASE_URL = 'http://localhost:8000';

export interface QueryResponse {
  result?: string;
  agents_used?: string[];
  plan?: any;
  session_id?: string;
  selected_tools?: any;
  success?: boolean;
  error?: string;
  // Handle both approach response formats
  query?: string;
}

export interface ServerInfo {
  name: string;
  type: 'command' | 'http';
  description: string;
  tools_count: number;
  status: string;
  url?: string;
  command?: string;
}

export interface AgentInfo {
  name: string;
  display_name: string;
  description: string;
  capabilities: string[];
  requires_mcp: boolean;
  mcp_server?: string;
  source: 'code' | 'database';
  instructions?: string;
}

export interface AgentConfig {
  name: string;
  display_name: string;
  description: string;
  instructions: string;
  capabilities: string[];
  requires_mcp: boolean;
  mcp_server?: string;
}

export interface MCPServerConfig {
  name: string;
  type: 'command' | 'http';
  description?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string; // Changed from 'endpoint' to 'url'
}

class APIClient {
  async processQuery(query: string, session_id?: string, approach: 'approach1' | 'approach2' = 'approach2'): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id, approach }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to process query' }));
      throw new Error(error.detail || 'Failed to process query');
    }
    return response.json();
  }

  async createSession(approach: 'approach1' | 'approach2' = 'approach2'): Promise<{ session_id: string }> {
    const response = await fetch(`${API_BASE_URL}/sessions?approach=${approach}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  }

  async clearSession(session_id: string, approach: 'approach1' | 'approach2' = 'approach2'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clear-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, approach }),
    });
    if (!response.ok) throw new Error('Failed to clear session');
  }

  async listServers(): Promise<{ servers: string[]; details: Record<string, ServerInfo> }> {
    const response = await fetch(`${API_BASE_URL}/mcp-servers`);
    if (!response.ok) throw new Error('Failed to fetch servers');
    return response.json();
  }

  async addServer(data: MCPServerConfig): Promise<{ message: string; success: boolean }> {
    console.log('API Client sending:', data); // Debug log
    const response = await fetch(`${API_BASE_URL}/mcp-servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to add server' }));
      throw new Error(error.detail || 'Failed to add server');
    }
    return response.json();
  }

  async deleteServer(name: string): Promise<{ message: string; success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/mcp-servers/${name}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete server' }));
      throw new Error(error.detail || 'Failed to delete server');
    }
    return response.json();
  }

  async listAgents(): Promise<{ agents: string[]; details: Record<string, AgentInfo> }> {
    const response = await fetch(`${API_BASE_URL}/agents`);
    if (!response.ok) throw new Error('Failed to fetch agents');
    return response.json();
  }

  async addAgent(data: AgentConfig): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to add agent' }));
      throw new Error(error.detail || 'Failed to add agent');
    }
    return response.json();
  }

  async deleteAgent(name: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/agents/${name}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete agent' }));
      throw new Error(error.detail || 'Failed to delete agent');
    }
    return response.json();
  }
}

export const apiClient = new APIClient();