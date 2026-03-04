---
title: "Kunci Veridian"
description: ""
pubDate: 2025-07-13 21:00
category: "Crypto"
event: "FIT Competition"
heroImage: ""
---

## Kunci Veridian

> Aen X, jaringan intelijen kami telah mencegat sebuah komunikasi penting. Sepertinya ini adalah fragmen data terenkripsi dari inisiatif 'Veridian Accord' – sebuah proyek terobosan yang bertujuan untuk Rekode Bumi (Recode The Earth) melalui reforestasi berbasis AI. Sistem mereka, 'ArborOS,' adalah mercusuar Inovasi Digital untuk Masa Depan Berkelanjutan (Digital Innovation For Sustainable Future)

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

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: FITUKSW{d1g1t4l_tr33s_gr0w_str0ng}</div>
</div>
```
