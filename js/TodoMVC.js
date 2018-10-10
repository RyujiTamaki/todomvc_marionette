/*global Backbone, TodoMVC:true, $ */
import "../node_modules/todomvc-app-css/index.css";
import "../node_modules/todomvc-common/base.css";
import "../css/app.css";

const Mn = require('backbone.marionette');
const Backbone = require('backbone');
const App = require('./TodoMVC.Application');
const Router = require('./TodoMVC.Router');

$(function () {
	'use strict';

	App.on('start', function () {
		const controller = new Router.Controller();
		controller.router = new Router.Router({
			controller: controller
		});

		controller.start();
		Backbone.history.start();
	});

	App.start();
});