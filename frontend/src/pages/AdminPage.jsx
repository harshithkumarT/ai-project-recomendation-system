import { useEffect, useState } from "react";
import api from "../services/api.js";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [usage, setUsage] = useState(null);
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [usersRes, usageRes, templateRes] = await Promise.all([
      api.get("/admin/users?page=1&limit=50"),
      api.get("/admin/ai-usage"),
      api.get("/admin/prompt-template")
    ]);

    setUsers(usersRes.data.users || []);
    setUsage(usageRes.data.usage);
    setTemplate(templateRes.data.template?.template || "");
  };

  useEffect(() => {
    load().catch(() => setMessage("Failed to load admin data"));
  }, []);

  const saveTemplate = async () => {
    setMessage("");
    try {
      await api.put("/admin/prompt-template", { template });
      setMessage("Template updated");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to update template");
    }
  };

  return (
    <main className="mx-auto mt-8 w-full max-w-6xl px-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-300">AI Requests</p>
          <p className="mt-2 text-2xl font-semibold">{usage?.total_requests ?? 0}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-300">Prompt Tokens</p>
          <p className="mt-2 text-2xl font-semibold">{usage?.total_prompt_tokens ?? 0}</p>
        </article>
        <article className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-300">Completion Tokens</p>
          <p className="mt-2 text-2xl font-semibold">{usage?.total_completion_tokens ?? 0}</p>
        </article>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="glass rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="mt-3 max-h-96 overflow-auto space-y-2 text-sm">
            {users.map((user) => (
              <div key={user.id} className="rounded-xl border border-white/10 p-2">
                <p>{user.name}</p>
                <p className="text-slate-300">{user.email}</p>
                <p className="text-slate-300">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Prompt Template</h2>
          <textarea
            className="input mt-3 min-h-72"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
          <button className="btn-primary mt-3" type="button" onClick={saveTemplate}>
            Save Template
          </button>
        </article>
      </section>
    </main>
  );
}

export default AdminPage;
