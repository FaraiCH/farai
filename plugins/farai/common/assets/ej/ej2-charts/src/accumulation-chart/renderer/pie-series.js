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
import { PathOption } from '@syncfusion/ej2-svg-base';
import { degreeToLocation, getElement, linear, stringToNumber, indexFinder } from '../../common/utils/helper';
import { PieBase } from '../renderer/pie-base';
import { Animation, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * PieSeries module used to render `Pie` Series.
 */
var PieSeries = /** @class */ (function (_super) {
    __extends(PieSeries, _super);
    function PieSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * To get path option, degree, symbolLocation from the point.
     * @private
     */
    PieSeries.prototype.renderPoint = function (point, series, chart, option, seriesGroup, redraw) {
        var sum = series.sumOfPoints;
        point.startAngle = this.startAngle;
        var yValue = point.visible ? point.y : 0;
        var degree = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        var start = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
        option.d = this.getPathOption(point, degree, this.startAngle % 360, yValue);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            point.degree = degree;
            point.start = start;
        }
        else {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            this.refresh(point, degree, start, chart, option, seriesGroup);
        }
    };
    PieSeries.prototype.findSeries = function (e) {
        var innerRadius;
        var radius;
        var borderGap = 3; // Gap between pie/doughnut chart and border
        var width = 2; // width of the border
        radius = this.innerRadius === 0 ? this.radius + borderGap : this.innerRadius - borderGap;
        innerRadius = this.innerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius);
    };
    PieSeries.prototype.toggleInnerPoint = function (event, radius, innerRadius) {
        var target = event.target;
        var id = indexFinder(target.id, true);
        var accumulationId = event.target.id.substring(0, (event.target.id.indexOf('Series') - 1));
        var borderElement = document.getElementById(this.accumulation.element.id + 'PointHover_Border');
        var createBorderEle;
        var seriesIndex = id.series;
        var pointIndex = id.point;
        var srcElem = getElement(accumulationId + '_Series_' + seriesIndex + '_Point_' + pointIndex);
        if (!isNaN(id.series) && srcElem) {
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                var point = this.accumulation.visibleSeries[0].points[pointIndex];
                var opacity = srcElem.getAttribute('class') === accumulationId + '_ej2_deselected' ?
                    this.accumulation.tooltip.enable ? 0.5 : 0.3 : this.accumulation.tooltip.enable ? 0.5 : 1;
                var innerPie = this.getPathArc(this.accumulation.pieSeriesModule.center, point.startAngle % 360, (point.startAngle + point.degree) % 360, radius, innerRadius);
                // while using annotation as a chart border will appear in both chart.so changed checked the id with target id
                if ((borderElement) && (accumulationId === this.accumulation.element.id) &&
                    (borderElement.getAttribute('d') !== innerPie || point.isExplode)) {
                    borderElement.parentNode.removeChild(borderElement);
                    borderElement = null;
                }
                var seriousGroup = getElement(accumulationId + '_Series_' + seriesIndex);
                if (!borderElement && ((!point.isExplode) || (point.isExplode && event.type !== 'click'))) {
                    var path = new PathOption(accumulationId + 'PointHover_Border', point.color, 1, point.color, opacity, '', innerPie);
                    createBorderEle = this.accumulation.renderer.drawPath(path);
                    createBorderEle.removeAttribute('transform');
                    if (this.accumulation.selectionMode !== 'None' && event.target.hasAttribute('class')) {
                        this.accumulation.accumulationSelectionModule.addSvgClass(createBorderEle, event.target.getAttribute('class'));
                    }
                    seriousGroup.appendChild(createBorderEle);
                    if (point.isExplode && createBorderEle) {
                        var borderExplode = srcElem.getAttribute('transform');
                        createBorderEle.setAttribute('transform', borderExplode);
                    }
                }
            }
        }
        else if (borderElement) {
            this.removeBorder(borderElement, 1000);
            borderElement = null;
        }
    };
    PieSeries.prototype.removeBorder = function (borderElement, duration) {
        if (borderElement) {
            setTimeout(function () {
                if (borderElement.parentNode) {
                    borderElement.parentNode.removeChild(borderElement);
                }
            }, duration);
        }
    };
    PieSeries.prototype.refresh = function (point, degree, start, chart, option, seriesGroup) {
        var _this = this;
        var seriesElement = getElement(option.id);
        var duration = chart.duration ? chart.duration : 300;
        var currentStartAngle;
        var curentDegree;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: 0,
            progress: function (args) {
                curentDegree = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                currentStartAngle = linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                seriesElement.setAttribute('d', _this.getPathOption(point, curentDegree, currentStartAngle, point.y));
                if (point.isExplode) {
                    chart.accBaseModule.explodePoints(point.index, chart, true);
                }
                seriesElement.style.visibility = 'visible';
            },
            end: function (args) {
                seriesElement.style.visibility = point.visible ? 'visible' : 'hidden';
                seriesElement.setAttribute('d', option.d);
                point.degree = degree;
                point.start = start;
            }
        });
    };
    /**
     * To get path option from the point.
     */
    PieSeries.prototype.getPathOption = function (point, degree, startAngle, yValue) {
        if (!degree) {
            return '';
        }
        var path = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius, this.innerRadius);
        //let path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
        this.startAngle += degree;
        return path;
    };
    /**
     * To animate the pie series.
     * @private
     */
    PieSeries.prototype.animateSeries = function (accumulation, option, series, slice) {
        var groupId = accumulation.element.id + 'SeriesGroup' + series.index;
        if (series.animation.enable && accumulation.animateSeries) {
            var clippath = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            var path = new PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            var clipslice = accumulation.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            accumulation.svgObject.appendChild(clippath);
            // I263828 pie chart animation issue fixed for safari browser
            slice.setAttribute('style', 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');');
            this.doAnimation(clipslice, series);
        }
    };
    /**
     * To get the module name of the Pie series.
     */
    PieSeries.prototype.getModuleName = function () {
        return 'PieSeries';
    };
    /**
     * To destroy the pie series.
     * @return {void}
     * @private
     */
    PieSeries.prototype.destroy = function (accumulation) {
        /**
         * Destroy method calling here
         */
    };
    return PieSeries;
}(PieBase));
export { PieSeries };
