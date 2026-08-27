"""Local PHP guard tests; no production credentials or database required.
Run: python3 backend/client-auth/test_guards.py
Database/login/invitation integration still requires a staging MySQL instance.
"""
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parent

class Guards(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='sanch-auth-test-')
        cls.root = Path(cls.temp.name)
        shutil.copy(SOURCE / 'bootstrap.php', cls.root)
        cls.dummy = subprocess.check_output(['php', '-r', 'echo password_hash("test fixture only", PASSWORD_ARGON2ID);'], text=True)
        (cls.root / 'config.php').write_text("<?php return " + "['origin'=>'https://studiosanch.com','rate_secret'=>'" + 'a' * 64 + "','dummy_hash'=>'" + cls.dummy + "'];")

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def run_php(self, code):
        script = "require " + json.dumps(str(self.root / 'bootstrap.php')) + ";" + code
        result = subprocess.run(['php', '-d', 'session.save_path=' + str(self.root), '-r', script], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stderr, '')
        return json.loads(result.stdout)

    def test_anonymous_session(self):
        result = self.run_php("$_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='GET'; client_handle();")
        self.assertIsNone(result['user'])
        self.assertRegex(result['csrf'], r'^[a-f0-9]{64}$')

    def test_requires_https(self):
        result = self.run_php("$_SERVER['REQUEST_METHOD']='GET'; client_handle();")
        self.assertEqual(result['error'], 'https_required')

    def test_post_without_origin_is_rejected(self):
        result = self.run_php("$_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='POST'; client_handle();")
        self.assertEqual(result['error'], 'request_rejected')

    def test_cross_origin_rejected(self):
        result = self.run_php("$_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='POST'; $_SERVER['HTTP_ORIGIN']='https://attacker.example'; client_handle();")
        self.assertEqual(result['error'], 'request_rejected')

    def test_post_without_csrf_rejected(self):
        result = self.run_php("$_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='POST'; $_SERVER['HTTP_ORIGIN']='https://studiosanch.com'; client_handle();")
        self.assertEqual(result['error'], 'request_rejected')

    def test_unsupported_method(self):
        result = self.run_php("$_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='DELETE'; client_handle();")
        self.assertEqual(result['error'], 'method_not_allowed')

    def test_cookie_settings(self):
        result = self.run_php("client_session(); echo json_encode(['params'=>session_get_cookie_params(),'strict'=>ini_get('session.use_strict_mode'),'name'=>session_name()]);")
        self.assertTrue(result['params']['secure'])
        self.assertTrue(result['params']['httponly'])
        self.assertEqual(result['params']['samesite'], 'Strict')
        self.assertEqual(result['strict'], '1')
        self.assertEqual(result['name'], '__Host-sanch_client')

    def test_idle_expiry(self):
        result = self.run_php("client_session(); $_SESSION['client_id']='1'; $_SESSION['last_seen']=time()-1801; $_SESSION['signed_in']=time(); echo json_encode(client_current());")
        self.assertIsNone(result)

    def test_absolute_expiry(self):
        result = self.run_php("client_session(); $_SESSION['client_id']='1'; $_SESSION['last_seen']=time(); $_SESSION['signed_in']=time()-28801; echo json_encode(client_current());")
        self.assertIsNone(result)

    def test_session_rotation(self):
        result = self.run_php("client_session(); $before=session_id(); $csrf=$_SESSION['csrf']; $_SESSION['client_id']='1'; client_clear_session(); echo json_encode(['rotated'=>$before!==session_id(),'csrf_rotated'=>$csrf!==$_SESSION['csrf'],'cleared'=>!isset($_SESSION['client_id'])]);")
        self.assertTrue(all(result.values()))

    def test_password_hash(self):
        result = self.run_php("$h=password_hash('a long test-only passphrase',PASSWORD_ARGON2ID); echo json_encode([password_verify('a long test-only passphrase',$h),!password_verify('incorrect',$h)]);")
        self.assertTrue(all(result))

if __name__ == '__main__':
    unittest.main()
