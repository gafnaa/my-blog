---
title: "Power Plant"
description: ""
pubDate: 2025-07-13 21:00
category: "Web Exploitation"
event: "FIT Competition"
heroImage: ""
---

## Power Plant

> This power plant's website is open for public viewing, but perhaps they've been a little too open with certain configurations.

Pada challenge ini, kita diberikan sebuah link website, langsung saja kita akses

Setelah mencari informasi di web ini tidak ditemukan sesuatu yang mencurigakan, oleh karena itu kita coba akses beberapa endpoint penting.

Setelah akses /robots.txt ditemukan informasi berikut

Lalu, coba akses http://20.6.129.177:8081/secret_code.txt, namun mendapat 404 Not Found.

Lalu pada halaman utama tadi terdapat gambar dan setelah di cek untuk direktori lokasi gambar ada di

http://20.6.129.177:8081/static/images/power_plant.png

Kita coba untuk taruh endpoint /secret_code.txt ke dalam /static

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: FITUKSW{b3_ec0_fr13ndly}</div>
</div>
```
