/*global Backbone, TodoMVC:true */

const Mn = require('backbone.marionette');
const Backbone = require('backbone');
const Layout = require('./TodoMVC.Layout');

'use strict';

const TodoApp = Mn.Application.extend({
	setRootLayout: function () {
		this.root = new Layout.RootLayout();
	}
});

// The Application Object is responsible for kicking off
// a Marionette application when its start function is called
//
// This application has a singler root Layout that is attached
// before it is started.  Other system components can listen
// for the application start event, and perform initialization
// on that event
const app = new TodoApp();

app.on('before:start', function () {
	app.setRootLayout();
});

module.exports = app;