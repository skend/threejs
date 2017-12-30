var camera, scene, renderer;
var controls;
var aspect = window.innerWidth / window.innerHeight;

var clock = new THREE.Clock();

var chunkSize = 16;
var worldHeight = 128;
var worldWidth = 64;
var blockSize = 1;

init();
animate();

window.addEventListener('resize', function() {
    aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function init() {
    camera = new THREE.PerspectiveCamera(90, aspect, 0.01, 64);
    camera.position.x = 0;
    camera.position.y = worldHeight * 0.66;
    camera.position.z = 0;

    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 0.1;
    controls.verticalMax = 2.2;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0dcff);

    var texture = new THREE.TextureLoader().load('textures/dirt.jpg');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    var material = new THREE.MeshBasicMaterial({map: texture, overdraw: 0.5});
    noise.seed(Math.random());

    // disgusting
    // TODO: generate blocks centered around player position
    for (var i = 0; i < worldWidth; i += chunkSize) {
        for (var j = 0; j < worldWidth; j += chunkSize) {
            for (var x = 0; x < chunkSize; x += blockSize) {
                for (var z = 0; z < chunkSize; z += blockSize) {
                    var noiseVal = noise.simplex2((x + i) / worldWidth, (z + j) / worldWidth);
                    var height = (((noiseVal + 1) * 15) + 60) * blockSize;
                    height = Math.floor(height);

                    for (var y = height - 2*blockSize; y < height; y += blockSize) {
                        var block = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
                        var tempMesh = new THREE.Mesh(block, material);
                        tempMesh.position.set(x + i, y, z + j);
                        scene.add(tempMesh);
                    }
                }
            }
        }
    }

    renderer = new THREE.WebGLRenderer({

    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update( clock.getDelta() );
    renderer.render(scene, camera);
}