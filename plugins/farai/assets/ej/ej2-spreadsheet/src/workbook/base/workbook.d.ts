import { Component, INotifyPropertyChanged, EmitType } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { WorkbookModel } from './workbook-model';
import { SheetModel, CellModel, ColumnModel, RowModel } from './index';
import { OpenOptions, BeforeOpenEventArgs, OpenFailureArgs } from '../../spreadsheet/common/interface';
import { BorderType } from '../common/index';
import { CellStyleModel, DefineNameModel, HyperlinkModel } from '../common/index';
import { ModelType, ProtectSettingsModel, ValidationModel } from '../common/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs } from '../common/interface';
import { SaveOptions, ClearOptions } from '../common/interface';
import { SortOptions, SortEventArgs, FindOptions, CellInfoEventArgs, ConditionalFormatModel } from '../common/index';
import { FilterEventArgs, FilterOptions, ChartModel } from '../common/index';
import { MergeType, ImageModel } from '../common/index';
import { ServiceLocator } from '../services/index';
/**
 * Represents the Workbook.
 */
export declare class Workbook extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Configures sheets and its options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      sheets: [{
     *                  name: 'First Sheet',
     *                  range: [{ dataSource: data }],
     *                  rows: [{
     *                          index: 5,
     *                          cells: [{ index: 4, value: 'Total Amount:' },
     *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
     *                  }]
     *              }, {
     *                  name: 'Second Sheet',
     *                  columns: [{ width: 180 }, { index: 4, width: 130 }]
     *              }]
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default []
     */
    sheets: SheetModel[];
    /**
     * Specifies active sheet index in workbook.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      activeSheetIndex: 2
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default 0
     * @asptype int
     */
    activeSheetIndex: number;
    /**
     * Defines the height of the Spreadsheet. It accepts height as pixels, number, and percentage.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      height: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default '100%'
     */
    height: string | number;
    /**
     * It allows to enable/disable find & replace with its functionalities.
     * @default true
     */
    allowFindAndReplace: boolean;
    /**
     * Defines the width of the Spreadsheet. It accepts width as pixels, number, and percentage.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      width: '550px'
     * ...
     *  }, '#Spreadsheet');
     * ```
     * @default '100%'
     */
    width: string | number;
    /**
     * It shows or hides the ribbon in spreadsheet.
     * @default true
     */
    showRibbon: boolean;
    /**
     * It shows or hides the formula bar and its features.
     * @default true
     */
    showFormulaBar: boolean;
    /**
     * It shows or hides the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.
     * @default true
     */
    showSheetTabs: boolean;
    /**
     * It allows you to add new data or update existing cell data. If it is false, it will act as read only mode.
     * @default true
     */
    allowEditing: boolean;
    /**
     * It allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.
     * @default true
     */
    allowOpen: boolean;
    /**
     * It allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).
     * @default true
     */
    allowSave: boolean;
    /**
     * It allows to enable/disable sort and its functionalities.
     * @default true
     */
    allowSorting: boolean;
    /**
     * It allows to enable/disable filter and its functionalities.
     * @default true
     */
    allowFiltering: boolean;
    /**
     * It allows formatting a raw number into different types of formats (number, currency, accounting, percentage, short date,
     * long date, time, fraction, scientific, and text) with built-in format codes.
     * @default true
     */
    allowNumberFormatting: boolean;
    /**
     * It allows you to apply styles (font size, font weight, font family, fill color, and more) to the spreadsheet cells.
     * @default true
     */
    allowCellFormatting: boolean;
    /**
     * It allows to enable/disable Hyperlink and its functionalities.
     * @default true
     */
    allowHyperlink: boolean;
    /**
     * It allows you to insert rows, columns and sheets in to the spreadsheet.
     * @default true
     */
    allowInsert: boolean;
    /**
     * It allows you to delete rows, columns and sheets from spreadsheet.
     * @default true
     */
    allowDelete: boolean;
    /**
     * It allows you to merge the range of cells.
     * @default true
     */
    allowMerge: boolean;
    /**
     * It allows you to apply validation to the spreadsheet cells.
     * @default true
     */
    allowDataValidation: boolean;
    /**
     * It allows you to insert the image in spreadsheet.
     * @default true
     */
    allowImage: boolean;
    /**
     * It allows you to insert the chart in spreadsheet.
     * @default true
     */
    allowChart: boolean;
    /**
     * It allows you to apply conditional formatting to the sheet.
     * @default true
     */
    allowConditionalFormat: boolean;
    /**
     * Specifies the cell style options.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *          cellStyle: { fontWeight: 'bold', fontSize: 12,
     *              fontStyle: 'italic', textIndent: '2pt'
     *              backgroundColor: '#4b5366', color: '#ffffff'
     *      },
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @default {}
     */
    cellStyle: CellStyleModel;
    /**
     * Specifies the service URL to open excel file in spreadsheet.
     * @default ''
     */
    openUrl: string;
    /**
     * Specifies the service URL to save spreadsheet as Excel file.
     * @default ''
     */
    saveUrl: string;
    /**
     * Specifies the name for a range and uses it in formula for calculation.
     *  ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      ...
     *      definedNames: [{ name: 'namedRange1', refersTo: 'Sheet1!A1:B5' }],
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @default []
     */
    definedNames: DefineNameModel[];
    /**
     * Triggers before opening an Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeOpen: (args: BeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeOpen: EmitType<BeforeOpenEventArgs>;
    /**
     * Triggers when the opened Excel file fails to load.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openFailure: (args: OpenFailureArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    openFailure: EmitType<OpenFailureArgs>;
    /**
     * Triggers before saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSave: (args: BeforeSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeSave: EmitType<BeforeSaveEventArgs>;
    /**
     * Triggers after saving the Spreadsheet as Excel file.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       saveComplete: (args: SaveCompleteEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    saveComplete: EmitType<SaveCompleteEventArgs>;
    /**
     * Triggers before the cell format applied to the cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellFormat: (args: BeforeCellFormatArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeCellFormat: EmitType<BeforeCellFormatArgs>;
    /**
     * Triggered every time a request is made to access cell information.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      queryCellInfo: (args: CellInfoEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    queryCellInfo: EmitType<CellInfoEventArgs>;
    /** @hidden */
    commonCellStyle: CellStyleModel;
    /**
     * To generate sheet name based on sheet count.
     * @hidden
     */
    sheetNameCount: number;
    /** @hidden */
    serviceLocator: ServiceLocator;
    /**
     * @hidden
     */
    isOpen: boolean;
    /**
     * @hidden
     */
    chartColl: ChartModel[];
    /**
     * @hidden
     */
    chartCount: number;
    /**
     * Constructor for initializing the library.
     * @param options - Configures Workbook model.
     */
    constructor(options: WorkbookModel);
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    protected preRender(): void;
    private initWorkbookServices;
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    protected render(): void;
    /**
     * To provide the array of modules needed for workbook.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    getPersistData(): string;
    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    cellFormat(style: CellStyleModel, range?: string): void;
    /**
     * Applies cell lock to the specified range of cells.
     * @param {string} range? - Specifies the address for the range of cells.
     * @param {boolean} isLocked -Specifies the cell is locked or not.
     */
    lockCells(range?: string, isLocked?: boolean): void;
    /** @hidden */
    getCellStyleValue(cssProps: string[], indexes: number[]): CellStyleModel;
    /**
     * Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     * @param {string} format - Specifies the number format code.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    numberFormat(format: string, range?: string): void;
    /**
     * Used to create new sheet.
     * @hidden
     */
    createSheet(index?: number, sheets?: SheetModel[]): void;
    /**
     * Used to remove sheet.
     * @hidden
     */
    removeSheet(idx: number): void;
    /**
     * Destroys the Workbook library.
     */
    destroy(): void;
    /**
     * Called internally if any of the property value changed.
     * @param  {WorkbookModel} newProp
     * @param  {WorkbookModel} oldProp
     * @returns void
     * @hidden
     */
    onPropertyChanged(newProp: WorkbookModel, oldProp: WorkbookModel): void;
    /**
     * Not applicable for workbook.
     * @hidden
     */
    appendTo(selector: string | HTMLElement): void;
    /**
     * Used to hide/show the rows in spreadsheet.
     * @param {number} startRow - Specifies the start row index.
     * @param {number} endRow? - Specifies the end row index.
     * @param {boolean} hide? - To hide/show the rows in specified range.
     * @returns void
     */
    hideRow(startIndex: number, endIndex?: number, hide?: boolean): void;
    /**
     * Used to hide/show the columns in spreadsheet.
     * @param {number} startIndex - Specifies the start column index.
     * @param {number} endIndex? - Specifies the end column index.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the columns.
     * @returns void
     */
    hideColumn(startIndex: number, endIndex?: number, hide?: boolean): void;
    /**
     * Sets the border to specified range of cells.
     * @param {CellStyleModel} style? - Specifies the style property which contains border value.
     * @param {string} range? - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @param {BorderType} type? - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @returns void
     */
    setBorder(style: CellStyleModel, range?: string, type?: BorderType): void;
    /**
     * Used to insert rows in to the spreadsheet.
     * @param {number | RowModel[]} startRow? - Specifies the start row index / row model which needs to be inserted.
     * @param {number} endRow? - Specifies the end row index.
     * @returns void
     */
    insertRow(startRow?: number | RowModel[], endRow?: number): void;
    /**
     * Used to insert columns in to the spreadsheet.
     * @param {number | ColumnModel[]} startColumn? - Specifies the start column index / column model which needs to be inserted.
     * @param {number} endColumn? - Specifies the end column index.
     * @returns void
     */
    insertColumn(startColumn?: number | ColumnModel[], endColumn?: number): void;
    /**
     * Used to insert sheets in to the spreadsheet.
     * @param {number | SheetModel[]} startSheet? - Specifies the start column index / column model which needs to be inserted.
     * @param {number} endSheet? - Specifies the end column index.
     * @returns void
     */
    insertSheet(startSheet?: number | SheetModel[], endSheet?: number): void;
    /**
     * Used to delete rows, columns and sheets from the spreadsheet.
     * @param {number | RowModel[]} startIndex? - Specifies the start sheet / row / column index.
     * @param {number} endIndex? - Specifies the end sheet / row / column index.
     * @param {ModelType} model? - Specifies the delete model type. By default, the model is considered as `Sheet`. The possible values are,
     * - Row: To delete rows.
     * - Column: To delete columns.
     * - Sheet: To delete sheets.
     * @returns void
     */
    delete(startIndex?: number, endIndex?: number, model?: ModelType): void;
    /**
     * Used to merge the range of cells.
     * @param {string} range? - Specifies the rnage of cells as address.
     * @param {MergeType} type? - Specifies the merge type. The possible values are,
     * - All: Merge all the cells between provided range.
     * - Horizontally: Merge the cells row-wise.
     * - Vertically: Merge the cells column-wise.
     * @returns void
     */
    merge(range?: string, type?: MergeType): void;
    /** Used to compute the specified expression/formula.
     * @param {string} formula - Specifies the formula(=SUM(A1:A3)) or expression(2+3).
     * @returns string | number
     */
    computeExpression(formula: string): string | number;
    private initEmptySheet;
    /** @hidden */
    getActiveSheet(): SheetModel;
    /**
     * Used for setting the used range row and column index.
     * @hidden
     */
    setUsedRange(rowIdx: number, colIdx: number): void;
    /**
     * Gets the range of data as JSON from the specified address.
     * @param {string} address - Specifies the address for range of cells.
     */
    getData(address: string): Promise<Map<string, CellModel>>;
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    getModuleName(): string;
    /** @hidden */
    getValueRowCol(sheetIndex: number, rowIndex: number, colIndex: number): string | number;
    /** @hidden */
    setValueRowCol(sheetIndex: number, value: string | number, rowIndex: number, colIndex: number): void;
    /**
     * Opens the specified excel file or stream.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    open(options: OpenOptions): void;
    /**
     * Opens the specified JSON object.
     * <br><br>
     * The available arguments in options are:
     * * file: Specifies the spreadsheet model as object or string. And the object contains the jsonObject,
     * which is saved from spreadsheet using saveAsJson method.
     *
     * @param options - Options for opening the JSON object.
     */
    openFromJson(options: {
        file: string | object;
    }): void;
    /**
     * Saves the Spreadsheet data to Excel file.
     * <br><br>
     * The available arguments in saveOptions are:
     * * url: Specifies the save URL.
     * * fileName: Specifies the file name.
     * * saveType: Specifies the file type need to be saved.
     *
     * @param {SaveOptions} saveOptions - Options for saving the excel file.
     */
    save(saveOptions?: SaveOptions): void;
    /**
     * Saves the Spreadsheet data as JSON object.
     */
    saveAsJson(): Promise<object>;
    addHyperlink(hyperlink: string | HyperlinkModel, cellAddress: string): void;
    /**
     * To find the specified cell value.
     * @param args - options for find.
     */
    findHandler(args: FindOptions): void;
    /**
     * To replace the specified cell or entire match value.
     * @param args - options for replace.
     */
    replaceHandler(args: FindOptions): void;
    /**
     * Protect the active sheet based on the protect sheetings.
     * @param protectSettings - Specifies the protect settings of the sheet.
     */
    protectSheet(sheet?: number | string, protectSettings?: ProtectSettingsModel): void;
    /**
     * Unprotect the active sheet.
     * @param sheet - Specifies the sheet to Unprotect.
     */
    unprotectSheet(sheet: number): void;
    /**
     * Sorts the range of cells in the active Spreadsheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    sort(sortOptions?: SortOptions, range?: string): Promise<SortEventArgs>;
    addDataValidation(rules: ValidationModel, range?: string): void;
    removeDataValidation(range?: string): void;
    addInvalidHighlight(range: string): void;
    removeInvalidHighlight(range: string): void;
    conditionalFormat(conditionalFormat: ConditionalFormatModel): void;
    clearConditionalFormat(range: string): void;
    /**
     * To update a cell properties.
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     */
    updateCell(cell: CellModel, address?: string): void;
    /**
     * This method is used to wrap/unwrap the text content of the cell.
     * @param address - Address of the cell to be wrapped.
     * @param wrap - Set `false` if the text content of the cell to be unwrapped.
     * @returns void
     */
    wrap(address: string, wrap?: boolean): void;
    /**
     * Adds the defined name to the Spreadsheet.
     * @param {DefineNameModel} definedName - Specifies the name.
     * @return {boolean} - Return the added status of the defined name.
     */
    addDefinedName(definedName: DefineNameModel): boolean;
    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    removeDefinedName(definedName: string, scope?: string): boolean;
    /** @hidden */
    clearRange(address?: string, sheetIndex?: number, valueOnly?: boolean): void;
    /**
     * Used to set the image in spreadsheet.
     * @param {ImageModel} images - Specifies the options to insert image in spreadsheet.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    insertImage(images: ImageModel[], range?: string): void;
    /**
     * Used to set the chart in spreadsheet.
     * @param {ChartModel} chart - Specifies the options to insert chart in spreadsheet.
     * @returns void
     */
    insertChart(chart?: ChartModel[]): void;
    /**
     * Used to delete the chart from spreadsheet.
     * @param {string} id - Specifies the chart element id.
     * @returns void
     */
    deleteChart(id?: string): void;
    /**
     * Filters the range of cells in the sheet.
     */
    filter(filterOptions?: FilterOptions, range?: string): Promise<FilterEventArgs>;
    /**
     * Clears the filter changes of the sheet.
     */
    clearFilter(): void;
    /**
     * To add custom library function.
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     */
    addCustomFunction(functionHandler: string | Function, functionName?: string): void;
    /**
     * This method is used to Clear contents, formats and hyperlinks in spreadsheet.
     *    * @param {ClearOptions} options - Options for clearing the content, formats and hyperlinks in spreadsheet.
     */
    clear(options: ClearOptions): void;
    /**
     * Gets the formatted text of the cell.
     */
    getDisplayText(cell: CellModel): string;
    /**
     * @hidden
     */
    getAddressInfo(address: string): {
        sheetIndex: number;
        indices: number[];
    };
    /**
     * @hidden
     */
    setSheetPropertyOnMute(sheet: SheetModel, prop: string, value: Object): void;
}
