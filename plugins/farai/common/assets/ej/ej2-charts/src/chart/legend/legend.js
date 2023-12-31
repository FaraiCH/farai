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
 * Chart legend
 */
import { remove, Browser, extend } from '@syncfusion/ej2-base';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { textTrim, removeElement, RectOption, withInBounds, blazorTemplatesReset } from '../../common/utils/helper';
import { getUnicodeText } from '../../common/utils/helper';
import { measureText, Rect, getElement } from '@syncfusion/ej2-svg-base';
import { legendRender, legendClick, regSub, regSup } from '../../common/model/constants';
/**
 * `Legend` module is used to render legend for the chart.
 */
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend(chart) {
        var _this = _super.call(this, chart) || this;
        _this.library = _this;
        _this.addEventListener();
        return _this;
    }
    /**
     * Binding events for legend module.
     */
    Legend.prototype.addEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
    };
    /**
     * UnBinding events for legend module.
     */
    Legend.prototype.removeEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
    };
    /**
     * To handle mosue move for legend module
     */
    Legend.prototype.mouseMove = function (e) {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
            if (this.chart.highlightModule && this.chart.highlightMode !== 'None') {
                this.click(e);
            }
        }
    };
    /**
     * To handle mosue end for legend module
     */
    Legend.prototype.mouseEnd = function (e) {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    };
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    Legend.prototype.getLegendOptions = function (visibleSeriesCollection, chart) {
        this.legendCollections = [];
        var seriesType;
        var fill;
        for (var _i = 0, visibleSeriesCollection_1 = visibleSeriesCollection; _i < visibleSeriesCollection_1.length; _i++) {
            var series = visibleSeriesCollection_1[_i];
            if (series.category !== 'Indicator' && series.name !== '') {
                seriesType = (chart.chartAreaType === 'PolarRadar') ? series.drawType :
                    series.type;
                // To set legend color when use pointColorMapping
                fill = series.pointColorMapping ? (series.points[0].interior ? series.points[0].interior : series.interior) :
                    series.interior;
                this.legendCollections.push(new LegendOptions(series.name, fill, series.legendShape, (series.category === 'TrendLine' ?
                    this.chart.series[series.sourceIndex].trendlines[series.index].visible : series.visible), seriesType, series.marker.shape, series.marker.visible));
            }
        }
    };
    /** @private */
    Legend.prototype.getLegendBounds = function (availableSize, legendBounds, legend) {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        var padding = legend.padding;
        var titlePosition = legend.titlePosition;
        var extraHeight = 0;
        var extraWidth = 0;
        var arrowWidth = this.arrowWidth;
        var arrowHeight = this.arrowHeight;
        var verticalArrowSpace = this.isVertical && !legend.enablePages ? arrowHeight : 0;
        var titleSpace = this.isTitle && titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        titleSpace = this.isTitle && this.isVertical && titlePosition !== 'Top' ? this.legendTitleSize.height + this.fivePixel : titleSpace;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        }
        else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.height += (extraHeight);
        legendBounds.width += extraWidth;
        var shapeWidth = legend.shapeWidth;
        var shapePadding = legend.shapePadding;
        var maximumWidth = 0;
        var rowWidth = 0;
        var legendWidth = 0;
        var columnHeight = 0;
        var rowCount = 0;
        var titlePlusArrowSpace = 0;
        var legendEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        var render = false;
        for (var _i = 0, _a = this.legendCollections; _i < _a.length; _i++) {
            var legendOption = _a[_i];
            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                markerShape: legendOption.markerShape, name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.markerShape = legendEventArgs.markerShape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                rowWidth = rowWidth + legendWidth;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - (this.isVertical ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical ? 0 : legendWidth;
                    rowCount++;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + titleSpace + verticalArrowSpace;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleSpace);
        this.isPaging = legendBounds.height < columnHeight;
        if (this.isPaging && !legend.enablePages) {
            if (this.isVertical) {
                columnHeight = columnHeight;
            }
            else {
                columnHeight = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = rowCount;
        if (!this.isPaging && !this.isVertical) {
            rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
        if (render) {
            this.setBounds(Math.max((rowWidth + padding), maximumWidth), columnHeight, legend, legendBounds);
        }
        else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    };
    /** @private */
    Legend.prototype.getRenderPoint = function (legendOption, start, textPadding, prevLegend, rect, count, firstLegend) {
        var padding = this.legend.padding;
        var previousBound = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            legendOption.location.x = start.x;
            legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        }
        else {
            legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOption.location.y = prevLegend.location.y;
        }
        var availwidth = (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text, this.legend.textStyle);
    };
    /** @private */
    Legend.prototype.LegendClick = function (seriesIndex, event) {
        var chart = this.chart;
        var series = chart.visibleSeries[seriesIndex];
        var legend = this.legendCollections[seriesIndex];
        var changeDetection = 'isProtectedOnChange';
        var legendClickArgs = {
            legendText: legend.text, legendShape: legend.shape,
            chart: chart.isBlazor ? {} : chart, series: series, name: legendClick, cancel: false
        };
        if (chart.legendSettings.toggleVisibility) {
            if (series.category === 'TrendLine') {
                if (!chart.series[series.sourceIndex].trendlines[series.index].visible) {
                    chart.series[series.sourceIndex].trendlines[series.index].visible = true;
                }
                else {
                    chart.series[series.sourceIndex].trendlines[series.index].visible = false;
                }
            }
            else {
                series.chart[changeDetection] = true;
                this.changeSeriesVisiblity(series, series.visible);
            }
        }
        this.chart.trigger(legendClick, legendClickArgs);
        series.legendShape = legendClickArgs.legendShape;
        if (series.fill !== null) {
            chart.visibleSeries[seriesIndex].interior = series.fill;
        }
        var selectedDataIndexes = [];
        if (chart.selectionModule) {
            selectedDataIndexes = extend([], chart.selectionModule.selectedDataIndexes, null, true);
        }
        if (chart.legendSettings.toggleVisibility) {
            legend.visible = series.category === 'TrendLine' ? chart.series[series.sourceIndex].trendlines[series.index].visible :
                (series.visible);
            if ((chart.svgObject.childNodes.length > 0) && !chart.enableAnimation && !chart.enableCanvas) {
                while (chart.svgObject.lastChild) {
                    chart.svgObject.removeChild(chart.svgObject.lastChild);
                }
                remove(chart.svgObject);
            }
            chart.animateSeries = false;
            chart.redraw = chart.enableAnimation;
            blazorTemplatesReset(chart);
            removeElement(getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]);
            this.redrawSeriesElements(series, chart);
            chart.removeSvg();
            chart.refreshAxis();
            series.refreshAxisLabel();
            this.refreshSeries(chart.visibleSeries);
            chart.markerRender.removeHighlightedMarker();
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart });
            if (selectedDataIndexes.length > 0) {
                chart.selectionModule.selectedDataIndexes = selectedDataIndexes;
                chart.selectionModule.redrawSelection(chart, chart.selectionMode);
            }
            if (chart.highlightModule && chart.highlightMode !== 'None') {
                chart.highlightModule.redrawSelection(chart, chart.highlightMode);
            }
            chart.redraw = false;
        }
        else if (chart.selectionModule) {
            chart.selectionModule.legendSelection(chart, seriesIndex, event);
        }
        else if (chart.highlightModule) {
            chart.highlightModule.legendSelection(chart, seriesIndex, event);
        }
        series.chart[changeDetection] = false;
    };
    Legend.prototype.changeSeriesVisiblity = function (series, visibility) {
        series.visible = !visibility;
        if (this.isSecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some(function (value) { return (value.visible); });
        }
        if (this.isSecondaryAxis(series.yAxis)) {
            series.yAxis.internalVisibility = series.yAxis.series.some(function (value) { return (value.visible); });
        }
    };
    Legend.prototype.isSecondaryAxis = function (axis) {
        return (this.chart.axes.indexOf(axis) > -1);
    };
    Legend.prototype.redrawSeriesElements = function (series, chart) {
        if (!chart.redraw) {
            return null;
        }
        removeElement(chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) +
            '_DataLabelCollections');
    };
    Legend.prototype.refreshSeries = function (seriesCollection) {
        for (var _i = 0, seriesCollection_1 = seriesCollection; _i < seriesCollection_1.length; _i++) {
            var series = seriesCollection_1[_i];
            series.position = undefined;
        }
    };
    /**
     * To show the tooltip for the trimmed text in legend.
     * @return {void}
     */
    Legend.prototype.click = function (event) {
        var _this = this;
        if (!this.chart.legendSettings.visible) {
            return;
        }
        var pageX = this.chart.mouseX;
        var pageY = this.chart.mouseY;
        var legendRegion = [];
        var targetId = event.target.id;
        var legendItemsId = [this.legendID + '_text_', this.legendID + '_shape_marker_',
            this.legendID + '_shape_'];
        var seriesIndex;
        for (var _i = 0, legendItemsId_1 = legendItemsId; _i < legendItemsId_1.length; _i++) {
            var id = legendItemsId_1[_i];
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.LegendClick(seriesIndex, event);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
        else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        if (this.chart.enableCanvas && this.pagingRegions.length) {
            this.checkWithinBounds(pageX, pageY);
        }
        legendRegion = this.legendRegions.filter(function (region) {
            return (withInBounds(pageX, (pageY + (_this.isPaging ? (_this.currentPageNumber - 1) * _this.translatePage(null, 1, 2) : 0)), region.rect));
        });
        if (legendRegion.length && this.chart.enableCanvas) {
            this.LegendClick(legendRegion[0].index, event);
        }
    };
    /**
     * To check click position is within legend bounds
     */
    Legend.prototype.checkWithinBounds = function (pageX, pageY) {
        var cRender = this.chart.renderer;
        var bounds = this.legendBounds;
        var borderWidth = this.chart.legendSettings.border.width;
        var canvasRect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        canvasRect.x = canvasRect.x - borderWidth / 2;
        canvasRect.y = canvasRect.y - borderWidth / 2;
        canvasRect.width = canvasRect.width + borderWidth;
        canvasRect.height = canvasRect.height + borderWidth;
        if (withInBounds(pageX, pageY, this.pagingRegions[0])) {
            // pagedown calculations are performing here
            if (--this.currentPageNumber > 0) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transparent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            }
            else {
                ++this.currentPageNumber;
            }
            return null;
        }
        if (withInBounds(pageX, pageY, this.pagingRegions[1])) {
            // pageUp calculations are performing here
            if (++this.currentPageNumber > 0 && this.currentPageNumber <= this.totalNoOfPages) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transpaent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            }
            else {
                --this.currentPageNumber;
            }
            return null;
        }
    };
    /**
     * Get module name
     */
    Legend.prototype.getModuleName = function () {
        return 'Legend';
    };
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    Legend.prototype.destroy = function (chart) {
        this.removeEventListener();
    };
    return Legend;
}(BaseLegend));
export { Legend };
