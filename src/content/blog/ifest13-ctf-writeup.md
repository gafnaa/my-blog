---
title: "IFEST13 CTF UAJY 2025 - Writeup"
description: "team no fasilkom no worries"
pubDate: 2025-05-11 21:00
slug: "ifest13-ctf-writeup"
---

# IFEST13 CTF UAJY 2025 - Writeup

## Team no fasilkom no worries

## Table of Contents
- [WELCOME](#welcome)
- [CRYPTO](#crypto)
- [Forensics](#forensics)
- [WEB](#web)
- [REV](#rev)

---

## WELCOME

### Flag: IFEST13{JANGAN_LUPA_BERDOA_SESUAI_KEYAKINAN_MASING_MASING}

## CRYPTO
### Brute (340 Pts)

No need fancy crypto trick just brute, and btw you have to spin up to 20 vms with multi-thread to make it fast enough.
Pada challenge ini kita diberi dua file, satu berisi cipher dan satu kode how to cipher.

```python
from Crypto.Util.number import getStrongPrime
m = int.from_bytes("IFEST13{???}".encode())
p = getStrongPrime(1024)
q = getStrongPrime(1024)
n = p * q
print(f'{pow(m, 0x10001, n)}\n{n}\n{p >> 40}')
```

Kodenya cukup simple, but the reversing not so easy. Hal yang jelas, kita harus recover `n`, `p`, dan `q` buat dapetin `m`. `p` yang kita punya bukan `p` asli karena `p` yang kita punya kehilangan 40 bit karena shift ke kanan, anggap `p` nya adalah `p_high`, maka `p = p_high * 2^40 + x`, di mana `x` adalah 40 bit yang hilang. Nah buat cari `x`, kita bisa pake coppersmith method pake tools dari sagemath, yaitu `small_roots`.

Jadi `x` sudah dapat, berarti `p = p_high * 2^40 + x` juga udah dapat, otomatis `q` juga dapat karena `n = p * q <=> q = n / p`. Assekkk dah dapat semua, kita bisa dapetin `m` dengan informasi tadi berdasarkan persamaan ini:

```python
from sage.all import *

# Given values
c = 10190308328132298810370792830407498649727116694895887482897571470790876671909417379902577324803848850655954471082089060952194185721425541632970106409477409460179454591137511596832421737353754768175974443794887211632429320728354925107321000890255988379005072889707213292319847199584075893238735146835736979402380614028245390503793552296747076984394930725251632591625471426901314091323869057780461687871597918704838734422002502048443745431116004254026457663052173884656414629831184831431248595040967979335625485086150017379359647307566607127100190320972594606082853976569219798608787775461446205014804326191379628416459
n = 22052867210059985056723988324723437469643935229284382742545572507193384098102119262228001598529023654073757846310755124262636633869347982051002191511240379141051585596043583392443536537486511985566413114358501620593150325155980714427378089922768898334419054390129931556129883835862579370606862267536439488040273973837168042166190169509259514869605813849934412879327376082076832835805173922914432614662509276644729233158638994237998916272949330215708015931366306430206836771702005645140291164351968902134211930508335582704492675362575695821618037439189132191250206861088835015459823510074661891457866577589023776648751
p_high = 138398228938242977290956349154712526327465608129677172002562239407676097284597892604642541735116262199110899389173013415023231356739796256927576905061498760222434453315905920861684849512303589509164929424151033355318032546176479325956586655296074717479220347079941178337950508153135271887365359007

a = p_high * (2**40) # Reconstruct p_high << 40

R = PolynomialRing(Zmod(n), names=('x',))
x = R.gen()
f = x + a

# Find small roots using Coppersmith's method
x0 = f.small_roots(beta=0.33)

x0 = int(x0[0])
p = a + x
if n % p == 0:
    q = n / p
    e = 0x10001
    phi = (p - 1) * (q - 1)
    d = inverse_mod(e, phi)
    m = pow(c, d, n)
    byte_length = (m.bit_length() + 7) // 8
    flag_bytes = m.to_bytes(byte_length, 'big')
    try:
        flag = flag_bytes.decode()
        print(flag)
    except UnicodeDecodeError:
        print("Flag: ", flag_bytes.hex())
```

Btw aku make conda & sage env, lama bgt installnya, anyway, outputnya tinggal di-wrap ke format flag.

### Flag: IFEST13{happy_brute__as_long_as_possible_lol_it_wont_be_the_flag_isnt_it?}

## Forensics
### Ququerer (250 Pts)

permisi paket, mau bayar cash apa qris?
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

Script tersebut menghasilkan gambar berikut:

![Distorted QR Code](https://i.imgur.com/example2.png)

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

### Flag: IFEST13{M4ST3R_R3CONSTRUCT0R_PACK3T}

## WEB
### Web V 1 (280 Pts)

This is my first time making a website using Python!!!! 😀
Pada challenge ini, kita diberikan sebuah `.zip` file, langsung saja kita analisis file `app/main.py`. Terdapat potongan kode sebagai berikut:

```python
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect('/login')

    user = db.session.get(User, session['user_id'])
    if user.is_admin == '1':
        return render_template('index.html', admin=True,
                               username=user.username)
    else:
        return render_template('index.html', admin=False,
                               username=user.username)
```
Melihat ada `user.is_admin` menandakan adanya atribut `is_admin`.

```python
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method=='POST':
        data = request.form.to_dict()
        data['password'] = hash_password(data['password'])
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return redirect('/login')
```
Hal pertama kali yang terlintas dipikiran adalah membuat akun dengan atribut `is_admin=1` karena `request.from.to_dict()` bakal blindly masukin semua atribut termasuk `is_admin = 1`. Abis tu kita register.

Berhasil masuk dengan akun yang diregister tadi, terus dihadapkan dengan admin fetcher, mari kita kembali ke `main.py`:

```python
@app.route('/internal')
def internal():
    if request.remote_addr != '127.0.0.1':
        abort(403)
    return "Flag: IFEST13{fake_flag}"
```

Dari gambar di atas, berarti kita harus akses `127.0.0.1/internal` tapi tidak bisa, liat lagi ke atas:

```python
if 'daffainfo.com' not in url:
    result = "Error: Only URLs with hostname 'daffainfo.com' are allowed."
```
Ternyata dalam url yang ingin di-fetch harus ada `daffainfo.com`, jadi kita bisa kasi payload `http://daffainfo.com@127.0.0.1:1337/internal`, di mana si dafa sebagai userinfo dan bakalan di-ignore buat DNS resolution.

### Flag: IFEST13{4b0a3c7d05927b28970fdfffe803e7fb}

### Orbiter (480 Pts)

3 people go to the moon, keep in communication with them
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

### Flag: IFEST13{345Y_P34SY_L3M0N_5QU332Y}

## REV
### free flag (280 Pts)

Mr. Shock is feeling generous today, so here's an attached program that will give you the flag. Just in case you don't know who this generous person is.
Diberikan sebuah file binary, yang ketika dijalankan akan seperti ini:

![Binary Output](https://i.imgur.com/example6.png)

Selanjutnya, kami melakukan command `strings` untuk mencari petunjuk, dan ternyata ditemukan hal berikut:

![Strings Output](https://i.imgur.com/example7.png)

Artinya, file binary ini telah diproteksi menggunakan UPX executable packer. Oleh karena itu, sebelum bisa dilakukan decompiling atau analisis lebih lanjut, kita perlu melakukan proses unpacking terlebih dahulu untuk mendapatkan binary dalam bentuk aslinya.

Setelah berhasil melakukan proses decompress menggunakan UPX, kini file binary tersebut sudah berada dalam bentuk aslinya. Dengan demikian, kita dapat melanjutkan ke tahap berikutnya, yaitu melakukan decompiling untuk menganalisis isi dan logika dari program tersebut.

Di sini kami menggunakan Ghidra untuk melakukan decompiling program, dan didapatkan potongan fungsi `main` seperti berikut:

![Ghidra Main Function](https://i.imgur.com/example8.png)

Program meminta user untuk memasukkan sebuah flag. Jika benar, akan mencetak pesan sukses. Jika salah, akan mencetak pesan gagal. Flag dicek menggunakan algoritma tertentu tanpa menyimpan string flag secara langsung. Berikut untuk analisis lebih lanjut dari program.

Setelah pengguna memasukkan input, program akan memeriksa setiap 2 karakter dari input tersebut. Tiap pasangan karakter dikonversi menjadi sebuah bilangan `uint16_t`, kemudian dikalikan dengan bilangan ganjil `(2*i + 1)` dan dibandingkan dengan nilai yang sudah disimpan dalam memori di alamat `0x402360`.

Dengan kata lain, validasi flag dilakukan dengan cara:

`expected[i] == (2*i + 1) * ((char1 << 8) + char2)`

Jika semua pasangan karakter menghasilkan nilai yang sesuai, maka flag dianggap benar.

Nilai `expected` ini merupakan array sebanyak 35 buah bilangan `uint32_t` (setiapnya 4 byte), sehingga total panjang flag yang diharapkan adalah 70 karakter (karena tiap 2 karakter = 1 angka).

Dari hasil reverse engineering, diketahui bahwa:

- Setiap nilai dalam array `expected` di file binary adalah hasil enkripsi dari 2 karakter flag.
- Proses enkripsinya adalah: `val = (2*i + 1) * ((char1 << 8) + char2)`

Maka untuk membalik proses ini, kita cukup:
- Membagi setiap nilai `val` dengan `(2*i + 1)`
- Mengambil high-byte dan low-byte hasilnya sebagai dua karakter flag

Berikut script Python yang digunakan untuk mengambil dan mendekripsi flag dari file binary:

```python
import struct

with open('original', 'rb') as f:
    data = f.read()

vaddr = 0x402360
file_offset = data.find(b'\x46\x49\x00\x00') # Bisa diganti hardcoded offset langsung
count = 35
flag = ""

for i in range(count):
    val = struct.unpack_from('<I', data, file_offset + i*4)[0]
    x = val // (2*i + 1)
    flag += chr((x >> 8) & 0xFF)
    flag += chr(x & 0xFF)

print(flag)
```

### Flag: IFEST13{w3ll_n07h1n9_1z_fr33_1n_l1f3_s0_7h15_1z_n07_s0_fr33_4f73r_4ll}
