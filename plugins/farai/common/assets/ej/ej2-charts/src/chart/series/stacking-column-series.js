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
import { withInRange, getVisiblePoints } from '../../common/utils/helper';
import { ColumnBase } from './column-base';
/**
 * `StackingColumnSeries` module used to render the stacking column series.
 */
var StackingColumnSeries = /** @class */ (function (_super) {
    __extends(StackingColumnSeries, _super);
    function StackingColumnSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Render the Stacking column series.
     * @return {void}
     * @private
     */
    StackingColumnSeries.prototype.render = function (series) {
        series.isRectSeries = true;
        var sideBySideInfo = this.getSideBySideInfo(series);
        var rect;
        var argsData;
        var stackedValue = series.stackedValues;
        var visiblePoints = getVisiblePoints(series);
        for (var _i = 0, visiblePoints_1 = visiblePoints; _i < visiblePoints_1.length; _i++) {
            var point = visiblePoints_1[_i];
            point.symbolLocations = [];
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                rect = this.getRectangle(point.xValue + sideBySideInfo.start, stackedValue.endValues[point.index], point.xValue + sideBySideInfo.end, stackedValue.startValues[point.index], series);
                argsData = this.triggerEvent(series, point, series.interior, { width: series.border.width, color: series.border.color });
                if (!argsData.cancel) {
                    this.drawRectangle(series, point, rect, argsData);
                    this.updateSymbolLocation(point, rect, series);
                }
            }
        }
        this.renderMarker(series);
    };
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    StackingColumnSeries.prototype.doAnimation = function (series) {
        this.animate(series);
    };
    /**
     * To destroy the stacking column.
     * @return {void}
     * @private
     */
    StackingColumnSeries.prototype.destroy = function (chart) {
        /**
         * Destroy method performed here
         */
    };
    /**
     * Get module name.
     */
    StackingColumnSeries.prototype.getModuleName = function () {
        return 'StackingColumnSeries';
    };
    return StackingColumnSeries;
}(ColumnBase));
export { StackingColumnSeries };
