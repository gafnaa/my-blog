---
title: "expletive"
description: ""
pubDate: 2025-07-14 19:00
category: "Misc"
event: "BCACTF"
heroImage: ""
---

## Expletive

> oh no! it seems like only some of the characters on my keyboard are working...

Given this file

```py
blacklist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def security_check(s):
    return any(c in blacklist for c in s) or s.count('_') > 50

BUFFER_SIZE = 36

while True:
    cmds = input("> ")

    if security_check(cmds):
        print("invalid input")
    else:
        if len(cmds) > BUFFER_SIZE:
            print(open("flag.txt", "r").read())
            break
        else:
            print("nope")
```

So, to get the flag, you need to provide an input that satisfies three conditions:

1. It must not contain any alphanumeric characters (a-z, A-Z, 0-9).
2. The number of underscore characters (`_`) must not exceed 50.
3. The total length of the input string must be greater than 36 characters.

```sh
 python3 -c "print('_' * 37)" | nc challs.bcactf.com 38421                                                         ─╯
> bcactf{fudG3_5hOo7_d4rn100}
```

<div class="flag-component">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  <div class="content">Flag: bcactf{fudG3_5hOo7_d4rn100}</div>
</div>
