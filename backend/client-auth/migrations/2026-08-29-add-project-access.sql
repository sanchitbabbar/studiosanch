ALTER TABLE client_accounts
ADD COLUMN project_access TEXT NOT NULL DEFAULT 'film,photoshoot,installation,identity';
