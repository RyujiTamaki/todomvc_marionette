/*global TodoMVC:true, Backbone */

const Mn = require('backbone.marionette');
const Backbone = require('backbone');
const Radio = require('backbone.radio');
const Handlebars = require('handlebars');
const Filter = require('./TodoMVC.FilterState');
const TempleteHeader = require('../hbs/template-header.hbs');
const TemplateFooter = require('../hbs/template-footer.hbs');

'use strict';

const filterChannel = Backbone.Radio.channel('filter');

module.exports.RootLayout = Mn.View.extend({

	el: '.todoapp',

	regions: {
		header: '.header',
		main: '.main',
		footer: '.footer'
	}
});

// Layout Header View
// ------------------
module.exports.HeaderLayout = Mn.View.extend({

	template: TempleteHeader,

	// UI bindings create cached attributes that
	// point to jQuery selected objects
	ui: {
		input: '.new-todo'
	},

	events: {
		'keypress @ui.input': 'onInputKeypress',
		'keyup @ui.input': 'onInputKeyup'
	},

	// According to the spec
	// If escape is pressed during the edit, the edit state should be left and any changes be discarded.
	onInputKeyup: function (e) {
		const ESC_KEY = 27;

		if (e.which === ESC_KEY) {
			this.render();
		}
	},

	onInputKeypress: function (e) {
		const ENTER_KEY = 13;
		const todoText = this.ui.input.val().trim();

		if (e.which === ENTER_KEY && todoText) {
			this.collection.create({
				title: todoText
			});
			this.ui.input.val('');
		}
	}
});

// Layout Footer View
// ------------------
module.exports.FooterLayout = Mn.View.extend({
	template: TemplateFooter,

	// UI bindings create cached attributes that
	// point to jQuery selected objects
	ui: {
		filters: '.filters a',
		completed: '.completed a',
		active: '.active a',
		all: '.all a',
		summary: '.todo-count',
		clear: '.clear-completed'
	},

	events: {
		'click @ui.clear': 'onClearClick'
	},

	collectionEvents: {
		all: 'render'
	},

	initialize: function () {
		this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
	},

	serializeData: function () {
		const active = this.collection.getActive().length;
		const total = this.collection.length;
		const activeCountLabel = (this.activeCount === 1 ? 'item' : 'items') + ' left';

		return {
			activeCount: active,
			totalCount: total,
			completedCount: total - active,
			activeCountLabel: activeCountLabel
		};
	},

	onRender: function () {
		this.$el.parent().toggle(this.collection.length > 0);
		this.updateFilterSelection();
	},

	updateFilterSelection: function () {
		this.ui.filters.removeClass('selected');
		this.ui[filterChannel.request('filterState').get('filter')]
		.addClass('selected');
	},

	onClearClick: function () {
		const completed = this.collection.getCompleted();
		completed.forEach(function (todo) {
			todo.destroy();
		});
	}
});