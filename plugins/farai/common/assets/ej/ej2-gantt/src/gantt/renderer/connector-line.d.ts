import { Gantt } from '../base/gantt';
import { IGanttData, IConnectorLineObject, IPredecessor } from '../base/interface';
/**
 * To render the connector line in Gantt
 */
export declare class ConnectorLine {
    private parent;
    dependencyViewContainer: HTMLElement;
    private lineColor;
    private lineStroke;
    tooltipTable: HTMLElement;
    /**
     * @hidden
     */
    expandedRecords: IGanttData[];
    constructor(ganttObj?: Gantt);
    /**
     * To get connector line gap.
     * @return {number}
     * @private
     */
    private getconnectorLineGap;
    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    initPublicProp(): void;
    private getTaskbarMidpoint;
    /**
     * To connector line object collection.
     * @return {void}
     * @private
     */
    createConnectorLineObject(parentGanttData: IGanttData, childGanttData: IGanttData, predecessor: IPredecessor): IConnectorLineObject;
    /**
     * To render connector line.
     * @return {void}
     * @private
     */
    renderConnectorLines(connectorLinesCollection: IConnectorLineObject[]): void;
    /**
     * To get parent position.
     * @return {void}
     * @private
     */
    private getParentPosition;
    /**
     * To get line height.
     * @return {void}
     * @private
     */
    private getHeightValue;
    /**
     * To get sstype2 inner element width.
     * @return {void}
     * @private
     */
    private getInnerElementWidthSSType2;
    /**
     * To get sstype2 inner element left.
     * @return {void}
     * @private
     */
    private getInnerElementLeftSSType2;
    /**
     * To get sstype2 inner child element width.
     * @return {void}
     * @private
     */
    private getInnerChildWidthSSType2;
    private getBorderStyles;
    /**
     * To get connector line template.
     * @return {void}
     * @private
     */
    getConnectorLineTemplate(data: IConnectorLineObject): string;
    /**
     * @private
     */
    private getPosition;
    /**
     * @private
     */
    createConnectorLineTooltipTable(): void;
    /**
     * @param fromTaskName
     * @param fromPredecessorText
     * @param toTaskName
     * @param toPredecessorText
     * @private
     */
    getConnectorLineTooltipInnerTd(fromTaskName: string, fromPredecessorText: string, toTaskName?: string, toPredecessorText?: string): string;
    /**
     * Generate aria-label for connectorline
     * @private
     */
    generateAriaLabel(data: IConnectorLineObject): string;
    /**
     * To get the record based on the predecessor value
     * @private
     */
    getRecordByID(id: string): IGanttData;
    /**
     * Method to remove connector line from DOM
     * @param records
     * @private
     */
    removePreviousConnectorLines(records: IGanttData[] | object): void;
    /**
     * @private
     */
    removeConnectorLineById(id: string): void;
}
