/* globals Graph, console, _, alert */

jQuery(document).ready(function ($) {
	"use strict";


	/*
	Initialize graph and store default towns + routes
	*/

	var graph = new Graph();

	// Add default routes
	graph.addRoute('AB5');
	graph.addRoute('BC4');
	graph.addRoute('CD8');
	graph.addRoute('DC8');
	graph.addRoute('DE6');
	graph.addRoute('AD5');
	graph.addRoute('CE2');
	graph.addRoute('EB3');
	graph.addRoute('AE7');


	/*
	Set Routes controls
	*/

	// Initial route rendering
	renderRoutes();

	$('#add-route-form').submit(function (e) {
		e.preventDefault();

		// Cache selectors
		var thisForm = $(this);

		// Input variables
		var start = thisForm.find('#start-town').val();
		var end = thisForm.find('#end-town').val();
		var distance = parseInt(thisForm.find('#distance').val(), 10);

		if (!start || !end || !distance) {
			alert('Need a start, end, and distance.');
		} else {

			// Clear out the fields if the route was added successfully
			if (addRoute(start, end, distance)) {
				thisForm.find('input[type=text], input[type=number]').val('');
			}
		}
	});

	// Display all current routes
	function renderRoutes() {

		// Cache selector
		var routeBox = $('#current-routes');

		// Instantiate added element
		var addEl;

		// Clear out routes currently displaying
		routeBox.html('');

		// Iterate through all routes and display
		// TODO: refactor to avoid O(n^2) condition
		_.each(Object.keys(graph.routes), function (start) {
			_.each(Object.keys(graph.routes[start]), function (end) {
				addEl = $('<li/>').text(start + end + graph.routes[start][end]).addClass('stand-out');
				routeBox.append(addEl);
			});
		});
	}

	// Add a route to the graph
	function addRoute(start, end, distance) {

		// Route already exists, don't add it
		if (graph.routes[start] && graph.routes[start][end]) {
			alert('Route already exists.');
			return false;

		// New route, add to the graph and display all current routes
		} else {
			graph.addRoute(start + end + distance);
			renderRoutes();
			return true;
		}

	}


	/*
	Calculation controls
	*/

	$('#route-distance-form').submit(function (e) {
		e.preventDefault();

		// Cache selectors
		var thisForm = $(this);
		var resultTarget = thisForm.find('#calc-distance-result');

		// Input variable
		var route = thisForm.find('#calc-distance-route').val();

		if (!route) {
			alert('Need a route.');
		} else {
			var resultText = graph.calcDistance(route);
			resultTarget.text(resultText);
			if (resultText === graph.noRoute) {
				resultTarget.addClass('error');
			} else {
				resultTarget.removeClass('error');
			}
		}
	});


	$('#routes-by-stops').submit(function (e) {
		e.preventDefault();

		// Cache selectors
		var thisForm = $(this);
		var resultTarget = thisForm.find('#calc-route-stops-result');

		// Input variables
		var start = thisForm.find('#start-town-stops').val();
		var end = thisForm.find('#end-town-stops').val();
		var stops = parseInt(thisForm.find('#number-stops').val(), 10);
		var exact = !!thisForm.find('#exact-stops').prop('checked');

		if (!start || !end || !stops) {
			alert('Need a start, end, and number of stops.');
		} else {
			var resultText;
			if (exact) {
				resultText = graph.routeExactStops(start, end, stops);
			} else {
				resultText = graph.routeMaxStops(start, end, stops);
			}
			resultTarget.text(resultText);
		}
	});


	$('#route-shortest').submit(function (e) {
		e.preventDefault();

		// Cache selectors
		var thisForm = $(this);
		var resultTarget = thisForm.find('#calc-shortest-result');

		// Input variables
		var start = thisForm.find('#calc-shortest-start').val();
		var end = thisForm.find('#calc-shortest-end').val();

		if (!start || !end) {
			alert('Need a start and end.');
		} else {
			var resultText = graph.routeShortest(start, end);
			resultTarget.text(resultText);
			if (resultText === graph.noRoute) {
				resultTarget.addClass('error');
			} else {
				resultTarget.removeClass('error');
			}
		}
	});


	$('#routes-by-distance').submit(function (e) {
		e.preventDefault();

		// Cache selectors
		var thisForm = $(this);
		var resultTarget = thisForm.find('#calc-route-distance-result');

		// Input variables
		var start = thisForm.find('#start-town-distance').val();
		var end = thisForm.find('#end-town-distance').val();
		var distance = parseInt(thisForm.find('#max-distance').val(), 10);

		if (!start || !end || !distance) {
			alert('Need a start, end, and distance.');
		} else {
			var resultText = graph.routesByDistance(start, end, distance);
			resultTarget.text(resultText);
		}
	});
});