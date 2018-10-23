---
title: "De Bellis Antiquitatis Statistics"
date: 2018-09-18T18:26:30+02:00
tags: ["wargaming", "dba", "programming", "python"]
---

The following image contains the probability of winning, either by a straight majority or by doubling the enemy, on a DBA combat roll.

![Stats](https://cloud.ajimenez.es/index.php/s/DRgCPNFircaWFxA/preview)

Red if the probably is less than 40%, Green if greater than 60%. For example, a Knight charges a Spear. Knight has +3 against infantry, and the Spear has +4 against mounted. The Knight will kil on simple win, and the Spear will need to double the Knight. That means the Knight has a 27.8% of killing the Spear, while the Spear has a 11.1% of killing the Knight.

And here's a table of kills in a standard situation: asssumes all eleements are unsupported except Pikes, which are supported, Bows are being charged and is considered the first turn, and is close combat (the art is not shooting). The terrain is assumed plain.

![Kills](https://cloud.ajimenez.es/index.php/s/3XongxsaECziPJK/preview)

If you want to generate your own stats, you can generate the excel with the
following python script, which you can get in this gist.

![Gist](https://gist.github.com/leberechtreinhold/5bdb6c345eb8842b5ffc6f8b58cecd73)
