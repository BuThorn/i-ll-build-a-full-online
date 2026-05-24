import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await register({
        username: String(form.get("username")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        first_name: String(form.get("first_name")),
        last_name: String(form.get("last_name")),
      });
      navigate("/");
    } catch {
      setError("We could not create that account. Please review your details.");
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-black/10 bg-white p-6">
      <h1 className="text-3xl font-bold">Create account</h1>
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="first_name" label="First name" />
          <Input name="last_name" label="Last name" />
        </div>
        <Input name="username" label="Username" />
        <Input name="email" label="Email" type="email" />
        <Input name="password" label="Password" type="password" />
        <button className="focus-ring h-12 w-full rounded-md bg-ink font-semibold text-white">Create account</button>
      </form>
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

