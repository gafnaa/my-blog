---
title: "Liga Komatik 2025 - Writeup"
description: ""
pubDate: 2025-07-13 21:00
slug: "ligakomatik-wu"
---

## team : Satpam Digital

- [Web](#web)
- [Rev](#rev)
- [Foren](#foren)
- [STEGANO](#stegano)
- [MISC](#misc)

## Web

### Pay me 2 win

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

### Flag
```
LK25{w0w_ez_0v3rfl0w}
```
## Rev

### Baby rev

<img width="402" height="309" alt="image" src="https://github.com/user-attachments/assets/13f193e3-cb16-4fd8-93c5-73b6a8b71160" />

Unduh file baby_rev tersebut.
Lakukan command file untuk mendapatkan informasi mengenai ekstensi file
Artinya, file ini merupakan file executable 64-bit Linux (ELF 64-bit).
Langkah cepat pertama dalam reverse engineering adalah mencoba melihat string literal di dalam
binary tersebut, yaitu dengan command berikut:

<img width="609" height="56" alt="image" src="https://github.com/user-attachments/assets/73e334c2-83c7-4852-a3ad-3edacf782235" />

### Flag
```
LK25{just_0p3n_th1s_1n_n0t3p4d}
```

### No symbols
<img width="413" height="340" alt="image" src="https://github.com/user-attachments/assets/9365d2ae-936d-461d-8558-8fb6a8a743ff" />

Kita diberikan sebuah file binary (no_symbols) yang meminta input:

<img width="612" height="67" alt="image" src="https://github.com/user-attachments/assets/69cb9170-c933-43ed-af14-f6f1b071a22b" />

Tujuannya adalah menemukan flag yang benar.
Setelah membuka file ini di disassembler, kami menemukan fungsi seperti ini:

<img width="370" height="81" alt="image" src="https://github.com/user-attachments/assets/a9c9c826-b803-4112-9f25-6b04bcd01447" />

Artinya:
- Program membaca 51 karakter input dari user ke dalam array v13.
- Tiap karakter akan di-XOR dengan 0x14 (heksadesimal untuk 20 desimal).
- Hasil XOR dibandingkan dengan array v12, yang sudah ditentukan di awal program.
- Jika semua cocok, maka input dianggap sebagai flag yang benar.

Untuk mencari flag yang benar, kita cukup membalik operasi XOR yang digunakan dalam
program.

Di dalam file binary tersebut terdapat sebuah fungsi yang berisi array konstanta (disebut v12
dalam pseudocode hasil disassembly). Program akan membaca 51 karakter dari input pengguna,
kemudian melakukan operasi XOR setiap karakter dengan 0x14 (heksadesimal untuk 20 desimal),
lalu hasilnya dibandingkan dengan elemen-elemen di array tersebut.

<img width="610" height="401" alt="image" src="https://github.com/user-attachments/assets/56ac9a26-59a3-4caa-bc56-5a26479b63cc" />

Kemudian, kita menggunakan script berikut untuk membantu

<img width="283" height="131" alt="image" src="https://github.com/user-attachments/assets/e269c9cd-1bb1-420f-bd11-17e8c129159b" />

Penjelasan dari kode tersebut:
●   v12 adalah array yang ada di dalam binary yang digunakan untuk membandingkan input.
●   Di dalam program, input user di-XOR dengan 0x14, lalu dibandingkan dengan elemen di
    v12.
●   Untuk mendapatkan input yang benar (flag), kita cukup membalik proses itu: karakter =
    elemen ^ 0x14.
●   Script ini mengembalikan flag yang tepat setelah proses XOR dibalik.
    Terakhir, tinggal jalankan program tersebut untuk mendapatkan flag

### Flag
```
LK25{remov1ng_symb0l_table5_is_4_comm0n_rev_tr1ck}
```
