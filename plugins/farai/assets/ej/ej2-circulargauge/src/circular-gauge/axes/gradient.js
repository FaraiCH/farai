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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
/**
 * Specifies the color information for the gradient in the circular gauge.
 */
var ColorStop = /** @class */ (function (_super) {
    __extends(ColorStop, _super);
    function ColorStop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('#000000')
    ], ColorStop.prototype, "color", void 0);
    __decorate([
        Property(1)
    ], ColorStop.prototype, "opacity", void 0);
    __decorate([
        Property('0%')
    ], ColorStop.prototype, "offset", void 0);
    __decorate([
        Property('')
    ], ColorStop.prototype, "style", void 0);
    return ColorStop;
}(ChildProperty));
export { ColorStop };
/**
 * Specifies the position in percentage from which the radial gradient must be applied.
 */
var GradientPosition = /** @class */ (function (_super) {
    __extends(GradientPosition, _super);
    function GradientPosition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('0%')
    ], GradientPosition.prototype, "x", void 0);
    __decorate([
        Property('0%')
    ], GradientPosition.prototype, "y", void 0);
    return GradientPosition;
}(ChildProperty));
export { GradientPosition };
/**
 * This specifies the properties of the linear gradient colors for the circular gauge.
 */
var LinearGradient = /** @class */ (function (_super) {
    __extends(LinearGradient, _super);
    function LinearGradient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('0%')
    ], LinearGradient.prototype, "startValue", void 0);
    __decorate([
        Property('100%')
    ], LinearGradient.prototype, "endValue", void 0);
    __decorate([
        Collection([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
    ], LinearGradient.prototype, "colorStop", void 0);
    return LinearGradient;
}(ChildProperty));
export { LinearGradient };
/**
 * This specifies the properties of the radial gradient colors for the circular gauge.
 */
var RadialGradient = /** @class */ (function (_super) {
    __extends(RadialGradient, _super);
    function RadialGradient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('0%')
    ], RadialGradient.prototype, "radius", void 0);
    __decorate([
        Complex({ x: '0%', y: '0%' }, GradientPosition)
    ], RadialGradient.prototype, "outerPosition", void 0);
    __decorate([
        Complex({ x: '0%', y: '0%' }, GradientPosition)
    ], RadialGradient.prototype, "innerPosition", void 0);
    __decorate([
        Collection([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
    ], RadialGradient.prototype, "colorStop", void 0);
    return RadialGradient;
}(ChildProperty));
export { RadialGradient };
/**
 * Sets and gets the module that enables the gradient option for pointers and ranges.
 * @hidden
 */
var Gradient = /** @class */ (function () {
    /**
     * Constructor for gauge
     * @param gauge
     */
    function Gradient(gauge) {
        this.gauge = gauge;
    }
    /**
     * To get linear gradient string for pointers and ranges
     * @private
     */
    Gradient.prototype.getLinearGradientColor = function (element) {
        var render = new SvgRenderer('');
        var colors = this.getGradientColor(element.linearGradient.colorStop);
        var name = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'linearGradient';
        var gradientPosition = {
            id: name,
            x1: (element.linearGradient.startValue.indexOf('%') === -1 ?
                element.linearGradient.startValue :
                parseFloat(element.linearGradient.startValue).toString()) + '%',
            x2: (element.linearGradient.endValue.indexOf('%') === -1 ?
                element.linearGradient.endValue :
                parseFloat(element.linearGradient.endValue).toString()) + '%',
            y1: '0' + '%',
            y2: '0' + '%'
        };
        var def = render.drawGradient('linearGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    };
    /**
     * To get the radial gradient string.
     * @private
     */
    Gradient.prototype.getRadialGradientColor = function (element) {
        var render = new SvgRenderer('');
        var colors = this.getGradientColor(element.radialGradient.colorStop);
        var name = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'radialGradient';
        var gradientPosition = {
            id: name,
            r: (element.radialGradient.radius.indexOf('%') === -1 ?
                element.radialGradient.radius :
                parseFloat(element.radialGradient.radius).toString()) + '%',
            cx: (element.radialGradient.outerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.x :
                parseFloat(element.radialGradient.outerPosition.x).toString()) + '%',
            cy: (element.radialGradient.outerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.y :
                parseFloat(element.radialGradient.outerPosition.y).toString()) + '%',
            fx: (element.radialGradient.innerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.x :
                parseFloat(element.radialGradient.innerPosition.x).toString()) + '%',
            fy: (element.radialGradient.innerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.y :
                parseFloat(element.radialGradient.innerPosition.y).toString()) + '%'
        };
        var def = render.drawGradient('radialGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    };
    /**
     * To get color, opacity, offset and style.
     * @private
     */
    Gradient.prototype.getGradientColor = function (colorStop) {
        var colors = [];
        for (var j = 0; j < colorStop.length; j++) {
            var color = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: colorStop[j].opacity ? colorStop[j].opacity.toString() : '1',
                style: colorStop[j].style,
            };
            colors.push(color);
        }
        return colors;
    };
    /**
     * To get a gradient color string
     * @private
     */
    Gradient.prototype.getGradientColorString = function (element) {
        var gradientColor;
        if (element.linearGradient || element.radialGradient) {
            if (element.linearGradient) {
                gradientColor = this.getLinearGradientColor(element);
            }
            else {
                gradientColor = this.getRadialGradientColor(element);
            }
            this.gauge.gradientCount = this.gauge.gradientCount + 1;
        }
        else {
            return null;
        }
        return gradientColor;
    };
    Gradient.prototype.getModuleName = function () {
        // Returns te module name
        return 'Gradient';
    };
    /**
     * To destroy the Gradient.
     * @return {void}
     * @private
     */
    Gradient.prototype.destroy = function (gauge) {
        // Destroy method performed here
    };
    return Gradient;
}());
export { Gradient };
