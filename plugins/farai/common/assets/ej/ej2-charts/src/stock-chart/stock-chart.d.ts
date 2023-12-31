import { Component, INotifyPropertyChanged, Internationalization } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { StockChartModel } from './stock-chart-model';
import { Chart } from '../chart/chart';
import { ZoomSettingsModel, CrosshairSettingsModel } from '../chart/chart-model';
import { Axis } from '../chart/axis/axis';
import { Size, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { IRangeSelectorRenderEventArgs, ITooltipRenderEventArgs, IMouseEventArgs, IPointEventArgs } from '../chart/model/chart-interface';
import { IAxisLabelRenderEventArgs, ISeriesRenderEventArgs, IZoomingEventArgs } from '../chart/model/chart-interface';
import { PeriodsModel } from '../common/model/base-model';
import { TooltipSettingsModel } from '../common/model/base-model';
import { RangeNavigator } from '../range-navigator/range-navigator';
import { PeriodSelector } from '../common/period-selector/period-selector';
import { CartesianChart } from './renderer/cartesian-chart';
import { RangeSelector } from './renderer/range-selector';
import { ToolBarSelector } from './renderer/toolbar-selector';
import { IStockChartEventArgs, IRangeChangeEventArgs } from './model/base';
import { IStockEventRenderArgs } from './model/base';
import { StockChartAnnotationSettingsModel } from './model/base-model';
import { StockSeriesModel, StockChartIndicatorModel, StockChartAxisModel, StockChartRowModel } from './model/base-model';
import { StockChartIndexesModel, StockChartFontModel, StockChartAreaModel, StockEventsSettingsModel } from './model/base-model';
import { StockChartBorderModel, StockMarginModel } from './model/base-model';
import { ChartSeriesType, TrendlineTypes, TechnicalIndicators, ChartTheme, SelectionMode } from '../chart/utils/enum';
import { ExportType } from '../common/utils/enum';
import { StockEvents } from './renderer/stock-events';
import { IThemeStyle } from '../chart/model/chart-interface';
/**
 * Stock Chart
 */
export declare class StockChart extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * The width of the stockChart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full width of its parent element.
     * @default null
     */
    width: string;
    /**
     * The height of the stockChart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, stockChart renders to the full height of its parent element.
     * @default null
     */
    height: string;
    /**
     * Specifies the DataSource for the stockChart. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='financial'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let financial: stockChart = new stockChart({
     * ...
     *  dataSource:dataManager,
     *   series: [{
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * financial.appendTo('#financial');
     * ```
     * @default ''
     */
    dataSource: Object | DataManager;
    /**
     *  Options to customize left, right, top and bottom margins of the stockChart.
     */
    margin: StockMarginModel;
    /**
     * Options for customizing the color and width of the stockChart border.
     */
    border: StockChartBorderModel;
    /**
     * The background color of the stockChart that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    background: string;
    /**
     * Specifies the theme for the stockChart.
     * @default 'Material'
     */
    theme: ChartTheme;
    /**
     * Options to configure the horizontal axis.
     */
    primaryXAxis: StockChartAxisModel;
    /**
     * Options for configuring the border and background of the stockChart area.
     */
    chartArea: StockChartAreaModel;
    /**
     * Options to configure the vertical axis.
     * @complex {opposedPosition=true, labelPosition=AxisPosition.Outside}
     */
    primaryYAxis: StockChartAxisModel;
    /**
     * Options to split stockChart into multiple plotting areas horizontally.
     * Each object in the collection represents a plotting area in the stockChart.
     */
    rows: StockChartRowModel[];
    /**
     * Secondary axis collection for the stockChart.
     */
    axes: StockChartAxisModel[];
    /**
     * The configuration for series in the stockChart.
     */
    series: StockSeriesModel[];
    /**
     * The configuration for stock events in the stockChart.
     */
    stockEvents: StockEventsSettingsModel[];
    /**
     * It specifies whether the stockChart should be render in transposed manner or not.
     * @default false
     */
    isTransposed: boolean;
    /**
     * Title of the chart
     * @default ''
     */
    title: string;
    /**
     * Options for customizing the title of the Chart.
     */
    titleStyle: StockChartFontModel;
    /**
     * Defines the collection of technical indicators, that are used in financial markets
     */
    indicators: StockChartIndicatorModel[];
    /**
     * Options for customizing the tooltip of the chart.
     */
    tooltip: TooltipSettingsModel;
    /**
     * Options for customizing the crosshair of the chart.
     */
    crosshair: CrosshairSettingsModel;
    /**
     * Options to enable the zooming feature in the chart.
     */
    zoomSettings: ZoomSettingsModel;
    /**
     * It specifies whether the periodSelector to be rendered in financial chart
     * @default true
     */
    enablePeriodSelector: boolean;
    /**
     * Custom Range
     * @default true
     */
    enableCustomRange: boolean;
    /**
     * If set true, enables the animation in chart.
     * @default false
     */
    isSelect: boolean;
    /**
     * It specifies whether the range navigator to be rendered in financial chart
     * @default true
     */
    enableSelector: boolean;
    /**
     * To configure period selector options.
     */
    periods: PeriodsModel[];
    /**
     * The configuration for annotation in chart.
     */
    annotations: StockChartAnnotationSettingsModel[];
    /**
     * Triggers before render the selector
     * @event
     * @deprecated
     */
    selectorRender: EmitType<IRangeSelectorRenderEventArgs>;
    /**
     * Triggers on hovering the stock chart.
     * @event
     * @blazorProperty 'OnStockChartMouseMove'
     */
    stockChartMouseMove: EmitType<IMouseEventArgs>;
    /**
     * Triggers when cursor leaves the chart.
     * @event
     * @blazorProperty 'OnStockChartMouseLeave'
     */
    stockChartMouseLeave: EmitType<IMouseEventArgs>;
    /**
     * Triggers on mouse down.
     * @event
     * @blazorProperty 'OnStockChartMouseDown'
     */
    stockChartMouseDown: EmitType<IMouseEventArgs>;
    /**
     * Triggers on mouse up.
     * @event
     * @blazorProperty 'OnStockChartMouseUp'
     */
    stockChartMouseUp: EmitType<IMouseEventArgs>;
    /**
     * Triggers on clicking the stock chart.
     * @event
     * @blazorProperty 'OnStockChartMouseClick'
     */
    stockChartMouseClick: EmitType<IMouseEventArgs>;
    /**
     * Triggers on point click.
     * @event
     * @blazorProperty 'OnPointClick'
     */
    pointClick: EmitType<IPointEventArgs>;
    /**
     * Triggers on point move.
     * @event
     * @blazorProperty 'PointMoved'
     */
    pointMove: EmitType<IPointEventArgs>;
    /**
     * Triggers after the zoom selection is completed.
     * @event
     */
    onZooming: EmitType<IZoomingEventArgs>;
    /**
     * Specifies whether series or data point has to be selected. They are,
     * * none: Disables the selection.
     * * series: selects a series.
     * * point: selects a point.
     * * cluster: selects a cluster of point
     * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
     * * dragX: selects points by dragging with respect to horizontal axis.
     * * dragY: selects points by dragging with respect to vertical axis.
     * @default None
     */
    selectionMode: SelectionMode;
    /**
     * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * @default false
     */
    isMultiSelect: boolean;
    /**
     * Triggers before the range navigator rendering
     * @event
     */
    load: EmitType<IStockChartEventArgs>;
    /**
     * Triggers after the range navigator rendering
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<IStockChartEventArgs>;
    /**
     * Triggers if the range is changed
     * @event
     * @blazorProperty 'RangeChange'
     */
    rangeChange: EmitType<IRangeChangeEventArgs>;
    /**
     * Triggers before each axis label is rendered.
     * @event
     * @deprecated
     */
    axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
    /**
     * Triggers before the tooltip for series is rendered.
     * @event
     * @deprecated
     */
    tooltipRender: EmitType<ITooltipRenderEventArgs>;
    /**
     * Triggers before the series is rendered.
     * @event
     * @deprecated
     */
    seriesRender: EmitType<ISeriesRenderEventArgs>;
    /**
     * Triggers before the series is rendered.
     * @event
     * @deprecated
     */
    stockEventRender: EmitType<IStockEventRenderArgs>;
    /**
     * Specifies the point indexes to be selected while loading a chart.
     * It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default []
     */
    selectedDataIndexes: StockChartIndexesModel[];
    /**
     * It specifies the types of series in financial chart.
     */
    seriesType: ChartSeriesType[];
    /**
     * It specifies the types of indicators in financial chart.
     */
    indicatorType: TechnicalIndicators[];
    /**
     * It specifies the types of Export types in financial chart.
     */
    exportType: ExportType[];
    /**
     * It specifies the types of trendline types in financial chart.
     */
    trendlineType: TrendlineTypes[];
    /** @private */
    startValue: number;
    /** @private */
    isSingleAxis: boolean;
    /** @private */
    endValue: number;
    /** @private */
    seriesXMax: number;
    /** @private */
    seriesXMin: number;
    /** @private  */
    currentEnd: number;
    /** Overall SVG */
    mainObject: Element;
    /** @private */
    selectorObject: Element;
    /** @private */
    chartObject: Element;
    /** @private */
    svgObject: Element;
    /** @private */
    isTouch: boolean;
    /** @private */
    renderer: SvgRenderer;
    /** @private */
    animateSeries: boolean;
    /** @private */
    availableSize: Size;
    /** @private */
    titleSize: Size;
    /** @private */
    chartSize: Size;
    /** @private */
    intl: Internationalization;
    /** @private */
    isDoubleTap: boolean;
    /** @private */
    private threshold;
    /** @private */
    isChartDrag: boolean;
    resizeTo: number;
    /** @private */
    disableTrackTooltip: boolean;
    /** @private */
    startMove: boolean;
    /** @private */
    yAxisElements: Element;
    /** @private */
    themeStyle: IThemeStyle;
    /** @private */
    scrollElement: Element;
    private chartid;
    tempSeriesType: ChartSeriesType[];
    /** @private */
    chart: Chart;
    /** @private */
    rangeNavigator: RangeNavigator;
    /** @private */
    periodSelector: PeriodSelector;
    /** @private */
    cartesianChart: CartesianChart;
    /** @private */
    rangeSelector: RangeSelector;
    /** @private */
    toolbarSelector: ToolBarSelector;
    /** @private */
    stockEvent: StockEvents;
    /** private */
    zoomChange: boolean;
    /** @private */
    mouseDownX: number;
    /** @private */
    mouseDownY: number;
    /** @private */
    previousMouseMoveX: number;
    /** @private */
    previousMouseMoveY: number;
    /** @private */
    mouseDownXPoint: number;
    /** @private */
    mouseUpXPoint: number;
    /** @private */
    allowPan: boolean;
    /** @private  */
    onPanning: boolean;
    /** @private  */
    referenceXAxis: Axis;
    /** @private */
    mouseX: number;
    /** @private */
    mouseY: number;
    /** @private */
    indicatorElements: Element;
    /** @private */
    trendlinetriggered: boolean;
    /** @private */
    periodSelectorHeight: number;
    /** @private */
    toolbarHeight: number;
    /** @private */
    stockChartTheme: IThemeStyle;
    /** @private */
    initialRender: boolean;
    /** @private */
    rangeFound: boolean;
    /** @private */
    tempPeriods: PeriodsModel[];
    /** @private */
    isBlazor: boolean;
    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: StockChartModel, element?: string | HTMLElement);
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: StockChartModel, oldProp: StockChartModel): void;
    /**
     * To change the range for chart
     */
    rangeChanged(updatedStart: number, updatedEnd: number): void;
    /**
     * Pre render for financial Chart
     */
    protected preRender(): void;
    /**
     * Method to bind events for chart
     */
    private unWireEvents;
    private wireEvents;
    private initPrivateVariable;
    /**
     * Method to set culture for chart
     */
    private setCulture;
    private storeDataSource;
    /**
     * To Initialize the control rendering.
     */
    protected render(): void;
    /**
     * DataManager Success
     */
    stockChartDataManagerSuccess(): void;
    /**
     * To set styles to resolve mvc width issue.
     * @param element
     */
    private setStyle;
    private drawSVG;
    private createSecondaryElements;
    findCurrentData(totalData: Object, xName: string): Object;
    /**
     * Render period selector
     */
    renderPeriodSelector(): void;
    private chartRender;
    /**
     * To render range Selector
     */
    private renderRangeSelector;
    /**
     * Get component name
     */
    getModuleName(): string;
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    removeSvg(): void;
    /**
     * Module Injection for components
     */
    chartModuleInjection(): void;
    /**
     * find range for financal chart
     */
    private findRange;
    /**
     * Handles the chart resize.
     * @return {boolean}
     * @private
     */
    stockChartResize(e: Event): boolean;
    /**
     * Handles the mouse down on chart.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseDown(e: PointerEvent): boolean;
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    stockChartMouseEnd(e: PointerEvent): boolean;
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseUp(e: PointerEvent | TouchEvent): boolean;
    /**
     * To find mouse x, y for aligned chart element svg position
     */
    private setMouseXY;
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseMove(e: PointerEvent): boolean;
    /**
     * Handles the mouse move on chart.
     * @return {boolean}
     * @private
     */
    chartOnMouseMove(e: PointerEvent | TouchEvent): boolean;
    /**
     * Handles the mouse click on chart.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseClick(e: PointerEvent | TouchEvent): boolean;
    private stockChartRightClick;
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseLeave(e: PointerEvent): boolean;
    /**
     * Handles the mouse leave on chart.
     * @return {boolean}
     * @private
     */
    stockChartOnMouseLeaveEvent(e: PointerEvent | TouchEvent): boolean;
    /**
     * Destroy method
     */
    destroy(): void;
    private renderBorder;
    /**
     * Render title for chart
     */
    private renderTitle;
    private findTitleColor;
    /**
     * @private
     */
    calculateStockEvents(): void;
}
