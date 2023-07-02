import { Kanban } from '../base/kanban';
import { DragArgs } from '../base/interface';
/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
export declare class DragAndDrop {
    private parent;
    dragObj: DragArgs;
    private dragEdges;
    isDragging: Boolean;
    /**
     * Constructor for drag and drop module
     * @private
     */
    constructor(parent: Kanban);
    wireDragEvents(element: HTMLElement): void;
    private dragHelper;
    private dragStart;
    private draggedClone;
    private drag;
    private removeElement;
    private multiCloneCreate;
    private allowedTransition;
    private cellDropping;
    private addDropping;
    private dragStop;
    private updateDroppedData;
    private changeOrder;
    private toggleVisible;
    private multiCloneRemove;
    private calculateArgs;
    private getPageCoordinates;
    private getColumnKey;
    private updateScrollPosition;
    private autoScrollValidation;
    private autoScroll;
    unWireDragEvents(element: HTMLElement): void;
}
