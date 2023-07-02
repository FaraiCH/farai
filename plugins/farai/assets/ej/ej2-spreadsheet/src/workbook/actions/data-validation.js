import { setCell, setRow } from '../base/index';
import { setValidation, applyCellFormat, isValidation, removeValidation, addHighlight } from '../common/index';
import { removeHighlight } from '../common/index';
import { getRangeIndexes } from '../common/index';
/**
 * The `WorkbookHyperlink` module is used to handle Hyperlink action in Spreadsheet.
 */
var WorkbookDataValidation = /** @class */ (function () {
    /**
     * Constructor for WorkbookSort module.
     */
    function WorkbookDataValidation(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     */
    WorkbookDataValidation.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookDataValidation.prototype.addEventListener = function () {
        this.parent.on(setValidation, this.addValidationHandler, this);
        this.parent.on(removeValidation, this.removeValidationHandler, this);
        this.parent.on(addHighlight, this.addHighlightHandler, this);
        this.parent.on(removeHighlight, this.removeHighlightHandler, this);
    };
    WorkbookDataValidation.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setValidation, this.addValidationHandler);
            this.parent.off(removeValidation, this.removeValidationHandler);
            this.parent.off(addHighlight, this.addHighlightHandler);
            this.parent.off(removeHighlight, this.removeHighlightHandler);
        }
    };
    WorkbookDataValidation.prototype.addValidationHandler = function (args) {
        this.ValidationHandler(args.rules, args.range, false);
    };
    WorkbookDataValidation.prototype.removeValidationHandler = function (args) {
        this.ValidationHandler(args.rules, args.range, true);
    };
    WorkbookDataValidation.prototype.ValidationHandler = function (rules, range, isRemoveValidation) {
        var cell;
        var sheet = this.parent.getActiveSheet();
        range = range || sheet.selectedRange;
        var indexes = getRangeIndexes(range);
        for (var rowIdx = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
            if (!sheet.rows[rowIdx]) {
                setRow(sheet, rowIdx, {});
            }
            for (var colIdx = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                if (!sheet.rows[rowIdx].cells || !sheet.rows[rowIdx].cells[colIdx]) {
                    setCell(rowIdx, colIdx, sheet, {});
                }
                cell = sheet.rows[rowIdx].cells[colIdx];
                if (isRemoveValidation) {
                    if (cell.validation) {
                        delete (cell.validation);
                        var style = this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]);
                        this.parent.notify(applyCellFormat, {
                            style: style, rowIdx: rowIdx, colIdx: colIdx
                        });
                    }
                }
                else {
                    cell.validation = {
                        type: rules.type,
                        operator: rules.operator,
                        value1: (rules.type === 'List' && rules.value1.length > 256) ?
                            rules.value1.substring(0, 255) : rules.value1,
                        value2: rules.value2,
                        ignoreBlank: rules.ignoreBlank,
                        inCellDropDown: rules.inCellDropDown,
                    };
                }
            }
        }
    };
    WorkbookDataValidation.prototype.addHighlightHandler = function (args) {
        this.InvalidDataHandler(args.range, false);
    };
    WorkbookDataValidation.prototype.removeHighlightHandler = function (args) {
        this.InvalidDataHandler(args.range, true);
    };
    WorkbookDataValidation.prototype.InvalidDataHandler = function (range, isRemoveHighlightedData) {
        var isCell = false;
        var cell;
        var value;
        var sheet = this.parent.getActiveSheet();
        range = range || sheet.selectedRange;
        var indexes = range ? getRangeIndexes(range) : [];
        var rowIdx = range ? indexes[0] : 0;
        var lastRowIdx = range ? indexes[2] : sheet.rows.length;
        for (rowIdx; rowIdx <= lastRowIdx; rowIdx++) {
            if (sheet.rows[rowIdx]) {
                var colIdx = range ? indexes[1] : 0;
                var lastColIdx = range ? indexes[3] : sheet.rows[rowIdx].cells.length;
                for (colIdx; colIdx <= lastColIdx; colIdx++) {
                    if (sheet.rows[rowIdx].cells[colIdx]) {
                        cell = sheet.rows[rowIdx].cells[colIdx];
                        value = cell.value ? cell.value : '';
                        var range_1 = [rowIdx, colIdx];
                        var sheetIdx = this.parent.activeSheetIndex;
                        if (cell.validation && this.parent.allowDataValidation) {
                            this.parent.notify(isValidation, { value: value, range: range_1, sheetIdx: sheetIdx, isCell: isCell });
                            var isValid = this.parent.allowDataValidation;
                            this.parent.allowDataValidation = true;
                            if (!isValid) {
                                if (!isRemoveHighlightedData) {
                                    this.parent.notify(applyCellFormat, {
                                        style: { backgroundColor: '#ffff00', color: '#ff0000' }, rowIdx: rowIdx, colIdx: colIdx
                                    });
                                }
                                else if (isRemoveHighlightedData) {
                                    var style = this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]);
                                    this.parent.notify(applyCellFormat, {
                                        style: style, rowIdx: rowIdx, colIdx: colIdx
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookDataValidation.prototype.getModuleName = function () {
        return 'workbookDataValidation';
    };
    return WorkbookDataValidation;
}());
export { WorkbookDataValidation };
