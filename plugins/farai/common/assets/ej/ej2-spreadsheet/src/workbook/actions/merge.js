import { getCell, setCell } from '../base/index';
import { setMerge, getSwapRange, getRangeIndexes, mergedRange, applyMerge, activeCellMergedRange } from './../common/index';
import { insertMerge, activeCellChanged, pasteMerge, getCellIndexes, checkIsFormula, setCellFormat } from './../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `WorkbookMerge` module is used to merge the range of cells.
 */
var WorkbookMerge = /** @class */ (function () {
    /**
     * Constructor for the workbook merge module.
     * @private
     */
    function WorkbookMerge(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WorkbookMerge.prototype.merge = function (args) {
        if (args.isAction) {
            this.parent.notify('actionBegin', { eventArgs: args, action: 'merge' });
            if (!args.model) {
                args.model = [];
            }
        }
        if (typeof (args.range) === 'string') {
            args.range = getRangeIndexes(args.range);
        }
        args.range = getSwapRange(args.range);
        var sheet = this.parent.getActiveSheet();
        if (!args.skipChecking) {
            this.mergedRange(args);
        }
        if (!args.merge || args.type === 'All') {
            this.mergeAll(args);
            if (args.refreshRibbon) {
                this.parent.notify(activeCellChanged, null);
            }
        }
        else if (args.type === 'Horizontally') {
            this.mergeHorizontally(args);
        }
        else if (args.type === 'Vertically') {
            this.mergeVertically(args);
        }
        this.parent.setUsedRange(args.range[2], args.range[3]);
        if (args.isAction) {
            this.parent.notify('actionComplete', { eventArgs: args, action: 'merge' });
        }
        this.parent.notify('selectRange', { indexes: getRangeIndexes(sheet.selectedRange), skipChecking: true });
    };
    WorkbookMerge.prototype.mergeAll = function (args) {
        var rowSpan = 0;
        var cell;
        args.range = args.range;
        var colSpan;
        var value;
        var sheet = this.parent.getActiveSheet();
        var curCell;
        var startCell = getCell(args.range[0], args.range[1], sheet);
        var border = startCell ? (startCell.style ? startCell.style.borderLeft : null) : null;
        if (border === 'none') {
            border = startCell.style.borderRight !== 'none' ? startCell.style.borderRight :
                (startCell.style.borderTop ? startCell.style.borderTop : null);
        }
        if (border === 'none') {
            border = startCell.style.borderBottom !== 'none' ? startCell.style.borderBottom : null;
        }
        if (!isNullOrUndefined(startCell) && !isNullOrUndefined(border)) {
            startCell.style.borderBottom = '';
            startCell.style.borderLeft = '';
            startCell.style.borderTop = '';
            startCell.style.borderRight = '';
        }
        for (var i = args.range[0]; i <= args.range[2]; i++) {
            colSpan = 0;
            if (args.isAction) {
                args.model.push({ cells: [] });
            }
            for (var j = args.range[1]; j <= args.range[3]; j++) {
                cell = getCell(i, j, sheet);
                if (cell && (cell.value || cell.formula) && !value) {
                    value = cell.formula || cell.value;
                }
                if (args.isAction && args.merge) {
                    args.model[i - args.range[0]].cells[j - args.range[1]] = {};
                    Object.assign(args.model[i - args.range[0]].cells[j - args.range[1]], cell);
                }
                if (sheet.rows[i] && sheet.rows[i].cells && sheet.rows[i].cells[j]) {
                    delete sheet.rows[i].cells[j].rowSpan;
                    delete sheet.rows[i].cells[j].colSpan;
                    if (!args.merge && !args.isAction && args.model && args.model[i - args.range[0]] && args.model[i - args.range[0]].
                        cells[j - args.range[1]] && args.model[i - args.range[0]].cells[j - args.range[1]] !== {}) {
                        setCell(i, j, sheet, args.model[i - args.range[0]].cells[j - args.range[1]]);
                    }
                }
                if (args.merge) {
                    cell = new Object();
                    if (i === args.range[0] && j === args.range[1]) {
                        if (args.range[3] - args.range[1] > 0) {
                            cell.colSpan = (args.range[3] - args.range[1]) + 1;
                        }
                        if (args.range[2] - args.range[0] > 0) {
                            cell.rowSpan = (args.range[2] - args.range[0]) + 1;
                        }
                        setCell(args.range[0], args.range[1], sheet, cell, true);
                        continue;
                    }
                    else {
                        if (i !== args.range[0]) {
                            cell.rowSpan = -rowSpan;
                        }
                        if (j !== args.range[1]) {
                            colSpan++;
                            cell.colSpan = -colSpan;
                        }
                        if (sheet.rows[i] && sheet.rows[i].cells && sheet.rows[i].cells[j]) {
                            delete sheet.rows[i].cells[j].value;
                            delete sheet.rows[i].cells[j].formula;
                        }
                        curCell = getCell(i, j, sheet) || {};
                        setCell(i, j, sheet, Object.assign(cell, curCell));
                    }
                }
                if (!args.preventRefresh) {
                    this.parent.notify(applyMerge, { rowIdx: i, colIdx: j });
                }
            }
            rowSpan++;
        }
        if (args.merge) {
            cell = this.getCellValue(args.range[0], args.range[1], value);
            setCell(args.range[0], args.range[1], sheet, cell, true);
            if (!args.preventRefresh) {
                this.parent.notify(applyMerge, { rowIdx: args.range[0], colIdx: args.range[1] });
            }
        }
        if (!isNullOrUndefined(border)) {
            this.parent.notify(setCellFormat, { style: { border: border }, range: args.range, onActionUpdate: true });
        }
    };
    WorkbookMerge.prototype.mergeHorizontally = function (args) {
        var mergeCount;
        args.range = args.range;
        var cell;
        var sheet = this.parent.getActiveSheet();
        var newValue;
        var rowIdx;
        var curCell;
        for (var i = args.range[0]; i <= args.range[2]; i++) {
            mergeCount = 0;
            if (args.isAction) {
                args.model.push({ cells: [] });
            }
            for (var j = args.range[1]; j <= args.range[3]; j++) {
                curCell = getCell(i, j, sheet);
                cell = new Object();
                if (args.isAction) {
                    args.model[i - args.range[0]].cells[j - args.range[1]] = {};
                    Object.assign(args.model[i - args.range[0]].cells[j - args.range[1]], curCell);
                }
                if (j === args.range[1]) {
                    if (i === args.range[0]) {
                        continue;
                    }
                    rowIdx = i - 1;
                    if (sheet.rows[rowIdx] && sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[j]) {
                        delete sheet.rows[rowIdx].cells[j].rowSpan;
                    }
                    cell = this.getCellValue(rowIdx, j, newValue);
                    if (args.range[3] - args.range[1] > 0) {
                        cell.colSpan = (args.range[3] - args.range[1]) + 1;
                    }
                    newValue = null;
                    setCell(rowIdx, j, sheet, cell, true);
                }
                else {
                    if (curCell && (curCell.value || curCell.formula) && !newValue) {
                        newValue = curCell.formula || curCell.value;
                    }
                    rowIdx = i;
                    if (sheet.rows[rowIdx] && sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[j]) {
                        delete sheet.rows[rowIdx].cells[j].rowSpan;
                        delete sheet.rows[rowIdx].cells[j].value;
                        delete sheet.rows[rowIdx].cells[j].formula;
                    }
                    mergeCount++;
                    cell.colSpan = -mergeCount;
                    setCell(rowIdx, j, sheet, cell, true);
                }
                this.parent.notify(applyMerge, { rowIdx: rowIdx, colIdx: j });
            }
        }
        if (sheet.rows[args.range[2]] && sheet.rows[args.range[2]].cells && sheet.rows[args.range[2]].cells[args.range[1]]) {
            delete sheet.rows[args.range[2]].cells[args.range[1]].rowSpan;
        }
        cell = this.getCellValue(args.range[2], args.range[1], newValue);
        if (args.range[3] - args.range[1] > 0) {
            cell.colSpan = (args.range[3] - args.range[1]) + 1;
        }
        setCell(args.range[2], args.range[1], sheet, cell, true);
        this.parent.notify(applyMerge, { rowIdx: args.range[2], colIdx: args.range[1] });
    };
    WorkbookMerge.prototype.getCellValue = function (rowIdx, colIdx, value) {
        var sheet = this.parent.getActiveSheet();
        var cell = new Object();
        var curCell = getCell(rowIdx, colIdx, sheet);
        if (value && (!curCell || (!curCell.value && !curCell.formula))) {
            if (checkIsFormula(value)) {
                cell.formula = value;
            }
            else {
                cell.value = value;
            }
        }
        return cell;
    };
    WorkbookMerge.prototype.mergeVertically = function (args) {
        var rowSpan = 0;
        args.range = args.range;
        var sheet = this.parent.getActiveSheet();
        var cell;
        var newValue;
        var colIdx;
        var curCell;
        for (var i = args.range[1]; i <= args.range[3]; i++) {
            for (var j = args.range[0]; j <= args.range[2]; j++) {
                curCell = getCell(j, i, sheet);
                if (args.isAction) {
                    if (args.model[j - args.range[0]] === undefined) {
                        args.model[j - args.range[0]] = { cells: [] };
                    }
                    args.model[j - args.range[0]].cells[i - args.range[1]] = {};
                    Object.assign(args.model[j - args.range[0]].cells[i - args.range[1]], curCell);
                }
                if (j === args.range[0]) {
                    rowSpan = 0;
                    if (i === args.range[1]) {
                        continue;
                    }
                    colIdx = i - 1;
                    if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[colIdx]) {
                        delete sheet.rows[j].cells[colIdx].colSpan;
                    }
                    cell = this.getCellValue(j, colIdx, newValue);
                    if (args.range[2] - args.range[0] > 0) {
                        cell.rowSpan = (args.range[2] - args.range[0]) + 1;
                    }
                    newValue = null;
                    setCell(j, colIdx, sheet, cell, true);
                }
                else {
                    cell = new Object();
                    if (curCell && (curCell.value || curCell.formula) && !newValue) {
                        newValue = curCell.formula || curCell.value;
                    }
                    rowSpan++;
                    colIdx = i;
                    if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[colIdx]) {
                        delete sheet.rows[j].cells[colIdx].colSpan;
                        delete sheet.rows[j].cells[colIdx].value;
                        delete sheet.rows[j].cells[colIdx].formula;
                    }
                    cell.rowSpan = -rowSpan;
                    setCell(j, colIdx, sheet, cell, true);
                }
                this.parent.notify(applyMerge, { rowIdx: j, colIdx: colIdx });
            }
        }
        if (sheet.rows[args.range[0]] && sheet.rows[args.range[0]].cells && sheet.rows[args.range[0]].cells[args.range[3]]) {
            delete sheet.rows[args.range[0]].cells[args.range[3]].colSpan;
        }
        cell = this.getCellValue(args.range[0], args.range[1], newValue);
        if (args.range[2] - args.range[0] > 0) {
            cell.rowSpan = (args.range[2] - args.range[0]) + 1;
        }
        setCell(args.range[0], args.range[3], sheet, cell, true);
        this.parent.notify(applyMerge, { rowIdx: args.range[0], colIdx: args.range[3] });
    };
    WorkbookMerge.prototype.activeCellRange = function (args) {
        args.range = args.range;
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(args.range[0], args.range[1], sheet);
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                args.range[0] += cell.rowSpan;
                if (args.insertCount) {
                    args.range[0] -= args.insertCount;
                }
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                args.range[1] += cell.colSpan;
                if (args.insertCount) {
                    args.range[1] -= args.insertCount;
                }
            }
            cell = getCell(args.range[0], args.range[1], sheet);
            if (cell) {
                if (cell.rowSpan > 1 && (args.range[0] + (cell.rowSpan - 1) >= args.range[2] || args.insertCount)) {
                    args.range[2] = args.range[0] + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && (args.range[1] + (cell.colSpan - 1) >= args.range[3] || args.insertCount)) {
                    args.range[3] = args.range[1] + (cell.colSpan - 1);
                }
            }
        }
    };
    WorkbookMerge.prototype.mergedRange = function (args) {
        if (typeof (args.range) === 'string') {
            args.range = getRangeIndexes(args.range);
        }
        if (args.range[0] <= args.range[2] && args.range[1] <= args.range[3]) {
            this.forward(args);
        }
        else if (args.range[0] >= args.range[2] && args.range[1] >= args.range[3]) {
            this.reverse(args);
        }
        else if (args.range[0] < args.range[2] && args.range[1] > args.range[3]) {
            this.forwardReverse(args);
        }
        else if (args.range[0] > args.range[2] && args.range[1] < args.range[3]) {
            this.reverseForward(args);
        }
    };
    WorkbookMerge.prototype.forward = function (args) {
        args.range = args.range;
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(args.range[0], args.range[1], sheet);
        var endRowIdx;
        var endColIdx;
        var rowIdx = endRowIdx = args.range[0];
        var colIdx = endColIdx = args.range[1];
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIdx = endRowIdx = args.range[0] + cell.rowSpan;
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                colIdx = endColIdx = args.range[1] + cell.colSpan;
            }
            cell = getCell(rowIdx, colIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1) {
                    endRowIdx += (cell.rowSpan - 1);
                    if (rowIdx + (cell.rowSpan - 1) >= args.range[2]) {
                        args.range[2] = args.range[0];
                        args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                }
                if (cell.colSpan > 1) {
                    endColIdx += (cell.colSpan - 1);
                    if (colIdx + (cell.colSpan - 1) >= args.range[3]) {
                        args.range[3] = args.range[1];
                        args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        args.range[0] = rowIdx;
        args.range[1] = colIdx;
        if (args.range[0] === rowIdx && args.range[1] === colIdx && args.range[2] === endRowIdx && args.range[3] === endColIdx) {
            args.isActiveCell = true;
        }
        if (args.skipChecking) {
            return;
        }
        for (var i = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                rowIdx = args.range[2];
                colIdx = i;
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[1]) {
                        args.range[1] = colIdx;
                    }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) {
                        args.range[0] = rowIdx;
                    }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = colIdx;
                        args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx;
                        args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                }
            }
        }
        var startRowIdx;
        var startColIdx;
        for (var i = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                startColIdx = i;
                startRowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    startColIdx += cell.colSpan;
                    if (startColIdx < args.range[1]) {
                        args.range[1] = startColIdx;
                    }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIdx += cell.rowSpan;
                    if (startRowIdx < args.range[0]) {
                        args.range[0] = startRowIdx;
                    }
                }
            }
        }
        for (var i = args.range[0]; i <= args.range[2]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rowIdx = i;
                colIdx = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) {
                        args.range[0] = rowIdx;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[1]) {
                        args.range[1] = colIdx;
                    }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx;
                        args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = colIdx;
                        args.range[3] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
    };
    WorkbookMerge.prototype.forwardReverse = function (args) {
        var sheet = this.parent.getActiveSheet();
        args.range = args.range;
        var colIndex = args.range[1];
        var cell = getCell(args.range[0], args.range[1], sheet);
        var rowIndex = args.range[0];
        if (cell) {
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                colIndex += cell.colSpan;
                if (args.range[3] >= colIndex) {
                    args.range[3] = colIndex;
                }
            }
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIndex += cell.rowSpan;
                if (rowIndex < args.range[0]) {
                    args.range[0] = rowIndex;
                }
            }
            cell = getCell(rowIndex, colIndex, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rowIndex + (cell.rowSpan - 1) >= args.range[2]) {
                    args.range[2] = rowIndex + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && colIndex + (cell.colSpan - 1) >= args.range[1]) {
                    args.range[1] = colIndex + (cell.colSpan - 1);
                }
            }
        }
        args.range[0] = rowIndex;
        if (args.skipChecking) {
            return;
        }
        var rowIdx;
        var cellIdx;
        for (var i = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                cellIdx = i;
                rowIdx = args.range[2];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[0]) {
                        args.range[0] = rowIdx;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIdx += cell.colSpan;
                    if (cellIdx < args.range[3]) {
                        args.range[3] = cellIdx;
                    }
                }
                cell = getCell(rowIdx, cellIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        var startRowIndex;
        for (var i = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                cellIdx = i;
                startRowIndex = args.range[0];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIndex += cell.rowSpan;
                    if (startRowIndex < args.range[0]) {
                        args.range[0] = startRowIndex;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIdx += cell.colSpan;
                }
                cell = getCell(startRowIndex, cellIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && startRowIndex + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = startRowIndex + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIdx;
                        args.range[1] = cellIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        var colIdx;
        for (var i = args.range[0]; i <= args.range[2]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                startRowIndex = i;
                colIdx = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    startRowIndex += cell.rowSpan;
                    if (startRowIndex < args.range[0]) {
                        args.range[0] = startRowIndex;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[3]) {
                        args.range[3] = colIdx;
                    }
                }
                cell = getCell(startRowIndex, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && startRowIndex + (cell.rowSpan - 1) > args.range[2]) {
                        args.range[2] = startRowIndex;
                        args.range[2] = startRowIndex + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx;
                        args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
    };
    WorkbookMerge.prototype.reverse = function (args) {
        args.range = args.range;
        var colnIdx = args.range[1];
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(args.range[0], args.range[1], sheet);
        var rowIdx = args.range[0];
        if (cell) {
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                colnIdx += cell.colSpan;
            }
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rowIdx += cell.rowSpan;
            }
            if (args.range[2] >= rowIdx) {
                args.range[2] = rowIdx;
                args.isActiveCell = true;
            }
            if (args.range[3] >= colnIdx) {
                args.range[3] = colnIdx;
                if (args.range[2] === rowIdx) {
                    args.isActiveCell = true;
                }
            }
            else if (args.isActiveCell) {
                args.isActiveCell = false;
            }
            cell = getCell(rowIdx, colnIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) >= args.range[0]) {
                    args.range[0] = rowIdx;
                    args.range[0] = rowIdx + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && colnIdx + (cell.colSpan - 1) >= args.range[1]) {
                    args.range[1] = colnIdx;
                    args.range[1] = colnIdx + (cell.colSpan - 1);
                }
            }
        }
        var colIdx = args.range[3];
        if (args.skipChecking) {
            return;
        }
        for (var i = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                colIdx = i;
                rowIdx = args.range[2];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                    if (rowIdx < args.range[2]) {
                        args.range[2] = rowIdx;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                    if (colIdx < args.range[3]) {
                        args.range[3] = colIdx;
                    }
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rowIdx;
                        args.range[0] = rowIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx;
                        args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                }
            }
        }
        colIdx = args.range[3];
        for (var i = args.range[3]; i <= args.range[1]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                colIdx = i;
                rowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    colIdx += cell.colSpan;
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rowIdx += cell.rowSpan;
                }
                cell = getCell(rowIdx, colIdx, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && colIdx + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = colIdx;
                        args.range[1] = colIdx + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && rowIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rowIdx;
                        args.range[0] = rowIdx + (cell.rowSpan - 1);
                    }
                }
            }
        }
        var cellIndex;
        var rIdx;
        for (var i = args.range[2]; i <= args.range[0]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rIdx = i;
                cellIndex = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIdx += cell.rowSpan;
                    if (rIdx < args.range[2]) {
                        args.range[2] = rIdx;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIndex += cell.colSpan;
                    if (cellIndex < args.range[3]) {
                        args.range[3] = cellIndex;
                    }
                }
                cell = getCell(rIdx, cellIndex, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && rIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = rIdx;
                        args.range[0] = rIdx + (cell.rowSpan - 1);
                    }
                    if (cell.colSpan > 1 && cellIndex + (cell.colSpan - 1) > args.range[1]) {
                        args.range[1] = cellIndex;
                        args.range[1] = cellIndex + (cell.colSpan - 1);
                    }
                }
            }
        }
    };
    WorkbookMerge.prototype.reverseForward = function (args) {
        args.range = args.range;
        var sheet = this.parent.getActiveSheet();
        var rIdx = args.range[0];
        var cIdx = args.range[1];
        var cell = getCell(args.range[0], args.range[1], sheet);
        if (cell) {
            if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                rIdx += cell.rowSpan;
                if (args.range[2] >= rIdx) {
                    args.range[2] = rIdx;
                }
            }
            if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                cIdx += cell.colSpan;
            }
            cell = getCell(rIdx, cIdx, sheet);
            if (cell) {
                if (cell.rowSpan > 1 && rIdx + (cell.rowSpan - 1) >= args.range[0]) {
                    args.range[0] = rIdx;
                    args.range[0] = rIdx + (cell.rowSpan - 1);
                }
                if (cell.colSpan > 1 && cIdx + (cell.colSpan - 1) >= args.range[3]) {
                    args.range[3] = args.range[1];
                    args.range[3] = cIdx + (cell.colSpan - 1);
                }
            }
        }
        if (args.skipChecking) {
            return;
        }
        var cIndex = args.range[3];
        var rIndex;
        for (var i = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[2], i, sheet);
            if (cell) {
                rIndex = args.range[2];
                cIndex = i;
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIndex += cell.rowSpan;
                    if (rIndex < args.range[2]) {
                        args.range[2] = rIndex;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cIndex += cell.colSpan;
                    if (cIndex < args.range[1]) {
                        args.range[1] = cIndex;
                    }
                }
                cell = getCell(rIndex, cIndex, sheet);
                if (cell) {
                    if (cell.colSpan > 1 && cIndex + (cell.colSpan - 1) > args.range[3]) {
                        args.range[3] = cIndex + (cell.colSpan - 1);
                    }
                    if (cell.rowSpan > 1 && (cell.rowSpan - 1) + rIndex > args.range[0]) {
                        args.range[0] = (cell.rowSpan - 1) + rIndex;
                    }
                }
            }
        }
        var sRowIdx;
        var sColIdx;
        for (var i = args.range[1]; i <= args.range[3]; i++) {
            cell = getCell(args.range[0], i, sheet);
            if (cell) {
                sColIdx = i;
                sRowIdx = args.range[0];
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    sColIdx += cell.colSpan;
                    if (sColIdx < args.range[1]) {
                        args.range[1] = sColIdx;
                    }
                }
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    sRowIdx += cell.rowSpan;
                }
                cell = getCell(sRowIdx, sColIdx, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && sRowIdx + (cell.rowSpan - 1) > args.range[0]) {
                        args.range[0] = sRowIdx + (cell.rowSpan - 1);
                    }
                }
            }
        }
        var cellIndex;
        for (var i = args.range[2]; i <= args.range[0]; i++) {
            cell = getCell(i, args.range[3], sheet);
            if (cell) {
                rIndex = i;
                cellIndex = args.range[3];
                if (!isNullOrUndefined(cell.rowSpan) && cell.rowSpan < 0) {
                    rIndex += cell.rowSpan;
                    if (rIndex < args.range[2]) {
                        args.range[2] = rIndex;
                    }
                }
                if (!isNullOrUndefined(cell.colSpan) && cell.colSpan < 0) {
                    cellIndex += cell.colSpan;
                    if (cellIndex < args.range[1]) {
                        args.range[1] = cellIndex;
                    }
                }
                cell = getCell(rIndex, cellIndex, sheet);
                if (cell) {
                    if (cell.rowSpan > 1 && (cell.rowSpan - 1) + rIndex > args.range[0]) {
                        args.range[0] = (cell.rowSpan - 1) + rIndex;
                    }
                    if (cell.colSpan > 1 && (cell.colSpan - 1) + cellIndex > args.range[3]) {
                        args.range[3] = cellIndex;
                        args.range[3] = (cell.colSpan - 1) + cellIndex;
                    }
                }
            }
        }
    };
    WorkbookMerge.prototype.insertHandler = function (args) {
        this.activeCellRange(args);
        args.range = args.range;
        if (args.insertModel === 'Row') {
            args.range[2] += args.insertCount;
        }
        else {
            args.range[3] += args.insertCount;
        }
        args.preventRefresh = true;
        args.merge = true;
        this.mergeAll(args);
    };
    WorkbookMerge.prototype.pasteHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var cell;
        var nextCell;
        var prevCell;
        var activeCell = getCellIndexes(sheet.activeCell);
        for (var i = args.range[0], l = 0; i <= args.range[2]; i++, l++) {
            for (var j = args.range[1], k = 0; j <= args.range[3]; j++, k++) {
                cell = getCell(i, j, args.prevSheet) || {};
                if (cell.rowSpan > 1) {
                    prevCell = getCell(activeCell[0] + (cell.rowSpan - 1), activeCell[1], sheet) || {};
                    nextCell = getCell(activeCell[0] + 1, activeCell[1], sheet) || {};
                    if ((prevCell.colSpan !== undefined && prevCell.colSpan < 0) || (nextCell.colSpan !== undefined &&
                        nextCell.colSpan < 0)) {
                        args.cancel = true;
                        this.parent.notify(applyMerge, { showDialog: true });
                        return;
                    }
                }
                if (cell.colSpan > 1) {
                    prevCell = getCell(activeCell[0], activeCell[1] + (cell.colSpan - 1), sheet) || {};
                    nextCell = getCell(activeCell[0], activeCell[1] + 1, sheet) || {};
                    if ((prevCell.rowSpan !== undefined && prevCell.rowSpan < 0) || (nextCell.rowSpan !== undefined &&
                        nextCell.rowSpan < 0)) {
                        args.cancel = true;
                        this.parent.notify(applyMerge, { showDialog: true });
                        return;
                    }
                }
            }
        }
    };
    WorkbookMerge.prototype.addEventListener = function () {
        this.parent.on(setMerge, this.merge, this);
        this.parent.on(mergedRange, this.mergedRange, this);
        this.parent.on(activeCellMergedRange, this.activeCellRange, this);
        this.parent.on(insertMerge, this.insertHandler, this);
        this.parent.on(pasteMerge, this.pasteHandler, this);
    };
    /**
     * Destroy workbook merge module.
     */
    WorkbookMerge.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookMerge.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setMerge, this.merge);
            this.parent.off(mergedRange, this.mergedRange);
            this.parent.off(activeCellMergedRange, this.activeCellRange);
            this.parent.off(insertMerge, this.insertHandler);
            this.parent.off(pasteMerge, this.pasteHandler);
        }
    };
    /**
     * Get the workbook merge module name.
     */
    WorkbookMerge.prototype.getModuleName = function () {
        return 'workbookmerge';
    };
    return WorkbookMerge;
}());
export { WorkbookMerge };
