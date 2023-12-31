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
import { createElement, remove } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
/**
 * Sparkline control helper file
 */
/**
 * sparkline internal use of `Size` type
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
 * To find the default colors based on theme.
 * @private
 */
export function getThemeColor(theme) {
    var themeColors;
    switch (theme.toLowerCase()) {
        case 'bootstrapdark':
        case 'fabricdark':
        case 'materialdark':
        case 'highcontrast':
            themeColors = {
                axisLineColor: '#ffffff',
                dataLabelColor: '#ffffff',
                rangeBandColor: '#ffffff',
                tooltipFill: '#ffffff',
                background: '#000000',
                tooltipFontColor: '#363F4C',
                trackerLineColor: '#ffffff'
            };
            break;
        case 'bootstrap4':
            themeColors = {
                axisLineColor: '#6C757D',
                dataLabelColor: '#212529',
                rangeBandColor: '#212529',
                tooltipFill: '#000000',
                background: '#FFFFFF',
                tooltipFontColor: '#FFFFFF',
                trackerLineColor: '#212529',
                fontFamily: 'HelveticaNeue-Medium',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                labelFontFamily: 'HelveticaNeue'
            };
            break;
        default: {
            themeColors = {
                axisLineColor: '#000000',
                dataLabelColor: '#424242',
                rangeBandColor: '#000000',
                background: '#FFFFFF',
                tooltipFill: '#363F4C',
                tooltipFontColor: '#ffffff',
                trackerLineColor: '#000000'
            };
            break;
        }
    }
    return themeColors;
}
/**
 * To find number from string
 * @private
 */
export function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Method to calculate the width and height of the sparkline
 */
export function calculateSize(sparkline) {
    var containerWidth;
    var containerHeight;
    containerWidth = !sparkline.element.clientWidth ? (!sparkline.element.parentElement ? 100 :
        sparkline.element.parentElement.clientWidth) : sparkline.element.clientWidth;
    containerHeight = !sparkline.element.clientHeight ? (!sparkline.element.parentElement ? 50 :
        sparkline.element.parentElement.clientHeight) : sparkline.element.clientHeight;
    sparkline.availableSize = new Size(stringToNumber(sparkline.width, containerWidth) || containerWidth, stringToNumber(sparkline.height, containerHeight) || containerHeight || (sparkline.isDevice ?
        Math.min(window.innerWidth, window.innerHeight) : containerHeight));
}
/**
 * Method to create svg for sparkline.
 */
export function createSvg(sparkline) {
    sparkline.renderer = new SvgRenderer(sparkline.element.id);
    calculateSize(sparkline);
    sparkline.svgObject = sparkline.renderer.createSvg({
        id: sparkline.element.id + '_svg',
        width: sparkline.availableSize.width,
        height: sparkline.availableSize.height
    });
}
/**
 * Internal use of type rect
 * @private
 */
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
/**
 * Internal use of path options
 * @private
 */
var PathOption = /** @class */ (function () {
    function PathOption(id, fill, width, color, opacity, dashArray, d) {
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this['stroke-width'] = width;
        this.stroke = color;
        this.d = d;
        this['stroke-dasharray'] = dashArray;
    }
    return PathOption;
}());
export { PathOption };
/**
 * Internal use of rectangle options
 * @private
 */
var RectOption = /** @class */ (function (_super) {
    __extends(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, tl, tr, bl, br) {
        if (tl === void 0) { tl = 0; }
        if (tr === void 0) { tr = 0; }
        if (bl === void 0) { bl = 0; }
        if (br === void 0) { br = 0; }
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.rect = rect;
        _this.topLeft = tl;
        _this.topRight = tr;
        _this.bottomLeft = bl;
        _this.bottomRight = br;
        return _this;
    }
    return RectOption;
}(PathOption));
export { RectOption };
/**
 * Internal use of circle options
 * @private
 */
var CircleOption = /** @class */ (function (_super) {
    __extends(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        _this['stroke-dasharray'] = dashArray;
        return _this;
    }
    return CircleOption;
}(PathOption));
export { CircleOption };
/**
 * Internal use of append shape element
 * @private
 */
export function appendShape(shape, element) {
    if (element) {
        element.appendChild(shape);
    }
    return shape;
}
/**
 * Internal rendering of Circle
 * @private
 */
export function drawCircle(sparkline, options, element) {
    return appendShape(sparkline.renderer.drawCircle(options), element);
}
/**
 * To get rounded rect path direction
 */
export function calculateRoundedRectPath(r, topLeft, topRight, bottomLeft, bottomRight) {
    return 'M' + ' ' + r.x + ' ' + (topLeft + r.y) +
        ' Q ' + r.x + ' ' + r.y + ' ' + (r.x + topLeft) + ' ' +
        r.y + ' ' + 'L' + ' ' + (r.x + r.width - topRight) + ' ' + r.y +
        ' Q ' + (r.x + r.width) + ' ' + r.y + ' ' +
        (r.x + r.width) + ' ' + (r.y + topRight) + ' ' + 'L ' +
        (r.x + r.width) + ' ' + (r.y + r.height - bottomRight)
        + ' Q ' + (r.x + r.width) + ' ' + (r.y + r.height) + ' ' + (r.x + r.width - bottomRight) + ' ' +
        (r.y + r.height) + ' ' + 'L ' + (r.x + bottomLeft) + ' ' + (r.y + r.height) + ' Q ' + r.x + ' ' +
        (r.y + r.height) + ' ' + r.x + ' ' + (r.y + r.height - bottomLeft) + ' ' + 'L' + ' ' + r.x + ' ' +
        (topLeft + r.y) + ' ' + 'Z';
}
/**
 * Internal rendering of Rectangle
 * @private
 */
export function drawRectangle(sparkline, options, element) {
    options.d = calculateRoundedRectPath(options.rect, options.topLeft, options.topRight, options.bottomLeft, options.bottomRight);
    return appendShape(sparkline.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Path
 * @private
 */
export function drawPath(sparkline, options, element) {
    return appendShape(sparkline.renderer.drawPath(options), element);
}
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {SparklineFontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export function measureText(text, font) {
    var htmlObject = document.getElementById('sparklinesmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'sparklinesmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
/**
 * Internal use of text options
 * @private
 */
var TextOption = /** @class */ (function () {
    function TextOption(id, x, y, anchor, text, baseLine, transform) {
        if (transform === void 0) { transform = ''; }
        this.transform = '';
        this.baseLine = 'auto';
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
    return TextOption;
}());
export { TextOption };
/**
 * Internal rendering of text
 * @private
 */
export function renderTextElement(options, font, color, parent) {
    var textOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'transform': options.transform,
        'opacity': font.opacity,
        'fill': color,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'text-anchor': options.anchor,
        'dominant-baseline': options.baseLine
    };
    var renderer = new SvgRenderer('');
    var htmlObject = renderer.createText(textOptions, options.text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * To remove element by id
 */
export function removeElement(id) {
    var element = document.getElementById(id);
    return element ? remove(element) : null;
}
/**
 * To find the element by id
 */
export function getIdElement(id) {
    return document.getElementById(id);
}
/**
 * To find point within the bounds.
 */
export function withInBounds(x, y, bounds) {
    return (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height);
}
