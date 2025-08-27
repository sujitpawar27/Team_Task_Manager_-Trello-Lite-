"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function MembersPanel({ project, onChange }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    setQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/users?q=${encodeURIComponent(q)}`);
      setSearchResults(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const invite = async (userId) => {
    try {
      await api.post(`/projects/${project._id}/members`, {
        userId,
        role: "member",
      });
      setQuery("");
      setSearchResults([]);
      onChange();
    } catch (e) {
      alert(e?.response?.data?.message || "Invite failed");
    }
  };

  const removeMember = async (userId) => {
    if (!confirm("Remove member?")) return;
    await api.delete(`/projects/${project._id}/members/${userId}`);
    onChange();
  };

  // find current user role for owner-only controls
  const meId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  // note: ideally you have user in redux; fallback: find in members
  const myMember = project.members.find((m) => {
    return (
      m.user && ((m.user._id || m.user.id) === meId || m.user._id === meId)
    );
  });

  return (
    <aside className="card p-4 w-80">
      <h3 className="font-semibold">Members</h3>
      <ul className="mt-3 space-y-2">
        {project.members.map((m) => (
          <li
            key={m.user._id || m.user.id}
            className="flex justify-between items-start gap-2"
          >
            <div>
              <div className="font-medium">{m.user.name}</div>
              <div className="text-xs text-zinc-500">{m.user.email}</div>
              <div className="text-xs text-zinc-400">Role: {m.role}</div>
            </div>
            {myMember?.role === "owner" && (
              <button
                onClick={() => removeMember(m.user._id)}
                className="btn-ghost text-sm"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <label className="label">Invite by name or email</label>
        <input
          value={query}
          onChange={(e) => search(e.target.value)}
          className="input"
          placeholder="Search users..."
        />
        <div className="mt-2">
          {loading && <div className="text-sm">Searching…</div>}
          {searchResults.map((u) => (
            <div key={u._id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-zinc-500">{u.email}</div>
              </div>
              <button
                className="btn-primary text-sm"
                onClick={() => invite(u._id)}
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
