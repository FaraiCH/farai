import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
/**
 * `ScatterSeries` module is used to render the scatter series.
 */
export declare class ScatterSeries {
    /**
     * Render the scatter series.
     * @return {void}
     * @private
     */
    render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void;
    /**
     * To improve the chart performance.
     * @return {void}
     * @private
     */
    enableComplexProperty(series: Series): Points[];
    /**
     * To append scatter element
     * @param series
     * @param point
     * @param argsData
     * @param startLocation
     */
    private refresh;
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    doAnimation(series: Series): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the scatter.
     * @return {void}
     */
    destroy(chart: Chart): void;
}
