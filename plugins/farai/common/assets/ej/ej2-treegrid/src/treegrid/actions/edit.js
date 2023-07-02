import { Grid, Edit as GridEdit, getUid, getObject } from '@syncfusion/ej2-grids';
import { parentsUntil } from '@syncfusion/ej2-grids';
import * as events from '../base/constant';
import { isNullOrUndefined, extend, setValue, removeClass, addClass, getValue, isBlazor } from '@syncfusion/ej2-base';
import { updateBlazorTemplate } from '@syncfusion/ej2-base';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { findChildrenRecords, getParentData, isCountRequired, isRemoteData } from '../utils';
import { editAction, updateParentRow } from './crud-actions';
import { BatchEdit } from './batch-edit';
/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
var Edit = /** @class */ (function () {
    /**
     * Constructor for Edit module
     */
    function Edit(parent) {
        this.addedRecords = 'addedRecords';
        this.deletedRecords = 'deletedRecords';
        this.prevAriaRowIndex = '-1';
        Grid.Inject(GridEdit);
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.previousNewRowPosition = null;
        this.internalProperties = {};
        this.batchEditModule = new BatchEdit(this.parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
    /**
     * @hidden
     */
    Edit.prototype.addEventListener = function () {
        this.parent.on(events.crudAction, this.crudAction, this);
        this.parent.on(events.beginEdit, this.beginEdit, this);
        this.parent.on(events.beginAdd, this.beginAdd, this);
        this.parent.on(events.recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(events.cellSave, this.cellSave, this);
        this.parent.on(events.batchCancel, this.batchCancel, this);
        this.parent.grid.on(events.keyPressed, this.keyPressed, this);
        this.parent.grid.on('batchedit-form', this.lastCellTab, this);
        this.parent.grid.on('content-ready', this.contentready, this);
        this.parent.on(events.cellEdit, this.cellEdit, this);
        this.parent.on('actionBegin', this.editActionEvents, this);
        this.parent.on('actionComplete', this.editActionEvents, this);
        this.parent.grid.on(events.doubleTap, this.recordDoubleClick, this);
        this.parent.grid.on('dblclick', this.gridDblClick, this);
        this.parent.grid.on('recordAdded', this.customCellSave, this);
        this.parent.on('savePreviousRowPosition', this.savePreviousRowPosition, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        this.parent.grid.on(events.beforeStartEdit, this.beforeStartEdit, this);
        this.parent.grid.on(events.beforeBatchCancel, this.beforeBatchCancel, this);
        this.parent.grid.on('reset-edit-props', this.resetIsOnBatch, this);
        this.parent.grid.on('get-row-position', this.getRowPosition, this);
    };
    Edit.prototype.gridDblClick = function (e) {
        this.doubleClickTarget = e.target;
    };
    Edit.prototype.getRowPosition = function (addArgs) {
        addArgs.newRowPosition = this.parent.editSettings.newRowPosition;
        addArgs.addRowIndex = this.addRowIndex;
        addArgs.ariaRowIndex = +this.prevAriaRowIndex;
    };
    Edit.prototype.beforeStartEdit = function (args) {
        this.parent.trigger(events.actionBegin, args);
    };
    Edit.prototype.beforeBatchCancel = function (args) {
        if (this.parent.editSettings.mode === 'Cell') {
            this.parent.trigger(events.actionComplete, args);
        }
    };
    /**
     * @hidden
     */
    Edit.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.crudAction, this.crudAction);
        this.parent.off(events.beginEdit, this.beginEdit);
        this.parent.off(events.beginAdd, this.beginAdd);
        this.parent.off(events.recordDoubleClick, this.recordDoubleClick);
        this.parent.off(events.batchCancel, this.batchCancel);
        this.parent.grid.off(events.keyPressed, this.keyPressed);
        this.parent.grid.off('batchedit-form', this.lastCellTab);
        this.parent.grid.off('content-ready', this.contentready);
        this.parent.off(events.cellEdit, this.cellEdit);
        this.parent.off('actionBegin', this.editActionEvents);
        this.parent.off('actionComplete', this.editActionEvents);
        this.parent.grid.off('recordAdded', this.customCellSave);
        this.parent.grid.off(events.doubleTap, this.recordDoubleClick);
        this.parent.off('savePreviousRowPosition', this.savePreviousRowPosition);
        this.parent.grid.off(events.beforeStartEdit, this.beforeStartEdit);
        this.parent.grid.off(events.beforeBatchCancel, this.beforeBatchCancel);
        this.parent.grid.off('dblclick', this.gridDblClick);
        this.parent.grid.off('reset-edit-props', this.resetIsOnBatch);
        this.parent.grid.off('get-row-position', this.getRowPosition);
        //this.parent.grid.off('click', this.gridSingleClick);
    };
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    Edit.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    Edit.prototype.applyFormValidation = function (cols) {
        this.parent.grid.editModule.applyFormValidation(cols);
    };
    Edit.prototype.editActionEvents = function (args) {
        var eventArgs = getObject('editAction', args);
        var eventName = getObject('name', eventArgs);
        var treeObj = this.parent;
        var adaptor = treeObj.dataSource.adaptor;
        if ((isRemoteData(treeObj) || adaptor instanceof RemoteSaveAdaptor) &&
            (eventArgs.requestType === 'save' && eventArgs.action === 'add') &&
            (treeObj.editSettings.newRowPosition === 'Child' || treeObj.editSettings.newRowPosition === 'Below'
                || treeObj.editSettings.newRowPosition === 'Above')) {
            if (eventName === 'actionBegin') {
                var rowIndex = isNullOrUndefined(eventArgs.row) || !Object.keys(eventArgs.row).length ? this.selectedIndex :
                    eventArgs.row.rowIndex - 1;
                var keyData = (!isNullOrUndefined(rowIndex) && rowIndex !== -1) ?
                    treeObj.getCurrentViewRecords()[rowIndex][treeObj.getPrimaryKeyFieldNames()[0]] : -1;
                treeObj.grid.query.addParams('relationalKey', keyData);
            }
            else if (eventName === 'actionComplete') {
                var paramsLength = treeObj.grid.query.params.length;
                for (var i = 0; i < paramsLength; i++) {
                    if (treeObj.grid.query.params[i].key === 'relationalKey') {
                        treeObj.grid.query.params.splice(i);
                    }
                }
            }
        }
        if (this.parent.editSettings.mode === 'Batch' && eventArgs.requestType === 'paging') {
            this.parent.notify('batchPageAction', {});
        }
    };
    Edit.prototype.recordDoubleClick = function (args) {
        var target = args.target;
        if (isNullOrUndefined(target.closest('td.e-rowcell'))) {
            return;
        }
        var column = this.parent.grid.getColumnByIndex(+target.closest('td.e-rowcell').getAttribute('aria-colindex'));
        if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
            column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) && this.parent.editSettings.allowEditOnDblClick) {
            this.isOnBatch = true;
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
            if (this.parent.enableVirtualization) {
                var tr = parentsUntil(args.target, 'e-row');
                this.prevAriaRowIndex = tr.getAttribute('aria-rowindex');
                tr.setAttribute('aria-rowindex', tr.rowIndex + '');
            }
            this.updateGridEditMode('Batch');
        }
    };
    Edit.prototype.updateGridEditMode = function (mode) {
        this.parent.grid.setProperties({ editSettings: { mode: mode } }, true);
        var updateMethod = getObject('updateEditObj', this.parent.grid.editModule);
        updateMethod.apply(this.parent.grid.editModule);
        this.parent.grid.isEdit = false;
    };
    Edit.prototype.resetIsOnBatch = function () {
        if (this.parent.enableVirtualization && this.parent.editSettings.mode === 'Cell') {
            this.isOnBatch = false;
            this.updateGridEditMode('Normal');
        }
    };
    Edit.prototype.keyPressed = function (args) {
        if (this.isOnBatch || (this.parent.editSettings.mode === 'Cell' && isBlazor() && this.parent.isServerRendered)) {
            this.keyPress = args.action;
        }
        if (args.action === 'f2') {
            this.recordDoubleClick(args);
        }
    };
    Edit.prototype.deleteUniqueID = function (value) {
        var idFilter = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        var id = 'uniqueIDCollection';
        delete this.parent[id][value];
    };
    Edit.prototype.cellEdit = function (args) {
        var _this = this;
        var promise = 'promise';
        var prom = args[promise];
        delete args[promise];
        if (this.parent.enableVirtualization && !isNullOrUndefined(this.prevAriaRowIndex)) {
            args.row.setAttribute('aria-rowindex', this.prevAriaRowIndex);
            this.prevAriaRowIndex = undefined;
        }
        if (this.keyPress !== 'enter') {
            this.parent.trigger(events.cellEdit, args, function (celleditArgs) {
                if (!celleditArgs.cancel && _this.parent.editSettings.mode === 'Cell') {
                    _this.enableToolbarItems('edit');
                }
                else if (celleditArgs.cancel && _this.parent.editSettings.mode === 'Cell') {
                    _this.isOnBatch = false;
                    _this.updateGridEditMode('Normal');
                }
                if (!isNullOrUndefined(prom)) {
                    prom.resolve(celleditArgs);
                }
            });
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-summarycell'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell') {
            if (this.keyPress === 'tab' || this.keyPress === 'shiftTab') {
                this.keyPress = null;
            }
            else if (this.keyPress === 'enter') {
                args.cancel = true;
                this.keyPress = null;
            }
        }
        // if (this.isAdd && this.parent.editSettings.mode === 'Batch' && !args.cell.parentElement.classList.contains('e-insertedrow')) {
        //   this.isAdd = false;
        // }
    };
    Edit.prototype.enableToolbarItems = function (request) {
        if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
            var toolbarID = this.parent.element.id + '_gridcontrol_';
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], request === 'save');
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], request === 'edit');
        }
    };
    Edit.prototype.batchCancel = function (e) {
        if (this.parent.editSettings.mode === 'Cell') {
            var cellDetails = getValue('editModule.cellDetails', this.parent.grid.editModule);
            var treeCell = this.parent.getCellFromIndex(cellDetails.rowIndex, this.parent.treeColumnIndex);
            this.parent.renderModule.cellRender({
                data: cellDetails.rowData,
                cell: treeCell,
                column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
            });
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        if (this.parent.editSettings.mode === 'Batch') {
            this.parent.notify('batchCancelAction', {});
        }
    };
    Edit.prototype.customCellSave = function (args) {
        if (isCountRequired(this.parent) && this.parent.editSettings.mode === 'Cell' && args.action === 'edit') {
            this.updateCell(args, args.rowIndex);
            this.afterCellSave(args, args.row, args.rowIndex);
        }
    };
    Edit.prototype.cellSave = function (args) {
        var _this = this;
        if (this.parent.editSettings.mode === 'Cell' && this.parent.element.querySelector('form')) {
            args.cancel = true;
            var editModule = 'editModule';
            setValue('isEdit', false, this.parent.grid);
            setValue('isEditCollapse', true, this.parent);
            args.rowData[args.columnName] = args.value;
            var row_1;
            if (isNullOrUndefined(args.cell)) {
                row_1 = this.parent.grid.editModule[editModule].form.parentElement.parentNode;
            }
            else {
                row_1 = args.cell.parentNode;
            }
            var rowIndex_1;
            var primaryKeys_1 = this.parent.getPrimaryKeyFieldNames();
            if (isNullOrUndefined(row_1)) {
                this.parent.grid.getCurrentViewRecords().filter(function (e, i) {
                    if (e[primaryKeys_1[0]] === args.rowData[primaryKeys_1[0]]) {
                        rowIndex_1 = i;
                        return;
                    }
                });
            }
            else {
                rowIndex_1 = (this.parent.getRows().indexOf(row_1) === -1 && (this.parent.getFrozenColumns() > 0)) ?
                    this.parent.grid.getMovableRows().indexOf(row_1) : this.parent.getRows().indexOf(row_1);
            }
            var arg = {};
            extend(arg, args);
            arg.cancel = false;
            arg.type = 'save';
            row_1 = this.parent.grid.getRows()[row_1.rowIndex];
            this.parent.trigger(events.actionBegin, arg);
            if (!arg.cancel) {
                if ((row_1.rowIndex === this.parent.getCurrentViewRecords().length - 1) && this.keyPress === 'tab') {
                    this.isTabLastRow = true;
                }
                this.blazorTemplates(args);
                if (!isRemoteData(this.parent) &&
                    !(this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
                    if (isCountRequired(this.parent)) {
                        var eventPromise = 'eventPromise';
                        var editArgs = { requestType: 'save', data: args.rowData, action: 'edit', row: row_1,
                            rowIndex: rowIndex_1, rowData: args.rowData, columnName: args.columnName,
                            filterChoiceCount: null, excelSearchOperator: null };
                        this.parent.grid.getDataModule()[eventPromise](editArgs, this.parent.grid.query);
                    }
                    else {
                        this.updateCell(args, rowIndex_1);
                        this.afterCellSave(args, row_1, rowIndex_1);
                    }
                }
                else if (isRemoteData(this.parent) ||
                    (this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
                    var query = this.parent.grid.query;
                    var crud = this.parent.grid.dataSource.update(primaryKeys_1[0], args.rowData, query.fromTable, query, args.previousValue);
                    crud.then(function (e) {
                        if (!isNullOrUndefined(e)) {
                            args.rowData[args.columnName] = e[args.columnName];
                        }
                        _this.updateCell(args, rowIndex_1);
                        _this.afterCellSave(args, row_1, rowIndex_1);
                    });
                }
            }
            else {
                this.parent.grid.isEdit = true;
            }
        }
    };
    Edit.prototype.afterCellSave = function (args, row, rowIndex) {
        var mRow;
        if (this.parent.grid.aggregateModule) {
            this.parent.grid.aggregateModule.refresh(args.rowData);
        }
        this.parent.grid.editModule.destroyWidgets([this.parent.grid.getColumnByField(args.columnName)]);
        this.parent.grid.editModule.formObj.destroy();
        if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        this.enableToolbarItems('save');
        if (this.parent.getFrozenColumns() > 0) {
            mRow = this.parent.grid.getMovableRows()[rowIndex];
            removeClass([mRow], ['e-editedrow', 'e-batchrow']);
            removeClass(mRow.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
        }
        removeClass([row], ['e-editedrow', 'e-batchrow']);
        removeClass(row.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
        this.parent.grid.focusModule.restoreFocus();
        editAction({ value: args.rowData, action: 'edit' }, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, args.columnName);
        if ((row.rowIndex === this.parent.getCurrentViewRecords().length - 1) && this.keyPress === 'enter') {
            this.keyPress = null;
        }
        var saveArgs = {
            type: 'save', column: this.parent.getColumnByField(args.columnName), data: args.rowData,
            previousData: args.previousValue, row: row, target: args.cell
        };
        this.parent.trigger(events.actionComplete, saveArgs);
    };
    Edit.prototype.lastCellTab = function (formObj) {
        if (!this.parent.grid.isEdit && this.isOnBatch && this.keyPress === 'tab' && this.parent.editSettings.mode === 'Cell') {
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
            this.keyPress = null;
        }
    };
    Edit.prototype.blazorTemplates = function (args) {
        if (isBlazor() && this.parent.isServerRendered) {
            var cols = this.parent.grid.getColumns();
            var colModel = 'columnModel';
            var columnModel = this.parent.grid[colModel];
            var str = 'isStringTemplate';
            for (var i = 0; i < cols.length; i++) {
                if (columnModel[i].template) {
                    var templateID = this.parent.grid.element.id + cols[i].uid;
                    columnModel[i].getColumnTemplate()(extend({ 'index': [i] }, args.rowData), this.parent.grid, 'template', templateID, this.parent.grid[str], null);
                }
                if (cols[i].editTemplate) {
                    updateBlazorTemplate(this.parent.grid.element.id + cols[i].uid + 'editTemplate', 'EditTemplate', cols[i]);
                }
                if (cols[i].template) {
                    updateBlazorTemplate(this.parent.grid.element.id + cols[i].uid, 'Template', cols[i], false);
                }
            }
        }
    };
    Edit.prototype.updateCell = function (args, rowIndex) {
        this.parent.grid.editModule.updateRow(rowIndex, args.rowData);
        this.parent.grid.getRowsObject()[rowIndex].data = args.rowData;
    };
    Edit.prototype.crudAction = function (details, columnName) {
        editAction(details, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName, this.addRowRecord);
        this.parent.parentData = [];
        var data = this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource;
        for (var i = 0; i < data.length; i++) {
            data[i].index = i;
            var key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            if (details.value[key] === data[i][key]) {
                if (details.action === 'add') {
                    data[i].level = this.internalProperties.level;
                    data[i].taskData = this.internalProperties.taskData;
                    data[i].uniqueID = this.internalProperties.uniqueID;
                    if (!isNullOrUndefined(this.internalProperties.parentItem)) {
                        data[i].parentItem = this.internalProperties.parentItem;
                        data[i].parentUniqueID = this.internalProperties.parentUniqueID;
                    }
                    data[i].childRecords = this.internalProperties.childRecords;
                }
            }
            setValue('uniqueIDCollection.' + data[i].uniqueID + '.index', i, this.parent);
            if (!data[i].level) {
                this.parent.parentData.push(data[i]);
            }
        }
        if (details.action === 'add' && this.previousNewRowPosition != null) {
            this.parent.setProperties({ editSettings: { newRowPosition: this.previousNewRowPosition } }, true);
            this.previousNewRowPosition = null;
        }
    };
    Edit.prototype.updateIndex = function (data, rows, records) {
        for (var j = 0; j < this.parent.getDataRows().length; j++) {
            var data1 = records[j];
            var index = getValue('uniqueIDCollection.' + data1.uniqueID + '.index', this.parent);
            data1.index = index;
            if (!isNullOrUndefined(data1.parentItem)) {
                var parentIndex = getValue('uniqueIDCollection.' + data1.parentItem.uniqueID + '.index', this.parent);
                data1.parentItem.index = parentIndex;
            }
        }
        var count = -1;
        for (var k = 0; k < this.parent.getRows().length; k++) {
            if (!rows[k].classList.contains('e-detailrow')) {
                count++;
            }
            var data2 = records[count];
            var index = data2.index;
            var level = data2.level;
            var row = rows[k];
            if (!isNullOrUndefined(data2.parentItem)) {
                index = getValue('uniqueIDCollection.' + data2.parentItem.uniqueID + '.index', this.parent);
            }
            var treecell = row.cells[this.parent.treeColumnIndex];
            if (!isNullOrUndefined(treecell)) {
                for (var l = 0; l < treecell.classList.length; l++) {
                    var value = treecell.classList[l];
                    var remove = /e-gridrowindex/i;
                    var removed = /e-griddetailrowindex/i;
                    var result = value.match(remove);
                    var results = value.match(removed);
                    if (result != null) {
                        removeClass([treecell], value);
                    }
                    if (results != null) {
                        removeClass([treecell], value);
                    }
                }
                if (!rows[k].classList.contains('e-detailrow')) {
                    addClass([treecell], 'e-gridrowindex' + index + 'level' + level);
                }
                else {
                    addClass([treecell], 'e-griddetailrowindex' + index + 'level' + level);
                }
            }
        }
    };
    Edit.prototype.beginAdd = function (args) {
        var position;
        var index = this.addRowIndex;
        var records = this.parent.grid.getCurrentViewRecords();
        if (this.parent.editSettings.mode === 'Batch') {
            index = this.batchEditModule.getAddRowIndex();
            this.selectedIndex = this.batchEditModule.getSelectedIndex();
            if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                || this.parent.getBatchChanges()[this.deletedRecords].length) {
                records = this.batchEditModule.getBatchRecords();
            }
        }
        var rows = this.parent.grid.getDataRows();
        var firstAriaIndex = rows.length ? +rows[0].getAttribute('aria-rowindex') : 0;
        var lastAriaIndex = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') : 0;
        var withinRange = this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
        var isVirtualization = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
        if (this.parent.editSettings.mode !== 'Dialog') {
            if (this.parent.editSettings.newRowPosition === 'Above') {
                position = 'before';
            }
            else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                position = 'after';
                if (!isNullOrUndefined(records[index]) && records[index].expanded) {
                    if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
                        || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                        index += findChildrenRecords(records[index]).length;
                        if (this.parent.editSettings.newRowPosition !== 'Child') {
                            var batchChildCount = this.batchEditModule.getBatchChildCount();
                            index = index + batchChildCount;
                        }
                    }
                    else {
                        index += findChildrenRecords(records[index]).length;
                    }
                }
            }
            if ((this.selectedIndex > -1 || isVirtualization) && withinRange
                && (index || (this.parent.editSettings.newRowPosition === 'Child'
                    || this.parent.editSettings.newRowPosition === 'Below'))) {
                if (index >= rows.length) {
                    index = rows.length - 2;
                }
                var r = 'rows';
                var newRowObject = this.parent.grid.contentModule[r][0];
                var focussedElement = document.activeElement;
                rows[index + 1][position](rows[0]);
                setValue('batchIndex', index + 1, this.batchEditModule);
                var rowObjectIndex = this.parent.editSettings.newRowPosition === 'Above' ? index : index + 1;
                if (this.parent.editSettings.mode === 'Batch') {
                    this.parent.grid.contentModule[r].splice(0, 1);
                    this.parent.grid.contentModule[r].splice(rowObjectIndex, 0, newRowObject);
                }
                if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
                    var movableRows = this.parent.getMovableDataRows();
                    var frows = 'freezeRows';
                    var newFreezeRowObject = this.parent.grid.getRowsObject()[0];
                    movableRows[index + 1][position](movableRows[0]);
                    if (this.parent.editSettings.mode === 'Batch') {
                        this.parent.grid.contentModule[frows].splice(0, 1);
                        this.parent.grid.contentModule[frows].splice(rowObjectIndex, 0, newFreezeRowObject);
                    }
                    setValue('batchIndex', index + 1, this.batchEditModule);
                }
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    var errors = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (var i = 0; i < errors.length; i++) {
                        errors[i].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
                }
                if (isVirtualization) {
                    this.prevAriaRowIndex = '-1';
                }
                focussedElement.focus();
            }
        }
    };
    // private beforeDataBound(args: BeforeDataBoundArgs): void {
    //   if (this.parent.grid.isEdit && this.parent.dataSource instanceof DataManager &&
    //         this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor) {
    //     let action: string = getValue('action', args);
    //     let data: Object = getValue('data', args);
    //     if (action === 'edit' && !isNullOrUndefined(this.editedData)) {
    //       data = extend(this.editedData, data);
    //       this.editedData = null;
    //     }
    //     if (!isNullOrUndefined(this.addedData)) {
    //       let addedData: Object = args.result[args.result.length - 1];
    //       addedData = extend(this.addedData, addedData);
    //       this.addedData = null;
    //       args.result.splice(this.addedIndex, 0, addedData);
    //       args.result.splice(args.result.length, 1);
    //     }
    //   }
    // }
    Edit.prototype.beginEdit = function (args) {
        if (args.requestType === 'refresh' && this.isOnBatch) {
            args.cancel = true;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell' && args.requestType === 'beginEdit') {
            args.cancel = true;
            return;
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-frame'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (args.requestType === 'delete') {
            var data = args.data;
            for (var i = 0; i < data.length; i++) {
                this.deleteUniqueID(data[i].uniqueID);
                var childs = findChildrenRecords(data[i]);
                for (var c = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[c].uniqueID);
                }
                args.data = data.concat(childs);
            }
        }
        if (args.requestType === 'add') {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            if (this.parent.enableVirtualization) {
                var selector = '.e-row[aria-rowindex="' + this.selectedIndex + '"]';
                var row = void 0;
                if (this.selectedIndex > -1 && this.parent.editSettings.newRowPosition !== 'Top' &&
                    this.parent.editSettings.newRowPosition !== 'Bottom') {
                    this.prevAriaRowIndex = this.selectedIndex.toString();
                    row = this.parent.getContent().querySelector(selector);
                    this.addRowIndex = row ? row.rowIndex : 0;
                }
                else {
                    if (this.prevAriaRowIndex && this.prevAriaRowIndex !== '-1') {
                        selector = '.e-row[aria-rowindex="' + this.prevAriaRowIndex + '"]';
                        row = this.parent.getContent().querySelector(selector);
                        this.addRowIndex = row ? row.rowIndex : 0;
                    }
                    else {
                        this.addRowIndex = 0;
                    }
                }
            }
            else {
                this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
            }
            this.addRowRecord = this.parent.getSelectedRecords()[0];
        }
        args = this.beginAddEdit(args);
        // if (args.requestType === 'save' &&
        //    ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor))) {
        //      if (args.action === 'edit') {
        //           this.editedData = args.data;
        //      } else if (args.action === 'add') {
        //           this.addedData = value;
        //      }
        // }
    };
    Edit.prototype.savePreviousRowPosition = function (args) {
        if (this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
    };
    Edit.prototype.beginAddEdit = function (args) {
        var value = args.data;
        if (args.action === 'add') {
            var key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            var position = null;
            value.taskData = isNullOrUndefined(value.taskData) ? extend({}, args.data) : value.taskData;
            // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
            //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            var currentData = this.parent.grid.getCurrentViewRecords();
            var index = this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + value.uniqueID, value, this.parent);
            var level = 0;
            var dataIndex = void 0;
            var idMapping = void 0;
            var parentUniqueID = void 0;
            var parentItem = void 0;
            var parentIdMapping = void 0;
            var isVirtualization = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
            var rows = this.parent.getRows();
            var firstAriaIndex = rows.length ? +rows[0].getAttribute('aria-rowindex') : 0;
            var lastAriaIndex = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') : 0;
            var withinRange = this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
            if (currentData.length) {
                dataIndex = currentData[this.addRowIndex].index;
                idMapping = currentData[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
                if (currentData[this.addRowIndex].parentItem) {
                    parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
                }
                parentItem = currentData[this.addRowIndex].parentItem;
            }
            if (this.parent.editSettings.newRowPosition !== 'Top' && currentData.length) {
                level = currentData[this.addRowIndex].level;
                if (this.parent.editSettings.newRowPosition === 'Above') {
                    position = 'before';
                    index = currentData[this.addRowIndex].index;
                }
                else if (this.parent.editSettings.newRowPosition === 'Below') {
                    position = 'after';
                    var childRecordCount = findChildrenRecords(currentData[this.addRowIndex]).length;
                    var currentDataIndex = currentData[this.addRowIndex].index;
                    index = (childRecordCount > 0) ? (currentDataIndex + childRecordCount) : (currentDataIndex);
                }
                else if (this.parent.editSettings.newRowPosition === 'Child') {
                    position = 'after';
                    if ((this.selectedIndex > -1 || isVirtualization) && withinRange) {
                        value.parentItem = extend({}, currentData[this.addRowIndex]);
                        value.parentUniqueID = value.parentItem.uniqueID;
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    var childRecordCount1 = findChildrenRecords(currentData[this.addRowIndex]).length;
                    var currentDataIndex1 = currentData[this.addRowIndex].index;
                    value.level = level + 1;
                    index = (childRecordCount1 > 0) ? (currentDataIndex1 + childRecordCount1) : (currentDataIndex1);
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = idMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                    if ((this.selectedIndex > -1 || isVirtualization) && level && withinRange) {
                        value.parentUniqueID = parentUniqueID;
                        value.parentItem = extend({}, parentItem);
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    value.level = level;
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = parentIdMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (position != null && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                    args.index = position === 'before' ? index : index + 1;
                }
                if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    var dataSource = (this.parent.grid.dataSource instanceof DataManager ?
                        this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                    args.index = dataSource.length;
                }
            }
            if (isNullOrUndefined(value.level)) {
                value.level = level;
            }
            // this.addedIndex = args.index;
            value.hasChildRecords = false;
            value.childRecords = [];
            value.index = 0;
        }
        if (args.action === 'add') {
            this.internalProperties = { level: value.level, parentItem: value.parentItem, uniqueID: value.uniqueID,
                taskData: value.taskData, parentUniqueID: isNullOrUndefined(value.parentItem) ? undefined : value.parentItem.uniqueID,
                childRecords: value.childRecords };
        }
        if (args.requestType === 'delete') {
            var deletedValues = args.data;
            for (var i = 0; i < deletedValues.length; i++) {
                if (deletedValues[i].parentItem) {
                    var parentItem = getParentData(this.parent, deletedValues[i].parentItem.uniqueID);
                    if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                        var childIndex = parentItem.childRecords.indexOf(deletedValues[i]);
                        parentItem.childRecords.splice(childIndex, 1);
                    }
                }
            }
        }
        return args;
    };
    /**
     * If the data,index and position given, Adds the record to treegrid rows otherwise it will create edit form.
     * @return {void}
     */
    Edit.prototype.addRecord = function (data, index, position) {
        this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        if (data) {
            if (index > -1) {
                this.selectedIndex = index;
                this.addRowIndex = index;
            }
            else {
                this.selectedIndex = this.parent.selectedRowIndex;
                this.addRowIndex = this.parent.selectedRowIndex;
            }
            if (position) {
                this.parent.setProperties({ editSettings: { newRowPosition: position } }, true);
            }
            this.parent.grid.editModule.addRecord(data, index);
        }
        else {
            this.parent.grid.editModule.addRecord(data, index);
        }
    };
    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    Edit.prototype.editFormValidate = function () {
        return this.parent.grid.editModule.editFormValidate();
    };
    /**
     * @hidden
     */
    Edit.prototype.destroyForm = function () {
        this.parent.grid.editModule.destroyForm();
    };
    Edit.prototype.contentready = function (e) {
        if (!isNullOrUndefined(e.args.requestType)
            && (e.args.requestType.toString() === 'delete' || e.args.requestType.toString() === 'save'
                || (this.parent.editSettings.mode === 'Batch' && e.args.requestType.toString() === 'batchsave'))) {
            this.updateIndex(this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
            if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
                if (this.parent.grid.dataSource.length === this.parent.getMovableDataRows().length) {
                    this.updateIndex(this.parent.grid.dataSource, this.parent.getMovableDataRows(), this.parent.getCurrentViewRecords());
                }
            }
        }
    };
    /**
     * If the row index and field is given, edits the particular cell in a row.
     * @return {void}
     */
    Edit.prototype.editCell = function (rowIndex, field) {
        if (this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch') {
            if (this.parent.editSettings.mode !== 'Batch') {
                this.isOnBatch = true;
                this.updateGridEditMode('Batch');
            }
            this.parent.grid.editModule.editCell(rowIndex, field);
        }
    };
    return Edit;
}());
export { Edit };
