import { Gantt } from '../base/gantt';
import { IGanttData, ITaskbarEditedEventArgs, IParent } from '../base/interface';
import { RowPosition } from '../base/enum';
import { CellEdit } from './cell-edit';
import { TaskbarEdit } from './taskbar-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * The Edit Module is used to handle editing actions.
 */
export declare class Edit {
    private parent;
    validatedChildItems: IGanttData[];
    private isFromDeleteMethod;
    private targetedRecords;
    /**
     * @private
     */
    /** @hidden */
    private ganttData;
    /** @hidden */
    private treeGridData;
    /** @hidden */
    private draggedRecord;
    /** @hidden */
    private updateParentRecords;
    /** @hidden */
    private droppedRecord;
    /** @hidden */
    private isTreeGridRefresh;
    /** @hidden */
    isaddtoBottom: boolean;
    /** @hidden */
    addRowPosition: RowPosition;
    /** @hidden */
    addRowIndex: number;
    /** @hidden */
    private dropPosition;
    confirmDialog: Dialog;
    private taskbarMoved;
    private predecessorUpdated;
    newlyAddedRecordBackup: IGanttData;
    isBreakLoop: boolean;
    addRowSelectedItem: IGanttData;
    cellEditModule: CellEdit;
    taskbarEditModule: TaskbarEdit;
    dialogModule: DialogEdit;
    constructor(parent?: Gantt);
    private getModuleName;
    /**
     * Method to update default edit params and editors for Gantt
     */
    private updateDefaultColumnEditors;
    /**
     * Method to update editors for id column in Gantt
     */
    private updateIDColumnEditParams;
    /**
     * Method to update edit params of default progress column
     */
    private updateProgessColumnEditParams;
    /**
     * Assign edit params for id and progress columns
     */
    private updateEditParams;
    /**
     * Method to update resource column editor for default resource column
     */
    private updateResourceColumnEditor;
    /**
     * Method to create resource custom editor
     */
    private getResourceEditor;
    /**
     * Method to update task type column editor for task type
     */
    private updateTaskTypeColumnEditor;
    /**
     * Method to create task type custom editor
     */
    private getTaskTypeEditor;
    /**
     * @private
     */
    reUpdateEditModules(): void;
    private recordDoubleClick;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    deletedTaskDetails: IGanttData[];
    /**
     * Method to update record with new values.
     * @param {Object} data - Defines new data to update.
     */
    updateRecordByID(data: Object): void;
    /**
     *
     * @param data
     * @param ganttData
     * @param isFromDialog
     * @private
     */
    validateUpdateValues(data: Object, ganttData: IGanttData, isFromDialog?: boolean): void;
    /**
     * To update duration, work, resource unit
     * @param currentData
     * @param column
     */
    updateResourceRelatedFields(currentData: IGanttData, column: string): void;
    private validateScheduleValues;
    private validateScheduleByTwoValues;
    private isTaskbarMoved;
    private isPredecessorUpdated;
    /**
     * Method to check need to open predecessor validate dialog
     * @param data
     */
    private isCheckPredecessor;
    /**
     * Method to copy the ganttProperties values
     * @private
     */
    updateGanttProperties(data: IGanttData, updateData: IGanttData): void;
    /**
     * Method to update all dependent record on edit action
     * @param args
     * @private
     */
    initiateUpdateAction(args: ITaskbarEditedEventArgs): void;
    /**
     *
     * @param data method to trigger validate predecessor link by dialog
     */
    private validateTaskEvent;
    private resetValidateArgs;
    /**
     *
     * @param args - Edited event args like taskbar editing, dialog editing, cell editing
     * @private
     */
    updateEditedTask(args: ITaskbarEditedEventArgs): void;
    /**
     * To update parent records while perform drag action.
     * @return {void}
     * @private
     */
    updateParentChildRecord(data: IGanttData): void;
    /**
     * To update records while changing schedule mode.
     * @return {void}
     * @private
     */
    updateTaskScheduleModes(data: IGanttData): void;
    /**
     *
     * @param data
     * @param newStartDate
     */
    private calculateDateByRoundOffDuration;
    /**
     * To update progress value of parent tasks
     * @param cloneParent
     * @private
     */
    updateParentProgress(cloneParent: IParent): void;
    /**
     * Method to revert cell edit action
     * @param args
     * @private
     */
    revertCellEdit(args: object): void;
    /**
     *
     * @return {void}
     * @private
     */
    reUpdatePreviousRecords(isRefreshChart?: boolean, isRefreshGrid?: boolean): void;
    /**
     * Copy previous task data value to edited task data
     * @param existing
     * @param newValue
     */
    private copyTaskData;
    /**
     * To update schedule date on editing.
     * @return {void}
     * @private
     */
    private updateScheduleDatesOnEditing;
    /**
     *
     * @param ganttRecord
     */
    private updateChildItems;
    /**
     * To get updated child records.
     * @param parentRecord
     * @param childLists
     */
    private getUpdatableChildRecords;
    /**
     *
     * @private
     */
    initiateSaveAction(args: ITaskbarEditedEventArgs): void;
    private dmSuccess;
    private dmFailure;
    private updateSharedTask;
    /**
     * Method for save action success for local and remote data
     */
    private saveSuccess;
    private updateResoures;
    /**
     * @private
     */
    checkWithUnassignedTask(updateRecord: IGanttData): void;
    private addRecordAsBottom;
    private addNewRecord;
    private removeChildRecord;
    private addRecordAsChild;
    private resetEditProperties;
    /**
     * @private
     */
    endEditAction(args: ITaskbarEditedEventArgs): void;
    private saveFailed;
    /**
     * To render delete confirmation dialog
     * @return {void}
     */
    private renderDeleteConfirmDialog;
    private closeConfirmDialog;
    private confirmDeleteOkButton;
    /**
     * @private
     */
    startDeleteAction(): void;
    /**
     *
     * @param selectedRecords - Defines the deleted records
     * Method to delete the records from resource view Gantt.
     */
    private deleteResourceRecords;
    private deleteSelectedItems;
    /**
     * Method to delete record.
     * @param {number | string | number[] | string[] | IGanttData | IGanttData[]} taskDetail - Defines the details of data to delete.
     * @public
     */
    deleteRecord(taskDetail: number | string | number[] | string[] | IGanttData | IGanttData[]): void;
    /**
     * To update 'targetedRecords collection' from given array collection
     * @param taskDetailArray
     */
    private updateTargetedRecords;
    private deleteRow;
    removePredecessorOnDelete(record: IGanttData): void;
    private updatePredecessorValues;
    /**
     * Method to update TaskID of a gantt record
     */
    updateTaskId(currentId: string | number, newId: number | string): void;
    private updatePredecessorOnUpdateId;
    private deleteChildRecords;
    removeFromDataSource(deleteRecordIDs: string[]): void;
    private removeData;
    private initiateDeleteAction;
    private deleteSuccess;
    /**
     *
     * @return {number | string}
     * @private
     */
    getNewTaskId(): number | string;
    /**
     *
     * @return {void}
     * @private
     */
    private prepareNewlyAddedData;
    /**
     *
     * @return {IGanttData}
     * @private
     */
    private updateNewlyAddedDataBeforeAjax;
    /**
     *
     * @return {number}
     * @private
     */
    getChildCount(record: IGanttData, count: number): number;
    /**
     *
     * @return {number}
     * @private
     */
    private getVisibleChildRecordCount;
    /**
     *
     * @return {void}
     * @private
     */
    updatePredecessorOnIndentOutdent(parentRecord: IGanttData): void;
    /**
     *
     * @return {string}
     * @private
     */
    private predecessorToString;
    /**
     *
     * @return {void}
     * @private
     */
    private backUpAndPushNewlyAddedRecord;
    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    private recordCollectionUpdate;
    /**
     *
     * @return {ITaskAddedEventArgs}
     * @private
     */
    private constructTaskAddedEventArgs;
    /**
     *
     * @return {void}
     * @private
     */
    private addSuccess;
    /**
     *
     * @return {void}
     * @private
     */
    updateRealDataSource(addedRecord: IGanttData, rowPosition: RowPosition): void;
    /**
     *
     * @return {boolean | void}
     * @private
     */
    private addDataInRealDataSource;
    /**
     * Method to add new record.
     * @param {Object | IGanttData} data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @return {void}
     * @private
     */
    addRecord(data?: Object | IGanttData, rowPosition?: RowPosition, rowIndex?: number): void;
    private updateNewRecord;
    /**
     * Method to reset the flag after adding new record
     */
    private _resetProperties;
    /**
     * Method to update unique id collection in TreeGrid
     */
    private updateTreeGridUniqueID;
    private refreshNewlyAddedRecord;
    /**
     *
     * @return {void}
     * @private
     */
    private removeAddedRecord;
    /**
     * indent a selected record
     */
    indent(): void;
    /**
     * To perform outdent operation for selected row
     */
    outdent(): void;
    private indentOutdentRow;
    private reArrangeRows;
    private indentSuccess;
    private indentFailure;
    private indentOutdentSuccess;
    private refreshDataSource;
    private deleteDragRow;
    private dropMiddle;
    private updateChildRecordLevel;
    private updateChildRecord;
    private removeRecords;
    private removeChildItem;
    private recordLevel;
}
