---
title: "The Power of Logs"
description: ""
pubDate: 2025-07-13 21:00
category: "Misc"
event: "FIT Competition"
heroImage: ""
---

## The Power of Logs

> Sebuah organisasi lingkungan bawah tanah yang dikenal sebagai Veridian Accord diduga merencanakan aksi skala besar untuk "merekode ulang bumi". Selama penggerebekan markas salah satu anggotanya, tim forensik menemukan printer tua yang tampaknya telah digunakan untuk mencetak sesuatu — tapi alih-alih hasil cetakan biasa, hanya file log sistem internal yang berhasil dipulihkan. Log tersebut tampak seperti catatan aktivitas sistem bus data atau debug perangkat keras, dengan format yang tidak lazim. periksalah log tersebut untuk memahami isi sebenarnya. Mungkinkah ada sesuatu yang mereka sembunyikan?

Diberi sebuah log file bernama printer_log, yang berisi seperti berikut :

Problem klasik ctf yang mengubah log dari sebuah printer menjadi sebuah gambar. Pada setiap baris pada log mengartikan :

tx : koordinat x dari sebuah pixel

ty : (thank you) koordinat y dari sebuah pixel

packet : tiga nilai RGB (kiri Red, tengah Green, kanan Blue)

```python
from PIL import Image
import re

with open("printer_log.txt", "r") as f:
lines = f.readlines()

pixels = []
max_x = 0
max_y = 0

pattern = re.compile(r'tx=(\d+), ty=(\d+)\s+:: packet:\s+(\d+).(\d+).(\d+)')
for line in lines:
match = pattern.search(line)
if match:
x, y = int(match[1]), int(match[2])
r, g, b = int(match[3]), int(match[4]), int(match[5])
pixels.append((x, y, (r, g, b)))
max_x = max(max_x, x)
max_y = max(max_y, y)

img = Image.new("RGB", (max_x + 1, max_y + 1), color=(0, 0, 0))

for x, y, color in pixels:
img.putpixel((x, y), color)

img.save("output.png")
```

### Flag:

```
FITUKSW{r3c0d3_th3_34rth_1s_3451}
```
