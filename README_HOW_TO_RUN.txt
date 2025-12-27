===========================================
KID2POCKET - HOW TO RUN IN CHROME
===========================================

WHY YOU CAN'T OPEN HTML FILES DIRECTLY:
---------------------------------------
Opening HTML files directly (double-clicking) uses file:// protocol which:
- Causes CORS (Cross-Origin) errors
- localStorage may not work properly
- External resources (QR code library) may not load
- Security restrictions prevent proper functionality

SOLUTION: USE A WEB SERVER
---------------------------

METHOD 1: Using Python Server (Recommended)
--------------------------------------------
1. Open Command Prompt or PowerShell in this folder
2. Type: python -m http.server 8000
3. Press Enter
4. Open Chrome browser
5. Type in address bar: http://localhost:8000/index.html
6. Press Enter

OR use the batch file:
- Double-click "START_SERVER.bat"
- Then open Chrome and go to: http://localhost:8000/index.html


METHOD 2: Using Live Server Extension (Alternative)
----------------------------------------------------
1. Install "Live Server" extension in Chrome/VS Code
2. Right-click on index.html
3. Select "Open with Live Server"
4. Website will open automatically


METHOD 3: Using Node.js http-server (If you have Node.js)
-----------------------------------------------------------
1. Install: npm install -g http-server
2. Open terminal in this folder
3. Type: http-server -p 8000
4. Open Chrome: http://localhost:8000/index.html


QUICK START:
------------
1. Double-click "START_SERVER.bat" to start server
2. Open Chrome
3. Type: http://localhost:8000/index.html
4. Press Enter

That's it! Your website will work perfectly in Chrome.

===========================================

