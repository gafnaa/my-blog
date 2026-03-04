---
title: "Bukti Fana"
description: ""
pubDate: 2025-07-13 21:00
category: "Misc"
event: "FIT Competition"
heroImage: ""
---

## Bukti Fana

> Tim kami menemukan sebuah program misterius dari server peretas. Temukan pesan tersembunyi dari program tersebut.

Diberi sebuah exe file. Kami menjalankan exe tersebut (gw takut cik panit ngasi malware, pls jangan gw masi saya mesin gw). Program tersebut mengeluarkan output berupa sebuah file bernama arboros_20250704_203435 yang dari isinya seperti log file. Pada ss_data terlihat memiliki value berupa base64, kami mencoba decode sebagian dari prefix base64 tersebut.

JFIF mengindikasikan bahwa value ss_data adalah data sebuah JPG file yang di-encode ke base64. Kami mencoba meng-convert datanya menjadi sebuah JPG file.

JPG file tersebut ternyata screenshot dari desktop mesin saya.

Dengan menjalankan exiftool, kami mendapat dua flag, kami sempat khawatir bahwa keduanya adalah false flag karena terasa terlalu gampang. Kami punmencoba submit flag pada Image Description dan beruntungnya kami diberi hasil correct.

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: FITUKSW{watch_what_you_see}</div>
</div>
```
