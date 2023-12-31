import { Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { isGroupAdaptive } from '../base/util';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
/**
 * Content module is used to render grid content
 */
var VirtualRowModelGenerator = /** @class */ (function () {
    function VirtualRowModelGenerator(parent) {
        this.cOffsets = {};
        this.cache = {};
        this.movableCache = {};
        this.frozenRightCache = {};
        this.rowCache = {};
        this.data = {};
        this.groups = {};
        this.parent = parent;
        this.model = this.parent.pageSettings;
        this.rowModelGenerator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }
    // tslint:disable-next-line:max-func-body-length
    VirtualRowModelGenerator.prototype.generateRows = function (data, e) {
        var isFrozen = this.parent.isFrozenGrid();
        var info = e.virtualInfo = e.virtualInfo || this.getData();
        var xAxis = info.sentinelInfo && info.sentinelInfo.axis === 'X';
        var page = !xAxis && info.loadNext && !info.loadSelf ? info.nextInfo.page : info.page;
        var result = [];
        var center = ~~(this.model.pageSize / 2);
        var indexes = this.getBlockIndexes(page);
        var loadedBlocks = [];
        if ((isFrozen && (this.parent.getTablesCount() === 2 && !e.renderMovableContent)
            || this.parent.getTablesCount() === 3 && !e.renderMovableContent && !e.renderFrozenRightContent) || !isFrozen) {
            this.checkAndResetCache(e.requestType);
        }
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length) {
            return result = this.parent.vcRows;
        }
        if (this.parent.enableColumnVirtualization) {
            for (var i = 0; i < info.blockIndexes.length; i++) {
                if (this.isBlockAvailable(info.blockIndexes[i])) {
                    this.cache[info.blockIndexes[i]] = this.rowModelGenerator.refreshRows(this.cache[info.blockIndexes[i]]);
                }
                if ((e.renderMovableContent && this.isMovableBlockAvailable(info.blockIndexes[i]))
                    || (e.renderFrozenRightContent && this.isFrozenRightBlockAvailable(info.blockIndexes[i]))) {
                    var cache = e.renderMovableContent
                        ? this.movableCache : this.frozenRightCache;
                    cache[info.blockIndexes[i]] = this.rowModelGenerator.refreshRows(cache[info.blockIndexes[i]]);
                }
            }
        }
        if (isBlazor() && this.parent.isServerRendered) {
            var virtualStartIdx = 'virtualStartIndex';
            var startIndex = 'startIndex';
            var endIndex = 'endIndex';
            if (!e[virtualStartIdx] && Object.keys(this.rowCache).length === 0) {
                for (var i = 0; i < data.length; i++) {
                    var args = [];
                    args.push(data[i]);
                    this.rowCache[i] = this.rowModelGenerator.generateRows(args, { startIndex: i })[0];
                }
                var j = 0;
                for (var i = 0; i < this.parent.pageSettings.pageSize; i++) {
                    result[j] = this.rowCache[i];
                    j++;
                }
            }
            else if (e[virtualStartIdx]) {
                var virtualStartIndex = e[startIndex];
                var cacheindex = [];
                for (var i = 0; i < Object.keys(this.rowCache).length; i++) {
                    cacheindex.push(Number(Object.keys(this.rowCache)[i]));
                }
                for (var i = 0; i < data.length; i++) {
                    var args = [];
                    var check = cacheindex.indexOf(virtualStartIndex);
                    args.push(data[i]);
                    if (check === -1) {
                        this.rowCache[virtualStartIndex] = this.rowModelGenerator.generateRows(args, { startIndex: virtualStartIndex })[0];
                    }
                    virtualStartIndex++;
                }
            }
            if (!isNullOrUndefined(e[virtualStartIdx])) {
                var j = 0;
                for (var i = e[startIndex]; i < e[endIndex]; i++) {
                    result[j] = this.rowCache[i];
                    j++;
                }
            }
        }
        else {
            var values = info.blockIndexes;
            for (var i = 0; i < values.length; i++) {
                if (!this.isBlockAvailable(values[i])) {
                    var rows = this.rowModelGenerator.generateRows(data, {
                        virtualInfo: info, startIndex: this.getStartIndex(values[i], data)
                    });
                    if (isGroupAdaptive(this.parent) && !this.parent.vcRows.length) {
                        this.parent.vRows = rows;
                        this.parent.vcRows = rows;
                    }
                    var median = void 0;
                    if (isGroupAdaptive(this.parent)) {
                        median = this.model.pageSize / 2;
                        if (!this.isBlockAvailable(indexes[0])) {
                            this.cache[indexes[0]] = rows.slice(0, median);
                        }
                        if (!this.isBlockAvailable(indexes[1])) {
                            this.cache[indexes[1]] = rows.slice(median, this.model.pageSize);
                        }
                    }
                    else {
                        median = ~~Math.max(rows.length, this.model.pageSize) / 2;
                        if (!this.isBlockAvailable(indexes[0])) {
                            this.cache[indexes[0]] = rows.slice(0, median);
                        }
                        if (!this.isBlockAvailable(indexes[1])) {
                            this.cache[indexes[1]] = rows.slice(median);
                        }
                    }
                }
                if (this.parent.groupSettings.columns.length && !xAxis && this.cache[values[i]]) {
                    this.cache[values[i]] = this.updateGroupRow(this.cache[values[i]], values[i]);
                }
                if ((e.renderMovableContent && !this.isMovableBlockAvailable(values[i]))
                    || (e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(values[i]))) {
                    var cache = e.renderMovableContent
                        ? this.movableCache : this.frozenRightCache;
                    var rows = this.rowModelGenerator.generateRows(data, {
                        virtualInfo: info, startIndex: this.getStartIndex(values[i], data)
                    });
                    var median = ~~Math.max(rows.length, this.model.pageSize) / 2;
                    if ((e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(indexes[0]))
                        || (e.renderMovableContent && !this.isMovableBlockAvailable(indexes[0]))) {
                        cache[indexes[0]] = rows.slice(0, median);
                    }
                    if ((e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(indexes[1]))
                        || (e.renderMovableContent && !this.isMovableBlockAvailable(indexes[1]))) {
                        cache[indexes[1]] = rows.slice(median);
                    }
                }
                if (!e.renderMovableContent && !e.renderFrozenRightContent && this.cache[values[i]]) {
                    result.push.apply(result, this.cache[values[i]]);
                }
                else {
                    var cache = e.renderMovableContent
                        ? this.movableCache : this.frozenRightCache;
                    if (cache[values[i]]) {
                        result.push.apply(result, cache[values[i]]);
                    }
                }
                if (this.isBlockAvailable(values[i])) {
                    loadedBlocks.push(values[i]);
                }
            }
            info.blockIndexes = loadedBlocks;
        }
        if (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) {
            var grouping = 'records';
            if (this.parent.allowGrouping) {
                this.parent.currentViewData[grouping] = result.map(function (m) { return m.data; });
            }
            else if (isFrozen) {
                if ((e.renderMovableContent && (this.parent.getFrozenMode() === 'Left'
                    || this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenColumns())) || e.renderFrozenRightContent) {
                    this.parent.currentViewData = result.map(function (m) { return m.data; });
                }
            }
            else {
                this.parent.currentViewData = result.map(function (m) { return m.data; });
            }
        }
        return result;
    };
    VirtualRowModelGenerator.prototype.getBlockIndexes = function (page) {
        return [page + (page - 1), page * 2];
    };
    VirtualRowModelGenerator.prototype.getPage = function (block) {
        return block % 2 === 0 ? block / 2 : (block + 1) / 2;
    };
    VirtualRowModelGenerator.prototype.isBlockAvailable = function (value) {
        return value in this.cache;
    };
    VirtualRowModelGenerator.prototype.isMovableBlockAvailable = function (value) {
        return value in this.movableCache;
    };
    VirtualRowModelGenerator.prototype.isFrozenRightBlockAvailable = function (value) {
        return value in this.frozenRightCache;
    };
    VirtualRowModelGenerator.prototype.getData = function () {
        return {
            page: this.model.currentPage,
            blockIndexes: this.getBlockIndexes(this.model.currentPage),
            direction: 'down',
            columnIndexes: this.parent.getColumnIndexesInView()
        };
    };
    VirtualRowModelGenerator.prototype.getStartIndex = function (blk, data, full) {
        if (full === void 0) { full = true; }
        var page = this.getPage(blk);
        var even = blk % 2 === 0;
        var index = (page - 1) * this.model.pageSize;
        return full || !even ? index : index + ~~(this.model.pageSize / 2);
    };
    VirtualRowModelGenerator.prototype.getColumnIndexes = function (content) {
        var _this = this;
        if (content === void 0) { content = this.parent.getHeaderContent().querySelector('.e-headercontent'); }
        if (this.parent.isFrozenGrid()) {
            content = content.querySelector('.e-movableheader');
        }
        var indexes = [];
        var sLeft = content.scrollLeft | 0;
        var keys = Object.keys(this.cOffsets);
        var cWidth = content.getBoundingClientRect().width;
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft);
        var calWidth = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        var left = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some(function (offset, indx, input) {
            var iOffset = Number(offset);
            var offsetVal = _this.cOffsets[offset];
            var border = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        if (isBlazor() && this.parent.isServerRendered) {
            this.parent.contentModule.startColIndex = indexes[0];
            this.parent.contentModule.endColIndex = indexes[indexes.length - 1];
        }
        this.addFrozenIndex(indexes);
        return indexes;
    };
    VirtualRowModelGenerator.prototype.addFrozenIndex = function (indexes) {
        if (this.parent.getFrozenColumns() && this.parent.enableColumnVirtualization && indexes[0] === 0) {
            for (var i = 0; i < this.parent.getFrozenColumns(); i++) {
                indexes.push(indexes[indexes.length - 1] + 1);
            }
        }
    };
    VirtualRowModelGenerator.prototype.checkAndResetCache = function (action) {
        var actions = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
            'save', 'delete'];
        if (this.parent.getFrozenColumns() && this.parent.frozenRows && this.parent.enableColumnVirtualization && action === 'reorder') {
            actions.splice(actions.indexOf(action), 1);
        }
        var clear = actions.some(function (value) { return action === value; });
        if (clear) {
            this.cache = {};
            this.data = {};
            this.groups = {};
            this.movableCache = {};
            this.frozenRightCache = {};
        }
        return clear;
    };
    VirtualRowModelGenerator.prototype.refreshColOffsets = function () {
        var _this = this;
        var col = 0;
        this.cOffsets = {};
        var gLen = this.parent.groupSettings.columns.length;
        var cols = this.parent.columns;
        var cLen = cols.length;
        var isVisible = function (column) { return column.visible &&
            (!_this.parent.groupSettings.showGroupedColumn ? _this.parent.groupSettings.columns.indexOf(column.field) < 0 : column.visible); };
        var c = this.parent.groupSettings.columns;
        for (var i = 0; i < c.length; i++) {
            this.cOffsets[i] = (this.cOffsets[i - 1] | 0) + 30;
        }
        var blocks = Array.apply(null, Array(cLen)).map(function () { return col++; });
        for (var j = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j] + gLen;
            this.cOffsets[blocks[j]] = (this.cOffsets[blocks[j] - 1] | 0) + (isVisible(cols[j]) ? parseInt(cols[j].width, 10) : 0);
        }
    };
    VirtualRowModelGenerator.prototype.updateGroupRow = function (current, block) {
        var currentFirst = current[0];
        var rows = [];
        var keys = Object.keys(this.cache);
        for (var i = 0; i < keys.length; i++) {
            if (Number(keys[i]) < block) {
                rows = rows.concat(this.cache[keys[i]]);
            }
        }
        if ((currentFirst && currentFirst.isDataRow) || block % 2 === 0) {
            return current;
        }
        return this.iterateGroup(current, rows);
    };
    VirtualRowModelGenerator.prototype.iterateGroup = function (current, rows) {
        var currentFirst = current[0];
        var offset = 0;
        if (currentFirst && currentFirst.isDataRow) {
            return current;
        }
        var isPresent = current.some(function (row) {
            return rows.some(function (oRow, index) {
                var res = oRow && oRow.data.field !== undefined && oRow.data.field === row.data.field &&
                    oRow.data.key === row.data.key;
                if (res) {
                    offset = index;
                }
                return res;
            });
        });
        if (isPresent) {
            current.shift();
            current = this.iterateGroup(current, rows.slice(offset));
        }
        return current;
    };
    VirtualRowModelGenerator.prototype.getRows = function () {
        var rows = [];
        var isBlazorServerRendered = isBlazor() && this.parent.isServerRendered ? true : false;
        var keys = isBlazorServerRendered ? Object.keys(this.rowCache) : Object.keys(this.cache);
        for (var i = 0; i < keys.length; i++) {
            rows = isBlazorServerRendered ? rows.concat(this.rowCache[keys[i]]) : rows.concat(this.cache[keys[i]]);
        }
        return rows;
    };
    return VirtualRowModelGenerator;
}());
export { VirtualRowModelGenerator };
