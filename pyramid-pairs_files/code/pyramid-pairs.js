/**
 * A game of pairs.
 *
 * <p>How many players?
 * As many as you like -- just alternate who clicks the pyramids and record
 * points for each player in a text editor.

 * <p>How do I play?
 * 1. Open pyramid-pairs.html in a web browser
 * 2. Click the rainbow box
 * 3. Click pyramids to reveal their identity
 * 	If matching pyramids are selected, they will be removed
 * 	It is only possible to select two pyramids at a time
 * 	While two pyramids are selected, clicking either will deselect both
 * 4. Remove pyramids until all have been removed
 * 5. Restart the game by refreshing the page
 *
 * <p>How do I cheat?
 * Pressing "c" will toggle cheating mode.
 *
 * @author Joshua Sims
 *
 * @version 2017-04-28
 */

// TODO
// Online multiplayer

// TODO
// Looser coupling

// TODO
// Perhaps use of protoypes

// TODO
// More pyramids (more colors or pictures)

// TODO
// Skinned mesh

/**
 * The field of view.
 */
var fieldOfView;

/**
 * The width of the canvas.
 */
var canvasWidth;

/**
 * The height of the canvas.
 */
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

var pyramidColorConcealed = 0xedc9af;

var pyramidColorRevealedPossibilities =
	[0xffb3b3, 0xffb3ff, 0xb3ffb3, 0xb3ffff];

var clickables;

var raycaster;

var mouse;

var enteringBox;

var pyramidSelected01;

var pyramidSelected02;

var pyramidConcealedRotationX;

var pyramidRevealedRotationX;

var pyramidRotationDelta = 0.05;

var pyramidSelected01Revealing;

var pyramidSelected02Revealing;

var checkedEquality;

var revealingAll;

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

	createSceneObjects();

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

function createSceneObjects()
{
	createBox();

	createPyramids();
}

function createBox()
{
	box = new Cuboid(225, 180, 180, 0x000000);

	box.position = centerOfScene;

	scene.add(box);
}

function Cuboid(x, y, z, color)
{
	this.geometry = new THREE.Geometry();

	this.geometry.vertices.push(
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
	this.geometry.faces.push(
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

	this.geometry.computeVertexNormals();

	this.material = new THREE.MeshNormalMaterial({
		side: THREE.DoubleSide});

	this.mesh = new THREE.Mesh(
		this.geometry, this.material);

	return this.mesh;
}

function createPyramids()
{
	pyramids = new THREE.Object3D();

	var pyramidColorsRevealedUsable = createPyramidColorsRevealedUsable();

	pyramidColorsRevealedUsable = shuffleArray(pyramidColorsRevealedUsable);

	console.log(pyramidColorsRevealedUsable);

	var colorsToUse;
	var pyramid;
	for (var i = -2; i < 2; ++i)
	{
		for (var j = -2; j < 3; ++j)
		{
			colorsToUse = pyramidColorsRevealedUsable.pop();

			pyramid = new Pyramid(
				10, 10, 4,
				pyramidColorConcealed,
				colorsToUse["color01"], colorsToUse["color02"]);

			pyramid.position.x = j * 25;
			pyramid.position.z = i * 25;

			pyramids.add(pyramid);
		}
	}

	box.add(pyramids);

	pyramidConcealedRotationX = pyramid.rotation.x;
	pyramidRevealedRotationX = pyramidConcealedRotationX + (Math.PI * 1.25);

	console.log(pyramidColorsRevealedUsable);
}

function Pyramid(
	radiusBottom, height, radiusSegments,
	colorConcealed,
	colorRevealed01, colorRevealed02)
{
	var radiusTop = 0;
	this.geometry = new THREE.CylinderGeometry(
		radiusTop, radiusBottom, height, radiusSegments);

	for (
		var faceNotBottom = 0;
		faceNotBottom < this.geometry.faces.length;
		++faceNotBottom)
	{
		this.geometry.faces[faceNotBottom].color.setHex(colorConcealed);
	}
	var faceBottom = 4;
	this.geometry.faces[faceBottom].color.setHex(colorRevealed01);
	++faceBottom;
	this.geometry.faces[faceBottom].color.setHex(colorRevealed01);
	++faceBottom;
	this.geometry.faces[faceBottom].color.setHex(colorRevealed02);
	++faceBottom;
	this.geometry.faces[faceBottom].color.setHex(colorRevealed02);

	this.material = new THREE.MeshLambertMaterial(
		{vertexColors: THREE.FaceColors});

	this.mesh = new THREE.Mesh(this.geometry, this.material);

	return this.mesh;
}

function createPyramidColorsRevealedUsable()
{
	var pyramidColorsRevealedUsable = [];

	var pyramidColorsRevealedUsableCouple;
	for (
		var color01 = pyramidColorRevealedPossibilities.length - 1;
		color01 >= 0;
		--color01)
	{
		for (
			var color02 = pyramidColorRevealedPossibilities.length - 1;
			color02 >= 0;
			--color02)
		{
			pyramidColorsRevealedUsableCouple =
				{"color01" : pyramidColorRevealedPossibilities[color01],
				"color02" : pyramidColorRevealedPossibilities[color02]};

			for (
				var pyramidsPerMatch = 2;
				pyramidsPerMatch > 0;
				--pyramidsPerMatch)
			{
				pyramidColorsRevealedUsable.push(
					pyramidColorsRevealedUsableCouple);
			}
		}

		pyramidColorRevealedPossibilities.pop();
	}

	return pyramidColorsRevealedUsable;
}

function shuffleArray(array)
{
	var counter = array.length;

	// While there are elements in the array.
	while (counter > 0)
	{
		// Pick a random index.
		var index = Math.floor(Math.random() * counter);

		// Decrease counter by 1.
		counter--;

		// And swap the last element with it.
		var temporary = array[counter];
		array[counter] = array[index];
		array[index] = temporary;
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

	camera.position.x = centerOfScene.x - 450;
	camera.position.y = centerOfScene.y - 550;
	camera.position.z = centerOfScene.z + 500;

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
	createResizeListener();

	createMouseDownListener();

	createKeyDownListener();
}

function createResizeListener()
{
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize()
{
	aspectRatio = canvasWidth / canvasHeight;
	camera.aspect = aspectRatio;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight );
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
	checkedEquality = false;

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	document.addEventListener('mousedown', onDocumentMouseDown, false);
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

		else if (
			(pyramidSelected01 === null)
			&& (clicked[0].object !== pyramidSelected02))
		{
			console.log("u clickd it pyramid01!");
			pyramidSelected01 = clicked[0].object;
			pyramidSelected01Revealing = true;
		}

		else if (
			(pyramidSelected02 === null)
			&& (clicked[0].object !== pyramidSelected01))
		{
			console.log("u clickd it pyramid02!");
			pyramidSelected02 = clicked[0].object;
			pyramidSelected02Revealing = true;
		}

		else if (
			((clicked[0].object === pyramidSelected01)
			|| (clicked[0].object === pyramidSelected02))
			&& ((pyramidSelected01 !== null) && (pyramidSelected02 !== null)))
		{
			pyramidSelected01Revealing = false;
			pyramidSelected02Revealing = false;
		}

		else
		{
			// Nothing happens.
		}
	}
}

function createKeyDownListener()
{
	revealingAll = false;

	document.addEventListener("keydown", onDocumentKeyDown, false);
}

function onDocumentKeyDown(event)
{
	var keyC = 67;

	if (event.keyCode === keyC)
	{
		revealingAll = !revealingAll;
	}
}

function update()
{
	requestAnimationFrame(update);

	enterBox();

	rotatePyramid();

	revealAll();

	render();
}

function rotatePyramid()
{
	if (pyramidSelected01 !== null)
	{
		if (
			(pyramidSelected01Revealing === true)
			&& (pyramidSelected01.rotation.x < pyramidRevealedRotationX))
		{
			pyramidSelected01.rotation.x += pyramidRotationDelta;
		}

		if (pyramidSelected02 !== null)
		{
			if (
				(pyramidSelected01Revealing === false)
				&& (pyramidSelected01.rotation.x > pyramidConcealedRotationX))
			{
				pyramidSelected01.rotation.x -= pyramidRotationDelta;
			}

			if (
				(pyramidSelected02Revealing === true)
				&& (pyramidSelected02.rotation.x < pyramidRevealedRotationX))
			{
				pyramidSelected02.rotation.x += pyramidRotationDelta;
			}


			if (
				(pyramidSelected02Revealing === false)
				&& (pyramidSelected02.rotation.x > pyramidConcealedRotationX))
			{
				pyramidSelected02.rotation.x -= pyramidRotationDelta;
			}

			else if (
				((pyramidSelected01Revealing === true)
				&& (pyramidSelected02Revealing === true))
				&& ((pyramidSelected01.rotation.x >= pyramidRevealedRotationX)
				&& (pyramidSelected02.rotation.x >= pyramidRevealedRotationX))
				&& (checkedEquality === false))
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
				((pyramidSelected01Revealing === false)
				&& (pyramidSelected02Revealing === false))
				&& ((pyramidSelected01.rotation.x <= pyramidConcealedRotationX)
				&& (pyramidSelected02.rotation.x <= pyramidConcealedRotationX)))
			{
				pyramidSelected01 = null;
				pyramidSelected02 = null;
				checkedEquality = false;
			}
		}
	}
}

function checkEquality(pyramid01, pyramid02)
{
	var equality = false;

	if (pyramid01 === null || pyramid02 === null)
	{
		return null;
	}

	var pyramid01ColorLesser;
	var pyramid01ColorGreater;

	if (
		pyramid01.geometry.faces[4].color.getHex()
		<= pyramid01.geometry.faces[6].color.getHex())
	{
		pyramid01ColorLesser = pyramid01.geometry.faces[4].color.getHex();
		pyramid01ColorGreater = pyramid01.geometry.faces[6].color.getHex();
	}
	else
	{
		pyramid01ColorLesser = pyramid01.geometry.faces[6].color.getHex();
		pyramid01ColorGreater = pyramid01.geometry.faces[4].color.getHex();
	}

	var pyramid01ColorCombo =
		"" + pyramid01ColorLesser + pyramid01ColorGreater;

	var pyramid02ColorLesser;
	var pyramid02ColorGreater;

	if (
		pyramid02.geometry.faces[4].color.getHex()
		<= pyramid02.geometry.faces[6].color.getHex())
	{
		pyramid02ColorLesser = pyramid02.geometry.faces[4].color.getHex();
		pyramid02ColorGreater = pyramid02.geometry.faces[6].color.getHex();
	}
	else
	{
		pyramid02ColorLesser = pyramid02.geometry.faces[6].color.getHex();
		pyramid02ColorGreater = pyramid02.geometry.faces[4].color.getHex();
	}

	var pyramid02ColorCombo =
		"" + pyramid02ColorLesser + pyramid02ColorGreater;

	if (pyramid01ColorCombo === pyramid02ColorCombo)
	{
		equality = true;
	}

	return equality;
}

function removeMatchingPyramids()
{
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

function revealAll()
{
	console.log(pyramidSelected01);
	console.log(pyramidSelected02);
	if (
		(revealingAll === true)
		&& (pyramids.rotation.x < pyramidRevealedRotationX))
	{
		pyramids.rotation.x += pyramidRotationDelta;
	}

	else if (
		(revealingAll === false)
		&& (pyramids.rotation.x > pyramidConcealedRotationX))
	{
		pyramids.rotation.x -= pyramidRotationDelta;
	}
}

function render()
{
	renderer.render(scene, camera);
}

