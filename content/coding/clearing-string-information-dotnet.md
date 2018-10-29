---
title: "Clearing String Information Dotnet"
date: 2018-10-28T18:29:24+02:00
tags: [ "programming", "c-sharp", ".net", "security"]
description: "Zero .NET strings and a bunch of helpers to make SecureStrings more usable with third parties."
---

Let's say we have a application with a login window. You enter your username, your password, you do stuff, and you log out. After, a new user uses the computer. Can they get your login? Well, it depends.

For most things, we can usually assume that memory is a fairly "secure" place, as long as there's no active menace while the program is runing, and as long as clear everything after using, the attacker cannot get that data. Note that if the attacker has enough privileges while you are operating you are completely out of luck, as he has many many options to get your data: mitm, keyloggers, hooking, rookits... etc. However, this is mostly about attacks where the attacker has a dump after.

So in the question above, it would be no, as long as the program is done properly, because the contents of the password will be cleared. In C, this is trivial:

{{< highlight cpp >}}
void clear_str(char *str, size_t len)
{
    for(size_t i=0; i < len; i++)
    {
        str[i] = '\0';
    }
}
{{< / highlight >}}

However, strings in .NET are immutable. We can't really modify them, and we can't access the internal buffer to change anything. You can make it out of scope and making the GC free it, but until reused, it won't be zeroed, and the contents will persist in memory. Microsoft saw this problem and brought something great: [SecureString](https://docs.microsoft.com/en-us/dotnet/api/system.security.securestring?view=netframework-4.7.2). It's essentially a wrapper for [RtlEncryptMemory](https://docs.microsoft.com/en-us/windows/desktop/api/ntsecapi/nf-ntsecapi-rtlencryptmemory), with `OptionsFlags=0` (meaning that each process has a different encryption key, even if the processes are run by the same user). They also have added many options to use them across the .NET ecosystem, like the Password field in Winforms, which uses a SecureString as a backing property, instead of a String.

However, not always you will be have the opportunity to use SecureStrings directly. For any decently sized project, you probably have third party dependencies, or even internal dependencies, which you cannot modify, and they only accept string.

We can fix this by using [Extensions](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods) for SecureString, and using a small wrapper which will give us a temporal string reference, then cleaning after


{{< highlight js >}}

var secret = new SecureString();
secret.AppendChar('.');

// String in memory, but encrypted
using (var tmp = secret.GetString())
{
    CountNumberOfChars(tmp.str, 's');
}
//String in memory, but encrypted, and a bunch of zeroes

{{< / highlight >}}

`GetString()` is a simple extensions which gives uses a `TemporalString`, a class which simply holds the decrypted string, but implements `IDisposable`. When it goes out of scope, that string is zeroed.

The key is zeroing the string, which is what makes the whole thing unsafe: we access the address of the buffer, and iterate over the contents using a pointer to a character, zeroing it. I have also added a subtitute option, which is very useful when debugging zeroing in different places.

{{< highlight js >}}

public static unsafe void ClearString(this string source, string substitue = "")
{
    if (source == null) return;
    GCHandle gcHandle = GCHandle.Alloc(source, GCHandleType.Pinned);
    unsafe
    {
        char* c_test = (char*)gcHandle.AddrOfPinnedObject();
        for (int i = 0; i < source.Length; i++)
        {
            if (i < substitue.Length)
                c_test[i] = substitue[i];
            else
                c_test[i] = '\0';
        }
    }
    gcHandle.Free();
}

{{< / highlight >}}

There's an alternative, which is using `SecureStringToGlobalAllocUnicode` in combination with `ZeroFreeGlobalAllocUnicode`, but I feel it wraps worse (try/finally and put each corresponding call), and you lose the option to substitute, which is very handy when something is leaking somewhere, but you don't know which places are freeing and which not.

You can grab the whole thing, which includes a bunch of helpful extensions for this (like clearing from properties, when you pass the string to a third party dependency and they do a copy in a field), or easier methods to append data, in this [Gist](https://gist.github.com/leberechtreinhold/a77aa3e7f516a17521edd05c6c4bc5e4).
