import { Workbook, SheetModel } from '../base/index';
/**
 * To get range indexes.
 */
export declare function getRangeIndexes(range: string): number[];
/**
 * To get single cell indexes
 */
export declare function getCellIndexes(address: string): number[];
/**
 * To get column index from text.
 * @hidden
 */
export declare function getColIndex(text: string): number;
/**
 * To get cell address from given row and column index.
 */
export declare function getCellAddress(sRow: number, sCol: number): string;
/**
 * To get range address from given range indexes.
 */
export declare function getRangeAddress(range: number[]): string;
/**
 * To get column header cell text
 */
export declare function getColumnHeaderText(colIndex: number): string;
/**
 * @hidden
 */
export declare function getIndexesFromAddress(address: string): number[];
/**
 * @hidden
 */
export declare function getRangeFromAddress(address: string): string;
/**
 * Get complete address for selected range
 * @hidden
 */
export declare function getAddressFromSelectedRange(sheet: SheetModel): string;
/**
 * @hidden
 */
export declare function getAddressInfo(context: Workbook, address: string): {
    sheetIndex: number;
    indices: number[];
};
/**
 * Given range will be swapped/arranged in increasing order.
 * @hidden
 */
export declare function getSwapRange(range: number[]): number[];
/**
 * @hidden
 */
export declare function isSingleCell(range: number[]): boolean;
