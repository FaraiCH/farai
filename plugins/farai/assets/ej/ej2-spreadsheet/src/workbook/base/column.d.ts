import { SheetModel } from './index';
import { ColumnModel } from './column-model';
import { ChildProperty } from '@syncfusion/ej2-base';
import { FormatModel } from '../common/index';
/**
 * Configures the Column behavior for the spreadsheet.
 */
export declare class Column extends ChildProperty<Column> {
    /**
     * Specifies index of the column. Based on the index, column properties are applied.
     * @default 0
     * @asptype int
     */
    index: number;
    /**
     * Specifies width of the column.
     * @default 64
     * @asptype int
     */
    width: number;
    /**
     * specifies custom width of the column.
     * @default false
     */
    customWidth: boolean;
    /**
     * To hide/show the column in spreadsheet.
     * @default false
     */
    hidden: boolean;
    /**
     * Specifies format of the column.
     * @default {}
     */
    format: FormatModel;
    /**
     * To lock/unlock the column in the protected sheet.
     * @default null
     */
    isLocked: boolean;
}
/**
 * @hidden
 */
export declare function getColumn(sheet: SheetModel, colIndex: number): ColumnModel;
/** @hidden */
export declare function setColumn(sheet: SheetModel, colIndex: number, column: ColumnModel): void;
/**
 * @hidden
 */
export declare function getColumnWidth(sheet: SheetModel, index: number, skipHidden?: boolean): number;
/**
 * @hidden
 */
export declare function getColumnsWidth(sheet: SheetModel, startCol: number, endCol?: number): number;
/** @hidden */
export declare function isHiddenCol(sheet: SheetModel, index: number): boolean;
