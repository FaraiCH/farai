import { Chart } from '../chart';
import { Series } from './chart-series';
import { LineBase } from './line-base';
import { Axis } from '../../chart/axis/axis';
/**
 * `StackingStepAreaSeries` module used to render the Stacking Step Area series.
 */
export declare class StackingStepAreaSeries extends LineBase {
    /**
     * Render the Stacking step area series.
     * @return {void}
     * @private
     */
    render(stackSeries: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void;
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    doAnimation(series: Series): void;
    /**
     * To destroy the stacking step area.
     * @return {void}
     * @private
     */
    destroy(chart: Chart): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To get the nearest visible point
     * @param points
     * @param j
     */
    private getNextVisiblePointIndex;
}
