---
title: "run_me.png"
description: ""
pubDate: 2025-07-13 21:00
category: "Forensic"
event: "Liga Komatik"
heroImage: ""
---

## run_me.png

<img width="400" height="331" alt="image" src="https://github.com/user-attachments/assets/ff046516-a630-4b61-b9eb-3763013379f3" />

Pada challenge ini, kita diberikan sebuah program Python yang menyimpan data biner ke dalam
sebuah gambar PNG

<img width="529" height="167" alt="image" src="https://github.com/user-attachments/assets/822849ee-366c-4a0b-97f6-f90b7b6d01ad" />

Program ini mengonversi isi file main menjadi sebuah gambar dengan cara mengemas setiap 3
byte sebagai satu warna pixel. Gambar yang dihasilkan menyimpan semua informasi dari file asli
dalam bentuk visual. Teknik ini memungkinkan file biner disembunyikan atau ditransmisikan
melalui file gambar.

<img width="349" height="177" alt="image" src="https://github.com/user-attachments/assets/05f12bf9-7c41-4f29-87e6-cca409219271" />

Setelah kita tahu bahwa program pertama menyimpan isi file main ke dalam gambar hidden.png
dengan cara mengubah setiap 3 byte menjadi satu warna pixel (RGB), maka langkah berikutnya
adalah mengembalikan data tersebut ke bentuk semula. Program kedua atau program solver
digunakan untuk tujuan ini. Program tersebut akan membuka gambar hidden.png, lalu membaca
setiap pixel satu per satu. Nilai warna merah, hijau, dan biru dari setiap pixel dikumpulkan kembali menjadi urutan byte. Seluruh byte tersebut kemudian disatukan dan disimpan dalam file baru bernama extracted_main, yang merupakan hasil rekonstruksi dari file main sebelum dikonversi ke gambar.

Penjelasan program:

- Membuka gambar hidden.png menggunakan library Pillow (PIL) untuk dibaca pixel-nya.
- Mengambil ukuran gambar (lebar dan tinggi) untuk menentukan seberapa banyak pixel
  yang harus dibaca.
- Melakukan iterasi terhadap setiap pixel dari kiri ke kanan, atas ke bawah.
- Membaca nilai RGB dari setiap pixel dan menggabungkan ketiganya sebagai tiga byte
  data.
- Mengumpulkan semua byte ke dalam satu bytearray, sehingga membentuk kembali data
  asli yang sebelumnya dikonversi.
- Menyimpan hasil ekstraksi ke dalam file extracted_main dalam mode biner (wb), sebagai
  hasil rekonstruksi file asli.

Terakhir, tinggal cek isi file extracted_main untuk melihat flagnya

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{i_think_the_output_is_kinda_cool}</div>
</div>
```
