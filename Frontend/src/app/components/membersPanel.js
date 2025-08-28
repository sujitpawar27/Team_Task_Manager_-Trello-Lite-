"use client";
import { useState } from "react";
import { api } from "@/app/lib/api";
import {
  Users,
  Search,
  UserPlus,
  Crown,
  User,
  Mail,
  Shield,
  UserMinus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function MembersPanel({ project, onChange }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(null);

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
    setInviting(userId);
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
    } finally {
      setInviting(null);
    }
  };

  const removeMember = async (userId) => {
    if (!confirm("Remove member from project?")) return;
    await api.delete(`/projects/${project._id}/members/${userId}`);
    onChange();
  };

  // Find current user role for owner-only controls
  const meId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const myMember = project.members.find((m) => {
    return (
      m.user && ((m.user._id || m.user.id) === meId || m.user._id === meId)
    );
  });

  const isOwner = myMember?.role === "owner";

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      owner:
        "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300",
      admin:
        "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300",
      member:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          styles[role] || styles.member
        }`}
      >
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <aside className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Team Members
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {project.members.length}{" "}
            {project.members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      {/* Invite Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg text-white">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Invite New Members
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add people to collaborate
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => search(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            placeholder="Search by name or email..."
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "user found" : "users found"}
            </div>
            {searchResults.map((user) => {
              const isAlreadyMember = project.members.some(
                (m) => m.user._id === user._id
              );

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {isAlreadyMember ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Member
                    </div>
                  ) : (
                    <button
                      onClick={() => invite(user._id)}
                      disabled={inviting === user._id || !isOwner}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      title={
                        !isOwner
                          ? "Only owners can invite members"
                          : "Invite user"
                      }
                    >
                      {inviting === user._id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Inviting...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          {isOwner ? "Invite" : "No Permission"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {query && !loading && searchResults.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users found matching `{query}`</p>
          </div>
        )}

        {/* Permission Info */}
        {!isOwner && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-sm">
              <Shield className="w-4 h-4" />
              <span>Only project owners can invite new members</span>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-3 mb-6 mt-4">
        {project.members.map((m) => {
          const user = m.user;
          const isMe = (user._id || user.id) === meId;

          return (
            <div
              key={user._id || user.id}
              className="group relative overflow-hidden bg-gray-50/50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {isMe && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                      {isMe && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (You)
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    {getRoleBadge(m.role)}

                    {/* Remove Button */}
                    {isOwner && !isMe && (
                      <button
                        onClick={() => removeMember(user._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200"
                        title="Remove member"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500 rounded-full -translate-y-8 translate-x-8"></div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
