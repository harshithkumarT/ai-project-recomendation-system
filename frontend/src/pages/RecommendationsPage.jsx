import { useEffect, useState } from "react";
import api from "../services/api.js";

function RecommendationsPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    skillLevel: "beginner",
    goals: ["job"],
    techStack: ["React", "Node.js"]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    const { data } = await api.get("/recommend?page=1&limit=20");
    setList(data.recommendations || []);
  };

  useEffect(() => {
    fetchRecommendations().catch(() => setError("Failed to load recommendations"));
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/recommend", form);
      await fetchRecommendations();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto mt-8 w-full max-w-6xl px-4">
      <section className="glass rounded-2xl p-5">
        <h1 className="text-2xl font-bold">AI Recommendations</h1>
        <p className="mt-1 text-sm text-slate-300">Generate structured project ideas + roadmap JSON.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            className="input"
            value={form.skillLevel}
            onChange={(e) => setForm((prev) => ({ ...prev, skillLevel: e.target.value }))}
          >
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
          <input
            className="input"
            value={form.goals.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                goals: e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              }))
            }
            placeholder="goals"
          />
          <input
            className="input"
            value={form.techStack.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                techStack: e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              }))
            }
            placeholder="tech stack"
          />
        </div>

        <button className="btn-primary mt-4" disabled={loading} type="button" onClick={generate}>
          {loading ? "Generating..." : "Generate Recommendations"}
        </button>
        {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((item) => (
          <article key={item.id} className="glass animate-rise rounded-2xl p-5">
            <p className="text-xs text-slate-300">{new Date(item.created_at).toLocaleString()}</p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-sm text-slate-100">
              {JSON.stringify(item.ai_response, null, 2)}
            </pre>
          </article>
        ))}
      </section>
    </main>
  );
}

export default RecommendationsPage;
