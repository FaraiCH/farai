import { Spreadsheet } from '../base/index';
/**
 * Represents keyboard shortcut support for Spreadsheet.
 */
export declare class KeyboardShortcut {
    private parent;
    /**
     * Constructor for the Spreadsheet Keyboard Shortcut module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private addEventListener;
    private removeEventListener;
    private keyDownHandler;
    private getModuleName;
    destroy(): void;
}
