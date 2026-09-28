"use client";
import { useState } from "react";
import { Building2, ArrowRight } from "lucide-react";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(result.error);
      window.location.assign("/");
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <main className="login-wrap">
      <section className="login-art">
        <a className="brand" href="/">
          <Building2 />
          Najem Flow
        </a>
        <h1>
          Od mieszkania
          <br />
          do podpisanej umowy.
        </h1>
        <p>Twoje mieszkania, własne wzory i cały obieg umów w jednym panelu.</p>
      </section>
      <section className="login-form">
        <div>
          <span className="eyebrow">PANEL WYNAJMUJĄCEGO</span>
          <h1>Witaj ponownie</h1>
          <p className="muted mb-6">
            Zaloguj się do wspólnej przestrzeni demonstracyjnej.
          </p>
          <form onSubmit={login}>
            <label className="field">
              <span>Login</span>
              <input
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="field mt-4">
              <span>Hasło</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn primary mt-6" disabled={busy}>
              {busy ? "Logowanie…" : "Otwórz panel"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="notice info mt-6">
            Dostęp demo: <strong>admin / admin</strong>.<br />
            Wszyscy administratorzy widzą te same dane testowe.
          </div>
          <small>
            Najemca korzysta z osobnego linku do konkretnej umowy i nie
            potrzebuje tych danych logowania. Podpisy w tej wersji są symulacją.
          </small>
        </div>
      </section>
    </main>
  );
}
