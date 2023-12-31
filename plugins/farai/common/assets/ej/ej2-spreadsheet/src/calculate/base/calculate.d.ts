import { INotifyPropertyChanged, EmitType, ModuleDeclaration, Base } from '@syncfusion/ej2-base';
import { CalculateModel } from './calculate-model';
import { IFormulaColl, FailureEventArgs, StoredCellInfo } from '../common/interface';
import { Parser } from './parser';
/**
 * Represents the calculate library.
 */
export declare class Calculate extends Base<HTMLElement> implements INotifyPropertyChanged {
    private lFormulas;
    /* tslint:disable-next-line:no-any */
    libraryFormulas: any;
    /** @hidden */
    storedData: Map<string, FormulaInfo>;
    private keyToRowsMap;
    private rowsToKeyMap;
    /** @hidden */
    rightBracket: string;
    /** @hidden */
    leftBracket: string;
    /** @hidden */
    sheetToken: string;
    private emptyString;
    private leftBrace;
    private rightBrace;
    cell: string;
    private cellPrefix;
    private treatEmptyStringAsZero;
    /** @hidden */
    parentObject: Object | Calculate;
    /** @hidden */
    tic: string;
    /** @hidden */
    singleTic: string;
    /** @hidden */
    trueValue: string;
    /** @hidden */
    falseValue: string;
    private parseDecimalSeparator;
    /** @hidden */
    arithMarker: string;
    /** @hidden */
    arithMarker2: string;
    private dependentCells;
    private dependentFormulaCells;
    minValue: number;
    maxValue: number;
    categoryCollection: string[];
    private dependencyLevel;
    private refreshedCells;
    private computedValues;
    /** @hidden */
    randomValues: Map<string, string>;
    /** @hidden */
    isRandomVal: boolean;
    /** @hidden */
    randCollection: string[];
    /**
     * @hidden
     */
    formulaErrorStrings: string[];
    private errorStrings;
    /** @hidden */
    grid: Object | Calculate;
    /** @hidden */
    parser: Parser;
    private parseArgumentSeparator;
    private dateTime1900;
    private isParseDecimalSeparatorChanged;
    private isArgumentSeparatorChanged;
    private sheetFamilyID;
    private defaultFamilyItem;
    private sheetFamiliesList;
    private modelToSheetID;
    /** @hidden */
    tokenCount: number;
    private sortedSheetNames;
    private tempSheetPlaceHolder;
    /** @hidden */
    namedRanges: Map<string, string>;
    protected injectedModules: Function[];
    private formulaInfoTable;
    private oaDate;
    private millisecondsOfaDay;
    private parseDateTimeSeparator;
    /**
     * Specifies a value that indicates whether the basic formulas need to be included.
     * @default true
     */
    includeBasicFormulas: boolean;
    /**
     * Triggers when the calculation caught any errors.
     * @event
     */
    onFailure: EmitType<FailureEventArgs>;
    /**
     * Base constructor for creating Calculate library.
     */
    constructor(parent?: Object);
    /**
     * To get the argument separator to split the formula arguments.
     * @returns string
     */
    getParseArgumentSeparator(): string;
    /**
     * To set the argument separator to split the formula arguments.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    setParseArgumentSeparator(value: string): void;
    /**
     * To get the date separator to split the date value.
     * @returns string
     */
    getParseDateTimeSeparator(): string;
    /**
     * To set whether the empty string is treated as zero or not.
     * @param {boolean} value
     * @returns boolean
     */
    setTreatEmptyStringAsZero(value: boolean): void;
    /**
     * To get whether the empty string is treated as zero or not.
     * @returns boolean
     */
    getTreatEmptyStringAsZero(): boolean;
    /**
     * To set the date separator to split the date value.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    setParseDateTimeSeparator(value: string): void;
    /**
     * To provide the array of modules needed.
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Dynamically injects the required modules to the library.
     * @hidden
     */
    static Inject(...moduleList: Function[]): void;
    /**
     * Get injected modules
     * @hidden
     */
    getInjectedModules(): Function[];
    onPropertyChanged(newProp: CalculateModel, oldProp: CalculateModel): void;
    protected getModuleName(): string;
    /** @hidden */
    getFormulaCharacter(): string;
    /** @hidden */
    isUpperChar(text: string): boolean;
    private resetKeys;
    /**
     * @hidden
     */
    updateDependentCell(cellRef: string): void;
    private addToFormulaDependentCells;
    /**
     * @hidden
     */
    getDependentCells(): Map<string, string[]>;
    /**
     * @hidden
     */
    getDependentFormulaCells(): Map<string, Map<string, string>>;
    /**
     * To get library formulas collection.
     * @returns Map<string, Function>
     */
    getLibraryFormulas(): Map<string, IFormulaColl>;
    /**
     * To get library function.
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns Function
     */
    getFunction(libFormula: string): Function;
    /** @hidden */
    intToDate(val: string): Date;
    getFormulaInfoTable(): Map<string, FormulaInfo>;
    /**
     * To get the formula text.
     * @private
     */
    private getFormula;
    /**
     * To get the formula text.
     * @returns void
     */
    getParseDecimalSeparator(): string;
    /**
     * To get the formula text.
     * @param {string} value - Specifies the decimal separator value.
     * @returns void
     */
    setParseDecimalSeparator(value: string): void;
    /** @hidden */
    getSheetToken(cellRef: string): string;
    /** @hidden */
    getSheetID(grd: Object): number;
    /** @hidden */
    parseFloat(value: string | number): number;
    /**
     * To get the row index of the given cell.
     * @param {string} cell - Cell address for getting row index.
     * @returns number
     */
    rowIndex(cell: string): number;
    /**
     * To get the column index of the given cell.
     * @param {string} cell - Cell address for getting column index.
     * @returns number
     */
    colIndex(cell: string): number;
    /**
     * To get the valid error strings.
     * @hidden
     */
    getErrorStrings(): string[];
    /** @hidden */
    substring(text: string, startIndex: number, length?: number): string;
    /** @hidden */
    isChar(c: string): boolean;
    /** @hidden */
    getSheetFamilyItem(model: Object): CalcSheetFamilyItem;
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns void
     */
    setKeyValue(key: string, value: string | number): void;
    /**
     * @hidden
     */
    clearFormulaDependentCells(cell: string): void;
    private arrayRemove;
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for getting the corresponding value.
     * @returns string | number
     */
    getKeyValue(key: string): string | number;
    getNamedRanges(): Map<string, string>;
    /**
     * Adds a named range to the NamedRanges collection.
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @param {number} sheetIndex - Defined scope for the specified name. Default - Workbook scope.
     * @returns boolean
     */
    addNamedRange(name: string, range: string): boolean;
    /**
     * Remove the specified named range form the named range collection.
     * @param {string} name - Name of the specified named range.
     * @returns boolean
     */
    removeNamedRange(name: string): boolean;
    /** @hidden */
    convertAlpha(col: number): string;
    /** @hidden */
    getCellCollection(cellRange: string): string[] | string;
    /**
     * Compute the given formula.
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns string | number
     */
    computeFormula(formulaText: string): string | number;
    /** @hidden */
    computeSumIfAndAvgIf(range: string[]): number[] | string;
    /** @hidden */
    computeLookup(range: string[]): string;
    computeVLookup(range: string[]): string;
    findWildCardValue(lookVal: string, cellValue: string): string;
    /** @hidden */
    getComputeSumIfValue(criteriaRange: string[] | string, sumRange: string[] | string, criteria: string, checkCriteria: number, op: string): number[];
    /** @hidden */
    computeAndOr(args: string[], op: string): string;
    /** @hidden */
    removeTics(text: string): string;
    /** @hidden */
    getCellFrom(range: string): string;
    private computeValue;
    private getValArithmetic;
    /** @hidden */
    processLogical(stack: string[], operator: string): string;
    /** @hidden */
    computeStoreCells(sCell: StoredCellInfo): string[];
    computeIfsFormulas(range: string[], isCountIfs?: string, isAvgIfs?: string): string | number;
    private processNestedFormula;
    /** @hidden */
    isNaN(value: string | number): boolean;
    /** @hidden */
    fromOADate(doubleNumber: number): Date;
    /** @hidden */
    getSerialDateFromDate(year: number, month: number, day: number): number;
    /** @hidden */
    toOADate(dateTime: Date): number;
    /** @hidden */
    calculateDate(date: string): string;
    /** @hidden */
    isTextEmpty(s: string): boolean;
    /** @hidden */
    isDigit(text: string): boolean;
    private findLastIndexOfq;
    /**
     * To get the exact value from argument.
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns string
     */
    getValueFromArg(arg: string): string;
    isDate(date: any): Date;
    private isValidCellReference;
    /** @hidden */
    parseDate(date: any): any;
    /** @hidden */
    isCellReference(args: string): boolean;
    /** @hidden */
    setTokensForSheets(text: string): string;
    private getParentObjectCellValue;
    private getParentCellValue;
    /**
     * Getting the formula result.
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns string
     */
    getValueRowCol(grid: Object, row: number, col: number): string;
    /**
     * To add custom library formula.
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns void
     */
    defineFunction(formulaName: string, functionName: string | Function): void;
    /**
     * Specifies when changing the value.
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     */
    valueChanged(grid: string, changeArgs: ValueChangedArgs, isCalculate?: boolean): void;
    /** @hidden */
    getComputedValue(): Map<string, string | number>;
    /**
     * @hidden
     */
    setValueRowCol(value: number, formulaValue: string | number, row: number, col: number): void;
    private getSortedSheetNames;
    /** @hidden */
    getErrorLine(error: string): string;
    /** @hidden */
    createSheetFamilyID(): number;
    /** @hidden */
    computeMinMax(args: string[], operation: string): string;
    /** @hidden */
    calculateAvg(args: string[]): string;
    /**
     * @hidden
     */
    registerGridAsSheet(refName: string, model: Object | string, sheetFamilyID: number): string;
    /**
     * @hidden
     */
    unregisterGridAsSheet(refName: string, model: string | Object): void;
    /**
     * @hidden
     */
    computeExpression(formula: string): string | number;
    private isSheetMember;
    /**
     * To dispose the calculate engine.
     * @returns void
     */
    dispose(): void;
    refreshRandValues(cellRef: string): void;
    refresh(cellRef: string): void;
}
/** @hidden */
export declare class FormulaError {
    /**
     * @hidden
     */
    message: string;
    formulaCorrection: boolean;
    constructor(errorMessage: string, formulaAutoCorrection?: boolean);
}
/** @hidden */
export declare class FormulaInfo {
    /**
     * @hidden
     */
    calcID: number;
    /**
     * @hidden
     */
    formulaText: string;
    private formulaValue;
    private parsedFormula;
    private calcID1;
    /**
     * @hidden
     */
    getFormulaText(): string;
    /**
     * @hidden
     */
    setFormulaText(value: string): void;
    /**
     * @hidden
     */
    getFormulaValue(): string | number;
    /**
     * @hidden
     */
    setFormulaValue(value: string | number): void;
    /**
     * @hidden
     */
    getParsedFormula(): string;
    /**
     * @hidden
     */
    setParsedFormula(value: string): void;
}
/** @hidden */
export declare class CalcSheetFamilyItem {
    /**
     * @hidden
     */
    isSheetMember: boolean;
    /**
     * @hidden
     */
    parentObjectToToken: Map<Object, string>;
    /**
     * @hidden
     */
    sheetDependentCells: Map<string, string[]>;
    /**
     * @hidden
     */
    sheetDependentFormulaCells: Map<string, Map<string, string>>;
    /**
     * @hidden
     */
    sheetNameToParentObject: Map<string, Object>;
    /**
     * @hidden
     */
    sheetNameToToken: Map<string, string>;
    /**
     * @hidden
     */
    tokenToParentObject: Map<string, Object>;
    /**
     * @hidden
     */
    sheetFormulaInfotable: Map<string, FormulaInfo>;
}
/**
 * @hidden
 */
export declare function getAlphalabel(col: number): string;
export declare class ValueChangedArgs {
    /** @hidden */
    row: number;
    /** @hidden */
    col: number;
    /** @hidden */
    value: number | string;
    /** @hidden */
    getRowIndex: Function;
    /** @hidden */
    setRowIndex: Function;
    /** @hidden */
    getColIndex: Function;
    /** @hidden */
    setColIndex: Function;
    /** @hidden */
    getValue: Function;
    /** @hidden */
    setValue: Function;
    constructor(row: number, col: number, value: number | string);
}
