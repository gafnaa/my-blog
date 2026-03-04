---
title: "Web V1"
description: ""
pubDate: 2025-05-11 21:00
category: "Web Exploitation"
event: "IFEST13"
heroImage: ""
---

## Web V1

> This is my first time making a website using Python!!!! 😀

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

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: IFEST13{4b0a3c7d05927b28970fdfffe803e7fb}</div>
</div>
```
