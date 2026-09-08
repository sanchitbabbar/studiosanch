import tempfile,shutil,sys,importlib.util,re
from pathlib import Path
root=Path('/Users/sanchitbabbar/Documents/Windsurf Projects/DASHBOARD STUDIO SANCH')
with tempfile.TemporaryDirectory() as tmp:
 p=Path(tmp)
 for name in ['app.py','mail_service.py']: shutil.copy2(root/name,p/name)
 shutil.copytree(root/'templates',p/'templates')
 sys.path.insert(0,str(p))
 spec=importlib.util.spec_from_file_location('isolated_dashboard',p/'app.py'); module=importlib.util.module_from_spec(spec);sys.modules[spec.name]=module;spec.loader.exec_module(module)
 app=module.app; app.testing=True
 @app.post('/security-test')
 def test_post(): return 'ok'
 c=app.test_client()
 response=c.get('/profile'); assert response.status_code==200,response.status_code
 token=re.search(r'name="csrf_token" value="([^"]+)"',response.text).group(1)
 assert c.post('/security-test').status_code==403
 assert c.post('/security-test',data={'csrf_token':'wrong'}).status_code==403
 assert c.post('/security-test',data={'csrf_token':token}).status_code==200
 assert c.post('/security-test',data={'csrf_token':token},headers={'Origin':'https://evil.example'}).status_code==403
 assert c.get('/profile',base_url='http://evil.example').status_code==403
 assert c.get('/profile',environ_overrides={'REMOTE_ADDR':'192.168.1.2'}).status_code==403
 assert response.headers['X-Frame-Options']=='DENY'
 assert response.headers['Cache-Control']=='no-store'
 assert c.get('/language/en',headers={'Referer':'https://evil.example'}).headers['Location']=='/'
 for template in (p/'templates').glob('*.html'):
  for form in re.findall(r'<form\b.*?</form>',template.read_text(),re.S):
   if re.search(r'method=[\"\']post',form,re.I): assert 'name="csrf_token"' in form,template
 with app.test_request_context():
  from flask import render_template
  html=render_template('haute_couture.html',pieces=[{'name':'<img src=x onerror=alert(1)>','id':1}],lang='fr')
  assert '<img src=x onerror=alert(1)>' not in html
 assert not app.debug
 print('PASS: local host/address restrictions, valid/invalid CSRF, cross-origin rejection, headers, safe redirect, POST form coverage, escaped title, debug disabled; isolated database only.')
