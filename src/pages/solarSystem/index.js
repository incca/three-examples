import * as Three from 'three';
import * as Stats from 'stats.js';
import { getImageStaticPath } from 'src/common/js/utils';
import initPlanet from './initPlanet';

window.THREE = Three;

require('three/examples/js/controls/OrbitControls');

const container = document.getElementById('container');

const stats = new Stats();
const renderer = new Three.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.setClearColor(0xffffff, 0);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(-200, 50, 0);
camera.lookAt(new Three.Vector3(0, 0, 0));
scene.add(camera);

const sunSkin = new Three.TextureLoader().load(getImageStaticPath('/sunCore.jpg'));

const sun = new Three.Mesh(
  new Three.SphereGeometry(12, 16, 16),
  new Three.MeshLambertMaterial({
    // color: 0xffff00,
    emissive: 0xdd4422,
    map: sunSkin
  })
);
sun.name = 'Sun';
scene.add(sun);

const ambient = new Three.AmbientLight(0x999999);
scene.add(ambient);
const sunLight = new Three.PointLight(0xddddaa, 1.5, 500);
scene.add(sunLight);

const stars = [
  {name: 'Mercury', color: 'rgb(124, 131, 203)', distance: 20, volume: 2, speed: 0.02},
  {name: 'Venus', color: 'rgb(190, 138, 44)', distance: 30, volume: 4, speed: 0.012},
  {name: 'Earth', color: 'rgb(46, 69, 119)', distance: 40, volume: 5, speed: 0.01},
  {name: 'Mars', color: 'rgb(210, 81, 16)', distance: 50, volume: 4, speed: 0.008},
  {name: 'Jupiter', color: 'rgb(254, 208, 101)', distance: 70, volume: 9, speed: 0.006},
  {name: 'Jupiter', color: 'rgb(210, 140, 39)', distance: 100, volume: 7, speed: 0.005},
  {name: 'Uranus', color: 'rgb(49, 168, 218)', distance: 120, volume: 4, speed: 0.003},
  {name: 'Neptune', color: 'rgb(84, 125, 204)', distance: 150, volume: 3, speed: 0.002}
].map((planet) => {
  const star = initPlanet(planet.name, planet.color, planet.distance, planet.volume, planet.speed);
  scene.add(star.mesh);

  const track = new Three.Mesh(
    new Three.RingGeometry(planet.distance - 0.2, planet.distance + 0.2, 64, 1),
    new Three.MeshBasicMaterial({
      color: 0x888888,
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

function update () {
  stats.update();
  controls.update(clock.getDelta());
  stars.forEach(moveStar);
  sun.rotation.y += (0.001 * Math.PI);
  sun.rotation.y %= (Math.PI * 2);
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

function moveStar (star) {
  star.angle += star.speed;
  star.angle %= (Math.PI * 2);
  star.mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));
}

container.appendChild(stats.dom);
container.appendChild(renderer.domElement);

update();
