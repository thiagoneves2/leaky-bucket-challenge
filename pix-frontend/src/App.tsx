import React, { useState } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import environment from './RelayEnviroment';
import { useSendPix } from './mutations/SendPixMutation';
import { login, logout } from './api/auth';

export default function App() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [pixKey, setPixKey] = useState('');
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const { commit, inFlight } = useSendPix();

  const doLogin = async () => {
    try {
      setErr(''); await login(email, password); setMsg('Login OK');
    } catch (e: any) { setErr(e.message ?? String(e)); }
  };

  const doLogout = () => { logout(); setMsg('Saiu'); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setMsg('');
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) { setErr('Valor inválido'); return; }
    if (!pixKey.trim()) { setErr('Informe a pix key'); return; }

    commit({
      variables: { pixKey, value: n },
      onCompleted: (resp) => setMsg(resp.sendPix ?? 'OK'),
      onError: (e) => setErr(e.message),
    });
  };

  return (
    <RelayEnvironmentProvider environment={environment}>
      <div style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h1>Pix Demo (React + Relay)</h1>

        <section style={{ padding: 16, border: '1px solid #ddd', borderRadius: 12, marginBottom: 20 }}>
          <h2>Login</h2>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button onClick={doLogin}>Login</button>
            <button onClick={doLogout} disabled={!token}>Logout</button>
            <span style={{ marginLeft:'auto', opacity:.7 }}>Token: {token ? '✅' : '❌'}</span>
          </div>
        </section>

        <section style={{ padding: 16, border: '1px solid #ddd', borderRadius: 12 }}>
          <h2>Send Pix</h2>
          <form onSubmit={submit} style={{ display:'grid', gap:8 }}>
            <input value={pixKey} onChange={e=>setPixKey(e.target.value)} placeholder="pix key" />
            <input value={value} onChange={e=>setValue(e.target.value)} placeholder="value (ex: 123.45)" />
            <button type="submit" disabled={inFlight || !token}>
              {inFlight ? 'Enviando…' : 'Enviar Pix'}
            </button>
          </form>
        </section>

        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </div>
    </RelayEnvironmentProvider>
  );
}
