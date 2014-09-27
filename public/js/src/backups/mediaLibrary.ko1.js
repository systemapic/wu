Wu.SidePane.MediaLibrary = Wu.SidePane.Item.extend({

	type : 'mediaLibrary',
	title : 'Media',

	initContent : function () {

		// create new fullscreen page, and set as default content
		this._content = Wu.DomUtil.create('div', 'fullpage-mediaLibrary', Wu.app._appPane);
		
		// create container (overwrite default) and insert template			// innerHTML
		this._container = Wu.DomUtil.create('div', 'editor-wrapper', this._content, ich.mediaLibrary({ media : 'this is media!' }));

		// get pane
		this._innerContent = Wu.DomUtil.get('mediaLibrary-inner-content');


		


		this._leftImage = {}
		this._leftImage.innerSlider = Wu.DomUtil.get("mediaLibrary-inner-slider-left");
		this._leftImage.grabGrid = Wu.DomUtil.get("mediaLibrary-grabgrid-left");
		this._leftImage.Image = Wu.DomUtil.get("mediaLibrary-image-container-left");
		this._leftImage.Image.img = this._leftImage.Image.getElementsByTagName("img")[0];
		this._leftImage.nativeResolution = Wu.DomUtil.get("mediaLibrary-data-resolution-l");
		this._leftImage.filename = Wu.DomUtil.get("mediaLibrary-data-filename-l");
		this._leftImage.fileCaptured = Wu.DomUtil.get("mediaLibrary-data-captured-l");
		this._leftImage.fileUploaded = Wu.DomUtil.get("mediaLibrary-data-uploaded-l");
		this._leftImage.fileUploadedBy = Wu.DomUtil.get("mediaLibrary-data-uploaded-by-l");
		this._leftImage.percent = Wu.DomUtil.get("mediaLibrary-percent-left-side");
		this._leftImage.zoomIn = Wu.DomUtil.get("mediaLibrary-zoom-in-left");
		this._leftImage.zoomOut = Wu.DomUtil.get("mediaLibrary-zoom-out-left");



		this._rightImage = {}
		this._rightImage.innerSlider = Wu.DomUtil.get("mediaLibrary-inner-slider-right");
		this._rightImage.grabGrid = Wu.DomUtil.get("mediaLibrary-grabgrid-right");
		this._rightImage.Image = Wu.DomUtil.get("mediaLibrary-image-container-right");
		this._rightImage.Image.img = this._rightImage.Image.getElementsByTagName("img")[0];
		this._rightImage.nativeResolution = Wu.DomUtil.get("mediaLibrary-data-resolution-r");
		this._rightImage.filename = Wu.DomUtil.get("mediaLibrary-data-filename-r");
		this._rightImage.fileCaptured = Wu.DomUtil.get("mediaLibrary-data-captured-r");
		this._rightImage.fileUploaded = Wu.DomUtil.get("mediaLibrary-data-uploaded-r");
		this._rightImage.fileUploadedBy = Wu.DomUtil.get("mediaLibrary-data-uploaded-by-r");
		this._rightImage.percent = Wu.DomUtil.get("mediaLibrary-percent-right-side");
		this._rightImage.zoomIn = Wu.DomUtil.get("mediaLibrary-zoom-in-right");
		this._rightImage.zoomOut = Wu.DomUtil.get("mediaLibrary-zoom-out-right");



		
		
		

	},

	_addHooks : function () {

		console.log('addHooks');
		// Wu.DomEvent.on(this._button, 'mousedown', this.dosomething, this);

		// Zooming in on Left Image
		Wu.DomEvent.on(this._leftImage.zoomIn, 'mousedown', function() { this.zoomInImg('left') }, this);
		Wu.DomEvent.on(this._leftImage.zoomIn, 'mouseup', function() { this.zoomInImg_stop('left') }, this);

		// Zooming out on Left Image
		Wu.DomEvent.on(this._leftImage.zoomOut, 'mousedown', function() { this.zoomOutImg('left') }, this);
		Wu.DomEvent.on(this._leftImage.zoomOut, 'mouseup', function() { this.zoomOutImg_stop('left') }, this);
		
		// Zooming in on Right Image
		Wu.DomEvent.on(this._rightImage.zoomIn, 'mousedown', function() { this.zoomInImg('right') }, this);
		Wu.DomEvent.on(this._rightImage.zoomIn, 'mouseup', function() { this.zoomInImg_stop('right') }, this);

		// Zooming out on Right Image
		Wu.DomEvent.on(this._rightImage.zoomOut, 'mousedown', function() { this.zoomOutImg('right') }, this);
		Wu.DomEvent.on(this._rightImage.zoomOut, 'mouseup', function() { this.zoomOutImg_stop('right') }, this);


	},

	zoomInImg : function (side) {
		
		


		// get position


		// LEFT
		if ( side == "left" ) {
		
			var currentActiveNativeWidth = this.images[this._currentActiveLeft].file.data.image.dimensions.width;

			var imgContainer = this._leftImage.Image.img;
			
			var _imgWidth = imgContainer.offsetWidth;
			var _imgHeight = imgContainer.offsetHeight;
			var _imgLeft = imgContainer.offsetLeft;
			var _imgTop = imgContainer.offsetTop;

			var hw_prop = _imgHeight / _imgWidth;			


			var _imgWrapperWidth = this._leftImage.Image.offsetWidth;
			var _imgWrapperHeight = this._leftImage.Image.offsetHeight;


			var iol = - ((_imgWidth - _imgWrapperWidth)/2);
			var offset_X = iol - _imgLeft;

			console.log('offset_X', offset_X);

			if ( offset_X < 0 ) {
				var halfNewX1 = _imgWidth + offset_X;
				var halfNewX2 = _imgWidth;
				var leftOffsetPercentage = 2 - (halfNewX2 / halfNewX1);

				console.log( 'offset_x larger than zer0');

			} else {
				var halfNewX1 = _imgWidth - offset_X;
				var halfNewX2 = _imgWidth;
				var leftOffsetPercentage = halfNewX2 / halfNewX1;

				console.log( 'offset_x less than zer0');

			}




			var iot = - (((_imgHeight - _imgWrapperHeight) - 3)/2);
			var offset_Y = iot - _imgTop;

			if ( offset_Y < 0 ) {
				var halfNewY1 = _imgHeight + offset_Y;
				var halfNewY2 = _imgHeight;
				var topOffsetPercentage = 2 - (halfNewY2 / halfNewY1);

			} else {
				var halfNewY1 = _imgHeight - offset_Y;
				var halfNewY2 = _imgHeight;
				var topOffsetPercentage = halfNewY2 / halfNewY1;				

			}



			// var halfNewY1 = _imgHeight + offset_Y;
			// var halfNewY2 = _imgHeight;

			// var topOffsetPercentage = halfNewY2 / halfNewY1;











			var fuckYou = Wu.DomUtil.get("fuckyou");
			var fuckMe = Wu.DomUtil.get("fuckme");
			
			fuckYou.style.width = _imgWidth + 'px';
			fuckYou.style.height = _imgHeight + 'px';
			fuckYou.style.left = _imgLeft + 'px';
			fuckYou.style.top = _imgTop + 'px';


			var greenLeft = _imgWidth/2 + offset_X - 5 + 'px';
			var greenTop = _imgHeight/2 + offset_Y - 5 + 'px';

			// var imageLeft = 

			fuckme.style.left = greenLeft;
			fuckme.style.top = greenTop;


			console.log("IOL lol ~ IMAGE LEFT POSITION WITHOUT OFFSET", iol);
			console.log("_imgLeft ~ CURRENT IMAGE LEFT", _imgLeft);
			console.log("offset_X ~ IMAGE OFFSET FROM X POSITION", offset_X)



			console.log('*************************');

			console.log('offset_X', offset_X);
			console.log('offset_Y', offset_Y);

			console.log('leftOffsetPercentage', leftOffsetPercentage);
			console.log('topOffsetPercentage', topOffsetPercentage);

			console.log('*************************');			

			var fuckme_Left = fuckme.offsetLeft;
			var fuckme_Top = fuckme.offsetTop;





			// var superLeft = _imgLeft + (_imgWrapperWidth/2);
			// var superTop = _imgTop + (_imgWrapperHeight/2);

			// _imgLeft = superLeft;
			// _imgTop = superTop;

			var that = this;








			// ZOOOOOMING 
			this._leftImage.ZoomingIn = setInterval(function() {
				
				// How fast we want to zoom IN 
				zoomIndex = 10;

				// flytte 5px opp og til venstre
				leftZoomIndex = zoomIndex/2;
				topZoomIndex = (zoomIndex/2) * hw_prop;				





				// Figure out the proportions if the image has been dragged...
				_leftImgZoomPercentage = leftZoomIndex * leftOffsetPercentage;  				/// dfdklfmlfdkmldfk
				_topImgZoomPercentage = topZoomIndex * topOffsetPercentage;

				fuckme_Left += _leftImgZoomPercentage;	// px
				fuckme_Top += _topImgZoomPercentage;
					

				// Update Image size and posititon
				_imgWidth+=zoomIndex;
				_imgLeft-=_leftImgZoomPercentage;
				_imgTop-=_topImgZoomPercentage;

				var currentPercent = Math.round((_imgWidth / currentActiveNativeWidth) * 100);
				that._leftImage.percent.innerHTML = currentPercent;


				// Prevent Image from becoming smaller than its wrapper
				// if ( _imgWidth <= _imgWrapperWidth ) _imgWidth = _imgWrapperWidth;
				// if ( _imgLeft >= 0 ) _imgLeft = 0;

				imgContainer.style.width = _imgWidth + 'px';
				imgContainer.style.height = _imgWidth * hw_prop + 'px';
				imgContainer.style.left = _imgLeft + 'px';
				imgContainer.style.top = _imgTop + 'px';

				fuckYou.style.width = _imgWidth + 'px';
				fuckYou.style.height = _imgWidth * hw_prop + 'px';
				fuckYou.style.left = _imgLeft + 'px';
				fuckYou.style.top = _imgTop + 'px';

				fuckme.style.left = fuckme_Left + 'px';
				fuckme.style.top = fuckme_Top + 'px';

			}, 10);
		}

		// RIGHT
		if ( side == "right" ) {

				var currentActiveNativeWidth = this.images[this._currentActiveRight].file.data.image.dimensions.width;
				
				var imgContainer = this._rightImage.Image.img;
				
				var _imgWrapperWidth = this._rightImage.Image.offsetWidth;
				var _imgWidth = imgContainer.offsetWidth;
				var _imgHeight = imgContainer.offsetHeight;
				var _imgLeft = imgContainer.offsetLeft;

				var that = this;
				this._rightImage.ZoomingIn = setInterval(function() {
					
					_imgWidth+=10;
					_imgLeft-=5;

					var currentPercent = Math.round((_imgWidth / currentActiveNativeWidth) * 100);
					that._rightImage.percent.innerHTML = currentPercent;


					// Prevent Image from becoming smaller than its wrapper
					if ( _imgWidth <= _imgWrapperWidth ) _imgWidth = _imgWrapperWidth;
					if ( _imgLeft >= 0 ) _imgLeft = 0;

					imgContainer.style.width = _imgWidth + 'px';
					imgContainer.style.height = 'auto';
					imgContainer.style.left = _imgLeft + 'px';				

			}, 10);
		}

		
	},

	zoomInImg_stop : function (side) {
		
		if ( side == "left" ) {
			clearInterval(this._leftImage.ZoomingIn);
	
			this.__leftImageUpdate();

		}

		if ( side == "right" ) {
			clearInterval(this._rightImage.ZoomingIn);	
		}
		
	},


	zoomOutImg : function (side) {
		
		// LEFT
		if ( side == "left" ) {

			var currentActiveNativeWidth = this.images[this._currentActiveLeft].file.data.image.dimensions.width;

			var imgContainer = this._leftImage.Image.img;

			var _imgWrapperWidth = this._leftImage.Image.offsetWidth;
			var _imgWidth = imgContainer.offsetWidth;
			var _imgHeight = imgContainer.offsetHeight;
			var _imgLeft = imgContainer.offsetLeft;

			var that = this;
			this._leftImage.ZoomingOut = setInterval(function() {

				_imgWidth-=10;
				_imgLeft+=5;

				var currentPercent = Math.round((_imgWidth / currentActiveNativeWidth) * 100);
				that._leftImage.percent.innerHTML = currentPercent;


				// Prevent Image from becoming smaller than its wrapper
				if ( _imgWidth <= _imgWrapperWidth ) _imgWidth = _imgWrapperWidth;
				if ( _imgLeft >= 0 ) _imgLeft = 0;

				imgContainer.style.width = _imgWidth + 'px';
				imgContainer.style.height = 'auto';
				imgContainer.style.left = _imgLeft + 'px';

			}, 10);
		}

		// RIGHT
		if ( side == "right" ) {

				var currentActiveNativeWidth = this.images[this._currentActiveRight].file.data.image.dimensions.width;

				var imgContainer = this._rightImage.Image.img;

				var _imgWrapperWidth = this._rightImage.Image.offsetWidth;
				var _imgWidth = imgContainer.offsetWidth;
				var _imgHeight = imgContainer.offsetHeight;
				var _imgLeft = imgContainer.offsetLeft;

				var that = this;
				this._rightImage.ZoomingOut = setInterval(function() {

					_imgWidth-=10;
					_imgLeft+=5;

					var currentPercent = Math.round((_imgWidth / currentActiveNativeWidth) * 100);
					that._rightImage.percent.innerHTML = currentPercent;

					// Prevent Image from becoming smaller than its wrapper
					if ( _imgWidth <= _imgWrapperWidth ) _imgWidth = _imgWrapperWidth;
					if ( _imgLeft >= 0 ) _imgLeft = 0;

					imgContainer.style.width = _imgWidth + 'px';
					imgContainer.style.height = 'auto';
					imgContainer.style.left = _imgLeft + 'px';


				}, 10);
		}

	},

	zoomOutImg_stop : function (side) {
		
		if ( side == "left" ) {
			clearInterval(this._leftImage.ZoomingOut);
			this.__leftImageUpdate();
		}

		if ( side == "right" ) {
			clearInterval(this._rightImage.ZoomingOut);
		}

	},

	__leftImageUpdate : function () {

			var crunchPath = 'http://85.10.202.87:8080/pixels/';		

			var thisImage = this.images[this._currentActiveLeft];

			var nativeWidth = thisImage.file.data.image.dimensions.width;
			var nativeHeight = thisImage.file.data.image.dimensions.height;

			var imageWidth = this._leftImage.Image.img.offsetWidth;
			var imageHeight = this._leftImage.Image.img.offsetHeight;

			var wrapperWidth = this._leftImage.Image.offsetWidth;
			var wrapperHeight = this._leftImage.Image.offsetHeight;

			var _xCrop = this._leftImage.Image.img.offsetLeft;

			if ( imageHeight >= wrapperHeight ) {
				var _yCrop = wrapperHeight - imageHeight;
			} else {
				var _yCrop = 0;
			}


			console.log("************************");
			console.log("New image", thisImage.file.uuid)
			console.log("New image width:", imageWidth);
			console.log("New image height:", imageHeight);
			console.log("------------------------");
			console.log("New image X-crop:", Math.abs(_xCrop));
			console.log("New image Y-crop:", Math.abs(_yCrop));
			console.log("------------------------");
			console.log("New image crop width:", wrapperWidth)
			console.log("New image crop height:", wrapperHeight)
			
			var _requestCrunch = crunchPath;
				_requestCrunch += thisImage.file.uuid;
				_requestCrunch += '?width=' + imageWidth;
				_requestCrunch += '&height=' + imageHeight;
				_requestCrunch += '&cropw=' + wrapperWidth;
				_requestCrunch += '&croph=' + wrapperHeight;
				_requestCrunch += '&cropx=' + Math.abs(_xCrop);
				_requestCrunch += '&cropy=' + Math.abs(_yCrop)/2;

			this._rightImage.Image.img.src = _requestCrunch;		
	
	},

	removeHooks : function () {

	},

	addEditHooks : function () {
				       
	},

	removeEditHooks : function () {
		
	},

	// fired when different sidepane selected, for clean-up
	deactivate : function () {
		console.log('clear!');
	},



	updateContent : function () {
		this.update();
	},

	update : function () {
		// set project
		this.project = app.activeProject;
		
		console.log('MEDIALIBRARY: ', this.project);

		// flush
		this.reset();

		// build shit
		this.refresh();

		// add edit hooks
		this.addEditHooks();
	
	},

	thumbClick : function (uuid, side) {

		console.log('thumbClick');
		console.log('side', side);

		var store = this.images[uuid];

		if ( side == 'left' ) {
			var imgFrame = this._leftImage;
			this._currentActiveLeft = uuid;
		}

		if ( side == 'right' ) {
			var imgFrame = this._rightImage;
			this._currentActiveRight = uuid;
		}

		imgFrame.Image.img.removeAttribute("style");

		var crunchPath = 'http://85.10.202.87:8080/pixels/';		


		// Request Image
		var largeImgRequest = crunchPath + uuid + '?width=1200&height=800';
		
		// Get dimensions of raw file
		var _rawWidth = store.file.data.image.dimensions.width;
		var _rawHeight = store.file.data.image.dimensions.height;

		// Set the Image Data fields
		imgFrame.nativeResolution.innerHTML = _rawWidth + ' x ' + _rawHeight + ' pixels';
		imgFrame.filename.innerHTML = store.file.name;

		imgFrame.fileCaptured.innerHTML = new Date(store.file.data.image.created).toDateString();

		// 'unknown'; //files[t].captured;
		var dateString = new Date(store.file.created).toDateString();
		imgFrame.fileUploaded.innerHTML = dateString;
		imgFrame.fileUploadedBy.innerHTML = store.file.createdByName;

		// Figure out the percent
		var containerWidth = imgFrame.Image.offsetWidth;
		var showingPercent = Math.round((containerWidth / _rawWidth) * 100);
		imgFrame.percent.innerHTML = showingPercent;

		// Figure out the orientation
		var rawProp = _rawWidth / _rawHeight;

		if ( rawProp >= 1 ) { 
			Wu.DomUtil.addClass(imgFrame.Image, "landscape", this);
			Wu.DomUtil.removeClass(imgFrame.Image, "portrait", this);
		} else { 
			Wu.DomUtil.removeClass(imgFrame.Image, "landscape", this);
			Wu.DomUtil.addClass(imgFrame.Image, "portrait", this);
		}


		var newWidth = 900;
		var _prop = newWidth / _rawWidth;
		var newHeight = _rawHeight * _prop;

		var _imgWrapperWidth = imgFrame.Image.offsetWidth;		
		var _imgWrapperHeight = imgFrame.Image.offsetHeight;

		var _bProp = _imgWrapperWidth / newWidth;
		var newVisualHeight = newHeight * _bProp;

		var _newOffsetTop = ((_imgWrapperHeight / 2) - (newVisualHeight / 2));

		// Center Image vertically
		imgFrame.Image.img.style.top = Math.round(_newOffsetTop) + 'px';

		// Insert image
		imgFrame.Image.img.src = crunchPath + uuid + '?width=' + newWidth + '&height=' + newHeight;



	},


	refresh : function () {

		console.log('refresh');
		// build divs and content for project (this.project)

		// get array of files
		var files = this.project.getFiles();
		console.log('files: ', files);


		var crunchPath = 'http://85.10.202.87:8080/pixels/';


		var jpegs = _.filter(files, function (f) {
			return f.format.indexOf('jpg') > -1;
		});

		this.images = {};

		jpegs.forEach(function(jpg) {

			// Left Image Slider
			var store = this.images[jpg.uuid] = {};
			// store.data = this.images[jpg.uuid] = {};
			// store.data = jpg;
			store.file = jpg;
			// store.file.data.image.dimensions; // 
			
			store.left = {};
			store.left.div = Wu.DomUtil.create('div', 'mediaLibrary-slider-thumb', this._leftImage.innerSlider);
			store.left.img = Wu.DomUtil.create('img', '', store.left.div);
			store.left.img.src = crunchPath + jpg.uuid + '?width=145&height=500';


			store.right = {};
			store.right.div = Wu.DomUtil.create('div', 'mediaLibrary-slider-thumb', this._rightImage.innerSlider);
			store.right.img = Wu.DomUtil.create('img', '', store.right.div);
			store.right.img.src = crunchPath + jpg.uuid + '?width=145&height=500';

			// Click on thumb on LEFT side
			Wu.DomEvent.on(store.left.div, 'click', function () {
				console.log("clicking on a left thumb");
				this.thumbClick(jpg.uuid, 'left');
			}, this);

			// Click on thumb on Right side
			Wu.DomEvent.on(store.right.div, 'click', function () {
				console.log("clicking on a left thumb");
				this.thumbClick(jpg.uuid, 'right');
			}, this);

		}, this);


		this._imgDraggable();

		// add hooks
		this._addHooks();

	},

	// DRAGGABLE
	// DRAGGABLE
	// DRAGGABLE

	_imgDraggable : function () {

		var _dragGrid = this._leftImage.grabGrid;

		Wu.DomEvent.on(_dragGrid, 'mousedown', function() { this._initDragging() }, this);
		Wu.DomEvent.on(_dragGrid, 'mousemove', function(e) { this._draggingImage(e) }, this);
		Wu.DomEvent.on(document, 'mouseup', function() { this._stopDragging() }, this);

		this.__x_pos = 0; // Stores x & y coordinates of the mouse pointer
		this.__y_pos = 0;
		this.__x_elem = 0; // Stores top, left values (edge) of the element
		this.__y_elem = 0;

	},

	
	// Will be called when user starts dragging an element
	_initDragging : function () {

			// Store the object of the element which needs to be moved
		    this.__x_elem = this.__x_pos - this._leftImage.Image.img.offsetLeft;
		    this.__y_elem = this.__y_pos - this._leftImage.Image.img.offsetTop;

		this._draggingLeftImage = true;

		return false;
	
	},

	_draggingImage : function (e) {

		    this.__x_pos = document.all ? window.event.clientX : e.pageX;
		    this.__y_pos = document.all ? window.event.clientY : e.pageY;

		    if ( this._draggingLeftImage ) {

				var __new_X = this.__x_pos - this.__x_elem;
				var __new_Y = this.__y_pos - this.__y_elem;

				this._leftImage.Image.img.style.left = __new_X + 'px';
				this._leftImage.Image.img.style.top = __new_Y + 'px';

				var fuckYou = Wu.DomUtil.get("fuckyou");
				fuckYou.style.left = __new_X + 'px';
				fuckYou.style.top = __new_Y + 'px';

			}

	},	

	_stopDragging : function () {

		this._draggingLeftImage = false;

	},

	reset : function () {
		// remove all inside div
		// this._innerContent.innerHTML = '';

		// this.innerSliderLeft.innerHTML = '';
		// this.innerSliderRight.innerHTML = '';
	
		this.removeHooks();
	},

});


