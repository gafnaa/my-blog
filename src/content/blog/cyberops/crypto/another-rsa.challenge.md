---
title: "Another RSA Challenge"
description: ""
pubDate: 2025-08-1 19:00
category: "Cryptography"
event: "Cyber Ops Clash 2.0"
heroImage: ""
---

## Another RSA Challenge

> RSA di gitu gituin challenge

DIberi 2 file yaitu file skrip python dan outputnya, isinya kek gini:

```python
from Crypto.Util.number import *
from Crypto.Random import random
import os

BITS = 512
rand = random.randint(2,12)
primes = [getPrime(BITS) for _ in range(rand)]
e1 = 0x10001
n1 = phi = 1
for i in range(rand):
 n1 *= primes[i]
 phi *= primes[i]-1

p,q = getPrime(BITS), getPrime(BITS)
n2 = p*q
e2 = 3
phi2 = (p-1)*(q-1)
d2 = inverse(e2,phi2)

FLAG = b"Meta4Sec{REDACTED}"
while len(FLAG)*8 + 128 < (n1*n2).bit_length() :
 FLAG += os.urandom(16)
c = pow(bytes_to_long(FLAG), e1, n1*n2)

print("n1 = ", n1)
print("n2 = ", n2)
print("hehe1 = ", pow(d2,e2,n2))
print("hehe2 = ", pow(phi2,e2,n2))
print("leaked_phi = ", phi&((1<<(BITS*(rand-1)))-1))
print("ct = ", c)
```
