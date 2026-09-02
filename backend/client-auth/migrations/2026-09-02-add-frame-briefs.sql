CREATE TABLE IF NOT EXISTS client_project_frame_briefs (
  project_key TEXT NOT NULL,
  frame_index INTEGER NOT NULL,
  details TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (project_key, frame_index)
);

CREATE TABLE IF NOT EXISTS client_project_frame_plans (
  project_key TEXT PRIMARY KEY,
  details TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL
);
