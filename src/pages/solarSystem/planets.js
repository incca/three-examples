import * as Three from 'three';

/**
 * 初始化行星
 * @param {String} name - 行星
 * @param {Number|String} color - 颜色
 * @param {Number} distance - 与原点的距离
 * @param {Number} volume - 体积
 * @param {Number} speed - 角速度
 * @returns {Three.Mesh}
 */
function initPlanet (name, color, distance, volume, speed) {
  let mesh = new Three.Mesh(
    new Three.SphereGeometry(volume, 16, 16),
    new Three.MeshLambertMaterial({emissive: color})
  );

  mesh.position.z = -distance;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = name;

  return {
    name,
    distance,
    volume,
    mesh,
    speed,
    angle: Math.random() * 2
  };
}

export default initPlanet;

export const platnetData = {
  Mercury: {
    name: 'Mercury',
    color: 'rgb(124, 131, 203)',
    distance: 20,
    volume: 2,
    speed: 0.012
  },
  Venus: {
    name: 'Venus',
    color: 'rgb(190, 138, 44)',
    distance: 30,
    volume: 4,
    speed: 0.01
  },
  Earth: {
    name: 'Earth',
    color: 'rgb(46, 69, 119)',
    distance: 40,
    volume: 5,
    speed: 0.009
  },
  Mars: {
    name: 'Mars',
    color: 'rgb(210, 81, 16)',
    distance: 50,
    volume: 4,
    speed: 0.008
  },
  Jupiter: {
    name: 'Jupiter',
    color: 'rgb(254, 208, 101)',
    distance: 70,
    volume: 9,
    speed: 0.006
  },
  Saturn: {
    name: 'Saturn',
    color: 'rgb(210, 140, 39)',
    distance: 100,
    volume: 7,
    speed: 0.005
  },
  Uranus: {
    name: 'Uranus',
    color: 'rgb(49, 168, 218)',
    distance: 120,
    volume: 4,
    speed: 0.003
  },
  Neptune: {
    name: 'Neptune',
    color: 'rgb(84, 125, 204)',
    distance: 150,
    volume: 3,
    speed: 0.002
  }
};

export const dialogues = [
  ['这是一个', '太阳系']
];
