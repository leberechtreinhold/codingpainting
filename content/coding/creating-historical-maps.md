---
title: "Creating historical maps for wargames using QGIS"
date: 2020-03-17
tags: ["programming", "maps", "kriegsspiel", "qgis", "tutorial", "wargames"]
---

*Whatever you are playing a campign, scenario or simply looking for inspiration, a map can be super useful. And thanks to Open Street Map, there's a lot of freely available data you can use to create proper, scalable maps adequate for printing.*

<!--more--> 

When creating the maps for the WW2 Kriegsspiel, I gave each player a historical map (which I only could have found with the help of Riikka Törrönen, from the Maanmittauslaitos/Finnish National Land Survey and Theresa Quill from the Indiana University, thanks!). However, some of the scans were... poor. They were very hard to read, and of course the Russian maps had the added problem of being in Cyrillic, which was not readable for the players. Those are raster images, and editing them is well, not possible unless you are set on re-drawing everything.

To fix this, I used QGis, an opensource free application to create maps. The tool is very powerful and used in professional environments, and can be quite hard to use, so here's a small tutorial for the simple use case of wargames :)

First, let's get some historical data. I used the excellent resource that is Indiana University, which contains **a lot** of maps, and they are even georeferenced!! Which makes this process much easier, and you can have a usable map in less than 30mins.

https://libraries.indiana.edu/cyrillic-index-cyrillic-topographic-maps

The image I'm going to use for the example is this one, representing a small part of Ukraine, scale 1:50000. Be aware that the GeoTIFF file is nearly 500MB!

http://webapp1.dlib.indiana.edu/images/item.htm?id=http://purl.dlib.indiana.edu/iudl/images/VAC9619/VAC9619-000242

Of course this tutorial can also be used without a georeferenced image, or without any image at all.

Initial setup
=============

Install QGIS 3.10+
https://www.qgis.org/en/site/forusers/download.html

Start QGIS (with or without GRASS, doesn't matter). Go to Plugins->Manage and Install Plugins and Install QuickOSM

[![Downloading plugin](https://cloud.ajimenez.es/index.php/s/PgbRT7zra8BNcCC/preview)](https://cloud.ajimenez.es/index.php/s/PgbRT7zra8BNcCC)

Project creation
================

Create a OSM tile using the Browser, on the XYZ Tiles, and double clicking on OpenStreetMap. This creates a base layer with all defaults.

[![Base tile](https://cloud.ajimenez.es/index.php/s/rkaPDXq5NA7Hzsn/preview)](https://cloud.ajimenez.es/index.php/s/rkaPDXq5NA7Hzsn)

Import the tile you desire. In this case, being a geotiff, we are going to go to Layer->Add Raster Layer.

[![Base tile](https://cloud.ajimenez.es/index.php/s/nkoDWHtepeJyBPn/preview)](https://cloud.ajimenez.es/index.php/s/nkoDWHtepeJyBPn)

In the popup we simply add VAC9619-000242geo.tif. Since probably the tiff isn't using the same coordinate system as the one you are using in the project, you will be asked to convert. Use whatever is appropriate using the source on the website. The accuracy is going to be more than enough with whatever you want to use though.

[![Base tile](https://cloud.ajimenez.es/index.php/s/t3LCF2nDcbfpdpe/preview)](https://cloud.ajimenez.es/index.php/s/t3LCF2nDcbfpdpe)

If the TIFF is not georeferenced, you will have to move manually and georeference the coordinates by hand.

Now we have two layers, one with the historical map and another with the OSM reference. We can change the opacity of the historial map by changing its opacity. Right click on the layer and click on Properties, then in Opacity, change it to 50% or so.

[![Base tile](https://cloud.ajimenez.es/index.php/s/XDRDPQ7B4ob5Gmx/preview)](https://cloud.ajimenez.es/index.php/s/XDRDPQ7B4ob5Gmx)
[![Base tile](https://cloud.ajimenez.es/index.php/s/JPJMiKQMqYLqFsQ/preview)](https://cloud.ajimenez.es/index.php/s/JPJMiKQMqYLqFsQ)

We see that it maps pretty well. The river fits, the cities are more or less where they should (even if the OSM labels cannot be quite seen in the capture). 

[![Base tile](https://cloud.ajimenez.es/index.php/s/apt6yAsMeRXi6y8/preview)](https://cloud.ajimenez.es/index.php/s/apt6yAsMeRXi6y8)

Adding Data
===========

This step isn't necessary, but to me it's a important guide and can be useful to do more things: Let's label them in Latin names as the Cyrillic is quite hard to read for me :) It's also a generic guide to add features to the map, which is important.

First, go to Layer->Create Layer-> New ShapeFileLayer. Set it's name to Cities, with Geometry type Point and a new field called "name". Remember to click on Add to Field list before continuing!

[![Base tile](https://cloud.ajimenez.es/index.php/s/jS93kN7RT8jqHAc/preview)](https://cloud.ajimenez.es/index.php/s/jS93kN7RT8jqHAc)

1. Click on the layer we just created

2. Click on Toggle Editing

3. Click on Add New Point feature

4. Click on the city of Kulykovychi

5. On the popup, write the name. The id is autogenerated, you can leave it as is.

6. Click again on Toggle Editing, it will as to save.

[![Base tile](https://cloud.ajimenez.es/index.php/s/fZ6GRJBiBfe5fJN/preview)](https://cloud.ajimenez.es/index.php/s/fZ6GRJBiBfe5fJN)

We now have a dot representing our city, but that's not very useful... Let's change the visualization of that layer.

[![Base tile](https://cloud.ajimenez.es/index.php/s/E2eSxJHpPi8Pwz2/preview)](https://cloud.ajimenez.es/index.php/s/E2eSxJHpPi8Pwz2)

Right click on the Layer and go to Properties again. Go to Labels, set it to Single Labels and use the name field as the Value. You can now set any property as the visualization. Click apply to preview. I recommend something very visible when you are working with all the layers, then change to whatever looks nice after.

[![Base tile](https://cloud.ajimenez.es/index.php/s/wDkf4c7yMqfg9ZT/preview)](https://cloud.ajimenez.es/index.php/s/wDkf4c7yMqfg9ZT)

We can continue the process, adding more data. We can also add more layers with more info, but this is just some easy georeferencing help to avoid the Cyrillic and make it easy to reference things.

[![Base tile](https://cloud.ajimenez.es/index.php/s/SN6imFqwpJm4jqP/preview)](https://cloud.ajimenez.es/index.php/s/SN6imFqwpJm4jqP)

Now the actual useful stuff, let's download OSM stuff! Lets move and zoom until all the area you want data from is visible. It doesn't matter if there's more things visible (you will simply download things you will not use and that's it), but everything you want SHOULD BE VISIBLE. Otherwise you will have two downloads in separate layers you have to merge and all...

Click on Vector->Quick OSM->Quick OSM..., and on the Quick Query Panel, use Key "waterway", and important, in the "In" dropdown use "Canvas Extent". Then Run query. Now it will download of all types of data (points, lines, polygons) on a separate layer, which will be added on top.

[![Base tile](https://cloud.ajimenez.es/index.php/s/5kCT2XAf33jgAHq/preview)](https://cloud.ajimenez.es/index.php/s/5kCT2XAf33jgAHq)

Note that we have hidden the OSM layer to see the new features better. We do so by clicking on the checkbox near the name. Also see how we have three types of waterway features. Most of them are in the line category, so we can delete the other two layers if we feel they are not useful.

[![Base tile](https://cloud.ajimenez.es/index.php/s/synK9T6aSwZkC7p/preview)](https://cloud.ajimenez.es/index.php/s/synK9T6aSwZkC7p)

Now we just add more data! But what's the name of the data? You have written waterway, but it could be another name. How to check every feature? Well, you can do it in QGIS but I think the easiest way is to go to openstreetmap, do zoom in the area, enable Map Data and then click on the feature you want info. A panel on the right will say every Key-value pair.

[![Base tile](https://cloud.ajimenez.es/index.php/s/YwHMc2Bfxnpmf5b/preview)](https://cloud.ajimenez.es/index.php/s/YwHMc2Bfxnpmf5b)

A bunch of several layers that can be useful for historical maps:

Key highway, Values: track, path, unclassified, tertiary, secondary, trunk 
Note: you can download all of them, but having them separate allows you to customize each one with a different color
Key waterway, Values: (all)
Key building, Values: (all)
Key natural, Values: water, wood

Now you can customize each layer, for example, woods by having a Fill that is 40% transparent green and without a stroke.

[![Base tile](https://cloud.ajimenez.es/index.php/s/RECMc8ZQNtLwraE/preview)](https://cloud.ajimenez.es/index.php/s/RECMc8ZQNtLwraE)

Notice how in each layer, near the name, there is a symbol. That means the layer is temporary, it's not saved. If you close the project now, the layer won't have any data! Very easy for a beginner to forget this. Fortunately it's easy, right click, click on MakePermanent, and on filename just choose a new file.

[![Base tile](https://cloud.ajimenez.es/index.php/s/apSNAL66SPXWPRf/preview)](https://cloud.ajimenez.es/index.php/s/apSNAL66SPXWPRf)

Now you are all set. However, modern features rarely are the same as the one in historical maps. You can edit them easily, however. For example, if we want to edit a river, we click on the layer, toggle editing, click on the vertex tool, and when we hover a line feature of that layer we will see all vertexes highlighted. We can drag them, break unions between them, create new ones, etc.

This is by far the most time consuming step, but it's also where a lot of the value of the map comes from.

[![Base tile](https://cloud.ajimenez.es/index.php/s/PXjpz5NnJdpxkoC/preview)](https://cloud.ajimenez.es/index.php/s/PXjpz5NnJdpxkoC)

Printing
========

Let's say we are finished, we have modified all data and created new one and we are satisfied with the result. Let's make a PDF with it for printing or whatever. Go to Project->Create print layout, and enter a name, like "printmap" (you can also let it autogenerate a name). We see something like the following image.

[![Base tile](https://cloud.ajimenez.es/index.php/s/8tqDSkgRX2bQNfb/preview)](https://cloud.ajimenez.es/index.php/s/8tqDSkgRX2bQNfb)

First, right click on the page and go to properties. There you can specify the printing size, for example, an A3.

[![Base tile](https://cloud.ajimenez.es/index.php/s/SF4FWgGGppNpCnH/preview)](https://cloud.ajimenez.es/index.php/s/SF4FWgGGppNpCnH)

Next, let's add the map using the Add map button from the left, then draw a rectangle in the final page.

[![Base tile](https://cloud.ajimenez.es/index.php/s/Pa7kRymAqFmdFtG/preview)](https://cloud.ajimenez.es/index.php/s/Pa7kRymAqFmdFtG)

It's done! Well, you add labels, north guides, scales, etc but the map is done. Just remember to save the layout and export when you are finished.