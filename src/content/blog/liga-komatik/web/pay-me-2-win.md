---
title: "pay me 2 win"
description: ""
pubDate: 2025-07-13 21:00
category: "Web Exploitation"
event: "Liga Komatik"
heroImage: ""
---

## Pay me 2 win

<img width="434" height="352" alt="image" src="https://github.com/user-attachments/assets/6d405bb0-b64c-462f-94f3-79ffe7ef385d" />

Buka link yang tersedia, dan ditemukan potongan source code (index.php) berikut

<img width="571" height="219" alt="image" src="https://github.com/user-attachments/assets/990fdc00-7135-4831-8eb7-3382cecccb0f" />

Terdapat hint yang diberikan di bagian komentar, mengikuti petunjuk pada komentar, kita
mengunjungi alamat berikut:
http://ctf.asgama.online:40003/?is_debug=1
Setelah dibuka lalu di scroll ke bawah, ditemukan potongan suatu source code PHP berikut:

<img width="606" height="372" alt="image" src="https://github.com/user-attachments/assets/c7b3cc5c-118e-4455-8189-f8879af6bfe7" />

Dari potongan kode di atas, kita bisa menyimpulkan:

- Input money dikirim melalui metode POST.
- Nilai money harus merupakan digit numerik (ctype_digit).
- Kemudian, nilai tersebut dijumlahkan dengan 0x1337 (atau 4919 dalam desimal), dan
  dibandingkan apakah hasilnya === 0.
- Jika kondisi ini terpenuhi, maka flag akan ditampilkan.

Namun, karena ctype_digit() hanya menerima angka positif tanpa tanda minus, kita tidak bisa
langsung mengirim nilai -0x1337 untuk membuat hasil akhir menjadi nol. Solusi untuk ini adalah
mengirim nilai overflow yang jika ditambahkan dengan 0x1337 menghasilkan nol saat dikonversi
ke tipe int.
Untuk mengakali pengecekan ctype_digit, kita manfaatkan integer overflow. Nilai money yang
kita kirim adalah:
18446744073709546697
Nilai ini merupakan hasil dari:

<img width="601" height="33" alt="image" src="https://github.com/user-attachments/assets/adc0e849-cec7-41c3-8105-5c1fc2e25107" />

Ketika nilai ini dikonversi ke int dalam konteks 64-bit integer overflow, hasil akhirnya adalah
-0x1337, sehingga:

```py
(int)($money+0x1337)===0
```

Kemudian, untuk memudahkan proses exploitasi, kita menggunakan burpsuite untuk mengubah
request value.

<img width="505" height="780" alt="image" src="https://github.com/user-attachments/assets/5b44d62d-3398-40e1-a53a-d84971fcb156" />

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{w0w_ez_0v3rfl0w}</div>
</div>
```
