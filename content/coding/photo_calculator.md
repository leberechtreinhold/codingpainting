---
title: "Calculating the size on the frame of an object"
date: 2020-03-20
tags: ["programming", "calculator", "photography"]
---

*Photographing miniatures or small objects is tricky, since you have to balance a long, macro lens, that allows you to focus closer, with the fact that this reduces your DoF. You can get away to gain focus but then the image may be too small. This is a small calculator to help planning those shots.*

<!--more--> 

<script type="text/javascript" src="/js/photocalc.js"></script>

<body>
    <canvas id="canvas_dof"></canvas>
    <canvas id="canvas_frame"></canvas>
    <table>
        <tr>
            <td><b>Object parameters</b></td>
            <td></td>
        </tr>
        <tr>
            <td>Object Height (mm)</td>
            <td><input id="object_height" type="number" step="0.1" value="42" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Object Width (mm)</td>
            <td><input id="object_width" type="number" step="0.1" value="24" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Object Depth (mm)</td>
            <td><input id="object_depth" type="number" step="0.1" value="24" onchange="calc()" /></td>
        </tr>
        <tr>
            <td><b>Photography parameters</b></td>
            <td></td>
        </tr>
        <tr>
            <td>Distance to subject (mm). From the camera to center.</td>
            <td><input id="distance_to_subject" type="number" step="1" value="750" onchange="calc()" /></td>
        </tr>
        <tr>
            <td><b>Camera parameters</b></td>
            <td></td>
        </tr>
        <tr>
            <td>Focal Length (mm). Macro lenses are usually around 100mm.</td>
            <td><input id="focal_length" type="number" step="1" value="100" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Vertical size sensor (mm). For Canon APS-C, it's 14.9. For other crop sensors, 15.60. For full frame, it's 24.</td>
            <td><input id="sensor_vertical_size" type="number" step="0.1" value="14.9" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Horizontal size sensor (mm). For Canon APS-C, it's 22.3. For other crop sensors, 23.6. For full frame, it's 36.</td>
            <td><input id="sensor_horizontal_size" type="number" step="0.1" value="22.3" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Aperture (f/value). Indicates how open it is (the lower the value, the more open, therefore, more light, an less dof). Lens are usually sharpest when not wide open.</td>
            <td><input id="aperture" type="number" step="0.1" value="8" onchange="calc()" /></td>
        </tr>
        <tr>
            <td>Circle of confusion. Size of the circle of confusion for the sensor. Usually, 0.018 for Canon ASP-C, 0.019 for other crop, and 0.029 for full frame.</td>
            <td><input id="circle_of_confusion" type="number" step="0.01" value="0.018" onchange="calc()" /></td>
        </tr>
    </table>
    <br>
    <br>
    <p><b>Summary</b></p>
    <div id="result">
        Fills % of the frame:
    </div>
    <p><i>The image shown is the Lewis Chessman from the NMS, with CCSA3 license.</i></p>
</body>
