import { setColumn } from '../base/index';
import { applyLockCells } from '../common/index';
import { protectsheetHandler, protectSheetWorkBook, updateToggle, setLockCells } from '../common/index';
import { unprotectsheetHandler } from '../common/index';
import { getRangeIndexes, getSwapRange } from '../common/index';
import { isUndefined } from '@syncfusion/ej2-base';
/**
 * The `WorkbookSpreadSheet` module is used to handle the Protecting functionalities in Workbook.
 */
var WorkbookProtectSheet = /** @class */ (function () {
    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    function WorkbookProtectSheet(workbook) {
        this.parent = workbook;
        this.addEventListener();
    }
    WorkbookProtectSheet.prototype.protectsheetHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        this.parent.setSheetPropertyOnMute(sheet, 'protectSettings', {
            selectCells: args.selectCells, formatCells: args.formatCells,
            formatColumns: args.formatColumns, formatRows: args.formatRows, insertLink: args.insertLink
        });
        this.parent.notify(protectSheetWorkBook, sheet.protectSettings);
        this.parent.notify(updateToggle, { props: 'Protect' });
        sheet.columns.forEach(function (column) {
            if (column && isUndefined(column.isLocked)) {
                column.isLocked = true;
            }
        });
    };
    WorkbookProtectSheet.prototype.unprotectsheetHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        if (args.sheet) {
            sheet = this.parent.sheets[args.sheet];
        }
        sheet.protectSettings.formatCells = sheet.protectSettings.formatColumns = false;
        sheet.protectSettings.formatRows = sheet.protectSettings.selectCells = false;
        this.parent.setSheetPropertyOnMute(sheet, 'isProtected', false);
        this.parent.notify(protectSheetWorkBook, sheet.protectSettings);
        this.parent.notify(updateToggle, { props: 'Protect' });
    };
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    WorkbookProtectSheet.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookProtectSheet.prototype.addEventListener = function () {
        this.parent.on(protectsheetHandler, this.protectsheetHandler, this);
        this.parent.on(unprotectsheetHandler, this.unprotectsheetHandler, this);
        this.parent.on(setLockCells, this.lockCells, this);
    };
    WorkbookProtectSheet.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(protectsheetHandler, this.protectsheetHandler);
            this.parent.off(setLockCells, this.lockCells);
            this.parent.off(protectsheetHandler, this.unprotectsheetHandler);
        }
    };
    WorkbookProtectSheet.prototype.lockCells = function (args) {
        var sheet = this.parent.getActiveSheet();
        var range;
        if (args) {
            range = args.range;
        }
        else {
            range = sheet.selectedRange;
        }
        var indexes = typeof (range) === 'object' ? range :
            getSwapRange(getRangeIndexes(range));
        if (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1) {
            for (var i = indexes[1]; i <= indexes[3]; i++) {
                setColumn(sheet, i, { isLocked: args.isLocked });
            }
        }
        for (var i = indexes[0]; i <= indexes[2]; i++) {
            for (var j = indexes[1]; j <= indexes[3]; j++) {
                if (this.parent.getActiveSheet().id === sheet.id) {
                    this.parent.notify(applyLockCells, { rowIdx: i, colIdx: j, isLocked: args.isLocked
                    });
                }
            }
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookProtectSheet.prototype.getModuleName = function () {
        return 'workbookProtectSheet';
    };
    return WorkbookProtectSheet;
}());
export { WorkbookProtectSheet };
