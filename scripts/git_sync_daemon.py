"""
LabSphere Local Git Auto-Sync Daemon
A lightweight local HTTP server that listens for database updates from LabSphere
and automatically commits and pushes them to GitHub in the background.
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 5000
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class GitSyncHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/status' or self.path == '/api/status':
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            status = {
                "daemon": "LabSphere Git Auto-Sync Daemon",
                "status": "ONLINE",
                "workspace": WORKSPACE_DIR,
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(status, indent=2).encode('utf-8'))
        elif self.path == '/api/db':
            # Return current db.json
            db_path = os.path.join(WORKSPACE_DIR, 'data', 'db.json')
            if os.path.exists(db_path):
                self.send_response(200)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                with open(db_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self._set_cors_headers()
                self.end_headers()
        else:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()

    def do_POST(self):
        if self.path.startswith('/api/db'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                self._process_sync(data)
                self.send_response(200)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                res = {"ok": True, "message": "Updated db.json and pushed to Git"}
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                print(f"[ERROR] Sync failed: {e}")
                self.send_response(500)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                res = {"ok": False, "error": str(e)}
                self.wfile.write(json.dumps(res).encode('utf-8'))
        else:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()

    def _process_sync(self, data):
        db_path = os.path.join(WORKSPACE_DIR, 'data', 'db.json')
        initial_js_path = os.path.join(WORKSPACE_DIR, 'js', 'initialData.js')

        print(f"[{datetime.now().strftime('%H:%M:%S')}] Received data sync ({len(data.get('components', []))} components, {len(data.get('boxes', []))} boxes)...")

        # 1. Update data/db.json
        with open(db_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        # 2. Update js/initialData.js
        components = data.get('components', [])
        boxes = data.get('boxes', [])
        racks = data.get('racks', [])
        projects = data.get('projects', [])
        requests = data.get('requests', [])
        transactions = data.get('transactions', [])

        js_content = f"""// LabSphere Initial Seed Data - Master Hardware Catalog & Transaction Ledger
// Synchronized with central db.json

const INITIAL_COMPONENTS = {json.dumps(components, indent=2, ensure_ascii=False)};

const INITIAL_BOXES = {json.dumps(boxes, indent=2, ensure_ascii=False)};

const INITIAL_RACKS = {json.dumps(racks, indent=2, ensure_ascii=False)};

const INITIAL_PROJECTS = {json.dumps(projects, indent=2, ensure_ascii=False)};

const INITIAL_REQUESTS = {json.dumps(requests, indent=2, ensure_ascii=False)};

const INITIAL_TRANSACTIONS = {json.dumps(transactions, indent=2, ensure_ascii=False)};

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = {{
    INITIAL_COMPONENTS,
    INITIAL_BOXES,
    INITIAL_RACKS,
    INITIAL_PROJECTS,
    INITIAL_REQUESTS,
    INITIAL_TRANSACTIONS
  }};
}}
"""
        with open(initial_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)

        # 3. Git commit & push
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        commit_msg = f"Auto-Sync: Live site update ({now_str})"
        print(f"  --> Committing to git: '{commit_msg}'...")

        subprocess.run(['git', 'add', 'data/db.json', 'js/initialData.js'], cwd=WORKSPACE_DIR, check=True)
        subprocess.run(['git', 'commit', '-m', commit_msg], cwd=WORKSPACE_DIR, check=True)
        print("  --> Pushing to origin main...")
        subprocess.run(['git', 'push', 'origin', 'main'], cwd=WORKSPACE_DIR, check=True)
        print("  --> Git push completed successfully!")

def run_server():
    server_address = ('127.0.0.1', PORT)
    httpd = HTTPServer(server_address, GitSyncHandler)
    print("=" * 60)
    print(f"  LabSphere Local Git Auto-Sync Daemon")
    print(f"  Listening on http://127.0.0.1:{PORT}")
    print(f"  Working repository: {WORKSPACE_DIR}")
    print("  Ready to auto-sync local edits to GitHub.")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDaemon stopped.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
