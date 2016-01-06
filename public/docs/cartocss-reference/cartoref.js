var cartoCSS_ref = {

	init : function () {

		// Init D3 Container
		this.__container = d3.select("#hook").append("div").attr('id', 'section_hook');
		
		
		this.showresults(sections);

		this.createValues(values);

	},

	search : function (string) {

		var tempSection = [
			{
			name : 'Search Results',
			identifiers : [] 
			}
			];


		for ( var i = 0; i<sections.length; i++ ) {
			for ( var a = 0; a<sections[i].identifiers.length; a++ ) {
				
				var identifier = sections[i].identifiers[a];
				var str = identifier.name;
				var n = str.search(string);

				if ( n >= 0 ) {
					tempSection[0].identifiers.push(identifier);
				}
			}
		}

		this.showresults(tempSection);

	},

	showresults : function (data) {

		// Bind data
		var _d3_container = this.__container.selectAll('section').data(data);		


		// ENTER
		// ENTER
		// ENTER
		// ENTER

		var _d3_container_enter = _d3_container.enter().append('section');

		// Section Header
		var section_header = 
			_d3_container.selectAll('a')
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
			.append('a')
			.attr('name', function(d) { return d.name; })
			.attr('class', 'h3')
			.html(function(d) { return d.name;})

		// Wrapper	
		var section_enter = 
			_d3_container.selectAll('.carto-css-identifyer-wrapper')
			.data(function(d) {return d.identifiers})
			.enter()
			.append('div')
			.attr('class', 'carto-css-identifyer-wrapper');


		// Name and Value wrapper
		var enterIdentifier = 
			section_enter.selectAll(".carto-css-identifyer")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('div')
				.attr('class', 'carto-css-identifyer');

		// Name
		var enterName = 
			enterIdentifier.selectAll(".carto-css-identifyer-name")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('span')
				.attr('class', 'carto-css-identifyer-name')
				.html(function(d) {return d.name + ': '});

		// Value
		var enterValue = 
			enterIdentifier.selectAll(".carto-css-identifyer-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('span')
				.attr('class', 'carto-css-identifyer-value')
				.html(function(d) {return d.value});

		// Default Value
		var enterDefaultValue =
			section_enter.selectAll(".carto-css-default-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('div')
				.attr('class', 'carto-css-default-value')
				.html(function(d) {return 'Default: ' + d.defaultValue;})

		// Description
		var enterDescription =
			section_enter.selectAll(".carto-css-descrition")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('div')
				.attr('class', 'carto-css-descrition')
				.html(function(d) {return d.description})

		// Valid values wrapper
		var enterValidValues = 
			section_enter.selectAll(".valid-values")
			.data(function(d) {var a = []; a.push(d); return a})
			.enter()
				.append('div')
				.attr('class', function(d) {
					if ( d.validValues.length == 0 ) {
						return 'displayNone';
					} else {
						return 'valid-values';
					}

				})
				.append('div')
					.attr('class', 'valid-values-header')
					.html('Valid values:<br>');

		// Vvalue
		var enterVValue = 
			enterValidValues.selectAll("span")
			.data(function(d) { return d.validValues })
			.enter()
				.append('span')
				.html(function(d) { return d });





		// UPDATE
		// UPDATE
		// UPDATE
		// UPDATE

		// Section Header
		var section_header = 
			_d3_container.selectAll('a')
			.data(function(d) {var a = []; a.push(d); return a})
			.html(function(d) { return d.name;})

		// Wrapper	
		var section_update = 
			_d3_container.selectAll('.carto-css-identifyer-wrapper')
			.data(function(d) { return d.identifiers})

		// Name and Value wrapper
		var updateIdentifier = 
			section_update.selectAll(".carto-css-identifyer")
			.data(function(d) {var a = []; a.push(d); return a})

		// Name
		var updateName = 
			updateIdentifier.selectAll(".carto-css-identifyer-name")
			.data(function(d) {var a = []; a.push(d); return a})
			.html(function(d) {return d.name + ': '});

		// Value
		var updateValue = 
			updateIdentifier.selectAll(".carto-css-identifyer-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.html(function(d) {return d.value});

		// Default Value
		var updateDefaultValue =
			section_update.selectAll(".carto-css-default-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.html(function(d) {return 'Default: ' + d.defaultValue;})

		// Description
		var updateDescription =
			section_update.selectAll(".carto-css-descrition")
			.data(function(d) {var a = []; a.push(d); return a})
			.html(function(d) {return d.description})

		// Valid values wrapper
		var updateValidValues = 
			section_update.selectAll(".valid-values")
			.data(function(d) {var a = []; a.push(d); return a})

		// Vvalue
		var updateVValue = 
			updateValidValues.selectAll("span")
			.data(function(d) { return d.validValues })
			.html(function(d) { return d });	





		// EXIT
		// EXIT
		// EXIT
		// EXIT

		var _d3_container_exit = _d3_container.exit().remove()

		// Section Header
		var section_header = 
			_d3_container.selectAll('a')
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Wrapper	
		var section_exit = 
			_d3_container.selectAll('.carto-css-identifyer-wrapper')
			.data(function(d) { return d.identifiers})
			.exit()
			.remove();

		// Name and Value wrapper
		var exitIdentifier = 
			section_exit.selectAll(".carto-css-identifyer")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Name
		var exitName = 
			exitIdentifier.selectAll(".carto-css-identifyer-name")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Value
		var exitValue = 
			exitIdentifier.selectAll(".carto-css-identifyer-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove()

		// Default Value
		var exitDefaultValue =
			section_exit.selectAll(".carto-css-default-value")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Description
		var exitDescription =
			section_exit.selectAll(".carto-css-descrition")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Valid values wrapper
		var exitValidValues = 
			section_exit.selectAll(".valid-values")
			.data(function(d) {var a = []; a.push(d); return a})
			.exit()
			.remove();

		// Vvalue
		var exitVValue = 
			exitValidValues.selectAll("span")
			.data(function(d) { return d.validValues })
			.exit()
			.remove();


	},

	createValues : function (valueObject) {

		values.forEach(function(value) {

			var valuehook = document.getElementById('valuehook');

			var _section = document.createElement('section');
			valuehook.appendChild(_section);

			var _header = document.createElement('a');	
			_header.innerHTML = value.name;
			_section.appendChild(_header);


			value.identifiers.forEach(function(identifier) {


				var _description = document.createElement('div');
				_description.className = 'value-description';
				_description.innerHTML = identifier.description;

				var _code = document.createElement('div');
				_code.className = 'value-code';
				_code.innerHTML = identifier.code;

				_section.appendChild(_description);
				_section.appendChild(_code);		

			})

		})

	}

}

