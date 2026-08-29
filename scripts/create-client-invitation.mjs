import { randomBytes, createHash, randomUUID } from 'node:crypto';
const [username, email, booking] = process.argv.slice(2);
if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(username || '') || !email || !booking) {
  console.error('Usage: node scripts/create-client-invitation.mjs username email booking-reference'); process.exit(2);
}
const token = randomBytes(32).toString('hex');
const hash = createHash('sha256').update(token).digest('hex');
const now = Math.floor(Date.now() / 1000); const expires = now + 86400;
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
console.log(`INSERT INTO client_accounts(id,username,email,booking_reference,status,session_version,invitation_hash,invitation_expires,created_at) VALUES (${quote(randomUUID())},${quote(username)},${quote(email)},${quote(booking)},'invited',1,${quote(hash)},${expires},${now});`);
console.error(`PRIVATE INVITATION (expires ${new Date(expires * 1000).toISOString()}):\nhttps://studiosanch.com/client/#invite=${token}\nUsername: ${username}`);
