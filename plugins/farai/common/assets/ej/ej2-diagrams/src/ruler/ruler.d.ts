import { Component } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { RulerModel } from './ruler-model';
import { PointModel } from '../diagram/primitives/point-model';
/**
 * Set of TickAlignment available for Ruler.
 */
export declare type TickAlignment = 'LeftOrTop' | 'RightOrBottom';
/**
 * Set of orientations available for Ruler.
 */
export declare type RulerOrientation = 'Horizontal' | 'Vertical';
/**
 * Represents the Ruler component that measures the Diagram objects, indicate positions, and align Diagram elements.
 * ```html
 * <div id='ruler'>Show Ruler</div>
 * ```
 * ```typescript
 * <script>
 *   var rulerObj = new Ruler({ showRuler: true });
 *   rulerObj.appendTo('#ruler');
 * </script>
 * ```
 */
export declare class Ruler extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the unique interval of the ruler.
     * @default 5
     */
    interval: number;
    /**
     * Sets the segment width of the ruler.
     * @default 100
     */
    segmentWidth: number;
    /**
     * Defines the orientation of the ruler.
     * @default 'Horizontal'
     */
    orientation: RulerOrientation;
    /**
     * Defines the alignment of the tick in the ruler.
     * @default 'RightOrBottom'
     */
    tickAlignment: TickAlignment;
    /**
     * Defines the color of the marker.
     * @default 'red'
     */
    markerColor: string;
    /**
     * Defines the thickness of the ruler.
     * @default 25
     */
    thickness: number;
    /**
     * Sets the segment width of the ruler.
     * @default null
     * @deprecated
     */
    arrangeTick: Function | string;
    /**
     * Defines the length of the ruler.
     * @default 400
     */
    length: number;
    /**   @private  */
    offset: number;
    /**   @private  */
    scale: number;
    /**   @private  */
    startValue: number;
    /**   @private  */
    defStartValue: number;
    /**   @private  */
    hRulerOffset: number;
    /**   @private  */
    vRulerOffset: number;
    /**
     * Constructor for creating the Ruler Component
     */
    constructor(options?: RulerModel, element?: string | HTMLElement);
    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void;
    /**
     * Renders the rulers.
     * @private
     */
    render(): void;
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName(): string;
    /**
     * To destroy the ruler
     * @return {void}
     */
    destroy(): void;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * Refreshes the ruler when the Ruler properties are updated
     * @param options
     */
    onPropertyChanged(newProp: RulerModel, oldProp: RulerModel): void;
    private updateRulerGeometry;
    private renderRulerSpace;
    private updateRuler;
    private updateSegments;
    private updateSegment;
    private updateTickLabel;
    private getNewSegment;
    private createNewTicks;
    private getLinePoint;
    private createTick;
    private createTickLabel;
    /**
     * @private
     * @param {number} scale
     */
    updateSegmentWidth(scale: number): number;
    private createMarkerLine;
    /**
     * @private
     * @param {HTMLElement} rulerObj - Defines the ruler Object
     * @param {PointModel} currentPoint - Defines the current point for ruler Object
     * @param {number} offset - Defines the offset ruler Object
     */
    drawRulerMarker(rulerObj: HTMLElement, currentPoint: PointModel, offset: number): void;
    private getRulerGeometry;
    private getRulerSize;
    private getRulerSVG;
    /**
     * Method to bind events for the ruler
     */
    private wireEvents;
    /**
     * Method to unbind events for the ruler
     */
    private unWireEvents;
}
export interface RulerSegment {
    segment: SVGElement;
    label: SVGTextElement;
}
export interface SegmentTranslation {
    trans: number;
}
