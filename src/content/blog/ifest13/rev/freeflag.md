---
title: "Free Flag"
description: ""
pubDate: 2025-05-11 21:00
category: "Reverse Engineering"
event: "IFEST13"
heroImage: ""
---

## Free Flag

> Mr. Shock is feeling generous today, so here's an attached program that will give you the flag. Just in case you don't know who this generous person is.

Diberikan sebuah file binary, yang ketika dijalankan akan seperti ini:

![Binary Output](https://i.imgur.com/example6.png)

Selanjutnya, kami melakukan command `strings` untuk mencari petunjuk, dan ternyata ditemukan hal berikut:

![Strings Output](https://i.imgur.com/example7.png)

Artinya, file binary ini telah diproteksi menggunakan UPX executable packer. Oleh karena itu, sebelum bisa dilakukan decompiling atau analisis lebih lanjut, kita perlu melakukan proses unpacking terlebih dahulu untuk mendapatkan binary dalam bentuk aslinya.

Setelah berhasil melakukan proses decompress menggunakan UPX, kini file binary tersebut sudah berada dalam bentuk aslinya. Dengan demikian, kita dapat melanjutkan ke tahap berikutnya, yaitu melakukan decompiling untuk menganalisis isi dan logika dari program tersebut.

Di sini kami menggunakan Ghidra untuk melakukan decompiling program, dan didapatkan potongan fungsi `main` seperti berikut:

![Ghidra Main Function](https://i.imgur.com/example8.png)

Program meminta user untuk memasukkan sebuah flag. Jika benar, akan mencetak pesan sukses. Jika salah, akan mencetak pesan gagal. Flag dicek menggunakan algoritma tertentu tanpa menyimpan string flag secara langsung. Berikut untuk analisis lebih lanjut dari program.

Setelah pengguna memasukkan input, program akan memeriksa setiap 2 karakter dari input tersebut. Tiap pasangan karakter dikonversi menjadi sebuah bilangan `uint16_t`, kemudian dikalikan dengan bilangan ganjil `(2*i + 1)` dan dibandingkan dengan nilai yang sudah disimpan dalam memori di alamat `0x402360`.

Dengan kata lain, validasi flag dilakukan dengan cara:

`expected[i] == (2*i + 1) * ((char1 << 8) + char2)`

Jika semua pasangan karakter menghasilkan nilai yang sesuai, maka flag dianggap benar.

Nilai `expected` ini merupakan array sebanyak 35 buah bilangan `uint32_t` (setiapnya 4 byte), sehingga total panjang flag yang diharapkan adalah 70 karakter (karena tiap 2 karakter = 1 angka).

Dari hasil reverse engineering, diketahui bahwa:

- Setiap nilai dalam array `expected` di file binary adalah hasil enkripsi dari 2 karakter flag.
- Proses enkripsinya adalah: `val = (2*i + 1) * ((char1 << 8) + char2)`

Maka untuk membalik proses ini, kita cukup:

- Membagi setiap nilai `val` dengan `(2*i + 1)`
- Mengambil high-byte dan low-byte hasilnya sebagai dua karakter flag

Berikut script Python yang digunakan untuk mengambil dan mendekripsi flag dari file binary:

```python
import struct

with open('original', 'rb') as f:
    data = f.read()

vaddr = 0x402360
file_offset = data.find(b'\x46\x49\x00\x00')
count = 35
flag = ""

for i in range(count):
    val = struct.unpack_from('<I', data, file_offset + i*4)[0]
    x = val // (2*i + 1)
    flag += chr((x >> 8) & 0xFF)
    flag += chr(x & 0xFF)

print(flag)
```

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: IFEST13{w3ll_n07h1n9_1z_fr33_1n_l1f3_s0_7h15_1z_n07_s0_fr33_4f73r_4ll}</div>
</div>
```
