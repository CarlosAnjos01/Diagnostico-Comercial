# Ginga Aí — Diagnóstico Comercial

MVP operacional do primeiro produto do Ginga OS.

## Objetivo

Transformar o diagnóstico comercial em um produto proprietário que:

1. coleta contexto e respostas;
2. calcula maturidade comercial;
3. identifica gargalos;
4. recomenda prioridades;
5. gera um resultado executivo;
6. salva o diagnóstico no backend Cloudflare D1 quando configurado;
7. funciona localmente mesmo sem backend, usando localStorage.

## Stack

- React + Vite
- JavaScript
- Cloudflare Pages
- Cloudflare Workers
- Cloudflare D1
- CSS próprio
- Lucide React

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

O projeto pode ser conectado ao GitHub e publicado no Cloudflare Pages.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

## Backend D1

O Worker está em `worker/`.

Crie um banco D1 e aplique:

```bash
npx wrangler d1 execute ginga-diagnostico --file=worker/schema.sql
```

Depois configure o binding `DB` no `wrangler.toml`.

## Segurança

O endpoint público aceita apenas criação de diagnósticos. A consulta administrativa exige `ADMIN_TOKEN`.

Não coloque o token administrativo no frontend.

## Evolução planejada

V1:
- diagnóstico;
- scoring;
- recomendações;
- relatório;
- persistência;
- integração básica.

V2:
- portal do cliente;
- propostas;
- calculadora de fee;
- evolução histórica;
- biblioteca viva de ativos;
- benchmarks;
- integração WhatsApp/Make/Notion;
- gestão de projetos de Estruturação e Aceleração.
