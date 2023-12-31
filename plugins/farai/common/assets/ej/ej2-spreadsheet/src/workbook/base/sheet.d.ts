import { Workbook } from './workbook';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { RangeModel, SheetModel, UsedRangeModel } from './sheet-model';
import { RowModel } from './row-model';
import { ColumnModel } from './column-model';
import { SheetState, ProtectSettingsModel, ConditionalFormatModel } from '../common/index';
import { ChildProperty } from '@syncfusion/ej2-base';
import { WorkbookModel } from './workbook-model';
/**
 * Configures the range processing for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                  name: 'First Sheet',
 *                  ranges: [{ dataSource: defaultData }],
 *                  rows: [{
 *                          index: 30,
 *                          cells: [{ index: 4, value: 'Total Amount:' },
 *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                  }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
export declare class Range extends ChildProperty<Sheet> {
    /**
     * Specifies the data as JSON / Data manager to the sheet.
     * @default null
     */
    dataSource: Object[] | DataManager;
    /**
     * Specifies the start cell from which the datasource will be populated.
     * @default 'A1'
     */
    startCell: string;
    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     * @default null
     */
    query: Query;
    /**
     * Show/Hide the field of the datasource as header.
     * @default true
     */
    showFieldAsHeader: boolean;
    /**
     * Template helps to compiles the given HTML String (or HTML Element ID) into HtML Element and append to the Cell.
     *  @default ''
     */
    template: string;
    /**
     * Specifies the address for updating the dataSource or template.
     * @default 'A1'
     */
    address: string;
    protected setProperties(prop: object, muteOnChange: boolean): void;
}
/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
export declare class UsedRange extends ChildProperty<UsedRange> {
    /**
     * Specifies the last used row index of the sheet.
     * @default 0
     * @asptype int
     */
    rowIndex: number;
    /**
     * Specifies the last used column index of the sheet.
     * @default 0
     * @asptype int
     */
    colIndex: number;
}
/**
 * Configures the sheet behavior for the spreadsheet.
 */
export declare class Sheet extends ChildProperty<WorkbookModel> {
    /**
     * Represents sheet unique id.
     * @default 0
     * @hidden
     */
    id: number;
    /**
     * Configures row and its properties for the sheet.
     * @default []
     */
    rows: RowModel[];
    /**
     * Configures column and its properties for the sheet.
     * @default []
     */
    columns: ColumnModel[];
    /**
     * Configures protect and its options.
     * @default { selectCells: false, formatCells: false, formatRows: false, formatColumns: false, insertLink: false  }
     */
    protectSettings: ProtectSettingsModel;
    /**
     * Specifies the collection of range for the sheet.
     * @default []
     */
    ranges: RangeModel[];
    /**
     * Specifies the conditional formatting for the sheet.
     * @default []
     */
    conditionalFormats: ConditionalFormatModel[];
    /**
     * Specifies index of the sheet. Based on the index, sheet properties are applied.
     * @default 0
     * @asptype int
     */
    index: number;
    /**
     * Specifies the name of the sheet, the name will show in the sheet tabs.
     * @default ''
     */
    name: string;
    /**
     * Defines the number of rows to be rendered in the sheet.
     * @default 100
     * @asptype int
     */
    rowCount: number;
    /**
     * Defines the number of columns to be rendered in the sheet.
     * @default 100
     * @asptype int
     */
    colCount: number;
    /**
     * Specifies selected range in the sheet.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet: Spreadsheet = new Spreadsheet({
     *      sheets: [{
     *                selectedRange: 'A1:B5'
     *          }],
     *      ...
     * });
     * spreadsheet.appendTo('#Spreadsheet');
     * ```
     * @default 'A1:A1'
     */
    selectedRange: string;
    /**
     * Specifies active cell within `selectedRange` in the sheet.
     * @default 'A1'
     */
    activeCell: string;
    /**
     * Defines the used range of the sheet.
     * @default { rowIndex: 0, colIndex: 0 }
     */
    usedRange: UsedRangeModel;
    /**
     * Specified cell will be positioned at the upper-left corner of the sheet.
     * @default 'A1'
     */
    topLeftCell: string;
    /**
     * Specifies to show / hide column and row headers in the sheet.
     * @default true
     */
    showHeaders: boolean;
    /**
     * Specifies to show / hide grid lines in the sheet.
     * @default true
     */
    showGridLines: boolean;
    /**
     * Specifies to  protect the cells in the sheet.
     * @default false
     */
    isProtected: boolean;
    /**
     * Specifies the sheet visibility state. There must be at least one visible sheet in Spreadsheet.
     * @default 'Visible'
     */
    state: SheetState;
    /**
     * Represents the maximum row height collection.
     * @default []
     * @hidden
     */
    maxHgts: object[];
}
/**
 * To get sheet index from address.
 * @hidden
 */
export declare function getSheetIndex(context: Workbook, name: string): number;
/**
 * To get sheet index from sheet id.
 * @hidden
 */
export declare function getSheetIndexFromId(context: Workbook, id: number): number;
/**
 * To get sheet name from address.
 * @hidden
 */
export declare function getSheetNameFromAddress(address: string): string;
/**
 * To get sheet index from sheet name.
 * @hidden
 */
export declare function getSheetIndexByName(context: Workbook, name: string, info: {
    visibleName: string;
    sheet: string;
    index: number;
}[]): number;
/**
 * update selected range
 * @hidden
 */
export declare function updateSelectedRange(context: Workbook, range: string, sheet?: SheetModel): void;
/**
 * get selected range
 * @hidden
 */
export declare function getSelectedRange(sheet: SheetModel): string;
/**
 * @hidden
 */
export declare function getSheet(context: Workbook, idx: number): SheetModel;
/**
 * @hidden
 */
export declare function getSheetNameCount(context: Workbook): number;
/**
 * @hidden
 */
export declare function getMaxSheetId(sheets: SheetModel[]): number;
/**
 * @hidden
 */
export declare function initSheet(context: Workbook, sheet?: SheetModel[]): void;
/**
 * get sheet name
 * @hidden
 */
export declare function getSheetName(context: Workbook, idx?: number): string;
