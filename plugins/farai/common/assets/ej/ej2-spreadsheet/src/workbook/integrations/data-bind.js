import { DataManager, Query, Deferred } from '@syncfusion/ej2-data';
import { getCell, setCell } from '../base/index';
import { getRangeIndexes, checkIsFormula, updateSheetFromDataSource, checkDateFormat, dataSourceChanged } from '../common/index';
import { getCellIndexes, dataChanged, getCellAddress } from '../common/index';
import { getFormatFromType } from './number-format';
/**
 * Data binding module
 */
var DataBind = /** @class */ (function () {
    function DataBind(parent) {
        this.parent = parent;
        this.requestedInfo = [];
        this.addEventListener();
    }
    DataBind.prototype.addEventListener = function () {
        this.parent.on(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler, this);
        this.parent.on(dataSourceChanged, this.dataSourceChangedHandler, this);
        this.parent.on(dataChanged, this.dataChangedHandler, this);
    };
    DataBind.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler);
            this.parent.off(dataSourceChanged, this.dataSourceChangedHandler);
            this.parent.off(dataChanged, this.dataChangedHandler);
        }
    };
    /**
     * Update given data source to sheet.
     */
    // tslint:disable-next-line
    DataBind.prototype.updateSheetFromDataSourceHandler = function (args) {
        var _this = this;
        var cell;
        var flds;
        var sCellIdx;
        var result;
        var remoteUrl;
        var isLocal;
        var dataManager;
        var requestedRange = [];
        var sRanges = [];
        var rowIdx;
        var deferred = new Deferred();
        var sRowIdx;
        var sColIdx;
        var loadedInfo;
        args.promise = deferred.promise;
        if (args.sheet && args.sheet.ranges.length) {
            var _loop_1 = function (k) {
                var sRange = args.indexes[0];
                var eRange = args.indexes[2];
                var range = args.sheet.ranges[k];
                sRowIdx = getRangeIndexes(range.startCell)[0];
                dataManager = range.dataSource instanceof DataManager ? range.dataSource
                    : range.dataSource ? new DataManager(range.dataSource) : new DataManager();
                remoteUrl = remoteUrl || dataManager.dataSource.url;
                args.sheet.isLocalData = isLocal || !dataManager.dataSource.url;
                if (sRowIdx <= sRange) {
                    sRange = sRange - sRowIdx;
                }
                else {
                    if (sRowIdx <= eRange) {
                        eRange = eRange - sRowIdx;
                        sRange = 0;
                    }
                    else {
                        sRange = -1;
                    }
                }
                if (range.showFieldAsHeader && sRange !== 0) {
                    sRange -= 1;
                }
                var isEndReached = false;
                var insertRowCount = 0;
                this_1.initRangeInfo(range);
                var count = this_1.getMaxCount(range);
                loadedInfo = this_1.getLoadedInfo(sRange, eRange, range);
                sRange = loadedInfo.unloadedRange[0];
                eRange = loadedInfo.unloadedRange[1];
                if (range.info.insertRowRange) {
                    range.info.insertRowRange.forEach(function (range) {
                        insertRowCount += ((range[1] - range[0]) + 1);
                    });
                    sRange -= insertRowCount;
                    eRange -= insertRowCount;
                }
                if (sRange > count) {
                    isEndReached = true;
                }
                else if (eRange > count) {
                    eRange = count;
                }
                this_1.requestedInfo.push({ deferred: deferred, indexes: args.indexes, isNotLoaded: loadedInfo.isNotLoaded });
                if (sRange >= 0 && loadedInfo.isNotLoaded && !isEndReached) {
                    sRanges[k] = sRange;
                    requestedRange[k] = false;
                    var query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then(function (e) {
                        if (!_this.parent || _this.parent.isDestroyed) {
                            return;
                        }
                        result = (e.result && e.result.result ? e.result.result : e.result);
                        sCellIdx = getRangeIndexes(range.startCell);
                        sRowIdx = sCellIdx[0];
                        sColIdx = sCellIdx[1];
                        if (result.length) {
                            if (!range.info.count) {
                                count = e.count;
                                range.info.count = e.count;
                            }
                            flds = Object.keys(result[0]);
                            if (!range.info.fldLen) {
                                range.info.fldLen = flds.length;
                                range.info.flds = flds;
                            }
                            if (range.info.insertColumnRange) {
                                var insertCount_1 = 0;
                                range.info.insertColumnRange.forEach(function (insertRange) {
                                    for (var i = insertRange[0]; i <= insertRange[1]; i++) {
                                        i <= sColIdx ? flds.splice(0, 0, "emptyCell" + insertCount_1) : flds.splice(i - sColIdx, 0, "emptyCell" + insertCount_1);
                                        insertCount_1++;
                                    }
                                });
                            }
                            if (sRanges[k] === 0 && range.showFieldAsHeader) {
                                rowIdx = sRowIdx + sRanges[k] + insertRowCount;
                                flds.forEach(function (field, i) {
                                    cell = getCell(rowIdx, sColIdx + i, args.sheet, true);
                                    if (!cell) {
                                        args.sheet.rows[sRowIdx + sRanges[k]].cells[sColIdx + i] = field.includes('emptyCell') ? {}
                                            : { value: field };
                                    }
                                    else if (!cell.value && !field.includes('emptyCell')) {
                                        cell.value = field;
                                    }
                                });
                            }
                            result.forEach(function (item, i) {
                                rowIdx = sRowIdx + sRanges[k] + i + (range.showFieldAsHeader ? 1 : 0) + insertRowCount;
                                for (var j = 0; j < flds.length; j++) {
                                    cell = getCell(rowIdx, sColIdx + j, args.sheet, true);
                                    if (cell) {
                                        if (!cell.value && !flds[j].includes('emptyCell')) {
                                            setCell(rowIdx, sColIdx + j, args.sheet, _this.getCellDataFromProp(item[flds[j]]), true);
                                        }
                                    }
                                    else {
                                        args.sheet.rows[rowIdx].cells[sColIdx + j] =
                                            flds[j].includes('emptyCell') ? {} : _this.getCellDataFromProp(item[flds[j]]);
                                    }
                                    _this.checkDataForFormat({
                                        args: args, cell: cell, colIndex: sColIdx + j, rowIndex: rowIdx, i: i, j: j, k: k,
                                        range: range, sRanges: sRanges, value: item[flds[j]]
                                    });
                                }
                            });
                        }
                        else {
                            flds = [];
                        }
                        args.sheet.usedRange.rowIndex = Math.max((sRowIdx + (count || e.count) + (range.showFieldAsHeader ? 1 : 0) + insertRowCount) - 1, args.sheet.usedRange.rowIndex);
                        args.sheet.usedRange.colIndex = Math.max(sColIdx + flds.length - 1, args.sheet.usedRange.colIndex);
                        if (insertRowCount) {
                            loadedInfo = _this.getLoadedInfo(sRange, eRange, range);
                            sRange = loadedInfo.unloadedRange[0];
                            eRange = loadedInfo.unloadedRange[1];
                            if (sRange > count) {
                                loadedInfo.isNotLoaded = false;
                            }
                            if (loadedInfo.isNotLoaded) {
                                if (eRange > count) {
                                    eRange = count;
                                }
                                range.info.loadedRange.push([sRange, eRange]);
                            }
                        }
                        else {
                            range.info.loadedRange.push([sRange, eRange]);
                        }
                        requestedRange[k] = true;
                        if (requestedRange.indexOf(false) === -1) {
                            if (eRange + sRowIdx < sRowIdx + range.info.count) {
                                if (!args.rangeSettingCount) {
                                    args.rangeSettingCount = [];
                                }
                                args.rangeSettingCount.push(k);
                                //if (remoteUrl) {
                                var unloadedArgs = {
                                    sheet: args.sheet, indexes: [0, 0, args.sheet.usedRange.rowIndex, args.sheet.usedRange.colIndex],
                                    promise: new Promise(function (resolve, reject) { resolve((function () { })()); }),
                                    rangeSettingCount: args.rangeSettingCount
                                };
                                _this.updateSheetFromDataSourceHandler(unloadedArgs);
                                unloadedArgs.promise.then(function () {
                                    if (_this.parent.getModuleName() === 'workbook') {
                                        return;
                                    }
                                    args.rangeSettingCount.pop();
                                    if (!args.rangeSettingCount.length) {
                                        _this.parent.notify('created', null);
                                    }
                                });
                                //}
                            }
                            _this.checkResolve(args.indexes);
                        }
                    });
                }
                else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    this_1.checkResolve(args.indexes);
                }
            };
            var this_1 = this;
            for (var k = args.sheet.ranges.length - 1; k >= 0; k--) {
                _loop_1(k);
            }
        }
        else {
            deferred.resolve();
        }
    };
    DataBind.prototype.checkResolve = function (indexes) {
        var resolved;
        var isSameRng;
        var cnt = 0;
        this.requestedInfo.forEach(function (info, idx) {
            isSameRng = JSON.stringify(info.indexes) === JSON.stringify(indexes);
            if (isSameRng || resolved) {
                if (idx === 0) {
                    info.deferred.resolve();
                    cnt++;
                    resolved = true;
                }
                else {
                    if (resolved && (info.isLoaded || !info.isNotLoaded)) {
                        info.deferred.resolve();
                        cnt++;
                    }
                    else if (isSameRng && resolved) {
                        info.deferred.resolve();
                        cnt++;
                    }
                    else if (isSameRng) {
                        info.isLoaded = true;
                    }
                    else {
                        resolved = false;
                    }
                }
            }
        });
        this.requestedInfo.splice(0, cnt);
    };
    DataBind.prototype.getCellDataFromProp = function (prop) {
        var data = {};
        if (Object.prototype.toString.call(prop) === '[object Object]') {
            if (prop.formula) {
                data.formula = prop.formula;
            }
            else if (prop.value) {
                if (typeof (prop.value) === 'string') {
                    if (prop.value.indexOf('http://') === 0 || prop.value.indexOf('https://') === 0 ||
                        prop.value.indexOf('ftp://') === 0 || prop.value.indexOf('www.') === 0) {
                        data.hyperlink = prop.value;
                    }
                    else {
                        data.value = prop.value;
                    }
                }
                else {
                    data.value = prop.value;
                }
            }
        }
        else {
            if (checkIsFormula(prop)) {
                data.formula = prop;
            }
            else {
                if (typeof (prop) === 'string') {
                    if (prop.indexOf('http://') === 0 || prop.indexOf('https://') === 0 ||
                        prop.indexOf('ftp://') === 0 || prop.indexOf('www.') === 0) {
                        data.hyperlink = prop;
                    }
                    else {
                        data.value = prop;
                    }
                }
                else {
                    data.value = prop;
                }
            }
        }
        return data;
    };
    DataBind.prototype.checkDataForFormat = function (args) {
        if (args.value !== '') {
            var dateEventArgs = {
                value: args.value,
                rowIndex: args.rowIndex,
                colIndex: args.colIndex,
                isDate: false,
                updatedVal: args.value,
                isTime: false
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (dateEventArgs.isDate) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('ShortDate');
                    args.cell.value = dateEventArgs.updatedVal;
                }
                else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('ShortDate');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = dateEventArgs.updatedVal;
                }
            }
            else if (dateEventArgs.isTime) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('Time');
                    args.cell.value = dateEventArgs.updatedVal;
                }
                else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('Time');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = dateEventArgs.updatedVal;
                }
            }
        }
    };
    DataBind.prototype.getLoadedInfo = function (sRange, eRange, range) {
        var isNotLoaded = true;
        range.info.loadedRange.forEach(function (range) {
            if (range[0] <= sRange && sRange <= range[1]) {
                if (range[0] <= eRange && eRange <= range[1]) {
                    isNotLoaded = false;
                }
                else {
                    sRange = range[1] + 1;
                }
            }
            else if (range[0] <= eRange && eRange <= range[1]) {
                eRange = range[0] - 1;
            }
        });
        return { isNotLoaded: isNotLoaded, unloadedRange: [sRange, eRange] };
    };
    DataBind.prototype.getMaxCount = function (range) {
        if (range.query) {
            var query = range.query.queries;
            for (var i = 0; i < query.length; i++) {
                if (query[i].fn === 'onTake') {
                    return Math.min(query[i].e.nos, range.info.count || query[i].e.nos);
                }
            }
        }
        return range.info.count;
    };
    DataBind.prototype.initRangeInfo = function (range) {
        if (!range.info) {
            range.info = { loadedRange: [] };
        }
    };
    /**
     * Remove old data from sheet.
     */
    DataBind.prototype.dataSourceChangedHandler = function (args) {
        var _this = this;
        var row;
        var sheet = this.parent.sheets[args.sheetIdx];
        var range = sheet.ranges[args.rangeIdx];
        if (range && (this.checkRangeHasChanges(sheet, args.rangeIdx) || !range.info)) {
            var showFieldAsHeader_1 = range.showFieldAsHeader;
            var indexes_1 = getCellIndexes(range.startCell);
            if (range.info) {
                range.info.loadedRange.forEach(function (loadedRange) {
                    for (var i = loadedRange[0]; i <= loadedRange[1] && (i < range.info.count + (showFieldAsHeader_1 ? 1 : 0)); i++) {
                        row = sheet.rows[i + indexes_1[0]];
                        if (row) {
                            for (var j = indexes_1[1]; j < indexes_1[1] + range.info.fldLen; j++) {
                                if (row.cells && row.cells[i]) {
                                    delete row.cells[j];
                                }
                            }
                        }
                    }
                });
                range.info = null;
            }
            var viewport = this.parent.viewport;
            var refreshRange_1 = [viewport.topIndex, viewport.leftIndex, viewport.bottomIndex, viewport.rightIndex];
            var args_1 = {
                sheet: sheet, indexes: refreshRange_1, promise: new Promise(function (resolve, reject) { resolve((function () { })()); })
            };
            this.updateSheetFromDataSourceHandler(args_1);
            args_1.promise.then(function () {
                _this.parent.notify('updateView', { indexes: refreshRange_1 });
            });
        }
    };
    DataBind.prototype.checkRangeHasChanges = function (sheet, rangeIdx) {
        if (this.parent.isAngular) {
            var changedRangeIdx = 'changedRangeIdx';
            if (sheet[changedRangeIdx] === parseInt(rangeIdx, 10)) {
                delete sheet[changedRangeIdx];
                return true;
            }
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Triggers dataSourceChange event when cell data changes
     */
    DataBind.prototype.dataChangedHandler = function (args) {
        var _this = this;
        var changedData = [{}];
        var action;
        var cell;
        var dataRange;
        var startCell;
        var inRange;
        var deleteRowDetails;
        var sheetIdx = this.parent.activeSheetIndex;
        var sheet = this.parent.sheets[sheetIdx];
        var cellIndices;
        sheet.ranges.forEach(function (range, idx) {
            if (range.dataSource) {
                var isNewRow = void 0;
                startCell = getCellIndexes(range.startCell);
                dataRange = startCell.concat([startCell[0] + range.info.count + (range.showFieldAsHeader ? 0 : -1),
                    startCell[1] + range.info.fldLen - 1]);
                if (args.modelType === 'Row') {
                    if (args.insertType) {
                        inRange = ((!range.showFieldAsHeader && args.insertType === 'above') ? dataRange[0] <= args.index
                            : dataRange[0] < args.index) && dataRange[2] >= args.index;
                        cellIndices = [args.index];
                        if (!inRange) {
                            if ((dataRange[2] + 1 === args.index && args.insertType === 'below')) {
                                isNewRow = true;
                                range.info.count += args.model.length;
                            }
                            else if (dataRange[0] >= args.index) {
                                range.startCell = getCellAddress(startCell[0] + args.model.length, startCell[1]);
                            }
                        }
                        else {
                            isNewRow = true;
                            range.info.count += args.model.length;
                        }
                    }
                    else {
                        inRange = dataRange[0] <= args.startIndex && dataRange[2] >= args.startIndex;
                        action = 'delete';
                    }
                }
                else {
                    cellIndices = getCellIndexes(args.sheetIdx > -1 ? args.address : args.address.split('!')[1]);
                    inRange = ((range.showFieldAsHeader ? dataRange[0] + 1 : dataRange[0]) <= cellIndices[0])
                        && dataRange[2] >= cellIndices[0] && dataRange[1] <= cellIndices[1] && dataRange[3] >= cellIndices[1];
                }
                if (inRange || isNewRow) {
                    if (args.modelType === 'Row' && !args.insertType) {
                        args.deletedModel.forEach(function (row, rowIdx) {
                            changedData[rowIdx] = {};
                            range.info.flds.forEach(function (fld, idx) {
                                if (row.cells) {
                                    cell = row.cells[startCell[1] + idx];
                                    changedData[rowIdx][fld] = (cell && cell.value) || null;
                                }
                                else {
                                    changedData[rowIdx][fld] = null;
                                }
                            });
                            range.info.count -= 1;
                        });
                        deleteRowDetails = { count: args.deletedModel.length, index: args.endIndex };
                    }
                    else {
                        action = isNewRow ? 'add' : 'edit';
                        var _loop_2 = function (i) {
                            changedData[i] = {};
                            range.info.flds.forEach(function (fld, idx) {
                                cell = getCell(cellIndices[0], startCell[1] + idx, sheet);
                                changedData[i][fld] = (cell && cell.value) || null;
                            });
                        };
                        for (var i = 0; i < (isNewRow ? args.model.length : 1); i++) {
                            _loop_2(i);
                        }
                    }
                    _this.parent.trigger('dataSourceChanged', { data: changedData, action: action, rangeIndex: idx, sheetIndex: sheetIdx });
                }
                else if (deleteRowDetails && deleteRowDetails.count && dataRange[0] > deleteRowDetails.index) {
                    range.startCell = getCellAddress(startCell[0] - deleteRowDetails.count, startCell[1]);
                }
            }
        });
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    DataBind.prototype.getModuleName = function () {
        return 'dataBind';
    };
    /**
     * Destroys the Data binding module.
     * @return {void}
     */
    DataBind.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        this.requestedInfo = [];
    };
    return DataBind;
}());
export { DataBind };
