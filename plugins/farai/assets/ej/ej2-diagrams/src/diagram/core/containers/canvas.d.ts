import { Container } from './container';
import { Size } from '../../primitives/size';
/**
 * Canvas module is used to define a plane(canvas) and to arrange the children based on margin
 */
export declare class Canvas extends Container {
    /**
     * Not applicable for canvas
     *  @private
     */
    measureChildren: boolean;
    /**
     * Measures the minimum space that the canvas requires
     * @param {Size} availableSize
     */
    measure(availableSize: Size, id?: string, callback?: Function): Size;
    /**
     * Arranges the child elements of the canvas
     */
    arrange(desiredSize: Size, isStack?: boolean): Size;
    /**
     * Aligns the child element based on its parent
     * @param {DiagramElement} child
     * @param {Size} childSize
     * @param {Size} parentSize
     * @param {number} x
     * @param {number} y
     */
    private alignChildBasedOnParent;
    /**
     * Aligns the child elements based on a point
     * @param {DiagramElement} child
     * @param {number} x
     * @param {number} y
     */
    private alignChildBasedOnaPoint;
}
