/*global TodoMVC: true, Backbone */

const Mn = require('backbone.marionette');
const Backbone = require('backbone');
const Radio = require('backbone.radio');
const Filter = require('./TodoMVC.FilterState');

'use strict';

const filterChannel = Backbone.Radio.channel('filter');

// Todo List Item View
// -------------------
//
// Display an individual todo item, and respond to changes
// that are made to the item, including marking completed.
const TodoView = Mn.View.extend({

	tagName: 'li',

	template: '#template-todoItemView',

	className: function () {
		return this.model.get('completed') ? 'completed' : 'active';
	},

	ui: {
		edit: '.edit',
		destroy: '.destroy',
		label: 'label',
		toggle: '.toggle'
	},

	events: {
		'click @ui.destroy': 'deleteModel',
		'dblclick @ui.label': 'onEditClick',
		'keydown @ui.edit': 'onEditKeypress',
		'focusout @ui.edit': 'onEditFocusout',
		'click @ui.toggle': 'toggle'
	},

	modelEvents: {
		change: 'render'
	},

	deleteModel: function () {
		this.model.destroy();
	},

	toggle: function () {
		this.model.toggle().save();
	},

	onEditClick: function () {
		this.$el.addClass('editing');
		this.ui.edit.focus();
		this.ui.edit.val(this.ui.edit.val());
	},

	onEditFocusout: function () {
		const todoText = this.ui.edit.val().trim();
		if (todoText) {
			this.model.set('title', todoText).save();
			this.$el.removeClass('editing');
		} else {
			this.destroy();
		}
	},

	onEditKeypress: function (e) {
		const ENTER_KEY = 13;
		const ESC_KEY = 27;

		if (e.which === ENTER_KEY) {
			this.onEditFocusout();
			return;
		}

		if (e.which === ESC_KEY) {
			this.ui.edit.val(this.model.get('title'));
			this.$el.removeClass('editing');
		}
	}
});

// Item List View Body
// --------------
//
// Controls the rendering of the list of items, including the
// filtering of items for display.
const ListViewBody = Mn.CollectionView.extend({
	tagName: 'ul',

	className: 'todo-list',

	childView: TodoView,

	filter: function (child) {
		const filteredOn = filterChannel.request('filterState').get('filter');
		return child.matchesFilter(filteredOn);
	}
});

// Item List View
// --------------
//
// Manages List View
module.exports.ListView = Mn.View.extend({

	template: '#template-todoListView',

	regions: {
		listBody: {
			el: 'ul',
			replaceElement: true
		}
	},

	ui: {
		toggle: '.toggle-all'
	},

	events: {
		'click @ui.toggle': 'onToggleAllClick'
	},

	collectionEvents: {
		'change:completed': 'render',
		all: 'setCheckAllState'
	},

	initialize: function () {
		this.listenTo(filterChannel.request('filterState'), 'change:filter', this.render, this);
	},

	setCheckAllState: function () {
		function reduceCompleted(left, right) {
			return left && right.get('completed');
		}

		const allCompleted = this.collection.reduce(reduceCompleted, true);
		this.ui.toggle.prop('checked', allCompleted);
		this.$el.parent().toggle(!!this.collection.length);
	},

	onToggleAllClick: function (e) {
		const isChecked = e.currentTarget.checked;

		this.collection.each(function (todo) {
			todo.save({ completed: isChecked });
		});
	},

	onRender: function () {
		this.showChildView('listBody', new ListViewBody({
			collection: this.collection
		}));
	}
});