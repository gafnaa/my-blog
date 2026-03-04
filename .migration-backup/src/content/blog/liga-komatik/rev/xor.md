---
title: "XOR"
description: ""
pubDate: 2025-07-13 21:00
category: "Reverse Engineering"
event: "Liga Komatik"
heroImage: ""
---

## XOR

<img width="361" height="275" alt="image" src="https://github.com/user-attachments/assets/d2005a0a-18d4-4280-b1d7-e9af5a00ebde" />

Kita diberikan sebuah file binary (xor) yang meminta input

<img width="542" height="108" alt="image" src="https://github.com/user-attachments/assets/014bea7c-4e17-4ff1-9a70-e9575223b669" />

Kemudian, kita membuka program tersebut menggunakan Ghidra untuk melakukan proses
dekompilasi. Didapatkan fungsi berikut:

<img width="490" height="398" alt="image" src="https://github.com/user-attachments/assets/7a6d4bb2-73ef-4f7f-acfc-4474497a4128" />
<img width="551" height="575" alt="image" src="https://github.com/user-attachments/assets/db5435d3-d0ff-499a-a3c9-3f151aa0186e" />

Analisis program:

- Terdapat sebuah string panjang berisi karakter acak:
  "asdghkashdfclkamsdfjalxsdkjfxhcaksvjnalsckuqpoiewt"
- Program memilih beberapa karakter dari string tersebut dengan pola tertentu, lalu
  menyimpannya ke dalam variabel local_148. Karakter-karakter ini nantinya akan
  digunakan sebagai hasil pembanding akhir.
- Password yang dimasukkan pengguna akan di-XOR satu per satu dengan nilai dari array
  local_e8. Hasilnya kemudian disimpan di variabel local_108.
- Program akan membandingkan local_108 (hasil XOR dari input) dengan local_148. Jika
  sama, berarti password benar.

Karena kita tahu hasil akhirnya (local_148) dan kunci XOR-nya (local_e8), maka kita bisa
membalik prosesnya. Berikut program yang kita buat untuk membantu.

<img width="556" height="214" alt="image" src="https://github.com/user-attachments/assets/e5ef9157-6f37-4d00-a2cb-7d12a5994220" />

Dalam program ini, program meminta user memasukkan password sepanjang 50 karakter.
Password tersebut akan di-XOR satu per satu dengan array kunci (local_e8) dan hasilnya
dibandingkan dengan string acuan (local_148) yang dibentuk dari string local_168. Jika hasil
XOR cocok, maka password benar dan ditampilkan flagnya.

<img width="554" height="58" alt="image" src="https://github.com/user-attachments/assets/bf6e0152-9c04-419b-ab26-bd38e49969fb" />

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: LK25{remov1ng_symb0l_table5_is_4_comm0n_rev_tr1ck}</div>
</div>
```
