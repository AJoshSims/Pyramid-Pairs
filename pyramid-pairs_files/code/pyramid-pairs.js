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

var rotationDelta = 0.025;

var colorOfSand = 0xedc9af;

var colorsOfPyramidBottoms =
	[0xffb3b3, 0x4d0000,
	0xffb3ff, 0x4d004d,
	0xb3ffb3, 0x004d00,
	0xb3ffff, 0x004d4d];

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

var pyramids;

var raycaster;

var mouse;

var pyramidSelected01;

var pyramidSelected02;

var revealing;

main();

function main()
{
	awake();

	start();

	update();
}

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

	var geometry;
	var color01;
	var color02;
	var material;
	var pyramid;
	for (var i = -2; i < 2; ++i)
	{
		for (var j = -4; j < 4; ++j)
		{
			geometry = new THREE.CylinderGeometry(0, 10, 10, 4);
			color01 = getColorOfPyramidBottomRandom();
			color02 = getColorOfPyramidBottomRandom();
			geometry.faces[4].color.setHex(0x4d0000);
			geometry.faces[5].color.setHex(0x4d0000);
			material = new THREE.MeshLambertMaterial(
				{vertexColors: THREE.FaceColors});
			pyramid = new THREE.Mesh(geometry, material);

			pyramid.position.x = j * 25;
			pyramid.position.z = i * 25;

			pyramids.push(pyramid);

			scene.add(pyramid);
		}
	}
}

function getColorOfPyramidBottomRandom()
{
	var randomIndex =
		Math.floor(Math.random() * (colorsOfPyramidBottoms.length + 1));

	return colorsOfPyramidBottoms[randomIndex];
}

function createLights()
{
	sun = new THREE.DirectionalLight(0xffffff, 1);
	sun.position.x = -100;
	sun.position.y = 250;
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
	camera01.position.y = 150;
	camera01.position.z = 150;
	camera01.lookAt(centerOfScene);
	cameraCurrent = camera01;
}

function start()
{
	showStart();

	createEventListeners();
}

function showStart()
{
	openBox();

	showTitle();
}

function openBox()
{

}

function showTitle()
{

}

function createEventListeners()
{
	createMouseDownListener();
}

function createMouseDownListener()
{
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	pyramidSelected01 = null;
	pyramidSelected02 = null;

	revealing = false;

	document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function update()
{
	requestAnimationFrame(update);

	render();
}

function render()
{
	rotatePyramid(pyramidSelected01);

	rotatePyramid(pyramidSelected02);

	renderer.render(scene, cameraCurrent);
}

function rotatePyramid(pyramid)
{
	if (pyramid !== null)
	{
		if (revealing && pyramid.rotation.x < (Math.PI * 1.25))
		{
			pyramid.rotation.x += rotationDelta;
		}

		else if (!revealing && pyramid.rotation.x > 0)
		{
			pyramid.rotation.x -= rotationDelta;
		}
	}
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
		if (pyramidSelected01 === null)
		{
			pyramidSelected01 = intersects[0].object;
			revealing = true;
		}

		// else if (
		// 	pyramidSelected02 === null && intersects[0] != pyramidSelected01)
		// {
		// 	pyramidSelected02 = intersects[0].object;
		// 	revealing = true;
		//
		// 	if (checkEquality(pyramidSelected01, pyramidSelected02) == true)
		// 	{
		//
		// 	}
		// }
	}
}

function checkEquality(pyramid01, pyramid02)
{

}



