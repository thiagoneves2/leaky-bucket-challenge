import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from 'relay-runtime';

const fetchGraphQL: FetchFunction = async (request, variables) => {
  const token = localStorage.getItem('token');
  const resp = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query: request.text, variables })
  });
  return resp.json();
};

export default new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource())
});
