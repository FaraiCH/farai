var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Browser, EventHandler, createElement, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { remove, closest, select } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { setCssInGridPopUp, getPosition, isGroupAdaptive, addRemoveActiveClasses, removeAddCboxClasses } from '../base/util';
import { getCellsByTableName, getCellByColAndRowIndex, parentsUntil, gridActionHandler } from '../base/util';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
import { iterateExtend, setChecked } from '../base/util';
/**
 * The `Selection` module is used to handle cell and row selection.
 */
var Selection = /** @class */ (function () {
    /**
     * Constructor for the Grid selection module
     * @hidden
     */
    function Selection(parent, selectionSettings, locator) {
        //Internal letiables       
        /**
         * @hidden
         */
        this.selectedRowIndexes = [];
        /**
         * @hidden
         */
        this.selectedRowCellIndexes = [];
        /**
         * @hidden
         */
        this.selectedRecords = [];
        /**
         * @hidden
         */
        this.preventFocus = false;
        /**
         *  @hidden
         */
        this.selectedColumnsIndexes = [];
        this.checkBoxState = false;
        this.isMultiShiftRequest = false;
        this.isMultiCtrlRequest = false;
        this.enableSelectMultiTouch = false;
        this.clearRowCheck = false;
        this.selectRowCheck = false;
        this.selectedRowState = {};
        this.totalRecordsCount = 0;
        this.chkAllCollec = [];
        this.isCheckedOnAdd = false;
        this.persistSelectedData = [];
        this.needColumnSelection = false;
        this.isCancelDeSelect = false;
        this.isPreventCellSelect = false;
        this.disableUI = false;
        this.isPersisted = false;
        this.cmdKeyPressed = false;
        this.cellselected = false;
        this.isMultiSelection = false;
        this.isAddRowsToSelection = false;
        this.initialRowSelection = false;
        /**
         * @hidden
         */
        this.autoFillRLselection = true;
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService('rendererFactory');
        this.focus = locator.getService('focus');
        this.addEventListener();
        this.wireEvents();
    }
    Selection.prototype.initializeSelection = function () {
        this.parent.log('selection_key_missing');
        this.render();
    };
    /**
     * The function used to trigger onActionBegin
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionBegin = function (args, type) {
        this.parent.trigger(type, this.fDataUpdate(args));
    };
    Selection.prototype.fDataUpdate = function (args) {
        if (!this.isMultiSelection && (!isNullOrUndefined(args.cellIndex) || !isNullOrUndefined(args.rowIndex))) {
            var rowObj = this.getRowObj(isNullOrUndefined(args.rowIndex) ? isNullOrUndefined(args.cellIndex) ?
                this.currentIndex : args.cellIndex.rowIndex : args.rowIndex);
            args.foreignKeyData = rowObj.foreignKeyData;
        }
        return args;
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionComplete = function (args, type) {
        this.parent.trigger(type, this.fDataUpdate(args));
        this.isMultiSelection = false;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    /**
     * To destroy the selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.hidePopUp();
        this.clearSelection();
        this.removeEventListener();
        this.unWireEvents();
        EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler);
    };
    Selection.prototype.isEditing = function () {
        return (this.parent.editSettings.mode === 'Normal' || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule &&
            this.parent.editModule.formObj && !this.parent.editModule.formObj.validate())) &&
            this.parent.isEdit && !this.parent.isPersistSelection;
    };
    Selection.prototype.getSelectedMovableRow = function (index) {
        var gObj = this.parent;
        if (gObj.isFrozenGrid() && this.parent.getContent().querySelector('.e-movablecontent')) {
            return gObj.getMovableRowByIndex(index);
        }
        return null;
    };
    Selection.prototype.getSelectedFrozenRightRow = function (index) {
        var gObj = this.parent;
        if (gObj.isFrozenGrid() && gObj.getFrozenMode() === 'Left-Right' && gObj.getFrozenRightContent()) {
            return gObj.getFrozenRightRowByIndex(index);
        }
        return null;
    };
    Selection.prototype.getCurrentBatchRecordChanges = function () {
        var gObj = this.parent;
        var added = 'addedRecords';
        var deleted = 'deletedRecords';
        if (gObj.editSettings.mode === 'Batch' && gObj.editModule) {
            var currentRecords = iterateExtend(this.parent.getCurrentViewRecords());
            currentRecords = gObj.editSettings.newRowPosition === 'Bottom' ?
                currentRecords.concat(this.parent.editModule.getBatchChanges()[added]) :
                this.parent.editModule.getBatchChanges()[added].concat(currentRecords);
            var deletedRecords = this.parent.editModule.getBatchChanges()[deleted];
            var primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
            for (var i = 0; i < (deletedRecords.length); i++) {
                for (var j = 0; j < currentRecords.length; j++) {
                    if (deletedRecords[i][primaryKey] === currentRecords[j][primaryKey]) {
                        currentRecords.splice(j, 1);
                        break;
                    }
                }
            }
            return currentRecords;
        }
        else {
            return gObj.getCurrentViewRecords();
        }
    };
    /**
     * Selects a row by the given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectRow = function (index, isToggle) {
        if (this.selectedRowIndexes.length && this.selectionSettings.enableSimpleMultiRowSelection) {
            this.addRowsToSelection([index]);
            return;
        }
        var gObj = this.parent;
        var selectedRow = gObj.getRowByIndex(index);
        var selectedMovableRow = this.getSelectedMovableRow(index);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(index);
        var selectData;
        var isRemoved = false;
        if (gObj.enableVirtualization && index > -1) {
            this.parent.notify(events.selectVirtualRow, { selectedIndex: index });
            var frozenData = gObj.isFrozenGrid() ? gObj.contentModule.getRowObjectByIndex(index)
                : null;
            if (selectedRow && (gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')) || frozenData)) {
                selectData = frozenData ? frozenData : gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')).data;
            }
            else {
                var prevSelectedData = this.parent.getSelectedRecords();
                if (prevSelectedData.length > 0) {
                    this.clearRowSelection();
                }
                return;
            }
        }
        else {
            selectData = this.getCurrentBatchRecordChanges()[index];
        }
        if (!this.isRowType() || !selectedRow || this.isEditing()) {
            // if (this.isEditing()) {
            //     gObj.selectedRowIndex = index;
            // }
            return;
        }
        var isRowSelected = selectedRow.hasAttribute('aria-selected');
        this.activeTarget();
        isToggle = !isToggle ? isToggle :
            !this.selectedRowIndexes.length ? false :
                (this.selectedRowIndexes.length === 1 ? (index === this.selectedRowIndexes[0]) : false);
        var args;
        var can = 'cancel';
        if (!isToggle) {
            var isHybrid = 'isHybrid';
            if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
                    previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false, isInteracted: this.isInteracted,
                    isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
                };
                args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, previousRowIndex: this.prevRowIndex,
                    cancel: false, isInteracted: this.isInteracted, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
                };
            }
            this.parent.trigger(events.rowSelecting, this.fDataUpdate(args), this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can));
        }
        else {
            this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can)(args);
        }
    };
    Selection.prototype.rowSelectingCallBack = function (args, isToggle, index, selectData, isRemoved, isRowSelected, can) {
        var _this = this;
        return function (args) {
            if (!isNullOrUndefined(args) && args[can] === true) {
                _this.disableInteracted();
                return;
            }
            _this.index = index;
            _this.toggle = isToggle;
            _this.data = selectData;
            _this.removed = isRemoved;
            if (isRowSelected && _this.selectionSettings.persistSelection && !(_this.selectionSettings.checkboxMode === 'ResetOnRowClick')) {
                _this.clearSelectedRow(index);
                _this.selectRowCallBack();
            }
            else if (!isRowSelected && _this.selectionSettings.persistSelection &&
                _this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                _this.selectRowCallBack();
            }
            if (_this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
                _this.clearSelection();
            }
            if (!_this.selectionSettings.persistSelection || _this.selectionSettings.checkboxMode === 'ResetOnRowClick' ||
                (!_this.parent.isCheckBoxSelection && _this.selectionSettings.persistSelection)) {
                _this.selectRowCheck = true;
                _this.clearRow();
            }
        };
    };
    Selection.prototype.selectRowCallBack = function () {
        var gObj = this.parent;
        var args;
        var index = this.index;
        var isToggle = this.toggle;
        var selectData = this.data;
        var isRemoved = this.removed;
        var selectedRow = gObj.getRowByIndex(index);
        var selectedMovableRow = this.getSelectedMovableRow(index);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(index);
        if (!isToggle && !isRemoved) {
            if (this.selectedRowIndexes.indexOf(index) <= -1) {
                this.updateRowSelection(selectedRow, index);
                this.selectMovableRow(selectedMovableRow, selectedFrozenRightRow, index);
            }
            this.selectRowIndex(index);
        }
        if (!isToggle) {
            var isHybrid = 'isHybrid';
            if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    data: selectData, rowIndex: index,
                    row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, target: this.actualTarget, isInteracted: this.isInteracted,
                    isHeaderCheckBoxClicked: this.isHeaderCheckboxClicked
                };
                args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    data: selectData, rowIndex: index,
                    row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, isInteracted: this.isInteracted,
                    isHeaderCheckBoxClicked: this.isHeaderCheckboxClicked
                };
            }
            this.onActionComplete(args, events.rowSelected);
        }
        if (isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization) {
            var interopAdaptor = 'interopAdaptor';
            var invokeMethodAsync = 'invokeMethodAsync';
            this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', true, 'normal', [index]);
        }
        this.isInteracted = false;
        this.updateRowProps(index);
    };
    Selection.prototype.selectMovableRow = function (selectedMovableRow, selectedFrozenRightRow, index) {
        if (this.parent.isFrozenGrid()) {
            this.updateRowSelection(selectedMovableRow, index);
            if (this.parent.getFrozenMode() === 'Left-Right' && selectedFrozenRightRow) {
                this.updateRowSelection(selectedFrozenRightRow, index);
            }
        }
    };
    Selection.prototype.addMovableArgs = function (targetObj, mRow, frRow) {
        if (this.parent.isFrozenGrid()) {
            var mObj = { mRow: mRow, previousMovRow: this.parent.getMovableRows()[this.prevRowIndex] };
            var frozenRightRow = 'frozenRightRow';
            var previousFrozenRightRow = 'previousFrozenRightRow';
            if (this.parent.getFrozenMode() === 'Left-Right' && frRow) {
                mObj[frozenRightRow] = frRow;
                mObj[previousFrozenRightRow] = this.parent.getFrozenRightDataRows()[this.prevRowIndex];
            }
            targetObj = __assign({}, targetObj, mObj);
        }
        return targetObj;
    };
    /**
     * Selects a range of rows from start and end row indexes.
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @return {void}
     */
    Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
        this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
        this.selectRowIndex(endIndex);
    };
    /**
     * Selects a collection of rows by index.
     * @param  {number[]} rowIndexes - Specifies an array of row indexes.
     * @return {void}
     */
    Selection.prototype.selectRows = function (rowIndexes) {
        var _this = this;
        var gObj = this.parent;
        var rowIndex = !this.isSingleSel() ? rowIndexes[0] : rowIndexes[rowIndexes.length - 1];
        this.isMultiSelection = true;
        var selectedRows = [];
        var foreignKeyData = [];
        var selectedMovableRow = this.getSelectedMovableRow(rowIndex);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(rowIndex);
        var can = 'cancel';
        var selectedData = [];
        if (!this.isRowType() || this.isEditing()) {
            return;
        }
        for (var i = 0, len = rowIndexes.length; i < len; i++) {
            var currentRow = this.parent.getDataRows()[rowIndexes[i]];
            var rowObj = this.getRowObj(currentRow);
            if (rowObj) {
                selectedData.push(rowObj.data);
                selectedRows.push(currentRow);
                foreignKeyData.push(rowObj.foreignKeyData);
            }
        }
        var isHybrid = 'isHybrid';
        this.activeTarget();
        var args;
        if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            args = {
                cancel: false,
                rowIndexes: rowIndexes, row: selectedRows, rowIndex: rowIndex, target: this.actualTarget,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                isInteracted: this.isInteracted, isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                data: selectedData, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
            };
            args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
        }
        else {
            args = {
                cancel: false,
                rowIndexes: rowIndexes, rowIndex: rowIndex, previousRowIndex: this.prevRowIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                data: selectedData, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
            };
        }
        this.parent.trigger(events.rowSelecting, this.fDataUpdate(args), function (args) {
            if (!isNullOrUndefined(args) && args[can] === true) {
                _this.disableInteracted();
                return;
            }
            _this.clearRow();
            _this.selectRowIndex(rowIndexes.slice(-1)[0]);
            var selectRowFn = function (index) {
                _this.updateRowSelection(gObj.getRowByIndex(index), index);
                if (gObj.isFrozenGrid()) {
                    var rightEle = _this.parent.getFrozenMode() === 'Left-Right' ? gObj.getFrozenRightRowByIndex(index)
                        : undefined;
                    _this.selectMovableRow(gObj.getMovableRowByIndex(index), rightEle, index);
                }
                _this.updateRowProps(rowIndex);
            };
            if (!_this.isSingleSel()) {
                for (var _i = 0, rowIndexes_1 = rowIndexes; _i < rowIndexes_1.length; _i++) {
                    var rowIdx = rowIndexes_1[_i];
                    selectRowFn(rowIdx);
                }
            }
            else {
                selectRowFn(rowIndex);
            }
            var isHybrid = 'isHybrid';
            if (!isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                args = {
                    rowIndexes: rowIndexes, row: selectedRows, rowIndex: rowIndex, target: _this.actualTarget,
                    prevRow: gObj.getRows()[_this.prevRowIndex], previousRowIndex: _this.prevRowIndex,
                    data: isBlazor() ? selectedData : _this.getSelectedRecords(), isInteracted: _this.isInteracted,
                    isHeaderCheckboxClicked: _this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
                };
                args = _this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    rowIndexes: rowIndexes, rowIndex: rowIndex, previousRowIndex: _this.prevRowIndex,
                    row: selectedRows, prevRow: gObj.getRows()[_this.prevRowIndex],
                    data: isBlazor() ? selectedData : _this.getSelectedRecords(), isInteracted: _this.isInteracted,
                    isHeaderCheckboxClicked: _this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
                };
            }
            if (_this.isRowSelected) {
                _this.onActionComplete(args, events.rowSelected);
            }
        });
    };
    /**
     * Select rows with existing row selection by passing row indexes.
     * @param  {number} startIndex - Specifies the row indexes.
     * @return {void}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.addRowsToSelection = function (rowIndexes) {
        var _this = this;
        var gObj = this.parent;
        var can = 'cancel';
        var target = this.target;
        this.isMultiSelection = true;
        var indexes = gObj.getSelectedRowIndexes().concat(rowIndexes);
        var selectedRow = !this.isSingleSel() ? gObj.getRowByIndex(rowIndexes[0]) :
            gObj.getRowByIndex(rowIndexes[rowIndexes.length - 1]);
        var selectedMovableRow = !this.isSingleSel() ? this.getSelectedMovableRow(rowIndexes[0]) :
            this.getSelectedMovableRow(rowIndexes[rowIndexes.length - 1]);
        var selectedFrozenRightRow = !this.isSingleSel() ? this.getSelectedFrozenRightRow(rowIndexes[0]) :
            this.getSelectedFrozenRightRow(rowIndexes[rowIndexes.length - 1]);
        if ((!this.isRowType() || this.isEditing()) && !this.selectionSettings.checkboxOnly) {
            return;
        }
        var args;
        var checkboxColumn = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        var _loop_1 = function (rowIndex) {
            var rowObj = this_1.getRowObj(rowIndex);
            var isUnSelected = this_1.selectedRowIndexes.indexOf(rowIndex) > -1;
            this_1.selectRowIndex(rowIndex);
            if (isUnSelected && ((checkboxColumn.length ? true : this_1.selectionSettings.enableToggle) || this_1.isMultiCtrlRequest)) {
                this_1.isAddRowsToSelection = true;
                this_1.rowDeselect(events.rowDeselecting, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target);
                if (this_1.isCancelDeSelect) {
                    return { value: void 0 };
                }
                this_1.selectedRowIndexes.splice(this_1.selectedRowIndexes.indexOf(rowIndex), 1);
                this_1.selectedRecords.splice(this_1.selectedRecords.indexOf(selectedRow), 1);
                selectedRow.removeAttribute('aria-selected');
                this_1.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
                if (selectedMovableRow) {
                    this_1.selectedRecords.splice(this_1.selectedRecords.indexOf(selectedMovableRow), 1);
                    selectedMovableRow.removeAttribute('aria-selected');
                    this_1.addRemoveClassesForRow(selectedMovableRow, false, null, 'e-selectionbackground', 'e-active');
                }
                this_1.rowDeselect(events.rowDeselected, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target, [selectedMovableRow]);
                this_1.isInteracted = false;
                this_1.isMultiSelection = false;
                this_1.isAddRowsToSelection = false;
            }
            else {
                var isHybrid = 'isHybrid';
                this_1.activeTarget();
                if (!isBlazor() || this_1.parent.isJsComponent || this_1.parent[isHybrid]) {
                    args = {
                        cancel: false,
                        data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this_1.actualTarget,
                        prevRow: gObj.getRows()[this_1.prevRowIndex], previousRowIndex: this_1.prevRowIndex,
                        isCtrlPressed: this_1.isMultiCtrlRequest, isShiftPressed: this_1.isMultiShiftRequest,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                    args = this_1.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
                }
                else {
                    args = {
                        cancel: false,
                        data: rowObj.data, rowIndex: rowIndex, previousRowIndex: this_1.prevRowIndex,
                        isCtrlPressed: this_1.isMultiCtrlRequest, isShiftPressed: this_1.isMultiShiftRequest,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                }
                this_1.parent.trigger(events.rowSelecting, this_1.fDataUpdate(args), function (args) {
                    if (!isNullOrUndefined(args) && args[can] === true) {
                        _this.disableInteracted();
                        return;
                    }
                    if (_this.isSingleSel()) {
                        _this.clearRow();
                    }
                    _this.updateRowSelection(selectedRow, rowIndex);
                    _this.selectMovableRow(selectedMovableRow, selectedFrozenRightRow, rowIndex);
                });
            }
            if (!isUnSelected) {
                var isHybrid = 'isHybrid';
                if (!isBlazor() || this_1.parent.isJsComponent || this_1.parent[isHybrid]) {
                    args = {
                        data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this_1.actualTarget,
                        prevRow: gObj.getRows()[this_1.prevRowIndex], previousRowIndex: this_1.prevRowIndex,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                    args = this_1.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
                }
                else {
                    args = {
                        data: rowObj.data, rowIndex: rowIndex, previousRowIndex: this_1.prevRowIndex,
                        row: selectedRow, prevRow: gObj.getRows()[this_1.prevRowIndex],
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                }
                this_1.onActionComplete(args, events.rowSelected);
            }
            this_1.isInteracted = false;
            this_1.updateRowProps(rowIndex);
            if (this_1.isSingleSel()) {
                return "break";
            }
        };
        var this_1 = this;
        for (var _i = 0, rowIndexes_2 = rowIndexes; _i < rowIndexes_2.length; _i++) {
            var rowIndex = rowIndexes_2[_i];
            var state_1 = _loop_1(rowIndex);
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
    };
    Selection.prototype.getCollectionFromIndexes = function (startIndex, endIndex) {
        var indexes = [];
        var _a = (startIndex <= endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    };
    Selection.prototype.clearRow = function () {
        this.clearRowCheck = true;
        this.clearRowSelection();
    };
    Selection.prototype.clearRowCallBack = function () {
        if (this.isCancelDeSelect && this.parent.checkAllRows !== 'Check') {
            return;
        }
        this.selectedRowIndexes = [];
        this.selectedRecords = [];
        this.selectRowIndex(-1);
        if (this.isSingleSel() && this.parent.isPersistSelection) {
            this.selectedRowState = {};
        }
    };
    Selection.prototype.clearSelectedRow = function (index) {
        if (this.toggle) {
            var selectedEle = this.parent.getRowByIndex(index);
            if (!this.disableUI) {
                selectedEle.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedEle, false, true, 'e-selectionbackground', 'e-active');
            }
            this.removed = true;
            this.updatePersistCollection(selectedEle, false);
            this.updateCheckBoxes(selectedEle);
            this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(index), 1);
            this.selectedRecords.splice(this.selectedRecords.indexOf(this.parent.getRowByIndex(index)), 1);
        }
    };
    Selection.prototype.updateRowProps = function (startIndex) {
        this.prevRowIndex = startIndex;
        this.isRowSelected = this.selectedRowIndexes.length && true;
    };
    Selection.prototype.updatePersistCollection = function (selectedRow, chkState) {
        var _this = this;
        if ((this.parent.isPersistSelection || this.parent.selectionSettings.persistSelection &&
            this.parent.getPrimaryKeyFieldNames().length > 0) && !isNullOrUndefined(selectedRow)) {
            if (!this.parent.isPersistSelection) {
                this.ensureCheckboxFieldSelection();
            }
            var rowObj = this.getRowObj(selectedRow);
            var pKey_1 = rowObj.data ? rowObj.data[this.primaryKey] : null;
            if (pKey_1 === null) {
                return;
            }
            rowObj.isSelected = chkState;
            if (chkState) {
                this.selectedRowState[pKey_1] = chkState;
                if (!this.persistSelectedData.some(function (data) { return data[_this.primaryKey] === pKey_1; })) {
                    this.persistSelectedData.push(rowObj.data);
                }
            }
            else {
                this.updatePersistDelete(pKey_1);
            }
        }
    };
    Selection.prototype.updatePersistDelete = function (pKey) {
        var _this = this;
        delete (this.selectedRowState[pKey]);
        var index;
        var isPresent = this.persistSelectedData.some(function (data, i) {
            index = i;
            return data[_this.primaryKey] === pKey;
        });
        if (isPresent) {
            this.persistSelectedData.splice(index, 1);
        }
    };
    Selection.prototype.updateCheckBoxes = function (row, chkState, rowIndex) {
        if (!isNullOrUndefined(row)) {
            var chkBox = row.querySelector('.e-checkselect');
            if (!isNullOrUndefined(chkBox)) {
                removeAddCboxClasses(chkBox.nextElementSibling, chkState);
                setChecked(chkBox, chkState);
                if (isNullOrUndefined(this.checkedTarget) || (!isNullOrUndefined(this.checkedTarget)
                    && !this.checkedTarget.classList.contains('e-checkselectall'))) {
                    this.setCheckAllState(rowIndex);
                }
            }
        }
    };
    Selection.prototype.updateRowSelection = function (selectedRow, startIndex) {
        if (!selectedRow) {
            return;
        }
        this.selectedRowIndexes.push(startIndex);
        var len = this.selectedRowIndexes.length;
        if (this.parent.isFrozenGrid() && len > 1) {
            if ((this.selectedRowIndexes[len - 2] === this.selectedRowIndexes[len - 1])) {
                this.selectedRowIndexes.pop();
            }
        }
        this.selectedRecords.push(selectedRow);
        selectedRow.setAttribute('aria-selected', 'true');
        this.updatePersistCollection(selectedRow, true);
        this.updateCheckBoxes(selectedRow, true);
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
        if (!this.preventFocus) {
            var target = this.focus.getPrevIndexes().cellIndex ?
                selectedRow.cells[this.focus.getPrevIndexes().cellIndex] :
                selectedRow.querySelector('.e-selectionbackground:not(.e-hide):not(.e-detailrowcollapse):not(.e-detailrowexpand)');
            if (this.parent.contextMenuModule && this.mouseButton === 2) {
                target = this.parent.contextMenuModule.cell;
            }
            if (!target) {
                return;
            }
            this.focus.onClick({ target: target }, true);
        }
    };
    /**
     * Deselects the currently selected rows and cells.
     * @return {void}
     */
    Selection.prototype.clearSelection = function () {
        if (!this.parent.isPersistSelection || (this.parent.isPersistSelection && !this.parent.isEdit) ||
            (!isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
            var span = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            if (this.parent.isPersistSelection) {
                this.persistSelectedData = [];
                this.selectedRowState = {};
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.clearColumnSelection();
            this.prevRowIndex = undefined;
            this.enableSelectMultiTouch = false;
            this.isInteracted = false;
        }
    };
    /**
     * Deselects the currently selected rows.
     * @return {void}
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.clearRowSelection = function () {
        var _this = this;
        if (this.isRowSelected) {
            var gObj = this.parent;
            var rows_1 = this.parent.getDataRows();
            var data_1 = [];
            var row_1 = [];
            var mRow_1 = [];
            var fRightRow_1 = [];
            var rowIndex_1 = [];
            var foreignKeyData_1 = [];
            var target_1 = this.target;
            var currentViewData = this.parent.getCurrentViewRecords();
            for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                var currentRow = this.parent.editSettings.mode === 'Batch' ?
                    this.parent.getRows()[this.selectedRowIndexes[i]]
                    : this.parent.getDataRows()[this.selectedRowIndexes[i]];
                var rowObj = this.getRowObj(currentRow);
                if (rowObj) {
                    data_1.push(rowObj.data);
                    row_1.push(currentRow);
                    rowIndex_1.push(this.selectedRowIndexes[i]);
                    foreignKeyData_1.push(rowObj.foreignKeyData);
                }
                if (gObj.isFrozenGrid()) {
                    mRow_1.push(gObj.getMovableRows()[this.selectedRowIndexes[i]]);
                    if (gObj.getFrozenMode() === 'Left-Right') {
                        fRightRow_1.push(gObj.getFrozenRightRows()[this.selectedRowIndexes[i]]);
                    }
                }
            }
            if (this.selectionSettings.persistSelection && this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                this.isInteracted = this.checkSelectAllClicked ? true : false;
            }
            this.rowDeselect(events.rowDeselecting, rowIndex_1, data_1, row_1, foreignKeyData_1, target_1, mRow_1, function () {
                if (_this.isCancelDeSelect && (_this.isInteracted || _this.checkSelectAllClicked)) {
                    if (_this.parent.isPersistSelection) {
                        if (_this.getCheckAllStatus(_this.parent.element.querySelector('.e-checkselectall')) === 'Intermediate') {
                            for (var i = 0; i < _this.selectedRecords.length; i++) {
                                _this.updatePersistCollection(_this.selectedRecords[i], true);
                            }
                        }
                        else {
                            _this.parent.checkAllRows = 'Check';
                            _this.updatePersistSelectedData(true);
                        }
                    }
                    if (_this.clearRowCheck) {
                        _this.clearRowCallBack();
                        _this.clearRowCheck = false;
                        if (_this.selectRowCheck) {
                            _this.selectRowCallBack();
                            _this.selectRowCheck = false;
                        }
                    }
                    return;
                }
                var element = [].slice.call(rows_1.filter(function (record) { return record.hasAttribute('aria-selected'); }));
                for (var j = 0; j < element.length; j++) {
                    if (!_this.disableUI || isBlazor()) {
                        element[j].removeAttribute('aria-selected');
                        _this.addRemoveClassesForRow(element[j], false, true, 'e-selectionbackground', 'e-active');
                    }
                    // tslint:disable-next-line:align
                    _this.updatePersistCollection(element[j], false);
                    _this.updateCheckBoxes(element[j]);
                }
                if (isBlazor() && _this.parent.isServerRendered && _this.parent.enableVirtualization) {
                    _this.getRenderer().setSelection(null, false, true);
                }
                for (var i = 0, len = _this.selectedRowIndexes.length; i < len; i++) {
                    var movableRow = _this.getSelectedMovableRow(_this.selectedRowIndexes[i]);
                    if (movableRow) {
                        if (!_this.disableUI || isBlazor()) {
                            movableRow.removeAttribute('aria-selected');
                            _this.addRemoveClassesForRow(movableRow, false, true, 'e-selectionbackground', 'e-active');
                        }
                        _this.updateCheckBoxes(movableRow);
                        _this.updatePersistCollection(movableRow, false);
                    }
                    var frRow = _this.getSelectedFrozenRightRow(_this.selectedRowIndexes[i]);
                    if (frRow) {
                        if (!_this.disableUI) {
                            frRow.removeAttribute('aria-selected');
                            _this.addRemoveClassesForRow(frRow, false, true, 'e-selectionbackground', 'e-active');
                        }
                        _this.updateCheckBoxes(frRow);
                        _this.updatePersistCollection(frRow, false);
                    }
                }
                _this.selectedRowIndexes = [];
                _this.selectedRecords = [];
                _this.isRowSelected = false;
                _this.selectRowIndex(-1);
                _this.rowDeselect(events.rowDeselected, rowIndex_1, data_1, row_1, foreignKeyData_1, target_1, mRow_1, undefined, fRightRow_1);
                if (_this.clearRowCheck) {
                    _this.clearRowCallBack();
                    _this.clearRowCheck = false;
                    if (_this.selectRowCheck) {
                        _this.selectRowCallBack();
                        _this.selectRowCheck = false;
                    }
                }
            }, fRightRow_1);
        }
        else {
            if (this.clearRowCheck) {
                this.clearRowCallBack();
                this.clearRowCheck = false;
                if (this.selectRowCheck) {
                    this.selectRowCallBack();
                    this.selectRowCheck = false;
                }
            }
        }
    };
    Selection.prototype.rowDeselect = function (type, rowIndex, data, row, foreignKeyData, target, mRow, rowDeselectCallBack, frozenRightRow) {
        var _this = this;
        if ((this.selectionSettings.persistSelection && this.isInteracted) || !this.selectionSettings.persistSelection) {
            var cancl_1 = 'cancel';
            var rowDeselectObj = {
                rowIndex: rowIndex[0], data: this.selectionSettings.persistSelection && this.parent.checkAllRows === 'Uncheck'
                    && this.selectionSettings.checkboxMode !== 'ResetOnRowClick' ?
                    this.persistSelectedData : data, foreignKeyData: foreignKeyData,
                cancel: false, isInteracted: this.isInteracted, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
            };
            if (type === 'rowDeselected') {
                delete rowDeselectObj.cancel;
            }
            var isHybrid = 'isHybrid';
            if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                var rowInString = 'row';
                var target_2 = 'target';
                var rowidx = 'rowIndex';
                var rowidxex = 'rowIndexes';
                var data_2 = 'data';
                var foreignKey = 'foreignKeyData';
                rowDeselectObj[rowInString] = row;
                rowDeselectObj[target_2] = this.actualTarget;
                var isHeaderCheckBxClick = this.actualTarget && !isNullOrUndefined(closest(this.actualTarget, 'thead'));
                if (isHeaderCheckBxClick || rowIndex.length > 1) {
                    rowDeselectObj[rowidx] = rowIndex[0];
                    rowDeselectObj[rowidxex] = rowIndex;
                }
                else if (rowIndex.length === 1) {
                    rowDeselectObj[data_2] = rowDeselectObj[data_2][0];
                    rowDeselectObj[rowInString] = rowDeselectObj[rowInString][0];
                    rowDeselectObj[foreignKey] = rowDeselectObj[foreignKey][0];
                    if (this.isAddRowsToSelection) {
                        rowDeselectObj[rowidxex] = rowIndex;
                    }
                }
            }
            else {
                var rowIndex_2 = 'rowIndex';
                var data_3 = 'data';
                rowDeselectObj[rowIndex_2] = rowDeselectObj[rowIndex_2][rowDeselectObj[rowIndex_2].length - 1];
                rowDeselectObj[data_3] = rowDeselectObj[data_3][rowDeselectObj[data_3].length - 1];
            }
            this.parent.trigger(type, (!isBlazor() || this.parent.isJsComponent) && this.parent.isFrozenGrid() ? __assign({}, rowDeselectObj, { mRow: mRow, frozenRightRow: frozenRightRow }) : rowDeselectObj, function (args) {
                _this.isCancelDeSelect = args[cancl_1];
                if (!_this.isCancelDeSelect || (!_this.isInteracted && !_this.checkSelectAllClicked)) {
                    _this.updatePersistCollection(row[0], false);
                    _this.updateCheckBoxes(row[0], undefined, rowIndex[0]);
                }
                if (rowDeselectCallBack !== undefined) {
                    rowDeselectCallBack();
                }
            });
        }
        else if (this.selectionSettings.persistSelection && !this.isInteracted) {
            if (rowDeselectCallBack !== undefined) {
                rowDeselectCallBack();
            }
        }
    };
    Selection.prototype.getRowObj = function (row) {
        if (row === void 0) { row = this.currentIndex; }
        if (isNullOrUndefined(row)) {
            return {};
        }
        if (typeof row === 'number') {
            row = this.parent.getRowByIndex(row);
        }
        if (row) {
            return this.parent.getRowObjectFromUID(row.getAttribute('data-uid')) || {};
        }
        return {};
    };
    Selection.prototype.getSelectedMovableCell = function (cellIndex) {
        var gObj = this.parent;
        var col = gObj.getColumnByIndex(cellIndex.cellIndex);
        var frzCols = gObj.isFrozenGrid();
        if (frzCols) {
            if (col.getFreezeTableName() === 'movable') {
                return gObj.getMovableCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
            }
            return null;
        }
        return null;
    };
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectCell = function (cellIndex, isToggle) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(cellIndex);
        var args;
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
        }
        var selectedTable;
        var cIdx;
        this.currentIndex = cellIndex.rowIndex;
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        var isCellSelected = selectedCell.classList.contains('e-cellselectionbackground');
        isToggle = !isToggle ? isToggle : (!isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);
        if (!isToggle) {
            args = {
                data: selectedData, cellIndex: cellIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                previousRowCell: this.prevECIdxs ?
                    this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
                cancel: false
            };
            if (!isBlazor() || this.parent.isJsComponent) {
                var currentCell = 'currentCell';
                args[currentCell] = selectedCell;
                var previousRowCellIndex = 'previousRowCellIndex';
                args[previousRowCellIndex] = this.prevECIdxs;
            }
            this.parent.trigger(events.cellSelecting, this.fDataUpdate(args), this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData));
            this.cellselected = true;
        }
        else {
            this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData)(args);
        }
    };
    Selection.prototype.successCallBack = function (cellSelectingArgs, isToggle, cellIndex, selectedCell, selectedData) {
        var _this = this;
        return function (cellSelectingArgs) {
            var cncl = 'cancel';
            var currentCell = 'currentCell';
            if (!isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[cncl] === true) {
                return;
            }
            if (!isToggle) {
                cellSelectingArgs[currentCell] = cellSelectingArgs[currentCell] ? cellSelectingArgs[currentCell] : selectedCell;
            }
            _this.clearCell();
            if (!isToggle) {
                _this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isToggle) {
                var args = void 0;
                var isHybrid = 'isHybrid';
                if (!isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                    args = {
                        data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                        selectedRowCellIndex: _this.selectedRowCellIndexes,
                        previousRowCell: _this.prevECIdxs ?
                            _this.getCellIndex(_this.prevECIdxs.rowIndex, _this.prevECIdxs.cellIndex) : undefined
                    };
                    var previousRowCellIndex = 'previousRowCellIndex';
                    args[previousRowCellIndex] = _this.prevECIdxs;
                }
                else {
                    args = { data: selectedData, cellIndex: cellIndex, selectedRowCellIndex: _this.selectedRowCellIndexes };
                }
                _this.updateCellProps(cellIndex, cellIndex);
                _this.onActionComplete(args, events.cellSelected);
            }
        };
    };
    Selection.prototype.getCellIndex = function (rIdx, cIdx) {
        return (this.parent.getFrozenColumns() ? (cIdx >= this.parent.getFrozenColumns() ? this.parent.getMovableCellFromIndex(rIdx, cIdx)
            : this.parent.getCellFromIndex(rIdx, cIdx)) : this.parent.getCellFromIndex(rIdx, cIdx));
    };
    /**
     * Selects a range of cells from start and end indexes.
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     * @return {void}
     */
    Selection.prototype.selectCellsByRange = function (startIndex, endIndex) {
        var _this = this;
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(startIndex);
        var frzCols = gObj.getFrozenColumns();
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
        }
        var min;
        var max;
        var stIndex = startIndex;
        var edIndex = endIndex = endIndex ? endIndex : startIndex;
        var cellIndexes;
        this.currentIndex = startIndex.rowIndex;
        var cncl = 'cancel';
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        var args = {
            data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        };
        if (!isBlazor()) {
            var previousRowCellIndex = 'previousRowCellIndex';
            args[previousRowCellIndex] = this.prevECIdxs;
        }
        this.parent.trigger(events.cellSelecting, this.fDataUpdate(args), function (cellSelectingArgs) {
            if (!isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[cncl] === true) {
                return;
            }
            _this.clearCell();
            if (startIndex.rowIndex > endIndex.rowIndex) {
                var temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (var i = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
                if (_this.selectionSettings.cellSelectionMode.indexOf('Box') < 0) {
                    min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                    max = i === endIndex.rowIndex ? (endIndex.cellIndex) : _this.getLastColIndex(i);
                }
                else {
                    min = startIndex.cellIndex;
                    max = endIndex.cellIndex;
                }
                cellIndexes = [];
                for (var j = min < max ? min : max, len = min > max ? min : max; j <= len; j++) {
                    if (frzCols) {
                        if (j < frzCols) {
                            selectedCell = gObj.getCellFromIndex(i, j);
                        }
                        else {
                            selectedCell = gObj.getMovableCellFromIndex(i, j);
                        }
                    }
                    else {
                        selectedCell = gObj.getCellFromIndex(i, j);
                    }
                    if (!selectedCell) {
                        continue;
                    }
                    cellIndexes.push(j);
                    _this.updateCellSelection(selectedCell);
                    _this.addAttribute(selectedCell);
                }
                _this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
            }
            var cellSelectedArgs;
            var isHybrid = 'isHybrid';
            if (!isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                cellSelectedArgs = {
                    data: selectedData, cellIndex: edIndex, currentCell: gObj.getCellFromIndex(edIndex.rowIndex, edIndex.cellIndex),
                    selectedRowCellIndex: _this.selectedRowCellIndexes,
                    previousRowCell: _this.prevECIdxs ? _this.getCellIndex(_this.prevECIdxs.rowIndex, _this.prevECIdxs.cellIndex) : undefined
                };
                var previousRowCellIndex = 'previousRowCellIndex';
                cellSelectedArgs[previousRowCellIndex] = _this.prevECIdxs;
            }
            else {
                cellSelectedArgs = { data: selectedData, cellIndex: edIndex, selectedRowCellIndex: _this.selectedRowCellIndexes };
            }
            if (!_this.isDragged) {
                _this.onActionComplete(cellSelectedArgs, events.cellSelected);
                _this.cellselected = true;
            }
            _this.updateCellProps(stIndex, edIndex);
        });
    };
    /**
     * Selects a collection of cells by row and column indexes.
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    Selection.prototype.selectCells = function (rowCellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(rowCellIndexes[0]);
        var frzCols = gObj.getFrozenColumns();
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
        }
        this.currentIndex = rowCellIndexes[0].rowIndex;
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        var cellSelectArgs;
        var isHybrid = 'isHybrid';
        if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            cellSelectArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest,
                previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            var previousRowCellIndex = 'previousRowCellIndex';
            cellSelectArgs[previousRowCellIndex] = this.prevECIdxs;
        }
        else {
            cellSelectArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
        }
        this.onActionBegin(cellSelectArgs, events.cellSelecting);
        for (var i = 0, len = rowCellIndexes.length; i < len; i++) {
            for (var j = 0, cellLen = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                if (frzCols) {
                    if (rowCellIndexes[i].cellIndexes[j] < frzCols) {
                        selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    }
                    else {
                        selectedCell = gObj.getMovableCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    }
                }
                else {
                    selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                }
                if (!selectedCell) {
                    continue;
                }
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
                this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
            }
        }
        this.updateCellProps({ rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] }, { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
        var cellSelectedArgs;
        if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            cellSelectedArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            var previousRowCellIndex = 'previousRowCellIndex';
            cellSelectedArgs[previousRowCellIndex] = this.prevECIdxs;
        }
        else {
            cellSelectedArgs = { data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                selectedRowCellIndex: this.selectedRowCellIndexes };
        }
        this.onActionComplete(cellSelectedArgs, events.cellSelected);
    };
    /**
     * Select cells with existing cell selection by passing row and column index.
     * @param  {IIndex} startIndex - Defines the collection of row and column index.
     * @return {void}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.addCellsToSelection = function (cellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell;
        var index;
        this.currentIndex = cellIndexes[0].rowIndex;
        var cncl = 'cancel';
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        var isHybrid = 'isHybrid';
        var left = gObj.getFrozenLeftCount();
        var movable = gObj.getMovableColumnsCount();
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.hideAutoFill();
        var col = gObj.getColumnByIndex(cellIndexes[0].cellIndex);
        var rowObj;
        gridActionHandler(this.parent, function (tableName, rows) {
            rowObj = rows[cellIndexes[0].rowIndex];
        }, [
            !col.getFreezeTableName() || col.getFreezeTableName() === 'frozen-left' ? gObj.getRowsObject() : [],
            col.getFreezeTableName() === 'movable' ? gObj.getMovableRowsObject() : [],
            col.getFreezeTableName() === 'frozen-right' ? gObj.getFrozenRightRowsObject() : []
        ]);
        var foreignKeyData = [];
        for (var _i = 0, cellIndexes_1 = cellIndexes; _i < cellIndexes_1.length; _i++) {
            var cellIndex = cellIndexes_1[_i];
            for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                    index = i;
                    break;
                }
            }
            selectedCell = this.getSelectedMovableCell(cellIndex);
            if (!selectedCell) {
                selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
            }
            var idx = col.getFreezeTableName() === 'movable' ? cellIndex.cellIndex - left
                : col.getFreezeTableName() === 'frozen-right' ? cellIndex.cellIndex - (left + movable) : cellIndex.cellIndex;
            foreignKeyData.push(rowObj.cells[idx].foreignKeyData);
            var args = void 0;
            if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    cancel: false, data: selectedData, cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest,
                    currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
                };
                var previousRowCellIndex = 'previousRowCellIndex';
                args[previousRowCellIndex] = this.prevECIdxs;
            }
            else {
                args = {
                    cancel: false, data: selectedData, cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest, isCtrlPressed: this.isMultiCtrlRequest
                };
            }
            var isUnSelected = index > -1;
            if (isUnSelected) {
                var selectedCellIdx = this.selectedRowCellIndexes[index].cellIndexes;
                if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                    this.cellDeselect(events.cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell], foreignKeyData);
                    selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                    if (selectedCellIdx.length === 0) {
                        this.selectedRowCellIndexes.splice(index, 1);
                    }
                    selectedCell.classList.remove('e-cellselectionbackground');
                    selectedCell.removeAttribute('aria-selected');
                    this.cellDeselect(events.cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell], foreignKeyData);
                }
                else {
                    isUnSelected = false;
                    this.onActionBegin(args, events.cellSelecting);
                    this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
            }
            else {
                this.onActionBegin(args, events.cellSelecting);
                if (!isNullOrUndefined(args) && args[cncl] === true) {
                    return;
                }
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isUnSelected) {
                var cellSelectedArgs = void 0;
                if (!isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                    cellSelectedArgs = {
                        data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
                        previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                            undefined, selectedRowCellIndex: this.selectedRowCellIndexes
                    };
                    var previousRowCellIndex = 'previousRowCellIndex';
                    cellSelectedArgs[previousRowCellIndex] = this.prevECIdxs;
                }
                else {
                    cellSelectedArgs = { data: selectedData, cellIndex: cellIndexes[0], selectedRowCellIndex: this.selectedRowCellIndexes };
                }
                this.onActionComplete(cellSelectedArgs, events.cellSelected);
                this.cellselected = true;
            }
            this.updateCellProps(cellIndex, cellIndex);
        }
    };
    Selection.prototype.getColIndex = function (rowIndex, index) {
        var frzCols = this.parent.isFrozenGrid();
        var col = this.parent.getColumnByIndex(index);
        var cells = getCellsByTableName(this.parent, col, rowIndex);
        if (cells) {
            for (var m = 0; m < cells.length; m++) {
                var colIndex = parseInt(cells[m].getAttribute('aria-colindex'), 10);
                if (colIndex === index) {
                    if (frzCols) {
                        if (col.getFreezeTableName() === 'movable') {
                            m += this.parent.getFrozenLeftCount();
                        }
                        else if (col.getFreezeTableName() === 'frozen-right') {
                            m += (this.parent.getFrozenLeftColumnsCount() + this.parent.getMovableColumnsCount());
                        }
                    }
                    return m;
                }
            }
        }
        return -1;
    };
    Selection.prototype.getLastColIndex = function (rowIndex) {
        var cells = this.parent.getFrozenColumns() ? this.parent.getMovableDataRows()[rowIndex].querySelectorAll('td.e-rowcell')
            : this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        return parseInt(cells[cells.length - 1].getAttribute('aria-colindex'), 10);
    };
    Selection.prototype.clearCell = function () {
        this.clearCellSelection();
    };
    Selection.prototype.cellDeselect = function (type, cellIndexes, data, cells, foreignKeyData) {
        var cancl = 'cancel';
        if (cells[0] && cells[0].classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(cells[0], 'tr'));
        }
        var args = {
            cells: cells, data: data, cellIndexes: cellIndexes, foreignKeyData: foreignKeyData, cancel: false
        };
        this.parent.trigger(type, args);
        this.isPreventCellSelect = args[cancl];
    };
    Selection.prototype.updateCellSelection = function (selectedCell, rowIndex, cellIndex) {
        if (!isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        if (selectedCell.classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(selectedCell, 'tr'), true);
        }
        this.addAttribute(selectedCell);
    };
    Selection.prototype.addAttribute = function (cell) {
        this.target = cell;
        if (!isNullOrUndefined(cell)) {
            cell.setAttribute('aria-selected', 'true');
            if (!this.preventFocus) {
                this.focus.onClick({ target: cell }, true);
            }
        }
    };
    Selection.prototype.updateCellProps = function (startIndex, endIndex) {
        this.prevCIdxs = startIndex;
        this.prevECIdxs = endIndex;
        this.isCellSelected = this.selectedRowCellIndexes.length && true;
    };
    Selection.prototype.addRowCellIndex = function (rowCellIndex) {
        var isRowAvail;
        var index;
        for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
            if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                isRowAvail = true;
                index = i;
                break;
            }
        }
        if (isRowAvail) {
            if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
            }
        }
        else {
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
        }
    };
    /**
     * Deselects the currently selected cells.
     * @return {void}
     */
    Selection.prototype.clearCellSelection = function () {
        if (this.isCellSelected) {
            var gObj = this.parent;
            var selectedCells = this.getSelectedCellsElement();
            var rowCell = this.selectedRowCellIndexes;
            var data = [];
            var cells = [];
            var foreignKeyData = [];
            var currentViewData = this.getCurrentBatchRecordChanges();
            var selectedTable = void 0;
            var frzCols = gObj.isFrozenGrid();
            this.hideAutoFill();
            for (var i = 0, len = rowCell.length; i < len; i++) {
                data.push(currentViewData[rowCell[i].rowIndex]);
                var rowObj = this.getRowObj(rowCell[i].rowIndex);
                for (var j = 0, cLen = rowCell[i].cellIndexes.length; j < cLen; j++) {
                    if (frzCols) {
                        var col = gObj.getColumnByIndex(rowCell[i].cellIndexes[j]);
                        cells.push(getCellByColAndRowIndex(this.parent, col, rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                    else {
                        if (rowObj.cells) {
                            foreignKeyData.push(rowObj.cells[rowCell[i].cellIndexes[j]].foreignKeyData);
                        }
                        cells.push(gObj.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                }
            }
            this.cellDeselect(events.cellDeselecting, rowCell, data, cells, foreignKeyData);
            if (this.isPreventCellSelect === true) {
                return;
            }
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                selectedCells[i].classList.remove('e-cellselectionbackground');
                selectedCells[i].removeAttribute('aria-selected');
            }
            if (this.bdrElement) {
                this.showHideBorders('none');
            }
            this.selectedRowCellIndexes = [];
            this.isCellSelected = false;
            if (!this.isDragged && this.cellselected) {
                this.cellDeselect(events.cellDeselected, rowCell, data, cells, foreignKeyData);
            }
        }
    };
    Selection.prototype.getSelectedCellsElement = function () {
        var gObj = this.parent;
        var rows = gObj.getDataRows();
        var mRows;
        if (gObj.isFrozenGrid()) {
            mRows = gObj.getMovableDataRows();
            rows = gObj.addMovableRows(rows, mRows);
            if (gObj.getFrozenMode() === 'Left-Right') {
                rows = gObj.addMovableRows(rows, gObj.getFrozenRightDataRows());
            }
        }
        var cells = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            cells = cells.concat([].slice.call(rows[i].querySelectorAll('.e-cellselectionbackground')));
        }
        return cells;
    };
    Selection.prototype.mouseMoveHandler = function (e) {
        e.preventDefault();
        var gBRect = this.parent.element.getBoundingClientRect();
        var x1 = this.x;
        var y1 = this.y;
        var position = getPosition(e);
        var x2 = position.x - gBRect.left;
        var y2 = position.y - gBRect.top;
        var tmp;
        var target = closest(e.target, 'tr');
        this.isDragged = true;
        if (!this.isCellDrag) {
            if (!target) {
                target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
        }
        if (target && !e.ctrlKey && !e.shiftKey) {
            var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
            if (!this.isCellDrag) {
                this.hideAutoFill();
                this.selectRowsByRange(this.startDIndex, rowIndex);
            }
            else {
                var td = parentsUntil(e.target, 'e-rowcell');
                if (td) {
                    this.startAFCell = this.startCell;
                    this.endAFCell = parentsUntil(e.target, 'e-rowcell');
                    this.selectLikeExcel(e, rowIndex, parseInt(td.getAttribute('aria-colindex'), 10));
                }
            }
        }
    };
    Selection.prototype.selectLikeExcel = function (e, rowIndex, cellIndex) {
        if (!this.isAutoFillSel) {
            this.clearCellSelection();
            this.selectCellsByRange({ rowIndex: this.startDIndex, cellIndex: this.startDCellIndex }, { rowIndex: rowIndex, cellIndex: cellIndex });
            this.drawBorders();
        }
        else { //Autofill
            this.showAFBorders();
            this.selectLikeAutoFill(e);
        }
    };
    Selection.prototype.drawBorders = function () {
        if (this.selectionSettings.cellSelectionMode === 'BoxWithBorder' && this.selectedRowCellIndexes.length && !this.parent.isEdit) {
            this.parent.element.classList.add('e-enabledboxbdr');
            if (!this.bdrElement) {
                this.createBorders();
            }
            this.positionBorders();
        }
        else {
            this.showHideBorders('none');
        }
    };
    Selection.prototype.isLastCell = function (cell) {
        var cells = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[cells.length - 1] === cell;
    };
    Selection.prototype.isLastRow = function (cell) {
        var rows = [].slice.call(closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[rows.length - 1];
    };
    Selection.prototype.isFirstRow = function (cell) {
        var rows = [].slice.call(closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[0];
    };
    Selection.prototype.isFirstCell = function (cell) {
        var cells = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[0] === cell;
    };
    Selection.prototype.setBorders = function (parentEle, border, bdrStr) {
        var cells = [].slice.call(parentEle.querySelectorAll('.e-cellselectionbackground')).
            filter(function (ele) { return ele.style.display === ''; });
        if (cells.length) {
            var isFrozen = this.parent.isFrozenGrid();
            var start = cells[0];
            var end = cells[cells.length - 1];
            var stOff = start.getBoundingClientRect();
            var endOff = end.getBoundingClientRect();
            var parentOff = start.offsetParent.getBoundingClientRect();
            var rowHeight = this.isLastRow(end) && (bdrStr === '1' || bdrStr === '2' || bdrStr === '5') ? 2 : 0;
            var topOffSet = this.parent.frozenRows && (bdrStr === '1' || bdrStr === '2') &&
                this.isFirstRow(start) ? 1.5 : 0;
            var leftOffset = isFrozen && (bdrStr === '2' || bdrStr === '4') && this.isFirstCell(start) ? 1 : 0;
            var rightOffset = ((this.parent.getFrozenMode() === 'Right' && (bdrStr === '1' || bdrStr === '3'))
                || (this.parent.getFrozenMode() === 'Left-Right' && (bdrStr === '5' || bdrStr === '6')))
                && this.isFirstCell(start) ? 1 : 0;
            if (this.parent.enableRtl) {
                border.style.right = parentOff.right - stOff.right - leftOffset + 'px';
                border.style.width = stOff.right - endOff.left + leftOffset + 1 + 'px';
            }
            else {
                border.style.left = stOff.left - parentOff.left - leftOffset - rightOffset + 'px';
                border.style.width = endOff.right - stOff.left + leftOffset - rightOffset + 1 + 'px';
            }
            border.style.top = stOff.top - parentOff.top - topOffSet + 'px';
            border.style.height = endOff.top - stOff.top > 0 ?
                (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) - rowHeight + topOffSet + 'px' :
                endOff.height + topOffSet - rowHeight + 1 + 'px';
            this.selectDirection += bdrStr;
        }
        else {
            border.style.display = 'none';
        }
    };
    Selection.prototype.positionBorders = function () {
        this.updateStartEndCells();
        if (!this.startCell || !this.bdrElement || !this.selectedRowCellIndexes.length) {
            return;
        }
        this.selectDirection = '';
        this.showHideBorders('');
        this.setBorders(this.parent.getContentTable(), this.bdrElement, '1');
        if (this.parent.isFrozenGrid()) {
            this.setBorders(this.parent.contentModule.getMovableContent(), this.mcBdrElement, '2');
            if (this.parent.getFrozenMode() === 'Left-Right') {
                this.setBorders(this.parent.contentModule.getFrozenRightContent(), this.frcBdrElement, '5');
            }
        }
        if (this.parent.frozenRows) {
            this.setBorders(this.parent.getHeaderTable(), this.fhBdrElement, '3');
            if (this.parent.isFrozenGrid()) {
                this.setBorders(this.parent.headerModule.getMovableHeader(), this.mhBdrElement, '4');
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.setBorders(this.parent.headerModule.getFrozenRightHeader(), this.frhBdrElement, '6');
                }
            }
        }
        this.applyBorders(this.selectDirection);
    };
    Selection.prototype.applyBothFrozenBorders = function (str) {
        var rtl = this.parent.enableRtl;
        switch (str.length) {
            case 6:
                {
                    this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                    this.mcBdrElement.style.borderWidth = '0 0 2px 0';
                    this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                    this.mhBdrElement.style.borderWidth = '2px 0 0 0';
                    this.frcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                    this.frhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                }
                break;
            case 4:
                {
                    if (str.includes('1') && str.includes('2') && str.includes('3') && str.includes('4')) {
                        this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                        this.mcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                    }
                    if (str.includes('2') && str.includes('4') && str.includes('5') && str.includes('6')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        this.frcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                        this.frhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                    }
                }
                break;
            case 3:
                {
                    this.bdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                    this.mcBdrElement.style.borderWidth = '2p 0 2px 0';
                    this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.mhBdrElement.style.borderWidth = '2px 0 2px 0';
                        this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                    }
                }
                break;
            case 2:
                {
                    if (str.includes('1')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        if (this.parent.frozenRows) {
                            this.fhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('2')) {
                        this.bdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        if (this.parent.frozenRows) {
                            this.mhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('3')) {
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        this.bdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                    if (str.includes('4')) {
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frhBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        this.mcBdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                    if (str.includes('5')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        if (this.parent.frozenRows) {
                            this.frhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('6')) {
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frcBdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                }
                break;
            default:
                this.bdrElement.style.borderWidth = '2px';
                this.mcBdrElement.style.borderWidth = '2px';
                this.frcBdrElement.style.borderWidth = '2px';
                if (this.parent.frozenRows) {
                    this.fhBdrElement.style.borderWidth = '2px';
                    this.mhBdrElement.style.borderWidth = '2px';
                    this.frhBdrElement.style.borderWidth = '2px';
                }
                break;
        }
    };
    Selection.prototype.applyBorders = function (str) {
        var rtl = this.parent.enableRtl;
        if (this.parent.getFrozenMode() === 'Left-Right') {
            this.applyBothFrozenBorders(str);
        }
        else {
            switch (str.length) {
                case 4:
                    {
                        if (this.parent.getFrozenMode() === 'Right') {
                            this.bdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                            this.mcBdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                            this.fhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                            this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        }
                        else {
                            this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                            this.mcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                            this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                            this.mhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                        }
                    }
                    break;
                case 2:
                    {
                        if (this.parent.getFrozenMode() === 'Right') {
                            this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? '2px 0 2px 2px'
                                : '2px 2px 2px 0' : '0 2px 2px 2px';
                            this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? '2px 2px 2px 0'
                                : '2px 0 2px 2px' : '0 2px 2px 2px';
                            if (this.parent.frozenRows) {
                                this.fhBdrElement.style.borderWidth = str.includes('1') ? '2px 2px 0 2px'
                                    : rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                                this.mhBdrElement.style.borderWidth = str.includes('2') ? '2px 2px 0 2px'
                                    : rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                            }
                        }
                        else {
                            this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? '2px 2px 2px 0'
                                : '2px 0 2px 2px' : '0 2px 2px 2px';
                            if (this.parent.isFrozenGrid()) {
                                this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? '2px 0 2px 2px'
                                    : '2px 2px 2px 0' : '0 2px 2px 2px';
                            }
                            if (this.parent.frozenRows) {
                                this.fhBdrElement.style.borderWidth = str.includes('1') ? '2px 2px 0 2px'
                                    : rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                                if (this.parent.isFrozenGrid()) {
                                    this.mhBdrElement.style.borderWidth = str.includes('2') ? '2px 2px 0 2px'
                                        : rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                                }
                            }
                        }
                    }
                    break;
                default:
                    this.bdrElement.style.borderWidth = '2px';
                    if (this.parent.isFrozenGrid()) {
                        this.mcBdrElement.style.borderWidth = '2px';
                    }
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = '2px';
                        if (this.parent.isFrozenGrid()) {
                            this.mhBdrElement.style.borderWidth = '2px';
                        }
                    }
                    break;
            }
        }
    };
    Selection.prototype.createBorders = function () {
        if (!this.bdrElement) {
            this.bdrElement = this.parent.getContentTable().parentElement.appendChild(createElement('div', {
                className: 'e-xlsel', id: this.parent.element.id + '_bdr',
                styles: 'width: 2px; border-width: 0;'
            }));
            if (this.parent.isFrozenGrid()) {
                this.mcBdrElement = this.parent.contentModule.getMovableContent().appendChild(createElement('div', {
                    className: 'e-xlsel', id: this.parent.element.id + '_mcbdr',
                    styles: 'height: 2px; border-width: 0;'
                }));
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frcBdrElement = this.parent.contentModule.getFrozenRightContent().appendChild(createElement('div', {
                        className: 'e-xlsel', id: this.parent.element.id + '_frcbdr',
                        styles: 'height: 2px; border-width: 0;'
                    }));
                }
            }
            if (this.parent.frozenRows) {
                this.fhBdrElement = this.parent.getHeaderTable().parentElement.appendChild(createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_fhbdr', styles: 'height: 2px;' }));
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                this.mhBdrElement = this.parent.headerModule.getMovableHeader().appendChild(createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_mhbdr', styles: 'height: 2px;' }));
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frhBdrElement = this.parent.headerModule.getFrozenRightHeader().appendChild(createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_frhbdr', styles: 'height: 2px;' }));
                }
            }
        }
    };
    Selection.prototype.showHideBorders = function (display) {
        if (this.bdrElement) {
            this.bdrElement.style.display = display;
            if (this.parent.isFrozenGrid()) {
                this.mcBdrElement.style.display = display;
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frcBdrElement.style.display = display;
                }
            }
            if (this.parent.frozenRows) {
                this.fhBdrElement.style.display = display;
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                this.mhBdrElement.style.display = display;
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frhBdrElement.style.display = display;
                }
            }
        }
    };
    Selection.prototype.drawAFBorders = function () {
        if (!this.bdrAFBottom) {
            this.createAFBorders();
        }
        this.positionAFBorders();
    };
    Selection.prototype.positionAFBorders = function () {
        if (!this.startCell || !this.bdrAFLeft) {
            return;
        }
        var stOff = this.startAFCell.getBoundingClientRect();
        var endOff = this.endAFCell.getBoundingClientRect();
        var top = endOff.top - stOff.top > 0 ? 1 : 0;
        var firstCellTop = endOff.top - stOff.top >= 0 && (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-frozencontent')) && this.isFirstRow(this.startAFCell) ? 1.5 : 0;
        var firstCellLeft = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-movableheader')) && this.isFirstCell(this.startAFCell) ? 1 : 0;
        var rowHeight = this.isLastRow(this.endAFCell) && (parentsUntil(this.endAFCell, 'e-movablecontent') ||
            parentsUntil(this.endAFCell, 'e-frozencontent')) ? 2 : 0;
        var parentOff = this.startAFCell.offsetParent.getBoundingClientRect();
        var parentRect = this.parent.element.getBoundingClientRect();
        var sTop = this.startAFCell.offsetParent.parentElement.scrollTop;
        var sLeft = this.startAFCell.offsetParent.parentElement.scrollLeft;
        var scrollTop = sTop - this.startAFCell.offsetTop;
        var scrollLeft = sLeft - this.startAFCell.offsetLeft;
        var totalHeight = this.parent.element.clientHeight;
        var totalWidth = this.parent.element.clientWidth;
        scrollTop = scrollTop > 0 ? Math.floor(scrollTop) - 1 : 0;
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        var left = stOff.left - parentRect.left;
        if (!this.parent.enableRtl) {
            this.bdrAFLeft.style.left = left - firstCellLeft + scrollLeft - 1 + 'px';
            this.bdrAFRight.style.left = endOff.left - parentRect.left - 2 + endOff.width + 'px';
            this.bdrAFRight.style.width = totalWidth <= parseInt(this.bdrAFRight.style.left, 10) ? '0px' : '2px';
            this.bdrAFTop.style.left = left + scrollLeft - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFRight.style.left, 10) - parseInt(this.bdrAFLeft.style.left, 10)
                - firstCellLeft + 1 + 'px';
            if (totalWidth <= (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10))) {
                var leftRemove = (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10)) - totalWidth;
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) - leftRemove + 'px';
            }
        }
        else {
            var scrolloffSet = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
                parentsUntil(this.startAFCell, 'e-movableheader')) ? stOff.right -
                this.startAFCell.offsetParent.parentElement.getBoundingClientRect().width -
                parentRect.left : 0;
            this.bdrAFLeft.style.right = parentRect.right - endOff.right - 2 + endOff.width + 'px';
            this.bdrAFLeft.style.width = totalWidth <= parseInt(this.bdrAFLeft.style.right, 10) ? '0px' : '2px';
            this.bdrAFRight.style.right = parentRect.right - stOff.right - firstCellLeft + scrolloffSet - 1 + 'px';
            this.bdrAFTop.style.left = endOff.left - parentRect.left - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFLeft.style.right, 10) - parseInt(this.bdrAFRight.style.right, 10)
                - firstCellLeft + 1 + 'px';
            if (parseInt(this.bdrAFTop.style.left, 10) < 0) {
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10) + 'px';
                this.bdrAFTop.style.left = '0px';
            }
        }
        this.bdrAFLeft.style.top = stOff.top - parentRect.top - firstCellTop + scrollTop + 'px';
        this.bdrAFLeft.style.height = endOff.top - stOff.top > 0 ?
            (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + firstCellTop - rowHeight - scrollTop + 'px' :
            endOff.height + firstCellTop - rowHeight - scrollTop + 'px';
        this.bdrAFRight.style.top = this.bdrAFLeft.style.top;
        this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';
        this.bdrAFTop.style.top = this.bdrAFRight.style.top;
        this.bdrAFBottom.style.left = this.bdrAFTop.style.left;
        this.bdrAFBottom.style.top = parseFloat(this.bdrAFLeft.style.top) + parseFloat(this.bdrAFLeft.style.height) - top - 1 + 'px';
        this.bdrAFBottom.style.width = totalHeight <= parseFloat(this.bdrAFBottom.style.top) ? '0px' : this.bdrAFTop.style.width;
        if (totalHeight <= (parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10))) {
            var topRemove = parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10) - totalHeight;
            this.bdrAFLeft.style.height = parseInt(this.bdrAFLeft.style.height, 10) - topRemove + 'px';
            this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';
        }
    };
    Selection.prototype.createAFBorders = function () {
        if (!this.bdrAFLeft) {
            this.bdrAFLeft = this.parent.element.appendChild(createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafleft', styles: 'width: 2px;' }));
            this.bdrAFRight = this.parent.element.appendChild(createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafright', styles: 'width: 2px;' }));
            this.bdrAFBottom = this.parent.element.appendChild(createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafbottom', styles: 'height: 2px;' }));
            this.bdrAFTop = this.parent.element.appendChild(createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdraftop', styles: 'height: 2px;' }));
        }
    };
    Selection.prototype.showAFBorders = function () {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = '';
            this.bdrAFRight.style.display = '';
            this.bdrAFBottom.style.display = '';
            this.bdrAFTop.style.display = '';
        }
    };
    Selection.prototype.hideAFBorders = function () {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = 'none';
            this.bdrAFRight.style.display = 'none';
            this.bdrAFBottom.style.display = 'none';
            this.bdrAFTop.style.display = 'none';
        }
    };
    Selection.prototype.updateValue = function (rIdx, cIdx, cell) {
        var args = this.createBeforeAutoFill(rIdx, cIdx, cell);
        if (!args.cancel) {
            var col = this.parent.getColumnByIndex(cIdx);
            if (this.parent.editModule && cell) {
                if (col.type === 'number') {
                    this.parent.editModule.updateCell(rIdx, col.field, parseInt(args.value, 10));
                }
                else {
                    this.parent.editModule.updateCell(rIdx, col.field, args.value);
                }
            }
        }
    };
    Selection.prototype.createBeforeAutoFill = function (rowIndex, colIndex, cell) {
        var col = this.parent.getColumnByIndex(colIndex);
        var args = {
            column: col,
            value: cell.innerText
        };
        this.parent.trigger(events.beforeAutoFill, args);
        return args;
    };
    Selection.prototype.getAutoFillCells = function (rowIndex, startCellIdx) {
        var cls = '.e-cellselectionbackground';
        var cells = [].slice.call(this.parent.getDataRows()[rowIndex].querySelectorAll(cls));
        if (this.parent.isFrozenGrid()) {
            cells = cells.concat([].slice.call(this.parent.getMovableDataRows()[rowIndex].querySelectorAll(cls)));
            if (this.parent.getFrozenMode() === 'Left-Right') {
                cells = cells.concat([].slice.call(this.parent.getFrozenRightDataRows()[rowIndex].querySelectorAll(cls)));
            }
        }
        return cells;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Selection.prototype.selectLikeAutoFill = function (e, isApply) {
        var startrowIdx = parseInt(parentsUntil(this.startAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
        var startCellIdx = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10);
        var endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
        var endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
        var rowLen = this.selectedRowCellIndexes.length - 1;
        var colLen = this.selectedRowCellIndexes[0].cellIndexes.length - 1;
        var col;
        switch (true) { //direction         
            case !isApply && this.endAFCell.classList.contains('e-cellselectionbackground') &&
                !!parentsUntil(e.target, 'e-rowcell'):
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, startCellIdx);
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, startCellIdx + colLen);
                this.drawAFBorders();
                break;
            case this.autoFillRLselection && startCellIdx + colLen < endCellIdx && //right
                endCellIdx - startCellIdx - colLen + 1 > endrowIdx - startrowIdx - rowLen // right bottom
                && endCellIdx - startCellIdx - colLen + 1 > startrowIdx - endrowIdx: //right top
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, endCellIdx);
                endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
                endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var cellIdx = parseInt(this.endCell.getAttribute('aria-colindex'), 10);
                    for (var i = startrowIdx; i <= endrowIdx; i++) {
                        var cells = this.getAutoFillCells(i, startCellIdx);
                        var c = 0;
                        for (var j = cellIdx + 1; j <= endCellIdx; j++) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: startrowIdx, cellIndex: this.startCellIndex }, { rowIndex: endrowIdx, cellIndex: endCellIdx });
                }
                break;
            case this.autoFillRLselection && startCellIdx > endCellIdx && // left
                startCellIdx - endCellIdx + 1 > endrowIdx - startrowIdx - rowLen && //left top
                startCellIdx - endCellIdx + 1 > startrowIdx - endrowIdx: // left bottom
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, endCellIdx);
                this.endAFCell = this.endCell;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    for (var i = startrowIdx; i <= startrowIdx + rowLen; i++) {
                        var cells = this.getAutoFillCells(i, startCellIdx);
                        cells.reverse();
                        var c = 0;
                        for (var j = this.startCellIndex - 1; j >= endCellIdx; j--) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: startrowIdx, cellIndex: endCellIdx }, { rowIndex: startrowIdx + rowLen, cellIndex: this.startCellIndex + colLen });
                }
                break;
            case startrowIdx > endrowIdx: //up
                this.startAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx);
                this.endAFCell = this.endCell;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var trIdx = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
                    var r = trIdx;
                    for (var i = startrowIdx - 1; i >= endrowIdx; i--) {
                        if (r === this.startIndex - 1) {
                            r = trIdx;
                        }
                        var cells = this.getAutoFillCells(r, startCellIdx);
                        var c = 0;
                        r--;
                        for (var j = this.startCellIndex; j <= this.startCellIndex + colLen; j++) {
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: endrowIdx, cellIndex: startCellIdx + colLen }, { rowIndex: startrowIdx + rowLen, cellIndex: startCellIdx });
                }
                break;
            default: //down
                this.endAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx + colLen);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var trIdx = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
                    var r = this.startIndex;
                    for (var i = trIdx + 1; i <= endrowIdx; i++) {
                        if (r === trIdx + 1) {
                            r = this.startIndex;
                        }
                        var cells = this.getAutoFillCells(r, startCellIdx);
                        r++;
                        var c = 0;
                        for (var m = this.startCellIndex; m <= this.startCellIndex + colLen; m++) {
                            this.updateValue(i, m, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: trIdx - rowLen, cellIndex: startCellIdx }, { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen });
                }
                break;
        }
    };
    Selection.prototype.mouseUpHandler = function (e) {
        document.body.classList.remove('e-disableuserselect');
        if (this.element) {
            remove(this.element);
        }
        if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
            this.mUPTarget = parentsUntil(e.target, 'e-rowcell');
        }
        else {
            this.mUPTarget = null;
        }
        if (this.isDragged && !this.isAutoFillSel && this.selectionSettings.mode === 'Cell') {
            var target = e.target;
            var rowIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
            var cellIndex = parseInt(target.getAttribute('aria-colindex'), 10);
            this.isDragged = false;
            this.clearCellSelection();
            this.selectCellsByRange({ rowIndex: this.startDIndex, cellIndex: this.startDCellIndex }, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isDragged = false;
        this.updateAutoFillPosition();
        if (this.isAutoFillSel) {
            var lastCell = parentsUntil(e.target, 'e-rowcell');
            this.endAFCell = lastCell ? lastCell : this.endCell === this.endAFCell ? this.startAFCell : this.endAFCell;
            this.startAFCell = this.startCell;
            this.updateStartCellsIndex();
            this.selectLikeAutoFill(e, true);
            this.updateAutoFillPosition();
            this.hideAFBorders();
            this.positionBorders();
            this.isAutoFillSel = false;
        }
        EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        if (this.parent.frozenRows) {
            EventHandler.remove(this.parent.getHeaderContent(), 'mousemove', this.mouseMoveHandler);
        }
        EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
    };
    Selection.prototype.hideAutoFill = function () {
        if (this.autofill) {
            this.autofill.style.display = 'none';
        }
    };
    /**
     * @hidden
     */
    Selection.prototype.updateAutoFillPosition = function () {
        if (this.parent.enableAutoFill && !this.parent.isEdit &&
            this.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()
            && this.selectedRowCellIndexes.length) {
            var index = parseInt(this.target.getAttribute('aria-colindex'), 10);
            var rindex = parseInt(this.target.getAttribute('index'), 10);
            var rowIndex = this.selectedRowCellIndexes[this.selectedRowCellIndexes.length - 1].rowIndex;
            var cells = this.getAutoFillCells(rowIndex, index).filter(function (ele) { return ele.style.display === ''; });
            var col = this.parent.getColumnByIndex(index);
            var isFrozenCol = col.getFreezeTableName() === 'movable';
            var isFrozenRow = rindex < this.parent.frozenRows;
            var isFrozenRight = this.parent.getFrozenMode() === 'Left-Right' && col.getFreezeTableName() === 'frozen-right';
            if (!select('#' + this.parent.element.id + '_autofill', parentsUntil(this.target, 'e-table'))) {
                if (select('#' + this.parent.element.id + '_autofill', this.parent.element)) {
                    select('#' + this.parent.element.id + '_autofill', this.parent.element).remove();
                }
                this.autofill = createElement('div', { className: 'e-autofill', id: this.parent.element.id + '_autofill' });
                this.autofill.style.display = 'none';
                !isFrozenRow ? !isFrozenCol ? this.parent.getContentTable().parentElement.appendChild(this.autofill) :
                    this.parent.contentModule.getMovableContent().appendChild(this.autofill) :
                    !isFrozenCol ? this.parent.getHeaderTable().parentElement.appendChild(this.autofill) :
                        this.parent.headerModule.getMovableHeader().appendChild(this.autofill);
                if (isFrozenRight) {
                    isFrozenRow ? this.parent.getFrozenRightHeader().appendChild(this.autofill)
                        : this.parent.getFrozenRightContent().appendChild(this.autofill);
                }
            }
            var cell = cells[cells.length - 1];
            if (cell && cell.offsetParent) {
                var clientRect = cell.getBoundingClientRect();
                var parentOff = cell.offsetParent.getBoundingClientRect();
                var colWidth = this.isLastCell(cell) ? 4 : 0;
                var rowHeight = this.isLastRow(cell) ? 3 : 0;
                if (!this.parent.enableRtl) {
                    this.autofill.style.left = clientRect.left - parentOff.left + clientRect.width - 4 - colWidth + 'px';
                }
                else {
                    this.autofill.style.right = parentOff.right - clientRect.right + clientRect.width - 4 - colWidth + 'px';
                }
                this.autofill.style.top = clientRect.top - parentOff.top + clientRect.height - 5 - rowHeight + 'px';
            }
            this.autofill.style.display = '';
        }
        else {
            this.hideAutoFill();
        }
    };
    Selection.prototype.mouseDownHandler = function (e) {
        this.mouseButton = e.button;
        var target = e.target;
        var gObj = this.parent;
        var isDrag;
        var gridElement = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== gObj.element.id || parentsUntil(target, 'e-headercontent') && !this.parent.frozenRows ||
            parentsUntil(target, 'e-editedbatchcell') || parentsUntil(target, 'e-editedrow')) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (parentsUntil(target, 'e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            if (gObj.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
                this.isCellDrag = true;
                isDrag = true;
            }
            else if (gObj.allowRowDragAndDrop && !gObj.isEdit) {
                if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                isDrag = true;
                this.element = this.parent.createElement('div', { className: 'e-griddragarea' });
                gObj.getContent().appendChild(this.element);
            }
            if (isDrag) {
                this.enableDrag(e, true);
            }
        }
        this.updateStartEndCells();
        if (target.classList.contains('e-autofill') || target.classList.contains('e-xlsel')) {
            this.isCellDrag = true;
            this.isAutoFillSel = true;
            this.enableDrag(e);
        }
    };
    Selection.prototype.updateStartEndCells = function () {
        var cells = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        this.startCell = cells[0];
        this.endCell = cells[cells.length - 1];
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
            this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
    };
    Selection.prototype.updateStartCellsIndex = function () {
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
            this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
    };
    Selection.prototype.enableDrag = function (e, isUpdate) {
        var gObj = this.parent;
        if (isUpdate) {
            var tr = closest(e.target, 'tr');
            this.startDIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
            this.startDCellIndex = parseInt(parentsUntil(e.target, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
        document.body.classList.add('e-disableuserselect');
        var gBRect = gObj.element.getBoundingClientRect();
        var postion = getPosition(e);
        this.x = postion.x - gBRect.left;
        this.y = postion.y - gBRect.top;
        EventHandler.add(gObj.getContent(), 'mousemove', this.mouseMoveHandler, this);
        if (this.parent.frozenRows) {
            EventHandler.add(gObj.getHeaderContent(), 'mousemove', this.mouseMoveHandler, this);
        }
        EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
    };
    Selection.prototype.clearSelAfterRefresh = function (e) {
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfiniteScroll) {
            this.clearSelection();
        }
    };
    /**
     * @hidden
     */
    Selection.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.initialEnd, this.initializeSelection, this);
        this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.cellFocused, this.onCellFocused, this);
        this.parent.on(events.beforeFragAppend, this.clearSelAfterRefresh, this);
        this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.on(events.rowsRemoved, this.rowsRemoved, this);
        this.parent.on(events.headerRefreshed, this.refreshHeader, this);
        this.addEventListener_checkbox();
    };
    /**
     * @hidden
     */
    Selection.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.initialEnd, this.initializeSelection);
        this.parent.off(events.rowSelectionComplete, this.onActionComplete);
        this.parent.off(events.cellSelectionComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.cellFocused, this.onCellFocused);
        this.parent.off(events.beforeFragAppend, this.clearSelAfterRefresh);
        this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.off(events.rowsRemoved, this.rowsRemoved);
        this.parent.off(events.headerRefreshed, this.refreshHeader);
        this.removeEventListener_checkbox();
    };
    Selection.prototype.wireEvents = function () {
        this.isMacOS = navigator.userAgent.indexOf('Mac OS') !== -1;
        if (this.isMacOS) {
            EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
            EventHandler.add(this.parent.element, 'keyup', this.keyUpHandler, this);
        }
    };
    Selection.prototype.unWireEvents = function () {
        if (this.isMacOS) {
            EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
            EventHandler.remove(this.parent.element, 'keyup', this.keyUpHandler);
        }
    };
    Selection.prototype.columnPositionChanged = function () {
        if (!this.parent.isPersistSelection) {
            this.clearSelection();
        }
    };
    Selection.prototype.refreshHeader = function () {
        this.setCheckAllState();
    };
    Selection.prototype.rowsRemoved = function (e) {
        for (var i = 0; i < e.records.length; i++) {
            delete (this.selectedRowState[e.records[i][this.primaryKey]]);
            --this.totalRecordsCount;
        }
        this.setCheckAllState();
    };
    ;
    Selection.prototype.beforeFragAppend = function (e) {
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
            this.clearSelection();
        }
    };
    ;
    Selection.prototype.getCheckAllBox = function () {
        return this.parent.getHeaderContent().querySelector('.e-checkselectall');
    };
    Selection.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.initPerisistSelection();
        }
    };
    Selection.prototype.render = function (e) {
        EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler, this);
    };
    Selection.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        var gObj = this.parent;
        if (!isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'Single') {
            if (this.selectedRowCellIndexes.length > 1) {
                this.clearCellSelection();
                this.prevCIdxs = undefined;
            }
            if (this.selectedRowIndexes.length > 1) {
                this.clearRowSelection();
                this.prevRowIndex = undefined;
            }
            if (this.selectedColumnsIndexes.length > 1) {
                this.clearColumnSelection();
                this.prevColIndex = undefined;
            }
            this.enableSelectMultiTouch = false;
            this.hidePopUp();
        }
        if (!isNullOrUndefined(e.properties.mode) ||
            !isNullOrUndefined(e.properties.cellSelectionMode)) {
            this.clearSelection();
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevColIndex = undefined;
        }
        this.isPersisted = true;
        this.checkBoxSelectionChanged();
        this.isPersisted = false;
        this.initPerisistSelection();
        var checkboxColumn = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        if (checkboxColumn.length) {
            gObj.isCheckBoxSelection = !(this.selectionSettings.checkboxMode === 'ResetOnRowClick');
        }
        this.drawBorders();
    };
    Selection.prototype.hidePopUp = function () {
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.initialEnd = function (e) {
        var isFrozen = this.parent.isFrozenGrid();
        var isLeftRightFrozen = this.parent.getFrozenMode() === 'Left-Right';
        if (!isFrozen || (isFrozen && (!isLeftRightFrozen && !e.args.isFrozen)
            || (isLeftRightFrozen && e.args.renderFrozenRightContent))) {
            this.parent.off(events.contentReady, this.initialEnd);
            this.selectRow(this.parent.selectedRowIndex);
        }
    };
    Selection.prototype.checkBoxSelectionChanged = function () {
        this.parent.off(events.contentReady, this.checkBoxSelectionChanged);
        var gobj = this.parent;
        var checkboxColumn = gobj.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        if (checkboxColumn.length > 0) {
            gobj.isCheckBoxSelection = true;
            this.chkField = checkboxColumn[0].field;
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
            if (isNullOrUndefined(this.totalRecordsCount)) {
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            if (this.isSingleSel()) {
                gobj.selectionSettings.type = 'Multiple';
                gobj.dataBind();
            }
            else {
                this.initPerisistSelection();
            }
        }
        if (!gobj.isCheckBoxSelection && !this.isPersisted) {
            this.chkField = null;
            this.initPerisistSelection();
        }
    };
    Selection.prototype.initPerisistSelection = function () {
        var gobj = this.parent;
        if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = true;
            this.ensureCheckboxFieldSelection();
        }
        else if (this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = false;
            this.ensureCheckboxFieldSelection();
        }
        else {
            gobj.isPersistSelection = false;
            this.selectedRowState = {};
        }
    };
    Selection.prototype.ensureCheckboxFieldSelection = function () {
        var gobj = this.parent;
        this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
        if (!gobj.enableVirtualization && this.chkField
            && ((gobj.isPersistSelection && Object.keys(this.selectedRowState).length === 0) ||
                !gobj.isPersistSelection)) {
            var data = this.parent.getDataModule();
            var query = new Query().where(this.chkField, 'equal', true);
            if (!query.params) {
                query.params = this.parent.query.params;
            }
            var dataManager = data.getData({}, query);
            var proxy_1 = this;
            this.parent.showSpinner();
            dataManager.then(function (e) {
                proxy_1.dataSuccess(e.result);
                proxy_1.refreshPersistSelection();
                proxy_1.parent.hideSpinner();
            });
        }
    };
    Selection.prototype.dataSuccess = function (res) {
        for (var i = 0; i < res.length; i++) {
            if (isNullOrUndefined(this.selectedRowState[res[i][this.primaryKey]]) && res[i][this.chkField]) {
                this.selectedRowState[res[i][this.primaryKey]] = res[i][this.chkField];
            }
        }
        this.persistSelectedData = res;
    };
    Selection.prototype.setRowSelection = function (state) {
        if (!this.parent.getDataModule().isRemote() && !isBlazor()) {
            if (state) {
                if (this.parent.groupSettings.columns.length) {
                    for (var _i = 0, _a = this.getData().records; _i < _a.length; _i++) {
                        var data = _a[_i];
                        this.selectedRowState[data[this.primaryKey]] = true;
                    }
                }
                else {
                    for (var _b = 0, _c = this.getData(); _b < _c.length; _b++) {
                        var data = _c[_b];
                        this.selectedRowState[data[this.primaryKey]] = true;
                    }
                }
            }
            else {
                this.selectedRowState = {};
            }
            // (this.getData()).forEach(function (data) {
            //     this.selectedRowState[data[this.primaryKey]] = true;
            // })
        }
    };
    Selection.prototype.getData = function () {
        return this.parent.getDataModule().dataManager.executeLocal(this.parent.getDataModule().generateQuery(true));
    };
    Selection.prototype.refreshPersistSelection = function () {
        var rows = this.parent.getRows();
        this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        if (rows !== null && rows.length > 0 && (this.parent.isPersistSelection || this.chkField)) {
            var indexes = [];
            for (var j = 0; j < rows.length; j++) {
                var rowObj = this.getRowObj(rows[j]);
                var pKey = rowObj ? rowObj.data ? rowObj.data[this.primaryKey] : null : null;
                if (pKey === null) {
                    return;
                }
                var checkState = void 0;
                var chkBox = rows[j].querySelector('.e-checkselect');
                if (this.selectedRowState[pKey] || (this.parent.checkAllRows === 'Check' &&
                    this.totalRecordsCount === Object.keys(this.selectedRowState).length && this.chkAllCollec.indexOf(pKey) < 0)
                    || (this.parent.checkAllRows === 'Uncheck' && this.chkAllCollec.indexOf(pKey) > 0)
                    || (this.parent.checkAllRows === 'Intermediate' && !isNullOrUndefined(this.chkField) && rowObj.data[this.chkField])) {
                    indexes.push(parseInt(rows[j].getAttribute('aria-rowindex'), 10));
                    checkState = true;
                }
                else {
                    checkState = false;
                    if (this.checkedTarget !== chkBox && this.parent.isCheckBoxSelection) {
                        removeAddCboxClasses(chkBox.nextElementSibling, checkState);
                    }
                }
                this.updatePersistCollection(rows[j], checkState);
            }
            this.isSingleSel() && indexes.length > 0 ? this.selectRow(indexes[0], true) : this.selectRows(indexes);
        }
        if (this.parent.isCheckBoxSelection && this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
        }
    };
    Selection.prototype.actionBegin = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            var editChkBox = this.parent.element.querySelector('.e-edit-checkselect');
            if (!isNullOrUndefined(editChkBox)) {
                var row = closest(editChkBox, '.e-editedrow');
                if (row) {
                    if (this.parent.editSettings.mode === 'Dialog') {
                        row = this.parent.element.querySelector('.e-dlgeditrow');
                    }
                    var rowObj = this.getRowObj(row);
                    if (!rowObj) {
                        return;
                    }
                    this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = editChkBox.checked;
                }
                else {
                    this.isCheckedOnAdd = editChkBox.checked;
                }
            }
        }
    };
    Selection.prototype.actionComplete = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            if (e.action === 'add' && this.isCheckedOnAdd) {
                var rowObj = this.parent.getRowObjectFromUID(this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
                this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = this.isCheckedOnAdd;
            }
            this.refreshPersistSelection();
        }
        if (e.requestType === 'delete' && this.parent.isPersistSelection) {
            var records = [];
            if (!isBlazor()) {
                records = e.data;
            }
            else {
                records = this.getSelectedRecords();
            }
            var data = records.slice();
            for (var i = 0; i < data.length; i++) {
                if (!isNullOrUndefined(data[i][this.primaryKey])) {
                    this.updatePersistDelete(data[i][this.primaryKey]);
                }
            }
            this.setCheckAllState();
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        if (e.requestType === 'paging') {
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevECIdxs = undefined;
        }
    };
    Selection.prototype.onDataBound = function () {
        if (!this.parent.enableVirtualization && this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
        if (this.parent.enableVirtualization) {
            this.setCheckAllState();
        }
        if (this.parent.isCheckBoxSelection && !this.initialRowSelection) {
            var totalRecords = this.parent.getRowsObject();
            var indexes = [];
            for (var i = 0; i < totalRecords.length; i++) {
                if (totalRecords[i].isSelected) {
                    indexes.push(i);
                }
            }
            if (indexes.length) {
                this.selectRows(indexes);
            }
            this.initialRowSelection = true;
        }
    };
    Selection.prototype.updatePersistSelectedData = function (checkState) {
        if (this.parent.isPersistSelection) {
            var rows = this.parent.getRows();
            for (var i = 0; i < rows.length; i++) {
                this.updatePersistCollection(rows[i], checkState);
            }
            if (this.parent.checkAllRows === 'Uncheck') {
                this.setRowSelection(false);
                this.persistSelectedData = this.parent.getDataModule().isRemote() ? this.persistSelectedData : [];
            }
            else if (this.parent.checkAllRows === 'Check') {
                this.setRowSelection(true);
                this.persistSelectedData = (!this.parent.getDataModule().isRemote() && !isBlazor()) ?
                    this.parent.groupSettings.columns.length ? this.getData().records.slice() :
                        this.getData().slice() : this.persistSelectedData;
            }
        }
    };
    Selection.prototype.checkSelectAllAction = function (checkState) {
        var cRenderer = this.getRenderer();
        var editForm = this.parent.element.querySelector('.e-gridform');
        this.checkedTarget = this.getCheckAllBox();
        if (checkState && this.getCurrentBatchRecordChanges().length) {
            this.parent.checkAllRows = 'Check';
            this.updatePersistSelectedData(checkState);
            if (isBlazor() && this.parent.enableVirtualization &&
                !isNullOrUndefined(this.parent.contentModule.currentInfo.endIndex)) {
                this.selectRowsByRange(this.parent.contentModule.currentInfo.startIndex, this.parent.contentModule.currentInfo.endIndex);
            }
            else {
                this.selectRowsByRange(cRenderer.getVirtualRowIndex(0), cRenderer.getVirtualRowIndex(this.getCurrentBatchRecordChanges().length - 1));
            }
        }
        else {
            this.parent.checkAllRows = 'Uncheck';
            this.updatePersistSelectedData(checkState);
            this.clearSelection();
        }
        this.chkAllCollec = [];
        if (!isNullOrUndefined(editForm)) {
            var editChkBox = editForm.querySelector('.e-edit-checkselect');
            if (!isNullOrUndefined(editChkBox)) {
                removeAddCboxClasses(editChkBox.nextElementSibling, checkState);
            }
        }
    };
    Selection.prototype.checkSelectAll = function (checkBox) {
        var _this = this;
        var stateStr = this.getCheckAllStatus(checkBox);
        var state = stateStr === 'Check';
        this.isHeaderCheckboxClicked = true;
        if (stateStr === 'Intermediate') {
            state = this.getCurrentBatchRecordChanges().some(function (data) {
                return data[_this.primaryKey] in _this.selectedRowState;
            });
        }
        if (this.parent.isPersistSelection && this.parent.allowPaging) {
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        this.checkSelectAllAction(!state);
        if (isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization) {
            var interopAdaptor = 'interopAdaptor';
            var invokeMethodAsync = 'invokeMethodAsync';
            this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', !state, 'checkbox', null);
            this.checkBoxState = !state;
            if (!state) {
                var values = 'values';
                var vgenerator = 'vgenerator';
                var rowCache = this.parent.contentModule[vgenerator].rowCache;
                Object[values](rowCache).forEach(function (x) { return x.isSelected = true; });
                for (var i = 0; i < Object.keys(rowCache).length; i++) {
                    if (this.parent.selectionModule.selectedRowIndexes.indexOf(Number(Object.keys(rowCache)[i])) === -1) {
                        this.parent.selectionModule.selectedRowIndexes.push(Number(Object.keys(rowCache)[i]));
                    }
                }
            }
        }
        this.target = null;
        if (this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
        }
        this.triggerChkChangeEvent(checkBox, !state);
    };
    Selection.prototype.getCheckAllStatus = function (ele) {
        var classes = ele ? ele.nextElementSibling.classList :
            this.getCheckAllBox().nextElementSibling.classList;
        var status;
        if (classes.contains('e-check')) {
            status = 'Check';
        }
        else if (classes.contains('e-uncheck')) {
            status = 'Uncheck';
        }
        else if (classes.contains('e-stop')) {
            status = 'Intermediate';
        }
        else {
            status = 'None';
        }
        return status;
    };
    Selection.prototype.checkSelect = function (checkBox) {
        var target = closest(this.checkedTarget, '.e-rowcell');
        var checkObj = checkBox;
        var gObj = this.parent;
        this.isMultiCtrlRequest = true;
        var rIndex = 0;
        this.isHeaderCheckboxClicked = false;
        if (isGroupAdaptive(gObj)) {
            var uid = target.parentElement.getAttribute('data-uid');
            rIndex = gObj.getRows().map(function (m) { return m.getAttribute('data-uid'); }).indexOf(uid);
        }
        else {
            rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        }
        if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0 &&
            this.parent.editSettings.newRowPosition === 'Top') {
            ++rIndex;
        }
        this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
        this.moveIntoUncheckCollection(closest(target, '.e-row'));
        this.setCheckAllState();
        this.isMultiCtrlRequest = false;
        this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'));
    };
    Selection.prototype.moveIntoUncheckCollection = function (row) {
        if (this.parent.checkAllRows === 'Check' || this.parent.checkAllRows === 'Uncheck') {
            var rowObj = this.getRowObj(row);
            var pKey = rowObj && rowObj.data ? rowObj.data[this.primaryKey] : null;
            if (!pKey) {
                return;
            }
            if (this.chkAllCollec.indexOf(pKey) < 0) {
                this.chkAllCollec.push(pKey);
            }
            else {
                this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
            }
        }
    };
    Selection.prototype.triggerChkChangeEvent = function (checkBox, checkState) {
        this.parent.trigger(events.checkBoxChange, {
            checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
            target: checkBox
        });
        if (!this.parent.isEdit) {
            this.checkedTarget = null;
        }
    };
    Selection.prototype.updateSelectedRowIndex = function (index) {
        if (this.parent.isCheckBoxSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && !this.parent.getDataModule().isRemote()
            && !(isBlazor() && this.parent.isServerRendered)) {
            if (this.parent.checkAllRows === 'Check') {
                this.selectedRowIndexes = [];
                var dataLength = this.getData().length;
                for (var data = 0; data < dataLength; data++) {
                    this.selectedRowIndexes.push(data);
                }
            }
            else if (this.parent.checkAllRows === 'Uncheck') {
                this.selectedRowIndexes = [];
            }
            else {
                if (index && this.parent.getRowByIndex(index).getAttribute('aria-selected') === 'false') {
                    var selectedVal = this.selectedRowIndexes.indexOf(index);
                    this.selectedRowIndexes.splice(selectedVal, 1);
                }
            }
        }
    };
    ;
    Selection.prototype.setCheckAllState = function (index, isInteraction) {
        if (this.parent.isCheckBoxSelection || this.parent.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            var checkToSelectAll = void 0;
            var isServerRenderedVirtualization = isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization;
            if (isServerRenderedVirtualization) {
                var values = 'values';
                var vgenerator = 'vgenerator';
                checkToSelectAll = !Object[values](this.parent.contentModule[vgenerator].rowCache).
                    filter(function (x) { return x.isSelected === undefined || x.isSelected === false; }).length &&
                    Object[values](this.parent.contentModule[vgenerator].rowCache).
                        filter(function (x) { return x.isSelected; }).length === this.selectedRowIndexes.length;
            }
            var checkedLen = Object.keys(this.selectedRowState).length;
            if (!this.parent.isPersistSelection && !(isServerRenderedVirtualization)) {
                checkedLen = this.selectedRowIndexes.length;
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            var input = this.getCheckAllBox();
            if (input) {
                var spanEle = input.nextElementSibling;
                removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
                setChecked(input, false);
                input.indeterminate = false;
                if (checkToSelectAll || checkedLen === this.totalRecordsCount && this.totalRecordsCount
                    || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                        && !this.parent.allowPaging && !this.parent.getDataModule().isRemote()
                        && !(isBlazor() && this.parent.isServerRendered)
                        && checkedLen === this.getData().length)) {
                    addClass([spanEle], ['e-check']);
                    setChecked(input, true);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, true, true);
                    }
                    this.parent.checkAllRows = 'Check';
                }
                else if (isServerRenderedVirtualization && !this.selectedRowIndexes.length ||
                    checkedLen === 0 && !isServerRenderedVirtualization || this.getCurrentBatchRecordChanges().length === 0) {
                    addClass([spanEle], ['e-uncheck']);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, false, true);
                    }
                    this.parent.checkAllRows = 'Uncheck';
                    if (checkedLen === 0 && this.getCurrentBatchRecordChanges().length === 0) {
                        addClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    }
                    else {
                        removeClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    }
                }
                else {
                    addClass([spanEle], ['e-stop']);
                    this.parent.checkAllRows = 'Intermediate';
                    input.indeterminate = true;
                }
                if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                    && !this.parent.allowPaging && !this.parent.getDataModule().isRemote()) {
                    this.updateSelectedRowIndex(index);
                }
            }
        }
    };
    Selection.prototype.keyDownHandler = function (e) {
        // Below are keyCode for command key in MAC OS. Safari/Chrome(91-Left command, 93-Right Command), Opera(17), FireFox(224)
        if ((((Browser.info.name === 'chrome') || (Browser.info.name === 'safari')) && (e.keyCode === 91 || e.keyCode === 93)) ||
            (Browser.info.name === 'opera' && e.keyCode === 17) || (Browser.info.name === 'mozilla' && e.keyCode === 224)) {
            this.cmdKeyPressed = true;
        }
    };
    Selection.prototype.keyUpHandler = function (e) {
        if ((((Browser.info.name === 'chrome') || (Browser.info.name === 'safari')) && (e.keyCode === 91 || e.keyCode === 93)) ||
            (Browser.info.name === 'opera' && e.keyCode === 17) || (Browser.info.name === 'mozilla' && e.keyCode === 224)) {
            this.cmdKeyPressed = false;
        }
    };
    Selection.prototype.clickHandler = function (e) {
        var target = e.target;
        this.actualTarget = target;
        if (parentsUntil(target, 'e-row') || parentsUntil(target, 'e-headerchkcelldiv') ||
            (this.selectionSettings.allowColumnSelection && target.classList.contains('e-headercell'))) {
            this.isInteracted = true;
        }
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch ||
            (this.isMacOS && this.cmdKeyPressed);
        this.isMultiShiftRequest = e.shiftKey;
        this.popUpClickHandler(e);
        var chkSelect = false;
        this.preventFocus = true;
        var checkBox;
        var checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        this.checkSelectAllClicked = checkWrap && checkWrap.querySelectorAll('.e-checkselectall') ? true : false;
        if (checkWrap && checkWrap.querySelectorAll('.e-checkselect,.e-checkselectall').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            chkSelect = true;
        }
        this.drawBorders();
        this.updateAutoFillPosition();
        target = parentsUntil(target, 'e-rowcell');
        if ((target && target.parentElement.classList.contains('e-row') && !this.parent.selectionSettings.checkboxOnly) || chkSelect) {
            if (this.parent.isCheckBoxSelection) {
                this.isMultiCtrlRequest = true;
            }
            this.target = target;
            if (!isNullOrUndefined(checkBox)) {
                this.checkedTarget = checkBox;
                if (checkBox.classList.contains('e-checkselectall')) {
                    this.checkSelectAll(checkBox);
                }
                else {
                    this.checkSelect(checkBox);
                }
            }
            else {
                var gObj = this.parent;
                var rIndex = 0;
                if (isGroupAdaptive(gObj)) {
                    var uid = target.parentElement.getAttribute('data-uid');
                    rIndex = gObj.getRows().map(function (m) { return m.getAttribute('data-uid'); }).indexOf(uid);
                }
                else {
                    rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
                }
                if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
                    ++rIndex;
                }
                if (!this.mUPTarget || !this.mUPTarget.isEqualNode(target)) {
                    this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
                }
                this.parent.hoverFrozenRows(e);
                if (this.parent.isCheckBoxSelection) {
                    this.moveIntoUncheckCollection(closest(target, '.e-row'));
                    this.setCheckAllState();
                }
            }
            if (!this.parent.isCheckBoxSelection && Browser.isDevice && !this.isSingleSel()) {
                this.showPopup(e);
            }
        }
        else if (e.target.classList.contains('e-headercell') &&
            !e.target.classList.contains('e-stackedheadercell')) {
            var uid = e.target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            this.headerSelectionHandler(this.parent.getColumnIndexByUid(uid));
        }
        this.isMultiCtrlRequest = false;
        this.isMultiShiftRequest = false;
        if (isNullOrUndefined(closest(e.target, '.e-unboundcell'))) {
            this.preventFocus = false;
        }
    };
    Selection.prototype.popUpClickHandler = function (e) {
        var target = e.target;
        if (closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-rowselect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSelectMultiTouch = true;
                }
                else {
                    target.classList.remove('e-spanclicked');
                    this.enableSelectMultiTouch = false;
                    this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                }
            }
        }
        else {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.showPopup = function (e) {
        if (!this.selectionSettings.enableSimpleMultiRowSelection) {
            setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                (!this.isSingleSel() && (this.selectedRecords.length > (this.parent.getFrozenColumns() ? 2 : 1)
                    || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
        }
    };
    Selection.prototype.rowCellSelectionHandler = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            if (!this.isDragged) {
                this.selectRow(rowIndex, this.selectionSettings.enableToggle);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, this.selectionSettings.enableToggle);
            if (this.selectedRowCellIndexes.length) {
                this.updateAutoFillPosition();
            }
            this.drawBorders();
        }
        else if (this.isMultiShiftRequest) {
            if (this.parent.isCheckBoxSelection || (!this.parent.isCheckBoxSelection &&
                !closest(this.target, '.e-rowcell').classList.contains('e-gridchkbox'))) {
                this.selectRowsByRange(isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
            }
            else {
                this.addRowsToSelection([rowIndex]);
            }
            this.selectCellsByRange(isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
            this.updateAutoFillPosition();
            this.drawBorders();
        }
        else {
            this.addRowsToSelection([rowIndex]);
            if (isBlazor() && this.parent.enableVirtualization && this.parent.isServerRendered) {
                var rowIndexes = this.parent.getSelectedRowIndexes();
                var interopAdaptor = 'interopAdaptor';
                var invokeMethodAsync = 'invokeMethodAsync';
                this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', true, 'normal', rowIndexes);
            }
            this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
            this.showHideBorders('none');
        }
        this.isDragged = false;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Selection.prototype.onCellFocused = function (e) {
        if (this.parent.frozenRows && e.container.isHeader && e.byKey) {
            if (e.keyArgs.action === 'upArrow') {
                if (this.parent.allowFiltering) {
                    e.isJump = e.element.tagName === 'INPUT' ? true : false;
                }
                else {
                    e.isJump = e.element.tagName === 'TH' ? true : false;
                }
            }
            else {
                if (e.keyArgs.action === 'downArrow') {
                    var rIdx = Number(e.element.parentElement.getAttribute('aria-rowindex'));
                    e.isJump = rIdx === 0 ? true : false;
                }
                else {
                    if (e.keyArgs.action === 'ctrlHome') {
                        e.isJump = true;
                    }
                }
            }
        }
        var clear = this.parent.isFrozenGrid() ? (((e.container.isHeader && e.element.tagName !== 'TD' && e.isJump &&
            !this.selectionSettings.allowColumnSelection) ||
            ((e.container.isContent || e.element.tagName === 'TD') && !(e.container.isSelectable || e.element.tagName === 'TD')))
            && !(e.byKey && e.keyArgs.action === 'space')) : ((e.container.isHeader && e.isJump) ||
            (e.container.isContent && !e.container.isSelectable)) && !(e.byKey && e.keyArgs.action === 'space')
            && !(e.element.classList.contains('e-detailrowexpand') || e.element.classList.contains('e-detailrowcollapse'));
        var headerAction = (e.container.isHeader && e.element.tagName !== 'TD' && !closest(e.element, '.e-rowcell'))
            && !(e.byKey && e.keyArgs.action === 'space');
        if (!e.byKey || clear) {
            if (clear && !this.parent.isCheckBoxSelection) {
                this.clearSelection();
            }
            return;
        }
        var _a = e.container.isContent ? e.container.indexes : e.indexes, rowIndex = _a[0], cellIndex = _a[1];
        var prev = this.focus.getPrevIndexes();
        if (this.parent.frozenRows) {
            if (e.container.isHeader && (e.element.tagName === 'TD' || closest(e.element, '.e-rowcell'))) {
                var thLen = this.parent.getHeaderTable().querySelector('thead').childElementCount;
                rowIndex -= thLen;
                prev.rowIndex = !isNullOrUndefined(prev.rowIndex) ? prev.rowIndex - thLen : null;
            }
            else {
                rowIndex += this.parent.frozenRows;
                prev.rowIndex = prev.rowIndex === 0 || !isNullOrUndefined(prev.rowIndex) ? prev.rowIndex + this.parent.frozenRows : null;
            }
        }
        if (this.parent.isFrozenGrid()) {
            var cIdx = Number(e.element.getAttribute('aria-colindex'));
            var selectedIndexes = this.parent.getSelectedRowCellIndexes();
            if (selectedIndexes.length && prev.cellIndex === 0) {
                prev.cellIndex = selectedIndexes[selectedIndexes.length - 1].cellIndexes[0];
            }
            prev.cellIndex = !isNullOrUndefined(prev.cellIndex) ? (prev.cellIndex === cellIndex ? cIdx : cIdx - 1) : null;
            cellIndex = cIdx;
        }
        if ((headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 &&
            e.keyArgs.action !== 'space' && rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) &&
            !this.selectionSettings.allowColumnSelection) {
            return;
        }
        this.preventFocus = true;
        var columnIndex = this.getKeyColIndex(e);
        if (this.needColumnSelection) {
            cellIndex = columnIndex;
        }
        switch (e.keyArgs.action) {
            case 'downArrow':
            case 'upArrow':
            case 'enter':
            case 'shiftEnter':
                this.target = e.element;
                this.applyDownUpKey(rowIndex, cellIndex);
                break;
            case 'rightArrow':
            case 'leftArrow':
                this.applyRightLeftKey(rowIndex, cellIndex);
                break;
            case 'shiftDown':
            case 'shiftUp':
                this.shiftDownKey(rowIndex, cellIndex);
                break;
            case 'shiftLeft':
            case 'shiftRight':
                this.applyShiftLeftRightKey(rowIndex, cellIndex);
                break;
            case 'home':
            case 'end':
                cellIndex = e.keyArgs.action === 'end' ? this.getLastColIndex(rowIndex) : 0;
                this.applyHomeEndKey(rowIndex, cellIndex);
                break;
            case 'ctrlHome':
            case 'ctrlEnd':
                this.applyCtrlHomeEndKey(rowIndex, cellIndex);
                break;
            case 'escape':
                this.clearSelection();
                break;
            case 'ctrlPlusA':
                this.ctrlPlusA();
                break;
            case 'space':
                this.applySpaceSelection(e.element);
                break;
            case 'tab':
                if (this.parent.editSettings.allowNextRowEdit) {
                    this.selectRow(rowIndex);
                }
                break;
        }
        this.needColumnSelection = false;
        this.preventFocus = false;
        this.positionBorders();
        this.updateAutoFillPosition();
    };
    Selection.prototype.getKeyColIndex = function (e) {
        var uid;
        var index = null;
        var stackedHeader = e.element.querySelector('.e-stackedheadercelldiv');
        if (this.selectionSettings.allowColumnSelection && parentsUntil(e.element, 'e-columnheader')) {
            this.needColumnSelection = e.container.isHeader ? true : false;
            if (stackedHeader) {
                if (e.keyArgs.action === 'rightArrow' || e.keyArgs.action === 'leftArrow') {
                    return index;
                }
                uid = stackedHeader.getAttribute('e-mappinguid');
                var innerColumn = this.getstackedColumns(this.parent.getColumnByUid(uid).columns);
                var lastIndex = this.parent.getColumnIndexByUid(innerColumn[innerColumn.length - 1].uid);
                var firstIndex = this.parent.getColumnIndexByUid(innerColumn[0].uid);
                index = this.prevColIndex >= lastIndex ? firstIndex : lastIndex;
            }
            else {
                index = this.parent.getColumnIndexByUid(e.element
                    .querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
            }
        }
        return index;
    };
    /**
     * Apply ctrl + A key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.ctrlPlusA = function () {
        if (this.isRowType() && !this.isSingleSel()) {
            this.selectRowsByRange(0, this.getCurrentBatchRecordChanges().length - 1);
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        }
    };
    Selection.prototype.applySpaceSelection = function (target) {
        if (target.classList.contains('e-checkselectall')) {
            this.checkedTarget = target;
            this.checkSelectAll(this.checkedTarget);
        }
        else {
            if (target.classList.contains('e-checkselect')) {
                this.checkedTarget = target;
                this.checkSelect(this.checkedTarget);
            }
        }
    };
    Selection.prototype.applyDownUpKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.parent.isCheckBoxSelection && this.parent.checkAllRows === 'Check' && !this.selectionSettings.persistSelection) {
            this.checkSelectAllAction(false);
            this.checkedTarget = null;
        }
        if (this.isRowType()) {
            if (this.parent.frozenRows) {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            }
            else {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            }
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        }
    };
    Selection.prototype.applyUpDown = function (rowIndex) {
        if (rowIndex < 0) {
            return;
        }
        if (!this.target) {
            this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
        }
        var cIndex = parseInt(this.target.getAttribute('aria-colindex'), 10);
        var frzCols = this.parent.getFrozenColumns();
        if (frzCols) {
            if (cIndex >= frzCols) {
                this.target =
                    this.contentRenderer.getMovableRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex - frzCols];
            }
            else {
                this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
            }
        }
        else {
            this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
        }
        this.addAttribute(this.target);
    };
    Selection.prototype.applyRightLeftKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        }
        else if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
            this.addAttribute(this.target);
        }
    };
    Selection.prototype.applyHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        else {
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
    };
    /**
     * Apply shift+down key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.shiftDownKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevRowIndex)) {
                this.selectRowsByRange(this.prevRowIndex, rowIndex);
                this.applyUpDown(rowIndex);
            }
            else {
                this.selectRow(0, true);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.applyShiftLeftRightKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumnsByRange(this.prevColIndex, cellIndex);
        }
        else {
            this.selectCellsByRange(this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.getstackedColumns = function (column) {
        var innerColumnIndexes = [];
        for (var i = 0, len = column.length; i < len; i++) {
            if (column[i].columns) {
                this.getstackedColumns(column[i].columns);
            }
            else {
                innerColumnIndexes.push(column[i]);
            }
        }
        return innerColumnIndexes;
    };
    Selection.prototype.applyCtrlHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
    };
    Selection.prototype.addRemoveClassesForRow = function (row, isAdd, clearAll) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (row) {
            var cells = [].slice.call(row.querySelectorAll('.e-rowcell'));
            var detailIndentCell = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            var dragdropIndentCell = row.querySelector('.e-rowdragdrop');
            if (detailIndentCell) {
                cells.push(detailIndentCell);
            }
            if (dragdropIndentCell) {
                cells.push(dragdropIndentCell);
            }
            addRemoveActiveClasses.apply(void 0, [cells, isAdd].concat(args));
        }
        this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
    };
    Selection.prototype.isRowType = function () {
        return this.selectionSettings.mode === 'Row' || this.selectionSettings.mode === 'Both';
    };
    Selection.prototype.isCellType = function () {
        return this.selectionSettings.mode === 'Cell' || this.selectionSettings.mode === 'Both';
    };
    Selection.prototype.isSingleSel = function () {
        return this.selectionSettings.type === 'Single';
    };
    Selection.prototype.getRenderer = function () {
        if (isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    Selection.prototype.getSelectedRecords = function () {
        var selectedData = [];
        if (!this.selectionSettings.persistSelection) {
            selectedData = this.parent.getRowsObject().filter(function (row) { return row.isSelected; })
                .map(function (m) { return m.data; });
        }
        else {
            selectedData = this.persistSelectedData;
        }
        return selectedData;
    };
    /**
     * Select the column by passing start column index
     * @param  {number} startIndex
     */
    Selection.prototype.selectColumn = function (index) {
        var gObj = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[index])) {
            return;
        }
        var column = gObj.getColumnByIndex(index);
        var selectedCol = gObj.getColumnHeaderByUid(column.uid);
        var isColSelected = selectedCol.classList.contains('e-columnselection');
        if ((!gObj.selectionSettings.allowColumnSelection)) {
            return;
        }
        var isMultiColumns = this.selectedColumnsIndexes.length > 1 &&
            this.selectedColumnsIndexes.indexOf(index) > -1;
        this.clearColDependency();
        if (!isColSelected || !this.selectionSettings.enableToggle || isMultiColumns) {
            var args = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(args, events.columnSelecting);
            if (args.cancel) {
                this.disableInteracted();
                return;
            }
            if (!(gObj.selectionSettings.enableToggle && index === this.prevColIndex && isColSelected) || isMultiColumns) {
                this.updateColSelection(selectedCol, index);
            }
            var selectedArgs = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, events.columnSelected);
        }
        this.updateColProps(index);
    };
    /**
     * Select the columns by passing start and end column index
     * @param  {number} startIndex
     * @param  {number} endIndex
     */
    Selection.prototype.selectColumnsByRange = function (startIndex, endIndex) {
        var gObj = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[startIndex])) {
            return;
        }
        var indexes = [];
        if (gObj.selectionSettings.type === 'Single' || isNullOrUndefined(endIndex)) {
            indexes[0] = startIndex;
        }
        else {
            var min = startIndex < endIndex;
            for (var i = startIndex; min ? i <= endIndex : i >= endIndex; min ? i++ : i--) {
                indexes.push(i);
            }
        }
        this.selectColumns(indexes);
    };
    /**
     * Select the columns by passing column indexes
     * @param  {number[]} columnIndexes
     */
    Selection.prototype.selectColumns = function (columnIndexes) {
        var gObj = this.parent;
        var selectedCol = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            columnIndexes = [columnIndexes[0]];
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        this.clearColDependency();
        var selectingArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            cancel: false, target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
        };
        this.onActionBegin(selectingArgs, events.columnSelecting);
        if (selectingArgs.cancel) {
            this.disableInteracted();
            return;
        }
        for (var i = 0, len = columnIndexes.length; i < len; i++) {
            this.updateColSelection(gObj.getColumnHeaderByUid(gObj.getColumnByIndex(columnIndexes[i]).uid), columnIndexes[i]);
        }
        selectedCol = this.getselectedCols();
        var selectedArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
        };
        this.onActionComplete(selectedArgs, events.columnSelected);
        this.updateColProps(columnIndexes[0]);
    };
    /**
     * Select the column with existing column by passing column index
     * @param  {number} startIndex
     */
    Selection.prototype.selectColumnWithExisting = function (startIndex) {
        var gObj = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[startIndex])) {
            return;
        }
        var frzCols = gObj.getFrozenColumns();
        var isFreeze = frzCols && startIndex >= frzCols;
        var newCol = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(startIndex).uid);
        var selectedCol = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            this.clearColDependency();
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        var rows = !isFreeze ? gObj.getDataRows() : gObj.getMovableRows();
        if (this.selectedColumnsIndexes.indexOf(startIndex) > -1) {
            this.clearColumnSelection(startIndex);
        }
        else {
            var selectingArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: gObj.getColumnByIndex(startIndex),
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(selectingArgs, events.columnSelecting);
            if (selectingArgs.cancel) {
                this.disableInteracted();
                return;
            }
            this.updateColSelection(newCol, startIndex);
            selectedCol = this.getselectedCols();
            var selectedArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                column: gObj.getColumnByIndex(startIndex),
                columnIndexes: this.selectedColumnsIndexes,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, events.columnSelected);
        }
        this.updateColProps(startIndex);
    };
    /**
     * Clear the column selection
     */
    Selection.prototype.clearColumnSelection = function (clearIndex) {
        if (this.isColumnSelected) {
            var gObj = this.parent;
            if (!isNullOrUndefined(clearIndex) && this.selectedColumnsIndexes.indexOf(clearIndex) === -1) {
                return;
            }
            var index = !isNullOrUndefined(clearIndex) ? clearIndex :
                this.selectedColumnsIndexes[this.selectedColumnsIndexes.length - 1];
            var col = gObj.getColumnByIndex(index);
            var selectedCol = void 0;
            var column = gObj.getColumnByIndex(index);
            if (col.getFreezeTableName() === 'frozen-right') {
                selectedCol = gObj.getFrozenRightColumnHeaderByIndex(index);
            }
            else if (col.getFreezeTableName() === 'movable') {
                selectedCol = gObj.getMovableColumnHeaderByIndex(index);
            }
            else {
                selectedCol = gObj.getColumnHeaderByUid(column.uid);
            }
            var deselectedArgs = {
                columnIndex: index, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted
            };
            var isCanceled = this.columnDeselect(deselectedArgs, events.columnDeselecting);
            if (isCanceled) {
                this.disableInteracted();
                return;
            }
            var selectedHeader = !isNullOrUndefined(clearIndex) ? [selectedCol] :
                [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnselection'));
            var selectedCells = this.getSelectedColumnCells(clearIndex);
            for (var i = 0, len = selectedHeader.length; i < len; i++) {
                addRemoveActiveClasses([selectedHeader[i]], false, 'e-columnselection');
            }
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                addRemoveActiveClasses([selectedCells[i]], false, 'e-columnselection');
            }
            if (!isNullOrUndefined(clearIndex)) {
                this.selectedColumnsIndexes.splice(this.selectedColumnsIndexes.indexOf(clearIndex), 1);
                this.parent.getColumns()[clearIndex].isSelected = false;
            }
            else {
                this.columnDeselect(deselectedArgs, events.columnDeselected);
                this.selectedColumnsIndexes = [];
                this.isColumnSelected = false;
                this.parent.getColumns().filter(function (col) { return col.isSelected = false; });
            }
        }
    };
    Selection.prototype.getselectedCols = function () {
        var gObj = this.parent;
        var selectedCol;
        if (this.selectedColumnsIndexes.length > 1) {
            selectedCol = [];
            for (var i = 0; i < this.selectedColumnsIndexes.length; i++) {
                (selectedCol).push(gObj.getColumnHeaderByUid(gObj.getColumnByIndex(this.selectedColumnsIndexes[i]).uid));
            }
        }
        else {
            selectedCol = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(this.selectedColumnsIndexes[0]).uid);
        }
        return selectedCol;
    };
    Selection.prototype.getSelectedColumnCells = function (clearIndex) {
        var gObj = this.parent;
        var isRowTemplate = !isNullOrUndefined(this.parent.rowTemplate);
        var rows = isRowTemplate ? gObj.getRows() : gObj.getDataRows();
        var movableRows;
        var frRows;
        if (gObj.isFrozenGrid() && gObj.getContent().querySelector('.e-movablecontent')) {
            movableRows = isRowTemplate ? gObj.getMovableRows() : gObj.getMovableDataRows();
            rows = gObj.addMovableRows(rows, movableRows);
            if (gObj.getFrozenMode() === 'Left-Right') {
                frRows = isRowTemplate ? gObj.getFrozenRightRows() : gObj.getFrozenRightDataRows();
                rows = gObj.addMovableRows(rows, frRows);
            }
        }
        var seletedcells = [];
        var selectionString = !isNullOrUndefined(clearIndex) ? '[aria-colindex="' + clearIndex + '"]' : '.e-columnselection';
        for (var i = 0, len = rows.length; i < len; i++) {
            seletedcells = seletedcells.concat([].slice.call(rows[i].querySelectorAll(selectionString)));
        }
        return seletedcells;
    };
    Selection.prototype.columnDeselect = function (args, event) {
        if (event === 'columnDeselected') {
            delete args.cancel;
        }
        this.onActionComplete(args, event);
        return args.cancel;
    };
    Selection.prototype.updateColProps = function (startIndex) {
        this.prevColIndex = startIndex;
        this.isColumnSelected = this.selectedColumnsIndexes.length && true;
    };
    Selection.prototype.clearColDependency = function () {
        this.clearColumnSelection();
        this.selectedColumnsIndexes = [];
    };
    Selection.prototype.updateColSelection = function (selectedCol, startIndex) {
        if (isNullOrUndefined(this.parent.getColumns()[startIndex])) {
            return;
        }
        var left = this.parent.getFrozenLeftCount();
        var movable = this.parent.getMovableColumnsCount();
        var col = this.parent.getColumnByIndex(startIndex);
        var isRowTemplate = !isNullOrUndefined(this.parent.rowTemplate);
        var rows;
        this.selectedColumnsIndexes.push(startIndex);
        this.parent.getColumns()[startIndex].isSelected = true;
        if (col.getFreezeTableName() === 'frozen-right') {
            startIndex = startIndex - (left + movable);
            rows = isRowTemplate ? this.parent.getFrozenRightRows() : this.parent.getFrozenRightDataRows();
        }
        else if (col.getFreezeTableName() === 'movable') {
            startIndex = startIndex - left;
            rows = isRowTemplate ? this.parent.getMovableRows() : this.parent.getMovableDataRows();
        }
        else {
            startIndex = startIndex + this.parent.getIndentCount();
            rows = isRowTemplate ? this.parent.getRows() : this.parent.getDataRows();
        }
        addRemoveActiveClasses([selectedCol], true, 'e-columnselection');
        for (var j = 0, len = rows.length; j < len; j++) {
            if (rows[j].classList.contains('e-row')) {
                if ((rows[j].classList.contains('e-editedrow') || rows[j].classList.contains('e-addedrow')) &&
                    this.parent.editSettings.mode === 'Normal' && !isNullOrUndefined(rows[j].querySelector('tr').childNodes[startIndex])) {
                    addRemoveActiveClasses([rows[j].querySelector('tr').childNodes[startIndex]], true, 'e-columnselection');
                }
                else if (!isNullOrUndefined(rows[j].childNodes[startIndex])) {
                    addRemoveActiveClasses([rows[j].childNodes[startIndex]], true, 'e-columnselection');
                }
            }
        }
    };
    Selection.prototype.headerSelectionHandler = function (colIndex) {
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            this.selectColumn(colIndex);
        }
        else if (this.isMultiShiftRequest) {
            this.selectColumnsByRange(isUndefined(this.prevColIndex) ? colIndex : this.prevColIndex, colIndex);
        }
        else {
            this.selectColumnWithExisting(colIndex);
        }
    };
    Selection.prototype.addEventListener_checkbox = function () {
        var _this = this;
        this.parent.on(events.dataReady, this.dataReady, this);
        this.onDataBoundFunction = this.onDataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.onDataBoundFunction);
        this.parent.on(events.contentReady, this.checkBoxSelectionChanged, this);
        this.parent.on(events.beforeRefreshOnDataChange, this.initPerisistSelection, this);
        this.parent.on(events.onEmpty, this.setCheckAllForEmptyGrid, this);
        this.actionCompleteFunc = this.actionCompleteHandler.bind(this);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.on(events.click, this.clickHandler, this);
        this.resizeEndFn = function () {
            _this.updateAutoFillPosition();
            _this.drawBorders();
        };
        this.resizeEndFn.bind(this);
        this.parent.addEventListener(events.resizeStop, this.resizeEndFn);
    };
    Selection.prototype.removeEventListener_checkbox = function () {
        this.parent.off(events.dataReady, this.dataReady);
        this.parent.removeEventListener(events.dataBound, this.onDataBoundFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.off(events.onEmpty, this.setCheckAllForEmptyGrid);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.beforeRefreshOnDataChange, this.initPerisistSelection);
    };
    Selection.prototype.setCheckAllForEmptyGrid = function () {
        var checkAllBox = this.getCheckAllBox();
        if (checkAllBox) {
            this.parent.isCheckBoxSelection = true;
            var spanEle = checkAllBox.nextElementSibling;
            removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
        }
    };
    Selection.prototype.dataReady = function (e) {
        this.isHeaderCheckboxClicked = false;
        var isInfinitecroll = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfinitecroll) {
            this.disableUI = !this.parent.enableImmutableMode;
            this.clearSelection();
            this.setCheckAllState();
            this.disableUI = false;
        }
    };
    Selection.prototype.actionCompleteHandler = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
    };
    Selection.prototype.selectRowIndex = function (index) {
        this.parent.isSelectedRowIndexUpdating = true;
        this.parent.selectedRowIndex = index;
    };
    Selection.prototype.disableInteracted = function () {
        this.isInteracted = false;
    };
    Selection.prototype.activeTarget = function () {
        this.actualTarget = this.isInteracted ? this.actualTarget : null;
    };
    return Selection;
}());
export { Selection };
