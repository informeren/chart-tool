/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart Tool
	 * @author Jeremy Agius <jagius@globeandmail.com>
	 * @author Tom Cardoso <tcardoso@globeandmail.com>
	 * @author Michael Pereira <mpereira@globeandmail.com>
	 * @see {@link} for further information.
	 * @see {@link http://www.github.com/globeandmail/chart-tool|Chart Tool}
	 * @license MIT
	 */
	
	(function ChartToolInit(root) {
	
	  if (root.d3) {
	
	    var ChartTool = (function ChartTool() {
	
	      var charts = root.__charttool || [],
	          dispatchFunctions = root.__charttooldispatcher || [],
	          drawn = [];
	
	      var settings = __webpack_require__(1),
	          utils = __webpack_require__(4);
	
	      var dispatcher = d3.dispatch("start", "finish", "redraw", "mouseOver", "mouseMove", "mouseOut", "click");
	
	      for (var prop in dispatchFunctions) {
	        if (dispatchFunctions.hasOwnProperty(prop)) {
	          if (d3.keys(dispatcher).indexOf(prop) > -1) {
	            dispatcher.on(prop, dispatchFunctions[prop]);
	          } else {
	            throw "Chart Tool does not offer a dispatcher of type '" + prop + "'. For available dispatcher types, please see the ChartTool.dispatch() method." ;
	          }
	        }
	      }
	
	      /**
	       * Clears previous iterations of chart objects stored in obj or the drawn array, then punts chart construction to the Chart Manager.
	       * @param  {String} container A string representing the container's selector.
	       * @param  {Object} obj       The chart ID and embed data.
	       */
	      function createChart(container, obj) {
	
	        dispatcher.start(obj);
	
	        drawn = utils.clearDrawn(drawn, obj);
	        obj = utils.clearObj(obj);
	        container = utils.clearChart(container);
	
	        var ChartManager = __webpack_require__(9);
	
	        obj.data.width = utils.getBounding(container, "width");
	        obj.dispatch = dispatcher;
	
	        var chartObj;
	
	        if (utils.svgTest(root)) {
	          chartObj = ChartManager(container, obj);
	        } else {
	          utils.generateThumb(container, obj, settings);
	        }
	
	        drawn.push({ id: obj.id, chartObj: chartObj });
	        obj.chartObj = chartObj;
	
	        d3.select(container)
	          .on("click", function() { dispatcher.click(this, chartObj); })
	          .on("mouseover", function() { dispatcher.mouseOver(this, chartObj); })
	          .on("mousemove", function() { dispatcher.mouseMove(this, chartObj);  })
	          .on("mouseout", function() { dispatcher.mouseOut(this, chartObj); });
	
	        dispatcher.finish(chartObj);
	
	      }
	
	      /**
	       * Grabs data on a chart based on an ID.
	       * @param {Array} charts Array of charts on the page.
	       * @param  {String} id The ID for the chart.
	       * @return {Object}    Returns stored embed object.
	       */
	      function readChart(id) {
	        for (var i = 0; i < charts.length; i++) {
	           if (charts[i].id === id) {
	            return charts[i];
	          }
	        };
	      }
	
	      /**
	       * List all the charts stored in the Chart Tool by chartid.
	       * @param {Array} charts Array of charts on the page.
	       * @return {Array}       List of chartid's.
	       */
	      function listCharts(charts) {
	        var chartsArr = [];
	        for (var i = 0; i < charts.length; i++) {
	          chartsArr.push(charts[i].id);
	        };
	        return chartsArr;
	      }
	
	      function updateChart(id, obj) {
	        var container = '.' + settings.baseClass() + '[data-chartid=' + settings.prefix + id + ']';
	        createChart(container, { id: id, data: obj });
	      }
	
	      function destroyChart(id) {
	        var container, obj;
	        for (var i = 0; i < charts.length; i++) {
	          if (charts[i].id === id) {
	            obj = charts[i];
	          }
	        };
	        container = '.' + settings.baseClass() + '[data-chartid=' + obj.id + ']';
	        utils.clearDrawn(drawn, obj);
	        utils.clearObj(obj);
	        utils.clearChart(container);
	      }
	
	      /**
	       * Iterate over all the charts, draw each chart into its respective container.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function createLoop(charts) {
	        var chartList = listCharts(charts);
	        for (var i = 0; i < chartList.length; i++) {
	          var obj = readChart(chartList[i]);
	          var container = '.' + settings.baseClass() + '[data-chartid=' + chartList[i] + ']';
	          createChart(container, obj);
	        };
	      }
	
	      /**
	       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function initializer(charts) {
	        createLoop(charts);
	        var debounce = utils.debounce(createLoop, charts, settings.debounce, root);
	        d3.select(root)
	          .on('resize.' + settings.prefix + 'debounce', debounce)
	          .on('resize.' + settings.prefix + 'redraw', dispatcher.redraw(charts));
	      }
	
	      return {
	
	        init: function init() {
	          return initializer(charts);
	        },
	
	        create: function create(container, obj) {
	          return createChart(container, obj);
	        },
	
	        read: function read(id) {
	          return readChart(id);
	        },
	
	        list: function list() {
	          return listCharts(charts);
	        },
	
	        update: function update(id, obj) {
	          return updateChart(id, obj);
	        },
	
	        destroy: function destroy(id) {
	          return destroyChart(id);
	        },
	
	        dispatch: function dispatch() {
	          return d3.keys(dispatcher);
	        },
	
	        wat: function wat() {
	          console.info("ChartTool v" + settings.version + " is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: www.github.com/globeandmail/chart-tool");
	        },
	
	        version: settings.version,
	        build: settings.build,
	        settings: __webpack_require__(1),
	        charts: __webpack_require__(9),
	        components: __webpack_require__(10),
	        helpers: __webpack_require__(8),
	        utils: __webpack_require__(4),
	        line: __webpack_require__(15),
	        area: __webpack_require__(19),
	        multiline: __webpack_require__(18),
	        stackedArea: __webpack_require__(20),
	        column: __webpack_require__(21),
	        stackedColumn: __webpack_require__(23),
	        streamgraph: __webpack_require__(24),
	        bar: __webpack_require__(22)
	
	      }
	
	    })();
	
	    if (!root.Meteor) { ChartTool.init(); }
	
	  } else {
	
	    var Meteor = this.Meteor || {},
	        isServer = Meteor.isServer || undefined;
	
	    if (!isServer) {
	      console.error("Chart Tool: no D3 library detected.");
	    }
	
	
	  }
	
	  root.ChartTool = ChartTool;
	
	})(typeof window !== "undefined" ? window : this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var version = {
	  version: __webpack_require__(2).version,
	  build: __webpack_require__(2).buildver
	};
	
	var settings = __webpack_require__(3);
	
	module.exports = {
	
	  CUSTOM: settings.CUSTOM,
	  version: version.version,
	  build: version.build,
	  id: "",
	  data: "",
	  dateFormat: settings.dateFormat,
	  timeFormat: settings.timeFormat,
	  image: settings.image,
	  heading: "",
	  qualifier: "",
	  source: "",
	  deck: "",
	  index: "",
	  hasHours: false,
	  social: settings.social,
	  seriesHighlight: function() {
	    if (this.data.seriesAmount && this.data.seriesAmount <= 1) {
	      return 1;
	    } else {
	      return 0;
	    }
	  },
	  baseClass: function() { return this.prefix + "chart"; },
	  customClass: "",
	
	  options: {
	    type: "line",
	    interpolation: "linear",
	    stacked: false,
	    expanded: false,
	    head: true,
	    deck: false,
	    qualifier: true,
	    legend: true,
	    footer: true,
	    x_axis: true,
	    y_axis: true,
	    tips: false,
	    annotations: false,
	    range: false,
	    series: false,
	    share_data: true,
	    social: true
	  },
	
	  range: {},
	  series: {},
	  xAxis: settings.xAxis,
	  yAxis: settings.yAxis,
	
	  exportable: false, // this can be overwritten by the backend as needed
	  editable: false,
	
	  prefix: settings.prefix,
	  debounce: settings.debounce,
	  tipTimeout: settings.tipTimeout,
	  monthsAbr: settings.monthsAbr,
	
	  dimensions: {
	    width: 0,
	    computedWidth: function() {
	      return this.width - this.margin.left - this.margin.right;
	    },
	    height: function() {
	      var ratioScale = d3.scale.linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
	      return Math.round(ratioScale(this.width));
	    },
	    computedHeight: function() {
	      return (this.height() - this.headerHeight - this.footerHeight - this.margin.top - this.margin.bottom);
	    },
	    ratioMobile: settings.ratioMobile,
	    ratioDesktop: settings.ratioDesktop,
	    margin: settings.margin,
	    tipPadding: settings.tipPadding,
	    tipOffset: settings.tipOffset,
	    headerHeight: 0,
	    footerHeight: 0,
	    xAxisHeight: 0,
	    yAxisHeight: function() {
	      return (this.computedHeight() - this.xAxisHeight);
	    },
	    xAxisWidth: 0,
	    labelWidth: 0,
	    yAxisPaddingRight: settings.yAxis.paddingRight,
	    tickWidth: function() {
	      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
	    },
	    barHeight: settings.barHeight,
	    bands: {
	      padding: settings.bands.padding,
	      offset: settings.bands.offset,
	      outerPadding: settings.bands.outerPadding
	    }
	  }
	
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		"name": "chart-tool",
		"version": "1.1.0",
		"buildVer": "5",
		"description": "A responsive charting application",
		"main": "gulpfile.js",
		"dependencies": {},
		"devDependencies": {
			"browser-sync": "^2.8.0",
			"gulp": "^3.8.11",
			"gulp-clean": "^0.3.1",
			"gulp-json-editor": "^2.2.1",
			"gulp-minify-css": "^1.2.0",
			"gulp-rename": "^1.2.2",
			"gulp-replace": "^0.5.3",
			"gulp-sass": "^2.0.4",
			"gulp-shell": "^0.4.2",
			"gulp-sourcemaps": "^1.5.2",
			"gulp-util": "^3.0.6",
			"jsdoc": "^3.3.2",
			"json-loader": "^0.5.3",
			"run-sequence": "^1.1.4",
			"webpack": "^1.12.14",
			"webpack-stream": "^3.1.0",
			"yargs": "^3.15.0"
		},
		"scripts": {
			"test": ""
		},
		"keywords": [
			"charts",
			"d3",
			"d3js",
			"meteor",
			"gulp",
			"webpack",
			"data visualization",
			"chart",
			"mongo"
		],
		"repository": {
			"type": "git",
			"url": "git@github.com:globeandmail/chart-tool.git"
		},
		"contributors": [
			{
				"author": "Tom Cardoso",
				"email": "tcardoso@globeandmail.com"
			},
			{
				"author": "Jeremy Agius",
				"email": "jagius@globeandmail.com"
			},
			{
				"author": "Michael Pereira",
				"email": "mpereira@globeandmail.com"
			}
		],
		"license": "MIT"
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
		"CUSTOM": false,
		"prefix": "ct-",
		"monthsAbr": [
			"Jan.",
			"Feb.",
			"Mar.",
			"Apr.",
			"Maj",
			"Juni",
			"Juli",
			"Aug.",
			"Sept.",
			"Okt.",
			"Nov.",
			"Dec.",
			"Jan."
		],
		"debounce": 500,
		"tipTimeout": 5000,
		"ratioMobile": 1.15,
		"ratioDesktop": 0.65,
		"dateFormat": "%Y-%m-%d",
		"timeFormat": "%H:%M",
		"margin": {
			"top": 10,
			"right": 3,
			"bottom": 0,
			"left": 0
		},
		"tipOffset": {
			"vertical": 4,
			"horizontal": 1
		},
		"tipPadding": {
			"top": 4,
			"right": 9,
			"bottom": 4,
			"left": 9
		},
		"yAxis": {
			"display": true,
			"scale": "linear",
			"ticks": "auto",
			"orient": "right",
			"format": "comma",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": true,
			"paddingRight": 9,
			"tickLowerBound": 3,
			"tickUpperBound": 8,
			"tickGoal": 5,
			"widthThreshold": 420,
			"dy": "",
			"textX": 0,
			"textY": ""
		},
		"xAxis": {
			"display": true,
			"scale": "time",
			"ticks": "auto",
			"orient": "bottom",
			"format": "auto",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": false,
			"rangePoints": 1,
			"tickTarget": 6,
			"ticksSmall": 4,
			"widthThreshold": 420,
			"dy": 0.7,
			"barOffset": 9,
			"upper": {
				"tickHeight": 7,
				"textX": 6,
				"textY": 7
			},
			"lower": {
				"tickHeight": 12,
				"textX": 6,
				"textY": 2
			}
		},
		"barHeight": 30,
		"bands": {
			"padding": 0.06,
			"offset": 0.12,
			"outerPadding": 0.03
		},
		"source": {
			"prefix": "INFORMATION.DK",
			"suffix": " > KILDE:"
		},
		"social": {
			"facebook": {
				"label": "Facebook",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg",
				"redirect": "",
				"appID": ""
			},
			"twitter": {
				"label": "Twitter",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg",
				"via": "",
				"hashtag": ""
			},
			"email": {
				"label": "Email",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"
			},
			"sms": {
				"label": "SMS",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"
			}
		},
		"image": {
			"enable": false,
			"base_path": "",
			"expiration": 30000,
			"filename": "thumbnail",
			"extension": "png",
			"thumbnailWidth": 460
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Utilities module. Functions that aren't specific to any one module.
	 * @module utils/utils
	 */
	
	/**
	 * Given a function to perform, a timeout period, a parameter to pass to the performed function, and a reference to the window, fire a specific function.
	 * @param  {Function} fn      Function to perform on debounce.
	 * @param  {Object} obj      Object passed to Function which is performed on debounce.
	 * @param  {Integer}   timeout Timeout period in milliseconds.
	 * @param  {Object}   root    Window object.
	 * @return {Function}           Final debounce function.
	 */
	function debounce(fn, obj, timeout, root) {
	  var timeoutID = -1;
	  return function() {
	    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
	    timeoutID = root.setTimeout(function(){
	      fn(obj)
	    }, timeout);
	  }
	};
	
	/**
	 * Remove chart SVG and divs inside a container from the DOM.
	 * @param  {String} container
	 */
	function clearChart(container) {
	
	  var cont = document.querySelector(container);
	
	  while (cont && cont.querySelectorAll("svg").length) {
	    var svg = cont.querySelectorAll("svg");
	    svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
	  }
	
	  while (cont && cont.querySelectorAll("div").length) {
	    var div = cont.querySelectorAll("div");
	    div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
	  }
	
	  return container;
	}
	
	/**
	 * Clears the chart data of its post-render chartObj object.
	 * @param  {Object} obj Object used to construct charts.
	 * @return {Object}     The new version of the object.
	 */
	function clearObj(obj) {
	  if (obj.chartObj) { obj.chartObj = undefined; }
	  return obj;
	}
	
	/**
	 * Clears the drawn array.
	 * @param  {Array} drawn
	 * @param  {Object} obj
	 * @return {Array}
	 */
	function clearDrawn(drawn, obj) {
	  if (drawn.length) {
	    for (var i = drawn.length - 1; i >= 0; i--) {
	      if (drawn[i].id === obj.id) {
	        drawn.splice(i, 1);
	      }
	    };
	  }
	
	  return drawn;
	}
	
	/**
	 * Get the boundingClientRect dimensions given a selector.
	 * @param  {String} container
	 * @return {Object}           The boundingClientRect object.
	 */
	function getBounding(selector, dimension) {
	  return document.querySelector(selector).getBoundingClientRect()[dimension];
	}
	
	/**
	 * Basic factory for figuring out amount of milliseconds in a given time period.
	 */
	function TimeObj() {
	  this.sec = 1000;
	  this.min = this.sec * 60;
	  this.hour = this.min * 60;
	  this.day = this.hour * 24;
	  this.week = this.day * 7;
	  this.month = this.day * 30;
	  this.year = this.day * 365;
	}
	
	/**
	 * Slightly altered Bostock magic to wrap SVG <text> nodes based on available width
	 * @param  {Object} text    D3 text selection.
	 * @param  {Integer} width
	 */
	function wrapText(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.0, // ems
	        x = 0,
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", dy + "em");
	
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", ++lineNumber * lineHeight + dy + "em")
	          .text(word);
	      }
	    }
	  });
	}
	
	/**
	 * Given two dates date and a tolerance level, return a time "context" for the difference between the two values.
	 * @param  {Object} d1     Beginning date object.
	 * @param  {Object} d2     End date object.
	 * @param  {Integer} tolerance
	 * @return {String}           The resulting time context.
	 */
	function timeDiff(d1, d2, tolerance) {
	
	  var diff = d2 - d1,
	      time = new TimeObj();
	
	  // returning the context
	  if ((diff / time.year) > tolerance) { return "years"; }
	  else if ((diff / time.month) > tolerance) { return "months"; }
	  else if ((diff / time.week) > tolerance) { return "weeks"; }
	  else if ((diff / time.day) > tolerance) { return "days"; }
	  else if ((diff / time.hour) > tolerance) { return "hours"; }
	  else if ((diff / time.min) > tolerance) { return "minutes"; }
	  else { return "days"; }
	  // if none of these work i feel bad for you son
	  // i've got 99 problems but an if/else ain"t one
	
	}
	
	/**
	 * Given a dataset, figure out what the time context is and
	 * what the number of time units elapsed is
	 * @param  {Array} data
	 * @return {Integer}
	 */
	function timeInterval(data) {
	
	  var dataLength = data.length,
	      d1 = data[0].key,
	      d2 = data[dataLength - 1].key;
	
	  var ret;
	
	  var intervals = [
	    { type: "years", step: 1 },
	    { type: "months", step: 3 }, // quarters
	    { type: "months", step: 1 },
	    { type: "days", step: 1 },
	    { type: "hours", step: 1 },
	    { type: "minutes", step: 1 }
	  ];
	
	  for (var i = 0; i < intervals.length; i++) {
	    var intervalCandidate = d3.time[intervals[i].type](d1, d2, intervals[i].step).length;
	    if (intervalCandidate >= dataLength - 1) {
	      var ret = intervalCandidate;
	      break;
	    }
	  };
	
	  return ret;
	
	}
	
	/**
	 * Returns the transform position of an element as an array
	 * @param  {Object} node
	 * @return {Array}
	 */
	function getTranslateXY(node) {
	  return d3.transform(d3.select(node).attr("transform")).translate;
	}
	
	/**
	 * Returns a translate statement because it's annoying to type out
	 * @return {String}
	 */
	function translate(x, y) {
	    return "translate(" + x + ", " + y + ")";
	}
	
	/**
	 * Tests for SVG support, taken from https://github.com/viljamis/feature.js/
	 * @param  {Object} root A reference to the browser window object.
	 * @return {Boolean}
	 */
	function svgTest(root) {
	  return !!root.document && !!root.document.createElementNS && !!root.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
	}
	
	/**
	 * Constructs the AWS URL for a given chart ID.
	 * @param  {Object} obj
	 * @return {String}
	 */
	function getThumbnailPath(obj) {
	  var imgSettings = obj.image;
	
	  imgSettings.bucket = __webpack_require__(5);
	
	  var id = obj.id.replace(obj.prefix, "");
	
	  return "https://s3.amazonaws.com/" + imgSettings.bucket + "/" + imgSettings.base_path + id + "/" + imgSettings.filename + "." + imgSettings.extension;
	}
	
	/**
	 * Given a chart object and container, generate and append a thumbnail
	 */
	function generateThumb(container, obj, settings) {
	
	  var imgSettings = settings.image;
	
	  var cont = document.querySelector(container),
	      fallback = cont.querySelector("." + settings.prefix + "base64img");
	
	  if (imgSettings && imgSettings.enable && obj.data.id) {
	
	    var img = document.createElement('img');
	
	    img.setAttribute('src', getThumbnailPath(obj));
	    img.setAttribute('alt', obj.data.heading);
	    img.setAttribute('class', settings.prefix + "thumbnail");
	
	    cont.appendChild(img);
	
	  } else if (fallback) {
	
	    fallback.style.display = 'block';
	
	  }
	
	}
	
	function csvToTable(target, data) {
	  var parsedCSV = d3.csv.parseRows(data);
	
	  target.append("table").selectAll("tr")
	    .data(parsedCSV).enter()
	    .append("tr").selectAll("td")
	    .data(function(d) { return d; }).enter()
	    .append("td")
	    .text(function(d) { return d; });
	}
	
	module.exports = {
	  debounce: debounce,
	  clearChart: clearChart,
	  clearObj: clearObj,
	  clearDrawn: clearDrawn,
	  getBounding: getBounding,
	  TimeObj: TimeObj,
	  wrapText: wrapText,
	  timeDiff: timeDiff,
	  timeInterval: timeInterval,
	  getTranslateXY: getTranslateXY,
	  translate: translate,
	  svgTest: svgTest,
	  getThumbnailPath: getThumbnailPath,
	  generateThumb: generateThumb,
	  csvToTable: csvToTable,
	  dataParse: __webpack_require__(6),
	  factory: __webpack_require__(7)
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// s3_bucket is defined in webpack.config.js
	module.exports = (undefined);


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
	 * @module utils/dataparse
	 * @see module:utils/factory
	 */
	
	/**
	 * Determines whether a scale returns an input date or not.
	 * @param  {String} scaleType      The type of scale.
	 * @param  {String} defaultFormat  Format set by the chart tool settings.
	 * @param  {String} declaredFormat Format passed by the chart embed code, if there is one
	 * @return {String|Undefined}
	 */
	function inputDate(scaleType, defaultFormat, declaredFormat) {
	
	  if (scaleType === "time" || scaleType === "ordinal-time") {
	    return declaredFormat || defaultFormat;
	  } else {
	    return undefined;
	  }
	
	}
	
	/**
	 * Parses a CSV string using d3.csv.parse() and turns it into an array of objects.
	 * @param  {String} csv             CSV string to be parsed
	 * @param  {String inputDateFormat Date format in D3 strftime style, if there is one
	 * @param  {String} index           Value to index the data to, if there is one
	 * @return { {csv: String, data: Array, seriesAmount: Integer, keys: Array} }                 An object with the original CSV string, the newly-formatted data, the number of series in the data and an array of keys used.
	 */
	function parse(csv, inputDateFormat, index, stacked, type) {
	
	  var keys, val;
	
	  var firstVals = {};
	
	  var data = d3.csv.parse(csv, function(d, i) {
	
	    var obj = {};
	
	    if (i === 0) { keys = d3.keys(d); }
	
	    if (inputDateFormat) {
	      var dateFormat = d3.time.format(inputDateFormat);
	      obj.key = dateFormat.parse(d3.values(d)[0]);
	    } else {
	      obj.key = d3.values(d)[0];
	    }
	
	    obj.series = [];
	
	    for (var j = 1; j < d3.keys(d).length; j++) {
	
	      var key = d3.keys(d)[j];
	
	      if (d[key] === 0 || d[key] === "") {
	        d[key] = "__undefined__";
	      }
	
	      if (index) {
	
	        if (i === 0 && !firstVals[key]) {
	          firstVals[key] = d[key];
	        }
	
	        if (index === "0") {
	          val = ((d[key] / firstVals[key]) - 1) * 100;
	        } else {
	          val = (d[key] / firstVals[key]) * index;
	        }
	
	      } else {
	        val = d[key];
	      }
	
	      obj.series.push({
	        val: val,
	        key: key
	      });
	
	    }
	
	    return obj;
	
	  });
	
	  var seriesAmount = data[0].series.length;
	
	  if (stacked) {
	    if (type === "stream") {
	      var stack = d3.layout.stack().offset("silhouette");
	    } else {
	      var stack = d3.layout.stack();
	    }
	    var stackedData = stack(d3.range(seriesAmount).map(function(key) {
	      return data.map(function(d) {
	        return {
	          legend: keys[key + 1],
	          x: d.key,
	          y: Number(d.series[key].val),
	          raw: d
	        };
	      });
	    }));
	  }
	
	  return {
	    csv: csv,
	    data: data,
	    seriesAmount: seriesAmount,
	    keys: keys,
	    stackedData: stackedData || undefined
	  }
	}
	
	module.exports = {
	  inputDate: inputDate,
	  parse: parse
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Recipe factor factory module.
	 * @module utils/factory
	 * @see module:charts/index
	 */
	
	/**
	 * Given a "recipe" of settings for a chart, patch it with an object and parse the data for the chart.
	 * @param {Object} settings
	 * @param {Object} obj
	 * @return {Object} The final chart recipe.
	 */
	function RecipeFactory(settings, obj) {
	  var dataParse = __webpack_require__(6);
	  var helpers = __webpack_require__(8);
	
	  var t = helpers.extend(settings); // short for template
	
	  var embed = obj.data;
	  var chart = embed.chart;
	
	  // I'm not a big fan of indenting stuff like this
	  // (looking at you, Pereira), but I'm making an exception
	  // in this case because my eyes were bleeding.
	
	  t.dispatch         = obj.dispatch;
	
	  t.version          = embed.version                          || t.version;
	  t.id               = obj.id                                 || t.id;
	  t.heading          = embed.heading                          || t.heading;
	  t.qualifier        = embed.qualifier                        || t.qualifier;
	  t.source           = embed.source                           || t.source;
	  t.deck             = embed.deck                             || t.deck
	  t.customClass      = chart.class                            || t.customClass;
	
	  t.xAxis            = helpers.extend(t.xAxis, chart.x_axis)  || t.xAxis;
	  t.yAxis            = helpers.extend(t.yAxis, chart.y_axis)  || t.yAxis;
	
	  var o = t.options,
	      co = chart.options;
	
	  //  "options" area of embed code
	  o.type             = chart.options.type                     || o.type;
	  o.interpolation    = chart.options.interpolation            || o.interpolation;
	
	  o.social      = !helpers.isUndefined(co.social) === true ? co.social           : o.social;
	  o.share_data   = !helpers.isUndefined(co.share_data) === true ? co.share_data  : o.share_data;
	  o.stacked     = !helpers.isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
	  o.expanded    = !helpers.isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
	  o.head        = !helpers.isUndefined(co.head) === true ? co.head               : o.head;
	  o.deck        = !helpers.isUndefined(co.deck) === true ? co.deck               : o.deck;
	  o.legend      = !helpers.isUndefined(co.legend) === true ? co.legend           : o.legend;
	  o.qualifier   = !helpers.isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
	  o.footer      = !helpers.isUndefined(co.footer) === true ? co.footer           : o.footer;
	  o.x_axis      = !helpers.isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
	  o.y_axis      = !helpers.isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
	  o.tips        = !helpers.isUndefined(co.tips) === true ? co.tips               : o.tips;
	  o.annotations = !helpers.isUndefined(co.annotations) === true ? co.annotations : o.annotations;
	  o.range       = !helpers.isUndefined(co.range) === true ? co.range             : o.range;
	  o.series      = !helpers.isUndefined(co.series) === true ? co.series           : o.series;
	  o.index       = !helpers.isUndefined(co.indexed) === true ? co.indexed         : o.index;
	
	  //  these are specific to the t object and don't exist in the embed
	  t.baseClass        = embed.baseClass                        || t.baseClass;
	
	  t.dimensions.width = embed.width                            || t.dimensions.width;
	
	  t.prefix           = chart.prefix                           || t.prefix;
	  t.exportable       = chart.exportable                       || t.exportable;
	  t.editable         = chart.editable                         || t.editable;
	
	  if (t.exportable) {
	    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
	    t.dimensions.height = function() { return chart.exportable.height; }
	    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
	  }
	
	  if (chart.hasHours) { t.dateFormat += " " + t.timeFormat; }
	  t.hasHours         = chart.hasHours                         || t.hasHours;
	  t.dateFormat       = chart.dateFormat                       || t.dateFormat;
	
	  t.dateFormat = dataParse.inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
	  t.data = dataParse.parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;
	
	  return t;
	
	}
	
	module.exports = RecipeFactory;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Helpers that manipulate and check primitives. Nothing D3-specific here.
	 * @module helpers/helpers
	 */
	
	/**
	 * Returns true if value is an integer, false otherwise.
	 * @return {Boolean}
	 */
	function isInteger(x) {
	  return x % 1 === 0;
	}
	
	/**
	 * Returns true if value is a float.
	 * @return {Boolean}
	 */
	function isFloat(n) {
	  return n === +n && n !== (n|0);
	}
	
	/**
	 * Returns true if a value is empty. Works for Objects, Arrays, Strings and Integers.
	 * @return {Boolean}
	 */
	function isEmpty(val) {
	  if (val.constructor == Object) {
	    for (var prop in val) {
	      if (val.hasOwnProperty(prop)) { return false; }
	    }
	    return true;
	  } else if (val.constructor == Array) {
	    return !val.length;
	  } else {
	    return !val;
	  }
	}
	
	/**
	 * Simple check for whether a value is undefined or not
	 * @return {Boolean}
	 */
	function isUndefined(val) {
	  return val === undefined ? true : false;
	}
	
	/**
	 * Given two arrays, returns only unique values in those arrays.
	 * @param  {Array} a1
	 * @param  {Array} a2
	 * @return {Array}    Array of unique values.
	 */
	function arrayDiff(a1, a2) {
	  var o1 = {}, o2 = {}, diff= [], i, len, k;
	  for (i = 0, len = a1.length; i < len; i++) { o1[a1[i]] = true; }
	  for (i = 0, len = a2.length; i < len; i++) { o2[a2[i]] = true; }
	  for (k in o1) { if (!(k in o2)) { diff.push(k); } }
	  for (k in o2) { if (!(k in o1)) { diff.push(k); } }
	  return diff;
	}
	
	/**
	 * Opposite of arrayDiff(), this returns only common elements between arrays.
	 * @param  {Array} arr1
	 * @param  {Array} arr2
	 * @return {Array}      Array of common values.
	 */
	function arraySame(a1, a2) {
	  var ret = [];
	  for (i in a1) {
	    if (a2.indexOf( a1[i] ) > -1){
	      ret.push( a1[i] );
	    }
	  }
	  return ret;
	}
	
	/**
	 * Extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
	 * @param  {*} from
	 * @param  {*} to
	 * @return {*}      Cloned object.
	 */
	function extend(from, to) {
	  if (from == null || typeof from != "object") return from;
	  if (from.constructor != Object && from.constructor != Array) return from;
	  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
	    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
	    return new from.constructor(from);
	
	  to = to || new from.constructor();
	
	  for (var name in from) {
	    to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
	  }
	
	  return to;
	}
	
	/**
	 * Compares two objects, returning an array of unique keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function uniqueKeys(o1, o2) {
	  return arrayDiff(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * Compares two objects, returning an array of common keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function sameKeys(o1, o2) {
	  return arraySame(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * If a string is undefined, return an empty string instead.
	 * @param  {String} str
	 * @return {String}
	 */
	function cleanStr(str){
	  if (str === undefined) {
	    return "";
	  } else {
	    return str;
	  }
	}
	
	module.exports = {
	  isInteger: isInteger,
	  isFloat: isFloat,
	  isEmpty: isEmpty,
	  isUndefined: isUndefined,
	  extend: extend,
	  arrayDiff: arrayDiff,
	  arraySame: arraySame,
	  uniqueKeys: uniqueKeys,
	  sameKeys: sameKeys,
	  cleanStr: cleanStr
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart contruction manager module.
	 * @module charts/manager
	 */
	
	/**
	 * Manages the step-by-step creation of a chart, and returns the full configuration for the chart, including references to nodes, scales, axes, etc.
	 * @param {String} container Selector for the container the chart will be drawn into.
	 * @param {Object} obj       Object that contains settings for the chart.
	 */
	function ChartManager(container, obj) {
	
	  var Recipe = __webpack_require__(7),
	      settings = __webpack_require__(1),
	      components = __webpack_require__(10);
	
	  var chartRecipe = new Recipe(settings, obj);
	
	  var rendered = chartRecipe.rendered = {};
	
	  // check that each section is needed
	
	  if (chartRecipe.options.head) {
	    rendered.header = components.header(container, chartRecipe);
	  }
	
	  if (chartRecipe.options.footer) {
	    rendered.footer = components.footer(container, chartRecipe);
	  }
	
	  var node = components.base(container, chartRecipe);
	
	  rendered.container = node;
	
	  rendered.plot = components.plot(node, chartRecipe);
	
	  if (chartRecipe.options.qualifier) {
	    rendered.qualifier = components.qualifier(node, chartRecipe);
	  }
	
	  if (chartRecipe.options.tips) {
	    rendered.tips = components.tips(node, chartRecipe);
	  }
	
	  if (!chartRecipe.editable && !chartRecipe.exportable) {
	    if (chartRecipe.options.share_data) {
	      rendered.shareData = components.shareData(container, chartRecipe);
	    }
	    if (chartRecipe.options.social) {
	      rendered.social = components.social(container, chartRecipe);
	    }
	  }
	
	  if (chartRecipe.CUSTOM) {
	    var custom = __webpack_require__(29);
	    rendered.custom = custom(node, chartRecipe, rendered);
	  }
	
	  return chartRecipe;
	
	};
	
	module.exports = ChartManager;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var components = {
	  base: __webpack_require__(11),
	  header: __webpack_require__(12),
	  footer: __webpack_require__(13),
	  plot: __webpack_require__(14),
	  qualifier: __webpack_require__(25),
	  axis: __webpack_require__(16),
	  scale: __webpack_require__(17),
	  tips: __webpack_require__(26),
	  social: __webpack_require__(27),
	  shareData: __webpack_require__(28)
	};
	
	module.exports = components;


/***/ },
/* 11 */
/***/ function(module, exports) {

	function append(container, obj) {
	
	  var margin = obj.dimensions.margin;
	
	  var chartBase = d3.select(container)
	    .insert("svg", "." + obj.prefix + "chart_source")
	    .attr({
	      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + "type_" + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
	      "width": obj.dimensions.computedWidth() + margin.left + margin.right,
	      "height": obj.dimensions.computedHeight() + margin.top + margin.bottom,
	      "version": 1.1,
	      "xmlns": "http://www.w3.org/2000/svg"
	    });
	
	  // background rect
	  chartBase
	    .append("rect")
	    .attr({
	      "class": obj.prefix + "bg",
	      "x": 0,
	      "y": 0,
	      "width": obj.dimensions.computedWidth(),
	      "height": obj.dimensions.computedHeight(),
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  var graph = chartBase.append("g")
	    .attr({
	      "class": obj.prefix + "graph",
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  return graph;
	
	}
	
	module.exports = append;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	function headerComponent(container, obj) {
	
	  var helpers = __webpack_require__(8);
	
	  var headerGroup = d3.select(container)
	    .append("div")
	    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true)
	
	  // hack necessary to ensure PDF fields are sized properly
	  if (obj.exportable) {
	    headerGroup.style("width", obj.exportable.width + "px");
	  }
	
	  if (obj.heading !== "" || obj.editable) {
	    var headerText = headerGroup
	      .append("div")
	      .attr("class", obj.prefix + "chart_title-text")
	      .text(obj.heading);
	
	    if (obj.editable) {
	      headerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_title", true);
	    }
	
	  }
	
	  var qualifier;
	
	  if (obj.options.type === "bar") {
	    qualifier = headerGroup
	      .append("div")
	      .attr({
	        "class": function() {
	          var str = obj.prefix + "chart_qualifier " + obj.prefix + "chart_qualifier-bar";
	          if (obj.editable) {
	            str += " editable-chart_qualifier";
	          }
	          return str;
	        },
	        "contentEditable": function() {
	          return obj.editable ? true : false;
	        }
	      })
	      .text(obj.qualifier);
	  }
	
	  if (obj.data.keys.length > 2) {
	
	    var legend = headerGroup.append("div")
	      .classed(obj.prefix + "chart_legend", true);
	
	    var keys = helpers.extend(obj.data.keys);
	
	    // get rid of the first item as it doesnt represent a series
	    keys.shift();
	
	    if (obj.options.type === "multiline") {
	      keys = [keys[0], keys[1]];
	      legend.classed(obj.prefix + "chart_legend-" + obj.options.type, true);
	    }
	
	    var legendItem = legend.selectAll("div." + obj.prefix + "legend_item")
	      .data(keys)
	      .enter()
	      .append("div")
	      .attr("class", function(d, i) {
	        return obj.prefix + "legend_item " + obj.prefix + "legend_item_" + (i);
	      });
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_icon");
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_text")
	      .text(function(d) { return d; });
	  }
	
	  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;
	
	  return {
	    headerGroup: headerGroup,
	    legend: legend,
	    qualifier: qualifier
	  };
	
	}
	
	module.exports = headerComponent;


/***/ },
/* 13 */
/***/ function(module, exports) {

	function footerComponent(container, obj) {
	
	  var footerGroup;
	
	  if (obj.source !== "" || obj.editable) {
	    footerGroup = d3.select(container)
	      .append("div")
	      .classed(obj.prefix + "chart_source", true);
	
	    // hack necessary to ensure PDF fields are sized properly
	    if (obj.exportable) {
	      footerGroup.style("width", obj.exportable.width + "px");
	    }
	
	    var footerText = footerGroup.append("div")
	      .attr("class", obj.prefix + "chart_source-text")
	      .text(obj.source);
	
	    if (obj.editable) {
	      footerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_source", true);
	    }
	
	    obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;
	
	  }
	
	  return {
	    footerGroup: footerGroup
	  };
	
	}
	
	module.exports = footerComponent;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	function plot(node, obj) {
	
	  var draw = {
	    line: __webpack_require__(15),
	    multiline: __webpack_require__(18),
	    area: __webpack_require__(19),
	    stackedArea: __webpack_require__(20),
	    column: __webpack_require__(21),
	    bar: __webpack_require__(22),
	    stackedColumn: __webpack_require__(23),
	    streamgraph: __webpack_require__(24)
	  };
	
	  var chartRef;
	
	  switch(obj.options.type) {
	
	    case "line":
	      chartRef = draw.line(node, obj);
	      break;
	
	    case "multiline":
	      chartRef = draw.multiline(node, obj);
	      break;
	
	    case "area":
	      chartRef = obj.options.stacked ? draw.stackedArea(node, obj) : draw.area(node, obj);
	      break;
	
	    case "bar":
	      chartRef = draw.bar(node, obj);
	      break;
	
	    case "column":
	      chartRef = obj.options.stacked ? draw.stackedColumn(node, obj) : draw.column(node, obj);
	      break;
	
	    case "stream":
	      chartRef = draw.streamgraph(node, obj);
	      break;
	
	    default:
	      chartRef = draw.line(node, obj);
	      break;
	  }
	
	  return chartRef;
	
	}
	
	module.exports = plot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	function LineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = LineChart;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	function AxisFactory(axisObj, scale) {
	
	  var axis = d3.svg.axis()
	    .scale(scale)
	    .orient(axisObj.orient);
	
	  return axis;
	
	}
	
	function axisManager(node, obj, scale, axisType) {
	
	  var axisObj = obj[axisType];
	  var axis = new AxisFactory(axisObj, scale);
	
	  var prevAxis = node.select("." + obj.prefix + "axis-group" + "." + obj.prefix + axisType).node();
	
	  if (prevAxis !== null) { d3.select(prevAxis).remove(); }
	
	  var axisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + axisType);
	
	  if (axisType === "xAxis") {
	    appendXAxis(axisGroup, obj, scale, axis, axisType);
	  } else if (axisType === "yAxis") {
	    appendYAxis(axisGroup, obj, scale, axis, axisType);
	  }
	
	  return {
	    node: axisGroup,
	    axis: axis
	  };
	
	}
	
	function determineFormat(context) {
	
	  switch (context) {
	    case "years": return d3.time.format("%Y");
	    case "months": return d3.time.format("%b");
	    case "weeks": return d3.time.format("%W");
	    case "days": return d3.time.format("%j");
	    case "hours": return d3.time.format("%H");
	    case "minutes": return d3.time.format("%M");
	  }
	
	}
	
	function appendXAxis(axisGroup, obj, scale, axis, axisName) {
	
	  var axisObj = obj[axisName],
	      axisSettings;
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.x_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  axisGroup
	    .attr("transform", "translate(0," + obj.dimensions.yAxisHeight() + ")");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis");
	
	  switch(axisObj.scale) {
	    case "time":
	      timeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	    case "ordinal":
	      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
	      break;
	    case "ordinal-time":
	      ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	  }
	
	  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;
	
	}
	
	function appendYAxis(axisGroup, obj, scale, axis, axisName) {
	
	  axisGroup.attr("transform", "translate(0,0)");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis");
	
	  drawYAxis(obj, axis, axisNode);
	
	}
	
	function drawYAxis(obj, axis, axisNode) {
	
	  var axisSettings;
	
	  var axisObj = obj["yAxis"];
	
	  if (obj.exportable && obj.exportable.y_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.y_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;
	
	  axis.scale().range([obj.dimensions.yAxisHeight(), 0]);
	
	  axis.tickValues(tickFinderY(axis.scale(), axisObj.ticks, axisSettings));
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  axisNode.selectAll(".tick text")
	    .attr("transform", "translate(0,0)")
	    .call(updateTextY, axisNode, obj, axis, axisObj)
	    .call(repositionTextY, obj.dimensions, axisObj.textX);
	
	  axisNode.selectAll(".tick line")
	    .attr({
	      "x1": obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	      "x2": obj.dimensions.computedWidth()
	    });
	
	}
	
	function timeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  var ticks;
	
	  var tickGoal;
	  if (axisSettings.ticks === 'auto') {
	    tickGoal = axisSettings.tickTarget;
	  } else {
	    tickGoal = axisSettings.ticks;
	  }
	
	  if (obj.dimensions.tickWidth() > axisSettings.widthThreshold) {
	    ticks = tickFinderX(domain, ctx, tickGoal);
	  } else {
	    ticks = tickFinderX(domain, ctx, axisSettings.ticksSmall);
	  }
	
	  if (obj.options.type !== "column") {
	    axis.tickValues(ticks);
	  } else {
	    axis.ticks();
	  }
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.options.type === "column") { dropRedundantTicks(axisNode, ctx); }
	
	  axisNode.selectAll(".tick")
	    .call(dropTicks);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {
	
	  var wrapText = __webpack_require__(4).wrapText;
	
	  axis.tickPadding(0);
	
	  scale.rangeExtent([0, dimensions.tickWidth()]);
	
	  scale.rangeRoundBands([0, dimensions.tickWidth()], dimensions.bands.padding, dimensions.bands.outerPadding);
	
	  var bandStep = scale.rangeBand();
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .style("text-anchor", "middle")
	    .attr("dy", axisSettings.dy + "em")
	    .call(wrapText, bandStep);
	
	  var firstXPos = d3.transform(axisNode.select(".tick").attr("transform")).translate[0] * -1;
	
	  var xPos = (- (bandStep / 2) - (bandStep * dimensions.bands.outerPadding));
	
	  axisNode.selectAll("line")
	    .attr({
	      "x1": xPos,
	      "x2": xPos
	    });
	
	  axisNode.select("line")
	    .attr({
	      "x1": firstXPos,
	      "x2": firstXPos
	    });
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	  var lastTick = axisNode.append("g")
	    .attr({
	      "class": "tick",
	      "transform": "translate(" + (dimensions.tickWidth() + (bandStep / 2) + bandStep * dimensions.bands.outerPadding) + ",0)"
	    });
	
	  lastTick.append("line")
	    .attr({
	      "y2": axisSettings.upper.tickHeight,
	      "x1": xPos,
	      "x2": xPos
	    });
	
	}
	
	function ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
	    var ordinalTickPadding = 7;
	  } else {
	    var ordinalTickPadding = 4;
	  }
	
	  axisNode.selectAll(".tick")
	    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	// text formatting functions
	
	function setTickFormatX(selection, ctx, ems, monthsAbr) {
	
	  var prevYear,
	      prevMonth,
	      prevDate,
	      dYear,
	      dMonth,
	      dDate,
	      dHour,
	      dMinute;
	
	  selection.text(function(d) {
	
	    var node = d3.select(this);
	
	    var dStr;
	
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	
	        dMonth = monthsAbr[d.getMonth()];
	        dYear = d.getFullYear();
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        dStr = dMonth;
	
	        prevYear = dYear;
	
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	
	        if (dMonth !== prevMonth) {
	          dStr = dMonth + " " + dDate;
	        } else {
	          dStr = dDate;
	        }
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        prevMonth = dMonth;
	        prevYear = dYear;
	
	        break;
	
	      case "hours":
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        var dHourStr,
	            dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        if (dDate !== prevDate) {
	          var dateStr = dMonth + " " + dDate;
	          newTextNode(node, dateStr, ems);
	        }
	
	        prevDate = dDate;
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	function setTickFormatY(format, d, lastTick) {
	  // checking for a format and formatting y-axis values accordingly
	
	  var isFloat = __webpack_require__(8).isFloat;
	
	  var currentFormat;
	
	  switch (format) {
	    case "general":
	      currentFormat = d3.format("g")(d);
	      break;
	    case "si":
	      var prefix = d3.formatPrefix(lastTick),
	          format = d3.format(".1f");
	      currentFormat = format(prefix.scale(d)) + prefix.symbol;
	      break;
	    case "comma":
	      if (isFloat(parseFloat(d))) {
	        currentFormat = d3.format(",.2f")(d);
	      } else {
	        currentFormat = d3.format(",g")(d);
	      }
	      break;
	    case "round1":
	      currentFormat = d3.format(",.1f")(d);
	      break;
	    case "round2":
	      currentFormat = d3.format(",.2f")(d);
	      break;
	    case "round3":
	      currentFormat = d3.format(",.3f")(d);
	      break;
	    case "round4":
	      currentFormat = d3.format(",.4f")(d);
	      break;
	    default:
	      currentFormat = d3.format(",g")(d);
	      break;
	  }
	
	  return currentFormat;
	
	}
	
	function updateTextX(textNodes, axisNode, obj, axis, axisObj) {
	
	  var lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    });
	
	}
	
	function updateTextY(textNodes, axisNode, obj, axis, axisObj) {
	
	  var arr = [],
	      lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .attr("transform", "translate(0,0)")
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    })
	    .text(function() {
	      var sel = d3.select(this);
	      var textChar = sel.node().getBoundingClientRect().width;
	      arr.push(textChar);
	      return sel.text();
	    })
	    .attr({
	      "dy": function() {
	        if (axisObj.dy !== "") {
	          return axisObj.dy + "em";
	        } else {
	          return d3.select(this).attr("dy");
	        }
	      },
	      "x": function() {
	        if (axisObj.textX !== "") {
	          return axisObj.textX;
	        } else {
	          return d3.select(this).attr("x");
	        }
	      },
	      "y": function() {
	        if (axisObj.textY !== "") {
	          return axisObj.textY;
	        } else {
	          return d3.select(this).attr("y");
	        }
	      }
	    });
	
	  obj.dimensions.labelWidth = d3.max(arr);
	
	}
	
	function repositionTextY(text, dimensions, textX) {
	  text.attr({
	    "transform": "translate(" + (dimensions.labelWidth - textX) + ",0)",
	    "x": 0
	  });
	}
	
	// Clones current text selection and appends
	// a new text node below the selection
	function newTextNode(selection, text, ems) {
	
	  var nodeName = selection.property("nodeName"),
	      parent = d3.select(selection.node().parentNode),
	      lineHeight = ems || 1.6, // ems
	      dy = parseFloat(selection.attr("dy")),
	      x = parseFloat(selection.attr("x")),
	
	      cloned = parent.append(nodeName)
	        .attr("dy", lineHeight + dy + "em")
	        .attr("x", x)
	        .text(function() { return text; });
	
	  return cloned;
	
	}
	
	// tick dropping functions
	
	function dropTicks(selection, opts) {
	
	  var opts = opts || {};
	
	  var tolerance = opts.tolerance || 0,
	      from = opts.from || 0,
	      to = opts.to || selection[0].length;
	
	  for (var j = from; j < to; j++) {
	
	    var c = selection[0][j], // current selection
	        n = selection[0][j + 1]; // next selection
	
	    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) { continue; }
	
	    while ((c.getBoundingClientRect().right + tolerance) > n.getBoundingClientRect().left) {
	
	      if (d3.select(n).data()[0] === selection.data()[to]) {
	        d3.select(c).remove();
	      } else {
	        d3.select(n).remove();
	      }
	
	      j++;
	
	      n = selection[0][j + 1];
	
	      if (!n) { break; }
	
	    }
	
	  }
	
	}
	
	function dropRedundantTicks(selection, ctx) {
	
	  var ticks = selection.selectAll(".tick");
	
	  var prevYear, prevMonth, prevDate, prevHour, prevMinute, dYear, dMonth, dDate, dHour, dMinute;
	
	  ticks.each(function(d) {
	    switch (ctx) {
	      case "years":
	        dYear = d.getFullYear();
	        if (dYear === prevYear) {
	          d3.select(this).remove();
	        }
	        prevYear = dYear;
	        break;
	      case "months":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        if ((dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        dDate = d.getDate();
	
	        if ((dDate === prevDate) && (dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "hours":
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        if ((dDate === prevDate) && (dHour === prevHour) && (dMinute === prevMinute)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevHour = dHour;
	        prevMinute = dMinute;
	        break;
	    }
	  });
	
	}
	
	function dropOversetTicks(axisNode, tickWidth) {
	
	  var axisGroupWidth = axisNode.node().getBBox().width,
	      tickArr = axisNode.selectAll(".tick")[0];
	
	  if (tickArr.length) {
	
	    var firstTickOffset = d3.transform(d3.select(tickArr[0])
	      .attr("transform")).translate[0];
	
	    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
	      var lastTick = tickArr[tickArr.length - 1];
	      d3.select(lastTick).attr("class", "last-tick-hide");
	      axisGroupWidth = axisNode.node().getBBox().width;
	      tickArr = axisNode.selectAll(".tick")[0];
	    }
	
	  }
	
	}
	
	function tickFinderX(domain, period, tickGoal) {
	
	  // set ranges
	  var startDate = domain[0],
	      endDate = domain[1];
	
	  // set upper and lower bounds for number of steps per tick
	  // i.e. if you have four months and set steps to 1, you'll get 4 ticks
	  // and if you have six months and set steps to 2, you'll get 3 ticks
	  var stepLowerBound = 1,
	      stepUpperBound = 12,
	      tickCandidates = [],
	      closestArr;
	
	  // using the tick bounds, generate multiple arrays-in-objects using
	  // different tick steps. push all those generated objects to tickCandidates
	  for (var i = stepLowerBound; i <= stepUpperBound; i++) {
	    var obj = {};
	    obj.interval = i;
	    obj.arr = d3.time[period](startDate, endDate, i).length;
	    tickCandidates.push(obj);
	  }
	
	  // reduce to find a best candidate based on the defined tickGoal
	  if (tickCandidates.length > 1) {
	    closestArr = tickCandidates.reduce(function (prev, curr) {
	      return (Math.abs(curr.arr - tickGoal) < Math.abs(prev.arr - tickGoal) ? curr : prev);
	    });
	  } else if (tickCandidates.length === 1) {
	    closestArr = tickCandidates[0];
	  } else {
	    // sigh. we tried.
	    closestArr.interval = 1;
	  }
	
	  var tickArr = d3.time[period](startDate, endDate, closestArr.interval);
	
	  var startDiff = tickArr[0] - startDate;
	  var tickDiff = tickArr[1] - tickArr[0];
	
	  // if distance from startDate to tickArr[0] is greater than half the
	  // distance between tickArr[1] and tickArr[0], add startDate to tickArr
	
	  if ( startDiff > (tickDiff / 2) ) { tickArr.unshift(startDate); }
	
	  return tickArr;
	
	}
	
	function tickFinderY(scale, tickCount, tickSettings) {
	
	  // In a nutshell:
	  // Checks if an explicit number of ticks has been declared
	  // If not, sets lower and upper bounds for the number of ticks
	  // Iterates over those and makes sure that there are tick arrays where
	  // the last value in the array matches the domain max value
	  // if so, tries to find the tick number closest to tickGoal out of the winners,
	  // and returns that arr to the scale for use
	
	  var min = scale.domain()[0],
	      max = scale.domain()[1];
	
	  if (tickCount !== "auto") {
	
	    return scale.ticks(tickCount);
	
	  } else {
	
	    var tickLowerBound = tickSettings.tickLowerBound,
	        tickUpperBound = tickSettings.tickUpperBound,
	        tickGoal = tickSettings.tickGoal,
	        arr = [],
	        tickCandidates = [],
	        closestArr;
	
	    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
	      var tickCandidate = scale.ticks(i);
	
	      if (min < 0) {
	        if ((tickCandidate[0] === min) && (tickCandidate[tickCandidate.length - 1] === max)) {
	          arr.push(tickCandidate);
	        }
	      } else {
	        if (tickCandidate[tickCandidate.length - 1] === max) {
	          arr.push(tickCandidate);
	        }
	      }
	    }
	
	    arr.forEach(function (value) {
	      tickCandidates.push(value.length);
	    });
	
	    var closestArr;
	
	    if (tickCandidates.length > 1) {
	      closestArr = tickCandidates.reduce(function (prev, curr) {
	        return (Math.abs(curr - tickGoal) < Math.abs(prev - tickGoal) ? curr : prev);
	      });
	    } else if (tickCandidates.length === 1) {
	      closestArr = tickCandidates[0];
	    } else {
	      closestArr = null;
	    }
	
	    return scale.ticks(closestArr);
	
	  }
	}
	
	
	function ordinalTimeTicks(selection, axisNode, ctx, scale, tolerance) {
	
	  dropRedundantTicks(axisNode, ctx);
	
	  // dropRedundantTicks has modified the selection, so we need to reselect
	  // to get a proper idea of what's still available
	  var newSelection = axisNode.selectAll(".tick");
	
	  // if the context is "years", every tick is a majortick so we can
	  // just pass on the block below
	  if (ctx !== "years") {
	
	    // array for any "major ticks", i.e. ticks with a change in context
	    // one level up. i.e., a "months" context set of ticks with a change in the year,
	    // or "days" context ticks with a change in month or year
	    var majorTicks = [];
	
	    var prevYear, prevMonth, prevDate, dYear, dMonth, dDate;
	
	    newSelection.each(function(d) {
	      var currSel = d3.select(this);
	      switch (ctx) {
	        case "months":
	          dYear = d.getFullYear();
	          if (dYear !== prevYear) { majorTicks.push(currSel); }
	          prevYear = d.getFullYear();
	          break;
	        case "weeks":
	        case "days":
	          dYear = d.getFullYear();
	          dMonth = d.getMonth();
	          if ((dMonth !== prevMonth) && (dYear !== prevYear)) {
	            majorTicks.push(currSel);
	          } else if (dMonth !== prevMonth) {
	            majorTicks.push(currSel);
	          } else if (dYear !== prevYear) {
	            majorTicks.push(currSel);
	          }
	          prevMonth = d.getMonth();
	          prevYear = d.getFullYear();
	          break;
	        case "hours":
	          dDate = d.getDate();
	          if (dDate !== prevDate) { majorTicks.push(currSel); }
	          prevDate = dDate;
	          break;
	      }
	    });
	
	    var t0, tn;
	
	    if (majorTicks.length > 1) {
	
	      for (var i = 0; i < majorTicks.length + 1; i++) {
	
	        if (i === 0) { // from t0 to m0
	          t0 = 0;
	          tn = newSelection.data().indexOf(majorTicks[0].data()[0]);
	        } else if (i === (majorTicks.length)) { // from mn to tn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.length - 1;
	        } else { // from m0 to mn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.data().indexOf(majorTicks[i].data()[0]);
	        }
	
	        if (!!(tn - t0)) {
	          dropTicks(newSelection, {
	            from: t0,
	            to: tn,
	            tolerance: tolerance
	          });
	        }
	
	      }
	
	    } else {
	      dropTicks(newSelection, { tolerance: tolerance });
	    }
	
	  } else {
	    dropTicks(newSelection, { tolerance: tolerance });
	  }
	
	}
	
	function axisCleanup(node, obj, xAxisObj, yAxisObj) {
	
	  // this section is kinda gross, sorry:
	  // resets ranges and dimensions, redraws yAxis, redraws xAxis
	  // …then redraws yAxis again if tick wrapping has changed xAxis height
	
	  drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	
	  var setRangeType = __webpack_require__(17).setRangeType,
	      setRangeArgs = __webpack_require__(17).setRangeArgs;
	
	  var scaleObj = {
	    rangeType: setRangeType(obj.xAxis),
	    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
	    bands: obj.dimensions.bands,
	    rangePoints: obj.xAxis.rangePoints
	  };
	
	  setRangeArgs(xAxisObj.axis.scale(), scaleObj);
	
	  var prevXAxisHeight = obj.dimensions.xAxisHeight;
	
	  xAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), "xAxis");
	
	  xAxisObj.node
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  if (obj.xAxis.scale !== "ordinal") {
	    dropOversetTicks(xAxisObj.node, obj.dimensions.tickWidth());
	  }
	
	  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
	    drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	  }
	
	}
	
	function addZeroLine(obj, node, Axis, axisType) {
	
	  var ticks = Axis.axis.tickValues(),
	      tickMin = ticks[0],
	      tickMax = ticks[ticks.length - 1];
	
	  if ((tickMin <= 0) && (0 <= tickMax)) {
	
	    var refGroup = Axis.node.selectAll(".tick:not(." + obj.prefix + "minor)"),
	        refLine = refGroup.select("line");
	
	    // zero line
	    var zeroLine = node.append("line")
	      .style("shape-rendering", "crispEdges")
	      .attr("class", obj.prefix + "zero-line");
	
	    var transform = [0, 0];
	
	    transform[0] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[0];
	    transform[1] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[1];
	    transform[0] += d3.transform(refGroup.attr("transform")).translate[0];
	    transform[1] += d3.transform(refGroup.attr("transform")).translate[1];
	
	    if (axisType === "xAxis") {
	
	      zeroLine.attr({
	        "y1": refLine.attr("y1"),
	        "y2": refLine.attr("y2"),
	        "x1": 0,
	        "x2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    } else if (axisType === "yAxis") {
	
	      zeroLine.attr({
	        "x1": refLine.attr("x1"),
	        "x2": refLine.attr("x2"),
	        "y1": 0,
	        "y2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    }
	
	    refLine.style("display", "none");
	
	  }
	
	}
	
	module.exports = {
	  AxisFactory: AxisFactory,
	  axisManager: axisManager,
	  determineFormat: determineFormat,
	  appendXAxis: appendXAxis,
	  appendYAxis: appendYAxis,
	  drawYAxis: drawYAxis,
	  timeAxis: timeAxis,
	  discreteAxis: discreteAxis,
	  ordinalTimeAxis: ordinalTimeAxis,
	  setTickFormatX: setTickFormatX,
	  setTickFormatY: setTickFormatY,
	  updateTextX: updateTextX,
	  updateTextY: updateTextY,
	  repositionTextY: repositionTextY,
	  newTextNode: newTextNode,
	  dropTicks: dropTicks,
	  dropOversetTicks: dropOversetTicks,
	  dropRedundantTicks: dropRedundantTicks,
	  tickFinderX: tickFinderX,
	  tickFinderY: tickFinderY,
	  axisCleanup: axisCleanup,
	  addZeroLine: addZeroLine
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	function scaleManager(obj, axisType) {
	
	  var axis = obj[axisType],
	      scaleObj = new ScaleObj(obj, axis, axisType);
	
	  var scale = setScaleType(scaleObj.type);
	
	  scale.domain(scaleObj.domain);
	
	  setRangeArgs(scale, scaleObj);
	
	  if (axis.nice) { niceify(scale, axisType, scaleObj); }
	  if (axis.rescale) { rescale(scale, axisType, axis); }
	
	  return {
	    obj: scaleObj,
	    scale: scale
	  };
	
	}
	
	function ScaleObj(obj, axis, axisType) {
	  this.type = axis.scale;
	  this.domain = setDomain(obj, axis);
	  this.rangeType = setRangeType(axis);
	  this.range = setRange(obj, axisType);
	  this.bands = obj.dimensions.bands;
	  this.rangePoints = axis.rangePoints || 1.0;
	}
	
	function setScaleType(type) {
	
	  var scaleType;
	
	  switch (type) {
	    case "time":
	      scaleType = d3.time.scale();
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      scaleType = d3.scale.ordinal();
	      break;
	    case "linear":
	      scaleType = d3.scale.linear();
	      break;
	    case "identity":
	      scaleType = d3.scale.identity();
	      break;
	    case "pow":
	      scaleType = d3.scale.pow();
	      break;
	    case "sqrt":
	      scaleType = d3.scale.sqrt();
	      break;
	    case "log":
	      scaleType = d3.scale.log();
	      break;
	    case "quantize":
	      scaleType = d3.scale.quantize();
	      break;
	    case "quantile":
	      scaleType = d3.scale.quantile();
	      break;
	    case "threshold":
	      scaleType = d3.scale.threshold();
	      break;
	    default:
	      scaleType = d3.scale.linear();
	      break;
	  }
	
	  return scaleType;
	
	}
	
	function setRangeType(axis) {
	
	  var type;
	
	  switch(axis.scale) {
	    case "time":
	    case "linear":
	      type = "range";
	      break;
	    case "ordinal":
	    case "discrete":
	      type = "rangeRoundBands";
	      break;
	    case "ordinal-time":
	      type = "rangePoints";
	      break;
	    default:
	      type = "range";
	      break;
	  }
	
	  return type;
	
	}
	
	function setRange(obj, axisType) {
	
	  var range;
	
	  if (axisType === "xAxis") {
	    range = [0, obj.dimensions.tickWidth()]; // operating on width
	  } else if (axisType === "yAxis") {
	    range = [obj.dimensions.yAxisHeight(), 0]; // operating on height
	  }
	
	  return range;
	
	}
	
	function setRangeArgs(scale, scaleObj) {
	
	  switch (scaleObj.rangeType) {
	    case "range":
	      return scale[scaleObj.rangeType](scaleObj.range);
	    case "rangeRoundBands":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.bands.padding, scaleObj.bands.outerPadding);
	    case "rangePoints":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.rangePoints);
	  }
	
	}
	
	function setDomain(obj, axis) {
	
	  var data = obj.data;
	  var domain;
	
	  // included fallbacks just in case
	  switch(axis.scale) {
	    case "time":
	      domain = setDateDomain(data, axis.min, axis.max);
	      break;
	    case "linear":
	      var chartType = obj.options.type,
	          forceMaxVal;
	      if (chartType === "area" || chartType === "column" || chartType === "bar") {
	        forceMaxVal = true;
	      }
	      domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, forceMaxVal);
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      domain = setDiscreteDomain(data);
	      break;
	  }
	
	  return domain;
	
	}
	
	function setDateDomain(data, min, max) {
	  if (min && max) {
	    var startDate = min, endDate = max;
	  } else {
	    var dateRange = d3.extent(data.data, function(d) { return d.key; });
	    var startDate = min || new Date(dateRange[0]),
	        endDate = max || new Date(dateRange[1]);
	  }
	  return [startDate, endDate];
	}
	
	function setNumericalDomain(data, min, max, stacked, forceMaxVal) {
	
	  var minVal, maxVal;
	  var mArr = [];
	
	  d3.map(data.data, function(d) {
	    for (var j = 0; j < d.series.length; j++) {
	      mArr.push(Number(d.series[j].val));
	    }
	  });
	
	  if (stacked) {
	    maxVal = d3.max(data.stackedData[data.stackedData.length - 1], function(d) {
	      return (d.y0 + d.y);
	    });
	  } else {
	    maxVal = d3.max(mArr);
	  }
	
	  minVal = d3.min(mArr);
	
	  if (min) {
	    minVal = min;
	  } else if (minVal > 0) {
	    minVal = 0;
	  }
	
	  if (max) {
	    maxVal = max;
	  } else if (maxVal < 0 && forceMaxVal) {
	    maxVal = 0;
	  }
	
	  return [minVal, maxVal];
	
	}
	
	function setDiscreteDomain(data) {
	  return data.data.map(function(d) { return d.key; });
	}
	
	function rescale(scale, axisType, axisObj) {
	
	  switch(axisObj.scale) {
	    case "linear":
	      if (!axisObj.max) { rescaleNumerical(scale, axisObj); }
	      break;
	  }
	}
	
	function rescaleNumerical(scale, axisObj) {
	
	  // rescales the "top" end of the domain
	  var ticks = scale.ticks(10).slice(),
	      tickIncr = Math.abs(ticks[ticks.length - 1]) - Math.abs(ticks[ticks.length - 2]);
	
	  var newMax = ticks[ticks.length - 1] + tickIncr;
	
	  scale.domain([scale.domain()[0], newMax]);
	
	}
	
	function niceify(scale, axisType, scaleObj) {
	
	  switch(scaleObj.type) {
	    case "time":
	      var timeDiff = __webpack_require__(4).timeDiff;
	      var context = timeDiff(scale.domain()[0], scale.domain()[1], 3);
	      niceifyTime(scale, context);
	      break;
	    case "linear":
	      niceifyNumerical(scale);
	      break;
	  }
	
	}
	
	function niceifyTime(scale, context) {
	  var getTimeInterval = __webpack_require__(4).timeInterval;
	  var timeInterval = getTimeInterval(context);
	  scale.domain(scale.domain()).nice(timeInterval);
	}
	
	function niceifyNumerical(scale) {
	  scale.domain(scale.domain()).nice();
	}
	
	module.exports = {
	  scaleManager: scaleManager,
	  ScaleObj: ScaleObj,
	  setScaleType: setScaleType,
	  setRangeType: setRangeType,
	  setRangeArgs: setRangeArgs,
	  setRange: setRange,
	  setDomain: setDomain,
	  setDateDomain: setDateDomain,
	  setNumericalDomain: setNumericalDomain,
	  setDiscreteDomain: setDiscreteDomain,
	  rescale: rescale,
	  rescaleNumerical: rescaleNumerical,
	  niceify: niceify,
	  niceifyTime: niceifyTime,
	  niceifyNumerical: niceifyNumerical
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	function MultiLineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = MultiLineChart;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	function AreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var area = d3.svg.area().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y0(yScale(0))
	        .y1(function(d) { return yScale(d.series[i].val); });
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": area,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	            return output;
	          }
	        });
	
	      seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hArea = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y0(yScale(0))
	    .y1(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hArea,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "fill " + obj.prefix + "fill-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hLine,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    hArea: hArea,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = AreaChart;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	function StackedAreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  node.classed(obj.prefix + "stacked", true);
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("svg:g")
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function(d, i) {
	        var output = obj.prefix + "series " + obj.prefix + "series_" + (i);
	        if (i === obj.seriesHighlight()) {
	          output = obj.prefix + "series " + obj.prefix + "series_" + (i) + " " + obj.prefix + "highlight";
	        }
	        return output;
	      }
	    });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "fill " + obj.prefix + "fill-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function(d, i) { return obj.prefix + "line " + obj.prefix + "line-" + (i); })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StackedAreaChart;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	function ColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data) + 1;
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed / obj.data.seriesAmount;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - (singleColumn * obj.data.seriesAmount))];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'multiple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    });
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var columnItem = series
	      .selectAll("." + obj.prefix + "column")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return "translate(" + xScale(d.key) + ",0)";
	          }
	        }
	      });
	
	    columnItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return i * singleColumn;
	          } else {
	            return xScale(d.key)
	          }
	        },
	        "y": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return yScale(Math.max(0, d.series[i].val));
	          }
	        },
	        "height": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return Math.abs(yScale(d.series[i].val) - yScale(0));
	          }
	        },
	        "width": function() {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return singleColumn;
	          } else {
	            return singleColumn / obj.data.seriesAmount;
	          }
	        }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	
	      var columnOffset = obj.dimensions.bands.offset;
	
	      columnItem.selectAll("rect")
	        .attr({
	          "x": function(d) {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
	            } else {
	              return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
	            }
	          },
	          "width": function() {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return (singleColumn - (singleColumn * columnOffset));
	            } else {
	              return singleColumn / obj.data.seriesAmount;
	            }
	          }
	        });
	    }
	
	  }
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleColumn: singleColumn,
	    columnItem: columnItem
	  };
	
	}
	
	module.exports = ColumnChart;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	function BarChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	    scaleModule = __webpack_require__(17),
	    Scale = scaleModule.scaleManager;
	
	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset.
	  obj.data.data.reverse();
	
	  var xAxisSettings;
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    var extend = __webpack_require__(8).extend;
	    xAxisSettings = extend(obj.xAxis, obj.exportable.x_axis);
	  } else {
	    xAxisSettings = obj.xAxis;
	  }
	
	  var xScaleObj = new Scale(obj, "xAxis"),
	      xScale = xScaleObj.scale;
	
	  var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	  var xAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "xAxis")
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var xAxisNode = xAxisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis")
	    .call(xAxis);
	
	  var textLengths = [];
	
	  xAxisNode.selectAll("text")
	    .attr("y", xAxisSettings.barOffset)
	    .each(function() {
	      textLengths.push(d3.select(this).node().getBoundingClientRect().height);
	    });
	
	  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });
	
	  obj.dimensions.xAxisHeight = tallestText + xAxisSettings.barOffset;
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      yScale = yScaleObj.scale;
	
	  // need this for fixed-height bars
	  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
	    var totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);
	    yScale.rangeRoundBands([totalBarHeight, 0], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding);
	    obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding * 2);
	  }
	
	  var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
	  var yAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "yAxis")
	    .attr("transform", "translate(0,0)");
	
	  var yAxisNode = yAxisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis")
	    .call(yAxis);
	
	  yAxisNode.selectAll("line").remove();
	  yAxisNode.selectAll("text").attr("x", 0);
	
	  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
	  } else {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3;
	  }
	
	  if (yAxisNode.node().getBBox().width > maxLabelWidth) {
	    var wrapText = __webpack_require__(4).wrapText;
	    yAxisNode.selectAll("text")
	      .call(wrapText, maxLabelWidth)
	      .each(function() {
	        var tspans = d3.select(this).selectAll("tspan"),
	            tspanCount = tspans[0].length,
	            textHeight = d3.select(this).node().getBBox().height;
	        if (tspanCount > 1) {
	          tspans
	            .attr({
	              "y": ((textHeight / tspanCount) / 2) - (textHeight / 2)
	            });
	        }
	      });
	  }
	
	  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;
	
	  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");
	
	  var tickFinderX = axisModule.tickFinderY;
	
	  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
	  } else {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
	  }
	
	  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);
	
	  xScale.range([0, obj.dimensions.tickWidth()]);
	
	  xAxis.tickValues(ticks);
	
	  xAxisNode.call(xAxis);
	
	  xAxisNode.selectAll(".tick text")
	    .attr("y", xAxisSettings.barOffset)
	    .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	    // working with a dynamic bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + obj.dimensions.computedHeight() + ")");
	  } else {
	    // working with a fixed bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	  }
	
	  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;
	
	  if (xAxisWidth > obj.dimensions.computedWidth()) {
	
	    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);
	
	    xAxisNode.call(xAxis);
	
	    xAxisNode.selectAll(".tick text")
	      .attr("y", xAxisSettings.barOffset)
	      .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var singleBar = yScale.rangeBand() / obj.data.seriesAmount;
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var barItem = series
	      .selectAll("." + obj.prefix + "bar")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "bar " + obj.prefix + "bar-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          return "translate(0," + yScale(d.key) + ")";
	        }
	      });
	
	    barItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          return xScale(Math.min(0, d.series[i].val));
	        },
	        "y": function() {
	          return i * singleBar;
	        },
	        "width": function(d) {
	          return Math.abs(xScale(d.series[i].val) - xScale(0));
	        },
	        "height": function(d) { return singleBar; }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	      var barOffset = obj.dimensions.bands.offset;
	      barItem.selectAll("rect")
	        .attr({
	          "y": function() {
	            return ((i * singleBar) + (singleBar * (barOffset / 2)));
	          },
	          "height": singleBar - (singleBar * barOffset)
	        });
	    }
	
	  }
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  xAxisNode.selectAll("line")
	    .attr({
	      "y1": function() {
	        if (obj.exportable && obj.exportable.dynamicHeight) {
	          // dynamic height, so calculate where the y1 should go
	          return -(obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight);
	        } else {
	          // fixed height, so use that
	          return -(totalBarHeight);
	        }
	      },
	      "y2": 0
	  });
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	
	    // dynamic height, only need to transform x-axis group
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  } else {
	
	    // fixed height, so transform accordingly and modify the dimension function and parent rects
	
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	
	    obj.dimensions.totalXAxisHeight = xAxisGroup.node().getBoundingClientRect().height;
	
	    obj.dimensions.computedHeight = function() { return this.totalXAxisHeight; };
	
	    d3.select(node.node().parentNode)
	      .attr("height", function() {
	        var margin = obj.dimensions.margin;
	        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
	      });
	
	    d3.select(node.node().parentNode).select("." + obj.prefix + "bg")
	      .attr({
	        "height": obj.dimensions.computedHeight()
	      });
	
	  }
	
	  var xAxisObj = { node: xAxisGroup, axis: xAxis },
	      yAxisObj = { node: yAxisGroup, axis: yAxis };
	
	  var axisModule = __webpack_require__(16);
	
	  axisModule.addZeroLine(obj, node, xAxisObj, "xAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleBar: singleBar,
	    barItem: barItem
	  };
	
	}
	
	module.exports = BarChart;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	function StackedColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      xScaleObj = new Scale(obj, "xAxis"),
	      yScale = yScaleObj.scale,
	      xScale = xScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data);
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand();
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    })
	
	  // Add a group for each
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  // Add a rect for each data point.
	  var rect = series.selectAll("rect")
	    .data(function(d) { return d; })
	    .enter().append("rect")
	    .attr({
	      "class": obj.prefix + "column",
	      "data-key": function(d) { return d.x; },
	      "data-legend": function(d) { return d.legend; },
	      "x": function(d) { return xScale(d.x); },
	      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
	      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
	      "width": singleColumn
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    rect: rect
	  };
	
	}
	
	module.exports = StackedColumnChart;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	function StreamgraphChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  var seriesGroup = node.append("g")
	    .attr({
	      "class": obj.prefix + "series_group",
	      "transform": function() {
	        return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    }});
	
	  // Add a group for each cause.
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function() { return obj.prefix + "stream-series " + obj.prefix + "line"; })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StreamgraphChart;


/***/ },
/* 25 */
/***/ function(module, exports) {

	function qualifierComponent(node, obj) {
	
	  if (obj.options.type !== "bar") {
	
	    var yAxisNode = node.select("." + obj.prefix + "yAxis");
	
	    if (obj.editable) {
	
	      var foreignObject = yAxisNode.append("foreignObject")
	        .attr({
	          "class": obj.prefix + "fo " + obj.prefix + "qualifier",
	          "width": "100%"
	        });
	
	      var foreignObjectGroup = foreignObject.append("xhtml:div")
	        .attr("xmlns", "http://www.w3.org/1999/xhtml");
	
	      var qualifierField = foreignObjectGroup.append("div")
	        .attr({
	          "class": obj.prefix + "chart_qualifier editable-chart_qualifier",
	          "contentEditable": true,
	          "xmlns": "http://www.w3.org/1999/xhtml"
	        })
	        .text(obj.qualifier);
	
	      foreignObject
	        .attr({
	          "width": qualifierField.node().getBoundingClientRect().width + 15,
	          "height": qualifierField.node().getBoundingClientRect().height,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + ( - (qualifierField.node().getBoundingClientRect().height) / 2 ) + ")"
	        });
	
	    } else {
	
	      var qualifierBg = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text-bg")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	      var qualifierText = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	    }
	
	  }
	
	  return {
	    qualifierBg: qualifierBg,
	    qualifierText: qualifierText
	  };
	
	}
	
	module.exports = qualifierComponent;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Tips handling module.
	 * @module charts/components/tips
	 */
	
	function bisector(data, keyVal, stacked, index) {
	  if (stacked) {
	    var arr = [];
	    var bisect = d3.bisector(function(d) { return d.x; }).left;
	    for (var i = 0; i < data.length; i++) {
	      arr.push(bisect(data[i], keyVal));
	    };
	    return arr;
	  } else {
	    var bisect = d3.bisector(function(d) { return d.key; }).left;
	    return bisect(data, keyVal);
	  }
	}
	
	function cursorPos(overlay) {
	  return {
	    x: d3.mouse(overlay.node())[0],
	    y: d3.mouse(overlay.node())[1]
	  };
	}
	
	function getTipData(obj, cursor) {
	
	  var xScaleObj = obj.rendered.plot.xScaleObj,
	      xScale = xScaleObj.scale,
	      scaleType = xScaleObj.obj.type;
	
	  var xVal;
	
	  if (scaleType === "ordinal-time" || scaleType === "ordinal") {
	
	    var ordinalBisection = d3.bisector(function(d) { return d; }).left,
	        rangePos = ordinalBisection(xScale.range(), cursor.x);
	
	    xVal = xScale.domain()[rangePos];
	
	  } else {
	    xVal = xScale.invert(cursor.x);
	  }
	
	  var tipData;
	
	  if (obj.options.stacked) {
	    var data = obj.data.stackedData;
	    var i = bisector(data, xVal, obj.options.stacked);
	
	    var arr = [],
	        refIndex;
	
	    for (var k = 0; k < data.length; k++) {
	      if (refIndex) {
	        arr.push(data[k][refIndex]);
	      } else {
	        var d0 = data[k][i[k] - 1],
	            d1 = data[k][i[k]];
	        refIndex = xVal - d0.x > d1.x - xVal ? i[k] : (i[k] - 1);
	        arr.push(data[k][refIndex]);
	      }
	    }
	
	    tipData = arr;
	
	  } else {
	    var data = obj.data.data;
	    var i = bisector(data, xVal);
	    var d0 = data[i - 1],
	        d1 = data[i];
	
	    tipData = xVal - d0.key > d1.key - xVal ? d1 : d0;
	  }
	
	  return tipData;
	
	}
	
	function showTips(tipNodes, obj) {
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", true);
	  }
	
	}
	
	function hideTips(tipNodes, obj) {
	
	  if (obj.options.type === "column") {
	    if(obj.options.stacked){
	      obj.rendered.plot.series.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	    else{
	      obj.rendered.plot.columnItem.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	
	  }
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", false);
	  }
	
	}
	
	function mouseIdle(tipNodes, obj) {
	  return setTimeout(function() {
	    hideTips(tipNodes, obj);
	  }, obj.tipTimeout);
	}
	
	var timeout;
	
	function tipsManager(node, obj) {
	
	  var tipNodes = appendTipGroup(node, obj);
	
	  var fns = {
	    line: LineChartTips,
	    multiline: LineChartTips,
	    area: obj.options.stacked ? StackedAreaChartTips : AreaChartTips,
	    column: obj.options.stacked ? StackedColumnChartTips : ColumnChartTips,
	    stream: StreamgraphTips
	  };
	
	  var dataReference;
	
	  if (obj.options.type === "multiline") {
	    dataReference = [obj.data.data[0].series[0]];
	  } else {
	    dataReference = obj.data.data[0].series;
	  }
	
	  var innerTipElements = appendTipElements(node, obj, tipNodes, dataReference);
	
	  switch (obj.options.type) {
	    case "line":
	    case "multiline":
	    case "area":
	    case "stream":
	
	      tipNodes.overlay = tipNodes.tipNode.append("rect")
	        .attr({
	          "class": obj.prefix + "tip_overlay",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "width": obj.dimensions.tickWidth(),
	          "height": obj.dimensions.computedHeight()
	        });
	
	      tipNodes.overlay
	        .on("mouseover", function() { showTips(tipNodes, obj); })
	        .on("mouseout", function() { hideTips(tipNodes, obj); })
	        .on("mousemove", function() {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          return fns[obj.options.type](tipNodes, innerTipElements, obj);
	        });
	
	      break;
	
	    case "column":
	
	      var columnRects;
	
	      if (obj.options.stacked) {
	        columnRects = obj.rendered.plot.series.selectAll('rect')
	      } else {
	        columnRects = obj.rendered.plot.columnItem.selectAll('rect');
	      }
	
	      columnRects
	        .on("mouseover", function(d) {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          fns.column(tipNodes, obj, d, this);
	        })
	        .on("mouseout", function(d) {
	          hideTips(tipNodes, obj);
	        });
	
	      break;
	  }
	
	}
	
	function appendTipGroup(node, obj) {
	
	  var svgNode = d3.select(node.node().parentNode),
	      chartNode = d3.select(node.node().parentNode.parentNode);
	
	  var tipNode = svgNode.append("g")
	    .attr({
	      "transform": "translate(" + obj.dimensions.margin.left + "," + obj.dimensions.margin.top + ")",
	      "class": obj.prefix + "tip"
	    })
	    .classed(obj.prefix + "tip_stacked", function() {
	      return obj.options.stacked ? true : false;
	    });
	
	  var xTipLine = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_line-x")
	    .classed(obj.prefix + "active", false);
	
	  xTipLine.append("line");
	
	  var tipBox = tipNode.append("g")
	    .attr({
	      "class": obj.prefix + "tip_box",
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    });
	
	  var tipRect = tipBox.append("rect")
	    .attr({
	      "class": obj.prefix + "tip_rect",
	      "transform": "translate(0,0)",
	      "width": 1,
	      "height": 1
	    });
	
	  var tipGroup = tipBox.append("g")
	    .attr("class", obj.prefix + "tip_group");
	
	  var legendIcon = chartNode.select("." + obj.prefix + "legend_item_icon").node();
	
	  if (legendIcon) {
	    var radius = legendIcon.getBoundingClientRect().width / 2;
	  } else {
	    var radius = 0;
	  }
	
	  var tipPathCircles = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_path-circle-group");
	
	  var tipTextDate = tipGroup
	    .insert("g", ":first-child")
	    .attr("class", obj.prefix + "tip_text-date-group")
	    .append("text")
	    .attr({
	      "class": obj.prefix + "tip_text-date",
	      "x": 0,
	      "y": 0,
	      "dy": "1em"
	    });
	
	  return {
	    svg: svgNode,
	    tipNode: tipNode,
	    xTipLine: xTipLine,
	    tipBox: tipBox,
	    tipRect: tipRect,
	    tipGroup: tipGroup,
	    legendIcon: legendIcon,
	    tipPathCircles: tipPathCircles,
	    radius: radius,
	    tipTextDate: tipTextDate
	  };
	
	}
	
	function appendTipElements(node, obj, tipNodes, dataRef) {
	
	  var tipTextGroupContainer = tipNodes.tipGroup
	    .append("g")
	    .attr("class", function() {
	      return obj.prefix + "tip_text-group-container";
	    });
	
	  var tipTextGroups = tipTextGroupContainer
	    .selectAll("." + obj.prefix + "tip_text-group")
	    .data(dataRef)
	    .enter()
	    .append("g")
	    .attr("class", function(d, i) {
	      return obj.prefix + "tip_text-group " + obj.prefix + "tip_text-group-" + (i);
	    });
	
	  var lineHeight;
	
	  tipTextGroups.append("text")
	    .text(function(d) { return d.val; })
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_text " + obj.prefix + "tip_text-" + (i));
	      },
	      "data-series": function(d, i) { return d.key; },
	      "x": function() {
	        return (tipNodes.radius * 2) + (tipNodes.radius / 1.5);
	      },
	      "y": function(d, i) {
	        lineHeight = lineHeight || parseInt(d3.select(this).style("line-height"));
	        return (i + 1) * lineHeight;
	      },
	      "dy": "1em"
	    });
	
	  tipTextGroups
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	      },
	      "r": function(d, i) { return tipNodes.radius; },
	      "cx": function() { return tipNodes.radius; },
	      "cy": function(d, i) {
	        return ((i + 1) * lineHeight) + (tipNodes.radius * 1.5);
	      }
	    });
	
	  tipNodes.tipPathCircles
	    .selectAll("circle")
	    .data(dataRef)
	    .enter()
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_path-circle " + obj.prefix + "tip_path-circle-" + (i));
	      },
	      "r": (tipNodes.radius / 2) || 2.5
	    });
	
	  return tipTextGroups;
	
	}
	
	function LineChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function AreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StackedAreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StreamgraphTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function ColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.columnItem.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumn = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      getTranslateXY = __webpack_require__(4).getTranslateXY,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var cursorX = getTranslateXY(thisColumn.parentNode);
	
	    columnRects
	      .classed(obj.prefix + 'muted', function () {
	        return (this === thisColumn) ? false : true;
	      });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(tipData.key);
	    }
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	
	          if(x > obj.dimensions.tickWidth() / 2){
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	    showTips(tipNodes, obj);
	
	  }
	
	}
	
	
	function StackedColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.series.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumnRect = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.raw.series.length; i++) {
	    if (tipData.raw.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var parentEl = d3.select(thisColumnRect.parentNode.parentNode);
	    var refPos = d3.select(thisColumnRect).attr("x");
	
	    var thisColumnKey = '';
	
	    /* Figure out which stack this selected rect is in then loop back through and (un)assign muted class */
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      if(this === thisColumnRect){
	        thisColumnKey = d.raw.key;
	      }
	
	      return (this === thisColumnRect) ? false : true;
	
	    });
	
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      return (d.raw.key === thisColumnKey) ? false : true;
	
	    });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.raw.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(function() {
	          var d = tipData.raw.key;
	          return d;
	        });
	    }
	
	    tipNodes.tipGroup
	      .append("circle")
	      .attr({
	        "class": function(d, i) {
	          return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	        },
	        "r": function(d, i) { return tipNodes.radius; },
	        "cx": function() { return tipNodes.radius; },
	        "cy": function(d, i) {
	          return ( (i + 1) * parseInt(d3.select(this).style("font-size")) * 1.13 + 9);
	        }
	      });
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.raw.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          if (refPos > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	
	        }
	
	      });
	
	  }
	
	}
	
	function tipDateFormatter(selection, ctx, months, data) {
	
	  var dMonth,
	      dDate,
	      dYear,
	      dHour,
	      dMinute;
	
	  selection.text(function() {
	    var d = data;
	    var dStr;
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate + ", " + dYear;
	        break;
	      case "weeks":
	      case "days":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate;
	        break;
	      case "hours":
	
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        var dHourStr,
	          dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	
	// [function BarChartTips(tipNodes, obj) {
	
	// }
	
	module.exports = tipsManager;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Social module.
	 * @module charts/components/social
	 */
	
	/*
	This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
	 */
	
	var getThumbnail = __webpack_require__(4).getThumbnailPath;
	
	function socialComponent(node, obj) {
	
		var socialOptions = [];
	
		for (var prop in obj.social) {
			if (obj.social[prop]) {
				switch (obj.social[prop].label) {
					case "Twitter":
						obj.social[prop].url = constructTwitterURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Facebook":
						obj.social[prop].url = constructFacebookURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Email":
						obj.social[prop].url = constructMailURL(obj);
						obj.social[prop].popup = false;
						break;
					case "SMS":
						obj.social[prop].url = constructSMSURL(obj);
						obj.social[prop].popup = false;
						break;
					default:
						console.log('INCORRECT SOCIAL ITEM DEFINITION')
				}
				socialOptions.push(obj.social[prop]);
			}
		}
	
		var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartSocialBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('share');
	
		var chartSocial = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_social');
	
		var chartSocialCloseBtn = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_close')
			.html('&#xd7;');
	
		var chartSocialOptions = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_options');
	
		chartSocialOptions
			.append('h3')
			.html('Share this chart:');
	
		chartSocialBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', true);
		});
	
		chartSocialCloseBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', false);
		});
	
		var itemAmount = socialOptions.length;
	
		for(var i = 0; i < itemAmount; i++ ) {
			chartSocialOptions
				.selectAll('.' + obj.prefix + 'social-item')
				.data(socialOptions)
				.enter()
				.append('div')
				.attr('class', obj.prefix + 'social-item').html(function(d) {
					if (!d.popup) {
						return '<a href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					} else {
						return '<a class="' + obj.prefix + 'js-share" href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					}
				});
		}
	
	  if (obj.image && obj.image.enable) {
	    chartSocialOptions
	      .append('div')
	      .attr('class', obj.prefix + 'image-url')
	      .attr('contentEditable', 'true')
	      .html(getThumbnail(obj));
	  }
	
		var sharePopup = document.querySelectorAll("." + obj.prefix + "js-share");
	
	  if (sharePopup) {
	    [].forEach.call(sharePopup, function(anchor) {
	      anchor.addEventListener("click", function(e) {
	        e.preventDefault();
	        windowPopup(this.href, 600, 620);
	      });
	    });
	  }
	
		return {
			meta_nav: chartMeta
		};
	
	}
	
	// social popup
	function windowPopup(url, width, height) {
	  // calculate the position of the popup so it’s centered on the screen.
	  var left = (screen.width / 2) - (width / 2),
	      top = (screen.height / 2) - (height / 2);
	  window.open(
	    url,
	    "",
	    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
	  );
	}
	
	function constructFacebookURL(obj){
	  var base = 'https://www.facebook.com/dialog/share?',
	      redirect = obj.social.facebook.redirect,
	      url = 'app_id=' + obj.social.facebook.appID + '&amp;display=popup&amp;title=' + obj.heading + '&amp;description=From%20article' + document.title + '&amp;href=' + window.location.href + '&amp;redirect_uri=' + redirect;
	  if (obj.image && obj.image.enable) {  url += '&amp;picture=' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructMailURL(obj){
	  var base = 'mailto:?';
	  var thumbnail = (obj.image && obj.image.enable) ? '%0A' + getThumbnail(obj) : "";
	  return base + 'subject=' + obj.heading + '&amp;body=' + obj.heading + thumbnail + '%0Afrom article: ' + document.title + '%0A' + window.location.href;
	}
	
	function constructSMSURL(obj){
	  var base = 'sms:',
	      url = '&body=Check%20out%20this%20chart: ' + obj.heading;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructTwitterURL(obj){
	  var base = 'https://twitter.com/intent/tweet?',
	      hashtag = !!(obj.social.twitter.hashtag) ? '&amp;hashtags=' + obj.social.twitter.hashtag : "",
	      via = !!(obj.social.twitter.via) ? '&amp;via=' + obj.social.twitter.via : "",
	      url = 'url=' + window.location.href  + via + '&amp;text=' + encodeURI(obj.heading) + hashtag;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	module.exports = socialComponent;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Sharing Data module.
	 * @module charts/components/share-data
	 */
	
	/*
	This component adds a "data" button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded
	 */
	
	function shareDataComponent(node, obj) {
	
	 	var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartDataBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('data');
	
		var chartData = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_data');
	
		var chartDataCloseBtn = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_close')
			.html('&#xd7;');
	
		var chartDataTable = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_inner');
	
		chartData
			.append('h2')
			.html(obj.heading);
	
		var chartDataNav = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_nav');
	
		var csvDLBtn = chartDataNav
			.append('a')
			.attr('class', obj.prefix + 'chart_data_btn csv')
			.html('download csv');
	
	  var csvToTable = __webpack_require__(4).csvToTable;
	
		csvToTable(chartDataTable, obj.data.csv);
	
		chartDataBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', true);
		});
	
		chartDataCloseBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', false);
		});
	
		csvDLBtn.on('click',function() {
		  var dlData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj.data.csv);
		  d3.select(this)
		  	.attr('href', dlData)
		  	.attr('download','data_' + obj.id + '.csv');
		});
	
		return {
			meta_nav: chartMeta,
			data_panel: chartData
		};
	
	}
	
	module.exports = shareDataComponent;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * Custom code function that can be invoked to modify chart elements after chart drawing has occurred.
	 * @param  {Object} node         The main container group for the chart.
	 * @param  {Object} chartRecipe  Object that contains settings for the chart.
	 * @param  {Object} rendered     An object containing references to all rendered chart elements, including axes, scales, paths, nodes, and so forth.
	 * @return {Object}              Optional.
	 */
	function custom(node, chartRecipe, rendered) {
	
	  // With this function, you can access all elements of a chart and modify
	  // them at will. For instance: you might want to play with colour
	  // interpolation for a multi-series line chart, or modify the width and position
	  // of the x- and y-axis ticks. With this function, you can do all that!
	
	  // If you can, it's good Chart Tool practice to return references to newly
	  // created nodes and d3 objects so they be accessed later — by a dispatcher
	  // event, for instance.
	  return;
	
	}
	
	module.exports = custom;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWM0NTg5NWZhOTdiYmIyOTQ0MjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0IsT0FBTztB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QUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFD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OztBQUVBOzs7Ozs7O0FDcENBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDeEZBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ2xEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUNBQW9DLG1DQUFtQyxVQUFVLEVBQUU7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUEsMENBQXlDLFFBQVE7QUFDakQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUE4QixnQ0FBZ0MsRUFBRTtBQUNoRSx5QkFBd0Isc0JBQXNCLEVBQUU7QUFDaEQseUJBQXdCLGdDQUFnQyxFQUFFOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDJCQUEwQixvREFBb0QsRUFBRTtBQUNoRixxQkFBb0Isc0JBQXNCLEVBQUU7QUFDNUMscUJBQW9CLG9EQUFvRCxFQUFFOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDL0ZBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLDJCQUEwQiw4QkFBOEI7O0FBRXhEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMEJBQXlCLFVBQVUsRUFBRTtBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUEsdUNBQXNDLG1DQUFtQzs7QUFFekU7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixhQUFhLEVBQUU7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QUFDakM7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQzlFQTtBQUNBO0FBQ0EsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEseUIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxYzQ1ODk1ZmE5N2JiYjI5NDQyOFxuICoqLyIsIi8qKlxuICogQ2hhcnQgVG9vbFxuICogQGF1dGhvciBKZXJlbXkgQWdpdXMgPGphZ2l1c0BnbG9iZWFuZG1haWwuY29tPlxuICogQGF1dGhvciBUb20gQ2FyZG9zbyA8dGNhcmRvc29AZ2xvYmVhbmRtYWlsLmNvbT5cbiAqIEBhdXRob3IgTWljaGFlbCBQZXJlaXJhIDxtcGVyZWlyYUBnbG9iZWFuZG1haWwuY29tPlxuICogQHNlZSB7QGxpbmt9IGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICogQHNlZSB7QGxpbmsgaHR0cDovL3d3dy5naXRodWIuY29tL2dsb2JlYW5kbWFpbC9jaGFydC10b29sfENoYXJ0IFRvb2x9XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gQ2hhcnRUb29sSW5pdChyb290KSB7XG5cbiAgaWYgKHJvb3QuZDMpIHtcblxuICAgIHZhciBDaGFydFRvb2wgPSAoZnVuY3Rpb24gQ2hhcnRUb29sKCkge1xuXG4gICAgICB2YXIgY2hhcnRzID0gcm9vdC5fX2NoYXJ0dG9vbCB8fCBbXSxcbiAgICAgICAgICBkaXNwYXRjaEZ1bmN0aW9ucyA9IHJvb3QuX19jaGFydHRvb2xkaXNwYXRjaGVyIHx8IFtdLFxuICAgICAgICAgIGRyYXduID0gW107XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NvbmZpZy9jaGFydC1zZXR0aW5nc1wiKSxcbiAgICAgICAgICB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzL3V0aWxzXCIpO1xuXG4gICAgICB2YXIgZGlzcGF0Y2hlciA9IGQzLmRpc3BhdGNoKFwic3RhcnRcIiwgXCJmaW5pc2hcIiwgXCJyZWRyYXdcIiwgXCJtb3VzZU92ZXJcIiwgXCJtb3VzZU1vdmVcIiwgXCJtb3VzZU91dFwiLCBcImNsaWNrXCIpO1xuXG4gICAgICBmb3IgKHZhciBwcm9wIGluIGRpc3BhdGNoRnVuY3Rpb25zKSB7XG4gICAgICAgIGlmIChkaXNwYXRjaEZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIGlmIChkMy5rZXlzKGRpc3BhdGNoZXIpLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5vbihwcm9wLCBkaXNwYXRjaEZ1bmN0aW9uc1twcm9wXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2hhcnQgVG9vbCBkb2VzIG5vdCBvZmZlciBhIGRpc3BhdGNoZXIgb2YgdHlwZSAnXCIgKyBwcm9wICsgXCInLiBGb3IgYXZhaWxhYmxlIGRpc3BhdGNoZXIgdHlwZXMsIHBsZWFzZSBzZWUgdGhlIENoYXJ0VG9vbC5kaXNwYXRjaCgpIG1ldGhvZC5cIiA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2xlYXJzIHByZXZpb3VzIGl0ZXJhdGlvbnMgb2YgY2hhcnQgb2JqZWN0cyBzdG9yZWQgaW4gb2JqIG9yIHRoZSBkcmF3biBhcnJheSwgdGhlbiBwdW50cyBjaGFydCBjb25zdHJ1Y3Rpb24gdG8gdGhlIENoYXJ0IE1hbmFnZXIuXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGNvbnRhaW5lciBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGNvbnRhaW5lcidzIHNlbGVjdG9yLlxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogICAgICAgVGhlIGNoYXJ0IElEIGFuZCBlbWJlZCBkYXRhLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaikge1xuXG4gICAgICAgIGRpc3BhdGNoZXIuc3RhcnQob2JqKTtcblxuICAgICAgICBkcmF3biA9IHV0aWxzLmNsZWFyRHJhd24oZHJhd24sIG9iaik7XG4gICAgICAgIG9iaiA9IHV0aWxzLmNsZWFyT2JqKG9iaik7XG4gICAgICAgIGNvbnRhaW5lciA9IHV0aWxzLmNsZWFyQ2hhcnQoY29udGFpbmVyKTtcblxuICAgICAgICB2YXIgQ2hhcnRNYW5hZ2VyID0gcmVxdWlyZShcIi4vY2hhcnRzL21hbmFnZXJcIik7XG5cbiAgICAgICAgb2JqLmRhdGEud2lkdGggPSB1dGlscy5nZXRCb3VuZGluZyhjb250YWluZXIsIFwid2lkdGhcIik7XG4gICAgICAgIG9iai5kaXNwYXRjaCA9IGRpc3BhdGNoZXI7XG5cbiAgICAgICAgdmFyIGNoYXJ0T2JqO1xuXG4gICAgICAgIGlmICh1dGlscy5zdmdUZXN0KHJvb3QpKSB7XG4gICAgICAgICAgY2hhcnRPYmogPSBDaGFydE1hbmFnZXIoY29udGFpbmVyLCBvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHV0aWxzLmdlbmVyYXRlVGh1bWIoY29udGFpbmVyLCBvYmosIHNldHRpbmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXduLnB1c2goeyBpZDogb2JqLmlkLCBjaGFydE9iajogY2hhcnRPYmogfSk7XG4gICAgICAgIG9iai5jaGFydE9iaiA9IGNoYXJ0T2JqO1xuXG4gICAgICAgIGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7IGRpc3BhdGNoZXIuY2xpY2sodGhpcywgY2hhcnRPYmopOyB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5tb3VzZU92ZXIodGhpcywgY2hhcnRPYmopOyB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5tb3VzZU1vdmUodGhpcywgY2hhcnRPYmopOyAgfSlcbiAgICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5tb3VzZU91dCh0aGlzLCBjaGFydE9iaik7IH0pO1xuXG4gICAgICAgIGRpc3BhdGNoZXIuZmluaXNoKGNoYXJ0T2JqKTtcblxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEdyYWJzIGRhdGEgb24gYSBjaGFydCBiYXNlZCBvbiBhbiBJRC5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNoYXJ0cyBBcnJheSBvZiBjaGFydHMgb24gdGhlIHBhZ2UuXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIGNoYXJ0LlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICBSZXR1cm5zIHN0b3JlZCBlbWJlZCBvYmplY3QuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlYWRDaGFydChpZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICBpZiAoY2hhcnRzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0c1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogTGlzdCBhbGwgdGhlIGNoYXJ0cyBzdG9yZWQgaW4gdGhlIENoYXJ0IFRvb2wgYnkgY2hhcnRpZC5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNoYXJ0cyBBcnJheSBvZiBjaGFydHMgb24gdGhlIHBhZ2UuXG4gICAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgTGlzdCBvZiBjaGFydGlkJ3MuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGxpc3RDaGFydHMoY2hhcnRzKSB7XG4gICAgICAgIHZhciBjaGFydHNBcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjaGFydHNBcnIucHVzaChjaGFydHNbaV0uaWQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY2hhcnRzQXJyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB1cGRhdGVDaGFydChpZCwgb2JqKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSAnLicgKyBzZXR0aW5ncy5iYXNlQ2xhc3MoKSArICdbZGF0YS1jaGFydGlkPScgKyBzZXR0aW5ncy5wcmVmaXggKyBpZCArICddJztcbiAgICAgICAgY3JlYXRlQ2hhcnQoY29udGFpbmVyLCB7IGlkOiBpZCwgZGF0YTogb2JqIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95Q2hhcnQoaWQpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciwgb2JqO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChjaGFydHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICBvYmogPSBjaGFydHNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb250YWluZXIgPSAnLicgKyBzZXR0aW5ncy5iYXNlQ2xhc3MoKSArICdbZGF0YS1jaGFydGlkPScgKyBvYmouaWQgKyAnXSc7XG4gICAgICAgIHV0aWxzLmNsZWFyRHJhd24oZHJhd24sIG9iaik7XG4gICAgICAgIHV0aWxzLmNsZWFyT2JqKG9iaik7XG4gICAgICAgIHV0aWxzLmNsZWFyQ2hhcnQoY29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSBjaGFydHMsIGRyYXcgZWFjaCBjaGFydCBpbnRvIGl0cyByZXNwZWN0aXZlIGNvbnRhaW5lci5cbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGNoYXJ0cyBBcnJheSBvZiBjaGFydHMgb24gdGhlIHBhZ2UuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUxvb3AoY2hhcnRzKSB7XG4gICAgICAgIHZhciBjaGFydExpc3QgPSBsaXN0Q2hhcnRzKGNoYXJ0cyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIG9iaiA9IHJlYWRDaGFydChjaGFydExpc3RbaV0pO1xuICAgICAgICAgIHZhciBjb250YWluZXIgPSAnLicgKyBzZXR0aW5ncy5iYXNlQ2xhc3MoKSArICdbZGF0YS1jaGFydGlkPScgKyBjaGFydExpc3RbaV0gKyAnXSc7XG4gICAgICAgICAgY3JlYXRlQ2hhcnQoY29udGFpbmVyLCBvYmopO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENoYXJ0IFRvb2wgaW5pdGlhbGl6ZXIgd2hpY2ggc2V0cyB1cCBkZWJvdW5jaW5nIGFuZCBydW5zIHRoZSBjcmVhdGVMb29wKCkuIFJ1biBvbmx5IG9uY2UsIHdoZW4gdGhlIGxpYnJhcnkgaXMgZmlyc3QgbG9hZGVkLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gaW5pdGlhbGl6ZXIoY2hhcnRzKSB7XG4gICAgICAgIGNyZWF0ZUxvb3AoY2hhcnRzKTtcbiAgICAgICAgdmFyIGRlYm91bmNlID0gdXRpbHMuZGVib3VuY2UoY3JlYXRlTG9vcCwgY2hhcnRzLCBzZXR0aW5ncy5kZWJvdW5jZSwgcm9vdCk7XG4gICAgICAgIGQzLnNlbGVjdChyb290KVxuICAgICAgICAgIC5vbigncmVzaXplLicgKyBzZXR0aW5ncy5wcmVmaXggKyAnZGVib3VuY2UnLCBkZWJvdW5jZSlcbiAgICAgICAgICAub24oJ3Jlc2l6ZS4nICsgc2V0dGluZ3MucHJlZml4ICsgJ3JlZHJhdycsIGRpc3BhdGNoZXIucmVkcmF3KGNoYXJ0cykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyKGNoYXJ0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUoY29udGFpbmVyLCBvYmopIHtcbiAgICAgICAgICByZXR1cm4gY3JlYXRlQ2hhcnQoY29udGFpbmVyLCBvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoaWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZENoYXJ0KGlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsaXN0OiBmdW5jdGlvbiBsaXN0KCkge1xuICAgICAgICAgIHJldHVybiBsaXN0Q2hhcnRzKGNoYXJ0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoaWQsIG9iaikge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVDaGFydChpZCwgb2JqKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc3Ryb3lDaGFydChpZCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICAgICAgICAgIHJldHVybiBkMy5rZXlzKGRpc3BhdGNoZXIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdhdDogZnVuY3Rpb24gd2F0KCkge1xuICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkNoYXJ0VG9vbCB2XCIgKyBzZXR0aW5ncy52ZXJzaW9uICsgXCIgaXMgYSBmcmVlLCBvcGVuLXNvdXJjZSBjaGFydCBnZW5lcmF0b3IgYW5kIGZyb250LWVuZCBsaWJyYXJ5IG1haW50YWluZWQgYnkgVGhlIEdsb2JlIGFuZCBNYWlsLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgY2hlY2sgb3V0IG91ciBHaXRIdWIgcmVwbzogd3d3LmdpdGh1Yi5jb20vZ2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2xcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmVyc2lvbjogc2V0dGluZ3MudmVyc2lvbixcbiAgICAgICAgYnVpbGQ6IHNldHRpbmdzLmJ1aWxkLFxuICAgICAgICBzZXR0aW5nczogcmVxdWlyZShcIi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgICBjaGFydHM6IHJlcXVpcmUoXCIuL2NoYXJ0cy9tYW5hZ2VyXCIpLFxuICAgICAgICBjb21wb25lbnRzOiByZXF1aXJlKFwiLi9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzXCIpLFxuICAgICAgICBoZWxwZXJzOiByZXF1aXJlKFwiLi9oZWxwZXJzL2hlbHBlcnNcIiksXG4gICAgICAgIHV0aWxzOiByZXF1aXJlKFwiLi91dGlscy91dGlsc1wiKSxcbiAgICAgICAgbGluZTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2xpbmVcIiksXG4gICAgICAgIGFyZWE6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9hcmVhXCIpLFxuICAgICAgICBtdWx0aWxpbmU6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9tdWx0aWxpbmVcIiksXG4gICAgICAgIHN0YWNrZWRBcmVhOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvc3RhY2tlZC1hcmVhXCIpLFxuICAgICAgICBjb2x1bW46IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9jb2x1bW5cIiksXG4gICAgICAgIHN0YWNrZWRDb2x1bW46IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9zdGFja2VkLWNvbHVtblwiKSxcbiAgICAgICAgc3RyZWFtZ3JhcGg6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9zdHJlYW1ncmFwaFwiKSxcbiAgICAgICAgYmFyOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvYmFyXCIpXG5cbiAgICAgIH1cblxuICAgIH0pKCk7XG5cbiAgICBpZiAoIXJvb3QuTWV0ZW9yKSB7IENoYXJ0VG9vbC5pbml0KCk7IH1cblxuICB9IGVsc2Uge1xuXG4gICAgdmFyIE1ldGVvciA9IHRoaXMuTWV0ZW9yIHx8IHt9LFxuICAgICAgICBpc1NlcnZlciA9IE1ldGVvci5pc1NlcnZlciB8fCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWlzU2VydmVyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ2hhcnQgVG9vbDogbm8gRDMgbGlicmFyeSBkZXRlY3RlZC5cIik7XG4gICAgfVxuXG5cbiAgfVxuXG4gIHJvb3QuQ2hhcnRUb29sID0gQ2hhcnRUb29sO1xuXG59KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdGhpcyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHZlcnNpb24gPSB7XG4gIHZlcnNpb246IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9uLFxuICBidWlsZDogcmVxdWlyZShcImpzb24hLi4vLi4vLi4vcGFja2FnZS5qc29uXCIpLmJ1aWxkdmVyXG59O1xuXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgQ1VTVE9NOiBzZXR0aW5ncy5DVVNUT00sXG4gIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgYnVpbGQ6IHZlcnNpb24uYnVpbGQsXG4gIGlkOiBcIlwiLFxuICBkYXRhOiBcIlwiLFxuICBkYXRlRm9ybWF0OiBzZXR0aW5ncy5kYXRlRm9ybWF0LFxuICB0aW1lRm9ybWF0OiBzZXR0aW5ncy50aW1lRm9ybWF0LFxuICBpbWFnZTogc2V0dGluZ3MuaW1hZ2UsXG4gIGhlYWRpbmc6IFwiXCIsXG4gIHF1YWxpZmllcjogXCJcIixcbiAgc291cmNlOiBcIlwiLFxuICBkZWNrOiBcIlwiLFxuICBpbmRleDogXCJcIixcbiAgaGFzSG91cnM6IGZhbHNlLFxuICBzb2NpYWw6IHNldHRpbmdzLnNvY2lhbCxcbiAgc2VyaWVzSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNlcmllc0Ftb3VudCAmJiB0aGlzLmRhdGEuc2VyaWVzQW1vdW50IDw9IDEpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gIGJhc2VDbGFzczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnByZWZpeCArIFwiY2hhcnRcIjsgfSxcbiAgY3VzdG9tQ2xhc3M6IFwiXCIsXG5cbiAgb3B0aW9uczoge1xuICAgIHR5cGU6IFwibGluZVwiLFxuICAgIGludGVycG9sYXRpb246IFwibGluZWFyXCIsXG4gICAgc3RhY2tlZDogZmFsc2UsXG4gICAgZXhwYW5kZWQ6IGZhbHNlLFxuICAgIGhlYWQ6IHRydWUsXG4gICAgZGVjazogZmFsc2UsXG4gICAgcXVhbGlmaWVyOiB0cnVlLFxuICAgIGxlZ2VuZDogdHJ1ZSxcbiAgICBmb290ZXI6IHRydWUsXG4gICAgeF9heGlzOiB0cnVlLFxuICAgIHlfYXhpczogdHJ1ZSxcbiAgICB0aXBzOiBmYWxzZSxcbiAgICBhbm5vdGF0aW9uczogZmFsc2UsXG4gICAgcmFuZ2U6IGZhbHNlLFxuICAgIHNlcmllczogZmFsc2UsXG4gICAgc2hhcmVfZGF0YTogdHJ1ZSxcbiAgICBzb2NpYWw6IHRydWVcbiAgfSxcblxuICByYW5nZToge30sXG4gIHNlcmllczoge30sXG4gIHhBeGlzOiBzZXR0aW5ncy54QXhpcyxcbiAgeUF4aXM6IHNldHRpbmdzLnlBeGlzLFxuXG4gIGV4cG9ydGFibGU6IGZhbHNlLCAvLyB0aGlzIGNhbiBiZSBvdmVyd3JpdHRlbiBieSB0aGUgYmFja2VuZCBhcyBuZWVkZWRcbiAgZWRpdGFibGU6IGZhbHNlLFxuXG4gIHByZWZpeDogc2V0dGluZ3MucHJlZml4LFxuICBkZWJvdW5jZTogc2V0dGluZ3MuZGVib3VuY2UsXG4gIHRpcFRpbWVvdXQ6IHNldHRpbmdzLnRpcFRpbWVvdXQsXG4gIG1vbnRoc0Ficjogc2V0dGluZ3MubW9udGhzQWJyLFxuXG4gIGRpbWVuc2lvbnM6IHtcbiAgICB3aWR0aDogMCxcbiAgICBjb21wdXRlZFdpZHRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoIC0gdGhpcy5tYXJnaW4ubGVmdCAtIHRoaXMubWFyZ2luLnJpZ2h0O1xuICAgIH0sXG4gICAgaGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByYXRpb1NjYWxlID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoWzMwMCwgOTAwXSkuZG9tYWluKFt0aGlzLndpZHRoICogdGhpcy5yYXRpb01vYmlsZSwgdGhpcy53aWR0aCAqIHRoaXMucmF0aW9EZXNrdG9wXSk7XG4gICAgICByZXR1cm4gTWF0aC5yb3VuZChyYXRpb1NjYWxlKHRoaXMud2lkdGgpKTtcbiAgICB9LFxuICAgIGNvbXB1dGVkSGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5oZWlnaHQoKSAtIHRoaXMuaGVhZGVySGVpZ2h0IC0gdGhpcy5mb290ZXJIZWlnaHQgLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b20pO1xuICAgIH0sXG4gICAgcmF0aW9Nb2JpbGU6IHNldHRpbmdzLnJhdGlvTW9iaWxlLFxuICAgIHJhdGlvRGVza3RvcDogc2V0dGluZ3MucmF0aW9EZXNrdG9wLFxuICAgIG1hcmdpbjogc2V0dGluZ3MubWFyZ2luLFxuICAgIHRpcFBhZGRpbmc6IHNldHRpbmdzLnRpcFBhZGRpbmcsXG4gICAgdGlwT2Zmc2V0OiBzZXR0aW5ncy50aXBPZmZzZXQsXG4gICAgaGVhZGVySGVpZ2h0OiAwLFxuICAgIGZvb3RlckhlaWdodDogMCxcbiAgICB4QXhpc0hlaWdodDogMCxcbiAgICB5QXhpc0hlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHRoaXMuY29tcHV0ZWRIZWlnaHQoKSAtIHRoaXMueEF4aXNIZWlnaHQpO1xuICAgIH0sXG4gICAgeEF4aXNXaWR0aDogMCxcbiAgICBsYWJlbFdpZHRoOiAwLFxuICAgIHlBeGlzUGFkZGluZ1JpZ2h0OiBzZXR0aW5ncy55QXhpcy5wYWRkaW5nUmlnaHQsXG4gICAgdGlja1dpZHRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5jb21wdXRlZFdpZHRoKCkgLSAodGhpcy5sYWJlbFdpZHRoICsgdGhpcy55QXhpc1BhZGRpbmdSaWdodCkpO1xuICAgIH0sXG4gICAgYmFySGVpZ2h0OiBzZXR0aW5ncy5iYXJIZWlnaHQsXG4gICAgYmFuZHM6IHtcbiAgICAgIHBhZGRpbmc6IHNldHRpbmdzLmJhbmRzLnBhZGRpbmcsXG4gICAgICBvZmZzZXQ6IHNldHRpbmdzLmJhbmRzLm9mZnNldCxcbiAgICAgIG91dGVyUGFkZGluZzogc2V0dGluZ3MuYmFuZHMub3V0ZXJQYWRkaW5nXG4gICAgfVxuICB9XG5cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NvbmZpZy9jaGFydC1zZXR0aW5ncy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIm5hbWVcIjogXCJjaGFydC10b29sXCIsXG5cdFwidmVyc2lvblwiOiBcIjEuMS4wXCIsXG5cdFwiYnVpbGRWZXJcIjogXCI1XCIsXG5cdFwiZGVzY3JpcHRpb25cIjogXCJBIHJlc3BvbnNpdmUgY2hhcnRpbmcgYXBwbGljYXRpb25cIixcblx0XCJtYWluXCI6IFwiZ3VscGZpbGUuanNcIixcblx0XCJkZXBlbmRlbmNpZXNcIjoge30sXG5cdFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcImJyb3dzZXItc3luY1wiOiBcIl4yLjguMFwiLFxuXHRcdFwiZ3VscFwiOiBcIl4zLjguMTFcIixcblx0XHRcImd1bHAtY2xlYW5cIjogXCJeMC4zLjFcIixcblx0XHRcImd1bHAtanNvbi1lZGl0b3JcIjogXCJeMi4yLjFcIixcblx0XHRcImd1bHAtbWluaWZ5LWNzc1wiOiBcIl4xLjIuMFwiLFxuXHRcdFwiZ3VscC1yZW5hbWVcIjogXCJeMS4yLjJcIixcblx0XHRcImd1bHAtcmVwbGFjZVwiOiBcIl4wLjUuM1wiLFxuXHRcdFwiZ3VscC1zYXNzXCI6IFwiXjIuMC40XCIsXG5cdFx0XCJndWxwLXNoZWxsXCI6IFwiXjAuNC4yXCIsXG5cdFx0XCJndWxwLXNvdXJjZW1hcHNcIjogXCJeMS41LjJcIixcblx0XHRcImd1bHAtdXRpbFwiOiBcIl4zLjAuNlwiLFxuXHRcdFwianNkb2NcIjogXCJeMy4zLjJcIixcblx0XHRcImpzb24tbG9hZGVyXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJydW4tc2VxdWVuY2VcIjogXCJeMS4xLjRcIixcblx0XHRcIndlYnBhY2tcIjogXCJeMS4xMi4xNFwiLFxuXHRcdFwid2VicGFjay1zdHJlYW1cIjogXCJeMy4xLjBcIixcblx0XHRcInlhcmdzXCI6IFwiXjMuMTUuMFwiXG5cdH0sXG5cdFwic2NyaXB0c1wiOiB7XG5cdFx0XCJ0ZXN0XCI6IFwiXCJcblx0fSxcblx0XCJrZXl3b3Jkc1wiOiBbXG5cdFx0XCJjaGFydHNcIixcblx0XHRcImQzXCIsXG5cdFx0XCJkM2pzXCIsXG5cdFx0XCJtZXRlb3JcIixcblx0XHRcImd1bHBcIixcblx0XHRcIndlYnBhY2tcIixcblx0XHRcImRhdGEgdmlzdWFsaXphdGlvblwiLFxuXHRcdFwiY2hhcnRcIixcblx0XHRcIm1vbmdvXCJcblx0XSxcblx0XCJyZXBvc2l0b3J5XCI6IHtcblx0XHRcInR5cGVcIjogXCJnaXRcIixcblx0XHRcInVybFwiOiBcImdpdEBnaXRodWIuY29tOmdsb2JlYW5kbWFpbC9jaGFydC10b29sLmdpdFwiXG5cdH0sXG5cdFwiY29udHJpYnV0b3JzXCI6IFtcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIlRvbSBDYXJkb3NvXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwidGNhcmRvc29AZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcImF1dGhvclwiOiBcIkplcmVteSBBZ2l1c1wiLFxuXHRcdFx0XCJlbWFpbFwiOiBcImphZ2l1c0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiTWljaGFlbCBQZXJlaXJhXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwibXBlcmVpcmFAZ2xvYmVhbmRtYWlsLmNvbVwiXG5cdFx0fVxuXHRdLFxuXHRcImxpY2Vuc2VcIjogXCJNSVRcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3BhY2thZ2UuanNvblxuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiQ1VTVE9NXCI6IGZhbHNlLFxuXHRcInByZWZpeFwiOiBcImN0LVwiLFxuXHRcIm1vbnRoc0FiclwiOiBbXG5cdFx0XCJKYW4uXCIsXG5cdFx0XCJGZWIuXCIsXG5cdFx0XCJNYXIuXCIsXG5cdFx0XCJBcHIuXCIsXG5cdFx0XCJNYWpcIixcblx0XHRcIkp1bmlcIixcblx0XHRcIkp1bGlcIixcblx0XHRcIkF1Zy5cIixcblx0XHRcIlNlcHQuXCIsXG5cdFx0XCJPa3QuXCIsXG5cdFx0XCJOb3YuXCIsXG5cdFx0XCJEZWMuXCIsXG5cdFx0XCJKYW4uXCJcblx0XSxcblx0XCJkZWJvdW5jZVwiOiA1MDAsXG5cdFwidGlwVGltZW91dFwiOiA1MDAwLFxuXHRcInJhdGlvTW9iaWxlXCI6IDEuMTUsXG5cdFwicmF0aW9EZXNrdG9wXCI6IDAuNjUsXG5cdFwiZGF0ZUZvcm1hdFwiOiBcIiVZLSVtLSVkXCIsXG5cdFwidGltZUZvcm1hdFwiOiBcIiVIOiVNXCIsXG5cdFwibWFyZ2luXCI6IHtcblx0XHRcInRvcFwiOiAxMCxcblx0XHRcInJpZ2h0XCI6IDMsXG5cdFx0XCJib3R0b21cIjogMCxcblx0XHRcImxlZnRcIjogMFxuXHR9LFxuXHRcInRpcE9mZnNldFwiOiB7XG5cdFx0XCJ2ZXJ0aWNhbFwiOiA0LFxuXHRcdFwiaG9yaXpvbnRhbFwiOiAxXG5cdH0sXG5cdFwidGlwUGFkZGluZ1wiOiB7XG5cdFx0XCJ0b3BcIjogNCxcblx0XHRcInJpZ2h0XCI6IDksXG5cdFx0XCJib3R0b21cIjogNCxcblx0XHRcImxlZnRcIjogOVxuXHR9LFxuXHRcInlBeGlzXCI6IHtcblx0XHRcImRpc3BsYXlcIjogdHJ1ZSxcblx0XHRcInNjYWxlXCI6IFwibGluZWFyXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcInJpZ2h0XCIsXG5cdFx0XCJmb3JtYXRcIjogXCJjb21tYVwiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiB0cnVlLFxuXHRcdFwicGFkZGluZ1JpZ2h0XCI6IDksXG5cdFx0XCJ0aWNrTG93ZXJCb3VuZFwiOiAzLFxuXHRcdFwidGlja1VwcGVyQm91bmRcIjogOCxcblx0XHRcInRpY2tHb2FsXCI6IDUsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiBcIlwiLFxuXHRcdFwidGV4dFhcIjogMCxcblx0XHRcInRleHRZXCI6IFwiXCJcblx0fSxcblx0XCJ4QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcInRpbWVcIixcblx0XHRcInRpY2tzXCI6IFwiYXV0b1wiLFxuXHRcdFwib3JpZW50XCI6IFwiYm90dG9tXCIsXG5cdFx0XCJmb3JtYXRcIjogXCJhdXRvXCIsXG5cdFx0XCJwcmVmaXhcIjogXCJcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiLFxuXHRcdFwibWluXCI6IFwiXCIsXG5cdFx0XCJtYXhcIjogXCJcIixcblx0XHRcInJlc2NhbGVcIjogZmFsc2UsXG5cdFx0XCJuaWNlXCI6IGZhbHNlLFxuXHRcdFwicmFuZ2VQb2ludHNcIjogMSxcblx0XHRcInRpY2tUYXJnZXRcIjogNixcblx0XHRcInRpY2tzU21hbGxcIjogNCxcblx0XHRcIndpZHRoVGhyZXNob2xkXCI6IDQyMCxcblx0XHRcImR5XCI6IDAuNyxcblx0XHRcImJhck9mZnNldFwiOiA5LFxuXHRcdFwidXBwZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDcsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDdcblx0XHR9LFxuXHRcdFwibG93ZXJcIjoge1xuXHRcdFx0XCJ0aWNrSGVpZ2h0XCI6IDEyLFxuXHRcdFx0XCJ0ZXh0WFwiOiA2LFxuXHRcdFx0XCJ0ZXh0WVwiOiAyXG5cdFx0fVxuXHR9LFxuXHRcImJhckhlaWdodFwiOiAzMCxcblx0XCJiYW5kc1wiOiB7XG5cdFx0XCJwYWRkaW5nXCI6IDAuMDYsXG5cdFx0XCJvZmZzZXRcIjogMC4xMixcblx0XHRcIm91dGVyUGFkZGluZ1wiOiAwLjAzXG5cdH0sXG5cdFwic291cmNlXCI6IHtcblx0XHRcInByZWZpeFwiOiBcIklORk9STUFUSU9OLkRLXCIsXG5cdFx0XCJzdWZmaXhcIjogXCIgPiBLSUxERTpcIlxuXHR9LFxuXHRcInNvY2lhbFwiOiB7XG5cdFx0XCJmYWNlYm9va1wiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiRmFjZWJvb2tcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS1zb2NpYWwtZmFjZWJvb2suc3ZnXCIsXG5cdFx0XHRcInJlZGlyZWN0XCI6IFwiXCIsXG5cdFx0XHRcImFwcElEXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwidHdpdHRlclwiOiB7XG5cdFx0XHRcImxhYmVsXCI6IFwiVHdpdHRlclwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC10d2l0dGVyLnN2Z1wiLFxuXHRcdFx0XCJ2aWFcIjogXCJcIixcblx0XHRcdFwiaGFzaHRhZ1wiOiBcIlwiXG5cdFx0fSxcblx0XHRcImVtYWlsXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJFbWFpbFwiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLW1haWwuc3ZnXCJcblx0XHR9LFxuXHRcdFwic21zXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJTTVNcIixcblx0XHRcdFwiaWNvblwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2ZvdW5kaWNvbnMvMy4wLjAvc3Zncy9maS10ZWxlcGhvbmUuc3ZnXCJcblx0XHR9XG5cdH0sXG5cdFwiaW1hZ2VcIjoge1xuXHRcdFwiZW5hYmxlXCI6IGZhbHNlLFxuXHRcdFwiYmFzZV9wYXRoXCI6IFwiXCIsXG5cdFx0XCJleHBpcmF0aW9uXCI6IDMwMDAwLFxuXHRcdFwiZmlsZW5hbWVcIjogXCJ0aHVtYm5haWxcIixcblx0XHRcImV4dGVuc2lvblwiOiBcInBuZ1wiLFxuXHRcdFwidGh1bWJuYWlsV2lkdGhcIjogNDYwXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9jdXN0b20vY2hhcnQtdG9vbC1jb25maWcuanNvblxuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBVdGlsaXRpZXMgbW9kdWxlLiBGdW5jdGlvbnMgdGhhdCBhcmVuJ3Qgc3BlY2lmaWMgdG8gYW55IG9uZSBtb2R1bGUuXG4gKiBAbW9kdWxlIHV0aWxzL3V0aWxzXG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIGZ1bmN0aW9uIHRvIHBlcmZvcm0sIGEgdGltZW91dCBwZXJpb2QsIGEgcGFyYW1ldGVyIHRvIHBhc3MgdG8gdGhlIHBlcmZvcm1lZCBmdW5jdGlvbiwgYW5kIGEgcmVmZXJlbmNlIHRvIHRoZSB3aW5kb3csIGZpcmUgYSBzcGVjaWZpYyBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgIEZ1bmN0aW9uIHRvIHBlcmZvcm0gb24gZGVib3VuY2UuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgIE9iamVjdCBwYXNzZWQgdG8gRnVuY3Rpb24gd2hpY2ggaXMgcGVyZm9ybWVkIG9uIGRlYm91bmNlLlxuICogQHBhcmFtICB7SW50ZWdlcn0gICB0aW1lb3V0IFRpbWVvdXQgcGVyaW9kIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSAge09iamVjdH0gICByb290ICAgIFdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgIEZpbmFsIGRlYm91bmNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgb2JqLCB0aW1lb3V0LCByb290KSB7XG4gIHZhciB0aW1lb3V0SUQgPSAtMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0SUQgPiAtMSkgeyByb290LmNsZWFyVGltZW91dCh0aW1lb3V0SUQpOyB9XG4gICAgdGltZW91dElEID0gcm9vdC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBmbihvYmopXG4gICAgfSwgdGltZW91dCk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIGNoYXJ0IFNWRyBhbmQgZGl2cyBpbnNpZGUgYSBjb250YWluZXIgZnJvbSB0aGUgRE9NLlxuICogQHBhcmFtICB7U3RyaW5nfSBjb250YWluZXJcbiAqL1xuZnVuY3Rpb24gY2xlYXJDaGFydChjb250YWluZXIpIHtcblxuICB2YXIgY29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIikubGVuZ3RoKSB7XG4gICAgdmFyIHN2ZyA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcInN2Z1wiKTtcbiAgICBzdmdbc3ZnLmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3ZnW3N2Zy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICB3aGlsZSAoY29udCAmJiBjb250LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIikubGVuZ3RoKSB7XG4gICAgdmFyIGRpdiA9IGNvbnQucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKTtcbiAgICBkaXZbZGl2Lmxlbmd0aCAtIDFdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2W2Rpdi5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gY29udGFpbmVyO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgY2hhcnQgZGF0YSBvZiBpdHMgcG9zdC1yZW5kZXIgY2hhcnRPYmogb2JqZWN0LlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmogT2JqZWN0IHVzZWQgdG8gY29uc3RydWN0IGNoYXJ0cy5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgIFRoZSBuZXcgdmVyc2lvbiBvZiB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbGVhck9iaihvYmopIHtcbiAgaWYgKG9iai5jaGFydE9iaikgeyBvYmouY2hhcnRPYmogPSB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIGRyYXduIGFycmF5LlxuICogQHBhcmFtICB7QXJyYXl9IGRyYXduXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGNsZWFyRHJhd24oZHJhd24sIG9iaikge1xuICBpZiAoZHJhd24ubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IGRyYXduLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoZHJhd25baV0uaWQgPT09IG9iai5pZCkge1xuICAgICAgICBkcmF3bi5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkcmF3bjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBkaW1lbnNpb25zIGdpdmVuIGEgc2VsZWN0b3IuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNvbnRhaW5lclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgVGhlIGJvdW5kaW5nQ2xpZW50UmVjdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kaW5nKHNlbGVjdG9yLCBkaW1lbnNpb24pIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2RpbWVuc2lvbl07XG59XG5cbi8qKlxuICogQmFzaWMgZmFjdG9yeSBmb3IgZmlndXJpbmcgb3V0IGFtb3VudCBvZiBtaWxsaXNlY29uZHMgaW4gYSBnaXZlbiB0aW1lIHBlcmlvZC5cbiAqL1xuZnVuY3Rpb24gVGltZU9iaigpIHtcbiAgdGhpcy5zZWMgPSAxMDAwO1xuICB0aGlzLm1pbiA9IHRoaXMuc2VjICogNjA7XG4gIHRoaXMuaG91ciA9IHRoaXMubWluICogNjA7XG4gIHRoaXMuZGF5ID0gdGhpcy5ob3VyICogMjQ7XG4gIHRoaXMud2VlayA9IHRoaXMuZGF5ICogNztcbiAgdGhpcy5tb250aCA9IHRoaXMuZGF5ICogMzA7XG4gIHRoaXMueWVhciA9IHRoaXMuZGF5ICogMzY1O1xufVxuXG4vKipcbiAqIFNsaWdodGx5IGFsdGVyZWQgQm9zdG9jayBtYWdpYyB0byB3cmFwIFNWRyA8dGV4dD4gbm9kZXMgYmFzZWQgb24gYXZhaWxhYmxlIHdpZHRoXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRleHQgICAgRDMgdGV4dCBzZWxlY3Rpb24uXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSB3aWR0aFxuICovXG5mdW5jdGlvbiB3cmFwVGV4dCh0ZXh0LCB3aWR0aCkge1xuICB0ZXh0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRleHQgPSBkMy5zZWxlY3QodGhpcyksXG4gICAgICAgIHdvcmRzID0gdGV4dC50ZXh0KCkuc3BsaXQoL1xccysvKS5yZXZlcnNlKCksXG4gICAgICAgIHdvcmQsXG4gICAgICAgIGxpbmUgPSBbXSxcbiAgICAgICAgbGluZU51bWJlciA9IDAsXG4gICAgICAgIGxpbmVIZWlnaHQgPSAxLjAsIC8vIGVtc1xuICAgICAgICB4ID0gMCxcbiAgICAgICAgeSA9IHRleHQuYXR0cihcInlcIiksXG4gICAgICAgIGR5ID0gcGFyc2VGbG9hdCh0ZXh0LmF0dHIoXCJkeVwiKSksXG4gICAgICAgIHRzcGFuID0gdGV4dC50ZXh0KG51bGwpLmFwcGVuZChcInRzcGFuXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHkpXG4gICAgICAgICAgLmF0dHIoXCJkeVwiLCBkeSArIFwiZW1cIik7XG5cbiAgICB3aGlsZSAod29yZCA9IHdvcmRzLnBvcCgpKSB7XG4gICAgICBsaW5lLnB1c2god29yZCk7XG4gICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgaWYgKHRzcGFuLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKSA+IHdpZHRoICYmIGxpbmUubGVuZ3RoID4gMSkge1xuICAgICAgICBsaW5lLnBvcCgpO1xuICAgICAgICB0c3Bhbi50ZXh0KGxpbmUuam9pbihcIiBcIikpO1xuICAgICAgICBsaW5lID0gW3dvcmRdO1xuICAgICAgICB0c3BhbiA9IHRleHQuYXBwZW5kKFwidHNwYW5cIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgeClcbiAgICAgICAgICAuYXR0cihcInlcIiwgeSlcbiAgICAgICAgICAuYXR0cihcImR5XCIsICsrbGluZU51bWJlciAqIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgICAudGV4dCh3b3JkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBkYXRlcyBkYXRlIGFuZCBhIHRvbGVyYW5jZSBsZXZlbCwgcmV0dXJuIGEgdGltZSBcImNvbnRleHRcIiBmb3IgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIHZhbHVlcy5cbiAqIEBwYXJhbSAge09iamVjdH0gZDEgICAgIEJlZ2lubmluZyBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge09iamVjdH0gZDIgICAgIEVuZCBkYXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge0ludGVnZXJ9IHRvbGVyYW5jZVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgVGhlIHJlc3VsdGluZyB0aW1lIGNvbnRleHQuXG4gKi9cbmZ1bmN0aW9uIHRpbWVEaWZmKGQxLCBkMiwgdG9sZXJhbmNlKSB7XG5cbiAgdmFyIGRpZmYgPSBkMiAtIGQxLFxuICAgICAgdGltZSA9IG5ldyBUaW1lT2JqKCk7XG5cbiAgLy8gcmV0dXJuaW5nIHRoZSBjb250ZXh0XG4gIGlmICgoZGlmZiAvIHRpbWUueWVhcikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwieWVhcnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubW9udGgpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcIm1vbnRoc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS53ZWVrKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJ3ZWVrc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5kYXkpID4gdG9sZXJhbmNlKSB7IHJldHVybiBcImRheXNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUuaG91cikgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwiaG91cnNcIjsgfVxuICBlbHNlIGlmICgoZGlmZiAvIHRpbWUubWluKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJtaW51dGVzXCI7IH1cbiAgZWxzZSB7IHJldHVybiBcImRheXNcIjsgfVxuICAvLyBpZiBub25lIG9mIHRoZXNlIHdvcmsgaSBmZWVsIGJhZCBmb3IgeW91IHNvblxuICAvLyBpJ3ZlIGdvdCA5OSBwcm9ibGVtcyBidXQgYW4gaWYvZWxzZSBhaW5cInQgb25lXG5cbn1cblxuLyoqXG4gKiBHaXZlbiBhIGRhdGFzZXQsIGZpZ3VyZSBvdXQgd2hhdCB0aGUgdGltZSBjb250ZXh0IGlzIGFuZFxuICogd2hhdCB0aGUgbnVtYmVyIG9mIHRpbWUgdW5pdHMgZWxhcHNlZCBpc1xuICogQHBhcmFtICB7QXJyYXl9IGRhdGFcbiAqIEByZXR1cm4ge0ludGVnZXJ9XG4gKi9cbmZ1bmN0aW9uIHRpbWVJbnRlcnZhbChkYXRhKSB7XG5cbiAgdmFyIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGQxID0gZGF0YVswXS5rZXksXG4gICAgICBkMiA9IGRhdGFbZGF0YUxlbmd0aCAtIDFdLmtleTtcblxuICB2YXIgcmV0O1xuXG4gIHZhciBpbnRlcnZhbHMgPSBbXG4gICAgeyB0eXBlOiBcInllYXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDMgfSwgLy8gcXVhcnRlcnNcbiAgICB7IHR5cGU6IFwibW9udGhzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwiZGF5c1wiLCBzdGVwOiAxIH0sXG4gICAgeyB0eXBlOiBcImhvdXJzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwibWludXRlc1wiLCBzdGVwOiAxIH1cbiAgXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGludGVydmFscy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnRlcnZhbENhbmRpZGF0ZSA9IGQzLnRpbWVbaW50ZXJ2YWxzW2ldLnR5cGVdKGQxLCBkMiwgaW50ZXJ2YWxzW2ldLnN0ZXApLmxlbmd0aDtcbiAgICBpZiAoaW50ZXJ2YWxDYW5kaWRhdGUgPj0gZGF0YUxlbmd0aCAtIDEpIHtcbiAgICAgIHZhciByZXQgPSBpbnRlcnZhbENhbmRpZGF0ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcmV0O1xuXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJhbnNmb3JtIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgYXMgYW4gYXJyYXlcbiAqIEBwYXJhbSAge09iamVjdH0gbm9kZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZVhZKG5vZGUpIHtcbiAgcmV0dXJuIGQzLnRyYW5zZm9ybShkMy5zZWxlY3Qobm9kZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB0cmFuc2xhdGUgc3RhdGVtZW50IGJlY2F1c2UgaXQncyBhbm5veWluZyB0byB0eXBlIG91dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIpXCI7XG59XG5cbi8qKlxuICogVGVzdHMgZm9yIFNWRyBzdXBwb3J0LCB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aWxqYW1pcy9mZWF0dXJlLmpzL1xuICogQHBhcmFtICB7T2JqZWN0fSByb290IEEgcmVmZXJlbmNlIHRvIHRoZSBicm93c2VyIHdpbmRvdyBvYmplY3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBzdmdUZXN0KHJvb3QpIHtcbiAgcmV0dXJuICEhcm9vdC5kb2N1bWVudCAmJiAhIXJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEhcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKS5jcmVhdGVTVkdSZWN0O1xufVxuXG4vKipcbiAqIENvbnN0cnVjdHMgdGhlIEFXUyBVUkwgZm9yIGEgZ2l2ZW4gY2hhcnQgSUQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRUaHVtYm5haWxQYXRoKG9iaikge1xuICB2YXIgaW1nU2V0dGluZ3MgPSBvYmouaW1hZ2U7XG5cbiAgaW1nU2V0dGluZ3MuYnVja2V0ID0gcmVxdWlyZShcIi4uL2NvbmZpZy9lbnZcIik7XG5cbiAgdmFyIGlkID0gb2JqLmlkLnJlcGxhY2Uob2JqLnByZWZpeCwgXCJcIik7XG5cbiAgcmV0dXJuIFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL1wiICsgaW1nU2V0dGluZ3MuYnVja2V0ICsgXCIvXCIgKyBpbWdTZXR0aW5ncy5iYXNlX3BhdGggKyBpZCArIFwiL1wiICsgaW1nU2V0dGluZ3MuZmlsZW5hbWUgKyBcIi5cIiArIGltZ1NldHRpbmdzLmV4dGVuc2lvbjtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGNoYXJ0IG9iamVjdCBhbmQgY29udGFpbmVyLCBnZW5lcmF0ZSBhbmQgYXBwZW5kIGEgdGh1bWJuYWlsXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlVGh1bWIoY29udGFpbmVyLCBvYmosIHNldHRpbmdzKSB7XG5cbiAgdmFyIGltZ1NldHRpbmdzID0gc2V0dGluZ3MuaW1hZ2U7XG5cbiAgdmFyIGNvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lciksXG4gICAgICBmYWxsYmFjayA9IGNvbnQucXVlcnlTZWxlY3RvcihcIi5cIiArIHNldHRpbmdzLnByZWZpeCArIFwiYmFzZTY0aW1nXCIpO1xuXG4gIGlmIChpbWdTZXR0aW5ncyAmJiBpbWdTZXR0aW5ncy5lbmFibGUgJiYgb2JqLmRhdGEuaWQpIHtcblxuICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGdldFRodW1ibmFpbFBhdGgob2JqKSk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnYWx0Jywgb2JqLmRhdGEuaGVhZGluZyk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBzZXR0aW5ncy5wcmVmaXggKyBcInRodW1ibmFpbFwiKTtcblxuICAgIGNvbnQuYXBwZW5kQ2hpbGQoaW1nKTtcblxuICB9IGVsc2UgaWYgKGZhbGxiYWNrKSB7XG5cbiAgICBmYWxsYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gY3N2VG9UYWJsZSh0YXJnZXQsIGRhdGEpIHtcbiAgdmFyIHBhcnNlZENTViA9IGQzLmNzdi5wYXJzZVJvd3MoZGF0YSk7XG5cbiAgdGFyZ2V0LmFwcGVuZChcInRhYmxlXCIpLnNlbGVjdEFsbChcInRyXCIpXG4gICAgLmRhdGEocGFyc2VkQ1NWKS5lbnRlcigpXG4gICAgLmFwcGVuZChcInRyXCIpLnNlbGVjdEFsbChcInRkXCIpXG4gICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSkuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJ0ZFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVib3VuY2U6IGRlYm91bmNlLFxuICBjbGVhckNoYXJ0OiBjbGVhckNoYXJ0LFxuICBjbGVhck9iajogY2xlYXJPYmosXG4gIGNsZWFyRHJhd246IGNsZWFyRHJhd24sXG4gIGdldEJvdW5kaW5nOiBnZXRCb3VuZGluZyxcbiAgVGltZU9iajogVGltZU9iaixcbiAgd3JhcFRleHQ6IHdyYXBUZXh0LFxuICB0aW1lRGlmZjogdGltZURpZmYsXG4gIHRpbWVJbnRlcnZhbDogdGltZUludGVydmFsLFxuICBnZXRUcmFuc2xhdGVYWTogZ2V0VHJhbnNsYXRlWFksXG4gIHRyYW5zbGF0ZTogdHJhbnNsYXRlLFxuICBzdmdUZXN0OiBzdmdUZXN0LFxuICBnZXRUaHVtYm5haWxQYXRoOiBnZXRUaHVtYm5haWxQYXRoLFxuICBnZW5lcmF0ZVRodW1iOiBnZW5lcmF0ZVRodW1iLFxuICBjc3ZUb1RhYmxlOiBjc3ZUb1RhYmxlLFxuICBkYXRhUGFyc2U6IHJlcXVpcmUoXCIuL2RhdGFwYXJzZVwiKSxcbiAgZmFjdG9yeTogcmVxdWlyZShcIi4vZmFjdG9yeVwiKVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzM19idWNrZXQgaXMgZGVmaW5lZCBpbiB3ZWJwYWNrLmNvbmZpZy5qc1xubW9kdWxlLmV4cG9ydHMgPSBzM19idWNrZXQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NvbmZpZy9lbnYuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIERhdGEgcGFyc2luZyBtb2R1bGUuIFRha2VzIGEgQ1NWIGFuZCB0dXJucyBpdCBpbnRvIGFuIE9iamVjdCwgYW5kIG9wdGlvbmFsbHkgZGV0ZXJtaW5lcyB0aGUgZm9ybWF0dGluZyB0byB1c2Ugd2hlbiBwYXJzaW5nIGRhdGVzLlxuICogQG1vZHVsZSB1dGlscy9kYXRhcGFyc2VcbiAqIEBzZWUgbW9kdWxlOnV0aWxzL2ZhY3RvcnlcbiAqL1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHNjYWxlIHJldHVybnMgYW4gaW5wdXQgZGF0ZSBvciBub3QuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNjYWxlVHlwZSAgICAgIFRoZSB0eXBlIG9mIHNjYWxlLlxuICogQHBhcmFtICB7U3RyaW5nfSBkZWZhdWx0Rm9ybWF0ICBGb3JtYXQgc2V0IGJ5IHRoZSBjaGFydCB0b29sIHNldHRpbmdzLlxuICogQHBhcmFtICB7U3RyaW5nfSBkZWNsYXJlZEZvcm1hdCBGb3JtYXQgcGFzc2VkIGJ5IHRoZSBjaGFydCBlbWJlZCBjb2RlLCBpZiB0aGVyZSBpcyBvbmVcbiAqIEByZXR1cm4ge1N0cmluZ3xVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGlucHV0RGF0ZShzY2FsZVR5cGUsIGRlZmF1bHRGb3JtYXQsIGRlY2xhcmVkRm9ybWF0KSB7XG5cbiAgaWYgKHNjYWxlVHlwZSA9PT0gXCJ0aW1lXCIgfHwgc2NhbGVUeXBlID09PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgcmV0dXJuIGRlY2xhcmVkRm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG59XG5cbi8qKlxuICogUGFyc2VzIGEgQ1NWIHN0cmluZyB1c2luZyBkMy5jc3YucGFyc2UoKSBhbmQgdHVybnMgaXQgaW50byBhbiBhcnJheSBvZiBvYmplY3RzLlxuICogQHBhcmFtICB7U3RyaW5nfSBjc3YgICAgICAgICAgICAgQ1NWIHN0cmluZyB0byBiZSBwYXJzZWRcbiAqIEBwYXJhbSAge1N0cmluZyBpbnB1dERhdGVGb3JtYXQgRGF0ZSBmb3JtYXQgaW4gRDMgc3RyZnRpbWUgc3R5bGUsIGlmIHRoZXJlIGlzIG9uZVxuICogQHBhcmFtICB7U3RyaW5nfSBpbmRleCAgICAgICAgICAgVmFsdWUgdG8gaW5kZXggdGhlIGRhdGEgdG8sIGlmIHRoZXJlIGlzIG9uZVxuICogQHJldHVybiB7IHtjc3Y6IFN0cmluZywgZGF0YTogQXJyYXksIHNlcmllc0Ftb3VudDogSW50ZWdlciwga2V5czogQXJyYXl9IH0gICAgICAgICAgICAgICAgIEFuIG9iamVjdCB3aXRoIHRoZSBvcmlnaW5hbCBDU1Ygc3RyaW5nLCB0aGUgbmV3bHktZm9ybWF0dGVkIGRhdGEsIHRoZSBudW1iZXIgb2Ygc2VyaWVzIGluIHRoZSBkYXRhIGFuZCBhbiBhcnJheSBvZiBrZXlzIHVzZWQuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlKGNzdiwgaW5wdXREYXRlRm9ybWF0LCBpbmRleCwgc3RhY2tlZCwgdHlwZSkge1xuXG4gIHZhciBrZXlzLCB2YWw7XG5cbiAgdmFyIGZpcnN0VmFscyA9IHt9O1xuXG4gIHZhciBkYXRhID0gZDMuY3N2LnBhcnNlKGNzdiwgZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgaWYgKGkgPT09IDApIHsga2V5cyA9IGQzLmtleXMoZCk7IH1cblxuICAgIGlmIChpbnB1dERhdGVGb3JtYXQpIHtcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZDMudGltZS5mb3JtYXQoaW5wdXREYXRlRm9ybWF0KTtcbiAgICAgIG9iai5rZXkgPSBkYXRlRm9ybWF0LnBhcnNlKGQzLnZhbHVlcyhkKVswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5rZXkgPSBkMy52YWx1ZXMoZClbMF07XG4gICAgfVxuXG4gICAgb2JqLnNlcmllcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPCBkMy5rZXlzKGQpLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgIHZhciBrZXkgPSBkMy5rZXlzKGQpW2pdO1xuXG4gICAgICBpZiAoZFtrZXldID09PSAwIHx8IGRba2V5XSA9PT0gXCJcIikge1xuICAgICAgICBkW2tleV0gPSBcIl9fdW5kZWZpbmVkX19cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4KSB7XG5cbiAgICAgICAgaWYgKGkgPT09IDAgJiYgIWZpcnN0VmFsc1trZXldKSB7XG4gICAgICAgICAgZmlyc3RWYWxzW2tleV0gPSBkW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPT09IFwiMFwiKSB7XG4gICAgICAgICAgdmFsID0gKChkW2tleV0gLyBmaXJzdFZhbHNba2V5XSkgLSAxKSAqIDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWwgPSAoZFtrZXldIC8gZmlyc3RWYWxzW2tleV0pICogaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gZFtrZXldO1xuICAgICAgfVxuXG4gICAgICBvYmouc2VyaWVzLnB1c2goe1xuICAgICAgICB2YWw6IHZhbCxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcblxuICB9KTtcblxuICB2YXIgc2VyaWVzQW1vdW50ID0gZGF0YVswXS5zZXJpZXMubGVuZ3RoO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgaWYgKHR5cGUgPT09IFwic3RyZWFtXCIpIHtcbiAgICAgIHZhciBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpLm9mZnNldChcInNpbGhvdWV0dGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IGQzLmxheW91dC5zdGFjaygpO1xuICAgIH1cbiAgICB2YXIgc3RhY2tlZERhdGEgPSBzdGFjayhkMy5yYW5nZShzZXJpZXNBbW91bnQpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBkYXRhLm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGVnZW5kOiBrZXlzW2tleSArIDFdLFxuICAgICAgICAgIHg6IGQua2V5LFxuICAgICAgICAgIHk6IE51bWJlcihkLnNlcmllc1trZXldLnZhbCksXG4gICAgICAgICAgcmF3OiBkXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNzdjogY3N2LFxuICAgIGRhdGE6IGRhdGEsXG4gICAgc2VyaWVzQW1vdW50OiBzZXJpZXNBbW91bnQsXG4gICAga2V5czoga2V5cyxcbiAgICBzdGFja2VkRGF0YTogc3RhY2tlZERhdGEgfHwgdW5kZWZpbmVkXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlucHV0RGF0ZTogaW5wdXREYXRlLFxuICBwYXJzZTogcGFyc2Vcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL2RhdGFwYXJzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogUmVjaXBlIGZhY3RvciBmYWN0b3J5IG1vZHVsZS5cbiAqIEBtb2R1bGUgdXRpbHMvZmFjdG9yeVxuICogQHNlZSBtb2R1bGU6Y2hhcnRzL2luZGV4XG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIFwicmVjaXBlXCIgb2Ygc2V0dGluZ3MgZm9yIGEgY2hhcnQsIHBhdGNoIGl0IHdpdGggYW4gb2JqZWN0IGFuZCBwYXJzZSB0aGUgZGF0YSBmb3IgdGhlIGNoYXJ0LlxuICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmaW5hbCBjaGFydCByZWNpcGUuXG4gKi9cbmZ1bmN0aW9uIFJlY2lwZUZhY3Rvcnkoc2V0dGluZ3MsIG9iaikge1xuICB2YXIgZGF0YVBhcnNlID0gcmVxdWlyZShcIi4vZGF0YXBhcnNlXCIpO1xuICB2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL2hlbHBlcnNcIik7XG5cbiAgdmFyIHQgPSBoZWxwZXJzLmV4dGVuZChzZXR0aW5ncyk7IC8vIHNob3J0IGZvciB0ZW1wbGF0ZVxuXG4gIHZhciBlbWJlZCA9IG9iai5kYXRhO1xuICB2YXIgY2hhcnQgPSBlbWJlZC5jaGFydDtcblxuICAvLyBJJ20gbm90IGEgYmlnIGZhbiBvZiBpbmRlbnRpbmcgc3R1ZmYgbGlrZSB0aGlzXG4gIC8vIChsb29raW5nIGF0IHlvdSwgUGVyZWlyYSksIGJ1dCBJJ20gbWFraW5nIGFuIGV4Y2VwdGlvblxuICAvLyBpbiB0aGlzIGNhc2UgYmVjYXVzZSBteSBleWVzIHdlcmUgYmxlZWRpbmcuXG5cbiAgdC5kaXNwYXRjaCAgICAgICAgID0gb2JqLmRpc3BhdGNoO1xuXG4gIHQudmVyc2lvbiAgICAgICAgICA9IGVtYmVkLnZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQudmVyc2lvbjtcbiAgdC5pZCAgICAgICAgICAgICAgID0gb2JqLmlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5pZDtcbiAgdC5oZWFkaW5nICAgICAgICAgID0gZW1iZWQuaGVhZGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5oZWFkaW5nO1xuICB0LnF1YWxpZmllciAgICAgICAgPSBlbWJlZC5xdWFsaWZpZXIgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnF1YWxpZmllcjtcbiAgdC5zb3VyY2UgICAgICAgICAgID0gZW1iZWQuc291cmNlICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5zb3VyY2U7XG4gIHQuZGVjayAgICAgICAgICAgICA9IGVtYmVkLmRlY2sgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGVja1xuICB0LmN1c3RvbUNsYXNzICAgICAgPSBjaGFydC5jbGFzcyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmN1c3RvbUNsYXNzO1xuXG4gIHQueEF4aXMgICAgICAgICAgICA9IGhlbHBlcnMuZXh0ZW5kKHQueEF4aXMsIGNoYXJ0LnhfYXhpcykgIHx8IHQueEF4aXM7XG4gIHQueUF4aXMgICAgICAgICAgICA9IGhlbHBlcnMuZXh0ZW5kKHQueUF4aXMsIGNoYXJ0LnlfYXhpcykgIHx8IHQueUF4aXM7XG5cbiAgdmFyIG8gPSB0Lm9wdGlvbnMsXG4gICAgICBjbyA9IGNoYXJ0Lm9wdGlvbnM7XG5cbiAgLy8gIFwib3B0aW9uc1wiIGFyZWEgb2YgZW1iZWQgY29kZVxuICBvLnR5cGUgICAgICAgICAgICAgPSBjaGFydC5vcHRpb25zLnR5cGUgICAgICAgICAgICAgICAgICAgICB8fCBvLnR5cGU7XG4gIG8uaW50ZXJwb2xhdGlvbiAgICA9IGNoYXJ0Lm9wdGlvbnMuaW50ZXJwb2xhdGlvbiAgICAgICAgICAgIHx8IG8uaW50ZXJwb2xhdGlvbjtcblxuICBvLnNvY2lhbCAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc29jaWFsKSA9PT0gdHJ1ZSA/IGNvLnNvY2lhbCAgICAgICAgICAgOiBvLnNvY2lhbDtcbiAgby5zaGFyZV9kYXRhICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zaGFyZV9kYXRhKSA9PT0gdHJ1ZSA/IGNvLnNoYXJlX2RhdGEgIDogby5zaGFyZV9kYXRhO1xuICBvLnN0YWNrZWQgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc3RhY2tlZCkgPT09IHRydWUgPyBjby5zdGFja2VkICAgICAgICAgOiBvLnN0YWNrZWQ7XG4gIG8uZXhwYW5kZWQgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5leHBhbmRlZCkgPT09IHRydWUgPyBjby5leHBhbmRlZCAgICAgICA6IG8uZXhwYW5kZWQ7XG4gIG8uaGVhZCAgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5oZWFkKSA9PT0gdHJ1ZSA/IGNvLmhlYWQgICAgICAgICAgICAgICA6IG8uaGVhZDtcbiAgby5kZWNrICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmRlY2spID09PSB0cnVlID8gY28uZGVjayAgICAgICAgICAgICAgIDogby5kZWNrO1xuICBvLmxlZ2VuZCAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ubGVnZW5kKSA9PT0gdHJ1ZSA/IGNvLmxlZ2VuZCAgICAgICAgICAgOiBvLmxlZ2VuZDtcbiAgby5xdWFsaWZpZXIgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnF1YWxpZmllcikgPT09IHRydWUgPyBjby5xdWFsaWZpZXIgICAgIDogby5xdWFsaWZpZXI7XG4gIG8uZm9vdGVyICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5mb290ZXIpID09PSB0cnVlID8gY28uZm9vdGVyICAgICAgICAgICA6IG8uZm9vdGVyO1xuICBvLnhfYXhpcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ueF9heGlzKSA9PT0gdHJ1ZSA/IGNvLnhfYXhpcyAgICAgICAgICAgOiBvLnhfYXhpcztcbiAgby55X2F4aXMgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnlfYXhpcykgPT09IHRydWUgPyBjby55X2F4aXMgICAgICAgICAgIDogby55X2F4aXM7XG4gIG8udGlwcyAgICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby50aXBzKSA9PT0gdHJ1ZSA/IGNvLnRpcHMgICAgICAgICAgICAgICA6IG8udGlwcztcbiAgby5hbm5vdGF0aW9ucyA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmFubm90YXRpb25zKSA9PT0gdHJ1ZSA/IGNvLmFubm90YXRpb25zIDogby5hbm5vdGF0aW9ucztcbiAgby5yYW5nZSAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnJhbmdlKSA9PT0gdHJ1ZSA/IGNvLnJhbmdlICAgICAgICAgICAgIDogby5yYW5nZTtcbiAgby5zZXJpZXMgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNlcmllcykgPT09IHRydWUgPyBjby5zZXJpZXMgICAgICAgICAgIDogby5zZXJpZXM7XG4gIG8uaW5kZXggICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5pbmRleGVkKSA9PT0gdHJ1ZSA/IGNvLmluZGV4ZWQgICAgICAgICA6IG8uaW5kZXg7XG5cbiAgLy8gIHRoZXNlIGFyZSBzcGVjaWZpYyB0byB0aGUgdCBvYmplY3QgYW5kIGRvbid0IGV4aXN0IGluIHRoZSBlbWJlZFxuICB0LmJhc2VDbGFzcyAgICAgICAgPSBlbWJlZC5iYXNlQ2xhc3MgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmJhc2VDbGFzcztcblxuICB0LmRpbWVuc2lvbnMud2lkdGggPSBlbWJlZC53aWR0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRpbWVuc2lvbnMud2lkdGg7XG5cbiAgdC5wcmVmaXggICAgICAgICAgID0gY2hhcnQucHJlZml4ICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5wcmVmaXg7XG4gIHQuZXhwb3J0YWJsZSAgICAgICA9IGNoYXJ0LmV4cG9ydGFibGUgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZXhwb3J0YWJsZTtcbiAgdC5lZGl0YWJsZSAgICAgICAgID0gY2hhcnQuZWRpdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5lZGl0YWJsZTtcblxuICBpZiAodC5leHBvcnRhYmxlKSB7XG4gICAgdC5kaW1lbnNpb25zLndpZHRoID0gY2hhcnQuZXhwb3J0YWJsZS53aWR0aCB8fCBlbWJlZC53aWR0aCB8fCB0LmRpbWVuc2lvbnMud2lkdGg7XG4gICAgdC5kaW1lbnNpb25zLmhlaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY2hhcnQuZXhwb3J0YWJsZS5oZWlnaHQ7IH1cbiAgICB0LmRpbWVuc2lvbnMubWFyZ2luID0gY2hhcnQuZXhwb3J0YWJsZS5tYXJnaW4gfHwgdC5kaW1lbnNpb25zLm1hcmdpbjtcbiAgfVxuXG4gIGlmIChjaGFydC5oYXNIb3VycykgeyB0LmRhdGVGb3JtYXQgKz0gXCIgXCIgKyB0LnRpbWVGb3JtYXQ7IH1cbiAgdC5oYXNIb3VycyAgICAgICAgID0gY2hhcnQuaGFzSG91cnMgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5oYXNIb3VycztcbiAgdC5kYXRlRm9ybWF0ICAgICAgID0gY2hhcnQuZGF0ZUZvcm1hdCAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kYXRlRm9ybWF0O1xuXG4gIHQuZGF0ZUZvcm1hdCA9IGRhdGFQYXJzZS5pbnB1dERhdGUodC54QXhpcy5zY2FsZSwgdC5kYXRlRm9ybWF0LCBjaGFydC5kYXRlX2Zvcm1hdCk7XG4gIHQuZGF0YSA9IGRhdGFQYXJzZS5wYXJzZShjaGFydC5kYXRhLCB0LmRhdGVGb3JtYXQsIG8uaW5kZXgsIG8uc3RhY2tlZCwgby50eXBlKSB8fCB0LmRhdGE7XG5cbiAgcmV0dXJuIHQ7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWNpcGVGYWN0b3J5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBIZWxwZXJzIHRoYXQgbWFuaXB1bGF0ZSBhbmQgY2hlY2sgcHJpbWl0aXZlcy4gTm90aGluZyBEMy1zcGVjaWZpYyBoZXJlLlxuICogQG1vZHVsZSBoZWxwZXJzL2hlbHBlcnNcbiAqL1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ludGVnZXIoeCkge1xuICByZXR1cm4geCAlIDEgPT09IDA7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmxvYXQuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0Zsb2F0KG4pIHtcbiAgcmV0dXJuIG4gPT09ICtuICYmIG4gIT09IChufDApO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIHZhbHVlIGlzIGVtcHR5LiBXb3JrcyBmb3IgT2JqZWN0cywgQXJyYXlzLCBTdHJpbmdzIGFuZCBJbnRlZ2Vycy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsKSB7XG4gIGlmICh2YWwuY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiB2YWwpIHtcbiAgICAgIGlmICh2YWwuaGFzT3duUHJvcGVydHkocHJvcCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xuICAgIHJldHVybiAhdmFsLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gIXZhbDtcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBjaGVjayBmb3Igd2hldGhlciBhIHZhbHVlIGlzIHVuZGVmaW5lZCBvciBub3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2U7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGFycmF5cywgcmV0dXJucyBvbmx5IHVuaXF1ZSB2YWx1ZXMgaW4gdGhvc2UgYXJyYXlzLlxuICogQHBhcmFtICB7QXJyYXl9IGExXG4gKiBAcGFyYW0gIHtBcnJheX0gYTJcbiAqIEByZXR1cm4ge0FycmF5fSAgICBBcnJheSBvZiB1bmlxdWUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBhcnJheURpZmYoYTEsIGEyKSB7XG4gIHZhciBvMSA9IHt9LCBvMiA9IHt9LCBkaWZmPSBbXSwgaSwgbGVuLCBrO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhMS5sZW5ndGg7IGkgPCBsZW47IGkrKykgeyBvMVthMVtpXV0gPSB0cnVlOyB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGEyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IG8yW2EyW2ldXSA9IHRydWU7IH1cbiAgZm9yIChrIGluIG8xKSB7IGlmICghKGsgaW4gbzIpKSB7IGRpZmYucHVzaChrKTsgfSB9XG4gIGZvciAoayBpbiBvMikgeyBpZiAoIShrIGluIG8xKSkgeyBkaWZmLnB1c2goayk7IH0gfVxuICByZXR1cm4gZGlmZjtcbn1cblxuLyoqXG4gKiBPcHBvc2l0ZSBvZiBhcnJheURpZmYoKSwgdGhpcyByZXR1cm5zIG9ubHkgY29tbW9uIGVsZW1lbnRzIGJldHdlZW4gYXJyYXlzLlxuICogQHBhcmFtICB7QXJyYXl9IGFycjFcbiAqIEBwYXJhbSAge0FycmF5fSBhcnIyXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICBBcnJheSBvZiBjb21tb24gdmFsdWVzLlxuICovXG5mdW5jdGlvbiBhcnJheVNhbWUoYTEsIGEyKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgZm9yIChpIGluIGExKSB7XG4gICAgaWYgKGEyLmluZGV4T2YoIGExW2ldICkgPiAtMSl7XG4gICAgICByZXQucHVzaCggYTFbaV0gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzICdmcm9tJyBvYmplY3Qgd2l0aCBtZW1iZXJzIGZyb20gJ3RvJy4gSWYgJ3RvJyBpcyBudWxsLCBhIGRlZXAgY2xvbmUgb2YgJ2Zyb20nIGlzIHJldHVybmVkXG4gKiBAcGFyYW0gIHsqfSBmcm9tXG4gKiBAcGFyYW0gIHsqfSB0b1xuICogQHJldHVybiB7Kn0gICAgICBDbG9uZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBleHRlbmQoZnJvbSwgdG8pIHtcbiAgaWYgKGZyb20gPT0gbnVsbCB8fCB0eXBlb2YgZnJvbSAhPSBcIm9iamVjdFwiKSByZXR1cm4gZnJvbTtcbiAgaWYgKGZyb20uY29uc3RydWN0b3IgIT0gT2JqZWN0ICYmIGZyb20uY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBmcm9tO1xuICBpZiAoZnJvbS5jb25zdHJ1Y3RvciA9PSBEYXRlIHx8IGZyb20uY29uc3RydWN0b3IgPT0gUmVnRXhwIHx8IGZyb20uY29uc3RydWN0b3IgPT0gRnVuY3Rpb24gfHxcbiAgICBmcm9tLmNvbnN0cnVjdG9yID09IFN0cmluZyB8fCBmcm9tLmNvbnN0cnVjdG9yID09IE51bWJlciB8fCBmcm9tLmNvbnN0cnVjdG9yID09IEJvb2xlYW4pXG4gICAgcmV0dXJuIG5ldyBmcm9tLmNvbnN0cnVjdG9yKGZyb20pO1xuXG4gIHRvID0gdG8gfHwgbmV3IGZyb20uY29uc3RydWN0b3IoKTtcblxuICBmb3IgKHZhciBuYW1lIGluIGZyb20pIHtcbiAgICB0b1tuYW1lXSA9IHR5cGVvZiB0b1tuYW1lXSA9PSBcInVuZGVmaW5lZFwiID8gZXh0ZW5kKGZyb21bbmFtZV0sIG51bGwpIDogdG9bbmFtZV07XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbi8qKlxuICogQ29tcGFyZXMgdHdvIG9iamVjdHMsIHJldHVybmluZyBhbiBhcnJheSBvZiB1bmlxdWUga2V5cy5cbiAqIEBwYXJhbSAge09iamVjdH0gbzFcbiAqIEBwYXJhbSAge09iamVjdH0gbzJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiB1bmlxdWVLZXlzKG8xLCBvMikge1xuICByZXR1cm4gYXJyYXlEaWZmKGQzLmtleXMobzEpLCBkMy5rZXlzKG8yKSk7XG59XG5cbi8qKlxuICogQ29tcGFyZXMgdHdvIG9iamVjdHMsIHJldHVybmluZyBhbiBhcnJheSBvZiBjb21tb24ga2V5cy5cbiAqIEBwYXJhbSAge09iamVjdH0gbzFcbiAqIEBwYXJhbSAge09iamVjdH0gbzJcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBzYW1lS2V5cyhvMSwgbzIpIHtcbiAgcmV0dXJuIGFycmF5U2FtZShkMy5rZXlzKG8xKSwgZDMua2V5cyhvMikpO1xufVxuXG4vKipcbiAqIElmIGEgc3RyaW5nIGlzIHVuZGVmaW5lZCwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBpbnN0ZWFkLlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY2xlYW5TdHIoc3RyKXtcbiAgaWYgKHN0ciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXG4gIGlzRmxvYXQ6IGlzRmxvYXQsXG4gIGlzRW1wdHk6IGlzRW1wdHksXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIGFycmF5RGlmZjogYXJyYXlEaWZmLFxuICBhcnJheVNhbWU6IGFycmF5U2FtZSxcbiAgdW5pcXVlS2V5czogdW5pcXVlS2V5cyxcbiAgc2FtZUtleXM6IHNhbWVLZXlzLFxuICBjbGVhblN0cjogY2xlYW5TdHJcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2hlbHBlcnMvaGVscGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ2hhcnQgY29udHJ1Y3Rpb24gbWFuYWdlciBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9tYW5hZ2VyXG4gKi9cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBzdGVwLWJ5LXN0ZXAgY3JlYXRpb24gb2YgYSBjaGFydCwgYW5kIHJldHVybnMgdGhlIGZ1bGwgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNoYXJ0LCBpbmNsdWRpbmcgcmVmZXJlbmNlcyB0byBub2Rlcywgc2NhbGVzLCBheGVzLCBldGMuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29udGFpbmVyIFNlbGVjdG9yIGZvciB0aGUgY29udGFpbmVyIHRoZSBjaGFydCB3aWxsIGJlIGRyYXduIGludG8uXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqICAgICAgIE9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzIGZvciB0aGUgY2hhcnQuXG4gKi9cbmZ1bmN0aW9uIENoYXJ0TWFuYWdlcihjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBSZWNpcGUgPSByZXF1aXJlKFwiLi4vdXRpbHMvZmFjdG9yeVwiKSxcbiAgICAgIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL2NvbmZpZy9jaGFydC1zZXR0aW5nc1wiKSxcbiAgICAgIGNvbXBvbmVudHMgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2NvbXBvbmVudHNcIik7XG5cbiAgdmFyIGNoYXJ0UmVjaXBlID0gbmV3IFJlY2lwZShzZXR0aW5ncywgb2JqKTtcblxuICB2YXIgcmVuZGVyZWQgPSBjaGFydFJlY2lwZS5yZW5kZXJlZCA9IHt9O1xuXG4gIC8vIGNoZWNrIHRoYXQgZWFjaCBzZWN0aW9uIGlzIG5lZWRlZFxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLmhlYWQpIHtcbiAgICByZW5kZXJlZC5oZWFkZXIgPSBjb21wb25lbnRzLmhlYWRlcihjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLmZvb3Rlcikge1xuICAgIHJlbmRlcmVkLmZvb3RlciA9IGNvbXBvbmVudHMuZm9vdGVyKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgdmFyIG5vZGUgPSBjb21wb25lbnRzLmJhc2UoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG5cbiAgcmVuZGVyZWQuY29udGFpbmVyID0gbm9kZTtcblxuICByZW5kZXJlZC5wbG90ID0gY29tcG9uZW50cy5wbG90KG5vZGUsIGNoYXJ0UmVjaXBlKTtcblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5xdWFsaWZpZXIpIHtcbiAgICByZW5kZXJlZC5xdWFsaWZpZXIgPSBjb21wb25lbnRzLnF1YWxpZmllcihub2RlLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy50aXBzKSB7XG4gICAgcmVuZGVyZWQudGlwcyA9IGNvbXBvbmVudHMudGlwcyhub2RlLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICBpZiAoIWNoYXJ0UmVjaXBlLmVkaXRhYmxlICYmICFjaGFydFJlY2lwZS5leHBvcnRhYmxlKSB7XG4gICAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuc2hhcmVfZGF0YSkge1xuICAgICAgcmVuZGVyZWQuc2hhcmVEYXRhID0gY29tcG9uZW50cy5zaGFyZURhdGEoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gICAgfVxuICAgIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnNvY2lhbCkge1xuICAgICAgcmVuZGVyZWQuc29jaWFsID0gY29tcG9uZW50cy5zb2NpYWwoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLkNVU1RPTSkge1xuICAgIHZhciBjdXN0b20gPSByZXF1aXJlKFwiLi4vLi4vLi4vY3VzdG9tL2N1c3RvbS5qc1wiKTtcbiAgICByZW5kZXJlZC5jdXN0b20gPSBjdXN0b20obm9kZSwgY2hhcnRSZWNpcGUsIHJlbmRlcmVkKTtcbiAgfVxuXG4gIHJldHVybiBjaGFydFJlY2lwZTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydE1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGNvbXBvbmVudHMgPSB7XG4gIGJhc2U6IHJlcXVpcmUoXCIuL2Jhc2VcIiksXG4gIGhlYWRlcjogcmVxdWlyZShcIi4vaGVhZGVyXCIpLFxuICBmb290ZXI6IHJlcXVpcmUoXCIuL2Zvb3RlclwiKSxcbiAgcGxvdDogcmVxdWlyZShcIi4vcGxvdFwiKSxcbiAgcXVhbGlmaWVyOiByZXF1aXJlKFwiLi9xdWFsaWZpZXJcIiksXG4gIGF4aXM6IHJlcXVpcmUoXCIuL2F4aXNcIiksXG4gIHNjYWxlOiByZXF1aXJlKFwiLi9zY2FsZVwiKSxcbiAgdGlwczogcmVxdWlyZShcIi4vdGlwc1wiKSxcbiAgc29jaWFsOiByZXF1aXJlKFwiLi9zb2NpYWxcIiksXG4gIHNoYXJlRGF0YTogcmVxdWlyZShcIi4vc2hhcmUtZGF0YVwiKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnRzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGFwcGVuZChjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBtYXJnaW4gPSBvYmouZGltZW5zaW9ucy5tYXJnaW47XG5cbiAgdmFyIGNoYXJ0QmFzZSA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgLmluc2VydChcInN2Z1wiLCBcIi5cIiArIG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLmJhc2VDbGFzcygpICsgXCJfc3ZnIFwiICsgb2JqLnByZWZpeCArIG9iai5jdXN0b21DbGFzcyArIFwiIFwiICsgb2JqLnByZWZpeCArIFwidHlwZV9cIiArIG9iai5vcHRpb25zLnR5cGUgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInNlcmllcy1cIiArIG9iai5kYXRhLnNlcmllc0Ftb3VudCxcbiAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQsXG4gICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20sXG4gICAgICBcInZlcnNpb25cIjogMS4xLFxuICAgICAgXCJ4bWxuc1wiOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICB9KTtcblxuICAvLyBiYWNrZ3JvdW5kIHJlY3RcbiAgY2hhcnRCYXNlXG4gICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImJnXCIsXG4gICAgICBcInhcIjogMCxcbiAgICAgIFwieVwiOiAwLFxuICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCksXG4gICAgICBcImhlaWdodFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiXG4gICAgfSk7XG5cbiAgdmFyIGdyYXBoID0gY2hhcnRCYXNlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImdyYXBoXCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCJcbiAgICB9KTtcblxuICByZXR1cm4gZ3JhcGg7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBlbmQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Jhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gaGVhZGVyQ29tcG9uZW50KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIGhlbHBlcnMgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpO1xuXG4gIHZhciBoZWFkZXJHcm91cCA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgLmFwcGVuZChcImRpdlwiKVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X3RpdGxlIFwiICsgb2JqLnByZWZpeCArIG9iai5jdXN0b21DbGFzcywgdHJ1ZSlcblxuICAvLyBoYWNrIG5lY2Vzc2FyeSB0byBlbnN1cmUgUERGIGZpZWxkcyBhcmUgc2l6ZWQgcHJvcGVybHlcbiAgaWYgKG9iai5leHBvcnRhYmxlKSB7XG4gICAgaGVhZGVyR3JvdXAuc3R5bGUoXCJ3aWR0aFwiLCBvYmouZXhwb3J0YWJsZS53aWR0aCArIFwicHhcIik7XG4gIH1cblxuICBpZiAob2JqLmhlYWRpbmcgIT09IFwiXCIgfHwgb2JqLmVkaXRhYmxlKSB7XG4gICAgdmFyIGhlYWRlclRleHQgPSBoZWFkZXJHcm91cFxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF90aXRsZS10ZXh0XCIpXG4gICAgICAudGV4dChvYmouaGVhZGluZyk7XG5cbiAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG4gICAgICBoZWFkZXJUZXh0XG4gICAgICAgIC5hdHRyKFwiY29udGVudEVkaXRhYmxlXCIsIHRydWUpXG4gICAgICAgIC5jbGFzc2VkKFwiZWRpdGFibGUtY2hhcnRfdGl0bGVcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gIH1cblxuICB2YXIgcXVhbGlmaWVyO1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImJhclwiKSB7XG4gICAgcXVhbGlmaWVyID0gaGVhZGVyR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc3RyID0gb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyIFwiICsgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLWJhclwiO1xuICAgICAgICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgICAgICAgIHN0ciArPSBcIiBlZGl0YWJsZS1jaGFydF9xdWFsaWZpZXJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50RWRpdGFibGVcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai5lZGl0YWJsZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpO1xuICB9XG5cbiAgaWYgKG9iai5kYXRhLmtleXMubGVuZ3RoID4gMikge1xuXG4gICAgdmFyIGxlZ2VuZCA9IGhlYWRlckdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfbGVnZW5kXCIsIHRydWUpO1xuXG4gICAgdmFyIGtleXMgPSBoZWxwZXJzLmV4dGVuZChvYmouZGF0YS5rZXlzKTtcblxuICAgIC8vIGdldCByaWQgb2YgdGhlIGZpcnN0IGl0ZW0gYXMgaXQgZG9lc250IHJlcHJlc2VudCBhIHNlcmllc1xuICAgIGtleXMuc2hpZnQoKTtcblxuICAgIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcIm11bHRpbGluZVwiKSB7XG4gICAgICBrZXlzID0gW2tleXNbMF0sIGtleXNbMV1dO1xuICAgICAgbGVnZW5kLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfbGVnZW5kLVwiICsgb2JqLm9wdGlvbnMudHlwZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdmFyIGxlZ2VuZEl0ZW0gPSBsZWdlbmQuc2VsZWN0QWxsKFwiZGl2LlwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1cIilcbiAgICAgIC5kYXRhKGtleXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbSBcIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX1wiICsgKGkpO1xuICAgICAgfSk7XG5cbiAgICBsZWdlbmRJdGVtLmFwcGVuZChcInNwYW5cIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1faWNvblwiKTtcblxuICAgIGxlZ2VuZEl0ZW0uYXBwZW5kKFwic3BhblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV90ZXh0XCIpXG4gICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KTtcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLmhlYWRlckhlaWdodCA9IGhlYWRlckdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgcmV0dXJuIHtcbiAgICBoZWFkZXJHcm91cDogaGVhZGVyR3JvdXAsXG4gICAgbGVnZW5kOiBsZWdlbmQsXG4gICAgcXVhbGlmaWVyOiBxdWFsaWZpZXJcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhlYWRlckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvaGVhZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGZvb3RlckNvbXBvbmVudChjb250YWluZXIsIG9iaikge1xuXG4gIHZhciBmb290ZXJHcm91cDtcblxuICBpZiAob2JqLnNvdXJjZSAhPT0gXCJcIiB8fCBvYmouZWRpdGFibGUpIHtcbiAgICBmb290ZXJHcm91cCA9IGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9zb3VyY2VcIiwgdHJ1ZSk7XG5cbiAgICAvLyBoYWNrIG5lY2Vzc2FyeSB0byBlbnN1cmUgUERGIGZpZWxkcyBhcmUgc2l6ZWQgcHJvcGVybHlcbiAgICBpZiAob2JqLmV4cG9ydGFibGUpIHtcbiAgICAgIGZvb3Rlckdyb3VwLnN0eWxlKFwid2lkdGhcIiwgb2JqLmV4cG9ydGFibGUud2lkdGggKyBcInB4XCIpO1xuICAgIH1cblxuICAgIHZhciBmb290ZXJUZXh0ID0gZm9vdGVyR3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZS10ZXh0XCIpXG4gICAgICAudGV4dChvYmouc291cmNlKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgIGZvb3RlclRleHRcbiAgICAgICAgLmF0dHIoXCJjb250ZW50RWRpdGFibGVcIiwgdHJ1ZSlcbiAgICAgICAgLmNsYXNzZWQoXCJlZGl0YWJsZS1jaGFydF9zb3VyY2VcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgb2JqLmRpbWVuc2lvbnMuZm9vdGVySGVpZ2h0ID0gZm9vdGVyR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmb290ZXJHcm91cDogZm9vdGVyR3JvdXBcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvb3RlckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvZm9vdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHBsb3Qobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGRyYXcgPSB7XG4gICAgbGluZTogcmVxdWlyZShcIi4uL3R5cGVzL2xpbmVcIiksXG4gICAgbXVsdGlsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvbXVsdGlsaW5lXCIpLFxuICAgIGFyZWE6IHJlcXVpcmUoXCIuLi90eXBlcy9hcmVhXCIpLFxuICAgIHN0YWNrZWRBcmVhOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RhY2tlZC1hcmVhXCIpLFxuICAgIGNvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL2NvbHVtblwiKSxcbiAgICBiYXI6IHJlcXVpcmUoXCIuLi90eXBlcy9iYXJcIiksXG4gICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4uL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgIHN0cmVhbWdyYXBoOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RyZWFtZ3JhcGhcIilcbiAgfTtcblxuICB2YXIgY2hhcnRSZWY7XG5cbiAgc3dpdGNoKG9iai5vcHRpb25zLnR5cGUpIHtcblxuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubXVsdGlsaW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJhcmVhXCI6XG4gICAgICBjaGFydFJlZiA9IG9iai5vcHRpb25zLnN0YWNrZWQgPyBkcmF3LnN0YWNrZWRBcmVhKG5vZGUsIG9iaikgOiBkcmF3LmFyZWEobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImJhclwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LmJhcihub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY29sdW1uXCI6XG4gICAgICBjaGFydFJlZiA9IG9iai5vcHRpb25zLnN0YWNrZWQgPyBkcmF3LnN0YWNrZWRDb2x1bW4obm9kZSwgb2JqKSA6IGRyYXcuY29sdW1uKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJzdHJlYW1cIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5zdHJlYW1ncmFwaChub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LmxpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGNoYXJ0UmVmO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGxvdDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBMaW5lQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaExpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfSxcbiAgICAgIFwiZFwiOiBoTGluZVxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGhMaW5lOiBoTGluZSxcbiAgICBsaW5lOiBsaW5lXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvbGluZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBBeGlzRmFjdG9yeShheGlzT2JqLCBzY2FsZSkge1xuXG4gIHZhciBheGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZShzY2FsZSlcbiAgICAub3JpZW50KGF4aXNPYmoub3JpZW50KTtcblxuICByZXR1cm4gYXhpcztcblxufVxuXG5mdW5jdGlvbiBheGlzTWFuYWdlcihub2RlLCBvYmosIHNjYWxlLCBheGlzVHlwZSkge1xuXG4gIHZhciBheGlzT2JqID0gb2JqW2F4aXNUeXBlXTtcbiAgdmFyIGF4aXMgPSBuZXcgQXhpc0ZhY3RvcnkoYXhpc09iaiwgc2NhbGUpO1xuXG4gIHZhciBwcmV2QXhpcyA9IG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLm5vZGUoKTtcblxuICBpZiAocHJldkF4aXMgIT09IG51bGwpIHsgZDMuc2VsZWN0KHByZXZBeGlzKS5yZW1vdmUoKTsgfVxuXG4gIHZhciBheGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKTtcblxuICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuICAgIGFwcGVuZFhBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1R5cGUpO1xuICB9IGVsc2UgaWYgKGF4aXNUeXBlID09PSBcInlBeGlzXCIpIHtcbiAgICBhcHBlbmRZQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNUeXBlKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbm9kZTogYXhpc0dyb3VwLFxuICAgIGF4aXM6IGF4aXNcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVGb3JtYXQoY29udGV4dCkge1xuXG4gIHN3aXRjaCAoY29udGV4dCkge1xuICAgIGNhc2UgXCJ5ZWFyc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlWVwiKTtcbiAgICBjYXNlIFwibW9udGhzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiViXCIpO1xuICAgIGNhc2UgXCJ3ZWVrc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlV1wiKTtcbiAgICBjYXNlIFwiZGF5c1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlalwiKTtcbiAgICBjYXNlIFwiaG91cnNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJUhcIik7XG4gICAgY2FzZSBcIm1pbnV0ZXNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJU1cIik7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhcHBlbmRYQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNOYW1lKSB7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbYXhpc05hbWVdLFxuICAgICAgYXhpc1NldHRpbmdzO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS54X2F4aXMpIHtcbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5leHRlbmQ7XG4gICAgYXhpc1NldHRpbmdzID0gZXh0ZW5kKGF4aXNPYmosIG9iai5leHBvcnRhYmxlLnhfYXhpcyk7XG4gIH0gZWxzZSB7XG4gICAgYXhpc1NldHRpbmdzID0gYXhpc09iajtcbiAgfVxuXG4gIGF4aXNHcm91cFxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpICsgXCIpXCIpO1xuXG4gIHZhciBheGlzTm9kZSA9IGF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ4LWF4aXNcIik7XG5cbiAgc3dpdGNoKGF4aXNPYmouc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgdGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgZGlzY3JldGVBeGlzKGF4aXNOb2RlLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzLCBvYmouZGltZW5zaW9ucyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBvcmRpbmFsVGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncyk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0ID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS5oZWlnaHQ7XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kWUF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzTmFtZSkge1xuXG4gIGF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsMClcIik7XG5cbiAgdmFyIGF4aXNOb2RlID0gYXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInktYXhpc1wiKTtcblxuICBkcmF3WUF4aXMob2JqLCBheGlzLCBheGlzTm9kZSk7XG5cbn1cblxuZnVuY3Rpb24gZHJhd1lBeGlzKG9iaiwgYXhpcywgYXhpc05vZGUpIHtcblxuICB2YXIgYXhpc1NldHRpbmdzO1xuXG4gIHZhciBheGlzT2JqID0gb2JqW1wieUF4aXNcIl07XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnlfYXhpcykge1xuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmV4dGVuZDtcbiAgICBheGlzU2V0dGluZ3MgPSBleHRlbmQoYXhpc09iaiwgb2JqLmV4cG9ydGFibGUueV9heGlzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzU2V0dGluZ3MgPSBheGlzT2JqO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgPSBheGlzU2V0dGluZ3MucGFkZGluZ1JpZ2h0O1xuXG4gIGF4aXMuc2NhbGUoKS5yYW5nZShbb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKSwgMF0pO1xuXG4gIGF4aXMudGlja1ZhbHVlcyh0aWNrRmluZGVyWShheGlzLnNjYWxlKCksIGF4aXNPYmoudGlja3MsIGF4aXNTZXR0aW5ncykpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxuICAgIC5jYWxsKHVwZGF0ZVRleHRZLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKVxuICAgIC5jYWxsKHJlcG9zaXRpb25UZXh0WSwgb2JqLmRpbWVuc2lvbnMsIGF4aXNPYmoudGV4dFgpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgIFwieDJcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncykge1xuXG4gIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bMV0sIDMpLFxuICAgICAgY3VycmVudEZvcm1hdCA9IGRldGVybWluZUZvcm1hdChjdHgpO1xuXG4gIGF4aXMudGlja0Zvcm1hdChjdXJyZW50Rm9ybWF0KTtcblxuICB2YXIgdGlja3M7XG5cbiAgdmFyIHRpY2tHb2FsO1xuICBpZiAoYXhpc1NldHRpbmdzLnRpY2tzID09PSAnYXV0bycpIHtcbiAgICB0aWNrR29hbCA9IGF4aXNTZXR0aW5ncy50aWNrVGFyZ2V0O1xuICB9IGVsc2Uge1xuICAgIHRpY2tHb2FsID0gYXhpc1NldHRpbmdzLnRpY2tzO1xuICB9XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpID4gYXhpc1NldHRpbmdzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdGlja3MgPSB0aWNrRmluZGVyWChkb21haW4sIGN0eCwgdGlja0dvYWwpO1xuICB9IGVsc2Uge1xuICAgIHRpY2tzID0gdGlja0ZpbmRlclgoZG9tYWluLCBjdHgsIGF4aXNTZXR0aW5ncy50aWNrc1NtYWxsKTtcbiAgfVxuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlICE9PSBcImNvbHVtblwiKSB7XG4gICAgYXhpcy50aWNrVmFsdWVzKHRpY2tzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzLnRpY2tzKCk7XG4gIH1cblxuICBheGlzTm9kZS5jYWxsKGF4aXMpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cih7XG4gICAgICBcInhcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRYLFxuICAgICAgXCJ5XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WSxcbiAgICAgIFwiZHlcIjogYXhpc1NldHRpbmdzLmR5ICsgXCJlbVwiXG4gICAgfSlcbiAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgLmNhbGwoc2V0VGlja0Zvcm1hdFgsIGN0eCwgYXhpc1NldHRpbmdzLmVtcywgb2JqLm1vbnRoc0Ficik7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiY29sdW1uXCIpIHsgZHJvcFJlZHVuZGFudFRpY2tzKGF4aXNOb2RlLCBjdHgpOyB9XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilcbiAgICAuY2FsbChkcm9wVGlja3MpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxufVxuXG5mdW5jdGlvbiBkaXNjcmV0ZUF4aXMoYXhpc05vZGUsIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MsIGRpbWVuc2lvbnMpIHtcblxuICB2YXIgd3JhcFRleHQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikud3JhcFRleHQ7XG5cbiAgYXhpcy50aWNrUGFkZGluZygwKTtcblxuICBzY2FsZS5yYW5nZUV4dGVudChbMCwgZGltZW5zaW9ucy50aWNrV2lkdGgoKV0pO1xuXG4gIHNjYWxlLnJhbmdlUm91bmRCYW5kcyhbMCwgZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIGRpbWVuc2lvbnMuYmFuZHMucGFkZGluZywgZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpO1xuXG4gIHZhciBiYW5kU3RlcCA9IHNjYWxlLnJhbmdlQmFuZCgpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgLmF0dHIoXCJkeVwiLCBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCIpXG4gICAgLmNhbGwod3JhcFRleHQsIGJhbmRTdGVwKTtcblxuICB2YXIgZmlyc3RYUG9zID0gZDMudHJhbnNmb3JtKGF4aXNOb2RlLnNlbGVjdChcIi50aWNrXCIpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXSAqIC0xO1xuXG4gIHZhciB4UG9zID0gKC0gKGJhbmRTdGVwIC8gMikgLSAoYmFuZFN0ZXAgKiBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZykpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IHhQb3MsXG4gICAgICBcIngyXCI6IHhQb3NcbiAgICB9KTtcblxuICBheGlzTm9kZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4MVwiOiBmaXJzdFhQb3MsXG4gICAgICBcIngyXCI6IGZpcnN0WFBvc1xuICAgIH0pO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxuICB2YXIgbGFzdFRpY2sgPSBheGlzTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBcInRpY2tcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKGRpbWVuc2lvbnMudGlja1dpZHRoKCkgKyAoYmFuZFN0ZXAgLyAyKSArIGJhbmRTdGVwICogZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpICsgXCIsMClcIlxuICAgIH0pO1xuXG4gIGxhc3RUaWNrLmFwcGVuZChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcInkyXCI6IGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0LFxuICAgICAgXCJ4MVwiOiB4UG9zLFxuICAgICAgXCJ4MlwiOiB4UG9zXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gb3JkaW5hbFRpbWVBeGlzKGF4aXNOb2RlLCBvYmosIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MpIHtcblxuICB2YXIgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmYsXG4gICAgICBkb21haW4gPSBzY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgMyksXG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZGV0ZXJtaW5lRm9ybWF0KGN0eCk7XG5cbiAgYXhpcy50aWNrRm9ybWF0KGN1cnJlbnRGb3JtYXQpO1xuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFgsXG4gICAgICBcInlcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRZLFxuICAgICAgXCJkeVwiOiBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAuY2FsbChzZXRUaWNrRm9ybWF0WCwgY3R4LCBheGlzU2V0dGluZ3MuZW1zLCBvYmoubW9udGhzQWJyKTtcblxuICBpZiAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpID4gb2JqLnhBeGlzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdmFyIG9yZGluYWxUaWNrUGFkZGluZyA9IDc7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG9yZGluYWxUaWNrUGFkZGluZyA9IDQ7XG4gIH1cblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVxuICAgIC5jYWxsKG9yZGluYWxUaW1lVGlja3MsIGF4aXNOb2RlLCBjdHgsIHNjYWxlLCBvcmRpbmFsVGlja1BhZGRpbmcpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIilcbiAgICAuYXR0cihcInkyXCIsIGF4aXNTZXR0aW5ncy51cHBlci50aWNrSGVpZ2h0KTtcblxufVxuXG4vLyB0ZXh0IGZvcm1hdHRpbmcgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIHNldFRpY2tGb3JtYXRYKHNlbGVjdGlvbiwgY3R4LCBlbXMsIG1vbnRoc0Ficikge1xuXG4gIHZhciBwcmV2WWVhcixcbiAgICAgIHByZXZNb250aCxcbiAgICAgIHByZXZEYXRlLFxuICAgICAgZFllYXIsXG4gICAgICBkTW9udGgsXG4gICAgICBkRGF0ZSxcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbihkKSB7XG5cbiAgICB2YXIgbm9kZSA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgIHZhciBkU3RyO1xuXG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkU3RyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcblxuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgIG5ld1RleHROb2RlKG5vZGUsIGRZZWFyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRNb250aDtcblxuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gbW9udGhzQWJyW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG5cbiAgICAgICAgaWYgKGRNb250aCAhPT0gcHJldk1vbnRoKSB7XG4gICAgICAgICAgZFN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZFN0ciA9IGREYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikge1xuICAgICAgICAgIG5ld1RleHROb2RlKG5vZGUsIGRZZWFyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzQWJyW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRIb3VyID0gZC5nZXRIb3VycygpO1xuICAgICAgICBkTWludXRlID0gZC5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgdmFyIGRIb3VyU3RyLFxuICAgICAgICAgICAgZE1pbnV0ZVN0cjtcblxuICAgICAgICAvLyBDb252ZXJ0IGZyb20gMjRoIHRpbWVcbiAgICAgICAgdmFyIHN1ZmZpeCA9IChkSG91ciA+PSAxMikgPyAncC5tLicgOiAnYS5tLic7XG4gICAgICAgIGlmIChkSG91ciA9PT0gMCkge1xuICAgICAgICAgIGRIb3VyU3RyID0gMTI7XG4gICAgICAgIH0gZWxzZSBpZiAoZEhvdXIgPiAxMikge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXIgLSAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBtaW51dGVzIGZvbGxvdyBHbG9iZSBzdHlsZVxuICAgICAgICBpZiAoZE1pbnV0ZSA9PT0gMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChkTWludXRlIDwgMTApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzowJyArIGRNaW51dGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6JyArIGRNaW51dGU7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZEhvdXJTdHIgKyBkTWludXRlU3RyICsgJyAnICsgc3VmZml4O1xuXG4gICAgICAgIGlmIChkRGF0ZSAhPT0gcHJldkRhdGUpIHtcbiAgICAgICAgICB2YXIgZGF0ZVN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGU7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZGF0ZVN0ciwgZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZEYXRlID0gZERhdGU7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkU3RyID0gZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRTdHI7XG5cbiAgfSk7XG5cbn1cblxuZnVuY3Rpb24gc2V0VGlja0Zvcm1hdFkoZm9ybWF0LCBkLCBsYXN0VGljaykge1xuICAvLyBjaGVja2luZyBmb3IgYSBmb3JtYXQgYW5kIGZvcm1hdHRpbmcgeS1heGlzIHZhbHVlcyBhY2NvcmRpbmdseVxuXG4gIHZhciBpc0Zsb2F0ID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5pc0Zsb2F0O1xuXG4gIHZhciBjdXJyZW50Rm9ybWF0O1xuXG4gIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgY2FzZSBcImdlbmVyYWxcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCJnXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNpXCI6XG4gICAgICB2YXIgcHJlZml4ID0gZDMuZm9ybWF0UHJlZml4KGxhc3RUaWNrKSxcbiAgICAgICAgICBmb3JtYXQgPSBkMy5mb3JtYXQoXCIuMWZcIik7XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZm9ybWF0KHByZWZpeC5zY2FsZShkKSkgKyBwcmVmaXguc3ltYm9sO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNvbW1hXCI6XG4gICAgICBpZiAoaXNGbG9hdChwYXJzZUZsb2F0KGQpKSkge1xuICAgICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4yZlwiKShkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsZ1wiKShkKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDFcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjFmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kMlwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMmZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQzXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4zZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDRcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjRmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsZ1wiKShkKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRGb3JtYXQ7XG5cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dFgodGV4dE5vZGVzLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKSB7XG5cbiAgdmFyIGxhc3RUaWNrID0gYXhpcy50aWNrVmFsdWVzKClbYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMV07XG5cbiAgdGV4dE5vZGVzXG4gICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIHZhbCA9IHNldFRpY2tGb3JtYXRZKGF4aXNPYmouZm9ybWF0LCBkLCBsYXN0VGljayk7XG4gICAgICBpZiAoaSA9PT0gYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YWwgPSAoYXhpc09iai5wcmVmaXggfHwgXCJcIikgKyB2YWwgKyAoYXhpc09iai5zdWZmaXggfHwgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRleHRZKHRleHROb2RlcywgYXhpc05vZGUsIG9iaiwgYXhpcywgYXhpc09iaikge1xuXG4gIHZhciBhcnIgPSBbXSxcbiAgICAgIGxhc3RUaWNrID0gYXhpcy50aWNrVmFsdWVzKClbYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMV07XG5cbiAgdGV4dE5vZGVzXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciB2YWwgPSBzZXRUaWNrRm9ybWF0WShheGlzT2JqLmZvcm1hdCwgZCwgbGFzdFRpY2spO1xuICAgICAgaWYgKGkgPT09IGF4aXMudGlja1ZhbHVlcygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdmFsID0gKGF4aXNPYmoucHJlZml4IHx8IFwiXCIpICsgdmFsICsgKGF4aXNPYmouc3VmZml4IHx8IFwiXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KVxuICAgIC50ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgIHZhciB0ZXh0Q2hhciA9IHNlbC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBhcnIucHVzaCh0ZXh0Q2hhcik7XG4gICAgICByZXR1cm4gc2VsLnRleHQoKTtcbiAgICB9KVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZHlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChheGlzT2JqLmR5ICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIGF4aXNPYmouZHkgKyBcImVtXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiZHlcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChheGlzT2JqLnRleHRYICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIGF4aXNPYmoudGV4dFg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwieFwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmoudGV4dFkgIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai50ZXh0WTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCA9IGQzLm1heChhcnIpO1xuXG59XG5cbmZ1bmN0aW9uIHJlcG9zaXRpb25UZXh0WSh0ZXh0LCBkaW1lbnNpb25zLCB0ZXh0WCkge1xuICB0ZXh0LmF0dHIoe1xuICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKGRpbWVuc2lvbnMubGFiZWxXaWR0aCAtIHRleHRYKSArIFwiLDApXCIsXG4gICAgXCJ4XCI6IDBcbiAgfSk7XG59XG5cbi8vIENsb25lcyBjdXJyZW50IHRleHQgc2VsZWN0aW9uIGFuZCBhcHBlbmRzXG4vLyBhIG5ldyB0ZXh0IG5vZGUgYmVsb3cgdGhlIHNlbGVjdGlvblxuZnVuY3Rpb24gbmV3VGV4dE5vZGUoc2VsZWN0aW9uLCB0ZXh0LCBlbXMpIHtcblxuICB2YXIgbm9kZU5hbWUgPSBzZWxlY3Rpb24ucHJvcGVydHkoXCJub2RlTmFtZVwiKSxcbiAgICAgIHBhcmVudCA9IGQzLnNlbGVjdChzZWxlY3Rpb24ubm9kZSgpLnBhcmVudE5vZGUpLFxuICAgICAgbGluZUhlaWdodCA9IGVtcyB8fCAxLjYsIC8vIGVtc1xuICAgICAgZHkgPSBwYXJzZUZsb2F0KHNlbGVjdGlvbi5hdHRyKFwiZHlcIikpLFxuICAgICAgeCA9IHBhcnNlRmxvYXQoc2VsZWN0aW9uLmF0dHIoXCJ4XCIpKSxcblxuICAgICAgY2xvbmVkID0gcGFyZW50LmFwcGVuZChub2RlTmFtZSlcbiAgICAgICAgLmF0dHIoXCJkeVwiLCBsaW5lSGVpZ2h0ICsgZHkgKyBcImVtXCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCB4KVxuICAgICAgICAudGV4dChmdW5jdGlvbigpIHsgcmV0dXJuIHRleHQ7IH0pO1xuXG4gIHJldHVybiBjbG9uZWQ7XG5cbn1cblxuLy8gdGljayBkcm9wcGluZyBmdW5jdGlvbnNcblxuZnVuY3Rpb24gZHJvcFRpY2tzKHNlbGVjdGlvbiwgb3B0cykge1xuXG4gIHZhciBvcHRzID0gb3B0cyB8fCB7fTtcblxuICB2YXIgdG9sZXJhbmNlID0gb3B0cy50b2xlcmFuY2UgfHwgMCxcbiAgICAgIGZyb20gPSBvcHRzLmZyb20gfHwgMCxcbiAgICAgIHRvID0gb3B0cy50byB8fCBzZWxlY3Rpb25bMF0ubGVuZ3RoO1xuXG4gIGZvciAodmFyIGogPSBmcm9tOyBqIDwgdG87IGorKykge1xuXG4gICAgdmFyIGMgPSBzZWxlY3Rpb25bMF1bal0sIC8vIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgIG4gPSBzZWxlY3Rpb25bMF1baiArIDFdOyAvLyBuZXh0IHNlbGVjdGlvblxuXG4gICAgaWYgKCFjIHx8ICFuIHx8ICFjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCB8fCAhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgY29udGludWU7IH1cblxuICAgIHdoaWxlICgoYy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCArIHRvbGVyYW5jZSkgPiBuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIHtcblxuICAgICAgaWYgKGQzLnNlbGVjdChuKS5kYXRhKClbMF0gPT09IHNlbGVjdGlvbi5kYXRhKClbdG9dKSB7XG4gICAgICAgIGQzLnNlbGVjdChjKS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQzLnNlbGVjdChuKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaisrO1xuXG4gICAgICBuID0gc2VsZWN0aW9uWzBdW2ogKyAxXTtcblxuICAgICAgaWYgKCFuKSB7IGJyZWFrOyB9XG5cbiAgICB9XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGRyb3BSZWR1bmRhbnRUaWNrcyhzZWxlY3Rpb24sIGN0eCkge1xuXG4gIHZhciB0aWNrcyA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoXCIudGlja1wiKTtcblxuICB2YXIgcHJldlllYXIsIHByZXZNb250aCwgcHJldkRhdGUsIHByZXZIb3VyLCBwcmV2TWludXRlLCBkWWVhciwgZE1vbnRoLCBkRGF0ZSwgZEhvdXIsIGRNaW51dGU7XG5cbiAgdGlja3MuZWFjaChmdW5jdGlvbihkKSB7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKGRZZWFyID09PSBwcmV2WWVhcikge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgaWYgKChkTW9udGggPT09IHByZXZNb250aCkgJiYgKGRZZWFyID09PSBwcmV2WWVhcikpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGRNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcblxuICAgICAgICBpZiAoKGREYXRlID09PSBwcmV2RGF0ZSkgJiYgKGRNb250aCA9PT0gcHJldk1vbnRoKSAmJiAoZFllYXIgPT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZEYXRlID0gZERhdGU7XG4gICAgICAgIHByZXZNb250aCA9IGRNb250aDtcbiAgICAgICAgcHJldlllYXIgPSBkWWVhcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICBpZiAoKGREYXRlID09PSBwcmV2RGF0ZSkgJiYgKGRIb3VyID09PSBwcmV2SG91cikgJiYgKGRNaW51dGUgPT09IHByZXZNaW51dGUpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgcHJldkhvdXIgPSBkSG91cjtcbiAgICAgICAgcHJldk1pbnV0ZSA9IGRNaW51dGU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbn1cblxuZnVuY3Rpb24gZHJvcE92ZXJzZXRUaWNrcyhheGlzTm9kZSwgdGlja1dpZHRoKSB7XG5cbiAgdmFyIGF4aXNHcm91cFdpZHRoID0gYXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aCxcbiAgICAgIHRpY2tBcnIgPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVswXTtcblxuICBpZiAodGlja0Fyci5sZW5ndGgpIHtcblxuICAgIHZhciBmaXJzdFRpY2tPZmZzZXQgPSBkMy50cmFuc2Zvcm0oZDMuc2VsZWN0KHRpY2tBcnJbMF0pXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuXG4gICAgaWYgKChheGlzR3JvdXBXaWR0aCArIGZpcnN0VGlja09mZnNldCkgPj0gdGlja1dpZHRoKSB7XG4gICAgICB2YXIgbGFzdFRpY2sgPSB0aWNrQXJyW3RpY2tBcnIubGVuZ3RoIC0gMV07XG4gICAgICBkMy5zZWxlY3QobGFzdFRpY2spLmF0dHIoXCJjbGFzc1wiLCBcImxhc3QtdGljay1oaWRlXCIpO1xuICAgICAgYXhpc0dyb3VwV2lkdGggPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuICAgICAgdGlja0FyciA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpWzBdO1xuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gdGlja0ZpbmRlclgoZG9tYWluLCBwZXJpb2QsIHRpY2tHb2FsKSB7XG5cbiAgLy8gc2V0IHJhbmdlc1xuICB2YXIgc3RhcnREYXRlID0gZG9tYWluWzBdLFxuICAgICAgZW5kRGF0ZSA9IGRvbWFpblsxXTtcblxuICAvLyBzZXQgdXBwZXIgYW5kIGxvd2VyIGJvdW5kcyBmb3IgbnVtYmVyIG9mIHN0ZXBzIHBlciB0aWNrXG4gIC8vIGkuZS4gaWYgeW91IGhhdmUgZm91ciBtb250aHMgYW5kIHNldCBzdGVwcyB0byAxLCB5b3UnbGwgZ2V0IDQgdGlja3NcbiAgLy8gYW5kIGlmIHlvdSBoYXZlIHNpeCBtb250aHMgYW5kIHNldCBzdGVwcyB0byAyLCB5b3UnbGwgZ2V0IDMgdGlja3NcbiAgdmFyIHN0ZXBMb3dlckJvdW5kID0gMSxcbiAgICAgIHN0ZXBVcHBlckJvdW5kID0gMTIsXG4gICAgICB0aWNrQ2FuZGlkYXRlcyA9IFtdLFxuICAgICAgY2xvc2VzdEFycjtcblxuICAvLyB1c2luZyB0aGUgdGljayBib3VuZHMsIGdlbmVyYXRlIG11bHRpcGxlIGFycmF5cy1pbi1vYmplY3RzIHVzaW5nXG4gIC8vIGRpZmZlcmVudCB0aWNrIHN0ZXBzLiBwdXNoIGFsbCB0aG9zZSBnZW5lcmF0ZWQgb2JqZWN0cyB0byB0aWNrQ2FuZGlkYXRlc1xuICBmb3IgKHZhciBpID0gc3RlcExvd2VyQm91bmQ7IGkgPD0gc3RlcFVwcGVyQm91bmQ7IGkrKykge1xuICAgIHZhciBvYmogPSB7fTtcbiAgICBvYmouaW50ZXJ2YWwgPSBpO1xuICAgIG9iai5hcnIgPSBkMy50aW1lW3BlcmlvZF0oc3RhcnREYXRlLCBlbmREYXRlLCBpKS5sZW5ndGg7XG4gICAgdGlja0NhbmRpZGF0ZXMucHVzaChvYmopO1xuICB9XG5cbiAgLy8gcmVkdWNlIHRvIGZpbmQgYSBiZXN0IGNhbmRpZGF0ZSBiYXNlZCBvbiB0aGUgZGVmaW5lZCB0aWNrR29hbFxuICBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xuICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgIHJldHVybiAoTWF0aC5hYnMoY3Vyci5hcnIgLSB0aWNrR29hbCkgPCBNYXRoLmFicyhwcmV2LmFyciAtIHRpY2tHb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXNbMF07XG4gIH0gZWxzZSB7XG4gICAgLy8gc2lnaC4gd2UgdHJpZWQuXG4gICAgY2xvc2VzdEFyci5pbnRlcnZhbCA9IDE7XG4gIH1cblxuICB2YXIgdGlja0FyciA9IGQzLnRpbWVbcGVyaW9kXShzdGFydERhdGUsIGVuZERhdGUsIGNsb3Nlc3RBcnIuaW50ZXJ2YWwpO1xuXG4gIHZhciBzdGFydERpZmYgPSB0aWNrQXJyWzBdIC0gc3RhcnREYXRlO1xuICB2YXIgdGlja0RpZmYgPSB0aWNrQXJyWzFdIC0gdGlja0FyclswXTtcblxuICAvLyBpZiBkaXN0YW5jZSBmcm9tIHN0YXJ0RGF0ZSB0byB0aWNrQXJyWzBdIGlzIGdyZWF0ZXIgdGhhbiBoYWxmIHRoZVxuICAvLyBkaXN0YW5jZSBiZXR3ZWVuIHRpY2tBcnJbMV0gYW5kIHRpY2tBcnJbMF0sIGFkZCBzdGFydERhdGUgdG8gdGlja0FyclxuXG4gIGlmICggc3RhcnREaWZmID4gKHRpY2tEaWZmIC8gMikgKSB7IHRpY2tBcnIudW5zaGlmdChzdGFydERhdGUpOyB9XG5cbiAgcmV0dXJuIHRpY2tBcnI7XG5cbn1cblxuZnVuY3Rpb24gdGlja0ZpbmRlclkoc2NhbGUsIHRpY2tDb3VudCwgdGlja1NldHRpbmdzKSB7XG5cbiAgLy8gSW4gYSBudXRzaGVsbDpcbiAgLy8gQ2hlY2tzIGlmIGFuIGV4cGxpY2l0IG51bWJlciBvZiB0aWNrcyBoYXMgYmVlbiBkZWNsYXJlZFxuICAvLyBJZiBub3QsIHNldHMgbG93ZXIgYW5kIHVwcGVyIGJvdW5kcyBmb3IgdGhlIG51bWJlciBvZiB0aWNrc1xuICAvLyBJdGVyYXRlcyBvdmVyIHRob3NlIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlcmUgYXJlIHRpY2sgYXJyYXlzIHdoZXJlXG4gIC8vIHRoZSBsYXN0IHZhbHVlIGluIHRoZSBhcnJheSBtYXRjaGVzIHRoZSBkb21haW4gbWF4IHZhbHVlXG4gIC8vIGlmIHNvLCB0cmllcyB0byBmaW5kIHRoZSB0aWNrIG51bWJlciBjbG9zZXN0IHRvIHRpY2tHb2FsIG91dCBvZiB0aGUgd2lubmVycyxcbiAgLy8gYW5kIHJldHVybnMgdGhhdCBhcnIgdG8gdGhlIHNjYWxlIGZvciB1c2VcblxuICB2YXIgbWluID0gc2NhbGUuZG9tYWluKClbMF0sXG4gICAgICBtYXggPSBzY2FsZS5kb21haW4oKVsxXTtcblxuICBpZiAodGlja0NvdW50ICE9PSBcImF1dG9cIikge1xuXG4gICAgcmV0dXJuIHNjYWxlLnRpY2tzKHRpY2tDb3VudCk7XG5cbiAgfSBlbHNlIHtcblxuICAgIHZhciB0aWNrTG93ZXJCb3VuZCA9IHRpY2tTZXR0aW5ncy50aWNrTG93ZXJCb3VuZCxcbiAgICAgICAgdGlja1VwcGVyQm91bmQgPSB0aWNrU2V0dGluZ3MudGlja1VwcGVyQm91bmQsXG4gICAgICAgIHRpY2tHb2FsID0gdGlja1NldHRpbmdzLnRpY2tHb2FsLFxuICAgICAgICBhcnIgPSBbXSxcbiAgICAgICAgdGlja0NhbmRpZGF0ZXMgPSBbXSxcbiAgICAgICAgY2xvc2VzdEFycjtcblxuICAgIGZvciAodmFyIGkgPSB0aWNrTG93ZXJCb3VuZDsgaSA8PSB0aWNrVXBwZXJCb3VuZDsgaSsrKSB7XG4gICAgICB2YXIgdGlja0NhbmRpZGF0ZSA9IHNjYWxlLnRpY2tzKGkpO1xuXG4gICAgICBpZiAobWluIDwgMCkge1xuICAgICAgICBpZiAoKHRpY2tDYW5kaWRhdGVbMF0gPT09IG1pbikgJiYgKHRpY2tDYW5kaWRhdGVbdGlja0NhbmRpZGF0ZS5sZW5ndGggLSAxXSA9PT0gbWF4KSkge1xuICAgICAgICAgIGFyci5wdXNoKHRpY2tDYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGlja0NhbmRpZGF0ZVt0aWNrQ2FuZGlkYXRlLmxlbmd0aCAtIDFdID09PSBtYXgpIHtcbiAgICAgICAgICBhcnIucHVzaCh0aWNrQ2FuZGlkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdGlja0NhbmRpZGF0ZXMucHVzaCh2YWx1ZS5sZW5ndGgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGNsb3Nlc3RBcnI7XG5cbiAgICBpZiAodGlja0NhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xuICAgICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIgLSB0aWNrR29hbCkgPCBNYXRoLmFicyhwcmV2IC0gdGlja0dvYWwpID8gY3VyciA6IHByZXYpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VzdEFyciA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjYWxlLnRpY2tzKGNsb3Nlc3RBcnIpO1xuXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBvcmRpbmFsVGltZVRpY2tzKHNlbGVjdGlvbiwgYXhpc05vZGUsIGN0eCwgc2NhbGUsIHRvbGVyYW5jZSkge1xuXG4gIGRyb3BSZWR1bmRhbnRUaWNrcyhheGlzTm9kZSwgY3R4KTtcblxuICAvLyBkcm9wUmVkdW5kYW50VGlja3MgaGFzIG1vZGlmaWVkIHRoZSBzZWxlY3Rpb24sIHNvIHdlIG5lZWQgdG8gcmVzZWxlY3RcbiAgLy8gdG8gZ2V0IGEgcHJvcGVyIGlkZWEgb2Ygd2hhdCdzIHN0aWxsIGF2YWlsYWJsZVxuICB2YXIgbmV3U2VsZWN0aW9uID0gYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIik7XG5cbiAgLy8gaWYgdGhlIGNvbnRleHQgaXMgXCJ5ZWFyc1wiLCBldmVyeSB0aWNrIGlzIGEgbWFqb3J0aWNrIHNvIHdlIGNhblxuICAvLyBqdXN0IHBhc3Mgb24gdGhlIGJsb2NrIGJlbG93XG4gIGlmIChjdHggIT09IFwieWVhcnNcIikge1xuXG4gICAgLy8gYXJyYXkgZm9yIGFueSBcIm1ham9yIHRpY2tzXCIsIGkuZS4gdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiBjb250ZXh0XG4gICAgLy8gb25lIGxldmVsIHVwLiBpLmUuLCBhIFwibW9udGhzXCIgY29udGV4dCBzZXQgb2YgdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiB0aGUgeWVhcixcbiAgICAvLyBvciBcImRheXNcIiBjb250ZXh0IHRpY2tzIHdpdGggYSBjaGFuZ2UgaW4gbW9udGggb3IgeWVhclxuICAgIHZhciBtYWpvclRpY2tzID0gW107XG5cbiAgICB2YXIgcHJldlllYXIsIHByZXZNb250aCwgcHJldkRhdGUsIGRZZWFyLCBkTW9udGgsIGREYXRlO1xuXG4gICAgbmV3U2VsZWN0aW9uLmVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGN1cnJTZWwgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgICBjYXNlIFwibW9udGhzXCI6XG4gICAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgaWYgKGRZZWFyICE9PSBwcmV2WWVhcikgeyBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7IH1cbiAgICAgICAgICBwcmV2WWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgICAgZFllYXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICAgIGlmICgoZE1vbnRoICE9PSBwcmV2TW9udGgpICYmIChkWWVhciAhPT0gcHJldlllYXIpKSB7XG4gICAgICAgICAgICBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkTW9udGggIT09IHByZXZNb250aCkge1xuICAgICAgICAgICAgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgICBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHByZXZNb250aCA9IGQuZ2V0TW9udGgoKTtcbiAgICAgICAgICBwcmV2WWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhvdXJzXCI6XG4gICAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgICBpZiAoZERhdGUgIT09IHByZXZEYXRlKSB7IG1ham9yVGlja3MucHVzaChjdXJyU2VsKTsgfVxuICAgICAgICAgIHByZXZEYXRlID0gZERhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdDAsIHRuO1xuXG4gICAgaWYgKG1ham9yVGlja3MubGVuZ3RoID4gMSkge1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ham9yVGlja3MubGVuZ3RoICsgMTsgaSsrKSB7XG5cbiAgICAgICAgaWYgKGkgPT09IDApIHsgLy8gZnJvbSB0MCB0byBtMFxuICAgICAgICAgIHQwID0gMDtcbiAgICAgICAgICB0biA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzWzBdLmRhdGEoKVswXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gKG1ham9yVGlja3MubGVuZ3RoKSkgeyAvLyBmcm9tIG1uIHRvIHRuXG4gICAgICAgICAgdDAgPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1tpIC0gMV0uZGF0YSgpWzBdKTtcbiAgICAgICAgICB0biA9IG5ld1NlbGVjdGlvbi5sZW5ndGggLSAxO1xuICAgICAgICB9IGVsc2UgeyAvLyBmcm9tIG0wIHRvIG1uXG4gICAgICAgICAgdDAgPSBuZXdTZWxlY3Rpb24uZGF0YSgpLmluZGV4T2YobWFqb3JUaWNrc1tpIC0gMV0uZGF0YSgpWzBdKTtcbiAgICAgICAgICB0biA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzW2ldLmRhdGEoKVswXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISEodG4gLSB0MCkpIHtcbiAgICAgICAgICBkcm9wVGlja3MobmV3U2VsZWN0aW9uLCB7XG4gICAgICAgICAgICBmcm9tOiB0MCxcbiAgICAgICAgICAgIHRvOiB0bixcbiAgICAgICAgICAgIHRvbGVyYW5jZTogdG9sZXJhbmNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGRyb3BUaWNrcyhuZXdTZWxlY3Rpb24sIHsgdG9sZXJhbmNlOiB0b2xlcmFuY2UgfSk7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgZHJvcFRpY2tzKG5ld1NlbGVjdGlvbiwgeyB0b2xlcmFuY2U6IHRvbGVyYW5jZSB9KTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKSB7XG5cbiAgLy8gdGhpcyBzZWN0aW9uIGlzIGtpbmRhIGdyb3NzLCBzb3JyeTpcbiAgLy8gcmVzZXRzIHJhbmdlcyBhbmQgZGltZW5zaW9ucywgcmVkcmF3cyB5QXhpcywgcmVkcmF3cyB4QXhpc1xuICAvLyDigKZ0aGVuIHJlZHJhd3MgeUF4aXMgYWdhaW4gaWYgdGljayB3cmFwcGluZyBoYXMgY2hhbmdlZCB4QXhpcyBoZWlnaHRcblxuICBkcmF3WUF4aXMob2JqLCB5QXhpc09iai5heGlzLCB5QXhpc09iai5ub2RlKTtcblxuICB2YXIgc2V0UmFuZ2VUeXBlID0gcmVxdWlyZShcIi4vc2NhbGVcIikuc2V0UmFuZ2VUeXBlLFxuICAgICAgc2V0UmFuZ2VBcmdzID0gcmVxdWlyZShcIi4vc2NhbGVcIikuc2V0UmFuZ2VBcmdzO1xuXG4gIHZhciBzY2FsZU9iaiA9IHtcbiAgICByYW5nZVR5cGU6IHNldFJhbmdlVHlwZShvYmoueEF4aXMpLFxuICAgIHJhbmdlOiB4QXhpc09iai5yYW5nZSB8fCBbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLFxuICAgIGJhbmRzOiBvYmouZGltZW5zaW9ucy5iYW5kcyxcbiAgICByYW5nZVBvaW50czogb2JqLnhBeGlzLnJhbmdlUG9pbnRzXG4gIH07XG5cbiAgc2V0UmFuZ2VBcmdzKHhBeGlzT2JqLmF4aXMuc2NhbGUoKSwgc2NhbGVPYmopO1xuXG4gIHZhciBwcmV2WEF4aXNIZWlnaHQgPSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodDtcblxuICB4QXhpc09iaiA9IGF4aXNNYW5hZ2VyKG5vZGUsIG9iaiwgeEF4aXNPYmouYXhpcy5zY2FsZSgpLCBcInhBeGlzXCIpO1xuXG4gIHhBeGlzT2JqLm5vZGVcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbFwiKSB7XG4gICAgZHJvcE92ZXJzZXRUaWNrcyh4QXhpc09iai5ub2RlLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSk7XG4gIH1cblxuICBpZiAocHJldlhBeGlzSGVpZ2h0ICE9PSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkge1xuICAgIGRyYXdZQXhpcyhvYmosIHlBeGlzT2JqLmF4aXMsIHlBeGlzT2JqLm5vZGUpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gYWRkWmVyb0xpbmUob2JqLCBub2RlLCBBeGlzLCBheGlzVHlwZSkge1xuXG4gIHZhciB0aWNrcyA9IEF4aXMuYXhpcy50aWNrVmFsdWVzKCksXG4gICAgICB0aWNrTWluID0gdGlja3NbMF0sXG4gICAgICB0aWNrTWF4ID0gdGlja3NbdGlja3MubGVuZ3RoIC0gMV07XG5cbiAgaWYgKCh0aWNrTWluIDw9IDApICYmICgwIDw9IHRpY2tNYXgpKSB7XG5cbiAgICB2YXIgcmVmR3JvdXAgPSBBeGlzLm5vZGUuc2VsZWN0QWxsKFwiLnRpY2s6bm90KC5cIiArIG9iai5wcmVmaXggKyBcIm1pbm9yKVwiKSxcbiAgICAgICAgcmVmTGluZSA9IHJlZkdyb3VwLnNlbGVjdChcImxpbmVcIik7XG5cbiAgICAvLyB6ZXJvIGxpbmVcbiAgICB2YXIgemVyb0xpbmUgPSBub2RlLmFwcGVuZChcImxpbmVcIilcbiAgICAgIC5zdHlsZShcInNoYXBlLXJlbmRlcmluZ1wiLCBcImNyaXNwRWRnZXNcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiemVyby1saW5lXCIpO1xuXG4gICAgdmFyIHRyYW5zZm9ybSA9IFswLCAwXTtcblxuICAgIHRyYW5zZm9ybVswXSArPSBkMy50cmFuc2Zvcm0obm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXTtcbiAgICB0cmFuc2Zvcm1bMV0gKz0gZDMudHJhbnNmb3JtKG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIGF4aXNUeXBlKS5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMV07XG4gICAgdHJhbnNmb3JtWzBdICs9IGQzLnRyYW5zZm9ybShyZWZHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG4gICAgdHJhbnNmb3JtWzFdICs9IGQzLnRyYW5zZm9ybShyZWZHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMV07XG5cbiAgICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuXG4gICAgICB6ZXJvTGluZS5hdHRyKHtcbiAgICAgICAgXCJ5MVwiOiByZWZMaW5lLmF0dHIoXCJ5MVwiKSxcbiAgICAgICAgXCJ5MlwiOiByZWZMaW5lLmF0dHIoXCJ5MlwiKSxcbiAgICAgICAgXCJ4MVwiOiAwLFxuICAgICAgICBcIngyXCI6IDAsXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgdHJhbnNmb3JtWzBdICsgXCIsXCIgKyB0cmFuc2Zvcm1bMV0gKyBcIilcIlxuICAgICAgfSk7XG5cbiAgICB9IGVsc2UgaWYgKGF4aXNUeXBlID09PSBcInlBeGlzXCIpIHtcblxuICAgICAgemVyb0xpbmUuYXR0cih7XG4gICAgICAgIFwieDFcIjogcmVmTGluZS5hdHRyKFwieDFcIiksXG4gICAgICAgIFwieDJcIjogcmVmTGluZS5hdHRyKFwieDJcIiksXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiAwLFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIHRyYW5zZm9ybVswXSArIFwiLFwiICsgdHJhbnNmb3JtWzFdICsgXCIpXCJcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmVmTGluZS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQXhpc0ZhY3Rvcnk6IEF4aXNGYWN0b3J5LFxuICBheGlzTWFuYWdlcjogYXhpc01hbmFnZXIsXG4gIGRldGVybWluZUZvcm1hdDogZGV0ZXJtaW5lRm9ybWF0LFxuICBhcHBlbmRYQXhpczogYXBwZW5kWEF4aXMsXG4gIGFwcGVuZFlBeGlzOiBhcHBlbmRZQXhpcyxcbiAgZHJhd1lBeGlzOiBkcmF3WUF4aXMsXG4gIHRpbWVBeGlzOiB0aW1lQXhpcyxcbiAgZGlzY3JldGVBeGlzOiBkaXNjcmV0ZUF4aXMsXG4gIG9yZGluYWxUaW1lQXhpczogb3JkaW5hbFRpbWVBeGlzLFxuICBzZXRUaWNrRm9ybWF0WDogc2V0VGlja0Zvcm1hdFgsXG4gIHNldFRpY2tGb3JtYXRZOiBzZXRUaWNrRm9ybWF0WSxcbiAgdXBkYXRlVGV4dFg6IHVwZGF0ZVRleHRYLFxuICB1cGRhdGVUZXh0WTogdXBkYXRlVGV4dFksXG4gIHJlcG9zaXRpb25UZXh0WTogcmVwb3NpdGlvblRleHRZLFxuICBuZXdUZXh0Tm9kZTogbmV3VGV4dE5vZGUsXG4gIGRyb3BUaWNrczogZHJvcFRpY2tzLFxuICBkcm9wT3ZlcnNldFRpY2tzOiBkcm9wT3ZlcnNldFRpY2tzLFxuICBkcm9wUmVkdW5kYW50VGlja3M6IGRyb3BSZWR1bmRhbnRUaWNrcyxcbiAgdGlja0ZpbmRlclg6IHRpY2tGaW5kZXJYLFxuICB0aWNrRmluZGVyWTogdGlja0ZpbmRlclksXG4gIGF4aXNDbGVhbnVwOiBheGlzQ2xlYW51cCxcbiAgYWRkWmVyb0xpbmU6IGFkZFplcm9MaW5lXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9heGlzLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHNjYWxlTWFuYWdlcihvYmosIGF4aXNUeXBlKSB7XG5cbiAgdmFyIGF4aXMgPSBvYmpbYXhpc1R5cGVdLFxuICAgICAgc2NhbGVPYmogPSBuZXcgU2NhbGVPYmoob2JqLCBheGlzLCBheGlzVHlwZSk7XG5cbiAgdmFyIHNjYWxlID0gc2V0U2NhbGVUeXBlKHNjYWxlT2JqLnR5cGUpO1xuXG4gIHNjYWxlLmRvbWFpbihzY2FsZU9iai5kb21haW4pO1xuXG4gIHNldFJhbmdlQXJncyhzY2FsZSwgc2NhbGVPYmopO1xuXG4gIGlmIChheGlzLm5pY2UpIHsgbmljZWlmeShzY2FsZSwgYXhpc1R5cGUsIHNjYWxlT2JqKTsgfVxuICBpZiAoYXhpcy5yZXNjYWxlKSB7IHJlc2NhbGUoc2NhbGUsIGF4aXNUeXBlLCBheGlzKTsgfVxuXG4gIHJldHVybiB7XG4gICAgb2JqOiBzY2FsZU9iaixcbiAgICBzY2FsZTogc2NhbGVcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBTY2FsZU9iaihvYmosIGF4aXMsIGF4aXNUeXBlKSB7XG4gIHRoaXMudHlwZSA9IGF4aXMuc2NhbGU7XG4gIHRoaXMuZG9tYWluID0gc2V0RG9tYWluKG9iaiwgYXhpcyk7XG4gIHRoaXMucmFuZ2VUeXBlID0gc2V0UmFuZ2VUeXBlKGF4aXMpO1xuICB0aGlzLnJhbmdlID0gc2V0UmFuZ2Uob2JqLCBheGlzVHlwZSk7XG4gIHRoaXMuYmFuZHMgPSBvYmouZGltZW5zaW9ucy5iYW5kcztcbiAgdGhpcy5yYW5nZVBvaW50cyA9IGF4aXMucmFuZ2VQb2ludHMgfHwgMS4wO1xufVxuXG5mdW5jdGlvbiBzZXRTY2FsZVR5cGUodHlwZSkge1xuXG4gIHZhciBzY2FsZVR5cGU7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnRpbWUuc2NhbGUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUub3JkaW5hbCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiaWRlbnRpdHlcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmlkZW50aXR5KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicG93XCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5wb3coKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzcXJ0XCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5zcXJ0KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibG9nXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5sb2coKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJxdWFudGl6ZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUucXVhbnRpemUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJxdWFudGlsZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUucXVhbnRpbGUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aHJlc2hvbGRcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnRocmVzaG9sZCgpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gc2NhbGVUeXBlO1xuXG59XG5cbmZ1bmN0aW9uIHNldFJhbmdlVHlwZShheGlzKSB7XG5cbiAgdmFyIHR5cGU7XG5cbiAgc3dpdGNoKGF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgIGNhc2UgXCJkaXNjcmV0ZVwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VSb3VuZEJhbmRzXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVBvaW50c1wiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHR5cGUgPSBcInJhbmdlXCI7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB0eXBlO1xuXG59XG5cbmZ1bmN0aW9uIHNldFJhbmdlKG9iaiwgYXhpc1R5cGUpIHtcblxuICB2YXIgcmFuZ2U7XG5cbiAgaWYgKGF4aXNUeXBlID09PSBcInhBeGlzXCIpIHtcbiAgICByYW5nZSA9IFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV07IC8vIG9wZXJhdGluZyBvbiB3aWR0aFxuICB9IGVsc2UgaWYgKGF4aXNUeXBlID09PSBcInlBeGlzXCIpIHtcbiAgICByYW5nZSA9IFtvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpLCAwXTsgLy8gb3BlcmF0aW5nIG9uIGhlaWdodFxuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xuXG59XG5cbmZ1bmN0aW9uIHNldFJhbmdlQXJncyhzY2FsZSwgc2NhbGVPYmopIHtcblxuICBzd2l0Y2ggKHNjYWxlT2JqLnJhbmdlVHlwZSkge1xuICAgIGNhc2UgXCJyYW5nZVwiOlxuICAgICAgcmV0dXJuIHNjYWxlW3NjYWxlT2JqLnJhbmdlVHlwZV0oc2NhbGVPYmoucmFuZ2UpO1xuICAgIGNhc2UgXCJyYW5nZVJvdW5kQmFuZHNcIjpcbiAgICAgIHJldHVybiBzY2FsZVtzY2FsZU9iai5yYW5nZVR5cGVdKHNjYWxlT2JqLnJhbmdlLCBzY2FsZU9iai5iYW5kcy5wYWRkaW5nLCBzY2FsZU9iai5iYW5kcy5vdXRlclBhZGRpbmcpO1xuICAgIGNhc2UgXCJyYW5nZVBvaW50c1wiOlxuICAgICAgcmV0dXJuIHNjYWxlW3NjYWxlT2JqLnJhbmdlVHlwZV0oc2NhbGVPYmoucmFuZ2UsIHNjYWxlT2JqLnJhbmdlUG9pbnRzKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHNldERvbWFpbihvYmosIGF4aXMpIHtcblxuICB2YXIgZGF0YSA9IG9iai5kYXRhO1xuICB2YXIgZG9tYWluO1xuXG4gIC8vIGluY2x1ZGVkIGZhbGxiYWNrcyBqdXN0IGluIGNhc2VcbiAgc3dpdGNoKGF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgZG9tYWluID0gc2V0RGF0ZURvbWFpbihkYXRhLCBheGlzLm1pbiwgYXhpcy5tYXgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgdmFyIGNoYXJ0VHlwZSA9IG9iai5vcHRpb25zLnR5cGUsXG4gICAgICAgICAgZm9yY2VNYXhWYWw7XG4gICAgICBpZiAoY2hhcnRUeXBlID09PSBcImFyZWFcIiB8fCBjaGFydFR5cGUgPT09IFwiY29sdW1uXCIgfHwgY2hhcnRUeXBlID09PSBcImJhclwiKSB7XG4gICAgICAgIGZvcmNlTWF4VmFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGRvbWFpbiA9IHNldE51bWVyaWNhbERvbWFpbihkYXRhLCBheGlzLm1pbiwgYXhpcy5tYXgsIG9iai5vcHRpb25zLnN0YWNrZWQsIGZvcmNlTWF4VmFsKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuICAgICAgZG9tYWluID0gc2V0RGlzY3JldGVEb21haW4oZGF0YSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBkb21haW47XG5cbn1cblxuZnVuY3Rpb24gc2V0RGF0ZURvbWFpbihkYXRhLCBtaW4sIG1heCkge1xuICBpZiAobWluICYmIG1heCkge1xuICAgIHZhciBzdGFydERhdGUgPSBtaW4sIGVuZERhdGUgPSBtYXg7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGRhdGVSYW5nZSA9IGQzLmV4dGVudChkYXRhLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9KTtcbiAgICB2YXIgc3RhcnREYXRlID0gbWluIHx8IG5ldyBEYXRlKGRhdGVSYW5nZVswXSksXG4gICAgICAgIGVuZERhdGUgPSBtYXggfHwgbmV3IERhdGUoZGF0ZVJhbmdlWzFdKTtcbiAgfVxuICByZXR1cm4gW3N0YXJ0RGF0ZSwgZW5kRGF0ZV07XG59XG5cbmZ1bmN0aW9uIHNldE51bWVyaWNhbERvbWFpbihkYXRhLCBtaW4sIG1heCwgc3RhY2tlZCwgZm9yY2VNYXhWYWwpIHtcblxuICB2YXIgbWluVmFsLCBtYXhWYWw7XG4gIHZhciBtQXJyID0gW107XG5cbiAgZDMubWFwKGRhdGEuZGF0YSwgZnVuY3Rpb24oZCkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgZC5zZXJpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIG1BcnIucHVzaChOdW1iZXIoZC5zZXJpZXNbal0udmFsKSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIG1heFZhbCA9IGQzLm1heChkYXRhLnN0YWNrZWREYXRhW2RhdGEuc3RhY2tlZERhdGEubGVuZ3RoIC0gMV0sIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAoZC55MCArIGQueSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbWF4VmFsID0gZDMubWF4KG1BcnIpO1xuICB9XG5cbiAgbWluVmFsID0gZDMubWluKG1BcnIpO1xuXG4gIGlmIChtaW4pIHtcbiAgICBtaW5WYWwgPSBtaW47XG4gIH0gZWxzZSBpZiAobWluVmFsID4gMCkge1xuICAgIG1pblZhbCA9IDA7XG4gIH1cblxuICBpZiAobWF4KSB7XG4gICAgbWF4VmFsID0gbWF4O1xuICB9IGVsc2UgaWYgKG1heFZhbCA8IDAgJiYgZm9yY2VNYXhWYWwpIHtcbiAgICBtYXhWYWwgPSAwO1xuICB9XG5cbiAgcmV0dXJuIFttaW5WYWwsIG1heFZhbF07XG5cbn1cblxuZnVuY3Rpb24gc2V0RGlzY3JldGVEb21haW4oZGF0YSkge1xuICByZXR1cm4gZGF0YS5kYXRhLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2NhbGUoc2NhbGUsIGF4aXNUeXBlLCBheGlzT2JqKSB7XG5cbiAgc3dpdGNoKGF4aXNPYmouc2NhbGUpIHtcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBpZiAoIWF4aXNPYmoubWF4KSB7IHJlc2NhbGVOdW1lcmljYWwoc2NhbGUsIGF4aXNPYmopOyB9XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNjYWxlTnVtZXJpY2FsKHNjYWxlLCBheGlzT2JqKSB7XG5cbiAgLy8gcmVzY2FsZXMgdGhlIFwidG9wXCIgZW5kIG9mIHRoZSBkb21haW5cbiAgdmFyIHRpY2tzID0gc2NhbGUudGlja3MoMTApLnNsaWNlKCksXG4gICAgICB0aWNrSW5jciA9IE1hdGguYWJzKHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdKSAtIE1hdGguYWJzKHRpY2tzW3RpY2tzLmxlbmd0aCAtIDJdKTtcblxuICB2YXIgbmV3TWF4ID0gdGlja3NbdGlja3MubGVuZ3RoIC0gMV0gKyB0aWNrSW5jcjtcblxuICBzY2FsZS5kb21haW4oW3NjYWxlLmRvbWFpbigpWzBdLCBuZXdNYXhdKTtcblxufVxuXG5mdW5jdGlvbiBuaWNlaWZ5KHNjYWxlLCBheGlzVHlwZSwgc2NhbGVPYmopIHtcblxuICBzd2l0Y2goc2NhbGVPYmoudHlwZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICB2YXIgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICB2YXIgY29udGV4dCA9IHRpbWVEaWZmKHNjYWxlLmRvbWFpbigpWzBdLCBzY2FsZS5kb21haW4oKVsxXSwgMyk7XG4gICAgICBuaWNlaWZ5VGltZShzY2FsZSwgY29udGV4dCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBuaWNlaWZ5TnVtZXJpY2FsKHNjYWxlKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbmljZWlmeVRpbWUoc2NhbGUsIGNvbnRleHQpIHtcbiAgdmFyIGdldFRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWw7XG4gIHZhciB0aW1lSW50ZXJ2YWwgPSBnZXRUaW1lSW50ZXJ2YWwoY29udGV4dCk7XG4gIHNjYWxlLmRvbWFpbihzY2FsZS5kb21haW4oKSkubmljZSh0aW1lSW50ZXJ2YWwpO1xufVxuXG5mdW5jdGlvbiBuaWNlaWZ5TnVtZXJpY2FsKHNjYWxlKSB7XG4gIHNjYWxlLmRvbWFpbihzY2FsZS5kb21haW4oKSkubmljZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2NhbGVNYW5hZ2VyOiBzY2FsZU1hbmFnZXIsXG4gIFNjYWxlT2JqOiBTY2FsZU9iaixcbiAgc2V0U2NhbGVUeXBlOiBzZXRTY2FsZVR5cGUsXG4gIHNldFJhbmdlVHlwZTogc2V0UmFuZ2VUeXBlLFxuICBzZXRSYW5nZUFyZ3M6IHNldFJhbmdlQXJncyxcbiAgc2V0UmFuZ2U6IHNldFJhbmdlLFxuICBzZXREb21haW46IHNldERvbWFpbixcbiAgc2V0RGF0ZURvbWFpbjogc2V0RGF0ZURvbWFpbixcbiAgc2V0TnVtZXJpY2FsRG9tYWluOiBzZXROdW1lcmljYWxEb21haW4sXG4gIHNldERpc2NyZXRlRG9tYWluOiBzZXREaXNjcmV0ZURvbWFpbixcbiAgcmVzY2FsZTogcmVzY2FsZSxcbiAgcmVzY2FsZU51bWVyaWNhbDogcmVzY2FsZU51bWVyaWNhbCxcbiAgbmljZWlmeTogbmljZWlmeSxcbiAgbmljZWlmeVRpbWU6IG5pY2VpZnlUaW1lLFxuICBuaWNlaWZ5TnVtZXJpY2FsOiBuaWNlaWZ5TnVtZXJpY2FsXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zY2FsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBNdWx0aUxpbmVDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibXVsdGlsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaExpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcIm11bHRpbGluZSBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpbGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH0sXG4gICAgICBcImRcIjogaExpbmVcbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgbGluZTogbGluZVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpTGluZUNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEFyZWFDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIC8vIHdoYT9cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgLy8gU2Vjb25kYXJ5IGFycmF5IGlzIHVzZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gYWxsIHNlcmllcyBleGNlcHQgZm9yIHRoZSBoaWdobGlnaHRlZCBpdGVtXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBbXTtcblxuICBmb3IgKHZhciBpID0gb2JqLmRhdGEuc2VyaWVzQW1vdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBEb250IHdhbnQgdG8gaW5jbHVkZSB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSBpbiB0aGUgbG9vcFxuICAgIC8vIGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgaXQgdG8gc2l0IGFib3ZlIGFsbCB0aGUgb3RoZXIgbGluZXNcblxuICAgIGlmIChpICE9PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcblxuICAgICAgdmFyIGFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueTAoeVNjYWxlKDApKVxuICAgICAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tpXS52YWwpOyB9KTtcblxuICAgICAgdmFyIHBhdGhSZWYgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGFyZWEsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkXCI6IGxpbmUsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJsaW5lLVwiICsgKGkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBzZWNvbmRhcnlBcnIucHVzaChwYXRoUmVmKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlY29uZGFyeSBzZXJpZXMgKGFsbCBzZXJpZXMgZXhjZXB0IHRoZSBoaWdobGlnaHRlZCBvbmUpXG4gIC8vIGFuZCBzZXQgdGhlIGNvbG91cnMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblxuICB2YXIgc2Vjb25kYXJ5QXJyID0gc2Vjb25kYXJ5QXJyLnJldmVyc2UoKTtcblxuICB2YXIgaEFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSlcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgIC55MCh5U2NhbGUoMCkpXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZFwiOiBoQXJlYSxcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiZFwiOiBoTGluZSxcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGhBcmVhOiBoQXJlYSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcmVhQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9hcmVhLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIFN0YWNrZWRBcmVhQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBpZiAoeFNjYWxlT2JqLm9iai50eXBlID09PSBcIm9yZGluYWxcIikge1xuICAgIHhTY2FsZS5yYW5nZVJvdW5kUG9pbnRzKFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sIDEuMCk7XG4gIH1cblxuICAvLyB3aGE/XG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgbm9kZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcInN0YWNrZWRcIiwgdHJ1ZSk7XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5zZWxlY3RBbGwoXCJnLlwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzXCIpXG4gICAgLmRhdGEob2JqLmRhdGEuc3RhY2tlZERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwic3ZnOmdcIilcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7XG4gICAgICAgIGlmIChpID09PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdmFyIGFyZWEgPSBkMy5zdmcuYXJlYSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQueTAgKyBkLnkpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55MChmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCk7IH0pXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQueTAgKyBkLnkpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKTtcbiAgICAgIGlmIChpID09PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcbiAgICAgICAgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7IH0pXG4gICAgLmF0dHIoXCJkXCIsIGxpbmUpO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIHNlcmllczogc2VyaWVzLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrZWRBcmVhQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdGFja2VkLWFyZWEuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQ29sdW1uQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGUsIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBheGVzXG4gIHZhciB4QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeFNjYWxlT2JqLnNjYWxlLCBcInhBeGlzXCIpLFxuICAgICAgeUF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHlTY2FsZU9iai5zY2FsZSwgXCJ5QXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICBzd2l0Y2ggKG9iai54QXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG5cbiAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZUludGVydmFsLFxuICAgICAgICAgIHRpbWVFbGFwc2VkID0gdGltZUludGVydmFsKG9iai5kYXRhLmRhdGEpICsgMTtcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIHRpbWVFbGFwc2VkIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuXG4gICAgICB4QXhpc09iai5yYW5nZSA9IFswLCAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uICogb2JqLmRhdGEuc2VyaWVzQW1vdW50KSldO1xuXG4gICAgICBheGlzTW9kdWxlLmF4aXNDbGVhbnVwKG5vZGUsIG9iaiwgeEF4aXNPYmosIHlBeGlzT2JqKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWwtdGltZVwiOlxuXG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlKG9iai5kYXRhLmRhdGFbMV0ua2V5KSAtIHhTY2FsZShvYmouZGF0YS5kYXRhWzBdLmtleSk7XG5cbiAgICAgIG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cC5cIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0geFNjYWxlLnJhbmdlQmFuZCgpIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bHRpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGNvbHVtbkl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW5cIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY29sdW1uIFwiICsgb2JqLnByZWZpeCArIFwiY29sdW1uLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhTY2FsZShkLmtleSkgKyBcIiwwKVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb2x1bW5JdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQuc2VyaWVzW2ldLnZhbCA8IDAgPyBcIm5lZ2F0aXZlXCIgOiBcInBvc2l0aXZlXCI7XG4gICAgICAgIH0sXG4gICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIGkgKiBzaW5nbGVDb2x1bW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5rZXkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInlcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChkLnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICByZXR1cm4geVNjYWxlKE1hdGgubWF4KDAsIGQuc2VyaWVzW2ldLnZhbCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGlmIChkLnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKGQuc2VyaWVzW2ldLnZhbCkgLSB5U2NhbGUoMCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuXG4gICAgICB2YXIgY29sdW1uT2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuYmFuZHMub2Zmc2V0O1xuXG4gICAgICBjb2x1bW5JdGVtLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoKGkgKiBzaW5nbGVDb2x1bW4pICsgKHNpbmdsZUNvbHVtbiAqIChjb2x1bW5PZmZzZXQgLyAyKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLmtleSkgKyAoaSAqIChzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoc2luZ2xlQ29sdW1uIC0gKHNpbmdsZUNvbHVtbiAqIGNvbHVtbk9mZnNldCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgc2luZ2xlQ29sdW1uOiBzaW5nbGVDb2x1bW4sXG4gICAgY29sdW1uSXRlbTogY29sdW1uSXRlbVxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sdW1uQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9jb2x1bW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQmFyQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gYmVjYXVzZSB0aGUgZWxlbWVudHMgd2lsbCBiZSBhcHBlbmRlZCBpbiByZXZlcnNlIGR1ZSB0byB0aGVcbiAgLy8gYmFyIGNoYXJ0IG9wZXJhdGluZyBvbiB0aGUgeS1heGlzLCBuZWVkIHRvIHJldmVyc2UgdGhlIGRhdGFzZXQuXG4gIG9iai5kYXRhLmRhdGEucmV2ZXJzZSgpO1xuXG4gIHZhciB4QXhpc1NldHRpbmdzO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS54X2F4aXMpIHtcbiAgICB2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4uLy4uL2hlbHBlcnMvaGVscGVyc1wiKS5leHRlbmQ7XG4gICAgeEF4aXNTZXR0aW5ncyA9IGV4dGVuZChvYmoueEF4aXMsIG9iai5leHBvcnRhYmxlLnhfYXhpcyk7XG4gIH0gZWxzZSB7XG4gICAgeEF4aXNTZXR0aW5ncyA9IG9iai54QXhpcztcbiAgfVxuXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlO1xuXG4gIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeFNjYWxlKVxuICAgIC5vcmllbnQoXCJib3R0b21cIik7XG5cbiAgdmFyIHhBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiKTtcblxuICB2YXIgeEF4aXNOb2RlID0geEF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ4LWF4aXNcIilcbiAgICAuY2FsbCh4QXhpcyk7XG5cbiAgdmFyIHRleHRMZW5ndGhzID0gW107XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNTZXR0aW5ncy5iYXJPZmZzZXQpXG4gICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB0ZXh0TGVuZ3Rocy5wdXNoKGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KTtcbiAgICB9KTtcblxuICB2YXIgdGFsbGVzdFRleHQgPSB0ZXh0TGVuZ3Rocy5yZWR1Y2UoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gKGEgPiBiID8gYSA6IGIpIH0pO1xuXG4gIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0ID0gdGFsbGVzdFRleHQgKyB4QXhpc1NldHRpbmdzLmJhck9mZnNldDtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIG5lZWQgdGhpcyBmb3IgZml4ZWQtaGVpZ2h0IGJhcnNcbiAgaWYgKCFvYmouZXhwb3J0YWJsZSB8fCAob2JqLmV4cG9ydGFibGUgJiYgIW9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpKSB7XG4gICAgdmFyIHRvdGFsQmFySGVpZ2h0ID0gKG9iai5kaW1lbnNpb25zLmJhckhlaWdodCAqIG9iai5kYXRhLmRhdGEubGVuZ3RoICogb2JqLmRhdGEuc2VyaWVzQW1vdW50KTtcbiAgICB5U2NhbGUucmFuZ2VSb3VuZEJhbmRzKFt0b3RhbEJhckhlaWdodCwgMF0sIG9iai5kaW1lbnNpb25zLmJhbmRzLnBhZGRpbmcsIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQgPSB0b3RhbEJhckhlaWdodCAtICh0b3RhbEJhckhlaWdodCAqIG9iai5kaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyAqIDIpO1xuICB9XG5cbiAgdmFyIHlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgIC5zY2FsZSh5U2NhbGUpXG4gICAgLm9yaWVudChcImxlZnRcIik7XG5cbiAgdmFyIHlBeGlzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXBcIiArIFwiIFwiICsgb2JqLnByZWZpeCArIFwieUF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpO1xuXG4gIHZhciB5QXhpc05vZGUgPSB5QXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInktYXhpc1wiKVxuICAgIC5jYWxsKHlBeGlzKTtcblxuICB5QXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKS5yZW1vdmUoKTtcbiAgeUF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIikuYXR0cihcInhcIiwgMCk7XG5cbiAgaWYgKG9iai5kaW1lbnNpb25zLndpZHRoID4gb2JqLnlBeGlzLndpZHRoVGhyZXNob2xkKSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzLjU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heExhYmVsV2lkdGggPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLyAzO1xuICB9XG5cbiAgaWYgKHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoID4gbWF4TGFiZWxXaWR0aCkge1xuICAgIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcbiAgICB5QXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgLmNhbGwod3JhcFRleHQsIG1heExhYmVsV2lkdGgpXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRzcGFucyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoXCJ0c3BhblwiKSxcbiAgICAgICAgICAgIHRzcGFuQ291bnQgPSB0c3BhbnNbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgdGV4dEhlaWdodCA9IGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgaWYgKHRzcGFuQ291bnQgPiAxKSB7XG4gICAgICAgICAgdHNwYW5zXG4gICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgIFwieVwiOiAoKHRleHRIZWlnaHQgLyB0c3BhbkNvdW50KSAvIDIpIC0gKHRleHRIZWlnaHQgLyAyKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCA9IHlBeGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuXG4gIHlBeGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBcIiwwKVwiKTtcblxuICB2YXIgdGlja0ZpbmRlclggPSBheGlzTW9kdWxlLnRpY2tGaW5kZXJZO1xuXG4gIGlmIChvYmoueEF4aXMud2lkdGhUaHJlc2hvbGQgPiBvYmouZGltZW5zaW9ucy53aWR0aCkge1xuICAgIHZhciB4QXhpc1RpY2tTZXR0aW5ncyA9IHsgdGlja0xvd2VyQm91bmQ6IDMsIHRpY2tVcHBlckJvdW5kOiA4LCB0aWNrR29hbDogNiB9O1xuICB9IGVsc2Uge1xuICAgIHZhciB4QXhpc1RpY2tTZXR0aW5ncyA9IHsgdGlja0xvd2VyQm91bmQ6IDMsIHRpY2tVcHBlckJvdW5kOiA4LCB0aWNrR29hbDogNCB9O1xuICB9XG5cbiAgdmFyIHRpY2tzID0gdGlja0ZpbmRlclgoeFNjYWxlLCBvYmoueEF4aXMudGlja3MsIHhBeGlzVGlja1NldHRpbmdzKTtcblxuICB4U2NhbGUucmFuZ2UoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSk7XG5cbiAgeEF4aXMudGlja1ZhbHVlcyh0aWNrcyk7XG5cbiAgeEF4aXNOb2RlLmNhbGwoeEF4aXMpO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgLmF0dHIoXCJ5XCIsIHhBeGlzU2V0dGluZ3MuYmFyT2Zmc2V0KVxuICAgIC5jYWxsKGF4aXNNb2R1bGUudXBkYXRlVGV4dFgsIHhBeGlzTm9kZSwgb2JqLCB4QXhpcywgb2JqLnhBeGlzKTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUuZHluYW1pY0hlaWdodCkge1xuICAgIC8vIHdvcmtpbmcgd2l0aCBhIGR5bmFtaWMgYmFyIGhlaWdodFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIFwiKVwiKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB3b3JraW5nIHdpdGggYSBmaXhlZCBiYXIgaGVpZ2h0XG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyB0b3RhbEJhckhlaWdodCArIFwiKVwiKTtcbiAgfVxuXG4gIHZhciB4QXhpc1dpZHRoID0gZDMudHJhbnNmb3JtKHhBeGlzR3JvdXAuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdICsgeEF4aXNHcm91cC5ub2RlKCkuZ2V0QkJveCgpLndpZHRoO1xuXG4gIGlmICh4QXhpc1dpZHRoID4gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpKSB7XG5cbiAgICB4U2NhbGUucmFuZ2UoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHhBeGlzV2lkdGggLSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkpXSk7XG5cbiAgICB4QXhpc05vZGUuY2FsbCh4QXhpcyk7XG5cbiAgICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgdGV4dFwiKVxuICAgICAgLmF0dHIoXCJ5XCIsIHhBeGlzU2V0dGluZ3MuYmFyT2Zmc2V0KVxuICAgICAgLmNhbGwoYXhpc01vZHVsZS51cGRhdGVUZXh0WCwgeEF4aXNOb2RlLCBvYmosIHhBeGlzLCBvYmoueEF4aXMpO1xuXG4gIH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiKTtcblxuICB2YXIgc2luZ2xlQmFyID0geVNjYWxlLnJhbmdlQmFuZCgpIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmRhdGEuc2VyaWVzQW1vdW50OyBpKyspIHtcblxuICAgIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyBpKTtcblxuICAgIHZhciBiYXJJdGVtID0gc2VyaWVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwiYmFyXCIpXG4gICAgICAuZGF0YShvYmouZGF0YS5kYXRhKS5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcImJhciBcIiArIG9iai5wcmVmaXggKyBcImJhci1cIiArIChpKSxcbiAgICAgICAgXCJkYXRhLXNlcmllc1wiOiBpLFxuICAgICAgICBcImRhdGEta2V5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9LFxuICAgICAgICBcImRhdGEtbGVnZW5kXCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLmRhdGEua2V5c1tpICsgMV07IH0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArIHlTY2FsZShkLmtleSkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBiYXJJdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGQuc2VyaWVzW2ldLnZhbCA8IDAgPyBcIm5lZ2F0aXZlXCIgOiBcInBvc2l0aXZlXCI7XG4gICAgICAgIH0sXG4gICAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHhTY2FsZShNYXRoLm1pbigwLCBkLnNlcmllc1tpXS52YWwpKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBpICogc2luZ2xlQmFyO1xuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoeFNjYWxlKGQuc2VyaWVzW2ldLnZhbCkgLSB4U2NhbGUoMCkpO1xuICAgICAgICB9LFxuICAgICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBzaW5nbGVCYXI7IH1cbiAgICAgIH0pO1xuXG4gICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgIHZhciBiYXJPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5iYW5kcy5vZmZzZXQ7XG4gICAgICBiYXJJdGVtLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwieVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoKGkgKiBzaW5nbGVCYXIpICsgKHNpbmdsZUJhciAqIChiYXJPZmZzZXQgLyAyKSkpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoZWlnaHRcIjogc2luZ2xlQmFyIC0gKHNpbmdsZUJhciAqIGJhck9mZnNldClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwiZ1wiKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtaW5vclwiLCB0cnVlKTtcblxuICB4QXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieTFcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG4gICAgICAgICAgLy8gZHluYW1pYyBoZWlnaHQsIHNvIGNhbGN1bGF0ZSB3aGVyZSB0aGUgeTEgc2hvdWxkIGdvXG4gICAgICAgICAgcmV0dXJuIC0ob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmaXhlZCBoZWlnaHQsIHNvIHVzZSB0aGF0XG4gICAgICAgICAgcmV0dXJuIC0odG90YWxCYXJIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ5MlwiOiAwXG4gIH0pO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG5cbiAgICAvLyBkeW5hbWljIGhlaWdodCwgb25seSBuZWVkIHRvIHRyYW5zZm9ybSB4LWF4aXMgZ3JvdXBcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gIH0gZWxzZSB7XG5cbiAgICAvLyBmaXhlZCBoZWlnaHQsIHNvIHRyYW5zZm9ybSBhY2NvcmRpbmdseSBhbmQgbW9kaWZ5IHRoZSBkaW1lbnNpb24gZnVuY3Rpb24gYW5kIHBhcmVudCByZWN0c1xuXG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyB0b3RhbEJhckhlaWdodCArIFwiKVwiKTtcblxuICAgIG9iai5kaW1lbnNpb25zLnRvdGFsWEF4aXNIZWlnaHQgPSB4QXhpc0dyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50b3RhbFhBeGlzSGVpZ2h0OyB9O1xuXG4gICAgZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1hcmdpbiA9IG9iai5kaW1lbnNpb25zLm1hcmdpbjtcbiAgICAgICAgcmV0dXJuIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcbiAgICAgIH0pO1xuXG4gICAgZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gIH1cblxuICB2YXIgeEF4aXNPYmogPSB7IG5vZGU6IHhBeGlzR3JvdXAsIGF4aXM6IHhBeGlzIH0sXG4gICAgICB5QXhpc09iaiA9IHsgbm9kZTogeUF4aXNHcm91cCwgYXhpczogeUF4aXMgfTtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHhBeGlzT2JqLCBcInhBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgc2luZ2xlQmFyOiBzaW5nbGVCYXIsXG4gICAgYmFySXRlbTogYmFySXRlbVxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFyQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9iYXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RhY2tlZENvbHVtbkNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHlTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieUF4aXNcIiksXG4gICAgICB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIHN3aXRjaCAob2JqLnhBeGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcblxuICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgdGltZUVsYXBzZWQgPSB0aW1lSW50ZXJ2YWwob2JqLmRhdGEuZGF0YSk7XG4gICAgICB2YXIgc2luZ2xlQ29sdW1uID0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyB0aW1lRWxhcHNlZDtcblxuICAgICAgeEF4aXNPYmoucmFuZ2UgPSBbMCwgKG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gc2luZ2xlQ29sdW1uKV07XG5cbiAgICAgIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG5cbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUob2JqLmRhdGEuZGF0YVsxXS5rZXkpIC0geFNjYWxlKG9iai5kYXRhLmRhdGFbMF0ua2V5KTtcblxuICAgICAgbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwLlwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMikpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUucmFuZ2VCYW5kKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHhPZmZzZXQ7XG4gICAgICBpZiAob2JqLnhBeGlzLnNjYWxlID09PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHhPZmZzZXQgPSBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhPZmZzZXQgKyBcIiwwKVwiO1xuICAgIH0pXG5cbiAgLy8gQWRkIGEgZ3JvdXAgZm9yIGVhY2hcbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIC8vIEFkZCBhIHJlY3QgZm9yIGVhY2ggZGF0YSBwb2ludC5cbiAgdmFyIHJlY3QgPSBzZXJpZXMuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY29sdW1uXCIsXG4gICAgICBcImRhdGEta2V5XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQueDsgfSxcbiAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5sZWdlbmQ7IH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0sXG4gICAgICBcInlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKE1hdGgubWF4KDAsIGQueTAgKyBkLnkpKTsgfSxcbiAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIE1hdGguYWJzKHlTY2FsZShkLnkpIC0geVNjYWxlKDApKTsgfSxcbiAgICAgIFwid2lkdGhcIjogc2luZ2xlQ29sdW1uXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgcmVjdDogcmVjdFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZENvbHVtbkNoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RhY2tlZC1jb2x1bW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RyZWFtZ3JhcGhDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCJcbiAgICB9fSk7XG5cbiAgLy8gQWRkIGEgZ3JvdXAgZm9yIGVhY2ggY2F1c2UuXG4gIHZhciBzZXJpZXMgPSBzZXJpZXNHcm91cC5zZWxlY3RBbGwoXCJnLlwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzXCIpXG4gICAgLmRhdGEob2JqLmRhdGEuc3RhY2tlZERhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwic2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgKGkpOyB9KTtcblxuICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSlcbiAgICAueTAoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTApOyB9KVxuICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCArIGQueSk7IH0pO1xuXG4gIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic3RyZWFtLVwiICsgKGkpO1xuICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwic3RyZWFtLVwiICsgKGkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcImRcIiwgYXJlYSk7XG5cbiAgc2VyaWVzLmFwcGVuZChcInBhdGhcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLnByZWZpeCArIFwic3RyZWFtLXNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcImxpbmVcIjsgfSlcbiAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RyZWFtZ3JhcGhDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0cmVhbWdyYXBoLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIHF1YWxpZmllckNvbXBvbmVudChub2RlLCBvYmopIHtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSAhPT0gXCJiYXJcIikge1xuXG4gICAgdmFyIHlBeGlzTm9kZSA9IG5vZGUuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwieUF4aXNcIik7XG5cbiAgICBpZiAob2JqLmVkaXRhYmxlKSB7XG5cbiAgICAgIHZhciBmb3JlaWduT2JqZWN0ID0geUF4aXNOb2RlLmFwcGVuZChcImZvcmVpZ25PYmplY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiZm8gXCIgKyBvYmoucHJlZml4ICsgXCJxdWFsaWZpZXJcIixcbiAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiXG4gICAgICAgIH0pO1xuXG4gICAgICB2YXIgZm9yZWlnbk9iamVjdEdyb3VwID0gZm9yZWlnbk9iamVjdC5hcHBlbmQoXCJ4aHRtbDpkaXZcIilcbiAgICAgICAgLmF0dHIoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIik7XG5cbiAgICAgIHZhciBxdWFsaWZpZXJGaWVsZCA9IGZvcmVpZ25PYmplY3RHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyIGVkaXRhYmxlLWNoYXJ0X3F1YWxpZmllclwiLFxuICAgICAgICAgIFwiY29udGVudEVkaXRhYmxlXCI6IHRydWUsXG4gICAgICAgICAgXCJ4bWxuc1wiOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIlxuICAgICAgICB9KVxuICAgICAgICAudGV4dChvYmoucXVhbGlmaWVyKTtcblxuICAgICAgZm9yZWlnbk9iamVjdFxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ3aWR0aFwiOiBxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyAxNSxcbiAgICAgICAgICBcImhlaWdodFwiOiBxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKCAtIChxdWFsaWZpZXJGaWVsZC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSAvIDIgKSArIFwiKVwiXG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdmFyIHF1YWxpZmllckJnID0geUF4aXNOb2RlLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItdGV4dC1iZ1wiKVxuICAgICAgICAudGV4dChvYmoucXVhbGlmaWVyKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJkeVwiOiBcIjAuMzJlbVwiLFxuICAgICAgICAgIFwieVwiOiBcIjBcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwgMClcIlxuICAgICAgICB9KTtcblxuICAgICAgdmFyIHF1YWxpZmllclRleHQgPSB5QXhpc05vZGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci10ZXh0XCIpXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImR5XCI6IFwiMC4zMmVtXCIsXG4gICAgICAgICAgXCJ5XCI6IFwiMFwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLCAwKVwiXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHF1YWxpZmllckJnOiBxdWFsaWZpZXJCZyxcbiAgICBxdWFsaWZpZXJUZXh0OiBxdWFsaWZpZXJUZXh0XG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFsaWZpZXJDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFRpcHMgaGFuZGxpbmcgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy90aXBzXG4gKi9cblxuZnVuY3Rpb24gYmlzZWN0b3IoZGF0YSwga2V5VmFsLCBzdGFja2VkLCBpbmRleCkge1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB2YXIgYmlzZWN0ID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC54OyB9KS5sZWZ0O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyLnB1c2goYmlzZWN0KGRhdGFbaV0sIGtleVZhbCkpO1xuICAgIH07XG4gICAgcmV0dXJuIGFycjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgYmlzZWN0ID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pLmxlZnQ7XG4gICAgcmV0dXJuIGJpc2VjdChkYXRhLCBrZXlWYWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnNvclBvcyhvdmVybGF5KSB7XG4gIHJldHVybiB7XG4gICAgeDogZDMubW91c2Uob3ZlcmxheS5ub2RlKCkpWzBdLFxuICAgIHk6IGQzLm1vdXNlKG92ZXJsYXkubm9kZSgpKVsxXVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKSB7XG5cbiAgdmFyIHhTY2FsZU9iaiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iaixcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSxcbiAgICAgIHNjYWxlVHlwZSA9IHhTY2FsZU9iai5vYmoudHlwZTtcblxuICB2YXIgeFZhbDtcblxuICBpZiAoc2NhbGVUeXBlID09PSBcIm9yZGluYWwtdGltZVwiIHx8IHNjYWxlVHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcblxuICAgIHZhciBvcmRpbmFsQmlzZWN0aW9uID0gZDMuYmlzZWN0b3IoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSkubGVmdCxcbiAgICAgICAgcmFuZ2VQb3MgPSBvcmRpbmFsQmlzZWN0aW9uKHhTY2FsZS5yYW5nZSgpLCBjdXJzb3IueCk7XG5cbiAgICB4VmFsID0geFNjYWxlLmRvbWFpbigpW3JhbmdlUG9zXTtcblxuICB9IGVsc2Uge1xuICAgIHhWYWwgPSB4U2NhbGUuaW52ZXJ0KGN1cnNvci54KTtcbiAgfVxuXG4gIHZhciB0aXBEYXRhO1xuXG4gIGlmIChvYmoub3B0aW9ucy5zdGFja2VkKSB7XG4gICAgdmFyIGRhdGEgPSBvYmouZGF0YS5zdGFja2VkRGF0YTtcbiAgICB2YXIgaSA9IGJpc2VjdG9yKGRhdGEsIHhWYWwsIG9iai5vcHRpb25zLnN0YWNrZWQpO1xuXG4gICAgdmFyIGFyciA9IFtdLFxuICAgICAgICByZWZJbmRleDtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgaWYgKHJlZkluZGV4KSB7XG4gICAgICAgIGFyci5wdXNoKGRhdGFba11bcmVmSW5kZXhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkMCA9IGRhdGFba11baVtrXSAtIDFdLFxuICAgICAgICAgICAgZDEgPSBkYXRhW2tdW2lba11dO1xuICAgICAgICByZWZJbmRleCA9IHhWYWwgLSBkMC54ID4gZDEueCAtIHhWYWwgPyBpW2tdIDogKGlba10gLSAxKTtcbiAgICAgICAgYXJyLnB1c2goZGF0YVtrXVtyZWZJbmRleF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRpcERhdGEgPSBhcnI7XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0YSA9IG9iai5kYXRhLmRhdGE7XG4gICAgdmFyIGkgPSBiaXNlY3RvcihkYXRhLCB4VmFsKTtcbiAgICB2YXIgZDAgPSBkYXRhW2kgLSAxXSxcbiAgICAgICAgZDEgPSBkYXRhW2ldO1xuXG4gICAgdGlwRGF0YSA9IHhWYWwgLSBkMC5rZXkgPiBkMS5rZXkgLSB4VmFsID8gZDEgOiBkMDtcbiAgfVxuXG4gIHJldHVybiB0aXBEYXRhO1xuXG59XG5cbmZ1bmN0aW9uIHNob3dUaXBzKHRpcE5vZGVzLCBvYmopIHtcblxuICBpZiAodGlwTm9kZXMueFRpcExpbmUpIHtcbiAgICB0aXBOb2Rlcy54VGlwTGluZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBCb3gpIHtcbiAgICB0aXBOb2Rlcy50aXBCb3guY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgdHJ1ZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwUGF0aENpcmNsZXMpIHtcbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcy5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopIHtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJjb2x1bW5cIikge1xuICAgIGlmKG9iai5vcHRpb25zLnN0YWNrZWQpe1xuICAgICAgb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbChcInJlY3RcIikuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtdXRlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBvYmoucmVuZGVyZWQucGxvdC5jb2x1bW5JdGVtLnNlbGVjdEFsbChcInJlY3RcIikuY2xhc3NlZChvYmoucHJlZml4ICsgXCJtdXRlZFwiLCBmYWxzZSk7XG4gICAgfVxuXG4gIH1cblxuICBpZiAodGlwTm9kZXMueFRpcExpbmUpIHtcbiAgICB0aXBOb2Rlcy54VGlwTGluZS5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG4gIH1cblxuICBpZiAodGlwTm9kZXMudGlwQm94KSB7XG4gICAgdGlwTm9kZXMudGlwQm94LmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcykge1xuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKSB7XG4gIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopO1xuICB9LCBvYmoudGlwVGltZW91dCk7XG59XG5cbnZhciB0aW1lb3V0O1xuXG5mdW5jdGlvbiB0aXBzTWFuYWdlcihub2RlLCBvYmopIHtcblxuICB2YXIgdGlwTm9kZXMgPSBhcHBlbmRUaXBHcm91cChub2RlLCBvYmopO1xuXG4gIHZhciBmbnMgPSB7XG4gICAgbGluZTogTGluZUNoYXJ0VGlwcyxcbiAgICBtdWx0aWxpbmU6IExpbmVDaGFydFRpcHMsXG4gICAgYXJlYTogb2JqLm9wdGlvbnMuc3RhY2tlZCA/IFN0YWNrZWRBcmVhQ2hhcnRUaXBzIDogQXJlYUNoYXJ0VGlwcyxcbiAgICBjb2x1bW46IG9iai5vcHRpb25zLnN0YWNrZWQgPyBTdGFja2VkQ29sdW1uQ2hhcnRUaXBzIDogQ29sdW1uQ2hhcnRUaXBzLFxuICAgIHN0cmVhbTogU3RyZWFtZ3JhcGhUaXBzXG4gIH07XG5cbiAgdmFyIGRhdGFSZWZlcmVuY2U7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwibXVsdGlsaW5lXCIpIHtcbiAgICBkYXRhUmVmZXJlbmNlID0gW29iai5kYXRhLmRhdGFbMF0uc2VyaWVzWzBdXTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhUmVmZXJlbmNlID0gb2JqLmRhdGEuZGF0YVswXS5zZXJpZXM7XG4gIH1cblxuICB2YXIgaW5uZXJUaXBFbGVtZW50cyA9IGFwcGVuZFRpcEVsZW1lbnRzKG5vZGUsIG9iaiwgdGlwTm9kZXMsIGRhdGFSZWZlcmVuY2UpO1xuXG4gIHN3aXRjaCAob2JqLm9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgY2FzZSBcIm11bHRpbGluZVwiOlxuICAgIGNhc2UgXCJhcmVhXCI6XG4gICAgY2FzZSBcInN0cmVhbVwiOlxuXG4gICAgICB0aXBOb2Rlcy5vdmVybGF5ID0gdGlwTm9kZXMudGlwTm9kZS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF9vdmVybGF5XCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpLFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KClcbiAgICAgICAgfSk7XG5cbiAgICAgIHRpcE5vZGVzLm92ZXJsYXlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkgeyBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTsgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7IGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopOyB9KVxuICAgICAgICAub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBtb3VzZUlkbGUodGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgcmV0dXJuIGZuc1tvYmoub3B0aW9ucy50eXBlXSh0aXBOb2RlcywgaW5uZXJUaXBFbGVtZW50cywgb2JqKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImNvbHVtblwiOlxuXG4gICAgICB2YXIgY29sdW1uUmVjdHM7XG5cbiAgICAgIGlmIChvYmoub3B0aW9ucy5zdGFja2VkKSB7XG4gICAgICAgIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKCdyZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbHVtblJlY3RzXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBtb3VzZUlkbGUodGlwTm9kZXMsIG9iaik7XG4gICAgICAgICAgZm5zLmNvbHVtbih0aXBOb2Rlcywgb2JqLCBkLCB0aGlzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGhpZGVUaXBzKHRpcE5vZGVzLCBvYmopO1xuICAgICAgICB9KTtcblxuICAgICAgYnJlYWs7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhcHBlbmRUaXBHcm91cChub2RlLCBvYmopIHtcblxuICB2YXIgc3ZnTm9kZSA9IGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlKSxcbiAgICAgIGNoYXJ0Tm9kZSA9IGQzLnNlbGVjdChub2RlLm5vZGUoKS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuXG4gIHZhciB0aXBOb2RlID0gc3ZnTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyBvYmouZGltZW5zaW9ucy5tYXJnaW4ubGVmdCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMubWFyZ2luLnRvcCArIFwiKVwiLFxuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBcIlxuICAgIH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwidGlwX3N0YWNrZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IHRydWUgOiBmYWxzZTtcbiAgICB9KTtcblxuICB2YXIgeFRpcExpbmUgPSB0aXBOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF9saW5lLXhcIilcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuXG4gIHhUaXBMaW5lLmFwcGVuZChcImxpbmVcIik7XG5cbiAgdmFyIHRpcEJveCA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX2JveFwiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIlxuICAgIH0pO1xuXG4gIHZhciB0aXBSZWN0ID0gdGlwQm94LmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcF9yZWN0XCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZSgwLDApXCIsXG4gICAgICBcIndpZHRoXCI6IDEsXG4gICAgICBcImhlaWdodFwiOiAxXG4gICAgfSk7XG5cbiAgdmFyIHRpcEdyb3VwID0gdGlwQm94LmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF9ncm91cFwiKTtcblxuICB2YXIgbGVnZW5kSWNvbiA9IGNoYXJ0Tm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9pY29uXCIpLm5vZGUoKTtcblxuICBpZiAobGVnZW5kSWNvbikge1xuICAgIHZhciByYWRpdXMgPSBsZWdlbmRJY29uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8gMjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmFkaXVzID0gMDtcbiAgfVxuXG4gIHZhciB0aXBQYXRoQ2lyY2xlcyA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlLWdyb3VwXCIpO1xuXG4gIHZhciB0aXBUZXh0RGF0ZSA9IHRpcEdyb3VwXG4gICAgLmluc2VydChcImdcIiwgXCI6Zmlyc3QtY2hpbGRcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWRhdGUtZ3JvdXBcIilcbiAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX3RleHQtZGF0ZVwiLFxuICAgICAgXCJ4XCI6IDAsXG4gICAgICBcInlcIjogMCxcbiAgICAgIFwiZHlcIjogXCIxZW1cIlxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3ZnOiBzdmdOb2RlLFxuICAgIHRpcE5vZGU6IHRpcE5vZGUsXG4gICAgeFRpcExpbmU6IHhUaXBMaW5lLFxuICAgIHRpcEJveDogdGlwQm94LFxuICAgIHRpcFJlY3Q6IHRpcFJlY3QsXG4gICAgdGlwR3JvdXA6IHRpcEdyb3VwLFxuICAgIGxlZ2VuZEljb246IGxlZ2VuZEljb24sXG4gICAgdGlwUGF0aENpcmNsZXM6IHRpcFBhdGhDaXJjbGVzLFxuICAgIHJhZGl1czogcmFkaXVzLFxuICAgIHRpcFRleHREYXRlOiB0aXBUZXh0RGF0ZVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRpcEVsZW1lbnRzKG5vZGUsIG9iaiwgdGlwTm9kZXMsIGRhdGFSZWYpIHtcblxuICB2YXIgdGlwVGV4dEdyb3VwQ29udGFpbmVyID0gdGlwTm9kZXMudGlwR3JvdXBcbiAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAtY29udGFpbmVyXCI7XG4gICAgfSk7XG5cbiAgdmFyIHRpcFRleHRHcm91cHMgPSB0aXBUZXh0R3JvdXBDb250YWluZXJcbiAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAuZGF0YShkYXRhUmVmKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCBcIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwLVwiICsgKGkpO1xuICAgIH0pO1xuXG4gIHZhciBsaW5lSGVpZ2h0O1xuXG4gIHRpcFRleHRHcm91cHMuYXBwZW5kKFwidGV4dFwiKVxuICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF90ZXh0IFwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiZGF0YS1zZXJpZXNcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICBcInhcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGlwTm9kZXMucmFkaXVzICogMikgKyAodGlwTm9kZXMucmFkaXVzIC8gMS41KTtcbiAgICAgIH0sXG4gICAgICBcInlcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBsaW5lSGVpZ2h0ID0gbGluZUhlaWdodCB8fCBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJsaW5lLWhlaWdodFwiKSk7XG4gICAgICAgIHJldHVybiAoaSArIDEpICogbGluZUhlaWdodDtcbiAgICAgIH0sXG4gICAgICBcImR5XCI6IFwiMWVtXCJcbiAgICB9KTtcblxuICB0aXBUZXh0R3JvdXBzXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlLVwiICsgKGkpKTtcbiAgICAgIH0sXG4gICAgICBcInJcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgXCJjeFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRpcE5vZGVzLnJhZGl1czsgfSxcbiAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gKChpICsgMSkgKiBsaW5lSGVpZ2h0KSArICh0aXBOb2Rlcy5yYWRpdXMgKiAxLjUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgIC5kYXRhKGRhdGFSZWYpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlLVwiICsgKGkpKTtcbiAgICAgIH0sXG4gICAgICBcInJcIjogKHRpcE5vZGVzLnJhZGl1cyAvIDIpIHx8IDIuNVxuICAgIH0pO1xuXG4gIHJldHVybiB0aXBUZXh0R3JvdXBzO1xuXG59XG5cbmZ1bmN0aW9uIExpbmVDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnNlcmllc1tpXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YS5rZXkpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlOyB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgaWYgKGQudmFsKSB7IHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoZC52YWwpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy54VGlwTGluZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwieDFcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIEFyZWFDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnNlcmllc1tpXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YS5rZXkpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsID8gdHJ1ZSA6IGZhbHNlOyB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgaWYgKGQudmFsKSB7IHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoZC52YWwpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy54VGlwTGluZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwieDFcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFN0YWNrZWRBcmVhQ2hhcnRUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhW2ldLnkgPT09IE5hTiB8fCB0aXBEYXRhW2ldLnkwID09PSBOYU4pIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFN0cmVhbWdyYXBoVGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YVtpXS55ID09PSBOYU4gfHwgdGlwRGF0YVtpXS55MCA9PT0gTmFOKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sIDgpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgdmFyIHRleHQ7XG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aXBEYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGsgPT09IGkpIHtcbiAgICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFzVW5kZWZpbmVkICYmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIikpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhWzBdLngpO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY3hcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZShkLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHZhciB5ID0gZC55IHx8IDAsXG4gICAgICAgICAgICAgICAgeTAgPSBkLnkwIHx8IDA7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueVNjYWxlT2JqLnNjYWxlKHkgKyB5MCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy54VGlwTGluZS5zZWxlY3QoXCJsaW5lXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwieDFcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieDJcIjogb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBDb2x1bW5DaGFydFRpcHModGlwTm9kZXMsIG9iaiwgZCwgdGhpc1JlZikge1xuXG4gIHZhciBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKCdyZWN0JyksXG4gICAgICBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgdmFyIHRoaXNDb2x1bW4gPSB0aGlzUmVmLFxuICAgICAgdGlwRGF0YSA9IGQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnNlcmllc1tpXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICBpc1VuZGVmaW5lZCsrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpc1VuZGVmaW5lZCkge1xuXG4gICAgdmFyIHlGb3JtYXR0ZXIgPSByZXF1aXJlKFwiLi9heGlzXCIpLnNldFRpY2tGb3JtYXRZLFxuICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmYsXG4gICAgICBnZXRUcmFuc2xhdGVYWSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5nZXRUcmFuc2xhdGVYWSxcbiAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB2YXIgY3Vyc29yWCA9IGdldFRyYW5zbGF0ZVhZKHRoaXNDb2x1bW4ucGFyZW50Tm9kZSk7XG5cbiAgICBjb2x1bW5SZWN0c1xuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArICdtdXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzID09PSB0aGlzQ29sdW1uKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGlmKG9iai5kYXRlRm9ybWF0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAudGV4dCh0aXBEYXRhLmtleSk7XG4gICAgfVxuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5zZXJpZXMpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcblxuICAgICAgICAgIGlmKHggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpe1xuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHNob3dUaXBzKHRpcE5vZGVzLCBvYmopO1xuXG4gIH1cblxufVxuXG5cbmZ1bmN0aW9uIFN0YWNrZWRDb2x1bW5DaGFydFRpcHModGlwTm9kZXMsIG9iaiwgZCwgdGhpc1JlZikge1xuXG4gIHZhciBjb2x1bW5SZWN0cyA9IG9iai5yZW5kZXJlZC5wbG90LnNlcmllcy5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtblJlY3QgPSB0aGlzUmVmLFxuICAgICAgdGlwRGF0YSA9IGQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLnJhdy5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGlwRGF0YS5yYXcuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB2YXIgcGFyZW50RWwgPSBkMy5zZWxlY3QodGhpc0NvbHVtblJlY3QucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICB2YXIgcmVmUG9zID0gZDMuc2VsZWN0KHRoaXNDb2x1bW5SZWN0KS5hdHRyKFwieFwiKTtcblxuICAgIHZhciB0aGlzQ29sdW1uS2V5ID0gJyc7XG5cbiAgICAvKiBGaWd1cmUgb3V0IHdoaWNoIHN0YWNrIHRoaXMgc2VsZWN0ZWQgcmVjdCBpcyBpbiB0aGVuIGxvb3AgYmFjayB0aHJvdWdoIGFuZCAodW4pYXNzaWduIG11dGVkIGNsYXNzICovXG4gICAgY29sdW1uUmVjdHMuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJyxmdW5jdGlvbiAoZCkge1xuXG4gICAgICBpZih0aGlzID09PSB0aGlzQ29sdW1uUmVjdCl7XG4gICAgICAgIHRoaXNDb2x1bW5LZXkgPSBkLnJhdy5rZXk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAodGhpcyA9PT0gdGhpc0NvbHVtblJlY3QpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICBjb2x1bW5SZWN0cy5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLGZ1bmN0aW9uIChkKSB7XG5cbiAgICAgIHJldHVybiAoZC5yYXcua2V5ID09PSB0aGlzQ29sdW1uS2V5KSA/IGZhbHNlIDogdHJ1ZTtcblxuICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAgdGV4dFwiKVxuICAgICAgLmRhdGEodGlwRGF0YS5yYXcuc2VyaWVzKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBpZihvYmouZGF0ZUZvcm1hdCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YS5rZXkpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGQgPSB0aXBEYXRhLnJhdy5rZXk7XG4gICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX2NpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgICB9LFxuICAgICAgICBcInJcIjogZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgICBcImN5XCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICByZXR1cm4gKCAoaSArIDEpICogcGFyc2VJbnQoZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZm9udC1zaXplXCIpKSAqIDEuMTMgKyA5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnJhdy5zZXJpZXMpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFJlY3RcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ3aWR0aFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnJpZ2h0LFxuICAgICAgICBcImhlaWdodFwiOiB0aXBOb2Rlcy50aXBHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3AgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmJvdHRvbVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBpZiAocmVmUG9zID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG5cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gdGlwRGF0ZUZvcm1hdHRlcihzZWxlY3Rpb24sIGN0eCwgbW9udGhzLCBkYXRhKSB7XG5cbiAgdmFyIGRNb250aCxcbiAgICAgIGREYXRlLFxuICAgICAgZFllYXIsXG4gICAgICBkSG91cixcbiAgICAgIGRNaW51dGU7XG5cbiAgc2VsZWN0aW9uLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGQgPSBkYXRhO1xuICAgIHZhciBkU3RyO1xuICAgIHN3aXRjaCAoY3R4KSB7XG4gICAgICBjYXNlIFwieWVhcnNcIjpcbiAgICAgICAgZFN0ciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibW9udGhzXCI6XG4gICAgICAgIGRNb250aCA9IG1vbnRoc1tkLmdldE1vbnRoKCldO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZFN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGUgKyBcIiwgXCIgKyBkWWVhcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgIGRNb250aCA9IG1vbnRoc1tkLmdldE1vbnRoKCldO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZFN0ciA9IGRNb250aCArIFwiIFwiICsgZERhdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhvdXJzXCI6XG5cbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICB2YXIgZEhvdXJTdHIsXG4gICAgICAgICAgZE1pbnV0ZVN0cjtcblxuICAgICAgICAvLyBDb252ZXJ0IGZyb20gMjRoIHRpbWVcbiAgICAgICAgdmFyIHN1ZmZpeCA9IChkSG91ciA+PSAxMikgPyAncC5tLicgOiAnYS5tLic7XG5cbiAgICAgICAgaWYgKGRIb3VyID09PSAwKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSAxMjtcbiAgICAgICAgfSBlbHNlIGlmIChkSG91ciA+IDEyKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91ciAtIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIG1pbnV0ZXMgZm9sbG93IEdsb2JlIHN0eWxlXG4gICAgICAgIGlmIChkTWludXRlID09PSAwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGRNaW51dGUgPCAxMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOjAnICsgZE1pbnV0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzonICsgZE1pbnV0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRTdHIgPSBkSG91clN0ciArIGRNaW51dGVTdHIgKyAnICcgKyBzdWZmaXg7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkU3RyID0gZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRTdHI7XG5cbiAgfSk7XG5cbn1cblxuXG4vLyBbZnVuY3Rpb24gQmFyQ2hhcnRUaXBzKHRpcE5vZGVzLCBvYmopIHtcblxuLy8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRpcHNNYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy90aXBzLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogU29jaWFsIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsXG4gKi9cblxuLypcblRoaXMgY29tcG9uZW50IGFkZHMgYSBcInNvY2lhbFwiIGJ1dHRvbiB0byBlYWNoIGNoYXJ0IHdoaWNoIGNhbiBiZSB0b2dnbGVkIHRvIHByZXNlbnQgdGhlIHVzZXIgd2l0aCBzb2NpYWwgc2hhcmluZyBvcHRpb25zXG4gKi9cblxudmFyIGdldFRodW1ibmFpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS5nZXRUaHVtYm5haWxQYXRoO1xuXG5mdW5jdGlvbiBzb2NpYWxDb21wb25lbnQobm9kZSwgb2JqKSB7XG5cblx0dmFyIHNvY2lhbE9wdGlvbnMgPSBbXTtcblxuXHRmb3IgKHZhciBwcm9wIGluIG9iai5zb2NpYWwpIHtcblx0XHRpZiAob2JqLnNvY2lhbFtwcm9wXSkge1xuXHRcdFx0c3dpdGNoIChvYmouc29jaWFsW3Byb3BdLmxhYmVsKSB7XG5cdFx0XHRcdGNhc2UgXCJUd2l0dGVyXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RUd2l0dGVyVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJGYWNlYm9va1wiOlxuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0udXJsID0gY29uc3RydWN0RmFjZWJvb2tVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkVtYWlsXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RNYWlsVVJMKG9iaik7XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS5wb3B1cCA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiU01TXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RTTVNVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0lOQ09SUkVDVCBTT0NJQUwgSVRFTSBERUZJTklUSU9OJylcblx0XHRcdH1cblx0XHRcdHNvY2lhbE9wdGlvbnMucHVzaChvYmouc29jaWFsW3Byb3BdKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgY2hhcnRDb250YWluZXIgPSBkMy5zZWxlY3Qobm9kZSk7XG5cbiAgdmFyIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyLnNlbGVjdCgnLicgKyBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcblxuICBpZiAoY2hhcnRNZXRhLm5vZGUoKSA9PT0gbnVsbCkge1xuICAgIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG4gIH1cblxuXHR2YXIgY2hhcnRTb2NpYWxCdG4gPSBjaGFydE1ldGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YV9idG4nKVxuXHRcdC5odG1sKCdzaGFyZScpO1xuXG5cdHZhciBjaGFydFNvY2lhbCA9IGNoYXJ0Q29udGFpbmVyXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X3NvY2lhbCcpO1xuXG5cdHZhciBjaGFydFNvY2lhbENsb3NlQnRuID0gY2hhcnRTb2NpYWxcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsX2Nsb3NlJylcblx0XHQuaHRtbCgnJiN4ZDc7Jyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsT3B0aW9ucyA9IGNoYXJ0U29jaWFsXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X3NvY2lhbF9vcHRpb25zJyk7XG5cblx0Y2hhcnRTb2NpYWxPcHRpb25zXG5cdFx0LmFwcGVuZCgnaDMnKVxuXHRcdC5odG1sKCdTaGFyZSB0aGlzIGNoYXJ0OicpO1xuXG5cdGNoYXJ0U29jaWFsQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0U29jaWFsLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCB0cnVlKTtcblx0fSk7XG5cblx0Y2hhcnRTb2NpYWxDbG9zZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydFNvY2lhbC5jbGFzc2VkKG9iai5wcmVmaXggKyAnYWN0aXZlJywgZmFsc2UpO1xuXHR9KTtcblxuXHR2YXIgaXRlbUFtb3VudCA9IHNvY2lhbE9wdGlvbnMubGVuZ3RoO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBpdGVtQW1vdW50OyBpKysgKSB7XG5cdFx0Y2hhcnRTb2NpYWxPcHRpb25zXG5cdFx0XHQuc2VsZWN0QWxsKCcuJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWl0ZW0nKVxuXHRcdFx0LmRhdGEoc29jaWFsT3B0aW9ucylcblx0XHRcdC5lbnRlcigpXG5cdFx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdzb2NpYWwtaXRlbScpLmh0bWwoZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRpZiAoIWQucG9wdXApIHtcblx0XHRcdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCInICsgZC51cmwgKyAnXCI+PGltZyBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pY29uXCIgc3JjPVwiJyArIGQuaWNvbiArICdcIiB0aXRsZT1cIicgKyBkLmxhYmVsICsgJ1wiLz48L2E+Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJzxhIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnanMtc2hhcmVcIiBocmVmPVwiJyArIGQudXJsICsgJ1wiPjxpbWcgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdzb2NpYWwtaWNvblwiIHNyYz1cIicgKyBkLmljb24gKyAnXCIgdGl0bGU9XCInICsgZC5sYWJlbCArICdcIi8+PC9hPic7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG5cbiAgaWYgKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSB7XG4gICAgY2hhcnRTb2NpYWxPcHRpb25zXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdpbWFnZS11cmwnKVxuICAgICAgLmF0dHIoJ2NvbnRlbnRFZGl0YWJsZScsICd0cnVlJylcbiAgICAgIC5odG1sKGdldFRodW1ibmFpbChvYmopKTtcbiAgfVxuXG5cdHZhciBzaGFyZVBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcImpzLXNoYXJlXCIpO1xuXG4gIGlmIChzaGFyZVBvcHVwKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKHNoYXJlUG9wdXAsIGZ1bmN0aW9uKGFuY2hvcikge1xuICAgICAgYW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgd2luZG93UG9wdXAodGhpcy5ocmVmLCA2MDAsIDYyMCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG5cdHJldHVybiB7XG5cdFx0bWV0YV9uYXY6IGNoYXJ0TWV0YVxuXHR9O1xuXG59XG5cbi8vIHNvY2lhbCBwb3B1cFxuZnVuY3Rpb24gd2luZG93UG9wdXAodXJsLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIC8vIGNhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHBvcHVwIHNvIGl04oCZcyBjZW50ZXJlZCBvbiB0aGUgc2NyZWVuLlxuICB2YXIgbGVmdCA9IChzY3JlZW4ud2lkdGggLyAyKSAtICh3aWR0aCAvIDIpLFxuICAgICAgdG9wID0gKHNjcmVlbi5oZWlnaHQgLyAyKSAtIChoZWlnaHQgLyAyKTtcbiAgd2luZG93Lm9wZW4oXG4gICAgdXJsLFxuICAgIFwiXCIsXG4gICAgXCJtZW51YmFyPW5vLHRvb2xiYXI9bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyx3aWR0aD1cIiArIHdpZHRoICsgXCIsaGVpZ2h0PVwiICsgaGVpZ2h0ICsgXCIsdG9wPVwiICsgdG9wICsgXCIsbGVmdD1cIiArIGxlZnRcbiAgKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0RmFjZWJvb2tVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2RpYWxvZy9zaGFyZT8nLFxuICAgICAgcmVkaXJlY3QgPSBvYmouc29jaWFsLmZhY2Vib29rLnJlZGlyZWN0LFxuICAgICAgdXJsID0gJ2FwcF9pZD0nICsgb2JqLnNvY2lhbC5mYWNlYm9vay5hcHBJRCArICcmYW1wO2Rpc3BsYXk9cG9wdXAmYW1wO3RpdGxlPScgKyBvYmouaGVhZGluZyArICcmYW1wO2Rlc2NyaXB0aW9uPUZyb20lMjBhcnRpY2xlJyArIGRvY3VtZW50LnRpdGxlICsgJyZhbXA7aHJlZj0nICsgd2luZG93LmxvY2F0aW9uLmhyZWYgKyAnJmFtcDtyZWRpcmVjdF91cmk9JyArIHJlZGlyZWN0O1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJmFtcDtwaWN0dXJlPScgKyBnZXRUaHVtYm5haWwob2JqKTsgfVxuICByZXR1cm4gYmFzZSArIHVybDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0TWFpbFVSTChvYmope1xuICB2YXIgYmFzZSA9ICdtYWlsdG86Pyc7XG4gIHZhciB0aHVtYm5haWwgPSAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpID8gJyUwQScgKyBnZXRUaHVtYm5haWwob2JqKSA6IFwiXCI7XG4gIHJldHVybiBiYXNlICsgJ3N1YmplY3Q9JyArIG9iai5oZWFkaW5nICsgJyZhbXA7Ym9keT0nICsgb2JqLmhlYWRpbmcgKyB0aHVtYm5haWwgKyAnJTBBZnJvbSBhcnRpY2xlOiAnICsgZG9jdW1lbnQudGl0bGUgKyAnJTBBJyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RTTVNVUkwob2JqKXtcbiAgdmFyIGJhc2UgPSAnc21zOicsXG4gICAgICB1cmwgPSAnJmJvZHk9Q2hlY2slMjBvdXQlMjB0aGlzJTIwY2hhcnQ6ICcgKyBvYmouaGVhZGluZztcbiAgaWYgKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSB7ICB1cmwgKz0gJyUyMCcgKyBnZXRUaHVtYm5haWwob2JqKTsgfVxuICByZXR1cm4gYmFzZSArIHVybDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0VHdpdHRlclVSTChvYmope1xuICB2YXIgYmFzZSA9ICdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD8nLFxuICAgICAgaGFzaHRhZyA9ICEhKG9iai5zb2NpYWwudHdpdHRlci5oYXNodGFnKSA/ICcmYW1wO2hhc2h0YWdzPScgKyBvYmouc29jaWFsLnR3aXR0ZXIuaGFzaHRhZyA6IFwiXCIsXG4gICAgICB2aWEgPSAhIShvYmouc29jaWFsLnR3aXR0ZXIudmlhKSA/ICcmYW1wO3ZpYT0nICsgb2JqLnNvY2lhbC50d2l0dGVyLnZpYSA6IFwiXCIsXG4gICAgICB1cmwgPSAndXJsPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZiAgKyB2aWEgKyAnJmFtcDt0ZXh0PScgKyBlbmNvZGVVUkkob2JqLmhlYWRpbmcpICsgaGFzaHRhZztcbiAgaWYgKG9iai5pbWFnZSAmJiBvYmouaW1hZ2UuZW5hYmxlKSB7ICB1cmwgKz0gJyUyMCcgKyBnZXRUaHVtYm5haWwob2JqKTsgfVxuICByZXR1cm4gYmFzZSArIHVybDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb2NpYWxDb21wb25lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NvY2lhbC5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIFNoYXJpbmcgRGF0YSBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3NoYXJlLWRhdGFcbiAqL1xuXG4vKlxuVGhpcyBjb21wb25lbnQgYWRkcyBhIFwiZGF0YVwiIGJ1dHRvbiB0byBlYWNoIGNoYXJ0IHdoaWNoIGNhbiBiZSB0b2dnbGVkIHRvIHByZXNlbnQgdGhlIGNoYXJ0cyBkYXRhIGluIGEgdGFidWxhciBmb3JtIGFsb25nIHdpdGggYnV0dG9ucyBhbGxvd2luZyB0aGUgcmF3IGRhdGEgdG8gYmUgZG93bmxvYWRlZFxuICovXG5cbmZ1bmN0aW9uIHNoYXJlRGF0YUNvbXBvbmVudChub2RlLCBvYmopIHtcblxuIFx0dmFyIGNoYXJ0Q29udGFpbmVyID0gZDMuc2VsZWN0KG5vZGUpO1xuXG4gIHZhciBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lci5zZWxlY3QoJy4nICsgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG5cbiAgaWYgKGNoYXJ0TWV0YS5ub2RlKCkgPT09IG51bGwpIHtcbiAgICBjaGFydE1ldGEgPSBjaGFydENvbnRhaW5lclxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuICB9XG5cblx0dmFyIGNoYXJ0RGF0YUJ0biA9IGNoYXJ0TWV0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhX2J0bicpXG5cdFx0Lmh0bWwoJ2RhdGEnKTtcblxuXHR2YXIgY2hhcnREYXRhID0gY2hhcnRDb250YWluZXJcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YScpO1xuXG5cdHZhciBjaGFydERhdGFDbG9zZUJ0biA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX2Nsb3NlJylcblx0XHQuaHRtbCgnJiN4ZDc7Jyk7XG5cblx0dmFyIGNoYXJ0RGF0YVRhYmxlID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfaW5uZXInKTtcblxuXHRjaGFydERhdGFcblx0XHQuYXBwZW5kKCdoMicpXG5cdFx0Lmh0bWwob2JqLmhlYWRpbmcpO1xuXG5cdHZhciBjaGFydERhdGFOYXYgPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9uYXYnKTtcblxuXHR2YXIgY3N2RExCdG4gPSBjaGFydERhdGFOYXZcblx0XHQuYXBwZW5kKCdhJylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfYnRuIGNzdicpXG5cdFx0Lmh0bWwoJ2Rvd25sb2FkIGNzdicpO1xuXG4gIHZhciBjc3ZUb1RhYmxlID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmNzdlRvVGFibGU7XG5cblx0Y3N2VG9UYWJsZShjaGFydERhdGFUYWJsZSwgb2JqLmRhdGEuY3N2KTtcblxuXHRjaGFydERhdGFCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnREYXRhLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCB0cnVlKTtcblx0fSk7XG5cblx0Y2hhcnREYXRhQ2xvc2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnREYXRhLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCBmYWxzZSk7XG5cdH0pO1xuXG5cdGNzdkRMQnRuLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG5cdCAgdmFyIGRsRGF0YSA9ICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iai5kYXRhLmNzdik7XG5cdCAgZDMuc2VsZWN0KHRoaXMpXG5cdCAgXHQuYXR0cignaHJlZicsIGRsRGF0YSlcblx0ICBcdC5hdHRyKCdkb3dubG9hZCcsJ2RhdGFfJyArIG9iai5pZCArICcuY3N2Jyk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bWV0YV9uYXY6IGNoYXJ0TWV0YSxcblx0XHRkYXRhX3BhbmVsOiBjaGFydERhdGFcblx0fTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoYXJlRGF0YUNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc2hhcmUtZGF0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEN1c3RvbSBjb2RlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGludm9rZWQgdG8gbW9kaWZ5IGNoYXJ0IGVsZW1lbnRzIGFmdGVyIGNoYXJ0IGRyYXdpbmcgaGFzIG9jY3VycmVkLlxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlICAgICAgICAgVGhlIG1haW4gY29udGFpbmVyIGdyb3VwIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNoYXJ0UmVjaXBlICBPYmplY3QgdGhhdCBjb250YWlucyBzZXR0aW5ncyBmb3IgdGhlIGNoYXJ0LlxuICogQHBhcmFtICB7T2JqZWN0fSByZW5kZXJlZCAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgcmVmZXJlbmNlcyB0byBhbGwgcmVuZGVyZWQgY2hhcnQgZWxlbWVudHMsIGluY2x1ZGluZyBheGVzLCBzY2FsZXMsIHBhdGhzLCBub2RlcywgYW5kIHNvIGZvcnRoLlxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgT3B0aW9uYWwuXG4gKi9cbmZ1bmN0aW9uIGN1c3RvbShub2RlLCBjaGFydFJlY2lwZSwgcmVuZGVyZWQpIHtcblxuICAvLyBXaXRoIHRoaXMgZnVuY3Rpb24sIHlvdSBjYW4gYWNjZXNzIGFsbCBlbGVtZW50cyBvZiBhIGNoYXJ0IGFuZCBtb2RpZnlcbiAgLy8gdGhlbSBhdCB3aWxsLiBGb3IgaW5zdGFuY2U6IHlvdSBtaWdodCB3YW50IHRvIHBsYXkgd2l0aCBjb2xvdXJcbiAgLy8gaW50ZXJwb2xhdGlvbiBmb3IgYSBtdWx0aS1zZXJpZXMgbGluZSBjaGFydCwgb3IgbW9kaWZ5IHRoZSB3aWR0aCBhbmQgcG9zaXRpb25cbiAgLy8gb2YgdGhlIHgtIGFuZCB5LWF4aXMgdGlja3MuIFdpdGggdGhpcyBmdW5jdGlvbiwgeW91IGNhbiBkbyBhbGwgdGhhdCFcblxuICAvLyBJZiB5b3UgY2FuLCBpdCdzIGdvb2QgQ2hhcnQgVG9vbCBwcmFjdGljZSB0byByZXR1cm4gcmVmZXJlbmNlcyB0byBuZXdseVxuICAvLyBjcmVhdGVkIG5vZGVzIGFuZCBkMyBvYmplY3RzIHNvIHRoZXkgYmUgYWNjZXNzZWQgbGF0ZXIg4oCUIGJ5IGEgZGlzcGF0Y2hlclxuICAvLyBldmVudCwgZm9yIGluc3RhbmNlLlxuICByZXR1cm47XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjdXN0b207XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2N1c3RvbS9jdXN0b20uanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==