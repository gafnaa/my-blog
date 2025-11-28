---
title: "redirection"
description: ""
pubDate: 2025-07-13 21:00
category: "Pwn"
event: "Liga Komatik"
heroImage: ""
---

## Redirection

<img width="390" height="322" alt="image" src="https://github.com/user-attachments/assets/f6290939-e008-430a-9efe-f89b7a93057d" />

Kita diberikan link untuk connect ke server:
Kita juga diberikan sebuah file binary (redirection) yang merupakan source code dari chall ini.
Kemudian, kita membuka program tersebut menggunakan IDA untuk melakukan proses
dekompilasi dan analisis alur program.

<img width="536" height="97" alt="image" src="https://github.com/user-attachments/assets/6bc5f569-8055-4446-8c29-992cdc091b9d" />
<img width="360" height="263" alt="image" src="https://github.com/user-attachments/assets/d54b3811-77f4-4f1a-9d75-d2d88bd67c02" />

Penjelasan file:

- Fungsi main() memanggil vulnerable() dengan parameter:
  <img width="269" height="27" alt="image" src="https://github.com/user-attachments/assets/d54ff819-2844-4a4f-b57a-b90c4374fd77" />

- Fungsi vulnerable() melakukan hal-hal berikut
- Membaca file flag.txt
- Menyimpan isinya ke dalam buffer flag yang ada di .bss
- Meminta input user dengan scanf("%s", v1) di buffer berukuran 32 byte
- Buffer v1 dialokasikan di stack sebesar 32 byte → rawan buffer overflow
- Binary tidak menggunakan PIE, jadi alamat flag bisa diprediksi

Dengan informasi ini, kita tahu bahwa kita bisa melakukan buffer overflow untuk menimpa return
address dan menjalankan ROP chain agar memanggil puts(flag) dan mencetak flag ke layar.

<img width="475" height="303" alt="image" src="https://github.com/user-attachments/assets/bdd67c2d-58ed-433a-9587-9788402f2784" />

Penjelasan Program:

- Kita menggunakan pwntools untuk meng-handle koneksi dan pengiriman payload.
- Payload dibuat dengan overflow sebanyak 40 byte (b"A"\*40) untuk mencapai return
  address.
- pop rdi; ret digunakan untuk mengatur argumen pertama fungsi puts(), yaitu alamat
  buffer flag.
- Lalu kita panggil puts@plt dengan argumen flag.
- Tambahan ret (0x40101a) digunakan untuk stack alignment jika dibutuhkan oleh sistem
  tertentu (misal glibc modern).

Dengan menggunakan teknik buffer overflow dan ROP sederhana ini, kita berhasil mendapatkan
flag dari binary yang diberikan.

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{flow_redirection_is_similar_to_ret2win}</div>
</div>
```
