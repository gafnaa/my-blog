---
title: "Baby Rev"
description: ""
pubDate: 2025-07-13 21:00
category: "Reverse Engineering"
event: "Liga Komatik"
heroImage: ""
---

## Baby Rev

<img width="402" height="309" alt="image" src="https://github.com/user-attachments/assets/13f193e3-cb16-4fd8-93c5-73b6a8b71160" />

Unduh file baby_rev tersebut.
Lakukan command file untuk mendapatkan informasi mengenai ekstensi file
Artinya, file ini merupakan file executable 64-bit Linux (ELF 64-bit).
Langkah cepat pertama dalam reverse engineering adalah mencoba melihat string literal di dalam
binary tersebut, yaitu dengan command berikut:

<img width="609" height="56" alt="image" src="https://github.com/user-attachments/assets/73e334c2-83c7-4852-a3ad-3edacf782235" />

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{just_0p3n_th1s_1n_n0t3p4d}</div>
</div>
```
