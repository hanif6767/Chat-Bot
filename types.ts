
export type MessageRole = 'user' | 'model';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
}
