import * as THREE from 'three'
import { FlyControls } from './node_modules/three/examples/jsm/controls/FlyControls'
import './style.css'
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js'
import { Curves } from './node_modules/three/examples/jsm/curves/CurveExtras'
import { DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let container;
let camera, scene, renderer, controls, path;
const clock = new THREE.Clock();

init();
animate();


function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    //Camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.z = 1000;
    //Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 15000 );
    //Light
    const pointLight = new THREE.PointLight( 0xff2200 );
    pointLight.position.set( 0, 0, 0 );
    scene.add( pointLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 0, 1 ).normalize();
    scene.add( dirLight );
    //Path
    const curve = new Curves.VivianiCurve();
    const curveGeo = new THREE.TubeBufferGeometry( curve , 100 , 2 , 8, true )
    const curveMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff, side: DoubleSide })
    path = new THREE.Mesh( curveGeo, curveMaterial )
    scene.add(path)

    //Cat
    for (let k = 0; k < 1000; k ++) {
        const loader = new OBJLoader()
        loader.load(
            './cat.obj',
            function ( object ) {
                object.rotateX( Math.PI * Math.random()) 
                object.rotateY( Math.PI * Math.random()) 
                object.rotateZ( Math.PI * Math.random())    
                object.position.x = 1 * ( 0.5 - Math.random())
                object.position.y = 1 * ( 0.5 - Math.random())
                object.position.z = 1 * ( 0.5 - Math.random())    
                scene.add(object)
            },
        )
    }

    //Renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //Helpers
    const lightHelper = new THREE.PointLightHelper(pointLight)
    const gridHelper = new THREE.GridHelper(300, 100)
    const axesHelper = new THREE.AxesHelper(100)
    scene.add(pointLight, lightHelper, gridHelper, axesHelper)

    //FlyControl
    // controls = new FlyControls( camera, renderer.domElement );
    // controls.movementSpeed = 1000;
    // controls.rollSpeed = Math.PI / 10;

    //OrbitControl
    controls = new OrbitControls( camera, renderer.domElement )
    window.addEventListener( 'resize', resize, false );

}

function resize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function updateCamera(){
    const time = clock.getElapsedTime();
    const looptime = 120;
    const t = ( time % looptime ) / looptime;
    const t2 = ( (time + 0.1) % looptime) / looptime

    const pos = path.geometry.parameters.path.getPointAt( t );
    const pos2 = path.geometry.parameters.path.getPointAt( t2 );

    camera.position.copy(pos);
    camera.lookAt(pos2);
}

function animate() {

    requestAnimationFrame( animate );
    //updateCamera();
    render();

}

function render() {
    renderer.render( scene, camera );
}