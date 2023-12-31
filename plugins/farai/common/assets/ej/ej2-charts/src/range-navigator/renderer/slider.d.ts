import { RangeNavigator } from '../index';
import { DataPoint } from '../utils/helper';
import { VisibleRangeModel } from '../../chart/axis/axis';
import { Rect, SvgRenderer } from '@syncfusion/ej2-svg-base';
/**
 * Class for slider
 */
export declare class RangeSlider {
    private leftUnSelectedElement;
    private rightUnSelectedElement;
    private selectedElement;
    private leftSlider;
    private rightSlider;
    private control;
    /** @private */
    isDrag: boolean;
    private elementId;
    currentSlider: string;
    startX: number;
    endX: number;
    private sliderWidth;
    currentStart: number;
    currentEnd: number;
    private previousMoveX;
    private thumpPadding;
    private thumbColor;
    points: DataPoint[];
    leftRect: Rect;
    rightRect: Rect;
    midRect: Rect;
    private labelIndex;
    private thumbVisible;
    private thumpY;
    sliderY: number;
    /** @private */
    isIOS: Boolean;
    constructor(range: RangeNavigator);
    /**
     * Render Slider elements for range navigator
     * @param range
     */
    render(range: RangeNavigator): void;
    /**
     * Thumb creation performed
     * @param render
     * @param bounds
     * @param parent
     * @param id
     */
    createThump(render: SvgRenderer, bounds: Rect, parent: Element, id: string, sliderGroup?: Element): void;
    /**
     * Set slider value for range navigator
     * @param start
     * @param end
     */
    setSlider(start: number, end: number, trigger: boolean, showTooltip: boolean): void;
    /**
     * Trigger changed event
     * @param private
     */
    triggerEvent(range: VisibleRangeModel): void;
    /**
     * @hidden
     */
    private addEventListener;
    /**
     * @hidden
     */
    private removeEventListener;
    /**
     * Move move handler perfomed here
     * @hidden
     * @param e
     */
    private mouseMoveHandler;
    /**
     * To get the range value
     * @param x
     */
    private getRangeValue;
    /**
     * Moused down handler for slider perform here
     * @param e
     */
    private mouseDownHandler;
    /**
     * To get the current slider element
     * @param id
     */
    private getCurrentSlider;
    /**
     * Mouse up handler performed here
     * @param e
     */
    private mouseUpHandler;
    /**
     * Allow Snapping perfomed here
     * @param control
     * @param start
     * @param end
     */
    private setAllowSnapping;
    /**
     * Animation Calculation for slider navigation
     * @param start
     * @param end
     */
    performAnimation(start: number, end: number, control: RangeNavigator, animationDuration?: number): void;
    /**
     * Mouse Cancel Handler
     */
    private mouseCancelHandler;
    /**
     * Destroy Method Calling here
     */
    destroy(): void;
}
