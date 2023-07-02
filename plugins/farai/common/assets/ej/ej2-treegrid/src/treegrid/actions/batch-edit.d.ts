import { TreeGrid } from '../base';
/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
export declare class BatchEdit {
    private parent;
    private isSelfReference;
    private addRowRecord;
    private batchChildCount;
    private addedRecords;
    private deletedRecords;
    private matrix;
    private batchRecords;
    private currentViewRecords;
    private batchAddedRecords;
    private batchDeletedRecords;
    private batchIndex;
    private batchAddRowRecord;
    private isAdd;
    private newBatchRowAdded;
    private selectedIndex;
    private addRowIndex;
    constructor(parent: TreeGrid);
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    destroy(): void;
    /**
     * @hidden
     */
    getBatchRecords(): Object[];
    /**
     * @hidden
     */
    getAddRowIndex(): number;
    /**
     * @hidden
     */
    getSelectedIndex(): number;
    /**
     * @hidden
     */
    getBatchChildCount(): number;
    private batchPageAction;
    private cellSaved;
    private beforeBatchAdd;
    private batchAdd;
    private beforeBatchDelete;
    private updateRowIndex;
    private updateChildCount;
    private beforeBatchSave;
    private deleteUniqueID;
    private batchCancelAction;
    private batchSave;
    private getActualRowObjectIndex;
    private immutableBatchAction;
}
