PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT,
  contact TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  segment TEXT,
  city TEXT,
  revenue_range TEXT,
  employees_range TEXT,
  sellers_range TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS diagnostics (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  maturity_key TEXT NOT NULL,
  maturity_label TEXT NOT NULL,
  bottleneck_dimension TEXT NOT NULL,
  bottleneck_score INTEGER NOT NULL,
  source TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  diagnostic_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(diagnostic_id) REFERENCES diagnostics(id)
);

CREATE TABLE IF NOT EXISTS dimension_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  diagnostic_id TEXT NOT NULL,
  dimension TEXT NOT NULL,
  score INTEGER NOT NULL,
  FOREIGN KEY(diagnostic_id) REFERENCES diagnostics(id)
);

CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  diagnostic_id TEXT NOT NULL,
  priority INTEGER NOT NULL,
  dimension TEXT NOT NULL,
  score INTEGER NOT NULL,
  title TEXT NOT NULL,
  action TEXT NOT NULL,
  FOREIGN KEY(diagnostic_id) REFERENCES diagnostics(id)
);

CREATE INDEX IF NOT EXISTS idx_diagnostics_company ON diagnostics(company_id);
CREATE INDEX IF NOT EXISTS idx_answers_diagnostic ON answers(diagnostic_id);
CREATE INDEX IF NOT EXISTS idx_scores_diagnostic ON dimension_scores(diagnostic_id);
