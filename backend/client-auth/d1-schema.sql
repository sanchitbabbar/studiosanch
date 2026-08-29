CREATE TABLE IF NOT EXISTS client_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL,
  booking_reference TEXT NOT NULL,
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
