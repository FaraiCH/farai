var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Property, NotifyPropertyChanges, Collection, Complex } from '@syncfusion/ej2-base';
import { initSheet, getSheet, getSheetIndexFromId, getSheetIndexByName, getSheetIndex, Sheet } from './sheet';
import { Event, merge, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getWorkbookRequiredModules } from '../common/module';
import { getData, clearRange } from './index';
import { DefineName, CellStyle, updateUsedRange, getIndexesFromAddress, localeData, workbookLocale } from '../common/index';
import * as events from '../common/event';
import { insertModel, getAddressInfo } from '../common/index';
import { setCellFormat, sheetCreated, deleteModel, setLockCells } from '../common/index';
import { setMerge } from '../common/index';
import { getCell, skipDefaultValue, setCell, wrap as wrapText } from './cell';
import { DataBind, setRow, setColumn } from '../index';
import { WorkbookSave, WorkbookFormula, WorkbookOpen, WorkbookSort, WorkbookFilter, WorkbookImage } from '../integrations/index';
import { WorkbookChart } from '../integrations/index';
import { WorkbookNumberFormat } from '../integrations/number-format';
import { WorkbookEdit, WorkbookCellFormat, WorkbookHyperlink, WorkbookInsert, WorkbookProtectSheet } from '../actions/index';
import { WorkbookDataValidation, WorkbookMerge } from '../actions/index';
import { ServiceLocator } from '../services/index';
import { setLinkModel, setImage, setChart } from '../common/event';
import { beginAction, completeAction, deleteChart } from '../../spreadsheet/common/event';
import { WorkbookFindAndReplace } from '../actions/find-and-replace';
import { WorkbookConditionalFormat } from '../actions/conditional-formatting';
/**
 * Represents the Workbook.
 */
var Workbook = /** @class */ (function (_super) {
    __extends(Workbook, _super);
    /**
     * Constructor for initializing the library.
     * @param options - Configures Workbook model.
     */
    function Workbook(options) {
        var _this = _super.call(this, options) || this;
        /**
         * To generate sheet name based on sheet count.
         * @hidden
         */
        _this.sheetNameCount = 1;
        /**
         * @hidden
         */
        _this.isOpen = false;
        /**
         * @hidden
         */
        _this.chartColl = [];
        /**
         * @hidden
         */
        _this.chartCount = 1;
        Workbook_1.Inject(DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookSort, WorkbookHyperlink, WorkbookFilter, WorkbookInsert, WorkbookFindAndReplace, WorkbookDataValidation, WorkbookProtectSheet, WorkbookMerge, WorkbookConditionalFormat, WorkbookImage, WorkbookChart);
        _this.commonCellStyle = {};
        if (options && options.cellStyle) {
            _this.commonCellStyle = options.cellStyle;
        }
        if (_this.getModuleName() === 'workbook') {
            _this.serviceLocator = new ServiceLocator;
            _this.initWorkbookServices();
            _this.dataBind();
            _this.initEmptySheet();
        }
        return _this;
    }
    Workbook_1 = Workbook;
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    Workbook.prototype.preRender = function () {
        if (!Object.keys(this.commonCellStyle).length) {
            this.commonCellStyle = skipDefaultValue(this.cellStyle, true);
        }
        if (this.getModuleName() === 'spreadsheet' && !this.refreshing) {
            this.initEmptySheet();
        }
    };
    Workbook.prototype.initWorkbookServices = function () {
        this.serviceLocator.register(workbookLocale, new L10n(this.getModuleName(), localeData, this.locale));
    };
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    Workbook.prototype.render = function () {
        /** code snippets */
    };
    /**
     * To provide the array of modules needed for workbook.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Workbook.prototype.requiredModules = function () {
        return getWorkbookRequiredModules(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    Workbook.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    Workbook.prototype.cellFormat = function (style, range) {
        var sheet = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
    };
    /**
     * Applies cell lock to the specified range of cells.
     * @param {string} range? - Specifies the address for the range of cells.
     * @param {boolean} isLocked -Specifies the cell is locked or not.
     */
    Workbook.prototype.lockCells = function (range, isLocked) {
        var sheet = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setLockCells, { range: range, isLocked: isLocked });
    };
    /** @hidden */
    Workbook.prototype.getCellStyleValue = function (cssProps, indexes) {
        var _this = this;
        var cell = getCell(indexes[0], indexes[1], this.getActiveSheet());
        var style = {};
        cssProps.forEach(function (cssProp) {
            style[cssProp] = _this.cellStyle[cssProp];
            if (cell && cell.style && cell.style[cssProp]) {
                style[cssProp] = cell.style[cssProp];
            }
        });
        return style;
    };
    /**
     * Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     * @param {string} format - Specifies the number format code.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    Workbook.prototype.numberFormat = function (format, range) {
        this.notify(events.applyNumberFormatting, { format: format, range: range });
    };
    /**
     * Used to create new sheet.
     * @hidden
     */
    Workbook.prototype.createSheet = function (index, sheets) {
        if (index === void 0) { index = this.sheets.length; }
        if (sheets === void 0) { sheets = [{}]; }
        var _a;
        (_a = this.sheets).splice.apply(_a, [index, 0].concat(sheets));
        initSheet(this, sheets);
        this.notify(sheetCreated, { sheetIndex: index || 0, sheets: sheets });
        this.notify(events.workbookFormulaOperation, {
            action: 'registerSheet', sheetIndex: index || 0, sheetCount: index + sheets.length
        });
    };
    /**
     * Used to remove sheet.
     * @hidden
     */
    Workbook.prototype.removeSheet = function (idx) {
        this.sheets.splice(idx, 1);
    };
    /**
     * Destroys the Workbook library.
     */
    Workbook.prototype.destroy = function () {
        this.notify(events.workbookDestroyed, null);
        _super.prototype.destroy.call(this);
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {WorkbookModel} newProp
     * @param  {WorkbookModel} oldProp
     * @returns void
     * @hidden
     */
    Workbook.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cellStyle':
                    merge(this.commonCellStyle, skipDefaultValue(newProp.cellStyle));
                    break;
                case 'sheets':
                    initSheet(this);
                    break;
            }
        }
    };
    /**
     * Not applicable for workbook.
     * @hidden
     */
    Workbook.prototype.appendTo = function (selector) {
        _super.prototype.appendTo.call(this, selector);
    };
    /**
     * Used to hide/show the rows in spreadsheet.
     * @param {number} startRow - Specifies the start row index.
     * @param {number} endRow? - Specifies the end row index.
     * @param {boolean} hide? - To hide/show the rows in specified range.
     * @returns void
     */
    Workbook.prototype.hideRow = function (startIndex, endIndex, hide) {
        if (endIndex === void 0) { endIndex = startIndex; }
        if (hide === void 0) { hide = true; }
        var sheet = this.getActiveSheet();
        for (var i = startIndex; i <= endIndex; i++) {
            setRow(sheet, i, { hidden: hide });
        }
    };
    /**
     * Used to hide/show the columns in spreadsheet.
     * @param {number} startIndex - Specifies the start column index.
     * @param {number} endIndex? - Specifies the end column index.
     * @param {boolean} hide? - Set `true` / `false` to hide / show the columns.
     * @returns void
     */
    Workbook.prototype.hideColumn = function (startIndex, endIndex, hide) {
        if (endIndex === void 0) { endIndex = startIndex; }
        if (hide === void 0) { hide = true; }
        var sheet = this.getActiveSheet();
        for (var i = startIndex; i <= endIndex; i++) {
            setColumn(sheet, i, { hidden: hide });
        }
    };
    /**
     * Sets the border to specified range of cells.
     * @param {CellStyleModel} style? - Specifies the style property which contains border value.
     * @param {string} range? - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @param {BorderType} type? - Specifies the range of cell reference. If not specified, it will considered the active cell reference.
     * @returns void
     */
    Workbook.prototype.setBorder = function (style, range, type) {
        this.notify(setCellFormat, {
            style: style, borderType: type, range: range || this.getActiveSheet().selectedRange
        });
    };
    /**
     * Used to insert rows in to the spreadsheet.
     * @param {number | RowModel[]} startRow? - Specifies the start row index / row model which needs to be inserted.
     * @param {number} endRow? - Specifies the end row index.
     * @returns void
     */
    Workbook.prototype.insertRow = function (startRow, endRow) {
        this.notify(insertModel, { model: this.getActiveSheet(), start: startRow, end: endRow, modelType: 'Row' });
    };
    /**
     * Used to insert columns in to the spreadsheet.
     * @param {number | ColumnModel[]} startColumn? - Specifies the start column index / column model which needs to be inserted.
     * @param {number} endColumn? - Specifies the end column index.
     * @returns void
     */
    Workbook.prototype.insertColumn = function (startColumn, endColumn) {
        this.notify(insertModel, {
            model: this.getActiveSheet(), start: startColumn, end: endColumn,
            modelType: 'Column'
        });
    };
    /**
     * Used to insert sheets in to the spreadsheet.
     * @param {number | SheetModel[]} startSheet? - Specifies the start column index / column model which needs to be inserted.
     * @param {number} endSheet? - Specifies the end column index.
     * @returns void
     */
    Workbook.prototype.insertSheet = function (startSheet, endSheet) {
        this.notify(insertModel, { model: this, start: startSheet, end: endSheet, modelType: 'Sheet' });
    };
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
    Workbook.prototype.delete = function (startIndex, endIndex, model) {
        this.notify(deleteModel, {
            model: !model || model === 'Sheet' ? this : this.getActiveSheet(), start: startIndex || 0, end: endIndex || 0, modelType: model || 'Sheet'
        });
    };
    /**
     * Used to merge the range of cells.
     * @param {string} range? - Specifies the rnage of cells as address.
     * @param {MergeType} type? - Specifies the merge type. The possible values are,
     * - All: Merge all the cells between provided range.
     * - Horizontally: Merge the cells row-wise.
     * - Vertically: Merge the cells column-wise.
     * @returns void
     */
    Workbook.prototype.merge = function (range, type) {
        range = range || this.getActiveSheet().selectedRange;
        this.notify(setMerge, { merge: true, range: range, type: type || 'All', refreshRibbon: range.indexOf(this.getActiveSheet().activeCell) > -1 ? true : false });
    };
    /** Used to compute the specified expression/formula.
     * @param {string} formula - Specifies the formula(=SUM(A1:A3)) or expression(2+3).
     * @returns string | number
     */
    Workbook.prototype.computeExpression = function (formula) {
        var args = {
            action: 'computeExpression', formula: formula
        };
        this.notify(events.workbookFormulaOperation, args);
        return args.calcValue;
    };
    Workbook.prototype.initEmptySheet = function () {
        if (!this.sheets.length) {
            this.createSheet();
        }
        else {
            initSheet(this);
        }
    };
    /** @hidden */
    Workbook.prototype.getActiveSheet = function () {
        return this.sheets[this.activeSheetIndex];
    };
    /**
     * Used for setting the used range row and column index.
     * @hidden
     */
    Workbook.prototype.setUsedRange = function (rowIdx, colIdx) {
        var sheet = this.getActiveSheet();
        if (rowIdx > sheet.usedRange.rowIndex) {
            sheet.usedRange.rowIndex = rowIdx;
            this.notify(updateUsedRange, { index: rowIdx, update: 'row' });
        }
        if (colIdx > sheet.usedRange.colIndex) {
            sheet.usedRange.colIndex = colIdx;
            this.notify(updateUsedRange, { index: colIdx, update: 'col' });
        }
    };
    /**
     * Gets the range of data as JSON from the specified address.
     * @param {string} address - Specifies the address for range of cells.
     */
    Workbook.prototype.getData = function (address) {
        return getData(this, address);
    };
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    Workbook.prototype.getModuleName = function () {
        return 'workbook';
    };
    /** @hidden */
    Workbook.prototype.getValueRowCol = function (sheetIndex, rowIndex, colIndex) {
        var args = {
            action: 'getSheetInfo', sheetInfo: []
        };
        this.notify(events.workbookFormulaOperation, args);
        var id = getSheetIndexByName(this, 'Sheet' + (sheetIndex + 1), args.sheetInfo);
        if (id === -1) {
            var errArgs = { action: 'getReferenceError', refError: '' };
            this.notify(events.workbookFormulaOperation, errArgs);
            return errArgs.refError;
        }
        sheetIndex = getSheetIndexFromId(this, sheetIndex + 1);
        var sheet = getSheet(this, sheetIndex);
        var cell = getCell(rowIndex - 1, colIndex - 1, sheet);
        return (cell && cell.value) || '';
    };
    /** @hidden */
    Workbook.prototype.setValueRowCol = function (sheetIndex, value, rowIndex, colIndex) {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(events.workbookEditOperation, {
            action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
            sheetIndex: sheetIndex, isValueOnly: true
        });
    };
    /**
     * Opens the specified excel file or stream.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    Workbook.prototype.open = function (options) {
        this.notify(events.workbookOpen, options);
    };
    /**
     * Opens the specified JSON object.
     * <br><br>
     * The available arguments in options are:
     * * file: Specifies the spreadsheet model as object or string. And the object contains the jsonObject,
     * which is saved from spreadsheet using saveAsJson method.
     *
     * @param options - Options for opening the JSON object.
     */
    Workbook.prototype.openFromJson = function (options) {
        this.isOpen = true;
        var jsonObject = typeof options.file === 'object' ? JSON.stringify(options.file) : options.file;
        this.notify(events.workbookOpen, { jsonObject: jsonObject });
    };
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
    Workbook.prototype.save = function (saveOptions) {
        if (saveOptions === void 0) { saveOptions = {}; }
        if (this.allowSave) {
            var defaultProps = {
                url: this.saveUrl,
                fileName: saveOptions.fileName || 'Sample',
                saveType: 'Xlsx'
            };
            var eventArgs = __assign({}, defaultProps, saveOptions, { customParams: {}, isFullPost: true, needBlobData: false, cancel: false });
            this.trigger('beforeSave', eventArgs);
            this.notify(beginAction, { eventArgs: eventArgs, action: 'beforeSave' });
            if (!eventArgs.cancel) {
                this.notify(events.beginSave, {
                    saveSettings: eventArgs, isFullPost: eventArgs.isFullPost,
                    needBlobData: eventArgs.needBlobData, customParams: eventArgs.customParams
                });
            }
        }
    };
    /**
     * Saves the Spreadsheet data as JSON object.
     */
    Workbook.prototype.saveAsJson = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.on(events.onSave, function (args) {
                args.cancel = true;
                _this.off(events.onSave);
                resolve({ jsonObject: { Workbook: args.jsonObject } });
                _this.notify(events.saveCompleted, args);
            });
            _this.save();
        });
    };
    Workbook.prototype.addHyperlink = function (hyperlink, cellAddress) {
        var args = { hyperlink: hyperlink, cell: cellAddress };
        this.notify(setLinkModel, args);
    };
    /**
     * To find the specified cell value.
     * @param args - options for find.
     */
    Workbook.prototype.findHandler = function (args) {
        if (args.findOpt === 'next') {
            this.notify(events.findNext, args);
        }
        else if (args.findOpt === 'prev') {
            this.notify(events.findPrevious, args);
        }
    };
    /**
     * To replace the specified cell or entire match value.
     * @param args - options for replace.
     */
    Workbook.prototype.replaceHandler = function (args) {
        if (args.replaceBy === 'replace') {
            this.notify(events.replaceHandler, args);
        }
        else {
            this.notify(events.replaceAllHandler, args);
        }
    };
    /**
     * Protect the active sheet based on the protect sheetings.
     * @param protectSettings - Specifies the protect settings of the sheet.
     */
    Workbook.prototype.protectSheet = function (sheet, protectSettings) {
        this.notify(events.protectsheetHandler, protectSettings);
    };
    /**
     * Unprotect the active sheet.
     * @param sheet - Specifies the sheet to Unprotect.
     */
    Workbook.prototype.unprotectSheet = function (sheet) {
        var args = { sheet: sheet };
        this.notify(events.unprotectsheetHandler, args);
    };
    /**
     * Sorts the range of cells in the active Spreadsheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    Workbook.prototype.sort = function (sortOptions, range) {
        if (!this.allowSorting) {
            return Promise.reject();
        }
        var eventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            sortOptions: sortOptions || { sortDescriptors: {} },
            cancel: false
        };
        var promise = new Promise(function (resolve, reject) { resolve((function () { })()); });
        var sortArgs = { args: eventArgs, promise: promise };
        this.notify(events.initiateSort, sortArgs);
        return sortArgs.promise;
    };
    Workbook.prototype.addDataValidation = function (rules, range) {
        range = range ? range : this.getActiveSheet().selectedRange;
        var eventArgs = {
            range: range, type: rules.type, operator: rules.operator, value1: rules.value1,
            value2: rules.value2, ignoreBlank: rules.ignoreBlank, inCellDropDown: rules.inCellDropDown, cancel: false
        };
        this.notify(beginAction, { eventArgs: eventArgs, action: 'validation' });
        if (!eventArgs.cancel) {
            range = eventArgs.range;
            rules.type = eventArgs.type;
            rules.operator = eventArgs.operator;
            rules.value1 = eventArgs.value1;
            rules.value2 = eventArgs.value2;
            rules.ignoreBlank = eventArgs.ignoreBlank;
            rules.inCellDropDown = eventArgs.inCellDropDown;
            this.notify(events.setValidation, { rules: rules, range: range });
            delete eventArgs.cancel;
            this.notify(completeAction, { eventArgs: eventArgs, action: 'validation' });
        }
    };
    Workbook.prototype.removeDataValidation = function (range) {
        this.notify(events.removeValidation, { range: range });
    };
    Workbook.prototype.addInvalidHighlight = function (range) {
        this.notify(events.addHighlight, { range: range });
    };
    Workbook.prototype.removeInvalidHighlight = function (range) {
        this.notify(events.removeHighlight, { range: range });
    };
    Workbook.prototype.conditionalFormat = function (conditionalFormat) {
        conditionalFormat.range = conditionalFormat.range || this.getActiveSheet().selectedRange;
        this.notify(events.setCFRule, { conditionalFormat: conditionalFormat });
    };
    Workbook.prototype.clearConditionalFormat = function (range) {
        range = range || this.getActiveSheet().selectedRange;
        this.notify(events.clearCFRule, { range: range });
    };
    /**
     * To update a cell properties.
     * @param {CellModel} cell - Cell properties.
     * @param {string} address - Address to update.
     */
    Workbook.prototype.updateCell = function (cell, address) {
        var sheetIdx;
        var range = getIndexesFromAddress(address);
        if (address.includes('!')) {
            sheetIdx = getSheetIndex(this, address.split('!')[0]);
            if (sheetIdx === undefined) {
                sheetIdx = this.activeSheetIndex;
            }
        }
        else {
            sheetIdx = this.activeSheetIndex;
        }
        setCell(range[0], range[1], this.sheets[sheetIdx], cell, true);
        if (cell.value) {
            this.notify(events.workbookEditOperation, {
                action: 'updateCellValue', address: range, value: cell.value,
                sheetIndex: sheetIdx
            });
        }
    };
    /**
     * This method is used to wrap/unwrap the text content of the cell.
     * @param address - Address of the cell to be wrapped.
     * @param wrap - Set `false` if the text content of the cell to be unwrapped.
     * @returns void
     */
    Workbook.prototype.wrap = function (address, wrap) {
        if (wrap === void 0) { wrap = true; }
        wrapText(address, wrap, this);
    };
    /**
     * Adds the defined name to the Spreadsheet.
     * @param {DefineNameModel} definedName - Specifies the name.
     * @return {boolean} - Return the added status of the defined name.
     */
    Workbook.prototype.addDefinedName = function (definedName) {
        var eventArgs = {
            action: 'addDefinedName',
            isAdded: false,
            definedName: definedName
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
        return eventArgs.isAdded;
    };
    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    Workbook.prototype.removeDefinedName = function (definedName, scope) {
        if (scope === void 0) { scope = ''; }
        var eventArgs = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName,
            scope: scope
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
        return eventArgs.isRemoved;
    };
    /** @hidden */
    Workbook.prototype.clearRange = function (address, sheetIndex, valueOnly) {
        if (valueOnly === void 0) { valueOnly = true; }
        clearRange(this, address || this.getActiveSheet().selectedRange, isNullOrUndefined(sheetIndex) ? this.activeSheetIndex : sheetIndex, valueOnly);
    };
    /**
     * Used to set the image in spreadsheet.
     * @param {ImageModel} images - Specifies the options to insert image in spreadsheet.
     * @param {string} range - Specifies the range in spreadsheet.
     * @returns void
     */
    Workbook.prototype.insertImage = function (images, range) {
        this.notify(setImage, { options: images, range: range ? range : this.getActiveSheet().selectedRange });
    };
    /**
     * Used to set the chart in spreadsheet.
     * @param {ChartModel} chart - Specifies the options to insert chart in spreadsheet.
     * @returns void
     */
    Workbook.prototype.insertChart = function (chart) {
        this.notify(setChart, { chart: chart });
    };
    /**
     * Used to delete the chart from spreadsheet.
     * @param {string} id - Specifies the chart element id.
     * @returns void
     */
    Workbook.prototype.deleteChart = function (id) {
        this.notify(deleteChart, { id: id });
    };
    /**
     * Filters the range of cells in the sheet.
     */
    Workbook.prototype.filter = function (filterOptions, range) {
        if (!this.allowFiltering) {
            return Promise.reject();
        }
        var eventArgs = {
            range: range || this.getActiveSheet().selectedRange,
            filterOptions: filterOptions,
            cancel: false
        };
        var promise = new Promise(function (resolve, reject) { resolve((function () { })()); });
        var filterArgs = { args: eventArgs, promise: promise };
        this.notify(events.initiateFilter, filterArgs);
        return filterArgs.promise;
    };
    /**
     * Clears the filter changes of the sheet.
     */
    Workbook.prototype.clearFilter = function () {
        this.notify(events.clearAllFilter, null);
    };
    /**
     * To add custom library function.
     * @param {string} functionHandler - Custom function handler name
     * @param {string} functionName - Custom function name
     */
    Workbook.prototype.addCustomFunction = function (functionHandler, functionName) {
        functionName = functionName ? functionName : typeof functionHandler === 'string' ? functionHandler :
            functionHandler.name.replace('bound ', '');
        var eventArgs = {
            action: 'addCustomFunction',
            functionHandler: functionHandler,
            functionName: functionName
        };
        this.notify(events.workbookFormulaOperation, eventArgs);
    };
    /**
     * This method is used to Clear contents, formats and hyperlinks in spreadsheet.
     *    * @param {ClearOptions} options - Options for clearing the content, formats and hyperlinks in spreadsheet.
     */
    Workbook.prototype.clear = function (options) {
        this.notify(events.clear, options);
    };
    /**
     * Gets the formatted text of the cell.
     */
    Workbook.prototype.getDisplayText = function (cell) {
        if (!cell) {
            return '';
        }
        if (cell.value && cell.format) {
            var eventArgs = {
                formattedText: cell.value, value: cell.value, format: cell.format, onLoad: true
            };
            this.notify(events.getFormattedCellObject, eventArgs);
            return eventArgs.formattedText;
        }
        else if (!cell.value && cell.hyperlink) {
            return typeof cell.hyperlink === 'string' ? cell.hyperlink : cell.hyperlink.address;
        }
        else {
            return cell.value ? cell.value.toString() : '';
        }
    };
    /**
     * @hidden
     */
    Workbook.prototype.getAddressInfo = function (address) {
        return getAddressInfo(this, address);
    };
    /**
     * @hidden
     */
    Workbook.prototype.setSheetPropertyOnMute = function (sheet, prop, value) {
        this.isProtectedOnChange = true;
        sheet[prop] = value;
        this.isProtectedOnChange = false;
    };
    var Workbook_1;
    __decorate([
        Collection([], Sheet)
    ], Workbook.prototype, "sheets", void 0);
    __decorate([
        Property(0)
    ], Workbook.prototype, "activeSheetIndex", void 0);
    __decorate([
        Property('100%')
    ], Workbook.prototype, "height", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowFindAndReplace", void 0);
    __decorate([
        Property('100%')
    ], Workbook.prototype, "width", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showRibbon", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showFormulaBar", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showSheetTabs", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowEditing", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowOpen", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowSave", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowSorting", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowFiltering", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowNumberFormatting", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowCellFormatting", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowHyperlink", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowInsert", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowDelete", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowMerge", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowDataValidation", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowImage", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowChart", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowConditionalFormat", void 0);
    __decorate([
        Complex({}, CellStyle)
    ], Workbook.prototype, "cellStyle", void 0);
    __decorate([
        Property('')
    ], Workbook.prototype, "openUrl", void 0);
    __decorate([
        Property('')
    ], Workbook.prototype, "saveUrl", void 0);
    __decorate([
        Collection([], DefineName)
    ], Workbook.prototype, "definedNames", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "beforeOpen", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "openFailure", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "beforeSave", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "saveComplete", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "beforeCellFormat", void 0);
    __decorate([
        Event()
    ], Workbook.prototype, "queryCellInfo", void 0);
    Workbook = Workbook_1 = __decorate([
        NotifyPropertyChanges
    ], Workbook);
    return Workbook;
}(Component));
export { Workbook };
