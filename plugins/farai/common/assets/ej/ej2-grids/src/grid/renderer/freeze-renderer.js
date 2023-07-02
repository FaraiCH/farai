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
import { remove, addClass, isNullOrUndefined, isBlazor, extend, isUndefined } from '@syncfusion/ej2-base';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
import { renderMovable, getScrollBarWidth, wrap } from '../base/util';
import { Input } from '@syncfusion/ej2-inputs';
/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
var FreezeContentRender = /** @class */ (function (_super) {
    __extends(FreezeContentRender, _super);
    function FreezeContentRender(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.isInitialRender = true;
        _this.widthService = locator.getService('widthService');
        _this.addEventListener();
        return _this;
    }
    FreezeContentRender.prototype.addEventListener = function () {
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.addEventListener(events.batchAdd, this.batchAdd.bind(this));
        this.parent.on(events.batchCancel, this.batchAdd.bind(this));
        this.parent.addEventListener(events.batchDelete, this.batchAdd.bind(this));
        this.parent.on(events.setHeightToFrozenElement, this.refreshScrollOffset);
        this.parent.on(events.columnVisibilityChanged, this.widthService.refreshFrozenScrollbar, this);
    };
    FreezeContentRender.prototype.batchAdd = function (args) {
        var isAdd = args.name !== 'batchCancel'
            && !(this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top');
        if (this.parent.height !== 'auto' && (isAdd || args.name === 'batchCancel' || args.name === 'batchDelete')) {
            this.refreshScrollOffset();
            var height = this.getTable().offsetHeight;
            if (args.name === 'add' && this.parent.editSettings.newRowPosition === 'Bottom') {
                this.parent.getContent().firstChild.scroll(0, height);
            }
        }
    };
    FreezeContentRender.prototype.setHeightToContent = function (height) {
        this.getFrozenContent().style.height = height.toString() + 'px';
        this.getMovableContent().style.height = height.toString() + 'px';
    };
    FreezeContentRender.prototype.actionComplete = function (args) {
        if (this.parent.editSettings.mode !== 'Dialog' && (args.requestType === 'add' || (args.requestType === 'cancel'
            && args.row.classList.contains('e-addedrow')))
            && (!this.parent.frozenRows || this.parent.editSettings.newRowPosition === 'Bottom') && this.parent.height !== 'auto') {
            this.refreshScrollOffset();
            var height = this.getTable().offsetHeight;
            if (args.requestType === 'add' && this.parent.editSettings.newRowPosition === 'Bottom') {
                this.parent.getContent().firstChild.scroll(0, height);
            }
        }
    };
    FreezeContentRender.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.removeEventListener(events.actionComplete, this.actionComplete);
        this.parent.removeEventListener(events.batchAdd, this.batchAdd);
        this.parent.off(events.columnVisibilityChanged, this.widthService.refreshFrozenScrollbar);
    };
    FreezeContentRender.prototype.renderPanel = function () {
        _super.prototype.renderPanel.call(this);
        var fDiv = this.parent.element.querySelector('.e-frozencontent');
        var mDiv = this.parent.element.querySelector('.e-movablecontent');
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-left-content' });
            mDiv = this.parent.createElement('div', { className: 'e-movablecontent' });
            this.getPanel().querySelector('.e-content').appendChild(fDiv);
            this.getPanel().querySelector('.e-content').appendChild(mDiv);
        }
        this.setFrozenContent(fDiv);
        this.setMovableContent(mDiv);
    };
    FreezeContentRender.prototype.renderFrozenRigthPanel = function () {
        _super.prototype.renderPanel.call(this);
    };
    FreezeContentRender.prototype.renderEmpty = function (tbody) {
        if (isBlazor() && !this.parent.isJsComponent) {
            return;
        }
        _super.prototype.renderEmpty.call(this, tbody);
        this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
        addClass([this.getMovableContent().querySelector('tbody').querySelector('tr')], ['e-emptyrow']);
        this.getFrozenContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getFrozenLeftCount();
        this.getFrozenContent().style.borderRightWidth = '0px';
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').innerHTML = '';
            this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').innerHTML = '';
        }
    };
    FreezeContentRender.prototype.renderFrozenRightEmpty = function (tbody) {
        _super.prototype.renderEmpty.call(this, tbody);
    };
    FreezeContentRender.prototype.setFrozenContent = function (ele) {
        this.frozenContent = ele;
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.setMovableContent = function (ele) {
        this.movableContent = ele;
    };
    FreezeContentRender.prototype.getFrozenContent = function () {
        return this.frozenContent;
    };
    FreezeContentRender.prototype.getMovableContent = function () {
        return this.movableContent;
    };
    FreezeContentRender.prototype.getModelGenerator = function () {
        return new FreezeRowModelGenerator(this.parent);
    };
    FreezeContentRender.prototype.renderFrozenRightTable = function () {
        _super.prototype.renderTable.call(this);
    };
    FreezeContentRender.prototype.renderTable = function () {
        var mTbl;
        if (this.getFrozenContent().querySelector('.e-table') == null) {
            _super.prototype.renderTable.call(this);
            this.getFrozenContent().appendChild(this.getTable());
            mTbl = this.getTable().cloneNode(true);
            this.getMovableContent().appendChild(mTbl);
        }
        else {
            this.setTable(this.getFrozenContent().querySelector('.e-table'));
            this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
            this.getFrozenContent().querySelector('.e-table').appendChild(this.getColGroup());
            mTbl = this.getMovableContent().querySelector('.e-table');
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
            }
        }
        if (this.getMovableContent().querySelector('colgroup')) {
            remove(this.getMovableContent().querySelector('colgroup'));
        }
        var colGroup = ((this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup')).cloneNode(true));
        mTbl.insertBefore(colGroup, mTbl.querySelector('tbody'));
        var style = this.parent.enableVirtualization ? '' : 'flex';
        this.getPanel().firstChild.style.display = style;
        this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-left-scrollbar', this.getScrollbarDisplay());
    };
    FreezeContentRender.prototype.getScrollbarDisplay = function () {
        var frozenDisplay = '';
        if ((this.parent.getFrozenColumns() && !this.parent.getVisibleFrozenColumns())
            || (this.parent.getFrozenLeftColumnsCount() && !this.parent.getVisibleFrozenLeftCount())) {
            frozenDisplay = 'none';
        }
        return frozenDisplay;
    };
    FreezeContentRender.prototype.renderHorizontalScrollbar = function (className, display, isRight) {
        var left = this.parent.createElement('div', { className: className, styles: 'display:' + display });
        var movable = this.parent.createElement('div', { className: 'e-movablescrollbar' });
        var child = this.parent.createElement('div', { className: 'e-movablechild' });
        var scrollbarHeight = getScrollBarWidth().toString();
        this.setScrollbarHeight(movable, scrollbarHeight);
        this.setScrollbarHeight(child, scrollbarHeight);
        movable.appendChild(child);
        this.appendScrollbar(left, movable, isRight);
    };
    FreezeContentRender.prototype.appendScrollbar = function (frozen, movable, isRight) {
        var parent = this.parent.createElement('div', { className: 'e-scrollbar', styles: 'display: flex' });
        parent.appendChild(frozen);
        parent.appendChild(movable);
        this.parent.getContent().appendChild(parent);
    };
    FreezeContentRender.prototype.setScrollbarHeight = function (ele, height) {
        ele.style.minHeight = height + 'px';
        ele.style.maxHeight = height + 'px';
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.setIsFrozen = function (args, tableName) {
        args.isFrozen = !args.isFrozen;
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.setTbody = function (modelData, args) {
        var tableName;
        if (isNullOrUndefined(modelData[0].cells[0])) {
            this.getMovableContent().querySelector('tbody').innerHTML = '';
        }
        var cell = modelData[0].cells[0];
        var idx = cell.index;
        if (isUndefined(idx) && this.parent.isRowDragable()) {
            cell = modelData[0].cells[1];
            idx = cell.index;
        }
        if (idx === 0) {
            this.getPanel().firstChild.style.overflowX = 'hidden';
        }
        if (this.parent.enableColumnVirtualization && args.renderMovableContent
            && args.requestType === 'virtualscroll' && this.getMovableContent().scrollLeft > 0 && args.virtualInfo.columnIndexes[0] !== 0) {
            idx = this.parent.getFrozenColumns();
        }
        if (cell && cell.column) {
            tableName = cell.column.getFreezeTableName();
        }
        this.setIdx(idx);
        return tableName;
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.splitRows = function (tableName) {
        if (tableName === 'frozen-left') {
            this.freezeRows = this.rows;
            this.freezeRowElements = this.rowElements;
        }
        else {
            this.movableRows = this.rows;
        }
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.renderNextFrozentPart = function (args, tableName) {
        var isVFTable = this.parent.enableVirtualization;
        if (tableName === 'frozen-left') {
            if (isVFTable) {
                args.renderMovableContent = true;
            }
            this.refreshContentRows(extend({}, args));
        }
    };
    FreezeContentRender.prototype.appendContent = function (tbody, frag, args, tableName) {
        if (this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate)) {
            tbody = frag;
        }
        else {
            tbody.appendChild(frag);
        }
        if (tableName === 'frozen-left') {
            this.isLoaded = false;
            this.getFrozenContent().querySelector('table').appendChild(tbody);
        }
        else {
            this.refreshTbody(tbody);
            this.isLoaded = true;
            this.getMovableContent().querySelector('table').appendChild(tbody);
            this.refreshHeight();
            this.refreshScrollOffset();
            this.widthService.refreshFrozenScrollbar();
        }
        if (this.isInitialRender) {
            this.parent.scrollModule.setHeight();
            this.isInitialRender = false;
        }
    };
    FreezeContentRender.prototype.refreshScrollOffset = function () {
        if (this.parent.height !== 'auto') {
            var height = this.getTable().offsetHeight + 1;
            this.setHeightToContent(height);
        }
        this.parent.notify(events.refreshFrozenHeight, {});
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.getFrozenHeader = function (tableName) {
        if (tableName === 'frozen-left') {
            return this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody');
        }
        else {
            return this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
        }
    };
    FreezeContentRender.prototype.refreshTbody = function (tbody) {
        if (tbody.childElementCount < 1) {
            tbody.appendChild(this.parent.createElement('tr').appendChild(this.parent.createElement('td')));
        }
    };
    FreezeContentRender.prototype.refreshHeight = function () {
        if (!this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
        }
        this.getFrozenContent().style.borderRightWidth = '1px';
    };
    FreezeContentRender.prototype.setIdx = function (idx) {
        this.idx = idx;
    };
    FreezeContentRender.prototype.getIdx = function () {
        return this.idx;
    };
    /**
     * @hidden
     */
    FreezeContentRender.prototype.getTbody = function (tableName) {
        if (tableName === 'frozen-left') {
            return this.getTable().querySelector('tbody');
        }
        else {
            return this.getMovableContent().querySelector('tbody');
        }
    };
    return FreezeContentRender;
}(ContentRender));
export { FreezeContentRender };
var FreezeRender = /** @class */ (function (_super) {
    __extends(FreezeRender, _super);
    function FreezeRender(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.addEventListener();
        return _this;
    }
    FreezeRender.prototype.addEventListener = function () {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
        this.parent.on(events.frozenHeight, this.setFrozenHeight, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    };
    FreezeRender.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.frozenHeight, this.setFrozenHeight);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
    };
    FreezeRender.prototype.renderTable = function () {
        if (!isBlazor()) {
            _super.prototype.renderTable.call(this);
        }
        else {
            this.setTable(this.createTable(this.getFrozenHeader().querySelector('.e-table')));
            this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: true } });
            this.createTable(this.getMovableHeader().querySelector('.e-table'));
        }
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    };
    FreezeRender.prototype.renderPanel = function () {
        var fDiv = this.parent.element.querySelector('.e-frozenheader');
        var mDiv = this.parent.element.querySelector('.e-movableheader');
        _super.prototype.renderPanel.call(this);
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-left-header' });
            mDiv = this.parent.createElement('div', { className: 'e-movableheader' });
            this.getPanel().querySelector('.e-headercontent').appendChild(fDiv);
            this.getPanel().querySelector('.e-headercontent').appendChild(mDiv);
        }
        this.setFrozenHeader(fDiv);
        this.setMovableHeader(mDiv);
    };
    FreezeRender.prototype.renderFrozenRightPanel = function () {
        _super.prototype.renderPanel.call(this);
    };
    FreezeRender.prototype.renderFrozenRightTable = function () {
        _super.prototype.renderTable.call(this);
    };
    FreezeRender.prototype.refreshUI = function () {
        if (!(isBlazor() && this.parent.isServerRendered) || this.parent.frozenRows === 0) {
            var tbody = this.getMovableHeader().querySelector('tbody');
            remove(this.getMovableHeader().querySelector('table'));
            _super.prototype.refreshUI.call(this);
            this.rfshMovable();
            this.getMovableHeader().querySelector('tbody').innerHTML = tbody.innerHTML;
        }
        else {
            if (this.parent.getFrozenColumns() && this.freezeReorder) {
                _super.prototype.refreshUI.call(this);
                this.freezeReorder = false;
                _super.prototype.refreshUI.call(this);
            }
            this.rfshMovable();
        }
        if (!isBlazor() || this.parent.frozenRows === 0) {
            this.updateColgroup();
        }
        if (!this.parent.enableVirtualization) {
            this.widthService.setWidthToTable();
        }
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.movableHeader.querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        if (!isBlazor() || this.parent.frozenRows === 0) {
            renderMovable(this.parent.getContentTable().querySelector('colgroup'), this.parent.getFrozenColumns(), this.parent);
        }
        this.widthService.refreshFrozenScrollbar();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    };
    FreezeRender.prototype.refreshFrozenLeftUI = function () {
        _super.prototype.refreshUI.call(this);
    };
    FreezeRender.prototype.rfshMovable = function () {
        if (!isBlazor() || this.parent.frozenRows === 0) {
            this.getFrozenHeader().appendChild(this.getTable());
            this.getMovableHeader().appendChild(this.createTable());
        }
        this.refreshStackedHdrHgt();
        this.addMovableFirstCls();
    };
    FreezeRender.prototype.addMovableFirstCls = function () {
        if (this.parent.getVisibleFrozenColumns()) {
            var movablefirstcell = this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('.e-columnheader');
            var len = movablefirstcell.length;
            for (var i = 0; i < len; i++) {
                var cells = 'cells';
                var element = movablefirstcell[i][cells][0];
                if (element) {
                    addClass([element], ['e-movablefirst']);
                    if (movablefirstcell[i][cells][0].rowSpan > 1) {
                        i = i + (movablefirstcell[i][cells][0].rowSpan - 1);
                    }
                }
            }
        }
    };
    FreezeRender.prototype.refreshFreeze = function (obj) {
        if (obj.case === 'filter') {
            var filterRow = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.filterRenderer(filterRow, this.parent.getFrozenColumns()));
                var elements = [].slice.call(this.getMovableHeader().
                    querySelectorAll('thead .e-filterbarcell .e-input'));
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
            }
        }
        else if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            this.refreshHeight(obj);
            this.parent.contentModule.refreshScrollOffset();
        }
    };
    FreezeRender.prototype.refreshHeight = function (obj) {
        var fRows;
        var mRows;
        var fHdr = this.getFrozenHeader();
        var mHdr = this.getMovableHeader();
        var cont = this.parent.getContent();
        var wrapMode = this.parent.textWrapSettings.wrapMode;
        var hdrClassList = this.parent.getHeaderContent().querySelector('.e-headercontent').classList;
        if (obj.case === 'textwrap') {
            if (wrapMode !== 'Header' || obj.isModeChg) {
                fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr');
                mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr');
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
            }
            if (wrapMode === 'Content' && this.parent.allowTextWrap) {
                hdrClassList.add('e-wrap');
            }
            else {
                hdrClassList.remove('e-wrap');
            }
            if (wrapMode === 'Both' || obj.isModeChg) {
                fRows = fHdr.querySelectorAll('tr');
                mRows = mHdr.querySelectorAll('tr');
            }
            else {
                mRows = mHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr');
                fRows = fHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr');
            }
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1);
            }
            this.refreshStackedHdrHgt();
        }
        else if (obj.case === 'refreshHeight') {
            this.setWrapHeight(cont.querySelector('.e-frozencontent').querySelectorAll('tr'), cont.querySelector('.e-movablecontent').querySelectorAll('tr'), obj.isModeChg);
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                this.setWrapHeight(fHdr.querySelectorAll('tr'), mHdr.querySelectorAll('tr'), obj.isModeChg);
            }
        }
    };
    FreezeRender.prototype.enableAfterRender = function (e) {
        if (e.module === 'scroll') {
            this.setFrozenHeight();
        }
    };
    FreezeRender.prototype.updateResizeHandler = function () {
        var elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    };
    FreezeRender.prototype.setWrapHeight = function (fRows, mRows, isModeChg, isContReset, isStackedHdr) {
        var fRowHgt;
        var mRowHgt;
        var isWrap = this.parent.allowTextWrap;
        var wrapMode = this.parent.textWrapSettings.wrapMode;
        var tHead = this.parent.getHeaderContent().querySelector('thead');
        var tBody = this.parent.getHeaderContent().querySelector('tbody');
        var height = [];
        var width = [];
        for (var i = 0, len = fRows.length; i < len; i++) { //separate loop for performance issue 
            if (!isNullOrUndefined(fRows[i]) && !isNullOrUndefined(mRows[i])) {
                height[i] = fRows[i].getBoundingClientRect().height; //https://pagebuildersandwich.com/increased-plugins-performance-200/
                width[i] = mRows[i].getBoundingClientRect().height;
            }
        }
        for (var i = 0, len = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'Header' && isContReset) || ((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i])))) || isStackedHdr) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < mRowHgt) ||
                (!isWrap && fRowHgt < mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === false))) {
                fRows[i].style.height = mRowHgt + 'px';
            }
            if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && fRowHgt > mRowHgt) ||
                (!isWrap && fRowHgt > mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === true))) {
                mRows[i].style.height = fRowHgt + 'px';
            }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    };
    FreezeRender.prototype.setFrozenHeight = function (height) {
        if (height === void 0) { height = getScrollBarWidth(); }
        var movableContentHeight = this.parent.element.querySelector('.e-movablecontent').getBoundingClientRect().height;
        var movableContent = this.parent.element.querySelector('.e-movablecontent');
        var frozenContent = this.parent.element.querySelector('.e-frozencontent');
        var contentScrollWidth = this.parent.getContent().scrollWidth;
        var contentTableScrollWidth = this.parent.element.querySelector('.e-movablecontent table').scrollWidth +
            this.parent.getContentTable().scrollWidth;
        if (movableContent.scrollWidth - movableContent.clientWidth) {
            frozenContent.style.height = movableContentHeight -
                height + 'px';
            frozenContent.style.borderBottom = '';
        }
        else {
            frozenContent.style.height = movableContentHeight + 'px';
            if (((frozenContent.scrollHeight <= frozenContent.clientHeight) ||
                (movableContent.scrollHeight <= movableContent.clientHeight))
                && contentScrollWidth === contentTableScrollWidth) {
                this.parent.scrollModule.removePadding();
            }
            frozenContent.style.borderBottom = '0px';
        }
    };
    FreezeRender.prototype.refreshStackedHdrHgt = function () {
        var fRowSpan;
        var mRowSpan;
        var fTr = this.getFrozenHeader().querySelectorAll('.e-columnheader');
        var mTr = this.getMovableHeader().querySelectorAll('.e-columnheader');
        for (var i = 0, len = fTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(fTr[i]);
            mRowSpan = this.getRowSpan(mTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, fTr[i], mTr);
            }
            else if (mRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, mRowSpan.max, mTr[i], fTr);
            }
        }
        if (this.parent.allowResizing) {
            this.updateResizeHandler();
        }
    };
    FreezeRender.prototype.getRowSpan = function (row) {
        var rSpan;
        var minRowSpan;
        var maxRowSpan;
        for (var i = 0, len = row.childElementCount; i < len; i++) {
            if (i === 0) {
                minRowSpan = row.children[0].rowSpan;
            }
            rSpan = row.children[i].rowSpan;
            minRowSpan = Math.min(rSpan, minRowSpan);
            maxRowSpan = Math.max(rSpan, minRowSpan);
        }
        return { min: minRowSpan, max: maxRowSpan };
    };
    FreezeRender.prototype.updateStackedHdrRowHgt = function (idx, maxRowSpan, row, rows) {
        var height = 0;
        for (var i = 0; i < maxRowSpan; i++) {
            height += rows[idx + i].style.height ?
                parseInt(rows[idx + i].style.height, 10) : rows[idx + i].offsetHeight;
        }
        row.style.height = height + 'px';
    };
    FreezeRender.prototype.setFrozenHeader = function (ele) {
        this.frozenHeader = ele;
    };
    /**
     * @hidden
     */
    FreezeRender.prototype.setMovableHeader = function (ele) {
        this.movableHeader = ele;
    };
    FreezeRender.prototype.getFrozenHeader = function () {
        return this.frozenHeader;
    };
    FreezeRender.prototype.getMovableHeader = function () {
        return this.movableHeader;
    };
    /**
     * @hidden
     */
    FreezeRender.prototype.updateColgroup = function () {
        var mTable = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector('colgroup'));
        mTable.insertBefore(renderMovable(this.getFrozenHeader().querySelector('colgroup'), this.parent.getFrozenColumns(), this.parent), mTable.querySelector('thead'));
    };
    FreezeRender.prototype.filterRenderer = function (ele, frozenColumn, total) {
        var clone = ele.cloneNode(true);
        clone.innerHTML = '';
        var end = total ? total : this.parent.getColumns().length;
        for (var i = frozenColumn; i < end; i++) {
            clone.appendChild(ele.removeChild(ele.children[frozenColumn]));
        }
        return clone;
    };
    return FreezeRender;
}(HeaderRender));
export { FreezeRender };
