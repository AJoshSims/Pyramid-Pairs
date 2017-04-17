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

var pyramid;

var pyramidToRotate;

var revealing;

var rotationDelta = 0.025;

initialize();

draw();

animate();

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
	camera01.position.y = 100;
	camera01.position.z = 100;
	camera01.lookAt(centerOfScene);
	cameraCurrent = camera01;

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function draw()
{
	sun = new THREE.DirectionalLight( 0xffffff, 1 );
	sun.position.x = -100;
	sun.position.y = 100;
	sun.position.z = 100;
	scene.add(sun);

	var geometry = new THREE.CylinderGeometry(0, 10, 10, 4);
	var material = new THREE.MeshLambertMaterial( {color: colorOfSand} );
	pyramid = new THREE.Mesh( geometry, material );
	scene.add(pyramid);
}

function animate()
{
	requestAnimationFrame(animate);

	render();
}

function render()
{
	if (revealing && pyramid.rotation.x < (Math.PI * 1.25))
	{
		pyramid.rotation.x += rotationDelta;
	}

	else if (!revealing && pyramid.rotation.x > 0)
	{
		pyramid.rotation.x -= rotationDelta;
	}

	renderer.render(scene, cameraCurrent);
}

function onDocumentMouseDown(event)
{
	pyramidToRotate = pyramid;
	revealing = !revealing;
}


