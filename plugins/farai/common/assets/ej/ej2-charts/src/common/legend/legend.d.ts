import { ChildProperty } from '@syncfusion/ej2-base';
import { Rect, TextOption, Size } from '@syncfusion/ej2-svg-base';
import { Chart, ILegendRegions } from '../../chart';
import { LegendSettingsModel, LocationModel } from './legend-model';
import { MarginModel, FontModel, BorderModel } from '../model/base-model';
import { ChartLocation } from '../utils/helper';
import { RectOption } from '../utils/helper';
import { LegendPosition, LegendShape, ChartSeriesType, ChartShape } from '../../chart/utils/enum';
import { Legend } from '../../chart/legend/legend';
import { AccumulationType } from '../../accumulation-chart/model/enum';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccumulationLegend } from '../../accumulation-chart/renderer/legend';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { BulletChartLegend } from '../../bullet-chart/legend/legend';
import { Alignment, LegendTitlePosition } from '../utils/enum';
/**
 * Configures the location for the legend.
 */
export declare class Location extends ChildProperty<Location> {
    /**
     * X coordinate of the legend in pixels.
     * @default 0
     */
    x: number;
    /**
     * Y coordinate of the legend in pixels.
     * @default 0
     */
    y: number;
}
/**
 * Configures the legends in charts.
 */
export declare class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * If set to true, legend will be visible.
     * @default true
     */
    visible: boolean;
    /**
     * The height of the legend in pixels.
     * @default null
     */
    height: string;
    /**
     * The width of the legend in pixels.
     * @default null
     */
    width: string;
    /**
     * Specifies the location of the legend, relative to the chart.
     * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */
    location: LocationModel;
    /**
     * Position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     * * Custom: Displays the legend  based on the given x and y values.
     * @default 'Auto'
     */
    position: LegendPosition;
    /**
     * Option to customize the padding between legend items.
     * @default 8
     */
    padding: number;
    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.
     * @default 'Center'
     */
    alignment: Alignment;
    /**
     * Options to customize the legend text.
     */
    textStyle: FontModel;
    /**
     * Shape height of the legend in pixels.
     * @default 10
     */
    shapeHeight: number;
    /**
     * Shape width of the legend in pixels.
     * @default 10
     */
    shapeWidth: number;
    /**
     * Options to customize the border of the legend.
     */
    border: BorderModel;
    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */
    margin: MarginModel;
    /**
     * Padding between the legend shape and text.
     * @default 5
     */
    shapePadding: number;
    /**
     * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    background: string;
    /**
     * Opacity of the legend.
     * @default 1
     */
    opacity: number;
    /**
     * If set to true, series' visibility collapses based on the legend visibility.
     * @default true
     */
    toggleVisibility: boolean;
    /**
     * Description for legends.
     * @default null
     */
    description: string;
    /**
     * TabIndex value for the legend.
     * @default 3
     */
    tabIndex: number;
    /**
     * Title for legends.
     * @default null
     */
    title: string;
    /**
     * Options to customize the legend title.
     */
    titleStyle: FontModel;
    /**
     * legend title position
     * @default 'Top'
     */
    titlePosition: LegendTitlePosition;
    /**
     * maximum width for the legend title.
     * @default 100
     */
    maximumTitleWidth: number;
    /**
     * If set to true, legend will be visible using pages.
     * @default true
     */
    enablePages: boolean;
}
/**
 * Legend base class for Chart and Accumulation chart.
 * @private
 */
export declare class BaseLegend {
    protected chart: Chart | AccumulationChart | BulletChart;
    protected legend: LegendSettingsModel;
    protected maxItemHeight: number;
    protected isPaging: boolean;
    private clipPathHeight;
    totalPages: number;
    protected isVertical: boolean;
    protected fivePixel: number;
    private rowCount;
    private columnCount;
    protected pageButtonSize: number;
    protected pageXCollections: number[];
    protected maxColumns: number;
    private isTrimmed;
    maxWidth: number;
    protected legendID: string;
    private clipRect;
    private legendTranslateGroup;
    protected currentPage: number;
    protected backwardArrowOpacity: number;
    protected forwardArrowOpacity: number;
    private isChartControl;
    private isBulletChartControl;
    private accessbilityText;
    protected arrowWidth: number;
    protected arrowHeight: number;
    protected library: Legend | AccumulationLegend | BulletChartLegend;
    /**  @private */
    position: LegendPosition;
    /**
     * Gets the legend bounds in chart.
     * @private
     */
    legendBounds: Rect;
    /** @private */
    legendCollections: LegendOptions[];
    private legendTitleCollections;
    protected legendTitleSize: Size;
    private isTop;
    protected isTitle: boolean;
    /** @private */
    clearTooltip: number;
    protected pagingClipRect: RectOption;
    protected currentPageNumber: number;
    protected legendRegions: ILegendRegions[];
    protected pagingRegions: Rect[];
    protected totalNoOfPages: number;
    /** @private */
    calTotalPage: boolean;
    private bulletChart;
    /**
     * Constructor for the dateTime module.
     * @private
     */
    constructor(chart?: Chart | AccumulationChart | BulletChart);
    /**
     * Calculate the bounds for the legends.
     * @return {void}
     * @private
     */
    calculateLegendBounds(rect: Rect, availableSize: Size, maxLabelSize: Size): void;
    /**
     * To find legend position based on available size for chart and accumulation chart
     */
    private getPosition;
    /**
     * To set bounds for chart and accumulation chart
     */
    protected setBounds(computedWidth: number, computedHeight: number, legend: LegendSettingsModel, legendBounds: Rect): void;
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    private getLocation;
    /**
     * To find legend alignment for chart and accumulation chart
     */
    private alignLegend;
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    renderLegend(chart: Chart | AccumulationChart | BulletChart, legend: LegendSettingsModel, legendBounds: Rect, redraw?: boolean): void;
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    private findFirstLegendPosition;
    /**
     * To get the legend title text width and height.
     * @param legend
     * @param legendBounds
     */
    protected calculateLegendTitle(legend: LegendSettingsModel, legendBounds: Rect): void;
    /**
     * Render the legend title
     * @param chart
     * @param legend
     * @param legendBounds
     * @param legendGroup
     */
    private renderLegendTitle;
    /**
     * To create legend rendering elements for chart and accumulation chart
     * @param chart
     * @param legendBounds
     * @param legendGroup
     * @param legend
     * @param id
     * @param redraw
     */
    private createLegendElements;
    /**
     * To render legend symbols for chart and accumulation chart
     */
    protected renderSymbol(legendOption: LegendOptions, group: Element, i: number): void;
    /**
     * To render legend text for chart and accumulation chart
     */
    protected renderText(chart: Chart | AccumulationChart | BulletChart, legendOption: LegendOptions, group: Element, textOptions: TextOption, i: number): void;
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    private renderPagingElements;
    /**
     * To translate legend pages for chart and accumulation chart
     */
    protected translatePage(pagingText: Element, page: number, pageNumber: number, legend?: LegendSettingsModel): number;
    /**
     * To change legend pages for chart and accumulation chart
     */
    protected changePage(event: Event, pageUp: boolean): void;
    /**
     * To hide the backward and forward arrow
     * @param arrowElement
     */
    private hideArrow;
    /**
     * To show the  backward and forward arrow
     * @param arrowElement
     */
    private showArrow;
    /**
     * To find legend elements id based on chart or accumulation chart
     * @private
     */
    generateId(option: LegendOptions, prefix: string, count: number): string;
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    move(event: Event): void;
}
/**
 * Class for legend options
 * @private
 */
export declare class LegendOptions {
    render: boolean;
    text: string;
    fill: string;
    shape: LegendShape;
    visible: boolean;
    type: ChartSeriesType | AccumulationType;
    textSize: Size;
    location: ChartLocation;
    pointIndex?: number;
    seriesIndex?: number;
    markerShape?: ChartShape;
    markerVisibility?: boolean;
    constructor(text: string, fill: string, shape: LegendShape, visible: boolean, type: ChartSeriesType | AccumulationType, markerShape?: ChartShape, markerVisibility?: boolean, pointIndex?: number, seriesIndex?: number);
}
