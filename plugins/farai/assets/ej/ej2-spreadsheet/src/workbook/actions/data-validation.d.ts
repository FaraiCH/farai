import { Workbook } from '../base/index';
/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
export declare class WorkbookDataValidation {
    private parent;
    /**
     * Constructor for WorkbookSort module.
     */
    constructor(parent: Workbook);
    /**
     * To destroy the sort module.
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    private addValidationHandler;
    private removeValidationHandler;
    private ValidationHandler;
    private addHighlightHandler;
    private removeHighlightHandler;
    private InvalidDataHandler;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
}
