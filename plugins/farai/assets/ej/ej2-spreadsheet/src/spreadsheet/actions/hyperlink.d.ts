import { Spreadsheet } from '../index';
/**
 * `Hyperlink` module
 */
export declare class SpreadsheetHyperlink {
    private parent;
    /**
     * Constructor for Hyperlink module.
     */
    constructor(parent: Spreadsheet);
    /**
     * To destroy the Hyperlink module.
     * @return {void}
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
    private keyUpHandler;
    private initiateHyperlinkHandler;
    private dlgClickHandler;
    private showDialog;
    private editHyperlinkHandler;
    private openHyperlinkHandler;
    private removeHyperlinkHandler;
    private hlOpenHandler;
    private hyperlinkClickHandler;
    private createHyperlinkElementHandler;
    private hyperEditContent;
    private hyperlinkContent;
}
