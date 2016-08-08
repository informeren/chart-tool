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
    var extend = require("../../helpers/helpers").extend;
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
    var extend = require("../../helpers/helpers").extend;
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

  var timeDiff = require("../../utils/utils").timeDiff,
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

  var wrapText = require("../../utils/utils").wrapText;

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

  var timeDiff = require("../../utils/utils").timeDiff,
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

  var isFloat = require("../../helpers/helpers").isFloat;

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

  var setRangeType = require("./scale").setRangeType,
      setRangeArgs = require("./scale").setRangeArgs;

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
