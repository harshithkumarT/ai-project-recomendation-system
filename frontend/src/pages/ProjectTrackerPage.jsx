import { useEffect, useState } from "react";
import api from "../services/api.js";

const emptyProject = {
  title: "",
  description: "",
  status: "todo",
  progress: 0,
  notes: ""
};

function ProjectTrackerPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
    const { data } = await api.get("/projects?page=1&limit=30");
    setProjects(data.projects || []);
  };

  useEffect(() => {
    fetchProjects().catch(() => setMessage("Failed to load projects"));
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/projects", form);
      setForm(emptyProject);
      await fetchProjects();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not create project");
    }
  };

  const updateStatus = async (project, status) => {
    await api.put(`/projects/${project.id}`, { status });
    await fetchProjects();
  };

  const remove = async (id) => {
    await api.delete(`/projects/${id}`);
    await fetchProjects();
  };

  const bookmark = async (id) => {
    await api.post(`/projects/${id}/bookmark`);
    setMessage("Bookmarked");
  };

  return (
    <main className="mx-auto mt-8 w-full max-w-6xl px-4">
      <section className="glass rounded-2xl p-5">
        <h1 className="text-2xl font-bold">Project Tracker</h1>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={createProject}>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Project title"
            required
          />
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="todo">todo</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
          <textarea
            className="input md:col-span-2"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            required
          />
          <textarea
            className="input md:col-span-2"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes"
          />
          <input
            className="input"
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm((prev) => ({ ...prev, progress: Number(e.target.value) }))}
          />
          <button className="btn-primary" type="submit">Create Project</button>
        </form>
        {message ? <p className="mt-2 text-sm text-slate-200">{message}</p> : null}
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="glass rounded-2xl p-5">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{project.description}</p>
            <p className="mt-2 text-sm">Status: {project.status}</p>
            <p className="text-sm">Progress: {project.progress}%</p>
            {project.notes ? <p className="mt-2 text-sm text-slate-300">Notes: {project.notes}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-ghost" onClick={() => updateStatus(project, "todo")} type="button">Todo</button>
              <button className="btn-ghost" onClick={() => updateStatus(project, "in-progress")} type="button">In-progress</button>
              <button className="btn-ghost" onClick={() => updateStatus(project, "completed")} type="button">Completed</button>
              <button className="btn-primary" onClick={() => bookmark(project.id)} type="button">Bookmark</button>
              <button className="btn-ghost" onClick={() => remove(project.id)} type="button">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default ProjectTrackerPage;
