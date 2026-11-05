# BitLatch username and password auth

BitLatch uses username-only accounts backed by Neon PostgreSQL. Passwords are
hashed with Argon2id. The browser receives a random, HTTP-only session cookie;
only a SHA-256 digest of that random token is stored in PostgreSQL.

## Connect a Neon database

1. Create a Neon project and database.
2. Copy the pooled connection string from Neon.
3. Create a local .env.local file from .env.example, then set DATABASE_URL.
   Keep this file private; .gitignore excludes it.
4. Open Neon’s SQL Editor and run
   [db/migrations/0001_auth_and_projects.sql](../db/migrations/0001_auth_and_projects.sql).
5. Start the app with npm run dev.

Do not paste the connection string into chat or commit it. Set it in .env.local
for local development and in the hosting platform’s secret/environment settings
for deployment.

Rate limiting uses x-real-ip or x-forwarded-for to separate signup and login
attempts by client. In production, the hosting proxy must overwrite these
headers; do not trust client-supplied forwarding headers on a directly exposed
server. Auth actions fail closed in production if neither header is present, so
configure one in the hosting platform before enabling signup.

## Sign up and log in

- Open /signup to create an account with a username and password.
- Usernames are case-insensitive for sign-in and allow 3–24 letters, numbers,
  and underscores.
- Passwords must be 12–128 characters. They are never stored as plain text.
- Successful signup and login create a database session and redirect to
  /dashboard.
- /dashboard requires an active session. Use its Log out button to revoke the
  session.

The account flow intentionally collects no email. That means there is no
self-service password reset or email verification yet. A lost password cannot
be recovered through the app; add a verified recovery method before opening
registration to a wider audience.

## Attach future data to an account

The starter projects table has an owner_id foreign key referencing users.
The dashboard obtains the user with requireUser() on the server, then queries
projects using that verified user.id. The project creation action also derives
owner_id from the session; it never accepts an owner ID from the browser.

Use the same pattern for new personal data:

1. Add an owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
   column to the table.
2. In each server action or server data function, call requireUser().
3. Insert with user.id as owner_id.
4. Select, update, and delete with both the record ID and owner_id = user.id.
5. Never trust a user ID submitted by the client.

For shared team projects, add a membership table such as
project_members(project_id, user_id, role). Check membership and role on every
server action that reads or changes shared project data.
