---
title: "Generate bases for 3D printing"
date: 2021-04-22
tags: ["programming", "calculator", "photography"]
---

*A small to create a base for miniature in STL format, without the need of downloading blender nor anything. Still a work in progress.*

<!--more--> 

<script type="text/javascript" src="/js/three.js"></script>
<script type="text/javascript" src="/js/OrbitControls.js"></script>
<script type="text/javascript" src="/js/STLExporter.js"></script>
<script type="text/javascript" src="/js/basegen.js"></script>
<body>
    <div>
        <p>Base type:</p>
        <select id="base_type" onchange="on_change_base_type()">
            <option value="round">Round</option>
            <option value="oval">Oval</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="rectangle">Rectangle</option>
        </select>
    </div>
    <br>
    <table id="table_base_parameters">
        <tr>
            <td><b>Parameters</b></td>
        </tr>
        <tr>
            <td>Base Height (mm)</td>
            <td><input id="base_height" type="number" step="0.1" value="3" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Diameter (mm)</td>
            <td><input id="base_diameter" type="number" step="0.1" value="40" onchange="update_3d()" /></td>
        </tr>
    </table>
    <button type="button" onclick="download_mesh()" >Download .stl</button>
    <br>
    <canvas id="canvas_3d" width="300" height="300"></canvas>
</body>
