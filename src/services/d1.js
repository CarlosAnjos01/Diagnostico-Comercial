const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function submitCollaboratorResponse(companyData, respondentData, answers) {
  const payload = {
    company: companyData,
    respondent: respondentData,
    answers: answers
  };

  const response = await fetch(`${API_BASE}/api/diagnostics/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar a resposta do colaborador.");
  }

  return response.json();
}

export async function getCompanyPortalData(companyId) {
  const response = await fetch(`${API_BASE}/api/portal/${companyId}`);
  
  if (!response.ok) {
    throw new Error("Portal não encontrado.");
  }

  return response.json(); 
}
```[cite: 10]

6. Role até o final e clique no botão verde **Commit changes...** para salvar[cite: 10].

---

Ao salvar, um **novo commit** será gerado no GitHub. A Cloudflare puxará essa versão mais recente e a build será concluída com sucesso[cite: 26]! Me avise assim que salvar.
