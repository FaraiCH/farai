import { ChildProperty } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from '../../common/model/base-model';
import { Orientation, ChartRangePadding, SkeletonType, AxisPosition } from '../utils/enum';
import { EdgeLabelPlacement, ValueType, IntervalType, LabelPlacement, LabelIntersectAction } from '../utils/enum';
import { Size, Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Chart } from '../chart';
import { MajorGridLinesModel, MinorGridLinesModel, CrosshairTooltipModel } from '../axis/axis-model';
import { AxisLineModel, MajorTickLinesModel, MinorTickLinesModel } from '../axis/axis-model';
import { Series } from '../series/chart-series';
import { Double } from '../axis/double-axis';
import { DateTime } from '../axis/date-time-axis';
import { Category } from '../axis/category-axis';
import { DateTimeCategory } from '../axis/date-time-category-axis';
import { StripLineSettingsModel, MultiLevelLabelsModel, LabelBorderModel, ScrollbarSettingsModel } from '../model/chart-base-model';
import { ScrollBar } from '../../common/scrollbar/scrollbar';
/**
 * Configures the `rows` of the chart.
 */
export declare class Row extends ChildProperty<Row> {
    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.
     * @default '100%'
     */
    height: string;
    /**
     * Options to customize the border of the rows.
     */
    border: BorderModel;
    /** @private */
    axes: Axis[];
    /** @private */
    computedHeight: number;
    /** @private */
    computedTop: number;
    /** @private */
    nearSizes: number[];
    /** @private */
    farSizes: number[];
    /**
     * Measure the row size
     * @return {void}
     * @private
     */
    computeSize(axis: Axis, clipRect: Rect, scrollBarHeight: number): void;
}
/**
 * Configures the `columns` of the chart.
 */
export declare class Column extends ChildProperty<Column> {
    /**
     * The width of the column as a string accepts input both as like '100px' or '100%'.
     * If specified as '100%, column renders to the full width of its chart.
     * @default '100%'
     */
    width: string;
    /**
     * Options to customize the border of the columns.
     */
    border: BorderModel;
    /** @private */
    axes: Axis[];
    /** @private */
    computedWidth: number;
    /** @private */
    computedLeft: number;
    /** @private */
    nearSizes: number[];
    /** @private */
    farSizes: number[];
    /** @private */
    private padding;
    /**
     * Measure the column size
     * @return {void}
     * @private
     */
    computeSize(axis: Axis, clipRect: Rect, scrollBarHeight: number): void;
}
/**
 * Configures the major grid lines in the `axis`.
 */
export declare class MajorGridLines extends ChildProperty<MajorGridLines> {
    /**
     * The width of the line in pixels.
     * @default 1
     */
    width: number;
    /**
     * The dash array of the grid lines.
     * @default ''
     */
    dashArray: string;
    /**
     * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    color: string;
}
/**
 * Configures the minor grid lines in the `axis`.
 */
export declare class MinorGridLines extends ChildProperty<MinorGridLines> {
    /**
     * The width of the line in pixels.
     * @default 0.7
     */
    width: number;
    /**
     * The dash array of grid lines.
     * @default ''
     */
    dashArray: string;
    /**
     * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    color: string;
}
/**
 * Configures the axis line of a chart.
 */
export declare class AxisLine extends ChildProperty<AxisLine> {
    /**
     * The width of the line in pixels.
     * @default 1
     */
    width: number;
    /**
     * The dash array of the axis line.
     * @default ''
     */
    dashArray: string;
    /**
     * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    color: string;
}
/**
 * Configures the major tick lines.
 */
export declare class MajorTickLines extends ChildProperty<MajorTickLines> {
    /**
     * The width of the tick lines in pixels.
     * @default 1
     */
    width: number;
    /**
     * The height of the ticks in pixels.
     * @default 5
     */
    height: number;
    /**
     * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    color: string;
}
/**
 * Configures the minor tick lines.
 */
export declare class MinorTickLines extends ChildProperty<MinorTickLines> {
    /**
     * The width of the tick line in pixels.
     * @default 0.7
     */
    width: number;
    /**
     * The height of the ticks in pixels.
     * @default 5
     */
    height: number;
    /**
     * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    color: string;
}
/**
 * Configures the crosshair ToolTip.
 */
export declare class CrosshairTooltip extends ChildProperty<CrosshairTooltip> {
    /**
     * If set to true, crosshair ToolTip will be visible.
     *  @default false
     */
    enable: Boolean;
    /**
     * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    fill: string;
    /**
     * Options to customize the crosshair ToolTip text.
     */
    textStyle: FontModel;
}
/**
 * Configures the axes in the chart.
 * @public
 */
export declare class Axis extends ChildProperty<Axis> {
    /**
     * Options to customize the axis label.
     */
    labelStyle: FontModel;
    /**
     * Options to customize the crosshair ToolTip.
     */
    crosshairTooltip: CrosshairTooltipModel;
    /**
     * Specifies the title of an axis.
     * @default ''
     */
    title: string;
    /**
     * Options for customizing the axis title.
     */
    titleStyle: FontModel;
    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */
    labelFormat: string;
    /**
     * Specifies the skeleton format in which the dateTime format will process.
     * @default ''
     */
    skeleton: string;
    /**
     * It specifies the type of format to be used in dateTime format process.
     * @default 'DateTime'
     * @deprecated
     */
    skeletonType: SkeletonType;
    /**
     * Left and right padding for the plot area in pixels.
     * @default 0
     */
    plotOffset: number;
    /**
     * Left padding for the plot area in pixels.
     * @default null
     */
    plotOffsetLeft: number;
    /**
     * Top padding for the plot area in pixels.
     * @default null
     */
    plotOffsetTop: number;
    /**
     * Right padding for the plot area in pixels.
     * @default null
     */
    plotOffsetRight: number;
    /**
     * Bottom padding for the plot area in pixels.
     * @default null
     */
    plotOffsetBottom: number;
    /**
     * Specifies indexed category  axis.
     * @default false
     */
    isIndexed: boolean;
    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.
     * @default 10
     */
    logBase: number;
    /**
     * Specifies the index of the column where the axis is associated,
     * when the chart area is divided into multiple plot areas by using `columns`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1,
     *     }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default 0
     */
    columnIndex: number;
    /**
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1,
     *      }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     * @default 0
     */
    rowIndex: number;
    /**
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.
     * @default 1
     */
    span: number;
    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.
     * @default null
     * @aspDefaultValueIgnore
     */
    desiredIntervals: number;
    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.
     * @default 3
     */
    maximumLabels: number;
    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     * @default 1
     */
    zoomFactor: number;
    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.
     * @default 0
     */
    zoomPosition: number;
    /**
     * Enables the scrollbar for zooming.
     * @default true
     */
    enableScrollbarOnZooming: boolean;
    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */
    opposedPosition: boolean;
    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.
     * @default true
     */
    enableAutoIntervalOnZooming: boolean;
    /**
     * Specifies the padding for the axis range in terms of interval.They are,
     * * none: Padding cannot be applied to the axis.
     * * normal: Padding is applied to the axis based on the range calculation.
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range.
     * * round: Axis range is rounded to the nearest possible value divided by the interval.
     * @default 'Auto'
     */
    rangePadding: ChartRangePadding;
    /**
     * Specifies the type of data the axis is handling.
     * * Double:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * * Logarithmic: Renders a log axis.
     * @default 'Double'
     * @blazorType Syncfusion.EJ2.Blazor.Charts.ValueType
     * @isEnumeration true
     */
    valueType: ValueType;
    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.
     * @default 'None'
     */
    edgeLabelPlacement: EdgeLabelPlacement;
    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes`, `Seconds` in date time axis.They are,
     * * Auto: Defines the interval of the axis based on data.
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.
     * @default 'Auto'
     */
    intervalType: IntervalType;
    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.
     * @default 'BetweenTicks'
     */
    labelPlacement: LabelPlacement;
    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.
     * @default 'Outside'
     */
    tickPosition: AxisPosition;
    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.
     * @default 'Outside'
     */
    labelPosition: AxisPosition;
    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.
     * @default ''
     */
    name: string;
    /**
     * If set to true, axis label will be visible.
     * @default true
     */
    visible: boolean;
    /**
     * Specifies the number of minor ticks per interval.
     * @default 0
     */
    minorTicksPerInterval: number;
    /**
     * The angle to which the axis label gets rotated.
     * @default 0
     */
    labelRotation: number;
    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.
     * @default null
     */
    crossesAt: Object;
    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line
     * @default true
     */
    placeNextToAxisLine: boolean;
    /**
     * Specifies axis name with which the axis line has to be crossed
     * @default null
     */
    crossesInAxis: string;
    /**
     * Specifies the minimum range of an axis.
     * @default null
     */
    minimum: Object;
    /**
     * Specifies the maximum range of an axis.
     * @default null
     */
    maximum: Object;
    /**
     * Specifies the interval for an axis.
     * @default null
     * @aspDefaultValueIgnore
     */
    interval: number;
    /**
     * Specifies the maximum width of an axis label.
     * @default 34.
     */
    maximumLabelWidth: number;
    /**
     * Specifies the Trim property for an axis.
     * @default false
     */
    enableTrim: boolean;
    /**
     * Specifies the labelPadding from axis
     * @default 5
     */
    labelPadding: number;
    /**
     * Options for customizing major tick lines.
     */
    majorTickLines: MajorTickLinesModel;
    /**
     * Options for customizing minor tick lines.
     */
    minorTickLines: MinorTickLinesModel;
    /**
     * Options for customizing major grid lines.
     */
    majorGridLines: MajorGridLinesModel;
    /**
     * Options for customizing minor grid lines.
     */
    minorGridLines: MinorGridLinesModel;
    /**
     * Options for customizing axis lines.
     */
    lineStyle: AxisLineModel;
    /**
     * Specifies the actions like `None`, `Hide`, `Trim`, `Wrap`, `MultipleRows`, `Rotate45`, and `Rotate90`
     * when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * * Trim: Trim the label when it intersects.
     * * Wrap: Wrap the label when it intersects.
     * * MultipleRows: Shows the label in MultipleRows when it intersects.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * @default Trim
     */
    labelIntersectAction: LabelIntersectAction;
    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    isInversed: boolean;
    /**
     * The polar radar radius position.
     * @default 100
     */
    coefficient: number;
    /**
     * The start angle for the series.
     * @default 0
     */
    startAngle: number;
    /**
     * It specifies whether the axis to be start from zero.
     * @default true
     */
    startFromZero: boolean;
    /**
     * Description for axis and its element.
     * @default null
     */
    description: string;
    /**
     * TabIndex value for the axis.
     * @default 2
     */
    tabIndex: number;
    /**
     * Specifies the stripLine collection for the axis
     */
    stripLines: StripLineSettingsModel[];
    /**
     * Specifies the multi level labels collection for the axis
     */
    multiLevelLabels: MultiLevelLabelsModel[];
    /**
     * Border of the multi level labels.
     */
    border: LabelBorderModel;
    /**
     * Option to customize scrollbar with lazy loading
     */
    scrollbarSettings: ScrollbarSettingsModel;
    /** @private */
    visibleRange: VisibleRangeModel;
    /** @private */
    visibleLabels: VisibleLabels[];
    /** @private */
    actualRange: VisibleRangeModel;
    /** @private */
    series: Series[];
    /** @private */
    doubleRange: DoubleRange;
    /** @private */
    maxLabelSize: Size;
    /** @private */
    rotatedLabel: string;
    /** @private */
    rect: Rect;
    /** @private */
    axisBottomLine: BorderModel;
    /** @private */
    orientation: Orientation;
    /** @private */
    intervalDivs: number[];
    /** @private */
    actualIntervalType: IntervalType;
    /** @private */
    labels: string[];
    /** @private */
    format: Function;
    /** @private */
    baseModule: Double | DateTime | Category | DateTimeCategory;
    /** @private */
    startLabel: string;
    /** @private */
    endLabel: string;
    /** @private */
    angle: number;
    /** @private */
    dateTimeInterval: number;
    /** @private */
    isStack100: boolean;
    /** @private */
    crossInAxis: this;
    /** @private */
    crossAt: number;
    /** @private */
    updatedRect: Rect;
    /** @private */
    multiLevelLabelHeight: number;
    zoomingScrollBar: ScrollBar;
    /** @private */
    scrollBarHeight: number;
    /** @private */
    isChart: boolean;
    /** @private */
    maxPointLength: number;
    /** @private */
    isIntervalInDecimal: boolean;
    /** @private */
    titleCollection: string[];
    /** @private */
    titleSize: Size;
    /**
     * @private
     * Task: BLAZ-2044
     * This property used to hide the axis when series hide from legend click
     */
    internalVisibility: boolean;
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean);
    /**
     * The function used to find tick size.
     * @return {number}
     * @private
     */
    findTickSize(crossAxis: Axis): number;
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    isInside(range: VisibleRangeModel): boolean;
    /**
     * The function used to find label Size.
     * @return {number}
     * @private
     */
    findLabelSize(crossAxis: Axis, innerPadding: number): number;
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    updateCrossValue(chart: Chart): void;
    private findDifference;
    /**
     * Calculate visible range for axis.
     * @return {void}
     * @private
     */
    calculateVisibleRangeOnZooming(chart: Chart): void;
    /**
     * Calculate range for x and y axis after zoom.
     * @return {void}
     * @private
     */
    calculateAxisRange(size: Size, chart: Chart): void;
    /**
     * Triggers the event.
     * @return {void}
     * @private
     */
    triggerRangeRender(chart: Chart, minimum: number, maximum: number, interval: number): void;
    /**
     * Calculate padding for the axis.
     * @return {string}
     * @private
     */
    getRangePadding(chart: Chart): string;
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    getMaxLabelWidth(chart: Chart): void;
    /**
     * Finds the multiple rows for axis.
     * @return {void}
     */
    private findMultiRows;
    /**
     * Finds the default module for axis.
     * @return {void}
     * @private
     */
    getModule(chart: Chart): void;
}
/**
 * Axis visible range
 * @public
 */
export interface VisibleRangeModel {
    /** axis minimum value */
    min?: number;
    /** axis maximum value */
    max?: number;
    /** axis interval value */
    interval?: number;
    /** axis delta value */
    delta?: number;
}
/** @private */
export declare class VisibleLabels {
    text: string | string[];
    value: number;
    labelStyle: FontModel;
    size: Size;
    breakLabelSize: Size;
    index: number;
    originalText: string;
    constructor(text: string | string[], value: number, labelStyle: FontModel, originalText: string | string[], size?: Size, breakLabelSize?: Size, index?: number);
}
