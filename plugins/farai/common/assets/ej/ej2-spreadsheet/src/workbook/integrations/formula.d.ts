import { Workbook } from '../base/index';
import { Calculate } from '../../calculate/index';
/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
export declare class WorkbookFormula {
    private parent;
    private calcID;
    uniqueOBracket: string;
    uniqueCBracket: string;
    uniqueCSeparator: string;
    uniqueCOperator: string;
    uniquePOperator: string;
    uniqueSOperator: string;
    uniqueMOperator: string;
    uniqueDOperator: string;
    uniqueModOperator: string;
    uniqueConcateOperator: string;
    uniqueEqualOperator: string;
    uniqueExpOperator: string;
    uniqueGTOperator: string;
    uniqueLTOperator: string;
    calculateInstance: Calculate;
    private sheetInfo;
    /**
     * Constructor for formula module in Workbook.
     * @private
     */
    constructor(workbook: Workbook);
    private init;
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    destroy(): void;
    private addEventListener;
    private removeEventListener;
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName(): string;
    private initCalculate;
    private performFormulaOperation;
    private referenceError;
    private getSheetInfo;
    private addCustomFunction;
    private updateSheetInfo;
    private sheetDeletion;
    private removeSheetTokenIndex;
    private renameUpdation;
    private updateDataContainer;
    private parseSheetRef;
    private registerSheet;
    private unRegisterSheet;
    private refreshCalculate;
    private autoCorrectFormula;
    private initiateDefinedNames;
    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    private addDefinedName;
    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    private removeDefinedName;
    private checkIsNameExist;
    private getIndexFromNameColl;
    private toFixed;
    private aggregateComputation;
    private clearFormula;
    private refreshFormula;
    private refreshInsDelFormula;
    private parseFormula;
    private getUniqueCharVal;
    private isUniqueChar;
    private markSpecialChar;
    private refreshNamedRange;
}
