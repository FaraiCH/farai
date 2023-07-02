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
import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { measureText, Rect, TextOption, Size, PathOption } from '@syncfusion/ej2-svg-base';
import { Font, Border, Margin } from '../model/base';
import { Theme } from '../model/theme';
import { subtractThickness, Thickness, drawSymbol, ChartLocation, titlePositionX, getTitle, textTrim } from '../utils/helper';
import { RectOption, textElement, stringToNumber } from '../utils/helper';
import { removeElement, showTooltip, getElement, appendChildElement } from '../utils/helper';
/**
 * Configures the location for the legend.
 */
var Location = /** @class */ (function (_super) {
    __extends(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], Location.prototype, "x", void 0);
    __decorate([
        Property(0)
    ], Location.prototype, "y", void 0);
    return Location;
}(ChildProperty));
export { Location };
/**
 * Configures the legends in charts.
 */
var LegendSettings = /** @class */ (function (_super) {
    __extends(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], LegendSettings.prototype, "visible", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "width", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, Location)
    ], LegendSettings.prototype, "location", void 0);
    __decorate([
        Property('Auto')
    ], LegendSettings.prototype, "position", void 0);
    __decorate([
        Property(8)
    ], LegendSettings.prototype, "padding", void 0);
    __decorate([
        Property('Center')
    ], LegendSettings.prototype, "alignment", void 0);
    __decorate([
        Complex(Theme.legendLabelFont, Font)
    ], LegendSettings.prototype, "textStyle", void 0);
    __decorate([
        Property(10)
    ], LegendSettings.prototype, "shapeHeight", void 0);
    __decorate([
        Property(10)
    ], LegendSettings.prototype, "shapeWidth", void 0);
    __decorate([
        Complex({}, Border)
    ], LegendSettings.prototype, "border", void 0);
    __decorate([
        Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    ], LegendSettings.prototype, "margin", void 0);
    __decorate([
        Property(5)
    ], LegendSettings.prototype, "shapePadding", void 0);
    __decorate([
        Property('transparent')
    ], LegendSettings.prototype, "background", void 0);
    __decorate([
        Property(1)
    ], LegendSettings.prototype, "opacity", void 0);
    __decorate([
        Property(true)
    ], LegendSettings.prototype, "toggleVisibility", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "description", void 0);
    __decorate([
        Property(3)
    ], LegendSettings.prototype, "tabIndex", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "title", void 0);
    __decorate([
        Complex(Theme.legendTitleFont, Font)
    ], LegendSettings.prototype, "titleStyle", void 0);
    __decorate([
        Property('Top')
    ], LegendSettings.prototype, "titlePosition", void 0);
    __decorate([
        Property(100)
    ], LegendSettings.prototype, "maximumTitleWidth", void 0);
    __decorate([
        Property(true)
    ], LegendSettings.prototype, "enablePages", void 0);
    return LegendSettings;
}(ChildProperty));
export { LegendSettings };
/**
 * Legend base class for Chart and Accumulation chart.
 * @private
 */
var BaseLegend = /** @class */ (function () {
    /**
     * Constructor for the dateTime module.
     * @private
     */
    function BaseLegend(chart) {
        this.fivePixel = 5;
        this.rowCount = 0; // legend row counts per page
        this.columnCount = 0; // legend column counts per page
        this.pageButtonSize = 8;
        this.pageXCollections = []; // pages of x locations
        this.maxColumns = 0;
        this.isTrimmed = false;
        this.maxWidth = 0;
        this.currentPage = 1;
        this.backwardArrowOpacity = 0;
        this.forwardArrowOpacity = 1;
        this.arrowWidth = (2 * (this.fivePixel + this.pageButtonSize + this.fivePixel));
        this.arrowHeight = this.arrowWidth;
        this.legendTitleCollections = [];
        this.isTop = false;
        this.isTitle = false;
        this.currentPageNumber = 1;
        this.legendRegions = [];
        this.pagingRegions = [];
        this.chart = chart;
        this.legend = chart.legendSettings;
        this.legendID = chart.element.id + '_chart_legend';
        this.isChartControl = (chart.getModuleName() === 'chart');
        this.isBulletChartControl = (chart.getModuleName() === 'bulletChart');
        this.bulletChart = this.chart;
    }
    /**
     * Calculate the bounds for the legends.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.calculateLegendBounds = function (rect, availableSize, maxLabelSize) {
        var legend = this.legend;
        this.getPosition(legend.position, availableSize);
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        var defaultValue = (this.isBulletChartControl) ? '40%' : '20%';
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(legend.height, availableSize.height - (rect.y - this.chart.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || defaultValue, availableSize.width);
        }
        else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || defaultValue, availableSize.height);
        }
        this.library.getLegendBounds(availableSize, this.legendBounds, legend);
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize, maxLabelSize);
    };
    /**
     * To find legend position based on available size for chart and accumulation chart
     */
    BaseLegend.prototype.getPosition = function (position, availableSize) {
        var chart = this.chart;
        var accumulation = this.chart;
        if (this.isChartControl || this.isBulletChartControl) {
            this.position = (position !== 'Auto') ? position : 'Bottom';
        }
        else {
            if (position === 'Auto' && ((chart || accumulation).visibleSeries && (chart || accumulation).visibleSeries[0].type === 'Funnel' || (chart || accumulation).visibleSeries[0].type === 'Pyramid')) {
                position = 'Top';
            }
            this.position = (position !== 'Auto') ? position :
                (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        }
    };
    /**
     * To set bounds for chart and accumulation chart
     */
    BaseLegend.prototype.setBounds = function (computedWidth, computedHeight, legend, legendBounds) {
        var titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        if (this.isVertical && this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
            titleHeight += (this.pageButtonSize + this.fivePixel);
        }
        computedWidth = Math.min(computedWidth, legendBounds.width);
        computedHeight = Math.min(computedHeight, legendBounds.height);
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        if (!this.isBulletChartControl) {
            if (this.isTop && legend.titleStyle.textOverflow !== 'None') {
                this.calculateLegendTitle(legend, legendBounds);
                legendBounds.height += legend.titleStyle.textOverflow === 'Wrap' && this.legendTitleCollections.length > 1 ?
                    (this.legendTitleSize.height - (this.legendTitleSize.height / this.legendTitleCollections.length)) : 0;
            }
        }
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding - titleHeight) /
            (this.maxItemHeight + legend.padding)));
    };
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    BaseLegend.prototype.getLocation = function (position, alignment, legendBounds, rect, availableSize, maxLabelSize) {
        var padding = this.legend.border.width;
        var isBulletChart = this.isBulletChartControl;
        var bulletChart = this.bulletChart;
        var labelIns = bulletChart.labelPosition === 'Inside';
        var ticklIns = bulletChart.tickPosition === 'Inside';
        var isVertical = bulletChart.orientation === 'Vertical';
        // tslint:disable-next-line:max-line-length
        var categoryFieldValue = (isBulletChart && bulletChart.categoryField !== '') ? maxLabelSize.width + this.chart.border.width + padding * 3 : 0;
        var legendHeight = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom;
        var legendWidth = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right;
        var marginBottom = this.chart.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            // tslint:disable-next-line:max-line-length
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            legendBounds.y += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns
                // tslint:disable-next-line:max-line-length
                //tslint:disable-next-line:max-line-length
                && !isVertical) ? bulletChart.majorTickLines.height + marginBottom + this.legend.border.width + padding * 2 :
                (isVertical && bulletChart.categoryField !== '') ? maxLabelSize.height + padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, 0, legendHeight));
        }
        else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            legendBounds.y -= (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
                // // tslint:disable-next-line:max-line-length
                !isVertical) ? bulletChart.majorTickLines.height + this.chart.margin.top : 0;
            legendHeight -= (isBulletChart) ? -padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, legendHeight, 0));
        }
        else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) - this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            legendWidth += (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
                isVertical) ? (this.chart.margin.left + this.chart.margin.right + bulletChart.majorTickLines.height) : 0;
            subtractThickness(rect, new Thickness(0, legendWidth, 0, 0));
        }
        else if (position === 'Left') {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            legendWidth += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns &&
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line:max-line-length
                isVertical) ? (legendBounds.x - this.chart.margin.left + padding + bulletChart.majorTickLines.height) :
                (bulletChart.orientation !== 'Vertical' && bulletChart.categoryField !== '') ? categoryFieldValue : 0;
            subtractThickness(rect, new Thickness(legendWidth, 0, 0, 0));
        }
        else {
            legendBounds.x = this.legend.location.x;
            legendBounds.y = this.legend.location.y;
            subtractThickness(rect, new Thickness(0, 0, 0, 0));
        }
    };
    /**
     * To find legend alignment for chart and accumulation chart
     */
    BaseLegend.prototype.alignLegend = function (start, size, legendSize, alignment) {
        switch (alignment) {
            case 'Far':
                start = (size - legendSize) - start;
                break;
            case 'Center':
                start = ((size - legendSize) / 2);
                break;
        }
        return start;
    };
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.renderLegend = function (chart, legend, legendBounds, redraw) {
        var firstLegend = this.findFirstLegendPosition(this.legendCollections);
        var padding = legend.padding;
        var titleHeight = 0;
        var titlePlusArrowWidth = 0;
        var isPaging = legend.enablePages;
        var titlePosition = legend.titlePosition;
        var upArrowHeight = this.isPaging && !legend.enablePages && this.isVertical ? this.pageButtonSize : 0;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollections[0].textSize.height, legend.shapeHeight);
        var legendGroup = chart.renderer.createGroup({ id: this.legendID + '_g' });
        var legendTranslateGroup = this.createLegendElements(chart, legendBounds, legendGroup, legend, this.legendID, redraw);
        // For new legend navigation
        if (!isPaging && this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = !this.isTitle ? 0 : titlePosition === 'Left' ? this.legendTitleSize.width : 0;
            titlePlusArrowWidth += (this.pageButtonSize + (2 * this.fivePixel));
        }
        else if (!this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = this.isTitle && titlePosition === 'Left' ? (this.fivePixel + this.legendTitleSize.width) : 0;
        }
        titleHeight = !this.isTitle ? 0 : (this.isTop || this.isVertical ? this.legendTitleSize.height : 0);
        var pagingLegendBounds = new Rect(0, 0, 0, 0);
        var requireLegendBounds = new Rect(0, 0, 0, 0);
        if (firstLegend !== this.legendCollections.length) {
            var legendSeriesGroup = void 0; // legendItem group for each series group element
            var start = void 0; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new ChartLocation(legendBounds.x + titlePlusArrowWidth + padding + (legend.shapeWidth / 2), legendBounds.y + titleHeight + upArrowHeight + padding + this.maxItemHeight / 2);
            var anchor = chart.isRtlEnabled ? 'end' : 'start';
            var textOptions = new TextOption('', start.x, start.y, anchor);
            //  initialization for totalPages legend click totalpage again calculate
            this.totalPages = this.totalPages = (this.isChartControl || this.isBulletChartControl) ? this.totalPages : 0;
            var textPadding = legend.shapePadding + padding + legend.shapeWidth;
            var count = 0;
            this.pageXCollections = [];
            this.legendCollections[firstLegend].location = start;
            var previousLegend = this.legendCollections[firstLegend];
            if (!legend.enablePages && this.isPaging) {
                var x = start.x - this.fivePixel;
                var y = start.y - this.fivePixel;
                var rightSpace = this.isTitle && !this.isVertical && titlePosition === 'Right' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                var leftSpace = this.isTitle && !this.isVertical && titlePosition === 'Left' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                rightSpace += this.isVertical ? 0 : (this.fivePixel + this.pageButtonSize + this.fivePixel);
                var bottomSapce = this.isVertical ? (this.pageButtonSize) + Math.abs(y - legendBounds.y) : 0;
                pagingLegendBounds = new Rect(x, y, legendBounds.width - rightSpace - leftSpace, legendBounds.height - bottomSapce);
                requireLegendBounds = pagingLegendBounds;
            }
            else {
                requireLegendBounds = legendBounds;
            }
            for (var _i = 0, _a = this.legendCollections; _i < _a.length; _i++) {
                var legendOption = _a[_i];
                if (this.chart.getModuleName() === 'accumulationchart') {
                    // tslint:disable-next-line:max-line-length
                    legendOption.fill = (this.chart || this.chart).visibleSeries[0].points[legendOption.pointIndex].color;
                }
                this.accessbilityText = (this.isBulletChartControl) ? 'Legend of bullet chart' + '' + legendOption.text
                    : 'Click to show or hide the ' + legendOption.text + ' series';
                if (legendOption.render && legendOption.text !== '') {
                    legendSeriesGroup = chart.renderer.createGroup({
                        id: this.legendID + this.generateId(legendOption, '_g_', count)
                    });
                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('tabindex', legend.tabIndex.toString());
                        legendSeriesGroup.setAttribute('aria-label', legend.description ||
                            this.accessbilityText);
                    }
                    this.library.getRenderPoint(legendOption, start, textPadding, previousLegend, requireLegendBounds, count, firstLegend);
                    this.renderSymbol(legendOption, legendSeriesGroup, count);
                    this.renderText(chart, legendOption, legendSeriesGroup, textOptions, count);
                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('style', 'cursor: ' + ((!legend.toggleVisibility && (chart.selectionMode === 'None' ||
                            chart.highlightMode === 'None' ||
                            chart.selectionMode === 'None') || this.isBulletChartControl) ? 'auto' : 'pointer'));
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendSeriesGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(chart, legendBounds, textOptions, legendGroup);
            }
            else {
                this.totalPages = 1;
            }
        }
        appendChildElement(chart.enableCanvas, chart.svgObject, legendGroup, redraw);
    };
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    BaseLegend.prototype.findFirstLegendPosition = function (legendCollection) {
        var count = 0;
        for (var _i = 0, legendCollection_1 = legendCollection; _i < legendCollection_1.length; _i++) {
            var legend = legendCollection_1[_i];
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    };
    /**
     * To get the legend title text width and height.
     * @param legend
     * @param legendBounds
     */
    BaseLegend.prototype.calculateLegendTitle = function (legend, legendBounds) {
        if (legend.title) {
            this.isTop = legend.titlePosition === 'Top';
            var padding = legend.titleStyle.textOverflow === 'Trim' ? 2 * legend.padding : 0;
            if (this.isTop || this.isVertical) {
                this.legendTitleCollections = getTitle(legend.title, legend.titleStyle, (legendBounds.width - padding));
            }
            else {
                this.legendTitleCollections[0] = textTrim(legend.maximumTitleWidth, legend.title, legend.titleStyle);
            }
            var text = this.isTop ? legend.title : this.legendTitleCollections[0];
            this.legendTitleSize = measureText(text, legend.titleStyle);
            this.legendTitleSize.height *= this.legendTitleCollections.length;
        }
        else {
            this.legendTitleSize = new Size(0, 0);
        }
    };
    /**
     * Render the legend title
     * @param chart
     * @param legend
     * @param legendBounds
     * @param legendGroup
     */
    BaseLegend.prototype.renderLegendTitle = function (chart, legend, legendBounds, legendGroup) {
        var padding = legend.padding;
        this.isTop = legend.titlePosition === 'Top';
        var alignment = legend.titleStyle.textAlignment;
        var anchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        anchor = this.isTop || this.isVertical ? anchor : '';
        var x = titlePositionX(legendBounds, legend.titleStyle);
        x = alignment === 'Near' ? (x + padding) : alignment === 'Far' ? (x - padding) : x;
        x = (this.isTop || this.isVertical) ? x : ((legendBounds.x) + (legend.titlePosition === 'Left' ? 5 :
            (legendBounds.width - this.legendTitleSize.width - 5)));
        var topPadding = (legendBounds.height / 2) + (this.legendTitleSize.height / 4);
        var y = legendBounds.y + (!this.isTop && !this.isVertical ? topPadding :
            (this.legendTitleSize.height / this.legendTitleCollections.length));
        var legendTitleTextOptions = new TextOption(this.legendID + '_title', x, y, anchor, this.legendTitleCollections);
        textElement(chart.renderer, legendTitleTextOptions, legend.titleStyle, legend.titleStyle.color, legendGroup);
    };
    /**
     * To create legend rendering elements for chart and accumulation chart
     * @param chart
     * @param legendBounds
     * @param legendGroup
     * @param legend
     * @param id
     * @param redraw
     */
    BaseLegend.prototype.createLegendElements = function (chart, legendBounds, legendGroup, legend, id, redraw) {
        var padding = legend.padding;
        var options = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        legendGroup ? legendGroup.appendChild(chart.renderer.drawRectangle(options)) : chart.renderer.drawRectangle(options);
        if (legend.title) {
            this.renderLegendTitle(chart, legend, legendBounds, legendGroup);
        }
        var legendItemsGroup = chart.renderer.createGroup({ id: id + '_collections' });
        var isCanvas = chart.enableCanvas;
        if (!isCanvas) {
            legendGroup.appendChild(legendItemsGroup);
        }
        this.legendTranslateGroup = chart.renderer.createGroup({ id: id + '_translate_g' });
        if (!isCanvas) {
            legendItemsGroup.appendChild(this.legendTranslateGroup);
        }
        var clippath = chart.renderer.createClipPath({ id: id + '_clipPath' });
        options.y += padding + (this.isTop ? this.legendTitleSize.height : 0);
        options.id += '_clipPath_rect';
        options.width = ((!this.isChartControl && chart.getModuleName() !== 'bulletChart') && this.isVertical) ? this.maxWidth - padding : legendBounds.width;
        if (!isCanvas) {
            this.clipRect = chart.renderer.drawRectangle(options);
            clippath.appendChild(this.clipRect);
        }
        else {
            this.pagingClipRect = options;
        }
        appendChildElement(isCanvas, chart.svgObject, clippath, redraw);
        if (!isCanvas) {
            legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
        return this.legendTranslateGroup;
    };
    /**
     * To render legend symbols for chart and accumulation chart
     */
    BaseLegend.prototype.renderSymbol = function (legendOption, group, i) {
        var borderColor;
        var control = this.isBulletChartControl ? this.chart : null;
        var symbolColor = legendOption.visible ? legendOption.fill : '#D3D3D3';
        var shape = (legendOption.shape === 'SeriesType') ? legendOption.type : legendOption.shape;
        shape = shape === 'Scatter' ? legendOption.markerShape : shape;
        var isStrokeWidth = (this.chart.getModuleName() === 'chart' && (legendOption.shape === 'SeriesType') &&
            (legendOption.type.toLowerCase().indexOf('line') > -1) && (legendOption.type.toLowerCase().indexOf('area') === -1));
        var strokewidth = isStrokeWidth ? this.chart.visibleSeries[i].width :
            (this.isBulletChartControl && legendOption.shape === 'Multiply') ? 4 : 1;
        var isCustomBorder = this.chart.getModuleName() === 'chart' &&
            (legendOption.type === 'Scatter' || legendOption.type === 'Bubble');
        if (isCustomBorder && i < this.chart.visibleSeries.length) {
            var seriesBorder = this.chart.visibleSeries[i].border;
            borderColor = seriesBorder.color ? seriesBorder.color : symbolColor;
            strokewidth = seriesBorder.width ? seriesBorder.width : 1;
        }
        var symbolOption = new PathOption(this.legendID + this.generateId(legendOption, '_shape_', i), symbolColor, strokewidth, (isCustomBorder ? borderColor : symbolColor), 1, '', '');
        var regionPadding;
        var isCanvas = this.chart.enableCanvas;
        if (!isCanvas) {
            group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '', 
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:align
            symbolOption, this.accessbilityText, this.chart.renderer, null, this.isBulletChartControl, control));
        }
        else {
            regionPadding = -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber);
            drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '', 
            // tslint:disable-next-line:align
            symbolOption, this.accessbilityText, this.chart.renderer, this.currentPageNumber ? new Rect(0, regionPadding, 0, 0) : null, this.isBulletChartControl, control);
            this.legendRegions.push({
                rect: new Rect(legendOption.location.x, legendOption.location.y, 
                // tslint:disable-next-line:align
                this.legend.shapeWidth, this.legend.shapeHeight + regionPadding), index: i
            });
        }
        if (shape === 'Line' && legendOption.markerVisibility && legendOption.markerShape !== 'Image' ||
            legendOption.type === 'Doughnut') {
            symbolOption.id = this.legendID + this.generateId(legendOption, '_shape_marker_', i);
            shape = legendOption.type === 'Doughnut' ? 'Circle' : legendOption.markerShape;
            symbolOption.fill = legendOption.type === 'Doughnut' ? '#FFFFFF' : symbolOption.fill;
            if (!isCanvas) {
                // tslint:disable-next-line:max-line-length
                group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2), 
                // tslint:disable-next-line:align
                '', symbolOption, this.accessbilityText, null, null, this.isBulletChartControl, control));
            }
            else {
                drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2), 
                // tslint:disable-next-line:align
                '', symbolOption, this.accessbilityText, this.chart.renderer, this.currentPageNumber ?
                    new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) : null, this.isBulletChartControl, control);
            }
        }
    };
    /**
     * To render legend text for chart and accumulation chart
     */
    BaseLegend.prototype.renderText = function (chart, legendOption, group, textOptions, i) {
        var legend = chart.legendSettings;
        var hiddenColor = '#D3D3D3';
        textOptions.id = this.legendID + this.generateId(legendOption, '_text_', i);
        var fontcolor = legendOption.visible ? legend.textStyle.color || chart.themeStyle.legendLabel : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        var isCanvas = this.chart.enableCanvas;
        var element = textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false, null, this.currentPageNumber && isCanvas ?
            new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) : null);
        if (element) {
            element.setAttribute('aria-label', legend.description || this.accessbilityText);
        }
        if (isCanvas) {
            var textSize = measureText(textOptions.text, legend.textStyle);
            this.legendRegions[i].rect.y = textOptions.y < this.legendRegions[i].rect.y ? textOptions.y : this.legendRegions[i].rect.y;
            this.legendRegions[i].rect.width += textSize.width;
            this.legendRegions[i].rect.height = textSize.height;
            this.legendRegions[i].rect.y -= textSize.height * 0.5;
        }
    };
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    // tslint:disable-next-line:max-func-body-length
    BaseLegend.prototype.renderPagingElements = function (chart, bounds, textOption, legendGroup) {
        var paginggroup = chart.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        var pageTextElement;
        var isCanvas = chart.enableCanvas;
        var titleHeight = this.isBulletChartControl ? 0 : this.legendTitleSize.height;
        this.backwardArrowOpacity = this.currentPage !== 1 ? 1 : 0;
        this.forwardArrowOpacity = this.currentPage === this.totalPages ? 0 : 1;
        if (!isCanvas) {
            legendGroup.appendChild(paginggroup);
        }
        var grayColor = '#545454';
        var legend = chart.legendSettings; // to solve parameter lint error, legend declaration is here
        var padding = 8; // const padding for paging elements
        if (this.isChartControl || this.isBulletChartControl || !this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        }
        else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        var symbolOption = new PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        var iconSize = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        var rowCount = !legend.enablePages && this.isPaging && !this.isVertical && !this.isBulletChartControl ? 1 :
            (this.rowCount - 1);
        this.clipPathHeight = rowCount * (this.maxItemHeight + legend.padding);
        if (!isCanvas) {
            this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        }
        else {
            //paging clipRect only for canvas mode
            this.pagingClipRect.height = this.legendBounds.height - this.clipPathHeight -
                (this.pagingClipRect.y - this.legendBounds.y) - legend.border.width;
            this.pagingClipRect.y = this.pagingClipRect.y + this.clipPathHeight;
            this.pagingClipRect.x += legend.border.width;
            this.pagingClipRect.width -= (legend.border.width + legend.border.width / 2);
            this.chart.renderer.clearRect(new Rect(this.pagingClipRect.x, this.pagingClipRect.y, this.pagingClipRect.width, this.pagingClipRect.height));
        }
        var titleWidth = this.isTitle && legend.titlePosition === 'Left' ? this.legendTitleSize.width : 0;
        var x = (bounds.x + iconSize / 2);
        var y = bounds.y + this.clipPathHeight + ((titleHeight + bounds.height - this.clipPathHeight) / 2);
        if (this.isPaging && !legend.enablePages && !this.isVertical && !this.isBulletChartControl) {
            x = (bounds.x + this.fivePixel + this.pageButtonSize + titleWidth);
            y = legend.title && this.isTop ? (bounds.y + padding + titleHeight + (iconSize / 1) + 0.5) :
                (bounds.y + padding + iconSize + 0.5);
        }
        var size = measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + (iconSize / 2) + padding + titleHeight;
                symbolOption.opacity = this.backwardArrowOpacity;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'UpArrow', new Size(iconSize, iconSize), '', symbolOption, 'UpArrow'));
            }
            else {
                symbolOption.opacity = this.isBulletChartControl ? symbolOption.opacity :
                    (legend.enablePages ? 1 : this.backwardArrowOpacity);
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow'));
            }
        }
        else {
            drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow', this.chart.renderer, new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5, y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        if (isCanvas && this.totalNoOfPages) {
            textOption.text = this.currentPageNumber + '/' + this.totalNoOfPages;
        }
        if (legend.enablePages || this.isBulletChartControl) {
            pageTextElement = textElement(chart.renderer, textOption, legend.textStyle, legend.textStyle.color, paginggroup, false, false, false, false, null, new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        // Page right arrow rendering calculation started here
        x = textOption.x + padding + (iconSize / 2) + size.width;
        if (this.isPaging && !legend.enablePages && !this.isVertical) {
            x = (bounds.x + bounds.width - this.fivePixel - this.pageButtonSize - (legend.title && legend.titlePosition === 'Right' ?
                this.legendTitleSize.width + this.fivePixel : 0));
        }
        symbolOption.id = this.legendID + '_pagedown';
        symbolOption.opacity = !legend.enablePages ? this.forwardArrowOpacity : 1;
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + bounds.height - (iconSize / 2) - padding;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'DownArrow', new Size(iconSize, iconSize), '', symbolOption, 'DownArrow'));
            }
            else {
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption, 'RightArrow'));
            }
        }
        else {
            drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption, 'RightArrow', this.chart.renderer, new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5), y - iconSize * 0.5, iconSize, iconSize));
        if (!isCanvas && (legend.enablePages || this.isBulletChartControl)) {
            //placing the navigation buttons and page numbering in legend right corner
            paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
                padding + size.width)) + ', ' + 0 + ')');
        }
        else {
            if (this.currentPageNumber === 1 && this.calTotalPage && (legend.enablePages || this.isBulletChartControl)) {
                this.totalNoOfPages = this.totalPages;
                this.calTotalPage = false;
            }
            if (!legend.enablePages && !this.isBulletChartControl) { // For new legend page navigation
                this.translatePage(null, this.currentPage - 1, this.currentPage, legend);
            }
        }
        if (legend.enablePages || this.isBulletChartControl) {
            this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage, legend);
        }
    };
    /**
     * To translate legend pages for chart and accumulation chart
     */
    BaseLegend.prototype.translatePage = function (pagingText, page, pageNumber, legend) {
        var size = (this.clipPathHeight) * page;
        var translate = 'translate(0,-' + size + ')';
        if (!this.isChartControl && !this.isBulletChartControl && this.isVertical) {
            var pageLength = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
        }
        if (!this.chart.enableCanvas) {
            this.legendTranslateGroup.setAttribute('transform', translate);
        }
        if (!this.chart.enableCanvas && (legend.enablePages || this.isBulletChartControl)) {
            pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        }
        this.currentPage = pageNumber;
        return size;
    };
    /**
     * To change legend pages for chart and accumulation chart
     */
    BaseLegend.prototype.changePage = function (event, pageUp) {
        var legend = this.chart.legendSettings;
        var backwardArrow = document.getElementById(this.legendID + '_pageup');
        var forwardArrow = document.getElementById(this.legendID + '_pagedown');
        var pageText = (legend.enablePages || this.isBulletChartControl) ?
            document.getElementById(this.legendID + '_pagenumber') : null;
        var page = (legend.enablePages || this.isBulletChartControl) ? parseInt(pageText.textContent.split('/')[0], 10) :
            this.currentPage;
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1), legend);
        }
        else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1), legend);
        }
        if (this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            this.currentPage === this.totalPages ? this.hideArrow(forwardArrow) : this.showArrow(forwardArrow);
            this.currentPage === 1 ? this.hideArrow(backwardArrow) : this.showArrow(backwardArrow);
        }
    };
    /**
     * To hide the backward and forward arrow
     * @param arrowElement
     */
    BaseLegend.prototype.hideArrow = function (arrowElement) {
        arrowElement.setAttribute('opacity', '0');
    };
    /**
     * To show the  backward and forward arrow
     * @param arrowElement
     */
    BaseLegend.prototype.showArrow = function (arrowElement) {
        arrowElement.setAttribute('opacity', '1');
    };
    /**
     * To find legend elements id based on chart or accumulation chart
     * @private
     */
    BaseLegend.prototype.generateId = function (option, prefix, count) {
        if (this.isChartControl) {
            return prefix + count;
        }
        else {
            return prefix + option.pointIndex;
        }
    };
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.move = function (event) {
        var _this = this;
        var x = this.chart.mouseX;
        var y = this.chart.mouseY;
        if (event.target.textContent.indexOf('...') > -1) {
            var targetId = event.target.id.split(this.legendID + '_text_');
            if (targetId.length === 2) {
                var index = parseInt(targetId[1], 10);
                var element = this.chart.element;
                if (!isNaN(index)) {
                    if (this.chart.isTouch) {
                        removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    }
                    if (this.isChartControl) {
                        showTooltip(this.chart.series[index].name, x, y, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip', getElement(this.chart.element.id + '_Secondary_Element'));
                    }
                    else {
                        showTooltip(this.chart.visibleSeries[0].points[index].x.toString(), x + 10, y + 10, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip', getElement(this.chart.element.id + '_Secondary_Element'));
                    }
                }
            }
        }
        else {
            removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
        if (this.chart.isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = setTimeout(function () { removeElement(_this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
        }
    };
    return BaseLegend;
}());
export { BaseLegend };
/**
 * Class for legend options
 * @private
 */
var LegendOptions = /** @class */ (function () {
    function LegendOptions(text, fill, shape, visible, type, markerShape, markerVisibility, pointIndex, seriesIndex) {
        this.location = { x: 0, y: 0 };
        this.text = text;
        this.fill = fill;
        this.shape = shape;
        this.visible = visible;
        this.type = type;
        this.markerVisibility = markerVisibility;
        this.markerShape = markerShape;
        this.pointIndex = pointIndex;
        this.seriesIndex = seriesIndex;
    }
    return LegendOptions;
}());
export { LegendOptions };
