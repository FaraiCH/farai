import { Gantt } from '../base/gantt';
import { ITaskData, ITaskSegment } from '../base/interface';
import { ColumnModel } from '../models/column';
/**
 * To handle cell edit action on default columns and custom columns
 */
export declare class CellEdit {
    private parent;
    /**
     * @private
     */
    isCellEdit: boolean;
    editedColumn: ColumnModel;
    constructor(ganttObj: Gantt);
    /**
     * Bind all editing related properties from Gantt to TreeGrid
     */
    private bindTreeGridProperties;
    /**
     * Ensure current cell was editable or not
     * @param args
     */
    private ensureEditCell;
    /**
     * To render edit dialog and to focus on notes tab
     * @param args
     */
    private openNotesEditor;
    private isValueChange;
    /**
     * Initiate cell save action on Gantt with arguments from TreeGrid
     * @param args
     * @param editedObj
     * @private
     */
    initiateCellEdit(args: object, editedObj: object): void;
    /**
     * To update task name cell with new value
     * @param args
     */
    private taskNameEdited;
    /**
     * To update task notes cell with new value
     * @param args
     */
    private notedEdited;
    /**
     * To update task schedule mode cell with new value
     * @param args
     */
    private taskmodeEdited;
    /**
     * To update task start date cell with new value
     * @param args
     */
    private startDateEdited;
    validateEndDateWithSegments(ganttProp: ITaskData): ITaskSegment[];
    /**
     * To update task end date cell with new value
     * @param args
     */
    private endDateEdited;
    /**
     * To update duration cell with new value
     * @param args
     */
    private durationEdited;
    /**
     * To update start date, end date based on duration
     * @param args
     */
    private updateDates;
    /**
     * To update progress cell with new value
     * @param args
     */
    private progressEdited;
    /**
     * To update baselines with new baseline start date and baseline end date
     * @param args
     */
    private baselineEdited;
    /**
     * To update task's resource cell with new value
     * @param args
     * @param editedObj
     */
    private resourceEdited;
    /**
     * To update task's predecessor cell with new value
     * @param editedArgs
     * @param cellEditArgs
     */
    private dependencyEdited;
    /**
     * To update task's work cell with new value
     * @param editedArgs
     */
    private workEdited;
    /**
     * To update task type cell with new value
     * @param args
     * @param editedObj
     */
    private typeEdited;
    /**
     * To compare start date and end date from Gantt record
     * @param ganttRecord
     */
    private compareDatesFromRecord;
    /**
     * To start method save action with edited cell value
     * @param args
     */
    private updateEditedRecord;
    /**
     * To remove all public private properties
     * @private
     */
    destroy(): void;
}
