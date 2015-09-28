Wu.satteliteAngle = Wu.Class.extend({

	initialize : function (options) {

		this.options = options;
		this.container = this.options.appendTo;

		this.initContent();

	},


	initContent : function () {

		this.color = '#019688';

		this._innerContainer = Wu.DomUtil.create('div', 'd3-satellite-wrapper', this.container);

		var angle = this.options.angle;
		var path = this.options.path;

		this.initAngle(angle);
		this.initCompass(path);
	},

	update : function (options) {

		console.log('update sat...', options);

		this.angleContainer.innerHTML = '';
		this.angleContainer.remove();

		this.compassContainer.innerHTML = '';
		this.compassContainer.remove();


		var angle = options.angle;
		var path  = options.path;


		this.initAngle(angle);
		this.initCompass(path);
	},

	initAngle : function (angle) {

		this.angleContainer = Wu.DomUtil.createId('div', 'd3-satellite-angle-container', this._innerContainer);

		var size = 0.55;
		var startX = 10;
		var startY = 10;
		var paddingBottom = 10;
		var width = 45;
		var height = 75;

		var D3angle = d3.select(this.angleContainer)
				.append("svg")
                              	.attr("width", (width + startX*2) * size)
                              	.attr("height", (height * size) + paddingBottom);

                var yLine = D3angle
				.append("line")
				.attr("x1", startX * size)
				.attr("y1", startY * size)
				.attr("x2", startX * size)
				.attr("y2", (height - startY) * size)
				// Styling
				.attr("stroke-width", 1)
				.attr("stroke", "#999");

                var xLine = D3angle
				.append("line")
				.attr("x1", startX * size)
				.attr("y1", (height - startY - 1) * size)
				.attr("x2", (width + startX) * size)
				.attr("y2", (height - startY - 1) * size)
				// Styling
				.attr("stroke-width", 1)
				.attr("stroke", "#999");				


                var angleLine = D3angle
				.append("line")
				.classed('angle-line', true)
				.attr("x1", startX * size)
				.attr("y1", startY * size)
				.attr("x2", (angle + startX) * size)
				.attr("y2", (height - startY - 1) * size)
				// styling
				.attr('stroke-width', 2)
				.attr('stroke', this.color)


		var startCircle = D3angle
				.append("circle")
				.attr('cx', startX * size)
				.attr('cy', startY * size)
				.attr('r', 3)
				// styling
				.attr('fill', '#FFF')
				.attr('stroke-width', 2)
				.attr('stroke', this.color);


		// Angle
		var text = D3angle
				.append('text')
				.attr('x', ((width/2)+startX) * size)
				.attr('y', (height+15) * size)
				.attr('font-family', 'sans-serif')
				.attr('font-size', '10px')
				.attr('font-weight', 900)
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text(angle + '°');


	},


	initCompass : function (path) {

		this.compassContainer = Wu.DomUtil.createId('div', 'd3-satellite-compass-container', this._innerContainer);

		var size = 0.75;
		var startX = 10;
		var startY = 10;
		var paddingBottom = 10;
		var width = 65;
		var height = 65;		

		var D3container = d3.select(this.compassContainer)
				.append("svg")
                              	.attr("width", width * size)
                              	.attr("height", (height * size) + paddingBottom);


                // North
		var N = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (startY + 2 ) * size)
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('N');

		// South
		var S = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (height - 5) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('S');

		// West
		var W = D3container
				.append('text')
				.attr('x', (startX - 2) * size)
				.attr('y', (height/2 + 3) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('W');

		// East
		var E = D3container
				.append('text')
				.attr('x', (width - 9) * size)
				.attr('y', (height/2 + 3) * size) 
				.attr('font-family', 'sans-serif')
				.attr('font-size', (10 * size) + 'px')
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text('E');


                // East-West line
		var ewLine = D3container
				.append('line')
				.attr("x1", (startX + 5) * size)
				.attr("y1", (height/2 * size))
				.attr("x2", ((width-15) * size))
				.attr("y2", (height/2 * size))
				// style
				.attr('stroke-width', 1)
				.attr('stroke', '#ccc');


		// North-South line
		var nsLine = D3container
				.append('line')
				.attr("x1", (width/2 * size))
				.attr("y1", (startY + 5) * size)
				.attr("x2", (width/2 * size))
				.attr("y2", ((height-15) * size))
				// style
				.attr('stroke-width', 1)
				.attr('stroke', '#ccc');

		// Compass circle frame
                var circle = D3container
				.append("circle")
				.attr('cx', (width/2 * size))
				.attr('cy', (height/2 * size))
				.attr('r', (width/2 - 15) * size)
				// style
				.attr('fill', 'transparent')
				.attr('stroke-width', 1)
				.attr('stroke', '#999');


		// Line container
		var lineContainer = D3container
				.append('g')
				.attr('transform', function() {
					return 'rotate(' + path + ', ' + (width/2 * size) + ',' + (height/2 * size) + ')';
				})


		// Path line
                var line = lineContainer
				.append("line")
				.classed('angle-line', true)
				.attr('fill', 'white')
				.attr("x1", (width/2 * size))
				.attr("y1", startY * size)
				.attr("x2", (width/2 * size))
				.attr("y2", ((height-10) * size))
				// style
				.attr('stroke-width', 2)
				.attr('stroke', this.color)


		// Arrow head
		var triangle = lineContainer
				.append("path")
				.attr("d", function() {
					var _startX = width/2;
					var _startY = startY - 5;
					var M = "M" + (_startX*size) + ',' + (_startY*size);
					var L1 = "L" + ((_startX + 4)*size) + ',' + ((_startY + 6)*size);
					var L2 = "L" + ((_startX - 4)*size) + ',' + ((_startY + 6)*size);
					return M + L1 + L2 + 'Z';
				})
				// style
				.attr('stroke-width', 0)
				.attr('stroke', 'none')
				.attr('fill', this.color)		


                var innerCircle = D3container
				.append("circle")
				.classed('inner-circle', true)
				.attr('cx', (width/2 * size))
				.attr('cy', (height/2 * size))
				.attr('r', 3)
				// style
				.attr('fill', '#FFF')
				.attr('stroke-width', 2)
				.attr('stroke', this.color)



		// Degree
		var degreePath = D3container
				.append('text')
				.attr('x', width/2 * size)
				.attr('y', (height+10) * size)

				.attr('font-family', 'sans-serif')
				.attr('font-size', '10px')
				.attr('font-weight', 900)
				.attr('fill', '#999')
				.attr("text-anchor", "middle")
				.text(path + '°');

								

	},	



});