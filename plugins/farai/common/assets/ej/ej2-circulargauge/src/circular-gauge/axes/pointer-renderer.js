import { linear, getAngleFromValue, getCompleteArc, getRoundedPathArc, getLocationFromAngle, appendPath, textElement, PathOption, TextOption, calculateShapes, Size, stringToNumber } from '../utils/helper';
import { Animation, isNullOrUndefined } from '@syncfusion/ej2-base';
import { animationComplete } from '../model/constants';
/**
 * Specifies the Axis rendering for circular gauge
 */
var PointerRenderer = /** @class */ (function () {
    /**
     * Constructor for pointer renderer.
     * @private.
     */
    function PointerRenderer(gauge) {
        this.gauge = gauge;
    }
    /**
     * Method to render the axis pointers of the circular gauge.
     * @return {void}
     * @private
     */
    PointerRenderer.prototype.drawPointers = function (axis, axisIndex, element, gauge, animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var pointerElement = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Pointers_' + axisIndex
        });
        var childElement;
        var range;
        axis.pointers.map(function (pointer, pointerIndex) {
            if (!isNullOrUndefined(pointer.offset) && pointer.offset.length > 0) {
                pointer.currentDistanceFromScale = stringToNumber(pointer.offset, axis.currentRadius);
            }
            else {
                pointer.currentDistanceFromScale = pointer.offset;
            }
            range = axis.visibleRange;
            pointer.pathElement = [];
            _this.calculatePointerRadius(axis, pointer);
            childElement = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
            });
            _this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
            _this.setPointerValue(axis, pointer, pointer.currentValue);
            pointerElement.appendChild(childElement);
            if (animate || pointer.animation.enable) {
                _this.doPointerAnimation(pointer, axis);
            }
        });
        element.appendChild(pointerElement);
    };
    /**
     * Measure the pointer length of the circular gauge.
     * @return {void}
     */
    PointerRenderer.prototype.calculatePointerRadius = function (axis, pointer) {
        var padding = 5;
        pointer.currentRadius = !isNullOrUndefined(pointer.radius) ?
            stringToNumber(pointer.radius, axis.currentRadius) : pointer.position !== 'Auto' ?
            this.pointerRadiusForPosition(axis, pointer) : (axis.currentRadius - (axis.farSize + padding));
    };
    /**
     * Measure the pointer length of the circular gauge based on pointer position.
     * @return {number}
     */
    PointerRenderer.prototype.pointerRadiusForPosition = function (axis, pointer) {
        if (pointer.markerShape === 'Text') {
            var pointerRadius = void 0;
            var pointerSize = parseInt(pointer.textStyle.size, 10);
            var markerOffset = pointer.position === 'Cross' ? pointerSize / 5 : 0;
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - pointerSize / 1.2 - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + axis.lineStyle.width / 2 + pointerSize / 4 + markerOffset + pointer.currentDistanceFromScale) :
                    (axis.currentRadius - pointerSize / 6 - markerOffset - pointer.currentDistanceFromScale);
            return pointerRadius;
        }
        else {
            var pointerRadius = void 0;
            var rangeBarOffset = pointer.type === 'RangeBar' ? pointer.pointerWidth : 0;
            var markerOffset = pointer.type === 'Marker' ? ((pointer.markerShape === 'InvertedTriangle' ||
                pointer.markerShape === 'Triangle') ? (pointer.position === 'Cross' ? pointer.markerWidth / 2 : 0) :
                pointer.markerWidth / 2) : 0;
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + rangeBarOffset + axis.lineStyle.width / 2 + markerOffset + pointer.currentDistanceFromScale) :
                    (axis.currentRadius + rangeBarOffset / 2 - pointer.currentDistanceFromScale -
                        ((pointer.markerShape === 'InvertedTriangle' || pointer.markerShape === 'Triangle') ? markerOffset : 0));
            return pointerRadius;
        }
    };
    /**
     * Method to render the needle pointer of the ciruclar gauge.
     * @return {void}
     */
    PointerRenderer.prototype.drawNeedlePointer = function (axis, axisIndex, index, parentElement, gauge) {
        var pointer = axis.pointers[index];
        var needle = pointer.needleTail;
        var cap = pointer.cap;
        var pointerRadius;
        var location;
        var direction;
        var needleStartWidth = pointer.needleStartWidth;
        var needleEndWidth = pointer.needleEndWidth;
        var mid = gauge.midPoint;
        var width = pointer.pointerWidth / 2;
        var rectDirection;
        var gradientColor;
        var gradientTailColor;
        var gradientCapColor;
        // To render the needle
        location = getLocationFromAngle(0, pointer.currentRadius, mid);
        if ((needleStartWidth === 0) && (needleEndWidth === 0) && width) {
            direction = 'M ' + mid.x + ' ' + (mid.y) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + (mid.x) + ' ' + (mid.y) + ' Z';
        }
        else {
            direction = 'M ' + mid.x + ' ' + (mid.y - width - needleEndWidth) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + location.x + ' ' + (mid.y + needleStartWidth) + ' L ' + mid.x + ' ' + (mid.y + width + needleEndWidth) + ' Z';
        }
        if (gauge.gradientModule) {
            gradientColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Needle_' + index, gradientColor ? gradientColor :
            pointer.color || this.gauge.themeStyle.needleColor, pointer.border.width, pointer.border.color, null, '0', direction), parentElement, gauge));
        pointerRadius = stringToNumber(pointer.needleTail.length, pointer.currentRadius);
        // To render the rect element for touch
        rectDirection = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + (mid.y - width) +
            ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + mid.x + ' ' + (mid.y + width);
        // To render the needle tail
        if (gauge.gradientModule) {
            gradientTailColor = gauge.gradientModule.getGradientColorString(needle);
        }
        if (pointerRadius) {
            location = getLocationFromAngle(180, pointerRadius, gauge.midPoint);
            direction = 'M ' + mid.x + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y + width) +
                ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
            pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleTail_' + index, gradientTailColor ? gradientTailColor : pointer.needleTail.color || this.gauge.themeStyle.needleTailColor, pointer.needleTail.border.width, pointer.needleTail.border.color, null, '0', direction), parentElement, gauge));
            rectDirection += ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + location.x + ' ' + (mid.y - width);
        }
        // To render the cap
        if (gauge.gradientModule) {
            gradientCapColor = gauge.gradientModule.getGradientColorString(cap);
        }
        if (pointer.cap.radius) {
            pointer.pathElement.push(appendPath(calculateShapes(mid, 'Circle', new Size(pointer.cap.radius * 2, pointer.cap.radius * 2), '', new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleCap_' + index, gradientCapColor ? gradientCapColor : pointer.cap.color || this.gauge.themeStyle.capColor, pointer.cap.border.width, pointer.cap.border.color, null, '0', '', '')), parentElement, gauge, 'Ellipse'));
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleRect_' + index, 'transparent', 0, 'transpanret', null, '0', rectDirection + ' Z'), parentElement, gauge));
    };
    /**
     * Method to set the pointer value of the circular gauge.
     * @return {void}
     * @private
     */
    PointerRenderer.prototype.setPointerValue = function (axis, pointer, value) {
        var checkMinValue = value === axis.visibleRange.min && pointer.type === 'RangeBar';
        var location = this.gauge.midPoint;
        var isClockWise = axis.direction === 'ClockWise';
        var startAngle = getAngleFromValue(axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var endAngle = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        if (isClockWise) {
            endAngle = startAngle === endAngle && !checkMinValue ? endAngle + 1 : endAngle;
        }
        else {
            endAngle = startAngle === endAngle && !checkMinValue ? [startAngle, startAngle = endAngle - 1][0]
                : [startAngle, startAngle = endAngle][0];
        }
        var roundStartAngle;
        var roundEndAngle;
        var oldStartValue;
        var oldEndValue;
        var radius = pointer.roundedCornerRadius;
        var minRadius = (radius * 0.25);
        if (value <= minRadius) {
            radius = value === 1 || 2 ? 8 : radius;
            radius /= 2;
            minRadius = radius * 0.25;
        }
        oldStartValue = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        oldEndValue = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((endAngle * Math.PI) / 180) +
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        roundStartAngle = ((((pointer.currentRadius) * ((startAngle * Math.PI) / 180) +
            radius) / (pointer.currentRadius)) * 180) / Math.PI;
        roundEndAngle = ((((pointer.currentRadius) * ((endAngle * Math.PI) / 180) -
            radius) / (pointer.currentRadius)) * 180) / Math.PI;
        if (isNullOrUndefined(pointer.currentRadius)) {
            this.calculatePointerRadius(axis, pointer);
        }
        pointer.pathElement.map(function (element) {
            if (pointer.type === 'RangeBar') {
                if (pointer.roundedCornerRadius && value && !checkMinValue) {
                    element.setAttribute('d', getRoundedPathArc(location, Math.floor(roundStartAngle), Math.ceil(roundEndAngle), oldStartValue, oldEndValue, pointer.currentRadius, pointer.pointerWidth, pointer.pointerWidth));
                    radius = 0;
                }
                else {
                    element.setAttribute('d', getCompleteArc(location, startAngle, endAngle, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth), checkMinValue));
                }
            }
            else {
                element.setAttribute('transform', 'rotate(' + getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise) + ',' + location.x + ',' + location.y + ')');
            }
            element.setAttribute('aria-label', pointer.description || 'Pointer:' + value.toString());
        });
    };
    /**
     * Method to render the marker pointer of the ciruclar gauge.
     * @return {void}
     */
    PointerRenderer.prototype.drawMarkerPointer = function (axis, axisIndex, index, parentElement, gauge) {
        var pointer = axis.pointers[index];
        var min = axis.visibleRange.min;
        var max = axis.visibleRange.max;
        var angle;
        var gradientMarkerColor;
        angle = Math.round(getAngleFromValue(pointer.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
        var shapeBasedOnPosition = pointer.markerShape;
        if (gauge.gradientModule) {
            gradientMarkerColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        if (isNullOrUndefined(pointer.radius) && !isNullOrUndefined(pointer.position) && (pointer.markerShape === 'InvertedTriangle' ||
            pointer.markerShape === 'Triangle')) {
            shapeBasedOnPosition = ((pointer.position === 'Outside' || pointer.position === 'Cross') && pointer.markerShape === 'Triangle' ?
                'InvertedTriangle' : (pointer.position === 'Inside' &&
                pointer.markerShape === 'InvertedTriangle' ? 'Triangle' : pointer.markerShape));
        }
        var location = getLocationFromAngle((pointer.markerShape === 'Text') ? angle : 0, pointer.currentRadius, gauge.midPoint);
        if (pointer.markerShape === 'Text') {
            var textOption = new TextOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, location.x, location.y, 'middle', pointer.text, 'rotate(' + (angle + 90) + ',' +
                (location.x) + ',' + location.y + ')', 'auto');
            textElement(textOption, pointer.textStyle, pointer.textStyle.color, parentElement, 'pointer-events : auto; ');
        }
        else {
            pointer.pathElement.push(appendPath(calculateShapes(location, shapeBasedOnPosition, new Size(pointer.markerWidth, pointer.markerHeight), pointer.imageUrl, new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, gradientMarkerColor ? gradientMarkerColor : pointer.color || this.gauge.themeStyle.pointerColor, pointer.border.width, pointer.border.color, null, '0', '', '')), parentElement, gauge, pointer.markerShape === 'Circle' ? 'Ellipse' : (pointer.markerShape === 'Image' ? 'Image' : 'Path')));
        }
    };
    /**
     * Method to render the range bar pointer of the ciruclar gauge.
     * @return {void}
     */
    PointerRenderer.prototype.drawRangeBarPointer = function (axis, axisIndex, index, parentElement, gauge) {
        var pointer = axis.pointers[index];
        var gradientBarColor;
        if (gauge.gradientModule) {
            gradientBarColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, gradientBarColor ? gradientBarColor :
            pointer.color || this.gauge.themeStyle.pointerColor, pointer.border.width, pointer.border.color, 1, '0', ''), parentElement, gauge));
    };
    /**
     * Method to perform the animation of the pointer in circular gauge.
     * @return {void}
     */
    PointerRenderer.prototype.doPointerAnimation = function (pointer, axis) {
        var _this = this;
        var startValue = !isNullOrUndefined(pointer.previousValue) ? pointer.previousValue : axis.visibleRange.min;
        var endValue = pointer.currentValue;
        if (pointer.animation.enable && startValue !== endValue && this.gauge.animatePointer) {
            pointer.pathElement.map(function (element) {
                if (pointer.type === 'RangeBar') {
                    _this.performRangeBarAnimation(element, startValue, endValue, axis, pointer, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth));
                }
                else {
                    _this.performNeedleAnimation(element, startValue, endValue, axis, pointer, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth));
                }
            });
        }
    };
    /**
     * Perform the needle and marker pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    PointerRenderer.prototype.performNeedleAnimation = function (element, start, end, axis, pointer, radius, innerRadius) {
        var _this = this;
        var isClockWise = axis.direction === 'ClockWise';
        var startAngle = getAngleFromValue(start, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var pointAngle = getAngleFromValue(end, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        var sweepAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: function (args) {
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                element.style.animation = 'None';
                if (start !== end) {
                    element.setAttribute('transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                        _this.gauge.midPoint.x.toString() + ',' + _this.gauge.midPoint.y.toString() + ')');
                }
            },
            end: function (model) {
                _this.setPointerValue(axis, pointer, end);
                if (pointer.type === 'Marker' || (element.id.indexOf('_Pointer_NeedleCap') >= 0)) {
                    _this.gauge.trigger(animationComplete, _this.gauge.isBlazor ? {} : { axis: axis, pointer: pointer });
                }
            }
        });
    };
    /**
     * Perform the range bar pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    PointerRenderer.prototype.performRangeBarAnimation = function (element, start, end, axis, pointer, radius, innerRadius) {
        var _this = this;
        var isClockWise = axis.direction === 'ClockWise';
        var startAngle = getAngleFromValue(start, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var minAngle = getAngleFromValue(axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var pointAngle = getAngleFromValue(end, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var roundRadius = pointer.roundedCornerRadius;
        var sweepAngle;
        var endAngle;
        var oldStart;
        var minRadius = (radius * 0.25);
        if (roundRadius) {
            minAngle = ((((pointer.currentRadius) * ((minAngle * Math.PI) / 180) +
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            pointAngle = ((((pointer.currentRadius) * ((pointAngle * Math.PI) / 180) -
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            oldStart = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
                (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        }
        endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: function (arg) {
                element.style.animation = 'None';
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                if (isClockWise) {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(_this.gauge.midPoint, minAngle, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration) + 0.0001, radius, innerRadius));
                    }
                    else {
                        element.setAttribute('d', getRoundedPathArc(_this.gauge.midPoint, Math.floor(minAngle), linear(arg.timeStamp, Math.floor(minAngle), sweepAngle, arg.duration) + 0.0001, oldStart, linear(arg.timeStamp, Math.floor(minAngle + (roundRadius / 2)), sweepAngle, arg.duration) + 0.0001, radius, pointer.pointerWidth, pointer.pointerWidth));
                    }
                }
                else {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(_this.gauge.midPoint, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration), minAngle + 0.0001, radius, innerRadius));
                    }
                    else {
                        sweepAngle += roundRadius;
                        element.setAttribute('d', getRoundedPathArc(_this.gauge.midPoint, linear(arg.timeStamp, Math.floor(oldStart), sweepAngle, arg.duration), Math.floor(oldStart) + 0.0001, linear(arg.timeStamp, Math.floor(minAngle - roundRadius - (roundRadius / 2)), sweepAngle, arg.duration), Math.floor(oldStart + (roundRadius / 2)) + 0.0001, radius, pointer.pointerWidth, pointer.pointerWidth));
                    }
                }
            },
            end: function (model) {
                _this.setPointerValue(axis, pointer, end);
                _this.gauge.trigger(animationComplete, _this.gauge.isBlazor ? {} : { axis: axis, pointer: pointer });
            }
        });
    };
    return PointerRenderer;
}());
export { PointerRenderer };
