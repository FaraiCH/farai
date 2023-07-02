import { Workbook } from '../base/index';
/**
 * The `WorkbookFilter` module is used to handle filter action in Spreadsheet.
 */
export declare class WorkbookFilter {
    private parent;
    private filterRange;
    /**
     * Constructor for WorkbookFilter module.
     */
    constructor(parent: Workbook);
    /**
     * To destroy the filter module.
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    /**
     * Filters a range of cells in the sheet.
     * @param args - arguments for filtering.
     */
    private initiateFilterHandler;
    /**
     * Hides or unhides the rows based on the filter predicates.
     */
    private setFilter;
    /**
     * Clears all the filters in the sheet.
     */
    private clearAllFilterHandler;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
}
