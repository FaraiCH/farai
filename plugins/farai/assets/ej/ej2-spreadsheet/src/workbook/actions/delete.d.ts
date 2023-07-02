import { Workbook } from '../base/index';
/**
 * The `WorkbookDelete` module is used to delete cells, rows, columns and sheets from workbook.
 */
export declare class WorkbookDelete {
    private parent;
    /**
     * Constructor for the workbook delete module.
     * @private
     */
    constructor(parent: Workbook);
    private deleteModel;
    private setDeleteInfo;
    private addEventListener;
    /**
     * Destroy workbook delete module.
     */
    destroy(): void;
    private removeEventListener;
    /**
     * Get the workbook delete module name.
     */
    getModuleName(): string;
}
