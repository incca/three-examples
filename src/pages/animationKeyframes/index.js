import * as Three from 'three';
import * as Stats from 'stats.js';
import { getStaticPath } from 'src/common/js/utils';

window.THREE = Three;

// 引入Loader和控件
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/DRACOLoader');
require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/Detector');

const container = document.getElementById('container');
const stats = new Stats();

const renderer = new Three.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

container.appendChild(stats.dom);
container.appendChild(renderer.domElement);

const scene = new Three.Scene();
scene.background = new Three.Color(0xbfe3dd);

const camera = new Three.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

const controls = new Three.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enablePan = false;

scene.add(new Three.AmbientLight(0x404040));

const pointLight = new Three.PointLight(0xffffff, 1);
pointLight.position.copy(camera.position);
scene.add(pointLight);

const path = getStaticPath('/textures/cube/Park2/');
const format = '.jpg';
const envMap = new Three.CubeTextureLoader().load([
  `${path}posx${format}`, `${path}negx${format}`,
  `${path}posy${format}`, `${path}negy${format}`,
  `${path}posz${format}`, `${path}negz${format}`
]);

Three.DRACOLoader.setDecoderPath(getStaticPath('/js/libs/draco/gltf/'));

const loader = new Three.GLTFLoader();
loader.setDRACOLoader(new Three.DRACOLoader());

let mixer = null;

loader.load(getStaticPath('/models/gltf/LittlestTokyo.glb'), (gltf) => {
  const model = gltf.scene;
  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);
  model.traverse((child) => {
    if (child.isMesh) {
      child.material.envMap = envMap;
    }
  });
  scene.add(model);

  mixer = new Three.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();

  aniamte();
}, undefined, console.error.bind(console));

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const clock = new Three.Clock();

function aniamte () {
  requestAnimationFrame(aniamte);

  const delta = clock.getDelta();
  mixer.update(delta);
  controls.update(delta);
  stats.update();
  renderer.render(scene, camera);
}
