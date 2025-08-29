// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { api } from "@/app/lib/api";
// import { Paperclip, Trash2, UploadCloud, Link as LinkIcon } from "lucide-react";

// export default function FileAttachment({ taskId, projectId }) {
//   const [attachments, setAttachments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const inputRef = useRef(null);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/tasks/${taskId}`, {
//         params: projectId ? { projectId } : undefined,
//       });
//       setAttachments(data.task?.attachments || []);
//     } catch (e) {
//       setError("Failed to load attachments");
//       // eslint-disable-next-line no-console
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (taskId) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [taskId]);

//   const onFileChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setSelectedFiles(files);
//   };

//   const upload = async () => {
//     if (!selectedFiles.length) return;
//     try {
//       setUploading(true);
//       setError("");
//       const fd = new FormData();
//       selectedFiles.forEach((f) => fd.append("files", f));
//       if (projectId) fd.append("project", projectId);
//       const { data } = await api.post(`/tasks/${taskId}/attachments`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setAttachments(data.task?.attachments || []);
//       setSelectedFiles([]);
//       if (inputRef.current) inputRef.current.value = "";
//     } catch (e) {
//       setError("Upload failed");
//       // eslint-disable-next-line no-console
//       console.error(e);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const remove = async (att) => {
//     try {
//       setError("");
//       const { data } = await api.delete(`/tasks/${taskId}/attachments`, {
//         data: { url: att.url, project: projectId },
//       });
//       setAttachments(data.task?.attachments || []);
//     } catch (e) {
//       setError("Delete failed");
//       // eslint-disable-next-line no-console
//       console.error(e);
//     }
//   };

//   const prettySize = useMemo(() => {
//     return (bytes) => {
//       if (!bytes && bytes !== 0) return "";
//       const units = ["B", "KB", "MB", "GB"];
//       let size = bytes;
//       let i = 0;
//       while (size >= 1024 && i < units.length - 1) {
//         size /= 1024;
//         i += 1;
//       }
//       return `${size.toFixed( size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
//     };
//   }, []);

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//           <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
//             Attachments
//           </h4>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</div>
//       )}

//       <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
//         {loading ? (
//           <div className="text-sm text-gray-500">Loading attachments...</div>
//         ) : attachments.length === 0 ? (
//           <div className="text-sm text-gray-500">No attachments.</div>
//         ) : (
//           attachments.map((a, idx) => (
//             <div
//               key={`${a.url}-${idx}`}
//               className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2"
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <LinkIcon className="w-4 h-4 text-gray-500" />
//                 <a
//                   href={a.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="truncate text-sm text-indigo-600 hover:underline"
//                   title={a.name}
//                 >
//                   {a.name}
//                 </a>
//                 <span className="text-xs text-gray-500 shrink-0">{prettySize(a.size)}</span>
//               </div>
//               <button
//                 onClick={() => remove(a)}
//                 className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600"
//                 title="Delete attachment"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           onChange={onFileChange}
//           className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600"
//         />
//         <button
//           onClick={upload}
//           disabled={uploading || selectedFiles.length === 0}
//           className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-60"
//         >
//           <UploadCloud className="w-4 h-4" />
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </div>
//     </div>
//   );
// }
