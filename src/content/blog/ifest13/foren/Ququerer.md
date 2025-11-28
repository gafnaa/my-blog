---
title: "Qurquerer"
description: ""
pubDate: 2025-05-11 21:00
category: "Forensic"
event: "IFEST13"
heroImage: ""
---

## Ququerer

> permisi paket, mau bayar cash apa qris?

Jadi kita diberi file `.pcap` atau packet capture, langsung saja cuss ke wireshark buat dianalisis. Pertama yang terlintas pikiran ya follow.

Sudah liat sana sini, ternyata gada hubungannya dengan flag, mari liat packet capture nya (males bgt cik).

Setelah liat packet satu persatu ternyata packet icmp dengan length `>= 100` dari byte 32 masing-masing berisi signature PNG dan chuck IEND, setelah meng-convertnya menjadi sebuah PNG file didapatkan seperti ini:

![QR Code Preview](https://i.imgur.com/example1.png)

Woilah qr code nya ngintip, jadi saya mencoba memfilter packet icmp dengan length `>= 100` untuk diconvert menjadi gambar, dengan script berikut:

```python
from PIL import Image
import os
import scapy.all as scapy

pcap = scapy.rdpcap('ququerer.pcap')

output_dir = 'imagez'
os.makedirs(output_dir, exist_ok=True)

count = 0
for pkt in pcap:
    if pkt.haslayer(scapy.ICMP) and len(pkt) > 100:
        raw = bytes(pkt.payload)
        fragment = raw[32:]
        fname = os.path.join(output_dir, f'image_{count:04d}.jpg')
        with open(fname, 'wb') as f:
            f.write(fragment)
        count += 1

paths = sorted(
    os.path.join(output_dir, f)
    for f in os.listdir(output_dir)
    if f.lower().endswith('.jpg')
)

imgs = [Image.open(p) for p in paths]
max_w = max(i.width for i in imgs)
total_h = sum(i.height for i in imgs)
canvas = Image.new('RGB', (max_w, total_h), (255, 255, 255))
y = 0
for i in imgs:
    x = (max_w - i.width) // 2
    canvas.paste(i, (x, y))
    y += i.height
canvas.save('tez.png')
```

Hmmm, tidak bisa di-scan. Gambarnya yang agak lonjong membuat saya curiga, setelah melihatnya dengan seksama, ternyata setiap fragment gambarnya double, jadi increment iterasinya saya naikkan menjadi 2, dengan script berikut:

```python
from PIL import Image
import os
import scapy.all as scapy

pcap = scapy.rdpcap('ququerer.pcap')

output_dir = 'imagez'
os.makedirs(output_dir, exist_ok=True)

count = 0
for pkt in pcap:
    if pkt.haslayer(scapy.ICMP) and len(pkt) > 100:
        raw = bytes(pkt.payload)
        fragment = raw[32:]
        fname = os.path.join(output_dir, f'image_{count:04d}.jpg')
        with open(fname, 'wb') as f:
            f.write(fragment)
        count += 1

paths = sorted(
    os.path.join(output_dir, f)
    for f in os.listdir(output_dir)
    if f.lower().endswith('.jpg')
)
imgs = [Image.open(p) for p in paths]
max_w = max(i.width for i in imgs)
total_h = sum(i.height for i in imgs)
canvas = Image.new('RGB', (max_w, int(total_h / 2 + 1)), (255, 255, 255))
y = 0
for i in imgs[::2]:
    x = (max_w - i.width) // 2
    canvas.paste(i, (x, y))
    y += i.height
canvas.save('tez.png')
```

Dan benar saja qr code nya tidak lonjong lagi dan dapat di-scan.

### Flag:

```
IFEST13{M4ST3R_R3CONSTRUCT0R_PACK3T}
```
