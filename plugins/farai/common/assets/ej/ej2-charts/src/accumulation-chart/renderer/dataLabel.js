var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * AccumulationChart DataLabel module file
 */
import { extend, createElement, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect, PathOption, measureText, TextOption } from '@syncfusion/ej2-svg-base';
import { ChartLocation, degreeToLocation, isOverlap, stringToNumber, getAngle, appendChildElement } from '../../common/utils/helper';
import { textTrim, subtractThickness, Thickness, getElement } from '../../common/utils/helper';
import { removeElement, RectOption, textElement, showTooltip } from '../../common/utils/helper';
import { colorNameToHex, convertHexToColor, containsRect } from '../../common/utils/helper';
import { getSeriesFromIndex } from '../model/acc-base';
import { textRender } from '../../common/model/constants';
import { getFontStyle, createTemplate, measureElementRect, templateAnimate } from '../../common/utils/helper';
import { AccumulationBase } from './accumulation-base';
/**
 * AccumulationDataLabel module used to render `dataLabel`.
 */
var AccumulationDataLabel = /** @class */ (function (_super) {
    __extends(AccumulationDataLabel, _super);
    function AccumulationDataLabel(accumulation) {
        var _this = _super.call(this, accumulation) || this;
        _this.rightSideRenderingPoints = [];
        _this.leftSideRenderingPoints = [];
        _this.id = accumulation.element.id + '_datalabel_Series_';
        if (accumulation.title) {
            var titleSize = measureText(accumulation.title, accumulation.titleStyle);
            _this.titleRect = new Rect(accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
        }
        return _this;
    }
    /**
     * Method to get datalabel text location.
     * @private
     */
    AccumulationDataLabel.prototype.getDataLabelPosition = function (point, dataLabel, textSize, points, parent, id) {
        var radius = this.isCircular() ? (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);
        //let radius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);
        this.getLabelRegion(point, dataLabel.position, textSize, radius, this.marginValue);
        point.labelAngle = point.midAngle;
        point.labelPosition = dataLabel.position;
        if (this.accumulation.enableSmartLabels) {
            this.getSmartLabel(point, dataLabel, textSize, points, parent, id);
        }
    };
    /**
     * Method to get datalabel bound.
     */
    AccumulationDataLabel.prototype.getLabelRegion = function (point, position, textSize, labelRadius, margin, endAngle) {
        if (endAngle === void 0) { endAngle = 0; }
        var labelAngle = endAngle || point.midAngle;
        var space = 10;
        var location = degreeToLocation(labelAngle, labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));
        location.y = (position === 'Inside') ? (location.y - textSize.height / 2) : location.y;
        location.x = (position === 'Inside') ? (location.x - textSize.width / 2) : location.x;
        point.labelRegion = new Rect(location.x, location.y, textSize.width + (margin * 2), textSize.height + (margin * 2));
        if (position === 'Outside') {
            point.labelRegion.y -= point.labelRegion.height / 2;
            if (labelAngle >= 90 && labelAngle <= 270) {
                point.labelRegion.x -= (point.labelRegion.width + space);
            }
            else {
                point.labelRegion.x += space;
            }
        }
    };
    /**
     * Method to get datalabel smart position.
     */
    AccumulationDataLabel.prototype.getSmartLabel = function (point, dataLabel, textSize, points, parent, id) {
        var circular = this.isCircular();
        var labelRadius = circular ? this.radius : this.getLabelDistance(point, dataLabel);
        var connectorLength = circular ? (dataLabel.connectorStyle.length || '4%') :
            '0px';
        labelRadius += stringToNumber(connectorLength, labelRadius);
        var previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
        if (dataLabel.position === 'Inside') {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points)) || !circular && !containsRect(point.region, point.labelRegion)) {
                point.labelPosition = 'Outside';
                if (!circular) {
                    labelRadius = this.getLabelDistance(point, dataLabel);
                }
                this.getLabelRegion(point, point.labelPosition, textSize, labelRadius, this.marginValue);
                previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
                if (previousPoint && (isOverlap(point.labelRegion, previousPoint.labelRegion) ||
                    this.isConnectorLineOverlapping(point, previousPoint))) {
                    this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
                }
            }
        }
        else {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
            }
        }
        if (this.isOverlapping(point, points) && (this.accumulation.type === 'Pyramid' || this.accumulation.type === 'Funnel')) {
            var position = 'OutsideLeft';
            var space = 10;
            var labelAngle = point.midAngle || 0;
            var labelRadius_1 = circular ? this.radius : this.getLabelDistance(point, dataLabel);
            var location_1 = degreeToLocation(labelAngle, -labelRadius_1, this.isCircular() ? this.center :
                this.getLabelLocation(point, position));
            point.labelRegion = new Rect(location_1.x, location_1.y, textSize.width + (this.marginValue * 2), textSize.height + (this.marginValue * 2));
            point.labelRegion.y -= point.labelRegion.height / 2;
            point.labelRegion.x = point.labelRegion.x - space - point.labelRegion.width;
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius_1, textSize, this.marginValue);
            }
        }
    };
    /**
     * To find trimmed datalabel tooltip needed.
     * @return {void}
     * @private
     */
    AccumulationDataLabel.prototype.move = function (e, x, y, isTouch) {
        var _this = this;
        if (e.target.textContent.indexOf('...') > -1) {
            var targetId = e.target.id.split(this.id);
            if (targetId.length === 2) {
                var seriesIndex = parseInt(targetId[1].split('_text_')[0], 10);
                var pointIndex = parseInt(targetId[1].split('_text_')[1], 10);
                if (!isNaN(seriesIndex) && !isNaN(pointIndex)) {
                    if (isTouch) {
                        removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
                    }
                    var point = getSeriesFromIndex(seriesIndex, (this.accumulation).visibleSeries).points[pointIndex];
                    showTooltip(point.text || point.y.toString(), x, y, this.areaRect.width, this.accumulation.element.id + '_EJ2_Datalabel_Tooltip', getElement(this.accumulation.element.id + '_Secondary_Element'));
                }
            }
        }
        else {
            removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
        }
        if (isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = +setTimeout(function () { removeElement(_this.accumulation.element.id + '_EJ2_Datalabel_Tooltip'); }, 1000);
        }
    };
    /**
     * To find previous valid label point
     */
    AccumulationDataLabel.prototype.findPreviousPoint = function (points, index, position) {
        var point = points[0];
        for (var i = index - 1; i >= 0; i--) {
            point = points[i];
            if (point.visible && point.labelVisible && point.labelRegion && point.labelPosition === position) {
                return point;
            }
        }
        return null;
    };
    /**
     * To find current point datalabel is overlapping with other points
     */
    AccumulationDataLabel.prototype.isOverlapping = function (currentPoint, points) {
        for (var i = currentPoint.index - 1; i >= 0; i--) {
            if (points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    /**
     * To get text trimmed while exceeds the accumulation chart area.
     */
    AccumulationDataLabel.prototype.textTrimming = function (point, rect, font, position) {
        if (isOverlap(point.labelRegion, rect)) {
            var size = point.labelRegion.width;
            if (position === 'Right') {
                size = rect.x - point.labelRegion.x;
            }
            else if (position === 'Left') {
                size = point.labelRegion.x - (rect.x + rect.width);
                if (size < 0) {
                    size += point.labelRegion.width;
                    point.labelRegion.x = rect.x + rect.width;
                }
            }
            else if (position === 'InsideRight') {
                size = (rect.x + rect.width) - point.labelRegion.x;
            }
            else if (position === 'InsideLeft') {
                size = (point.labelRegion.x + point.labelRegion.width) - rect.x;
                if (size < point.labelRegion.width) {
                    point.labelRegion.x = rect.x;
                }
            }
            else {
                this.setPointVisibileFalse(point);
            }
            if (point.labelVisible && point.labelRegion) {
                if (size < point.labelRegion.width) {
                    point.label = textTrim(size - (this.marginValue * 2), point.label, font);
                    point.labelRegion.width = size;
                }
                if (point.label.length === 3 && point.label.indexOf('...') > -1) {
                    this.setPointVisibileFalse(point);
                }
            }
        }
    };
    /**
     * To set point label visible and region to disable.
     */
    AccumulationDataLabel.prototype.setPointVisibileFalse = function (point) {
        point.labelVisible = false;
        point.labelRegion = null;
    };
    /**
     * To set point label visible to enable.
     */
    AccumulationDataLabel.prototype.setPointVisibleTrue = function (point) {
        point.labelVisible = true;
    };
    /**
     * To set datalabel angle position for outside labels
     */
    AccumulationDataLabel.prototype.setOuterSmartLabel = function (previousPoint, point, border, labelRadius, textsize, margin) {
        if (!this.isCircular()) {
            this.setSmartLabelForSegments(point, previousPoint, labelRadius, textsize, margin);
        }
        else {
            var labelAngle = this.getOverlappedAngle(previousPoint.labelRegion, point.labelRegion, point.midAngle, border * 2);
            this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
            if (labelAngle > point.endAngle) {
                labelAngle = point.midAngle;
                //this.setPointVisibileFalse(point);
            }
            point.labelAngle = labelAngle;
            while (point.labelVisible && (isOverlap(previousPoint.labelRegion, point.labelRegion) || labelAngle <= previousPoint.labelAngle
                || this.isConnectorLineOverlapping(point, previousPoint))) {
                if (labelAngle > point.endAngle) {
                    //this.setPointVisibileFalse(point);
                    break;
                }
                point.labelAngle = labelAngle;
                this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
                labelAngle += 0.1;
            }
        }
    };
    /**
     * Sets smart label positions for funnel and pyramid series
     */
    AccumulationDataLabel.prototype.setSmartLabelForSegments = function (point, prevPoint, distance, textSize, margin) {
        var textRegion = point.labelRegion;
        //let overlapWidth: number = prevPoint.labelRegion.x + prevPoint.labelRegion.width - textRegion.x;
        var overlapHeight = this.accumulation.type === 'Funnel' ?
            prevPoint.labelRegion.y - (textRegion.y + textRegion.height) :
            point.labelRegion.y - (prevPoint.labelRegion.y + prevPoint.labelRegion.height);
        if (overlapHeight < 0) {
            point.labelRegion.y += this.accumulation.type === 'Funnel' ? overlapHeight : -overlapHeight;
        }
    };
    /**
     * To find connector line overlapping.
     */
    AccumulationDataLabel.prototype.isConnectorLineOverlapping = function (point, previous) {
        var position;
        if (!this.isCircular() && point.labelRegion.x < point.region.x) {
            position = 'outsideLeft';
        }
        var start = this.getLabelLocation(point, position);
        var end = new ChartLocation(0, 0);
        this.getEdgeOfLabel(point.labelRegion, point.labelAngle, end, 0, point);
        var previousstart = this.getLabelLocation(previous);
        var previousend = new ChartLocation(0, 0);
        this.getEdgeOfLabel(previous.labelRegion, previous.labelAngle, previousend, 0, point);
        return this.isLineRectangleIntersect(start, end, point.labelRegion) ||
            this.isLineRectangleIntersect(start, end, previous.labelRegion) ||
            this.isLineRectangleIntersect(previousstart, previousend, point.labelRegion);
    };
    /**
     * To find two rectangle intersect
     */
    AccumulationDataLabel.prototype.isLineRectangleIntersect = function (line1, line2, rect) {
        var rectPoints = [
            new ChartLocation(Math.round(rect.x), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round((rect.y + rect.height))),
            new ChartLocation(Math.round(rect.x), Math.round((rect.y + rect.height)))
        ];
        line1.x = Math.round(line1.x);
        line1.y = Math.round(line1.y);
        line2.x = Math.round(line2.x);
        line2.y = Math.round(line2.y);
        for (var i = 0; i < rectPoints.length; i++) {
            if (this.isLinesIntersect(line1, line2, rectPoints[i], rectPoints[(i + 1) % rectPoints.length])) {
                return true;
            }
        }
        return false;
    };
    /**
     * To find two line intersect
     */
    AccumulationDataLabel.prototype.isLinesIntersect = function (point1, point2, point11, point12) {
        var a1 = point2.y - point1.y;
        var b1 = point1.x - point2.x;
        var c1 = a1 * point1.x + b1 * point1.y;
        var a2 = point12.y - point11.y;
        var b2 = point11.x - point12.x;
        var c2 = a2 * point11.x + b2 * point11.y;
        var delta = a1 * b2 - a2 * b1;
        if (delta !== 0) {
            var x = (b2 * c1 - b1 * c2) / delta;
            var y = (a1 * c2 - a2 * c1) / delta;
            var lies = Math.min(point1.x, point2.x) <= x && x <= Math.max(point1.x, point2.x);
            lies = lies && Math.min(point1.y, point2.y) <= y && y <= Math.max(point1.y, point2.y);
            lies = lies && Math.min(point11.x, point12.x) <= x && x <= Math.max(point11.x, point12.x);
            lies = lies && Math.min(point11.y, point12.y) <= y && y <= Math.max(point11.y, point12.y);
            return lies;
        }
        return false;
    };
    /**
     * To get two rectangle overlapping angles.
     */
    AccumulationDataLabel.prototype.getOverlappedAngle = function (first, second, angle, padding) {
        var x = first.x;
        if (angle >= 90 && angle <= 270) {
            second.y = first.y - (padding + second.height / 2);
            x = first.x + first.width;
        }
        else {
            second.y = first.y + first.height + padding;
        }
        return getAngle(this.center, new ChartLocation(x, second.y));
    };
    /**
     * To get connector line path
     */
    AccumulationDataLabel.prototype.getConnectorPath = function (label, point, dataLabel, end) {
        if (end === void 0) { end = 0; }
        var connector = dataLabel.connectorStyle;
        var labelRadius = this.isCircular() ? (!this.isVariousRadius() ? this.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);
        //let labelRadius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);
        var start = this.getConnectorStartPoint(point, connector);
        var labelAngle = this.accumulation.enableSmartLabels ? point.midAngle : end || point.midAngle;
        var middle = new ChartLocation(0, 0);
        var endPoint = this.getEdgeOfLabel(label, labelAngle, middle, connector.width, point);
        if (connector.type === 'Curve') {
            if (this.isCircular()) {
                var r = labelRadius - (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                    this.radius);
                //let r: number = labelRadius - this.radius;
                if (point.isLabelUpdated) {
                    middle = this.getPerpendicularDistance(start, point);
                }
                else {
                    middle = degreeToLocation(labelAngle, labelRadius - (r / 2), this.center);
                    if (point.labelPosition === 'Outside' && dataLabel.position === 'Inside') {
                        middle = degreeToLocation(labelAngle, labelRadius - r * 1.25, this.center);
                    }
                }
                return 'M ' + start.x + ' ' + start.y + ' Q ' + middle.x + ' ' + middle.y + ' ' + endPoint.x + ' ' + endPoint.y;
            }
            else {
                return this.getPolyLinePath(start, endPoint);
            }
        }
        else {
            return 'M ' + start.x + ' ' + start.y + ' L ' + middle.x + ' ' + middle.y + ' L ' + endPoint.x + ' ' + endPoint.y;
        }
    };
    /**
     * Finds the curved path for funnel/pyramid data label connectors
     */
    AccumulationDataLabel.prototype.getPolyLinePath = function (start, end) {
        var controlPoints = [start, end];
        if (start.y === end.y) {
            return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y;
        }
        var path = 'M';
        for (var i = 0; i <= 16; i++) {
            var t = i / 16;
            var points = this.getBezierPoint(t, controlPoints, 0, 2);
            path += points.x + ',' + points.y;
            if (i !== 16) {
                path += ' L';
            }
        }
        return path;
    };
    /**
     * Finds the bezier point for funnel/pyramid data label connectors
     */
    AccumulationDataLabel.prototype.getBezierPoint = function (t, controlPoints, index, count) {
        if (count === 1) {
            return controlPoints[index];
        }
        var p0 = this.getBezierPoint(t, controlPoints, index, count - 1);
        var p1 = this.getBezierPoint(t, controlPoints, index + 1, count - 1);
        var x = (p0.x) ? p0.x : p0.x;
        var y = (p0.y) ? p0.y : p0.y;
        var x1 = (p1.x) ? p1.x : p1.x;
        var y1 = (p1.y) ? p1.y : p1.y;
        var x2 = (1 - t) * x + t * x1;
        var y2 = (1 - t) * y + t * y1;
        if (p0.x) {
            return { x: x2, y: y2 };
        }
        else {
            return { x: x2, y: y2 };
        }
    };
    /**
     * To get label edges based on the center and label rect position.
     */
    AccumulationDataLabel.prototype.getEdgeOfLabel = function (labelshape, angle, middle, border, point) {
        if (border === void 0) { border = 1; }
        var edge = new ChartLocation(labelshape.x, labelshape.y);
        if (angle >= 90 && angle <= 270) {
            edge.x += labelshape.width + border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        }
        else if (point && point.region && point.region.x > point.labelRegion.x) {
            edge.x += border * 2 + labelshape.width;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        }
        else {
            edge.x -= border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x - 10;
            middle.y = edge.y;
        }
        return edge;
    };
    /**
     * Finds the distance between the label position and the edge/center of the funnel/pyramid
     */
    AccumulationDataLabel.prototype.getLabelDistance = function (point, dataLabel) {
        if (point.labelPosition && dataLabel.position !== point.labelPosition || dataLabel.connectorStyle.length) {
            var length_1 = stringToNumber(dataLabel.connectorStyle.length || '70px', this.accumulation.initialClipRect.width);
            if (length_1 < this.accumulation.initialClipRect.width) {
                return length_1;
            }
        }
        var position = point.labelPosition || dataLabel.position;
        var series = this.accumulation.visibleSeries[0];
        var extraSpace = (this.accumulation.initialClipRect.width - series.triangleSize.width) / 2;
        var labelLocation;
        switch (position) {
            case 'Inside':
                return 0;
            case 'Outside':
                labelLocation = point.symbolLocation.x + point.labelOffset.x;
                return this.accumulation.initialClipRect.width - labelLocation - extraSpace;
        }
    };
    /**
     * Finds the label position / beginning of the connector(ouside funnel labels)
     */
    AccumulationDataLabel.prototype.getLabelLocation = function (point, position) {
        if (position === void 0) { position = 'Outside'; }
        if (this.accumulation.type !== 'Pie') {
            position = position === 'OutsideLeft' ? 'OutsideLeft' : point.labelPosition || position;
            var location_2 = {
                x: point.symbolLocation.x,
                y: point.symbolLocation.y - point.labelOffset.y
            };
            switch (position) {
                case 'Inside':
                    location_2.y = point.region.y + point.region.height / 2;
                    break;
                case 'Outside':
                    location_2.x += point.labelOffset.x;
                    break;
                case 'OutsideLeft':
                    location_2.x -= point.labelOffset.x;
            }
            return location_2;
        }
        else {
            //return degreeToLocation(point.midAngle, this.radius, this.center);
            return degreeToLocation(point.midAngle, (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                this.radius), this.center);
        }
    };
    /**
     * Finds the beginning of connector line
     */
    AccumulationDataLabel.prototype.getConnectorStartPoint = function (point, connector) {
        // return this.isCircular() ? degreeToLocation(point.midAngle, this.radius - connector.width, this.center) :
        //     this.getLabelLocation(point);
        var position;
        if (!this.isCircular() && point.region.x > point.labelRegion.x) {
            position = 'OutsideLeft';
        }
        return this.isCircular() ? degreeToLocation(point.midAngle, (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
            this.radius) - connector.width, this.center) : this.getLabelLocation(point, position);
    };
    /**
     * To find area rect based on margin, available size.
     * @private
     */
    AccumulationDataLabel.prototype.findAreaRect = function () {
        this.areaRect = new Rect(0, 0, this.accumulation.availableSize.width, this.accumulation.availableSize.height);
        var margin = this.accumulation.margin;
        subtractThickness(this.areaRect, new Thickness(margin.left, margin.right, margin.top, margin.bottom));
    };
    /**
     * To render the data labels from series points.
     */
    AccumulationDataLabel.prototype.renderDataLabel = function (point, dataLabel, parent, points, series, templateElement, redraw) {
        var id = this.accumulation.element.id + '_datalabel_Series_' + series + '_';
        var datalabelGroup = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
        point.label = point.originalText || point.y.toString();
        var border = { width: dataLabel.border.width, color: dataLabel.border.color };
        var argsFont = (extend({}, getValue('properties', dataLabel.font), null, true));
        var argsData = {
            cancel: false, name: textRender, series: this.accumulation.visibleSeries[0], point: point,
            text: point.label, border: border, color: dataLabel.fill, template: dataLabel.template, font: argsFont
        };
        this.accumulation.trigger(textRender, argsData);
        point.argsData = argsData;
        var isTemplate = argsData.template !== null;
        point.labelVisible = !argsData.cancel;
        point.text = point.label = argsData.text;
        if (Number(point.label)) {
            point.label = this.accumulation.intl.formatNumber(+point.label, {
                useGrouping: this.accumulation.useGroupingSeparator
            });
        }
        this.marginValue = argsData.border.width ? (5 + argsData.border.width) : 1;
        var childElement = createElement('div', {
            id: this.accumulation.element.id + '_Series_' + 0 + '_DataLabel_' + point.index,
            styles: 'position: absolute;background-color:' + argsData.color + ';' +
                getFontStyle(dataLabel.font) + ';border:' + argsData.border.width + 'px solid ' + argsData.border.color + ';'
        });
        var textSize = isTemplate ? this.getTemplateSize(childElement, point, argsData, redraw) :
            measureText(point.label, dataLabel.font);
        textSize.height += 4; // 4 for calculation with padding for smart label shape
        textSize.width += 4;
        point.textSize = textSize;
        point.templateElement = childElement;
        this.getDataLabelPosition(point, dataLabel, textSize, points, datalabelGroup, id);
        if (point.labelRegion) {
            this.correctLabelRegion(point.labelRegion, point.textSize);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    AccumulationDataLabel.prototype.drawDataLabels = function (series, dataLabel, parent, templateElement, redraw) {
        var angle;
        var degree;
        var modifiedPoints = series.leftSidePoints.concat(series.rightSidePoints);
        modifiedPoints.sort(function (a, b) { return a.index - b.index; });
        if (series.type === 'Pie' && this.accumulation.enableSmartLabels) {
            this.extendedLabelsCalculation();
        }
        for (var _i = 0, modifiedPoints_1 = modifiedPoints; _i < modifiedPoints_1.length; _i++) {
            var point = modifiedPoints_1[_i];
            if (!isNullOrUndefined(point.argsData) && !isNullOrUndefined(point.y)) {
                this.finalizeDatalabels(point, modifiedPoints, dataLabel);
                var id = this.accumulation.element.id + '_datalabel_Series_' + 0 + '_';
                var datalabelGroup = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
                var dataLabelElement = void 0;
                var location_3 = void 0;
                var element = void 0;
                if (point.visible && point.labelVisible) {
                    angle = degree = dataLabel.angle;
                    if (point.argsData.template) {
                        this.setTemplateStyle(point.templateElement, point, templateElement, dataLabel.font.color, point.color, redraw);
                    }
                    else {
                        location_3 = new ChartLocation(
                        // tslint:disable-next-line:max-line-length
                        point.labelRegion.x + this.marginValue, point.labelRegion.y + (point.textSize.height * 3 / 4) + this.marginValue);
                        element = getElement(id + 'shape_' + point.index);
                        var startLocation = element ? new ChartLocation(+element.getAttribute('x'), +element.getAttribute('y')) : null;
                        dataLabelElement = this.accumulation.renderer.drawRectangle(new RectOption(id + 'shape_' + point.index, point.argsData.color, point.argsData.border, 1, point.labelRegion, dataLabel.rx, dataLabel.ry));
                        appendChildElement(false, datalabelGroup, dataLabelElement, redraw, true, 'x', 'y', startLocation, null, false, false, null, this.accumulation.duration);
                        var textWidth = point.textSize.width;
                        var textHeight = point.textSize.height;
                        var rotate = void 0;
                        if (angle !== 0 && dataLabel.enableRotation) {
                            if (point.labelPosition === 'Outside') {
                                degree = 0;
                            }
                            else {
                                if (point.midAngle >= 90 && point.midAngle <= 270) {
                                    degree = point.midAngle + 180;
                                }
                                else {
                                    degree = point.midAngle;
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            rotate = 'rotate(' + degree + ',' + (location_3.x + (textWidth / 2)) + ',' + (location_3.y - (textHeight / 4)) + ')';
                        }
                        else {
                            if (angle) {
                                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                            }
                            else {
                                degree = 0;
                            }
                            rotate = 'rotate(' + degree + ',' + (location_3.x + (textWidth / 2)) + ',' + (location_3.y) + ')';
                        }
                        point.transform = rotate;
                        textElement(this.accumulation.renderer, new TextOption(id + 'text_' + point.index, location_3.x, location_3.y, 'start', point.label, rotate, 'auto', degree), point.argsData.font, point.argsData.font.color || this.getSaturatedColor(point, point.argsData.color), datalabelGroup, false, redraw, true, false, this.accumulation.duration);
                        element = null;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.accumulation.accumulationLegendModule && (dataLabel.position === 'Outside' || this.accumulation.enableSmartLabels)) {
                        this.accumulation.visibleSeries[0].findMaxBounds(this.accumulation.visibleSeries[0].labelBound, point.labelRegion);
                    }
                    if (point.labelPosition === 'Outside') {
                        var element_1 = getElement(id + 'connector_' + point.index);
                        var previousDirection = element_1 ? element_1.getAttribute('d') : '';
                        var pathElement = this.accumulation.renderer.drawPath(new PathOption(id + 'connector_' + point.index, 'transparent', dataLabel.connectorStyle.width, dataLabel.connectorStyle.color || point.color, 1, dataLabel.connectorStyle.dashArray, this.getConnectorPath(extend({}, point.labelRegion, null, true), point, dataLabel, point.labelAngle)));
                        appendChildElement(false, datalabelGroup, pathElement, redraw, true, null, null, null, previousDirection, false, false, null, this.accumulation.duration);
                    }
                    appendChildElement(false, parent, datalabelGroup, redraw);
                }
            }
        }
    };
    /**
     * In this method datalabels region checked with legebdBounds and areaBounds.
     * Trimming of datalabel and point's visibility again changed here.
     * @param point current point in which trimming and visibility to be checked
     * @param points finalized points
     * @param dataLabel datalabel model
     */
    AccumulationDataLabel.prototype.finalizeDatalabels = function (point, points, dataLabel) {
        if (this.isOverlapping(point, points) ||
            (this.titleRect && point.labelRegion && isOverlap(point.labelRegion, this.titleRect))) {
            //this.setPointVisibileFalse(point);
        }
        if (this.accumulation.accumulationLegendModule && point.labelVisible && point.labelRegion) {
            var rect = this.accumulation.accumulationLegendModule.legendBounds;
            var padding = this.accumulation.legendSettings.border.width / 2;
            this.textTrimming(point, new Rect(rect.x - padding, rect.y - padding, rect.width + (2 * padding), rect.height + (2 * padding)), dataLabel.font, this.accumulation.accumulationLegendModule.position);
        }
        if (point.labelVisible && point.labelRegion) {
            var position = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';
            this.textTrimming(point, this.areaRect, dataLabel.font, position);
        }
        if (point.labelVisible && point.labelRegion && ((point.labelRegion.y + point.labelRegion.height >
            this.areaRect.y + this.areaRect.height || point.labelRegion.y < this.areaRect.y) || (point.labelRegion.x < this.areaRect.x ||
            point.labelRegion.x + point.labelRegion.width > this.areaRect.x + this.areaRect.width))) {
            this.setPointVisibileFalse(point);
        }
    };
    /**
     * To find the template element size
     * @param element
     * @param point
     * @param argsData
     */
    AccumulationDataLabel.prototype.getTemplateSize = function (element, point, argsData, redraw) {
        var clientRect;
        element = createTemplate(element, point.index, argsData.template, this.accumulation, point, this.accumulation.visibleSeries[0], this.accumulation.element.id + '_DataLabel');
        clientRect = measureElementRect(element, redraw);
        return { width: clientRect.width, height: clientRect.height };
    };
    /**
     * To set the template element style
     * @param childElement
     * @param point
     * @param parent
     * @param labelColor
     * @param fill
     */
    AccumulationDataLabel.prototype.setTemplateStyle = function (childElement, point, parent, labelColor, fill, redraw) {
        childElement.style.left = (point.labelRegion.x) + 'px';
        childElement.style.top = (point.labelRegion.y) + 'px';
        childElement.style.color = labelColor ||
            this.getSaturatedColor(point, fill);
        if (this.accumulation.isBlazor) {
            var position = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';
            if (position === 'InsideRight') {
                childElement.style.transform = 'translate(0%, -50%)';
            }
            else {
                childElement.style.transform = 'translate(-100%, -50%)';
            }
        }
        if (childElement.childElementCount) {
            appendChildElement(false, parent, childElement, redraw, true, 'left', 'top');
            this.doTemplateAnimation(this.accumulation, childElement);
        }
    };
    /**
     * To find saturated color for datalabel
     */
    AccumulationDataLabel.prototype.getSaturatedColor = function (point, color) {
        var saturatedColor;
        if (this.marginValue >= 1) {
            saturatedColor = color === 'transparent' ? this.getLabelBackground(point) : color;
        }
        else {
            saturatedColor = this.getLabelBackground(point);
        }
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        var rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        var contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    };
    /**
     * Animates the data label template.
     * @return {void}.
     * @private
     */
    AccumulationDataLabel.prototype.doTemplateAnimation = function (accumulation, element) {
        var series = accumulation.visibleSeries[0];
        var delay = series.animation.delay + series.animation.duration;
        if (series.animation.enable && accumulation.animateSeries) {
            element.style.visibility = 'hidden';
            templateAnimate(element, delay, 200, 'ZoomIn');
        }
    };
    /**
     * To find background color for the datalabel
     */
    AccumulationDataLabel.prototype.getLabelBackground = function (point) {
        return point.labelPosition === 'Outside' ?
            this.accumulation.background || this.accumulation.themeStyle.background : point.color;
    };
    /**
     * To correct the padding between datalabel regions.
     */
    AccumulationDataLabel.prototype.correctLabelRegion = function (labelRegion, textSize, padding) {
        if (padding === void 0) { padding = 4; }
        labelRegion.height -= padding;
        labelRegion.width -= padding;
        labelRegion.x += padding / 2;
        labelRegion.y += padding / 2;
        textSize.height -= padding;
        textSize.width -= padding;
    };
    /**
     * To get the dataLabel module name
     */
    AccumulationDataLabel.prototype.getModuleName = function () {
        return 'AccumulationDataLabel';
    };
    /**
     * To destroy the data label.
     * @return {void}
     * @private
     */
    AccumulationDataLabel.prototype.destroy = function (accumulation) {
        /**
         * Destroy method performed here
         */
    };
    //calculation for placing labels smartly
    AccumulationDataLabel.prototype.extendedLabelsCalculation = function () {
        var _this = this;
        var series = this.accumulation.series[0];
        series.rightSidePoints.forEach(function (point, index, halfSidePoints) {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            _this.skipPoints(point, halfSidePoints, index);
        });
        series.leftSidePoints.forEach(function (point, index, halfSidePoints) {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            _this.skipPoints(point, halfSidePoints, index);
        });
        this.arrangeLeftSidePoints(series);
        this.isIncreaseAngle = false;
        this.arrangeRightSidePoints(series);
    };
    /**
     * Rightside points alignments calculation
     * @param series
     */
    AccumulationDataLabel.prototype.arrangeRightSidePoints = function (series) {
        var startFresh;
        var angleChanged;
        var rightSideRenderPoints = series.rightSidePoints.filter(function (point) { return (point.labelVisible && point.labelPosition === 'Outside'); });
        this.rightSideRenderingPoints = rightSideRenderPoints;
        var checkAngle;
        var currentPoint;
        var lastPoint = rightSideRenderPoints[rightSideRenderPoints.length - 1];
        var nextPoint;
        if (lastPoint) {
            if (lastPoint.labelAngle > 90 && lastPoint.labelAngle < 270) {
                this.isIncreaseAngle = true;
                this.changeLabelAngle(lastPoint, 89);
            }
        }
        /**
         * Right side points arranged from last point.
         * A point checked with successive points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 270, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (var i = rightSideRenderPoints.length - 1; i >= 0; i--) {
            currentPoint = rightSideRenderPoints[i];
            nextPoint = rightSideRenderPoints[i + 1];
            // A point checked for overlapping, label visibility
            if (this.isOverlapWithNext(currentPoint, rightSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle <= 90 || currentPoint.labelAngle >= 270)) {
                checkAngle = lastPoint.labelAngle + 10;
                angleChanged = true;
                //If last's point change angle in beyond the limit, stop the increasing angle and do decrease the angle.
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                else if (checkAngle > 90 && checkAngle < 270 && nextPoint.isLabelUpdated) {
                    this.isIncreaseAngle = true;
                }
                if (!this.isIncreaseAngle) {
                    for (var k = i + 1; k < rightSideRenderPoints.length; k++) {
                        this.increaseAngle(rightSideRenderPoints[k - 1], rightSideRenderPoints[k], series, true);
                    }
                }
                else {
                    for (var k = i + 1; k > 0; k--) {
                        this.decreaseAngle(rightSideRenderPoints[k], rightSideRenderPoints[k - 1], series, true);
                    }
                }
            }
            else {
                //If a point did not overlapped with previous points, increase the angle always for right side points.
                if (angleChanged && nextPoint && !nextPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    };
    /**
     * Leftside points alignments calculation
     * @param series
     */
    AccumulationDataLabel.prototype.arrangeLeftSidePoints = function (series) {
        var _this = this;
        var leftSideRenderPoints = series.leftSidePoints.filter(function (point) { return (point.labelVisible && point.labelPosition === 'Outside'); });
        this.leftSideRenderingPoints = leftSideRenderPoints;
        var previousPoint;
        var currentPoint;
        var angleChanged;
        var startFresh;
        /**
         * Left side points arranged from first point.
         * A point checked with previous points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 90, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (var i = 0; i < leftSideRenderPoints.length; i++) {
            currentPoint = leftSideRenderPoints[i];
            previousPoint = leftSideRenderPoints[i - 1];
            // A point checked
            if (this.isOverlapWithPrevious(currentPoint, leftSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle < 270)) {
                angleChanged = true;
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                if (!this.isIncreaseAngle) {
                    for (var k = i; k > 0; k--) {
                        this.decreaseAngle(leftSideRenderPoints[k], leftSideRenderPoints[k - 1], series, false);
                        leftSideRenderPoints.filter(function (point, index) {
                            if (point.isLabelUpdated && leftSideRenderPoints[index].labelAngle - 10 < 100) {
                                _this.isIncreaseAngle = true;
                            }
                        });
                    }
                }
                else {
                    for (var k = i; k < leftSideRenderPoints.length; k++) {
                        this.increaseAngle(leftSideRenderPoints[k - 1], leftSideRenderPoints[k], series, false);
                    }
                }
            }
            else {
                if (angleChanged && previousPoint && previousPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    };
    AccumulationDataLabel.prototype.decreaseAngle = function (currentPoint, previousPoint, series, isRightSide) {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(previousPoint)) {
            return null;
        }
        var count = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                !((previousPoint.labelRegion.height + previousPoint.labelRegion.y) < currentPoint.labelRegion.y))) {
                var newAngle = previousPoint.midAngle - count;
                if (newAngle < 0) {
                    newAngle = 360 + newAngle;
                }
                if (newAngle <= 270 && newAngle >= 90) {
                    newAngle = 270;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                count++;
            }
        }
        else {
            if (currentPoint.labelAngle > 270) {
                this.changeLabelAngle(currentPoint, 270);
                previousPoint.labelAngle = 270;
            }
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                ((currentPoint.labelRegion.y + currentPoint.labelRegion.height) > previousPoint.labelRegion.y))) {
                var newAngle = previousPoint.midAngle - count;
                if (!(newAngle <= 270 && newAngle >= 90)) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) &&
                    !series.leftSidePoints.indexOf(previousPoint) && (newAngle - 1 < 90 && newAngle - 1 > 270)) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle + 1);
                    this.arrangeLeftSidePoints(series);
                    break;
                }
                count++;
            }
        }
    };
    AccumulationDataLabel.prototype.increaseAngle = function (currentPoint, nextPoint, series, isRightSide) {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(nextPoint)) {
            return null;
        }
        var count = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                !((currentPoint.labelRegion.y + currentPoint.labelRegion.height) < nextPoint.labelRegion.y))) {
                var newAngle = nextPoint.midAngle + count;
                if (newAngle < 270 && newAngle > 90) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) && (newAngle + 1 > 90 && newAngle + 1 < 270) &&
                    this.rightSideRenderingPoints.indexOf(nextPoint) === this.rightSideRenderingPoints.length - 1) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle - 1);
                    nextPoint.labelRegion = nextPoint.initialLabelRegion;
                    this.arrangeRightSidePoints(series);
                    break;
                }
                count++;
            }
        }
        else {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                (currentPoint.labelRegion.y < (nextPoint.labelRegion.y + nextPoint.labelRegion.height)))) {
                var newAngle = nextPoint.midAngle + count;
                if (!(newAngle < 270 && newAngle > 90)) {
                    newAngle = 270;
                    this.isIncreaseAngle = false;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                count++;
            }
        }
    };
    AccumulationDataLabel.prototype.changeLabelAngle = function (currentPoint, newAngle) {
        var dataLabel = this.accumulation.series[0].dataLabel;
        var variableR;
        if (!this.isVariousRadius()) {
            variableR = this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], currentPoint);
        }
        //padding 10px is added to label radius for increasing the angle and avoid congestion.
        var labelRadius = (currentPoint.labelPosition === 'Outside' && this.accumulation.enableSmartLabels &&
            dataLabel.position === 'Inside') ?
            this.radius + stringToNumber(dataLabel.connectorStyle.length || '4%', this.accumulation.pieSeriesModule.size / 2) :
            (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius + 10 : variableR);
        var radius = (!this.isVariousRadius() ? labelRadius : variableR);
        this.getLabelRegion(currentPoint, 'Outside', currentPoint.textSize, radius, this.marginValue, newAngle);
        currentPoint.isLabelUpdated = 1;
        currentPoint.labelAngle = newAngle;
    };
    AccumulationDataLabel.prototype.isOverlapWithPrevious = function (currentPoint, points, currentPointIndex) {
        for (var i = 0; i < currentPointIndex; i++) {
            if (i !== points.indexOf(currentPoint) &&
                points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    AccumulationDataLabel.prototype.isOverlapWithNext = function (point, points, pointIndex) {
        for (var i = pointIndex; i < points.length; i++) {
            if (i !== points.indexOf(point) && points[i].visible && points[i].labelVisible && points[i].labelRegion &&
                point.labelRegion && point.labelVisible && isOverlap(point.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    AccumulationDataLabel.prototype.skipPoints = function (currentPoint, halfsidePoints, pointIndex) {
        if (pointIndex > 0 && ((currentPoint.midAngle < 285 && currentPoint.midAngle > 255) ||
            (currentPoint.midAngle < 105 && currentPoint.midAngle > 75))) {
            var previousPoint = halfsidePoints[pointIndex - 1];
            var angleDiff = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            var prevAngleDiff = previousPoint.endAngle % 360 - previousPoint.startAngle % 360;
            if (prevAngleDiff <= angleDiff && angleDiff < 5 && previousPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        }
        else if (pointIndex > 1 && ((currentPoint.midAngle < 300 && currentPoint.midAngle > 240) ||
            (currentPoint.midAngle < 120 && currentPoint.midAngle > 60))) {
            var prevPoint = halfsidePoints[pointIndex - 1];
            var secondPrevPoint = halfsidePoints[pointIndex - 2];
            var angleDiff = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            var prevAngleDiff = prevPoint.endAngle % 360 - prevPoint.startAngle % 360;
            var thirdAngleDiff = secondPrevPoint.endAngle % 360 - secondPrevPoint.startAngle % 360;
            if (angleDiff < 3 && prevAngleDiff < 3 && thirdAngleDiff < 3 && prevPoint.labelVisible && currentPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        }
    };
    AccumulationDataLabel.prototype.getPerpendicularDistance = function (startPoint, point) {
        var increasedLocation;
        var add = 10;
        var height = add + 10 * Math.sin(point.midAngle * Math.PI / 360);
        if (point.midAngle > 270 && point.midAngle < 360) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((360 - point.midAngle) * Math.PI / 180)), startPoint.y - height * (Math.sin((360 - point.midAngle) * Math.PI / 180)));
        }
        else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((point.midAngle) * Math.PI / 180)), startPoint.y + height * (Math.sin((point.midAngle) * Math.PI / 180)));
        }
        else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 90) * Math.PI / 180)), startPoint.y + height * (Math.sin((point.midAngle - 90) * Math.PI / 180)));
        }
        else {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 180) * Math.PI / 180)), startPoint.y - height * (Math.sin((point.midAngle - 180) * Math.PI / 180)));
        }
        return increasedLocation;
    };
    return AccumulationDataLabel;
}(AccumulationBase));
export { AccumulationDataLabel };
