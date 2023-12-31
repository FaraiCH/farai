import { spreadsheetDestroyed, getUpdateUsingRaf } from '../common/index';
import { autoFit, hideShow, virtualContentLoaded, completeAction, setScrollEvent, onContentScroll, skipHiddenIdx } from '../common/index';
import { beginAction, hiddenMerge, updateTableWidth } from '../common/index';
import { getCellAddress, isHiddenRow, setRow, setColumn, isHiddenCol, getRangeAddress, getCell } from '../../workbook/index';
import { getCellIndexes, getColumnWidth, applyCellFormat } from '../../workbook/index';
import { activeCellMergedRange, setMerge } from '../../workbook/index';
import { detach } from '@syncfusion/ej2-base';
/**
 * The `ShowHide` module is used to perform hide/show the rows and columns.
 * @hidden
 */
var ShowHide = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet show hide module.
     * @private
     */
    function ShowHide(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ShowHide.prototype.hideShow = function (args) {
        if (args.startIndex > args.endIndex) {
            var temp = args.startIndex;
            args.startIndex = args.endIndex;
            args.endIndex = temp;
        }
        if (args.actionUpdate) {
            this.parent.notify(beginAction, { eventArgs: args, action: 'hideShow' });
        }
        args.isCol ? this.hideCol(args) : this.hideRow(args);
        if (args.actionUpdate) {
            this.parent.notify(completeAction, { eventArgs: args, action: 'hideShow' });
        }
    };
    // tslint:disable-next-line
    ShowHide.prototype.hideRow = function (args) {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        var cell;
        var count = 0;
        var idx;
        var nextIdx;
        var merge;
        if (args.hide) {
            var content = void 0;
            var rowHdr = void 0;
            var row = void 0;
            for (var i = args.startIndex; i <= args.endIndex; i++) {
                if (isHiddenRow(sheet, i)) {
                    continue;
                }
                if (idx === undefined) {
                    if (sheet.showHeaders) {
                        rowHdr = this.parent.getRowHeaderTable();
                    }
                    content = this.parent.getContentTable();
                    idx = this.parent.getViewportIndex(i);
                    count = 0;
                }
                setRow(sheet, i, { hidden: true });
                row = content.rows[idx];
                if (row) {
                    if (!merge) {
                        for (var j = 0; j <= sheet.usedRange.colIndex; j++) {
                            cell = getCell(i, j, sheet) || {};
                            if ((cell.colSpan || cell.rowSpan) && (args.startIndex >= this.parent.viewport.topIndex ||
                                this.parent.scrollSettings.enableVirtualization)) {
                                merge = true;
                                break;
                            }
                        }
                    }
                    if (merge) {
                        continue;
                    }
                    if (sheet.showHeaders) {
                        detach(rowHdr.rows[idx]);
                    }
                    detach(row);
                    count++;
                    row = content.rows[idx];
                    if (row && i === args.endIndex) {
                        var cell_1 = void 0;
                        nextIdx = skipHiddenIdx(sheet, i + 1, true);
                        var first = nextIdx !== skipHiddenIdx(sheet, 0, true) && nextIdx ===
                            (this.parent.viewport.topIndex >= args.startIndex ? args.endIndex + 1 : this.parent.viewport.topIndex) ? 'Row' : '';
                        for (var j = this.parent.viewport.leftIndex; j <= this.parent.viewport.rightIndex; j++) {
                            var borderTop = this.parent.getCellStyleValue(['borderTop'], [nextIdx, j]).borderTop;
                            if (borderTop !== '') {
                                cell_1 = row.cells[j];
                                this.parent.notify(applyCellFormat, { onActionUpdate: false, rowIdx: nextIdx, colIdx: j,
                                    style: { borderTop: borderTop }, row: row, pRow: row.previousElementSibling,
                                    first: first, cell: cell_1 });
                            }
                        }
                    }
                }
                else {
                    if (i <= this.parent.viewport.bottomIndex) {
                        count++;
                    }
                    else {
                        count--;
                    }
                }
            }
            if (merge && (args.startIndex >= this.parent.viewport.topIndex || !this.parent.scrollSettings.enableVirtualization)) {
                this.parent.selectRange(sheet.selectedRange);
                this.parent.renderModule.refreshUI({
                    rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                });
                return;
            }
            if (!count) {
                return;
            }
            this.parent.selectRange(sheet.selectedRange);
            if (this.parent.scrollSettings.enableVirtualization) {
                if (this.parent.viewport.topIndex >= args.startIndex) {
                    this.parent.viewport.topIndex = args.endIndex + 1;
                }
                args.startIndex = this.parent.viewport.bottomIndex + 1;
                args.endIndex = args.startIndex + count - 1;
                var indexes = this.parent.skipHidden(args.startIndex, args.endIndex);
                args.startIndex = indexes[0];
                args.endIndex = indexes[1];
                this.parent.viewport.bottomIndex = args.endIndex;
                this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, direction: '', refresh: 'RowPart' }, getCellAddress(args.startIndex, this.parent.viewport.leftIndex) + ":" + getCellAddress(args.endIndex, this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2)));
            }
            if (sheet.showHeaders) {
                if (idx === 0) {
                    if (rowHdr.rows[0]) {
                        rowHdr.rows[0].classList.add('e-hide-end');
                    }
                }
                else {
                    if (rowHdr.rows[idx - 1]) {
                        rowHdr.rows[idx - 1].classList.add('e-hide-start');
                    }
                    if (rowHdr.rows[idx]) {
                        rowHdr.rows[idx].classList.add('e-hide-end');
                    }
                }
            }
        }
        else {
            var hFrag = void 0;
            var frag = void 0;
            var hRow = void 0;
            var row = void 0;
            var rowRenderer = void 0;
            var rTBody = void 0;
            var tBody = void 0;
            var startRow = void 0;
            var endRow = args.startIndex - 1;
            var newStartRow = void 0;
            var mergeCollection = [];
            for (var i = args.startIndex, len = args.endIndex; i <= len; i++) {
                if (!isHiddenRow(sheet, i)) {
                    if (args.startIndex === args.endIndex) {
                        return;
                    }
                    if (idx === undefined) {
                        endRow++;
                    }
                    else {
                        newStartRow = i;
                    }
                    continue;
                }
                if (newStartRow !== undefined) {
                    len = i;
                    continue;
                }
                if (i > this.parent.viewport.bottomIndex) {
                    setRow(sheet, i, { hidden: false });
                    if (startRow === undefined) {
                        return;
                    }
                    continue;
                }
                if (startRow === undefined) {
                    startRow = i;
                }
                setRow(sheet, i, { hidden: false });
                if (idx === undefined) {
                    hFrag = document.createDocumentFragment();
                    frag = document.createDocumentFragment();
                    rowRenderer = this.parent.serviceLocator.getService('row');
                    if (sheet.showHeaders) {
                        rTBody = this.parent.getRowHeaderTable().tBodies[0];
                    }
                    tBody = this.parent.getContentTable().tBodies[0];
                    if (i < this.parent.viewport.topIndex) {
                        this.parent.viewport.topIndex = i;
                    }
                    if (i === 0) {
                        idx = 0;
                    }
                    else {
                        idx = this.parent.getViewportIndex(i);
                    }
                }
                endRow++;
                if (sheet.showHeaders) {
                    hRow = rowRenderer.refresh(i, null, null, true);
                    hFrag.appendChild(hRow);
                    detach(rTBody.lastElementChild);
                }
                row = frag.appendChild(rowRenderer.refresh(i, row, hRow));
                detach(tBody.lastElementChild);
                for (var j = this.parent.viewport.leftIndex; j <= this.parent.viewport.rightIndex; j++) {
                    cell = getCell(i, j, sheet) || {};
                    if (cell.rowSpan !== undefined) {
                        var mergeArgs = { range: [i, j, i, j], isAction: false, merge: true,
                            type: 'All', skipChecking: true };
                        this.parent.notify(activeCellMergedRange, mergeArgs);
                        if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1]) {
                            mergeCollection.push(mergeArgs);
                        }
                    }
                }
            }
            this.parent.viewport.bottomIndex = this.parent.viewport.topIndex + this.parent.viewport.rowCount +
                (this.parent.getThreshold('row') * 2);
            count = this.parent.hiddenCount(this.parent.viewport.topIndex, args.startIndex) +
                this.parent.hiddenCount(args.endIndex + 1, this.parent.viewport.bottomIndex);
            this.parent.viewport.bottomIndex += count;
            args.insertIdx = idx;
            args.row = frag.querySelector('.e-row');
            args.mergeCollection = mergeCollection;
            if (sheet.showHeaders) {
                args.hdrRow = hFrag.querySelector('.e-row');
                if (idx !== 0 && !isHiddenRow(sheet, endRow - 1) && rTBody.children[idx - 1]) {
                    rTBody.children[idx - 1].classList.remove('e-hide-start');
                }
                if (args.startIndex !== 0 && isHiddenRow(sheet, args.startIndex - 1)) {
                    args.hdrRow.classList.add('e-hide-end');
                }
                if (isHiddenRow(sheet, endRow + 1)) {
                    hFrag.lastElementChild.classList.add('e-hide-start');
                }
                else {
                    if (rTBody.children[idx]) {
                        rTBody.children[idx].classList.remove('e-hide-end');
                    }
                }
            }
            if (row && tBody.children[idx]) {
                nextIdx = skipHiddenIdx(sheet, endRow + 1, true);
                for (var i = this.parent.viewport.leftIndex; i <= this.parent.viewport.rightIndex; i++) {
                    var borderTop = this.parent.getCellStyleValue(['borderTop'], [nextIdx, i]).borderTop;
                    if (borderTop !== '') {
                        this.parent.notify(applyCellFormat, { onActionUpdate: false, rowIdx: nextIdx, colIdx: i,
                            style: { borderTop: borderTop }, pRow: row, cell: tBody.children[idx].children[i],
                            first: '' });
                        var prevIdx = skipHiddenIdx(sheet, startRow - 1, false);
                        if (prevIdx > -1) {
                            if (tBody.children[idx - 1] && !this.parent.getCellStyleValue(['borderBottom'], [prevIdx, i]).borderBottom &&
                                !this.parent.getCellStyleValue(['borderTop'], [startRow, i]).borderTop) {
                                tBody.children[idx - 1].children[i].style.borderBottom = '';
                            }
                        }
                        else {
                            tBody.children[idx].children[i].style.borderTop = '';
                        }
                    }
                }
            }
            if (args.skipAppend) {
                return;
            }
            if (sheet.showHeaders) {
                rTBody.insertBefore(hFrag, rTBody.children[idx]);
            }
            tBody.insertBefore(frag, tBody.children[idx]);
            this.parent.selectRange(sheet.selectedRange);
            if (args.autoFit && sheet.showHeaders) {
                this.parent.notify(autoFit, { startIndex: args.startIndex, endIndex: args.endIndex, isRow: true });
            }
            mergeCollection.forEach(function (mergeArgs) { _this.parent.notify(setMerge, mergeArgs); });
            if (newStartRow !== undefined && newStartRow !== args.endIndex) {
                args.startIndex = newStartRow;
                this.hideRow(args);
            }
        }
    };
    ShowHide.prototype.hideCol = function (args) {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        var hiddenIndex = [];
        var beforeViewportIdx = [];
        var topLeftCell = getCellIndexes(sheet.topLeftCell);
        var scrollable;
        for (var i = args.startIndex; i <= args.endIndex; i++) {
            if (args.hide ? isHiddenCol(sheet, i) : !isHiddenCol(sheet, i)) {
                continue;
            }
            setColumn(sheet, i, { hidden: args.hide });
            if (this.parent.scrollSettings.enableVirtualization && (i < this.parent.viewport.leftIndex ||
                i > this.parent.viewport.rightIndex)) {
                if (i < this.parent.viewport.leftIndex) {
                    beforeViewportIdx.push(i);
                }
                continue;
            }
            hiddenIndex.push(i);
            if (args.hide && topLeftCell[1] === i) {
                scrollable = true;
            }
        }
        if (!beforeViewportIdx.length && !hiddenIndex.length) {
            return;
        }
        if (args.hide) {
            if (!hiddenIndex.length) {
                return;
            }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization) {
                this.removeCell(sheet, hiddenIndex);
            }
            if (this.parent.scrollSettings.enableVirtualization) {
                if (hiddenIndex[0] === this.parent.viewport.leftIndex) {
                    this.parent.viewport.leftIndex = skipHiddenIdx(sheet, hiddenIndex[hiddenIndex.length - 1] + 1, true, 'columns');
                }
                if (scrollable) {
                    var scrollWidth_1 = 0;
                    hiddenIndex.slice(0, hiddenIndex.indexOf(topLeftCell[1])).forEach(function (colIdx) {
                        scrollWidth_1 += getColumnWidth(sheet, colIdx, true);
                    });
                    if (scrollWidth_1) {
                        this.parent.notify(setScrollEvent, { set: false });
                        var content = this.parent.getMainContent();
                        content.scrollLeft -= scrollWidth_1;
                        this.parent.notify(onContentScroll, { scrollLeft: content.scrollLeft, preventScroll: true, skipHidden: true });
                        getUpdateUsingRaf(function () { return _this.parent.notify(setScrollEvent, { set: true }); });
                    }
                }
                if (this.parent.scrollSettings.isFinite) {
                    var colCount = skipHiddenIdx(sheet, sheet.colCount - 1, false, 'columns');
                    var startIdx = this.parent.viewport.leftIndex;
                    var endIndex = this.parent.viewport.rightIndex;
                    if (endIndex + hiddenIndex.length >= colCount) {
                        var index = skipHiddenIdx(sheet, startIdx - ((endIndex + hiddenIndex.length) - colCount), false, 'columns');
                        if (index > -1) {
                            this.parent.viewport.leftIndex = index;
                            this.parent.viewport.leftIndex -= this.parent.hiddenCount(endIndex, colCount);
                        }
                        this.parent.viewport.rightIndex = colCount;
                        if (startIdx !== this.parent.viewport.leftIndex || endIndex !== this.parent.viewport.rightIndex) {
                            this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column' });
                        }
                        else {
                            this.parent.notify(updateTableWidth, { refresh: 'Column' });
                        }
                        this.parent.selectRange(sheet.selectedRange);
                        return;
                    }
                }
                if (hiddenIndex.length <= this.parent.getThreshold('col')) {
                    var indexes = this.parent.skipHidden(this.parent.viewport.rightIndex + 1, this.parent.viewport.rightIndex + hiddenIndex.length, 'columns');
                    this.parent.viewport.rightIndex = indexes[1];
                    this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: indexes[0], direction: '', refresh: 'ColumnPart' }, "" + getRangeAddress([this.parent.viewport.topIndex, indexes[0], this.parent.viewport.bottomIndex, indexes[1]]));
                }
                else {
                    this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                        refresh: 'Column' });
                }
            }
            this.parent.selectRange(sheet.selectedRange);
        }
        else {
            if (beforeViewportIdx.length) {
                beforeViewportIdx.sort(function (i, j) { return i - j; });
                if (this.parent.scrollSettings.enableVirtualization && beforeViewportIdx[0] < this.parent.getThreshold('col')) {
                    var rowIdx = getCellIndexes(sheet.topLeftCell)[0] + 1;
                    this.parent.setSheetPropertyOnMute(sheet, 'topLeftCell', "A" + rowIdx);
                    this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, rowIndex: this.parent.viewport.topIndex, colIndex: 0,
                        refresh: 'Column' });
                    this.parent.selectRange(sheet.selectedRange);
                }
                else {
                    this.parent.goTo(getCellAddress(this.parent.viewport.topIndex, beforeViewportIdx[0]));
                }
                return;
            }
            if (hiddenIndex.length <= this.parent.getThreshold('col') || !this.parent.scrollSettings.enableVirtualization) {
                this.appendCell(sheet, hiddenIndex);
                if (this.parent.scrollSettings.enableVirtualization) {
                    this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
                }
            }
            else {
                this.parent.renderModule.refreshUI({ skipUpdateOnFirst: this.parent.viewport.leftIndex === skipHiddenIdx(sheet, 0, true, 'columns'), rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                    refresh: 'Column' });
            }
            this.parent.selectRange(sheet.selectedRange);
        }
    };
    ShowHide.prototype.removeCell = function (sheet, indexes) {
        var _this = this;
        var startIdx;
        var endIdx;
        var hRow;
        var row;
        var hColgrp;
        var colgrp;
        var rowIdx = 0;
        var cellIdx = this.parent.getViewportIndex(indexes[0], true) + 1;
        var cell;
        if (this.parent.scrollSettings.enableVirtualization) {
            startIdx = this.parent.viewport.topIndex;
            endIdx = this.parent.viewport.bottomIndex;
        }
        else {
            startIdx = 0;
            endIdx = sheet.rowCount - 1;
        }
        var table = this.parent.getContentTable();
        var nextIdx;
        colgrp = table.getElementsByTagName('colgroup')[0];
        var colSpan;
        if (sheet.showHeaders) {
            var hTable = this.parent.getColHeaderTable();
            hColgrp = hTable.getElementsByTagName('colgroup')[0];
            hRow = hTable.rows[0];
        }
        var modelLen = indexes.length - 1;
        var prevIdx;
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) {
                startIdx++;
                continue;
            }
            row = table.rows[rowIdx];
            indexes.forEach(function (idx, index) {
                detach(row.cells[cellIdx]);
                if (rowIdx === 0) {
                    if (sheet.showHeaders) {
                        detach(hRow.cells[cellIdx]);
                        detach(hColgrp.children[cellIdx]);
                    }
                    detach(colgrp.children[cellIdx]);
                }
                if (index === 0) {
                    cell = getCell(startIdx, idx, sheet) || {};
                    if (cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) {
                        _this.parent.notify(hiddenMerge, { rowIdx: startIdx, colIdx: idx, model: 'col',
                            start: indexes[0], end: indexes[modelLen] });
                    }
                }
                if (index === modelLen) {
                    nextIdx = skipHiddenIdx(sheet, idx + 1, true, 'columns');
                    var borderLeft = _this.parent.getCellStyleValue(['borderLeft'], [rowIdx, nextIdx]).borderLeft;
                    if (borderLeft !== '') {
                        _this.parent.notify(applyCellFormat, { onActionUpdate: false, rowIdx: rowIdx, colIdx: nextIdx,
                            style: { borderLeft: borderLeft }, row: row, first: '' });
                    }
                    cell = getCell(startIdx, idx, sheet) || {};
                    if (cell.colSpan !== undefined && (cell.rowSpan === undefined || cell.colSpan > 1)) {
                        _this.parent.notify(hiddenMerge, { rowIdx: startIdx, colIdx: idx, model: 'col',
                            start: indexes[0], end: indexes[modelLen], isEnd: true });
                    }
                }
            });
            startIdx++;
            rowIdx++;
        }
        if (cellIdx - 1 > -1) {
            if (sheet.showHeaders && hRow.cells[cellIdx - 1]) {
                hRow.cells[cellIdx - 1].classList.add('e-hide-start');
            }
        }
        if (hRow.cells[cellIdx]) {
            hRow.cells[cellIdx].classList.add('e-hide-end');
        }
    };
    ShowHide.prototype.appendCell = function (sheet, indexes) {
        var _this = this;
        var startIdx;
        var endIdx;
        var hRow;
        var row;
        var hColgrp;
        var colgrp;
        var rowIdx = 0;
        var prevIdx;
        var hFrag = document.createDocumentFragment();
        var frag = document.createDocumentFragment();
        var colFrag = document.createDocumentFragment();
        if (this.parent.scrollSettings.enableVirtualization) {
            startIdx = this.parent.viewport.topIndex;
            endIdx = this.parent.viewport.bottomIndex;
        }
        else {
            startIdx = 0;
            endIdx = sheet.rowCount - 1;
        }
        var table = this.parent.getContentTable();
        var hTable = this.parent.getColHeaderTable();
        colgrp = table.getElementsByTagName('colgroup')[0];
        if (sheet.showHeaders) {
            hColgrp = hTable.getElementsByTagName('colgroup')[0];
            hRow = hTable.rows[0];
        }
        var cellRenderer = this.parent.serviceLocator.getService('cell');
        indexes.sort(function (i, j) { return i - j; });
        var cellModel;
        var mergeCollection = [];
        var cellIdx = [];
        var cell;
        var refCell;
        var modelLen = indexes.length - 1;
        while (startIdx <= endIdx) {
            if (isHiddenRow(sheet, startIdx)) {
                startIdx++;
                continue;
            }
            row = table.rows[rowIdx];
            indexes.forEach(function (idx, index) {
                if (rowIdx === 0) {
                    cellIdx[index] = _this.parent.getViewportIndex(idx, true);
                    if (colgrp.children[cellIdx[index]]) {
                        colgrp.insertBefore(_this.parent.sheetModule.updateCol(sheet, idx), colgrp.children[cellIdx[index]]);
                        if (sheet.showHeaders) {
                            refCell = hRow.cells[cellIdx[index]];
                            if (index === 0 && indexes[index] && !isHiddenCol(sheet, indexes[index] - 1)) {
                                refCell.previousElementSibling.classList.remove('e-hide-start');
                            }
                            hRow.insertBefore(cellRenderer.renderColHeader(idx), refCell);
                            if (index === modelLen) {
                                refCell.classList.remove('e-hide-end');
                            }
                        }
                    }
                    else {
                        colgrp.appendChild(_this.parent.sheetModule.updateCol(sheet, idx));
                        if (sheet.showHeaders) {
                            hRow.appendChild(cellRenderer.renderColHeader(idx));
                        }
                    }
                    detach(colgrp.lastChild);
                    if (sheet.showHeaders) {
                        detach(hRow.lastChild);
                        if (index === modelLen) {
                            detach(hColgrp);
                            hTable.insertBefore(colgrp.cloneNode(true), hTable.tHead[0]);
                        }
                    }
                }
                detach(row.lastChild);
                refCell = row.cells[cellIdx[index]];
                cell = cellRenderer.render({ rowIdx: startIdx, colIdx: idx, cell: getCell(startIdx, idx, sheet),
                    address: getCellAddress(startIdx, idx), lastCell: idx === modelLen, isHeightCheckNeeded: true,
                    first: idx !== skipHiddenIdx(sheet, 0, true, 'columns') && idx === _this.parent.viewport.leftIndex ? 'Column' : '',
                    checkNextBorder: index === modelLen ? 'Column' : '' });
                refCell ? row.insertBefore(cell, refCell) : row.appendChild(cell);
                if (index === 0 && cell.previousSibling) {
                    var borderLeft = _this.parent.getCellStyleValue(['borderLeft'], [rowIdx, skipHiddenIdx(sheet, indexes[indexes.length - 1] + 1, true, 'columns')]).borderLeft;
                    if (borderLeft !== '') {
                        prevIdx = skipHiddenIdx(sheet, indexes[0] - 1, false, 'columns');
                        if (prevIdx > -1 && !_this.parent.getCellStyleValue(['borderRight'], [rowIdx, prevIdx]).borderRight &&
                            !_this.parent.getCellStyleValue(['borderLeft'], [rowIdx, indexes[0]]).borderLeft) {
                            cell.previousSibling.style.borderRight = '';
                        }
                    }
                }
                cellModel = getCell(rowIdx, idx, sheet) || {};
                if (cellModel.colSpan !== undefined && (cellModel.rowSpan === undefined || cellModel.colSpan > 1)) {
                    var mergeArgs = { range: [rowIdx, idx, rowIdx, idx], isAction: false, merge: true,
                        type: 'All', skipChecking: true };
                    _this.parent.notify(activeCellMergedRange, mergeArgs);
                    if (!mergeCollection.length || mergeArgs.range[1] !== mergeCollection[mergeCollection.length - 1].range[1]) {
                        mergeCollection.push(mergeArgs);
                    }
                }
            });
            startIdx++;
            rowIdx++;
        }
        mergeCollection.forEach(function (mergeArgs) { _this.parent.notify(setMerge, mergeArgs); });
        this.parent.viewport.rightIndex = skipHiddenIdx(sheet, this.parent.viewport.rightIndex - indexes.length, false, 'columns');
    };
    ShowHide.prototype.addEventListener = function () {
        this.parent.on(hideShow, this.hideShow, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    ShowHide.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    ShowHide.prototype.removeEventListener = function () {
        this.parent.off(hideShow, this.hideShow);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    };
    return ShowHide;
}());
export { ShowHide };
