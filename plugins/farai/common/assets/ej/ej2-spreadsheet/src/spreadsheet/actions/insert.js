import { beginAction, completeAction, insertSheetTab, skipHiddenIdx, refreshImagePosition } from '../common/index';
import { insert, dataChanged } from '../../workbook/common/index';
import { getCell } from '../../workbook/index';
/**
 * The `Insert` module is used to insert cells, rows, columns and sheets in to the spreadsheet.
 */
var Insert = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet insert module.
     * @private
     */
    function Insert(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Insert.prototype.insert = function (args) {
        var isAction;
        if (args.isAction) {
            isAction = true;
            delete args.isAction;
        }
        if (isAction) {
            this.parent.notify(beginAction, { eventArgs: args, action: 'insert' });
        }
        switch (args.modelType) {
            case 'Sheet':
                this.parent.notify(insertSheetTab, { startIdx: args.index, endIdx: args.index + (args.model.length - 1) });
                this.parent.renderModule.refreshSheet();
                this.parent.element.focus();
                break;
            case 'Row':
                if (!this.parent.scrollSettings.enableVirtualization || args.index <= this.parent.viewport.bottomIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.index < this.parent.viewport.topIndex) {
                            this.parent.viewport.topIndex += args.model.length;
                        }
                        this.parent.renderModule.refreshUI({
                            skipUpdateOnFirst: this.parent.viewport.topIndex === skipHiddenIdx(this.parent.getActiveSheet(), 0, true), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                        });
                    }
                    else {
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, rowIndex: args.index, colIndex: 0, refresh: 'Row' });
                    }
                    this.parent.notify(dataChanged, args);
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
                break;
            case 'Column':
                if (!this.parent.scrollSettings.enableVirtualization || args.index <= this.parent.viewport.rightIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.index < this.parent.viewport.leftIndex) {
                            this.parent.viewport.leftIndex += args.model.length;
                        }
                        this.parent.renderModule.refreshUI({
                            skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(this.parent.getActiveSheet(), 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column'
                        });
                    }
                    else {
                        this.parent.renderModule.refreshUI({
                            skipUpdateOnFirst: true, rowIndex: 0, colIndex: args.index, refresh: 'Column'
                        });
                    }
                    this.parent.selectRange(this.parent.getActiveSheet().selectedRange);
                }
                break;
        }
        this.refreshImgElement(args.model.length, this.parent.activeSheetIndex, args.modelType, args.index);
        if (isAction) {
            this.parent.notify(completeAction, { eventArgs: args, action: 'insert' });
        }
    };
    Insert.prototype.refreshImgElement = function (count, sheetIdx, modelType, index) {
        var sheet = this.parent.sheets[sheetIdx];
        var cellObj;
        var indexes = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
        for (var i = 0; i <= indexes[2]; i++) {
            for (var j = indexes[1]; j <= indexes[3]; j++) {
                cellObj = getCell(i, j, sheet);
                if (cellObj && cellObj.image && cellObj.image.length > 0) {
                    if ((modelType === 'Row' && i >= index) || (modelType === 'Column' && j >= index)) {
                        this.parent.notify(refreshImagePosition, {
                            rowIdx: i, colIdx: j, sheetIdx: sheetIdx, type: modelType, count: count, status: 'insert'
                        });
                    }
                }
            }
        }
    };
    Insert.prototype.addEventListener = function () {
        this.parent.on(insert, this.insert, this);
    };
    /**
     * Destroy insert module.
     */
    Insert.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    Insert.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(insert, this.insert);
        }
    };
    /**
     * Get the insert module name.
     */
    Insert.prototype.getModuleName = function () {
        return 'insert';
    };
    return Insert;
}());
export { Insert };
