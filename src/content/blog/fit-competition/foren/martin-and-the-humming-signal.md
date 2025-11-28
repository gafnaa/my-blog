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

### Flag:

```
FITUKSW{they_sing_in_static_and_dream_in_noise}
```
