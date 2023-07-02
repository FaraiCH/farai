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
import { remove, createElement, closest, formatUnit, Browser, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { dataReady, modelChanged, refreshVirtualBlock, contentReady } from '../base/constant';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { ContentRender } from './content-renderer';
import { HeaderRender } from './header-renderer';
import { InterSectionObserver } from '../services/intersection-observer';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { isGroupAdaptive, ensureLastRow, ensureFirstRow, getEditedDataIndex } from '../base/util';
import { isBlazor, setStyleAttribute } from '@syncfusion/ej2-base';
/**
 * VirtualContentRenderer
 * @hidden
 */
var VirtualContentRenderer = /** @class */ (function (_super) {
    __extends(VirtualContentRenderer, _super);
    function VirtualContentRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.prevHeight = 0;
        /** @hidden */
        _this.startIndex = 0;
        _this.preStartIndex = 0;
        _this.preventEvent = false;
        _this.actions = ['filtering', 'searching', 'grouping', 'ungrouping'];
        /** @hidden */
        _this.offsets = {};
        _this.tmpOffsets = {};
        /** @hidden */
        _this.virtualEle = new VirtualElementHandler();
        _this.offsetKeys = [];
        _this.isFocused = false;
        _this.isSelection = false;
        _this.isBottom = false;
        _this.rndrCount = 0;
        _this.empty = undefined;
        _this.isCancel = false;
        _this.requestTypes = ['beginEdit', 'cancel', 'delete', 'add', 'save'];
        _this.isNormaledit = _this.parent.editSettings.mode === 'Normal';
        /** @hidden */
        _this.virtualData = {};
        _this.emptyRowData = {};
        _this.vfColIndex = [];
        _this.frzIdx = 1;
        _this.locator = locator;
        _this.eventListener('on');
        _this.parent.on(events.columnVisibilityChanged, _this.setVisible, _this);
        _this.vgenerator = _this.generator;
        return _this;
    }
    VirtualContentRenderer.prototype.renderTable = function () {
        this.header = this.locator.getService('rendererFactory').getRenderer(RenderType.Header);
        _super.prototype.renderTable.call(this);
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.content = this.getPanel().querySelector('.e-content');
        this.virtualEle.renderWrapper(this.parent.height);
        this.virtualEle.renderPlaceHolder();
        this.virtualEle.wrapper.style.position = 'absolute';
        var debounceEvent = (this.parent.dataSource instanceof DataManager && !this.parent.dataSource.dataSource.offline);
        var opt = {
            container: this.content, pageHeight: this.getBlockHeight() * 2, debounceEvent: debounceEvent,
            axes: this.parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
    };
    VirtualContentRenderer.prototype.renderEmpty = function (tbody) {
        this.getTable().appendChild(tbody);
        this.virtualEle.adjustTable(0, 0);
    };
    VirtualContentRenderer.prototype.scrollListener = function (scrollArgs) {
        this.scrollAfterEdit();
        if (this.parent.enablePersistence) {
            this.parent.scrollPosition = scrollArgs.offset;
        }
        if (this.preventEvent || this.parent.isDestroyed) {
            this.preventEvent = false;
            return;
        }
        if (isNullOrUndefined(document.activeElement)) {
            this.isFocused = false;
        }
        else {
            this.isFocused = this.content === closest(document.activeElement, '.e-content') || this.content === document.activeElement;
        }
        var info = scrollArgs.sentinel;
        var pStartIndex = this.preStartIndex;
        var previousColIndexes = this.parent.getColumnIndexesInView();
        var viewInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (isBlazor() && this.parent.isServerRendered && this.parent.enableColumnVirtualization &&
            (JSON.stringify(previousColIndexes) !== JSON.stringify(viewInfo.columnIndexes))) {
            this.parent.refreshHeader();
            var translateX = this.getColumnOffset(this.startColIndex - 1);
            var width = this.getColumnOffset(this.endColIndex - 1) - translateX + '';
            this.parent.notify('refresh-virtual-indices', { requestType: 'virtualscroll', startColumnIndex: viewInfo.columnIndexes[0],
                endColumnIndex: viewInfo.columnIndexes[viewInfo.columnIndexes.length - 1], axis: 'X',
                VTablewidth: width, translateX: this.getColumnOffset(viewInfo.columnIndexes[0] - 1) });
            this.parent.notify('setcolumnstyles', {});
        }
        if (isGroupAdaptive(this.parent) && !isBlazor()) {
            if ((info.axis === 'Y' && viewInfo.blockIndexes && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
                && scrollArgs.direction === 'up' && viewInfo.blockIndexes[viewInfo.blockIndexes.length - 1] !== 2) {
                return;
            }
            else {
                viewInfo.event = 'refresh-virtual-block';
                if (!isNullOrUndefined(viewInfo.offsets)) {
                    viewInfo.offsets.top = this.content.scrollTop;
                }
                this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
                return;
            }
        }
        if (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) {
            if (this.prevInfo && ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
                || (info.axis === 'X' && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString()))) {
                if (Browser.isIE) {
                    this.parent.hideSpinner();
                }
                this.requestType = this.requestType === 'virtualscroll' ? this.empty : this.requestType;
                this.restoreEdit();
                return;
            }
        }
        this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        if (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) {
            this.parent.pageSettings.currentPage = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
        }
        else if (isBlazor() && this.parent.isServerRendered && this.preStartIndex !== pStartIndex &&
            this.parent.pageSettings.currentPage === viewInfo.currentPage) {
            this.parent.notify('refresh-virtual-indices', { requestType: 'virtualscroll', virtualStartIndex: viewInfo.startIndex,
                virtualEndIndex: viewInfo.endIndex, axis: 'Y', RHeight: this.parent.getRowHeight() });
        }
        if (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) {
            this.requestType = 'virtualscroll';
            this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualInfo: viewInfo,
                focusElement: scrollArgs.focusElement });
        }
        else if (this.preStartIndex !== pStartIndex && this.parent.pageSettings.currentPage !== viewInfo.currentPage) {
            this.parent.pageSettings.currentPage = viewInfo.currentPage;
            this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualStartIndex: viewInfo.startIndex,
                virtualEndIndex: viewInfo.endIndex, axis: 'Y', RHeight: this.parent.getRowHeight() });
        }
    };
    VirtualContentRenderer.prototype.block = function (blk) {
        return this.vgenerator.isBlockAvailable(blk);
    };
    VirtualContentRenderer.prototype.getInfoFromView = function (direction, info, e) {
        var isBlockAdded = false;
        var tempBlocks = [];
        var infoType = { direction: direction, sentinelInfo: info, offsets: e,
            startIndex: this.preStartIndex, endIndex: this.preEndIndex };
        var vHeight = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        infoType.page = this.getPageFromTop(e.top, infoType);
        infoType.blockIndexes = tempBlocks = this.vgenerator.getBlockIndexes(infoType.page);
        infoType.loadSelf = !this.vgenerator.isBlockAvailable(tempBlocks[infoType.block]);
        var blocks = this.ensureBlocks(infoType);
        if (this.activeKey === 'upArrow' && infoType.blockIndexes.toString() !== blocks.toString()) {
            // To avoid dupilcate row index problem in key focus support
            var newBlock = blocks[blocks.length - 1];
            if (infoType.blockIndexes.indexOf(newBlock) === -1) {
                isBlockAdded = true;
            }
        }
        infoType.blockIndexes = blocks;
        infoType.loadNext = !blocks.filter(function (val) { return tempBlocks.indexOf(val) === -1; })
            .every(this.block.bind(this));
        infoType.event = (infoType.loadNext || infoType.loadSelf) ? modelChanged : refreshVirtualBlock;
        infoType.nextInfo = infoType.loadNext ? { page: Math.max(1, infoType.page + (direction === 'down' ? 1 : -1)) } : {};
        if (isBlockAdded) {
            infoType.blockIndexes = [infoType.blockIndexes[0] - 1, infoType.blockIndexes[0], infoType.blockIndexes[0] + 1];
        }
        if (this.activeKey === 'downArrow') {
            var firstBlock = Math.ceil(this.rowIndex / this.getBlockSize());
            if (firstBlock !== 1 && (infoType.blockIndexes[1] !== firstBlock || infoType.blockIndexes.length < 3)) {
                infoType.blockIndexes = [firstBlock - 1, firstBlock, firstBlock + 1];
            }
        }
        infoType.columnIndexes = info.axis === 'X' ? this.vgenerator.getColumnIndexes() : this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && info.axis === 'X') {
            infoType.event = refreshVirtualBlock;
        }
        if (isBlazor() && this.parent.isServerRendered) {
            var rowHeight = this.parent.getRowHeight();
            var exactTopIndex = e.top / rowHeight;
            var noOfInViewIndexes = vHeight / rowHeight;
            var exactEndIndex = exactTopIndex + noOfInViewIndexes;
            var pageSizeBy4 = this.parent.pageSettings.pageSize / 4;
            if (infoType.direction === 'down') {
                var sIndex = Math.round(exactEndIndex) - Math.round((pageSizeBy4));
                if (isNullOrUndefined(infoType.startIndex) || (exactEndIndex >
                    (infoType.startIndex + Math.round((this.parent.pageSettings.pageSize / 2 + pageSizeBy4)))
                    && infoType.endIndex !== this.count)) {
                    infoType.startIndex = sIndex >= 0 ? Math.round(sIndex) : 0;
                    infoType.startIndex = infoType.startIndex > exactTopIndex ? Math.floor(exactTopIndex) : infoType.startIndex;
                    var eIndex = infoType.startIndex + this.parent.pageSettings.pageSize;
                    infoType.startIndex = eIndex < exactEndIndex ? (Math.ceil(exactEndIndex) - this.parent.pageSettings.pageSize)
                        : infoType.startIndex;
                    infoType.endIndex = eIndex < this.count ? eIndex : this.count;
                    infoType.startIndex = eIndex >= this.count ?
                        infoType.endIndex - this.parent.pageSettings.pageSize : infoType.startIndex;
                    infoType.currentPage = Math.ceil(infoType.endIndex / this.parent.pageSettings.pageSize);
                    this.setKeyboardNavIndex();
                }
            }
            else if (infoType.direction === 'up') {
                if (infoType.startIndex && infoType.endIndex) {
                    var loadAtIndex = Math.round(((infoType.startIndex * rowHeight) + (pageSizeBy4 * rowHeight)) / rowHeight);
                    if (exactTopIndex < loadAtIndex) {
                        var idxAddedToExactTop = (pageSizeBy4) > noOfInViewIndexes ? pageSizeBy4 :
                            (noOfInViewIndexes + noOfInViewIndexes / 4);
                        var eIndex = Math.round(exactTopIndex + idxAddedToExactTop);
                        infoType.endIndex = eIndex < this.count ? eIndex : this.count;
                        var sIndex = infoType.endIndex - this.parent.pageSettings.pageSize;
                        infoType.startIndex = sIndex > 0 ? sIndex : 0;
                        infoType.endIndex = sIndex < 0 ? this.parent.pageSettings.pageSize : infoType.endIndex;
                        infoType.currentPage = Math.ceil(infoType.startIndex / this.parent.pageSettings.pageSize);
                        this.setKeyboardNavIndex();
                    }
                }
            }
            this.preStartIndex = this.startIndex = infoType.startIndex;
            this.preEndIndex = infoType.endIndex;
            infoType.event = (infoType.currentPage !== this.parent.pageSettings.currentPage) ? modelChanged : refreshVirtualBlock;
        }
        return infoType;
    };
    VirtualContentRenderer.prototype.setKeyboardNavIndex = function () {
        this.blazorDataLoad = true;
        if (this.activeKey === 'downArrow' || this.activeKey === 'upArrow') {
            this.blzRowIndex = this.activeKey === 'downArrow' ? this.rowIndex + 1 : this.rowIndex - 1;
            document.activeElement.blur();
        }
    };
    VirtualContentRenderer.prototype.ensureBlocks = function (info) {
        var _this = this;
        var index = info.blockIndexes[info.block];
        var mIdx;
        var old = index;
        var max = Math.max;
        var indexes = info.direction === 'down' ? [max(index, 1), ++index, ++index] : [max(index - 1, 1), index, index + 1];
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()) {
            // To avoid frozen content white space issue
            if (info.sentinelInfo.axis === 'X' || (info.sentinelInfo.axis === 'Y' && (info.page === this.prevInfo.page))) {
                indexes = this.prevInfo.blockIndexes;
            }
        }
        indexes = indexes.filter(function (val, ind) { return indexes.indexOf(val) === ind; });
        if (this.prevInfo.blockIndexes.toString() === indexes.toString()) {
            return indexes;
        }
        if (info.loadSelf || (info.direction === 'down' && this.isEndBlock(old))) {
            indexes = this.vgenerator.getBlockIndexes(info.page);
        }
        indexes.some(function (val, ind) {
            var result = val === (isGroupAdaptive(_this.parent) ? _this.getGroupedTotalBlocks() : _this.getTotalBlocks());
            if (result) {
                mIdx = ind;
            }
            return result;
        });
        if (mIdx !== undefined) {
            indexes = indexes.slice(0, mIdx + 1);
            if (info.block === 0 && indexes.length === 1 && this.vgenerator.isBlockAvailable(indexes[0] - 1)) {
                indexes = [indexes[0] - 1, indexes[0]];
            }
        }
        return indexes;
    };
    // tslint:disable-next-line:max-func-body-length
    VirtualContentRenderer.prototype.appendContent = function (target, newChild, e) {
        var _this = this;
        // currentInfo value will be used if there are multiple dom updates happened due to mousewheel
        var isFrozen = this.parent.isFrozenGrid();
        var frzCols = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        var colVFtable = this.parent.enableColumnVirtualization && isFrozen;
        this.checkFirstBlockColIndexes(e);
        var info = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
            this.currentInfo.page !== e.virtualInfo.page ? this.currentInfo : e.virtualInfo;
        this.prevInfo = this.prevInfo || e.virtualInfo;
        var cBlock = (info.columnIndexes[0]) - 1;
        if (colVFtable && info.columnIndexes[0] === frzCols) {
            cBlock = (info.columnIndexes[0] - frzCols) - 1;
        }
        var cOffset = this.getColumnOffset(cBlock);
        var width;
        var blocks = info.blockIndexes;
        if (this.parent.groupSettings.columns.length) {
            this.refreshOffsets();
        }
        if (this.parent.height === '100%') {
            this.parent.element.style.height = '100%';
        }
        var vHeight = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        if (!this.requestTypes.some(function (value) { return value === _this.requestType; })) {
            var translate = this.getTranslateY(this.content.scrollTop, vHeight, info);
            this.virtualEle.adjustTable(colVFtable ? 0 : cOffset, translate);
            if (colVFtable) {
                this.virtualEle.adjustMovableTable(cOffset, 0);
            }
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(colVFtable ? 0 : cOffset, 0);
            if (colVFtable) {
                this.header.virtualEle.adjustMovableTable(cOffset, 0);
            }
        }
        if (this.parent.enableColumnVirtualization) {
            var cIndex = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            if (colVFtable) {
                this.header.virtualEle.setMovableWrapperWidth(width);
            }
            else {
                this.header.virtualEle.setWrapperWidth(width);
            }
        }
        if (colVFtable) {
            this.virtualEle.setMovableWrapperWidth(width, Browser.isIE || Browser.info.name === 'edge');
        }
        else {
            this.virtualEle.setWrapperWidth(width, Browser.isIE || Browser.info.name === 'edge');
        }
        if (!isNullOrUndefined(target.parentNode)) {
            remove(target);
        }
        var tbody;
        if (isFrozen) {
            if (e.renderFrozenRightContent) {
                tbody = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('tbody');
            }
            else if (!e.renderMovableContent) {
                tbody = this.parent.getFrozenVirtualContent().querySelector('tbody');
            }
            else if (e.renderMovableContent) {
                tbody = this.parent.getMovableVirtualContent().querySelector('tbody');
            }
        }
        else {
            tbody = this.parent.element.querySelector('.e-content').querySelector('tbody');
        }
        if (tbody) {
            remove(tbody);
            target = null;
        }
        var isReact = this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate);
        if (!isReact) {
            target = this.parent.createElement('tbody');
            target.appendChild(newChild);
        }
        else {
            target = newChild;
        }
        if (this.parent.frozenRows && e.requestType === 'virtualscroll' && this.parent.pageSettings.currentPage === 1) {
            for (var i = 0; i < this.parent.frozenRows; i++) {
                target.children[0].remove();
            }
        }
        if (isFrozen) {
            if (e.renderFrozenRightContent) {
                this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.e-table').appendChild(target);
                this.requestType = this.requestType === 'virtualscroll' ? this.empty : this.requestType;
            }
            else if (!e.renderMovableContent) {
                this.parent.getFrozenVirtualContent().querySelector('.e-table').appendChild(target);
            }
            else if (e.renderMovableContent) {
                this.parent.getMovableVirtualContent().querySelector('.e-table').appendChild(target);
                if (this.parent.getFrozenMode() !== 'Left-Right') {
                    this.requestType = this.requestType === 'virtualscroll' ? this.empty : this.requestType;
                }
            }
            if (this.vfColIndex.length) {
                e.virtualInfo.columnIndexes = info.columnIndexes = extend([], this.vfColIndex);
                this.vfColIndex = e.renderMovableContent ? [] : this.vfColIndex;
            }
        }
        else {
            this.getTable().appendChild(target);
            this.requestType = this.requestType === 'virtualscroll' ? this.empty : this.requestType;
        }
        if (this.parent.groupSettings.columns.length) {
            if (!isGroupAdaptive(this.parent) && info.direction === 'up') {
                var blk = this.offsets[this.getTotalBlocks()] - this.prevHeight;
                this.preventEvent = true;
                var sTop = this.content.scrollTop;
                this.content.scrollTop = sTop + blk;
            }
            this.setVirtualHeight();
            this.observer.setPageHeight(this.getOffset(blocks[blocks.length - 1]) - this.getOffset(blocks[0] - 1));
        }
        this.prevInfo = info;
        if (this.isFocused && this.activeKey !== 'downArrow' && this.activeKey !== 'upArrow') {
            this.content.focus();
        }
        var lastPage = Math.ceil(this.getTotalBlocks() / 2);
        if (this.isBottom) {
            this.isBottom = false;
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 1];
        }
        if ((this.parent.pageSettings.currentPage === lastPage) && blocks.length === 1) {
            this.isBottom = true;
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 2];
        }
        if (e.requestType === 'virtualscroll' && e.virtualInfo.sentinelInfo.axis === 'X') {
            this.parent.notify(events.autoCol, {});
        }
        this.focusCell(e);
        this.restoreEdit(e);
        this.restoreAdd(e);
    };
    VirtualContentRenderer.prototype.checkFirstBlockColIndexes = function (e) {
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid() && e.virtualInfo.columnIndexes[0] === 0) {
            var indexes = [];
            var frozenCols = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
            if (!e.renderMovableContent && e.virtualInfo.columnIndexes.length > frozenCols) {
                this.vfColIndex = e.virtualInfo.columnIndexes;
                for (var i = 0; i < frozenCols; i++) {
                    indexes.push(i);
                }
                e.virtualInfo.columnIndexes = indexes;
            }
            else if (e.renderMovableContent) {
                if (!this.vfColIndex.length) {
                    this.vfColIndex = extend([], e.virtualInfo.columnIndexes);
                }
                e.virtualInfo.columnIndexes = extend([], this.vfColIndex);
                e.virtualInfo.columnIndexes.splice(0, frozenCols);
            }
        }
    };
    VirtualContentRenderer.prototype.focusCell = function (e) {
        if (this.activeKey !== 'upArrow' && this.activeKey !== 'downArrow') {
            return;
        }
        var row = this.parent.getRowByIndex(this.rowIndex);
        // tslint:disable-next-line:no-any
        var cell = row.cells[this.cellIndex];
        cell.focus({ preventScroll: true });
        this.parent.selectRow(parseInt(row.getAttribute('aria-rowindex'), 10));
        this.activeKey = this.empty;
    };
    VirtualContentRenderer.prototype.restoreEdit = function (e) {
        if (this.isNormaledit) {
            var left = this.parent.getFrozenColumns();
            var isFrozen = e && this.parent.isFrozenGrid();
            var table = this.parent.getFrozenMode();
            var trigger = e && (left || table === 'Left' || table === 'Right' ? e.renderMovableContent
                : e.renderFrozenRightContent);
            if ((!isFrozen || (isFrozen && trigger)) && this.parent.editSettings.allowEditing
                && this.parent.editModule && !isNullOrUndefined(this.editedRowIndex)) {
                var row = this.getRowByIndex(this.editedRowIndex);
                if (Object.keys(this.virtualData).length && row && !this.content.querySelector('.e-editedrow')) {
                    var top_1 = row.getBoundingClientRect().top;
                    if (top_1 < this.content.offsetHeight && top_1 > this.parent.getRowHeight()) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
                if (row && this.content.querySelector('.e-editedrow') && !Object.keys(this.virtualData).length) {
                    var rowData = extend({}, this.getRowObjectByIndex(this.editedRowIndex));
                    this.virtualData = this.getVirtualEditedData(rowData);
                }
            }
            this.restoreAdd(e);
        }
    };
    VirtualContentRenderer.prototype.getVirtualEditedData = function (rowData) {
        var editForms = [].slice.call(this.parent.element.querySelectorAll('.e-gridform'));
        var isFrozen = this.parent.isFrozenGrid();
        var data = this.parent.editModule.getCurrentEditedData(editForms[0], rowData);
        if (isFrozen) {
            if (this.parent.getTablesCount() === 2) {
                data = this.parent.editModule.getCurrentEditedData(editForms[1], rowData);
            }
            if (this.parent.getTablesCount() === 3) {
                data = this.parent.editModule.getCurrentEditedData(editForms[1], rowData);
                data = this.parent.editModule.getCurrentEditedData(editForms[2], rowData);
            }
        }
        return data;
    };
    VirtualContentRenderer.prototype.restoreAdd = function (e) {
        var left = this.parent.getFrozenColumns();
        var isFrozen = e && this.parent.isFrozenGrid();
        var table = this.parent.getFrozenMode();
        var trigger = e && (left || table === 'Left' || table === 'Right' ? e.renderMovableContent : e.renderFrozenRightContent);
        if ((!isFrozen || (isFrozen && trigger)) && this.isNormaledit && this.isAdd && !this.parent.element.querySelector('.e-addedrow')) {
            var isTop = this.parent.editSettings.newRowPosition === 'Top' && this.content.scrollTop < this.parent.getRowHeight();
            var isBottom = this.parent.editSettings.newRowPosition === 'Bottom'
                && this.parent.pageSettings.currentPage === this.maxPage;
            if (isTop || isBottom) {
                this.parent.isEdit = false;
                this.parent.addRecord();
            }
        }
    };
    VirtualContentRenderer.prototype.onDataReady = function (e) {
        if (!isNullOrUndefined(e.count)) {
            this.count = e.count;
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
        }
        this.vgenerator.checkAndResetCache(e.requestType);
        if (['refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', undefined]
            .some(function (value) { return e.requestType === value; })) {
            this.refreshOffsets();
        }
        this.setVirtualHeight();
        this.resetScrollPosition(e.requestType);
    };
    /** @hidden */
    VirtualContentRenderer.prototype.setVirtualHeight = function (height) {
        var width = this.parent.enableColumnVirtualization ?
            this.getColumnOffset(this.parent.columns.length + this.parent.groupSettings.columns.length - 1) + 'px' : '100%';
        if (this.parent.isFrozenGrid()) {
            var virtualHeightTemp = (this.parent.pageSettings.currentPage === 1 && Object.keys(this.offsets).length <= 2) ?
                this.offsets[1] : this.offsets[this.getTotalBlocks() - 2];
            var scrollableElementHeight = this.content.clientHeight;
            virtualHeightTemp = virtualHeightTemp > scrollableElementHeight ? virtualHeightTemp : 0;
            // To overcome the white space issue in last page (instead of position absolute)
            this.virtualEle.setVirtualHeight(virtualHeightTemp, width);
        }
        else {
            var virtualHeight = (isBlazor() && this.parent.isServerRendered && this.parent.groupSettings.columns.length && height)
                ? height : (this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()]);
            this.virtualEle.setVirtualHeight(virtualHeight, width);
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
            if (this.parent.isFrozenGrid()) {
                this.virtualEle.setMovableVirtualHeight(1, width);
                this.header.virtualEle.setMovableVirtualHeight(1, width);
            }
        }
    };
    VirtualContentRenderer.prototype.getPageFromTop = function (sTop, info) {
        var _this = this;
        var total = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        var page = 0;
        var extra = this.offsets[total] - this.prevHeight;
        this.offsetKeys.some(function (offset) {
            var iOffset = Number(offset);
            var border = sTop <= _this.offsets[offset] || (iOffset === total && sTop > _this.offsets[offset]);
            if (border) {
                if (_this.offsetKeys.length % 2 !== 0 && iOffset.toString() === _this.offsetKeys[_this.offsetKeys.length - 2]
                    && sTop <= _this.offsets[_this.offsetKeys.length - 1]) {
                    iOffset = iOffset + 1;
                }
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(_this.vgenerator.getPage(iOffset), _this.maxPage));
            }
            return border;
        });
        return page;
    };
    VirtualContentRenderer.prototype.getTranslateY = function (sTop, cHeight, info, isOnenter) {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop, {}) };
            info.blockIndexes = this.vgenerator.getBlockIndexes(info.page);
        }
        var block = (info.blockIndexes[0] || 1) - 1;
        var translate = this.getOffset(block);
        var endTranslate = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        if (isOnenter) {
            info = this.prevInfo;
        }
        var result = translate > sTop ?
            this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
        var blockHeight = this.offsets[info.blockIndexes[info.blockIndexes.length - 1]] -
            this.tmpOffsets[info.blockIndexes[0]];
        if (result + blockHeight > this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()]) {
            result -= (result + blockHeight) - this.offsets[this.getTotalBlocks()];
        }
        return result;
    };
    VirtualContentRenderer.prototype.getOffset = function (block) {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock] | 0);
    };
    VirtualContentRenderer.prototype.onEntered = function () {
        var _this = this;
        return function (element, current, direction, e, isWheel, check) {
            if (Browser.isIE && !isWheel && check && !_this.preventEvent) {
                _this.parent.showSpinner();
            }
            var colVFtable = _this.parent.enableColumnVirtualization && _this.parent.isFrozenGrid();
            var xAxis = current.axis === 'X';
            var top = _this.prevInfo.offsets ? _this.prevInfo.offsets.top : null;
            var height = _this.content.getBoundingClientRect().height;
            var x = _this.getColumnOffset(xAxis ? _this.vgenerator.getColumnIndexes()[0] - 1 : _this.prevInfo.columnIndexes[0] - 1);
            var y = _this.getTranslateY(e.top, height, xAxis && top === e.top ? _this.prevInfo : undefined, true);
            if (isBlazor() && _this.parent.isServerRendered && _this.currentInfo && _this.currentInfo.startIndex && xAxis) {
                y = _this.currentInfo.startIndex * _this.parent.getRowHeight();
            }
            _this.virtualEle.adjustTable(colVFtable ? 0 : x, Math.min(y, _this.offsets[_this.maxBlock]));
            if (colVFtable) {
                _this.virtualEle.adjustMovableTable(x, 0);
            }
            if (isBlazor() && _this.parent.isServerRendered && xAxis) {
                _this.parent.notify('setcolumnstyles', { refresh: true });
            }
            if (_this.parent.enableColumnVirtualization && (!isBlazor() || (isBlazor() && !_this.parent.isServerRendered))) {
                _this.header.virtualEle.adjustTable(colVFtable ? 0 : x, 0);
                if (colVFtable) {
                    _this.header.virtualEle.adjustMovableTable(x, 0);
                }
            }
        };
    };
    VirtualContentRenderer.prototype.dataBound = function () {
        this.parent.notify(events.refreshVirtualFrozenHeight, {});
        if (this.isSelection && this.activeKey !== 'upArrow' && this.activeKey !== 'downArrow') {
            this.parent.selectRow(this.selectedRowIndex);
        }
        else if (!isBlazor()) {
            this.activeKey = this.empty;
        }
    };
    VirtualContentRenderer.prototype.rowSelected = function () {
        this.isSelection = false;
    };
    VirtualContentRenderer.prototype.eventListener = function (action) {
        var _this = this;
        this.parent[action](dataReady, this.onDataReady, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.addEventListener(events.rowSelected, this.rowSelected.bind(this));
        this.parent[action](refreshVirtualBlock, this.refreshContentRows, this);
        this.parent[action](events.selectVirtualRow, this.selectVirtualRow, this);
        this.parent[action](events.virtaulCellFocus, this.virtualCellFocus, this);
        this.parent[action](events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent[action](events.virtualScrollAddActionBegin, this.addActionBegin, this);
        this.parent[action](events.virtualScrollEdit, this.restoreEdit, this);
        this.parent[action](events.virtualScrollEditSuccess, this.editSuccess, this);
        this.parent[action](events.refreshVirtualCache, this.refreshCache, this);
        this.parent[action](events.editReset, this.resetIsedit, this);
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.virtualScrollEditCancel, this.editCancel, this);
        var event = this.actions;
        for (var i = 0; i < event.length; i++) {
            this.parent[action](event[i] + "-begin", this.onActionBegin, this);
        }
        var fn = function () {
            _this.observer.observe(function (scrollArgs) { return _this.scrollListener(scrollArgs); }, _this.onEntered());
            var gObj = _this.parent;
            if (gObj.enablePersistence && gObj.scrollPosition) {
                _this.content.scrollTop = gObj.scrollPosition.top;
                var scrollValues = { direction: 'down', sentinel: _this.observer.sentinelInfo.down,
                    offset: gObj.scrollPosition, focusElement: gObj.element };
                _this.scrollListener(scrollValues);
                if (gObj.enableColumnVirtualization) {
                    _this.content.scrollLeft = gObj.scrollPosition.left;
                }
            }
            _this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    };
    /** @hidden */
    VirtualContentRenderer.prototype.getVirtualData = function (data) {
        data.virtualData = this.virtualData;
        data.isAdd = this.isAdd;
        data.isCancel = this.isCancel;
    };
    VirtualContentRenderer.prototype.editCancel = function (args) {
        var dataIndex = getEditedDataIndex(this.parent, args.data);
        if (!isNullOrUndefined(dataIndex)) {
            args.data = this.parent.getCurrentViewRecords()[dataIndex];
        }
    };
    VirtualContentRenderer.prototype.editSuccess = function (args) {
        if (this.isNormaledit) {
            if (!this.isAdd && args.data) {
                this.updateCurrentViewData(args.data);
            }
            this.isAdd = false;
        }
    };
    VirtualContentRenderer.prototype.updateCurrentViewData = function (data) {
        var dataIndex = getEditedDataIndex(this.parent, data);
        if (!isNullOrUndefined(dataIndex)) {
            this.parent.getCurrentViewRecords()[dataIndex] = data;
        }
    };
    VirtualContentRenderer.prototype.actionBegin = function (args) {
        if (args.requestType !== 'virtualscroll') {
            this.requestType = args.requestType;
        }
        if (!args.cancel) {
            this.parent.notify(events.refreshVirtualFrozenRows, args);
        }
    };
    VirtualContentRenderer.prototype.virtualCellFocus = function (e) {
        // To decide the action (select or scroll), when using arrow keys for cell focus
        var ele = document.activeElement;
        if (ele.classList.contains('e-rowcell')
            && e && (e.action === 'upArrow' || e.action === 'downArrow')) {
            var rowIndex = parseInt(ele.parentElement.getAttribute('aria-rowindex'), 10);
            if (e && (e.action === 'downArrow' || e.action === 'upArrow')) {
                var scrollEle = this.parent.getContent().firstElementChild;
                e.action === 'downArrow' ? rowIndex += 1 : rowIndex -= 1;
                this.rowIndex = rowIndex;
                this.cellIndex = parseInt(ele.getAttribute('aria-colindex'), 10);
                var row = this.parent.getRowByIndex(rowIndex);
                var page = this.parent.pageSettings.currentPage;
                var visibleRowCount = Math.floor(scrollEle.offsetHeight / this.parent.getRowHeight()) - 1;
                var emptyRow = false;
                if (isNullOrUndefined(row)) {
                    emptyRow = true;
                    if ((e.action === 'downArrow' && page === this.maxPage - 1) || (e.action === 'upArrow' && page === 1)) {
                        emptyRow = false;
                    }
                }
                if (emptyRow || (ensureLastRow(row, this.parent) && e.action === 'downArrow')
                    || (ensureFirstRow(row, this.parent.getRowHeight() * 2) && e.action === 'upArrow')) {
                    this.activeKey = e.action;
                    scrollEle.scrollTop = e.action === 'downArrow' ?
                        (rowIndex - visibleRowCount) * this.parent.getRowHeight() : rowIndex * this.parent.getRowHeight();
                }
                else {
                    this.activeKey = this.empty;
                }
                if (!isBlazor() || (isBlazor() && !this.blazorDataLoad)) {
                    this.parent.selectRow(rowIndex);
                }
            }
        }
    };
    VirtualContentRenderer.prototype.editActionBegin = function (e) {
        this.editedRowIndex = e.index;
        var rowData = extend({}, this.getRowObjectByIndex(e.index));
        e.data = Object.keys(this.virtualData).length ? this.virtualData : rowData;
    };
    VirtualContentRenderer.prototype.refreshCache = function (data) {
        var block = Math.ceil((this.editedRowIndex + 1) / this.getBlockSize());
        var index = this.editedRowIndex - ((block - 1) * this.getBlockSize());
        this.vgenerator.cache[block][index].data = data;
        if (this.vgenerator.movableCache[block]) {
            this.vgenerator.movableCache[block][index].data = data;
        }
        if (this.vgenerator.frozenRightCache[block]) {
            this.vgenerator.frozenRightCache[block][index].data = data;
        }
    };
    VirtualContentRenderer.prototype.actionComplete = function (args) {
        if (args.requestType === 'delete' || args.requestType === 'save' || args.requestType === 'cancel') {
            this.refreshOffsets();
            this.refreshVirtualElement();
            if (this.isNormaledit) {
                if (args.requestType === 'cancel') {
                    this.isCancel = true;
                }
                this.isAdd = false;
                this.editedRowIndex = this.empty;
                this.virtualData = {};
                this.parent.editModule.previousVirtualData = {};
            }
        }
        if (this.parent.enableColumnVirtualization && args.requestType === 'filterafteropen'
            && this.currentInfo.columnIndexes && this.currentInfo.columnIndexes[0] > 0) {
            this.parent.resetFilterDlgPosition(args.columnName);
        }
    };
    VirtualContentRenderer.prototype.resetIsedit = function () {
        if (this.parent.enableVirtualization && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && Object.keys(this.virtualData).length)
                || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    };
    VirtualContentRenderer.prototype.scrollAfterEdit = function () {
        if (this.parent.editModule && this.parent.editSettings.allowEditing && this.isNormaledit) {
            if (this.parent.element.querySelector('.e-gridform')) {
                var editForm = this.parent.element.querySelector('.e-editedrow');
                var addForm = this.parent.element.querySelector('.e-addedrow');
                if (editForm || addForm) {
                    var rowData = editForm ? extend({}, this.getRowObjectByIndex(this.editedRowIndex))
                        : extend({}, this.emptyRowData);
                    this.virtualData = this.getVirtualEditedData(rowData);
                }
            }
        }
    };
    VirtualContentRenderer.prototype.createEmptyRowdata = function () {
        var _this = this;
        this.parent.getColumns().filter(function (e) {
            _this.emptyRowData[e.field] = _this.empty;
        });
    };
    VirtualContentRenderer.prototype.addActionBegin = function (args) {
        if (this.isNormaledit) {
            if (!Object.keys(this.emptyRowData).length) {
                this.createEmptyRowdata();
            }
            this.isAdd = true;
            var page = this.parent.pageSettings.currentPage;
            if (page > 1 && this.parent.editSettings.newRowPosition === 'Top') {
                this.isAdd = true;
                this.onActionBegin();
                args.startEdit = false;
                this.content.scrollTop = 0;
            }
            if (page < this.maxPage - 1 && this.parent.editSettings.newRowPosition === 'Bottom') {
                this.isAdd = true;
                this.parent.setProperties({ pageSettings: { currentPage: this.maxPage - 1 } }, true);
                args.startEdit = false;
                this.content.scrollTop = this.offsets[this.offsetKeys.length];
            }
        }
    };
    /** @hidden */
    VirtualContentRenderer.prototype.getRowObjectByIndex = function (index) {
        var data = this.getRowCollection(index, false, true);
        return data;
    };
    VirtualContentRenderer.prototype.getBlockSize = function () {
        return this.parent.pageSettings.pageSize >> 1;
    };
    VirtualContentRenderer.prototype.getBlockHeight = function () {
        return this.getBlockSize() * this.parent.getRowHeight();
    };
    VirtualContentRenderer.prototype.isEndBlock = function (index) {
        var totalBlocks = this.getTotalBlocks();
        return index >= totalBlocks || index === totalBlocks - 1;
    };
    VirtualContentRenderer.prototype.getGroupedTotalBlocks = function () {
        var rows = this.parent.vcRows;
        return Math.floor((rows.length / this.getBlockSize()) < 1 ? 1 : rows.length / this.getBlockSize());
    };
    VirtualContentRenderer.prototype.getTotalBlocks = function () {
        return Math.ceil(this.count / this.getBlockSize());
    };
    VirtualContentRenderer.prototype.getColumnOffset = function (block) {
        return this.vgenerator.cOffsets[block] | 0;
    };
    VirtualContentRenderer.prototype.getModelGenerator = function () {
        return new VirtualRowModelGenerator(this.parent);
    };
    VirtualContentRenderer.prototype.resetScrollPosition = function (action) {
        if (this.actions.some(function (value) { return value === action; })) {
            this.preventEvent = this.content.scrollTop !== 0;
            this.content.scrollTop = 0;
        }
        if (action !== 'virtualscroll') {
            this.isAdd = false;
        }
    };
    VirtualContentRenderer.prototype.onActionBegin = function (e) {
        //Update property silently..
        this.parent.setProperties({ pageSettings: { currentPage: 1 } }, true);
    };
    VirtualContentRenderer.prototype.getRows = function () {
        return this.vgenerator.getRows();
    };
    VirtualContentRenderer.prototype.getRowByIndex = function (index) {
        if (isGroupAdaptive(this.parent)) {
            return this.parent.getDataRows()[index];
        }
        return this.getRowCollection(index, false);
    };
    VirtualContentRenderer.prototype.getMovableVirtualRowByIndex = function (index) {
        return this.getRowCollection(index, true);
    };
    VirtualContentRenderer.prototype.getFrozenRightVirtualRowByIndex = function (index) {
        return this.getRowCollection(index, false, false, true);
    };
    VirtualContentRenderer.prototype.getRowCollection = function (index, isMovable, isRowObject, isFrozenRight) {
        var prev = this.prevInfo.blockIndexes;
        var startIdx = (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) ?
            (prev[0] - 1) * this.getBlockSize() : this.startIndex;
        var rowCollection = isMovable ? this.parent.getMovableDataRows() : this.parent.getDataRows();
        rowCollection = isFrozenRight ? this.parent.getFrozenRightDataRows() : rowCollection;
        var collection = isRowObject ? this.parent.getCurrentViewRecords() : rowCollection;
        var selectedRow = collection[index - startIdx];
        if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
            if (!isRowObject) {
                selectedRow = index <= this.parent.frozenRows ? rowCollection[index]
                    : rowCollection[(index - startIdx) + this.parent.frozenRows];
            }
            else {
                selectedRow = index <= this.parent.frozenRows ? this.parent.getRowsObject()[index].data : selectedRow;
            }
        }
        return selectedRow;
    };
    VirtualContentRenderer.prototype.getVirtualRowIndex = function (index) {
        var prev = this.prevInfo.blockIndexes;
        var startIdx = (prev[0] - 1) * this.getBlockSize();
        return startIdx + index;
    };
    /** @hidden */
    VirtualContentRenderer.prototype.refreshOffsets = function () {
        var gObj = this.parent;
        var row = 0;
        var bSize = this.getBlockSize();
        var total = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[total];
        this.maxBlock = total % 2 === 0 ? total - 2 : total - 1;
        this.offsets = {};
        //Row offset update
        var blocks = Array.apply(null, Array(total)).map(function () { return ++row; });
        for (var i = 0; i < blocks.length; i++) {
            var tmp = (this.vgenerator.cache[blocks[i]] || []).length;
            var rem = !isGroupAdaptive(this.parent) ? this.count % bSize : (gObj.vcRows.length % bSize);
            var size = !isGroupAdaptive(this.parent) && blocks[i] in this.vgenerator.cache ?
                tmp * this.parent.getRowHeight() : rem && blocks[i] === total ? rem * this.parent.getRowHeight() :
                this.getBlockHeight();
            // let size: number = this.parent.groupSettings.columns.length && block in this.vgenerator.cache ?
            // tmp * getRowHeight() : this.getBlockHeight();
            this.offsets[blocks[i]] = (this.offsets[blocks[i] - 1] | 0) + size;
            this.tmpOffsets[blocks[i]] = this.offsets[blocks[i] - 1] | 0;
        }
        this.offsetKeys = Object.keys(this.offsets);
        if (isGroupAdaptive(this.parent)) {
            this.parent.vGroupOffsets = this.offsets;
        }
        //Column offset update
        if (this.parent.enableColumnVirtualization) {
            this.vgenerator.refreshColOffsets();
        }
    };
    VirtualContentRenderer.prototype.refreshVirtualElement = function () {
        this.vgenerator.refreshColOffsets();
        this.setVirtualHeight();
    };
    VirtualContentRenderer.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var frozenCols = this.parent.getFrozenColumns();
        var fcntColGrp;
        var mcntColGrp;
        if (frozenCols) {
            fcntColGrp = [].slice.call(this.parent.getFrozenVirtualContent().querySelectorAll('col'));
            mcntColGrp = [].slice.call(this.parent.getMovableVirtualContent().querySelectorAll('col'));
        }
        if (isBlazor() && gObj.isServerRendered) {
            this.parent.notify('setvisibility', columns);
        }
        var rows = [];
        rows = this.getRows();
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var needFullRefresh = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        var tr = gObj.getDataRows();
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            var idx = gObj.getNormalizedColumnIndex(column.uid);
            var displayVal = column.visible === true ? '' : 'none';
            var colGrp = void 0;
            if (fcntColGrp && mcntColGrp) {
                if (idx >= frozenCols) {
                    colGrp = mcntColGrp;
                    tr = this.parent.getMovableRows();
                    idx = idx - frozenCols;
                }
                else {
                    colGrp = fcntColGrp;
                }
            }
            else {
                colGrp = this.getColGroup().children;
            }
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(colGrp[idx], { 'display': displayVal });
            }
            if (!needFullRefresh) {
                var width = void 0;
                if (column.visible) {
                    width = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                }
                else {
                    width = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                }
                if (width > gObj.width) {
                    this.setDisplayNone(tr, idx, displayVal, rows);
                    if (this.parent.enableColumnVirtualization) {
                        this.virtualEle.setWrapperWidth(width + '');
                    }
                    this.refreshVirtualElement();
                }
                else {
                    needFullRefresh = true;
                }
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (isBlazor() && this.parent.isServerRendered && needFullRefresh) {
            var inViewIdx = this.parent.inViewIndexes;
            var translateX = this.getColumnOffset(inViewIdx[0] - 1);
            var width = this.getColumnOffset(inViewIdx[inViewIdx.length - 1]) - translateX + '';
            this.parent.notify('refresh-virtual-indices', { requestType: 'virtualScrollRefresh',
                startColumnIndex: inViewIdx[0], endColumnIndex: inViewIdx[inViewIdx.length - 1], axis: 'X',
                VTablewidth: width, translateX: translateX });
            this.parent.notify('setcolumnstyles', {});
        }
        if (needFullRefresh || frozenCols) {
            this.refreshContentRows({ requestType: 'refresh' });
        }
        else {
            this.parent.notify(events.partialRefresh, { rows: rows, args: { isFrozen: false, rows: rows } });
        }
    };
    VirtualContentRenderer.prototype.selectVirtualRow = function (args) {
        var _this = this;
        if (this.activeKey !== 'upArrow' && this.activeKey !== 'downArrow'
            && !this.requestTypes.some(function (value) { return value === _this.requestType; }) && !this.parent.selectionModule.isInteracted) {
            var selectedRow = this.parent.getRowByIndex(args.selectedIndex);
            var rowHeight = this.parent.getRowHeight();
            var eleOffsHeight = this.content.offsetHeight;
            if (!selectedRow || this.isRowInView(args.selectedIndex, selectedRow, this.content, eleOffsHeight, rowHeight)) {
                this.isSelection = true;
                this.selectedRowIndex = args.selectedIndex;
                var scrollTop = (args.selectedIndex + 1) * rowHeight;
                if (!isNullOrUndefined(scrollTop)) {
                    this.content.scrollTop = scrollTop;
                }
            }
        }
        if (this.parent.isFrozenGrid() && this.requestType) {
            if (this.parent.getTablesCount() === this.frzIdx) {
                this.requestType = this.empty;
                this.frzIdx = 1;
            }
            else {
                this.frzIdx++;
            }
        }
        else {
            this.requestType = this.empty;
        }
    };
    VirtualContentRenderer.prototype.isRowInView = function (index, selectedRow, ele, eleOffsHeight, rowHeight) {
        if (isBlazor()) {
            var exactTopIndex = ele.scrollTop / rowHeight;
            var exactEndIndex = exactTopIndex + (eleOffsHeight / rowHeight);
            return (index < exactTopIndex || index > exactEndIndex);
        }
        else {
            if (this.parent.frozenRows && index < this.parent.frozenRows) {
                return false;
            }
            var rectTop = selectedRow ? selectedRow.getBoundingClientRect().top : 0;
            return (rectTop < rowHeight || rectTop > eleOffsHeight);
        }
    };
    return VirtualContentRenderer;
}(ContentRender));
export { VirtualContentRenderer };
/**
 * @hidden
 */
var VirtualHeaderRenderer = /** @class */ (function (_super) {
    __extends(VirtualHeaderRenderer, _super);
    function VirtualHeaderRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.virtualEle = new VirtualElementHandler();
        _this.isMovable = false;
        _this.gen = new VirtualRowModelGenerator(_this.parent);
        _this.parent.on(events.columnVisibilityChanged, _this.setVisible, _this);
        _this.parent.on(refreshVirtualBlock, function (e) { return e.virtualInfo.sentinelInfo.axis === 'X' ? _this.refreshUI() : null; }, _this);
        return _this;
    }
    VirtualHeaderRenderer.prototype.renderTable = function () {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(this.getPanel().querySelector('.e-headercontent')));
        if (isBlazor() && this.parent.isServerRendered) {
            this.parent.notify('refresh-virtual-indices', {
                startColumnIndex: this.parent.contentModule.startColIndex,
                endColumnIndex: this.parent.contentModule.endColIndex, axis: 'X'
            });
        }
        _super.prototype.renderTable.call(this);
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.getPanel().querySelector('.e-headercontent');
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder('absolute');
    };
    VirtualHeaderRenderer.prototype.appendContent = function (table) {
        if (!this.isMovable) {
            this.virtualEle.wrapper.appendChild(table);
        }
        else {
            this.virtualEle.movableWrapper.appendChild(table);
            this.isMovable = false;
        }
    };
    VirtualHeaderRenderer.prototype.refreshUI = function () {
        this.isMovable = this.parent.isFrozenGrid();
        this.setFrozenTable(this.parent.getMovableVirtualContent());
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(this.getPanel().querySelector('.e-headercontent')));
        _super.prototype.refreshUI.call(this);
        this.setFrozenTable(this.parent.getFrozenVirtualContent());
    };
    VirtualHeaderRenderer.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var displayVal;
        var idx;
        var needFullRefresh;
        var frozenCols = this.parent.getFrozenColumns();
        var fhdrColGrp;
        var mhdrColGrp;
        if (frozenCols) {
            fhdrColGrp = [].slice.call(this.parent.getFrozenVirtualHeader().querySelectorAll('col'));
            mhdrColGrp = [].slice.call(this.parent.getMovableVirtualHeader().querySelectorAll('col'));
        }
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            var colGrp = void 0;
            if (fhdrColGrp && mhdrColGrp) {
                if (idx >= frozenCols) {
                    colGrp = mhdrColGrp;
                    idx = idx - frozenCols;
                }
                else {
                    colGrp = fhdrColGrp;
                }
            }
            else {
                colGrp = this.getColGroup().children;
            }
            setStyleAttribute(colGrp[idx], { 'display': displayVal });
            if (gObj.enableColumnVirtualization && !gObj.groupSettings.columns.length) {
                var tablewidth = void 0;
                if (column.visible) {
                    tablewidth = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                }
                else {
                    tablewidth = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                }
                if (tablewidth > gObj.width) {
                    this.setDisplayNone(column, displayVal);
                    this.virtualEle.setWrapperWidth(tablewidth + '');
                    this.gen.refreshColOffsets();
                }
                else {
                    needFullRefresh = true;
                }
            }
            else {
                needFullRefresh = true;
            }
            if (needFullRefresh && !frozenCols) {
                this.refreshUI();
            }
        }
        if (frozenCols) {
            this.parent.notify(events.columnPositionChanged, {});
        }
    };
    VirtualHeaderRenderer.prototype.setFrozenTable = function (content) {
        if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization
            && this.parent.contentModule.isXaxis()) {
            this.parent.contentModule
                .setTable(content.querySelector('.e-table'));
        }
    };
    VirtualHeaderRenderer.prototype.setDisplayNone = function (col, displayVal) {
        var frozenCols = this.parent.isFrozenGrid();
        var table = this.getTable();
        if (frozenCols && col.getFreezeTableName() === 'movable') {
            table = this.parent.getMovableVirtualHeader().querySelector('.e-table');
        }
        for (var _i = 0, _a = [].slice.apply(table.querySelectorAll('th.e-headercell')); _i < _a.length; _i++) {
            var ele = _a[_i];
            if (ele.querySelector('[e-mappinguid]') &&
                ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === col.uid) {
                setStyleAttribute(ele, { 'display': displayVal });
                if (displayVal === '') {
                    removeClass([ele], 'e-hide');
                }
                break;
            }
        }
    };
    return VirtualHeaderRenderer;
}(HeaderRender));
export { VirtualHeaderRenderer };
/**
 * @hidden
 */
var VirtualElementHandler = /** @class */ (function () {
    function VirtualElementHandler() {
    }
    VirtualElementHandler.prototype.renderWrapper = function (height) {
        if (isBlazor()) {
            this.wrapper = this.content.querySelector('.e-virtualtable') ? this.content.querySelector('.e-virtualtable') :
                createElement('div', { className: 'e-virtualtable' });
            this.wrapper.setAttribute('styles', "min-height:" + formatUnit(height));
        }
        else {
            this.wrapper = createElement('div', { className: 'e-virtualtable', styles: "min-height:" + formatUnit(height) });
        }
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    };
    VirtualElementHandler.prototype.renderPlaceHolder = function (position) {
        if (position === void 0) { position = 'relative'; }
        if (isBlazor()) {
            this.placeholder = this.content.querySelector('.e-virtualtrack') ? this.content.querySelector('.e-virtualtrack') :
                createElement('div', { className: 'e-virtualtrack' });
            this.placeholder.setAttribute('styles', "position:" + position);
        }
        else {
            this.placeholder = createElement('div', { className: 'e-virtualtrack', styles: "position:" + position });
        }
        this.content.appendChild(this.placeholder);
    };
    VirtualElementHandler.prototype.renderFrozenWrapper = function (height) {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: "min-height:" + formatUnit(height) + "; display: flex" });
        this.content.appendChild(this.wrapper);
    };
    VirtualElementHandler.prototype.renderFrozenPlaceHolder = function () {
        this.placeholder = createElement('div', { className: 'e-virtualtrack' });
        this.content.appendChild(this.placeholder);
    };
    VirtualElementHandler.prototype.renderMovableWrapper = function (height) {
        this.movableWrapper = createElement('div', { className: 'e-virtualtable', styles: "min-height:" + formatUnit(height) });
        this.movableContent.appendChild(this.movableWrapper);
    };
    VirtualElementHandler.prototype.renderMovablePlaceHolder = function () {
        this.movablePlaceholder = createElement('div', { className: 'e-virtualtrack' });
        this.movableContent.appendChild(this.movablePlaceholder);
    };
    VirtualElementHandler.prototype.adjustTable = function (xValue, yValue) {
        this.wrapper.style.transform = "translate(" + xValue + "px, " + yValue + "px)";
    };
    VirtualElementHandler.prototype.adjustMovableTable = function (xValue, yValue) {
        this.movableWrapper.style.transform = "translate(" + xValue + "px, " + yValue + "px)";
    };
    VirtualElementHandler.prototype.setMovableWrapperWidth = function (width, full) {
        this.movableWrapper.style.width = width ? width + "px" : full ? '100%' : '';
    };
    VirtualElementHandler.prototype.setMovableVirtualHeight = function (height, width) {
        this.movablePlaceholder.style.height = height + "px";
        this.movablePlaceholder.style.width = width;
    };
    VirtualElementHandler.prototype.setWrapperWidth = function (width, full) {
        this.wrapper.style.width = width ? width + "px" : full ? '100%' : '';
    };
    VirtualElementHandler.prototype.setVirtualHeight = function (height, width) {
        this.placeholder.style.height = height + "px";
        this.placeholder.style.width = width;
    };
    VirtualElementHandler.prototype.setFreezeWrapperWidth = function (wrapper, width, full) {
        wrapper.style.width = width ? width + "px" : full ? '100%' : '';
    };
    return VirtualElementHandler;
}());
export { VirtualElementHandler };
