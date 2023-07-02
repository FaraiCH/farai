import { Workbook } from '../base/index';
/**
 * The `WorkbookInsert` module is used to insert cells, rows, columns and sheets in to workbook.
 */
export declare class WorkbookInsert {
    private parent;
    /**
     * Constructor for the workbook insert module.
     * @private
     */
    constructor(parent: Workbook);
    private insertModel;
    private setInsertInfo;
    private addEventListener;
    /**
     * Destroy workbook insert module.
     */
    destroy(): void;
    private removeEventListener;
    /**
     * Get the workbook insert module name.
     */
    getModuleName(): string;
}
