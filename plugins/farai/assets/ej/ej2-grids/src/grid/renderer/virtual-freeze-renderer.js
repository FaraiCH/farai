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
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { ColumnFreezeContentRenderer } from './column-freeze-renderer';
import { VirtualContentRenderer, VirtualHeaderRenderer } from './virtual-content-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import { RowModelGenerator } from '../services/row-model-generator';
import { RenderType } from '../base/enum';
import { InterSectionObserver } from '../services/intersection-observer';
import * as events from '../base/constant';
import { getFrozenTableName, splitFrozenRowObjectCells } from '../base/util';
/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
var VirtualFreezeRenderer = /** @class */ (function (_super) {
    __extends(VirtualFreezeRenderer, _super);
    function VirtualFreezeRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        /** @hidden */
        _this.frzRows = [];
        /** @hidden */
        _this.mvblRows = [];
        /** @hidden */
        _this.frRows = [];
        _this.serviceLoc = locator;
        _this.eventListener('on');
        _this.rowModelGenerator = new RowModelGenerator(_this.parent);
        return _this;
    }
    VirtualFreezeRenderer.prototype.eventListener = function (action) {
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.setFreezeSelection, this.setFreezeSelection, this);
        this.parent[action](events.refreshVirtualFrozenRows, this.refreshVirtualFrozenRows, this);
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
    };
    VirtualFreezeRenderer.prototype.actionComplete = function (args) {
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            for (var i = 0; i < this.parent.frozenRows; i++) {
                setCache(this, i);
            }
        }
    };
    VirtualFreezeRenderer.prototype.refreshVirtualFrozenRows = function (args) {
        var _this = this;
        var gObj = this.parent;
        if (args.requestType === 'delete' && gObj.frozenRows) {
            args.isFrozenRowsRender = true;
            var selectedIdx_1 = gObj.getSelectedRowIndexes();
            var query = gObj.renderModule.data.generateQuery(true).clone();
            query.page(1, gObj.pageSettings.pageSize);
            gObj.renderModule.data.getData({}, query).then(function (e) {
                renderFrozenRows(args, e.result, selectedIdx_1, gObj, _this.rowModelGenerator, _this.serviceLoc, _this.virtualRenderer, _this);
            });
        }
    };
    VirtualFreezeRenderer.prototype.getVirtualData = function (data) {
        this.virtualRenderer.getVirtualData(data);
    };
    VirtualFreezeRenderer.prototype.setFreezeSelection = function (args) {
        setFreezeSelection(args, this.virtualRenderer);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.renderTable = function () {
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = this.serviceLoc.getService('rendererFactory')
            .getRenderer(RenderType.Header).virtualHdrRenderer;
        _super.prototype.renderTable.call(this);
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        var frzCont = this.getFrozenContent();
        var movableCont = this.getMovableContent();
        var minHeight = this.parent.height;
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = this.getPanel().querySelector('.e-content');
        this.virtualRenderer.virtualEle.content.style.overflowX = 'hidden';
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        if (this.parent.enableColumnVirtualization) {
            this.virtualRenderer.virtualEle.movableContent = this.virtualRenderer.movableContent
                = this.getPanel().querySelector('.e-movablecontent');
            this.virtualRenderer.virtualEle.renderMovableWrapper(minHeight);
            this.virtualRenderer.virtualEle.renderMovablePlaceHolder();
            var tbl = movableCont.querySelector('table');
            this.virtualRenderer.virtualEle.movableTable = tbl;
            this.virtualRenderer.virtualEle.movableWrapper.appendChild(tbl);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movableWrapper);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movablePlaceholder);
        }
        this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
        this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
        this.virtualRenderer.virtualEle.table = this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.appendContent = function (target, newChild, e) {
        appendContent(this.virtualRenderer, this.widthService, target, newChild, e);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.generateRows = function (data, notifyArgs) {
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        return generateRows(this.virtualRenderer, data, notifyArgs, this.freezeRowGenerator, this.parent);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRowByIndex = function (index) {
        return this.virtualRenderer.getRowByIndex(index);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getMovableRowByIndex = function (index) {
        return this.virtualRenderer.getMovableVirtualRowByIndex(index);
    };
    VirtualFreezeRenderer.prototype.collectRows = function (tableName) {
        return collectRows(tableName, this.virtualRenderer, this.parent);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getMovableRows = function () {
        return this.collectRows('movable');
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRows = function () {
        return this.collectRows('frozen-left');
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getColGroup = function () {
        var mCol = this.parent.getMovableVirtualContent();
        return this.isXaxis() ? mCol.querySelector('colgroup') : this.colgroup;
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getReorderedFrozenRows = function (args) {
        return getReorderedFrozenRows(args, this.virtualRenderer, this.parent, this.freezeRowGenerator, this.firstPageRecords);
    };
    VirtualFreezeRenderer.prototype.isXaxis = function () {
        return isXaxis(this.virtualRenderer);
    };
    VirtualFreezeRenderer.prototype.getHeaderCells = function () {
        return getHeaderCells(this.virtualRenderer, this.parent);
    };
    VirtualFreezeRenderer.prototype.getVirtualFreezeHeader = function () {
        return getVirtualFreezeHeader(this.virtualRenderer, this.parent);
    };
    VirtualFreezeRenderer.prototype.ensureFrozenCols = function (columns) {
        return ensureFrozenCols(columns, this.parent);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRowObjectByIndex = function (index) {
        return this.virtualRenderer.getRowObjectByIndex(index);
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    VirtualFreezeRenderer.prototype.setColGroup = function (colGroup) {
        return setColGroup(colGroup, this.virtualRenderer, this);
    };
    return VirtualFreezeRenderer;
}(FreezeContentRender));
export { VirtualFreezeRenderer };
/**
 * VirtualFreezeHdrRenderer is used to render the virtual table within the frozen and movable header table
 * @hidden
 */
var VirtualFreezeHdrRenderer = /** @class */ (function (_super) {
    __extends(VirtualFreezeHdrRenderer, _super);
    function VirtualFreezeHdrRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.serviceLoc = locator;
        return _this;
    }
    /**
     * @hidden
     */
    VirtualFreezeHdrRenderer.prototype.renderTable = function () {
        this.virtualHdrRenderer = new VirtualHeaderRenderer(this.parent, this.serviceLoc);
        this.virtualHdrRenderer.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.virtualHdrRenderer.gen.getColumnIndexes(this.getPanel()
            .querySelector('.e-headercontent')));
        this.virtualHdrRenderer.virtualEle.content = this.getPanel().querySelector('.e-headercontent');
        this.virtualHdrRenderer.virtualEle.renderFrozenWrapper();
        this.virtualHdrRenderer.virtualEle.renderFrozenPlaceHolder();
        if (this.parent.enableColumnVirtualization) {
            this.virtualHdrRenderer.virtualEle.movableContent = this.getPanel().querySelector('.e-movableheader');
            this.virtualHdrRenderer.virtualEle.renderMovableWrapper();
            this.virtualHdrRenderer.virtualEle.renderMovablePlaceHolder();
        }
        _super.prototype.renderTable.call(this);
        this.virtualHdrRenderer.setPanel(this.parent.getHeaderContent());
    };
    VirtualFreezeHdrRenderer.prototype.rfshMovable = function () {
        this.getFrozenHeader().appendChild(this.getTable());
        this.virtualHdrRenderer.virtualEle.wrapper.appendChild(this.getFrozenHeader());
        if (this.parent.enableColumnVirtualization) {
            this.virtualHdrRenderer.virtualEle.movableWrapper.appendChild(this.createTable());
        }
        else {
            this.getMovableHeader().appendChild(this.createTable());
        }
        this.virtualHdrRenderer.virtualEle.wrapper.appendChild(this.getMovableHeader());
    };
    return VirtualFreezeHdrRenderer;
}(FreezeRender));
export { VirtualFreezeHdrRenderer };
/** @hidden */
export function renderFrozenRows(args, data, selectedIdx, parent, rowModelGenerator, locator, virtualRenderer, instance) {
    parent.clearSelection();
    args.startIndex = 0;
    var rowRenderer = new RowRenderer(locator, null, parent);
    var rows = rowModelGenerator.generateRows(data, args);
    if (args.renderMovableContent) {
        virtualRenderer.vgenerator.movableCache[1] = rows;
        rows = parent.getMovableRowsObject();
    }
    else if (!args.renderFrozenRightContent && !args.renderMovableContent) {
        virtualRenderer.vgenerator.cache[1] = rows;
        rows = parent.getRowsObject();
    }
    else if (args.renderFrozenRightContent) {
        virtualRenderer.vgenerator.frozenRightCache[1] = rows;
        rows = parent.getFrozenRightRowsObject();
    }
    var hdr = !args.renderMovableContent && !args.renderFrozenRightContent
        ? parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody') : args.renderMovableContent
        ? parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody')
        : parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('tbody');
    hdr.innerHTML = '';
    for (var i = 0; i < parent.frozenRows; i++) {
        hdr.appendChild(rowRenderer.render(rows[i], parent.getColumns()));
        if (selectedIdx.indexOf(i) > -1) {
            rows[i].isSelected = true;
            for (var k = 0; k < rows[i].cells.length; k++) {
                rows[i].cells[k].isSelected = true;
            }
        }
    }
    if (args.renderMovableContent) {
        instance.mvblRows = virtualRenderer.vgenerator.movableCache[1];
    }
    else if (!args.renderMovableContent && !args.renderFrozenRightContent) {
        instance.frzRows = virtualRenderer.vgenerator.cache[1];
    }
    else if (args.renderFrozenRightContent) {
        instance.frRows = virtualRenderer.vgenerator.frozenRightCache[1];
    }
    args.renderMovableContent = !args.renderMovableContent && !args.renderFrozenRightContent;
    args.renderFrozenRightContent = parent.getFrozenMode() === 'Left-Right'
        && !args.renderMovableContent && !args.renderFrozenRightContent;
    if (args.renderMovableContent || args.renderFrozenRightContent) {
        renderFrozenRows(args, data, selectedIdx, parent, rowModelGenerator, locator, virtualRenderer, instance);
        if (!args.renderMovableContent && !args.renderFrozenRightContent) {
            args.isFrozenRowsRender = false;
        }
    }
}
/** @hidden */
export function splitCells(data, tableName, parent) {
    var rows = [];
    for (var i = 0; i < data.length; i++) {
        rows.push(extend({}, data[i]));
        rows[i].cells = splitFrozenRowObjectCells(parent, rows[i].cells, tableName);
    }
    return rows;
}
/** @hidden */
export function collectRows(tableName, virtualRenderer, parent) {
    var rows = [];
    var cache;
    if (tableName === 'frozen-left') {
        cache = virtualRenderer.vgenerator.cache;
    }
    else if (tableName === 'movable') {
        cache = virtualRenderer.vgenerator.movableCache;
    }
    else if (tableName === 'frozen-right') {
        cache = parent.getFrozenMode() === 'Right' ? virtualRenderer.vgenerator.cache : virtualRenderer.vgenerator.frozenRightCache;
    }
    var keys = Object.keys(cache);
    for (var i = 0; i < keys.length; i++) {
        rows = rows.concat(splitCells(cache[keys[i]], tableName, parent));
    }
    return rows;
}
/** @hidden */
export function setFreezeSelection(args, virtualRenderer) {
    var leftKeys = Object.keys(virtualRenderer.vgenerator.cache);
    var movableKeys = Object.keys(virtualRenderer.vgenerator.movableCache);
    var rightKeys = Object.keys(virtualRenderer.vgenerator.frozenRightCache);
    for (var i = 0; i < leftKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.cache[leftKeys[i]]);
    }
    for (var i = 0; i < movableKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.movableCache[movableKeys[i]]);
    }
    for (var i = 0; i < rightKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.frozenRightCache[rightKeys[i]]);
    }
}
/** @hidden */
export function selectFreezeRows(args, cache) {
    var rows = cache.filter(function (row) { return args.clearAll || args.uid === row.uid; });
    for (var j = 0; j < rows.length; j++) {
        rows[j].isSelected = args.set;
        var cells = rows[j].cells;
        for (var k = 0; k < cells.length; k++) {
            cells[k].isSelected = args.set;
        }
    }
}
/** @hidden */
export function appendContent(virtualRenderer, widthService, target, newChild, e) {
    virtualRenderer.appendContent(target, newChild, e);
    widthService.refreshFrozenScrollbar();
}
/** @hidden */
export function generateRows(virtualRenderer, data, notifyArgs, freezeRowGenerator, parent) {
    var virtualRows = virtualRenderer.vgenerator.generateRows(data, notifyArgs);
    var arr = [];
    arr = virtualRows.map(function (row) { return extend({}, row); });
    var rows = freezeRowGenerator.generateRows(data, notifyArgs, arr);
    if (parent.frozenRows && notifyArgs.requestType === 'delete' && parent.pageSettings.currentPage === 1) {
        rows = rows.slice(parent.frozenRows);
    }
    return rows;
}
/** @hidden */
export function getReorderedFrozenRows(args, virtualRenderer, parent, freezeRowGenerator, firstPageRecords) {
    var rows;
    var bIndex = args.virtualInfo.blockIndexes;
    var colIndex = args.virtualInfo.columnIndexes;
    var page = args.virtualInfo.page;
    args.virtualInfo.blockIndexes = [1, 2];
    args.virtualInfo.page = 1;
    if (!args.renderMovableContent) {
        args.virtualInfo.columnIndexes = [];
    }
    var virtualRows = virtualRenderer.vgenerator.generateRows(firstPageRecords, args);
    rows = splitReorderedRows(virtualRows, parent, freezeRowGenerator);
    args.virtualInfo.blockIndexes = bIndex;
    args.virtualInfo.columnIndexes = colIndex;
    args.virtualInfo.page = page;
    return rows.splice(0, parent.frozenRows);
}
/** @hidden */
export function splitReorderedRows(rows, parent, freezeRowGenerator) {
    var tableName = getFrozenTableName(parent, parent.tableIndex);
    for (var i = 0, len = rows.length; i < len; i++) {
        rows[i].cells = splitFrozenRowObjectCells(parent, rows[i].cells, tableName);
    }
    return rows;
}
/** @hidden */
export function isXaxis(virtualRenderer) {
    var value = false;
    if (virtualRenderer) {
        value = virtualRenderer.requestType === 'virtualscroll'
            && virtualRenderer.currentInfo.sentinelInfo.axis === 'X';
    }
    return value;
}
/** @hidden */
export function getHeaderCells(virtualRenderer, parent) {
    var content = isXaxis(virtualRenderer) ? parent.getMovableVirtualHeader() : parent.getHeaderContent();
    return content ? [].slice.call(content.querySelectorAll('.e-headercell:not(.e-stackedheadercell)')) : [];
}
/** @hidden */
export function getVirtualFreezeHeader(virtualRenderer, parent) {
    var headerTable;
    if (isXaxis(virtualRenderer)) {
        headerTable = parent.getMovableVirtualHeader().querySelector('.e-table');
    }
    else {
        headerTable = parent.getFrozenVirtualHeader().querySelector('.e-table');
    }
    return headerTable;
}
/** @hidden */
export function ensureFrozenCols(columns, parent) {
    var frozenCols = parent.columns.slice(0, parent.getFrozenColumns());
    columns = frozenCols.concat(columns);
    return columns;
}
/** @hidden */
export function setColGroup(colGroup, virtualRenderer, instance) {
    if (!isXaxis(virtualRenderer)) {
        if (!isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        instance.colgroup = colGroup;
    }
    return instance.colgroup;
}
/** @hidden */
export function setCache(instance, index) {
    if (instance.virtualRenderer.vgenerator.cache[1]) {
        instance.virtualRenderer.vgenerator.cache[1][index] = instance.frzRows[index];
    }
    else {
        instance.virtualRenderer.vgenerator.cache[1] = instance.frzRows;
    }
    if (instance.virtualRenderer.vgenerator.movableCache[1]) {
        instance.virtualRenderer.vgenerator.movableCache[1][index] = instance.mvblRows[index];
    }
    else {
        instance.virtualRenderer.vgenerator.movableCache[1] = instance.mvblRows;
    }
}
/** @hidden */
export function setDebounce(parent, virtualRenderer, scrollbar, mCont) {
    var debounceEvent = (parent.dataSource instanceof DataManager && !parent.dataSource.dataSource.offline);
    var opt = {
        container: virtualRenderer.content, pageHeight: virtualRenderer.getBlockHeight() * 2, debounceEvent: debounceEvent,
        axes: parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y'], scrollbar: scrollbar,
        movableContainer: mCont
    };
    virtualRenderer.observer = new InterSectionObserver(virtualRenderer.virtualEle.wrapper, opt, virtualRenderer.virtualEle.movableWrapper);
}
/**
 * ColumnVirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
var ColumnVirtualFreezeRenderer = /** @class */ (function (_super) {
    __extends(ColumnVirtualFreezeRenderer, _super);
    function ColumnVirtualFreezeRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        /** @hidden */
        _this.frRows = [];
        /** @hidden */
        _this.frzRows = [];
        /** @hidden */
        _this.mvblRows = [];
        _this.serviceLoc = locator;
        _this.eventListener('on');
        _this.rowModelGenerator = new RowModelGenerator(_this.parent);
        return _this;
    }
    ColumnVirtualFreezeRenderer.prototype.actionComplete = function (args) {
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            for (var i = 0; i < this.parent.frozenRows; i++) {
                if (this.virtualRenderer.vgenerator.frozenRightCache[1]) {
                    this.virtualRenderer.vgenerator.frozenRightCache[1][i] = this.frRows.length ? this.frRows[i] : this.frzRows[i];
                }
                else {
                    this.virtualRenderer.vgenerator.frozenRightCache[1] = this.frRows.length ? this.frRows : this.frzRows;
                    break;
                }
                setCache(this, i);
            }
        }
    };
    ColumnVirtualFreezeRenderer.prototype.eventListener = function (action) {
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent[action](events.refreshVirtualFrozenRows, this.refreshVirtualFrozenRows, this);
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.setFreezeSelection, this.setFreezeSelection, this);
    };
    ColumnVirtualFreezeRenderer.prototype.refreshVirtualFrozenRows = function (args) {
        var _this = this;
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            args.isFrozenRowsRender = true;
            var query = this.parent.renderModule.data.generateQuery(true).clone();
            query.page(1, this.parent.pageSettings.pageSize);
            var selectedIdx_2 = this.parent.getSelectedRowIndexes();
            this.parent.renderModule.data.getData({}, query).then(function (e) {
                renderFrozenRows(args, e.result, selectedIdx_2, _this.parent, _this.rowModelGenerator, _this.serviceLoc, _this.virtualRenderer, _this);
            });
        }
    };
    ColumnVirtualFreezeRenderer.prototype.setFreezeSelection = function (args) {
        setFreezeSelection(args, this.virtualRenderer);
    };
    ColumnVirtualFreezeRenderer.prototype.getVirtualData = function (data) {
        this.virtualRenderer.getVirtualData(data);
    };
    ColumnVirtualFreezeRenderer.prototype.renderNextFrozentPart = function (e) {
        if (this.parent.getFrozenMode() === 'Left' || this.parent.getFrozenMode() === 'Right') {
            if (this.parent.tableIndex === 1) {
                e.renderMovableContent = true;
                this.refreshContentRows(extend({}, e));
            }
        }
        if (this.parent.getFrozenMode() === 'Left-Right') {
            if (this.parent.tableIndex === 1 || this.parent.tableIndex === 2) {
                e.renderMovableContent = this.parent.tableIndex === 1;
                e.renderFrozenRightContent = this.parent.tableIndex === 2;
                this.refreshContentRows(extend({}, e));
            }
        }
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.renderTable = function () {
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = this.serviceLoc.getService('rendererFactory')
            .getRenderer(RenderType.Header).virtualHdrRenderer;
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        _super.prototype.renderTable.call(this);
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        var frozenRightCont = this.getFrozenRightContent();
        var frzCont = this.getFrozenContent();
        var movableCont = this.getMovableContent();
        if (this.parent.getFrozenMode() === 'Right') {
            frzCont = frozenRightCont;
        }
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = this.getPanel().querySelector('.e-content');
        this.virtualRenderer.virtualEle.content.style.overflowX = 'hidden';
        var minHeight = this.parent.height;
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        this.renderVirtualFrozenLeft(frzCont, movableCont);
        this.renderVirtualFrozenRight(frzCont, movableCont);
        this.renderVirtualFrozenLeftRight(frzCont, movableCont, frozenRightCont);
        this.virtualRenderer.virtualEle.table = this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    };
    ColumnVirtualFreezeRenderer.prototype.renderVirtualFrozenLeft = function (frzCont, movableCont) {
        if (this.parent.getFrozenMode() === 'Left') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
        }
    };
    ColumnVirtualFreezeRenderer.prototype.renderVirtualFrozenRight = function (frzCont, movableCont) {
        if (this.parent.getFrozenMode() === 'Right') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
        }
    };
    ColumnVirtualFreezeRenderer.prototype.renderVirtualFrozenLeftRight = function (frzCont, movableCont, frozenRightCont) {
        if (this.parent.getFrozenMode() === 'Left-Right') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(frozenRightCont);
        }
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.appendContent = function (target, newChild, e) {
        appendContent(this.virtualRenderer, this.widthService, target, newChild, e);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.generateRows = function (data, e) {
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        return generateRows(this.virtualRenderer, data, e, this.freezeRowGenerator, this.parent);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getRowByIndex = function (index) {
        return this.virtualRenderer.getRowByIndex(index);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getFrozenRightRowByIndex = function (index) {
        return this.virtualRenderer.getFrozenRightVirtualRowByIndex(index);
    };
    ColumnVirtualFreezeRenderer.prototype.collectRows = function (tableName) {
        return collectRows(tableName, this.virtualRenderer, this.parent);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getMovableRowByIndex = function (index) {
        return this.virtualRenderer.getMovableVirtualRowByIndex(index);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getFrozenRightRows = function () {
        return this.collectRows('frozen-right');
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getMovableRows = function () {
        return this.collectRows('movable');
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getColGroup = function () {
        var mCol = this.parent.getMovableVirtualContent();
        return isXaxis(this.virtualRenderer) ? mCol.querySelector('colgroup') : this.colgroup;
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getRows = function () {
        return this.collectRows(this.parent.getFrozenMode() === 'Right' ? 'frozen-right' : 'frozen-left');
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getReorderedFrozenRows = function (args) {
        return getReorderedFrozenRows(args, this.virtualRenderer, this.parent, this.freezeRowGenerator, this.firstPageRecords);
    };
    ColumnVirtualFreezeRenderer.prototype.getHeaderCells = function () {
        return getHeaderCells(this.virtualRenderer, this.parent);
    };
    ColumnVirtualFreezeRenderer.prototype.isXaxis = function () {
        return isXaxis(this.virtualRenderer);
    };
    ColumnVirtualFreezeRenderer.prototype.getVirtualFreezeHeader = function () {
        return getVirtualFreezeHeader(this.virtualRenderer, this.parent);
    };
    /**
     * @hidden
     */
    ColumnVirtualFreezeRenderer.prototype.getRowObjectByIndex = function (index) {
        return this.virtualRenderer.getRowObjectByIndex(index);
    };
    ColumnVirtualFreezeRenderer.prototype.ensureFrozenCols = function (columns) {
        return ensureFrozenCols(columns, this.parent);
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    ColumnVirtualFreezeRenderer.prototype.setColGroup = function (colGroup) {
        return setColGroup(colGroup, this.virtualRenderer, this);
    };
    return ColumnVirtualFreezeRenderer;
}(ColumnFreezeContentRenderer));
export { ColumnVirtualFreezeRenderer };
