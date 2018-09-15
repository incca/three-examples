import * as Three from 'three';
// import * as Stats from 'stats.js';
import initPlanet, { platnetData, dialogues } from './planets';

console.log(platnetData);

window.THREE = Three;

require('src/common/libs/OrbitControls');
require('./index.less');

const container = document.getElementById('container');

// const stats = new Stats();
const renderer = new Three.WebGLRenderer({antialias: true, alpha: true, shadowMap: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.setClearColor(0xffffff, 0);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(-600, 450, 200);
camera.lookAt(new Three.Vector3(0, 0, 0));
scene.add(camera);

const sun = new Three.Mesh(
  new Three.SphereGeometry(12, 16, 16),
  new Three.MeshLambertMaterial({
    // color: 0xffff00,
    emissive: 0xdd4422
  })
);
sun.name = 'Sun';
scene.add(sun);

const stars = Object.keys(platnetData).map((name) => {
  const planet = platnetData[name];
  const star = initPlanet(planet.name, planet.color, planet.distance, planet.volume, planet.speed);
  scene.add(star.mesh);

  const track = new Three.Mesh(
    new Three.RingGeometry(planet.distance - 0.2, planet.distance + 0.2, 64, 1),
    new Three.MeshBasicMaterial({
      color: 0xefba8e,
      side: Three.DoubleSide
    })
  );
  track.rotation.x = -(Math.PI / 2);
  scene.add(track);

  return star;
});

const controls = new Three.OrbitControls(camera, renderer.domElement);
const clock = new Three.Clock();

controls.target.set(0, 0.5, 0);
controls.enablePan = false;

const particles = 1500;

const bufferGeometry = new Three.BufferGeometry();

const position = new Float32Array(particles * 3);
const colors = new Float32Array(particles * 3);

const gap = 1000;

for (let index = 0; index < position.length; index += 3) {
  const x = (Math.random() * gap * 2) * (Math.random() < 0.5 ? -1 : 1);
  const y = (Math.random() * gap * 2) * (Math.random() < 0.5 ? -1 : 1);
  const z = (Math.random() * gap * 2) * (Math.random() < 0.5 ? -1 : 1);

  const biggest = Math.abs(x) > Math.abs(y)
    ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z')
    : (Math.abs(y) > Math.abs(z) ? 'y' : 'z');
  const pos = {x, y, z};
  if (Math.abs(pos[biggest]) < gap) {
    pos[biggest] = pos[biggest] < 0 ? -gap : gap;
  }

  position[index] = pos.x;
  position[index + 1] = pos.y;
  position[index + 2] = pos.z;

  const hasColor = Math.random() > 0.3;

  let vx = 1;
  let vy = 1;
  let vz = 1;
  if (hasColor) {
    vx = (Math.random() + 1) / 2;
    vx = (Math.random() + 1) / 2;
    vz = (Math.ran)
  }

  const color = new Three.Color();
  color.setRGB(vx, vy, vz);

  colors[index] = color.r;
  colors[index + 1] = color.g;
  colors[index + 2] = color.b;
}

bufferGeometry.addAttribute('position', new Three.BufferAttribute(position, 3));
bufferGeometry.addAttribute('color', new Three.BufferAttribute(colors, 3));
bufferGeometry.computeBoundingSphere();

const material = new Three.PointsMaterial({size: 6, vertexColors: Three.VertexColors});
const particleSystem = new Three.Points(bufferGeometry, material);
scene.add(particleSystem);

function update () {
  // stats.update();
  controls.update(clock.getDelta());
  stars.forEach(moveStar);
  sun.rotation.y += (0.001 * Math.PI);
  sun.rotation.y %= (Math.PI * 2);
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function moveStar (star) {
  star.angle += star.speed;
  star.angle %= (Math.PI * 2);
  star.mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));
}

const mouse = new Three.Vector2();
const raycaster = new Three.Raycaster();

controls.addEventListener('self-touchend', function (info) {
  const event = info.event;
  event.preventDefault();
  if (event.changedTouches === undefined || event.changedTouches.length <= 0) {
    return;
  }
  const {clientX, clientY} = event.changedTouches[0];
  getObject(clientX, clientY);
});

controls.addEventListener('self-mouseup', function (info) {
  const {offsetX, offsetY} = info.event;
  info.event.preventDefault();
  getObject(offsetX, offsetY);
});

function getObject (clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
  raycaster.setFromCamera(mouse, camera);

  // 获取raycaster直线和所有模型相交的数组集合
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length <= 0) {
    return;
  }
  const intersected = intersects[0].object;
  if (intersected.name === 'Sun' || platnetData[intersected.name] !== undefined) {
    setTought();
  }
}

let dialogueIndex = 0;
function setTought () {
  const dialogue = dialogues[dialogueIndex];
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < dialogue.length; index += 1) {
    const para = document.createElement('p');
    para.innerHTML = dialogue[index];
    fragment.appendChild(para);
  }
  const contentContainer = document.getElementById('thought-content');
  contentContainer.innerHTML = '';
  contentContainer.appendChild(fragment);
  dialogueIndex += 1;
  dialogueIndex %= dialogues.length;
}

// container.appendChild(stats.dom);
container.appendChild(renderer.domElement);
setTought();

update();
