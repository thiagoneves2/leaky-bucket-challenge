//Function for authentication (Get the bearer token)
export async function login(email: string, password: string) {
  const r = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error('Login failed');
  const data = await r.json();
  if (!data.token) throw new Error('No token');
  localStorage.setItem('token', data.token);
  return data.token;
}

export function logout() {
  localStorage.removeItem('token');
}
