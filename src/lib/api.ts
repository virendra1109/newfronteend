const API_BASE_URL = 'http://localhost:8000';
const APPROACH1_URL = 'http://localhost:8001';  // Approach 1 backend URL
const APPROACH2_URL = 'http://localhost:8000';  // Approach 2 backend URL

export interface QueryResponse {
  result: string;
  agents_used: string[];
  plan: any;
  session_id: string;
  extracted_data?: any;
}

export interface ServerInfo {
  name: string;
  type: 'command' | 'http';
  description: string;
  tools_count: number;
  status: string;
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
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approach }),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  }

  async clearSession(session_id: string, approach: 'approach1' | 'approach2' = 'approach2'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sessions/${session_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approach }),
    });
    if (!response.ok) throw new Error('Failed to clear session');
  }

  async getSessionHistory(session_id: string, approach: 'approach1' | 'approach2' = 'approach2'): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sessions/${session_id}?approach=${approach}`);
    if (!response.ok) throw new Error('Failed to get session history');
    return response.json();
  }

  async listSessions(approach: 'approach1' | 'approach2' = 'approach2'): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sessions?approach=${approach}`);
    if (!response.ok) throw new Error('Failed to list sessions');
    return response.json();
  }

  async listServers(): Promise<{ servers: string[]; details: Record<string, ServerInfo> }> {
    const response = await fetch(`${API_BASE_URL}/mcp-servers`);
    if (!response.ok) throw new Error('Failed to fetch servers');
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
