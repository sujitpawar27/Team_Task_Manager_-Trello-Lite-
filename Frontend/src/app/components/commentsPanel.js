"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "@/app/lib/api";
import { MessageCircle, Send } from "lucide-react";

export default function CommentsPanel({ taskId, projectId, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useSelector((s) => s.auth || { user: null });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const url = projectId
        ? `/tasks/${taskId}/comments?projectId=${projectId}`
        : `/tasks/${taskId}/comments`;
      const { data } = await api.get(url);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setPosting(true);
      const body = projectId ? { text, project: projectId } : { text };
      await api.post(`/tasks/${taskId}/comments`, body);
      setText("");
      await load();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setPosting(false);
    }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  const avatarInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "U";
    const name = nameOrEmail.split(" ")[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Comments
          </h4>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-56 overflow-y-auto pb-2">
        {loading ? (
          <div className="text-sm text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-500">No comments yet.</div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {avatarInitials(c.author?.name || c.author?.email)}
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                      {c.author?.name || c.author?.email || "User"}
                    </span>
                    <div className="flex items-center gap-2">
                      <time className="text-xs text-gray-400">
                        {formatTime(c.createdAt)}
                      </time>
                      {user && c.author && c.author._id === user._id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(c._id);
                              setEditingText(c.text);
                            }}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.delete(
                                  `/tasks/${taskId}/comments/${c._id}`,
                                  { data: { project: projectId } }
                                );
                                await load();
                              } catch (err) {
                                console.error("Failed to delete comment", err);
                              }
                            }}
                            className="text-xs text-red-600 hover:underline ml-1"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingId === c._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!editingText.trim()) return;
                            try {
                              await api.patch(
                                `/tasks/${taskId}/comments/${c._id}`,
                                { text: editingText, project: projectId }
                              );
                              setEditingId(null);
                              setEditingText("");
                              await load();
                            } catch (err) {
                              console.error("Failed to update comment", err);
                            }
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                          }}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {c.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="mt-3">
        <div className="flex items-start gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white p-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm">Post</span>
          </button>
        </div>
      </form>
    </div>
  );
}
