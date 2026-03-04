---
title: "Martin and the Humming Signal"
description: ""
pubDate: 2025-07-13 21:00
category: "Foren"
event: "FIT Competition"
heroImage: ""
---

## Martin and the Humming Signal

> Martin tinggal sendirian di ujung gang, rumahnya penuh barang-barang aneh—dari jam dinding yang berputar mundur sampai radio tua yang selalu menyala, bahkan saat mati lampu. Suatu malam, terdengar suara berdesis dari radionya. Martin bilang itu “pesan penting” yang dikirimkan entah dari siapa... entah dari mana. Sebelum menghilang, Martin meninggalkan satu file rekaman yang katanya: “Dengerin baik-baik... mereka cuma bisa bicara lewat cara ini.” Download Sekarang rekaman itu ada padamu.

Diberi sebuah .wav file. Kami menjalankan exiftool, files, strings + grep, binwalk, tidak ada yang aneh. Selanjutnya kami mencoba analisis spectrogram menggunakan Audacity, berikut adalah bentuk spectrogramnya.

Saya sebelumnya belum pernah mengerjakan forensic/steg dari sebuah audio jadi membutuhkan waktu lama. Kami mencoba mencari write up problem dengan bentuk spectrogram yang serupa. Kami mendapat sebuah write up dengan prefix spectrogram yang serupa PlaidCTF 2017 - Misc/Signal Intelligence - Terebeep | bolek42.github.io

Writeup tersebut menyebut bahwa wav tersebut merupakan SSTV (Slow Scan TeleVision) yang merupakan sebuah metode mentransmisikan sebuah gambar dengan menggunakan sinyal radio. Akibat writeup tersebut terlalu technical kami mencoba mengulik writeup lain dengan kata kunci SSTV. Kami mendapat sebuah write up yang mencoba meng-decode SSTV tersebut menggunakan QSSTV. The Transmission: From Creation to Solution Walkthrough | by Mon | Medium.

Akhirnya dengan QSSTV kami mendapat sebuah gambar dengan QR Code yang jika di-decode menghasilkan sebuah base 64

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: FITUKSW{they_sing_in_static_and_dream_in_noise}</div>
</div>
```
