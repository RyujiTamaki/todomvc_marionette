const Mn = require('backbone.marionette');
const Backbone = require('backbone');
const Radio = require('backbone.radio');
const App = require('./TodoMVC.Application');
const Layout = require('./TodoMVC.Layout');
const Todos = require('./TodoMVC.Todos');
const TodoView = require('./TodoMVC.TodoList.Views');
const Filter = require('./TodoMVC.FilterState');
const filterChannel = Backbone.Radio.channel('filter');

'use strict';

// TodoList Router
// ---------------
//
// Handles a single dynamic route to show
// the active vs complete todo items
module.exports.Router = Mn.AppRouter.extend({
	appRoutes: {
		'*filter': 'filterItems'
	}
});

// TodoList Controller (Mediator)
// ------------------------------
//
// Control the workflow and logic that exists at the application
// level, above the implementation detail of views and models
module.exports.Controller = Mn.Object.extend({

	initialize: function () {
		this.todoList = new Todos.TodoList();
	},

	// Start the app by showing the appropriate views
	// and fetching the list of todo items, if there are any
	start: function () {
		this.showHeader(this.todoList);
		this.showFooter(this.todoList);
		this.showTodoList(this.todoList);
		this.todoList.on('all', this.updateHiddenElements, this);
		this.todoList.fetch();
	},

	updateHiddenElements: function () {
		$('#main, #footer').toggle(!!this.todoList.length);
	},

	showHeader: function (todoList) {
		const header = new Layout.HeaderLayout({
			collection: todoList
		});
		App.root.showChildView('header', header);
	},

	showFooter: function (todoList) {
		const footer = new Layout.FooterLayout({
			collection: todoList
		});
		App.root.showChildView('footer', footer);
	},

	showTodoList: function (todoList) {
		App.root.showChildView('main', new TodoView.ListView({
			collection: todoList
		}));
	},

	// Set the filter to show complete or all items
	filterItems: function (filter) {
		const newFilter = filter && filter.trim() || 'all';
		filterChannel.request('filterState').set('filter', newFilter);
	}
});
