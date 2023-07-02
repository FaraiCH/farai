import { Draggable, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { removeClass } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList } from '@syncfusion/ej2-base';
import { parentsUntil, removeElement, getPosition, addRemoveActiveClasses, isActionPrevent, getGridRowElements } from '../base/util';
import { gridActionHandler } from '../base/util';
import * as events from '../base/constant';
import { Scroll } from '../actions/scroll';
import { Query } from '@syncfusion/ej2-data';
/**
 *
 * Reorder module is used to handle row reordering.
 * @hidden
 */
var RowDD = /** @class */ (function () {
    /**
     * Constructor for the Grid print module
     * @hidden
     */
    function RowDD(parent) {
        var _this = this;
        this.selectedRows = [];
        this.isOverflowBorder = true;
        this.selectedRowColls = [];
        this.isRefresh = true;
        this.isReplaceDragEle = true;
        /* tslint:disable-next-line:max-line-length */
        // tslint:disable-next-line:max-func-body-length
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = _this.draggable.currentStateTarget;
            var visualElement = _this.parent.createElement('div', {
                className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
                styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
            });
            var table = _this.parent.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
            var tbody = _this.parent.createElement('tbody');
            if (document.getElementsByClassName('e-griddragarea').length ||
                (gObj.rowDropSettings.targetID && (!target.classList.contains('e-selectionbackground')
                    && gObj.selectionSettings.type !== 'Single')) ||
                (!gObj.rowDropSettings.targetID && !parentsUntil(e.sender.target, 'e-rowdragdrop'))) {
                return false;
            }
            if (gObj.rowDropSettings.targetID &&
                gObj.selectionSettings.mode === 'Row' && gObj.selectionSettings.type === 'Single') {
                gObj.selectRow(parseInt(_this.draggable.currentStateTarget.parentElement.getAttribute('aria-rowindex'), 10));
            }
            _this.startedRow = closestElement(target, 'tr').cloneNode(true);
            var frzCols = _this.parent.isFrozenGrid();
            if (frzCols) {
                var rowIndex_1 = parseInt(closestElement(target, 'tr').getAttribute('aria-rowindex'), 10);
                var rows = getGridRowElements(_this.parent);
                _this.startedRow.innerHTML = '';
                gridActionHandler(_this.parent, function (freezeTable, rows) {
                    _this.startedRow.innerHTML += rows[rowIndex_1].innerHTML;
                }, rows);
            }
            _this.processArgs(target);
            var args = {
                selectedRow: _this.rows, dragelement: target,
                cloneElement: visualElement, cancel: false, data: _this.rowData
            };
            var selectedRows = gObj.getSelectedRows();
            gObj.trigger(events.rowDragStartHelper, args);
            var cancel = 'cancel';
            var cloneElement = 'cloneElement';
            if (args[cancel]) {
                return false;
            }
            removeElement(_this.startedRow, '.e-indentcell');
            removeElement(_this.startedRow, '.e-detailrowcollapse');
            removeElement(_this.startedRow, '.e-detailrowexpand');
            _this.removeCell(_this.startedRow, 'e-gridchkbox');
            var exp = new RegExp('e-active', 'g'); //high contrast issue
            _this.startedRow.innerHTML = _this.startedRow.innerHTML.replace(exp, '');
            tbody.appendChild(_this.startedRow);
            if (gObj.getSelectedRowIndexes().length > 1 && _this.startedRow.hasAttribute('aria-selected')) {
                var dropCountEle = _this.parent.createElement('span', {
                    className: 'e-dropitemscount', innerHTML: frzCols ? '' + selectedRows.length / 2 : '' + selectedRows.length,
                });
                visualElement.appendChild(dropCountEle);
            }
            var ele = closestElement(target, 'tr').querySelector('.e-icon-rowdragicon');
            if (ele) {
                ele.classList.add('e-dragstartrow');
            }
            table.appendChild(tbody);
            visualElement.appendChild(table);
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            if (document.getElementsByClassName('e-griddragarea').length) {
                return;
            }
            var target = e.target;
            var spanCssEle = _this.parent.element.querySelector('.e-dropitemscount');
            if (_this.parent.getSelectedRecords().length > 1 && spanCssEle) {
                spanCssEle.style.left = _this.parent.element.querySelector('.e-cloneproperties table')
                    .offsetWidth - 5 + 'px';
            }
            _this.processArgs(target);
            gObj.trigger(events.rowDragStart, {
                rows: (isBlazor()) ? null : _this.rows, target: (isBlazor()) ? null : e.target,
                draggableType: 'rows', fromIndex: parseInt(_this.rows[0].getAttribute('aria-rowindex'), 10),
                data: (Object.keys(_this.rowData[0]).length > 0) ? _this.rowData : _this.currentViewData()
            });
            if (isBlazor()) {
                e.bindEvents(e.dragElement);
            }
            _this.dragStartData = _this.rowData;
            var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
            if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances &&
                dropElem.ej2_instances[0].getModuleName() === 'grid') {
                dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
            }
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            var target = _this.getElementFromPosition(cloneElement, e.event);
            classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur']);
            _this.isOverflowBorder = true;
            _this.hoverState = gObj.enableHover;
            var trElement = parentsUntil(target, 'e-grid') ? closestElement(e.target, 'tr') : null;
            gObj.enableHover = false;
            if (!e.target) {
                return;
            }
            _this.processArgs(target);
            var args = {
                rows: _this.rows, target: target, draggableType: 'rows',
                data: _this.rowData, originalEvent: e, cancel: false
            };
            gObj.trigger(events.rowDrag, args);
            _this.stopTimer();
            if (args.cancel) {
                return;
            }
            gObj.element.classList.add('e-rowdrag');
            _this.dragTarget = trElement && parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id ?
                parseInt(trElement.getAttribute('aria-rowindex'), 10) : parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
            if (gObj.rowDropSettings.targetID) {
                if (!parentsUntil(target, 'e-grid') ||
                    parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
                else {
                    classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                }
            }
            else {
                var elem = parentsUntil(target, 'e-grid');
                if (elem && elem.id === cloneElement.parentElement.id) {
                    classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
                }
                else {
                    classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
                }
            }
            if (!gObj.rowDropSettings.targetID &&
                (!gObj.groupSettings.columns.length || e.target.classList.contains('e-selectionbackground'))) {
                if (parentsUntil(target, 'e-grid')) {
                    _this.updateScrollPostion(e.event, target);
                }
                if ((_this.isOverflowBorder || _this.parent.frozenRows > _this.dragTarget) &&
                    parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10) !== _this.dragTarget) {
                    _this.moveDragRows(e, _this.startedRow, trElement);
                }
                else {
                    if (trElement && _this.parent.getRowByIndex(_this.parent.getCurrentViewRecords().length - 1).getAttribute('data-uid') ===
                        trElement.getAttribute('data-uid')) {
                        var bottomborder = _this.parent.createElement('div', { className: 'e-lastrow-dragborder' });
                        var gridcontentEle = _this.parent.getContent();
                        bottomborder.style.width = _this.parent.element.offsetWidth - _this.getScrollWidth() + 'px';
                        if (!gridcontentEle.querySelectorAll('.e-lastrow-dragborder').length) {
                            gridcontentEle.classList.add('e-grid-relative');
                            gridcontentEle.appendChild(bottomborder);
                            bottomborder.style.bottom = _this.getScrollWidth() + 'px';
                        }
                    }
                    _this.removeBorder(trElement);
                }
            }
        };
        this.dragStop = function (e) {
            if (isActionPrevent(_this.parent)) {
                _this.parent.notify(events.preventBatch, {
                    instance: _this, handler: _this.processDragStop, arg1: e
                });
            }
            else {
                _this.processDragStop(e);
            }
        };
        this.processDragStop = function (e) {
            var gObj = _this.parent;
            if (_this.parent.isDestroyed) {
                return;
            }
            var targetEle = _this.getElementFromPosition(e.helper, e.event);
            var target = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
                targetEle : e.target;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            gObj.element.classList.remove('e-rowdrag');
            var dropElement = document.getElementById(gObj.rowDropSettings.targetID);
            if (gObj.rowDropSettings.targetID && dropElement && dropElement.ej2_instances &&
                dropElement.ej2_instances[0].getModuleName() === 'grid') {
                dropElement.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
            }
            if (gObj.isRowDragable()) {
                _this.stopTimer();
                gObj.enableHover = _this.hoverState;
                _this.parent.getContent().classList.remove('e-grid-relative');
                _this.removeBorder(targetEle);
                var stRow = gObj.element.querySelector('.e-dragstartrow');
                if (stRow) {
                    stRow.classList.remove('e-dragstartrow');
                }
            }
            _this.processArgs(target);
            var args = {
                target: (isBlazor()) ? null : target, draggableType: 'rows',
                cancel: false,
                fromIndex: parseInt(_this.rows[0].getAttribute('aria-rowindex'), 10),
                dropIndex: _this.dragTarget, rows: (isBlazor()) ? null : _this.rows,
                data: (Object.keys(_this.dragStartData[0]).length > 0) ? _this.dragStartData : _this.currentViewData()
            };
            gObj.trigger(events.rowDrop, args, function () {
                if (!(parentsUntil(target, 'e-row') || parentsUntil(target, 'e-emptyrow')) || args.cancel) {
                    _this.dragTarget = null;
                    remove(e.helper);
                    return;
                }
                _this.isRefresh = false;
                var selectedIndexes = _this.parent.getSelectedRowIndexes();
                if (gObj.isRowDragable()) {
                    if (!isBlazor()) {
                        if (!_this.parent.rowDropSettings.targetID &&
                            _this.startedRow.querySelector('td.e-selectionbackground') && selectedIndexes.length > 1 &&
                            selectedIndexes.length !== _this.parent.getCurrentViewRecords().length) {
                            _this.reorderRows(selectedIndexes, args.dropIndex);
                        }
                        else {
                            _this.reorderRows([parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10)], _this.dragTarget);
                        }
                    }
                    else {
                        var draggedData = _this.parent.getSelectedRecords().length ?
                            _this.parent.getSelectedRecords() : _this.currentViewData();
                        var changeRecords = {
                            addedRecords: [],
                            deletedRecords: draggedData,
                            changedRecords: []
                        };
                        var toIdx = _this.dragTarget ? _this.dragTarget : args.dropIndex;
                        var dragDropDestinationIndex = 'dragDropDestinationIndex';
                        var query = new Query;
                        query[dragDropDestinationIndex] = toIdx;
                        _this.saveChange(changeRecords, query);
                        changeRecords.deletedRecords = [];
                        changeRecords.addedRecords = draggedData;
                        _this.saveChange(changeRecords, query);
                    }
                    _this.dragTarget = null;
                    if (!gObj.rowDropSettings.targetID) {
                        remove(e.helper);
                        _this.rowOrder(args);
                    }
                }
                _this.isRefresh = true;
            });
        };
        this.removeCell = function (targetRow, className) {
            return [].slice.call(targetRow.querySelectorAll('td')).filter(function (cell) {
                if (cell.classList.contains(className)) {
                    targetRow.deleteCell(cell.cellIndex);
                }
            });
        };
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.initializeDrag, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.onDataBoundFn = this.onDataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }
    RowDD.prototype.refreshRow = function (args, tbody, mtbody) {
        var gObj = this.parent;
        var target;
        var mTarget;
        var frzCols = this.parent.getFrozenColumns();
        var tbodyMovableHeader;
        var tbodyMovableContent;
        var tbodyContent = gObj.getContentTable().querySelector('tbody');
        var tbodyHeader = gObj.getHeaderContent().querySelector('tbody');
        if (frzCols) {
            tbodyMovableHeader = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            tbodyMovableContent = gObj.getContent().querySelector('.e-movablecontent').querySelector('tbody');
        }
        var targetIdx = parseInt(args.target.parentElement.getAttribute('aria-rowindex'), 10);
        if (args.fromIndex < args.dropIndex || args.fromIndex === args.dropIndex) {
            targetIdx = targetIdx + 1;
        }
        target = tbody.querySelectorAll('.e-row')[targetIdx];
        if (frzCols) {
            mTarget = mtbody.querySelectorAll('.e-row')[targetIdx];
        }
        for (var i = 0, len = args.rows.length; i < len; i++) {
            if (frzCols) {
                if (i % 2 === 0) {
                    args.rows[i] = tbody.children[parseInt(args.rows[i].getAttribute('aria-rowindex'), 10)];
                }
                else {
                    args.rows[i] = mtbody.children[parseInt(args.rows[i].getAttribute('aria-rowindex'), 10)];
                }
            }
            else {
                args.rows[i] = tbody.children[parseInt(args.rows[i].getAttribute('aria-rowindex'), 10)];
            }
        }
        for (var i = 0, len = args.rows.length; i < len; i++) {
            if (frzCols) {
                if (i % 2 === 0) {
                    tbody.insertBefore(args.rows[i], target);
                }
                else {
                    mtbody.insertBefore(args.rows[i], mTarget);
                }
            }
            else {
                tbody.insertBefore(args.rows[i], target);
            }
        }
        var tr = [].slice.call(tbody.querySelectorAll('.e-row'));
        var mtr;
        if (frzCols) {
            mtr = [].slice.call(mtbody.querySelectorAll('.e-row'));
        }
        this.refreshData(tr, mtr);
        if (this.parent.frozenRows) {
            for (var i = 0, len = tr.length; i < len; i++) {
                if (i < this.parent.frozenRows) {
                    tbodyHeader.appendChild(tr[i]);
                    if (this.parent.getFrozenColumns()) {
                        tbodyMovableHeader.appendChild(mtr[i]);
                    }
                }
                else {
                    tbodyContent.appendChild(tr[i]);
                    if (this.parent.getFrozenColumns()) {
                        tbodyMovableContent.appendChild(mtr[i]);
                    }
                }
            }
        }
    };
    RowDD.prototype.updateFrozenRowreOrder = function (args) {
        var gObj = this.parent;
        var tbodyMovH;
        var tbodyMovC;
        var frzCols = this.parent.getFrozenColumns();
        var tbodyC = gObj.getContentTable().querySelector('tbody');
        var tbodyH = gObj.getHeaderContent().querySelector('tbody');
        if (frzCols) {
            tbodyMovH = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            tbodyMovC = gObj.getContent().querySelector('.e-movablecontent').querySelector('tbody');
        }
        var tr = [].slice.call(tbodyH.querySelectorAll('.e-row')).concat([].slice.call(tbodyC.querySelectorAll('.e-row')));
        var mtr;
        if (frzCols) {
            mtr = [].slice.call(tbodyMovH.querySelectorAll('.e-row')).concat([].slice.call(tbodyMovC.querySelectorAll('.e-row')));
        }
        var tbody = gObj.createElement('tbody');
        var mtbody = gObj.createElement('tbody');
        this.parent.clearSelection();
        for (var i = 0, len = tr.length; i < len; i++) {
            tbody.appendChild(tr[i]);
            if (frzCols) {
                mtbody.appendChild(mtr[i]);
            }
        }
        this.refreshRow(args, tbody, mtbody);
    };
    RowDD.prototype.updateFrozenColumnreOrder = function (args) {
        var gObj = this.parent;
        var mtbody;
        var frzCols = this.parent.getFrozenColumns();
        var tbody = gObj.getContentTable().querySelector('tbody');
        if (frzCols) {
            mtbody = gObj.getContent().querySelector('.e-movablecontent').querySelector('tbody');
        }
        this.parent.clearSelection();
        this.refreshRow(args, tbody, mtbody);
    };
    RowDD.prototype.refreshData = function (tr, mtr) {
        var rowObj = {};
        var movobj = {};
        var recordobj = {};
        for (var i = 0, len = tr.length; i < len; i++) {
            var index = parseInt(tr[i].getAttribute('aria-rowindex'), 10);
            rowObj[i] = this.parent.getRowsObject()[index];
            recordobj[i] = this.parent.getCurrentViewRecords()[index];
            if (this.parent.frozenColumns) {
                movobj[i] = this.parent.getMovableRowsObject()[index];
            }
        }
        for (var i = 0, len = tr.length; i < len; i++) {
            tr[i].setAttribute('aria-rowindex', i.toString());
            tr[i].setAttribute('data-uid', 'grid-row' + i.toString());
            this.parent.getRows()[i] = tr[i];
            this.parent.getRowsObject()[i] = rowObj[i];
            this.parent.getRowsObject()[i].uid = 'grid-row' + i.toString();
            this.parent.getRowsObject()[i].index = i;
            this.parent.getCurrentViewRecords()[i] = recordobj[i];
            if (this.parent.frozenColumns) {
                mtr[i].setAttribute('aria-rowindex', i.toString());
                mtr[i].setAttribute('data-uid', 'grid-row' + (i + tr.length).toString());
                this.parent.getMovableRows()[i] = mtr[i];
                this.parent.getMovableRowsObject()[i] = movobj[i];
                this.parent.getMovableRowsObject()[i].uid = 'grid-row' + (i + tr.length).toString();
                this.parent.getMovableRowsObject()[i].index = i;
            }
        }
    };
    RowDD.prototype.rowOrder = function (args) {
        if (args.target.classList.contains('e-rowcelldrag')) {
            args.target = args.target.parentElement;
        }
        if (this.parent.frozenRows) {
            this.updateFrozenRowreOrder(args);
        }
        else {
            this.updateFrozenColumnreOrder(args);
        }
        if (this.selectedRowColls.length > 0) {
            this.parent.selectRows(this.selectedRowColls);
            this.selectedRowColls = [];
        }
    };
    RowDD.prototype.currentViewData = function () {
        var selectedIndexes = this.parent.getSelectedRowIndexes();
        var currentVdata = [];
        var fromIdx = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
        for (var i = 0, n = selectedIndexes.length; i < n; i++) {
            var currentV = 'currentViewData';
            currentVdata[i] = this.parent[currentV][selectedIndexes[i]];
        }
        if (!this.parent.rowDropSettings.targetID && selectedIndexes.length === 0) {
            currentVdata[0] = this.parent.currentViewData[fromIdx];
        }
        return currentVdata;
    };
    RowDD.prototype.saveChange = function (changeRecords, query) {
        var _this = this;
        this.parent.getDataModule().saveChanges(changeRecords, this.parent.getPrimaryKeyFieldNames()[0], {}, query)
            .then(function () {
            _this.parent.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }).catch(function (e) {
            var error = 'error';
            var message = 'message';
            if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][message])) {
                e[error] = e[error][message];
            }
            _this.parent.trigger(events.actionFailure, e);
        });
    };
    RowDD.prototype.reorderRows = function (fromIndexes, toIndex) {
        var selectedIndexes = this.parent.getSelectedRowIndexes();
        var selectedRecords = [];
        var draggedRecords = [];
        var currentViewData = this.parent.renderModule.data.dataManager.dataSource.json;
        var dropIdx = toIndex;
        var actualIdx = fromIndexes[0];
        for (var i = 0, len = fromIndexes.length; i < len; i++) {
            draggedRecords[i] = currentViewData[fromIndexes[i]];
        }
        for (var i = 0, len = selectedIndexes.length; i < len; i++) {
            selectedRecords[i] = currentViewData[selectedIndexes[i]];
        }
        for (var i = 0, len = draggedRecords.length; i < len; i++) {
            if (i !== 0) {
                for (var j = 0, len1 = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(this.parent.renderModule.data.dataManager.dataSource.json[j]) ===
                        JSON.stringify(draggedRecords[i])) {
                        actualIdx = j;
                        break;
                    }
                }
                for (var j = 0, len1 = currentViewData.length; j < len1; j++) {
                    if (JSON.stringify(this.parent.renderModule.data.dataManager.dataSource.json[j]) === JSON.stringify(draggedRecords[i - 1])) {
                        if (actualIdx > j) {
                            dropIdx = j + 1;
                        }
                        break;
                    }
                }
            }
            this.reorderRow(actualIdx, dropIdx);
        }
        if (this.isRefresh) {
            this.parent.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }
        for (var i = 0, len = selectedRecords.length; i < len; i++) {
            for (var j = 0, len1 = currentViewData.length; j < len1; j++) {
                if (JSON.stringify(this.parent.renderModule.data.dataManager.dataSource.json[j]) === JSON.stringify(selectedRecords[i])) {
                    selectedIndexes[i] = j;
                    break;
                }
            }
        }
        this.selectedRowColls = selectedIndexes;
    };
    RowDD.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    RowDD.prototype.initializeDrag = function () {
        var gObj = this.parent;
        this.draggable = new Draggable(gObj.element, {
            dragTarget: '.e-rowcelldrag, .e-rowdragdrop, .e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop,
            isReplaceDragEle: this.isReplaceDragEle,
        });
    };
    RowDD.prototype.updateScrollPostion = function (e, target) {
        var _this = this;
        var y = getPosition(e).y;
        var cliRect = this.parent.getContent().getBoundingClientRect();
        var rowHeight = this.parent.getRowHeight() - 15;
        var scrollElem = this.parent.getContent().firstElementChild;
        if (cliRect.top + rowHeight >= y) {
            var scrollPixel_1 = -(this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(function () { _this.setScrollDown(scrollElem, scrollPixel_1, true); }, 200);
        }
        else if (cliRect.top + this.parent.getContent().clientHeight - rowHeight - 33 <= y) {
            var scrollPixel_2 = (this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(function () { _this.setScrollDown(scrollElem, scrollPixel_2, true); }, 200);
        }
    };
    RowDD.prototype.setScrollDown = function (scrollElem, scrollPixel, isLeft) {
        scrollElem.scrollTop = scrollElem.scrollTop + scrollPixel;
    };
    RowDD.prototype.moveDragRows = function (e, startedRow, targetRow) {
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        var element = closestElement(e.target, 'tr');
        if (parentsUntil(element, 'e-grid') &&
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id) {
            var targetElement = element ?
                element : this.startedRow;
            this.setBorder(targetElement, e.event, startedRow, targetRow);
        }
    };
    RowDD.prototype.setBorder = function (element, event, startedRow, targetRow) {
        var node = this.parent.element;
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        if (parentsUntil(element, 'e-grid') &&
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(element, 'e-grid').id) {
            removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop'), ['e-dragborder']);
            var rowElement_1 = [];
            var targetRowIndex = parseInt(targetRow.getAttribute('aria-rowindex'), 10);
            if (targetRow && targetRowIndex === 0) {
                var div = this.parent.createElement('div', { className: 'e-firstrow-dragborder' });
                var gridheaderEle = this.parent.getHeaderContent();
                gridheaderEle.classList.add('e-grid-relative');
                div.style.width = node.offsetWidth - this.getScrollWidth() + 'px';
                if (!gridheaderEle.querySelectorAll('.e-firstrow-dragborder').length) {
                    gridheaderEle.appendChild(div);
                }
            }
            else if (targetRow && parseInt(startedRow.getAttribute('aria-rowindex'), 10) > targetRowIndex) {
                element = this.parent.getRowByIndex(targetRowIndex - 1);
                rowElement_1 = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            }
            else {
                rowElement_1 = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            }
            var frzCols = this.parent.isFrozenGrid();
            if (targetRow && targetRowIndex !== 0 && frzCols) {
                var rowIndex_2 = parseInt(element.getAttribute('aria-rowindex'), 10);
                var selector_1 = '.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse';
                rowElement_1 = [];
                gridActionHandler(this.parent, function (tableName, rows) {
                    rowElement_1 = rowElement_1.concat([].slice.call(rows[rowIndex_2].querySelectorAll(selector_1)));
                }, getGridRowElements(this.parent));
            }
            if (rowElement_1.length > 0) {
                addRemoveActiveClasses(rowElement_1, true, 'e-dragborder');
            }
        }
    };
    RowDD.prototype.getScrollWidth = function () {
        var scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    };
    RowDD.prototype.removeFirstRowBorder = function (element) {
        if (this.parent.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            element.rowIndex !== 0) {
            remove(this.parent.element.getElementsByClassName('e-firstrow-dragborder')[0]);
        }
    };
    RowDD.prototype.removeLastRowBorder = function (element) {
        var islastRowIndex = element &&
            this.parent.getRowByIndex(this.parent.getCurrentViewRecords().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0 && element && islastRowIndex) {
            remove(this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0]);
        }
    };
    RowDD.prototype.removeBorder = function (element) {
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        element = this.parent.getRows().filter(function (row) {
            return row.querySelector('td.e-dragborder');
        })[0];
        if (element) {
            var rowElement_2 = [].slice.call(element.querySelectorAll('.e-dragborder'));
            if (this.parent.isFrozenGrid()) {
                var rowIndex_3 = parseInt(element.getAttribute('aria-rowindex'), 10);
                rowElement_2 = [];
                gridActionHandler(this.parent, function (tableName, rows) {
                    rowElement_2 = rowElement_2.concat([].slice.call(rows[rowIndex_3].querySelectorAll('.e-dragborder')));
                }, getGridRowElements(this.parent));
            }
            addRemoveActiveClasses(rowElement_2, false, 'e-dragborder');
        }
    };
    RowDD.prototype.getElementFromPosition = function (element, event) {
        var target;
        var position = getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    };
    RowDD.prototype.onDataBound = function (e) {
        if (this.selectedRowColls.length > 0) {
            this.parent.selectRows(this.selectedRowColls);
            this.selectedRowColls = [];
        }
    };
    RowDD.prototype.getTargetIdx = function (targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    };
    RowDD.prototype.singleRowDrop = function (e) {
        var targetRow = closestElement(e.target, 'tr');
        var currentIndex;
        var srcControl;
        srcControl = e.droppedElement.parentElement.ej2_instances[0];
        currentIndex = targetRow ? targetRow.rowIndex : srcControl.currentViewData.length - 1;
        this.reorderRow(this.startedRowIndex, currentIndex);
    };
    RowDD.prototype.columnDrop = function (e) {
        var gObj = this.parent;
        var draggObj = e.droppedElement.parentElement.ej2_instances[0];
        if (e.droppedElement.getAttribute('action') !== 'grouping' &&
            (parentsUntil(e.target, 'e-row') || parentsUntil(e.target, 'e-emptyrow'))) {
            var targetRow = closestElement(e.target, 'tr');
            var srcControl_1;
            var currentIndex = void 0;
            if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
                e.droppedElement.parentElement.id === gObj.element.id)
                || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                    e.droppedElement.parentElement.id !== gObj.element.id)) {
                return;
            }
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl_1 = e.droppedElement.parentElement.ej2_instances[0];
            }
            else if (this.isSingleRowDragDrop || e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true') {
                this.singleRowDrop(e);
                return;
            }
            if (srcControl_1.element.id !== gObj.element.id && srcControl_1.rowDropSettings.targetID !== gObj.element.id) {
                return;
            }
            var records = srcControl_1.getSelectedRecords();
            var targetIndex = currentIndex = this.getTargetIdx(targetRow);
            var count = 0;
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.allowPaging) {
                targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
            }
            //Todo: drag and drop mapper & BatchChanges
            if (!isBlazor()) {
                gObj.notify(events.rowsAdded, { toIndex: targetIndex, records: records });
                gObj.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
                var selectedRows = srcControl_1.getSelectedRowIndexes();
                var skip = srcControl_1.allowPaging ?
                    (srcControl_1.pageSettings.currentPage * srcControl_1.pageSettings.pageSize) - srcControl_1.pageSettings.pageSize : 0;
                this.selectedRows = [];
                for (var i = 0, len = records.length; i < len; i++) {
                    this.selectedRows.push(skip + selectedRows[i]);
                }
                srcControl_1.notify(events.rowsRemoved, { indexes: this.selectedRows, records: records });
                srcControl_1.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
            }
            else {
                var currentVdata = [];
                var selectedIndex = srcControl_1.getSelectedRowIndexes();
                for (var i = 0; i < selectedIndex.length; i++) {
                    currentVdata[i] = srcControl_1.currentViewData[selectedIndex[i]];
                }
                records = currentVdata;
                var changes = {
                    addedRecords: records,
                    deletedRecords: [],
                    changedRecords: []
                };
                var dragDropDestinationIndex = 'dragDropDestinationIndex';
                var query = new Query;
                query[dragDropDestinationIndex] = targetIndex;
                gObj.getDataModule().saveChanges(changes, gObj.getPrimaryKeyFieldNames()[0], {}, query)
                    .then(function () {
                    gObj.notify(events.modelChanged, {
                        type: events.actionBegin, requestType: 'rowdraganddrop'
                    });
                }).catch(function (e) {
                    var message = 'message';
                    var error = 'error';
                    if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][message])) {
                        e[error] = e[error][message];
                    }
                    gObj.trigger(events.actionFailure, e);
                });
                changes.deletedRecords = records;
                changes.addedRecords = [];
                srcControl_1.getDataModule().saveChanges(changes, srcControl_1.getPrimaryKeyFieldNames()[0], {}, query)
                    .then(function () {
                    srcControl_1.notify(events.modelChanged, {
                        type: events.actionBegin, requestType: 'rowdraganddrop'
                    });
                }).catch(function (e) {
                    var error = 'error';
                    var msg = 'message';
                    if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][msg])) {
                        e[error] = e[error][msg];
                    }
                    srcControl_1.trigger(events.actionFailure, e);
                });
            }
        }
    };
    RowDD.prototype.reorderRow = function (fromIndexes, toIndex) {
        var gObj = this.parent;
        if (!gObj.sortSettings.columns.length && !gObj.groupSettings.columns.length && !gObj.filterSettings.columns.length) {
            //Todo: drag and drop mapper & BatchChanges                 
            var skip = gObj.allowPaging ?
                (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize : 0;
            var fromIndex = fromIndexes;
            toIndex = toIndex + skip;
            this.selectedRows = gObj.getSelectedRowIndexes();
            gObj.notify(events.rowPositionChanged, {
                fromIndex: fromIndexes + skip,
                toIndex: toIndex
            });
        }
    };
    RowDD.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.initializeDrag();
        }
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    RowDD.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.draggable.destroy();
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.removeEventListener(events.dataBound, this.onDataBoundFn);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        //destory ejdrag and drop
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    RowDD.prototype.getModuleName = function () {
        return 'rowDragAndDrop';
    };
    RowDD.prototype.processArgs = function (target) {
        var gObj = this.parent;
        if ((gObj.getSelectedRecords().length > 0 && this.startedRow.cells[0].classList.contains('e-selectionbackground') === false)
            || gObj.getSelectedRecords().length === 0) {
            this.rows = [this.startedRow];
            this.rowData = [this.parent.getRowInfo((this.startedRow).querySelector('.e-rowcell')).rowData];
        }
        else {
            this.rows = gObj.getSelectedRows();
            this.rowData = gObj.getSelectedRecords();
        }
    };
    return RowDD;
}());
export { RowDD };
