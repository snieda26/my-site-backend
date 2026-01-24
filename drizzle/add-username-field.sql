-- Add username field to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS accounts_username_idx ON accounts(username);
