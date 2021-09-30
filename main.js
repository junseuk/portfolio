import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.setZ(30)

//Cats
const loader = new OBJLoader()
loader.load(
  './cat.obj',
  function ( object ) {
    cat = object
    object.position.x += 35
    object.position.y -= 359
    object.position.z -= 100
    scene.add(object)
  }
)


//Light & Grid Helpers
const pointLight = new THREE.PointLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
const axesHelper = new THREE.AxesHelper(5)
pointLight.position.set(5, 5, 20)

scene.add(pointLight, lightHelper, gridHelper, axesHelper)

//Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material )

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ))
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)

//Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg')
const moonNormalTexture = new THREE.TextureLoader().load('normal.jpeg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32 ,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture
  })
)
moon.position.z = 30
moon.position.setX(-10)
scene.add(moon)


//Space background
const spaceTexture = new THREE.TextureLoader().load('space.jpeg')
scene.background = spaceTexture

//Orbit Control
//const controls = new OrbitControls(camera, renderer.domElement)

//Camera Control
function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05
  
  camera.position.z = t * -0.05
  camera.position.x = t * -0.0002
  camera.position.y = t * -0.0002
}

document.body.onscroll = moveCamera

//Animation
function animate() {
  requestAnimationFrame( animate )
  renderer.render( scene, camera )
  
  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01
}

animate()

