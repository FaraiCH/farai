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
import { isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { formatUnit } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { colGroupRefresh, columnWidthChanged, scroll, columnVisibilityChanged, refreshFooterRenderer } from '../base/constant';
import { ContentRender } from './content-renderer';
import { RowRenderer } from './row-renderer';
import { SummaryModelGenerator } from '../services/summary-model-generator';
import { renderMovable, calculateAggregate, iterateExtend } from '../base/util';
import { DataUtil } from '@syncfusion/ej2-data';
/**
 * Footer module is used to render grid content
 * @hidden
 */
var FooterRenderer = /** @class */ (function (_super) {
    __extends(FooterRenderer, _super);
    function FooterRenderer(gridModule, serviceLocator) {
        var _this = _super.call(this, gridModule, serviceLocator) || this;
        _this.aggregates = {};
        _this.parent = gridModule;
        _this.locator = serviceLocator;
        _this.modelGenerator = new SummaryModelGenerator(_this.parent);
        _this.addEventListener();
        return _this;
    }
    /**
     * The function is used to render grid footer div
     */
    FooterRenderer.prototype.renderPanel = function () {
        var div = this.parent.createElement('div', { className: 'e-gridfooter' });
        var innerDiv = this.parent.createElement('div', { className: 'e-summarycontent' });
        var movableContent = innerDiv;
        if (this.parent.isFrozenGrid()) {
            var fDiv = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-left-footercontent' });
            var mDiv = this.parent.createElement('div', { className: 'e-movablefootercontent' });
            var frDiv = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-right-footercontent' });
            if (this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount()) {
                innerDiv.appendChild(fDiv);
                this.frozenContent = fDiv;
            }
            innerDiv.appendChild(mDiv);
            this.movableContent = mDiv;
            movableContent = mDiv;
            if (this.parent.getFrozenRightColumnsCount()) {
                innerDiv.appendChild(frDiv);
                this.frozenRightContent = frDiv;
            }
        }
        if (Browser.isDevice) {
            movableContent.style.overflowX = 'scroll';
        }
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (this.parent.getPager() != null) {
            this.parent.element.insertBefore(div, this.parent.getPager());
        }
        else {
            this.parent.element.appendChild(div);
        }
    };
    /**
     * The function is used to render grid footer table
     */
    FooterRenderer.prototype.renderTable = function () {
        var frzCols = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        var innerDiv = this.createContentTable('_footer_table');
        var table = innerDiv.querySelector('.e-table');
        var tFoot = this.parent.createElement('tfoot');
        table.appendChild(tFoot);
        if (this.parent.isFrozenGrid()) {
            var freezeTable = table.cloneNode(true);
            var frTable = table.cloneNode(true);
            if (frzCols) {
                this.frozenContent.appendChild(freezeTable);
                this.freezeTable = freezeTable;
            }
            if (this.parent.getFrozenRightColumnsCount()) {
                remove(frTable.querySelector('colgroup'));
                var hdr = this.parent.getHeaderContent().querySelector('.e-frozen-right-header');
                var frCol = (hdr.querySelector('colgroup').cloneNode(true));
                frTable.insertBefore(frCol, frTable.querySelector('tbody'));
                this.frozenRightContent.appendChild(frTable);
                this.frTable = frTable;
            }
            this.movableContent.appendChild(table);
            remove(table.querySelector('colgroup'));
            var colGroup = ((this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup')).cloneNode(true));
            table.insertBefore(colGroup, table.querySelector('tbody'));
            this.setColGroup(colGroup);
        }
        this.setTable(table);
    };
    FooterRenderer.prototype.renderSummaryContent = function (e, table, cStart, cEnd) {
        var input = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
        var summaries = this.modelGenerator.getData();
        var dummies = isNullOrUndefined(cStart) ? this.modelGenerator.getColumns() :
            this.modelGenerator.getColumns(cStart, cEnd);
        var rows = isNullOrUndefined(cStart) ? this.modelGenerator.generateRows(input, e || this.aggregates) :
            this.modelGenerator.generateRows(input, e || this.aggregates, cStart, cEnd);
        var fragment = document.createDocumentFragment();
        var rowrenderer = new RowRenderer(this.locator, null, this.parent);
        rowrenderer.element = this.parent.createElement('TR', { className: 'e-summaryrow' });
        for (var srow = 0, len = summaries.length; srow < len; srow++) {
            var row = rows[srow];
            if (!row) {
                continue;
            }
            var tr = rowrenderer.render(row, dummies);
            fragment.appendChild(tr);
        }
        table.tFoot.appendChild(fragment);
        this.aggregates = !isNullOrUndefined(e) ? e : this.aggregates;
    };
    FooterRenderer.prototype.refresh = function (e) {
        var frzCols = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        var movable = this.parent.getMovableColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        if (this.parent.isFrozenGrid()) {
            remove(this.getPanel());
            this.renderPanel();
            this.renderTable();
            if (frzCols) {
                this.freezeTable.tFoot.innerHTML = '';
                this.renderSummaryContent(e, this.freezeTable, 0, frzCols);
            }
        }
        this.getTable().tFoot.innerHTML = '';
        this.renderSummaryContent(e, this.getTable(), frzCols, right ? frzCols + movable : undefined);
        if (this.parent.getFrozenRightColumnsCount()) {
            this.frTable.tFoot.innerHTML = '';
            this.renderSummaryContent(e, this.frTable, frzCols + movable, frzCols + movable + right);
            var movableLastCell = [].slice.call(this.getTable().querySelectorAll('.e-lastsummarycell'));
            if (movableLastCell.length) {
                for (var i = 0; i < movableLastCell.length; i++) {
                    movableLastCell[i].style.borderRight = '0px';
                }
            }
        }
        // check freeze content have no row case
        if (this.parent.isFrozenGrid()) {
            var movableCnt = [].slice.call(this.parent.element.querySelector('.e-movablefootercontent')
                .querySelectorAll('.e-summaryrow'));
            var frozenCnt = void 0;
            if (frzCols) {
                frozenCnt = [].slice.call(this.parent.element.querySelector('.e-frozen-left-footercontent')
                    .querySelectorAll('.e-summaryrow'));
                this.refreshHeight(frozenCnt, movableCnt);
                var frozenDiv = this.frozenContent;
                if (!frozenDiv.offsetHeight) {
                    frozenDiv.style.height = this.getTable().offsetHeight + 'px';
                }
            }
            if (right) {
                var frCnt = [].slice.call(this.parent.element.querySelector('.e-frozen-right-footercontent')
                    .querySelectorAll('.e-summaryrow'));
                this.refreshHeight(frCnt, movableCnt);
                if (frozenCnt) {
                    this.refreshHeight(frCnt, frozenCnt);
                }
                var frDiv = this.frTable;
                if (!frDiv.offsetHeight) {
                    frDiv.style.height = this.getTable().offsetHeight + 'px';
                }
            }
            if (this.parent.allowResizing) {
                this.updateFooterTableWidth(this.getTable());
            }
        }
        this.onScroll();
    };
    FooterRenderer.prototype.refreshHeight = function (frozenCnt, movableCnt) {
        for (var i = 0; i < frozenCnt.length; i++) {
            var frozenHeight = frozenCnt[i].getBoundingClientRect().height;
            var movableHeight = movableCnt[i].getBoundingClientRect().height;
            if (frozenHeight < movableHeight) {
                frozenCnt[i].classList.remove('e-hide');
                frozenCnt[i].style.height = movableHeight + 'px';
            }
            else if (frozenHeight > movableHeight) {
                movableCnt[i].classList.remove('e-hide');
                movableCnt[i].style.height = frozenHeight + 'px';
            }
        }
    };
    FooterRenderer.prototype.refreshCol = function () {
        // frozen table 
        var mheaderCol;
        var fheaderCol = mheaderCol = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
        if (this.parent.getFrozenColumns()) {
            var isXaxis = this.parent.enableColumnVirtualization && this.parent.contentModule.isXaxis();
            if (isXaxis) {
                mheaderCol = this.parent.getMovableVirtualHeader().querySelector('colgroup').cloneNode(true);
            }
            else {
                mheaderCol = renderMovable(fheaderCol, this.parent.getFrozenColumns(), this.parent);
                this.freezeTable.replaceChild(fheaderCol, this.freezeTable.querySelector('colGroup'));
            }
        }
        this.getTable().replaceChild(mheaderCol, this.getColGroup());
        this.setColGroup(mheaderCol);
    };
    FooterRenderer.prototype.onWidthChange = function (args) {
        this.getColFromIndex(args.index).style.width = formatUnit(args.width);
        if (this.parent.allowResizing && args.module === 'resize') {
            this.updateFooterTableWidth(this.getTable());
        }
    };
    FooterRenderer.prototype.onScroll = function (e) {
        if (e === void 0) { e = {
            left: this.parent.isFrozenGrid() ? this.parent.getContent().querySelector('.e-movablecontent').scrollLeft :
                this.parent.getContent().firstChild.scrollLeft
        }; }
        this.getTable().parentElement.scrollLeft = e.left;
    };
    FooterRenderer.prototype.getColFromIndex = function (index) {
        var fCol = this.parent.getFrozenColumns();
        fCol = fCol && this.parent.isRowDragable() ? fCol + 1 : fCol;
        if (fCol && fCol > index) {
            return this.freezeTable.querySelector('colGroup').children[index];
        }
        return this.getColGroup().children[index - fCol];
    };
    FooterRenderer.prototype.columnVisibilityChanged = function () {
        this.refresh();
    };
    FooterRenderer.prototype.addEventListener = function () {
        this.parent.on(colGroupRefresh, this.refreshCol, this);
        this.parent.on(columnWidthChanged, this.onWidthChange, this);
        this.parent.on(scroll, this.onScroll, this);
        this.parent.on(columnVisibilityChanged, this.columnVisibilityChanged, this);
        this.parent.on(refreshFooterRenderer, this.refreshFooterRenderer, this);
    };
    FooterRenderer.prototype.removeEventListener = function () {
        this.parent.off(colGroupRefresh, this.refreshCol);
        this.parent.off(columnWidthChanged, this.onWidthChange);
        this.parent.off(scroll, this.onScroll);
        this.parent.off(columnVisibilityChanged, this.columnVisibilityChanged);
        this.parent.off(refreshFooterRenderer, this.refreshFooterRenderer);
    };
    FooterRenderer.prototype.updateFooterTableWidth = function (tFoot) {
        var tHead = this.parent.getHeaderTable();
        if (tHead && tFoot) {
            tFoot.style.width = tHead.style.width;
        }
    };
    FooterRenderer.prototype.refreshFooterRenderer = function (editedData) {
        var aggregates = this.onAggregates(editedData);
        this.refresh(aggregates);
    };
    FooterRenderer.prototype.getIndexByKey = function (data, ds) {
        var key = this.parent.getPrimaryKeyFieldNames()[0];
        for (var i = 0; i < ds.length; i++) {
            if (ds[i][key] === data[key]) {
                return i;
            }
        }
        return -1;
    };
    FooterRenderer.prototype.onAggregates = function (editedData) {
        editedData = editedData instanceof Array ? editedData : [];
        var field = this.parent.getPrimaryKeyFieldNames()[0];
        var dataSource = [];
        var isModified = false;
        var batchChanges = {};
        var gridData = 'dataSource';
        var changedRecords = 'changedRecords';
        var addedRecords = 'addedRecords';
        var deletedRecords = 'deletedRecords';
        var currentViewData = this.parent.dataSource instanceof Array ?
            this.parent.dataSource : this.parent.dataSource[gridData].json.length
            ? this.parent.dataSource[gridData].json : this.parent.getCurrentViewRecords();
        if (this.parent.editModule) {
            batchChanges = this.parent.editModule.getBatchChanges();
        }
        if (Object.keys(batchChanges).length) {
            for (var i = 0; i < currentViewData.length; i++) {
                isModified = false;
                if (batchChanges[changedRecords].length && this.getIndexByKey(currentViewData[i], batchChanges[changedRecords]) > -1) {
                    isModified = true;
                    dataSource.push(batchChanges[changedRecords][this.getIndexByKey(currentViewData[i], batchChanges[changedRecords])]);
                }
                if (batchChanges[deletedRecords].length && this.getIndexByKey(currentViewData[i], batchChanges[deletedRecords]) > -1) {
                    isModified = true;
                }
                else if (!isModified) {
                    dataSource.push(currentViewData[i]);
                }
            }
            if (batchChanges[addedRecords].length) {
                for (var i = 0; i < batchChanges[addedRecords].length; i++) {
                    dataSource.push(batchChanges[addedRecords][i]);
                }
            }
        }
        else {
            if (editedData.length) {
                var data = iterateExtend(currentViewData);
                dataSource = data.map(function (item) {
                    var idVal = DataUtil.getObject(field, item);
                    var value;
                    var hasVal = editedData.some(function (cItem) {
                        value = cItem;
                        return idVal === DataUtil.getObject(field, cItem);
                    });
                    return hasVal ? value : item;
                });
            }
            else {
                dataSource = currentViewData;
            }
        }
        var eData = editedData;
        if ((eData.type && eData.type === 'cancel')) {
            dataSource = currentViewData;
        }
        var aggregate = {};
        var agrVal;
        var aggregateRows = this.parent.aggregates;
        for (var i = 0; i < aggregateRows.length; i++) {
            for (var j = 0; j < aggregateRows[i].columns.length; j++) {
                var data = [];
                var type = aggregateRows[i].columns[j].type.toString();
                data = dataSource;
                agrVal = calculateAggregate(type, data, aggregateRows[i].columns[j], this.parent);
                aggregate[aggregateRows[i].columns[j].field + ' - ' + type.toLowerCase()] = agrVal;
            }
        }
        var result = {
            result: dataSource,
            count: dataSource.length,
            aggregates: aggregate
        };
        return result;
    };
    return FooterRenderer;
}(ContentRender));
export { FooterRenderer };
