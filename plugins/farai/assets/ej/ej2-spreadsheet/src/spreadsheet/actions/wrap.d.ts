import { Spreadsheet } from '../base/spreadsheet';
/**
 * Represents Wrap Text support for Spreadsheet.
 */
export declare class WrapText {
    private parent;
    /**
     * Constructor for the Spreadsheet Wrap Text module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private addEventListener;
    private removeEventListener;
    private wrapTextHandler;
    private ribbonClickHandler;
    private getTextWidth;
    private rowHeightChangedHandler;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    destroy(): void;
}
