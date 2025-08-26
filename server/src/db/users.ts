export type User = { id: number; email: string; password: string };


//Example of database for authentication
export const users: User[] = [
  { id: 1, email: 'test@example.com', password: 'password123' },
];
