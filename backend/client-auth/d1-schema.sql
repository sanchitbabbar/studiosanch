CREATE TABLE IF NOT EXISTS client_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL,
  booking_reference TEXT NOT NULL,
  project_access TEXT NOT NULL DEFAULT 'film,photoshoot,installation,identity',
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'invited' CHECK(status IN ('invited','active','disabled')),
  session_version INTEGER NOT NULL DEFAULT 1,
  invitation_hash TEXT,
  invitation_expires INTEGER,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS client_sessions (
  token_hash TEXT PRIMARY KEY,
  csrf TEXT NOT NULL,
  account_id TEXT REFERENCES client_accounts(id) ON DELETE CASCADE,
  session_version INTEGER,
  created_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_sessions_expiry ON client_sessions(expires_at);
CREATE TABLE IF NOT EXISTS client_auth_limits (
  bucket TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_auth_limits_expiry ON client_auth_limits(expires_at);
CREATE TABLE IF NOT EXISTS client_project_ideas (
  id TEXT PRIMARY KEY,
  project_key TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  kind TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_project_ideas_project ON client_project_ideas(project_key, created_at DESC);

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
CREATE TABLE IF NOT EXISTS client_project_inspirations (
  id TEXT PRIMARY KEY,
  project_key TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  caption TEXT NOT NULL DEFAULT '',
  image_data TEXT NOT NULL,
  selected INTEGER NOT NULL DEFAULT 0 CHECK(selected IN (0,1)),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_project_inspirations_project ON client_project_inspirations(project_key, created_at DESC);
CREATE TABLE IF NOT EXISTS client_project_inspiration_votes (
  inspiration_id TEXT NOT NULL REFERENCES client_project_inspirations(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK(vote IN ('yes','no')),
  created_at INTEGER NOT NULL,
  PRIMARY KEY(inspiration_id, account_id)
);
CREATE TABLE IF NOT EXISTS client_project_gear (
  project_key TEXT NOT NULL,
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  items TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_key, owner)
);
CREATE TABLE IF NOT EXISTS client_project_roles (
  project_key TEXT NOT NULL,
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  roles TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_key, owner)
);
CREATE TABLE IF NOT EXISTS client_project_narratives (
  project_key TEXT NOT NULL,
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  body TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_key, owner)
);
CREATE TABLE IF NOT EXISTS client_project_suggestions (
  project_key TEXT NOT NULL,
  section TEXT NOT NULL CHECK(section IN ('tone','image')),
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  body TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(project_key, section, owner)
);
CREATE TABLE IF NOT EXISTS client_project_locations (
  id TEXT PRIMARY KEY,
  project_key TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  owner TEXT NOT NULL CHECK(owner IN ('alex','benjamin')),
  idea TEXT NOT NULL,
  image_data TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_project_locations_project ON client_project_locations(project_key, created_at ASC);
