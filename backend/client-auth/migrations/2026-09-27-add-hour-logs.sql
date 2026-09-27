CREATE TABLE IF NOT EXISTS client_project_hour_logs (
  id TEXT PRIMARY KEY,
  project_key TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  work_date TEXT NOT NULL,
  hours REAL NOT NULL,
  note TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_client_project_hour_logs_project
  ON client_project_hour_logs(project_key, account_id, work_date DESC);
