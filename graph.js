/* globals console, _ */

/**
 * Main Graph object
 *
 * @constructor
 */
var Graph = function () {
	"use strict";

	// Graph nodes
	this.towns = [];

	// Graph vertices
	this.routes = {};

	// Default error text
	this.noRoute = 'NO SUCH ROUTE';
};

/**
 * Add a town (node) to the main Graph
 *
 * @param town
 */
Graph.prototype.addTown = function (town) {
	"use strict";

	// Add the town, if it does not exist
	if (!this.towns[town]) {
		this.towns.push(town);
	}
};

/**
 * Parse a route string
 */
Graph.prototype.parseRoute = function (route) {
	"use strict";

	return {
		start: route.charAt(0),
		end: route.charAt(1),
		distance: parseInt(route.charAt(2), 10)
	};
};

/**
 * Add a route (vertex) between towns
 */
Graph.prototype.addRoute = function (route) {
	"use strict";

	var parsedRoute = this.parseRoute(route);

	// Add the towns
	this.addTown(parsedRoute.start);
	this.addTown(parsedRoute.end);


	// Create the route object if it does not exist
	if (!this.routes[parsedRoute.start]) {
		this.routes[parsedRoute.start] = {};
	}

	this.routes[parsedRoute.start][parsedRoute.end] = parsedRoute.distance;
};

/**
 * Test to see if a route exists
 * 
 * @param start
 * @param end
 * @returns {boolean}
 */
Graph.prototype.routeExists = function (start, end) {
	"use strict";

	// No starting point so no route
	if (!this.routes[start]) {
		return false;
	}

	// Convert to boolean
	return !!this.routes[start][end];
};

/**
 * Format a trip request
 *
 * @param trip
 */
Graph.prototype.parseTrip = function (trip) {
	"use strict";

	return trip.split('-');
};

/**
 * Calculate the distance between 2 towns, if it exists
 *
 * @param trip
 * @returns {number}
 */
Graph.prototype.calcDistance = function (trip) {
	"use strict";

	var parsedTrip = this.parseTrip(trip);
	var distance = 0;
	var i, start, end;

	// Loop through the trip
	for (i = 0; i < parsedTrip.length - 1; i++) {

		// This trip leg
		start = parsedTrip[i];
		end = parsedTrip[i + 1];

		// Make sure the route exists
		if (!this.routeExists(start, end)) {
			return this.noRoute;
		}

		// Ensure we have a number and add this leg to the total
		distance += parseInt(this.routes[start][end], 10);
	}

	return distance ? distance : this.noRoute;
};

/**
 * Find the number of routes between 2 towns with a maximum number of stops
 *
 * @param start
 * @param end
 * @param stops
 */
Graph.prototype.routeMaxStops = function (start, end, stops) {
	"use strict";

	var graph = this;
	var countRoutes = 0;

	routeIt(start, 0);

	return countRoutes;

	function routeIt(node, countStops) {

		// We have a route and we didn't just start
		if (node === end && countStops) {
			countRoutes++;
		}

		// We've reached the max, break out of the recursion
		if (countStops === stops) {
			return;
		}

		countStops++;

		// Recurse through neighbors
		_.each(Object.keys(graph.routes[node]), function(el) {
			routeIt(el, countStops);
		});

	}
};

/**
 * Find the number of routes between 2 towns with an exact number of stops
 *
 * @param start
 * @param end
 * @param stops
 */
Graph.prototype.routeExactStops = function (start, end, stops) {
	"use strict";

	var graph = this;
	var countRoutes = 0;

	routeIt(start, 0);
	return countRoutes;

	function routeIt(node, countStops) {

		// We reached the stop count given
		if (countStops === stops) {

			// We're at the right node
			if (node === end) {
				countRoutes++;
			}
			return;
		}

		countStops++;

		// Recurse through all neighbors
		_.each(Object.keys(graph.routes[node]), function (el) {
			routeIt(el, countStops);
		});

	}
};

/**
 * Return the shortest route between 2 points
 *
 * @param start
 * @param end
 * @returns {number}
 */
Graph.prototype.routeShortest = function (start, end) {
	"use strict";

	var graph = this;
	var routes = [];

	routeIt(start, '');

	return routes.length ? _.min(routes) : this.noRoute;

	function routeIt(node, seen) {

		// Store this node to build a route and avoid backtracking
		seen += (seen ? '-' : '') + node;

		// If we're at the end and we didn't just start, store the distance and exit out
		if (seen.length > 1 && node === end) {
			routes.push(graph.calcDistance(seen));
			return;
		}

		// Recurse through all neighbors
		_.each(Object.keys(graph.routes[node]), function (el) {

			// Make sure the node is not the end or we haven't seen this node already
			if (el === end || seen.indexOf(el) < 0) {
				routeIt(el, seen);
			}
		});

	}
};

Graph.prototype.routesByDistance = function (start, end, max) {
	"use strict";

	var graph = this;
	var routes = [];

	routeIt(start, '', 0);

	return routes.length;

	function routeIt(node, route, distance) {

		// If we're at the distance maximum, exit out
		if (distance >= max) {
			return;
		}

		// Build the route
		route += node;

		// If we're at the endpoint, store the route
		if (distance && node === end) {
			routes.push(route);
		}

		// Recurse through all neighbors, passing in the newly-calculated distance
		_.each(Object.keys(graph.routes[node]), function (el) {
			routeIt(el, route, distance + parseInt(graph.routes[node][el], 10));
		});

	}
};