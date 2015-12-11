Wu.Data = Wu.Class.extend({

	initialize : function () {

		// init resumable
		this._initResumable();

	},

	_initResumable : function () {

		// create resumable
		this._resumable = new Wu.Resumable({
			onUploadDone : this._onUploadDone 
		});

	},

	// serve an upload button with triggers
	getUploadButton : function (className, appendTo) { // or, perhaps pass button container, if button needs to be recreated

		// save button container
		this._buttonContainer = appendTo;

		// create button
		var button = this._uploadButton = Wu.DomUtil.create('div', className);

		// append to container
		this._buttonContainer.appendChild(button);

		// add button to resumable
		this._resumable.assignBrowse(button);	

		// return button
		return button;
	},

	_onUploadButtonClick : function () {
	},

	// ping from socket
	_onImportedFile : function (file_id, import_time_ms) {

		// print import time
		app.Data._setFeedbackImportTime(import_time_ms);

		// get file objects
		app.Data._getFile(file_id, app.Data._gotFile.bind(app.Data));
	},

	_onUploadDone : function () {
		console.log('uploadDOne');
	},

	_setFeedbackImportTime : function (import_time_ms) {
		var import_took_pretty = (parseInt(import_time_ms / 1000)) + ' seconds';
		var description = 'Import took ' + import_took_pretty;
		app.feedback.setMessage({
			title : 'Data imported successfully',
			// description : description
		});
	},

	// get file/layer objects from server
	_getFile : function (file_id, callback) {

		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		var url = app.options.servers.portal + 'api/upload/get';
		url += '?fileUuid=' + file_id;
		url += '&access_token=' + app.tokens.access_token;

		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var fileObject = Wu.parse(xhr.responseText);

				// return file
				if (fileObject && fileObject.file) return callback(fileObject);
			}
		}
		xhr.send(null);
	},

	_gotFile : function (fileObject) {

		console.log('Imported file:', fileObject);

		var fileStore = fileObject.file;
		var layer = fileObject.layer;
		var user = app.Account;

		// add locally
		var file = user.setFile(fileStore);

		// fire event (for data lib to pick up changes)
		Wu.Mixin.Events.fire('fileImported', { detail : {
			file : file
		}});
	},


	disableUploader : function () {

	},
	enableUploader : function () {

	},


});