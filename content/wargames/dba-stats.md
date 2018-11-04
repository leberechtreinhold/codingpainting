---
title: "De Bellis Antiquitatis Statistics"
date: 2018-10-14
tags: ["wargames", "wargame-resources", "dba", "programming", "python"]
---

*Different statistics, useful for quick reference on DBA*

<!--more--> 

The following image contains the probability of winning, either by a straight majority or by doubling the enemy, on a DBA combat roll.

![Stats](https://cloud.ajimenez.es/index.php/s/BiRHAEeTXJfRr9T/preview)

Red if the probably is less than 40%, Green if greater than 60%. For example, a Knight charges a Spear. Knight has +3 against infantry, and the Spear has +4 against mounted. The Knight will kil on simple win, and the Spear will need to double the Knight. That means the Knight has a 27.8% of killing the Spear, while the Spear has a 11.1% of killing the Knight.

And here's a table of kills in a standard situation: *asssumes all eleements are unsupported except Pikes, which are supported, Bows are being charged and is considered the first turn, and is close combat (the art is not shooting). The terrain is assumed plain.*

![Kills](https://cloud.ajimenez.es/index.php/s/3XongxsaECziPJK/preview)

You can see what kills what in a simple table, in the same conditions as above, for reference:

Killer | Killed by simple                  | Killed by double
-------|-----------------------------------|-----------------------
El     | Wwg,Hch,Hd,Bw,Kn,Sp,Sch,Wb,Pk,Art | All except Ps
Kn     | Ps,Hd,Ax,Bw,Bd,Sp,Sch,Wb,Pk,Art   | All
Hch    | Art,Sch,Bw                        | All except Ps
Cv     | Art,Ps,Sch,Bw                     | All
Lch    | Art,Sch,Bw                        | All except Ps
Sch    | Hch,Hd,Bw,Kn,Sp,Bd,Sch,Wb,Pk,Art  | All except Ps
Cm     | Art,Ps,Sch,Bw                     | All
Lh     | Hch,El,Bw,Kn,Sp,Sch,Pk,Art        | All
Lcm    | Hch,El,Bw,Kn,Sch,Art              | All
Sp     | Art,Sch                           | All except Cv, LH, LCm, Ps
Pk     | Art,Sch                           | All except Cv, LH, LCm, Ps
Bd     | Art,Sch                           | All except  LH, LCm, Ps
Bw     | Kn,Art,Sch,Hch                    | All
Wb     | Hd,Bd,Sp,Sch,Pk,Art               | All except LH, LCm, Ps
Hd     | Art,Sch                           | All except Cv, LH, LCm, Ps
Ax     | El,Art,Sch                        | All except LH, LCm
Ps     | El,Art,Sch                        | All
Art    | Art,Sch                           | Art,Sch
Wwg    | Art,Sch                           | All except Cv, LH, LCm, Ps

If you want to generate your own stats, you can generate the excel with the
following python script, which you can get in this gist.

[Gist](https://gist.github.com/leberechtreinhold/5bdb6c345eb8842b5ffc6f8b58cecd73)
