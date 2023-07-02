import { Spreadsheet } from '../index';
/**
 * The `Protect-sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
export declare class ProtectSheet {
    private parent;
    private dialog;
    private optionList;
    /**
     * Constructor for protectSheet module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet);
    private init;
    /**
     * To destroy the protectSheet module.
     * @return {void}
     * @hidden
     */
    destroy(): void;
    private addEventListener;
    private removeEventListener;
    private protect;
    private createDialogue;
    private okBtnFocus;
    private checkBoxClickHandler;
    private dialogOpen;
    private selectOption;
    private protectSheetHandler;
    private editProtectedAlert;
    private lockCellsHandler;
    /**
     * Get the module name.
     * @returns string
     *
     * @private
     */
    getModuleName(): string;
}
