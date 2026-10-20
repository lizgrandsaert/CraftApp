# Wayfinder

Requires Python 3 and openpyxl. Install with `python -m pip install -r requirements.txt`.

Run `python server.py` from this directory. The server listens on port 3000. Open that port through your development environment's port forwarding, or visit http://localhost:3000 when running on your own computer.

Edit `data/library.xlsx` and save; click Reload workbook to refresh. Each worksheet after Index represents a source record, with field labels in column A and values in B. Repeated labels retain their order. The workbook is never rewritten by the application.

Initial prototype: text, source status, age range and materials keyword filters. Materials are not yet normalized into a completeness checklist. Participant capacities are unspecified. Workbook transcription statuses are supplied metadata, not independent source verification. No browser-based workbook editing or automated guide transcription is included.
