export interface QueryResult {
  result: string;
  agents_used: string[];
  plan: any;
  session_id: string;
  extracted_data?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  queryResult?: QueryResult;
  processingTime?: number;
}

export interface ExampleQuery {
  id: string;
  text: string;
  icon: string;
}
