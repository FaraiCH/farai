/// <reference path="../../workbook/base/workbook-model.d.ts" />
import { INotifyPropertyChanged, ModuleDeclaration } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { BeforeOpenEventArgs } from '../common/index';
import { DialogBeforeOpenEventArgs } from '../common/index';
import { CollaborativeEditArgs } from '../common/index';
import { CellEditEventArgs, CellSaveEventArgs } from '../common/index';
import { PasteSpecialType } from '../common/index';
import { Render } from '../renderer/render';
import { Scroll } from '../actions/index';
import { CellRenderEventArgs, IRenderer, IViewport, OpenOptions, MenuSelectEventArgs } from '../common/index';
import { HyperlinkModel, DefineNameModel } from './../../workbook/index';
import { BeforeHyperlinkArgs, AfterHyperlinkArgs, FindOptions, ValidationModel } from './../../workbook/common/index';
import { BeforeCellFormatArgs, CellStyleModel } from './../../workbook/index';
import { BeforeSaveEventArgs, SaveCompleteEventArgs } from './../../workbook/index';
import { CellModel, DataSourceChangedEventArgs } from './../../workbook/index';
import { BeforeSortEventArgs, SortOptions, SortEventArgs } from './../../workbook/index';
import { FilterOptions, FilterEventArgs, ProtectSettingsModel } from './../../workbook/index';
import { Workbook } from '../../workbook/base/workbook';
import { SpreadsheetModel } from './spreadsheet-model';
import { ScrollSettingsModel, SelectionSettingsModel } from '../common/index';
import { BeforeSelectEventArgs, SelectEventArgs } from '../common/index';
import { RefreshValueArgs } from '../integrations/index';
import { PredicateModel } from '@syncfusion/ej2-grids';
import { RibbonItemModel } from '../../ribbon/index';
import { ClearOptions, ConditionalFormatModel, ImageModel } from './../../workbook/common/index';
/**
 * Represents the Spreadsheet component.
 * ```html
 * <div id='spreadsheet'></div>
 * <script>
 *  var spreadsheetObj = new Spreadsheet();
 *  spreadsheetObj.appendTo('#spreadsheet');
 * </script>
 * ```
 */
export declare class Spreadsheet extends Workbook implements INotifyPropertyChanged {
    /**
     * To specify a CSS class or multiple CSS class separated by a space, add it in the Spreadsheet root element.
     * This allows you to customize the appearance of component.
     * ```html
     * <div id='spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *  cssClass: 'e-custom1 e-custom2',
     *  ...
     * }, '#spreadsheet');
     * ```
     * @default ''
     */
    cssClass: string;
    /**
     * It specifies whether the Spreadsheet should be rendered with scrolling or not.
     * To customize the Spreadsheet scrolling behavior, use the [`scrollSettings`]
     * (https://ej2.syncfusion.com/documentation/api/spreadsheet/#scrollSettings) property.
     * @default true
     */
    allowScrolling: boolean;
    /**
     * If `allowResizing` is set to true, spreadsheet columns and rows can be resized.
     * @default true
     */
    allowResizing: boolean;
    /**
     * It enables or disables the clipboard operations (cut, copy, and paste) of the Spreadsheet.
     * @default true
     */
    enableClipboard: boolean;
    /**
     * It enables or disables the context menu option of spreadsheet. By default, context menu will opens for row header,
     * column header, sheet tabs, and cell.
     * @default true
     */
    enableContextMenu: boolean;
    /**
     * It allows you to interact with cell, pager, formula bar, and ribbon through the keyboard device.
     * @default true
     */
    enableKeyboardNavigation: boolean;
    /**
     * It enables shortcut keys to perform Spreadsheet operations like open, save, copy, paste, and more.
     * @default true
     */
    enableKeyboardShortcut: boolean;
    /**
     * It allows to enable/disable undo and redo functionalities.
     * @default true
     */
    allowUndoRedo: boolean;
    /**
     * It allows to enable/disable wrap text feature. By using this feature the wrapping applied cell text can wrap to the next line,
     * if the text width exceeds the column width.
     * @default true
     */
    allowWrap: boolean;
    /**
     * Configures the selection settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      selectionSettings: {
     *          mode: 'None'
     *      }
     * ...
     * }, '#Spreadsheet');
     *
     * The selectionSettings `mode` property has three values and it is described below:
     *
     * * None: Disables UI selection.
     * * Single: Allows single selection of cell, row, or column and disables multiple selection.
     * * Multiple: Allows multiple selection of cell, row, or column and disables single selection.
     *
     * ```
     * @default { mode: 'Multiple' }
     */
    selectionSettings: SelectionSettingsModel;
    /**
     * Configures the scroll settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      scrollSettings: {
     *          isFinite: true,
     *          enableVirtualization: false
     *      }
     * ...
     *  }, '#Spreadsheet');
     * ```
     * > The `allowScrolling` property should be `true`.
     * @default { isFinite: false, enableVirtualization: true }
     */
    scrollSettings: ScrollSettingsModel;
    /**
     * Triggers before the cell appended to the DOM.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeCellRender: (args: CellRenderEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeCellRender: EmitType<CellRenderEventArgs>;
    /**
     * Triggers before the cell or range of cells being selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeSelect: (args: BeforeSelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeSelect: EmitType<BeforeSelectEventArgs>;
    /**
     * Triggers after the cell or range of cells is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      select: (args: SelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    select: EmitType<SelectEventArgs>;
    /**
     * Triggers before opening the context menu and it allows customizing the menu items.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuBeforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers before opening the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuBeforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers before closing the context menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuBeforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers before opening the dialog box.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dialogBeforeOpen: (args: DialogBeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    dialogBeforeOpen: EmitType<DialogBeforeOpenEventArgs>;
    /**
     * Triggers before closing the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuBeforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers when the context menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuItemSelect: EmitType<MenuSelectEventArgs>;
    /**
     * Triggers when the file menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuItemSelect: EmitType<MenuSelectEventArgs>;
    /**
     * Triggers before the data is populated to the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeDataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeDataBound: EmitType<Object>;
    /**
     * Triggers when the data is populated in the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    dataBound: EmitType<Object>;
    /**
     * Triggers during data changes when the data is provided as `dataSource` in the Spreadsheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataSourceChanged: (args: DataSourceChangedEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    dataSourceChanged: EmitType<DataSourceChangedEventArgs>;
    /**
     * Triggers when the cell is being edited.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEdit: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellEdit: EmitType<CellEditEventArgs>;
    /**
     * Triggers every time a request is made to access cell information.
     * This will be triggered when editing a cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEditing: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellEditing: EmitType<CellEditEventArgs>;
    /**
     * Triggers when the edited cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellSave: (args: CellSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellSave: EmitType<CellSaveEventArgs>;
    /**
     * Triggers when before the cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellSave: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeCellSave: EmitType<CellEditEventArgs>;
    /**
     * Triggers when the component is created.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       created: () => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    created: EmitType<Event>;
    /**
     * Triggers before sorting the specified range.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSort: (args: BeforeSortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeSort: EmitType<BeforeSortEventArgs>;
    /**
     * Triggers before insert a hyperlink.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkCreate: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeHyperlinkCreate: EmitType<BeforeHyperlinkArgs>;
    /**
     * Triggers after the hyperlink inserted.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkCreate: (args: afterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    afterHyperlinkCreate: EmitType<AfterHyperlinkArgs>;
    /**
     * Triggers when the Hyperlink is clicked.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkClick: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeHyperlinkClick: EmitType<BeforeHyperlinkArgs>;
    /**
     * Triggers when the Hyperlink function gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkClick: (args: AfterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    afterHyperlinkClick: EmitType<AfterHyperlinkArgs>;
    /**
     * Triggers when the Spreadsheet actions (such as editing, formatting, sorting etc..) are starts.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionBegin: (args: BeforeCellFormatArgs|BeforeOpenEventArgs|BeforeSaveEventArgs|BeforeSelectEventArgs
     *                    |BeforeSortEventArgs|CellEditEventArgs|MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    actionBegin: EmitType<BeforeCellFormatArgs | BeforeOpenEventArgs | BeforeSaveEventArgs | BeforeSelectEventArgs | BeforeSortEventArgs | CellEditEventArgs | MenuSelectEventArgs>;
    /**
     * Triggers when the spreadsheet actions (such as editing, formatting, sorting etc..) gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionComplete: (args: SortEventArgs|CellSaveEventArgs|SaveCompleteEventArgs|Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    actionComplete: EmitType<SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs | Object>;
    /**
     * Triggers when the spreadsheet importing gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openComplete: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    openComplete: EmitType<Object>;
    /**
     * Triggers after sorting action is completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       sortComplete: (args: SortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    sortComplete: EmitType<SortEventArgs>;
    /** @hidden */
    isEdit: boolean;
    /** @hidden */
    renderModule: Render;
    /** @hidden */
    scrollModule: Scroll;
    /** @hidden */
    sheetModule: IRenderer;
    /** @hidden */
    createdHandler: Function | object;
    /** @hidden */
    viewport: IViewport;
    protected needsID: boolean;
    /**
     * Constructor for creating the widget.
     * @param  {SpreadsheetModel} options? - Configures Spreadsheet options.
     * @param  {string|HTMLElement} element? - Element to render Spreadsheet.
     */
    constructor(options?: SpreadsheetModel, element?: string | HTMLElement);
    /**
     * To get cell element.
     * @returns HTMLElement
     * @hidden
     */
    getCell(rowIndex: number, colIndex: number, row?: HTMLTableRowElement): HTMLElement;
    /**
     * Get cell element.
     * @returns HTMLTableRowElement
     * @hidden
     */
    getRow(index: number, table?: HTMLTableElement): HTMLTableRowElement;
    /**
     * To get hidden row/column count between two specified index.
     * Set `layout` as `columns` if you want to get column hidden count.
     * @hidden
     */
    hiddenCount(startIndex: number, endIndex: number, layout?: string): number;
    /**
     * To get row/column viewport index.
     * @hidden
     */
    getViewportIndex(index: number, isCol?: boolean): number;
    /**
     * To initialize the services;
     * @returns void
     * @hidden
     */
    protected preRender(): void;
    private initServices;
    /**
     * To Initialize the component rendering.
     * @returns void
     * @hidden
     */
    protected render(): void;
    private renderSpreadsheet;
    /**
     * By default, Spreadsheet shows the spinner for all its actions. To manually show spinner you this method at your needed time.
     * @return {void}
     */
    showSpinner(): void;
    /**
     * To hide showed spinner manually.
     * @return {void}
     */
    hideSpinner(): void;
    /**
     * To protect the particular sheet.
     * @param {number | string} sheet - Specifies the sheet to protect.
     * @param {ProtectSettingsModel} protectSettings - Specifies the protect sheet options.
     * @default { selectCells: 'false', formatCells: 'false', formatRows: 'false', formatColumns:'false', insertLink:'false' }
     * @return {void}
     */
    protectSheet(sheet?: number | string, protectSettings?: ProtectSettingsModel): void;
    /**
     * To unprotect the particular sheet.
     * @param {number | string} sheet - Specifies the sheet to Unprotect.
     * @return {void}
     */
    unprotectSheet(sheet?: number | string): void;
    /**
     * To find the specified cell value.
     * @param {FindOptions} args - Specifies the replace value with find args to replace specified cell value.
     * @param {string} args.value - Specifies the value to be find.
     * @param {FindModeType} args.mode - Specifies the value to be find within sheet or workbook.
     * @param {string} args.searchBy - Specifies the value to be find by row or column.
     * @param {boolean} args.isCSen - Specifies the find match with case sensitive or not.
     * @param {boolean} args.isEMatch - Specifies the find match with entire match or not.
     * @param {string} args.findOpt - Specifies the next or previous find match.
     * @param {number} args.sheetIndex - Specifies the current sheet to find.
     * @default { mode: 'Sheet', searchBy: 'By Row', isCSen: 'false', isEMatch:'false' }
     * @return {void}
     */
    find(args: FindOptions): void;
    /**
     * To replace the specified cell value.
     * @param {FindOptions} args - Specifies the replace value with find args to replace specified cell value.
     * @param {string} args.replaceValue - Specifies the replacing value.
     * @param {string} args.replaceBy - Specifies the value to be replaced for one or all.
     * @param {string} args.value - Specifies the value to be replaced
     * @return {void}
     */
    replace(args: FindOptions): void;
    /**
     * To Find All the Match values Address within Sheet or Workbook.
     * @param {string} value - Specifies the value to find.
     * @param {FindModeType} mode - Specifies the value to be find within Sheet/Workbook.
     * @param {boolean} isCSen - Specifies the find match with case sensitive or not.
     * @param {boolean} isEMatch - Specifies the find match with entire match or not.
     * @param {number} sheetIndex - Specifies the sheetIndex. If not specified, it will consider the active sheet.
     * @return {string[]}
     */
    findAll(value: string, mode?: string, isCSen?: boolean, isEMatch?: boolean, sheetIndex?: number): string[];
    /**
     * Used to navigate to cell address within workbook.
     * @param {string} address - Specifies the cell address you need to navigate.
     * You can specify the address in two formats,
     * `{sheet name}!{cell address}` - Switch to specified sheet and navigate to specified cell address.
     * `{cell address}` - Navigate to specified cell address with in the active sheet.
     * @return {void}
     */
    goTo(address: string): void;
    /**
     * Used to resize the Spreadsheet.
     */
    resize(): void;
    /**
     * To cut the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address to cut.
     */
    cut(address?: string): Promise<Object>;
    /**
     * To copy the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address.
     */
    copy(address?: string): Promise<Object>;
    /**
     * This method is used to paste the cut or copied cells in to specified address.
     * @param {string} address - Specifies the cell or range address.
     * @param {PasteSpecialType} type - Specifies the type of paste.
     */
    paste(address?: string, type?: PasteSpecialType): void;
    /**
     * To update the action which need to perform.
     * @param {string} options - It describes an action and event args to perform.
     * @param {string} options.action - specifies an action.
     * @param {string} options.eventArgs - specifies an args to perform an action.
     */
    updateAction(options: CollaborativeEditArgs): void;
    private setHeight;
    private setWidth;
    /**
     * Set the width of column.
     * @param {number} width
     * @param {number} colIndex
     * @param {number} sheetIndex
     * {% codeBlock src='spreadsheet/setColWidth/index.md' %}{% endcodeBlock %}
     */
    setColWidth(width?: number | string, colIndex?: number, sheetIndex?: number): void;
    /**
     * Set the height of row.
     * @param {number} height? - Specifies height needs to be updated. If not specified, it will set the default height 20.
     * @param {number} rowIndex? - Specifies the row index. If not specified, it will consider the first row.
     * @param {number} sheetIndex? - Specifies the sheetIndex. If not specified, it will consider the active sheet.
     * {% codeBlock src='spreadsheet/setRowHeight/index.md' %}{% endcodeBlock %}
     */
    setRowHeight(height?: number | string, rowIndex?: number, sheetIndex?: number, edited?: boolean): void;
    /**
     * This method is used to autofit the range of rows or columns
     * @param {string} range - range that needs to be autofit.
     *
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * let spreadsheet = new Spreadsheet({
     *      allowResizing: true
     * ...
     * }, '#Spreadsheet');
     * spreadsheet.autoFit('A:D'); // Auto fit from A to D columns
     * Spreadsheet.autoFit('1:4'); // Auto fit from 1 to 4 rows
     *
     * ```
     */
    autoFit(range: string): void;
    /** @hidden */
    getIndexes(range: string): {
        startIdx: number;
        endIdx: number;
        isCol: boolean;
    };
    private getAddress;
    /**
     * To add the hyperlink in the cell
     * @param {string | HyperlinkModel} hyperlink
     * @param {string} address
     */
    addHyperlink(hyperlink: string | HyperlinkModel, address: string): void;
    /**
     * To remove the hyperlink in the cell
     * @param {string} range
     */
    removeHyperlink(range: string): void;
    /** @hidden */
    insertHyperlink(hyperlink: string | HyperlinkModel, address: string, displayText: string, isMethod: boolean): void;
    /**
     * This method is used to add data validation.
     * @param {ValidationModel} rules - specifies the validation rules.
     * @param {string} range - range that needs to be add validation.
     */
    addDataValidation(rules: ValidationModel, range?: string): void;
    /**
     * This method is used for remove validation.
     * @param {string} range - range that needs to be remove validation.
     */
    removeDataValidation(range?: string): void;
    /**
     * This method is used to highlight the invalid data.
     * @param {string} range - range that needs to be highlight the invalid data.
     */
    addInvalidHighlight(range?: string): void;
    /**
     * This method is used for remove highlight from invalid data.
     * @param {string} range - range that needs to be remove invalid highlight.
     */
    removeInvalidHighlight(range?: string): void;
    /**
     * This method is used to add conditional formatting.
     * @param  {string} type - Conditional formatting HighlightCell, TopBottom, DataBar, ColorScale, IconSet Type.
     * HighlightCell- 'GreaterThan' | 'LessThan' | 'Between' | 'EqualTo' | 'ContainsText' | 'DateOccur' | 'Duplicate' | 'Unique',
     * TopBottom - 'Top10Items' | 'Bottom10Items' | 'Top10Percentage' | 'Bottom10Percentage' | 'BelowAverage' | 'AboveAverage',
     * DataBar - 'BlueDataBar' | 'GreenDataBar' | 'RedDataBar' | 'OrangeDataBar' | 'LightBlueDataBar' | 'PurpleDataBar',
     * ColorScale - 'GYRColorScale' | 'RYGColorScale' | 'GWRColorScale' | 'RWGColorScale' | 'BWRColorScale' | 'RWBColorScale' |
     * 'WRColorScale' | 'RWColorScale' | 'GWColorScale' | 'WGColorScale' | 'GYColorScale' | 'YGColorScale',
     * IconSet - 'ThreeArrows' | 'ThreeArrowsGray' | 'FourArrowsGray' | 'FourArrows' | 'FiveArrowsGray' | 'FiveArrows' |
     * 'ThreeTrafficLights1' | 'ThreeTrafficLights2' | 'ThreeSigns' | 'FourTrafficLights' | 'FourRedToBlack' | 'ThreeSymbols' |
     * 'ThreeSymbols2' | 'ThreeFlags' | 'FourRating' | 'FiveQuarters' | 'FiveRating' | 'ThreeTriangles' | 'ThreeStars' | 'FiveBoxes';
     * @param  {string} cFColor - Pass the cFcolor to set the conditional formatting.
     * CFColor - 'RedFT' | 'YellowFT' | 'GreenFT' | 'RedF' | 'RedT'.
     * @param  {string} value - Pass the value to set the conditional formatting.
     * @param  {string} range - Pass the range to set the conditional formatting.
     */
    conditionalFormat(conditionalFormat: ConditionalFormatModel): void;
    /**
     * This method is used for remove conditional formatting.
     * @param {string} range - range that needs to be remove conditional formatting.
     */
    clearConditionalFormat(range?: string): void;
    /** @hidden */
    setPanelSize(): void;
    /**
     * Opens the Excel file.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    open(options: OpenOptions): void;
    /** @hidden */
    hideRow(startIndex: number, endIndex?: number, hide?: boolean): void;
    /** @hidden */
    hideColumn(startIndex: number, endIndex?: number, hide?: boolean): void;
    /**
     * This method is used to Clear contents, formats and hyperlinks in spreadsheet.
     *    * @param {ClearOptions} options - Options for clearing the content, formats and hyperlinks in spreadsheet.
     */
    clear(options: ClearOptions): void;
    /**
     * Used to refresh the spreadsheet.
     * @param {boolean} isNew - Specifies `true` / `false` to create new workbook in spreadsheet.
     * @returns void
     */
    refresh(isNew?: boolean): void;
    /**
     * Used to set the image in spreadsheet.
     * @param {ImageModel} images - Specifies the options to insert image in spreadsheet.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    insertImage(images: ImageModel[], range?: string): void;
    /**
     * Used to delete the image in spreadsheet.
     * @param {string} id - Specifies the id of the image element to be deleted.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    deleteImage(id: string, range?: string): void;
    /**
     * Gets the row header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getRowHeaderContent(): HTMLElement;
    /**
     * Gets the column header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getColumnHeaderContent(): Element;
    /**
     * Gets the main content div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getMainContent(): Element;
    /**
     * Get the main content table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getContentTable(): HTMLTableElement;
    /**
     * Get the row header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getRowHeaderTable(): HTMLTableElement;
    /**
     * Get the column header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getColHeaderTable(): HTMLTableElement;
    /**
     * To get the backup element count for row and column virtualization.
     * @hidden
     */
    getThreshold(layout: 'row' | 'col'): number;
    /** @hidden */
    isMobileView(): boolean;
    /** @hidden */
    getValueRowCol(sheetIndex: number, rowIndex: number, colIndex: number): string | number;
    /**
     * To update a cell properties.
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     */
    updateCell(cell: CellModel, address?: string): void;
    /**
     * Sorts the range of cells in the active sheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    sort(sortOptions?: SortOptions, range?: string): Promise<SortEventArgs>;
    /** @hidden */
    setValueRowCol(sheetIndex: number, value: string | number, rowIndex: number, colIndex: number): void;
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    getModuleName(): string;
    /** @hidden */
    refreshNode(td: Element, args?: RefreshValueArgs): void;
    /** @hidden */
    calculateHeight(style: CellStyleModel, lines?: number, borderWidth?: number): number;
    /** @hidden */
    skipHidden(startIdx: number, endIdx: number, layout?: string): number[];
    /** @hidden */
    updateActiveBorder(nextTab: HTMLElement, selector?: string): void;
    /** @hidden */
    skipHiddenSheets(index: number, initIdx?: number, hiddenCount?: number): number;
    /**
     * To perform the undo operation in spreadsheet.
     */
    undo(): void;
    /**
     * To perform the redo operation in spreadsheet.
     */
    redo(): void;
    /**
     * To update the undo redo collection in spreadsheet.
     * @param {object} args - options for undo redo.
     */
    updateUndoRedoCollection(args: {
        [key: string]: Object;
    }): void;
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
    removeDefinedName(definedName: string, scope: string): boolean;
    private mouseClickHandler;
    private mouseDownHandler;
    private keyUpHandler;
    private keyDownHandler;
    /**
     * Binding events to the element while component creation.
     */
    private wireEvents;
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     */
    destroy(): void;
    /**
     * Unbinding events from the element while component destroy.
     */
    private unwireEvents;
    /**
     * To add context menu items.
     * @param {MenuItemModel[]} items - Items that needs to be added.
     * @param {string} text - Item before / after that the element to be inserted.
     * @param {boolean} insertAfter - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    addContextMenuItems(items: MenuItemModel[], text: string, insertAfter?: boolean, isUniqueId?: boolean): void;
    /**
     * To remove existing context menu items.
     * @param {string[]} items - Items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    removeContextMenuItems(items: string[], isUniqueId?: boolean): void;
    /**
     * To enable / disable context menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    enableContextMenuItems(items: string[], enable?: boolean, isUniqueId?: boolean): void;
    /**
     * To enable / disable file menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable? - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    enableFileMenuItems(items: string[], enable?: boolean, isUniqueId?: boolean): void;
    /**
     * To show/hide the file menu items in Spreadsheet ribbon.
     * @param {string[]} items - Specifies the file menu items text which is to be show/hide.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the file menu items.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    hideFileMenuItems(items: string[], hide?: boolean, isUniqueId?: boolean): void;
    /**
     * To add custom file menu items.
     * @param {MenuItemModel[]} items - Specifies the ribbon file menu items to be inserted.
     * @param {string} text - Specifies the existing file menu item text before / after which the new file menu items to be inserted.
     * @param {boolean} insertAfter? - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId? - Set `true` if the given file menu items `text` is a unique id.
     * @returns void.
     */
    addFileMenuItems(items: MenuItemModel[], text: string, insertAfter?: boolean, isUniqueId?: boolean): void;
    /**
     * To show/hide the existing ribbon tabs.
     * @param {string[]} tabs - Specifies the tab header text which needs to be shown/hidden.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the ribbon tabs.
     * @returns void.
     */
    hideRibbonTabs(tabs: string[], hide?: boolean): void;
    /**
     * To enable / disable the existing ribbon tabs.
     * @param {string[]} tabs - Specifies the tab header text which needs to be enabled / disabled.
     * @param {boolean} enable? - Set `true` / `false` to enable / disable the ribbon tabs.
     * @returns void.
     */
    enableRibbonTabs(tabs: string[], enable?: boolean): void;
    /**
     * To add custom ribbon tabs.
     * @param {RibbonItemModel[]} items - Specifies the ribbon tab items to be inserted.
     * @param {string} insertBefore? - Specifies the existing ribbon header text before which the new tabs will be inserted.
     * If not specified, the new tabs will be inserted at the end.
     * @returns void.
     */
    addRibbonTabs(items: RibbonItemModel[], insertBefore?: string): void;
    /**
     * Enables or disables the specified ribbon toolbar items or all ribbon items.
     * @param {string} tab - Specifies the ribbon tab header text under which the toolbar items need to be enabled / disabled.
     * @param {string[]} items? - Specifies the toolbar item indexes / unique id's which needs to be enabled / disabled.
     * If it is not specified the entire toolbar items will be enabled / disabled.
     * @param  {boolean} enable? - Boolean value that determines whether the toolbar items should be enabled or disabled.
     * @returns void.
     */
    enableToolbarItems(tab: string, items?: number[] | string[], enable?: boolean): void;
    /**
     * To show/hide the existing Spreadsheet ribbon toolbar items.
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items needs to be hidden / shown.
     * @param {string[]} indexes - Specifies the toolbar indexes which needs to be shown/hidden from UI.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the toolbar items.
     * @returns void.
     */
    hideToolbarItems(tab: string, indexes: number[], hide?: boolean): void;
    /**
     * To add the custom items in Spreadsheet ribbon toolbar.
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items will be inserted.
     * @param {ItemModel[]} items - Specifies the ribbon toolbar items that needs to be inserted.
     * @param {number} index? - Specifies the index text before which the new items will be inserted.
     * If not specified, the new items will be inserted at the end of the toolbar.
     * @returns void.
     */
    addToolbarItems(tab: string, items: ItemModel[], index?: number): void;
    /**
     * Selects the cell / range of cells with specified address.
     * @param {string} address - Specifies the range address.
     */
    selectRange(address: string): void;
    /**
     * Start edit the active cell.
     * @return {void}
     */
    startEdit(): void;
    /**
     * Cancels the edited state, this will not update any value in the cell.
     * @return {void}
     */
    closeEdit(): void;
    /**
     * If Spreadsheet is in editable state, you can save the cell by invoking endEdit.
     * @return {void}
     */
    endEdit(): void;
    /**
     * Called internally if any of the property value changed.
     * @param  {SpreadsheetModel} newProp
     * @param  {SpreadsheetModel} oldProp
     * @returns void
     * @hidden
     */
    onPropertyChanged(newProp: SpreadsheetModel, oldProp: SpreadsheetModel): void;
    /**
     * To provide the array of modules needed for component rendering.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Appends the control within the given HTML Div element.
     * @param {string | HTMLElement} selector - Target element where control needs to be appended.
     */
    appendTo(selector: string | HTMLElement): void;
    /**
     * Filters the range of cells in the sheet.
     */
    filter(filterOptions?: FilterOptions, range?: string): Promise<FilterEventArgs>;
    /**
     * Clears the filter changes of the sheet.
     */
    clearFilter(field?: string): void;
    /**
     * Applies the filter UI in the range of cells in the sheet.
     */
    applyFilter(predicates?: PredicateModel[], range?: string): void;
    /**
     * To add custom library function.
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     */
    addCustomFunction(functionHandler: string | Function, functionName?: string): void;
}
