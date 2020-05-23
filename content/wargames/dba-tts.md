---
title: "DBA mod for TTS"
date: 2020-05-22
tags: ["wargames", "programming", "tts", "dba"]
---

These last weeks I have been busy programming an adaptation of De Bellis Antiquitatis for Tabletop Simulator. You can find the project on GitHub:

https://github.com/leberechtreinhold/dba_tts

The project ended up being way more interesting that it seemed. There was a lot of challenges due to the limitation of Lua and the API exposed by TTS, which forced me to reimplement a lot of geometry functions. Some functionality is also pretty forced, like some of the UI, which forces to do several steps divided among frames. And of course, things like wheeling are hell of earth and a dumpster fire of code - that is only appropriate since wheeling in DBA2 is a complete clusterfuck (and one of the things that were improved in DBA3).