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

var colorOfSand = 0xedc9af;

var pyramids;

var pyramidToRotate;

var revealing;

var rotationDelta = 0.025;

var raycaster;

var mouse;

awake();

start();

update();

function awake()
{
	createScene();

	createBox();

	createPyramids();

	createLights();

	createCameras();
}

function createScene()
{
	scene = new THREE.Scene();
	centerOfScene = new THREE.Vector3(0, 0, 0);

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function createBox()
{

}

function createPyramids()
{
	pyramids = [];

	var geometry = new THREE.CylinderGeometry(0, 10, 10, 4);
	var material = new THREE.MeshLambertMaterial( {color: colorOfSand} );
	var pyramidNew = new THREE.Mesh( geometry, material );
	pyramids.push(pyramidNew);
	scene.add(pyramidNew);
}

function createLights()
{
	sun = new THREE.DirectionalLight(0xffffff, 1);
	sun.position.x = -100;
	sun.position.y = 100;
	sun.position.z = 100;
	scene.add(sun);
}

function createCameras()
{
	fieldOfView = 45;

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	aspectRatio = canvasWidth / canvasHeight;

	near = 1;
	far = 1000;

	camera01 = new THREE.PerspectiveCamera(
		fieldOfView, aspectRatio, near, far);
	camera01.position.y = 100;
	camera01.position.z = 100;
	camera01.lookAt(centerOfScene);
	cameraCurrent = camera01;
}

function start()
{
	createEventListeners();
}

function createEventListeners()
{
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function update()
{
	requestAnimationFrame(update);

	render();
}

function render()
{
	if (revealing && pyramids[0].rotation.x < (Math.PI * 1.25))
	{
		pyramids[0].rotation.x += rotationDelta;
	}

	else if (!revealing && pyramids[0].rotation.x > 0)
	{
		pyramids[0].rotation.x -= rotationDelta;
	}

	renderer.render(scene, cameraCurrent);
}

function onDocumentMouseDown(event)
{
	event.preventDefault();

	mouse.x = ((event.clientX / renderer.domElement.clientWidth) * 2) - 1;
	mouse.y = -((event.clientY / renderer.domElement.clientHeight) * 2) + 1;

	raycaster.setFromCamera(mouse, cameraCurrent);

	var intersects = raycaster.intersectObjects(pyramids);
	if (intersects.length > 0)
	{
		pyramidToRotate = pyramids[0];
		revealing = !revealing;
	}
}


