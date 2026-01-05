# Database Migrations Guide

Quick reference for managing database schema changes with Supabase CLI migrations.

---

## Prerequisites

- Supabase project created at https://supabase.com/dashboard
- Project Reference ID (found in Settings → General)

---

## One-Time Setup (Per Developer)

### 1. Authenticate with Supabase

```bash
npx supabase@latest login
```

**What this does:**

- Opens browser for authentication
- Saves access token to `~/.supabase/access-token`
- **Only needs to be done once** per machine (not per project)

**Troubleshooting:**

- If browser doesn't open automatically, copy the URL from terminal and paste in browser
- Token is stored globally and works across all Supabase projects

### 2. Link Local Repo to Supabase Project

```bash
npx supabase@latest link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual project reference ID.

**Example:**

```bash
npx supabase@latest link --project-ref abcdefghijklmnop
```

**What this does:**

- Connects your local `supabase/` folder to your remote Supabase database
- Saves link configuration to `supabase/.temp/`
- **Only needs to be done once** per project clone

---

## Creating and Applying Migrations

### Step 1: Create a New Migration

```bash
pnpm db:migration:new migration_name
```

**Example:**

```bash
pnpm db:migration:new add_reviews_table
```

**What this does:**

- Creates a new file: `supabase/migrations/TIMESTAMP_migration_name.sql`
- File is empty and ready for you to write SQL

**Output:**

```
Created new migration at supabase/migrations/20260105123456_add_reviews_table.sql
```

### Step 2: Edit the Migration File

Open the created file and write your SQL:

```sql
-- Example: supabase/migrations/20260105123456_add_reviews_table.sql

-- Add a new column to venues
ALTER TABLE public.venues
ADD COLUMN rating decimal(2,1);

-- Create a new table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
```

**Best Practices:**

- Use `IF NOT EXISTS` for idempotent migrations (safe to re-run)
- Add comments explaining what the migration does
- Test complex migrations locally first
- One migration = one logical change

### Step 3: Apply Migrations to Supabase

```bash
pnpm db:push
```

**What this does:**

- Reads all migration files in `supabase/migrations/`
- Applies unapplied migrations to your linked Supabase database (in timestamp order)
- Tracks which migrations have been applied

**Output:**

```
Applying migration 20260105123456_add_reviews_table.sql...
Migration complete!
```

### Step 4: Verify Changes

**Option A: Supabase Dashboard**

1. Go to https://app.supabase.com/project/YOUR_PROJECT
2. Navigate to **Table Editor**
3. Verify your changes are present

**Option B: SQL Query**

```bash
# Open SQL editor in dashboard and run:
SELECT * FROM public.venues LIMIT 5;
```

---

## Common Commands Reference

| Command                                            | Description                               |
| -------------------------------------------------- | ----------------------------------------- |
| `npx supabase@latest login`                        | Authenticate with Supabase (one-time)     |
| `npx supabase@latest link --project-ref REF`       | Link repo to project (one-time)           |
| `pnpm db:migration:new name`                       | Create new migration file                 |
| `pnpm db:push`                                     | Apply migrations to database              |
| `pnpm db:reset`                                    | Reset database and reapply all migrations |
| `pnpm db:types PROJECT_ID > src/types/database.ts` | Generate TypeScript types from schema     |

---

## Example Workflow

### Scenario: Adding a "phone" field to venues

```bash
# 1. Create migration
pnpm db:migration:new add_phone_to_venues

# 2. Edit the created file
# supabase/migrations/TIMESTAMP_add_phone_to_venues.sql
```

```sql
-- Add phone number field to venues
ALTER TABLE public.venues
ADD COLUMN phone text;

-- Optional: Add validation
ALTER TABLE public.venues
ADD CONSTRAINT phone_format CHECK (phone ~ '^\+?[1-9]\d{1,14}$');
```

```bash
# 3. Apply migration
pnpm db:push

# 4. Verify in Supabase Dashboard → Table Editor
# Should see new "phone" column in venues table

# 5. Regenerate types (optional)
pnpm db:types YOUR_PROJECT_ID > src/types/database.ts

# 6. Commit migration to Git
git add supabase/migrations/
git commit -m "Add phone field to venues table"
```

---

## Team Workflow

### Developer Onboarding

New team member setup:

```bash
# 1. Clone repo
git clone <repo-url>
cd halal-map

# 2. Install dependencies
pnpm install

# 3. Authenticate with Supabase
npx supabase@latest login

# 4. Link to project (get PROJECT_REF from team lead)
npx supabase@latest link --project-ref PROJECT_REF

# 5. Apply all existing migrations
pnpm db:push

# 6. Generate types
pnpm db:types PROJECT_REF > src/types/database.ts

# Done! Database is now in sync with repo
```

### Syncing with Latest Migrations

When a teammate adds a migration:

```bash
# 1. Pull latest code
git pull

# 2. Apply new migrations
pnpm db:push

# 3. Regenerate types if schema changed
pnpm db:types YOUR_PROJECT_ID > src/types/database.ts
```

---

## Migration Best Practices

### ✅ DO

- **Use descriptive names**: `add_user_favorites_table` not `migration1`
- **One change per migration**: Easier to understand and revert
- **Include comments**: Explain WHY, not just WHAT
- **Make migrations idempotent**: Use `IF NOT EXISTS`, `IF EXISTS`
- **Test locally first**: Use `pnpm db:reset` to test full migration sequence
- **Commit migrations to Git**: Essential for team synchronization

### ❌ DON'T

- **Don't edit old migrations**: Once pushed, create a new migration to fix
- **Don't delete migration files**: Breaks migration history
- **Don't put sensitive data**: No API keys, passwords in migrations
- **Don't skip `pnpm db:push`**: Always apply before merging PRs
- **Don't manually edit database**: Always use migrations for reproducibility

---

## Rollback / Undo Migration

Supabase CLI doesn't have automatic rollback. To undo a migration:

### Option 1: Create Reverting Migration (Recommended)

```bash
# Create new migration to undo changes
pnpm db:migration:new revert_phone_field

# Edit the file to reverse the changes
```

```sql
-- Revert: remove phone field from venues
ALTER TABLE public.venues
DROP COLUMN IF EXISTS phone;

ALTER TABLE public.venues
DROP CONSTRAINT IF EXISTS phone_format;
```

```bash
# Apply the revert
pnpm db:push
```

### Option 2: Reset and Replay (Destructive)

```bash
# WARNING: This deletes ALL data and replays migrations from scratch
pnpm db:reset
```

**Only use in development!** Production rollbacks should use reverting migrations.

---

## Troubleshooting

### "Access token not provided"

**Problem:** Not authenticated with Supabase CLI.

**Solution:**

```bash
npx supabase@latest login
```

### "Project ref not found"

**Problem:** Not linked to Supabase project.

**Solution:**

```bash
npx supabase@latest link --project-ref YOUR_PROJECT_REF
```

### "Migration already applied"

**Problem:** Trying to re-apply a migration that's already in the database.

**Solution:** This is normal! Supabase tracks applied migrations. If you need to modify the schema, create a NEW migration.

### "sh: supabase: command not found"

**Problem:** Using `npx supabase` instead of `npx supabase@latest`.

**Solution:** Always include `@latest`:

```bash
npx supabase@latest [command]
```

Or use the npm scripts (already configured):

```bash
pnpm db:migration:new name
pnpm db:push
```

---

## Advanced: Local Development Database

For completely isolated local development:

```bash
# Start local Supabase (requires Docker)
npx supabase@latest start

# Apply migrations to local database
npx supabase@latest db push --local

# Stop local Supabase
npx supabase@latest stop
```

This gives you a fully functional local Supabase instance for testing migrations without affecting production.

---

## Resources

- [Supabase Migrations Documentation](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [SQL Best Practices](https://supabase.com/docs/guides/database/tables)

---

## Quick Reference Card

```bash
# ---- One-Time Setup ----
npx supabase@latest login
npx supabase@latest link --project-ref REF

# ---- Daily Workflow ----
pnpm db:migration:new migration_name  # Create migration
# ... edit migration file ...
pnpm db:push                          # Apply to database

# ---- Sync with Team ----
git pull
pnpm db:push
pnpm db:types PROJECT_ID > src/types/database.ts
```

---

**Questions?** Check troubleshooting section or review the Supabase CLI docs.
