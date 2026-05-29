import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get("username")), String(form.get("password")));
      navigate(from, { replace: true });
    } catch {
      setError("Invalid username or password.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-black/10 bg-white p-6">
      <h1 className="text-3xl font-bold">Login</h1>
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input name="username" label="Username" />
        <Input name="password" label="Password" type="password" />
        <button className="focus-ring h-12 w-full rounded-md bg-ink font-semibold text-white">Login</button>
      </form>
      <p className="mt-4 text-sm text-black/60">
        New customer?{" "}
        <Link className="font-semibold text-clay" to="/register">
          Create an account
        </Link>
      </p>
    </section>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input className="focus-ring mt-1 w-full rounded-md border border-black/10 px-3 py-3" name={name} required type={type} />
    </label>
  );
}

