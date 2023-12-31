import { CircularGauge } from '../circular-gauge';
import { ColorStopModel, GradientPositionModel } from './gradient-model';
import { ChildProperty } from '@syncfusion/ej2-base';
import { PointerModel, CapModel, NeedleTailModel, RangeModel } from '../axes/axis-model';
/**
 * Specifies the color information for the gradient in the circular gauge.
 */
export declare class ColorStop extends ChildProperty<ColorStop> {
    /**
     * Defines the color to be used in the gradient.
     * @default '#000000'
     */
    color: string;
    /**
     *  Defines the opacity to be used in the gradient.
     * @default 1
     */
    opacity: number;
    /**
     *  Defines the gradient color begin and end in percentage
     * @default '0%'
     */
    offset: string;
    /**
     * Defines the style of the color stop in the gradient element.
     * @default ''
     */
    style: string;
}
/**
 * Specifies the position in percentage from which the radial gradient must be applied.
 */
export declare class GradientPosition extends ChildProperty<GradientPosition> {
    /**
     * Defines the horizontal position in percentage.
     * @default '0%'
     */
    x: string;
    /**
     * Defines the vertical position in percentage.
     * @default '0%'
     */
    y: string;
}
/**
 * This specifies the properties of the linear gradient colors for the circular gauge.
 */
export declare class LinearGradient extends ChildProperty<LinearGradient> {
    /**
     * Defines the start value of the linear gradient.
     * @default '0%'
     */
    startValue: string;
    /**
     * Defines the end value of the linear gradient.
     * @default '100%'
     */
    endValue: string;
    /**
     * Defines the color range properties for the gradient.
     */
    colorStop: ColorStopModel[];
}
/**
 * This specifies the properties of the radial gradient colors for the circular gauge.
 */
export declare class RadialGradient extends ChildProperty<RadialGradient> {
    /**
     * Defines the radius of the radial gradient in percentage.
     * @default '0%'
     */
    radius: string;
    /**
     * Defines the outer circle of the radial gradient.
     */
    outerPosition: GradientPositionModel;
    /**
     * Defines the inner circle of the radial gradient.
     *
     */
    innerPosition: GradientPositionModel;
    /**
     * Defines the color range properties for the gradient.
     */
    colorStop: ColorStopModel[];
}
/**
 * Sets and gets the module that enables the gradient option for pointers and ranges.
 * @hidden
 */
export declare class Gradient {
    private gauge;
    /**
     * Constructor for gauge
     * @param gauge
     */
    constructor(gauge: CircularGauge);
    /**
     * To get linear gradient string for pointers and ranges
     * @private
     */
    private getLinearGradientColor;
    /**
     * To get the radial gradient string.
     * @private
     */
    private getRadialGradientColor;
    /**
     * To get color, opacity, offset and style.
     * @private
     */
    private getGradientColor;
    /**
     * To get a gradient color string
     * @private
     */
    getGradientColorString(element: PointerModel | CapModel | NeedleTailModel | RangeModel): string;
    protected getModuleName(): string;
    /**
     * To destroy the Gradient.
     * @return {void}
     * @private
     */
    destroy(gauge: CircularGauge): void;
}
