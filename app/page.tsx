"use client";

import { useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type Doc = {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  sharedWith: string[];
  updatedAt: string;
  attachments: string[];
};

const USERS: User[] = [
  { id: "u1", name: "Muhammad Shoaib", email: "shoaib@example.com" },
  { id: "u2", name: "Reviewer User", email: "reviewer@example.com" },
  { id: "u3", name: "Team Member", email: "team@example.com" },
];

const STORAGE_KEY = "minidocs-ai-documents";

function createStarterDoc(ownerId: string): Doc {
  return {
    id: crypto.randomUUID(),
    title: "Untitled Document",
    content: "<h1>New Document</h1><p>Start writing here...</p>",
    ownerId,
    sharedWith: [],
    updatedAt: new Date().toISOString(),
    attachments: [],
  };
}

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState("u1");
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const currentUser = USERS.find((u) => u.id === currentUserId)!;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      const firstDoc = createStarterDoc("u1");
      setDocuments([firstDoc]);
      setActiveDocId(firstDoc.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const visibleDocs = useMemo(() => {
    return documents.filter(
      (doc) => doc.ownerId === currentUserId || doc.sharedWith.includes(currentUserId)
    );
  }, [documents, currentUserId]);

  const ownedDocs = visibleDocs.filter((doc) => doc.ownerId === currentUserId);
  const sharedDocs = visibleDocs.filter((doc) => doc.ownerId !== currentUserId);
  const activeDoc = documents.find((doc) => doc.id === activeDocId) || visibleDocs[0];

  function createDocument() {
    const doc = createStarterDoc(currentUserId);
    setDocuments((prev) => [doc, ...prev]);
    setActiveDocId(doc.id);
    setStatus("New document created.");
  }

  function updateDoc(id: string, updates: Partial<Doc>) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  }

  function format(command: string, value?: string) {
    document.execCommand(command, false, value);
  }

  function saveEditorContent() {
    const editor = document.getElementById("editor");
    if (!activeDoc || !editor) return;
    updateDoc(activeDoc.id, { content: editor.innerHTML });
    setStatus("Saved successfully.");
  }

  function shareDocument(userId: string) {
    if (!activeDoc) return;
    if (activeDoc.ownerId !== currentUserId) {
      setStatus("Only the document owner can share this document.");
      return;
    }
    if (!userId || activeDoc.sharedWith.includes(userId)) return;

    updateDoc(activeDoc.id, {
      sharedWith: [...activeDoc.sharedWith, userId],
    });
    setStatus("Document shared.");
  }

  async function handleFileUpload(file: File) {
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      setStatus("Only .txt and .md files are supported in this MVP.");
      return;
    }

    const text = await file.text();
    const doc: Doc = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.(txt|md)$/i, ""),
      content: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
      ownerId: currentUserId,
      sharedWith: [],
      updatedAt: new Date().toISOString(),
      attachments: [file.name],
    };

    setDocuments((prev) => [doc, ...prev]);
    setActiveDocId(doc.id);
    setStatus("File imported as a new editable document.");
  }

  function canEdit(doc: Doc) {
    return doc.ownerId === currentUserId || doc.sharedWith.includes(currentUserId);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MiniDocs AI</h1>
            <p className="text-sm text-slate-500">
              Lightweight collaborative document editor MVP
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Current user</label>
            <select
              className="rounded border px-3 py-2"
              value={currentUserId}
              onChange={(e) => {
                setCurrentUserId(e.target.value);
                setActiveDocId(null);
              }}
            >
              {USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-6 md:grid-cols-[320px_1fr]">
        <aside className="rounded-xl bg-white p-4 shadow-sm">
          <button
            onClick={createDocument}
            className="mb-4 w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
          >
            + New Document
          </button>

          <label className="mb-4 block rounded-lg border border-dashed p-4 text-sm">
            <span className="block font-semibold">Import .txt / .md file</span>
            <span className="block text-slate-500">
              Creates a new editable document.
            </span>
            <input
              type="file"
              accept=".txt,.md"
              className="mt-3 w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </label>

          <h2 className="mb-2 font-bold">Owned Documents</h2>
          <div className="mb-5 space-y-2">
            {ownedDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full rounded-lg border p-3 text-left ${
                  activeDoc?.id === doc.id ? "border-slate-900 bg-slate-100" : ""
                }`}
              >
                <div className="font-medium">{doc.title}</div>
                <div className="text-xs text-slate-500">Owner: You</div>
              </button>
            ))}
            {ownedDocs.length === 0 && (
              <p className="text-sm text-slate-500">No owned documents.</p>
            )}
          </div>

          <h2 className="mb-2 font-bold">Shared With Me</h2>
          <div className="space-y-2">
            {sharedDocs.map((doc) => {
              const owner = USERS.find((u) => u.id === doc.ownerId);
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full rounded-lg border p-3 text-left ${
                    activeDoc?.id === doc.id ? "border-slate-900 bg-slate-100" : ""
                  }`}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-slate-500">
                    Owner: {owner?.name}
                  </div>
                </button>
              );
            })}
            {sharedDocs.length === 0 && (
              <p className="text-sm text-slate-500">No shared documents.</p>
            )}
          </div>
        </aside>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          {!activeDoc ? (
            <p>No document selected.</p>
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-xl font-bold"
                  value={activeDoc.title}
                  disabled={activeDoc.ownerId !== currentUserId}
                  onChange={(e) => updateDoc(activeDoc.id, { title: e.target.value })}
                />

                <button
                  onClick={saveEditorContent}
                  disabled={!canEdit(activeDoc)}
                  className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white disabled:bg-slate-300"
                >
                  Save
                </button>
              </div>

              <div className="mb-3 flex flex-wrap gap-2 rounded-lg border bg-slate-50 p-2">
                <button className="rounded border px-3 py-1" onClick={() => format("bold")}>
                  Bold
                </button>
                <button className="rounded border px-3 py-1" onClick={() => format("italic")}>
                  Italic
                </button>
                <button className="rounded border px-3 py-1" onClick={() => format("underline")}>
                  Underline
                </button>
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => format("formatBlock", "h1")}
                >
                  H1
                </button>
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => format("formatBlock", "p")}
                >
                  Paragraph
                </button>
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => format("insertUnorderedList")}
                >
                  Bullet List
                </button>
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => format("insertOrderedList")}
                >
                  Numbered List
                </button>
              </div>

              <div
                id="editor"
                className="prose min-h-90 max-w-none rounded-lg border p-4 outline-none"
                contentEditable={canEdit(activeDoc)}
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: activeDoc.content }}
              />

              <div className="mt-4 grid gap-3 rounded-lg border bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <h3 className="font-bold">Sharing</h3>
                  <p className="text-sm text-slate-500">
                    Owner can grant access to a seeded user.
                  </p>
                  <select
                    className="mt-2 w-full rounded border px-3 py-2"
                    disabled={activeDoc.ownerId !== currentUserId}
                    onChange={(e) => shareDocument(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Share with...
                    </option>
                    {USERS.filter((user) => user.id !== currentUserId).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="font-bold">Document Info</h3>
                  <p className="text-sm">
                    Owner: {USERS.find((u) => u.id === activeDoc.ownerId)?.name}
                  </p>
                  <p className="text-sm">
                    Shared with:{" "}
                    {activeDoc.sharedWith.length
                      ? activeDoc.sharedWith
                          .map((id) => USERS.find((u) => u.id === id)?.name)
                          .join(", ")
                      : "Nobody"}
                  </p>
                  <p className="text-sm">
                    Attachments/imports:{" "}
                    {activeDoc.attachments.length
                      ? activeDoc.attachments.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>

              {status && (
                <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  {status}
                </p>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}