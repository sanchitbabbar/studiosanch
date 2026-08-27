# Studio Sanch — invitation-only client authentication

## Status and boundaries

SiteGround database connectivity and anonymous HTTPS session response were verified during setup. The Cloudflare relay is prepared locally but is NOT deployed or independently security-audited. Full login/invitation testing remains outstanding. Do not treat the public static build as a secured client portal. The current project selection and email-brief screens contain only public presentation content; no private project files or records are stored or served yet.

The frontend calls `/api/client.php`. Missing configuration or a static-only preview fails closed, with no successful sign-in. The only public PHP file contains no secrets. No public registration or browser-based administration exists. Staff provisioning is currently through SSH; a staff dashboard is a separate feature.

## Hosting layout

The live frontend is on **Cloudflare Pages**, built from Git branch `main` with `npx next build`, output `out`. Do NOT replace SiteGround's existing WordPress `public_html` with this export or change the apex/www DNS records.

`functions/api/client.php.ts` relays only the canonical production origin's `/api/client.php` to `https://api-origin.studiosanch.com/api/client.php`. `public/_routes.json` restricts Function invocation to `/api/*`. Pages builds Functions from the root `functions` directory separately from the static export. Set Pages Runtime failure mode to **fail closed** before launch. Preview/pages.dev hostnames deliberately cannot use production authentication. Canonicalize www to the apex before enabling login there.

The PHP entry point is `backend/client-auth/public/client.php`, deliberately outside Next's `public` assets so Cloudflare never publishes PHP source. Upload it only to `~/www/api-origin.studiosanch.com/public_html/api/client.php`. That subdomain has its own valid TLS certificate and DNS A record to SiteGround. Its sibling `studio-sanch-private` symlink points to the original private directory under `~/www/studiosanch.com/`. Keep secrets outside both document roots. The old SiteGround copy of the entry point is not used by the relay.

Use a supported, patched PHP version (8.2+ syntax required), `pdo_mysql`, sessions, and Argon2id support. Verify Argon2id in the actual SiteGround web PHP runtime; there is no fallback to weaker hashing.

Place these files in a sibling directory **outside public_html**, named `studio-sanch-private`:

- `bootstrap.php`
- `manage.php`
- `config.php` created from `config.example.php`

Example layout:

```
site-root/
  public_html/
    api/client.php
  studio-sanch-private/
    bootstrap.php
    manage.php
    config.php
```

Never upload `backend/`, SQL dumps, configuration, tests, or invitation output into `public_html`. Restrict private file permissions to the hosting account and required PHP process (typically directory 700 and files 600; verify the hosting execution user). The public entry point derives the private path from `DOCUMENT_ROOT`; confirm this matches the actual SiteGround site layout.

### Remaining relay launch checks

- Run `node --test backend/client-auth/test_proxy.mjs`, TypeScript checking, and a production build before publishing. Verify `out` contains no client-auth PHP/configuration files. Legacy `public/php` files for other site forms predate this relay and need a separate hosting review.
- Verify actual Pages cookie forwarding, CSRF rejection, activation, login, logout, and session invalidation after deployment, using a dedicated test account only.
- **Before real client use:** the backend currently rate-limits `REMOTE_ADDR`. Behind the relay that is the Cloudflare egress address, potentially shared by many clients. Add authenticated proxy-to-origin client-IP transport and test it before treating these as individual visitor limits. Do not trust arbitrary forwarded IP headers. Username limits still apply independently.
- Keep origin and edge auth responses out of every cache. The relay sets no-store and does not follow upstream redirects or expose upstream error bodies. It forwards only the client session cookie, not other website cookies.

## SiteGround setup (requires owner access)

1. Back up the site; use a staging site/database first.
2. In Site Tools → Site → MySQL, create a dedicated database and user. Import `schema.sql` once with an administrative account. Do not point this schema at an unrelated existing database.
3. Grant the runtime user only SELECT, INSERT, UPDATE, DELETE on this database. Keep schema administration separate.
4. Enter the actual DSN/user/password in the private `config.php`. Generate `rate_secret` and `dummy_hash` with the commands in the example, on the server. Never paste these into chat or commit them.
5. Set `origin` to the exact canonical HTTPS origin, no trailing slash. Redirect www/non-www consistently. HTTPS must be enforced by SiteGround; verify `$_SERVER['HTTPS']` is set correctly rather than trusting forwarded headers from arbitrary requests.
6. Exclude `/api/*` and `/client/*` from SiteGround Dynamic Cache, CDN caching, and any proxy caching. API responses also send `no-store`. Verify two independent browsers never receive a shared session or CSRF token. Add a no-referrer policy for `/client/` at the host.
7. Ensure PHP sessions are stored privately and persisted correctly, with enough retention for the configured session duration. Sessions expire after 30 idle minutes or eight hours absolute; the server checks account revocation on each authenticated request.
8. Configure scheduled cleanup: `DELETE FROM client_auth_limits WHERE expires_at < UNIX_TIMESTAMP() - 86400;` daily. Retain backups and operational logs according to your privacy policy; restrict access. Never log bodies, passwords, invitation links, or cookies.
9. Enable strong MFA for SiteGround administrators and protect SSH keys. Consider host-level IP throttling/WAF as an additional layer.

## Issue access after confirming a booking

In an authenticated SSH session, from the private directory:

```
php manage.php invite client.username client@example.com BOOKING-REFERENCE
```

This records the booking reference and outputs a one-use invitation valid for 24 hours. **Staff must verify the booking and recipient**; this command does not integrate with or validate a booking system. Send the username and link through your established client email channel to the verified recipient. No permanent password is generated, exposed to staff, or emailed. Do not put invitation links in shared documents, analytics, or logs.

The client chooses English/French, enters the provided username, and sets a 15–128 character password. Tokens have 256 bits of randomness and are stored only as SHA-256 hashes. The link carries its token in the URL fragment; the client removes it from the address bar after reading it into memory. Refreshing loses the token, so reopen the original invitation if necessary.

After setup the client signs in normally. There is no automatic login from an invitation. Passwords are hashed with Argon2id, PHP-generated salts, and PHP defaults; benchmark memory/time settings under realistic hosting load. Password reset consumes an invitation and invalidates old sessions.

## Recovery and revocation

After verifying identity against the original booking (not merely accepting a request from an arbitrary email):

```
php manage.php reissue client.username
php manage.php revoke client.username
```

Reissue invalidates previous invitations, passwords, and sessions. Revocation disables the account and all outstanding invitations/sessions; reissue does not reactivate a disabled account. Restore disabled access only after an explicit staff review via a future controlled workflow.

## Security boundaries to preserve

- Secure, HttpOnly, host-only, SameSite=Strict session cookies; strict session IDs and ID rotation on sign-in/sign-out.
- Same-origin checks plus server-generated CSRF tokens for every POST, including login and activation. JSON-only input with an 8 KiB limit.
- Generic login errors and a dummy password hash for unknown users. No username-discovery endpoint.
- Atomic MySQL-backed rate limits: 10 attempts per normalized username and 30 per IP per 15-minute window, counting successful attempts too. Buckets use keyed hashes; no raw IP stored in this table. Confirm real client IP handling behind SiteGround proxies before launch; never blindly trust `X-Forwarded-For`.
- One-use invitation redemption is a conditional atomic SQL update. No client-supplied role or account-owner value grants access.
- Every FUTURE private endpoint must call `client_require_account()` after secure session initialization and must scope its database query to that account id. Client-side React state is NOT access control.
- Do not place private files under public_html or public/; use authorized download endpoints outside the public filesystem.

## Verification before production

Local checks: `python3 backend/client-auth/test_guards.py`, PHP syntax checks, `npx tsc --noEmit`, `npm run build`.

These do not replace database/browser integration tests. On staging verify:

- Valid activation/sign-in; wrong username/password; expired, disabled, replayed and concurrently redeemed invitations.
- Account and IP limits across different sessions and parallel requests; no lost counter increments.
- Revocation and password reset terminate previously established sessions on their next server request.
- Logout, idle timeout, absolute timeout, browser refresh and multiple tabs.
- Cross-origin/CSRF attacks, malformed JSON, wrong content types, oversized requests, HTTPS and cookie settings.
- No secrets or private source files in `out/`; no cache sharing between two clients.
- Database unavailable means access denied, never a demo/fallback login.
- Before adding private project data: client A cannot retrieve client B's records/files by changing URLs or IDs.
- Add breached-password screening and review password policy, monitoring, account recovery and privacy requirements before production approval. Review this custom authentication implementation independently.

## References

- https://www.siteground.com/tutorials/php-mysql/create-user-database/
- https://www.php.net/manual/en/function.password-hash.php
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
