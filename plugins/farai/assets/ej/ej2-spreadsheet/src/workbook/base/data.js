import { getSheetNameFromAddress, getSheetIndex, getSheet } from '../base/index';
import { getCellAddress, getIndexesFromAddress, getColumnHeaderText, updateSheetFromDataSource, checkDateFormat } from '../common/index';
import { queryCellInfo, cFDelete } from '../common/index';
import { getRow, getCell, isHiddenRow, isHiddenCol, getMaxSheetId, getSheetNameCount } from './index';
import { isUndefined, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setCell } from './cell';
/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
export function getData(context, address, columnWiseData, valueOnly) {
    return new Promise(function (resolve, reject) {
        resolve((function () {
            var i;
            var cell;
            var row;
            var data = new Map();
            var sheetIdx = getSheetIndex(context, getSheetNameFromAddress(address));
            var sheet = getSheet(context, sheetIdx);
            var indexes = getIndexesFromAddress(address);
            var sRow = indexes[0];
            var index = 0;
            var args = {
                sheet: sheet, indexes: indexes, promise: new Promise(function (resolve, reject) { resolve((function () { })()); })
            };
            context.notify(updateSheetFromDataSource, args);
            return args.promise.then(function () {
                while (sRow <= indexes[2]) {
                    var cells = {};
                    row = getRow(sheet, sRow);
                    i = indexes[1];
                    while (i <= indexes[3]) {
                        if (columnWiseData) {
                            if (data instanceof Map) {
                                data = [];
                            }
                            var key = getColumnHeaderText(i + 1);
                            var rowKey = '__rowIndex';
                            if (valueOnly) {
                                cells[key] = row ? getValueFromFormat(context, sRow, i, sheetIdx, sheet) : '';
                            }
                            else {
                                cells[key] = row ? getCell(sRow, i, sheet) : null;
                            }
                            if (indexes[3] < i + 1) {
                                cells[rowKey] = (sRow + 1).toString();
                            }
                            if (cells[key]) {
                                data[index.toString()] = cells;
                            }
                        }
                        else {
                            var cellObj = {};
                            Object.assign(cellObj, row ? getCell(sRow, i, sheet) : null);
                            if (cellObj.colSpan > 1 && cellObj.rowSpan > 1) {
                                var cell_1 = void 0;
                                for (var j = sRow, len = sRow + cellObj.rowSpan; j < len; j++) {
                                    for (var k = i, len_1 = i + cellObj.colSpan; k < len_1; k++) {
                                        if (j === sRow && k === i) {
                                            continue;
                                        }
                                        cell_1 = new Object();
                                        if (j !== sRow) {
                                            cell_1.rowSpan = sRow - j;
                                        }
                                        if (k !== i) {
                                            cell_1.colSpan = i - k;
                                        }
                                        if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[k]) {
                                            delete sheet.rows[j].cells[k].value;
                                            delete sheet.rows[j].cells[k].formula;
                                        }
                                        setCell(j, k, sheet, cell_1, true);
                                    }
                                }
                            }
                            else if (cellObj.colSpan > 1) {
                                for (var j = i + 1, len = i + cellObj.colSpan; j < len; j++) {
                                    setCell(sRow, j, sheet, { colSpan: i - j }, true);
                                    if (sheet.rows[sRow] && sheet.rows[sRow].cells && sheet.rows[sRow].cells[j]) {
                                        delete sheet.rows[sRow].cells[j].value;
                                        delete sheet.rows[sRow].cells[j].formula;
                                    }
                                }
                            }
                            else if (cellObj.rowSpan > 1) {
                                for (var j = sRow + 1, len = sRow + cellObj.rowSpan; j < len; j++) {
                                    setCell(j, i, sheet, { rowSpan: sRow - j }, true);
                                    if (sheet.rows[j] && sheet.rows[j].cells && sheet.rows[j].cells[i]) {
                                        delete sheet.rows[j].cells[i].value;
                                        delete sheet.rows[j].cells[i].formula;
                                    }
                                }
                            }
                            if (!valueOnly && isHiddenRow(sheet, sRow)) {
                                sRow++;
                                continue;
                            }
                            if (!valueOnly && isHiddenCol(sheet, i)) {
                                i++;
                                continue;
                            }
                            if (cellObj.style) {
                                var style = {};
                                Object.assign(style, cellObj.style);
                                cellObj.style = style;
                            }
                            var eventArgs = { cell: cellObj, address: getCellAddress(sRow, i) };
                            context.trigger(queryCellInfo, eventArgs);
                            data.set(eventArgs.address, eventArgs.cell);
                        }
                        i++;
                    }
                    sRow++;
                    index++;
                }
                return data;
            });
        })());
    });
}
function getValueFromFormat(context, rowIndex, colIndex, sheetIdx, sheet) {
    var cell = getCell(rowIndex, colIndex, sheet);
    if (cell) {
        if (cell.format) {
            var args = {
                value: context.getDisplayText(cell), rowIndex: rowIndex, colIndex: colIndex,
                sheetIndex: sheetIdx, dateObj: '', isDate: false, isTime: false
            };
            context.notify(checkDateFormat, args);
            if (args.isDate) {
                return args.dateObj;
            }
            else {
                return cell.value;
            }
        }
        else {
            return cell.value;
        }
    }
    else {
        return '';
    }
}
/**
 * @hidden
 */
export function getModel(model, idx) {
    var diff;
    var j;
    var prevIdx;
    if (isUndefined(model[idx]) || !(model[idx] && model[idx].index === idx)) {
        for (var i = 0; i <= idx; i++) {
            if (model && model[i]) {
                diff = model[i].index - i;
                if (diff > 0) {
                    model.forEach(function (value, index) {
                        if (value && value.index) {
                            prevIdx = value.index;
                            j = 1;
                        }
                        if (value && !value.index && index !== 0) {
                            value.index = prevIdx + j;
                        }
                        j++;
                    });
                    while (diff--) {
                        model.splice(i, 0, null);
                    }
                    i += diff;
                }
            }
            else if (model) {
                model[i] = null;
            }
            else {
                model = [];
            }
        }
    }
    return model[idx];
}
/**
 * @hidden
 */
export function processIdx(model, isSheet, context) {
    var j;
    var diff = 0;
    var cnt;
    var len = model.length;
    var _loop_1 = function (i) {
        if (!isNullOrUndefined(model[i]) && !isUndefined(model[i].index)) {
            cnt = diff = model[i].index - i;
            delete model[i].index;
        }
        if (diff > 0) {
            j = 0;
            while (diff--) {
                if (isSheet) {
                    context.createSheet(i + j);
                    j++;
                }
                else {
                    model.splice(i, 0, null);
                }
            }
            i += cnt;
            len += cnt;
        }
        if (isSheet) {
            if (model[i].id < 1) {
                model[i].id = getMaxSheetId(context.sheets);
            }
            if (!model[i].name) {
                context.setSheetPropertyOnMute(model[i], 'name', 'Sheet' + getSheetNameCount(context));
            }
            var cellCnt_1 = 0;
            model[i].rows.forEach(function (row) {
                cellCnt_1 = Math.max(cellCnt_1, (row && row.cells && row.cells.length - 1) || 0);
            });
            context.setSheetPropertyOnMute(model[i], 'usedRange', { rowIndex: model[i].rows.length - 1, colIndex: cellCnt_1 });
        }
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < len; i++) {
        _loop_1(i);
        i = out_i_1;
    }
}
/**
 * @hidden
 */
export function clearRange(context, address, sheetIdx, valueOnly) {
    var sheet = getSheet(context, sheetIdx);
    var range = getIndexesFromAddress(address);
    var sRIdx = range[0];
    var eRIdx = range[2];
    var sCIdx;
    var eCIdx;
    for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
        sCIdx = range[1];
        eCIdx = range[3];
        for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
            var cell = getCell(sRIdx, sCIdx, sheet);
            context.notify(cFDelete, { rowIdx: sRIdx, colIdx: sCIdx });
            if (!isNullOrUndefined(cell) && valueOnly) {
                delete cell.value;
                if (!isNullOrUndefined(cell.formula)) {
                    delete cell.formula;
                }
            }
        }
    }
}
