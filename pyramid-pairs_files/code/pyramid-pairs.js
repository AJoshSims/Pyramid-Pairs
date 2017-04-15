/**
 *
 *
 * @author Joshua Sims
 *
 * @version 2017-04-28
 */

// TODO
// Render again upon window adjustment

// TODO
// Online multiplayer

var fieldOfView;

var canvasWidth;

var canvasHeight;

var aspectRatio;

var near;

var far;

var scene;

var centerOfScene;

var cameraCurrent;

var camera01;

var renderer;

var sun;

initialize();

draw();

render();

function initialize()
{
	fieldOfView = 45;

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	aspectRatio = canvasWidth / canvasHeight;

	near = 1;
	far = 1000;

	scene = new THREE.Scene();

	centerOfScene = new THREE.Vector3(0, 0, 0);

	camera01 = new THREE.PerspectiveCamera(
		fieldOfView, aspectRatio, near, far);
	camera01.position.y = 50;
	camera01.position.z = 100;
	camera01.lookAt(centerOfScene);
	cameraCurrent = camera01;

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function draw()
{
	sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
	scene.add(sun);

	var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
	var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
	var cylinder = new THREE.Mesh( geometry, material );
	scene.add(cylinder);
}

function render()
{
	renderer.render(scene, cameraCurrent);
}


