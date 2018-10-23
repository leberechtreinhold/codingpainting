---
title: "Windbg useful reference"
date: 2018-09-13T17:33:12+02:00
lastmod: 2018-09-13T17:33:12+02:00
tags: ["programming", "debugging"]
description: "List of WinDBG commands that can be useful for a variety of situations."
---

This is a helper file (that I keep on Windbg's scratchpad) with a bunch of commands that I want for fast reference. They range from totally trivial, but very used, like `r` or `dS`, to more complex flows, like avoiding a driver load, symbol debugging and leak detection. Or things which I never remember the exact syntax, like navigating registry inside the debugger. This is no substitute for true references for all commands, but rather a more case-by-case uses.
        
    // ------------------------------- GENERAL ---------------------------------
    
    !address mem => info de mem
    !analyze -v => analyze crash
    r => registers
    dS => print UNICODE_STRING
    db 0x1245 => dump binary memory at address 0x1245
    poi() => Reference point. Ex db poi(poi(Thing)+0x18) => Dump info of something in the +0x18 pointed by Thing
    cls => clear screen
    ~~[6a28]s => switch to thread
    k => callstack
    
    // Reference of common
    // http://windbg.info/doc/1-common-cmds.html

    // ------------------------- CONTROL FLOW ----------------------------------
    
    // Set breakpoint with symbols loaded
    bp module!myfunction

    // Set breakpoint when the symbols can be resolved, ex, before driver load
    bu module!myfunction

    // Remove breakpoint n
    bc <n>

    // Skip Driver entry, if it's bsoding or anything :)
    // Can use this to skip other functions
    bu myDriver!DriverEntry "r eip = poi(@esp); r esp = @esp + 0xC; .echo myDriver!DriverEntry skipped; g"


    // ----------------------------- SYMBOLS -----------------------------------
    
    // Symbol path
    .sympath cache*D:\custom\cache\path;srv*\\CUSTOM_SYMBOL\SERVER;srv*https://msdl.microsoft.com/download/symbols;

    // If they don't fit exactly, you can use this
    // Beware this can cause the stack trace to be a a bit of a mess
    .symopt+0x40

    // Reload symbols, always use name of the module with extensions
    .reload /f driver.sys

    // Symbol debugging, can use quiet to reverse
    !sym noisy
    
    // Info about module
    lmv m program 
    .reload /i program.exe

    // Verification, note no extension!
    !lmi nt => verify symbols loaded

    // See all modules
    x *! 


    // ---------------------------- MEMORY LEAKS -------------------------------
    // gflags
    !gflag => flags enabled, ie 0x00001000 => userspace stack trace enabled

    // Enable stack traces
    "C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\gflags.exe" /i LeakExample.exe +ust

    !address -summary => list usage
    !heap -s => Not super realiable, but list heaps
    !heap -stat -h #heapadrr => lists usage of top allocs, by block size/reps (hex!)
    !heap -flt s #size
    !heap -flt s #size => lists allocs of blocks of given size, including usrptr
    !heap -p -a #usrptr => if available, lists stack trace of said alloc
    u #addr => search asm y source if possible. #addr may be module relative.

    // Display stack when reserving memory
    // Check the heap you want, ex  0x12345678, with esp
    // And filter for certain allocations sizes with esp, ex 0x123
    // After the alloc, continue
    bp ntdll!RtlAllocateHeap "j ((poi(@esp+4) = 0x12345678) & (poi(@esp+c) = 0x123) )'k';'gc'" 

    // View Nonpaged by amount of bytes
    !poolused /t 5  0x2
    !vm
    !memusage
    !for_each_module s -a @#Base @#End "Proc "
    ln 8096c909 
    lm a 8096c909
    !for_each_module s -d @#Base @#End 8096c8cc

    // Memory POOLs. BEWARE, in xp, you must activate it with gflags
    !poolused

    // ------------------------------- UTILITIES -----------------------------------
    // Dump dump's information (heh)
    .dumpdebug

    // Reg
    !reg q \registry\machine\system\controlset001
    !reg q \REGISTRY\MACHINE\SYSTEM\ControlSet001\services\myDriver
    // hive then subkey
    !reg keyinfo e1036b60 d1402e8c

    // Enable dbgprint
    ed Kd_DEFAULT_Mask 0x8
    !dbgprint

    // Services, nonwindbg. Note the spaces!
    sc create FsFilter type= filesys binPath= c:\FSFilter.sys
    sc start FsFilter
    sc stop FsFilter
    sc delete FsFilter.sympath cache*C:\symbols;C:\symbolsaux\symbolsforcleaning;srv*https://msdl.microsoft.com/download/symbols

    // W32
    !wow64exts.k => load wow64mode (64 bit dumps of 32 bit processes)
    sw => switch mode