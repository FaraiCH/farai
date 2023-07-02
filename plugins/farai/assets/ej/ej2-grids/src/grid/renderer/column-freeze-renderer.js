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
import { remove, addClass, isNullOrUndefined, extend, setStyleAttribute } from '@syncfusion/ej2-base';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import * as events from '../base/constant';
import { wrap, parentsUntil } from '../base/util';
import { Input } from '@syncfusion/ej2-inputs';
/**
 * ColumnFreezeHeaderRenderer is used to freeze the columns header at right and left
 * @hidden
 */
var ColumnFreezeHeaderRenderer = /** @class */ (function (_super) {
    __extends(ColumnFreezeHeaderRenderer, _super);
    function ColumnFreezeHeaderRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.addEventListener();
        return _this;
    }
    ColumnFreezeHeaderRenderer.prototype.addEventListener = function () {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
        this.parent.on(events.refreshFrozenColumns, this.refreshFrozenColumns, this);
        this.parent.on(events.setReorderDestinationElement, this.setReorderElement, this);
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
    };
    ColumnFreezeHeaderRenderer.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.freezeRender, this.refreshFreeze);
        this.parent.off(events.refreshFrozenColumns, this.refreshFrozenColumns);
        this.parent.off(events.setReorderDestinationElement, this.setReorderElement);
        this.parent.off(events.columnVisibilityChanged, this.setVisible);
    };
    ColumnFreezeHeaderRenderer.prototype.setReorderElement = function (args) {
        this.destEle = args.ele;
    };
    ColumnFreezeHeaderRenderer.prototype.refreshFrozenColumns = function (args) {
        if (!args.parent) {
            this.parent.setProperties({ columns: args.columns }, true);
        }
        var isFrozenLeft = parentsUntil(this.destEle, 'e-frozen-left-header');
        var isFrozenRight = parentsUntil(this.destEle, 'e-frozen-right-header');
        var left = this.parent.getFrozenLeftColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        args.column.freeze = null;
        if (isFrozenLeft) {
            args.column.freeze = 'Left';
        }
        else if (isFrozenRight) {
            args.column.freeze = 'Right';
        }
        this.parent.setFrozenCount();
        args.cancel = left !== this.parent.getFrozenLeftColumnsCount() || right !== this.parent.getFrozenRightColumnsCount();
        if (args.cancel) {
            this.parent.refreshColumns();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.setWrapHeight = function (fRows, mRows, isModeChg, isContReset, isStackedHdr, frRows) {
        var fRowHgt;
        var mRowHgt;
        var frRowHgt;
        var isWrap = this.parent.allowTextWrap;
        var tBody = this.parent.getHeaderContent().querySelector('tbody');
        var wrapMode = this.parent.textWrapSettings.wrapMode;
        var tHead = this.parent.getHeaderContent().querySelector('thead');
        var height = [];
        var width = [];
        var rightHeight = [];
        for (var i = 0, len = fRows.length; i < len; i++) { //separate loop for performance issue 
            if (!isNullOrUndefined(fRows[i]) && !isNullOrUndefined(mRows[i])) {
                if (frRows) {
                    rightHeight[i] = frRows[i].getBoundingClientRect().height;
                }
                width[i] = mRows[i].getBoundingClientRect().height;
                height[i] = fRows[i].getBoundingClientRect().height; //https://pagebuildersandwich.com/increased-plugins-performance-200/
            }
        }
        for (var i = 0, len = fRows.length; i < len; i++) {
            if (isModeChg && (((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i]))) || (wrapMode === 'Header' && isContReset)) || isStackedHdr) {
                if (frRows[i]) {
                    frRows[i].style.height = null;
                }
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            frRowHgt = rightHeight[i] ? rightHeight[i] : 0;
            var maxHeight = Math.max(fRowHgt, mRowHgt, frRowHgt);
            if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < maxHeight) ||
                (!isWrap && fRowHgt < maxHeight) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === false))) {
                fRows[i].style.height = maxHeight + 'px';
            }
            if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && maxHeight > mRowHgt) ||
                (!isWrap && maxHeight > mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === true))) {
                mRows[i].style.height = maxHeight + 'px';
            }
            if (frRows && !isNullOrUndefined(frRows[i]) && frRows[i].childElementCount && ((isWrap && maxHeight > frRowHgt) ||
                (!isWrap && maxHeight > frRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === true))) {
                frRows[i].style.height = maxHeight + 'px';
            }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.refreshHeight = function (obj) {
        var isLeftRight = this.parent.getFrozenMode() === 'Left-Right';
        var fRows;
        var frRows;
        var mRows;
        var frHdr = this.getFrozenRightHeader();
        var fHdr = this.parent.getHeaderContent().querySelector('.e-frozenheader');
        var cont = this.parent.getContent();
        var mHdr = this.getMovableHeader();
        var hdrClassList = this.parent.getHeaderContent().querySelector('.e-headercontent').classList;
        var wrapMode = this.parent.textWrapSettings.wrapMode;
        if (obj.case === 'textwrap') {
            if (wrapMode !== 'Header' || obj.isModeChg) {
                if (isLeftRight) {
                    frRows = cont.querySelector('.e-frozen-right-content').querySelectorAll('tr');
                }
                mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr');
                fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr');
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true, false, frRows);
            }
            if (wrapMode === 'Content' && this.parent.allowTextWrap) {
                hdrClassList.add('e-wrap');
            }
            else {
                hdrClassList.remove('e-wrap');
            }
            if (wrapMode === 'Both' || obj.isModeChg) {
                if (isLeftRight) {
                    frRows = frHdr.querySelectorAll('tr');
                }
                fRows = fHdr.querySelectorAll('tr');
                mRows = mHdr.querySelectorAll('tr');
            }
            else {
                if (isLeftRight) {
                    frRows = frHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr');
                }
                fRows = fHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr');
                mRows = mHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr');
            }
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1, frRows);
            }
            this.refreshStackedHdrHgt();
        }
        else if (obj.case === 'refreshHeight') {
            mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr');
            fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr');
            if (isLeftRight) {
                frRows = cont.querySelector('.e-frozen-right-content').querySelectorAll('tr');
            }
            this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false, frRows);
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                if (isLeftRight) {
                    frRows = frHdr.querySelectorAll('tr');
                }
                fRows = fHdr.querySelectorAll('tr');
                mRows = mHdr.querySelectorAll('tr');
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false, frRows);
            }
        }
    };
    /**
     * Function to hide header table column based on visible property
     * @param  {Column[]} columns?
     */
    ColumnFreezeHeaderRenderer.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var displayVal;
        var idx;
        var left = this.parent.getFrozenLeftColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        var movable = this.parent.getMovableColumnsCount();
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            if (column.freeze === 'Left' || column.freeze === 'Right') {
                if (left && !right) {
                    var leftColGrp = gObj.getHeaderContent().querySelector('.e-frozen-left-header').querySelector('colgroup');
                    setStyleAttribute(leftColGrp.children[idx], { 'display': displayVal });
                }
                else if (!left && right) {
                    var rightColGrp = gObj.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('colgroup');
                    setStyleAttribute(rightColGrp.children[idx - movable], { 'display': displayVal });
                }
            }
            else {
                var mTblColGrp = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup');
                setStyleAttribute(mTblColGrp.children[idx - left], { 'display': displayVal });
            }
        }
        this.refreshUI();
    };
    ColumnFreezeHeaderRenderer.prototype.filterRenderer = function (ele, frozenColumn, total) {
        return _super.prototype.filterRenderer.call(this, ele, frozenColumn, total);
    };
    ColumnFreezeHeaderRenderer.prototype.refreshUI = function () {
        var frTbody;
        var tbody = this.getMovableHeader().querySelector('tbody');
        remove(this.getMovableHeader().querySelector('table'));
        if (this.parent.getFrozenMode() === 'Left-Right') {
            frTbody = this.getFrozenRightHeader().querySelector('tbody');
            remove(this.getFrozenRightHeader().querySelector('table'));
        }
        _super.prototype.refreshFrozenLeftUI.call(this);
        this.rfshMovable();
        this.getMovableHeader().querySelector('tbody').innerHTML = tbody.innerHTML;
        if (frTbody) {
            this.getFrozenRightHeader().querySelector('tbody').innerHTML = frTbody.innerHTML;
        }
        this.updateColgroup();
        this.widthService.setWidthToColumns();
        this.parent.notify(events.colGroupRefresh, {});
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.getMovableHeader().querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        var mTbl = this.parent.getContent().querySelector('.e-movablecontent').querySelector('.e-table');
        remove(mTbl.querySelector('colgroup'));
        var mColGroup = (this.getMovableHeader().querySelector('colgroup').cloneNode(true));
        mTbl.insertBefore(mColGroup, mTbl.querySelector('tbody'));
        if (frTbody) {
            var frtbl = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.e-table');
            remove(frtbl.querySelector('colgroup'));
            var frtblColGroup = (this.getFrozenRightHeader().querySelector('colgroup').cloneNode(true));
            frtbl.insertBefore(frtblColGroup, frtbl.querySelector('tbody'));
        }
        this.widthService.refreshFrozenScrollbar();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    };
    ColumnFreezeHeaderRenderer.prototype.refreshFreeze = function (obj) {
        var left = this.parent.getFrozenLeftColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        var movable = this.parent.getMovableColumnsCount();
        if (obj.case === 'filter') {
            var filterRow = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                var index = left ? left : 0;
                var total = left ? (left + movable) : left + movable;
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.filterRenderer(filterRow, index, total));
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    var ele = [].slice.call(this.getMovableHeader().
                        querySelectorAll('thead .e-filterbarcell .e-input'));
                    this.getFrozenRightHeader().querySelector('thead').appendChild(this.filterRenderer(filterRow, left, left + right));
                    this.adjudtFilterBarCell(ele);
                }
                var elements = [].slice.call(this.getMovableHeader().
                    querySelectorAll('thead .e-filterbarcell .e-input'));
                this.adjudtFilterBarCell(elements);
            }
        }
        else if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            this.refreshHeight(obj);
            this.parent.contentModule.refreshScrollOffset();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.updateFrozenColGroup = function (cols, colGroup) {
        if (cols && cols.visible === false) {
            setStyleAttribute(colGroup, { 'display': 'none' });
        }
    };
    ColumnFreezeHeaderRenderer.prototype.adjudtFilterBarCell = function (elements) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var elem = elements_1[_i];
            var args = {
                element: elem, floatLabelType: 'Never',
                properties: {
                    enableRtl: this.parent.enableRtl, showClearButton: true
                }
            };
            Input.bindInitialEvent(args);
        }
    };
    ColumnFreezeHeaderRenderer.prototype.renderPanel = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.renderPanel.call(this);
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderLeftWithRightFrozenPanel();
            }
        }
        else {
            this.renderRightFrozenPanelAlone();
        }
        this.getPanel().firstChild.style.display = 'flex';
        this.getMovableHeader().style.flex = '1';
    };
    ColumnFreezeHeaderRenderer.prototype.renderTable = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.renderTable.call(this);
        }
        else {
            this.renderFrozenRightTableAlone();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.rfshMovable = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.rfshMovable.call(this);
            if (this.parent.getFrozenRightColumnsCount()) {
                var rows = this.rows;
                this.getFrozenRightHeader().appendChild(this.createTable());
                this.refreshStackedHdrHgt();
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { renderFrozenRightContent: true } });
                this.rows = rows;
            }
        }
        else {
            this.getFrozenRightHeader().appendChild(this.getTable());
            this.getMovableHeader().appendChild(this.createTable());
            this.refreshStackedHdrHgt();
            this.addMovableFirstCls();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.refreshStackedHdrHgt = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.refreshStackedHdrHgt.call(this);
            if (this.parent.getFrozenRightColumnsCount()) {
                this.refreshFrozenRightStackedHdrHgt();
            }
        }
        else {
            this.refreshFrozenRightStackedHdrHgt();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.refreshFrozenRightStackedHdrHgt = function () {
        var fRowSpan;
        var mRowSpan;
        var frTr = this.getFrozenRightHeader().querySelectorAll('.e-columnheader');
        var mTr = this.getMovableHeader().querySelectorAll('.e-columnheader');
        for (var i = 0, len = frTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(frTr[i]);
            mRowSpan = this.getRowSpan(mTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, frTr[i], mTr);
            }
        }
    };
    /**
     * @hidden
     */
    ColumnFreezeHeaderRenderer.prototype.updateColgroup = function () {
        this.updateMovableColGroup();
        if (this.parent.getFrozenLeftColumnsCount()) {
            this.updateFrozenLeftColGroup();
        }
        if (this.parent.getFrozenRightColumnsCount()) {
            this.updateFrozenRightColGroup();
        }
    };
    ColumnFreezeHeaderRenderer.prototype.renderRightFrozenPanelAlone = function () {
        var mDiv = this.parent.element.querySelector('.e-movableheader');
        var fRightDiv = this.parent.element.querySelector('.e-frozen-right-header');
        _super.prototype.renderFrozenRightPanel.call(this);
        if (isNullOrUndefined(fRightDiv)) {
            mDiv = this.parent.createElement('div', { className: 'e-movableheader' });
            fRightDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-right-header' });
            this.getPanel().querySelector('.e-headercontent').appendChild(mDiv);
            this.getPanel().querySelector('.e-headercontent').appendChild(fRightDiv);
        }
        _super.prototype.setMovableHeader.call(this, mDiv);
        this.setFrozenRightHeader(fRightDiv);
    };
    ColumnFreezeHeaderRenderer.prototype.renderLeftWithRightFrozenPanel = function () {
        var fRightDiv = this.parent.element.querySelector('.e-frozen-right-header');
        _super.prototype.renderFrozenRightPanel.call(this);
        if (isNullOrUndefined(fRightDiv)) {
            fRightDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-right-header' });
            this.getPanel().querySelector('.e-headercontent').appendChild(fRightDiv);
        }
        this.setFrozenRightHeader(fRightDiv);
    };
    ColumnFreezeHeaderRenderer.prototype.renderFrozenRightTableAlone = function () {
        _super.prototype.renderFrozenRightTable.call(this);
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    };
    ColumnFreezeHeaderRenderer.prototype.updateFrozenLeftColGroup = function () {
        var leftColGroup = this.getFrozenHeader().querySelector('colgroup').children;
        var start = this.parent.isRowDragable() ? 1 : 0;
        var count = this.parent.isRowDragable() ? this.parent.getFrozenLeftColumnsCount() + 1
            : this.parent.getFrozenLeftColumnsCount();
        for (var i = start; i < leftColGroup.length; i++) {
            if (i >= count) {
                remove(leftColGroup[i]);
                i--;
            }
        }
    };
    ColumnFreezeHeaderRenderer.prototype.updateMovableColGroup = function () {
        var movableColGroup = this.getMovableHeader().querySelector('colgroup').children;
        if (this.parent.isRowDragable()) {
            remove(movableColGroup[0]);
        }
        var length = movableColGroup.length;
        var left = this.parent.getFrozenLeftColumnsCount();
        var movable = this.parent.getMovableColumnsCount();
        var k = 0;
        for (var i = 0; i < length; i++, k++) {
            if (i < left || i >= left + movable) {
                remove(movableColGroup[k]);
                k--;
            }
        }
    };
    ColumnFreezeHeaderRenderer.prototype.updateFrozenRightColGroup = function () {
        var isDraggable = this.parent.isRowDragable();
        var rightColumns = this.parent.getFrozenRightColumns();
        var rightColGroup = this.getFrozenRightHeader().querySelector('colgroup').children;
        if (this.parent.getFrozenMode() === 'Left-Right' && isDraggable) {
            remove(rightColGroup[0]);
        }
        var length = rightColGroup.length;
        var left = this.parent.getFrozenLeftColumnsCount();
        var movable = this.parent.getMovableColumnsCount();
        var k = 0;
        for (var i = 0; i < length; i++) {
            if (i < left + movable) {
                remove(rightColGroup[0]);
            }
            else {
                this.updateFrozenColGroup(rightColumns[k], rightColGroup[k]);
                k++;
            }
        }
    };
    ColumnFreezeHeaderRenderer.prototype.setFrozenRightHeader = function (ele) {
        this.frozenRightHeader = ele;
    };
    ColumnFreezeHeaderRenderer.prototype.getFrozenRightHeader = function () {
        return this.frozenRightHeader;
    };
    return ColumnFreezeHeaderRenderer;
}(FreezeRender));
export { ColumnFreezeHeaderRenderer };
/**
 * ColumnFreezeContentRenderer is used to freeze the columns content at right and left
 * @hidden
 */
var ColumnFreezeContentRenderer = /** @class */ (function (_super) {
    __extends(ColumnFreezeContentRenderer, _super);
    function ColumnFreezeContentRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.frzCount = 0;
        _this.isColGroupRefresh = false;
        _this.widthService = locator.getService('widthService');
        return _this;
    }
    ColumnFreezeContentRenderer.prototype.renderPanel = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.renderPanel.call(this);
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightPanel();
            }
        }
        else {
            this.renderFrozenRightPanelAlone();
        }
        var display = this.parent.enableVirtualization ? '' : 'flex';
        this.getPanel().firstChild.style.display = display;
    };
    ColumnFreezeContentRenderer.prototype.renderTable = function () {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.renderTable.call(this);
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightTable();
                var display = !this.parent.getVisibleFrozenRightCount() ? 'none' : '';
                this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-right-scrollbar', display, true);
            }
        }
        else {
            this.renderFrozenRightTableAlone();
            var display = !this.parent.getVisibleFrozenRightCount() ? 'none' : '';
            this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-right-scrollbar', display);
        }
        this.getMovableContent().style.flex = '1';
    };
    ColumnFreezeContentRenderer.prototype.appendScrollbar = function (frozen, movable, isRight) {
        var parent = this.parent.createElement('div', { className: 'e-scrollbar', styles: 'display: flex' });
        if (this.parent.getFrozenLeftColumnsCount()) {
            if (!isRight) {
                parent.appendChild(frozen);
                parent.appendChild(movable);
            }
            else {
                this.parent.getContent().querySelector('.e-scrollbar').appendChild(frozen);
                return;
            }
        }
        else {
            parent.appendChild(movable);
            parent.appendChild(frozen);
        }
        this.parent.getContent().appendChild(parent);
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenRightPanelAlone = function () {
        this.renderFrozenRigthPanel();
        var mDiv = this.parent.element.querySelector('.e-movablecontent');
        var fRightContent = this.parent.element.querySelector('.e-frozen-right-content');
        if (isNullOrUndefined(fRightContent)) {
            mDiv = this.parent.createElement('div', { className: 'e-movablecontent' });
            fRightContent = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-right-content' });
            this.getPanel().querySelector('.e-content').appendChild(mDiv);
            this.getPanel().querySelector('.e-content').appendChild(fRightContent);
        }
        _super.prototype.setMovableContent.call(this, mDiv);
        this.setFrozenRightContent(fRightContent);
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenLeftWithRightPanel = function () {
        this.renderFrozenRigthPanel();
        var fRightContent = this.parent.element.querySelector('.e-frozen-right-content');
        if (isNullOrUndefined(fRightContent)) {
            fRightContent = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-right-content' });
            this.getPanel().querySelector('.e-content').appendChild(fRightContent);
        }
        this.setFrozenRightContent(fRightContent);
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenRightTableAlone = function () {
        var mTbl;
        if (this.getFrozenRightContent().querySelector('.e-table') == null) {
            _super.prototype.renderFrozenRightTable.call(this);
            this.getFrozenRightContent().appendChild(this.getTable());
            mTbl = this.getTable().cloneNode(true);
            this.getMovableContent().appendChild(mTbl);
        }
        else {
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
            }
            this.setTable(this.getFrozenRightContent().querySelector('.e-table'));
            this.setColGroup(this.getFrozenRightHeaderColGroup());
            mTbl = this.getMovableContent().querySelector('.e-table');
            this.getFrozenRightContent().querySelector('.e-table').appendChild(this.getColGroup());
        }
        if (this.getMovableContent().querySelector('colgroup')) {
            remove(this.getMovableContent().querySelector('colgroup'));
        }
        var colgroup = ((this.parent.getHeaderContent().querySelector('.e-movableheader')
            .querySelector('colgroup')).cloneNode(true));
        mTbl.insertBefore(colgroup, mTbl.querySelector('tbody'));
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenLeftWithRightTable = function () {
        var frozenRight = this.getTable().cloneNode(true);
        this.getFrozenRightContent().appendChild(frozenRight);
        var oldColGroup = this.getFrozenRightContent().querySelector('colgroup');
        if (oldColGroup) {
            remove(oldColGroup);
        }
        var rightTable = this.getFrozenRightContent().querySelector('.e-table');
        rightTable.insertBefore(this.getFrozenRightHeaderColGroup(), rightTable.querySelector('tbody'));
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenRightEmptyRowAlone = function (tbody) {
        _super.prototype.renderFrozenRightEmpty.call(this, tbody);
        this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
        addClass([this.parent.getMovableContentTbody().querySelector('tr')], ['e-emptyrow']);
        this.getFrozenRightContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getFrozenRightColumnsCount();
        if (this.parent.frozenRows) {
            this.parent.getFrozenRightHeaderTbody().innerHTML = '';
            this.parent.getMovableHeaderTbody().innerHTML = '';
        }
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.getFrozenHeader = function (tableName) {
        if (tableName === 'frozen-left') {
            return this.parent.getHeaderContent().querySelector('.e-frozen-left-header').querySelector('tbody');
        }
        else if (tableName === 'movable') {
            return this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
        }
        else {
            return this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('tbody');
        }
    };
    ColumnFreezeContentRenderer.prototype.renderFrozenLeftWithRightEmptyRow = function () {
        this.getFrozenRightContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
        addClass([this.getFrozenRightContent().querySelector('tbody').querySelector('tr')], ['e-emptyrow']);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('tbody').innerHTML = '';
        }
    };
    ColumnFreezeContentRenderer.prototype.setFrozenRightContent = function (ele) {
        this.frozenRigthContent = ele;
    };
    ColumnFreezeContentRenderer.prototype.getFrozenRightContent = function () {
        return this.frozenRigthContent;
    };
    ColumnFreezeContentRenderer.prototype.getHeaderColGroup = function () {
        var colGroup = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
        if (!this.parent.getFrozenLeftColumnsCount()) {
            var right = this.getFrozenRightHeaderColGroup();
            colGroup = right && this.frzCount ? right.cloneNode(true) : colGroup;
            this.frzCount++;
            this.isColGroupRefresh = true;
        }
        return colGroup;
    };
    ColumnFreezeContentRenderer.prototype.getFrozenRightHeaderColGroup = function () {
        var col = this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('colgroup');
        if (!col) {
            col = this.parent.getHeaderContent().querySelector('colgroup');
        }
        return col.cloneNode(true);
    };
    ColumnFreezeContentRenderer.prototype.setColGroup = function (colGroup) {
        if (this.parent.getFrozenLeftColumnsCount()) {
            return _super.prototype.setColGroup.call(this, colGroup);
        }
        else {
            colGroup = !this.isColGroupRefresh ? this.getFrozenRightHeaderColGroup() : colGroup;
            if (!isNullOrUndefined(colGroup)) {
                colGroup.id = 'content-' + colGroup.id;
            }
            this.isColGroupRefresh = false;
            if (this.frzCount === 2) {
                this.frzCount = 0;
            }
            return this.colgroup = colGroup;
        }
    };
    ColumnFreezeContentRenderer.prototype.renderEmpty = function (tbody) {
        if (this.parent.getFrozenLeftColumnsCount()) {
            _super.prototype.renderEmpty.call(this, tbody);
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightEmptyRow();
            }
        }
        else {
            this.renderFrozenRightEmptyRowAlone(tbody);
        }
    };
    ColumnFreezeContentRenderer.prototype.setHeightToContent = function (height) {
        if (this.parent.getFrozenRightColumnsCount()) {
            this.getFrozenRightContent().style.height = height.toString() + 'px';
        }
        if (this.parent.getFrozenLeftColumnsCount()) {
            this.getFrozenContent().style.height = height.toString() + 'px';
        }
        this.getMovableContent().style.height = height.toString() + 'px';
    };
    ColumnFreezeContentRenderer.prototype.actionComplete = function (args) {
        _super.prototype.actionComplete.call(this, args);
    };
    ColumnFreezeContentRenderer.prototype.batchAdd = function (args) {
        _super.prototype.batchAdd.call(this, args);
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.getTbody = function (tableName) {
        var tbody;
        if (tableName === 'frozen-left') {
            tbody = this.parent.getFrozenLeftContentTbody();
        }
        else if (tableName === 'movable') {
            tbody = this.parent.getMovableContentTbody();
        }
        else if (tableName === 'frozen-right') {
            tbody = this.parent.getFrozenRightContentTbody();
        }
        return tbody;
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.setIsFrozen = function (args, tableName) {
        args.isFrozen = (tableName === 'frozen-left' || (this.parent.getFrozenMode() === 'Right'
            && tableName === 'frozen-right'));
        args.renderFrozenRightContent = this.parent.getFrozenMode() === 'Left-Right' && tableName === 'frozen-right';
        args.renderMovableContent = tableName === 'movable';
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.appendContent = function (tbody, frag, args, tableName) {
        if (!isNullOrUndefined(this.parent.rowTemplate) && this.parent.isReact) {
            tbody = frag;
        }
        else {
            tbody.appendChild(frag);
        }
        if (this.parent.getFrozenMode() === 'Left') {
            if (tableName === 'frozen-left') {
                this.isLoaded = false;
                this.getFrozenContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            }
            else {
                this.refreshTbody(tbody);
                this.isLoaded = true;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            }
        }
        else if (this.parent.getFrozenMode() === 'Right') {
            if (tableName === 'movable') {
                this.refreshTbody(tbody);
                this.isLoaded = true;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            }
            else {
                this.isLoaded = false;
                this.getFrozenRightContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            }
        }
        else if (this.parent.getFrozenMode() === 'Left-Right') {
            if (tableName === 'frozen-left') {
                this.isLoaded = false;
                this.getFrozenContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            }
            else if (tableName === 'movable') {
                this.refreshTbody(tbody);
                this.isLoaded = false;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            }
            else {
                this.isLoaded = true;
                this.getFrozenRightContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            }
        }
        if (this.isInitialRender) {
            this.parent.scrollModule.setHeight();
            this.isInitialRender = false;
        }
        this.widthService.refreshFrozenScrollbar();
    };
    ColumnFreezeContentRenderer.prototype.refreshHeight = function () {
        if (!this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
        }
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.splitRows = function (tableName) {
        var left = this.parent.getFrozenLeftColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        if (left && !right) {
            if (tableName === 'frozen-left') {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            }
            else {
                this.movableRows = this.rows;
            }
        }
        else if (!left && right) {
            if (tableName === 'movable') {
                this.movableRows = this.rows;
            }
            else {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            }
        }
        else if (left && right) {
            if (tableName === 'frozen-left') {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            }
            else if (tableName === 'movable') {
                this.movableRows = this.rows;
                this.movableRowElements = this.rowElements;
            }
            else {
                this.frozenRightRows = this.rows;
                this.frozenRightRowElements = this.rowElements;
            }
        }
    };
    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element}
     */
    ColumnFreezeContentRenderer.prototype.getMovableRowElements = function () {
        if (this.parent.getTablesCount() === 2) {
            return this.rowElements;
        }
        else {
            return this.movableRowElements;
        }
    };
    /**
     * Get the Freeze pane frozen right content table data row elements
     * @return {Element}
     */
    ColumnFreezeContentRenderer.prototype.getFrozenRightRowElements = function () {
        if (this.parent.getTablesCount() === 2) {
            return this.freezeRowElements;
        }
        else {
            return this.frozenRightRowElements;
        }
    };
    /**
     * Get the frozen right row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ColumnFreezeContentRenderer.prototype.getFrozenRightRows = function () {
        if (this.parent.getFrozenMode() === 'Left-Right') {
            if (this.parent.enableInfiniteScrolling) {
                return this.rightFreezeRows;
            }
            return this.frozenRightRows;
        }
        else {
            return this.getRows();
        }
    };
    /**
     * @hidden
     */
    ColumnFreezeContentRenderer.prototype.getFrozenRightRowByIndex = function (index) {
        return this.parent.getFrozenRightDataRows()[index];
    };
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ColumnFreezeContentRenderer.prototype.getRows = function () {
        var infiniteRows = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.freezeRows;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ColumnFreezeContentRenderer.prototype.getRowElements = function () {
        return this.freezeRowElements;
    };
    return ColumnFreezeContentRenderer;
}(FreezeContentRender));
export { ColumnFreezeContentRenderer };
