import http.server
import socketserver
import json
import os
import socket

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DB_FILE = os.path.join(DATA_DIR, 'db.json')

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

SERVER_IP = get_lan_ip()

os.chdir(BASE_DIR)

class CentralSyncHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        try:
            clean_path = self.path.split('?')[0].rstrip('/')
            if clean_path == '/api/network-ip':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "ip": SERVER_IP,
                    "port": PORT,
                    "serverUrl": f"http://{SERVER_IP}:{PORT}"
                }).encode('utf-8'))
                return
            elif clean_path == '/api/db':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                if os.path.exists(DB_FILE):
                    with open(DB_FILE, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.wfile.write(json.dumps({}).encode('utf-8'))
                return
        except Exception as err:
            print("[SERVER ERROR]", err)
        return super().do_GET()

    def do_POST(self):
        clean_path = self.path.split('?')[0].rstrip('/')
        if clean_path == '/api/db':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Master DB updated on server disk"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
            return
        return super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    print("============================================================")
    print("[SERVER] LabSphere Central Master Server Running!")
    print(f"[SERVER] Local Access:   http://localhost:{PORT}")
    print(f"[SERVER] Mobile Access:  http://{SERVER_IP}:{PORT}")
    print("============================================================")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CentralSyncHandler) as httpd:
        httpd.serve_forever()
