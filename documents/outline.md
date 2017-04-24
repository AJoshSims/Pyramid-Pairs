Pyramid Pairs
	8x5 grid
		40 pyramids
	Need 10 colors
		two colors on bottom of each pyramid
	Rotation by clicking
		If a first pyramid is clicked, it rotates
			If the first pyramid is clicked again, it rotates only if second pyramid is rotated
		If a second pyramid is clicked, it rotates
			If the two rotated pyramids have equal color sums, they disappear one second after second pyramid finishes rotation
		If a third pyramid is clicked, it does not rotate
		If one of the two rotated pyramids is clicked, they both rotate down at the same time

	intialize
	createBox
	createPyramids
		createPyramid (x40)
			(create pyramid segments)
	start
		openBox
			(pull box sides down and lift top up)
		showStart
			("Pyramid Pairs" fades in at top of screen after box has opened) 
	onDocumentMouseDown
		(If something was clicked)
			(If readyForUserInteraction)
				(If pyramidSelected01 === null)
					(pyramidSelected01 = intersect)
					(reveal(pyramidSelected01))
				(Else if pyramidSelected02 === null)
					(pyramidSelected02 = intersect)
					(reveal(pyramidSelected02))
					(wait one second)
					(If pyramidSelected01 === pyramidSelected02)
						(remove(pyramidSelected01))
						(remove(pyramidSelected02))
				(Else if intersect === pyramidSelected01 || intersect === pyramidSelected02)
					(conceal(pyramidSelected01))
					(conceal(pyramidSelected02))
					(pyramidSelected01 = null)
					(pyramidSelected02 = null)
				(Else)
					(Nothing happens)
		reveal(pyramid)
			(Rotate pyramid up)
		conceal(pyramid)
			(Rotate pyramid down)
		remove(pyramid)
			(destroy(pyramid))
			(scene.remove(pyramid))
			destroy(pyramid)
	end
		showEnd


	intialize
	draw
		create pyramids
			
	render
	handle