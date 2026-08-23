const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function saveDiagnostic(payload) {
  if (!API_BASE && typeof window !== "undefined") {
    const key = "ginga_diagnostics";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push({
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      storage: "local",
    });
    localStorage.setItem(key, JSON.stringify(current));
    return { ok: true, local: true };
  }

  const response = await fetch(`${API_BASE}/api/diagnostics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar o diagnóstico.");
  }

  return response.json();
}
