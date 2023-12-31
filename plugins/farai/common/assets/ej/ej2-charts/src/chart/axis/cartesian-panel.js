import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { subtractThickness, valueToCoefficient, sum, redrawElement, isBreakLabel, ChartLocation } from '../../common/utils/helper';
import { subArray, inside, appendChildElement } from '../../common/utils/helper';
import { Thickness, logBase, createZoomingLabels, getElement, rotateTextSize } from '../../common/utils/helper';
import { Size, Rect, measureText, TextOption, PathOption } from '@syncfusion/ej2-svg-base';
import { textElement, textTrim, getRotatedRectangleCoordinates, isRotatedRectIntersect, isZoomSet } from '../../common/utils/helper';
/**
 * Specifies the Cartesian Axis Layout.
 */
var axisPadding = 10;
var CartesianAxisLayoutPanel = /** @class */ (function () {
    /** @private */
    function CartesianAxisLayoutPanel(chartModule) {
        this.chart = chartModule;
        this.padding = 5;
    }
    /**
     * Measure the axis size.
     * @return {void}
     * @private
     */
    CartesianAxisLayoutPanel.prototype.measureAxis = function (rect) {
        var chart = this.chart;
        this.crossAt(chart);
        this.seriesClipRect = new Rect(rect.x, rect.y, rect.width, rect.height);
        this.initialClipRect = rect;
        this.leftSize = 0;
        this.rightSize = 0;
        this.topSize = 0;
        this.bottomSize = 0;
        //Measure Axis size with initial Rect
        this.measureRowAxis(chart, this.initialClipRect);
        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));
        this.measureColumnAxis(chart, this.initialClipRect);
        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));
        if (!this.chart.delayRedraw) {
            this.calculateAxisSize(this.initialClipRect);
        }
        this.leftSize = 0;
        this.rightSize = 0;
        this.topSize = 0;
        this.bottomSize = 0;
        //Measure Axis size with series Rect
        this.measureRowAxis(chart, this.initialClipRect);
        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));
        this.measureColumnAxis(chart, this.initialClipRect);
        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));
        if (!this.chart.delayRedraw) {
            chart.refreshAxis();
            this.calculateAxisSize(this.seriesClipRect);
        }
    };
    CartesianAxisLayoutPanel.prototype.measureRowAxis = function (chart, rect) {
        var row;
        this.calculateRowSize(rect);
        for (var _i = 0, _a = chart.rows; _i < _a.length; _i++) {
            var item = _a[_i];
            row = item;
            row.nearSizes = [];
            row.farSizes = [];
            this.arrangeAxis(row);
            this.measureDefinition(row, chart, new Size(chart.availableSize.width, row.computedHeight), rect);
            if (this.leftSize < sum(row.nearSizes)) {
                this.leftSize = sum(row.nearSizes);
            }
            if (this.rightSize < sum(row.farSizes)) {
                this.rightSize = sum(row.farSizes);
            }
        }
    };
    CartesianAxisLayoutPanel.prototype.measureColumnAxis = function (chart, rect) {
        var column;
        this.calculateColumnSize(rect);
        for (var _i = 0, _a = chart.columns; _i < _a.length; _i++) {
            var item = _a[_i];
            column = item;
            column.farSizes = [];
            column.nearSizes = [];
            this.arrangeAxis(column);
            this.measureDefinition(column, chart, new Size(column.computedWidth, chart.availableSize.height), rect);
            if (this.bottomSize < sum(column.nearSizes)) {
                this.bottomSize = sum(column.nearSizes);
            }
            if (this.topSize < sum(column.farSizes)) {
                this.topSize = sum(column.farSizes);
            }
        }
    };
    /**
     * Measure the column and row in chart.
     * @return {void}
     * @private
     */
    CartesianAxisLayoutPanel.prototype.measureDefinition = function (definition, chart, size, clipRect) {
        var ele = 16; // scrollbar element height is 16.
        for (var _i = 0, _a = definition.axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            axis.scrollBarHeight = chart.scrollBarModule && chart.zoomModule && chart.zoomSettings.enableScrollbar &&
                axis.enableScrollbarOnZooming && chart.zoomModule.isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0) ? ele : 0;
            axis.scrollBarHeight = chart.scrollBarModule && (chart.zoomModule && chart.zoomSettings.enableScrollbar &&
                axis.enableScrollbarOnZooming && chart.zoomModule.isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0)
                || axis.scrollbarSettings.enable) ? ele : 0;
            axis.getModule(chart);
            axis.baseModule.calculateRangeAndInterval(size, axis);
            definition.computeSize(axis, clipRect, axis.scrollBarHeight);
        }
        if (definition.farSizes.length > 0) {
            definition.farSizes[definition.farSizes.length - 1] -= axisPadding;
        }
        if (definition.nearSizes.length > 0) {
            definition.nearSizes[definition.nearSizes.length - 1] -= axisPadding;
        }
    };
    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    CartesianAxisLayoutPanel.prototype.calculateAxisSize = function (rect) {
        var chart = this.chart;
        var row;
        var column;
        var definition;
        var axis;
        var nearCount = 0;
        var farCount = 0;
        var size = 0;
        var x;
        var y;
        var axisOffset;
        this.calculateRowSize(rect);
        for (var i = 0, len = chart.rows.length; i < len; i++) {
            row = chart.rows[i];
            nearCount = 0;
            farCount = 0;
            for (var j = 0, len_1 = row.axes.length; j < len_1; j++) {
                axis = row.axes[j];
                axisOffset = axis.plotOffset;
                if (axis.rect.height === 0) {
                    axis.rect.height = row.computedHeight;
                    size = 0;
                    for (var k = i + 1, len_2 = i + axis.span; k < len_2; k++) {
                        definition = chart.rows[k];
                        size += definition.computedHeight;
                    }
                    axis.rect.y = (row.computedTop - size) + (axis.plotOffsetTop ? axis.plotOffsetTop : axisOffset);
                    axis.rect.height = (axis.rect.height + size) -
                        (this.getAxisOffsetValue(axis.plotOffsetTop, axis.plotOffsetBottom, axis.plotOffset));
                    axis.rect.width = 0;
                }
                if (axis.opposedPosition) {
                    x = rect.x + rect.width + sum(subArray(row.farSizes, farCount));
                    axis.rect.x = axis.rect.x >= x ? axis.rect.x : x;
                    farCount++;
                }
                else {
                    x = rect.x - sum(subArray(row.nearSizes, nearCount));
                    axis.rect.x = axis.rect.x <= x ? axis.rect.x : x;
                    nearCount++;
                }
            }
        }
        this.calculateColumnSize(rect);
        for (var i = 0, len = chart.columns.length; i < len; i++) {
            column = chart.columns[i];
            nearCount = 0;
            farCount = 0;
            for (var j = 0, len_3 = column.axes.length; j < len_3; j++) {
                axis = column.axes[j];
                axisOffset = axis.plotOffset;
                if (axis.rect.width === 0) {
                    for (var k = i, len_4 = (i + axis.span); k < len_4; k++) {
                        definition = chart.columns[k];
                        axis.rect.width += definition.computedWidth;
                    }
                    axis.rect.x = column.computedLeft + (axis.plotOffsetLeft ? axis.plotOffsetLeft : axisOffset);
                    axis.rect.width -= (this.getAxisOffsetValue(axis.plotOffsetLeft, axis.plotOffsetRight, axis.plotOffset));
                    axis.rect.height = 0;
                }
                if (axis.opposedPosition) {
                    y = rect.y - sum(subArray(column.farSizes, farCount));
                    axis.rect.y = axis.rect.y <= y ? axis.rect.y : y;
                    farCount++;
                }
                else {
                    y = rect.y + rect.height + sum(subArray(column.nearSizes, nearCount));
                    axis.rect.y = axis.rect.y >= y ? axis.rect.y : y;
                    nearCount++;
                }
            }
        }
    };
    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    CartesianAxisLayoutPanel.prototype.measure = function () {
        var chart = this.chart;
        var row;
        var column;
        var definition;
        var actualIndex;
        var span;
        for (var _i = 0, _a = chart.axisCollections; _i < _a.length; _i++) {
            var axis = _a[_i];
            //definition.Axes = axis;
            if (axis.orientation === 'Vertical') {
                chart.verticalAxes.push(axis);
                actualIndex = this.getActualRow(axis);
                row = chart.rows[actualIndex];
                this.pushAxis(row, axis);
                span = ((actualIndex + axis.span) > chart.rows.length ? chart.rows.length : (actualIndex + axis.span));
                for (var j = actualIndex + 1; j < span; j++) {
                    definition = chart.rows[j];
                    definition.axes[row.axes.length - 1] = axis;
                    chart.rows[j] = definition;
                }
                chart.rows[actualIndex] = row;
            }
            else {
                chart.horizontalAxes.push(axis);
                actualIndex = this.getActualColumn(axis);
                column = chart.columns[actualIndex];
                this.pushAxis(column, axis);
                span = ((actualIndex + axis.span) > chart.columns.length ? chart.columns.length : (actualIndex + axis.span));
                for (var j = actualIndex + 1; j < span; j++) {
                    definition = chart.columns[j];
                    definition.axes[column.axes.length - 1] = axis;
                    chart.columns[j] = definition;
                }
                chart.columns[actualIndex] = column;
            }
        }
    };
    CartesianAxisLayoutPanel.prototype.getAxisOffsetValue = function (position1, position2, plotOffset) {
        var rangeOffset = position1 ? (position1 + (position2 ? position2 :
            plotOffset)) : (position2 ? position2 + plotOffset : 2 * plotOffset);
        return rangeOffset;
    };
    CartesianAxisLayoutPanel.prototype.crossAt = function (chart) {
        for (var _i = 0, _a = chart.axisCollections; _i < _a.length; _i++) {
            var axis = _a[_i];
            if (axis.crossesAt === null) {
                continue;
            }
            if (!axis.crossesInAxis) {
                if (chart.requireInvertedAxis) {
                    axis.crossInAxis = ((axis.orientation === 'Horizontal')) ? chart.primaryXAxis : chart.primaryYAxis;
                }
                else {
                    axis.crossInAxis = ((axis.orientation === 'Horizontal')) ? chart.primaryYAxis : chart.primaryXAxis;
                }
                axis.crossAt = this.updateCrossAt(axis.crossInAxis, axis.crossesAt);
                continue;
            }
            else {
                for (var i = 2, len = chart.axisCollections.length; i < len; i++) {
                    if (axis.crossesInAxis === chart.axisCollections[i].name) {
                        axis.crossInAxis = chart.axisCollections[i];
                        axis.crossAt = this.updateCrossAt(axis.crossInAxis, axis.crossesAt);
                        continue;
                    }
                }
            }
        }
    };
    CartesianAxisLayoutPanel.prototype.updateCrossAt = function (axis, crossAt) {
        switch (axis.valueType) {
            case 'DateTime':
                var option = {
                    skeleton: 'full',
                    type: 'dateTime'
                };
                var dateParser = this.chart.intl.getDateParser(option);
                var dateFormatter = this.chart.intl.getDateFormat(option);
                return Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: crossAt }).val))));
            case 'Category':
                return parseFloat(crossAt) ? parseFloat(crossAt) : axis.labels.indexOf(crossAt);
            case 'Logarithmic':
                return logBase(crossAt, axis.logBase);
            default:
                return crossAt;
        }
    };
    CartesianAxisLayoutPanel.prototype.pushAxis = function (definition, axis) {
        for (var i = 0, len = definition.axes.length; i <= len; i++) {
            if (!definition.axes[i]) {
                definition.axes[i] = axis;
                break;
            }
        }
    };
    CartesianAxisLayoutPanel.prototype.arrangeAxis = function (definition) {
        var axisCollection = [];
        for (var i = 0, len = definition.axes.length; i <= len; i++) {
            if (definition.axes[i]) {
                axisCollection.push(definition.axes[i]);
            }
        }
        definition.axes = axisCollection;
    };
    CartesianAxisLayoutPanel.prototype.getActualColumn = function (axis) {
        var actualLength = this.chart.columns.length;
        var pos = axis.columnIndex;
        var result = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    };
    CartesianAxisLayoutPanel.prototype.getActualRow = function (axis) {
        var actualLength = this.chart.rows.length;
        var pos = axis.rowIndex;
        var result = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    };
    /**
     * Measure the row size.
     * @return {void}
     */
    CartesianAxisLayoutPanel.prototype.calculateRowSize = function (rect) {
        /*! Calculate row size */
        var chart = this.chart;
        var row;
        var rowTop = rect.y + rect.height;
        var height = 0;
        var remainingHeight = Math.max(0, rect.height);
        for (var i = 0, len = chart.rows.length; i < len; i++) {
            row = chart.rows[i];
            if (row.height.indexOf('%') !== -1) {
                height = Math.min(remainingHeight, (rect.height * parseInt(row.height, 10) / 100));
            }
            else {
                height = Math.min(remainingHeight, parseInt(row.height, 10));
            }
            height = (i !== (len - 1)) ? height : remainingHeight;
            row.computedHeight = height;
            rowTop -= height;
            row.computedTop = rowTop;
            remainingHeight -= height;
        }
    };
    /**
     * Measure the row size.
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.calculateColumnSize = function (rect) {
        /*! Calculate column size */
        var chart = this.chart;
        var column;
        var columnLeft = rect.x;
        var width = 0;
        var remainingWidth = Math.max(0, rect.width);
        for (var i = 0, len = chart.columns.length; i < len; i++) {
            column = chart.columns[i];
            if (column.width.indexOf('%') !== -1) {
                width = Math.min(remainingWidth, (rect.width * parseInt(column.width, 10) / 100));
            }
            else {
                width = Math.min(remainingWidth, parseInt(column.width, 10));
            }
            width = (i !== (len - 1)) ? width : remainingWidth;
            column.computedWidth = width;
            column.computedLeft = columnLeft;
            columnLeft += width;
            remainingWidth -= width;
        }
    };
    /**
     * To render the axis element.
     * @return {void}
     * @private
     */
    CartesianAxisLayoutPanel.prototype.renderAxes = function () {
        var chart = this.chart;
        var axis;
        var axisElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisInsideCollection' });
        var axisLineElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisOutsideCollection' });
        var outsideElement;
        var isInside;
        for (var i = 0, len = chart.axisCollections.length; i < len; i++) {
            axis = chart.axisCollections[i];
            this.element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Inside' });
            outsideElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Outside' });
            isInside = this.findAxisPosition(axis);
            if (axis.orientation === 'Horizontal') {
                axis.updateCrossValue(chart);
                if (axis.visible && axis.internalVisibility && axis.lineStyle.width > 0) {
                    this.drawAxisLine(axis, i, axis.plotOffset, 0, isInside ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawXAxisGridLine(axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.visible && axis.internalVisibility) {
                    this.drawXAxisLabels(axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                    this.drawXAxisBorder(axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                    this.drawXAxisTitle(axis, i, isInside ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                }
            }
            else {
                axis.updateCrossValue(chart);
                if (axis.visible && axis.internalVisibility && axis.lineStyle.width > 0) {
                    this.drawAxisLine(axis, i, 0, axis.plotOffset, isInside ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawYAxisGridLine(axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.visible && axis.internalVisibility) {
                    this.drawYAxisLabels(axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                    this.drawYAxisBorder(axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                    this.drawYAxisTitle(axis, i, isInside ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
                }
            }
            if (!this.chart.enableCanvas) {
                axisElement.appendChild(this.element);
                if (outsideElement && outsideElement.childNodes.length > 0) {
                    axisLineElement.appendChild(outsideElement);
                }
            }
            if (chart.scrollBarModule && ((chart.zoomSettings.enableScrollbar && axis.enableScrollbarOnZooming) ||
                axis.scrollbarSettings.enable)) {
                this.renderScrollbar(chart, axis);
            }
        }
        this.element = chart.renderer.createGroup({ id: chart.element.id + 'DefinitionLine' });
        for (var j = 0, len = chart.rows.length; j < len; j++) {
            var row = chart.rows[j];
            if (row.border.color) {
                this.drawBottomLine(row, j, true);
            }
        }
        for (var j = 0, len = chart.columns.length; j < len; j++) {
            var column = chart.columns[j];
            if (column.border.color) {
                this.drawBottomLine(column, j, false);
            }
        }
        if (!this.chart.enableCanvas) {
            axisElement.appendChild(this.element);
        }
        appendChildElement(chart.enableCanvas, chart.svgObject, axisElement, chart.redraw);
        return axisLineElement;
    };
    /**
     * To render the axis scrollbar
     * @param chart
     * @param axis
     */
    CartesianAxisLayoutPanel.prototype.renderScrollbar = function (chart, axis) {
        var isZoomed = isNullOrUndefined(chart.zoomModule) ? false : chart.zoomModule.isZoomed;
        if (((isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0)) || (axis.scrollbarSettings.enable &&
            (axis.zoomFactor <= 1 || axis.zoomPosition >= 0))) && !axis.zoomingScrollBar.isScrollUI) {
            if (!chart.scrollElement) {
                chart.scrollElement = redrawElement(chart.redraw, chart.element.id + '_scrollElement') || createElement('div', { id: chart.element.id + '_scrollElement' });
            }
            appendChildElement(false, chart.scrollElement, axis.zoomingScrollBar.render(true), true);
        }
        else if (axis.zoomFactor === 1 && axis.zoomPosition === 0 && axis.zoomingScrollBar.svgObject && !axis.scrollbarSettings.enable) {
            axis.zoomingScrollBar.destroy();
        }
        if (axis.zoomingScrollBar.isScrollUI) {
            axis.zoomingScrollBar.isScrollUI = false;
        }
    };
    /**
     * To find the axis position
     * @param axis
     */
    CartesianAxisLayoutPanel.prototype.findAxisPosition = function (axis) {
        return axis.crossAt !== null && axis.isInside(axis.crossInAxis.visibleRange);
    };
    /**
     * To render the bootom line of the columns and rows
     * @param definition
     * @param index
     * @param isRow
     */
    CartesianAxisLayoutPanel.prototype.drawBottomLine = function (definition, index, isRow) {
        var chart = this.chart;
        var optionsLine = {};
        var x1;
        var x2;
        var y1;
        var y2;
        var definitionName;
        if (isRow) {
            definition = definition;
            y1 = y2 = definition.computedTop + definition.computedHeight;
            x1 = this.seriesClipRect.x;
            x2 = x1 + this.seriesClipRect.width;
            definitionName = 'Row';
        }
        else {
            definition = definition;
            x1 = x2 = definition.computedLeft;
            y1 = this.seriesClipRect.y;
            y2 = y1 + this.seriesClipRect.height;
            definitionName = 'Column';
        }
        optionsLine = {
            'id': chart.element.id + '_AxisBottom_' + definitionName + index,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            'stroke-width': definition.border.width,
            'stroke': definition.border.color,
        };
        this.htmlObject = chart.renderer.drawLine(optionsLine);
        this.element.appendChild(this.htmlObject);
    };
    /**
     * To render the axis line
     * @param axis
     * @param index
     * @param plotX
     * @param plotY
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawAxisLine = function (axis, index, plotX, plotY, parent, rect) {
        var chart = this.chart;
        var optionsLine = {};
        var element = getElement(chart.element.id + 'AxisLine_' + index);
        var direction = element ? element.getAttribute('d') : '';
        element = null;
        optionsLine = {
            'id': chart.element.id + 'AxisLine_' + index,
            'd': 'M ' + (rect.x - plotX) + ' ' + (rect.y - plotY) +
                ' L ' + (rect.x + rect.width + plotX) + ' ' + (rect.y + rect.height + plotY),
            'stroke-dasharray': axis.lineStyle.dashArray,
            'stroke-width': axis.lineStyle.width,
            'stroke': axis.lineStyle.color || chart.themeStyle.axisLine
        };
        this.htmlObject = chart.renderer.drawPath(optionsLine);
        appendChildElement(chart.enableCanvas, parent, this.htmlObject, chart.redraw, true, 'x', 'y', null, direction);
    };
    /**
     * To render the yAxis grid line
     * @param axis
     * @param index
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawYAxisGridLine = function (axis, index, parent, rect) {
        var isLogAxis = axis.valueType === 'Logarithmic';
        var isCategoryAxis = axis.valueType.indexOf('Category') > -1;
        var tempInterval;
        var pointY = 0;
        var majorGrid = '';
        var majorTick = '';
        var minorGridDirection;
        var tickSize = axis.opposedPosition ? axis.majorTickLines.height : -axis.majorTickLines.height;
        var axisLineSize = (axis.opposedPosition) ? axis.lineStyle.width * 0.5 : -axis.lineStyle.width * 0.5;
        var ticksbwtLabel = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        var scrollBarHeight = isNullOrUndefined(axis.crossesAt) ? axis.opposedPosition ? axis.scrollBarHeight :
            -axis.scrollBarHeight : 0;
        var isTickInside = axis.tickPosition === 'Inside';
        var ticks = isTickInside ? (rect.x - tickSize - axisLineSize) : (rect.x + tickSize + axisLineSize + scrollBarHeight);
        var length = axis.visibleLabels.length;
        var chartThemeStyle = this.chart.themeStyle;
        if (axis.valueType.indexOf('Category') > -1 && axis.labelPlacement === 'BetweenTicks' && length > 0) {
            length += 1;
        }
        var minorGridLines = axis.minorGridLines;
        var minorTickLines = axis.minorTickLines;
        //Gridlines
        for (var i = 0; i < length; i++) {
            tempInterval = !axis.visibleLabels[i] ? (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel
                : axis.visibleLabels[i].value - ticksbwtLabel;
            pointY = valueToCoefficient(tempInterval, axis) * rect.height;
            pointY = (pointY * -1) + (rect.y + rect.height);
            if (pointY >= rect.y && (rect.y + rect.height) >= pointY) {
                if ((inside(tempInterval, axis.visibleRange)) || this.isBorder(axis, i, pointY)) {
                    majorGrid = 'M ' + this.seriesClipRect.x + ' ' + (pointY) +
                        ' L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + pointY;
                    this.renderGridLine(axis, index, majorGrid, axis.majorGridLines, '_MajorGridLine_', i, this.element, chartThemeStyle.majorGridLine, axis.majorGridLines.dashArray);
                }
                majorTick = 'M ' + (rect.x + axisLineSize + (isTickInside ? scrollBarHeight : 0)) + ' ' + pointY +
                    ' L ' + (ticks) + ' ' + pointY;
                this.renderGridLine(axis, index, majorTick, axis.majorTickLines, '_MajorTickLine_', i, parent, chartThemeStyle.majorTickLine);
                if ((minorGridLines.width > 0 || minorTickLines.width > 0) && axis.minorTicksPerInterval > 0) {
                    if (i === 0 && isZoomSet(axis) && !isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, tempInterval, rect, i, index, chartThemeStyle, parent);
                    }
                    minorGridDirection = this.drawAxisMinorLine(axis, tempInterval, rect, i);
                    this.renderGridLine(axis, index, minorGridDirection[0], minorGridLines, '_MinorGridLine_', i, this.element, chartThemeStyle.minorGridLine, minorGridLines.dashArray);
                    this.renderGridLine(axis, index, minorGridDirection[1], minorTickLines, '_MinorTickLine_', i, parent, chartThemeStyle.minorTickLine);
                    if (i === length - 1 && isZoomSet(axis) && isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, (tempInterval + axis.visibleRange.interval), rect, i, index, chartThemeStyle, parent);
                    }
                }
            }
        }
    };
    /**
     * To check the border of the axis
     * @param axis
     * @param index
     * @param value
     */
    CartesianAxisLayoutPanel.prototype.isBorder = function (axis, index, value) {
        var border = this.chart.chartArea.border;
        var rect = this.seriesClipRect;
        var orientation = axis.orientation;
        var start = (orientation === 'Horizontal') ? rect.x : rect.y;
        var size = (orientation === 'Horizontal') ? rect.width : rect.height;
        var startIndex = (orientation === 'Horizontal') ? 0 : axis.visibleLabels.length - 1;
        var endIndex = (orientation === 'Horizontal') ? axis.visibleLabels.length - 1 : 0;
        if (axis.plotOffset > 0) {
            return true;
        }
        else if ((value === start || value === (start + size)) && (border.width <= 0 || border.color === 'transparent')) {
            return true;
        }
        else if ((value !== start && index === startIndex) || (value !== (start + size) && index === endIndex)) {
            return true;
        }
        return false;
    };
    /**
     * To render the yAxis label
     * @param axis
     * @param index
     * @param parent
     * @param rect
     * @private
     */
    CartesianAxisLayoutPanel.prototype.drawYAxisLabels = function (axis, index, parent, rect) {
        var chart = this.chart;
        var pointX = 0;
        var pointY = 0;
        var elementSize;
        var labelSpace = axis.labelPadding;
        var options;
        var isAxisBreakLabel;
        var isLabelInside = axis.labelPosition === 'Inside';
        var isOpposed = axis.opposedPosition;
        var tickSpace = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        var padding = tickSpace + labelSpace + axis.lineStyle.width * 0.5;
        padding = (axis.opposedPosition) ? padding : -padding;
        var anchor = ((isOpposed && isLabelInside) || (!isOpposed && !isLabelInside)) ? 'end' : 'start';
        anchor = chart.isRtlEnabled ? ((axis.opposedPosition) ? 'end' : 'start') : anchor;
        var labelElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        var scrollBarHeight = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight * (isOpposed ? 1 : -1) : 0;
        var textHeight;
        var textPadding;
        var maxLineWidth;
        var pixel = 10;
        for (var i = 0, len = axis.visibleLabels.length; i < len; i++) {
            isAxisBreakLabel = isBreakLabel(axis.visibleLabels[i].originalText);
            pointX = isLabelInside ? (rect.x - padding) : (rect.x + padding + scrollBarHeight);
            elementSize = isAxisBreakLabel ? axis.visibleLabels[i].breakLabelSize : axis.visibleLabels[i].size;
            pointY = (valueToCoefficient(axis.visibleLabels[i].value, axis) * rect.height) + (chart.stockChart ? 7 : 0);
            pointY = Math.floor((pointY * -1) + (rect.y + rect.height));
            textHeight = ((elementSize.height / 8) * axis.visibleLabels[i].text.length / 2);
            textPadding = ((elementSize.height / 4) * 3) + 3;
            pointY = (isAxisBreakLabel ? (axis.labelPosition === 'Inside' ? (pointY - (elementSize.height / 2) - textHeight + textPadding)
                : (pointY - textHeight)) : (axis.labelPosition === 'Inside' ? (pointY + textPadding) : pointY + (elementSize.height / 4)));
            if (axis.majorGridLines.width > axis.majorTickLines.width) {
                maxLineWidth = axis.majorGridLines.width;
            }
            else {
                maxLineWidth = axis.majorTickLines.width;
            }
            if (axis.labelStyle.textAlignment === 'Far') {
                pointY = pointY - maxLineWidth - pixel;
            }
            else if (axis.labelStyle.textAlignment === 'Near') {
                pointY = pointY + maxLineWidth + pixel;
            }
            else if (axis.labelStyle.textAlignment === 'Center') {
                pointY = pointY;
            }
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, anchor, axis.visibleLabels[i].text);
            if (axis.edgeLabelPlacement) {
                switch (axis.edgeLabelPlacement) {
                    case 'None':
                        break;
                    case 'Hide':
                        if (((i === 0 || (axis.isInversed && i === len - 1)) && options.y > rect.y + rect.height) ||
                            (((i === len - 1) || (axis.isInversed && i === 0)) && options.y - elementSize.height * 0.5 < rect.y)) {
                            options.text = '';
                        }
                        break;
                    case 'Shift':
                        if ((i === 0 || (axis.isInversed && i === len - 1)) && options.y > rect.y + rect.height) {
                            options.y = pointY = rect.y + rect.height;
                        }
                        else if (((i === len - 1) || (axis.isInversed && i === 0)) && (options.y - elementSize.height * 0.5 < rect.y)) {
                            options.y = pointY = rect.y + elementSize.height * 0.5;
                        }
                        break;
                }
            }
            textElement(chart.renderer, options, axis.labelStyle, axis.labelStyle.color || chart.themeStyle.axisLabel, labelElement, false, chart.redraw, true, true);
        }
        if (!this.chart.enableCanvas) {
            if (!chart.delayRedraw) {
                appendChildElement(chart.enableCanvas, parent, labelElement, chart.redraw);
            }
            else if (axis.visible && axis.internalVisibility) {
                this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
            }
        }
    };
    /**
     * To render the yAxis label border.
     * @param axis
     * @param index
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawYAxisBorder = function (axis, index, parent, rect) {
        if (axis.border.width > 0) {
            var startY = void 0;
            var pointY = void 0;
            var scrollBarHeight = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            scrollBarHeight = (axis.opposedPosition ? 1 : -1) * scrollBarHeight;
            var gap = (rect.height / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            var endY = void 0;
            var length_1 = axis.maxLabelSize.width + 10 + ((axis.tickPosition === axis.labelPosition) ?
                axis.majorTickLines.height : 0);
            var labelBorder = '';
            var ticksbwtLabel = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            var endX = ((axis.opposedPosition && axis.labelPosition === 'Inside') || (!axis.opposedPosition
                && axis.labelPosition === 'Outside')) ? rect.x - length_1 + scrollBarHeight : rect.x + length_1 + scrollBarHeight;
            for (var i = 0, len = axis.visibleLabels.length; i < len; i++) {
                pointY = valueToCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis);
                pointY = (axis.isInversed ? (1 - pointY) : pointY) * rect.height;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startY = (pointY * -1) + (rect.y + rect.height);
                    endY = (pointY * -1) - (gap) + (rect.y + rect.height);
                }
                else {
                    startY = (pointY * -1) + gap / 2 + (rect.y + rect.height);
                    endY = (pointY * -1) - gap / 2 + (rect.y + rect.height);
                }
                switch (axis.border.type) {
                    case 'Rectangle':
                    case 'WithoutTopBorder':
                        if (startY > (rect.y + rect.height)) {
                            labelBorder += ('M' + ' ' + endX + ' ' + (rect.y + rect.height) + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                        }
                        else if (Math.floor(rect.y) > (endY)) {
                            labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX
                                + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + (rect.y) + ' ');
                        }
                        else {
                            labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX +
                                ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                            if (i === axis.visibleLabels.length - 1) {
                                labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + endY + ' ' + 'L' + ' ' +
                                    endX + ' ' + endY + ' ');
                            }
                        }
                        break;
                    case 'WithoutTopandBottomBorder':
                        if (!(startY > rect.y + rect.height) && !((endY) < Math.floor(rect.y))) {
                            labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX +
                                ' ' + startY + ' ' + 'M' + ' ' + endX + ' ' + endY + ' ' +
                                'L' + ' ' + (rect.x + scrollBarHeight) + ' ' + endY);
                        }
                        break;
                }
            }
            labelBorder += (axis.border.type === 'Rectangle') ? ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + rect.y + ' ' + 'L' + ' ' +
                (rect.x + scrollBarHeight) + ' ' + (rect.y + rect.height) + ' ') : '';
            if (labelBorder !== '') {
                this.createAxisBorderElement(axis, index, labelBorder, parent);
            }
        }
        if (axis.multiLevelLabels.length > 0 && this.chart.multiLevelLabelModule) {
            this.chart.multiLevelLabelModule.renderYAxisMultiLevelLabels(axis, index, parent, rect);
        }
    };
    /**
     * To render the yAxis title
     * @param axis
     * @param index
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawYAxisTitle = function (axis, index, parent, rect) {
        if (axis.title) {
            var chart = this.chart;
            var labelRotation = (axis.opposedPosition) ? 90 : -90;
            var padding = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + this.padding) +
                (axis.labelPosition === 'Inside' ? 0 :
                    (axis.maxLabelSize.width + axis.multiLevelLabelHeight + this.padding));
            padding = axis.opposedPosition ? padding + axis.scrollBarHeight : -padding - axis.scrollBarHeight;
            var x = rect.x + padding;
            var y = rect.y + rect.height * 0.5;
            var titleSize = (axis.titleSize.height * (axis.titleCollection.length - 1));
            var options = new TextOption(chart.element.id + '_AxisTitle_' + index, x, y - axis.labelPadding - titleSize, 'middle', axis.titleCollection, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', null, labelRotation);
            var element = textElement(chart.renderer, options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent);
            element.setAttribute('tabindex', axis.tabIndex.toString());
            element.setAttribute('aria-label', axis.description || axis.title);
        }
    };
    /**
     * xAxis grid line calculation performed here
     * @param axis
     * @param index
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawXAxisGridLine = function (axis, index, parent, rect) {
        var isLogAxis = axis.valueType === 'Logarithmic';
        var isCategoryAxis = axis.valueType.indexOf('Category') > -1;
        var tempInterval;
        var pointX = 0;
        var majorGrid = '';
        var majorTick = '';
        var minorDirection;
        var tickSize = (axis.opposedPosition) ? -axis.majorTickLines.height : axis.majorTickLines.height;
        var axisLineSize = (axis.opposedPosition) ? -axis.lineStyle.width * 0.5 : axis.lineStyle.width * 0.5;
        var scrollBarHeight = isNullOrUndefined(axis.crossesAt) ? axis.opposedPosition ? -axis.scrollBarHeight :
            axis.scrollBarHeight : 0;
        var ticksbwtLabel = (axis.valueType.indexOf('Category') > -1 && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        var length = axis.visibleLabels.length;
        var isTickInside = axis.tickPosition === 'Inside';
        var ticks = isTickInside ? (rect.y - tickSize - axisLineSize) : (rect.y + tickSize + axisLineSize + scrollBarHeight);
        var chartThemeStyle = this.chart.themeStyle;
        if (axis.valueType.indexOf('Category') > -1 && length > 0 && axis.labelPlacement === 'BetweenTicks') {
            length += 1;
        }
        //Gridlines
        for (var i = 0; i < length; i++) {
            if (axis.valueType !== 'DateTimeCategory') {
                tempInterval = axis.visibleLabels[i] ? axis.visibleLabels[i].value - ticksbwtLabel
                    : (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
            }
            else {
                tempInterval = axis.visibleLabels[i] ?
                    axis.visibleLabels[i].value - ticksbwtLabel : axis.visibleRange.max;
            }
            pointX = (valueToCoefficient(tempInterval, axis) * rect.width) + rect.x;
            if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                if (inside(tempInterval, axis.visibleRange) || this.isBorder(axis, i, pointX)) {
                    majorGrid = 'M ' + pointX + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height) +
                        ' L ' + pointX + ' ' + this.seriesClipRect.y;
                    this.renderGridLine(axis, index, majorGrid, axis.majorGridLines, '_MajorGridLine_', i, this.element, chartThemeStyle.majorGridLine, axis.majorGridLines.dashArray);
                }
                majorTick = 'M ' + (pointX) + ' ' + (rect.y + axisLineSize + (isTickInside ? scrollBarHeight : 0))
                    + ' L ' + (pointX) + ' ' + ticks;
                this.renderGridLine(axis, index, majorTick, axis.majorTickLines, '_MajorTickLine_', i, parent, chartThemeStyle.majorTickLine);
                if (axis.minorTicksPerInterval > 0 && (axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0)) {
                    if (i === 0 && isZoomSet(axis) && !isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, tempInterval, rect, i, index, chartThemeStyle, parent);
                    }
                    minorDirection = this.drawAxisMinorLine(axis, tempInterval, rect, i);
                    this.renderGridLine(axis, index, minorDirection[0], axis.minorGridLines, '_MinorGridLine_', i, this.element, chartThemeStyle.minorGridLine, axis.minorGridLines.dashArray);
                    this.renderGridLine(axis, index, minorDirection[1], axis.minorTickLines, '_MinorTickLine_', i, parent, chartThemeStyle.minorTickLine);
                    if (i === length - 1 && isZoomSet(axis) && isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, (tempInterval + axis.visibleRange.interval), rect, i, index, chartThemeStyle, parent);
                    }
                }
            }
        }
    };
    /**
     * To render missing minor grid lines while zooming
     * @param axis
     * @param tempInterval
     * @param rect
     * @param i
     * @param index
     * @param chartThemeStyle
     * @param parent
     */
    CartesianAxisLayoutPanel.prototype.renderMinorGridOnZooming = function (axis, tempInterval, rect, i, index, chartThemeStyle, parent) {
        var minorDirection = this.drawAxisMinorLine(axis, tempInterval, rect, i, true);
        this.renderGridLine(axis, index, minorDirection[0], axis.minorGridLines, '_MinorGridLine_', -1, this.element, chartThemeStyle.minorGridLine, axis.minorGridLines.dashArray);
        this.renderGridLine(axis, index, minorDirection[1], axis.minorTickLines, '_MinorTickLine_', -1, parent, chartThemeStyle.minorTickLine);
    };
    /**
     * To calcualte the axis minor line
     * @param axis
     * @param tempInterval
     * @param rect
     * @param labelIndex
     */
    CartesianAxisLayoutPanel.prototype.drawAxisMinorLine = function (axis, tempInterval, rect, labelIndex, isFirstLabel) {
        var value = tempInterval;
        var coor = 0;
        var position = 0;
        var range = axis.visibleRange;
        var isTickInside = axis.tickPosition === 'Inside';
        var direction = [];
        var tickSize = axis.opposedPosition ? -axis.minorTickLines.height : axis.minorTickLines.height;
        var logStart;
        var logEnd;
        var logInterval = 1;
        var logPosition = 1;
        var ticksX = isTickInside ? (rect.y - tickSize) : (rect.y + tickSize);
        var ticksY = isTickInside ? (rect.x + tickSize) : (rect.x - tickSize);
        var minorGird = '';
        var minorTick = '';
        if (axis.valueType === 'Logarithmic') {
            logStart = Math.pow(axis.logBase, value - range.interval);
            logEnd = Math.pow(axis.logBase, value);
            logInterval = (logEnd - logStart) / (axis.minorTicksPerInterval + 1);
            logPosition = logStart + logInterval;
        }
        if (axis.orientation === 'Horizontal') {
            for (var j = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, value, labelIndex, isFirstLabel);
                logPosition += logInterval;
                if (inside(value, range)) {
                    position = ((value - range.min) / (range.max - range.min));
                    position = Math.ceil((axis.isInversed ? (1 - position) : position) * rect.width);
                    coor = (Math.floor(position + rect.x));
                    minorGird = minorGird.concat('M' + ' ' + coor + ' ' + (this.seriesClipRect.y)
                        + 'L ' + coor + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height));
                    coor = (Math.floor(position + rect.x));
                    minorTick = minorTick.concat('M' + ' ' + coor + ' ' + (rect.y)
                        + 'L ' + coor + ' ' + (ticksX + axis.scrollBarHeight));
                }
            }
        }
        else {
            for (var j = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, value, labelIndex, isFirstLabel);
                if (inside(value, range)) {
                    position = ((value - range.min) / (range.max - range.min));
                    position = Math.ceil(((axis.isInversed ? (1 - position) : position)) * rect.height) * -1; // For inversed axis
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorGird = minorGird.concat('M' + ' ' + (this.seriesClipRect.x) + ' ' + coor
                        + 'L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + coor + ' ');
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorTick = minorTick.concat('M' + ' ' + rect.x + ' ' + coor + 'L ' + (ticksY - axis.scrollBarHeight) +
                        ' ' + coor + ' ');
                }
                logPosition += logInterval;
            }
        }
        direction.push(minorGird);
        direction.push(minorTick);
        return direction;
    };
    /**
     * To find the numeric value of the log
     * @param axis
     * @param logPosition
     * @param logInterval
     * @param value
     * @param labelIndex
     */
    CartesianAxisLayoutPanel.prototype.findLogNumeric = function (axis, logPosition, value, labelIndex, isFirstLabel) {
        var range = axis.visibleRange;
        var tempValue;
        if (axis.valueType === 'Logarithmic') {
            value = logBase(logPosition, axis.logBase);
        }
        else if (axis.valueType === 'DateTime') {
            tempValue = axis.dateTimeInterval / (axis.minorTicksPerInterval + 1);
            value = isFirstLabel ? (value - tempValue) : (value + tempValue);
        }
        else if (axis.valueType === 'DateTimeCategory') {
            var padding = axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
            value += ((axis.visibleLabels[labelIndex + 1] ?
                axis.visibleLabels[labelIndex + 1].value - padding : axis.visibleRange.max) -
                (axis.visibleLabels[labelIndex] ?
                    axis.visibleLabels[labelIndex].value - padding : axis.visibleRange.min)) /
                (axis.minorTicksPerInterval + 1);
        }
        else {
            tempValue = range.interval / (axis.minorTicksPerInterval + 1);
            value = isFirstLabel ? (value - tempValue) : (value + tempValue);
        }
        return value;
    };
    /**
     * To render the xAxis Labels
     * @param axis
     * @param index
     * @param parent
     * @param rect
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    CartesianAxisLayoutPanel.prototype.drawXAxisLabels = function (axis, index, parent, rect) {
        var chart = this.chart;
        var pointX = 0;
        var pointY = 0;
        var labelSpace = axis.labelPadding;
        var labelHeight;
        var elementSize;
        var labelPadding;
        var anchor;
        var pixel = 10;
        var labelElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        var islabelInside = axis.labelPosition === 'Inside';
        var isOpposed = axis.opposedPosition;
        var tickSpace = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        var padding = tickSpace + labelSpace + axis.lineStyle.width * 0.5;
        var rotateSize;
        var diffHeight;
        var angle = axis.angle % 360;
        //I264474: Fix for X axis labels are not rendered in center of tick marks when angle is 270
        var anglePadding = ((angle === 90 || angle === -270) ? -4 : (angle === -90 || angle === 270) ? 4 : 0);
        var options;
        var yLocation;
        var labelWidth;
        var previousEnd = axis.isInversed ? (rect.x + rect.width) : rect.x;
        var width = 0;
        var length = axis.visibleLabels.length;
        var intervalLength;
        var label;
        var isAxisBreakLabel;
        var scrollBarHeight = axis.scrollbarSettings.enable || (!islabelInside && isNullOrUndefined(axis.crossesAt)
            && (axis.zoomFactor < 1 || axis.zoomPosition > 0)) ? axis.scrollBarHeight : 0;
        var newPoints = [];
        var isRotatedLabelIntersect = false;
        padding += (angle === 90 || angle === 270 || angle === -90 || angle === -270) ? (islabelInside ? 5 : -5) : 0;
        var isEndAnchor = ((!isOpposed && !islabelInside) || (isOpposed && islabelInside)) ?
            ((360 >= angle && angle >= 180) || (-1 >= angle && angle >= -180)) :
            ((1 <= angle && angle <= 180) || (-181 >= angle && angle >= -360));
        for (var i = 0, len = length; i < len; i++) {
            label = axis.visibleLabels[i];
            isAxisBreakLabel = isBreakLabel(label.originalText);
            pointX = (valueToCoefficient(label.value, axis) * rect.width) + rect.x;
            elementSize = label.size;
            intervalLength = rect.width / length;
            labelWidth = isAxisBreakLabel ? label.breakLabelSize.width : elementSize.width;
            width = ((axis.labelIntersectAction === 'Trim' || axis.labelIntersectAction === 'Wrap') && angle === 0 &&
                labelWidth > intervalLength) ? intervalLength : labelWidth;
            labelHeight = elementSize.height / 4;
            pointX -= (angle === 0) ? (width / 2) : (angle === -90 || angle === 270 ? -labelHeight :
                (angle === 90 || angle === -270) ? labelHeight : 0);
            if (axis.labelStyle.textAlignment === 'Far') {
                pointX = pointX + width - pixel;
            }
            else if (axis.labelStyle.textAlignment === 'Near') {
                pointX = pointX - width + pixel;
            }
            else if (axis.labelStyle.textAlignment === 'Center') {
                pointX = pointX;
            }
            if (islabelInside && angle) {
                pointY = isOpposed ? (rect.y + padding + labelHeight) : (rect.y - padding - labelHeight);
            }
            else {
                labelPadding = ((isOpposed && !islabelInside) || (!isOpposed && islabelInside)) ?
                    -(padding + scrollBarHeight + (angle ? labelHeight : (label.index > 1 ? (2 * labelHeight) : 0))) :
                    padding + scrollBarHeight + ((angle ? 1 : 3) * labelHeight);
                pointY = (rect.y + (labelPadding * label.index));
            }
            anchor = (chart.isRtlEnabled || isEndAnchor) ? 'end' : '';
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, anchor);
            if (axis.edgeLabelPlacement && (angle === 0)) {
                switch (axis.edgeLabelPlacement) {
                    case 'None':
                        break;
                    case 'Hide':
                        if (((i === 0 || (axis.isInversed && i === len - 1)) && options.x < rect.x) ||
                            ((i === len - 1 || (axis.isInversed && i === 0)) && (options.x + width > rect.x + rect.width))) {
                            continue;
                        }
                        break;
                    case 'Shift':
                        if ((i === 0 || (axis.isInversed && i === len - 1)) && options.x < rect.x) {
                            intervalLength -= (rect.x - options.x);
                            options.x = pointX = rect.x;
                        }
                        else if ((i === len - 1 || (axis.isInversed && i === 0)) && ((options.x + width) > rect.x + rect.width)) {
                            if (elementSize.width > intervalLength && axis.labelIntersectAction === 'Trim') {
                                intervalLength -= (options.x + width - (rect.x + rect.width));
                            }
                            else {
                                intervalLength = width;
                            }
                            options.x = pointX = rect.x + rect.width - intervalLength;
                        }
                        break;
                }
            }
            options.text = this.getLabelText(label, axis, intervalLength);
            if (angle === 0 && axis.labelIntersectAction === 'Hide' && i !== 0 &&
                (!axis.isInversed ? options.x <= previousEnd : options.x + width >= previousEnd)) {
                continue;
            }
            previousEnd = axis.isInversed ? options.x : options.x + width;
            if (angle !== 0) {
                options.transform = 'rotate(' + angle + ',' + pointX + ',' + pointY + ')';
                options.y = isAxisBreakLabel ? options.y + (isOpposed ? (4 * label.text.length) : -(4 * label.text.length)) : options.y;
                var height = (pointY) - (options.y - ((label.size.height / 2) + 10));
                var rect_1 = new Rect(options.x, options.y - ((label.size.height / 2) - 5), label.size.width, height);
                var rectCoordinates = this.getRectanglePoints(rect_1);
                var rectCenterX = pointX;
                var rectCenterY = (pointY) - (height / 2);
                newPoints.push(getRotatedRectangleCoordinates(rectCoordinates, rectCenterX, rectCenterY, angle));
                isRotatedLabelIntersect = false;
                for (var index_1 = i; index_1 > 0; index_1--) {
                    if (newPoints[i] && newPoints[index_1 - 1] && isRotatedRectIntersect(newPoints[i], newPoints[index_1 - 1])) {
                        isRotatedLabelIntersect = true;
                        newPoints[i] = null;
                        break;
                    }
                }
            }
            textElement(chart.renderer, options, label.labelStyle, label.labelStyle.color || chart.themeStyle.axisLabel, labelElement, (axis.opposedPosition !== (axis.labelPosition === 'Inside')), chart.redraw, true, null, null, null, label.size, isRotatedLabelIntersect);
        }
        if (!this.chart.enableCanvas) {
            if (!chart.delayRedraw) {
                parent.appendChild(labelElement);
            }
            else if (axis.visible && axis.internalVisibility) {
                this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
            }
        }
    };
    /**
     * Get rect coordinates
     * @param label
     * @param axis
     * @param intervalLength
     */
    CartesianAxisLayoutPanel.prototype.getRectanglePoints = function (rect) {
        var point1 = new ChartLocation(rect.x, rect.y);
        var point2 = new ChartLocation(rect.x + rect.width, rect.y);
        var point3 = new ChartLocation(rect.x + rect.width, rect.y + rect.height);
        var point4 = new ChartLocation(rect.x, rect.y + rect.height);
        return [point1, point2, point3, point4];
    };
    /**
     * To get axis label text
     * @param breakLabels
     * @param label
     * @param axis
     * @param intervalLength
     */
    CartesianAxisLayoutPanel.prototype.getLabelText = function (label, axis, intervalLength) {
        if (isBreakLabel(label.originalText)) {
            var result = [];
            var str = void 0;
            for (var index = 0; index < label.text.length; index++) {
                str = this.findAxisLabel(axis, label.text[index], intervalLength);
                result.push(str);
            }
            return result;
        }
        else {
            return this.findAxisLabel(axis, label.text, intervalLength);
        }
    };
    /**
     * To render the x-axis label border.
     * @param axis
     * @param index
     * @param parent
     * @param axisRect
     */
    CartesianAxisLayoutPanel.prototype.drawXAxisBorder = function (axis, index, parent, axisRect) {
        if (axis.border.width > 0) {
            var scrollBarHeight = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            var startX = void 0;
            var startY = axisRect.y + ((axis.opposedPosition ? -1 : 1) * scrollBarHeight);
            var padding = 10;
            var pointX = void 0;
            var gap = (axisRect.width / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            var endX = void 0;
            var length_2 = axis.maxLabelSize.height +
                ((axis.tickPosition === axis.labelPosition) ? axis.majorTickLines.height : 0);
            var labelBorder = '';
            var ticksbwtLabel = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            var endY = ((axis.opposedPosition && axis.labelPosition === 'Inside') ||
                (!axis.opposedPosition && axis.labelPosition === 'Outside')) ?
                (axisRect.y + length_2 + padding + scrollBarHeight) : (axisRect.y - length_2 - padding - scrollBarHeight);
            for (var i = 0, len = axis.visibleLabels.length; i < len; i++) {
                pointX = valueToCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis);
                pointX = (axis.isInversed ? (1 - pointX) : pointX) * axisRect.width;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startX = pointX + axisRect.x;
                    endX = pointX + (gap) + axisRect.x;
                }
                else {
                    startX = pointX - gap * 0.5 + axisRect.x;
                    endX = pointX + gap * 0.5 + axisRect.x;
                }
                switch (axis.border.type) {
                    case 'Rectangle':
                    case 'WithoutTopBorder':
                        if (startX < axisRect.x) {
                            labelBorder += ('M' + ' ' + axisRect.x + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                        }
                        else if (Math.floor(endX) > axisRect.width + axisRect.x && !(axis.visibleLabels.length === 1)) {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                'L' + ' ' + (axisRect.width + axisRect.x) + ' ' + endY + ' ');
                        }
                        else {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' +
                                endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                            if (i === 0) {
                                labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                    'M ' + startX + ' ' + endY + ' L ' + (axisRect.x) + ' ' + endY);
                            }
                            if (i === axis.visibleLabels.length - 1) {
                                labelBorder += ('M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ' +
                                    'M ' + endX + ' ' + endY + ' L ' + (axisRect.width + axisRect.x) + ' ' + endY);
                            }
                        }
                        break;
                    case 'WithoutTopandBottomBorder':
                        if (!(startX < axisRect.x) && !(Math.floor(endX) > axisRect.width + axisRect.x)) {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                'M ' + endX + ' ' + startY + ' L ' + endX + ' ' + endY);
                        }
                        break;
                }
            }
            labelBorder += (axis.border.type === 'Rectangle' ? ('M ' + ' ' + axisRect.x + ' ' + startY + 'L' + ' ' +
                (axisRect.x + axisRect.width) + ' ' + startY) : '');
            if (labelBorder !== '') {
                this.createAxisBorderElement(axis, index, labelBorder, parent);
            }
        }
        if (this.chart.multiLevelLabelModule && axis.multiLevelLabels.length > 0) {
            this.chart.multiLevelLabelModule.renderXAxisMultiLevelLabels(axis, index, parent, axisRect);
        }
    };
    /**
     * To create border element of the axis
     * @param axis
     * @param index
     * @param labelBorder
     * @param parent
     */
    CartesianAxisLayoutPanel.prototype.createAxisBorderElement = function (axis, index, labelBorder, parent) {
        var element = getElement(this.chart.element.id + '_BorderLine_' + index);
        var direction = element ? element.getAttribute('d') : '';
        var borderElement = this.chart.renderer.drawPath(new PathOption(this.chart.element.id + '_BorderLine_' + index, 'transparent', axis.border.width, axis.border.color || this.chart.themeStyle.axisLine, 1, '', labelBorder));
        borderElement.setAttribute('style', 'pointer-events: none');
        appendChildElement(this.chart.enableCanvas, parent, borderElement, this.chart.redraw, true, 'x', 'y', null, direction, true);
    };
    /**
     * To find the axis label of the intersect action
     * @param axis
     * @param label
     * @param width
     */
    CartesianAxisLayoutPanel.prototype.findAxisLabel = function (axis, label, width) {
        return (axis.labelIntersectAction === 'Trim' ?
            ((axis.angle % 360 === 0 && !axis.enableTrim) ? textTrim(width, label, axis.labelStyle) : label) : label);
    };
    /**
     * X-Axis Title function performed
     * @param axis
     * @param index
     * @param parent
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.drawXAxisTitle = function (axis, index, parent, rect) {
        if (axis.title) {
            var chart = this.chart;
            var elementSize = measureText(axis.title, axis.titleStyle);
            var scrollBarHeight = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight : 0;
            var padding = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + this.padding) +
                (axis.labelPosition === 'Inside' ? 0 :
                    axis.maxLabelSize.height + axis.multiLevelLabelHeight + axis.labelPadding);
            var titleSize = (axis.titleSize.height * (axis.titleCollection.length - 1));
            padding = axis.opposedPosition ? -(padding + elementSize.height / 4 + scrollBarHeight + titleSize) : (padding + (3 *
                elementSize.height / 4) + scrollBarHeight);
            var options = new TextOption(chart.element.id + '_AxisTitle_' + index, rect.x + rect.width * 0.5, rect.y + padding, 'middle', axis.titleCollection);
            var element = textElement(chart.renderer, options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent);
            element.setAttribute('aria-label', axis.description || axis.title);
            element.setAttribute('tabindex', axis.tabIndex.toString());
        }
    };
    /**
     * To render the axis grid and tick lines(Both Major and Minor)
     * @param axis
     * @param index
     * @param gridDirection
     * @param gridModel
     * @param gridId
     * @param gridIndex
     * @param parent
     * @param themeColor
     * @param dashArray
     */
    CartesianAxisLayoutPanel.prototype.renderGridLine = function (axis, index, gridDirection, gridModel, gridId, gridIndex, parent, themeColor, dashArray) {
        if (dashArray === void 0) { dashArray = null; }
        var chart = this.chart;
        var direction;
        var element;
        if (gridModel.width > 0 && axis.visible && axis.internalVisibility && gridDirection) {
            element = getElement(chart.element.id + gridId + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            element = null;
            this.htmlObject = chart.renderer.drawPath(new PathOption(chart.element.id + gridId + index + '_' + gridIndex, 'transparent', gridModel.width, gridModel.color || themeColor, null, dashArray, gridDirection));
            appendChildElement(chart.enableCanvas, parent, this.htmlObject, chart.redraw, true, 'x', 'y', null, direction, true);
        }
    };
    /**
     * To Find the parent node of the axis
     * @param chart
     * @param label
     * @param axis
     * @param index
     */
    CartesianAxisLayoutPanel.prototype.findParentNode = function (elementId, label, axis, index) {
        if (document.getElementById(elementId + 'AxisGroup' + index + 'Inside').contains(document.getElementById(label.id))) {
            return document.getElementById(elementId + 'AxisGroup' + index + 'Inside');
        }
        else {
            return document.getElementById(elementId + 'AxisGroup' + index + 'Outside');
        }
    };
    /**
     * Create Zooming Labels Function Called here
     * @param chart
     * @param labelElement
     * @param axis
     * @param index
     * @param rect
     */
    CartesianAxisLayoutPanel.prototype.createZoomingLabel = function (chart, labelElement, axis, index, rect) {
        var parentNode = this.findParentNode(chart.element.id, labelElement, axis, index);
        labelElement.setAttribute('opacity', '0.3');
        var zoomElement = chart.renderer.createGroup({
            id: chart.element.id + 'AxisLabels_Zoom' + index
        });
        zoomElement = createZoomingLabels(chart, axis, zoomElement, index, axis.orientation === 'Vertical', rect);
        parentNode.replaceChild(labelElement, document.getElementById(labelElement.id));
        if (getElement(chart.element.id + 'AxisLabels_Zoom' + index)) {
            parentNode.replaceChild(zoomElement, document.getElementById(zoomElement.id));
        }
        else {
            parentNode.appendChild(zoomElement);
        }
    };
    /**
     * To get Rotate text size
     * @param isBreakLabel
     * @param axis
     * @param label
     * @param angle
     * @param chart
     */
    CartesianAxisLayoutPanel.prototype.getRotateText = function (isBreakLabel, axis, label, angle, chart) {
        if (isBreakLabel) {
            return new Size(measureText(label.originalText, axis.labelStyle).height, measureText(label.originalText, axis.labelStyle).width);
        }
        else {
            return rotateTextSize(axis.labelStyle, label.text, angle, chart);
        }
    };
    return CartesianAxisLayoutPanel;
}());
export { CartesianAxisLayoutPanel };
