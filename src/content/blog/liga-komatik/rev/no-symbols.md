---
title: "No Symbols"
description: ""
pubDate: 2025-07-13 21:00
category: "Reverse Engineering"
event: "Liga Komatik"
heroImage: ""
---

## No Symbols

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
● v12 adalah array yang ada di dalam binary yang digunakan untuk membandingkan input.
● Di dalam program, input user di-XOR dengan 0x14, lalu dibandingkan dengan elemen di
v12.
● Untuk mendapatkan input yang benar (flag), kita cukup membalik proses itu: karakter =
elemen ^ 0x14.
● Script ini mengembalikan flag yang tepat setelah proses XOR dibalik.
Terakhir, tinggal jalankan program tersebut untuk mendapatkan flag

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{remov1ng_symb0l_table5_is_4_comm0n_rev_tr1ck}</div>
</div>
```
