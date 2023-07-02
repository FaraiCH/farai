import { formatUnit, detach, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getRangeIndexes } from './../../workbook/common/address';
import { getColumnWidth, isHiddenCol } from '../../workbook/base/column';
import { contentLoaded, editOperation, getUpdateUsingRaf, removeAllChildren } from '../common/index';
import { beforeContentLoaded, getColGroupWidth, virtualContentLoaded, setAriaOptions, dataBound } from '../common/index';
import { beforeHeaderLoaded, created, spreadsheetDestroyed, skipHiddenIdx } from '../common/index';
import { checkMerge, forRefSelRender, initiateEdit } from '../common/index';
import { getCell, isHiddenRow, checkIsFormula } from '../../workbook/index';
/**
 * Sheet module is used to render Sheet
 * @hidden
 */
var SheetRender = /** @class */ (function () {
    function SheetRender(parent) {
        this.freezePane = false;
        this.colGroupWidth = 30; //Row header and selectall table colgroup width
        this.parent = parent;
        this.col = parent.createElement('col');
        this.rowRenderer = parent.serviceLocator.getService('row');
        this.cellRenderer = parent.serviceLocator.getService('cell');
        this.addEventListener();
    }
    SheetRender.prototype.refreshSelectALLContent = function () {
        var cell;
        if (this.freezePane) {
            var tHead = this.getSelectAllTable().querySelector('thead');
            var row = this.rowRenderer.render();
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        }
        else {
            cell = this.headerPanel.firstElementChild;
            cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: this.parent.element.id + "_select_all" }));
    };
    SheetRender.prototype.updateLeftColGroup = function (width, rowHdr) {
        if (width) {
            this.colGroupWidth = width;
        }
        if (!rowHdr) {
            rowHdr = this.getRowHeaderPanel();
        }
        var table = rowHdr.querySelector('table');
        this.detachColGroup(table);
        var colGrp = this.parent.createElement('colgroup');
        var colGrpWidth = this.colGroupWidth + "px";
        var col = this.col.cloneNode();
        col.style.width = colGrpWidth;
        colGrp.appendChild(col);
        table.insertBefore(colGrp, table.querySelector('tbody'));
        rowHdr.style.width = colGrpWidth;
        if (this.freezePane) {
            table = this.getSelectAllTable();
            this.detachColGroup(table);
            table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
        }
        else {
            this.getSelectAllContent().style.width = colGrpWidth;
        }
        if (this.parent.getActiveSheet().showHeaders) {
            this.getColHeaderPanel().style.width = "calc(100% - " + colGrpWidth + ")";
            this.getContentPanel().style.width = "calc(100% - " + colGrpWidth + ")";
        }
    };
    SheetRender.prototype.detachColGroup = function (table) {
        var colGrp = table.querySelector('colgroup');
        if (colGrp) {
            detach(colGrp);
        }
    };
    SheetRender.prototype.renderPanel = function () {
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel' });
        var sheet = this.parent.getActiveSheet();
        var id = this.parent.element.id;
        if (sheet.showHeaders) {
            this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: id + "_row_header" }));
            this.initHeaderPanel();
            if (this.parent.allowScrolling) {
                this.parent.scrollModule.setPadding();
            }
        }
        else {
            this.updateHideHeaders();
        }
        var content = this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-sheet-content', id: id + "_main_content" }));
        if (!sheet.showGridLines) {
            content.classList.add('e-hide-gridlines');
        }
        if (!this.parent.allowScrolling) {
            content.style.overflow = 'hidden';
        }
    };
    SheetRender.prototype.initHeaderPanel = function () {
        var id = this.parent.element.id;
        this.headerPanel = this.parent.createElement('div', { className: 'e-header-panel' });
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-selectall-container', id: id + "_selectall" }));
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-column-header', id: id + "_col_header" }));
    };
    SheetRender.prototype.createTable = function () {
        if (this.parent.getActiveSheet().showHeaders) {
            this.createHeaderTable();
        }
        this.updateTable('tbody', 'content', this.contentPanel.lastElementChild);
    };
    SheetRender.prototype.createHeaderTable = function (rowHdrEle) {
        if (rowHdrEle === void 0) { rowHdrEle = this.contentPanel.querySelector('.e-row-header'); }
        if (this.freezePane) {
            this.updateTable('thead', 'selectall', this.headerPanel.querySelector('.e-selectall-container'));
        }
        this.updateTable('thead', 'colhdr', this.headerPanel.querySelector('.e-column-header'));
        this.updateTable('tbody', 'rowhdr', rowHdrEle);
        this.updateLeftColGroup(null, rowHdrEle);
    };
    SheetRender.prototype.updateTable = function (tagName, name, appendTo) {
        var table = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add("e-" + name + "-table");
        appendTo.appendChild(table);
        table.appendChild(this.parent.createElement(tagName));
    };
    /**
     * It is used to refresh the select all, row header, column header and content of the spreadsheet.
     */
    SheetRender.prototype.renderTable = function (args) {
        var _this = this;
        var indexes;
        var row;
        var hRow;
        var sheet = this.parent.getActiveSheet();
        var frag = document.createDocumentFragment();
        this.createTable();
        var colGrp = this.parent.createElement('colgroup');
        var cTBody = this.contentPanel.querySelector('.e-sheet-content tbody');
        var rHdrTBody;
        var cHdrTHead;
        var cHdrRow;
        if (sheet.showHeaders) {
            frag.appendChild(this.headerPanel);
            this.refreshSelectALLContent();
            rHdrTBody = this.contentPanel.querySelector('.e-row-header tbody');
            cHdrTHead = this.headerPanel.querySelector('.e-column-header thead');
            this.getColHeaderTable().insertBefore(colGrp, cHdrTHead);
            cHdrRow = this.rowRenderer.render();
            cHdrTHead.appendChild(cHdrRow);
        }
        frag.appendChild(this.contentPanel);
        this.parent.notify(beforeContentLoaded, { startColIdx: args.indexes[1] });
        var colCount = sheet.colCount.toString();
        var rowCount = sheet.colCount.toString();
        var layout = args.top && args.left ? 'RowColumn' : (args.top ? 'Row' : (args.left ? 'Column' : ''));
        if (sheet.showHeaders) {
            this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
            this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount);
        }
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        args.cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hRow = _this.rowRenderer.render(indexes[0], true);
                    rHdrTBody.appendChild(hRow);
                    hRow.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                }
                row = _this.rowRenderer.render(indexes[0]);
                cTBody.appendChild(row);
            }
            row.appendChild(_this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: true, row: row, hRow: hRow,
                pRow: row.previousSibling, pHRow: sheet.showHeaders ? hRow.previousSibling : null,
                first: layout ? (layout.includes('Row') ? (indexes[0] === args.indexes[0] ? 'Row' : (layout.includes('Column') ? (indexes[1] === args.indexes[1] ? 'Column' : '') : '')) : (indexes[1] === args.indexes[1] ? 'Column' : '')) : '' }));
            if (indexes[0] === args.indexes[0]) {
                _this.updateCol(sheet, indexes[1], colGrp);
                if (sheet.showHeaders) {
                    cHdrRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
        });
        this.getContentTable().insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf(function () {
            var content = _this.parent.getMainContent();
            document.getElementById(_this.parent.element.id + '_sheet').appendChild(frag);
            if (args.top) {
                content.scrollTop = args.top;
                if (sheet.showHeaders) {
                    _this.parent.getRowHeaderContent().scrollTop = args.top;
                }
            }
            if (args.left) {
                content.scrollLeft = args.left;
                if (sheet.showHeaders) {
                    _this.parent.getColumnHeaderContent().scrollLeft = args.left;
                }
            }
            _this.parent.notify(contentLoaded, null);
            _this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!args.initLoad && !_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
            _this.parent.trigger(dataBound, {});
            if (_this.parent.isEdit) {
                _this.parent.notify(initiateEdit, null);
            }
            if (args.initLoad) {
                var triggerEvent = true;
                if (_this.parent.scrollSettings.enableVirtualization) {
                    for (var i = 0; i < sheet.ranges.length; i++) {
                        if (sheet.ranges[i].info.count - 1 > _this.parent.viewport.bottomIndex) {
                            triggerEvent = false;
                            break;
                        }
                    }
                }
                if (triggerEvent) {
                    _this.triggerCreatedEvent();
                }
            }
        });
    };
    SheetRender.prototype.triggerCreatedEvent = function () {
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        if (this.parent.createdHandler) {
            if (this.parent.createdHandler.observers) {
                this.parent[created].observers = this.parent.createdHandler.observers;
            }
            else {
                this.parent.setProperties({ created: this.parent.createdHandler }, true);
            }
            this.parent.createdHandler = undefined;
            this.parent.trigger(created, null);
        }
    };
    SheetRender.prototype.refreshColumnContent = function (args) {
        var _this = this;
        var indexes;
        var row;
        var table;
        var count = 0;
        var cell;
        var sheet = this.parent.getActiveSheet();
        var frag = document.createDocumentFragment();
        var hFrag = document.createDocumentFragment();
        var tBody = this.parent.element.querySelector('.e-sheet-content tbody');
        tBody = frag.appendChild(tBody.cloneNode(true));
        var colGrp = this.parent.element.querySelector('.e-sheet-content colgroup');
        colGrp = colGrp.cloneNode();
        var hRow;
        var tHead;
        if (sheet.showHeaders) {
            hFrag.appendChild(colGrp);
            tHead = this.parent.element.querySelector('.e-column-header thead');
            tHead = hFrag.appendChild(tHead.cloneNode(true));
            hRow = tHead.querySelector('tr');
            hRow.innerHTML = '';
        }
        args.cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[0] === args.indexes[0]) {
                _this.updateCol(sheet, indexes[1], colGrp);
                if (sheet.showHeaders) {
                    hRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
            if (indexes[1] === args.indexes[1]) {
                row = tBody.children[count];
                if (row) {
                    row.innerHTML = '';
                    count++;
                }
                else {
                    return;
                }
            }
            cell = row.appendChild(_this.cellRenderer.render({
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key, row: row, pRow: row.previousSibling,
                first: !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : (_this.parent.scrollSettings.
                    enableVirtualization && indexes[0] === args.indexes[0] && _this.parent.viewport.topIndex !== skipHiddenIdx(sheet, 0, true)
                    ? 'Row' : '')
            }));
            _this.checkColMerge(indexes, args.indexes, cell, value);
        });
        frag.insertBefore(colGrp.cloneNode(true), tBody);
        getUpdateUsingRaf(function () {
            if (sheet.showHeaders) {
                table = _this.getColHeaderTable();
                removeAllChildren(table);
                table.appendChild(hFrag);
            }
            table = _this.getContentTable();
            removeAllChildren(table);
            table.appendChild(frag);
            _this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    SheetRender.prototype.refreshRowContent = function (args) {
        var _this = this;
        var indexes;
        var row;
        var hdrRow;
        var colGroupWidth = this.colGroupWidth;
        var sheet = this.parent.getActiveSheet();
        var hFrag;
        var hTBody;
        var cell;
        var frag = document.createDocumentFragment();
        var tBody = this.parent.createElement('tbody');
        if (sheet.showHeaders) {
            hFrag = document.createDocumentFragment();
            hTBody = tBody.cloneNode();
            hFrag.appendChild(hTBody);
        }
        frag.appendChild(tBody);
        args.cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hdrRow = _this.rowRenderer.render(indexes[0], true);
                    hTBody.appendChild(hdrRow);
                    hdrRow.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
                row = _this.rowRenderer.render(indexes[0]);
                tBody.appendChild(row);
            }
            cell = row.appendChild(_this.cellRenderer.render({ rowIdx: indexes[0], colIdx: indexes[1], cell: value, address: key, lastCell: indexes[1] === args.indexes[3], row: row, hRow: hdrRow, pRow: row.previousSibling, pHRow: sheet.showHeaders ?
                    hdrRow.previousSibling : null, isHeightCheckNeeded: true, first: !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ?
                    'Row' : (_this.parent.scrollSettings.enableVirtualization && indexes[1] === args.indexes[1] && _this.parent.viewport.leftIndex
                    !== skipHiddenIdx(sheet, 0, true, 'columns') ? 'Column' : '') }));
            _this.checkRowMerge(indexes, args.indexes, cell, value);
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (sheet.showHeaders) {
            if (this.contentPanel.querySelector('.e-row-header tbody')) {
                detach(this.contentPanel.querySelector('.e-row-header tbody'));
                this.getRowHeaderTable().appendChild(hFrag);
            }
        }
        if (this.contentPanel.querySelector('.e-sheet-content tbody')) {
            detach(this.contentPanel.querySelector('.e-sheet-content tbody'));
            this.getContentTable().appendChild(frag);
        }
        this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        setAriaOptions(this.parent.getMainContent(), { busy: false });
    };
    SheetRender.prototype.updateCol = function (sheet, idx, appendTo) {
        var col = this.col.cloneNode();
        col.style.width = formatUnit(getColumnWidth(sheet, idx));
        return appendTo ? appendTo.appendChild(col) : col;
    };
    SheetRender.prototype.updateColContent = function (args) {
        var _this = this;
        getUpdateUsingRaf(function () {
            var indexes;
            var row;
            var table;
            var refChild;
            var cell;
            var hRow;
            var rowCount = 0;
            var col;
            var hRefChild;
            var sheet = _this.parent.getActiveSheet();
            if (sheet.showHeaders) {
                hRow = _this.parent.element.querySelector('.e-column-header .e-header-row');
                hRefChild = hRow.firstElementChild;
            }
            var colGrp = _this.parent.element.querySelector('.e-sheet-content colgroup');
            var colRefChild = colGrp.firstElementChild;
            var skipRender;
            var tBody = _this.parent.element.querySelector('.e-sheet-content tbody');
            args.cells.forEach(function (value, key) {
                if (skipRender) {
                    return;
                }
                indexes = getRangeIndexes(key);
                if (args.direction === 'first' && indexes[1] === args.indexes[1]) {
                    _this.checkColMerge([indexes[0], _this.parent.viewport.leftIndex], args.indexes, (tBody.rows[rowCount] || { cells: [] }).cells[(args.indexes[3] - args.indexes[1]) + 1], getCell(indexes[0], _this.parent.viewport.leftIndex, sheet) || {});
                }
                if (indexes[0] === args.indexes[0]) {
                    if (args.direction === 'last') {
                        col = _this.col.cloneNode();
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1]));
                        colGrp.insertBefore(col, colRefChild);
                        if (sheet.showHeaders) {
                            hRow.insertBefore(_this.cellRenderer.renderColHeader(indexes[1]), hRefChild);
                        }
                    }
                    else {
                        _this.updateCol(sheet, indexes[1], colGrp);
                        if (sheet.showHeaders) {
                            hRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                        }
                    }
                    if (_this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // tslint:disable
                        detach(colGrp[args.direction + 'ElementChild']);
                        if (sheet.showHeaders) {
                            detach(hRow[args.direction + 'ElementChild']);
                        }
                        // tslint:enable
                    }
                }
                if (indexes[1] === args.indexes[1]) {
                    row = tBody.children[rowCount];
                    rowCount++;
                    if (!row) {
                        skipRender = true;
                        return;
                    }
                    refChild = row.firstElementChild;
                }
                cell = _this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === args.indexes[3], isHeightCheckNeeded: args.direction === 'first',
                    first: args.direction === 'last' && !args.skipUpdateOnFirst && indexes[1] === args.indexes[1] ? 'Column' : '',
                    checkNextBorder: args.direction === 'last' && indexes[3] === args.indexes[3] ? 'Column' : '', });
                if (args.direction === 'last') {
                    _this.checkColMerge(indexes, args.indexes, cell, value, (tBody.rows[rowCount - 1] || { cells: [] }).cells[0]);
                    row.insertBefore(cell, refChild);
                }
                else {
                    row.appendChild(cell);
                }
                if (_this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // tslint:disable-next-line:no-any
                    detach(row[args.direction + 'ElementChild']);
                }
            });
            if (sheet.showHeaders) {
                table = _this.getColHeaderTable();
                detach(table.querySelector('colgroup'));
                table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
            }
            if (_this.parent.scrollSettings.enableVirtualization) {
                _this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            }
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    SheetRender.prototype.updateRowContent = function (args) {
        var _this = this;
        var colGroupWidth = this.colGroupWidth;
        var row;
        var hRow;
        var cell;
        var sheet = this.parent.getActiveSheet();
        var cellModel;
        var count = 0;
        var tBody = this.parent.getMainContent().querySelector('tbody');
        var rTBody;
        var rFrag;
        var index;
        if (sheet.showHeaders) {
            rFrag = document.createDocumentFragment();
            rTBody = this.parent.getRowHeaderContent().querySelector('tbody');
        }
        var indexes;
        var frag = document.createDocumentFragment();
        this.parent.showSpinner();
        args.cells.forEach(function (value, cKey) {
            indexes = getRangeIndexes(cKey);
            if (args.direction === 'first' && indexes[0] === args.indexes[0]) {
                _this.checkRowMerge([_this.parent.viewport.topIndex, indexes[1]], args.indexes, (tBody.rows[(args.indexes[2] - args.indexes[0]) + 1] || { cells: [] }).cells[count], getCell(_this.parent.viewport.topIndex, indexes[1], sheet) || {});
            }
            if (indexes[1] === args.indexes[1]) {
                if (sheet.showHeaders) {
                    hRow = _this.rowRenderer.render(indexes[0], true);
                    rFrag.appendChild(hRow);
                    hRow.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (_this.parent.scrollSettings.enableVirtualization && args.direction) {
                        // tslint:disable-next-line:no-any
                        detach(rTBody[args.direction + 'ElementChild']);
                    }
                }
                row = _this.rowRenderer.render(indexes[0]);
                frag.appendChild(row);
                if (_this.parent.scrollSettings.enableVirtualization && args.direction) {
                    // tslint:disable-next-line:no-any
                    detach(tBody[args.direction + 'ElementChild']);
                }
            }
            cell = row.appendChild(_this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[2], cell: value, address: cKey, lastCell: indexes[1] === args.indexes[3], row: row, pHRow: sheet.showHeaders ? hRow.previousSibling : null,
                checkNextBorder: args.direction === 'last' && indexes[2] === args.indexes[2] ? 'Row' : '', pRow: row.previousSibling,
                isHeightCheckNeeded: args.direction === 'first' || args.direction === '', hRow: hRow, first: args.direction === 'last' &&
                    !args.skipUpdateOnFirst && indexes[0] === args.indexes[0] ? 'Row' : '' }));
            if (args.direction === 'last') {
                _this.checkRowMerge(indexes, args.indexes, cell, value, tBody.rows[0].cells[count]);
            }
            count++;
        });
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth);
        }
        if (args.direction === 'last') {
            if (sheet.showHeaders) {
                rTBody.insertBefore(rFrag, rTBody.firstElementChild);
            }
            tBody.insertBefore(frag, tBody.firstElementChild);
        }
        else {
            if (sheet.showHeaders) {
                rTBody.appendChild(rFrag);
            }
            tBody.appendChild(frag);
        }
        if (this.parent.scrollSettings.enableVirtualization) {
            this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
        }
        if (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0]) {
            var editCellVal = this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].textContent;
            if (checkIsFormula(editCellVal) || editCellVal.indexOf('=') === 0) {
                this.parent.notify(forRefSelRender, null);
            }
        }
        if (!this.parent.isOpen) {
            this.parent.hideSpinner();
        }
        setAriaOptions(this.parent.getMainContent(), { busy: false });
    };
    SheetRender.prototype.checkRowMerge = function (indexes, range, cell, model, firstcell) {
        if (this.parent.scrollSettings.enableVirtualization && cell &&
            (!isNullOrUndefined(model.rowSpan) || !isNullOrUndefined(model.colSpan))) {
            if (indexes[0] === this.parent.viewport.topIndex) {
                if (model.rowSpan < 0) {
                    this.parent.notify(checkMerge, { td: cell, rowIdx: indexes[0], colIdx: indexes[1], isRow: true });
                    if (this.parent.viewport.topIndex >= range[0]) {
                        this.refreshPrevMerge(range[0] + 1, indexes[1]);
                    }
                }
                if (firstcell && (firstcell.colSpan || firstcell.rowSpan)) {
                    this.cellRenderer.refresh(indexes[0] + (range[2] - range[0]) + 1, indexes[1], null, firstcell);
                }
            }
            else if (model.rowSpan > 1) {
                var prevTopIdx = range[2] + 1;
                if (indexes[0] + model.rowSpan - 1 > prevTopIdx && indexes[0] < prevTopIdx) {
                    this.refreshPrevMerge(prevTopIdx, indexes[1]);
                }
            }
        }
    };
    SheetRender.prototype.refreshPrevMerge = function (prevTopIdx, colIndex) {
        var td = this.parent.getCell(prevTopIdx, colIndex, this.parent.getRow(0));
        if (td && td.rowSpan > 1) {
            this.cellRenderer.refresh(prevTopIdx, colIndex, null, td);
        }
    };
    SheetRender.prototype.checkColMerge = function (indexes, range, cell, model, firstcell) {
        if (this.parent.scrollSettings.enableVirtualization && cell && indexes[1] === this.parent.viewport.leftIndex &&
            (!isNullOrUndefined(model.rowSpan) || !isNullOrUndefined(model.colSpan))) {
            if (model.colSpan < 0) {
                this.parent.notify(checkMerge, { td: cell, colIdx: indexes[1], rowIdx: indexes[0] });
            }
            if (firstcell && (firstcell.colSpan || firstcell.rowSpan)) {
                this.cellRenderer.refresh(indexes[0], indexes[1] + (range[3] - range[1]) + 1, null, firstcell);
            }
        }
    };
    /**
     * Used to toggle row and column headers.
     */
    SheetRender.prototype.showHideHeaders = function () {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (this.parent.scrollSettings.enableVirtualization) {
                var indexes = [this.parent.viewport.topIndex, this.parent.viewport.leftIndex,
                    this.parent.viewport.bottomIndex, this.parent.viewport.rightIndex];
                this.renderHeaders([indexes[0], indexes[2]], [indexes[1], indexes[3]]);
            }
            else {
                this.renderHeaders([0, sheet.rowCount - 1], [0, sheet.colCount - 1]);
                if (sheet.topLeftCell !== 'A1') {
                    this.parent.goTo(sheet.topLeftCell);
                }
            }
        }
        else {
            getUpdateUsingRaf(function () {
                detach(_this.headerPanel);
                detach(_this.getRowHeaderPanel());
                _this.getContentPanel().style.width = '';
                _this.updateHideHeaders();
            });
        }
    };
    SheetRender.prototype.renderHeaders = function (rowIndexes, colIndexes) {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        this.initHeaderPanel();
        var cFrag = document.createDocumentFragment();
        var rFrag = document.createDocumentFragment();
        cFrag.appendChild(this.headerPanel);
        var rowHdrEle = rFrag.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: this.parent.element.id + "_row_header" }));
        this.createHeaderTable(rowHdrEle);
        this.parent.notify(beforeHeaderLoaded, { element: rowHdrEle });
        this.refreshSelectALLContent();
        var rTBody = rowHdrEle.querySelector('tbody');
        var cTHead = this.headerPanel.querySelector('.e-column-header thead');
        var cRow = this.rowRenderer.render();
        cTHead.appendChild(cRow);
        var row;
        for (var i = colIndexes[0]; i <= colIndexes[1]; i++) {
            if (!isHiddenCol(sheet, i)) {
                cRow.appendChild(this.cellRenderer.renderColHeader(i));
            }
        }
        var colGroupWidth = getColGroupWidth(rowIndexes[1]);
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth, rowHdrEle);
        }
        for (var i = rowIndexes[0]; i <= rowIndexes[1]; i++) {
            if (!isHiddenRow(sheet, i)) {
                row = this.rowRenderer.render(i, true);
                row.appendChild(this.cellRenderer.renderRowHeader(i));
                rTBody.appendChild(row);
            }
        }
        getUpdateUsingRaf(function () {
            _this.getColHeaderTable().insertBefore(_this.getContentTable().querySelector('colgroup').cloneNode(true), cTHead);
            var sheet = document.getElementById(_this.parent.element.id + '_sheet');
            sheet.classList.remove('e-hide-headers');
            sheet.insertBefore(cFrag, _this.contentPanel);
            var content = _this.getContentPanel();
            _this.contentPanel.insertBefore(rFrag, content);
            _this.parent.scrollModule.setPadding();
            rowHdrEle.scrollTop = content.scrollTop;
            _this.getColHeaderPanel().scrollLeft = content.scrollLeft;
        });
    };
    SheetRender.prototype.updateHideHeaders = function () {
        document.getElementById(this.parent.element.id + '_sheet').classList.add('e-hide-headers');
        this.headerPanel = null;
    };
    /**
     * Get the select all table element of spreadsheet
     * @return {HTMLElement}
     */
    SheetRender.prototype.getSelectAllContent = function () {
        return this.headerPanel.getElementsByClassName('e-selectall-container')[0];
    };
    /**
     * Get the select all table element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getSelectAllTable = function () {
        return this.headerPanel.getElementsByClassName('e-selectall-table')[0];
    };
    /**
     * Get the column header element of spreadsheet
     * @return {HTMLTableElement}
     */
    SheetRender.prototype.getColHeaderTable = function () {
        return this.headerPanel.getElementsByClassName('e-colhdr-table')[0];
    };
    /**
     * Get the row header table element of spreadsheet
     * @return {HTMLTableElement}
     */
    SheetRender.prototype.getRowHeaderTable = function () {
        return this.contentPanel.getElementsByClassName('e-rowhdr-table')[0];
    };
    /**
     * Get the main content table element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getContentTable = function () {
        return this.contentPanel.getElementsByClassName('e-content-table')[0];
    };
    /**
     * Get the row header div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getRowHeaderPanel = function () {
        return this.contentPanel.getElementsByClassName('e-row-header')[0];
    };
    /**
     * Get the column header div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getColHeaderPanel = function () {
        return this.headerPanel.getElementsByClassName('e-column-header')[0];
    };
    /**
     * Get the main content div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getContentPanel = function () {
        return this.contentPanel.getElementsByClassName('e-sheet-content')[0];
    };
    SheetRender.prototype.addEventListener = function () {
        this.parent.on(created, this.triggerCreatedEvent, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    SheetRender.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    SheetRender.prototype.removeEventListener = function () {
        this.parent.off(created, this.triggerCreatedEvent);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    };
    return SheetRender;
}());
export { SheetRender };
