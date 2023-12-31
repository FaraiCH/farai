import { DiagramElement } from '../elements/diagram-element';
import { Thickness } from '../appearance';
import { Size } from '../../primitives/size';
import { PointModel } from '../../primitives/point-model';
/**
 * Container module is used to group related objects
 */
export declare class Container extends DiagramElement {
    /**
     * Gets/Sets the space between the container and its immediate children
     */
    padding: Thickness;
    /**
     * Gets/Sets the collection of child elements
     */
    children: DiagramElement[];
    private desiredBounds;
    /** @private */
    measureChildren: boolean;
    /**
     * returns whether the container has child elements or not
     */
    hasChildren(): boolean;
    /**   @private  */
    prevRotateAngle: number;
    /**
     * Measures the minimum space that the container requires
     *
     * @param {Size} availableSize
     */
    measure(availableSize: Size, id?: string, callback?: Function): Size;
    /**
     * Arranges the container and its children
     * @param {Size} desiredSize
     */
    arrange(desiredSize: Size): Size;
    /**
     * Stretches the child elements based on the size of the container
     * @param {Size} size
     */
    protected stretchChildren(size: Size): void;
    /**
     * Considers the padding of the element when measuring its desired size
     * @param {Size} size
     */
    protected applyPadding(size: Size): void;
    /**
     * Finds the offset of the child element with respect to the container
     * @param {DiagramElement} child
     * @param {PointModel} center
     */
    protected findChildOffsetFromCenter(child: DiagramElement, center: PointModel): void;
    private GetChildrenBounds;
}
