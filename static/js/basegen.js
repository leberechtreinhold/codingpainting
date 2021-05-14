G_HEIGHT = 300;
G_WIDTH = 300;
G_SCENE = null;
G_CURRENT_MESH = null;

function on_change_base_type() {
    const type = document.getElementById("base_type").value;
    if (type === "round") {
        document.getElementById("table_base_parameters").innerHTML = `        
        <tr>
            <td><b>Parameters</b></td>
        </tr>
        <tr>
            <td>Base Height (mm)</td>
            <td><input id="base_height" type="number" step="0.1" value="3" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Diameter (mm)</td>elif js
            <td><input id="base_diameter" type="number" step="0.1" value="40" onchange="update_3d()" /></td>
        </tr>
        `;
    }
    else if (type === "oval") {
        document.getElementById("table_base_parameters").innerHTML = `        
        <tr>
            <td><b>Parameters</b></td>
        </tr>
        <tr>
            <td>Base Height (mm)</td>
            <td><input id="base_height" type="number" step="0.1" value="3" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Width (mm)</td>
            <td><input id="base_width" type="number" step="0.1" value="25" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Depth (mm)</td>
            <td><input id="base_depth" type="number" step="0.1" value="50" onchange="update_3d()" /></td>
        </tr>
        `;
    }
    else if (type === "square") {
        document.getElementById("table_base_parameters").innerHTML = `        
        <tr>
            <td><b>Parameters</b></td>
        </tr>
        <tr>
            <td>Base Height (mm)</td>
            <td><input id="base_height" type="number" step="0.1" value="3" onchange="update_3d()" /></td>
        </tr>
        <tr>
        <td>Base Width (mm)</td>
        <td><input id="base_width" type="number" step="0.1" value="25" onchange="update_3d()" /></td>
        </tr>
        `;
    }
    else if (type === "rectangle") {
        document.getElementById("table_base_parameters").innerHTML = `        
        <tr>
            <td><b>Parameters</b></td>
        </tr>
        <tr>
            <td>Base Height (mm)</td>
            <td><input id="base_height" type="number" step="0.1" value="3" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Width (mm)</td>
            <td><input id="base_width" type="number" step="0.1" value="25" onchange="update_3d()" /></td>
        </tr>
        <tr>
            <td>Base Depth (mm)</td>
            <td><input id="base_depth" type="number" step="0.1" value="50" onchange="update_3d()" /></td>
        </tr>
        `;
    }
    update_3d();

}
function get_mesh() {
    console.log("getting mesh");
    const type = document.getElementById("base_type").value;
    let geometry = null;
    if (type === "round") {
        console.log(document.getElementById("base_height").value);
        const d = document.getElementById("base_diameter").value;
        geometry = new THREE.CylinderGeometry(
            d / 2, // Radius top
            d / 2, // Radius Bottom
            document.getElementById("base_height").value,       // Height
            64      // Segments
        );
    }
    else if (type === "oval") {
        const w = document.getElementById("base_width").value;
        const d = document.getElementById("base_depth").value;
        geometry = new THREE.CylinderGeometry(
            w / 2, // Radius top
            w / 2, // Radius Bottom
            document.getElementById("base_height").value,       // Height
            64      // Segments
        );
        geometry.scale(d / w, 1, 1);
    }
    else if (type === "square") {
        const w = document.getElementById("base_width").value;
        console.log(w);
        geometry = new THREE.BoxGeometry(
            w,                                             // Width
            document.getElementById("base_height").value,  // Height
            w,                                             // Depth
            8, 4, 8
        );
    }
    else if (type === "rectangle") {
        const w = document.getElementById("base_width").value;
        const d = document.getElementById("base_depth").value;
        geometry = new THREE.BoxGeometry(
            w,                                             // Width
            document.getElementById("base_height").value,  // Height
            d,                                             // Depth
            8, 4, 8
        );
    }
    else
    {
        console.log("Unrecognized type");
    }
    const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    return new THREE.Mesh( geometry, material );
}

function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();

}

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function download_mesh() {
    var mesh = get_mesh();
    var exporter = new THREE.STLExporter();

    const result = exporter.parse( mesh );
    save( new Blob( [ result ], { type: 'text/plain' } ), "base.stl" );
}


function start_render() {
    G_SCENE = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, G_WIDTH / G_HEIGHT, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({ canvas: canvas_3d});
    renderer.setSize( G_WIDTH, G_HEIGHT );

    G_CURRENT_MESH = get_mesh() 
    G_SCENE.add( G_CURRENT_MESH );

    camera.position.z = 40;
    camera.position.y = 20;
    camera.rotation.x = -Math.PI / 6;

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.update();

    const animate = function () {
        requestAnimationFrame( animate );
        if (G_CURRENT_MESH)
        {
            G_CURRENT_MESH.rotation.y += 0.01;
        }
        controls.update();
        renderer.render( G_SCENE, camera );
    };
    animate();
}

function update_3d() {
    console.log("update3d");
    if (!G_SCENE) {
        console.log("THREE.js scene not loaded yet, skipping");
        return;
    }
    console.log("removing childs");
    while(G_SCENE.children.length > 0){ 
        G_SCENE.remove(G_SCENE.children[0]); 
    }
    
    console.log("adding new ones");
    G_CURRENT_MESH = get_mesh();
    G_SCENE.add( G_CURRENT_MESH );
}

window.onload = function () { this.start_render(); }