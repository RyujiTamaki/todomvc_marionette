const Backbone = require('backbone');
const Radio = require('backbone.radio');

'use strict';

const filterState = new Backbone.Model({
	filter: 'all'
});

const filterChannel = Radio.channel('filter');
filterChannel.reply('filterState', function () {
	return filterState;
});