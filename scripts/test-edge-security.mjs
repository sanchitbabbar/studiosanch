import {readFile} from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
const root=process.cwd();
const source=await readFile(root+'/functions/_middleware.js','utf8');
const {onRequest}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const run=(path,init={})=>onRequest({request:new Request('https://studiosanch.com'+path,init),next:async()=>new Response('ok',{headers:{'Access-Control-Allow-Origin':'*'}})});
test('blocks private files, encoded dotfiles and executable PHP paths',async()=>{
 for(const path of ['/.env','/.git/config','/backend/client-auth/config.php','/images/%2Esecret','/database.sql','/public.sqlite','/php/subscribe.php','/admin/']) assert.equal((await run(path)).status,404,path);
});
test('preserves public artwork and client API, attaches headers to dynamic responses',async()=>{
 for(const path of ['/artworks/','/api/client.php','/api/visitor-language']) {
  const response=await run(path);assert.equal(response.status,200,path);assert.equal(response.headers.get('x-frame-options'),'DENY');assert.equal(response.headers.get('strict-transport-security'),'max-age=31536000');
  if(path.startsWith('/api/')){assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('access-control-allow-origin'),null);}
 }
});
test('rejects cross-site API writes and large declared payloads',async()=>{
 assert.equal((await run('/api/client.php',{method:'POST',headers:{Origin:'https://attacker.invalid'}})).status,403);
 assert.equal((await run('/api/client.php',{method:'POST',headers:{'Content-Length':'2000001'}})).status,413);
 assert.equal((await run('/api/client.php',{method:'POST',headers:{Origin:'https://studiosanch.com'}})).status,200);
 assert.equal((await run('/artworks/',{method:'POST'})).status,405);
});
