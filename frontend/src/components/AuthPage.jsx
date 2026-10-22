import { useState } from "react";
import { api } from "../api";

export default function AuthPage({ onSignedIn }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const isSignup = mode === "signup";

  const run = async (kind, fn) => {
    setBusy(kind);
    setError("");
    try {
      onSignedIn(await fn());
    } catch (e) {
      setError(e.message === "Failed to fetch" ? "Can’t reach the Sinch & Save API. Check that the backend is running." : e.message);
    } finally {
      setBusy("");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    run("form", () => (isSignup ? api.signup(name, email, password) : api.login(email, password)));
  };

  return (
    <div className="page auth-page">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      <main className="auth-wrap">
        <h1 className="brand">Sinch <span className="amp">&amp;</span> Save</h1>
        <p className="muted auth-intro">Personal expense tracker . Log what you earn and spend, stay under your weekly caps, and watch your savings jar grow.</p>

        <section className="card demo-card" aria-label="Try the demo">
          <h2>Just looking around?</h2>
          <p className="muted">Open a demo account filled with three months of sample data. No sign-up needed.</p>
          <button type="button" className="btn primary big" disabled={!!busy} onClick={() => run("demo", api.demo)}>
            {busy === "demo" ? "Opening demo…" : "Try the demo"}
          </button>
        </section>

        <section className="card" aria-label={isSignup ? "Create an account" : "Log in"}>
          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={!isSignup} className={!isSignup ? "tab on" : "tab"} onClick={() => { setMode("login"); setError(""); }}>Log in</button>
            <button type="button" role="tab" aria-selected={isSignup} className={isSignup ? "tab on" : "tab"} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {isSignup && (
              <div className="field">
                <label htmlFor="name" className="field-label">Your name</label>
                <input id="name" autoComplete="given-name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label htmlFor="email" className="field-label">Email</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password" className="field-label">Password</label>
              <input id="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} required minLength={isSignup ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} />
              {isSignup && <span className="muted small">At least 8 characters.</span>}
            </div>
            <button type="submit" className="btn primary big" disabled={!!busy}>
              {busy === "form" ? (isSignup ? "Creating account…" : "Logging in…") : isSignup ? "Create account" : "Log in"}
            </button>
            {error && <div className="error" role="alert">{error}</div>}
          </form>
        </section>
      </main>
    </div>
  );
}
