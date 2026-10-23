# Website security review — 23 October 2026

Scope: studiosanch.com, sanchitbabbar.com, museesanch.com; their local source,
Cloudflare Pages exports, known endpoints, and npm dependencies. This is a
hardening review, not a penetration-test certificate or guarantee against compromise.

## Hosting and PHP

The public domains are Cloudflare Pages deployments. Studio Sanch's
`/api/client.php` is a TypeScript Pages Function, not a PHP interpreter. Musée's
`/api/visitor-language.php` is handled in edge JavaScript. Executable PHP source
is excluded from the checked public exports; legacy PHP routes are blocked.
The separate backend/client-auth PHP implementation is retained locally for
legacy hosting. Its live deployment, PHP version and direct origin exposure
have not been established by these checks. Any remaining PHP host must be
patched independently; Cloudflare protection does not patch a PHP interpreter.

## Changes

- Patched compatible dependencies and explicitly updated vulnerable PDF, mail,
  image, parser and source-map packages. Removed the unused legacy next-on-pages
  adapter rather than retaining its vulnerable tooling tree.
- Both application repositories have zero findings in the final full `npm audit`;
  Musée also has zero. This is only the advisory database at review time.
- Enforced security headers for static responses and Pages Functions, including
  HSTS, clickjacking protection, MIME sniffing prevention and referrer policy.
- Routed application requests through middleware that blocks dotfiles, private
  paths, executable PHP paths, unwanted static writes, cross-site API writes,
  and oversized declared API bodies. Existing client CSRF/session guards remain.
- Made API responses private/no-store and removed wildcard CORS on private APIs.
- Orders listing now requires the trusted Supabase `app_metadata.role=admin`;
  ordinary authenticated customers and editable user metadata grant no access.
- Removed error details from public API responses.
- Replaced the portfolio service worker so API responses, HTML and writes are
  never intercepted/cached; old website caches are purged on activation. Only
  immutable Next.js static assets are cached.
- Existing public build checks continue to exclude private admin pages, receipts,
  subscriber data and executable PHP. Existing Musée public-file allowlist retained.

The applications' enforced CSP blocks framing/objects and upgrades insecure
requests, but is not a strict script allowlist. Next.js inline bootstrapping and
third-party payment integrations need a separate nonce/hash CSP migration.
Musée already uses a substantially stricter CSP.

## Validation

Production builds passed for both Next.js applications. Studio Sanch's existing
11 PHP guard checks, three D1/session tests and four newsletter tests passed.
New middleware regression tests passed for both applications. Portfolio tests
verify customer metadata cannot grant orders access and API/HTML are not cached
by its service worker. Musée build/allowlist/method tests passed.

Read-only live probes checked HTTPS pages, response headers and rejection of
known private paths; no live payments, login guesses or destructive probes were run.

## Remaining decisions and account controls

- Legacy portfolio PayPal checkout accepts client-supplied totals and includes
  direct PayPal fallbacks. It needs server-owned product/price validation and
  verified capture before any automated fulfillment. A decision to retire or
  rebuild this flow is pending; this review does not certify payment integrity.
- The trusted admin claim must be set by an authorized Supabase administrator.
  The public portfolio does not publish the local admin interface.
- Cloudflare, GitHub, registrar, email, Supabase, PayPal and Formspree MFA/passkeys,
  collaborator lists, scoped tokens, WAF/rate-limit rules, alerting and recovery
  settings were not inspected or changed. Confirm these in their account consoles.
- Verify any old SiteGround/PHP origins, staging sites and alternative domains;
  patch or retire them, and restrict direct origin access where appropriate.
- Backups and database restore procedures need an actual restore drill. Source
  control is not a backup of customer databases or provider account configuration.
- Body-size checks in shared middleware enforce declared Content-Length; the
  existing client handler separately bounds its parsed request. Upstream abuse
  controls and per-endpoint streaming limits remain useful for other endpoints.

Keep `npm run test:security`, production build checks and dependency audits in
regular maintenance. Reassess after checkout changes or new integrations.
