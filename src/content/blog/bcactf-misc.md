---
title: "BCACTF 2025 - Misc"
description: ""
pubDate: 2025-07-14 19:00
slug: "bcactf-misc"
---

## Misc

## dessert_time

### Desc

I'm a very good planner, but my robotics competition really fried my brain! I remember eating something for the past few weeks but I just can't seem to remember what. Can you please help me? Here's my schedule for 

https://docs.google.com/spreadsheets/d/152qYlpG-FRBdHEfemX1_zD6dX1y1BO2JVmlxRRTYhDM/edit?usp=sharing

### Solution

Keyword Search: With the clue that you eat it in the morning and sometimes as a snack in the evening, I searched for letters that when combined would form the name of the food. I found the letters that make up “Apple_pie”.

Match with Clue: The letters that make up “Apple pie” appear at times that match your clues:

Morning: Most of the letters that make up “Apple pie” appear on the morning schedule (between 4am and 10am).
Evening: Some of the letters “e” also appear at night, which matches the clue “snack at night”.

Flag name: The characters that appear before the curly brackets { are b, c, a, c, t, f. Combined, these characters form the flag name: bcactf.

Flag Contents: The characters that come between { and } are A, p, l, e, _, p, i, e, S, _, A, r, e, y, u, M, M, y.

If these characters are rearranged, they will form a sensible sentence that relates to the previous answer:
Apple_pieS_Are_yuMMy (Apple pies are yummy).

### Flag 
    bcactf{Apple_pieS_Are_yuMMy}


## expletive

### Desc 

oh no! it seems like only some of the characters on my keyboard are working...

nc challs.bcactf.com 38421

### Solve

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

### Flag
    bcactf{fudG3_5hOo7_d4rn100}

## molasses

### Desc

This GIF shows the flag letter-by-letter but it's really slow and I don't want to wait all day. Maybe there's a faster way to get the flag?

### Solution

Just extract GIF to frames

i use this https://ezgif.com/split

### Flag

    bcactf{is_it_gif_or_gif_a51fd7ace416}