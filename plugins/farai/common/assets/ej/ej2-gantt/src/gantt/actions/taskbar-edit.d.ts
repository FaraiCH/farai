import { Gantt } from '../base/gantt';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, ITaskSegment } from '../base/interface';
import { DateProcessor } from '../base/date-processor';
/**
 * File for handling taskbar editing operation in Gantt.
 */
export declare class TaskbarEdit extends DateProcessor {
    protected parent: Gantt;
    taskBarEditElement: HTMLElement;
    taskBarEditRecord: IGanttData;
    taskBarEditAction: string;
    roundOffDuration: boolean;
    private mouseDownX;
    private mouseDownY;
    mouseMoveX: number;
    mouseMoveY: number;
    previousItem: ITaskData;
    previousItemProperty: string[];
    taskbarEditedArgs: ITaskbarEditedEventArgs;
    private progressBorderRadius;
    private scrollTimer;
    timerCount: number;
    dragMouseLeave: boolean;
    tooltipPositionX: number;
    isMouseDragged: boolean;
    private falseLine;
    connectorSecondElement: Element;
    connectorSecondRecord: IGanttData;
    connectorSecondAction: string;
    fromPredecessorText: string;
    toPredecessorText: string;
    finalPredecessor: string;
    dependencyCancel: boolean;
    drawPredecessor: boolean;
    private highlightedSecondElement;
    private editTooltip;
    private canDrag;
    /** @private */
    tapPointOnFocus: boolean;
    private editElement;
    touchEdit: boolean;
    private prevZIndex;
    private previousMouseMove;
    private elementOffsetLeft;
    private elementOffsetTop;
    private elementOffsetWidth;
    private elementOffsetHeight;
    segmentIndex: number;
    constructor(ganttObj?: Gantt);
    private wireEvents;
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    private initPublicProp;
    private mouseDownHandler;
    private mouseClickHandler;
    private showHideActivePredecessors;
    private applyActiveColor;
    private validateConnectorPoint;
    private mouseLeaveHandler;
    /**
     * To update taskbar edited elements on mouse down action.
     * @return {void}
     * @private
     */
    updateTaskBarEditElement(e: PointerEvent): void;
    /**
     * To show/hide taskbar editing elements.
     * @return {void}
     * @private
     */
    showHideTaskBarEditingElements(element: Element, secondElement: Element, fadeConnectorLine?: boolean): void;
    /**
     * To get taskbar edit actions.
     * @return {string}
     * @private
     */
    private getTaskBarAction;
    /**
     * To update property while perform mouse down.
     * @return {void}
     * @private
     */
    private updateMouseDownProperties;
    private isMouseDragCheck;
    /**
     * To handle mouse move action in chart
     * @param e
     * @private
     */
    mouseMoveAction(event: PointerEvent): void;
    /**
     * Method to update taskbar editing action on mous move.
     * @return {Boolean}
     * @private
     */
    taskBarEditingAction(e: PointerEvent, isMouseClick: boolean): void;
    /**
     * To update property while perform mouse move.
     * @return {void}
     * @private
     */
    private updateMouseMoveProperties;
    /**
     * To start the scroll timer.
     * @return {void}
     * @private
     */
    startScrollTimer(direction: string): void;
    /**
     * To stop the scroll timer.
     * @return {void}
     * @private
     */
    stopScrollTimer(): void;
    /**
     * To update left and width while perform taskbar drag operation.
     * @return {void}
     * @private
     */
    private enableDragging;
    /**
     * To update left and width while perform progress resize operation.
     * @return {void}
     * @private
     */
    private performProgressResize;
    /**
     * To update left and width while perform taskbar left resize operation.
     * @return {void}
     * @private
     */
    private enableLeftResizing;
    private enableSplitTaskLeftResize;
    /**
     * Update mouse position and edited item value
     * @param e
     * @param item
     */
    private updateEditPosition;
    /**
     *  To update milestone property.
     * @return {void}
     * @private
     */
    private updateIsMilestone;
    /**
     * To update left and width while perform taskbar right resize operation.
     * @return {void}
     * @private
     */
    private enableRightResizing;
    /**
     * To updated startDate and endDate while perform taskbar edit operation.
     * @return {void}
     * @private
     */
    private updateEditedItem;
    private updateChildDrag;
    private updateSplitLeftResize;
    private updateSplitRightResizing;
    sumOfDuration(segments: ITaskSegment[]): number;
    private setSplitTaskDrag;
    /**
     * To get roundoff enddate.
     * @return {number}
     * @private
     */
    private getRoundOffEndLeft;
    /**
     * To get roundoff startdate.
     * @return {number}
     * @private
     */
    getRoundOffStartLeft(ganttRecord: ITaskData | ITaskSegment, isRoundOff: Boolean): number;
    /**
     * To get date by left value.
     * @return {Date}
     * @private
     */
    getDateByLeft(left: number): Date;
    /**
     * To get timezone offset.
     * @return {number}
     * @private
     */
    private getDefaultTZOffset;
    /**
     * To check whether the date is in DST.
     * @return {boolean}
     * @private
     */
    private isInDst;
    /**
     * To set item position.
     * @return {void}
     * @private
     */
    private setItemPosition;
    /**
     * To handle mouse up event in chart
     * @param e
     * @private
     */
    mouseUpHandler(e: PointerEvent): void;
    /**
     * To perform taskbar edit operation.
     * @return {void}
     * @private
     */
    taskBarEditedAction(event: PointerEvent): void;
    /**
     * To cancel the taskbar edt action.
     * @return {void}
     * @private
     */
    cancelTaskbarEditActionInMouseLeave(): void;
    updateSegmentProgress(taskData: ITaskData): void;
    /**
     * To trigger taskbar edited event.
     * @return {void}
     * @private
     */
    taskbarEdited(arg: ITaskbarEditedEventArgs): void;
    /**
     * To get progress in percentage.
     * @return {number}
     * @private
     */
    private getProgressPercent;
    /**
     * false line implementation.
     * @return {void}
     * @private
     */
    private drawFalseLine;
    /**
     *
     * @param isRemoveConnectorPointDisplay
     * @private
     */
    removeFalseLine(isRemoveConnectorPointDisplay: boolean): void;
    /**
     *
     * @param e
     * @private
     */
    updateConnectorLineSecondProperties(e: PointerEvent): void;
    private triggerDependencyEvent;
    private getCoordinate;
    private getElementByPosition;
    private multipleSelectionEnabled;
    private unWireEvents;
    /**
     * @private
     */
    destroy(): void;
}
