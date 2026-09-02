ALTER TABLE client_project_inspirations
ADD COLUMN owner TEXT NOT NULL DEFAULT 'benjamin'
CHECK(owner IN ('alex', 'benjamin'));
