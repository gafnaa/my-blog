---
title: "From Caesar to Cleo"
description: ""
pubDate: 2025-07-13 21:00
category: "Cypto"
event: "FIT Competition"
heroImage: ""
---

## From Caesar to Cleo

> Apakah kamu tahu isi surat cinta Julius Caesar untuk Cleopatra?

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
