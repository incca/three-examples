import * as Three from 'three';
import * as Stats from 'stats.js';
import initPlanet from './initPlanet';

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

const sun = new Three.Mesh(
  new Three.SphereGeometry(12, 16, 16),
  new Three.MeshLambertMaterial({
    color: 0xffff00,
    emissive: 0xdd4422
  })
);
sun.name = 'Sun';
scene.add(sun);

[
  {name: 'Mercury', color: 'rgb(124, 131, 203)', distance: 20, volume: 2},
  {name: 'Venus', color: 'rgb(190, 138, 44)', distance: 30, volume: 4},
  {name: 'Earth', color: 'rgb(46, 69, 119)', distance: 40, volume: 5},
  {name: 'Mars', color: 'rgb(210, 81, 16)', distance: 50, volume: 4},
  {name: 'Jupiter', color: 'rgb(254, 208, 101)', distance: 70, volume: 9},
  {name: 'Jupiter', color: 'rgb(210, 140, 39)', distance: 100, volume: 7},
  {name: 'Uranus', color: 'rgb(49, 168, 218)', distance: 120, volume: 4},
  {name: 'Neptune', color: 'rgb(84, 125, 204)', distance: 150, volume: 3}
].forEach((planet) => {
  const star = initPlanet(planet.name, planet.color, planet.distance, planet.volume);
  scene.add(star.mesh);
});

container.appendChild(stats.dom);
container.appendChild(renderer.domElement);

renderer.render(scene, camera);
