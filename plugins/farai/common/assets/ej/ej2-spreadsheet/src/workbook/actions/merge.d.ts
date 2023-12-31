import { Workbook } from '../base/index';
/**
 * The `WorkbookMerge` module is used to merge the range of cells.
 */
export declare class WorkbookMerge {
    private parent;
    /**
     * Constructor for the workbook merge module.
     * @private
     */
    constructor(parent: Workbook);
    private merge;
    private mergeAll;
    private mergeHorizontally;
    private getCellValue;
    private mergeVertically;
    private activeCellRange;
    private mergedRange;
    private forward;
    private forwardReverse;
    private reverse;
    private reverseForward;
    private insertHandler;
    private pasteHandler;
    private addEventListener;
    /**
     * Destroy workbook merge module.
     */
    destroy(): void;
    private removeEventListener;
    /**
     * Get the workbook merge module name.
     */
    getModuleName(): string;
}
