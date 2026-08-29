# Studio Sanch — invitation-only client authentication

## Architecture

The production client API is a Cloudflare Pages Function at `/api/client.php`, backed by a D1 binding named `CLIENT_DB`. It does not call SiteGround. This removes the unreliable shared Cloudflare-egress path that SiteGround repeatedly banned.

The browser receives a random `__Host-sanch_client` cookie with `Secure`, `HttpOnly`, `Path=/` and `SameSite=Strict`. Only a SHA-256 digest of that token is stored. Sessions expire after 30 idle minutes or eight hours absolute, are rotated on activation/login/logout, and are invalidated when an account's `session_version` changes. State-changing requests require an unpredictable session CSRF token and exact production Origin. Preview deployments fail closed.

Passwords are 15–128 Unicode characters and stored with PBKDF2-HMAC-SHA-256, 600,000 iterations and a random 128-bit salt. Login also performs the expensive derivation for unknown users. Invitation tokens are random 256-bit values; D1 stores only their SHA-256 digest and accepts them once for 24 hours. Per-IP, per-username and new-session limits are stored in D1; the Function uses Cloudflare's platform-provided `CF-Connecting-IP`, never caller-forwarded IP headers.

This authenticates access but does not yet serve private project records. Every future private route must validate the server session and authorize the requested account/project. Hiding links in React is not access control.

## Production setup

1. In the Studio Sanch Cloudflare account, create a D1 database dedicated to client authentication.
2. Run `d1-schema.sql` against that database.
3. In Workers & Pages → `studiosanch` → Settings → Bindings, bind the database as exactly `CLIENT_DB` for Production.
4. Add a production encrypted secret named `CLIENT_RATE_SECRET`, generated from at least 32 random bytes. Never put it in Git, chat, source, screenshots or a browser URL.
5. Leave Preview without production bindings. The Function rejects noncanonical origins independently.
6. Deploy `main`, verify `GET https://studiosanch.com/api/client.php` returns JSON, `Cache-Control: no-store`, a 64-character CSRF token, `user: null`, and a secure host-only cookie.
7. Use `scripts/create-client-invitation.mjs` locally to generate one SQL statement and one private invitation. Execute only the SQL in D1. Deliver the link and username to the verified recipient through a private channel. Do not retain or log the link.
8. Activate a dedicated test account, login in a fresh browser, confirm logout, then revoke/delete that account after testing.
9. Schedule deletion of expired guest sessions and rate buckets according to the privacy retention policy. Back up D1 and test restoration before storing real project records.

## Local verification

```bash
npm run test:security
npm run build
```

The D1 tests use a memory-only database and cover fail-closed configuration, canonical-origin enforcement, secure session issuance, CSRF/cross-origin rejection, one-use invitation activation, password login and logout. They do not prove the production binding or Cloudflare account configuration; those require the live test above.

## Legacy SiteGround backend

`bootstrap.php`, `manage.php`, `schema.sql`, and `public/client.php` are retained only as migration history until the live D1 test is complete. They are outside the static export and must not be deployed to Cloudflare. After successful D1 launch, archive/remove the SiteGround authentication deployment and its dedicated database through a controlled backup-and-retirement procedure.
