import { Grid, RowDD as GridDragDrop, parentsUntil } from '@syncfusion/ej2-grids';
import { getObject, Scroll } from '@syncfusion/ej2-grids';
import { closest, isNullOrUndefined, classList, setValue, extend, getValue, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import { editAction } from './crud-actions';
import { getParentData, findChildrenRecords, isRemoteData, isOffline, isCountRequired } from '../utils';
/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
var RowDD = /** @class */ (function () {
    /**
     *
     * Constructor for render module
     */
    function RowDD(parent) {
        /** @hidden */
        this.canDrop = true;
        /** @hidden */
        this.isDraggedWithChild = false;
        /** @hidden */
        this.isaddtoBottom = false;
        Grid.Inject(GridDragDrop);
        this.parent = parent;
        this.addEventListener();
    }
    RowDD.prototype.getChildrecordsByParentID = function (id) {
        var index;
        var treeGridDataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            treeGridDataSource = this.parent.grid.dataSource.dataSource.json;
        }
        else {
            treeGridDataSource = this.parent.grid.dataSource;
        }
        var record = treeGridDataSource.filter(function (e) {
            return e.uniqueID === id;
        });
        return record;
    };
    /**
     * @hidden
     */
    RowDD.prototype.addEventListener = function () {
        this.parent.on(events.rowdraging, this.Rowdraging, this);
        this.parent.on(events.rowDropped, this.rowDropped, this);
        this.parent.on(events.rowsAdd, this.rowsAdded, this);
        this.parent.on(events.rowsRemove, this.rowsRemoved, this);
    };
    /**
     * Reorder the rows based on given indexes and position
     */
    RowDD.prototype.reorderRows = function (fromIndexes, toIndex, position) {
        var tObj = this.parent;
        if (fromIndexes[0] !== toIndex && position === 'above' || 'below' || 'child') {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            var data = [];
            for (var i = 0; i < fromIndexes.length; i++) {
                data[i] = this.parent.getCurrentViewRecords()[fromIndexes[i]];
            }
            var isByMethod = true;
            var args = {
                data: data,
                dropIndex: toIndex
            };
            if (!isCountRequired(this.parent)) {
                this.dropRows(args, isByMethod);
            }
            //this.refreshGridDataSource();
            if (tObj.isLocalData) {
                tObj.flatData = this.orderToIndex(tObj.flatData);
            }
            this.parent.grid.refresh();
        }
        else {
            return;
        }
    };
    RowDD.prototype.orderToIndex = function (currentData) {
        var _loop_1 = function (i) {
            currentData[i].index = i;
            if (!isNullOrUndefined(currentData[i].parentItem)) {
                var updatedParent = currentData.filter(function (data) {
                    return data.uniqueID === currentData[i].parentUniqueID;
                })[0];
                currentData[i].parentItem.index = updatedParent.index;
            }
        };
        for (var i = 0; i < currentData.length; i++) {
            _loop_1(i);
        }
        return currentData;
    };
    RowDD.prototype.rowsAdded = function (e) {
        var draggedRecord;
        var dragRecords = e.records;
        for (var i = e.records.length - 1; i > -1; i--) {
            draggedRecord = dragRecords[i];
            if (draggedRecord.parentUniqueID) {
                var record = dragRecords.filter(function (data) {
                    return data.uniqueID === draggedRecord.parentUniqueID;
                });
                if (record.length) {
                    var index = record[0].childRecords.indexOf(draggedRecord);
                    var parentRecord = record[0];
                    if (index !== -1) {
                        parentRecord.childRecords.splice(index, 1);
                        if (!parentRecord.childRecords.length) {
                            parentRecord.hasChildRecords = false;
                            parentRecord.hasFilteredChildRecords = false;
                        }
                        this.isDraggedWithChild = true;
                    }
                }
            }
        }
        if (isNullOrUndefined(this.parent.dataSource) || !this.parent.dataSource.length) {
            var tObj = this.parent;
            var draggedRecord_1;
            var dragRecords_1 = e.records;
            var dragLength = e.records.length;
            for (var i = dragLength - 1; i > -1; i--) {
                draggedRecord_1 = dragRecords_1[i];
                var recordIndex1 = 0;
                if (!isNullOrUndefined(draggedRecord_1.taskData) &&
                    !draggedRecord_1.taskData.hasOwnProperty(tObj.childMapping)) {
                    draggedRecord_1.taskData[tObj.childMapping] = [];
                }
                if (draggedRecord_1.hasOwnProperty(tObj.childMapping) &&
                    (draggedRecord_1[tObj.childMapping]).length && !this.isDraggedWithChild &&
                    !isNullOrUndefined(tObj.parentIdMapping)) {
                    var childData = (draggedRecord_1[tObj.childMapping]);
                    for (var j = 0; j < childData.length; j++) {
                        if (dragRecords_1.indexOf(childData[j]) === -1) {
                            dragRecords_1.splice(j, 0, childData[j]);
                            childData[j].taskData = extend({}, childData[j]);
                            i += 1;
                        }
                    }
                }
                if (draggedRecord_1.hasOwnProperty(tObj.parentIdMapping) && draggedRecord_1[tObj.parentIdMapping] != null
                    && !this.isDraggedWithChild) {
                    draggedRecord_1.taskData[tObj.parentIdMapping] = null;
                    delete draggedRecord_1.parentItem;
                    delete draggedRecord_1.parentUniqueID;
                }
                if (isNullOrUndefined(tObj.dataSource)) {
                    tObj.dataSource = [];
                }
                tObj.dataSource.splice(recordIndex1, 0, draggedRecord_1.taskData);
            }
            tObj.setProperties({ dataSource: tObj.dataSource }, false);
        }
        else {
            for (var i = 0; i < dragRecords.length; i++) {
                setValue('uniqueIDCollection.' + dragRecords[i].uniqueID, dragRecords[i], this.parent);
            }
            var args = { data: e.records, dropIndex: e.toIndex };
            if (this.parent.dataSource instanceof DataManager) {
                this.treeGridData = this.parent.dataSource.dataSource.json;
                this.treeData = this.parent.dataSource.dataSource.json;
            }
            else {
                this.treeGridData = this.parent.grid.dataSource;
                this.treeData = this.parent.dataSource;
            }
            this.dropRows(args);
        }
    };
    RowDD.prototype.rowsRemoved = function (e) {
        for (var i = 0; i < e.records.length; i++) {
            this.draggedRecord = e.records[i];
            if (this.draggedRecord.hasChildRecords || this.draggedRecord.parentItem &&
                this.parent.grid.dataSource.
                    indexOf(this.getChildrecordsByParentID(this.draggedRecord.parentUniqueID)[0]) !== -1 ||
                this.draggedRecord.level === 0) {
                this.deleteDragRow();
            }
        }
    };
    RowDD.prototype.refreshGridDataSource = function () {
        var draggedRecord = this.draggedRecord;
        var droppedRecord = this.droppedRecord;
        var proxy = this.parent;
        var tempDataSource;
        var idx;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            tempDataSource = proxy.dataSource.dataSource.json;
        }
        else {
            tempDataSource = proxy.dataSource;
        }
        if (tempDataSource && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (var i = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.childMapping] === droppedRecord.taskData[this.parent.childMapping]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx, 0, draggedRecord.taskData);
                }
            }
            else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx + 1, 0, draggedRecord.taskData);
                }
            }
        }
        else if (!this.parent.parentIdMapping && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                var record = this.getChildrecordsByParentID(droppedRecord.parentUniqueID)[0];
                var childRecords = record.childRecords;
                for (var i = 0; i < childRecords.length; i++) {
                    droppedRecord.parentItem.taskData[this.parent.childMapping][i] = childRecords[i].taskData;
                }
            }
        }
        if (this.parent.parentIdMapping) {
            if (draggedRecord.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                }
                else {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                }
            }
            else {
                draggedRecord.taskData[this.parent.parentIdMapping] = null;
                draggedRecord[this.parent.parentIdMapping] = null;
            }
        }
    };
    RowDD.prototype.removeFirstrowBorder = function (element, isRemove) {
        var canremove = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            (element.rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    };
    RowDD.prototype.removeLastrowBorder = function (element, isRemove) {
        var isEmptyRow = element && (element.classList.contains('e-emptyrow') || element.classList.contains('e-columnheader'));
        var islastRowIndex = element && !isEmptyRow &&
            this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        var canremove = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    };
    RowDD.prototype.updateIcon = function (row, index, args) {
        var rowEle = args.target ? closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        var rowPositionHeight = 0;
        this.removeFirstrowBorder(rowEle);
        this.removeLastrowBorder(rowEle);
        for (var i = 0; i < args.rows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === args.rows[i].getAttribute('data-uid')
                || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position 
        var tObj = this.parent;
        var rowTop = 0;
        var roundOff = 0;
        var toolHeight = tObj.toolbar && tObj.toolbar.length ?
            document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        var positionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        var contentHeight = tObj.getHeaderContent().offsetHeight + positionOffSet.top + toolHeight;
        var scrollTop = tObj.getContent().firstElementChild.scrollTop;
        if (!isNullOrUndefined(rowEle)) {
            rowPositionHeight = rowEle.offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.allowTextWrap) {
            rowTop = row[0].offsetHeight;
        }
        else {
            rowTop = rowPositionHeight + contentHeight + roundOff;
        }
        var rowBottom = rowTop + row[0].offsetHeight;
        var difference = rowBottom - rowTop;
        var divide = difference / 3;
        var topRowSegment = rowTop + divide;
        var middleRowSegment = topRowSegment + divide;
        var bottomRowSegment = middleRowSegment + divide;
        var posx = positionOffSet.left;
        var mouseEvent = getObject('originalEvent.event', args);
        var posy = mouseEvent.pageY;
        var isTopSegment = posy <= topRowSegment;
        var isMiddleRowSegment = (posy > topRowSegment && posy <= middleRowSegment);
        var isBottomRowSegment = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                var element = void 0;
                var rowElement = [];
                element = closest(args.target, 'tr');
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle);
                this.addFirstrowBorder(rowEle);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle);
                this.removeFirstrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
        }
        return this.dropPosition;
    };
    RowDD.prototype.removeChildBorder = function () {
        var borderElem = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    };
    RowDD.prototype.addFirstrowBorder = function (targetRow) {
        var node = this.parent.element;
        var tObj = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            var div = this.parent.createElement('div', { className: 'e-firstrow-border' });
            var gridheaderEle = this.parent.getHeaderContent();
            var toolbarHeight = 0;
            if (tObj.toolbar) {
                toolbarHeight = tObj.toolbarModule.getToolbar().offsetHeight;
            }
            var multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
            if (multiplegrid) {
                div.style.top = this.parent.grid.element.getElementsByClassName('e-gridheader')[0].offsetHeight
                    + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? node.offsetWidth + 'px' :
                node.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    };
    RowDD.prototype.addLastRowborder = function (trElement) {
        var isEmptyRow = trElement && (trElement.classList.contains('e-emptyrow') ||
            trElement.classList.contains('e-columnheader'));
        if (trElement && !isEmptyRow && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            var bottomborder = this.parent.createElement('div', { className: 'e-lastrow-border' });
            var gridcontentEle = this.parent.getContent();
            bottomborder.style.width = this.parent.element.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    };
    RowDD.prototype.getScrollWidth = function () {
        var scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    };
    RowDD.prototype.addErrorElem = function () {
        var dragelem = document.getElementsByClassName('e-cloneproperties')[0];
        var errorelem = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.rowDropSettings.targetID) {
            var ele = document.createElement('div');
            classList(ele, ['e-errorcontainer'], []);
            classList(ele, ['e-icons', 'e-errorelem'], []);
            var errorVal = dragelem.querySelector('.errorValue');
            var content = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            var spanContent = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    };
    RowDD.prototype.removeErrorElem = function () {
        var errorelem = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    };
    RowDD.prototype.topOrBottomBorder = function (target) {
        var element;
        var multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
        var rowElement = [];
        element = closest(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    };
    RowDD.prototype.removetopOrBottomBorder = function () {
        var border = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    };
    RowDD.prototype.addRemoveClasses = function (cells, add, className) {
        for (var i = 0, len = cells.length; i < len; i++) {
            if (add) {
                cells[i].classList.add(className);
            }
            else {
                cells[i].classList.remove(className);
            }
        }
    };
    RowDD.prototype.getOffset = function (element) {
        var box = element.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    };
    RowDD.prototype.Rowdraging = function (args) {
        var tObj = this.parent;
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        cloneElement.style.cursor = '';
        var rowEle = args.target ? closest(args.target, 'tr') : null;
        var rowIdx = rowEle ? rowEle.rowIndex : -1;
        var dragRecords = [];
        var droppedRecord = tObj.getCurrentViewRecords()[rowIdx];
        this.removeErrorElem();
        this.canDrop = true;
        if (!args.data[0]) {
            dragRecords.push(args.data);
        }
        else {
            dragRecords = args.data;
        }
        if (rowIdx !== -1) {
            this.ensuredropPosition(dragRecords, droppedRecord);
        }
        else {
            this.canDrop = false;
            this.addErrorElem();
        }
        if (!tObj.rowDropSettings.targetID && this.canDrop) {
            tObj.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
        }
        if (tObj.rowDropSettings.targetID) {
            var dropElement = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
                var srcControl = dropElement.ej2_instances[0];
                srcControl.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
            }
        }
        if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID)) {
            var dropElement = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    };
    RowDD.prototype.rowDropped = function (args) {
        var tObj = this.parent;
        var parentItem = 'parentItem';
        if (!tObj.rowDropSettings.targetID) {
            if (parentsUntil(args.target, 'e-content')) {
                if (this.parent.element.querySelector('.e-errorelem')) {
                    this.dropPosition = 'Invalid';
                }
                setValue('dropPosition', this.dropPosition, args);
                args.dropIndex = args.dropIndex === args.fromIndex ? this.getTargetIdx(args.target.parentElement) : args.dropIndex;
                tObj.trigger(events.rowDrop, args);
                if (!args.cancel) {
                    if (!isCountRequired(this.parent)) {
                        this.dropRows(args);
                    }
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                    tObj.grid.refresh();
                    if (!isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                        tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
                    }
                }
            }
        }
        else {
            if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID) || parentsUntil(args.target, 'e-treegrid') &&
                parentsUntil(args.target, 'e-treegrid').id === tObj.rowDropSettings.targetID) {
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(events.rowDrop, args);
                if (!args.cancel && tObj.rowDropSettings.targetID) {
                    this.dragDropGrid(args);
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                }
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
        else if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
        if (this.parent.enableImmutableMode && !this.parent.allowPaging && !isNullOrUndefined(args.data[0][parentItem])) {
            var index = this.parent.treeColumnIndex;
            index = index + 1;
            var primaryKeyField = this.parent.getPrimaryKeyFieldNames()[0];
            var rowIndex = this.parent.grid.getRowIndexByPrimaryKey(args.data[0][primaryKeyField]);
            var row = this.parent.getRows()[rowIndex];
            var data = args.data[0];
            if (this.dropPosition === 'middleSegment') {
                var record = [];
                var rows = [];
                record.push(data);
                rows.push(row);
                data = args.data[0][parentItem];
                rowIndex = this.parent.grid.getRowIndexByPrimaryKey(data[primaryKeyField]);
                var parentrow = this.parent.getRows()[rowIndex];
                record.push(data);
                rows.push(parentrow);
                for (var i = 0; i < record.length; i++) {
                    this.parent.renderModule.cellRender({
                        data: record[i], cell: rows[i].cells[index],
                        column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                        requestType: 'rowDragAndDrop'
                    });
                }
                var targetEle = parentrow.getElementsByClassName('e-treegridcollapse')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridcollapse');
                    addClass([targetEle], 'e-treegridexpand');
                }
            }
            else {
                this.parent.renderModule.cellRender({
                    data: data, cell: row.cells[index],
                    column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                    requestType: 'rowDragAndDrop'
                });
            }
        }
    };
    RowDD.prototype.dragDropGrid = function (args) {
        var tObj = this.parent;
        var currentIndex;
        var targetRow = closest(args.target, 'tr');
        var targetIndex = isNaN(this.getTargetIdx(targetRow)) ? 0 : this.getTargetIdx(targetRow);
        var dropElement = parentsUntil(args.target, 'e-treegrid');
        var srcControl;
        if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID && !isRemoteData(this.parent)
            && !isCountRequired(this.parent)) {
            srcControl = dropElement.ej2_instances[0];
            var records = tObj.getSelectedRecords();
            var indexes = [];
            for (var i = 0; i < records.length; i++) {
                indexes[i] = records[i].index;
            }
            tObj.notify(events.rowsRemove, { indexes: indexes, records: records });
            srcControl.notify(events.rowsAdd, { toIndex: targetIndex, records: records });
            var srcControlFlatData = srcControl.rowDragAndDropModule.treeGridData;
            if (!isNullOrUndefined(srcControlFlatData)) {
                for (var i = 0; i < srcControlFlatData.length; i++) {
                    srcControlFlatData[i].index = i;
                    if (!isNullOrUndefined(srcControlFlatData[i].parentItem)) {
                        var actualIndex = getValue('uniqueIDCollection.' + srcControlFlatData[i].parentUniqueID + '.index', srcControl);
                        srcControlFlatData[i].parentItem.index = actualIndex;
                    }
                }
            }
            tObj.grid.refresh();
            srcControl.grid.refresh();
            if (srcControl.grid.dataSource.length > 1) {
                srcControl.grid.refresh();
                if (!isNullOrUndefined(srcControl.getHeaderContent().querySelector('.e-firstrow-border'))) {
                    srcControl.getHeaderContent().querySelector('.e-firstrow-border').remove();
                }
                if (!isNullOrUndefined(srcControl.getContent().querySelector('.e-lastrow-border'))) {
                    srcControl.getContent().querySelector('.e-lastrow-border').remove();
                }
            }
        }
        if (isCountRequired(this.parent)) {
            srcControl = dropElement.ej2_instances[0];
            tObj.grid.refresh();
            srcControl.grid.refresh();
        }
    };
    RowDD.prototype.getTargetIdx = function (targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    };
    RowDD.prototype.getParentData = function (record) {
        var parentItem = record.parentItem;
        if (this.dropPosition === 'bottomSegment') {
            var selectedRecord = this.parent.getSelectedRecords()[0];
            this.droppedRecord = getParentData(this.parent, selectedRecord.parentItem.uniqueID);
        }
        if (this.dropPosition === 'middleSegment') {
            var level = this.parent.getSelectedRecords()[0].level;
            if (level === parentItem.level) {
                this.droppedRecord = getParentData(this.parent, parentItem.uniqueID);
            }
            else {
                this.getParentData(parentItem);
            }
        }
    };
    RowDD.prototype.dropRows = function (args, isByMethod) {
        if (this.dropPosition !== 'Invalid' && !isRemoteData(this.parent)) {
            var tObj = this.parent;
            var draggedRecord = void 0;
            var droppedRecord = void 0;
            if (isNullOrUndefined(args.dropIndex)) {
                var rowIndex = tObj.getSelectedRowIndexes()[0] - 1;
                var record = tObj.getCurrentViewRecords()[rowIndex];
                this.getParentData(record);
            }
            else {
                args.dropIndex = args.dropIndex === args.fromIndex ? this.getTargetIdx(args.target.parentElement) : args.dropIndex;
                this.droppedRecord = tObj.getCurrentViewRecords()[args.dropIndex];
            }
            var dragRecords = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data);
            }
            else {
                dragRecords = args.data;
            }
            var count = 0;
            var multiplegrid = this.parent.rowDropSettings.targetID;
            this.isMultipleGrid = multiplegrid;
            var addToBottom = false;
            if (!multiplegrid) {
                this.ensuredropPosition(dragRecords, droppedRecord);
            }
            else {
                this.isaddtoBottom = addToBottom = multiplegrid && this.isDraggedWithChild;
            }
            var dragLength = dragRecords.length;
            for (var i = 0; i < dragLength; i++) {
                draggedRecord = dragRecords[i];
                this.draggedRecord = draggedRecord;
                var recordIndex = args.dropIndex;
                var isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
                if (this.dropPosition !== 'Invalid') {
                    if (!tObj.rowDropSettings.targetID || isByMethod) {
                        this.deleteDragRow();
                    }
                    if (this.draggedRecord === this.droppedRecord) {
                        var correctIndex = this.getTargetIdx(args.target.offsetParent.parentElement);
                        if (isNaN(correctIndex)) {
                            correctIndex = this.getTargetIdx(args.target.parentElement);
                        }
                        recordIndex = args.dropIndex = correctIndex;
                        droppedRecord = this.droppedRecord = this.parent.getCurrentViewRecords()[args.dropIndex];
                    }
                    var recordIndex1 = this.treeGridData.indexOf(droppedRecord);
                    this.dropAtTop(recordIndex1, isSelfReference, i);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRecord.hasChildRecords) {
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                        }
                        else {
                            count = this.getChildCount(droppedRecord, 0);
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                        }
                        draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
                        draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
                        draggedRecord.level = this.treeGridData[recordIndex1].level;
                        if (draggedRecord.hasChildRecords) {
                            var level = 1;
                            this.updateChildRecordLevel(draggedRecord, level);
                            this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                        }
                        if (droppedRecord.parentItem) {
                            var rec = this.getChildrecordsByParentID(droppedRecord.parentUniqueID);
                            var childRecords = rec[0].childRecords;
                            var droppedRecordIndex = childRecords.indexOf(droppedRecord) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                        }
                    }
                    this.dropMiddle(recordIndex, recordIndex1, args, isByMethod, isSelfReference, i);
                }
                if (isNullOrUndefined(draggedRecord.parentItem)) {
                    var parentRecords = tObj.parentData;
                    var newParentIndex = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
                    }
                    else if (this.dropPosition === 'topSegment') {
                        parentRecords.splice(newParentIndex, 0, draggedRecord);
                    }
                }
                tObj.rowDragAndDropModule.refreshGridDataSource();
            }
        }
    };
    RowDD.prototype.dropMiddle = function (recordIndex, recordIndex1, args, isSelfReference, isByMethod, i) {
        var tObj = this.parent;
        var childRecords = findChildrenRecords(this.droppedRecord);
        var childRecordsLength = (isNullOrUndefined(childRecords) ||
            childRecords.length === 0) ? recordIndex1 + 1 :
            childRecords.length + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            else {
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
        }
    };
    RowDD.prototype.dropAtTop = function (recordIndex1, isSelfReference, i) {
        var tObj = this.parent;
        if (this.dropPosition === 'topSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            this.draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
            this.draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
            this.draggedRecord.level = this.treeGridData[recordIndex1].level;
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            if (this.draggedRecord.hasChildRecords) {
                var level = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                var rec = this.getChildrecordsByParentID(this.droppedRecord.parentUniqueID);
                var childRecords = rec[0].childRecords;
                var droppedRecordIndex = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
        }
    };
    RowDD.prototype.recordLevel = function () {
        var tObj = this.parent;
        var draggedRecord = this.draggedRecord;
        var droppedRecord = this.droppedRecord;
        var childItem = tObj.childMapping;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            droppedRecord.hasFilteredChildRecords = true;
            if (isNullOrUndefined(droppedRecord.childRecords)) {
                droppedRecord.childRecords = [];
                if (!tObj.parentIdMapping && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            var parentItem = extend({}, droppedRecord);
            delete parentItem.childRecords;
            draggedRecord.parentItem = parentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !tObj.parentIdMapping && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[tObj.childMapping].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            }
            else {
                var level = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
            // if (tObj.isLocalData) {
            //     tObj.parentData.push(droppedRecord);
            // }
        }
    };
    RowDD.prototype.deleteDragRow = function () {
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            this.treeGridData = this.parent.grid.dataSource.dataSource.json;
            this.treeData = this.parent.dataSource.dataSource.json;
        }
        else {
            this.treeGridData = this.parent.grid.dataSource;
            this.treeData = this.parent.dataSource;
        }
        var deletedRow;
        deletedRow = getParentData(this.parent, this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    };
    RowDD.prototype.updateChildRecord = function (record, count, expanded) {
        var currentRecord;
        var tObj = this.parent;
        var length = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (var i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            tObj.flatData.splice(count, 0, currentRecord);
            setValue('uniqueIDCollection.' + currentRecord.uniqueID, currentRecord, this.parent);
            if (tObj.parentIdMapping) {
                this.treeData.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    };
    RowDD.prototype.updateChildRecordLevel = function (record, level) {
        var length = 0;
        var currentRecord;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (var i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            var parentData = void 0;
            if (record.parentItem) {
                parentData = getParentData(this.parent, record.parentItem.uniqueID);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    };
    RowDD.prototype.removeRecords = function (record) {
        var tObj = this.parent;
        var dataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        var deletedRow = record;
        var recordIndex;
        var rowIndex;
        var isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
        var flatParentData = this.getChildrecordsByParentID(deletedRow.parentUniqueID)[0];
        if (deletedRow) {
            if (deletedRow.parentItem) {
                var childRecords = flatParentData ? flatParentData.childRecords : [];
                var childIndex = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.parentIdMapping) {
                        editAction({ value: deletedRow, action: 'delete' }, this.parent, isSelfReference, deletedRow.index, deletedRow.index);
                    }
                }
            }
            if (tObj.parentIdMapping) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                var idx = void 0;
                var idz = void 0;
                var treeGridData = dataSource;
                for (var i = 0; i < treeGridData.length; i++) {
                    if (treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idx = i;
                    }
                }
                for (var i = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idz = i;
                    }
                }
                if (idx !== -1 || idz !== -1) {
                    dataSource.splice(idx, 1);
                    this.treeGridData.splice(idz, 1);
                }
            }
            var recordIndex_1 = this.treeGridData.indexOf(deletedRow);
            if (!tObj.parentIdMapping) {
                var parentIndex = this.parent.parentData.indexOf(deletedRow);
                if (parentIndex !== -1) {
                    tObj.parentData.splice(parentIndex, 1);
                    dataSource.splice(parentIndex, 1);
                }
            }
            if (recordIndex_1 === -1 && !tObj.parentIdMapping) {
                var primaryKeyField = tObj.getPrimaryKeyFieldNames()[0];
                for (var j = 0; j < this.treeGridData.length; j++) {
                    if (this.treeGridData[j][primaryKeyField] === deletedRow[primaryKeyField]) {
                        recordIndex_1 = j;
                    }
                }
            }
            if (!tObj.parentIdMapping) {
                var deletedRecordCount = this.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex_1, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
                flatParentData.hasFilteredChildRecords = false;
            }
        }
    };
    RowDD.prototype.removeChildItem = function (record) {
        var tObj = this.parent;
        var currentRecord;
        var idx;
        var idz;
        var dataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        for (var i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            var treeGridData = void 0;
            if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
                treeGridData = this.parent.dataSource.dataSource.json;
            }
            else {
                treeGridData = this.parent.dataSource;
            }
            for (var i_1 = 0; i_1 < treeGridData.length; i_1++) {
                if (treeGridData[i_1][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idx = i_1;
                }
            }
            for (var i_2 = 0; i_2 < this.treeGridData.length; i_2++) {
                if (this.treeGridData[i_2][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idz = i_2;
                    break;
                }
            }
            if (idx !== -1 || idz !== -1) {
                dataSource.splice(idx, 1);
                this.treeGridData.splice(idz, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    };
    RowDD.prototype.getChildCount = function (record, count) {
        var currentRecord;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (var i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    };
    RowDD.prototype.ensuredropPosition = function (draggedRecords, currentRecord) {
        var tObj = this.parent;
        var rowDragMoudule = this;
        draggedRecords.filter(function (e) {
            if (e.hasChildRecords && !isNullOrUndefined(e.childRecords)) {
                var valid = e.childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(e.childRecords, currentRecord);
                }
                else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    };
    RowDD.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    RowDD.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.rowdraging, this.Rowdraging);
        this.parent.off(events.rowDropped, this.rowDropped);
        this.parent.off(events.rowsAdd, this.rowsAdded);
        this.parent.off(events.rowsRemove, this.rowsRemoved);
    };
    /**
     * hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    RowDD.prototype.getModuleName = function () {
        return 'rowDragAndDrop';
    };
    return RowDD;
}());
export { RowDD };
