import { CellModel, SheetModel } from './index';
import { RowModel } from './row-model';
import { ChildProperty } from '@syncfusion/ej2-base';
import { FormatModel } from '../common/index';
/**
 * Configures the Row behavior for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                rows: [{
 *                        index: 30,
 *                        cells: [{ index: 4, value: 'Total Amount:' },
 *                               { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
export declare class Row extends ChildProperty<SheetModel> {
    /**
     * Specifies cell and its properties for the row.
     * @default []
     */
    cells: CellModel[];
    /**
     * Specifies the index to the row. Based on the index, row properties are applied.
     * @default 0
     * @asptype int
     */
    index: number;
    /**
     * Specifies height of the row.
     * @default 20
     * @asptype int
     */
    height: number;
    /**
     * specifies custom height of the row.
     * @default false
     */
    customHeight: boolean;
    /**
     * To hide/show the row in spreadsheet.
     * @default false
     */
    hidden: boolean;
    /**
     * Specifies format of the row.
     * @default {}
     */
    format: FormatModel;
}
/**
 * @hidden
 */
export declare function getRow(sheet: SheetModel, rowIndex: number): RowModel;
/** @hidden */
export declare function setRow(sheet: SheetModel, rowIndex: number, row: RowModel): void;
/** @hidden */
export declare function isHiddenRow(sheet: SheetModel, index: number): boolean;
/**
 * @hidden
 */
export declare function getRowHeight(sheet: SheetModel, rowIndex: number): number;
/**
 * @hidden
 */
export declare function setRowHeight(sheet: SheetModel, rowIndex: number, height: number): void;
/**
 * @hidden
 */
export declare function getRowsHeight(sheet: SheetModel, startRow: number, endRow?: number): number;
