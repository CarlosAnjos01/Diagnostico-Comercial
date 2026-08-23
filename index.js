export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      if (request.method === "POST" && url.pathname === "/api/diagnostics") {
        const payload = await request.json();
        const id = crypto.randomUUID();
        const companyId = crypto.randomUUID();
        const now = new Date().toISOString();

        validatePayload(payload);

        const company = payload.company;
        const result = payload.result;

        await env.DB.prepare(`
          INSERT INTO companies
          (id, name, cnpj, contact, role, email, whatsapp, segment, city,
           revenue_range, employees_range, sellers_range, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          companyId,
          company.company,
          company.cnpj || null,
          company.contact,
          company.role || null,
          company.email,
          company.whatsapp || null,
          company.segment || null,
          company.city || null,
          company.revenue || null,
          company.employees || null,
          company.sellers || null,
          now
        ).run();

        await env.DB.prepare(`
          INSERT INTO diagnostics
          (id, company_id, overall_score, maturity_key, maturity_label,
           bottleneck_dimension, bottleneck_score, source, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id,
          companyId,
          result.overall,
          result.maturity.key,
          result.maturity.label,
          result.bottleneck.dimension,
          result.bottleneck.score,
          payload.source || "direct",
          now
        ).run();

        const answerStmt = env.DB.prepare(`
          INSERT INTO answers (diagnostic_id, question_id, value, created_at)
          VALUES (?, ?, ?, ?)
        `);

        const scoreStmt = env.DB.prepare(`
          INSERT INTO dimension_scores (diagnostic_id, dimension, score)
          VALUES (?, ?, ?)
        `);

        const recStmt = env.DB.prepare(`
          INSERT INTO recommendations
          (diagnostic_id, priority, dimension, score, title, action)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        const batch = [];

        for (const [questionId, value] of Object.entries(payload.answers || {})) {
          batch.push(answerStmt.bind(id, questionId, Number(value), now));
        }

        for (const [dimension, score] of Object.entries(result.dimensionScores || {})) {
          batch.push(scoreStmt.bind(id, dimension, Number(score)));
        }

        for (const item of result.recommendations || []) {
          batch.push(recStmt.bind(
            id,
            item.priority,
            item.dimension,
            item.score,
            item.title,
            item.action
          ));
        }

        if (batch.length) await env.DB.batch(batch);

        return json({ ok: true, id, companyId });
      }

      if (request.method === "GET" && url.pathname === "/api/diagnostics") {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
          return json({ error: "Unauthorized" }, 401);
        }

        const { results } = await env.DB.prepare(`
          SELECT
            d.id,
            c.name,
            c.contact,
            c.email,
            c.segment,
            d.overall_score,
            d.maturity_label,
            d.bottleneck_dimension,
            d.bottleneck_score,
            d.source,
            d.created_at
          FROM diagnostics d
          JOIN companies c ON c.id = d.company_id
          ORDER BY d.created_at DESC
          LIMIT 200
        `).all();

        return json({ ok: true, results });
      }

      return json({ error: "Not found" }, 404);
    } catch (error) {
      console.error(error);
      return json({ error: "Internal error", message: error.message }, 500);
    }
  }
};

function validatePayload(payload) {
  if (!payload?.company?.company) throw new Error("Empresa obrigatória.");
  if (!payload?.company?.contact) throw new Error("Contato obrigatório.");
  if (!payload?.company?.email) throw new Error("E-mail obrigatório.");
  if (!payload?.result) throw new Error("Resultado obrigatório.");
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
