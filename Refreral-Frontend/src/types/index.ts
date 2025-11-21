// types/index.ts
export type MessageType = 'user' | 'bot' | 'system' | 'error';

export interface Message {
  id: number;
  type: MessageType;
  content: string | Array<{
    name?: string;
    description?: string;
    sources?: Array<{
      file_name?: string;
      page_no?: number;
    }>;
  }>;
  timestamp: string;
  sources?: string[];
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  uploaded_at: string;
  type?: string;
  size?: string;
  status?: 'uploaded' | 'processing' | 'ready' | 'error';
  path?: string;
  domain?: string; // Add domain field
}

export type Domain = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};