#!/usr/bin/env python3
"""
SchemeSathi Local Development Server
Zero-dependency Python server that serves the web application and handles mock AI queries.
Run with:
    python server.py
Then open http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import os
import json
import urllib.parse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SchemeSathiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Health check endpoint
        if parsed_url.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "healthy",
                "service": "SchemeSathi Engine",
                "version": "1.0.0-hackathon"
            }).encode('utf-8'))
            return

        return super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if parsed_url.path == "/api/chat":
            try:
                data = json.loads(post_data.decode('utf-8'))
                query = data.get('query', '').lower()
                
                # Mock AI response logic
                reply = "I received your question. Check the citizen dashboard for matched welfare schemes."
                if 'scholarship' in query or 'student' in query:
                    reply = "You can apply for the Central Sector Post-Matric Scholarship covering up to 100% of college fees on scholarships.gov.in."
                elif 'farmer' in query or 'kisan' in query:
                    reply = "Under PM-KISAN, verified landholding farmers receive ₹6,000 yearly in direct bank transfers."
                elif 'woman' in query or 'loan' in query:
                    reply = "Under Stand-Up India and MUDRA, women entrepreneurs can access collateral-free business loans from ₹50,000 to ₹10 Lakhs."

                response_body = json.dumps({"response": reply, "query": data.get('query')})
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(response_body.encode('utf-8'))
                return
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), SchemeSathiHandler) as httpd:
        print("=" * 60)
        print(" 🇮🇳 SchemeSathi Prototype Server Started Successfully!")
        print(f" URL: http://localhost:{PORT}")
        print(f" Root Directory: {DIRECTORY}")
        print(" Press Ctrl+C to stop the server.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == "__main__":
    run_server()
