---
title: "Orbiter"
description: ""
pubDate: 2025-05-11 21:00
category: "Web Exploitation"
event: "IFEST13"
heroImage: ""
---

## Orbiter

> 3 people go to the moon, keep in communication with them

Diberikan sebuah link website, dengan tampilan sebagai berikut:

![Orbiter Website](https://i.imgur.com/example3.png)

Setelah memeriksa isi source code dari halaman tersebut, tidak ditemukan informasi yang mencurigakan atau berguna. Oleh karena itu, kami mencoba melakukan enumerasi direktori menggunakan `dirb` untuk mencari tahu apakah terdapat direktori tersembunyi yang dapat diakses.

Dari hasil pemindaian menggunakan `dirb`, ditemukan 3 direktori yang ada, namun hanya `/phpinfo.php` saja yang bisa diakses (code:200). Lalu, setelah diakses berikut merupakan tampilannya:

![phpinfo page](https://i.imgur.com/example4.png)

Pada halaman tersebut, kami menemukan beberapa nilai pada variabel `$_SERVER` yang mencurigakan, antara lain:

- `$_SERVER['FLAG-ID'] = Armstrong`
- `$_SERVER['FLAG-PASS-TRUE'] = 345Y_P34SY`
- `$_SERVER['SECRET_FLAG'] = (berisi array nilai hexadesimal)`

Kami berasumsi bahwa `FLAG-ID` dan `FLAG-PASS-TRUE` merupakan username dan password yang dapat digunakan untuk login ke halaman utama sebelumnya. Sementara itu, bagian `SECRET_FLAG` tampaknya berisi flag yang disamarkan dalam bentuk heksadesimal.

Setelah menyalin isi dari `SECRET_FLAG` dan melakukan decoding menggunakan CyberChef, kami memperoleh hasil sebagai berikut:

`flag (part 1) : 34SY_P345Y`

Kemudian, kembali ke `/login.php`, login menggunakan username dan password berikut:

- username : `Amstrong`
- password : `34SY_P345Y`

Dan ternyata kami berhasil login!! Berikut tampilan halamannya:

![Logged in page](https://i.imgur.com/example5.png)

Setelah berhasil login ke halaman utama menggunakan kredensial yang ditemukan sebelumnya, kami mulai menganalisis cara kerja dari fitur yang tersedia di website tersebut. Ternyata, website ini menyediakan fungsi untuk melakukan ping terhadap sebuah IP atau domain. Apabila input yang diberikan tidak valid, maka sistem akan menampilkan pesan error.

Berdasarkan pola ini, kami mencurigai bahwa input yang dimasukkan langsung dieksekusi oleh sistem, sehingga berpotensi rentan terhadap command injection. Untuk menguji hal ini, kami mencoba mengirimkan payload berikut: `google.com; ls`

Hasilnya, perintah berhasil dieksekusi dan sistem menampilkan output dari perintah `ls`, yang menandakan bahwa situs ini memang rentan terhadap command injection.

Kami menduga bahwa file `flag.txt` atau `true_flag.txt` berisi bagian dari flag. Maka, kami mencoba membaca isi file `flag.txt` terlebih dahulu menggunakan perintah: `google.com; cat flag.txt`

Namun, hasil yang kami dapatkan adalah: `NOT IN HERE`

Artinya, flag tidak berada di file tersebut. Kami kemudian mencoba membuka file `true_flag.txt` dengan: `google.com; cat true_flag.txt`

Dan berhasil mendapatkan bagian ketiga dari flag: `(3)5QU332Y`

Selanjutnya, kami mencoba mengecek isi dari file `secret.txt` menggunakan payload: `google.com; cat secret.txt`

Hasil yang kami dapatkan adalah sebuah string heksadesimal panjang: `f1b1e6e09e23c2ead618c173cc782f42ab1fa7d07c4a5c91c30db0821fb2b`

Kami menduga bahwa ini merupakan bagian kedua dari flag, namun kami tidak mengetahui metode enkripsi atau hashing apa yang digunakan. Upaya untuk mendekripsinya dengan hash umum seperti MD5, SHA-1, dan SHA-256 tidak memberikan hasil yang relevan.

Karena tidak menemukan cara pasti untuk mendekripsi string tersebut, kami mencoba melakukan asumsi berdasarkan pola flag yang sudah didapat:

- Part 1: `34SY_P345Y` (ditemukan dari `phpinfo.php`)
- Part 3: `5QU332Y` (ditemukan di `true_flag.txt`)

Melihat pola ini, kami mengasumsikan bahwa part 2 kemungkinan berupa kata sandi bertema CTF atau hal yang sejenis, dan mencoba menebak bahwa bagian tengahnya mungkin adalah: `L3M0N`

Meskipun bagian tengah (`L3M0N`) didapat melalui asumsi, kami memutuskan untuk mencobanya terlebih dahulu. Ternyata, setelah melakukan submit, flag tersebut berhasil diterima sebagai jawaban yang benar.

### Flag:

```
IFEST13{345Y_P34SY_L3M0N_5QU332Y}
```
