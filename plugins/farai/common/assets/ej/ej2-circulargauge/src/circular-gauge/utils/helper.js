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
/**
 * Specifies Circular-Gauge Helper methods
 */
import { compile as templateComplier, isNullOrUndefined } from '@syncfusion/ej2-base';
import { merge } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { createElement, remove, setStyleAttribute } from '@syncfusion/ej2-base';
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns Size
 * @private
 */
export function measureText(text, font) {
    var htmlObject = document.getElementById('gauge-measuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    var style = 'position: absolute; visibility: hidden;' +
        ';left: 0px; top: -100px; white-space: nowrap;' + getFontStyle(font);
    htmlObject.innerHTML = text;
    htmlObject.setAttribute('style', style);
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
/**
 * Function to find number from string
 * * @returns number
 * @private
 */
export function toPixel(value, maxDimension) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (maxDimension / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Function to get the style from FontModel.
 * @returns string
 * @private
 */
export function getFontStyle(font) {
    var style = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/**
 * Function to set style to the element.
 * @private
 */
export function setStyles(element, fill, border) {
    setStyleAttribute(element, {
        'stroke': border.color, 'stroke-width': border.width,
        'fill': fill
    });
}
/**
 * Function to measure the element rect.
 * @returns ClientRect
 * @private
 */
export function measureElementRect(element) {
    var bounds;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    removeElement(element.id);
    return bounds;
}
/**
 * Function to convert the number from string.
 * @returns number
 * @private
 */
export function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Function to create the text element.
 * @returns Element
 * @private
 */
export function textElement(options, font, color, parent, styles) {
    var renderOptions = {};
    var htmlObject;
    var renderer = new SvgRenderer('');
    var style = styles + ' font-size:' + font.size + '; font-style:' + font.fontStyle +
        ' ; font-weight:' + font.fontWeight + '; font-family:' + font.fontFamily + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'style': style
    };
    htmlObject = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * Function to append the path to the element.
 * @returns Element
 * @private
 */
export function appendPath(options, element, gauge, functionName) {
    functionName = functionName ? functionName : 'Path';
    var htmlObject = gauge.renderer['draw' + functionName](options);
    htmlObject.setAttribute('transform', options.transform);
    htmlObject.setAttribute('style', options.style);
    element.appendChild(htmlObject);
    return htmlObject;
}
/**
 * Function to calculate the sum of array values.
 * @returns number
 * @private
 */
export function calculateSum(from, to, values) {
    var sum = 0;
    var length = values.length;
    for (; from < length; from++) {
        sum += values[from];
    }
    return sum;
}
/**
 * Function to calculate the value for linear animation effect
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
export function linear(currentTime, startValue, endValue, duration) {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
/**
 * Function to get the angle from value for circular gauge.
 * @returns number
 * @private
 */
export function getAngleFromValue(value, maximumValue, minimumValue, startAngle, endAngle, isClockWise) {
    var angle;
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    startAngle -= 90;
    endAngle -= 90;
    if (isClockWise) {
        angle = ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue))) + startAngle;
    }
    else {
        angle = endAngle - ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue)));
        angle = angle < 0 ? 360 + angle : angle;
    }
    angle = Math.round(angle) >= 360 ? (angle - 360) : Math.round(angle) < 0 ? (360 + angle) : angle;
    return angle;
}
/**
 * Function to get the degree for circular gauge.
 * @returns number
 * @private
 */
export function getDegree(startAngle, endAngle) {
    var degree = endAngle - startAngle;
    return degree < 0 ? (degree + 360) : degree;
}
/**
 * Function to get the value from angle for circular gauge.
 * @returns number
 * @private
 */
export function getValueFromAngle(angle, maximumValue, minimumValue, startAngle, endAngle, isClockWise) {
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    angle = angle < startAngle ? (angle + 360) : angle;
    if (isClockWise) {
        return (((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue;
    }
    else {
        return maximumValue - ((((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue);
    }
}
/**
 * Function to check whether it's a complete circle for circular gauge.
 * @returns boolean
 * @private
 */
export function isCompleteAngle(startAngle, endAngle) {
    var totalAngle = endAngle - startAngle;
    totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
    return Math.floor(totalAngle / 360) !== 0;
}
/**
 * Function to get angle from location for circular gauge.
 * @returns number
 * @private
 */
export function getAngleFromLocation(center, point) {
    var angle = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = Math.round((angle < 0 ? (6.283 + angle) : angle) * (180 / Math.PI)) - 270;
    angle += angle < 0 ? 360 : 0;
    return angle;
}
/**
 * Function to get the location from angle for circular gauge.
 * @returns GaugeLocation
 * @private
 */
export function getLocationFromAngle(degree, radius, center) {
    var radian = (degree * Math.PI) / 180;
    return new GaugeLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/**
 * Function to get the path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getPathArc(center, start, end, radius, startWidth, endWidth, range, axis) {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    var degree = getDegree(start, end);
    var startRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + startWidth : range.position === 'Cross'
        && axis.direction === 'AntiClockWise' ? radius - (endWidth + startWidth) / 2 : radius - startWidth) : radius - startWidth;
    var endRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + endWidth : range.position === 'Cross' &&
        axis.direction === 'ClockWise' ? radius - (endWidth + startWidth) / 2 : radius - endWidth) : radius - endWidth;
    var arcRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + ((startWidth + endWidth) / 2) :
        range.position === 'Cross' ? (radius - ((startWidth + endWidth) / 4) - (axis.direction === 'ClockWise' ? startWidth : endWidth)
            / 2) : radius - ((startWidth + endWidth) / 2)) : radius - ((startWidth + endWidth) / 2);
    var insideArcRadius = !isNullOrUndefined(range) && range.position === 'Cross' ?
        radius + ((startWidth + endWidth) / 4) - (axis.direction === 'ClockWise' ? startWidth : endWidth) / 2 : radius;
    var insideEndRadius = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'ClockWise' ?
        radius - ((startWidth - endWidth) / 2) : radius;
    var insideStartRadius = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'AntiClockWise' ?
        radius + ((startWidth - endWidth) / 2) : radius;
    if (startWidth !== undefined && endWidth !== undefined) {
        endRadius = start === Math.round(end) ? startRadius : endRadius;
        insideEndRadius = start === Math.round(end) && range.position === 'Cross' ? insideStartRadius : insideEndRadius;
        return getRangePath(getLocationFromAngle(start, insideStartRadius, center), getLocationFromAngle(end, insideEndRadius, center), getLocationFromAngle(start, startRadius, center), getLocationFromAngle(end, endRadius, center), insideArcRadius, arcRadius, arcRadius, (degree < 180) ? 0 : 1);
    }
    else {
        return getCirclePath(getLocationFromAngle(start, radius, center), getLocationFromAngle(end, radius, center), radius, (degree < 180) ? 0 : 1);
    }
}
/**
 * Function to get the range path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRangePath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' L ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}
/**
 * Function to get the rounded path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRoundedPathArc(center, actualStart, actualEnd, oldStart, oldEnd, radius, startWidth, endWidth) {
    actualEnd -= isCompleteAngle(actualStart, actualEnd) ? 0.0001 : 0;
    var degree = getDegree(actualStart, actualEnd);
    var startRadius = radius - startWidth;
    var endRadius = radius - endWidth;
    var arcRadius = radius - ((startWidth + endWidth) / 2);
    return getRoundedPath(getLocationFromAngle(actualStart, radius, center), getLocationFromAngle(actualEnd, radius, center), getLocationFromAngle(oldEnd, radius, center), getLocationFromAngle(oldEnd, endRadius, center), getLocationFromAngle(oldStart, radius, center), getLocationFromAngle(oldStart, startRadius, center), getLocationFromAngle(actualStart, startRadius, center), getLocationFromAngle(actualEnd, endRadius, center), radius, arcRadius, arcRadius, (degree < 180) ? 0 : 1);
}
/**
 * Function to get the rounded range path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getRoundedPath(start, end, outerOldEnd, innerOldEnd, outerOldStart, innerOldStart, innerStart, innerEnd, radius, startRadius, endRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' C ' + outerOldEnd.x + ' ' + outerOldEnd.y + ' ' + innerOldEnd.x + ' ' +
        innerOldEnd.y + ' ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y +
        ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
        outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
}
/**
 * Function to calculate the complete path arc of the circular gauge.
 * @returns string
 * @private
 */
export function getCompleteArc(center, start, end, radius, innerRadius, checkMinValue) {
    end -= isCompleteAngle(start, end) && !checkMinValue ? 0.0001 : 0;
    var degree = getDegree(start, end);
    return getCompletePath(center, getLocationFromAngle(start, radius, center), getLocationFromAngle(end, radius, center), radius, getLocationFromAngle(start, innerRadius, center), getLocationFromAngle(end, innerRadius, center), innerRadius, (degree < 180) ? 0 : 1);
}
/**
 * Function to get the circular path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getCirclePath(start, end, radius, clockWise) {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
        radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y;
}
/**
 * Function to get the complete path direction of the circular gauge.
 * @returns string
 * @private
 */
export function getCompletePath(center, start, end, radius, innerStart, innerEnd, innerRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
        ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
        ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}
/**
 * Function to get element from id.
 * @returns Element
 * @private
 */
export function getElement(id) {
    return document.getElementById(id);
}
/**
 * Function to compile the template function for circular gauge.
 * @returns Function
 * @private
 */
export function getTemplateFunction(template, gauge) {
    var templateFn = null;
    var e;
    try {
        if (gauge.isBlazor) {
            var numb = template.match(/\d+/g).toString();
            template = numb ? template.replace(numb, '') : template;
            template = template.indexOf('/') !== -1 ? template.replace('/', '') : template;
        }
        if (document.querySelectorAll(template).length) {
            if ((template.charAt(0) !== 'a' || template.charAt(0) !== 'A') && template.length !== 1) {
                templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
            }
        }
    }
    catch (e) {
        templateFn = templateComplier(template);
    }
    return templateFn;
}
/**
 * Function to remove the element from id.
 * @private
 */
export function removeElement(id) {
    var element = getElement(id);
    if (element) {
        remove(element);
    }
}
/**
 * Function to get current point for circular gauge using element id.
 * @returns IVisiblePointer
 * @private
 */
export function getPointer(targetId, gauge) {
    var tempString;
    tempString = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        pointerIndex: +tempString[tempString.length - 1]
    };
}
/**
 * Function to get current point for circular gauge using element id.
 * @returns IVisibleRange
 * @private
 */
export function getRange(targetId, gauge) {
    var tempString;
    tempString = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        rangeIndex: +tempString[tempString.length - 1]
    };
}
export function getElementSize(template, gauge, parent) {
    var elementSize;
    var element;
    var templateFn = getTemplateFunction(template, gauge);
    var tooltipData = templateFn ? templateFn({}, null, null, gauge.element.id + 'Template') : [];
    if (templateFn && tooltipData.length) {
        element = gauge.createElement('div', { id: gauge.element.id + '_Measure_Element' });
        gauge.element.appendChild(element);
        var templateElement = templateFn({}, null, null, gauge.element.id + 'Template');
        var templateLength = templateElement.length;
        while (templateLength > 0) {
            element.appendChild(templateElement[0]);
            templateLength--;
        }
        parent.appendChild(element);
        elementSize = new Size(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
        remove(element);
    }
    return elementSize;
}
/**
 * Function to get the mouse position
 * @param pageX
 * @param pageY
 * @param element
 */
export function getMousePosition(pageX, pageY, element) {
    var elementRect = element.getBoundingClientRect();
    var pageXOffset = element.ownerDocument.defaultView.pageXOffset;
    var pageYOffset = element.ownerDocument.defaultView.pageYOffset;
    var clientTop = element.ownerDocument.documentElement.clientTop;
    var clientLeft = element.ownerDocument.documentElement.clientLeft;
    var positionX = elementRect.left + pageXOffset - clientLeft;
    var positionY = elementRect.top + pageYOffset - clientTop;
    return new GaugeLocation((pageX - positionX), (pageY - positionY));
}
/**
 * Function to convert the label using format for cirular gauge.
 * @returns string
 * @private
 */
export function getLabelFormat(format) {
    var customLabelFormat = format && format.match('{value}') !== null;
    var skeleton = customLabelFormat ? '' : format;
    return skeleton;
}
/**
 * Function to calculate the marker shape for circular gauge.
 * @returns PathOption
 * @private
 */
export function calculateShapes(location, shape, size, url, options) {
    var path;
    var width = size.width;
    var height = size.height;
    var locX = location.x;
    var locY = location.y;
    var x = location.x + (-width / 2);
    var y = location.y + (-height / 2);
    var isLegend = options.id.indexOf('Shape') > -1;
    switch (shape) {
        case 'Circle':
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
            break;
        case 'Diamond':
            path = 'M' + ' ' + x + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + locY + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Rectangle':
            path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Triangle':
            if (isLegend) {
                path = 'M' + ' ' + (x + (width / 2)) + ' ' + y + ' ' + 'L' + ' ' + (x + width) + ' ' +
                    (y + height) + 'L' + ' ' + x + ' ' + (y + height) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX - height) + ' ' + (locY - (width / 2)) +
                    'L' + ' ' + (locX - height) + ' ' + (locY + (width / 2)) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            if (isLegend) {
                path = 'M' + ' ' + (x + width) + ' ' + y + ' ' + 'L' + ' ' + (x + (width / 2)) + ' ' + (y + height) +
                    'L' + ' ' + x + ' ' + (y) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + height) + ' ' + (locY - (width / 2)) +
                    'L' + ' ' + (locX + height) + ' ' + (locY + (width / 2)) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'Image':
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
        case 'RightArrow':
            var space = 2;
            path = 'M' + ' ' + (locX + (-width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (-width / 2)) + ' ' + (locY + (height / 2)) + ' L' + ' ' + (locX + (-width / 2)) + ' ' +
                (locY + (height / 2) - space) + ' ' + 'L' + ' ' + (locX + (width / 2) - (2 * space)) + ' ' + (locY) +
                ' L' + (locX + (-width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            space = 2;
            path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (-width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2) - space) + ' L' + ' ' + (locX + (-width / 2) + (2 * space))
                + ' ' + (locY) + ' L' + (locX + (width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
            break;
    }
    return options;
}
/**
 * Function to get range color from value for circular gauge.
 * @returns string
 * @private
 */
export function getRangeColor(value, ranges, color) {
    var min = 0;
    var max = 0;
    var currentRange = ranges.filter(function (range) {
        min = Math.min(range.start, range.end);
        max = Math.max(range.start, range.end);
        return (value >= min && max >= value);
    });
    return currentRange.length ? currentRange[0].rangeColor : color;
}
/** @private */
var CustomizeOption = /** @class */ (function () {
    function CustomizeOption(id) {
        this.id = id;
    }
    return CustomizeOption;
}());
export { CustomizeOption };
/** @private */
var PathOption = /** @class */ (function (_super) {
    __extends(PathOption, _super);
    function PathOption(id, fill, width, color, opacity, dashArray, d, transform, style) {
        if (transform === void 0) { transform = ''; }
        if (style === void 0) { style = ''; }
        var _this = _super.call(this, id) || this;
        _this.opacity = opacity;
        _this.fill = fill;
        _this.stroke = color;
        _this['stroke-width'] = width;
        _this['stroke-dasharray'] = dashArray;
        _this.d = d;
        _this.transform = transform;
        _this.style = style;
        return _this;
    }
    return PathOption;
}(CustomizeOption));
export { PathOption };
/** @private */
var RectOption = /** @class */ (function (_super) {
    __extends(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect) {
        var _this = _super.call(this, id) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.opacity = opacity;
        _this.fill = fill;
        _this.stroke = border.color;
        _this['stroke-width'] = border.width;
        return _this;
    }
    return RectOption;
}(CustomizeOption));
export { RectOption };
/**
 * Internal class size
 */
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
export { Size };
/**
 * Internal use of circular gauge location
 */
var GaugeLocation = /** @class */ (function () {
    function GaugeLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return GaugeLocation;
}());
export { GaugeLocation };
/** @private */
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
}());
export { Rect };
/** @private */
export function textTrim(maxWidth, text, font) {
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/** @private */
export function showTooltip(text, x, y, areaWidth, id, element) {
    //let id1: string = 'EJ2_legend_tooltip';
    var tooltip = document.getElementById(id);
    var width = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width + 5;
    x = (x + width > areaWidth) ? x - width : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        element.appendChild(tooltip);
    }
    else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
}
/** @private */
var TextOption = /** @class */ (function (_super) {
    __extends(TextOption, _super);
    function TextOption(id, x, y, anchor, text, transform, baseLine) {
        if (transform === void 0) { transform = ''; }
        var _this = _super.call(this, id) || this;
        _this.transform = '';
        _this.baseLine = 'auto';
        _this.x = x;
        _this.y = y;
        _this.anchor = anchor;
        _this.text = text;
        _this.transform = transform;
        _this.baseLine = baseLine;
        return _this;
    }
    return TextOption;
}(CustomizeOption));
export { TextOption };
/** @private */
var VisibleLabels = /** @class */ (function () {
    function VisibleLabels(text, value, size) {
        this.text = text;
        this.value = value;
        this.size = size;
    }
    return VisibleLabels;
}());
export { VisibleLabels };
/**
 * To trigger the download element
 * @param fileName
 * @param type
 * @param url
 */
export function triggerDownload(fileName, type, url, isDownload) {
    createElement('a', {
        attrs: {
            'download': fileName + '.' + type.toLocaleLowerCase(),
            'href': url
        }
    }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
        view: window,
        bubbles: false,
        cancelable: true
    }));
}
