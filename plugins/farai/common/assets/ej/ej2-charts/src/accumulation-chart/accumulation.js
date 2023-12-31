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
/**
 * AccumulationChart file
 */
import { Property, Component, Complex, Collection, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { Internationalization, Event, Browser, EventHandler, Touch } from '@syncfusion/ej2-base';
import { remove, extend, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Font, Margin, Border, TooltipSettings, Indexes } from '../common/model/base';
import { AccumulationSeries, PieCenter } from './model/acc-base';
import { Theme, getThemeColor } from '../common/model/theme';
import { load, pointClick } from '../common/model/constants';
import { pointMove, chartMouseClick, chartMouseDown } from '../common/model/constants';
import { chartMouseLeave, chartMouseMove, chartMouseUp, resized } from '../common/model/constants';
import { LegendSettings } from '../common/legend/legend';
import { subtractRect, indexFinder, appendChildElement, redrawElement, blazorTemplatesReset } from '../common/utils/helper';
import { RectOption, showTooltip, ImageOption } from '../common/utils/helper';
import { textElement, createSvg, calculateSize, removeElement, firstToLowerCase, withInBounds } from '../common/utils/helper';
import { getElement, titlePositionX } from '../common/utils/helper';
import { Rect, Size, measureText, TextOption } from '@syncfusion/ej2-svg-base';
import { Data } from '../common/model/data';
import { AccumulationBase } from './renderer/accumulation-base';
import { PieSeries } from './renderer/pie-series';
import { AccumulationAnnotationSettings } from './model/acc-base';
import { getTitle } from '../common/utils/helper';
import { ExportUtils } from '../common/utils/export';
/**
 * Represents the AccumulationChart control.
 * ```html
 * <div id="accumulation"/>
 * <script>
 *   var accObj = new AccumulationChart({ });
 *   accObj.appendTo("#accumulation");
 * </script>
 * ```
 * @public
 */
var AccumulationChart = /** @class */ (function (_super) {
    __extends(AccumulationChart, _super);
    /**
     * Constructor for creating the AccumulationChart widget
     * @private
     */
    function AccumulationChart(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.animateselected = false;
        /** @private explode radius internal property */
        _this.explodeDistance = 0;
        _this.chartid = 57724;
        return _this;
    }
    /**
     * Animate the series bounds on data change.
     * @private
     */
    AccumulationChart.prototype.animate = function (duration) {
        this.duration = duration ? duration : 700;
        this.animateselected = true;
        this.animateSeries = false;
        var temIndex = 0;
        var tempcolor = [];
        var tempindex = [];
        var tempindex1 = [];
        var currentSeries = this.visibleSeries[0];
        var datasource = [];
        datasource = currentSeries.dataSource;
        currentSeries.sumOfPoints = 0;
        if (currentSeries.points.length < Object.keys(currentSeries.dataSource).length) {
            this.refresh();
        }
        else if (currentSeries.points.length > Object.keys(currentSeries.dataSource).length) {
            var currentSeries_1 = this.visibleSeries[0];
            currentSeries_1.points = currentSeries_1.points.filter(function (entry1) {
                entry1.visible = false;
                tempindex.push(entry1.index);
                tempcolor.push(entry1.color);
                return (datasource).some(function (entry2) {
                    var accPoint = entry2;
                    if (entry1.x === accPoint.x) {
                        entry1.visible = true;
                        tempindex1.push(entry1.index);
                        entry1.index = temIndex;
                        temIndex++;
                    }
                    return entry1.x === accPoint.x;
                });
            });
            var missing = tempindex.filter(function (item) { return tempindex1.indexOf(item) < 0; });
            var interval = tempindex.length - missing.length;
            for (var i = (tempindex.length - 1); i >= interval; i--) {
                removeElement('container_Series_0_Point_' + tempindex[i]);
            }
            for (var i = 0; i < currentSeries_1.points.length; i++) {
                currentSeries_1.points[i].y = currentSeries_1.dataSource[i].y;
                currentSeries_1.points[i].color = tempcolor[i];
                currentSeries_1.sumOfPoints += currentSeries_1.dataSource[i].y;
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.calculateBounds();
            this.renderElements();
        }
        else {
            for (var i = 0; i < currentSeries.points.length; i++) {
                currentSeries.points[i].y = currentSeries.dataSource[i].y;
                currentSeries.points[i].color = currentSeries.dataSource[i][currentSeries.pointColorMapping] != null
                    ? currentSeries.dataSource[i][currentSeries.pointColorMapping] : currentSeries.points[i].color;
                currentSeries.sumOfPoints += currentSeries.dataSource[i].y;
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.removeSvg();
            this.refreshPoints(currentSeries.points);
            this.renderElements();
        }
    };
    Object.defineProperty(AccumulationChart.prototype, "type", {
        /** @private */
        get: function () {
            if (this.series && this.series.length) {
                return this.series[0].type;
            }
            return 'Pie';
        },
        enumerable: true,
        configurable: true
    });
    // accumulation chart methods
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    AccumulationChart.prototype.preRender = function () {
        var blazor = 'Blazor';
        this.isBlazor = window[blazor];
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.setCulture();
        this.animateSeries = true;
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-accumulationchart').length;
            this.element.id = 'acc_chart_' + this.chartid + '_' + collection;
        }
        calculateSize(this);
        this.wireEvents();
    };
    /**
     * Themeing for chart goes here
     */
    AccumulationChart.prototype.setTheme = function () {
        /*! Set theme for accumulation chart */
        this.themeStyle = getThemeColor(this.theme);
    };
    /**
     * To render the accumulation chart elements
     */
    AccumulationChart.prototype.render = function () {
        var _this = this;
        if (this.element.className.indexOf('e-accumulationchart') === -1) {
            this.element.classList.add('e-accumulationchart');
        }
        var loadEventData = {
            chart: this.isBlazor ? {} : this,
            accumulation: this.isBlazor ? {} : this,
            theme: this.theme, name: load, cancel: false
        };
        this.trigger(load, loadEventData, function () {
            _this.theme = _this.isBlazor ? loadEventData.theme : _this.theme;
            _this.setTheme();
            _this.accBaseModule = new AccumulationBase(_this);
            _this.pieSeriesModule = new PieSeries(_this);
            _this.calculateVisibleSeries();
            _this.processData();
            _this.renderComplete();
            _this.allowServerDataBinding = true;
        });
    };
    /**
     * Method to unbind events for accumulation chart
     */
    AccumulationChart.prototype.unWireEvents = function () {
        /*! Find the Events type */
        var isIE11Pointer = Browser.isPointer;
        var start = Browser.touchStartEvent;
        var move = Browser.touchMoveEvent;
        var stop = Browser.touchEndEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, move, this.accumulationMouseMove);
        EventHandler.remove(this.element, stop, this.accumulationMouseEnd);
        EventHandler.remove(this.element, start, this.accumulationMouseStart);
        EventHandler.remove(this.element, 'click', this.accumulationOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.accumulationRightClick);
        EventHandler.remove(this.element, cancel, this.accumulationMouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.accumulationResize);
    };
    /**
     * Method to bind events for the accumulation chart
     */
    AccumulationChart.prototype.wireEvents = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /*! Find the Events type */
        var isIE11Pointer = Browser.isPointer;
        var start = Browser.touchStartEvent;
        var stop = Browser.touchEndEvent;
        var move = Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, move, this.accumulationMouseMove, this);
        EventHandler.add(this.element, stop, this.accumulationMouseEnd, this);
        EventHandler.add(this.element, start, this.accumulationMouseStart, this);
        EventHandler.add(this.element, 'click', this.accumulationOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.accumulationRightClick, this);
        EventHandler.add(this.element, cancel, this.accumulationMouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.accumulationResize.bind(this));
        new Touch(this.element); // To avoid geasture blocking for browser
        /*! Apply the style for chart */
        this.setStyle(this.element);
    };
    /**
     * Method to set mouse x, y from events
     */
    AccumulationChart.prototype.setMouseXY = function (e) {
        var pageX;
        var pageY;
        var svgRectElement = getElement(this.element.id + '_svg');
        if (svgRectElement && this.element) {
            var svgRect = svgRectElement.getBoundingClientRect();
            var rect = this.element.getBoundingClientRect();
            if (e.type.indexOf('touch') > -1) {
                this.isTouch = true;
                var touchArg = e;
                pageY = touchArg.changedTouches[0].clientY;
                pageX = touchArg.changedTouches[0].clientX;
            }
            else {
                this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
                pageX = e.clientX;
                pageY = e.clientY;
            }
            this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
            this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        }
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseEnd = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseUp, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            if (this.accumulationDataLabelModule && this.visibleSeries[0].dataLabel.visible) {
                this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY, this.isTouch);
            }
            if (this.accumulationLegendModule && this.legendSettings.visible) {
                this.accumulationLegendModule.move(e);
            }
        }
        this.notify(Browser.touchEndEvent, e);
        return false;
    };
    /*public removeSvgOffset(x: number, y: number): ChartLocation {
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        return { x: (x - rect.left) - Math.max(svgRect.left - rect.left, 0), y: (y - rect.top) - Math.max(svgRect.top - rect.top, 0)};
    }*/
    /**
     * Handles the mouse start.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseStart = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseDown, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        return false;
    };
    /**
     * Handles the accumulation chart resize.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        var args = {
            accumulation: this.isBlazor ? {} : this,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0),
            chart: this.isBlazor ? {} : this,
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            calculateSize(_this);
            args.currentSize = _this.availableSize;
            _this.trigger(resized, args);
            _this.refreshSeries();
            _this.refreshChart();
        }, 500);
        return false;
    };
    /**
     * Handles the print method for accumulation chart control.
     */
    AccumulationChart.prototype.print = function (id) {
        // To handle the print funtion in IE and Edge browsers
        var clippath = document.getElementById(this.element.id + '_Series_0').style.clipPath;
        document.getElementById(this.element.id + '_Series_0').style.clipPath = '';
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
        document.getElementById(this.element.id + '_Series_0').style.clipPath = clippath;
    };
    /**
     * Export method for the chart.
     */
    AccumulationChart.prototype.export = function (type, fileName) {
        if (this.exportModule) {
            this.exportModule.export(type, fileName);
            if (this.afterExport) {
                this.exportModule.getDataUrl(this);
            }
        }
    };
    /**
     * Applying styles for accumulation chart element
     */
    AccumulationChart.prototype.setStyle = function (element) {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    };
    /**
     * Method to set the annotation content dynamically for accumulation.
     */
    AccumulationChart.prototype.setAnnotationValue = function (annotationIndex, content) {
        var annotation = this.annotations[annotationIndex];
        var element;
        var parentNode = getElement(this.element.id + '_Annotation_Collections');
        if (content) {
            annotation.content = content;
            if (parentNode) {
                element = this.createElement('div');
                removeElement(this.element.id + '_Annotation_' + annotationIndex);
                this.annotationModule.processAnnotation(annotation, annotationIndex, element);
                parentNode.appendChild(element.children[0]);
            }
            else {
                this.annotationModule.renderAnnotations(getElement(this.element.id + '_Secondary_Element'));
            }
        }
    };
    /**
     * Handles the mouse move on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseMove = function (e) {
        if (!getElement(this.element.id + '_svg')) {
            return false;
        }
        this.setMouseXY(e);
        this.trigger(chartMouseMove, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, e.target, e);
        }
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.move(e);
        }
        if (this.accumulationDataLabelModule && this.visibleSeries[0] && this.visibleSeries[0].dataLabel.visible) {
            this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.enableBorderOnMouseMove && this.type === 'Pie' && this.pieSeriesModule &&
            withInBounds(this.mouseX, this.mouseY, this.initialClipRect)) {
            this.pieSeriesModule.findSeries(e);
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    };
    AccumulationChart.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        var id = (targetId === (this.element.id + '_title') || targetId === (this.element.id + '_subTitle') ||
            targetId === (this.element.id + '_chart_legend_title'));
        if ((event.target.textContent.indexOf('...') > -1) && id) {
            var title = (targetId === (this.element.id + '_title')) ? this.title : (targetId === (this.element.id + '_subTitle')) ?
                this.subTitle : this.legendSettings.title;
            showTooltip(title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    };
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationOnMouseClick = function (e) {
        this.setMouseXY(e);
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.click(e);
        }
        if (this.selectionMode !== 'None' && this.accumulationSelectionModule) {
            this.accumulationSelectionModule.calculateSelectedElements(this, e);
        }
        if (this.visibleSeries[0].explode) {
            this.accBaseModule.processExplode(e);
        }
        if (this.enableBorderOnMouseMove && this.pieSeriesModule && this.type === 'Pie') {
            this.pieSeriesModule.findSeries(e);
        }
        this.trigger(chartMouseClick, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick, e.target, e);
        }
        return false;
    };
    AccumulationChart.prototype.triggerPointEvent = function (event, element, e) {
        var evt = e;
        var indexes = indexFinder(element.id, true);
        if (indexes.series >= 0 && indexes.point >= 0) {
            this.trigger(event, { series: this.isBlazor ? {} : this.series[indexes.series],
                point: this.series[indexes.series].points[indexes.point],
                seriesIndex: indexes.series, pointIndex: indexes.point,
                x: this.mouseX, y: this.mouseY, pageX: evt.pageX, pageY: evt.pageY });
        }
    };
    /**
     * Handles the mouse right click on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationRightClick = function (event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    /**
     * Handles the mouse leave on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseLeave = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseLeave, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        var borderElement = document.getElementById(this.element.id + 'PointHover_Border');
        if (borderElement) {
            this.pieSeriesModule.removeBorder(borderElement, 1000);
            borderElement = null;
        }
        return false;
    };
    /**
     * Method to set culture for chart
     */
    AccumulationChart.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * Method to create SVG element for accumulation chart.
     */
    AccumulationChart.prototype.createPieSvg = function () {
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the SVG from accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.removeSvg = function () {
        if (this.redraw) {
            return null;
        }
        blazorTemplatesReset(this);
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        removeElement('EJ2_legend_tooltip');
        removeElement('EJ2_datalabel_tooltip');
        removeElement(this.element.id + 'PointHover_Border');
    };
    /**
     * Method to create the secondary element for tooltip, datalabel and annotaitons.
     */
    AccumulationChart.prototype.createSecondaryElement = function () {
        var element = redrawElement(this.redraw, this.element.id + '_Secondary_Element') ||
            this.createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: relative'
            });
        appendChildElement(false, this.element, element, this.redraw);
    };
    /**
     * Method to find visible series based on series types
     */
    AccumulationChart.prototype.calculateVisibleSeries = function () {
        this.visibleSeries = [];
        for (var i = 0, length_1 = this.series.length; i < length_1; i++) {
            this.series[i].index = i;
            if (this.series[i].type === this.type && this.visibleSeries.length === 0) {
                this.visibleSeries.push(this.series[i]);
                break;
            }
        }
    };
    /**
     * To find points from dataSource
     */
    AccumulationChart.prototype.processData = function (render) {
        if (render === void 0) { render = true; }
        this.seriesCounts = 0;
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
            series.refreshDataManager(this, render);
        }
    };
    /**
     * To refresh the accumulation chart
     * @private
     */
    AccumulationChart.prototype.refreshChart = function () {
        this.doGrouppingProcess();
        this.createPieSvg();
        this.calculateBounds();
        this.renderElements();
        removeElement('chartmeasuretext');
    };
    /**
     * Method to find groupped points
     */
    AccumulationChart.prototype.doGrouppingProcess = function () {
        var series = this.visibleSeries[0];
        if (!isNullOrUndefined(series.resultData) && ((!isNullOrUndefined(series.lastGroupTo) &&
            series.lastGroupTo !== series.groupTo))) {
            series.getPoints(series.resultData, this);
        }
    };
    /**
     * Method to calculate bounds for accumulation chart
     */
    AccumulationChart.prototype.calculateBounds = function () {
        this.initialClipRect = new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height);
        this.titleCollection = [];
        this.subTitleCollection = [];
        var titleHeight = 0;
        var subTitleHeight = 0;
        var maxWidth = 0;
        var titleWidth = 0;
        this.titleCollection = getTitle(this.title, this.titleStyle, this.initialClipRect.width);
        titleHeight = this.title ? measureText(this.title, this.titleStyle).height * this.titleCollection.length : titleHeight;
        if (this.subTitle) {
            for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
                var titleText = _a[_i];
                titleWidth = measureText(titleText, this.titleStyle).width;
                maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
            }
            this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
            subTitleHeight = (measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length);
        }
        subtractRect(this.initialClipRect, new Rect(0, (subTitleHeight + titleHeight), this.margin.right + this.margin.left, this.margin.bottom + this.margin.top));
        this.calculateLegendBounds();
    };
    /*
     * Method to calculate legend bounds for accumulation chart
     */
    AccumulationChart.prototype.calculateLegendBounds = function () {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        this.accumulationLegendModule.getLegendOptions(this, this.visibleSeries);
        this.accumulationLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
    };
    /**
     * To render elements for accumulation chart
     * @private
     */
    AccumulationChart.prototype.renderElements = function () {
        this.renderBorder();
        this.createSecondaryElement();
        this.renderSeries();
        this.renderTitle();
        this.renderLegend();
        appendChildElement(false, this.element, this.svgObject, this.redraw);
        this.processSelection();
        this.processExplode();
        this.renderAnnotation();
        this.setSecondaryElementPosition();
        updateBlazorTemplate(this.element.id + '_DataLabel', 'Template', this.series[0].dataLabel);
        this.trigger('loaded', { accumulation: this.isBlazor ? {} : this, chart: this.isBlazor ? {} : this });
        this.animateSeries = false;
    };
    /**
     * To set the left and top position for data label template for center aligned chart
     * @private
     */
    AccumulationChart.prototype.setSecondaryElementPosition = function () {
        var tooltipParent = getElement(this.element.id + '_Secondary_Element');
        if (!tooltipParent) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        tooltipParent.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        tooltipParent.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    /**
     * To render the annotaitions for accumulation series.
     * @private
     */
    AccumulationChart.prototype.renderAnnotation = function () {
        if (this.annotationModule) {
            this.annotationModule.renderAnnotations(getElement(this.element.id + '_Secondary_Element'));
        }
    };
    /**
     * Method to process the explode in accumulation chart
     * @private
     */
    AccumulationChart.prototype.processExplode = function () {
        if (this.redraw) {
            return null;
        }
        if (!this.visibleSeries[0].explode) {
            return null;
        }
        this.accBaseModule.invokeExplode();
    };
    /**
     * Method to render series for accumulation chart
     */
    AccumulationChart.prototype.renderSeries = function () {
        if (!this.redraw) {
            this.svgObject.appendChild(this.renderer.createGroup({ id: this.element.id + '_SeriesCollection' }));
        }
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.visible && this[(firstToLowerCase(series.type) + 'SeriesModule')]) {
                this[(firstToLowerCase(series.type) + 'SeriesModule')].initProperties(this, series);
                series.renderSeries(this, this.redraw);
            }
        }
    };
    /**
     * Method to render border for accumulation chart
     */
    AccumulationChart.prototype.renderBorder = function () {
        var padding = this.border.width;
        appendChildElement(false, this.svgObject, this.renderer.drawRectangle(new RectOption(this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1, new Rect(padding / 2, padding / 2, this.availableSize.width - padding, this.availableSize.height - padding))), this.redraw);
        // to draw back ground image for accumulation chart        
        var backGroundImage = this.backgroundImage;
        if (backGroundImage) {
            var image = new ImageOption(this.availableSize.height - padding, this.availableSize.width - padding, backGroundImage, 0, 0, this.element.id + '_background', 'visible', 'none');
            appendChildElement(false, this.svgObject, this.renderer.drawImage(image), this.redraw);
        }
    };
    /**
     * Method to render legend for accumulation chart
     */
    AccumulationChart.prototype.renderLegend = function () {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.accumulationLegendModule.legendCollections.length) {
            if (this.visibleSeries[0].type === 'Pie') {
                this.accumulationLegendModule.getSmartLegendLocation(this.visibleSeries[0].labelBound, this.accumulationLegendModule.legendBounds, this.margin);
            }
            this.accumulationLegendModule.renderLegend(this, this.legendSettings, this.accumulationLegendModule.legendBounds, this.redraw);
        }
    };
    /**
     * To process the selection in accumulation chart
     * @private
     */
    AccumulationChart.prototype.processSelection = function () {
        if (!this.accumulationSelectionModule || this.selectionMode === 'None') {
            return null;
        }
        var selectedDataIndexes = extend([], this.accumulationSelectionModule.selectedDataIndexes, null, true);
        this.accumulationSelectionModule.invokeSelection(this);
        if (selectedDataIndexes.length > 0) {
            this.accumulationSelectionModule.selectedDataIndexes = selectedDataIndexes;
            this.accumulationSelectionModule.redrawSelection(this, this.selectionMode);
        }
    };
    /**
     * To render title for accumulation chart
     */
    AccumulationChart.prototype.renderTitle = function () {
        var rect;
        var margin = this.margin;
        if (!this.title) {
            return null;
        }
        var alignment = this.titleStyle.textAlignment;
        var getAnchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        var titleSize = measureText(this.title, this.titleStyle);
        rect = new Rect(margin.left, 0, this.availableSize.width - margin.left - margin.right, 0);
        var options = new TextOption(this.element.id + '_title', titlePositionX(rect, this.titleStyle), this.margin.top + (titleSize.height * 3 / 4), getAnchor, this.titleCollection, '', 'auto');
        var element = textElement(this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject, false, this.redraw);
        if (element) {
            element.setAttribute('aria-label', this.title);
        }
        if (this.subTitle) {
            this.renderSubTitle(options);
        }
    };
    AccumulationChart.prototype.renderSubTitle = function (options) {
        var maxWidth = 0;
        var titleWidth = 0;
        var padding = 10;
        var rect;
        var alignment = this.titleStyle.textAlignment;
        var getAnchor = function (alignment) {
            return alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        };
        var subTitleElementSize = measureText(this.subTitle, this.subTitleStyle);
        for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
            var titleText = _a[_i];
            titleWidth = measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        rect = new Rect(alignment === 'Center' ? (options.x - maxWidth / 2) : alignment === 'Far' ? options.x - maxWidth : options.x, 0, maxWidth, 0);
        var subTitleOption = new TextOption(this.element.id + '_subTitle', titlePositionX(rect, this.subTitleStyle), options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding, getAnchor(this.subTitleStyle.textAlignment), this.subTitleCollection, '', 'auto');
        var element = textElement(this.renderer, subTitleOption, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject, false, this.redraw);
    };
    /**
     * To get the series parent element
     * @private
     */
    AccumulationChart.prototype.getSeriesElement = function () {
        return this.svgObject.getElementsByTagName('g')[0];
    };
    /**
     * To refresh the all visible series points
     * @private
     */
    AccumulationChart.prototype.refreshSeries = function () {
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            this.refreshPoints(series.points);
        }
    };
    /**
     * To refresh points label region and visible
     * @private
     */
    AccumulationChart.prototype.refreshPoints = function (points) {
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            point.labelPosition = null;
            point.labelRegion = null;
            point.labelVisible = true;
        }
    };
    /**
     * To get Module name
     *  @private
     */
    AccumulationChart.prototype.getModuleName = function () {
        return 'accumulationchart';
    };
    /**
     * To destroy the accumulationcharts
     * @private
     */
    AccumulationChart.prototype.destroy = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            _super.prototype.destroy.call(this);
            this.element.classList.remove('e-accumulationchart');
            this.element.innerHTML = '';
        }
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    AccumulationChart.prototype.requiredModules = function () {
        var modules = [];
        var enableAnnotation = false;
        modules.push({
            member: this.type + 'Series',
            args: [this]
        });
        if (this.legendSettings.visible) {
            modules.push({
                member: 'AccumulationLegend',
                args: [this]
            });
        }
        if (this.findDatalabelVisibility()) {
            modules.push({
                member: 'AccumulationDataLabel',
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'AccumulationTooltip',
                args: [this]
            });
        }
        if (this.selectionMode !== 'None') {
            modules.push({
                member: 'AccumulationSelection',
                args: [this]
            });
        }
        if (this.enableExport || this.allowExport) {
            modules.push({
                member: 'Export',
                args: [this]
            });
        }
        enableAnnotation = this.annotations.some(function (value) {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'Annotation',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To find datalabel visibility in series
     */
    AccumulationChart.prototype.findDatalabelVisibility = function () {
        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.dataLabel.visible) {
                return true;
            }
        }
        return false;
    };
    /**
     * Get visible series for accumulation chart by index
     */
    AccumulationChart.prototype.changeVisibleSeries = function (visibleSeries, index) {
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (index === series.index) {
                return series;
            }
        }
        return null;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    AccumulationChart.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    AccumulationChart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var update = {
            refreshElements: false, refreshBounds: false
        };
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'theme':
                    this.animateSeries = true;
                    break;
                case 'title':
                case 'subTitle':
                case 'height':
                case 'width':
                case 'margin':
                    update.refreshBounds = true;
                    break;
                case 'titleStyle':
                    if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    }
                    else {
                        update.refreshElements = true;
                    }
                    break;
                case 'subTitleStyle':
                    if (newProp.subTitleStyle && (newProp.subTitleStyle.size || newProp.subTitleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    }
                    else {
                        update.refreshElements = true;
                    }
                    break;
                case 'legendSettings':
                    update.refreshBounds = true;
                    update.refreshElements = true;
                    break;
                case 'dataSource':
                    this.processData(false);
                    update.refreshBounds = true;
                    break;
                case 'series':
                    if (!this.animateselected) {
                        var len = this.series.length;
                        var seriesRefresh = false;
                        var series = void 0;
                        var blazorProp = void 0;
                        for (var i = 0; i < len; i++) {
                            series = newProp.series[i];
                            if (this.isBlazor && (series.startAngle || series.endAngle || series.explodeOffset || series.neckHeight ||
                                series.neckWidth || series.radius || series.innerRadius || series.groupMode || series.emptyPointSettings)) {
                                blazorProp = true;
                            }
                            if (newProp.series[i] && (newProp.series[i].dataSource || newProp.series[i].yName || newProp.series[i].xName ||
                                blazorProp)) {
                                extend(this.changeVisibleSeries(this.visibleSeries, i), series, null, true);
                                seriesRefresh = true;
                            }
                            if (newProp.series[i] && newProp.series[i].explodeIndex !== oldProp.series[i].explodeIndex) {
                                this.accBaseModule.explodePoints(newProp.series[i].explodeIndex, this);
                                this.accBaseModule.deExplodeAll(newProp.series[i].explodeIndex, this.enableAnimation ? 300 : 0);
                            }
                        }
                        if (seriesRefresh) {
                            this.processData(false);
                            update.refreshBounds = true;
                        }
                    }
                    this.animateselected = false;
                    this.redraw = false;
                    break;
                case 'locale':
                case 'currencyCode':
                    _super.prototype.refresh.call(this);
                    break;
                case 'background':
                case 'border':
                case 'annotations':
                case 'enableSmartLabels':
                    update.refreshElements = true;
                    break;
                case 'isMultiSelect':
                case 'selectedDataIndexes':
                case 'selectionMode':
                    if (this.accumulationSelectionModule) {
                        if (isNullOrUndefined(this.accumulationSelectionModule.selectedDataIndexes)) {
                            this.accumulationSelectionModule.invokeSelection(this);
                        }
                        else {
                            this.accumulationSelectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                    }
                    break;
            }
        }
        if (!update.refreshBounds && update.refreshElements) {
            this.createPieSvg();
            this.renderElements();
        }
        else if (update.refreshBounds) {
            this.refreshSeries();
            this.createPieSvg();
            this.calculateBounds();
            this.renderElements();
        }
    };
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "title", void 0);
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "backgroundImage", void 0);
    __decorate([
        Complex({}, PieCenter)
    ], AccumulationChart.prototype, "center", void 0);
    __decorate([
        Property('')
    ], AccumulationChart.prototype, "dataSource", void 0);
    __decorate([
        Complex(Theme.chartTitleFont, Font)
    ], AccumulationChart.prototype, "titleStyle", void 0);
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "subTitle", void 0);
    __decorate([
        Complex(Theme.chartSubTitleFont, Font)
    ], AccumulationChart.prototype, "subTitleStyle", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], AccumulationChart.prototype, "legendSettings", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], AccumulationChart.prototype, "tooltip", void 0);
    __decorate([
        Property('None')
    ], AccumulationChart.prototype, "selectionMode", void 0);
    __decorate([
        Property('None')
    ], AccumulationChart.prototype, "highLightMode", void 0);
    __decorate([
        Property('None')
    ], AccumulationChart.prototype, "selectionPattern", void 0);
    __decorate([
        Property('None')
    ], AccumulationChart.prototype, "highlightPattern", void 0);
    __decorate([
        Property(true)
    ], AccumulationChart.prototype, "enableBorderOnMouseMove", void 0);
    __decorate([
        Property(false)
    ], AccumulationChart.prototype, "isMultiSelect", void 0);
    __decorate([
        Property(true)
    ], AccumulationChart.prototype, "enableAnimation", void 0);
    __decorate([
        Collection([], Indexes)
    ], AccumulationChart.prototype, "selectedDataIndexes", void 0);
    __decorate([
        Complex({}, Margin)
    ], AccumulationChart.prototype, "margin", void 0);
    __decorate([
        Property(true)
    ], AccumulationChart.prototype, "enableSmartLabels", void 0);
    __decorate([
        Complex({ color: '#DDDDDD', width: 0 }, Border)
    ], AccumulationChart.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], AccumulationChart.prototype, "background", void 0);
    __decorate([
        Collection([{}], AccumulationSeries)
    ], AccumulationChart.prototype, "series", void 0);
    __decorate([
        Collection([{}], AccumulationAnnotationSettings)
    ], AccumulationChart.prototype, "annotations", void 0);
    __decorate([
        Property('Material')
    ], AccumulationChart.prototype, "theme", void 0);
    __decorate([
        Property(false)
    ], AccumulationChart.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(true)
    ], AccumulationChart.prototype, "enableExport", void 0);
    __decorate([
        Property(false)
    ], AccumulationChart.prototype, "allowExport", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "load", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "seriesRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "legendRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "textRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "pointRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "annotationRender", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "chartMouseMove", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "chartMouseClick", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "pointClick", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "pointMove", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "chartMouseDown", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "chartMouseLeave", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "chartMouseUp", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "resized", void 0);
    __decorate([
        Event()
    ], AccumulationChart.prototype, "afterExport", void 0);
    __decorate([
        Property('USD')
    ], AccumulationChart.prototype, "currencyCode", void 0);
    AccumulationChart = __decorate([
        NotifyPropertyChanges
    ], AccumulationChart);
    return AccumulationChart;
}(Component));
export { AccumulationChart };
