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

var rotationDelta = 0.05;

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

var camera;

var renderer;

var sun;

var box;

var pyramids;

var colorsUsable;

var clickables;

var raycaster;

var mouse;

var enteringBox;

var pyramidSelected01;

var pyramidSelected02;

var pyramidConcealedRotationX;

var pyramidRevealedRotationX;

var revealing;

var checkedEquality = false;

var cheating;

main();

function main()
{
	awake();

	start();

	render();

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
	box = createCuboid(225, 180, 180, 0x000000);

	box.position = centerOfScene;

	scene.add(box);
}

/**
 * Builds a turnstile door.
 *
 * @return the mesh of a turnstile door.
 */
function createCuboid(x, y, z, color)
{
	var cuboidGeometry = new THREE.Geometry();

	cuboidGeometry.vertices.push(
		new THREE.Vector3(-x, y, -z),
		new THREE.Vector3(x, y, -z),
		new THREE.Vector3(x, -y, -z),
		new THREE.Vector3(-x, -y, -z),

		new THREE.Vector3(-x, y, z),
		new THREE.Vector3(x, y, z),
		new THREE.Vector3(x, -y, z),
		new THREE.Vector3(-x, -y, z));

	var vertex00 = 0;
	var vertex01 = 1;
	var vertex02 = 2;
	var vertex03 = 3;
	var vertex04 = 4;
	var vertex05 = 5;
	var vertex06 = 6;
	var vertex07 = 7;
	cuboidGeometry.faces.push(
		new THREE.Face3(vertex00, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex00),

		new THREE.Face3(vertex04, vertex05, vertex06),
		new THREE.Face3(vertex06, vertex07, vertex04),

		new THREE.Face3(vertex00, vertex01, vertex05),
		new THREE.Face3(vertex05, vertex04, vertex00),

		new THREE.Face3(vertex05, vertex01, vertex02),
		new THREE.Face3(vertex02, vertex06, vertex05),

		new THREE.Face3(vertex07, vertex06, vertex02),
		new THREE.Face3(vertex02, vertex03, vertex07),

		new THREE.Face3(vertex00, vertex04, vertex07),
		new THREE.Face3(vertex07, vertex03, vertex00));

	cuboidGeometry.computeVertexNormals();

	var cuboidMaterial = new THREE.MeshNormalMaterial({
		side: THREE.DoubleSide});

	// var cuboidMaterial02 = new THREE.MeshBasicMaterial({
	// 	color: 0x000000,
	// 	side: THREE.DoubleSide});
	//
	// var materials = [cuboidMaterial01, cuboidMaterial02];
	//
	// var cuboidMaterial = new THREE.MultiMaterial(materials);

	var cuboid = new THREE.Mesh(
		cuboidGeometry, cuboidMaterial);

	return cuboid;
}

function createPyramids()
{
	pyramids = new THREE.Object3D();

	createColorsUsable();
	colorsUsable = shuffleArray(colorsUsable);
	console.log(colorsUsable);

	var geometry;
	var colorsToUse;
	var material;
	var pyramid;

	for (var i = -2; i < 2; ++i)
	{
		for (var j = -2; j < 3; ++j)
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

			pyramid.position.x = j * 25;
			pyramid.position.z = i * 25;
			// TODO
			// pyramid.rotation.x = Math.PI * 1.25; for cheating

			pyramids.add(pyramid);
		}
	}

	box.add(pyramids);

	pyramidConcealedRotationX = pyramid.rotation.x;
	pyramidRevealedRotationX = pyramidConcealedRotationX + (Math.PI * 1.25);

	console.log(colorsUsable);
}

function createPyramid()
{

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

	camera = new THREE.PerspectiveCamera(
		fieldOfView, aspectRatio, near, far);
	// camera.position.y = 100;
	camera.position.x = -450;
	camera.position.y = -550;
	camera.position.z = 500;
	// camera.position.z = 150;
	camera.lookAt(centerOfScene);
}

function start()
{
	createEventListeners();
}

function enterBox()
{
	if (enteringBox === true)
	{
		if (camera.position.x < 0)
		{
			camera.position.x += 1;
		}
		if (camera.position.y < 100)
		{
			camera.position.y += 2;
		}
		if (camera.position.z > 150)
		{
			camera.position.z -= 2;
		}

		if (
			(camera.position.x >= 0) &&
			(camera.position.y >= 100)
			&& (camera.position.z <= 150))
		{
			enteringBox = false;
		}

		camera.lookAt(centerOfScene);
	}
}

function createEventListeners()
{
	createMouseDownListener();

	createKeyDownListener();
}

function createMouseDownListener()
{
	clickables = [];
	for (var i = 0; i < pyramids.children.length; ++i)
	{
		clickables.push(pyramids.children[i]);
	}
	clickables.push(box);

	enteringBox = false;

	pyramidSelected01 = null;
	pyramidSelected02 = null;
	revealing = false;

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function createKeyDownListener()
{
	cheating = false;

	document.addEventListener("keydown", onDocumentKeyDown, false);
}

function update()
{
	requestAnimationFrame(update);

	enterBox();

	rotatePyramid(pyramidSelected01);

	rotatePyramid(pyramidSelected02);

	cheat();

	render();
}

function render()
{
	renderer.render(scene, camera);
}

function cheat()
{
	if (
		(cheating === true)
		&& (pyramids.rotation.x < pyramidRevealedRotationX))
	{
		pyramids.rotation.x += rotationDelta;
	}

	else if (
		(cheating === false)
		&& (pyramids.rotation.x > pyramidConcealedRotationX))
	{
		pyramids.rotation.x -= rotationDelta;
	}
}

function rotatePyramid(pyramid)
{
	if (pyramid !== null)
	{
		if (revealing && (pyramid.rotation.x < pyramidRevealedRotationX))
		{
			pyramid.rotation.x += rotationDelta;
		}

		else if (!revealing && (pyramid.rotation.x > pyramidConcealedRotationX))
		{
			pyramid.rotation.x -= rotationDelta;
		}

		else if (
			revealing
			&& ((pyramidSelected01 !== null) && (pyramidSelected02 !== null))
			&& ((pyramidSelected01.rotation.x >= pyramidRevealedRotationX)
			&& (pyramidSelected02.rotation.x >= pyramidRevealedRotationX))
			&& (checkedEquality == false))
		{
			var equality = checkEquality(pyramidSelected01, pyramidSelected02);
			checkedEquality = true;

			if (equality === true)
			{
				setTimeout(function()
				{
					removeMatchingPyramids();
				}, 1000);
			}
		}

		else if (
			!revealing
			&& ((pyramidSelected01.rotation.x <= pyramidConcealedRotationX)
			&& (pyramidSelected02.rotation.x <= pyramidConcealedRotationX)))
		{
			pyramidSelected01 = null;
			pyramidSelected02 = null;
			checkedEquality = false;
		}
	}
}

function onDocumentMouseDown(event)
{
	event.preventDefault();

	mouse.x = ((event.clientX / renderer.domElement.clientWidth) * 2) - 1;
	mouse.y = -((event.clientY / renderer.domElement.clientHeight) * 2) + 1;

	raycaster.setFromCamera(mouse, camera);

	var clicked = raycaster.intersectObjects(clickables);
	if (clicked.length > 0)
	{
		if (clicked[0].object === box)
		{
			box.material = 	new THREE.MeshBasicMaterial({
				color: 0x000000,
				side: THREE.DoubleSide});
			enteringBox = true;
		}

		else if (pyramidSelected01 === null)
		{
			pyramidSelected01 = clicked[0].object;
			reveal(pyramidSelected01);
		}

		else if (
			(pyramidSelected02 === null)
			&& (clicked[0].object !== pyramidSelected01))
		{
			pyramidSelected02 = clicked[0].object;
			reveal(pyramidSelected02);
		}

		else if (
			((clicked[0].object === pyramidSelected01)
			|| (clicked[0].object === pyramidSelected02))
			&& ((pyramidSelected01 !== null) && (pyramidSelected02 !== null)))
		{
			conceal(pyramidSelected01);
			conceal(pyramidSelected02);
		}

		else
		{
			console.log(pyramidSelected01);
			console.log(pyramidSelected02);
			// Nothing happens
		}
	}
}

function reveal(pyramid)
{
	revealing = true;
}

function conceal(pyramid)
{
	revealing = false;
}

function checkEquality(pyramid01, pyramid02)
{
	var equality = false;

	if (pyramid01 === null || pyramid02 === null)
	{
		return null;
	}

	var pyramid01ColorCombo =
		pyramid01.geometry.faces[4].color.getHex() +
		pyramid01.geometry.faces[6].color.getHex();
	console.log("pyramid01 color: " + (pyramid01.geometry.faces[4].color.getHex() + pyramid01.geometry.faces[6].color.getHex()));

	var pyramid02ColorCombo =
		pyramid02.geometry.faces[4].color.getHex() +
		pyramid02.geometry.faces[6].color.getHex();
	console.log("pyramid02 color: " + (pyramid02.geometry.faces[4].color.getHex() + pyramid02.geometry.faces[6].color.getHex()));

	if (pyramid01ColorCombo === pyramid02ColorCombo)
	{
		equality = true;
	}

	return equality;
}

function removeMatchingPyramids()
{
	console.log("In removeMatchingPyramids");

	remove(pyramidSelected01);
	pyramidSelected01 = null;
	remove(pyramidSelected02);
	pyramidSelected02 = null;

	checkedEquality = false;
}

function remove(pyramid)
{
	pyramids.remove(pyramid);
}

function onDocumentKeyDown(event)
{
	var keyC = 67;

	if (event.keyCode === keyC)
	{
		cheating = !cheating;
	}
}
