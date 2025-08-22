import { Environment, Network, RecordSource, Store, type FetchFunction } from 'relay-runtime';

const fetchGraphQL: FetchFunction = async (request, variables) => {
  const token = localStorage.getItem('token');

  const resp = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query: request.text, variables }),
  });

  // If error 429 (or other), Relay exhibits in graphql format:
  if (!resp.ok) {
    const text = await resp.text();
    return { errors: [{ message: `HTTP ${resp.status}: ${text}` }] } as any;
  }

  try {
    return await resp.json();
  } catch (e) {
    return { errors: [{ message: 'Resposta inválida do servidor.' }] } as any;
  }
};

export default new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource()),
});
