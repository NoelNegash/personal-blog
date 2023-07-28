---
layout: post
title:  "CyberTalents Write-up: Ethiopia National Cybersecurity CTF 2020"
author: Noel Alemayehu
date:   2020-08-23 22:19:18 +0300
image: "/assets/blog_images/post_covers/ctf-cover.png"
categories: hacking hackathon cybersecurity
description: "Writeup for a cybersecurity hackathon"
published: true
---


Yesterday, I participated in the National Cybersecurity CTF hosted in Ethiopia by CyberTalents. Considering it was my first CTF, as well as my having only one other team member and missing the training sessions given by CyberTalents, I was very satisfied with getting 4th place in the competition out of 37 teams.

The format of the CTF competition was 10 challenges ranging from easy to hard with 7 hours given to solve them. They tested our abilities in branches of cybersecurity such as General Information, Digital Forensics, Web Security, Cryptography and Malware Reverse Engineering. In this article, I will be showing how we solved the 8 questions we figured out during the competition, as well as one we did immediately after. Number 10 was way out of my league. Maybe I'll write a follow up article when I get it. So without further ado, here are the questions.


**Cracker** (*General Information*)


A simple question, asking us the name of a popular Linux tool used as a "packet&nbsp;sniffer, WEP and WPA/WPA2-PSK cracker".


The answer is obviously `aircrack-ng`.


**Unprotected** (*Digital Forensics*)


In this challenge, we were given `Unprotected.pcap`, a packet capture file, and told to find the flag inside it. By opening it in Wireshark, we can see it's a combination of TCP and HTTP packets.

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-3-1024x928.png" alt=""/></div>


A simple filter `data.data contains "flag"` leaves just one TCP packet, which contains the flag `flag{cl3ar_t3xt_15_alway35_5asy}`.

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-1024x924.png" alt=""/></div>


**Encrypted RSA** (*Cryptography*)


In this challenge, we are given a RSA-encrypted file called `secret`, as well as the `p`, `q` and `e` used to encrypt it. All of this enough information to decrypt the file. So after a fast search on [crypto.stackexchange.com](https://crypto.stackexchange.com/questions/19444/rsa-given-q-p-and-e), we made this script.


{% highlight python %}

def egcd(a, b):
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
        gcd = b
    return gcd, x, y
 
def main():
 
    p = 11882546252751469607361356421348933496327112595288260315935663917400681403905188808476289112967043136936045873689827577396206505769293138372274271493958287
    q = 10374751834382966611285517450958269115435289482194774831009591093240922739864785750413607023913149510232252798244495377789107452564252835088008933746132847
    e = 65537
 
 
    cipher_text = int.from_bytes(open("secret","rb").read(), byteorder="big")
 
 
    # compute n
    n = p * q
 
    # Compute phi(n)
    phi = (p - 1) * (q - 1)
 
    # Compute modular inverse of e
    gcd, a, b = egcd(e, phi)
    d = a
 
    print( "n:  " + str(d));
 
    # Decrypt ciphertext
    pt = pow(cipher_text, d, n)
 
    print( "plain textt: " + str(int.to_bytes(pt, 128, byteorder="big")) )
 
main()

{% endhighlight %}

Running the script outputs a series of null bytes followed by `Nice Job, flag is FLAG{Gr3at_J0b_F0r_Th3_D3crypti0n}`.

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-5-1024x335.png" alt=""/></div>


**Gu55y** (*Web Security*)


In this challenge, we were given a [url](http://ec2-18-156-199-115.eu-central-1.compute.amazonaws.com/guessy/") to exploit. Its functionality is to take your inputs and store them in your cookies as a serialized php list, so that it may display them again when you refresh the page. 


<div class="flex-container"><img src="/assets/blog_images/2020/08/image-6.png" alt=""/></div>


Crossing out SQL injection as a vector, we inspected the the page source and found an HTML comment reading `&lt;!-- I love vim~ --&gt;`. Seeing that `vim` was involved, we tried to search for known `vim` file extensions such as `.php~` and `.php.un~`. We succeeded in downloading `.index.php.swp`, which gave us this code.

{% highlight php %}

#try to read fl4g.php
Class l33t{
    public function __toString()
    {
        return highlight_file($this->source,true);
    }
}
{% endhighlight %}

This code excerpt gave us two things, the location of the flag and the vector with which we could get it. We made a `l33t` object and set its `source` to `fl4g.php`. We then serialized it in a list, url-encoded it and put the value in our `list` cookie.

**serialized**: `a:1:{i:0;O:4:"l33t":1:{s:6:"source";s:8:"fl4g.php";}}`

**urlencoded**: `a%3A1%3A%7Bi%3A0%3BO%3A4%3A%22l33t%22%3A1%3A%7Bs%3A6%3A%22source%22%3Bs%3A8%3A%22fl4g.php%22%3B%7D%7D`

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-7-1024x488.png" alt=""/></div>

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-8-1024x488.png" alt=""/></div>


Refreshing the page gives us the flag `flag{5w337_PHP_0bj3c7_!nj3c7!0n}`


**Habibamod** (*Digital Forensics*)


In this challenge, we were given another packet capture file, `Habibamod.pcap`. In Wireshark, we can see it's an HTTP session where a file is being uploaded.

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-9-1024x826.png" alt=""/></div>


The contents of the file are a JSON object with properties `data` and `encoder`.


`{"data": ".!…!!..!!.!!…!!….!.!!..!!!.!!!!.!!.!.!.!…!..!!.!.!….!!.!.!.!…!…!!..!!!!..!..!!…..!!!.!.!.!!!..!..!…!…!!..!.!.!!…!!..!!…..!!..!…!!..!.!..!!…..!!..!!…!….!.!…….!!.!!!..!!..!….!.!!!..!..!..!.!!!..!!.!…….!!.!!.!.!!….!..!!.!!!.!!.!..!.!!.!!!..!!..!!!.!!!!!.!", "encoder": "ZGVmIG15X2VuY29kZXIoZGF0YSk6CiAgICBiaW5fcmVwID0gJycuam9pbihmb3JtYXQob3JkKGkpLCAnYicpIGZvciBpIGluIHgpCiAgICByZXR1cm4gYmluX3JlcC5yZXBsYWNlKCcwJywnLicpLnJlcGxhY2UoJzEnLCchJykgCg=="}`


Decoding `encoder` with base64, we get a python function called `my_encoder`. After analyzing it, we made a python function of our own to reverse it. We figured out `encoder` was base64 because of the telltale `==` at the end.


{% highlight python %}

 def my_encoder(data):
    bin_rep = ''.join(format(ord(i), 'b') for i in x)
    return bin_rep.replace('0','.').replace('1','!') 
{% endhighlight %}    

{% highlight python %}

 def our_decoder(data):
    # the previous function converts a string to a bitmap 
    # and then changes 0 and 1 to . and ! respectively

    # reverse the string replacement
    data = data.replace('.','0').replace('!',1)
    
    # change the bitmap to numbers
    data = [int(data[i:i+8], 2) for i in range(0, len(data), 8)]

    # change the numbers to a string
    data = ''.join([chr(i) for i in data])
    return data
{% endhighlight %}    

Putting `data` into this function gives us the flag `Flag{TMCTFy0urDec0de0f!@nd.Is@ma7ing}`

<div class="flex-container"><img src="/assets/blog_images/2020/08/image-10.png" alt=""/></div>


**GoldASM** (*Malware Reverse Engineering*)


In this challenge, we are given an assembly file `GoldASM.asm`. It described a function that had many repetitions of this format.

{% highlight assembly %}

    mov     rax, QWORD PTR [rbp-24]
    mov     eax, DWORD PTR [rax]
    cmp     eax, 70
    jne     .L2
    mov     rax, QWORD PTR [rbp-24]
    add     rax, 4
    mov     eax, DWORD PTR [rax]
    cmp     eax, 76
    jne     .L2
{% endhighlight %}        

We realized that the code was going across a string and checking its value against hardcoded numbers. By removing the repeated parts of code and making the rest human readable, it becomes obvious.

{% highlight assembly %}
    0:
    compare     eax, 70   # 'F' char
    4:
    compare     eax, 76   # 'L' char
{% endhighlight %}        

There were certain spots though, where it wasn't simply comparing. For example, one line doubled the number before comparing it and another subtracted from it.

{% highlight assembly %}
    8:
    add eax, eax
    compare eax, 130     # meaning we want 65, or 'A'
    24:
    subtract eax, 75
    compare eax, 2       # meaning we want 77, or 'M'`
{% endhighlight %}        

There were also some points which required a byte be less than a number instead of equal. After dealing with these edge cases, we got a list of numbers `[70, 76, 65, 71, 123, 95, 75, 51, 101, 98, 95, 48, 110, 95, 83, 104, 49, 110, 105, 110, 103, 95, 125]`. Converting them into characters gave us the flag `FLAG{_K3eb_0n_Sh1ning_}`.

Sadly, I don't have any screenshots of the other challenges because they were web based and CyberTalents took them down when the hackathon ended. 

All in all, this hackathon was lots of fun and and I'm interersted in doing it again if I can. I'll make sure to document the whole thing too.