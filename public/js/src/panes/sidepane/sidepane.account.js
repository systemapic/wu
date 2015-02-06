Wu.SidePane.Account = Wu.SidePane.Item.extend({
	_ : 'sidepane.account', 


	type : 'account',
	title : 'Logout', // just simple logout button for now

	initContent : function () {
		this._account = app.Account;

		// clear default content
		this._content.innerHTML = '';

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
			window.location.href = app.options.servers.portal + 'logout';
		}
	},

});