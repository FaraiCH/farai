import { closest, EventHandler } from '@syncfusion/ej2-base';
import { colWidthChanged, rowHeightChanged, beforeHeaderLoaded, contentLoaded, hideShow, getFilterRange } from '../common/index';
import { findMaxValue, setResize, autoFit, completeAction, setAutoFit } from '../common/index';
import { setRowHeight, isHiddenRow, getRowHeight, getColumnWidth, setColumn, isHiddenCol } from '../../workbook/base/index';
import { getColumn, setRow, getCell } from '../../workbook/base/index';
import { getRangeIndexes, getSwapRange, getCellIndexes, setMerge } from '../../workbook/common/index';
/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
var Resize = /** @class */ (function () {
    /**
     * Constructor for resize module in Spreadsheet.
     * @private
     */
    function Resize(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Resize.prototype.addEventListener = function () {
        this.parent.on(contentLoaded, this.wireEvents, this);
        this.parent.on(beforeHeaderLoaded, this.wireEvents, this);
        this.parent.on(autoFit, this.autoFit, this);
        this.parent.on(setAutoFit, this.setAutoFitHandler, this);
    };
    Resize.prototype.autoFit = function (args) {
        var element = args.isRow ? this.parent.getRowHeaderTable() : this.parent.getColHeaderTable().rows[0];
        for (var i = args.startIndex; i <= args.endIndex; i++) {
            this.trgtEle = args.isRow ? this.parent.getRow(i, element) :
                this.parent.getCell(null, i, element);
            this.setAutofit(i, !args.isRow);
        }
    };
    Resize.prototype.wireEvents = function (args) {
        if (this.parent.getActiveSheet().showHeaders) {
            var rowHeader = args ? args.element : this.parent.getRowHeaderContent();
            var colHeader = this.parent.getColumnHeaderContent();
            EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
            EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
            EventHandler.add(colHeader, 'mousedown', this.mouseDownHandler, this);
            EventHandler.add(rowHeader, 'mousedown', this.mouseDownHandler, this);
            this.wireResizeCursorEvent(rowHeader, colHeader);
        }
    };
    Resize.prototype.wireResizeCursorEvent = function (rowHeader, colHeader) {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    };
    Resize.prototype.unWireResizeCursorEvent = function () {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousemove', this.setTarget);
    };
    Resize.prototype.unwireEvents = function () {
        if (this.parent.getActiveSheet().showHeaders) {
            EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
            EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
            EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
            EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
            this.unWireResizeCursorEvent();
        }
    };
    Resize.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(beforeHeaderLoaded, this.wireEvents);
            this.parent.off(autoFit, this.autoFit);
            this.parent.off(setAutoFit, this.setAutoFitHandler);
        }
    };
    Resize.prototype.mouseMoveHandler = function (e) {
        var sheetPanel = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        var colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        var rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
        if (colResizeHandler || rowResizeHandler) {
            this.isMouseMoved = true;
            if (colResizeHandler) {
                if (e.x > this.trgtEle.parentElement.firstChild.getBoundingClientRect().left) {
                    colResizeHandler.style.left = e.clientX - this.parent.element.getBoundingClientRect().left + 'px';
                }
            }
            else if (rowResizeHandler) {
                if (e.y >= this.trgtEle.parentElement.parentElement.firstChild.getBoundingClientRect().top) {
                    rowResizeHandler.style.top = e.clientY - sheetPanel.getBoundingClientRect().top + 'px';
                }
            }
        }
    };
    Resize.prototype.mouseDownHandler = function (e) {
        this.event = e;
        this.trgtEle = e.target;
        if (this.trgtEle.parentElement.classList.contains('e-hide-end') || this.trgtEle.classList.contains('e-hide-end')) {
            var offsetSize = this.trgtEle.offsetHeight;
            var offset = e.offsetY;
            if ((offsetSize >= 10 && offset < 5) || (offsetSize - 2 < 8 && offset < Math.ceil((offset - 2) / 2))) {
                this.trgtEle.classList.add('e-skip-resize');
            }
        }
        this.updateTarget(e, this.trgtEle);
        var trgt = this.trgtEle;
        var className = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    };
    Resize.prototype.mouseUpHandler = function (e) {
        var colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        var rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
        this.resizeOn(e);
        this.isMouseMoved = null;
        var resizeHandler = colResizeHandler ? colResizeHandler : rowResizeHandler;
        if (resizeHandler) {
            this.parent.element.getElementsByClassName('e-sheet-panel')[0].removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.getColumnHeaderContent());
    };
    Resize.prototype.dblClickHandler = function (e) {
        this.trgtEle = e.target;
        this.updateTarget(e, this.trgtEle);
        if (this.trgtEle.classList.contains('e-colresize')) {
            var colIndx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            var prevWidth = getColumnWidth(this.parent.getActiveSheet(), colIndx) + "px";
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(colIndx - 1);
            }
            else {
                this.setAutofit(colIndx, true, prevWidth);
            }
        }
        else if (this.trgtEle.classList.contains('e-rowresize')) {
            var rowIndx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            var prevHeight = getRowHeight(this.parent.getActiveSheet(), rowIndx) + "px";
            this.setAutofit(rowIndx, false, prevHeight);
        }
    };
    Resize.prototype.setTarget = function (e) {
        var trgt = e.target;
        var sheet = this.parent.getActiveSheet();
        if (sheet.isProtected && (!sheet.protectSettings.formatColumns || !sheet.protectSettings.formatRows)) {
            if (!sheet.protectSettings.formatRows && !sheet.protectSettings.formatColumns) {
                return;
            }
            if (sheet.protectSettings.formatRows) {
                if (closest(trgt, '.e-colhdr-table')) {
                    return;
                }
            }
            if (sheet.protectSettings.formatColumns) {
                if (closest(trgt, '.e-rowhdr-table')) {
                    return;
                }
            }
        }
        var newTrgt;
        var tOffsetV;
        var eOffsetV;
        var tClass;
        if (closest(trgt, '.e-header-row')) {
            eOffsetV = e.offsetX;
            tOffsetV = trgt.offsetWidth;
            tClass = 'e-colresize';
            if (trgt.previousElementSibling) {
                newTrgt = trgt.previousElementSibling;
            }
            else {
                if (Number(trgt.getAttribute('aria-colindex')) > 1) {
                    newTrgt = trgt;
                }
            }
        }
        else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY;
            tOffsetV = trgt.offsetHeight;
            tClass = 'e-rowresize';
            if (trgt.parentElement.previousElementSibling) {
                newTrgt = trgt.parentElement.previousElementSibling.firstElementChild;
            }
            else {
                if (Number(trgt.parentElement.getAttribute('aria-rowindex')) > 1) {
                    newTrgt = trgt;
                }
            }
        }
        if (tOffsetV - 2 < 8 && eOffsetV !== Math.ceil((tOffsetV - 2) / 2)) {
            if (eOffsetV < Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
                newTrgt.classList.add(tClass);
            }
            else if (eOffsetV > Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
            }
        }
        else if (tOffsetV - 5 < eOffsetV && eOffsetV <= tOffsetV && tOffsetV >= 10) {
            trgt.classList.add(tClass);
        }
        else if (eOffsetV < 5 && newTrgt && tOffsetV >= 10) {
            trgt.classList.add(tClass);
            newTrgt.classList.add(tClass);
        }
        else {
            var resEle = (tClass === 'e-colresize' ? trgt.parentElement.getElementsByClassName(tClass)
                : this.parent.getRowHeaderTable().getElementsByClassName(tClass));
            for (var index = 0; index < resEle.length; index++) {
                resEle[index].classList.remove(tClass);
            }
        }
    };
    Resize.prototype.updateTarget = function (e, trgt) {
        if (closest(trgt, '.e-header-row')) {
            if ((trgt.offsetWidth < 10 && e.offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (e.offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize')) {
                var sheet = this.parent.getActiveSheet();
                var prevIdx = Number(this.trgtEle.getAttribute('aria-colindex')) - 2;
                if (trgt.previousElementSibling && !isHiddenCol(sheet, prevIdx)) {
                    this.trgtEle = trgt.previousElementSibling;
                }
                else {
                    if (prevIdx > -1) {
                        this.trgtEle.classList.add('e-unhide-column');
                    }
                }
            }
        }
        else {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize')) {
                var sheet = this.parent.getActiveSheet();
                var prevIdx = Number(trgt.parentElement.getAttribute('aria-rowindex')) - 2;
                if (trgt.parentElement.previousElementSibling || isHiddenRow(sheet, prevIdx)) {
                    if (e.type === 'dblclick' && isHiddenRow(sheet, prevIdx)) {
                        var selectRange = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
                        var eventArgs = void 0;
                        if (prevIdx <= selectRange[2] && prevIdx > selectRange[0]) {
                            eventArgs = { startIndex: selectRange[0], endIndex: selectRange[2], hide: false, autoFit: true };
                        }
                        else {
                            eventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, autoFit: true };
                        }
                        this.parent.notify(hideShow, eventArgs);
                    }
                    else {
                        if (!isHiddenRow(sheet, prevIdx)) {
                            this.trgtEle = trgt.parentElement.previousElementSibling.getElementsByClassName('e-header-cell')[0];
                        }
                    }
                }
            }
        }
    };
    Resize.prototype.setAutoFitHandler = function (args) {
        this.setAutofit(args.idx, args.isCol);
    };
    // tslint:disable-next-line:max-func-body-length
    Resize.prototype.setAutofit = function (idx, isCol, prevData) {
        var index = 0;
        var sheet = this.parent.getActiveSheet();
        var mainContent = this.parent.getMainContent();
        var oldValue = isCol ? getColumnWidth(this.parent.getActiveSheet(), idx) + "px" :
            getRowHeight(this.parent.getActiveSheet(), idx) + "px";
        var contentClone = [];
        var contentTable = mainContent.getElementsByClassName('e-content-table')[0];
        if (this.parent.getActiveSheet().showHeaders) {
            var headerTable = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
            var headerRow = headerTable.getElementsByTagName('tr');
        }
        var headerText;
        var isWrap = false;
        if (isCol) {
            var rowLength = sheet.rows.length;
            for (var rowIdx = 0; rowIdx < rowLength; rowIdx++) {
                if (sheet.rows[rowIdx] && sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[idx]) {
                    if (getCell(rowIdx, idx, sheet).wrap) {
                        isWrap = true;
                    }
                    var td = this.parent.createElement('td', { className: 'e-cell' });
                    td.textContent = this.parent.getDisplayText(sheet.rows[rowIdx].cells[idx]);
                    if (sheet.rows[rowIdx].cells[idx].style) {
                        var style = sheet.rows[rowIdx].cells[idx].style;
                        if (style.fontFamily) {
                            td.style.fontFamily = style.fontFamily;
                        }
                        if (style.fontSize) {
                            td.style.fontSize = style.fontSize;
                        }
                    }
                    contentClone[index] = td;
                    index++;
                }
            }
        }
        else {
            var colLength = sheet.rows[idx] && sheet.rows[idx].cells ? sheet.rows[idx].cells.length : 0;
            for (var colIdx = 0; colIdx < colLength; colIdx++) {
                if (sheet.rows[idx] && sheet.rows[idx].cells[colIdx]) {
                    if (getCell(idx, colIdx, sheet).wrap) {
                        isWrap = true;
                    }
                    var style = sheet.rows[idx].cells[colIdx].style;
                    var td = this.parent.createElement('td');
                    td.textContent = this.parent.getDisplayText(sheet.rows[idx].cells[colIdx]);
                    if (sheet.rows[idx].cells[colIdx].style) {
                        var style_1 = sheet.rows[idx].cells[colIdx].style;
                        if (style_1.fontFamily) {
                            td.style.fontFamily = style_1.fontFamily;
                        }
                        if (style_1.fontSize) {
                            td.style.fontSize = style_1.fontSize;
                        }
                    }
                    contentClone[index] = td;
                    index++;
                }
            }
        }
        var contentFit = findMaxValue(contentTable, contentClone, isCol, this.parent, prevData, isWrap);
        if (isCol) {
            contentFit = this.getFloatingElementWidth(contentFit, idx);
        }
        var autofitValue = contentFit === 0 ? parseInt(oldValue, 10) : contentFit;
        var threshold = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            if (idx >= this.parent.viewport.leftIndex && idx <= this.parent.viewport.rightIndex) {
                getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
                this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: idx });
                this.resizeStart(idx, this.parent.getViewportIndex(idx, true), autofitValue + 'px', isCol, true, prevData);
            }
            else {
                var oldWidth = getColumnWidth(sheet, idx);
                var threshold_1;
                if (autofitValue > 0) {
                    threshold_1 = -(oldWidth - autofitValue);
                }
                else {
                    threshold_1 = -oldWidth;
                }
                this.parent.notify(colWidthChanged, { threshold: threshold_1, colIdx: idx });
                getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
            }
        }
        else if (!isCol) {
            if (idx >= this.parent.viewport.topIndex && idx <= this.parent.viewport.bottomIndex) {
                autofitValue = autofitValue > 20 ? autofitValue : 20;
                setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
                this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: idx });
                this.resizeStart(idx, this.parent.getViewportIndex(idx), autofitValue + 'px', isCol, true, prevData);
            }
            else {
                var oldHeight = getRowHeight(sheet, idx);
                var threshold_2;
                if (autofitValue > 0) {
                    threshold_2 = -(oldHeight - autofitValue);
                }
                else {
                    threshold_2 = -oldHeight;
                }
                this.parent.notify(rowHeightChanged, { threshold: threshold_2, rowIdx: idx });
                setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
            }
        }
    };
    Resize.prototype.createResizeHandler = function (trgt, className) {
        var editor = this.parent.createElement('div', { className: className });
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().clientHeight + trgt.offsetHeight + 'px';
            editor.style.left = this.event.clientX - this.parent.element.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        }
        else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().clientWidth + trgt.offsetWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY
                - this.parent.element.getElementsByClassName('e-sheet-panel')[0].getBoundingClientRect().top + 'px';
        }
        this.parent.element.getElementsByClassName('e-sheet-panel')[0].appendChild(editor);
        this.updateCursor(this.event);
    };
    Resize.prototype.setColWidth = function (index, viewportIdx, width, curWidth) {
        var sheet = this.parent.getActiveSheet();
        var threshold = width - curWidth;
        if (threshold < 0 && curWidth < -(threshold)) {
            threshold = -curWidth;
        }
        if (width > 0) {
            if (this.isMouseMoved && this.trgtEle.classList.contains('e-unhide-column')) {
                this.showHiddenColumns(index, width);
                this.parent.notify(completeAction, {
                    eventArgs: {
                        index: index, width: 0 + "px", isCol: true, sheetIdx: this.parent.activeSheetIndex, oldWidth: curWidth + "px",
                        hide: false
                    }, action: 'resize'
                });
                return;
            }
            this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: index });
            this.resizeStart(index, viewportIdx, width + "px", true, false, curWidth + "px");
            setColumn(sheet, index, { width: width, customWidth: true });
        }
        else {
            if (this.isMouseMoved) {
                this.parent.hideColumn(index);
                this.parent.notify(completeAction, {
                    eventArgs: {
                        index: index, width: 0 + "px", isCol: true, sheetIdx: this.parent.activeSheetIndex, oldWidth: curWidth + "px",
                        hide: true
                    }, action: 'resize'
                });
            }
        }
    };
    Resize.prototype.showHiddenColumns = function (index, width) {
        var sheet = this.parent.getActiveSheet();
        var selectedRange = getRangeIndexes(sheet.selectedRange);
        var startIdx;
        var endIdx;
        var colgroup;
        if (index >= selectedRange[1] && index <= selectedRange[3] && selectedRange[2] === sheet.rowCount - 1 &&
            getCellIndexes(sheet.activeCell)[0] === getCellIndexes(sheet.topLeftCell)[0]) {
            startIdx = selectedRange[1];
            endIdx = selectedRange[3];
            colgroup = this.parent.getMainContent().querySelector('colgroup');
        }
        else {
            startIdx = endIdx = index;
        }
        if (width !== undefined) {
            for (var i = startIdx; i <= endIdx; i++) {
                setColumn(sheet, i, { width: width, customWidth: true });
                if (i >= this.parent.viewport.leftIndex && i <= this.parent.viewport.rightIndex && !isHiddenCol(sheet, i)) {
                    colgroup.children[this.parent.getViewportIndex(i, true)].style.width = width + "px";
                }
            }
        }
        this.trgtEle.classList.remove('e-unhide-column');
        this.parent.hideColumn(startIdx, endIdx, false);
        if (width === undefined) {
            this.autoFit({ isRow: false, startIndex: startIdx, endIndex: endIdx });
        }
    };
    Resize.prototype.setRowHeight = function (rowIdx, viewportIdx, height, prevData) {
        var sheet = this.parent.getActiveSheet();
        var eleHeight = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[viewportIdx].style.height, 10);
        var rowHeight = height;
        var threshold = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: rowIdx, isCustomHgt: true });
        this.resizeStart(rowIdx, viewportIdx, rowHeight, false, false, prevData);
        setRow(sheet, rowIdx, { height: parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0, customHeight: true });
    };
    Resize.prototype.resizeOn = function (e) {
        var _this = this;
        var idx;
        var actualIdx;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            var sheet = this.parent.getActiveSheet();
            var prevIdx = Number(this.trgtEle.parentElement.getAttribute('aria-rowindex')) - 2;
            if (this.isMouseMoved && isHiddenRow(sheet, prevIdx) && this.trgtEle.classList.contains('e-skip-resize') &&
                e.clientY > this.trgtEle.getBoundingClientRect().top) {
                this.trgtEle.classList.remove('e-skip-resize');
                var eventArgs = { startIndex: prevIdx, endIndex: prevIdx, hide: false, skipAppend: true };
                this.parent.notify(hideShow, eventArgs);
                var rTbody = this.parent.getRowHeaderTable().tBodies[0];
                var tbody = this.parent.getContentTable().tBodies[0];
                eventArgs.hdrRow.style.display = 'none';
                eventArgs.row.style.display = 'none';
                rTbody.insertBefore(eventArgs.hdrRow, rTbody.children[eventArgs.insertIdx]);
                tbody.insertBefore(eventArgs.row, tbody.children[eventArgs.insertIdx]);
                this.trgtEle = eventArgs.hdrRow.firstElementChild;
                eventArgs.hdrRow.nextElementSibling.classList.remove('e-hide-end');
                eventArgs.mergeCollection.forEach(function (mergeArgs) { _this.parent.notify(setMerge, mergeArgs); });
            }
            else {
                if (this.trgtEle.classList.contains('e-skip-resize')) {
                    this.trgtEle.classList.remove('e-skip-resize');
                    if ((!this.isMouseMoved && isHiddenRow(sheet, prevIdx)) || !this.trgtEle.parentElement.previousElementSibling) {
                        return;
                    }
                    this.trgtEle = this.trgtEle.parentElement.previousElementSibling.getElementsByClassName('e-header-cell')[0];
                }
            }
            actualIdx = idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            idx = this.parent.getViewportIndex(actualIdx);
            var prevData = this.parent.getMainContent().getElementsByClassName('e-row')[idx].style.height;
            var rowHeight = e.clientY - this.event.clientY + parseInt(prevData, 10);
            if (rowHeight <= 0) {
                this.parent.hideRow(actualIdx);
                setRow(sheet, actualIdx, { height: 0, customHeight: true });
                this.parent.notify(completeAction, {
                    eventArgs: { index: actualIdx, height: '0px', isCol: false, sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData },
                    action: 'resize'
                });
                return;
            }
            this.setRowHeight(actualIdx, idx, rowHeight + "px", prevData);
            if (this.trgtEle.parentElement.style.display === 'none') {
                var sheet_1 = this.parent.getActiveSheet();
                var selectedRange = getSwapRange(getRangeIndexes(sheet_1.selectedRange));
                if (actualIdx <= selectedRange[2] && actualIdx > selectedRange[0]) {
                    rowHeight = sheet_1.rows[actualIdx].height;
                    var count = void 0;
                    for (var i = selectedRange[0]; i <= selectedRange[2]; i++) {
                        if (i === actualIdx) {
                            continue;
                        }
                        prevData = getRowHeight(sheet_1, i) + "px";
                        setRow(sheet_1, i, { customHeight: true, height: rowHeight });
                        if (isHiddenRow(sheet_1, i)) {
                            if (!count) {
                                count = i;
                            }
                        }
                        else {
                            this.parent.getRow(i).style.height = rowHeight + "px";
                            if (sheet_1.showHeaders) {
                                this.parent.getRow(i, this.parent.getRowHeaderTable()).style.height = rowHeight + "px";
                            }
                        }
                        this.parent.notify(completeAction, {
                            eventArgs: {
                                index: i, height: rowHeight + "px", isCol: false,
                                sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData
                            },
                            action: 'resize'
                        });
                    }
                    this.parent.hideRow(selectedRange[0], actualIdx - 1, false);
                    idx += Math.abs(actualIdx - count);
                }
                else {
                    if (idx !== 0 && !isHiddenRow(sheet_1, actualIdx - 1)) {
                        this.trgtEle.parentElement.previousElementSibling.classList.remove('e-hide-start');
                    }
                    else {
                        if (idx !== 0) {
                            this.trgtEle.parentElement.classList.add('e-hide-end');
                        }
                    }
                    this.parent.selectRange(sheet_1.selectedRange);
                }
                this.trgtEle.parentElement.style.display = '';
                this.parent.getContentTable().rows[idx].style.display = '';
            }
        }
        else if (this.trgtEle.classList.contains('e-colresize')) {
            if (this.isMouseMoved && this.trgtEle.classList.contains('e-unhide-column') &&
                e.clientX < this.trgtEle.getBoundingClientRect().left) {
                this.trgtEle.classList.remove('e-unhide-column');
                if (this.trgtEle.previousElementSibling) {
                    this.trgtEle = this.trgtEle.previousElementSibling;
                }
            }
            idx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            var curWidth = void 0;
            if (this.trgtEle.classList.contains('e-unhide-column')) {
                idx -= 1;
                curWidth = 0;
            }
            else {
                curWidth = getColumnWidth(this.parent.getActiveSheet(), idx);
            }
            this.setColWidth(idx, this.parent.getViewportIndex(idx, true), (e.clientX - this.event.clientX) + curWidth, curWidth);
        }
    };
    Resize.prototype.setWidthAndHeight = function (trgt, value, isCol) {
        if (isCol) {
            trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
        }
        else {
            trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
        }
    };
    Resize.prototype.resizeStart = function (idx, viewportIdx, value, isCol, isFit, prevData) {
        if (this.parent.getActiveSheet().showHeaders) {
            setResize(viewportIdx, value, isCol, this.parent);
        }
        else {
            if (isCol) {
                var curEle = this.parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('col')[viewportIdx];
                curEle.style.width = value;
            }
            else {
                var curEle = this.parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('tr')[viewportIdx];
                curEle.style.height = value;
            }
        }
        var action = isFit ? 'resizeToFit' : 'resize';
        var eventArgs;
        var isAction;
        if (isCol) {
            eventArgs = { index: idx, width: value, isCol: isCol, sheetIdx: this.parent.activeSheetIndex, oldWidth: prevData };
            isAction = prevData !== value;
        }
        else {
            eventArgs = { index: idx, height: value, isCol: isCol, sheetIdx: this.parent.activeSheetIndex, oldHeight: prevData };
            isAction = prevData !== value;
        }
        if (isAction) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: action });
        }
    };
    Resize.prototype.updateCursor = function (e) {
        if (this.parent.element.getElementsByClassName('e-colresize-handler')[0]) {
            this.parent.element.classList.add('e-col-resizing');
        }
        else if (this.parent.element.classList.contains('e-col-resizing')) {
            this.parent.element.classList.remove('e-col-resizing');
        }
        if (this.parent.element.getElementsByClassName('e-rowresize-handler')[0]) {
            this.parent.element.classList.add('e-row-resizing');
        }
        else if (this.parent.element.classList.contains('e-row-resizing')) {
            this.parent.element.classList.remove('e-row-resizing');
        }
    };
    // To get the floating element width like filter
    Resize.prototype.getFloatingElementWidth = function (oldWidth, colIdx) {
        var floatingWidth = oldWidth;
        var eventArgs = { filterRange: [], hasFilter: false };
        this.parent.notify(getFilterRange, eventArgs);
        if (eventArgs.hasFilter && eventArgs.filterRange) {
            if (eventArgs.filterRange[1] <= colIdx && eventArgs.filterRange[3] >= colIdx) {
                floatingWidth = oldWidth + 22; // default width and padding for button 
            }
        }
        return floatingWidth;
    };
    /**
     * To destroy the resize module.
     * @return {void}
     */
    Resize.prototype.destroy = function () {
        this.unwireEvents();
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the module name.
     * @returns string
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    return Resize;
}());
export { Resize };
