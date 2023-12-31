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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Complex, ChildProperty, Collection, extend } from '@syncfusion/ej2-base';
import { Font, Border } from '../../common/model/base';
import { rotateTextSize, firstToLowerCase, valueToCoefficient, inside, isBreakLabel, isZoomSet, getTitle } from '../../common/utils/helper';
import { Size, Rect, measureText } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Double } from '../axis/double-axis';
import { Theme } from '../../common/model/theme';
import { axisRangeCalculated } from '../../common/model/constants';
import { StripLineSettings, MultiLevelLabels, LabelBorder, ScrollbarSettings } from '../model/chart-base';
import { textWrap } from '../../common/utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
var axisPadding = 5;
/**
 * Configures the `rows` of the chart.
 */
var Row = /** @class */ (function (_super) {
    __extends(Row, _super);
    function Row() {
        /**
         * The height of the row as a string accept input both as '100px' and '100%'.
         * If specified as '100%, row renders to the full height of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        return _this;
    }
    /**
     * Measure the row size
     * @return {void}
     * @private
     */
    Row.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var width = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            width += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(width);
        }
        else {
            this.nearSizes.push(width);
        }
    };
    __decorate([
        Property('100%')
    ], Row.prototype, "height", void 0);
    __decorate([
        Complex({}, Border)
    ], Row.prototype, "border", void 0);
    return Row;
}(ChildProperty));
export { Row };
/**
 * Configures the `columns` of the chart.
 */
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        /**
         * The width of the column as a string accepts input both as like '100px' or '100%'.
         * If specified as '100%, column renders to the full width of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        /** @private */
        _this.padding = 0;
        return _this;
    }
    /**
     * Measure the column size
     * @return {void}
     * @private
     */
    Column.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var height = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            height += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(height);
        }
        else {
            this.nearSizes.push(height);
        }
    };
    __decorate([
        Property('100%')
    ], Column.prototype, "width", void 0);
    __decorate([
        Complex({}, Border)
    ], Column.prototype, "border", void 0);
    return Column;
}(ChildProperty));
export { Column };
/**
 * Configures the major grid lines in the `axis`.
 */
var MajorGridLines = /** @class */ (function (_super) {
    __extends(MajorGridLines, _super);
    function MajorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], MajorGridLines.prototype, "width", void 0);
    __decorate([
        Property('')
    ], MajorGridLines.prototype, "dashArray", void 0);
    __decorate([
        Property(null)
    ], MajorGridLines.prototype, "color", void 0);
    return MajorGridLines;
}(ChildProperty));
export { MajorGridLines };
/**
 * Configures the minor grid lines in the `axis`.
 */
var MinorGridLines = /** @class */ (function (_super) {
    __extends(MinorGridLines, _super);
    function MinorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0.7)
    ], MinorGridLines.prototype, "width", void 0);
    __decorate([
        Property('')
    ], MinorGridLines.prototype, "dashArray", void 0);
    __decorate([
        Property(null)
    ], MinorGridLines.prototype, "color", void 0);
    return MinorGridLines;
}(ChildProperty));
export { MinorGridLines };
/**
 * Configures the axis line of a chart.
 */
var AxisLine = /** @class */ (function (_super) {
    __extends(AxisLine, _super);
    function AxisLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], AxisLine.prototype, "width", void 0);
    __decorate([
        Property('')
    ], AxisLine.prototype, "dashArray", void 0);
    __decorate([
        Property(null)
    ], AxisLine.prototype, "color", void 0);
    return AxisLine;
}(ChildProperty));
export { AxisLine };
/**
 * Configures the major tick lines.
 */
var MajorTickLines = /** @class */ (function (_super) {
    __extends(MajorTickLines, _super);
    function MajorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], MajorTickLines.prototype, "width", void 0);
    __decorate([
        Property(5)
    ], MajorTickLines.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], MajorTickLines.prototype, "color", void 0);
    return MajorTickLines;
}(ChildProperty));
export { MajorTickLines };
/**
 * Configures the minor tick lines.
 */
var MinorTickLines = /** @class */ (function (_super) {
    __extends(MinorTickLines, _super);
    function MinorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0.7)
    ], MinorTickLines.prototype, "width", void 0);
    __decorate([
        Property(5)
    ], MinorTickLines.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], MinorTickLines.prototype, "color", void 0);
    return MinorTickLines;
}(ChildProperty));
export { MinorTickLines };
/**
 * Configures the crosshair ToolTip.
 */
var CrosshairTooltip = /** @class */ (function (_super) {
    __extends(CrosshairTooltip, _super);
    function CrosshairTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], CrosshairTooltip.prototype, "enable", void 0);
    __decorate([
        Property(null)
    ], CrosshairTooltip.prototype, "fill", void 0);
    __decorate([
        Complex(Theme.crosshairLabelFont, Font)
    ], CrosshairTooltip.prototype, "textStyle", void 0);
    return CrosshairTooltip;
}(ChildProperty));
export { CrosshairTooltip };
/**
 * Configures the axes in the chart.
 * @public
 */
var Axis = /** @class */ (function (_super) {
    __extends(Axis, _super);
    // tslint:disable-next-line:no-any
    function Axis(parent, propName, defaultValue, isArray) {
        var _this = _super.call(this, parent, propName, defaultValue, isArray) || this;
        /** @private */
        _this.visibleLabels = [];
        /** @private */
        _this.series = [];
        /** @private */
        _this.rect = new Rect(undefined, undefined, 0, 0);
        /** @private */
        _this.axisBottomLine = null;
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        /** @private */
        _this.angle = _this.labelRotation;
        /** @private */
        _this.isStack100 = false;
        /** @private */
        _this.crossAt = null;
        /** @private */
        _this.updatedRect = null;
        /** @private */
        _this.multiLevelLabelHeight = 0;
        /** @private */
        _this.isChart = true;
        /** @private */
        _this.isIntervalInDecimal = true;
        /** @private */
        _this.titleCollection = [];
        /** @private */
        _this.titleSize = new Size(0, 0);
        /**
         * @private
         * Task: BLAZ-2044
         * This property used to hide the axis when series hide from legend click
         */
        _this.internalVisibility = true;
        return _this;
    }
    /**
     * The function used to find tick size.
     * @return {number}
     * @private
     */
    Axis.prototype.findTickSize = function (crossAxis) {
        if (this.tickPosition === 'Inside') {
            return 0;
        }
        if (crossAxis && (!crossAxis.visibleRange || this.isInside(crossAxis.visibleRange))) {
            return 0;
        }
        return this.majorTickLines.height;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.isInside = function (range) {
        return (inside(this.crossAt, range) ||
            (!this.opposedPosition && this.crossAt >= range.max) || (this.opposedPosition && this.crossAt <= range.min));
    };
    /**
     * The function used to find label Size.
     * @return {number}
     * @private
     */
    Axis.prototype.findLabelSize = function (crossAxis, innerPadding) {
        var titleSize = 0;
        var isHorizontal = this.orientation === 'Horizontal';
        if (this.title) {
            this.titleSize = measureText(this.title, this.titleStyle);
            titleSize = this.titleSize.height + innerPadding;
            if (this.rect.width || this.rect.height) {
                var length_1 = isHorizontal ? this.rect.width : this.rect.height;
                this.titleCollection = getTitle(this.title, this.titleStyle, length_1);
                titleSize = (titleSize * this.titleCollection.length);
            }
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        var diff;
        var value;
        var labelSize = titleSize + innerPadding + axisPadding + this.labelPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height) + this.multiLevelLabelHeight;
        if (crossAxis && this.placeNextToAxisLine) {
            var range = crossAxis.visibleRange;
            var size = (crossAxis.orientation === 'Horizontal') ? crossAxis.rect.width : crossAxis.rect.height;
            if (!range || !size) {
                return 0;
            }
            else if (this.isInside(range)) {
                value = this.findDifference(crossAxis);
                diff = (value) * (size / range.delta);
                diff = (value) * ((size - (diff < labelSize ? (labelSize - diff) : 0)) / range.delta);
                labelSize = (diff < labelSize) ? (labelSize - diff) : 0;
            }
        }
        return labelSize;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.updateCrossValue = function (chart) {
        var value = this.crossAt;
        if (value === null || !this.isInside(this.crossInAxis.visibleRange)) {
            this.updatedRect = this.rect;
            return null;
        }
        var range = this.crossInAxis.visibleRange;
        if (!this.opposedPosition) {
            if (this.crossAt > range.max) {
                value = range.max;
            }
        }
        else {
            if (this.crossAt < range.min) {
                value = range.min;
            }
        }
        this.updatedRect = extend({}, this.rect, null, true);
        if (this.orientation === 'Horizontal') {
            value = this.crossInAxis.rect.height - (valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.height);
            this.updatedRect.y = this.crossInAxis.rect.y + value;
        }
        else {
            value = valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.width;
            this.updatedRect.x = this.crossInAxis.rect.x + value;
        }
    };
    Axis.prototype.findDifference = function (crossAxis) {
        var value = 0;
        if (this.opposedPosition) {
            value = crossAxis.isInversed ? crossAxis.visibleRange.min : crossAxis.visibleRange.max;
        }
        else {
            value = crossAxis.isInversed ? crossAxis.visibleRange.max : crossAxis.visibleRange.min;
        }
        return Math.abs(this.crossAt - value);
    };
    /**
     * Calculate visible range for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateVisibleRangeOnZooming = function (chart) {
        if (isZoomSet(this)) {
            var baseRange = this.actualRange;
            var start = void 0;
            var end = void 0;
            if (!this.isInversed || chart.zoomModule) {
                start = this.actualRange.min + this.zoomPosition * this.actualRange.delta;
                end = start + this.zoomFactor * this.actualRange.delta;
            }
            else {
                start = this.actualRange.max - (this.zoomPosition * this.actualRange.delta);
                end = start - (this.zoomFactor * this.actualRange.delta);
            }
            if (start < baseRange.min) {
                end = end + (baseRange.min - start);
                start = baseRange.min;
            }
            if (end > baseRange.max) {
                start = start - (end - baseRange.max);
                end = baseRange.max;
            }
            this.doubleRange = new DoubleRange(start, end);
            this.visibleRange = { min: this.doubleRange.start, max: this.doubleRange.end,
                delta: this.doubleRange.delta, interval: this.visibleRange.interval };
        }
    };
    /**
     * Calculate range for x and y axis after zoom.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateAxisRange = function (size, chart) {
        if (chart.enableAutoIntervalOnBothAxis) {
            if (this.orientation === 'Horizontal' && chart.zoomSettings.mode === 'X') {
                for (var i = 0; i < this.series.length; i++) {
                    var yValue = [];
                    for (var _i = 0, _a = this.series[i].visiblePoints; _i < _a.length; _i++) {
                        var points = _a[_i];
                        if ((points.xValue > this.visibleRange.min) && (points.xValue < this.visibleRange.max)) {
                            yValue.push(points.yValue);
                        }
                    }
                    for (var _b = 0, _c = chart.axisCollections; _b < _c.length; _b++) {
                        var axis = _c[_b];
                        if (axis.orientation === 'Vertical' && !isNullOrUndefined(axis.series[i])) {
                            axis.series[i].yMin = Math.min.apply(Math, yValue);
                            axis.series[i].yMax = Math.max.apply(Math, yValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
            if (this.orientation === 'Vertical' && chart.zoomSettings.mode === 'Y') {
                for (var i = 0; i < this.series.length; i++) {
                    var xValue = [];
                    for (var _d = 0, _e = this.series[i].visiblePoints; _d < _e.length; _d++) {
                        var points = _e[_d];
                        if ((points.yValue > this.visibleRange.min) && (points.yValue < this.visibleRange.max)) {
                            xValue.push(points.xValue);
                        }
                    }
                    for (var _f = 0, _g = chart.axisCollections; _f < _g.length; _f++) {
                        var axis = _g[_f];
                        if (axis.orientation === 'Horizontal' && !isNullOrUndefined(axis.series[i])) {
                            axis.series[i].xMin = Math.min.apply(Math, xValue);
                            axis.series[i].xMax = Math.max.apply(Math, xValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
        }
    };
    /**
     * Triggers the event.
     * @return {void}
     * @private
     */
    Axis.prototype.triggerRangeRender = function (chart, minimum, maximum, interval) {
        var argsData;
        argsData = {
            cancel: false, name: axisRangeCalculated, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange = { min: argsData.minimum, max: argsData.maximum, interval: argsData.interval,
                delta: argsData.maximum - argsData.minimum };
        }
    };
    /**
     * Calculate padding for the axis.
     * @return {string}
     * @private
     */
    Axis.prototype.getRangePadding = function (chart) {
        var padding = this.rangePadding;
        if (padding !== 'Auto') {
            return padding;
        }
        switch (this.orientation) {
            case 'Horizontal':
                if (chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
            case 'Vertical':
                if (!chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
        }
        return padding;
    };
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    Axis.prototype.getMaxLabelWidth = function (chart) {
        var pointX;
        var previousEnd = 0;
        var isIntersect = false;
        var isAxisLabelBreak;
        this.angle = this.labelRotation;
        this.maxLabelSize = new Size(0, 0);
        var action = this.labelIntersectAction;
        var label;
        for (var i = 0, len = this.visibleLabels.length; i < len; i++) {
            label = this.visibleLabels[i];
            isAxisLabelBreak = isBreakLabel(label.originalText);
            if (isAxisLabelBreak) {
                label.size = measureText(label.originalText.replace(/<br>/g, ' '), this.labelStyle);
                label.breakLabelSize = measureText(this.enableTrim ? label.text.join('<br>') : label.originalText, this.labelStyle);
            }
            else {
                label.size = measureText(label.text, this.labelStyle);
            }
            var width = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
            if (width > this.maxLabelSize.width) {
                this.maxLabelSize.width = width;
                this.rotatedLabel = label.text;
            }
            var height = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
            if (height > this.maxLabelSize.height) {
                this.maxLabelSize.height = height;
            }
            if (isAxisLabelBreak) {
                label.text = this.enableTrim ? label.text : label.originalText.split('<br>');
            }
            if (action === 'None' || action === 'Hide' || action === 'Trim') {
                continue;
            }
            if ((action !== 'None' || this.angle % 360 === 0) && this.orientation === 'Horizontal' &&
                this.rect.width > 0 && !isIntersect) {
                var width1 = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
                var height1 = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
                pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
                pointX -= width1 / 2;
                if (this.edgeLabelPlacement === 'Shift') {
                    if (i === 0 && pointX < this.rect.x) {
                        pointX = this.rect.x;
                    }
                    if (i === this.visibleLabels.length - 1 && ((pointX + width1) > (this.rect.x + this.rect.width))) {
                        pointX = this.rect.x + this.rect.width - width1;
                    }
                }
                switch (action) {
                    case 'MultipleRows':
                        if (i > 0) {
                            this.findMultiRows(i, pointX, label, isAxisLabelBreak);
                        }
                        break;
                    case 'Rotate45':
                    case 'Rotate90':
                        if (i > 0 && (!this.isInversed ? pointX <= previousEnd : pointX + width1 >= previousEnd)) {
                            this.angle = (action === 'Rotate45') ? 45 : 90;
                            isIntersect = true;
                        }
                        break;
                    default:
                        if (isAxisLabelBreak) {
                            var result = void 0;
                            var result1 = [];
                            var str = void 0;
                            for (var index = 0; index < label.text.length; index++) {
                                result = textWrap(label.text[index], this.rect.width / this.visibleLabels.length, this.labelStyle);
                                if (result.length > 1) {
                                    for (var j = 0; j < result.length; j++) {
                                        str = result[j];
                                        result1.push(str);
                                    }
                                }
                                else {
                                    result1.push(result[0]);
                                }
                            }
                            label.text = result1;
                        }
                        else {
                            label.text = textWrap(label.text, this.rect.width / this.visibleLabels.length, this.labelStyle);
                        }
                        var height_1 = (height1 * label.text.length);
                        if (height_1 > this.maxLabelSize.height) {
                            this.maxLabelSize.height = height_1;
                        }
                        break;
                }
                previousEnd = this.isInversed ? pointX : pointX + width1;
            }
        }
        if (this.angle !== 0 && this.orientation === 'Horizontal') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            if (isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = measureText(this.rotatedLabel, this.labelStyle);
            }
            else {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
            }
        }
        if (chart.multiLevelLabelModule && this.multiLevelLabels.length > 0) {
            chart.multiLevelLabelModule.getMultilevelLabelsHeight(this);
        }
    };
    /**
     * Finds the multiple rows for axis.
     * @return {void}
     */
    Axis.prototype.findMultiRows = function (length, currentX, currentLabel, isBreakLabels) {
        var label;
        var pointX;
        var width2;
        var store = [];
        var isMultiRows;
        for (var i = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i];
            width2 = isBreakLabels ? label.breakLabelSize.width : label.size.width;
            pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
            isMultiRows = !this.isInversed ? currentX < (pointX + width2 * 0.5) :
                currentX + currentLabel.size.width > (pointX - width2 * 0.5);
            if (isMultiRows) {
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            }
            else {
                currentLabel.index = store.indexOf(label.index) > -1 ? currentLabel.index : label.index;
            }
        }
        var height = ((isBreakLabels ? currentLabel.breakLabelSize.height : currentLabel.size.height) * currentLabel.index) +
            (5 * (currentLabel.index - 1));
        if (height > this.maxLabelSize.height) {
            this.maxLabelSize.height = height;
        }
    };
    /**
     * Finds the default module for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.getModule = function (chart) {
        if (this.valueType === 'Double') {
            this.baseModule = new Double(chart);
        }
        else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + 'Module'];
        }
    };
    __decorate([
        Complex(Theme.axisLabelFont, Font)
    ], Axis.prototype, "labelStyle", void 0);
    __decorate([
        Complex({}, CrosshairTooltip)
    ], Axis.prototype, "crosshairTooltip", void 0);
    __decorate([
        Property('')
    ], Axis.prototype, "title", void 0);
    __decorate([
        Complex(Theme.axisTitleFont, Font)
    ], Axis.prototype, "titleStyle", void 0);
    __decorate([
        Property('')
    ], Axis.prototype, "labelFormat", void 0);
    __decorate([
        Property('')
    ], Axis.prototype, "skeleton", void 0);
    __decorate([
        Property('DateTime')
    ], Axis.prototype, "skeletonType", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "plotOffset", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "plotOffsetLeft", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "plotOffsetTop", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "plotOffsetRight", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "plotOffsetBottom", void 0);
    __decorate([
        Property(false)
    ], Axis.prototype, "isIndexed", void 0);
    __decorate([
        Property(10)
    ], Axis.prototype, "logBase", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "columnIndex", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "rowIndex", void 0);
    __decorate([
        Property(1)
    ], Axis.prototype, "span", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "desiredIntervals", void 0);
    __decorate([
        Property(3)
    ], Axis.prototype, "maximumLabels", void 0);
    __decorate([
        Property(1)
    ], Axis.prototype, "zoomFactor", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "zoomPosition", void 0);
    __decorate([
        Property(true)
    ], Axis.prototype, "enableScrollbarOnZooming", void 0);
    __decorate([
        Property(false)
    ], Axis.prototype, "opposedPosition", void 0);
    __decorate([
        Property(true)
    ], Axis.prototype, "enableAutoIntervalOnZooming", void 0);
    __decorate([
        Property('Auto')
    ], Axis.prototype, "rangePadding", void 0);
    __decorate([
        Property('Double')
    ], Axis.prototype, "valueType", void 0);
    __decorate([
        Property('None')
    ], Axis.prototype, "edgeLabelPlacement", void 0);
    __decorate([
        Property('Auto')
    ], Axis.prototype, "intervalType", void 0);
    __decorate([
        Property('BetweenTicks')
    ], Axis.prototype, "labelPlacement", void 0);
    __decorate([
        Property('Outside')
    ], Axis.prototype, "tickPosition", void 0);
    __decorate([
        Property('Outside')
    ], Axis.prototype, "labelPosition", void 0);
    __decorate([
        Property('')
    ], Axis.prototype, "name", void 0);
    __decorate([
        Property(true)
    ], Axis.prototype, "visible", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "minorTicksPerInterval", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "labelRotation", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "crossesAt", void 0);
    __decorate([
        Property(true)
    ], Axis.prototype, "placeNextToAxisLine", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "crossesInAxis", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "minimum", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "maximum", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "interval", void 0);
    __decorate([
        Property(34)
    ], Axis.prototype, "maximumLabelWidth", void 0);
    __decorate([
        Property(false)
    ], Axis.prototype, "enableTrim", void 0);
    __decorate([
        Property(5)
    ], Axis.prototype, "labelPadding", void 0);
    __decorate([
        Complex({}, MajorTickLines)
    ], Axis.prototype, "majorTickLines", void 0);
    __decorate([
        Complex({}, MinorTickLines)
    ], Axis.prototype, "minorTickLines", void 0);
    __decorate([
        Complex({}, MajorGridLines)
    ], Axis.prototype, "majorGridLines", void 0);
    __decorate([
        Complex({}, MinorGridLines)
    ], Axis.prototype, "minorGridLines", void 0);
    __decorate([
        Complex({}, AxisLine)
    ], Axis.prototype, "lineStyle", void 0);
    __decorate([
        Property('Trim')
    ], Axis.prototype, "labelIntersectAction", void 0);
    __decorate([
        Property(false)
    ], Axis.prototype, "isInversed", void 0);
    __decorate([
        Property(100)
    ], Axis.prototype, "coefficient", void 0);
    __decorate([
        Property(0)
    ], Axis.prototype, "startAngle", void 0);
    __decorate([
        Property(true)
    ], Axis.prototype, "startFromZero", void 0);
    __decorate([
        Property(null)
    ], Axis.prototype, "description", void 0);
    __decorate([
        Property(2)
    ], Axis.prototype, "tabIndex", void 0);
    __decorate([
        Collection([], StripLineSettings)
    ], Axis.prototype, "stripLines", void 0);
    __decorate([
        Collection([], MultiLevelLabels)
    ], Axis.prototype, "multiLevelLabels", void 0);
    __decorate([
        Complex({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    ], Axis.prototype, "border", void 0);
    __decorate([
        Complex({}, ScrollbarSettings)
    ], Axis.prototype, "scrollbarSettings", void 0);
    return Axis;
}(ChildProperty));
export { Axis };
/** @private */
var VisibleLabels = /** @class */ (function () {
    function VisibleLabels(text, value, labelStyle, originalText, size, breakLabelSize, index) {
        if (size === void 0) { size = new Size(0, 0); }
        if (breakLabelSize === void 0) { breakLabelSize = new Size(0, 0); }
        if (index === void 0) { index = 1; }
        this.text = text;
        this.originalText = originalText;
        this.value = value;
        this.labelStyle = labelStyle;
        this.size = size;
        this.breakLabelSize = breakLabelSize;
        this.index = 1;
    }
    return VisibleLabels;
}());
export { VisibleLabels };
