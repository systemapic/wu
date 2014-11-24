Wu.SidePane.Account = Wu.SidePane.Item.extend({
	_ : 'sidepane.account', 


	type : 'account',
	title : 'Logout', // just simple logout button for now

	initContent : function () {
		this._account = app.Account;

		// clear default content
		this._content.innerHTML = '';



		// // get vars
		// var name = this._account.getName();

		// // create name div
		// var nameWrap = Wu.DomUtil.create('div', 'account-name-wrap', this._content);
		// this._name = Wu.DomUtil.create('div', 'account-name', nameWrap, name);
		
		// // create logout div
		// var logoutWrap = Wu.DomUtil.create('div', 'account-logout-wrap', this._content);
		// this._logoutButton = Wu.DomUtil.create('div', 'account-logout-button', logoutWrap, 'Logout');


		// add tooltip
		app.Tooltip.add(this._menu, 'Logs you out of the portal' );


	},

	addHooks : function () {

		// Wu.DomEvent.on(this._logoutButton, 'mousedown', this._logout, this);

	},

	update : function () {
	},

	_logout : function () {

	},

	// overrides the sidepane menu item button
	_clickActivate : function () {
		if (confirm('Are you sure you want to log out?')) {
			window.location.href = 'https://projects.ruppellsgriffon.com/logout';
		}
	},

});