import { extend, isBlazor, select } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { parentsUntil, isGroupAdaptive, refreshForeignData, getObject, gridActionHandler } from '../base/util';
import * as events from '../base/constant';
import { RowRenderer } from '../renderer/row-renderer';
import { DataUtil } from '@syncfusion/ej2-data';
/**
 * `NormalEdit` module is used to handle normal('inline, dialog, external') editing actions.
 * @hidden
 */
var NormalEdit = /** @class */ (function () {
    function NormalEdit(parent, serviceLocator, renderer) {
        this.args = {};
        this.currentVirtualData = {};
        this.parent = parent;
        this.renderer = renderer;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    NormalEdit.prototype.clickHandler = function (e) {
        var target = e.target;
        var gObj = this.parent;
        if ((((parentsUntil(target, 'e-gridcontent') &&
            parentsUntil(parentsUntil(target, 'e-gridcontent'), 'e-grid').id === gObj.element.id)) || (gObj.frozenRows
            && parentsUntil(target, 'e-headercontent'))) && !parentsUntil(target, 'e-unboundcelldiv')) {
            this.rowIndex = parentsUntil(target, 'e-rowcell') ? parseInt(target.parentElement.getAttribute('aria-rowindex'), 10) : -1;
            if (gObj.isEdit) {
                gObj.editModule.endEdit();
            }
        }
    };
    NormalEdit.prototype.dblClickHandler = function (e) {
        if (parentsUntil(e.target, 'e-rowcell') && this.parent.editSettings.allowEditOnDblClick) {
            this.parent.editModule.startEdit(parentsUntil(e.target, 'e-row'));
        }
    };
    /**
     * The function used to trigger editComplete
     * @return {void}
     * @hidden
     */
    NormalEdit.prototype.editComplete = function (e) {
        this.parent.isEdit = false;
        var action = 'action';
        if (isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        switch (e.requestType) {
            case 'save':
                if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
                    || (!this.parent.isPersistSelection)) {
                    if (e[action] !== 'edit') {
                        this.parent.selectRow(0);
                    }
                }
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'save',
                    type: events.actionComplete
                }));
                break;
            case 'delete':
                if (isBlazor() && !this.parent.isJsComponent) {
                    var d = 'data';
                    e[d] = e[d][0];
                }
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'delete',
                    type: events.actionComplete
                }));
                if (!this.parent.isCheckBoxSelection) {
                    this.parent.selectRow(this.editRowIndex);
                }
                break;
        }
    };
    NormalEdit.prototype.startEdit = function (tr) {
        var _this = this;
        var gObj = this.parent;
        var primaryKeys = gObj.getPrimaryKeyFieldNames();
        var primaryKeyValues = [];
        this.rowIndex = this.editRowIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
        if (gObj.enableVirtualization || gObj.enableInfiniteScrolling) {
            var selector = '.e-row[aria-rowindex="' + this.rowIndex + '"]';
            var virtualRow = this.parent.element.querySelector(selector);
            if (!virtualRow) {
                return;
            }
        }
        if (isBlazor()) {
            var cols = this.parent.getColumns();
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (col.template) {
                    resetBlazorTemplate(gObj.element.id + col.uid, 'Template', this.rowIndex);
                }
            }
        }
        if (isGroupAdaptive(gObj)) {
            var rObj = gObj.getRowObjectFromUID(tr.getAttribute('data-uid'));
            this.previousData = rObj.data;
        }
        else if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
            var e = { data: this.previousData, index: this.rowIndex };
            this.parent.notify(events.virtualScrollEditActionBegin, e);
            this.previousData = e.data;
        }
        else {
            this.previousData = gObj.getCurrentViewRecords()[this.rowIndex];
        }
        for (var i = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(getObject(primaryKeys[i], this.previousData));
        }
        this.uid = tr.getAttribute('data-uid');
        var rowObj = gObj.getRowObjectFromUID(this.uid);
        var args = {
            primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues, requestType: 'beginEdit',
            rowData: this.previousData, rowIndex: this.rowIndex, type: 'edit', cancel: false,
            foreignKeyData: rowObj && rowObj.foreignKeyData, target: undefined
        };
        if (!isBlazor() || this.parent.isJsComponent) {
            args.row = tr;
        }
        gObj.trigger(events.beginEdit, args, function (begineditargs) {
            begineditargs.type = 'actionBegin';
            gObj.trigger(events.actionBegin, begineditargs, function (editargs) {
                if (!editargs.cancel) {
                    var cloneRow = 'cloneRow';
                    var frozen = 'frozen';
                    var cloneFrozen = 'cloneFrozen';
                    gObj.isEdit = true;
                    editargs.row = editargs.row ? editargs.row : tr;
                    if (isBlazor() && gObj.isServerRendered) {
                        _this.originalRow = editargs.row;
                        _this.cloneRow = editargs.row.cloneNode(true);
                        editargs[cloneRow] = _this.cloneRow;
                    }
                    if (gObj.editSettings.mode !== 'Dialog') {
                        gObj.clearSelection();
                    }
                    if (gObj.editSettings.mode === 'Dialog' && gObj.selectionModule) {
                        gObj.selectionModule.preventFocus = true;
                        editargs.row.classList.add('e-dlgeditrow');
                    }
                    _this.renderer.update(editargs);
                    if (isBlazor()) {
                        editargs.form = null;
                        _this.cloneFrozen = editargs[cloneFrozen];
                        _this.frozen = editargs[frozen];
                        _this.cloneRow = editargs[cloneRow];
                        _this.originalRow = editargs.row;
                    }
                    _this.uid = tr.getAttribute('data-uid');
                    gObj.editModule.applyFormValidation();
                    editargs.type = 'actionComplete';
                    gObj.trigger(events.actionComplete, editargs);
                    _this.args = editargs;
                    if (_this.parent.allowTextWrap) {
                        _this.parent.notify(events.freezeRender, { case: 'textwrap' });
                    }
                    if (isBlazor()) {
                        _this.parent.notify(events.toolbarRefresh, {});
                        gObj.element.querySelector('.e-gridpopup').style.display = 'none';
                        _this.parent.notify('start-edit', {});
                    }
                }
            });
        });
    };
    NormalEdit.prototype.updateRow = function (index, data) {
        var _this = this;
        var gObj = this.parent;
        this.editRowIndex = index;
        var args = {
            requestType: 'save', action: 'edit', type: events.actionBegin, data: data, cancel: false,
            previousData: gObj.getCurrentViewRecords()[index],
            row: gObj.getRowByIndex(index)
        };
        gObj.showSpinner();
        gObj.notify(events.updateData, args);
        if (args.promise) {
            args.promise.then(function () { return gObj.refresh(); }).catch(function (e) { return _this.edFail(e); });
        }
        else {
            gObj.refresh();
        }
    };
    NormalEdit.prototype.editFormValidate = function () {
        var gObj = this.parent;
        var form1 = gObj.editModule.formObj.validate();
        var form2 = gObj.editModule.mFormObj ? gObj.editModule.mFormObj.validate() : true;
        var form3 = gObj.editModule.frFormObj ? gObj.editModule.frFormObj.validate() : true;
        return (form1 && form2 && form3);
    };
    NormalEdit.prototype.endEdit = function () {
        var gObj = this.parent;
        if (!this.parent.isEdit || !this.editFormValidate()) {
            return;
        }
        var editedData = extend({}, {}, this.previousData, true);
        var args = extend(this.args, {
            requestType: 'save', type: events.actionBegin, data: editedData, cancel: false,
            previousData: this.previousData, selectedRow: gObj.selectedRowIndex, foreignKeyData: {}
        });
        var index = gObj.getFrozenMode() === 'Right' ? 1 : 0;
        var isDlg = gObj.editSettings.mode === 'Dialog';
        var dlgWrapper = select('#' + gObj.element.id + '_dialogEdit_wrapper', document);
        var dlgForm = isDlg ? dlgWrapper.querySelector('.e-gridform') : gObj.element.querySelectorAll('.e-gridform')[index];
        var data = { virtualData: {}, isAdd: false };
        this.parent.notify(events.getVirtualData, data);
        if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && this.parent.editSettings.mode === 'Normal' && !dlgForm) {
            if (this.parent.isEdit) {
                this.currentVirtualData = editedData = args.data = data.virtualData;
            }
        }
        else {
            editedData = gObj.editModule.getCurrentEditedData(dlgForm, editedData);
        }
        if (gObj.isFrozenGrid() && gObj.editSettings.mode === 'Normal') {
            var mhdrFrm = gObj.getMovableVirtualHeader().querySelector('.e-gridform');
            var mCntFrm = gObj.getMovableVirtualContent().querySelector('.e-gridform');
            var mvblEle = [mhdrFrm || mCntFrm];
            var frHdrFrm = void 0;
            var frCntFrm = void 0;
            var frEle = [];
            if (gObj.getFrozenMode() === 'Left-Right') {
                frHdrFrm = gObj.getFrozenRightHeader().querySelector('.e-gridform');
                frCntFrm = gObj.getFrozenRightContent().querySelector('.e-gridform');
                frEle = [frHdrFrm || frCntFrm];
            }
            gridActionHandler(this.parent, function (tableName, elements) {
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var ele = elements_1[_i];
                    if (ele) {
                        editedData = gObj.editModule.getCurrentEditedData(ele, editedData);
                    }
                }
            }, [[], mvblEle, frEle]);
        }
        if (isBlazor()) {
            var form = 'form';
            var movableForm = 'movableForm';
            args[form] = null;
            args[movableForm] = null;
            args.row = {};
        }
        var eleLength = [].slice.call(gObj.element.querySelectorAll('.e-editedrow')).length;
        if (!data.isAdd && Object.keys(this.currentVirtualData).length && !eleLength) {
            eleLength = 1;
        }
        if (isDlg ? dlgWrapper.querySelectorAll('.e-editedrow').length : eleLength) {
            args.action = 'edit';
            gObj.trigger(events.actionBegin, args, function (endEditArgs) {
                if (endEditArgs.cancel) {
                    return;
                }
                gObj.showSpinner();
                gObj.notify(events.updateData, endEditArgs);
            });
        }
        else {
            args.action = 'add';
            args.selectedRow = 0;
            args.index = this.addedRowIndex;
            gObj.notify(events.virtualScrollEditSuccess, {});
            gObj.notify(events.modelChanged, args);
            this.addedRowIndex = null;
            if (args.cancel) {
                return;
            }
        }
    };
    NormalEdit.prototype.destroyElements = function () {
        var gObj = this.parent;
        gObj.editModule.destroyWidgets();
        gObj.editModule.destroyForm();
        this.parent.notify(events.dialogDestroy, {});
    };
    NormalEdit.prototype.editHandler = function (args) {
        var _this = this;
        if (args.promise) {
            args.promise.then(function (e) { return _this.edSucc(e, args); }).catch(function (e) { return _this.edFail(e); });
        }
        else {
            this.editSuccess(args.data, args);
        }
    };
    NormalEdit.prototype.edSucc = function (e, args) {
        this.editSuccess(e, args);
    };
    NormalEdit.prototype.edFail = function (e) {
        if (isBlazor() && this.parent.isServerRendered) {
            var error = 'error';
            var message = 'message';
            if (!isNullOrUndefined(e[error]) && !isNullOrUndefined(e[error][message])) {
                e[error] = e[error][message];
            }
        }
        this.editFailure(e);
    };
    NormalEdit.prototype.updateCurrentViewData = function (data) {
        if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
            this.parent.getCurrentViewRecords()[this.editRowIndex] = data;
        }
    };
    NormalEdit.prototype.requestSuccess = function (args) {
        if (this.parent.editModule.formObj && !this.parent.editModule.formObj.isDestroyed) {
            this.destroyElements();
            this.stopEditStatus();
            if (this.parent.editSettings.mode === 'Dialog' && args.action !== 'add') {
                this.parent.element.querySelector('.e-dlgeditrow').classList.remove('e-dlgeditrow');
            }
        }
    };
    NormalEdit.prototype.editSuccess = function (e, args) {
        if (!isNullOrUndefined(e) && !(e instanceof Array)) {
            var rowData = 'rowData';
            args.data = extend({}, extend({}, args[rowData], args.data), e);
        }
        var editArgs;
        this.requestSuccess(args);
        this.parent.trigger(events.beforeDataBound, args);
        args.type = events.actionComplete;
        this.parent.isEdit = false;
        if (isBlazor() && this.parent.isServerRendered) {
            this.closeForm();
            var rowIndex = 'rowIndex';
            var action = 'action';
            var data = 'data';
            editArgs = { requestType: args.requestType,
                rowIndex: args[rowIndex], action: args[action], data: args[data] };
            this.parent.notify('editsuccess', editArgs);
        }
        else {
            this.refreshRow(args.data);
        }
        this.parent.notify(events.virtualScrollEditSuccess, args);
        this.parent.editModule.checkLastRow(args.row);
        this.parent.editModule.isLastRow = false;
        this.updateCurrentViewData(args.data);
        this.blazorTemplate();
        if (!(isBlazor() && this.parent.isServerRendered)) {
            this.editRowIndex = null;
            this.parent.trigger(events.actionComplete, args);
        }
        if (isBlazor()) {
            this.parent.notify(events.toolbarRefresh, {});
        }
        if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection) && !this.parent.selectionSettings.checkboxOnly) {
            if (this.parent.editSettings.mode !== 'Dialog') {
                if (isBlazor() && this.parent.isServerRendered) {
                    var rowIndex = 'editRowIndex';
                    editArgs[rowIndex] = this.rowIndex > -1 ? this.rowIndex : this.editRowIndex;
                }
                else {
                    this.parent.selectRow(this.rowIndex > -1 ? this.rowIndex : this.editRowIndex);
                }
            }
        }
        this.parent.hideSpinner();
    };
    NormalEdit.prototype.closeForm = function () {
        if (!this.cloneRow && this.parent.isEdit) {
            this.stopEditStatus();
        }
        if (this.cloneRow) {
            this.cloneRow.remove();
            this.cloneRow = null;
            this.originalRow.classList.remove('e-hiddenrow');
        }
        if (this.parent.isFrozenGrid() && this.cloneFrozen) {
            this.cloneFrozen.remove();
            this.frozen.classList.remove('e-hiddenrow');
        }
    };
    NormalEdit.prototype.blazorTemplate = function () {
        var cols = this.parent.getColumns();
        if (this.parent.editSettings.template && this.parent.editSettings.mode === 'Normal') {
            updateBlazorTemplate(this.parent.element.id + 'editSettingsTemplate', 'Template', this.parent.editSettings);
        }
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (col.template) {
                updateBlazorTemplate(this.parent.element.id + col.uid, 'Template', col, false);
            }
            if (col.editTemplate) {
                updateBlazorTemplate(this.parent.element.id + col.uid + 'editTemplate', 'EditTemplate', col);
            }
        }
    };
    NormalEdit.prototype.editFailure = function (e) {
        this.parent.trigger(events.actionFailure, ((isBlazor() && e instanceof Array) ? e[0] : { error: e }));
        this.parent.hideSpinner();
        this.parent.log('actionfailure', { error: e });
    };
    NormalEdit.prototype.needRefresh = function () {
        var refresh = true;
        var editedRow = this.parent.element.querySelector('.e-gridform');
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && this.parent.editSettings.mode === 'Normal' && !editedRow) {
            refresh = false;
        }
        return refresh;
    };
    NormalEdit.prototype.refreshRow = function (data) {
        var frzCols = this.parent.isFrozenGrid();
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        var rowObj = this.parent.getRowObjectFromUID(this.uid);
        if (rowObj) {
            rowObj.changes = data;
            this.parent.notify(events.refreshVirtualCache, data);
            refreshForeignData(rowObj, this.parent.getForeignKeyColumns(), rowObj.changes);
            if (this.needRefresh()) {
                row.refresh(rowObj, this.parent.getColumns(), true);
            }
            var tr = [].slice.call(this.parent.element.querySelectorAll('[aria-rowindex="' + rowObj.index + '"]'));
            if (frzCols && tr.length) {
                for (var i = 0; i < tr.length; i++) {
                    var rowUid = tr[i].getAttribute('data-uid');
                    if (rowUid !== this.uid) {
                        rowObj = this.parent.getRowObjectFromUID(rowUid);
                        rowObj.changes = data;
                        row.refresh(rowObj, this.parent.getColumns(), true);
                        this.parent.editModule.checkLastRow(tr[i]);
                    }
                }
            }
        }
    };
    NormalEdit.prototype.closeEdit = function () {
        var _this = this;
        if (!this.parent.isEdit) {
            return;
        }
        var gObj = this.parent;
        var args = extend(this.args, {
            requestType: 'cancel', type: events.actionBegin, cancel: false, data: this.previousData, selectedRow: gObj.selectedRowIndex
        });
        gObj.notify(events.virtualScrollEditCancel, args);
        this.blazorTemplate();
        if (isBlazor()) {
            var form = 'form';
            args[form] = null;
        }
        gObj.trigger(events.actionBegin, args, function (closeEditArgs) {
            if (closeEditArgs.cancel) {
                return;
            }
            if (_this.parent.editSettings.mode === 'Dialog') {
                _this.parent.notify(events.dialogDestroy, {});
            }
            gObj.isEdit = false;
            _this.stopEditStatus();
            closeEditArgs.type = events.actionComplete;
            if (gObj.editSettings.mode !== 'Dialog') {
                if (isBlazor() && gObj.isServerRendered) {
                    _this.closeForm();
                }
                else {
                    _this.refreshRow(closeEditArgs.data);
                }
            }
            var isLazyLoad = gObj.groupSettings.enableLazyLoading && gObj.groupSettings.columns.length
                && !gObj.getContentTable().querySelector('tr.e-emptyrow');
            if (!gObj.getContentTable().querySelector('tr.e-emptyrow') &&
                !gObj.getContentTable().querySelector('tr.e-row') && !isLazyLoad) {
                gObj.renderModule.emptyRow();
            }
            if (gObj.editSettings.mode !== 'Dialog') {
                gObj.selectRow(_this.rowIndex);
            }
            gObj.trigger(events.actionComplete, closeEditArgs);
            if (isBlazor()) {
                _this.parent.notify(events.toolbarRefresh, {});
                _this.parent.notify('close-edit', {});
            }
        });
    };
    NormalEdit.prototype.addRecord = function (data, index) {
        var _this = this;
        var gObj = this.parent;
        this.addedRowIndex = index = !isNullOrUndefined(index) ? index : 0;
        if (data) {
            gObj.notify(events.modelChanged, {
                requestType: 'save', type: events.actionBegin, data: data, selectedRow: 0, action: 'add', index: index
            });
            return;
        }
        if (gObj.isEdit) {
            return;
        }
        this.previousData = {};
        this.uid = '';
        var cols = (gObj.columnModel);
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].field) {
                DataUtil.setValue(cols[i].field, cols[i].defaultValue, this.previousData);
            }
        }
        var args = {
            cancel: false, foreignKeyData: {},
            requestType: 'add', data: this.previousData, type: events.actionBegin, index: index,
            rowData: this.previousData, target: undefined
        };
        var rowData = { virtualData: {} };
        this.parent.notify(events.getVirtualData, rowData);
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && Object.keys(rowData.virtualData).length) {
            args.data = args.rowData = rowData.virtualData;
        }
        if (isBlazor()) {
            var form = 'form';
            args[form] = null;
        }
        gObj.trigger(events.actionBegin, args, function (addArgs) {
            if (addArgs.cancel) {
                return;
            }
            gObj.isEdit = true;
            if (gObj.editSettings.mode !== 'Dialog') {
                gObj.clearSelection();
            }
            _this.renderer.addNew(addArgs);
            gObj.editModule.applyFormValidation();
            addArgs.type = events.actionComplete;
            addArgs.row = gObj.element.querySelector('.e-addedrow');
            gObj.trigger(events.actionComplete, addArgs);
            if (isBlazor()) {
                _this.parent.notify(events.toolbarRefresh, {});
                _this.parent.notify('start-add', {});
            }
            _this.args = addArgs;
        });
    };
    NormalEdit.prototype.deleteRecord = function (fieldname, data) {
        this.editRowIndex = this.parent.selectedRowIndex;
        if (data) {
            data = (data instanceof Array) ? data : [data];
            var gObj = this.parent;
            var index = 0;
            var dataLen = Object.keys(data).length;
            fieldname = fieldname || this.parent.getPrimaryKeyFieldNames()[0];
            var _loop_1 = function (i) {
                var _a;
                var tmpRecord;
                var contained = gObj.currentViewData.some(function (record) {
                    tmpRecord = record;
                    return data[i] === getObject(fieldname, record) || data[i] === record;
                });
                data[i] = contained ? tmpRecord : (_a = {}, _a[fieldname] = data[i], _a);
            };
            for (var i = 0; i < dataLen; i++) {
                _loop_1(i);
            }
        }
        var args = {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: {},
            data: data ? data : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows(), cancel: false
        };
        if (!isNullOrUndefined(this.parent.commandDelIndex)) {
            args.data[0] =
                this.parent.getRowObjectFromUID(this.parent.getRowByIndex(this.parent.commandDelIndex).getAttribute('data-uid')).data;
        }
        if (this.parent.enableVirtualization && args.data.length > 1) {
            var uid = this.parent.getSelectedRows()[0].getAttribute('data-uid');
            args.data = [this.parent.getRowObjectFromUID(uid).data];
        }
        var dataInString = 'data';
        if (isBlazor() && !this.parent.isJsComponent) {
            args[dataInString] = args[dataInString][0];
        }
        this.parent.notify(events.modelChanged, args);
    };
    NormalEdit.prototype.stopEditStatus = function () {
        var gObj = this.parent;
        var addElements = [].slice.call(gObj.element.querySelectorAll('.e-addedrow'));
        var editElements = [].slice.call(gObj.element.querySelectorAll('.e-editedrow'));
        for (var i = 0; i < addElements.length; i++) {
            remove(addElements[i]);
        }
        for (var i = 0; i < editElements.length; i++) {
            editElements[i].classList.remove('e-editedrow');
        }
    };
    /**
     * @hidden
     */
    NormalEdit.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.crudAction, this.editHandler, this);
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.recordAdded, this.requestSuccess, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.deleteComplete, this.editComplete, this);
        this.parent.on(events.saveComplete, this.editComplete, this);
        this.parent.on('closeinline', this.closeForm, this);
    };
    /**
     * @hidden
     */
    NormalEdit.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.crudAction, this.editHandler);
        this.parent.off(events.doubleTap, this.dblClickHandler);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.recordAdded, this.requestSuccess);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.deleteComplete, this.editComplete);
        this.parent.off(events.saveComplete, this.editComplete);
        this.parent.off('closeinline', this.closeForm);
    };
    /**
     * @hidden
     */
    NormalEdit.prototype.destroy = function () {
        this.removeEventListener();
        this.renderer.destroy();
    };
    return NormalEdit;
}());
export { NormalEdit };
