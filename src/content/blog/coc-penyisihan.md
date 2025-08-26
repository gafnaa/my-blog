---
title: "Cyber Ops Clash 2.0 - Penyisihan"
description: ""
pubDate: 2025-08-1 19:00
slug: "coc-penyisihan"
---

- [Crypto](#crypto)
- [Forensics](#forensics)
- [Web](#web)
- [Rev](#rev)
- [Pwn](#pwn)

## Crypto

### 0

Pada chall ini diberi 3 buah file, dua di antaranya merupakan pesan yang terenkripsi dan pesan yang sudah dekripsi dari pesan sebelumnya. Berdasarkan pattern-nya, pesan dapat didekripsi dengan membaca huruf dengan increment 2 kemudian jika sudah sampai paling kanan, baca huruf paling kanan yang belum dibaca lalu baca ke kiri dengan increment 2. Berikut solver yang digunakan

```c++
#include <bits/stdc++.h>
using namespace std;
#define int long long
signed main(){
    string s;
    cin >> s;
    int n = s.length();
    string ans = "";
    for(int i = 0; i < n; i += 2) ans += s[i];
    for(int i = n - 1 - (n & 1); i >= 0; i-=2)
    ans += s[i];
cout << ans << endl;
}
```

### Flag:

```
Meta4Sec{sajjjaddddkunnnn_absoluteeee_cineemaaaaaa_202cb962ac}
```

### BabyCry

> Kalau kamu paham bahasa francis, kamu bisa mendapatkan flagnya

Diberi file yang berisi teks sangat panjang, dengan mencari char ‘{‘ di teks saya dapat flag yang terenkripsi, yaitu “Olhc4Gpc{Cyua_Jkupnxvg_Lbefjpmmqu}”. Saya menebak Olhc4Gpc itu Meta4Sec (jelaslah ya). Tebakan pertama jelas vigenere.

Berdasarkan penggalan flag tersebut, didapat juga penggalan key “CHOCOLA”. Sisanya dapat diisi dengan tebakan kata yang cukup umum, yaitu “CHOCOLATE”.

### Flag:

```
Meta4Sec{Just_Vigenere_Encryption}
```
