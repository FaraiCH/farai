import { Workbook } from '../base/index';
/**
 * The `WorkbookConditionalFormat` module is used to handle conditional formatting action in Spreadsheet.
 */
export declare class WorkbookConditionalFormat {
    private parent;
    /**
     * Constructor for WorkbookConditionalFormat module.
     */
    constructor(parent: Workbook);
    /**
     * To destroy the conditional format module.
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    private setCFrulHandler;
    private clearRules;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
}
