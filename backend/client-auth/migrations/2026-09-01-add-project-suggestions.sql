CREATE TABLE IF NOT EXISTS client_project_suggestions (
  project_key TEXT NOT NULL,
  section TEXT NOT NULL CHECK(section IN ('tone','image')),
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  body TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_key, section, owner)
);
