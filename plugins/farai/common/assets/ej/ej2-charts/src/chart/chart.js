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
import { Component, Property, NotifyPropertyChanges, Internationalization } from '@syncfusion/ej2-base';
import { L10n, setValue, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { ChildProperty } from '@syncfusion/ej2-base';
import { remove, extend } from '@syncfusion/ej2-base';
import { Browser, Touch } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';
import { findClipRect, showTooltip, ImageOption, removeElement, appendChildElement, blazorTemplatesReset } from '../common/utils/helper';
import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, redrawElement } from '../common/utils/helper';
import { appendClipElement, ChartLocation } from '../common/utils/helper';
import { getSeriesColor, Theme, getThemeColor } from '../common/model/theme';
import { Margin, Border, ChartArea, Font, Indexes, TooltipSettings } from '../common/model/base';
import { Row, Column, Axis } from './axis/axis';
import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';
import { Rect, measureText, TextOption, Size, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { ChartData } from './utils/get-data';
import { Series } from './series/chart-series';
import { Data } from '../common/model/data';
import { Marker } from './series/marker';
import { LegendSettings } from '../common/legend/legend';
import { TechnicalIndicator } from './technical-indicators/technical-indicator';
import { chartMouseClick, pointClick, pointDoubleClick, axisLabelClick, } from '../common/model/constants';
import { chartMouseDown, chartMouseMove, chartMouseUp, load, pointMove, chartMouseLeave, resized } from '../common/model/constants';
import { ChartAnnotationSettings } from './model/chart-base';
import { getElement, getTitle } from '../common/utils/helper';
import { ExportUtils } from '../common/utils/export';
/**
 * Configures the crosshair in the chart.
 */
var CrosshairSettings = /** @class */ (function (_super) {
    __extends(CrosshairSettings, _super);
    function CrosshairSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], CrosshairSettings.prototype, "enable", void 0);
    __decorate([
        Property('')
    ], CrosshairSettings.prototype, "dashArray", void 0);
    __decorate([
        Complex({ color: null, width: 1 }, Border)
    ], CrosshairSettings.prototype, "line", void 0);
    __decorate([
        Property('Both')
    ], CrosshairSettings.prototype, "lineType", void 0);
    return CrosshairSettings;
}(ChildProperty));
export { CrosshairSettings };
/**
 * Configures the zooming behavior for the chart.
 */
var ZoomSettings = /** @class */ (function (_super) {
    __extends(ZoomSettings, _super);
    function ZoomSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], ZoomSettings.prototype, "enableSelectionZooming", void 0);
    __decorate([
        Property(false)
    ], ZoomSettings.prototype, "enablePinchZooming", void 0);
    __decorate([
        Property(false)
    ], ZoomSettings.prototype, "enableMouseWheelZooming", void 0);
    __decorate([
        Property(true)
    ], ZoomSettings.prototype, "enableDeferredZooming", void 0);
    __decorate([
        Property('XY')
    ], ZoomSettings.prototype, "mode", void 0);
    __decorate([
        Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
    ], ZoomSettings.prototype, "toolbarItems", void 0);
    __decorate([
        Property(false)
    ], ZoomSettings.prototype, "enablePan", void 0);
    __decorate([
        Property(false)
    ], ZoomSettings.prototype, "enableScrollbar", void 0);
    return ZoomSettings;
}(ChildProperty));
export { ZoomSettings };
/**
 * Represents the Chart control.
 * ```html
 * <div id="chart"/>
 * <script>
 *   var chartObj = new Chart({ isResponsive : true });
 *   chartObj.appendTo("#chart");
 * </script>
 * ```
 * @public
 */
var Chart = /** @class */ (function (_super) {
    __extends(Chart, _super);
    /**
     * Constructor for creating the widget
     * @hidden
     */
    function Chart(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @public */
        _this.animated = false;
        /** @private */
        _this.isPointMouseDown = false;
        /** @private */
        _this.isScrolling = false;
        /** @private */
        _this.checkResize = 0;
        /** @private */
        _this.visible = 0;
        /** @private */
        _this.clickCount = 0;
        /** @private */
        _this.singleClickTimer = 0;
        /** @private */
        _this.chartAreaType = 'Cartesian';
        /** @private */
        _this.isRtlEnabled = (window.getComputedStyle(document.querySelector('body')).direction === 'rtl');
        _this.chartid = 57723;
        setValue('mergePersistData', _this.mergePersistChartData, _this);
        return _this;
    }
    /**
     * To manage persist chart data
     */
    Chart.prototype.mergePersistChartData = function () {
        var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            var dataObj = JSON.parse(data);
            var keys = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                }
                else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    };
    /**
     * Initialize the event handler.
     */
    Chart.prototype.preRender = function () {
        // It is used for checking blazor framework or not.
        var blazor = 'Blazor';
        this.isBlazor = window[blazor];
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.initPrivateVariable();
        this.setCulture();
        this.wireEvents();
        if (this.stockChart) {
            if (this.stockChart.tooltip.header === null) {
                this.tooltip.header = '<b>${point.x}</b>';
            }
            if (this.stockChart.tooltip.format === null) {
                this.tooltip.format = 'High : <b>${point.high}</b><br/>Low :' +
                    ' <b>${point.low}</b><br/>Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b>';
                if (this.stockChart.series[0].volume !== '') {
                    this.tooltip.format += '<br/>Volume : <b>${point.volume}</b>';
                }
            }
            this.animateSeries = false;
        }
    };
    Chart.prototype.initPrivateVariable = function () {
        this.animateSeries = true;
        this.delayRedraw = false;
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.refreshAxis();
        this.refreshDefinition(this.rows);
        this.refreshDefinition(this.columns);
        if (this.tooltipModule) {
            this.tooltipModule.previousPoints = [];
        }
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-chart').length;
            this.element.id = 'chart_' + this.chartid + '_' + collection;
        }
        //seperate ID to differentiate chart and stock chart
        this.svgId = this.stockChart ? this.stockChart.element.id + '_stockChart_chart' :
            this.element.id + (this.enableCanvas ? '_canvas' : '_svg');
    };
    /**
     * To Initialize the control rendering.
     */
    Chart.prototype.render = function () {
        var _this = this;
        this.svgRenderer = new SvgRenderer(this.element.id);
        var loadEventData = { chart: this.isBlazor ? {} : this, theme: this.theme, name: load, cancel: false };
        if (!this.stockChart) {
            /**
             * Load event for the chart will be triggered only chart componet, if this is stock chart, load event did not triggered.
             */
            this.trigger(load, loadEventData, function () {
                if (!loadEventData.cancel) {
                    _this.cartesianChartRendering(loadEventData);
                }
            });
        }
        else {
            this.cartesianChartRendering(loadEventData);
        }
    };
    Chart.prototype.cartesianChartRendering = function (beforeRenderData) {
        this.theme = this.isBlazor ? beforeRenderData.theme : this.theme;
        this.createChartSvg();
        this.setTheme();
        this.markerRender = new Marker(this);
        this.calculateAreaType();
        this.calculateVisibleSeries();
        this.initTechnicalIndicators();
        this.initTrendLines();
        this.calculateVisibleAxis();
        this.processData();
        this.renderComplete();
        this.allowServerDataBinding = true;
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    Chart.prototype.getLocalizedLabel = function (key) {
        return this.localeObject.getConstant(key);
    };
    /**
     * Animate the series bounds.
     * @private
     */
    Chart.prototype.animate = function (duration) {
        this.redraw = true;
        this.animated = true; //used to set duration as 1000 for animation at default 300
        this.duration = duration ? duration : 1000;
    };
    /**
     * Refresh the chart bounds.
     * @private
     */
    Chart.prototype.refreshBound = function () {
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.visibleSeries, this);
        }
        /**
         * I264230, EJ2-36761
         * Issue: Tooltip doesnot appears after zooming and hovering on same point
         * Root cause: While performing zoom, previous points in tooltip restore.
         * Fix: previous points set to empty array
         */
        if (this.tooltip.enable && this.tooltipModule) {
            this.tooltipModule.previousPoints = [];
        }
        this.calculateStackValues();
        this.calculateBounds();
        //this prevents the initial rendering of stock chart
        if (this.stockChart && !this.stockChart.rangeFound) {
            if (this.stockChart.enablePeriodSelector || this.stockChart.enableSelector) {
                return null;
            }
        }
        this.renderElements();
        removeElement('chartmeasuretext');
        this.removeSelection();
    };
    /**
     * To calcualte the stack values
     */
    Chart.prototype.calculateStackValues = function () {
        var series;
        var isCalculateStacking = false;
        for (var i = 0, len = this.visibleSeries.length; i < len; i++) {
            series = this.visibleSeries[i];
            series.position = series.rectCount = undefined;
            if (((series.type.indexOf('Stacking') !== -1) || (series.drawType.indexOf('Stacking') !== -1
                && this.chartAreaType === 'PolarRadar')) && !isCalculateStacking) {
                series.calculateStackedValue(series.type.indexOf('100') > -1, this);
                isCalculateStacking = true;
            }
        }
    };
    Chart.prototype.removeSelection = function () {
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.visible) {
                for (var _b = 0, _c = series.points; _b < _c.length; _b++) {
                    var point = _c[_b];
                    point.isSelect = false;
                }
            }
        }
        if (getElement(this.element.id + '_ej2_drag_multi_group')) {
            if (this.selectionMode.indexOf('Drag') > -1) {
                this.selectionModule.filterArray = [];
            }
            removeElement(this.element.id + '_ej2_drag_multi_group');
            this.selectionModule.calculateDragSelectedElements(this, new Rect(0, 0, 0, 0), true);
        }
        else if (getElement(this.element.id + '_ej2_drag_group')) {
            if (this.selectionMode !== 'Lasso') {
                this.selectionModule.filterArray = [];
            }
            removeElement(this.element.id + '_ej2_drag_group');
            this.selectionModule.calculateDragSelectedElements(this, new Rect(0, 0, 0, 0), true);
        }
    };
    Chart.prototype.renderElements = function () {
        this.renderBorder();
        this.renderTitle();
        this.renderAreaBorder();
        this.renderSeriesElements(this.renderAxes());
        this.renderLegend();
        this.applyZoomkit();
        this.performSelection();
        this.setSecondaryElementPosition();
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var value = _a[_i];
            updateBlazorTemplate(this.element.id + '_DataLabel', 'Template', value.marker.dataLabel);
        }
        this.renderAnnotation();
    };
    /**
     * To render the legend
     * @private
     */
    Chart.prototype.renderAxes = function () {
        this.yAxisElements = this.renderer.createGroup({ id: this.element.id + 'yAxisCollection' });
        var axisElement;
        if (this.rows.length > 0 && this.columns.length > 0) {
            axisElement = this.chartAxisLayoutPanel.renderAxes();
        }
        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Behind', this.axisCollections);
        }
        return axisElement;
    };
    /**
     * To render the legend
     */
    Chart.prototype.renderLegend = function () {
        if (this.legendModule && this.legendModule.legendCollections.length && this.legendSettings.visible) {
            this.legendModule.calTotalPage = true;
            var borderWidth = this.legendSettings.border.width;
            var bounds = this.legendModule.legendBounds;
            var rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
            if (this.enableCanvas) {
                rect = new Rect(rect.x - borderWidth / 2, rect.y - borderWidth / 2, rect.width + borderWidth, rect.height + borderWidth);
                this.renderer.canvasClip(rect);
            }
            this.legendModule.renderLegend(this, this.legendSettings, bounds);
            if (this.enableCanvas) {
                this.renderer.canvasRestore();
            }
        }
        if (!this.redraw) {
            if (!this.stockChart) {
                this.element.appendChild(this.svgObject);
            }
            else {
                if (!getElement(this.stockChart.chartObject.id)) {
                    this.stockChart.mainObject.appendChild(this.svgObject);
                }
            }
        }
    };
    /**
     * To set the left and top position for data label template for center aligned chart
     */
    Chart.prototype.setSecondaryElementPosition = function () {
        var element = getElement(this.element.id + '_Secondary_Element');
        if (!element) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getElement(this.svgId).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    Chart.prototype.initializeModuleElements = function () {
        this.dataLabelCollections = [];
        var elementId = this.element.id;
        if (this.series.length) {
            this.seriesElements = (this.series[0].type === 'Scatter' || this.series[0].type === 'Bubble') ?
                this.svgRenderer.createGroup({ id: elementId + 'SeriesCollection' }) :
                this.renderer.createGroup({ id: elementId + 'SeriesCollection' });
        }
        if (this.indicators.length) {
            this.indicatorElements = this.renderer.createGroup({ id: elementId + 'IndicatorCollection' });
        }
        if (this.hasTrendlines()) {
            this.trendLineElements = this.renderer.createGroup({ id: elementId + 'TrendLineCollection' });
        }
        this.dataLabelElements = this.renderer.createGroup({ id: elementId + 'DataLabelCollection' });
    };
    Chart.prototype.hasTrendlines = function () {
        var isTrendline;
        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
            var series = _a[_i];
            isTrendline = series.trendlines.length ? true : false;
            if (isTrendline) {
                break;
            }
        }
        return isTrendline;
    };
    Chart.prototype.renderSeriesElements = function (axisElement) {
        // Initialize the series elements values
        this.initializeModuleElements();
        var elementId = this.element.id;
        if (this.element.tagName !== 'g') {
            var tooltipDiv = redrawElement(this.redraw, elementId + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = elementId + '_Secondary_Element';
            tooltipDiv.setAttribute('style', 'position: relative');
            appendChildElement(false, this.element, tooltipDiv, this.redraw);
        }
        // For canvas
        if (this.enableCanvas) {
            var tooltipdiv = document.getElementById(elementId + '_Secondary_Element');
            tooltipdiv = !tooltipdiv ? this.createElement('div', { id: elementId + '_Secondary_Element',
                attrs: { 'style': 'position: relative; left:0px; top:0px' } }) : tooltipdiv;
            var svg = this.svgRenderer.createSvg({
                id: elementId + '_tooltip_svg',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            svg.setAttribute('style', 'position: absolute; pointer-events: none');
            tooltipdiv.appendChild(svg);
        }
        // For userInteraction
        if (this.tooltip.enable) {
            appendChildElement(this.enableCanvas, this.svgObject, this.renderer.createGroup({ id: elementId + '_UserInteraction', style: 'pointer-events:none;' }), this.redraw);
        }
        if (this.rows.length > 0 && this.columns.length > 0) {
            this.initializeIndicator();
            this.initializeTrendLine();
            this.renderSeries();
            // Trendline is append to DOM after the series
            if (this.trendLineElements) {
                appendChildElement(this.enableCanvas, this.svgObject, this.trendLineElements, this.redraw);
            }
            this.appendElementsAfterSeries(axisElement);
        }
    };
    /**
     * @private
     */
    Chart.prototype.renderSeries = function () {
        var visibility;
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.category === 'TrendLine') {
                visibility = this.series[item.sourceIndex].trendlines[item.index].visible;
            }
            else {
                visibility = item.visible;
            }
            if (visibility) {
                this.visible++;
                findClipRect(item);
                if (this.enableCanvas) {
                    // To render scatter and bubble series in canvas
                    this.renderCanvasSeries(item);
                    // To clip the series rect for canvas
                    this.renderer.canvasClip(this.chartAxisLayoutPanel.seriesClipRect);
                }
                item.renderSeries(this);
                if (this.enableCanvas) {
                    this.renderer.canvasRestore();
                }
            }
        }
        this.visible = 0;
        var options = {
            'id': this.element.id + '_ChartAreaClipRect_',
            'x': this.chartAxisLayoutPanel.seriesClipRect.x,
            'y': this.chartAxisLayoutPanel.seriesClipRect.y,
            'width': this.chartAxisLayoutPanel.seriesClipRect.width,
            'height': this.chartAxisLayoutPanel.seriesClipRect.height,
            'fill': 'transparent',
            'stroke-width': 1,
            'stroke': 'Gray'
        };
        if (!this.seriesElements) {
            return;
        }
        if (!this.enableCanvas) {
            this.seriesElements.appendChild(appendClipElement(this.redraw, options, this.renderer));
        }
        var seriesSvg = document.getElementById(this.element.id + '_series_svg');
        seriesSvg ? appendChildElement(false, seriesSvg, this.seriesElements, this.redraw) :
            appendChildElement(this.enableCanvas, this.svgObject, this.seriesElements, this.redraw);
    };
    Chart.prototype.renderCanvasSeries = function (item) {
        var svgElement;
        var divElement;
        var canvas;
        if ((item.type === 'Bubble' || item.type === 'Scatter')) {
            svgElement = !svgElement ? this.svgRenderer.createSvg({ id: this.element.id + '_series_svg',
                width: this.availableSize.width, height: this.availableSize.height }) : svgElement;
            divElement = !divElement ? this.createElement('div', { id: this.element.id + '_series' }) : divElement;
            divElement.setAttribute('style', 'position: absolute');
            var mainElement = document.getElementById(this.element.id + '_Secondary_Element');
            divElement.appendChild(svgElement);
            mainElement.appendChild(divElement);
        }
        svgElement = (this.enableCanvas && (item.type === 'Bubble' || item.type === 'Scatter')) ?
            svgElement : this.svgObject;
        canvas = (this.enableCanvas && (item.type === 'Bubble' || item.type === 'Scatter')) ?
            false : this.enableCanvas;
    };
    Chart.prototype.initializeIndicator = function () {
        for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            if (this[firstToLowerCase(indicator.type) + 'IndicatorModule']) {
                this[firstToLowerCase(indicator.type) + 'IndicatorModule'].createIndicatorElements(this, indicator, indicator.index);
            }
        }
        if (this.indicatorElements) {
            appendChildElement(this.enableCanvas, this.svgObject, this.indicatorElements, this.redraw);
        }
    };
    Chart.prototype.initializeTrendLine = function () {
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.trendlines.length) {
                this.trendLineModule.getTrendLineElements(series, this);
            }
        }
    };
    Chart.prototype.appendElementsAfterSeries = function (axisElement) {
        if (this.chartAreaType === 'PolarRadar') {
            appendChildElement(this.enableCanvas, this.svgObject, this.yAxisElements, this.redraw);
        }
        appendChildElement(this.enableCanvas, this.svgObject, axisElement, this.redraw);
        if ((this.zoomModule && this.zoomSettings.enableScrollbar && this.scrollElement.childElementCount) ||
            (this.scrollElement && this.scrollElement.childElementCount)) {
            appendChildElement(false, getElement(this.element.id + '_Secondary_Element'), this.scrollElement, this.redraw);
        }
        if (this.stripLineModule) {
            this.stripLineModule.renderStripLine(this, 'Over', this.axisCollections);
        }
        if (!this.tooltip.enable) {
            appendChildElement(this.enableCanvas, this.svgObject, this.renderer.createGroup({ id: this.element.id + '_UserInteraction', style: 'pointer-events:none;' }), this.redraw);
        }
        if (this.stockChart) {
            this.stockChart.calculateStockEvents();
        }
    };
    Chart.prototype.applyZoomkit = function () {
        /**
         * Issue: Zoomkit not visible after performing refresh()
         * Fix: this method called without checking `zoomModule.isZoomed`
         */
        if (this.chartAreaType === 'PolarRadar') {
            return;
        }
        if (!this.redraw && this.zoomModule && (!this.zoomSettings.enablePan || this.zoomModule.performedUI)) {
            this.zoomModule.applyZoomToolkit(this, this.axisCollections);
        }
    };
    /**
     * Render annotation perform here
     * @param redraw
     * @private
     */
    Chart.prototype.renderAnnotation = function () {
        if (this.annotationModule) {
            //for stock chart, stock chart's id is added to render the annotations
            this.annotationModule.renderAnnotations(getElement((this.stockChart ? this.stockChart.element.id : this.element.id) + '_Secondary_Element'));
        }
    };
    Chart.prototype.performSelection = function () {
        var selectedDataIndexes = [];
        if (this.selectionModule) {
            selectedDataIndexes = extend([], this.selectionModule.selectedDataIndexes, null, true);
            this.selectionModule.invokeSelection(this);
        }
        if (this.highlightModule) {
            this.highlightModule.invokeHighlight(this);
        }
        if (selectedDataIndexes.length > 0) {
            this.selectionModule.selectedDataIndexes = selectedDataIndexes;
            this.selectionModule.redrawSelection(this, this.selectionMode);
        }
    };
    Chart.prototype.processData = function (render) {
        if (render === void 0) { render = true; }
        this.visibleSeriesCount = 0;
        var check = true;
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            if (!series.visible && !this.legendSettings.visible) {
                this.visibleSeriesCount++;
                continue;
            }
            if (series.category !== 'Indicator' && series.category !== 'TrendLine') {
                this.initializeDataModule(series);
            }
        }
        for (var _b = 0, _c = this.indicators; _b < _c.length; _b++) {
            var indicator = _c[_b];
            if (indicator.dataSource) {
                var techIndicator = indicator;
                this.initializeDataModule(techIndicator);
                check = false;
            }
        }
        if (render && (!this.visibleSeries.length || this.visibleSeriesCount === this.visibleSeries.length && check)) {
            this.refreshBound();
            this.trigger('loaded', { chart: this.isBlazor ? {} : this });
        }
    };
    Chart.prototype.initializeDataModule = function (series) {
        series.xData = [];
        series.yData = [];
        series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
        series.points = [];
        series.refreshDataManager(this);
    };
    Chart.prototype.calculateBounds = function () {
        var margin = this.margin;
        // Title Height;
        var titleHeight = 0;
        var subTitleHeight = 0;
        var titleWidth = 0;
        var padding = 15;
        var left = margin.left;
        var width = this.availableSize.width - left - margin.right - this.border.width;
        this.titleCollection = [];
        this.subTitleCollection = [];
        if (this.title) {
            this.titleCollection = getTitle(this.title, this.titleStyle, width);
            titleHeight = (measureText(this.title, this.titleStyle).height * this.titleCollection.length) + padding;
            if (this.subTitle) {
                var maxWidth = 0;
                for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
                    var titleText = _a[_i];
                    titleWidth = measureText(titleText, this.titleStyle).width;
                    maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
                }
                this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length) +
                    padding;
            }
        }
        var top = margin.top + subTitleHeight + titleHeight + this.chartArea.border.width * 0.5;
        var height = this.availableSize.height - top - this.border.width - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
        this.chartAxisLayoutPanel.measureAxis(this.initialClipRect);
    };
    /**
     * Handles the print method for chart control.
     */
    Chart.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Defines the trendline initialization
     */
    Chart.prototype.initTrendLines = function () {
        this.isProtectedOnChange = true;
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            var trendIndex = 0;
            for (var _b = 0, _c = series.trendlines; _b < _c.length; _b++) {
                var trendline = _c[_b];
                var trendLine = trendline;
                var type = firstToLowerCase(trendLine.type);
                if (this.trendLineModule) {
                    trendLine.index = trendIndex;
                    trendLine.sourceIndex = series.index;
                    this.trendLineModule.initSeriesCollection(trendLine, this);
                    if (trendLine.targetSeries) {
                        trendLine.targetSeries.xAxisName = series.xAxisName;
                        trendLine.targetSeries.yAxisName = series.yAxisName;
                        this.visibleSeries.push(trendLine.targetSeries);
                    }
                }
                trendIndex++;
            }
        }
        this.isProtectedOnChange = false;
    };
    Chart.prototype.calculateAreaType = function () {
        var series = this.series[0];
        this.chartArea.border.width = this.stockChart ? 0 : this.chartArea.border.width;
        if (series) {
            this.requireInvertedAxis = ((series.type.indexOf('Bar') !== -1) && !this.isTransposed) ||
                ((series.type.indexOf('Bar') === -1) && this.isTransposed && this.chartAreaType !== 'PolarRadar');
        }
        this.chartAxisLayoutPanel = this.chartAreaType === 'PolarRadar' ? (this.polarSeriesModule || this.radarSeriesModule)
            : new CartesianAxisLayoutPanel(this);
    };
    /**
     * Calculate the visible axis
     * @private
     */
    Chart.prototype.calculateVisibleAxis = function () {
        var axis;
        var series;
        var axes = [this.primaryXAxis, this.primaryYAxis];
        axes = this.chartAreaType === 'Cartesian' ? axes.concat(this.axes) : axes;
        if (this.paretoSeriesModule && this.series[0].type === 'Pareto') {
            axes = axes.concat(this.paretoSeriesModule.paretoAxes);
        }
        this.axisCollections = [];
        if (this.zoomModule) {
            this.zoomModule.isPanning = this.zoomModule.isAxisZoomed(axes) && this.zoomSettings.enablePan;
            this.svgObject.setAttribute('cursor', this.zoomModule.isPanning ? 'pointer' : 'auto');
            if (this.scrollBarModule) {
                this.scrollBarModule.axes = axes;
            }
        }
        if (this.scrollSettingEnabled) {
            if (this.scrollBarModule) {
                this.scrollBarModule.axes = axes;
            }
        }
        for (var i = 0, len = axes.length; i < len; i++) {
            axis = axes[i];
            axis.series = [];
            axis.labels = [];
            for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
                var series_1 = _a[_i];
                this.initAxis(series_1, axis, true);
            }
            for (var _b = 0, _c = this.indicators; _b < _c.length; _b++) {
                var indicator = _c[_b];
                this.initAxis(indicator, axis, false);
            }
            if (this.scrollBarModule && !axis.zoomingScrollBar) {
                this.scrollBarModule.injectTo(axis, this);
            }
            if (axis.orientation != null) {
                this.axisCollections.push(axis);
            }
        }
        if (this.rows.length > 0 && this.columns.length > 0) {
            this.chartAxisLayoutPanel.measure();
        }
    };
    Chart.prototype.initAxis = function (series, axis, isSeries) {
        if (series.xAxisName === axis.name || (series.xAxisName == null && axis.name === 'primaryXAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Vertical' : 'Horizontal';
            series.xAxis = axis;
            if (isSeries) {
                axis.series.push(series);
            }
        }
        else if (series.yAxisName === axis.name || (series.yAxisName == null && axis.name === 'primaryYAxis')) {
            axis.orientation = this.requireInvertedAxis ? 'Horizontal' : 'Vertical';
            series.yAxis = axis;
            if (isSeries) {
                axis.series.push(series);
            }
        }
    };
    Chart.prototype.initTechnicalIndicators = function () {
        var i = 0;
        for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            var techIndicator = indicator;
            var type = firstToLowerCase(techIndicator.type);
            if (this[type + 'IndicatorModule']) {
                techIndicator.index = i;
                this[type + 'IndicatorModule'].initSeriesCollection(techIndicator, this);
                for (var _b = 0, _c = techIndicator.targetSeries; _b < _c.length; _b++) {
                    var targetSeries = _c[_b];
                    if (indicator.seriesName || indicator.dataSource) {
                        this.visibleSeries.push(targetSeries);
                    }
                }
            }
            i++;
        }
    };
    /** @private */
    Chart.prototype.refreshTechnicalIndicator = function (series) {
        if (this.indicators.length) {
            var targetIndicator = null;
            if (series instanceof Series && series.category !== 'Indicator') {
                for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
                    var indicator = _a[_i];
                    if (indicator.seriesName === series.name && !indicator.dataSource) {
                        targetIndicator = indicator;
                        targetIndicator.setDataSource(series, this);
                    }
                }
            }
            else if (series instanceof TechnicalIndicator) {
                targetIndicator = series;
                targetIndicator.setDataSource(series instanceof Series ? series : null, this);
            }
        }
    };
    Chart.prototype.calculateVisibleSeries = function () {
        var series;
        var seriesCollection;
        this.visibleSeries = [];
        var colors = this.palettes.length ? this.palettes : getSeriesColor(this.theme);
        var count = colors.length;
        seriesCollection = this.series.sort(function (a, b) { return a.zOrder - b.zOrder; });
        for (var i = 0, len = seriesCollection.length; i < len; i++) {
            series = seriesCollection[i];
            // for y axis label issue during chart navigation
            series.category = seriesCollection[0].type === 'Pareto' ? 'Pareto' : 'Series';
            series.index = i;
            series.interior = series.fill || colors[i % count];
            switch (series.type) {
                case 'Bar':
                case 'StackingBar':
                case 'StackingBar100':
                    if (seriesCollection[0].type.indexOf('Bar') === -1) {
                        continue;
                    }
                    break;
                case 'Polar':
                case 'Radar':
                    if (this.chartAreaType !== 'PolarRadar') {
                        continue;
                    }
                    if (this.chartAreaType === 'PolarRadar' && ((series.xAxisName === null && series.yAxisName !== null) ||
                        (series.xAxisName !== null && series.yAxisName === null) ||
                        (series.xAxisName !== null && series.yAxisName !== null))) {
                        continue;
                    }
                    break;
                case 'Pareto':
                    this.visibleSeries.push(series);
                    this.paretoSeriesModule.initSeries(series, this);
                    continue;
                default:
                    if (this.chartAreaType === 'PolarRadar' || seriesCollection[0].type.indexOf('Bar') > -1) {
                        continue;
                    }
                    break;
            }
            this.visibleSeries.push(series);
            seriesCollection[i] = series;
        }
    };
    Chart.prototype.renderTitle = function () {
        var rect;
        var margin = this.margin;
        if (this.title) {
            var alignment = this.titleStyle.textAlignment;
            var getAnchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
            var elementSize = measureText(this.title, this.titleStyle);
            rect = new Rect(margin.left, 0, this.availableSize.width - margin.left - margin.right, 0);
            var options = new TextOption(this.element.id + '_ChartTitle', titlePositionX(rect, this.titleStyle), this.margin.top + ((elementSize.height) * 3 / 4), getAnchor, this.titleCollection, '', 'auto');
            var element = redrawElement(this.redraw, this.element.id + '_ChartTitle', options, this.renderer) ||
                textElement(this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject);
            if (element) {
                element.setAttribute('aria-label', this.description || this.title);
                element.setAttribute('tabindex', this.tabIndex.toString());
            }
            if (this.subTitle) {
                this.renderSubTitle(options);
            }
        }
    };
    Chart.prototype.renderSubTitle = function (options) {
        var maxWidth = 0;
        var titleWidth = 0;
        var padding = 10;
        var rect;
        var anchor = function (alignment) {
            return alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        };
        var alignment = this.titleStyle.textAlignment;
        for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
            var titleText = _a[_i];
            titleWidth = measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        var subTitleElementSize = measureText(this.subTitle, this.subTitleStyle);
        rect = new Rect(alignment === 'Center' ? (options.x - maxWidth * 0.5) : alignment === 'Far' ? options.x - maxWidth : options.x, 0, maxWidth, 0);
        var subTitleOptions = new TextOption(this.element.id + '_ChartSubTitle', titlePositionX(rect, this.subTitleStyle), options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding, anchor(this.subTitleStyle.textAlignment), this.subTitleCollection, '', 'auto');
        var element = redrawElement(this.redraw, this.element.id + '_ChartSubTitle', subTitleOptions, this.renderer) ||
            textElement(this.renderer, subTitleOptions, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject);
        if (element) {
            element.setAttribute('aria-label', this.description || this.subTitle);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    };
    Chart.prototype.renderBorder = function () {
        var width = this.border.width;
        var backGroundImage = this.backgroundImage;
        var fillColor = backGroundImage ? 'transparent' : (this.background || this.themeStyle.background);
        var rect = new RectOption(this.element.id + '_ChartBorder', fillColor, this.border, 1, new Rect(width * 0.5, width * 0.5, this.availableSize.width - width, this.availableSize.height - width));
        this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBorder', rect, this.renderer)
            || this.renderer.drawRectangle(rect);
        appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw);
        // to draw back ground image for chart
        if (backGroundImage) {
            var image = new ImageOption(this.availableSize.height - width, this.availableSize.width - width, backGroundImage, 0, 0, this.element.id + '_ChartBackground', 'visible', 'none');
            this.htmlObject = redrawElement(this.redraw, this.element.id + '_ChartBackground', image, this.renderer)
                || this.renderer.drawImage(image);
            appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw);
        }
    };
    /**
     * @private
     */
    Chart.prototype.renderAreaBorder = function () {
        if (this.chartAreaType === 'PolarRadar') {
            return null;
        }
        else {
            var element = getElement(this.element.id + '_ChartAreaBorder');
            var previousRect = element ?
                new Rect(+element.getAttribute('x'), +element.getAttribute('y'), +element.getAttribute('width'), +element.getAttribute('height')) : null;
            var rect = new RectOption(this.element.id + '_ChartAreaBorder', this.chartArea.background, { width: this.chartArea.border.width, color: this.chartArea.border.color || this.themeStyle.areaBorder }, this.chartArea.opacity, this.chartAxisLayoutPanel.seriesClipRect);
            this.htmlObject = this.renderer.drawRectangle(rect);
            appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw, true, 'x', 'y', null, null, true, true, previousRect);
            this.htmlObject = null;
        }
        // to draw back ground image for chart area
        var backGroundImage = this.chartArea.backgroundImage;
        if (backGroundImage) {
            var width = this.chartArea.border.width;
            var image = new ImageOption(this.initialClipRect.height - width, this.initialClipRect.width - width, backGroundImage, this.initialClipRect.x, this.initialClipRect.y, this.element.id + '_ChartAreaBackground', 'visible', 'none');
            this.htmlObject = this.renderer.drawImage(image);
            appendChildElement(this.enableCanvas, this.svgObject, this.htmlObject, this.redraw, true, 'x', 'y', null, null, true, true);
        }
    };
    /**
     * To add series for the chart
     * @param {SeriesModel[]} seriesCollection - Defines the series collection to be added in chart.
     * @return {void}.
     */
    Chart.prototype.addSeries = function (seriesCollection) {
        for (var _i = 0, seriesCollection_1 = seriesCollection; _i < seriesCollection_1.length; _i++) {
            var series = seriesCollection_1[_i];
            series = new Series(this, 'series', series);
            this.series.push(series);
        }
        this.refresh();
    };
    /**
     * To Remove series for the chart
     * @param index - Defines the series index to be remove in chart series
     * @return {void}
     */
    Chart.prototype.removeSeries = function (index) {
        this.redraw = false; //fix for remove svg not working when use animatemethod.
        this.series.splice(index, 1);
        this.refresh();
    };
    /**
     * To Clear all series for the chart
     * @return {void}.
     */
    Chart.prototype.clearSeries = function () {
        this.series = [];
        this.refresh();
    };
    /**
     * To add secondary axis for the chart
     * @param {AxisModel[]} axisCollection - Defines the axis collection to be added in chart.
     * @return {void}.
     */
    Chart.prototype.addAxes = function (axisCollection) {
        for (var _i = 0, axisCollection_1 = axisCollection; _i < axisCollection_1.length; _i++) {
            var axis = axisCollection_1[_i];
            axis = new Axis(this, 'axes', axis);
            if (this.isBlazor) {
                axis.interval = isNaN(axis.interval) ? null : axis.interval;
                axis.desiredIntervals = isNaN(axis.desiredIntervals) ? null : axis.desiredIntervals;
            }
            this.axes.push(axis);
        }
        this.refresh();
    };
    /**
     * To remove secondary axis for the chart
     * @param index - Defines the axis collection to be removed in chart.
     * @return {void}.
     */
    Chart.prototype.removeAxis = function (index) {
        this.redraw = false;
        this.axes.splice(index, 1);
        this.refresh();
    };
    ;
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of Chart
     */
    Chart.prototype.destroy = function () {
        if (this.scrollBarModule) {
            this.scrollBarModule.destroy();
        }
        if (this.markerRender) {
            this.markerRender.removeEventListener();
            this.markerRender = null;
        }
        this.horizontalAxes = [];
        this.verticalAxes = [];
        this.visibleSeries = [];
        this.axisCollections = [];
        this.seriesElements = null;
        this.chartAxisLayoutPanel = null;
        this.dataLabelCollections = null;
        this.dataLabelElements = null;
        this.yAxisElements = null;
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            // tslint:disable-next-line:no-any
            if (this.isReact) {
                this.clearTemplate();
            }
            _super.prototype.destroy.call(this);
            if (!this.enableCanvas) {
                this.removeSvg();
                this.svgObject = null;
            }
        }
    };
    /**
     * Get component name
     */
    Chart.prototype.getModuleName = function () {
        return 'chart';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Chart.prototype.getPersistData = function () {
        var keyEntity = ['loaded', 'animationComplete', 'primaryXAxis', 'primaryYAxis'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Method to create SVG element.
     */
    Chart.prototype.createChartSvg = function () {
        this.removeSvg();
        createSvg(this);
    };
    /**
     * Method to bind events for chart
     */
    Chart.prototype.unWireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var moveEvent = Browser.touchMoveEvent;
        var stopEvent = Browser.touchEndEvent;
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, startEvent, this.chartOnMouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.chartOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.chartRightClick);
        EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
        /**
         * To fix memory issue
         */
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }
    };
    Chart.prototype.wireEvents = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /*! Find the Events type */
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.chartOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.chartOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.chartRightClick, this);
        EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        this.resizeBound = this.chartResize.bind(this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
        this.longPressBound = this.longPress.bind(this);
        this.touchObject = new Touch(this.element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
        this.setStyle(this.element);
    };
    Chart.prototype.chartRightClick = function (event) {
        if (this.crosshair.enable && this.crosshairModule &&
            (event.buttons === 2 || event.which === 0 || event.pointerType === 'touch')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    Chart.prototype.setStyle = function (element) {
        var zooming = this.zoomSettings;
        var disableScroll = zooming.enableSelectionZooming || zooming.enablePinchZooming ||
            this.selectionMode !== 'None' || this.crosshair.enable || this.highlightMode !== 'None';
        element.style.touchAction = disableScroll ? 'none' : 'element';
        element.style.msTouchAction = disableScroll ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        // To fix angular and react tooltip div scrollbar issue
        element.style.overflow = 'hidden';
    };
    /**
     * Finds the orientation.
     * @return {boolean}
     * @private
     */
    Chart.prototype.isOrientation = function () {
        return ('orientation' in window && 'onorientationchange' in window);
    };
    /**
     * Handles the long press on chart.
     * @return {boolean}
     * @private
     */
    Chart.prototype.longPress = function (e) {
        this.mouseX = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientX) : 0;
        this.mouseY = (e && e.originalEvent.changedTouches) ? (e.originalEvent.changedTouches[0].clientY) : 0;
        this.startMove = true;
        this.setMouseXY(this.mouseX, this.mouseY);
        this.notify('tapHold', e);
        return false;
    };
    /**
     * To find mouse x, y for aligned chart element svg position
     */
    Chart.prototype.setMouseXY = function (pageX, pageY) {
        if (getElement(this.svgId)) {
            var svgRect = getElement(this.svgId).getBoundingClientRect();
            var rect = this.element.getBoundingClientRect();
            this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
            this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        }
    };
    /**
     * Export method for the chart.
     */
    Chart.prototype.export = function (type, fileName) {
        if (this.exportModule) {
            this.exportModule.export(type, fileName);
            if (this.afterExport) {
                this.exportModule.getDataUrl(this);
            }
        }
    };
    /**
     * Handles the chart resize.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        var arg = {
            chart: this.isBlazor ? {} : this,
            name: resized,
            currentSize: new Size(0, 0),
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed || _this.stockChart) {
                clearTimeout(_this.resizeTo);
                return;
            }
            _this.createChartSvg();
            arg.currentSize = _this.availableSize;
            _this.trigger(resized, arg);
            _this.refreshAxis();
            _this.refreshBound();
            _this.trigger('loaded', { chart: _this.isBlazor ? {} : _this });
        }, 500);
        return false;
    };
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    Chart.prototype.mouseMove = function (e) {
        var pageX;
        var pageY;
        var touchArg;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        if (getElement(this.svgId)) {
            this.setMouseXY(pageX, pageY);
            this.chartOnMouseMove(e);
        }
        return false;
    };
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    Chart.prototype.mouseLeave = function (e) {
        var pageX;
        var pageY;
        var touchArg;
        if (e.type === 'touchleave') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseLeave(e);
        return false;
    };
    /**
     * Handles the mouse leave on chart.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartOnMouseLeave = function (e) {
        var element = e.target;
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.trigger(chartMouseLeave, { target: element.id, x: this.mouseX, y: this.mouseY });
        removeElement(this.element.id + '_EJ2_AxisLabel_Tooltip');
        this.isChartDrag = this.isPointMouseDown = false;
        this.notify(cancelEvent, e);
        return false;
    };
    /**
     * Handles the mouse click on chart.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartOnMouseClick = function (e) {
        var _this = this;
        var element = e.target;
        this.trigger(chartMouseClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.clickCount++;
        var timeInterval = 0;
        var isAngular = 'isAngular';
        if (this[isAngular]) {
            var observers = 'observers';
            timeInterval = this.pointDoubleClick[observers].length > 0 ? 400 : 0;
        }
        else {
            timeInterval = this.pointDoubleClick ? 400 : 0;
        }
        if (this.clickCount === 1 && this.pointClick) {
            this.singleClickTimer = +setTimeout(function () {
                _this.clickCount = 0;
                _this.triggerPointEvent(pointClick, e);
            }, timeInterval);
        }
        else if (this.clickCount === 2 && this.pointDoubleClick) {
            clearTimeout(this.singleClickTimer);
            this.clickCount = 0;
            this.triggerPointEvent(pointDoubleClick, e);
        }
        if (this.axisLabelClick) {
            this.triggerAxisLabelClickEvent(axisLabelClick, e);
        }
        this.notify('click', e);
        return false;
    };
    Chart.prototype.triggerPointEvent = function (event, e) {
        var evt = e;
        var data = new ChartData(this);
        var pointData = data.getData();
        if (pointData.series && pointData.point) {
            this.trigger(event, {
                series: this.isBlazor ? {} : pointData.series,
                point: pointData.point,
                seriesIndex: pointData.series.index, pointIndex: pointData.point.index,
                x: this.mouseX, y: this.mouseY, pageX: evt.pageX, pageY: evt.pageY
            });
        }
    };
    Chart.prototype.triggerAxisLabelClickEvent = function (event, e) {
        var targetElement = e.target;
        var clickEvt = e;
        if (targetElement.id.indexOf('_AxisLabel_') !== -1) {
            var index = targetElement.id.split('_AxisLabel_');
            var axisIndex = +index[0].slice(-1);
            var labelIndex = +index[1];
            var currentAxis = this.axisCollections[axisIndex];
            if (currentAxis.visible && (axisIndex === 0 || axisIndex === 1)) {
                this.trigger(event, {
                    chart: this,
                    axis: currentAxis,
                    text: currentAxis.visibleLabels[labelIndex].text,
                    labelID: targetElement.id,
                    index: labelIndex,
                    location: new ChartLocation(clickEvt.pageX, clickEvt.pageY),
                    value: currentAxis.visibleLabels[labelIndex].value
                });
            }
        }
    };
    /**
     * Handles the mouse move on chart.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartOnMouseMove = function (e) {
        var element = e.target;
        this.trigger(chartMouseMove, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, e);
        }
        // Tooltip for chart series.
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
            this.axisTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseMove(e);
        }
        this.notify(Browser.touchMoveEvent, e);
        this.isTouch = false;
        return false;
    };
    Chart.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        var id = (targetId === (this.element.id + '_ChartTitle') || targetId === (this.element.id + '_ChartSubTitle') ||
            targetId.indexOf('_AxisTitle') > -1 || targetId.indexOf('_legend_title') > -1);
        var index = 0;
        if (targetId.indexOf('_AxisTitle') > -1) {
            index = parseInt(((targetId.replace(this.element.id, '')).replace('AxisLabel_', '')).split('_')[2], 10);
        }
        if (id && (event.target.textContent.indexOf('...') > -1)) {
            var title = (targetId === (this.element.id + '_ChartTitle')) ? this.title :
                targetId.indexOf('_AxisTitle') > -1 ? this.axisCollections[index].title :
                    targetId.indexOf('_ChartSubTitle') > -1 ? this.subTitle : this.legendSettings.title;
            showTooltip(title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    };
    Chart.prototype.axisTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        if (((targetId.indexOf('AxisLabel') > -1) || targetId.indexOf('Axis_MultiLevelLabel') > -1) &&
            (event.target.textContent.indexOf('...') > -1)) {
            var isTitleOrLegendEnabled = (this.legendSettings.visible || this.primaryXAxis.title === '');
            showTooltip(this.findAxisLabel(targetId), x, y, this.element.offsetWidth, this.element.id + '_EJ2_AxisLabel_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch, isTitleOrLegendEnabled);
        }
        else {
            removeElement(this.element.id + '_EJ2_AxisLabel_Tooltip');
        }
    };
    Chart.prototype.findAxisLabel = function (text) {
        var texts;
        if (text.indexOf('AxisLabel') > -1) {
            texts = ((text.replace(this.element.id, '')).replace('AxisLabel_', '')).split('_');
            return this.axisCollections[parseInt(texts[0], 10)].visibleLabels[parseInt(texts[1], 10)].originalText;
        }
        else {
            texts = ((text.replace(this.element.id, '')).replace('Axis_MultiLevelLabel_Level_', '').replace('Text_', '')).split('_');
            return (this.axisCollections[parseInt(texts[0], 10)].multiLevelLabels[parseInt(texts[1], 10)]
                .categories[parseInt(texts[2], 10)].text);
        }
    };
    /**
     * Handles the mouse down on chart.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartOnMouseDown = function (e) {
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var offset = Browser.isDevice ? 20 : 30;
        var rect = this.element.getBoundingClientRect();
        var element = e.target;
        this.trigger(chartMouseDown, { target: element.id, x: this.mouseX, y: this.mouseY });
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            target = touchArg.target;
        }
        else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.clientX;
            pageY = e.clientY;
            target = e.target;
        }
        var svgRect = getElement(this.svgId).getBoundingClientRect();
        this.mouseDownX = this.previousMouseMoveX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        this.mouseDownY = this.previousMouseMoveY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        if (this.isTouch) {
            this.isDoubleTap = (new Date().getTime() < this.threshold && target.id.indexOf(this.element.id + '_Zooming_') === -1 &&
                (this.mouseDownX - offset >= this.mouseX || this.mouseDownX + offset >= this.mouseX) &&
                (this.mouseDownY - offset >= this.mouseY || this.mouseDownY + offset >= this.mouseY) &&
                (this.mouseX - offset >= this.mouseDownX || this.mouseX + offset >= this.mouseDownX) &&
                (this.mouseY - offset >= this.mouseDownY || this.mouseY + offset >= this.mouseDownY));
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseDown();
        }
        this.notify(Browser.touchStartEvent, e);
        return false;
    };
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    Chart.prototype.mouseEnd = function (e) {
        var pageY;
        var pageX;
        var touchArg;
        if (e.type === 'touchend') {
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            this.isTouch = true;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            pageY = e.clientY;
            pageX = e.clientX;
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        this.setMouseXY(pageX, pageY);
        this.chartOnMouseUp(e);
        return false;
    };
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    Chart.prototype.chartOnMouseUp = function (e) {
        var element = e.target;
        this.trigger(chartMouseUp, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.isChartDrag = false;
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.axisTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            this.threshold = new Date().getTime() + 300;
        }
        if (this.dataEditingModule) {
            this.dataEditingModule.pointMouseUp();
        }
        if (!this.enableCanvas) {
            this.seriesElements.removeAttribute('clip-path');
        }
        this.notify(Browser.touchEndEvent, e);
        return false;
    };
    /**
     * Method to set culture for chart
     */
    Chart.prototype.setCulture = function () {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    };
    /**
     * Method to set the annotation content dynamically for chart.
     */
    Chart.prototype.setAnnotationValue = function (annotationIndex, content) {
        var parentNode = getElement(this.element.id + '_Annotation_Collections');
        var annotation = this.annotations[annotationIndex];
        var element;
        if (content !== null) {
            annotation.content = content;
            if (parentNode) {
                removeElement(this.element.id + '_Annotation_' + annotationIndex);
                element = this.createElement('div');
                this.annotationModule.processAnnotation(annotation, annotationIndex, element);
                parentNode.appendChild(element.children[0]);
            }
            else {
                this.annotationModule.renderAnnotations(getElement(this.element.id + '_Secondary_Element'));
            }
        }
    };
    /**
     * Method to set locale constants
     */
    Chart.prototype.setLocaleConstants = function () {
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom in',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom out',
            Pan: 'Pan',
            Reset: 'Reset',
            ResetZoom: 'Reset Zoom'
        };
    };
    /**
     * Theming for chart
     */
    Chart.prototype.setTheme = function () {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    //tslint:disable:max-func-body-length
    Chart.prototype.requiredModules = function () {
        var _this = this;
        var modules = [];
        var series = this.series;
        var enableAnnotation = false;
        var moduleName;
        var errorBarVisible = false;
        var isPointDrag = false;
        var dataLabelEnable = false;
        var zooming = this.zoomSettings;
        this.chartAreaType = (series.length > 0 && (series[0].type === 'Polar' || series[0].type === 'Radar')) ? 'PolarRadar' : 'Cartesian';
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip',
                args: [this]
            });
        }
        series.map(function (value) {
            _this.isLegend = (_this.legendSettings.visible && ((value.name !== '') || !!_this.isLegend));
            moduleName = value.type.indexOf('100') !== -1 ? value.type.replace('100', '') + 'Series' : value.type + 'Series';
            errorBarVisible = value.errorBar.visible || errorBarVisible;
            dataLabelEnable = value.marker.dataLabel.visible || dataLabelEnable;
            isPointDrag = value.dragSettings.enable || isPointDrag;
            if (!modules.some(function (currentModule) {
                return currentModule.member === moduleName;
            })) {
                modules.push({
                    member: moduleName,
                    args: [_this, series]
                });
            }
            if (_this.chartAreaType === 'PolarRadar') {
                modules.push({
                    member: value.drawType + 'Series',
                    args: [_this, series]
                });
            }
            if (value.type === 'Pareto') {
                modules.push({
                    member: 'ColumnSeries',
                    args: [_this, series]
                });
                modules.push({
                    member: 'LineSeries',
                    args: [_this, series]
                });
            }
        });
        this.findIndicatorModules(modules);
        this.findTrendLineModules(modules);
        modules = this.findAxisModule(modules);
        enableAnnotation = this.annotations.some(function (value) {
            return (value.content !== null);
        });
        if (errorBarVisible) {
            modules.push({
                member: 'ErrorBar',
                args: [this, series]
            });
        }
        if (this.isLegend) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.enableExport || this.allowExport) {
            modules.push({
                member: 'Export',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && !this.scrollSettingEnabled && (zooming.enableSelectionZooming
            || zooming.enableMouseWheelZooming || zooming.enablePinchZooming || zooming.enablePan || zooming.enableScrollbar)) {
            modules.push({
                member: 'Zoom',
                args: [this, this.zoomSettings]
            });
            if (zooming.enableScrollbar) {
                modules.push({
                    member: 'ScrollBar',
                    args: [this]
                });
            }
        }
        if (this.selectionMode !== 'None' && !(this.chartAreaType === 'PolarRadar' &&
            this.selectionMode.indexOf('Drag') > -1)) {
            modules.push({
                member: 'Selection',
                args: [this]
            });
        }
        if (this.highlightMode !== 'None') {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (dataLabelEnable) {
            modules.push({
                member: 'DataLabel',
                args: [this, series]
            });
        }
        if (isPointDrag) {
            modules.push({
                member: 'DataEditing',
                args: [this]
            });
        }
        if (enableAnnotation) {
            modules.push({
                member: 'Annotation',
                args: [this]
            });
        }
        if (this.chartAreaType !== 'PolarRadar' && this.crosshair.enable) {
            modules.push({
                member: 'Crosshair',
                args: [this]
            });
        }
        return modules;
    };
    Chart.prototype.findAxisModule = function (modules) {
        var axisCollections = [];
        axisCollections.push(this.primaryXAxis);
        axisCollections.push(this.primaryYAxis);
        axisCollections = axisCollections.concat(this.axes);
        var datetimeEnabled = false;
        var categoryEnabled = false;
        var logarithmicEnabled = false;
        var striplineEnabled = false;
        var dateTimeCategoryEnabled = false;
        var multiLevelEnabled = false;
        for (var _i = 0, axisCollections_1 = axisCollections; _i < axisCollections_1.length; _i++) {
            var axis = axisCollections_1[_i];
            datetimeEnabled = axis.valueType === 'DateTime' || datetimeEnabled;
            categoryEnabled = axis.valueType === 'Category' || categoryEnabled;
            logarithmicEnabled = axis.valueType === 'Logarithmic' || logarithmicEnabled;
            dateTimeCategoryEnabled = axis.valueType === 'DateTimeCategory' || dateTimeCategoryEnabled;
            striplineEnabled = this.findStriplineVisibility(axis.stripLines) || striplineEnabled;
            multiLevelEnabled = axis.multiLevelLabels.length > 0 || multiLevelEnabled;
            this.scrollSettingEnabled = axis.scrollbarSettings.enable ? true : this.scrollSettingEnabled;
        }
        if (datetimeEnabled) {
            modules.push({
                member: 'DateTime',
                args: [this]
            });
        }
        if (categoryEnabled) {
            modules.push({
                member: 'Category',
                args: [this]
            });
        }
        if (logarithmicEnabled) {
            modules.push({
                member: 'Logarithmic',
                args: [this]
            });
        }
        if (striplineEnabled) {
            modules.push({
                member: 'StripLine',
                args: [this]
            });
        }
        if (multiLevelEnabled) {
            modules.push({
                member: 'MultiLevelLabel',
                args: [this]
            });
        }
        if (dateTimeCategoryEnabled) {
            modules.push({
                member: 'DateTimeCategory',
                args: [this]
            });
        }
        if (this.scrollSettingEnabled) {
            modules.push({
                member: 'ScrollBar',
                args: [this]
            });
        }
        return modules;
    };
    Chart.prototype.findIndicatorModules = function (modules) {
        var macdEnable;
        var bandEnable;
        var indicators = this.indicators;
        if (this.indicators.length) {
            modules.push({
                member: 'LineSeries',
                args: [this]
            });
            indicators.map(function (indicator) {
                macdEnable = macdEnable || indicator.type === 'Macd';
                bandEnable = bandEnable || indicator.type === 'BollingerBands';
            });
            if (macdEnable) {
                modules.push({
                    member: 'ColumnSeries',
                    args: [this]
                });
            }
            if (bandEnable) {
                modules.push({
                    member: 'RangeAreaSeries',
                    args: [this]
                });
            }
            for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
                var indicator = _a[_i];
                modules.push({
                    member: indicator.type + 'Indicator',
                    args: [this]
                });
            }
        }
    };
    Chart.prototype.findTrendLineModules = function (modules) {
        var isLine;
        var isSpline;
        var _loop_1 = function (series) {
            var markerEnable;
            series.trendlines.map(function (trendline) {
                markerEnable = markerEnable || trendline.marker.visible;
                isLine = isLine || (trendline.type === 'Linear' || trendline.type === 'MovingAverage') ? true : false;
                isSpline = isSpline || !isLine ? true : false;
            });
            if (markerEnable) {
                modules.push({
                    member: 'Marker',
                    args: [this_1, series]
                });
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
            var series = _a[_i];
            _loop_1(series);
        }
        if (isLine || isSpline) {
            modules.push({
                member: 'TrendLine',
                args: [this]
            });
        }
        if (isLine) {
            modules.push({
                member: 'LineSeries',
                args: [this]
            });
        }
        if (isSpline) {
            modules.push({
                member: 'SplineSeries',
                args: [this]
            });
        }
    };
    Chart.prototype.findStriplineVisibility = function (striplines) {
        var visible = false;
        for (var _i = 0, striplines_1 = striplines; _i < striplines_1.length; _i++) {
            var stripline = striplines_1[_i];
            if (stripline.visible) {
                visible = true;
                break;
            }
        }
        return visible;
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    Chart.prototype.removeSvg = function () {
        if (this.redraw) {
            return null;
        }
        blazorTemplatesReset(this);
        if (this.enableCanvas && this.svgObject && this.svgObject.tagName === 'CANVAS') {
            this.renderer.clearRect(new Rect(0, 0, this.availableSize.width, this.availableSize.height));
            remove(this.svgObject);
            return null;
        }
        removeElement(this.element.id + '_Secondary_Element');
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
        var removeLength = 0;
        if (this.zoomModule && this.zoomModule.pinchTarget) {
            this.zoomModule.pinchTarget.id = '';
            this.zoomModule.pinchTarget.setAttribute('opacity', '0');
            this.svgObject.appendChild(this.zoomModule.pinchTarget);
            removeLength = 1;
        }
        // Fix for blazor resize issue
        if (!isNullOrUndefined(this.resizeTo)) {
            if (this.resizeTo !== this.checkResize && this.isBlazor && this.element.childElementCount) {
                var containerCollection = document.querySelectorAll('.e-chart');
                for (var index = 0; index < containerCollection.length; index++) {
                    var container = containerCollection[index];
                    while (container.firstChild) {
                        remove(container.firstChild);
                    }
                }
            }
            this.checkResize = this.resizeTo;
        }
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode && !(this.stockChart)) {
                remove(this.svgObject);
            }
        }
    };
    Chart.prototype.refreshDefinition = function (definitions) {
        for (var _i = 0, definitions_1 = definitions; _i < definitions_1.length; _i++) {
            var item = definitions_1[_i];
            item.axes = [];
        }
    };
    /**
     * Refresh the axis default value.
     * @return {boolean}
     * @private
     */
    Chart.prototype.refreshAxis = function () {
        var axis = this.primaryXAxis;
        axis.rect = new Rect(undefined, undefined, 0, 0);
        axis = this.primaryYAxis;
        axis.isStack100 = false;
        axis.rect = new Rect(undefined, undefined, 0, 0);
        for (var _i = 0, _a = this.axes; _i < _a.length; _i++) {
            var item = _a[_i];
            axis = item;
            axis.rect = new Rect(undefined, undefined, 0, 0);
            axis.isStack100 = false;
        }
        if (this.paretoSeriesModule && this.series[0].type === 'Pareto') {
            for (var _b = 0, _c = this.paretoSeriesModule.paretoAxes; _b < _c.length; _b++) {
                var item = _c[_b];
                axis = item;
                axis.rect = new Rect(undefined, undefined, 0, 0);
                axis.isStack100 = false;
            }
        }
    };
    Chart.prototype.axisChange = function (axis) {
        if (!axis.name && !axis.valueType) {
            return false;
        }
        this.refreshDefinition(this.columns);
        this.refreshDefinition(this.rows);
        this.calculateVisibleAxis();
        this.processData();
        return true;
    };
    /**
     * Get visible series by index
     */
    Chart.prototype.getVisibleSeries = function (visibleSeries, index) {
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (index === series.index) {
                return series;
            }
        }
        return null;
    };
    /**
     * Fix for live data update flicker issue
     */
    Chart.prototype.refreshLiveData = function () {
        this.calculateVisibleSeries();
        this.initTechnicalIndicators();
        this.initTrendLines();
        this.refreshDefinition(this.columns);
        this.refreshDefinition(this.rows);
        this.calculateVisibleAxis();
        this.processData(false);
        if (!this.isBlazor) {
            this.enableCanvas ? this.createChartSvg() : this.removeSvg();
            this.refreshAxis();
            this.refreshBound();
            this.trigger('loaded', { chart: this.isBlazor ? {} : this });
        }
    };
    /**
     * To remove style element
     */
    Chart.prototype.removeStyles = function () {
        removeElement(this.element.id + '_ej2_chart_selection');
        removeElement(this.element.id + '_ej2_chart_highlight');
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    Chart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        if (Object.keys(newProp).length === 1 && Object.keys(newProp)[0] === 'indicators') {
            //add valid check,it should happen only when property change is triggered for target series
            return;
        }
        this.animateSeries = false;
        if (!this.delayRedraw) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'primaryXAxis':
                        refreshBounds = this.axisChange(newProp.primaryXAxis);
                        if (newProp.primaryXAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryXAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        break;
                    case 'primaryYAxis':
                        refreshBounds = this.axisChange(newProp.primaryYAxis);
                        if (newProp.primaryYAxis.edgeLabelPlacement) {
                            renderer = true;
                        }
                        if (!newProp.primaryYAxis.crosshairTooltip) {
                            refreshBounds = true;
                        }
                        break;
                    case 'axes':
                        for (var _b = 0, _c = Object.keys(newProp.axes); _b < _c.length; _b++) {
                            var index = _c[_b];
                            refreshBounds = refreshBounds || this.axisChange(newProp.axes[index]);
                            if (!newProp.axes[index].crosshairTooltip) {
                                refreshBounds = true;
                            }
                        }
                        break;
                    case 'height':
                    case 'width':
                        this.createChartSvg();
                        refreshBounds = true;
                        break;
                    case 'subTitle':
                    case 'title':
                        refreshBounds = true;
                        break;
                    case 'titleStyle':
                        if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow)) {
                            refreshBounds = true;
                        }
                        else {
                            renderer = true;
                        }
                        break;
                    case 'subTitleStyle':
                        if (newProp.subTitleStyle && (newProp.subTitleStyle.size || newProp.subTitleStyle.textOverflow)) {
                            refreshBounds = true;
                        }
                        else {
                            renderer = true;
                        }
                        break;
                    case 'border':
                        renderer = true;
                        break;
                    case 'dataSource':
                        this.processData(false);
                        refreshBounds = true;
                        break;
                    case 'enableCanvas':
                        this.refresh();
                        break;
                    case 'series':
                        var len = this.series.length;
                        var seriesRefresh = false;
                        var series = void 0;
                        var blazorProp = void 0;
                        for (var i = 0; i < len; i++) {
                            series = newProp.series[i];
                            // I264774 blazor series visible property binding not working issue fixed.
                            if (this.isBlazor && series && ((series.visible !== oldProp.series[i].visible) || series.isClosed ||
                                series.marker || series.emptyPointSettings || series.type || series.boxPlotMode || series.showMean)) {
                                blazorProp = true;
                            }
                            if (series && (series.dataSource || series.query || series.errorBar || series.xName ||
                                series.yName || series.size || series.high || series.low || series.open || series.close ||
                                series.fill || series.name || blazorProp)) {
                                extend(this.getVisibleSeries(this.visibleSeries, i), series, null, true);
                                seriesRefresh = true;
                            }
                        }
                        if (seriesRefresh) {
                            this.calculateVisibleSeries();
                            this.initTechnicalIndicators();
                            this.initTrendLines();
                            this.refreshDefinition(this.columns);
                            this.refreshDefinition(this.rows);
                            this.calculateVisibleAxis();
                            this.processData(false);
                            refreshBounds = true;
                        }
                        break;
                    case 'zoomSettings':
                        if (newProp.zoomSettings.enableScrollbar || oldProp.zoomSettings.enableScrollbar) {
                            refreshBounds = true;
                        }
                        renderer = true;
                        break;
                    case 'background':
                        renderer = true;
                        break;
                    case 'chartArea':
                        if (newProp.chartArea.border && newProp.chartArea.border.width) {
                            refreshBounds = true;
                        }
                        renderer = true;
                        break;
                    case 'legendSettings':
                        if (!newProp.legendSettings.background || !newProp.legendSettings.opacity) {
                            refreshBounds = true;
                        }
                        renderer = true;
                        break;
                    case 'palettes':
                        this.calculateVisibleSeries();
                        renderer = true;
                        break;
                    case 'selectedDataIndexes':
                    case 'selectionMode':
                        if (this.selectionModule && newProp.selectionMode && newProp.selectionMode.indexOf('Drag') === -1) {
                            this.selectionModule.currentMode = this.selectionMode;
                            this.selectionModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'isMultiSelect':
                        if (this.selectionModule && !newProp.isMultiSelect && this.selectionModule.selectedDataIndexes.length > 1) {
                            this.selectionModule.currentMode = this.selectionMode;
                            this.selectionModule.styleId = this.element.id + '_ej2_chart_selection';
                            this.selectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                        break;
                    case 'highlightMode':
                    case 'selectionPattern':
                    case 'highlightPattern':
                        this.removeStyles();
                        renderer = true;
                        break;
                    case 'theme':
                        this.animateSeries = true;
                        break;
                    case 'locale':
                    case 'currencyCode':
                        if (this.isBlazor) {
                            this.setCulture();
                            renderer = true;
                        }
                        else {
                            this.refresh();
                        }
                        break;
                    case 'tooltip':
                        if (this.tooltipModule) { // To check the tooltip enable is true.
                            this.tooltipModule.previousPoints = [];
                        }
                        break;
                }
            }
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderElements();
                this.trigger('loaded', { chart: this.isBlazor ? {} : this });
            }
            if (refreshBounds) {
                this.enableCanvas ? this.createChartSvg() : this.removeSvg();
                // tslint:disable-next-line:no-any
                if (this.isReact) {
                    this.clearTemplate();
                }
                this.refreshAxis();
                this.refreshBound();
                this.trigger('loaded', { chart: this.isBlazor ? {} : this });
                this.redraw = false;
                this.animated = false;
            }
        }
    };
    __decorate([
        Property(null)
    ], Chart.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], Chart.prototype, "height", void 0);
    __decorate([
        Property('')
    ], Chart.prototype, "title", void 0);
    __decorate([
        Property('')
    ], Chart.prototype, "dataSource", void 0);
    __decorate([
        Complex(Theme.chartTitleFont, Font)
    ], Chart.prototype, "titleStyle", void 0);
    __decorate([
        Property('')
    ], Chart.prototype, "subTitle", void 0);
    __decorate([
        Complex(Theme.chartSubTitleFont, Font)
    ], Chart.prototype, "subTitleStyle", void 0);
    __decorate([
        Complex({}, Margin)
    ], Chart.prototype, "margin", void 0);
    __decorate([
        Complex({ color: '#DDDDDD', width: 0 }, Border)
    ], Chart.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], Chart.prototype, "background", void 0);
    __decorate([
        Complex({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
    ], Chart.prototype, "chartArea", void 0);
    __decorate([
        Complex({ name: 'primaryXAxis' }, Axis)
    ], Chart.prototype, "primaryXAxis", void 0);
    __decorate([
        Complex({ name: 'primaryYAxis' }, Axis)
    ], Chart.prototype, "primaryYAxis", void 0);
    __decorate([
        Collection([{}], Row)
    ], Chart.prototype, "rows", void 0);
    __decorate([
        Collection([{}], Column)
    ], Chart.prototype, "columns", void 0);
    __decorate([
        Collection([{}], Axis)
    ], Chart.prototype, "axes", void 0);
    __decorate([
        Collection([{}], Series)
    ], Chart.prototype, "series", void 0);
    __decorate([
        Collection([{}], ChartAnnotationSettings)
    ], Chart.prototype, "annotations", void 0);
    __decorate([
        Property([])
    ], Chart.prototype, "palettes", void 0);
    __decorate([
        Property('Material')
    ], Chart.prototype, "theme", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], Chart.prototype, "tooltip", void 0);
    __decorate([
        Complex({}, CrosshairSettings)
    ], Chart.prototype, "crosshair", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], Chart.prototype, "legendSettings", void 0);
    __decorate([
        Complex({}, ZoomSettings)
    ], Chart.prototype, "zoomSettings", void 0);
    __decorate([
        Property('None')
    ], Chart.prototype, "selectionMode", void 0);
    __decorate([
        Property('None')
    ], Chart.prototype, "highlightMode", void 0);
    __decorate([
        Property('None')
    ], Chart.prototype, "selectionPattern", void 0);
    __decorate([
        Property('None')
    ], Chart.prototype, "highlightPattern", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "isMultiSelect", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "allowMultiSelection", void 0);
    __decorate([
        Property(true)
    ], Chart.prototype, "enableExport", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "allowExport", void 0);
    __decorate([
        Collection([], Indexes)
    ], Chart.prototype, "selectedDataIndexes", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "enableAutoIntervalOnBothAxis", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "isTransposed", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "enableCanvas", void 0);
    __decorate([
        Property(null)
    ], Chart.prototype, "backgroundImage", void 0);
    __decorate([
        Collection([], TechnicalIndicator)
    ], Chart.prototype, "indicators", void 0);
    __decorate([
        Property(true)
    ], Chart.prototype, "enableAnimation", void 0);
    __decorate([
        Property(null)
    ], Chart.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], Chart.prototype, "tabIndex", void 0);
    __decorate([
        Property(true)
    ], Chart.prototype, "enableSideBySidePlacement", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "resized", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "annotationRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "beforeExport", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "afterExport", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "load", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "legendRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "textRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "pointRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "seriesRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "axisLabelRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "axisLabelClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "axisRangeCalculated", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "axisMultiLabelRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "legendClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "multiLevelLabelClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "sharedTooltipRender", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "chartMouseMove", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "chartMouseClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "pointClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "pointDoubleClick", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "pointMove", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "chartMouseLeave", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "chartMouseDown", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "chartMouseUp", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "dragComplete", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "selectionComplete", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "zoomComplete", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "onZooming", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "scrollStart", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "scrollEnd", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "scrollChanged", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "drag", void 0);
    __decorate([
        Event()
    ], Chart.prototype, "dragEnd", void 0);
    __decorate([
        Property('USD')
    ], Chart.prototype, "currencyCode", void 0);
    Chart = __decorate([
        NotifyPropertyChanges
    ], Chart);
    return Chart;
}(Component));
export { Chart };
