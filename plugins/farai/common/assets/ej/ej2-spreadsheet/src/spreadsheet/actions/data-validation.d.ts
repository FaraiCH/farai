import { Spreadsheet } from '../index';
/**
 * Represents Data Validation support for Spreadsheet.
 */
export declare class DataValidation {
    private parent;
    private data;
    private listObj;
    private dataList;
    private typeData;
    private operatorData;
    /**
     * Constructor for the Spreadsheet Data Validation module.
     */
    constructor(parent: Spreadsheet);
    /**
     * To destroy the Data Validation module.
     * @return {void}
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    private removeValidationHandler;
    private mouseDownHandler;
    private keyUpHandler;
    private listOpen;
    private invalidDataHandler;
    private listHandler;
    private updateDataSource;
    private listValueChange;
    private initiateDataValidationHandler;
    private dataValidationContent;
    private userInput;
    private dlgClickHandler;
    private FormattedValue;
    private isDialogValidator;
    private isValidationHandler;
    private checkDataValidation;
    private formatValidation;
    private validationErrorHandler;
    private errorDlgHandler;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
}
