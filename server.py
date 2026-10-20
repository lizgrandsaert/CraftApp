import json, os, re
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import openpyxl
ROOT = Path(__file__).parent
WORKBOOK = ROOT / 'data/library.xlsx'
def load_records():
    book = openpyxl.load_workbook(WORKBOOK, data_only=True)
    records = []
    for sheet in list(book)[1:]:
        fields = {}
        for row in sheet.values:
            if len(row) >= 2 and row[0] is not None and row[1] is not None:
                fields.setdefault(str(row[0]), []).append(str(row[1]))
        if not fields.get('Title'): continue
        records.append({'id': sheet.title, 'title': fields['Title'][0], 'fields': fields})
    book.close()
    return records
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/activities':
            try: data = json.dumps({'records':load_records()}, ensure_ascii=False).encode(); status=200
            except Exception as e: data=json.dumps({'error':'Workbook could not be read. Check that it is a valid Excel workbook.'}).encode(); status=422
            content='application/json'
        elif self.path == '/search.js':
            data=(ROOT/'search.js').read_bytes(); status=200; content='text/javascript; charset=utf-8'
        elif self.path in ('/', '/index.html'):
            data=(ROOT/'index.html').read_bytes(); status=200; content='text/html; charset=utf-8'
        else: data=b'Not found'; status=404; content='text/plain'
        self.send_response(status); self.send_header('Content-Type',content); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(data)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', '3000'))
    server = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print(f'Wayfinder listening at http://127.0.0.1:{port}/', flush=True)
    server.serve_forever()
