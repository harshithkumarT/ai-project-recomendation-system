import { useEffect, useState } from "react";
import api from "../services/api.js";

const GOAL_OPTIONS = ["job", "freelance", "dsa", "startup", "open-source"];

function DashboardPage() {
  const [profile, setProfile] = useState({
    skillLevel: "beginner",
    goals: ["job"],
    techStack: ["React", "Node.js"],
    completedProjects: []
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile");
        if (data.profile) {
          setProfile({
            skillLevel: data.profile.skill_level,
            goals: data.profile.goals,
            techStack: data.profile.tech_stack,
            completedProjects: data.profile.completed_projects || []
          });
        }
      } catch {
        setStatus("Create your profile to unlock recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setStatus("Saving...");

    try {
      await api.put("/profile", profile);
      setStatus("Profile updated");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="mx-auto mt-12 max-w-5xl px-4">Loading profile...</div>;
  }

  return (
    <main className="mx-auto mt-8 grid w-full max-w-5xl gap-6 px-4 md:grid-cols-3">
      <section className="glass rounded-2xl p-5 md:col-span-2">
        <h1 className="text-2xl font-bold">Your Learning Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">Keep profile context fresh so AI can stay precise.</p>

        <form className="mt-5 space-y-4" onSubmit={saveProfile}>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Skill level</label>
            <select
              className="input"
              value={profile.skillLevel}
              onChange={(e) => setProfile((prev) => ({ ...prev, skillLevel: e.target.value }))}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Goals</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => {
                const active = profile.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    className={active ? "btn-primary" : "btn-ghost"}
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        goals: active
                          ? prev.goals.filter((g) => g !== goal)
                          : [...prev.goals, goal]
                      }))
                    }
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Tech stack (comma separated)</label>
            <input
              className="input"
              value={profile.techStack.join(", ")}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  techStack: e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Completed projects</label>
            <textarea
              className="input min-h-24"
              value={profile.completedProjects.join("\n")}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  completedProjects: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                }))
              }
            />
          </div>

          <button className="btn-primary" type="submit">Save profile</button>
          <p className="text-sm text-slate-200">{status}</p>
        </form>
      </section>

      <aside className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Mentor Notes</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>Generate fresh recommendations weekly.</li>
          <li>Track projects with progress percentages.</li>
          <li>Bookmark projects you want to prioritize.</li>
        </ul>
      </aside>
    </main>
  );
}

export default DashboardPage;
