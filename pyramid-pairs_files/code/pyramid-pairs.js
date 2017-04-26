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

// TODO
// Looser coupling

// TODO
// More pyramids (more colors or pictures)

var rotationDelta = 0.025;

var colorOfSand = 0xedc9af;

var colorsForPyramidBottoms =
	[0xffb3b3,
	0xffb3ff,
	0xb3ffb3,
	0xb3ffff];

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

var colorsUsable;

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

	createColorsUsable();
	console.log(colorsUsable.length);
	colorsUsable = shuffleArray(colorsUsable);
	console.log(colorsUsable);

	var geometry;
	var colorsToUse;
	var material;
	var pyramid;

	for (var i = -2; i < 1; ++i)
	{
		for (var j = -2; j < 4; ++j)
		{
			colorsToUse = colorsUsable.pop();

			geometry = new THREE.CylinderGeometry(0, 10, 10, 4);
			for (var f = 0; f < 4; ++f)
			{
				geometry.faces[f].color.setHex(colorOfSand);
			}
			geometry.faces[4].color.setHex(colorsToUse["color01"]);
			geometry.faces[5].color.setHex(colorsToUse["color01"]);
			geometry.faces[6].color.setHex(colorsToUse["color02"]);
			geometry.faces[7].color.setHex(colorsToUse["color02"]);
			material = new THREE.MeshLambertMaterial(
				{vertexColors: THREE.FaceColors});
			pyramid = new THREE.Mesh(geometry, material);

			pyramid.position.x = j * 25 - 20;
			pyramid.position.z = i * 25 + 10;

			pyramids.push(pyramid);

			scene.add(pyramid);
		}
	}
}

function createColorsUsable()
{
	colorsUsable = [];

	var colorsUsableCouple;
	for (var i = colorsForPyramidBottoms.length - 1; i >= 0; --i)
	{
		for (var j = colorsForPyramidBottoms.length - 1; j >= 0; --j)
		{
			colorsUsableCouple =
				{"color01" : colorsForPyramidBottoms[i],
					"color02" : colorsForPyramidBottoms[j]};
			for (
				var pyramidsPerMatch = 2;
				pyramidsPerMatch > 0;
				--pyramidsPerMatch)
			{
				colorsUsable.push(colorsUsableCouple);
			}
		}
		colorsForPyramidBottoms.pop();
	}

	// 1 2 3 4
	// 1
	// 1,1 1,2 1,3 1,4

	// 2 3 4
	// 2
	// 2,2 2,3 2,4

	// 3 4
	// 3
	// 3,3 3,4

	// 4
	// 4
	// 4,4
}

function shuffleArray(array) {
	var counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		var index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		var temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
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
		// if (pyramidSelected01 === null)
		// {
			pyramidSelected01 = intersects[0].object;
			revealing = true;
		// }

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



