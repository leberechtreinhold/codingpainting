---
title: "Driver Signing"
date: 2019-02-19
tags: [ "programming", ¨kernel", "drivers", "signing", "security", "windows"]
---


*Cross-signing a driver ready for Windows 10 aaand Windows 7.*

<!--more--> 

Starting from Windows Vista, Windows started increasing security in the kernel. Since in the XP days everybody was hooking the SSDT, and plenty of drivers were shit, Windows was gaining the reputation of inestability and BSOD'ing everywhere. So in WinVista they introduced PatchGuard, which limited SSDT Hooks, and also started roadblocks for driver development, so you couldn't download any tool from the internet, and surprise, it had a driver!

One of those measures was signing the driver with a trusted CA. And it wasn't much complicated, just get the cert from digicert or whatever, use signtool on the .sys file. Then came SHA1 deprecation. This wouldn't be an issue if Windows 7 supported SHA2 out of the box, but plenty of W7 are not patches enough to support SHA2 (it's not included in the SP1 package). Therefore you have to:

A) Fight the corresponding CA company to sell you a fucking SHA1 despite the deprecation, which is annoying as fuck... They still provide them, you only have to explain it to 3 or 4 layers of sales-team fuckery.

B) Crossign both, while being careful that the SHA1 is the FIRST signature, otherwise, old windows 7 machines won't recognize it. Then apply the crossign on the .sys file with the SHA2 cert.

That's all good and fine for Windows 7 to Windows 8... And some Windows 10 too. But some Windows 10 are more problematic, starting from the RS2 update. They require to be signed by Microsoft. Which also requires an EV certificate (which is basically the same but with a supposedly "stronger" verification and much more expensive).

This wouldn't be much of a problem if the new signing system for drivers wasn't a massive PITA that makes it very difficult to integrete with CI and properly check. It's also a mess of broken links and outdated information pages, especially if you add in the deprecation of SHA1.

The steps required are: 

 1. Get a non-EV SHA1 cert, and a EV SHA2 cert. The SHA1 can theoretically be a EV cert, I just haven't managed to get anyone to sell one.
 2. Compile your driver.
 3. Sign it with SHA1 certificate.
 4. Sign it again, using SHA2 EV cert (this is the obligatory one).
 5. Generate a proper .cab file. To do so, you will need an INF file, even if your driver doesn't need one. Then generate a .ddf file expaining the location of everything. And finally, call MakeCab to generate the file. You can see some mroe details here: https://docs.microsoft.com/en-us/windows-hardware/drivers/dashboard/attestation-signing-a-kernel-driver-for-public-release
 6. Go to this page: https://developer.microsoft.com/en-us/windows/hardware
 7. Click on Dashboard -> Click on Sign In -> Go for all the steps to actually sign in.
 8. The first time you will have a black collapsable bar to left... that's normal. Ignore it and scroll on the main page and click on Hardware.
 9. You will need to create an Azure AD directory to continue, which you will probably have to register. This is especially a PITA if you are using the account of your org, which may have other AzureADs and don't want to mix accounts. When the account finally activates (may take a while), it will go again to the Sign In for Azure AD. But when you click it, it will redirect to the previous page, so when you click next, it will redirect to the same page you are....
10. Instead of that silly loop, log out and log in with the Azure AD account you just created.... This will redirect to eh partner page instead of the dev one. You can't really go to the dev portal from here (afaik), but you can now ignore this page and go to https://developer.microsoft.com/en-us/windows/hardware directly, when you enter the dashboard it should be using the same session.
11. This time you should have CSP on your black bar. Ignore it, and go to hardware again.
12. Now you will have to fill even more data, like phone, physical address etc.
13. Now you will have to download a file. You will have to sign it with the tool you can also download (it's just the regular signtool). Sign it and upload it.
14. Once it's verified, you can click Next.
15. You can now enter to the dashboard with actually things in it! ![Hardware dashboard](https://cloud.ajimenez.es/index.php/s/dTDQNzjS2NXZF4C/preview)
16. Now Submit New hardware
17. Now just follow the UI, this part is easy: Give it a name, add the .cab, choose the signing, etc etc. You can probably ignore the Distibution part. Depending on the driver you may need to add the hardware test stuff. It takes a few minutes and finally you will have your driver ready to download.

Have fun!