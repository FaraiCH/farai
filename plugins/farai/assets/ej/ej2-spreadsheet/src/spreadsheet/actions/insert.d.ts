import { Spreadsheet } from '../base/index';
/**
 * The `Insert` module is used to insert cells, rows, columns and sheets in to the spreadsheet.
 */
export declare class Insert {
    private parent;
    /**
     * Constructor for the Spreadsheet insert module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private insert;
    private refreshImgElement;
    private addEventListener;
    /**
     * Destroy insert module.
     */
    destroy(): void;
    private removeEventListener;
    /**
     * Get the insert module name.
     */
    getModuleName(): string;
}
