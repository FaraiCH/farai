import { CellModel, ColumnModel } from './../base/index';
/**
 * Check whether the text is formula or not.
 * @param text
 */
export declare function checkIsFormula(text: string): boolean;
/**
 * Check whether the value is cell reference or not.
 * @param {string} value - Specify the value to check.
 */
export declare function isCellReference(value: string): boolean;
/**
 * Check whether the value is character or not.
 * @param {string} value - Specify the value to check.
 */
export declare function isChar(value: string): boolean;
export declare function inRange(range: number[], rowIdx: number, colIdx: number): boolean;
/**
 * Check whether the cell is locked or not
 * @hidden
 */
export declare function isLocked(cell: CellModel, column: ColumnModel): boolean;
