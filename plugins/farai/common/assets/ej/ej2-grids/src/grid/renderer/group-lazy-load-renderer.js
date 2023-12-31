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
import { extend, remove, isNullOrUndefined, setStyleAttribute, removeClass, addClass } from '@syncfusion/ej2-base';
import { ContentRender } from './content-renderer';
import * as events from '../base/constant';
import { isRowEnteredInGrid, parentsUntil } from '../base/util';
import { RowRenderer } from '../renderer/row-renderer';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { GroupModelGenerator } from '../services/group-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
/**
 * GroupLazyLoadRenderer is used to perform lazy load grouping
 * @hidden
 */
var GroupLazyLoadRenderer = /** @class */ (function (_super) {
    __extends(GroupLazyLoadRenderer, _super);
    function GroupLazyLoadRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.childCount = 0;
        _this.scrollData = [];
        _this.isFirstChildRow = false;
        _this.groupCache = {};
        _this.startIndexes = {};
        _this.captionCounts = {};
        _this.rowsByUid = {};
        _this.objIdxByUid = {};
        _this.initialGroupCaptions = {};
        _this.requestType = ['paging', 'columnstate', 'reorder', 'cancel', 'save', 'beginEdit', 'add', 'delete'];
        /** @hidden */
        _this.cacheMode = false;
        /** @hidden */
        _this.cacheBlockSize = 5;
        /** @hidden */
        _this.ignoreAccent = _this.parent.allowFiltering ? _this.parent.filterSettings.ignoreAccent : false;
        /** @hidden */
        _this.allowCaseSensitive = false;
        _this.locator = locator;
        _this.groupGenerator = new GroupModelGenerator(_this.parent);
        _this.summaryModelGen = new GroupSummaryModelGenerator(_this.parent);
        _this.captionModelGen = new CaptionSummaryModelGenerator(_this.parent);
        _this.rowRenderer = new RowRenderer(_this.locator, null, _this.parent);
        _this.eventListener();
        return _this;
    }
    GroupLazyLoadRenderer.prototype.eventListener = function () {
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.on(events.initialEnd, this.setLazyLoadPageSize, this);
        this.parent.on(events.setGroupCache, this.setCache, this);
        this.parent.on(events.lazyLoadScrollHandler, this.scrollHandler, this);
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.groupCollapse, this.collapseShortcut, this);
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.captionExpand = function (tr) {
        var _this = this;
        var page = this.parent.pageSettings.currentPage;
        var rowsObject = this.groupCache[page];
        var uid = tr.getAttribute('data-uid');
        var oriIndex = this.getRowObjectIndexByUid(uid);
        var isRowExist = rowsObject[oriIndex + 1] ? rowsObject[oriIndex].indent < rowsObject[oriIndex + 1].indent : false;
        var data = rowsObject[oriIndex];
        var key = this.getGroupKeysAndFields(oriIndex, rowsObject);
        var e = { captionRowElement: tr, groupInfo: data, enableCaching: true, cancel: false };
        this.parent.trigger(events.lazyLoadGroupExpand, e, function (args) {
            if (args.cancel) {
                return;
            }
            args.keys = key.keys;
            args.fields = key.fields;
            args.rowIndex = tr.rowIndex;
            args.makeRequest = !args.enableCaching || !isRowExist;
            if (!args.enableCaching && isRowExist) {
                _this.clearCache([uid]);
            }
            args.skip = 0;
            args.take = _this.pageSize;
            data.isExpand = _this.rowsByUid[page][data.uid].isExpand = true;
            _this.captionRowExpand(args);
        });
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.captionCollapse = function (tr) {
        var _this = this;
        var cache = this.groupCache[this.parent.pageSettings.currentPage];
        var rowIdx = tr.rowIndex;
        var uid = tr.getAttribute('data-uid');
        var captionIndex = this.getRowObjectIndexByUid(uid);
        var e = {
            captionRowElement: tr, groupInfo: cache[captionIndex], cancel: false
        };
        this.parent.trigger(events.lazyLoadGroupCollapse, e, function (args) {
            if (args.cancel) {
                return;
            }
            args.isExpand = false;
            _this.removeRows(captionIndex, rowIdx);
        });
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.setLazyLoadPageSize = function () {
        var scrollEle = this.parent.getContent().firstElementChild;
        var blockSize = Math.floor(scrollEle.offsetHeight / this.parent.getRowHeight()) - 1;
        this.pageSize = this.pageSize ? this.pageSize : blockSize * 3;
        this.blockSize = Math.ceil(this.pageSize / 2);
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.clearLazyGroupCache = function () {
        this.clearCache();
    };
    GroupLazyLoadRenderer.prototype.clearCache = function (uids) {
        uids = uids ? uids : this.getInitialCaptionIndexes();
        var cache = this.groupCache[this.parent.pageSettings.currentPage];
        if (uids.length) {
            for (var i = 0; i < uids.length; i++) {
                var capIdx = this.getRowObjectIndexByUid(uids[i]);
                var capRow = cache[capIdx];
                if (!capRow) {
                    continue;
                }
                if (this.captionCounts[this.parent.pageSettings.currentPage][capRow.uid]) {
                    for (var i_1 = capIdx + 1; i_1 < cache.length; i_1++) {
                        if (cache[i_1].indent === capRow.indent || cache[i_1].indent < capRow.indent) {
                            delete this.captionCounts[this.parent.pageSettings.currentPage][capRow.uid];
                            break;
                        }
                        if (cache[i_1].isCaptionRow) {
                            delete this.captionCounts[this.parent.pageSettings.currentPage][cache[i_1].uid];
                        }
                    }
                }
                if (capRow.isExpand) {
                    var tr = this.parent.getRowElementByUID(capRow.uid);
                    if (!tr) {
                        return;
                    }
                    this.parent.groupModule.expandCollapseRows(tr.querySelector('.e-recordplusexpand'));
                }
                var child = this.getNextChilds(capIdx);
                if (!child.length) {
                    continue;
                }
                var subChild = [];
                if (child[child.length - 1].isCaptionRow) {
                    subChild = this.getChildRowsByParentIndex(cache.indexOf(child[child.length - 1]), false, false, null, true, true);
                }
                var start = cache.indexOf(child[0]);
                var end = subChild.length ? cache.indexOf(subChild[subChild.length - 1]) : cache.indexOf(child[child.length - 1]);
                cache.splice(start, end - (start - 1));
                this.refreshCaches();
            }
        }
    };
    GroupLazyLoadRenderer.prototype.refreshCaches = function () {
        var page = this.parent.pageSettings.currentPage;
        var cache = this.groupCache[page];
        this.rowsByUid = {};
        this.objIdxByUid = {};
        for (var i = 0; i < cache.length; i++) {
            this.maintainRows(cache[i], i);
        }
    };
    GroupLazyLoadRenderer.prototype.getInitialCaptionIndexes = function () {
        var page = this.parent.pageSettings.currentPage;
        var uids = [];
        for (var i = 0; i < this.initialGroupCaptions[page].length; i++) {
            uids.push(this.initialGroupCaptions[page][i].uid);
        }
        return uids;
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getRowObjectIndexByUid = function (uid) {
        return this.objIdxByUid[this.parent.pageSettings.currentPage][uid];
    };
    GroupLazyLoadRenderer.prototype.collapseShortcut = function (args) {
        if (this.parent.groupSettings.columns.length &&
            args.target && parentsUntil(args.target, 'e-content') && args.target.parentElement.tagName === 'TR') {
            if (!args.collapse && parentsUntil(args.target, 'e-row')) {
                return;
            }
            var row = args.target.parentElement;
            var uid = row.getAttribute('data-uid');
            if (args.collapse) {
                var rowObj = this.getRowByUid(uid);
                var capRow = this.getRowByUid(rowObj.parentUid);
                if (capRow.isCaptionRow && capRow.isExpand) {
                    var capEle = this.getRowElementByUid(rowObj.parentUid);
                    this.parent.groupModule.expandCollapseRows(capEle.cells[rowObj.indent - 1]);
                }
            }
            else {
                var capRow = this.getRowByUid(uid);
                if (capRow.isCaptionRow && !capRow.isExpand) {
                    var capEle = this.getRowElementByUid(uid);
                    this.parent.groupModule.expandCollapseRows(capEle.cells[capRow.indent]);
                }
            }
        }
    };
    GroupLazyLoadRenderer.prototype.getRowByUid = function (uid) {
        return this.rowsByUid[this.parent.pageSettings.currentPage][uid];
    };
    GroupLazyLoadRenderer.prototype.actionBegin = function (args) {
        if (!args.cancel) {
            if (!this.requestType.some(function (value) { return value === args.requestType; })) {
                this.groupCache = {};
                this.resetRowMaintenance();
            }
            if (args.requestType === 'reorder' && this.parent.groupSettings.columns.length) {
                var keys = Object.keys(this.groupCache);
                for (var j = 0; j < keys.length; j++) {
                    var cache = this.groupCache[keys[j]];
                    for (var i = 0; i < cache.length; i++) {
                        if (cache[i].isCaptionRow && !this.captionModelGen.isEmpty()) {
                            this.changeCaptionRow(cache[i], null, keys[j]);
                        }
                        if (cache[i].isDataRow) {
                            var from = args.fromIndex + cache[i].indent;
                            var to = args.toIndex + cache[i].indent;
                            this.moveCells(cache[i].cells, from, to);
                        }
                    }
                }
            }
            if (args.requestType === 'delete'
                || (args.action === 'add' && args.requestType === 'save')) {
                this.groupCache = {};
                this.resetRowMaintenance();
            }
        }
    };
    GroupLazyLoadRenderer.prototype.actionComplete = function (args) {
        if (!args.cancel && args.requestType !== 'columnstate' && args.requestType !== 'beginEdit'
            && args.requestType !== 'delete' && args.requestType !== 'save' && args.requestType !== 'reorder') {
            this.scrollReset();
        }
    };
    GroupLazyLoadRenderer.prototype.resetRowMaintenance = function () {
        this.startIndexes = {};
        this.captionCounts = {};
        this.rowsByUid = {};
        this.objIdxByUid = {};
        this.initialGroupCaptions = {};
    };
    GroupLazyLoadRenderer.prototype.moveCells = function (arr, from, to) {
        if (from >= arr.length) {
            var k = from - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(from, 0, arr.splice(to, 1)[0]);
    };
    GroupLazyLoadRenderer.prototype.removeRows = function (idx, trIdx) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        var trs = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        var aggUid;
        if (this.parent.aggregates.length) {
            var agg = this.getAggregateByCaptionIndex(idx);
            aggUid = agg.length ? agg[agg.length - 1].uid : undefined;
        }
        var indent = rows[idx].indent;
        this.addClass(this.getNextChilds(idx));
        rows[idx].isExpand = this.rowsByUid[page][rows[idx].uid].isExpand = false;
        var capUid;
        for (var i = idx + 1; i < rows.length; i++) {
            if (rows[i].indent === indent || rows[i].indent < indent) {
                capUid = rows[i].uid;
                break;
            }
            if (rows[i].isCaptionRow && rows[i].isExpand) {
                this.addClass(this.getNextChilds(i));
            }
        }
        for (var i = trIdx + 1; i < trs.length; i++) {
            if (trs[i].getAttribute('data-uid') === capUid) {
                break;
            }
            else if (trs[i].getAttribute('data-uid') === aggUid) {
                remove(trs[i]);
                break;
            }
            else {
                remove(trs[i]);
            }
        }
    };
    GroupLazyLoadRenderer.prototype.addClass = function (rows) {
        var last = rows[this.blockSize];
        if (last) {
            last.lazyLoadCssClass = 'e-lazyload-middle-down';
        }
    };
    GroupLazyLoadRenderer.prototype.getNextChilds = function (index, rowObjects) {
        var group = this.groupCache[this.parent.pageSettings.currentPage];
        var rows = rowObjects ? rowObjects : group;
        var indent = group[index].indent + 1;
        var childRows = [];
        for (var i = rowObjects ? 0 : index + 1; i < rows.length; i++) {
            if (rows[i].indent < indent) {
                break;
            }
            if (rows[i].indent === indent) {
                childRows.push(rows[i]);
            }
        }
        return childRows;
    };
    GroupLazyLoadRenderer.prototype.lazyLoadHandler = function (args) {
        this.setStartIndexes();
        var tr = this.parent.getContent().querySelectorAll('tr')[args.index];
        var uid = tr.getAttribute('data-uid');
        var captionIndex = this.getRowObjectIndexByUid(uid);
        var captionRow = this.groupCache[this.parent.pageSettings.currentPage][captionIndex];
        var rows = args.isRowExist ? args.isScroll ? this.scrollData
            : this.getChildRowsByParentIndex(captionIndex, true, true, null, true) : [];
        this.scrollData = [];
        if (!args.isRowExist) {
            this.setRowIndexes(captionIndex, captionRow);
            this.refreshCaptionRowCount(this.groupCache[this.parent.pageSettings.currentPage][captionIndex], args.count);
            if (Object.keys(args.data).indexOf('GroupGuid') !== -1) {
                for (var i = 0; i < args.data.length; i++) {
                    var data = this.groupGenerator.generateCaptionRow(args.data[i], args.level, captionRow.parentGid, undefined, 0, captionRow.uid);
                    rows.push(data);
                    if (this.parent.aggregates.length) {
                        rows = rows.concat((this.summaryModelGen.generateRows(args.data[i], { level: args.level + 1, parentUid: data.uid })));
                    }
                }
            }
            else {
                this.groupGenerator.index = this.getStartIndex(captionIndex, args.isScroll);
                rows = this.groupGenerator.generateDataRows(args.data, args.level, captionRow.parentGid, 0, captionRow.uid);
            }
        }
        var trIdx = args.isScroll ? this.rowIndex : args.index;
        var nxtChild = this.getNextChilds(captionIndex, rows);
        var lastRow = !args.up ? this.hasLastChildRow(args.isScroll, args.count, nxtChild.length) : true;
        if (!args.isRowExist && !lastRow) {
            nxtChild[this.blockSize].lazyLoadCssClass = 'e-lazyload-middle-down';
        }
        if (!lastRow) {
            nxtChild[nxtChild.length - 1].lazyLoadCssClass = 'e-not-lazyload-end';
        }
        var aggregates = !args.isScroll && !args.isRowExist ? this.getAggregateByCaptionIndex(captionIndex) : [];
        if (!args.up) {
            if (!args.isRowExist) {
                this.refreshRowObjects(rows, args.isScroll ? this.rowObjectIndex : captionIndex);
            }
        }
        this.render(trIdx, rows, lastRow, aggregates);
        if (this.isFirstChildRow && !args.up) {
            this.parent.getContent().firstElementChild.scrollTop = rows.length * this.parent.getRowHeight();
        }
        this.isFirstChildRow = false;
        this.rowIndex = undefined;
        this.rowObjectIndex = undefined;
        this.childCount = 0;
    };
    GroupLazyLoadRenderer.prototype.setRowIndexes = function (capIdx, row) {
        if (!this.captionCounts[this.parent.pageSettings.currentPage]) {
            this.captionCounts[this.parent.pageSettings.currentPage] = {};
        }
        if (row.isCaptionRow) {
            this.captionCounts[this.parent.pageSettings.currentPage][row.uid] = row.data.count;
        }
    };
    GroupLazyLoadRenderer.prototype.getStartIndex = function (capIdx, isScroll) {
        var page = this.parent.pageSettings.currentPage;
        var cache = this.groupCache[page];
        if (isScroll) {
            return cache[this.rowObjectIndex].index + 1;
        }
        var count = 0;
        var idx = 0;
        var prevCapRow = this.getRowByUid(cache[capIdx].parentUid);
        if (prevCapRow) {
            idx = this.prevCaptionCount(prevCapRow);
        }
        if (cache[capIdx].indent > 0) {
            for (var i = capIdx - 1; i >= 0; i--) {
                if (cache[i].indent < cache[capIdx].indent) {
                    break;
                }
                if (cache[i].isCaptionRow && cache[i].indent === cache[capIdx].indent) {
                    count = count + cache[i].data.count;
                }
            }
        }
        var index = count + idx + this.startIndexes[page][cache[capIdx].parentGid];
        return index;
    };
    GroupLazyLoadRenderer.prototype.prevCaptionCount = function (prevCapRow) {
        var page = this.parent.pageSettings.currentPage;
        var cache = this.groupCache[page];
        var idx = 0;
        for (var i = cache.indexOf(prevCapRow) - 1; i >= 0; i--) {
            if (cache[i].indent === 0) {
                break;
            }
            if (cache[i].indent < prevCapRow.indent) {
                break;
            }
            if (cache[i].isCaptionRow && cache[i].indent === prevCapRow.indent) {
                var count = this.captionCounts[page][cache[i].uid];
                idx = idx + (count ? count : cache[i].data.count);
            }
        }
        var capRow = this.getRowByUid(prevCapRow.parentUid);
        if (capRow) {
            idx = idx + this.prevCaptionCount(capRow);
        }
        return idx;
    };
    GroupLazyLoadRenderer.prototype.setStartIndexes = function () {
        var cache = this.groupCache[this.parent.pageSettings.currentPage];
        if (!this.startIndexes[this.parent.pageSettings.currentPage]) {
            var indexes = [];
            var idx = void 0;
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].isCaptionRow) {
                    !indexes.length ? indexes.push(0)
                        : indexes.push(cache[idx].data.count + indexes[indexes.length - 1]);
                    idx = i;
                }
            }
            this.startIndexes[this.parent.pageSettings.currentPage] = indexes;
        }
    };
    GroupLazyLoadRenderer.prototype.hasLastChildRow = function (isScroll, captionCount, rowCount) {
        return isScroll ? captionCount === this.childCount + rowCount : captionCount === rowCount;
    };
    GroupLazyLoadRenderer.prototype.refreshCaptionRowCount = function (row, count) {
        row.data.count = count;
    };
    GroupLazyLoadRenderer.prototype.render = function (trIdx, rows, hasLastChildRow, aggregates) {
        var tr = this.parent.getContent().querySelectorAll('tr')[trIdx];
        var isLastRow = true;
        if (tr && aggregates.length) {
            for (var i = aggregates.length - 1; i >= 0; i--) {
                tr.insertAdjacentElement('afterend', this.rowRenderer.render(aggregates[i], this.parent.getColumns()));
            }
        }
        if (tr && rows.length) {
            for (var i = rows.length - 1; i >= 0; i--) {
                if (this.confirmRowRendering(rows[i])) {
                    tr.insertAdjacentElement('afterend', this.rowRenderer.render(rows[i], this.parent.getColumns()));
                }
            }
        }
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.maintainRows = function (row, index) {
        var page = this.parent.pageSettings.currentPage;
        if (!this.rowsByUid[page]) {
            this.rowsByUid[page] = {};
            this.objIdxByUid[page] = {};
        }
        if (row.uid) {
            this.rowsByUid[page][row.uid] = row;
        }
        this.objIdxByUid[page][row.uid] = index;
    };
    GroupLazyLoadRenderer.prototype.confirmRowRendering = function (row) {
        var check = true;
        if (isNullOrUndefined(row.indent) && !row.isDataRow && !row.isCaptionRow) {
            var cap = this.getRowByUid(row.parentUid);
            if (cap.isCaptionRow && !cap.isExpand) {
                check = false;
            }
        }
        return check;
    };
    GroupLazyLoadRenderer.prototype.refreshRowObjects = function (newRows, index) {
        var page = this.parent.pageSettings.currentPage;
        var rowsObject = this.groupCache[page];
        this.rowsByUid[page] = {};
        this.objIdxByUid[page] = {};
        var newRowsObject = [];
        var k = 0;
        for (var i = 0; i < rowsObject.length; i++) {
            if (i === index) {
                this.maintainRows(rowsObject[i], k);
                newRowsObject.push(rowsObject[i]);
                k++;
                for (var j = 0; j < newRows.length; j++) {
                    this.maintainRows(newRows[j], k);
                    newRowsObject.push(newRows[j]);
                    k++;
                }
            }
            else {
                this.maintainRows(rowsObject[i], k);
                newRowsObject.push(rowsObject[i]);
                k++;
            }
        }
        this.groupCache[this.parent.pageSettings.currentPage] = extend([], newRowsObject);
        this.updateCurrentViewData();
    };
    GroupLazyLoadRenderer.prototype.getAggregateByCaptionIndex = function (index) {
        var cache = this.groupCache[this.parent.pageSettings.currentPage];
        var parent = cache[index];
        var indent = parent.indent;
        var uid = parent.uid;
        var agg = [];
        for (var i = index + 1; i < cache.length; i++) {
            if (cache[i].indent === indent) {
                break;
            }
            if (isNullOrUndefined(cache[i].indent) && cache[i].parentUid === uid) {
                agg.push(cache[i]);
            }
        }
        return agg;
    };
    GroupLazyLoadRenderer.prototype.getChildRowsByParentIndex = function (index, deep, block, data, includeAgg, includeCollapseAgg) {
        var cache = data ? data : this.groupCache[this.parent.pageSettings.currentPage];
        var parentRow = cache[index];
        var agg = [];
        if (!parentRow.isCaptionRow || (parentRow.isCaptionRow && !parentRow.isExpand && !includeCollapseAgg)) {
            return [];
        }
        if (includeAgg && this.parent.aggregates.length) {
            agg = this.getAggregateByCaptionIndex(index);
        }
        var indent = parentRow.indent;
        var uid = parentRow.uid;
        var rows = [];
        var count = 0;
        for (var i = index + 1; i < cache.length; i++) {
            if (cache[i].parentUid === uid) {
                if (isNullOrUndefined(cache[i].indent)) {
                    continue;
                }
                count++;
                rows.push(cache[i]);
                if (deep && cache[i].isCaptionRow) {
                    rows = rows.concat(this.getChildRowsByParentIndex(i, deep, block, data, includeAgg));
                }
                if (block && count === this.pageSize) {
                    break;
                }
            }
            if (cache[i].indent === indent) {
                break;
            }
        }
        return rows.concat(agg);
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.initialGroupRows = function (isReorder) {
        var rows = [];
        var cache = this.groupCache[this.parent.pageSettings.currentPage];
        if (isReorder) {
            return this.getRenderedRowsObject();
        }
        for (var i = 0; i < cache.length; i++) {
            if (cache[i].indent === 0) {
                rows.push(cache[i]);
                rows = rows.concat(this.getChildRowsByParentIndex(i, true, true, cache, true));
            }
        }
        return rows;
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getRenderedRowsObject = function () {
        var rows = [];
        var trs = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        for (var i = 0; i < trs.length; i++) {
            rows.push(this.getRowByUid(trs[i].getAttribute('data-uid')));
        }
        return rows;
    };
    GroupLazyLoadRenderer.prototype.getCacheRowsOnDownScroll = function (index) {
        var rows = [];
        var rowsObject = this.groupCache[this.parent.pageSettings.currentPage];
        var k = index;
        for (var i = 0; i < this.pageSize; i++) {
            if (!rowsObject[k] || rowsObject[k].indent < rowsObject[index].indent) {
                break;
            }
            if (rowsObject[k].indent === rowsObject[index].indent) {
                rows.push(rowsObject[k]);
                if (rowsObject[k].isCaptionRow && rowsObject[k].isExpand) {
                    rows = rows.concat(this.getChildRowsByParentIndex(k, true, true, null, true));
                }
            }
            if (rowsObject[k].indent > rowsObject[index].indent || isNullOrUndefined(rowsObject[k].indent)) {
                i--;
            }
            k++;
        }
        return rows;
    };
    GroupLazyLoadRenderer.prototype.getCacheRowsOnUpScroll = function (start, end, index) {
        var rows = [];
        var rowsObject = this.groupCache[this.parent.pageSettings.currentPage];
        var str = false;
        for (var i = 0; i < rowsObject.length; i++) {
            if (str && (!rowsObject[i] || rowsObject[i].indent < rowsObject[index].indent || rowsObject[i].uid === end)) {
                break;
            }
            if (!str && rowsObject[i].uid === start) {
                str = true;
            }
            if (str && rowsObject[i].indent === rowsObject[index].indent) {
                rows.push(rowsObject[i]);
                if (rowsObject[i].isCaptionRow && rowsObject[i].isExpand) {
                    rows = rows.concat(this.getChildRowsByParentIndex(i, true, true, null, true));
                }
            }
        }
        return rows;
    };
    GroupLazyLoadRenderer.prototype.scrollHandler = function (e) {
        if (this.parent.isDestroyed || this.childCount) {
            return;
        }
        var downTrs = [].slice.call(this.parent.getContent().querySelectorAll('.e-lazyload-middle-down'));
        var upTrs = [].slice.call(this.parent.getContent().querySelectorAll('.e-lazyload-middle-up'));
        var endTrs = [].slice.call(this.parent.getContent().querySelectorAll('.e-not-lazyload-end'));
        var tr;
        var lazyLoadDown = false;
        var lazyLoadUp = false;
        var lazyLoadEnd = false;
        if (e.scrollDown && downTrs.length) {
            var result = this.findRowElements(downTrs);
            tr = result.tr;
            lazyLoadDown = result.entered;
        }
        if (!e.scrollDown && endTrs) {
            for (var i = 0; i < endTrs.length; i++) {
                var top_1 = endTrs[i].getBoundingClientRect().top;
                var scrollHeight = this.parent.getContent().scrollHeight;
                if (top_1 > 0 && top_1 < scrollHeight) {
                    tr = endTrs[i];
                    lazyLoadEnd = true;
                    this.rowIndex = tr.rowIndex;
                    break;
                }
            }
        }
        if (!e.scrollDown && upTrs.length && !lazyLoadEnd) {
            var result = this.findRowElements(upTrs);
            tr = result.tr;
            lazyLoadUp = result.entered;
        }
        if (tr) {
            if (lazyLoadDown && e.scrollDown && lazyLoadDown && tr) {
                this.scrollDownHandler(tr);
            }
            if (!e.scrollDown && lazyLoadEnd && tr) {
                this.scrollUpEndRowHandler(tr);
            }
            if (this.cacheMode && !e.scrollDown && !lazyLoadEnd && lazyLoadUp && tr) {
                this.scrollUpHandler(tr);
            }
        }
    };
    GroupLazyLoadRenderer.prototype.scrollUpEndRowHandler = function (tr) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        var uid = tr.getAttribute('data-uid');
        var index = this.rowObjectIndex = this.getRowObjectIndexByUid(uid);
        var idx = index;
        var childRow = rows[index];
        var parentCapRow = this.getRowByUid(childRow.parentUid);
        var capRowObjIdx = this.getRowObjectIndexByUid(parentCapRow.uid);
        var captionRowEle = this.parent.getContent().querySelector('tr[data-uid=' + parentCapRow.uid + ']');
        var capRowEleIndex = captionRowEle.rowIndex;
        var child = this.getChildRowsByParentIndex(capRowObjIdx);
        var childIdx = child.indexOf(childRow);
        var currentPage = Math.ceil(childIdx / this.pageSize);
        if (currentPage === 1) {
            return;
        }
        this.childCount = currentPage * this.pageSize;
        index = this.getCurrentBlockEndIndex(childRow, index);
        if (this.childCount < parentCapRow.data.count) {
            tr.classList.remove('e-not-lazyload-end');
            childRow.lazyLoadCssClass = '';
            var isRowExist = rows[index + 1] ? childRow.indent === rows[index + 1].indent : false;
            this.scrollData = isRowExist ? this.getCacheRowsOnDownScroll(index + 1) : [];
            var key = this.getGroupKeysAndFields(capRowObjIdx, rows);
            var args = {
                rowIndex: capRowEleIndex, makeRequest: !isRowExist, groupInfo: parentCapRow, fields: key.fields,
                keys: key.keys, skip: this.childCount, take: this.pageSize, isScroll: true
            };
            if (this.cacheMode && this.childCount >= (this.pageSize * this.cacheBlockSize)) {
                var child_1 = this.getChildRowsByParentIndex(capRowObjIdx);
                var currenBlock = Math.ceil((child_1.indexOf(rows[idx]) / this.pageSize));
                var removeBlock = currenBlock - (this.cacheBlockSize - 1);
                this.removeBlock(uid, isRowExist, removeBlock, child_1);
                args.cachedRowIndex = (removeBlock * this.pageSize);
            }
            this.captionRowExpand(args);
        }
        else {
            this.childCount = 0;
        }
    };
    GroupLazyLoadRenderer.prototype.scrollDownHandler = function (tr) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        var uid = tr.getAttribute('data-uid');
        var index = this.getRowObjectIndexByUid(uid);
        var idx = index;
        var childRow = rows[index];
        var parentCapRow = this.getRowByUid(childRow.parentUid);
        var capRowObjIdx = this.getRowObjectIndexByUid(parentCapRow.uid);
        var captionRowEle = this.getRowElementByUid(parentCapRow.uid);
        var capRowEleIndex = captionRowEle.rowIndex;
        var child = this.getChildRowsByParentIndex(capRowObjIdx);
        var childIdx = child.indexOf(childRow);
        var currentPage = Math.ceil(childIdx / this.pageSize);
        this.childCount = currentPage * this.pageSize;
        index = this.rowObjectIndex = this.getRowObjectIndexByUid(child[this.childCount - 1].uid);
        var lastchild = rows[index];
        var lastRow = this.getRowElementByUid(lastchild.uid);
        this.rowIndex = lastRow.rowIndex;
        index = this.getCurrentBlockEndIndex(lastchild, index);
        if (this.childCount < parentCapRow.data.count) {
            var isRowExist = rows[index + 1] ? childRow.indent === rows[index + 1].indent : false;
            if (isRowExist && !isNullOrUndefined(this.getRowElementByUid(rows[index + 1].uid))) {
                this.childCount = 0;
                return;
            }
            if (currentPage > 1 || !this.cacheMode) {
                tr.classList.remove('e-lazyload-middle-down');
                lastRow.classList.remove('e-not-lazyload-end');
                lastchild.lazyLoadCssClass = '';
            }
            this.scrollData = isRowExist ? this.getCacheRowsOnDownScroll(this.rowObjectIndex + 1) : [];
            var query = this.getGroupKeysAndFields(capRowObjIdx, rows);
            var args = {
                rowIndex: capRowEleIndex, makeRequest: !isRowExist, groupInfo: parentCapRow, fields: query.fields,
                keys: query.keys, skip: this.childCount, take: this.pageSize, isScroll: true
            };
            if (this.cacheMode && (this.childCount - this.pageSize) >= (this.pageSize * this.cacheBlockSize)) {
                var child_2 = this.getChildRowsByParentIndex(capRowObjIdx);
                var currenBlock = Math.ceil((child_2.indexOf(rows[idx]) / this.pageSize)) - 1;
                var removeBlock = (currenBlock - (this.cacheBlockSize - 1)) + 1;
                this.removeBlock(uid, isRowExist, removeBlock, child_2, lastchild);
                args.cachedRowIndex = (removeBlock * this.pageSize);
            }
            this.captionRowExpand(args);
        }
        else {
            this.childCount = 0;
        }
    };
    GroupLazyLoadRenderer.prototype.getCurrentBlockEndIndex = function (row, index) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        if (row.isCaptionRow) {
            if (row.isExpand) {
                var childCount = this.getChildRowsByParentIndex(index, true).length;
                this.rowIndex = this.rowIndex + childCount;
            }
            var agg = this.getAggregateByCaptionIndex(index);
            this.rowObjectIndex = this.rowObjectIndex + agg.length;
            var idx = index;
            for (var i = idx + 1; i < rows.length; i++) {
                if (rows[i].indent === rows[index].indent || rows[i].indent < rows[index].indent) {
                    index = idx;
                    break;
                }
                else {
                    idx++;
                }
            }
        }
        return index;
    };
    GroupLazyLoadRenderer.prototype.removeBlock = function (uid, isRowExist, removeBlock, child, lastchild) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        var uid1 = child[(((removeBlock + 1) * this.pageSize) - 1) - this.blockSize].uid;
        var uid2 = child[(removeBlock * this.pageSize) - this.pageSize].uid;
        var uid3 = child[(removeBlock * this.pageSize)].uid;
        var firstIdx = this.getRowObjectIndexByUid(uid1);
        rows[firstIdx].lazyLoadCssClass = 'e-lazyload-middle-up';
        this.getRowElementByUid(uid1).classList.add('e-lazyload-middle-up');
        if (lastchild) {
            this.getRowElementByUid(uid3).classList.add('e-not-lazyload-first');
            this.getRowByUid(uid3).lazyLoadCssClass = 'e-not-lazyload-first';
            this.getRowByUid(uid2).lazyLoadCssClass = '';
        }
        if (isRowExist) {
            this.removeTopRows(lastchild ? lastchild.uid : uid, uid2, uid3);
        }
        else {
            this.uid1 = uid2;
            this.uid2 = uid3;
            this.uid3 = lastchild ? lastchild.uid : uid;
        }
    };
    GroupLazyLoadRenderer.prototype.scrollUpHandler = function (tr) {
        var page = this.parent.pageSettings.currentPage;
        var rows = this.groupCache[page];
        var uid = tr.getAttribute('data-uid');
        var row = this.getRowByUid(uid);
        var index = this.rowObjectIndex = this.getRowObjectIndexByUid(uid);
        var parentCapRow = this.getRowByUid(row.parentUid);
        var capRowObjIdx = this.rowIndex = this.getRowObjectIndexByUid(parentCapRow.uid);
        var captionRowEle = this.parent.getRowElementByUID(parentCapRow.uid);
        var capRowEleIndex = captionRowEle.rowIndex;
        var child = this.getChildRowsByParentIndex(capRowObjIdx);
        var childIdx = child.indexOf(rows[index]);
        var currenBlock = Math.floor((childIdx / this.pageSize));
        var idx = this.blockSize;
        if ((this.blockSize * 2) > this.pageSize) {
            idx = (this.blockSize * 2) - this.pageSize;
            idx = this.blockSize - idx;
        }
        var start = child[(childIdx - (idx - 1)) - this.pageSize].uid;
        var end = child[childIdx - (idx - 1)].uid;
        this.scrollData = this.getCacheRowsOnUpScroll(start, end, index - (idx - 1));
        this.isFirstChildRow = currenBlock > 1;
        if (this.isFirstChildRow) {
            this.scrollData[0].lazyLoadCssClass = 'e-not-lazyload-first';
        }
        this.getRowByUid(end).lazyLoadCssClass = '';
        this.getRowElementByUid(end).classList.remove('e-not-lazyload-first');
        var removeBlock = currenBlock + this.cacheBlockSize;
        if (child.length !== parentCapRow.data.count && (removeBlock * this.pageSize > child.length)) {
            this.isFirstChildRow = false;
            this.scrollData[0].lazyLoadCssClass = '';
            this.getRowElementByUid(end).classList.add('e-not-lazyload-first');
            return;
        }
        var count = removeBlock * this.pageSize > parentCapRow.data.count
            ? parentCapRow.data.count : removeBlock * this.pageSize;
        var size = removeBlock * this.pageSize > parentCapRow.data.count
            ? (this.pageSize - ((this.pageSize * removeBlock) - parentCapRow.data.count)) : this.pageSize;
        var childRows = this.getChildRowsByParentIndex(rows.indexOf(child[count - 1]), true, false, null, true);
        var uid1 = childRows.length ? childRows[childRows.length - 1].uid : child[(count - 1)].uid;
        var uid2 = child[count - size].uid;
        var uid3 = child[(count - size) - 1].uid;
        var lastIdx = this.objIdxByUid[page][uid2] - idx;
        if (rows[lastIdx].lazyLoadCssClass === 'e-lazyload-middle-down') {
            var trEle = this.getRowElementByUid(rows[lastIdx].uid);
            if (trEle) {
                trEle.classList.add('e-lazyload-middle-down');
            }
        }
        this.getRowByUid(uid1).lazyLoadCssClass = '';
        this.getRowByUid(uid3).lazyLoadCssClass = 'e-not-lazyload-end';
        this.getRowElementByUid(uid3).classList.add('e-not-lazyload-end');
        this.removeBottomRows(uid1, uid2, uid3);
        this.rowIndex = tr.rowIndex - idx;
        tr.classList.length > 1 ? tr.classList.remove('e-lazyload-middle-up') : tr.removeAttribute('class');
        if (!isNullOrUndefined(this.getRowElementByUid(start))) {
            this.childCount = 0;
            this.scrollData = [];
            return;
        }
        var key = this.getGroupKeysAndFields(this.getRowObjectIndexByUid(parentCapRow.uid), rows);
        var args = {
            rowIndex: capRowEleIndex, makeRequest: false, groupInfo: parentCapRow, fields: key.fields,
            keys: key.keys, skip: this.childCount, take: this.pageSize, isScroll: true, scrollUp: true
        };
        this.captionRowExpand(args);
    };
    GroupLazyLoadRenderer.prototype.findRowElements = function (rows) {
        var entered = false;
        var tr;
        for (var i = 0; i < rows.length; i++) {
            var rowIdx = rows[i].rowIndex;
            if (isRowEnteredInGrid(rowIdx, this.parent)) {
                entered = true;
                this.rowIndex = rowIdx;
                tr = rows[i];
                break;
            }
        }
        return { entered: entered, tr: tr };
    };
    GroupLazyLoadRenderer.prototype.getRowElementByUid = function (uid) {
        return this.parent.getContent().querySelector('tr[data-uid=' + uid + ']');
    };
    GroupLazyLoadRenderer.prototype.removeTopRows = function (uid1, uid2, uid3) {
        var trs = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        var page = this.parent.pageSettings.currentPage;
        var start = false;
        for (var i = 0; i < trs.length; i++) {
            if (trs[i].getAttribute('data-uid') === uid3) {
                var tr = this.parent.getContent().querySelector('tr[data-uid=' + uid1 + ']');
                if (tr) {
                    this.rowIndex = tr.rowIndex;
                }
                break;
            }
            if (trs[i].getAttribute('data-uid') === uid2) {
                start = true;
            }
            if (start) {
                remove(trs[i]);
            }
        }
    };
    GroupLazyLoadRenderer.prototype.removeBottomRows = function (uid1, uid2, uid3) {
        var trs = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        var start = false;
        for (var i = 0; i < trs.length; i++) {
            if (trs[i].getAttribute('data-uid') === uid2) {
                start = true;
            }
            if (start) {
                remove(trs[i]);
                if (trs[i].getAttribute('data-uid') === uid1) {
                    break;
                }
            }
        }
    };
    GroupLazyLoadRenderer.prototype.setCache = function (e) {
        var page = this.parent.pageSettings.currentPage;
        this.groupCache[page] = this.initialGroupCaptions[page] = extend([], e.data);
    };
    GroupLazyLoadRenderer.prototype.getGroupKeysAndFields = function (index, rowsObject) {
        var fields = [];
        var keys = [];
        for (var i = index; i >= 0; i--) {
            if (rowsObject[i].isCaptionRow && fields.indexOf(rowsObject[i].data.field) === -1
                && (rowsObject[i].indent < rowsObject[index].indent || i === index)) {
                fields.push(rowsObject[i].data.field);
                keys.push(rowsObject[i].data.key);
                if (rowsObject[i].indent === 0) {
                    break;
                }
            }
        }
        return { fields: fields, keys: keys };
    };
    GroupLazyLoadRenderer.prototype.generateExpandPredicates = function (fields, values) {
        var filterCols = [];
        for (var i = 0; i < fields.length; i++) {
            var column = this.parent.getColumnByField(fields[i]);
            var value = values[i] === 'null' ? null : values[i];
            var pred = {
                field: fields[i], predicate: 'or', uid: column.uid, operator: 'equal', type: column.type,
                matchCase: this.allowCaseSensitive, ignoreAccent: this.ignoreAccent
            };
            if (value === '' || isNullOrUndefined(value)) {
                filterCols = filterCols.concat(CheckBoxFilterBase.generateNullValuePredicates(pred));
            }
            else {
                filterCols.push(extend({}, { value: value }, pred));
            }
        }
        return CheckBoxFilterBase.getPredicate(filterCols);
    };
    GroupLazyLoadRenderer.prototype.getPredicates = function (pred) {
        var predicateList = [];
        for (var _i = 0, _a = Object.keys(pred); _i < _a.length; _i++) {
            var prop = _a[_i];
            predicateList.push(pred[prop]);
        }
        return predicateList;
    };
    GroupLazyLoadRenderer.prototype.captionRowExpand = function (args) {
        var _this = this;
        var captionRow = args.groupInfo;
        var level = this.parent.groupSettings.columns.indexOf(captionRow.data.field) + 1;
        var pred = this.generateExpandPredicates(args.fields, args.keys);
        var predicateList = this.getPredicates(pred);
        var lazyLoad = { level: level, skip: args.skip, take: args.take, where: predicateList };
        if (args.makeRequest) {
            var query = this.parent.renderModule.data.generateQuery(true);
            if (!query.isCountRequired) {
                query.isCountRequired = true;
            }
            query.lazyLoad.push({ key: 'onDemandGroupInfo', value: lazyLoad });
            this.parent.showSpinner();
            this.parent.renderModule.data.getData({}, query).then(function (e) {
                _this.parent.hideSpinner();
                if (e.result.length === 0) {
                    return;
                }
                if (_this.cacheMode && _this.uid1 && _this.uid2) {
                    _this.removeTopRows(_this.uid3, _this.uid1, _this.uid2);
                    _this.uid1 = _this.uid2 = _this.uid3 = undefined;
                }
                _this.lazyLoadHandler({
                    data: e.result, count: e.count, level: level, index: args.rowIndex,
                    isRowExist: false, isScroll: args.isScroll, up: false, rowIndex: args.cachedRowIndex
                });
            })
                .catch(function (e) { return _this.parent.renderModule.dataManagerFailure(e, { requestType: 'grouping' }); });
        }
        else {
            this.lazyLoadHandler({
                data: null, count: args.groupInfo.data.count, level: level, index: args.rowIndex,
                isRowExist: true, isScroll: args.isScroll, up: args.scrollUp, rowIndex: args.cachedRowIndex
            });
        }
    };
    GroupLazyLoadRenderer.prototype.scrollReset = function (top) {
        this.parent.getContent().firstElementChild.scrollTop = top ? this.parent.getContent().firstElementChild.scrollTop + top : 0;
    };
    GroupLazyLoadRenderer.prototype.updateCurrentViewData = function () {
        var records = [];
        this.getRows().filter(function (row) {
            if (row.isDataRow) {
                records[row.index] = row.data;
            }
        });
        this.parent.currentViewData = records.length ? records : this.parent.currentViewData;
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getGroupCache = function () {
        return this.groupCache;
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getRows = function () {
        return this.groupCache[this.parent.pageSettings.currentPage] || [];
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getRowElements = function () {
        return [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.getRowByIndex = function (index) {
        var tr = [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
        var row;
        for (var i = 0; !isNullOrUndefined(index) && i < tr.length; i++) {
            if (tr[i].getAttribute('aria-rowindex') === index.toString()) {
                row = tr[i];
                break;
            }
        }
        return row;
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var rows = this.getRows();
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var contentrows = this.getRows().filter(function (row) { return !row.isDetailRow; });
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var idx = this.parent.getNormalizedColumnIndex(column.uid);
            var colIdx = this.parent.getColumnIndexByUid(column.uid);
            var displayVal = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
            }
            this.setDisplayNone(gObj.getDataRows(), colIdx, displayVal, contentrows, idx);
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
    };
    /** @hidden */
    GroupLazyLoadRenderer.prototype.setDisplayNone = function (tr, idx, displayVal, rows, oriIdx) {
        var trs = Object.keys(tr);
        if (!this.parent.groupSettings.columns.length) {
            for (var i = 0; i < trs.length; i++) {
                var td = tr[trs[i]].querySelectorAll('td.e-rowcell')[idx];
                if (tr[trs[i]].querySelectorAll('td.e-rowcell').length && td) {
                    setStyleAttribute(tr[trs[i]].querySelectorAll('td.e-rowcell')[idx], { 'display': displayVal });
                    if (tr[trs[i]].querySelectorAll('td.e-rowcell')[idx].classList.contains('e-hide')) {
                        removeClass([tr[trs[i]].querySelectorAll('td.e-rowcell')[idx]], ['e-hide']);
                    }
                    rows[trs[i]].cells[idx].visible = displayVal === '' ? true : false;
                }
            }
        }
        else {
            var keys = Object.keys(this.groupCache);
            for (var j = 0; j < keys.length; j++) {
                var uids = this.rowsByUid[keys[j]];
                var idxs = Object.keys(uids);
                for (var i = 0; i < idxs.length; i++) {
                    var tr_1 = this.parent.getContent().querySelector('tr[data-uid=' + idxs[i] + ']');
                    var row = uids[idxs[i]];
                    if (row.isCaptionRow) {
                        if (!this.captionModelGen.isEmpty()) {
                            this.changeCaptionRow(row, tr_1, keys[j]);
                        }
                        else {
                            row.cells[row.indent + 1].colSpan = displayVal === '' ? row.cells[row.indent + 1].colSpan + 1
                                : row.cells[row.indent + 1].colSpan - 1;
                            if (tr_1) {
                                tr_1.cells[row.indent + 1].colSpan = row.cells[row.indent + 1].colSpan;
                            }
                        }
                    }
                    if (row.isDataRow) {
                        this.showAndHideCells(tr_1, idx, displayVal, false);
                        row.cells[oriIdx].visible = displayVal === '' ? true : false;
                    }
                    if (!row.isCaptionRow && !row.isDataRow && isNullOrUndefined(row.indent)) {
                        row.cells[oriIdx].visible = displayVal === '' ? true : false;
                        row.visible = row.cells.some(function (cell) { return cell.isDataCell && cell.visible; });
                        this.showAndHideCells(tr_1, idx, displayVal, true, row);
                    }
                }
            }
        }
    };
    GroupLazyLoadRenderer.prototype.changeCaptionRow = function (row, tr, index) {
        var capRow = row;
        var captionData = row.data;
        var data = this.groupGenerator.generateCaptionRow(captionData, capRow.indent, capRow.parentGid, undefined, capRow.tIndex, capRow.parentUid);
        data.uid = row.uid;
        data.isExpand = row.isExpand;
        data.lazyLoadCssClass = row.lazyLoadCssClass;
        this.rowsByUid[index][row.uid] = data;
        this.groupCache[index][this.objIdxByUid[index][row.uid]] = data;
        if (tr) {
            var tbody = this.parent.getContentTable().querySelector('tbody');
            tbody.replaceChild(this.rowRenderer.render(data, this.parent.getColumns()), tr);
        }
    };
    GroupLazyLoadRenderer.prototype.showAndHideCells = function (tr, idx, displayVal, isSummary, row) {
        if (tr) {
            var cls = isSummary ? 'td.e-summarycell' : 'td.e-rowcell';
            setStyleAttribute(tr.querySelectorAll(cls)[idx], { 'display': displayVal });
            if (tr.querySelectorAll(cls)[idx].classList.contains('e-hide')) {
                removeClass([tr.querySelectorAll(cls)[idx]], ['e-hide']);
            }
            if (isSummary) {
                if (row.visible && tr.classList.contains('e-hide')) {
                    removeClass([tr], ['e-hide']);
                }
                else if (!row.visible) {
                    addClass([tr], ['e-hide']);
                }
            }
        }
    };
    return GroupLazyLoadRenderer;
}(ContentRender));
export { GroupLazyLoadRenderer };
