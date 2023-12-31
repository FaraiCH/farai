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
import { Property, ChildProperty, Complex, Collection, getValue } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { StackValues, RectOption, appendChildElement, appendClipElement } from '../../common/utils/helper';
import { firstToLowerCase, CircleOption } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Border, Font, Margin, Animation, EmptyPointSettings, CornerRadius, Connector, DragSettings } from '../../common/model/base';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';
import { Offset } from '../../common/model/base';
import { seriesRender } from '../../common/model/constants';
import { sort, getVisiblePoints, setRange } from '../../common/utils/helper';
import { Browser } from '@syncfusion/ej2-base';
/**
 * Configures the data label in the series.
 */
var DataLabelSettings = /** @class */ (function (_super) {
    __extends(DataLabelSettings, _super);
    function DataLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], DataLabelSettings.prototype, "visible", void 0);
    __decorate([
        Property(true)
    ], DataLabelSettings.prototype, "showZero", void 0);
    __decorate([
        Property(null)
    ], DataLabelSettings.prototype, "name", void 0);
    __decorate([
        Property('transparent')
    ], DataLabelSettings.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], DataLabelSettings.prototype, "opacity", void 0);
    __decorate([
        Property(0)
    ], DataLabelSettings.prototype, "angle", void 0);
    __decorate([
        Property(false)
    ], DataLabelSettings.prototype, "enableRotation", void 0);
    __decorate([
        Property('Auto')
    ], DataLabelSettings.prototype, "position", void 0);
    __decorate([
        Property(5)
    ], DataLabelSettings.prototype, "rx", void 0);
    __decorate([
        Property(5)
    ], DataLabelSettings.prototype, "ry", void 0);
    __decorate([
        Property('Center')
    ], DataLabelSettings.prototype, "alignment", void 0);
    __decorate([
        Complex({ width: null, color: null }, Border)
    ], DataLabelSettings.prototype, "border", void 0);
    __decorate([
        Complex({ left: 5, right: 5, top: 5, bottom: 5 }, Margin)
    ], DataLabelSettings.prototype, "margin", void 0);
    __decorate([
        Complex({ size: '11px', color: '', fontStyle: 'Normal', fontWeight: 'Normal', fontFamily: 'Segoe UI' }, Font)
    ], DataLabelSettings.prototype, "font", void 0);
    __decorate([
        Property(null)
    ], DataLabelSettings.prototype, "template", void 0);
    __decorate([
        Property('Hide')
    ], DataLabelSettings.prototype, "labelIntersectAction", void 0);
    return DataLabelSettings;
}(ChildProperty));
export { DataLabelSettings };
/**
 *  Configures the marker in the series.
 */
var MarkerSettings = /** @class */ (function (_super) {
    __extends(MarkerSettings, _super);
    function MarkerSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], MarkerSettings.prototype, "visible", void 0);
    __decorate([
        Property('Circle')
    ], MarkerSettings.prototype, "shape", void 0);
    __decorate([
        Property('')
    ], MarkerSettings.prototype, "imageUrl", void 0);
    __decorate([
        Property(5)
    ], MarkerSettings.prototype, "height", void 0);
    __decorate([
        Property(5)
    ], MarkerSettings.prototype, "width", void 0);
    __decorate([
        Complex({ width: 2, color: null }, Border)
    ], MarkerSettings.prototype, "border", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, Offset)
    ], MarkerSettings.prototype, "offset", void 0);
    __decorate([
        Property(null)
    ], MarkerSettings.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], MarkerSettings.prototype, "opacity", void 0);
    __decorate([
        Complex({}, DataLabelSettings)
    ], MarkerSettings.prototype, "dataLabel", void 0);
    return MarkerSettings;
}(ChildProperty));
export { MarkerSettings };
/**
 * Points model for the series.
 * @public
 */
var Points = /** @class */ (function () {
    function Points() {
        /** point symbol location */
        this.symbolLocations = null;
        /** point region */
        this.regions = null;
        /** point percentage value */
        this.percentage = null;
        /** point region data */
        this.regionData = null;
        /** To know the point is selected */
        this.isSelect = false;
        /** point marker */
        this.marker = {
            visible: false
        };
        /**
         * To identify point y value with in the range.
         * @private
         */
        this.isPointInRange = true;
    }
    return Points;
}());
export { Points };
/**
 * Defines the behavior of the Trendlines
 */
var Trendline = /** @class */ (function (_super) {
    __extends(Trendline, _super);
    function Trendline() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.clipRect = new Rect(0, 0, 0, 0);
        return _this;
    }
    /** @private */
    Trendline.prototype.setDataSource = function (series, chart) {
        if (series) {
            this.points = series.points;
        }
        var type = firstToLowerCase(this.type);
        chart.trendLineModule.initDataSource(this, chart);
        chart.visibleSeriesCount++;
    };
    __decorate([
        Property('')
    ], Trendline.prototype, "name", void 0);
    __decorate([
        Property('0')
    ], Trendline.prototype, "dashArray", void 0);
    __decorate([
        Property(true)
    ], Trendline.prototype, "visible", void 0);
    __decorate([
        Property('Linear')
    ], Trendline.prototype, "type", void 0);
    __decorate([
        Property(2)
    ], Trendline.prototype, "period", void 0);
    __decorate([
        Property(2)
    ], Trendline.prototype, "polynomialOrder", void 0);
    __decorate([
        Property(0)
    ], Trendline.prototype, "backwardForecast", void 0);
    __decorate([
        Property(0)
    ], Trendline.prototype, "forwardForecast", void 0);
    __decorate([
        Complex({}, Animation)
    ], Trendline.prototype, "animation", void 0);
    __decorate([
        Complex({}, MarkerSettings)
    ], Trendline.prototype, "marker", void 0);
    __decorate([
        Property(true)
    ], Trendline.prototype, "enableTooltip", void 0);
    __decorate([
        Property(null)
    ], Trendline.prototype, "intercept", void 0);
    __decorate([
        Property('')
    ], Trendline.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], Trendline.prototype, "width", void 0);
    __decorate([
        Property('SeriesType')
    ], Trendline.prototype, "legendShape", void 0);
    return Trendline;
}(ChildProperty));
export { Trendline };
/**
 * Configures Error bar in series.
 */
var ErrorBarCapSettings = /** @class */ (function (_super) {
    __extends(ErrorBarCapSettings, _super);
    function ErrorBarCapSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], ErrorBarCapSettings.prototype, "width", void 0);
    __decorate([
        Property(10)
    ], ErrorBarCapSettings.prototype, "length", void 0);
    __decorate([
        Property(null)
    ], ErrorBarCapSettings.prototype, "color", void 0);
    __decorate([
        Property(1)
    ], ErrorBarCapSettings.prototype, "opacity", void 0);
    return ErrorBarCapSettings;
}(ChildProperty));
export { ErrorBarCapSettings };
var ChartSegment = /** @class */ (function (_super) {
    __extends(ChartSegment, _super);
    function ChartSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], ChartSegment.prototype, "value", void 0);
    __decorate([
        Property(null)
    ], ChartSegment.prototype, "color", void 0);
    __decorate([
        Property('0')
    ], ChartSegment.prototype, "dashArray", void 0);
    return ChartSegment;
}(ChildProperty));
export { ChartSegment };
/**
 * Error bar settings
 * @public
 */
var ErrorBarSettings = /** @class */ (function (_super) {
    __extends(ErrorBarSettings, _super);
    function ErrorBarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], ErrorBarSettings.prototype, "visible", void 0);
    __decorate([
        Property('Fixed')
    ], ErrorBarSettings.prototype, "type", void 0);
    __decorate([
        Property('Both')
    ], ErrorBarSettings.prototype, "direction", void 0);
    __decorate([
        Property('Vertical')
    ], ErrorBarSettings.prototype, "mode", void 0);
    __decorate([
        Property(null)
    ], ErrorBarSettings.prototype, "color", void 0);
    __decorate([
        Property(1)
    ], ErrorBarSettings.prototype, "verticalError", void 0);
    __decorate([
        Property(1)
    ], ErrorBarSettings.prototype, "width", void 0);
    __decorate([
        Property(1)
    ], ErrorBarSettings.prototype, "horizontalError", void 0);
    __decorate([
        Property(3)
    ], ErrorBarSettings.prototype, "verticalPositiveError", void 0);
    __decorate([
        Property(3)
    ], ErrorBarSettings.prototype, "verticalNegativeError", void 0);
    __decorate([
        Property(1)
    ], ErrorBarSettings.prototype, "horizontalPositiveError", void 0);
    __decorate([
        Property(1)
    ], ErrorBarSettings.prototype, "horizontalNegativeError", void 0);
    __decorate([
        Complex(null, ErrorBarCapSettings)
    ], ErrorBarSettings.prototype, "errorBarCap", void 0);
    return ErrorBarSettings;
}(ChildProperty));
export { ErrorBarSettings };
/**
 * Defines the common behavior of Series and Technical Indicators
 */
var SeriesBase = /** @class */ (function (_super) {
    __extends(SeriesBase, _super);
    function SeriesBase() {
        /**
         * The DataSource field that contains the x value.
         * It is applicable for series and technical indicators
         * @default ''
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.currentViewData = [];
        /** @private */
        _this.clipRect = new Rect(0, 0, 0, 0);
        /** @private */
        _this.seriesType = 'XY';
        _this.isRectTypeSeries = false;
        return _this;
    }
    /**
     * Process data for the series.
     * @hidden
     */
    SeriesBase.prototype.processJsonData = function () {
        var i = 0;
        var point = new Points();
        var xName = (this instanceof Series && this.type === 'Histogram') ? 'x' : this.xName;
        var textMappingName = this instanceof Series && this.marker.dataLabel.name ?
            this.marker.dataLabel.name : '';
        if (this instanceof Series) {
            if ((this.type === 'Waterfall' || this.type === 'Histogram')) {
                this.currentViewData = this.chart[firstToLowerCase(this.type) + 'SeriesModule'].
                    processInternalData(extend([], this.currentViewData, null, true), this);
            }
            if (this.category === 'Pareto') {
                this.currentViewData = sort(extend([], this.currentViewData, null, true), [this.yName], true);
                if (this.type === 'Line') {
                    this.currentViewData = this.chart.paretoSeriesModule.performCumulativeCalculation(this.currentViewData, this);
                }
            }
            this.isRectTypeSeries = this.type.indexOf('Column') > -1 || this.type.indexOf('Bar') > -1
                || this.type.indexOf('Histogram') > -1;
        }
        var len = Object.keys(this.currentViewData).length;
        this.points = [];
        this.xMin = Infinity;
        this.xMax = -Infinity;
        this.yMin = Infinity;
        this.yMax = -Infinity;
        this.sizeMax = -Infinity;
        this.getSeriesType();
        if (this.xAxis.valueType === 'Category') {
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                this.pushCategoryData(point, i, point.x);
                this.pushData(point, i);
                this.setEmptyPoint(point, i);
                i++;
            }
        }
        else if (this.xAxis.valueType.indexOf('DateTime') > -1) {
            var option = {
                skeleton: 'full',
                type: 'dateTime'
            };
            var dateParser = this.chart.intl.getDateParser(option);
            var dateFormatter = this.chart.intl.getDateFormat(option);
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                if (!isNullOrUndefined(point.x) && point.x !== '') {
                    point.x = new Date(DataUtil.parse.parseJson({ val: point.x }).val);
                    if (this.xAxis.valueType === 'DateTime') {
                        point.xValue = Date.parse(point.x.toString());
                    }
                    else {
                        this.chart.isBlazor ? this.pushCategoryData(point, i, Date.parse(point.x.toString()).toString()) :
                            this.pushCategoryData(point, i, Date.parse(dateParser(dateFormatter(point.x))).toString());
                    }
                    this.pushData(point, i);
                    this.setEmptyPoint(point, i);
                }
                else {
                    point.visible = false;
                }
                i++;
            }
        }
        else {
            while (i < len) {
                point = this.dataPoint(i, textMappingName, xName);
                point.xValue = point.x;
                this.pushData(point, i);
                this.setEmptyPoint(point, i);
                i++;
            }
        }
        if (this instanceof Series) {
            if (this.type.indexOf('Spline') > -1 || (this.drawType.indexOf('Spline') > -1 && this.chart.chartAreaType === 'PolarRadar')) {
                var isArea = (this.type.indexOf('Area') > -1 || this.drawType.indexOf('Area') > -1);
                this.chart['spline' + (isArea ? 'Area' : '') + 'SeriesModule'].findSplinePoint(this);
            }
        }
    };
    SeriesBase.prototype.pushData = function (point, i) {
        point.index = i;
        point.yValue = point.y;
        // To find the min, max for the axis range.
        this.xMin = Math.min(this.xMin, point.xValue);
        this.xMax = Math.max(this.xMax, point.xValue);
        this.xData.push(point.xValue);
    };
    /** @private */
    SeriesBase.prototype.dataPoint = function (i, textMappingName, xName) {
        var point;
        this.points[i] = new Points();
        point = this.points[i];
        var currentViewData = this.currentViewData;
        var getObjectValueByMappingString = this.enableComplexProperty ? getValue : this.getObjectValue;
        point.x = getObjectValueByMappingString(xName, currentViewData[i]);
        point.high = getObjectValueByMappingString(this.high, currentViewData[i]);
        point.low = getObjectValueByMappingString(this.low, currentViewData[i]);
        point.open = getObjectValueByMappingString(this.open, currentViewData[i]);
        point.close = getObjectValueByMappingString(this.close, currentViewData[i]);
        point.volume = getObjectValueByMappingString(this.volume, currentViewData[i]);
        point.interior = getObjectValueByMappingString(this.pointColorMapping, currentViewData[i]);
        if (this instanceof Series) {
            point.y = getObjectValueByMappingString(this.yName, currentViewData[i]);
            point.size = getObjectValueByMappingString(this.size, currentViewData[i]);
            point.text = getObjectValueByMappingString(textMappingName, currentViewData[i]);
            point.tooltip = getObjectValueByMappingString(this.tooltipMappingName, currentViewData[i]);
        }
        return point;
    };
    SeriesBase.prototype.getObjectValue = function (mappingName, data) {
        return data[mappingName];
    };
    /**
     * To set empty point value based on empty point mode
     * @private
     */
    SeriesBase.prototype.setEmptyPoint = function (point, i) {
        if (!this.findVisibility(point)) {
            point.visible = true;
            return null;
        }
        point.isEmpty = true;
        var mode = this instanceof Series && point.isPointInRange ? this.emptyPointSettings.mode : 'Drop';
        switch (mode) {
            case 'Zero':
                point.visible = true;
                if (this instanceof Series && this.seriesType.indexOf('HighLow') > -1) {
                    point.high = point.low = 0;
                    if (this.seriesType.indexOf('HighLowOpenClose') > -1) {
                        point.open = point.close = 0;
                    }
                }
                else {
                    point.y = point.yValue = this.yData[i] = 0;
                }
                break;
            case 'Average':
                if (this instanceof Series) {
                    if (this.seriesType.indexOf('HighLow') > -1) {
                        point.high = (isNullOrUndefined(point.high) || isNaN(+point.high)) ? this.getAverage(this.high, i) : point.high;
                        point.low = (isNullOrUndefined(point.low) || isNaN(+point.low)) ? this.getAverage(this.low, i) : point.low;
                        if (this.seriesType.indexOf('HighLowOpenClose') > -1) {
                            point.open = (isNullOrUndefined(point.open) || isNaN(+point.open)) ? this.getAverage(this.open, i) : point.open;
                            point.close = (isNullOrUndefined(point.close) || isNaN(+point.close)) ? this.getAverage(this.close, i) :
                                point.close;
                        }
                    }
                    else {
                        point.y = point.yValue = this.yData[i] = this.getAverage(this.yName, i);
                    }
                }
                point.visible = true;
                break;
            case 'Drop':
            case 'Gap':
                this.yData[i] = null;
                point.visible = false;
                break;
        }
    };
    SeriesBase.prototype.findVisibility = function (point) {
        var type = this instanceof Series ? this.seriesType : 'HighLowOpenClose';
        var yValues;
        var yAxisMin = this.yAxis.minimum;
        var yAxisMax = this.yAxis.maximum;
        switch (type) {
            case 'XY':
                if (this.chart.chartAreaType === 'PolarRadar' && ((!isNullOrUndefined(yAxisMin) && point.yValue < yAxisMin) ||
                    (!isNullOrUndefined(yAxisMax) && point.yValue > yAxisMax))) {
                    point.isPointInRange = false;
                    return true;
                }
                this.setXYMinMax(point.yValue);
                this.yData.push(point.yValue);
                if (this instanceof Series && this.type === 'Bubble') {
                    this.sizeMax = Math.max(this.sizeMax, (isNullOrUndefined(point.size) || isNaN(+point.size)) ? this.sizeMax
                        : point.size);
                }
                return isNullOrUndefined(point.x) || (isNullOrUndefined(point.y) || isNaN(+point.y));
            case 'HighLow':
                this.setHiloMinMax(point.high, point.low);
                return isNullOrUndefined(point.x) || (isNullOrUndefined(point.low) || isNaN(+point.low)) ||
                    (isNullOrUndefined(point.high) || isNaN(+point.high));
            case 'HighLowOpenClose':
                this.setHiloMinMax(point.high, point.low);
                return isNullOrUndefined(point.x) || (isNullOrUndefined(point.low) || isNaN(+point.low)) ||
                    (isNullOrUndefined(point.open) || isNaN(+point.open)) || (isNullOrUndefined(point.close) || isNaN(+point.close))
                    || (isNullOrUndefined(point.high) || isNaN(+point.high));
            case 'BoxPlot':
                yValues = (point.y || [null]).filter(function (value) {
                    return !isNullOrUndefined(value) && !isNaN(value);
                }).sort(function (a, b) {
                    return a - b;
                });
                point.y = yValues;
                this.yMin = Math.min(this.yMin, Math.min.apply(Math, yValues));
                this.yMax = Math.max(this.yMax, Math.max.apply(Math, yValues));
                return !yValues.length;
        }
    };
    /**
     * To get Y min max for the provided point seriesType XY
     */
    SeriesBase.prototype.setXYMinMax = function (yValue) {
        var isLogAxis = (this.yAxis.valueType === 'Logarithmic' || this.xAxis.valueType === 'Logarithmic');
        var isNegativeValue = yValue < 0;
        var seriesMinY;
        if (this.isRectTypeSeries && !setRange(this.yAxis)) {
            seriesMinY = ((isLogAxis ? 1 : isNegativeValue ? yValue : 0));
        }
        else {
            seriesMinY = yValue;
        }
        this.yMin = isLogAxis ?
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY) || (seriesMinY === 0)) ? this.yMin : seriesMinY) :
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY)) ? this.yMin : seriesMinY);
        this.yMax = Math.max(this.yMax, (isNullOrUndefined(yValue) || isNaN(yValue)) ? this.yMax : yValue);
    };
    /**
     * To get Y min max for the provided point seriesType XY
     */
    SeriesBase.prototype.setHiloMinMax = function (high, low) {
        this.yMin = Math.min(this.yMin, Math.min((isNullOrUndefined(low) || isNaN(low)) ? this.yMin : low, (isNullOrUndefined(high) || isNaN(high)) ? this.yMin : high));
        this.yMax = Math.max(this.yMax, Math.max((isNullOrUndefined(low) || isNaN(low)) ? this.yMax : low, (isNullOrUndefined(high) || isNaN(high)) ? this.yMax : high));
    };
    /**
     * Finds the type of the series
     * @private
     */
    SeriesBase.prototype.getSeriesType = function () {
        var type;
        if (this instanceof Series) {
            var seriesType = this.chart.chartAreaType === 'PolarRadar' ? this.drawType : this.type;
            if (seriesType) {
                switch (seriesType) {
                    case 'RangeColumn':
                    case 'RangeArea':
                    case 'Hilo':
                        type = 'HighLow';
                        break;
                    case 'HiloOpenClose':
                    case 'Candle':
                        type = 'HighLowOpenClose';
                        break;
                    case 'BoxAndWhisker':
                        type = 'BoxPlot';
                        break;
                    default:
                        type = 'XY';
                }
            }
        }
        this.seriesType = type;
    };
    /** @private */
    SeriesBase.prototype.pushCategoryData = function (point, index, pointX) {
        if (!this.chart.tooltip.shared) {
            if (!this.visible) {
                return null;
            }
        }
        if (!this.xAxis.isIndexed) {
            if (this.xAxis.labels.indexOf(pointX) < 0) {
                this.xAxis.labels.push(pointX);
            }
            point.xValue = this.xAxis.labels.indexOf(pointX);
        }
        else {
            this.xAxis.labels[index] ? this.xAxis.labels[index] += ', ' + pointX :
                this.xAxis.labels.push(pointX);
            point.xValue = index;
        }
    };
    /**
     * To find average of given property
     */
    SeriesBase.prototype.getAverage = function (member, i, data) {
        if (data === void 0) { data = this.currentViewData; }
        var previous = data[i - 1] ? (data[i - 1][member] || 0) : 0;
        var next = data[i + 1] ? (data[i + 1][member] || 0) : 0;
        return (previous + next) / 2;
    };
    /**
     * To find the control points for spline.
     * @return {void}
     * @private
     */
    SeriesBase.prototype.refreshDataManager = function (chart) {
        var _this = this;
        this.chart = chart;
        var dateSource = this.dataSource || chart.dataSource;
        if (!(dateSource instanceof DataManager) && isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dateSource, count: dateSource.length }, false);
            return;
        }
        var dataManager = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e); });
    };
    SeriesBase.prototype.dataManagerSuccess = function (e, isRemoteData) {
        if (isRemoteData === void 0) { isRemoteData = true; }
        this.currentViewData = e.count ? e.result : [];
        this.chart.allowServerDataBinding = false;
        if (this instanceof Series) {
            if (this.chart.stockChart) {
                this.chart.stockChart.series[this.index].localData = this.currentViewData;
            }
            var argsData = {
                name: seriesRender, series: this, data: this.currentViewData, fill: this.interior
            };
            this.chart.trigger(seriesRender, argsData);
            this.interior = argsData.fill;
            this.currentViewData = argsData.data;
        }
        if (this.chart.stockChart && !(this instanceof Series)) {
            this.currentViewData = this.chart.stockChart.findCurrentData(this.chart.stockChart.series[0].localData, this.chart.stockChart.series[0].xName);
        }
        this.processJsonData();
        this.recordsCount = e.count;
        this.refreshChart(isRemoteData);
        this.currentViewData = null;
    };
    SeriesBase.prototype.refreshChart = function (isRemoteData) {
        var chart = this.chart;
        if (this instanceof Series) {
            chart.visibleSeriesCount += isRemoteData ? 1 : 0;
        }
        chart.refreshTechnicalIndicator(this);
        if (this instanceof Series && this.category !== 'TrendLine') {
            for (var _i = 0, _a = this.trendlines; _i < _a.length; _i++) {
                var trendline = _a[_i];
                trendline.setDataSource(this, chart);
            }
        }
        //if (chart.visibleSeries.length === (chart.visibleSeriesCount - chart.indicators.length)) {
        if (chart.visibleSeries.length === (chart.visibleSeriesCount)) {
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart.isBlazor ? {} : chart });
            if (this.chart.stockChart && this.chart.stockChart.initialRender) {
                this.chart.stockChart.initialRender = false;
                this.chart.stockChart.stockChartDataManagerSuccess();
            }
        }
        if (this instanceof Series) {
            chart.visibleSeriesCount += isRemoteData ? 0 : 1;
        }
    };
    __decorate([
        Property('')
    ], SeriesBase.prototype, "xName", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "high", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "low", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "open", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "close", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "volume", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "pointColorMapping", void 0);
    __decorate([
        Property(true)
    ], SeriesBase.prototype, "visible", void 0);
    __decorate([
        Property(null)
    ], SeriesBase.prototype, "xAxisName", void 0);
    __decorate([
        Property(null)
    ], SeriesBase.prototype, "yAxisName", void 0);
    __decorate([
        Complex(null, Animation)
    ], SeriesBase.prototype, "animation", void 0);
    __decorate([
        Property(null)
    ], SeriesBase.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], SeriesBase.prototype, "width", void 0);
    __decorate([
        Property('0')
    ], SeriesBase.prototype, "dashArray", void 0);
    __decorate([
        Property('')
    ], SeriesBase.prototype, "dataSource", void 0);
    __decorate([
        Property()
    ], SeriesBase.prototype, "query", void 0);
    __decorate([
        Collection([], ChartSegment)
    ], SeriesBase.prototype, "segments", void 0);
    __decorate([
        Property('X')
    ], SeriesBase.prototype, "segmentAxis", void 0);
    __decorate([
        Property(false)
    ], SeriesBase.prototype, "enableComplexProperty", void 0);
    return SeriesBase;
}(ChildProperty));
export { SeriesBase };
/**
 * Configures the series in charts.
 * @public
 */
var Series = /** @class */ (function (_super) {
    __extends(Series, _super);
    // tslint:disable-next-line:no-any
    function Series(parent, propName, defaultValue, isArray) {
        var _this = _super.call(this, parent, propName, defaultValue, isArray) || this;
        _this.visibleSeriesCount = 0;
        /** @private */
        _this.category = 'Series';
        /** @private */
        _this.isRectSeries = false;
        /** @private */
        _this.drawPoints = [];
        /** @private */
        _this.delayedAnimation = false;
        return _this;
    }
    /**
     * Refresh the axis label.
     * @return {boolean}
     * @private
     */
    Series.prototype.refreshAxisLabel = function () {
        if (this.xAxis.valueType !== 'Category') {
            return null;
        }
        this.xAxis.labels = [];
        for (var _i = 0, _a = this.xAxis.series; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.visible && item.category !== 'TrendLine') {
                item.xMin = Infinity;
                item.xMax = -Infinity;
                for (var _b = 0, _c = item.points; _b < _c.length; _b++) {
                    var point = _c[_b];
                    item.pushCategoryData(point, point.index, point.x);
                    item.xMin = Math.min(item.xMin, point.xValue);
                    item.xMax = Math.max(item.xMax, point.xValue);
                }
            }
        }
    };
    /**
     * To get the series collection.
     * @return {void}
     * @private
     */
    Series.prototype.findSeriesCollection = function (column, row, isStack) {
        var seriesCollection = [];
        for (var _i = 0, _a = row.axes; _i < _a.length; _i++) {
            var rowAxis = _a[_i];
            for (var _b = 0, _c = rowAxis.series; _b < _c.length; _b++) {
                var rowSeries = _c[_b];
                for (var _d = 0, _e = column.axes; _d < _e.length; _d++) {
                    var axis = _e[_d];
                    for (var _f = 0, _g = axis.series; _f < _g.length; _f++) {
                        var series = _g[_f];
                        if (series === rowSeries && series.visible && this.rectSeriesInChart(series, isStack)) {
                            seriesCollection.push(series);
                        }
                    }
                }
            }
        }
        return seriesCollection;
    };
    /**
     * To get the column type series.
     * @return {void}
     * @private
     */
    Series.prototype.rectSeriesInChart = function (series, isStack) {
        var type = (series.type).toLowerCase();
        return (type.indexOf('column') !== -1 || type.indexOf('bar') !== -1 || type.indexOf('histogram') !== -1 ||
            type.indexOf('hiloopenclose') !== -1 || type.indexOf('candle') !== -1 || type.indexOf('pareto') !== -1 ||
            type.indexOf('hilo') !== -1 || series.drawType.indexOf('Column') !== -1 ||
            type.indexOf('waterfall') !== -1 || type.indexOf('boxandwhisker') !== -1 || isStack);
    };
    /**
     * To calculate the stacked values.
     * @return {void}
     * @private
     */
    Series.prototype.calculateStackedValue = function (isStacking100, chart) {
        var axisSeries;
        for (var _i = 0, _a = chart.columns; _i < _a.length; _i++) {
            var columnItem = _a[_i];
            for (var _b = 0, _c = chart.rows; _b < _c.length; _b++) {
                var item = _c[_b];
                this.calculateStackingValues(this.findSeriesCollection(columnItem, item, true), isStacking100);
            }
        }
    };
    Series.prototype.calculateStackingValues = function (seriesCollection, isStacking100) {
        var startValues;
        var endValues;
        var yValues = [];
        var lastPositive = [];
        var lastNegative = [];
        var stackingGroup;
        var lastValue;
        var value;
        var frequencies = [];
        if (isStacking100) {
            frequencies = this.findFrequencies(seriesCollection);
        }
        var stackingSeies = [];
        var stackedValues = [];
        var visiblePoints = [];
        for (var _i = 0, seriesCollection_1 = seriesCollection; _i < seriesCollection_1.length; _i++) {
            var series = seriesCollection_1[_i];
            if (series.type.indexOf('Stacking') !== -1 || (series.drawType.indexOf('Stacking') !== -1 &&
                (series.chart.chartAreaType === 'PolarRadar'))) {
                stackingGroup = (series.type.indexOf('StackingArea') !== -1) ? 'StackingArea100' :
                    (series.type.indexOf('StackingLine') !== -1) ? 'StackingLine100' : series.stackingGroup;
                if (!lastPositive[stackingGroup]) {
                    lastPositive[stackingGroup] = [];
                    lastNegative[stackingGroup] = [];
                }
                yValues = series.yData;
                startValues = [];
                endValues = [];
                stackingSeies.push(series);
                visiblePoints = getVisiblePoints(series);
                for (var j = 0, pointsLength = visiblePoints.length; j < pointsLength; j++) {
                    lastValue = 0;
                    value = +yValues[j]; // Fix for chart not rendering while y value is given as string issue
                    if (lastPositive[stackingGroup][visiblePoints[j].xValue] === undefined) {
                        lastPositive[stackingGroup][visiblePoints[j].xValue] = 0;
                    }
                    if (lastNegative[stackingGroup][visiblePoints[j].xValue] === undefined) {
                        lastNegative[stackingGroup][visiblePoints[j].xValue] = 0;
                    }
                    if (isStacking100) {
                        value = value / frequencies[stackingGroup][visiblePoints[j].xValue] * 100;
                        value = !isNaN(value) ? value : 0;
                        visiblePoints[j].percentage = +(value.toFixed(2));
                    }
                    else {
                        stackedValues[j] = stackedValues[j] ? stackedValues[j] + Math.abs(value) : Math.abs(value);
                    }
                    if (value >= 0) {
                        lastValue = lastPositive[stackingGroup][visiblePoints[j].xValue];
                        lastPositive[stackingGroup][visiblePoints[j].xValue] += value;
                    }
                    else {
                        lastValue = lastNegative[stackingGroup][visiblePoints[j].xValue];
                        lastNegative[stackingGroup][visiblePoints[j].xValue] += value;
                    }
                    startValues.push(lastValue);
                    endValues.push(value + lastValue);
                    if (isStacking100 && (endValues[j] > 100)) {
                        endValues[j] = 100;
                    }
                }
                series.stackedValues = new StackValues(startValues, endValues);
                series.yMin = Math.min.apply(0, startValues);
                series.yMax = Math.max.apply(0, endValues);
                if (series.yMin > Math.min.apply(0, endValues)) {
                    series.yMin = (isStacking100) ? -100 : Math.min.apply(0, endValues);
                }
                if (series.yMax < Math.max.apply(0, startValues)) {
                    series.yMax = 0;
                }
            }
        }
        this.findPercentageOfStacking(stackingSeies, stackedValues, isStacking100);
    };
    Series.prototype.findPercentageOfStacking = function (stackingSeies, values, isStacking100) {
        for (var _i = 0, stackingSeies_1 = stackingSeies; _i < stackingSeies_1.length; _i++) {
            var item = stackingSeies_1[_i];
            if (isStacking100) {
                return null;
            }
            for (var _a = 0, _b = getVisiblePoints(item); _a < _b.length; _a++) {
                var point = _b[_a];
                point.percentage = Math.abs(+(point.y / values[point.index] * 100).toFixed(2));
            }
        }
    };
    Series.prototype.findFrequencies = function (seriesCollection) {
        var frequencies = [];
        var stackingGroup;
        var visiblePoints = [];
        for (var _i = 0, seriesCollection_2 = seriesCollection; _i < seriesCollection_2.length; _i++) {
            var series = seriesCollection_2[_i];
            series.yAxis.isStack100 = series.type.indexOf('100') !== -1 ? true : false;
            visiblePoints = getVisiblePoints(series);
            if (series.type.indexOf('Stacking') !== -1) {
                stackingGroup = (series.type.indexOf('StackingArea') !== -1) ? 'StackingArea100' :
                    (series.type.indexOf('StackingLine') !== -1) ? 'StackingLine100' : series.stackingGroup;
                if (!frequencies[stackingGroup]) {
                    frequencies[stackingGroup] = [];
                }
                for (var j = 0, pointsLength = visiblePoints.length; j < pointsLength; j++) {
                    if (frequencies[stackingGroup][visiblePoints[j].xValue] === undefined) {
                        frequencies[stackingGroup][visiblePoints[j].xValue] = 0;
                    }
                    if (series.yData[j] > 0) {
                        frequencies[stackingGroup][visiblePoints[j].xValue] += series.yData[j];
                    }
                    else {
                        frequencies[stackingGroup][visiblePoints[j].xValue] -= series.yData[j];
                    }
                }
            }
        }
        return frequencies;
    };
    /* private dataManagerFailure(e: { result: Object[] }): void {
         this.currentViewData = [];
         this.refreshChart();
     }*/
    /** @private */
    Series.prototype.renderSeries = function (chart) {
        var seriesType = firstToLowerCase(this.type);
        seriesType = seriesType.replace('100', '');
        if (chart[seriesType + 'SeriesModule']) {
            if (this.category !== 'Indicator' && this.category !== 'TrendLine') {
                this.createSeriesElements(chart);
            }
            this.visiblePoints = getVisiblePoints(this);
            chart[seriesType + 'SeriesModule'].render(this, this.xAxis, this.yAxis, chart.requireInvertedAxis);
            if (this.category !== 'Indicator') {
                if (this.errorBar.visible) {
                    this.chart.errorBarModule.render(this);
                }
                if (this.marker.dataLabel.visible) {
                    chart.dataLabelModule.render(this, this.chart, this.marker.dataLabel);
                }
                this.appendSeriesElement(chart.seriesElements, chart);
            }
            if (!this.chart.enableCanvas) {
                this.performAnimation(chart, seriesType, this.errorBar, this.marker, this.marker.dataLabel);
            }
        }
    };
    /**
     * To create seris element.
     * @return {void}
     * @private
     */
    Series.prototype.createSeriesElements = function (chart) {
        if (this.category !== 'Indicator') {
            var elementId = chart.element.id;
            // 8 for extend border value 5 for extend size value
            var explodeValue = this.marker.border.width + 8 + 5;
            var render = (this.type === 'Scatter' || this.type === 'Bubble') ?
                chart.svgRenderer : chart.renderer;
            var index = this.index === undefined ? this.category : this.index;
            var markerHeight = void 0;
            var markerWidth = void 0;
            var options = void 0;
            if (this.type === 'Scatter') {
                markerHeight = (chart.primaryYAxis.maximum || chart.primaryXAxis.maximum) ? 0 : (this.marker.height + explodeValue) / 2;
                markerWidth = (chart.primaryYAxis.maximum || chart.primaryXAxis.maximum) ? 0 : (this.marker.width + explodeValue) / 2;
            }
            else {
                markerHeight = 0;
                markerWidth = 0;
            }
            if (chart.chartAreaType === 'PolarRadar') {
                var markerMaxValue = (this.drawType === 'Scatter') ? Math.max(this.marker.width, this.marker.height) : 0;
                options = new CircleOption(elementId + '_ChartSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1, this.clipRect.width / 2 + this.clipRect.x, this.clipRect.height / 2 + this.clipRect.y, chart.radius + markerMaxValue);
                this.clipRectElement = appendClipElement(chart.redraw, options, render, 'drawCircularClipPath');
            }
            else {
                options = new RectOption(elementId + '_ChartSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1, {
                    x: -markerWidth, y: -markerHeight,
                    width: this.clipRect.width + markerWidth * 2,
                    height: this.clipRect.height + markerHeight * 2
                });
                this.clipRectElement = appendClipElement(chart.redraw, options, render);
            }
            var transform = void 0;
            transform = chart.chartAreaType === 'Cartesian' ? 'translate(' + this.clipRect.x + ',' + (this.clipRect.y) + ')' : '';
            this.symbolElement = null;
            this.seriesElement = render.createGroup({
                'id': elementId + 'SeriesGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + elementId + '_ChartSeriesClipRect_' + index + ')'
            });
            if (!this.chart.enableCanvas || this.type === 'Scatter' || this.type === 'Bubble') {
                this.seriesElement.appendChild(this.clipRectElement);
            }
        }
    };
    /**
     * To append the series.
     * @return {void}
     * @private
     */
    Series.prototype.appendSeriesElement = function (element, chart) {
        var marker = this.marker;
        var dataLabel = marker.dataLabel;
        var redraw = chart.redraw;
        if (this.category !== 'TrendLine') {
            appendChildElement(chart.enableCanvas, chart.seriesElements, this.seriesElement, redraw);
            var errorBar = this.errorBar;
            if (errorBar.visible) {
                if (chart.chartAreaType === 'PolarRadar') {
                    appendChildElement(chart.enableCanvas, chart.seriesElements, this.seriesElement, redraw);
                }
                else {
                    appendChildElement(chart.enableCanvas, chart.seriesElements, this.errorBarElement, redraw);
                }
            }
            if (this.type === 'Scatter' || this.type === 'Bubble') {
                appendChildElement(false, chart.seriesElements, this.seriesElement, redraw);
            }
        }
        if (marker.visible && (chart.chartAreaType === 'Cartesian' ||
            ((this.drawType !== 'Scatter') && chart.chartAreaType === 'PolarRadar')) && this.type !== 'Scatter' &&
            this.type !== 'Bubble' && this.type !== 'Candle' && this.type !== 'Hilo' && this.type !== 'HiloOpenClose' && this.symbolElement) {
            appendChildElement(chart.enableCanvas, chart.seriesElements, this.symbolElement, redraw);
        }
        if (dataLabel.visible && this.textElement) {
            appendChildElement(chart.enableCanvas, chart.dataLabelElements, this.shapeElement, redraw);
            appendChildElement(chart.enableCanvas, chart.dataLabelElements, this.textElement, redraw);
        }
        if (!chart.enableCanvas && chart.dataLabelElements.hasChildNodes()) {
            chart.seriesElements.appendChild(chart.dataLabelElements);
        }
    };
    /**
     * To perform animation for chart series.
     * @return {void}
     * @private
     */
    Series.prototype.performAnimation = function (chart, type, errorBar, marker, dataLabel) {
        if (this.animation.enable && chart.animateSeries) {
            chart[type + 'SeriesModule'].doAnimation(this);
            if (errorBar.visible) {
                chart.errorBarModule.doErrorBarAnimation(this);
            }
            if (marker.visible) {
                chart.markerRender.doMarkerAnimation(this);
            }
            //to datalabel animation disabled for edge and IE
            if (dataLabel.visible && Browser.info.name !== 'edge' && !Browser.isIE) {
                chart.dataLabelModule.doDataLabelAnimation(this);
            }
        }
    };
    /**
     * To set border color for empty point
     * @private
     */
    Series.prototype.setPointColor = function (point, color) {
        color = point.interior || color;
        return point.isEmpty ? (this.emptyPointSettings.fill || color) : color;
    };
    /**
     * To set border color for empty point
     * @private
     */
    Series.prototype.setBorderColor = function (point, border) {
        border.width = point.isEmpty ? (this.emptyPointSettings.border.width || border.width) : border.width;
        border.color = point.isEmpty ? (this.emptyPointSettings.border.color || border.color) : border.color;
        return border;
    };
    __decorate([
        Property('')
    ], Series.prototype, "name", void 0);
    __decorate([
        Property('')
    ], Series.prototype, "yName", void 0);
    __decorate([
        Property('Line')
    ], Series.prototype, "drawType", void 0);
    __decorate([
        Property(true)
    ], Series.prototype, "isClosed", void 0);
    __decorate([
        Property('#2ecd71')
    ], Series.prototype, "bearFillColor", void 0);
    __decorate([
        Property('#e74c3d')
    ], Series.prototype, "bullFillColor", void 0);
    __decorate([
        Property(false)
    ], Series.prototype, "enableSolidCandles", void 0);
    __decorate([
        Property('')
    ], Series.prototype, "size", void 0);
    __decorate([
        Property(null)
    ], Series.prototype, "binInterval", void 0);
    __decorate([
        Property(false)
    ], Series.prototype, "showNormalDistribution", void 0);
    __decorate([
        Property('')
    ], Series.prototype, "stackingGroup", void 0);
    __decorate([
        Complex({ color: 'transparent', width: 0 }, Border)
    ], Series.prototype, "border", void 0);
    __decorate([
        Property(1)
    ], Series.prototype, "opacity", void 0);
    __decorate([
        Property(0)
    ], Series.prototype, "zOrder", void 0);
    __decorate([
        Property('Line')
    ], Series.prototype, "type", void 0);
    __decorate([
        Complex(null, ErrorBarSettings)
    ], Series.prototype, "errorBar", void 0);
    __decorate([
        Complex(null, MarkerSettings)
    ], Series.prototype, "marker", void 0);
    __decorate([
        Complex({}, DragSettings)
    ], Series.prototype, "dragSettings", void 0);
    __decorate([
        Collection([], Trendline)
    ], Series.prototype, "trendlines", void 0);
    __decorate([
        Property(true)
    ], Series.prototype, "enableTooltip", void 0);
    __decorate([
        Property('')
    ], Series.prototype, "tooltipFormat", void 0);
    __decorate([
        Property('')
    ], Series.prototype, "tooltipMappingName", void 0);
    __decorate([
        Property('SeriesType')
    ], Series.prototype, "legendShape", void 0);
    __decorate([
        Property(null)
    ], Series.prototype, "selectionStyle", void 0);
    __decorate([
        Property(null)
    ], Series.prototype, "unSelectedStyle", void 0);
    __decorate([
        Property(null)
    ], Series.prototype, "nonHighlightStyle", void 0);
    __decorate([
        Property(1)
    ], Series.prototype, "minRadius", void 0);
    __decorate([
        Property(3)
    ], Series.prototype, "maxRadius", void 0);
    __decorate([
        Property('Natural')
    ], Series.prototype, "splineType", void 0);
    __decorate([
        Property(0.5)
    ], Series.prototype, "cardinalSplineTension", void 0);
    __decorate([
        Complex(null, EmptyPointSettings)
    ], Series.prototype, "emptyPointSettings", void 0);
    __decorate([
        Property(true)
    ], Series.prototype, "showMean", void 0);
    __decorate([
        Property('Normal')
    ], Series.prototype, "boxPlotMode", void 0);
    __decorate([
        Property(null)
    ], Series.prototype, "columnWidth", void 0);
    __decorate([
        Property(0)
    ], Series.prototype, "columnSpacing", void 0);
    __decorate([
        Property('#C64E4A')
    ], Series.prototype, "negativeFillColor", void 0);
    __decorate([
        Property('#4E81BC')
    ], Series.prototype, "summaryFillColor", void 0);
    __decorate([
        Property()
    ], Series.prototype, "intermediateSumIndexes", void 0);
    __decorate([
        Property()
    ], Series.prototype, "sumIndexes", void 0);
    __decorate([
        Complex({ color: 'black', width: 2 }, Connector)
    ], Series.prototype, "connector", void 0);
    __decorate([
        Complex(null, CornerRadius)
    ], Series.prototype, "cornerRadius", void 0);
    return Series;
}(SeriesBase));
export { Series };
