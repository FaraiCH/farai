import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart } from '../../chart/chart';
import { Range } from '../model/bullet-base';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { ChartLocation } from '../../common/utils/helper';
import { Size, Rect } from '@syncfusion/ej2-svg-base';
import { BulletChart } from '../bullet-chart';
/**
 * `Legend` module is used to render legend for the chart.
 */
export declare class BulletChartLegend extends BaseLegend {
    constructor(chart: BulletChart);
    /**
     * Binding events for legend module.
     */
    private addEventListener;
    /**
     * UnBinding events for bullet chart legend module.
     */
    private removeEventListener;
    /**
     * To handle mosue move for legend module
     */
    private bulletMouseMove;
    /**
     * To handle mosue end for legend module
     */
    private mouseEnd;
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    getLegendOptions(visibleRangeCollection: Range[], chart: BulletChart): void;
    /** @private */
    getLegendBounds(availableSize: Size, bulletLegendBounds: Rect, legend: LegendSettingsModel): void;
    /** @private */
    getRenderPoint(bulletLegendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions, rect: Rect, count: number, firstLegend: number): void;
    /**
     * To show the tooltip for the trimmed text in legend.
     * @return {void}
     */
    click(event: Event | PointerEvent): void;
    /**
     * Get module name
     */
    protected getModuleName(): string;
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    destroy(chart: Chart): void;
}
