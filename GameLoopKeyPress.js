import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const collisionMessage = document.createElement("div");
collisionMessage.textContent = "Collision is happening!";
collisionMessage.style.position = "fixed";
collisionMessage.style.top = "24px";
collisionMessage.style.left = "50%";
collisionMessage.style.transform = "translateX(-50%)";
collisionMessage.style.fontFamily = "sans-serif";
collisionMessage.style.fontSize = "28px";
collisionMessage.style.fontWeight = "bold";
collisionMessage.style.color = "#ffffff";
collisionMessage.style.textShadow = "2px 2px 4px #000000";
collisionMessage.style.display = "none";
collisionMessage.style.zIndex = "1";
document.body.appendChild(collisionMessage);

//important variables
let score = 0;
let gameOver = false;
let lastSpawn = 0;
//Score
const scoreMessage = document.createElement("div");
scoreMessage.style.position = "fixed";
scoreMessage.style.top = "24px";
scoreMessage.style.left = "24px";
scoreMessage.style.fontFamily = "sans-serif";
scoreMessage.style.fontSize = "24px";
scoreMessage.style.fontWeight = "bold";
scoreMessage.style.color = "#ffffff";
scoreMessage.style.textShadow = "2px 2px 4px #000000";
scoreMessage.style.zIndex = "1";
scoreMessage.textContent = "Score: 0";
document.body.appendChild(scoreMessage);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x44aa44
});

const plane = new THREE.Mesh(
    planeGeometry,
    planeMaterial
);

plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Lights
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    1
);

directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Player Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff
});

const player = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);

player.position.y = 0.5;
scene.add(player);

//Obstacle Spawning
const obstacles = [];
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});

function spawnObstacles(){
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    //Random spawning positioning
    const randomX = (Math.random() - 0.5) * 20;
    const randomZ = (Math.random() - 0.5) * 20;
    obstacle.position.set(randomX, 10, randomZ);
    scene.add(obstacle);
    obstacles.push(obstacle);
}
// Keyboard State Object
const keys = {};

// Key Down
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

// Key Up
window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Movement Speed
const speed = 0.1;
const playerBounds = new THREE.Box3();
const objectBounds = new THREE.Box3();

function handleCollisions() {
    if (gameOver) return;
    playerBounds.setFromObject(player);
    for (let i = obstacles.length -1; i>=0; i--){
        const obstacle = obstacles[i];
        objectBounds.setFromObject(obstacle);
        
        if (playerBounds.intersectsBox(objectBounds)){
            gameOver = true;
            collisionMessage.textContent = "GAME OVER";
            collisionMessage.style.display = "block";
        }
    }
}



// Animation Loop
function animate() {
    requestAnimationFrame(animate);
if (!gameOver) {
        // Spawn Blocks Repeatedly
        const currentTime = performance.now();
        if(currentTime - lastSpawn > 1000) {
            spawnObstacles();
            score++;
            scoreMessage.textContent = `Score: ${score}`;
            lastSpawn = currentTime;
        }

        //wasd Controls
        if (keys["w"]) player.position.z -= speed;
        if (keys["s"]) player.position.z += speed;
        if (keys["a"]) player.position.x -= speed;
        if (keys["d"]) player.position.x += speed;

        //arrow key controls
        if (keys["arrowup"]) player.position.z -= speed;
        if (keys["arrowdown"]) player.position.z += speed;
        if (keys["arrowleft"]) player.position.x -= speed;
        if (keys["arrowright"]) player.position.x += speed;

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obstacle = obstacles[i];
            obstacle.position.y -= 0.05;

            if (obstacle.position.y < -2) {
                scene.remove(obstacle);
                obstacles.splice(i, 1);
            }
        }

        handleCollisions();
}
    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});