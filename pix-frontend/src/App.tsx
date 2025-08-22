import React, { useState } from 'react';
import { useSendPix } from './mutations/SendPixMutation';
import { login, logout } from './api/auth';

export default function App() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [pixKey, setPixKey] = useState('');
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const { commit, inFlight } = useSendPix();

  const handleLogin = async () => {
    try {
      setErr('');
      await login(email, password);
      setMsg('Successfully logged in');
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  };

  const handleLogout = () => {
    logout();
    setMsg('Logged out');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) { setErr('Inform a numerical positive value'); return; }
    if (!pixKey.trim()) { setErr('Inform pix key'); return; }

    commit({
      variables: { pixKey, value: n },
      onCompleted: (resp, errors) => {
        if (errors?.length) {
          setErr(errors[0].message);
          return;
        }
        setMsg(resp.sendPix ?? 'OK');
      },
      onError: (error) => setErr(error.message),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <header className="container mx-auto px-4 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Pix Transaction <span className="text-indigo-400">(React + Relay)</span>
        </h1>
        <p className="mt-2 text-slate-400">Simple pix simulator consuming the backend in Koa/GraphQL.</p>
      </header>

      <main className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        {/* Login Card */}
        <section className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Login</h2>

          <div className="grid gap-3">
            <label className="text-sm text-slate-300">
              Email
              <input
                className="mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email"
              />
            </label>

            <label className="text-sm text-slate-300">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password"
              />
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleLogin}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition text-white font-medium"
              >
                Login
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-slate-800 transition text-white font-medium disabled:opacity-50"
                disabled={!token}
              >
                Logout
              </button>

              <div className="ml-auto flex items-center gap-2 text-sm">
                <span className="text-slate-400">Token:</span>
                {token ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-300 px-2 py-1 border border-rose-500/30">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span> Missing
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Send Pix Card */}
        <section className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Send Pix</h2>

          <form onSubmit={handleSubmit} className="grid gap-3">
            <label className="text-sm text-slate-300">
              Pix key
              <input
                className="mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                placeholder="email/cellphone/random"
              />
            </label>

            <label className="text-sm text-slate-300">
              Value
              <input
                className="mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="ex: 123.45"
              />
            </label>

            <button
              type="submit"
              disabled={inFlight || !token}
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inFlight && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-transparent animate-spin"></span>}
              Send!
            </button>
          </form>
        </section>
      </main>

      {/* alerts */}
      <div className="container mx-auto px-4 pb-10">
        {msg && (
          <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 px-4 py-3">
            {msg}
          </div>
        )}
        {err && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 px-4 py-3">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
