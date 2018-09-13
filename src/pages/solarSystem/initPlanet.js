import * as Three from 'three';

/**
 * 初始化行星
 * @param {String} name - 行星
 * @param {Number} color - 颜色
 * @param {Number} distance - 与原点的距离
 * @param {Number} volume - 体积
 * @returns {Three.Mesh}
 */
function initPlanet (name, color, distance, volume) {
  let mesh = new Three.Mesh(
    new Three.SphereGeometry(volume, 16, 16),
    new Three.MeshLambertMaterial({
      emissive: color
    })
  );

  mesh.position.z = -distance;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = name;

  return {
    name,
    distance,
    volume,
    mesh
  };
}

export default initPlanet;
