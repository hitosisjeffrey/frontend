
// Define the User type
export interface User {
  id: number;
  name: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  created_by: number;
  created_at: string;
  updated_at: string;
  user: User;
}
