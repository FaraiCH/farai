import { Draggable, Droppable, isBlazor } from '@syncfusion/ej2-base';
import { createElement, closest, remove, classList, addClass, removeClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { parentsUntil, isActionPrevent, isGroupAdaptive, updatecloneRow } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
import { GroupModelGenerator } from '../services/group-model-generator';
import { DataUtil } from '@syncfusion/ej2-data';
/**
 *
 * The `Group` module is used to handle group action.
 */
var Group = /** @class */ (function () {
    /**
     * Constructor for Grid group module
     * @hidden
     */
    function Group(parent, groupSettings, sortedColumns, serviceLocator) {
        var _this = this;
        //Internal variables
        this.sortRequired = true;
        this.isAppliedGroup = false;
        this.isAppliedUnGroup = false;
        this.reorderingColumns = [];
        this.visualElement = createElement('div', {
            className: 'e-cloneproperties e-dragclone e-gdclone',
            styles: 'line-height:23px', attrs: { action: 'grouping' }
        });
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = e.sender.target;
            var element = target.classList.contains('e-groupheadercell') ? target :
                parentsUntil(target, 'e-groupheadercell');
            if (!element || (!target.classList.contains('e-drag') && _this.groupSettings.allowReordering)) {
                return false;
            }
            _this.column = gObj.getColumnByField(element.firstElementChild.getAttribute('ej-mappingname'));
            _this.visualElement.textContent = element.textContent;
            _this.visualElement.style.width = element.offsetWidth + 2 + 'px';
            _this.visualElement.style.height = element.offsetHeight + 2 + 'px';
            _this.visualElement.setAttribute('e-mappinguid', _this.column.uid);
            gObj.element.appendChild(_this.visualElement);
            return _this.visualElement;
        };
        this.dragStart = function (e) {
            _this.parent.element.classList.add('e-ungroupdrag');
            if (isBlazor()) {
                e.bindEvents(e.dragElement);
            }
        };
        this.drag = function (e) {
            if (_this.groupSettings.allowReordering) {
                _this.animateDropper(e);
            }
            var target = e.target;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            _this.parent.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: _this.column });
            if (!_this.groupSettings.allowReordering) {
                classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                if (!(parentsUntil(target, 'e-gridcontent') || parentsUntil(target, 'e-headercell'))) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
            }
        };
        this.dragStop = function (e) {
            _this.parent.element.classList.remove('e-ungroupdrag');
            var preventDrop = !(parentsUntil(e.target, 'e-gridcontent') || parentsUntil(e.target, 'e-gridheader'));
            if (_this.groupSettings.allowReordering && preventDrop) {
                remove(e.helper);
                if (parentsUntil(e.target, 'e-groupdroparea')) {
                    _this.rearrangeGroup(e);
                }
                else if (!(parentsUntil(e.target, 'e-grid'))) {
                    var field = _this.parent.getColumnByUid(e.helper.getAttribute('e-mappinguid')).field;
                    if (_this.groupSettings.columns.indexOf(field) !== -1) {
                        _this.ungroupColumn(field);
                    }
                }
                return;
            }
            else if (preventDrop) {
                remove(e.helper);
                return;
            }
        };
        this.animateDropper = function (e) {
            var uid = _this.parent.element.querySelector('.e-cloneproperties').getAttribute('e-mappinguid');
            var dragField = _this.parent.getColumnByUid(uid).field;
            var parent = parentsUntil(e.target, 'e-groupdroparea');
            var dropTarget = parentsUntil(e.target, 'e-group-animator');
            // tslint:disable-next-line
            var grouped = [].slice.call(_this.element.querySelectorAll('.e-groupheadercell'))
                .map(function (e) { return e.querySelector('div').getAttribute('ej-mappingname'); });
            var cols = JSON.parse(JSON.stringify(grouped));
            if (dropTarget || parent) {
                if (dropTarget) {
                    var dropField = dropTarget.querySelector('div[ej-mappingname]').getAttribute('ej-mappingname');
                    var dropIndex = +(dropTarget.getAttribute('index'));
                    if (dropField !== dragField) {
                        var dragIndex = cols.indexOf(dragField);
                        if (dragIndex !== -1) {
                            cols.splice(dragIndex, 1);
                        }
                        var flag = dropIndex !== -1 && dragIndex === dropIndex;
                        cols.splice(dropIndex + (flag ? 1 : 0), 0, dragField);
                    }
                }
                else if (parent && cols.indexOf(dragField) === -1) {
                    cols.push(dragField);
                }
                _this.element.innerHTML = '';
                if (cols.length && !_this.element.classList.contains('e-grouped')) {
                    _this.element.classList.add('e-grouped');
                }
                _this.reorderingColumns = cols;
                for (var c = 0; c < cols.length; c++) {
                    _this.addColToGroupDrop(cols[c]);
                }
            }
            else {
                _this.addLabel();
                _this.removeColFromGroupDrop(dragField);
            }
        };
        this.drop = function (e) {
            var gObj = _this.parent;
            var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
            _this.element.classList.remove('e-hover');
            remove(e.droppedElement);
            _this.aria.setDropTarget(_this.parent.element.querySelector('.e-groupdroparea'), false);
            _this.aria.setGrabbed(_this.parent.getHeaderTable().querySelector('[aria-grabbed=true]'), false);
            if (isNullOrUndefined(column) || column.allowGrouping === false ||
                parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                    gObj.element.getAttribute('id')) {
                _this.parent.log('action_disabled_column', { moduleName: _this.getModuleName(), columnName: column.headerText });
                return;
            }
            _this.groupColumn(column.field);
        };
        this.contentRefresh = true;
        this.aria = new AriaService();
        this.parent = parent;
        this.groupSettings = groupSettings;
        this.serviceLocator = serviceLocator;
        this.sortedColumns = sortedColumns;
        this.focus = serviceLocator.getService('focus');
        this.addEventListener();
        this.groupGenerator = new GroupModelGenerator(this.parent);
    }
    Group.prototype.addLabel = function () {
        if (!this.element.querySelectorAll('.e-group-animator').length) {
            var dragLabel = this.l10n.getConstant('GroupDropArea');
            this.element.innerHTML = dragLabel;
            this.element.classList.remove('e-grouped');
        }
    };
    Group.prototype.rearrangeGroup = function (e) {
        this.sortRequired = false;
        this.updateModel();
    };
    Group.prototype.columnDrag = function (e) {
        if (this.groupSettings.allowReordering) {
            this.animateDropper(e);
        }
        var gObj = this.parent;
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        if (!parentsUntil(e.target, 'e-groupdroparea') &&
            !(this.parent.allowReordering && parentsUntil(e.target, 'e-headercell'))) {
            classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
        }
        e.target.classList.contains('e-groupdroparea') ? this.element.classList.add('e-hover') : this.element.classList.remove('e-hover');
    };
    Group.prototype.columnDragStart = function (e) {
        if (e.target.classList.contains('e-stackedheadercell')) {
            return;
        }
        var gObj = this.parent;
        var dropArea = this.parent.element.querySelector('.e-groupdroparea');
        this.aria.setDropTarget(dropArea, e.column.allowGrouping);
        var element = e.target.classList.contains('e-headercell') ? e.target : parentsUntil(e.target, 'e-headercell');
        this.aria.setGrabbed(element, true, !e.column.allowGrouping);
    };
    Group.prototype.columnDrop = function (e) {
        var gObj = this.parent;
        if (e.droppedElement.getAttribute('action') === 'grouping') {
            var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
            if (isNullOrUndefined(column) || column.allowGrouping === false ||
                parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                    gObj.element.getAttribute('id')) {
                return;
            }
            this.ungroupColumn(column.field);
        }
    };
    /**
     * @hidden
     */
    Group.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.groupComplete, this.onActionComplete, this);
        this.parent.on(events.ungroupComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.columnDrag, this.columnDrag, this);
        this.parent.on(events.columnDragStart, this.columnDragStart, this);
        this.parent.on(events.headerDrop, this.columnDrop, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
        this.parent.on(events.sortComplete, this.refreshSortIcons, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.onEmpty, this.initialEnd, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.groupAggregates, this.onGroupAggregates, this);
        this.parent.on('blazor-action-begin', this.blazorActionBegin, this);
        this.parent.on('group-expand-collapse', this.updateExpand, this);
        this.parent.on('persist-data-changed', this.initialEnd, this);
    };
    /**
     * @hidden
     */
    Group.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.groupComplete, this.onActionComplete);
        this.parent.off(events.ungroupComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.columnDrag, this.columnDrag);
        this.parent.off(events.columnDragStart, this.columnDragStart);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.off(events.headerDrop, this.columnDrop);
        this.parent.off(events.headerRefreshed, this.refreshSortIcons);
        this.parent.off(events.sortComplete, this.refreshSortIcons);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.groupAggregates, this.onGroupAggregates);
        this.parent.off('blazor-action-begin', this.blazorActionBegin);
        this.parent.off('group-expand-collapse', this.updateExpand);
    };
    Group.prototype.blazorActionBegin = function () {
        if (this.parent.allowGrouping && !this.parent.isCollapseStateEnabled()) {
            this.expandAll();
        }
    };
    Group.prototype.initialEnd = function () {
        var gObj = this.parent;
        this.parent.off(events.contentReady, this.initialEnd);
        this.parent.off(events.onEmpty, this.initialEnd);
        if (isBlazor() && gObj.isServerRendered) {
            for (var i = 0; i < gObj.columns.length; i++) {
                this.removeColFromGroupDrop(gObj.columns[i].field);
            }
            this.updateGroupDropArea();
        }
        if (this.parent.getColumns().length && this.groupSettings.columns.length) {
            this.contentRefresh = false;
            for (var _i = 0, _a = gObj.groupSettings.columns; _i < _a.length; _i++) {
                var col = _a[_i];
                this.groupColumn(col);
            }
            this.contentRefresh = true;
        }
    };
    Group.prototype.keyPressHandler = function (e) {
        var gObj = this.parent;
        if (e.action !== 'ctrlSpace' && (!this.groupSettings.columns.length ||
            ['altDownArrow', 'altUpArrow', 'ctrlDownArrow', 'ctrlUpArrow', 'enter'].indexOf(e.action) === -1)) {
            return;
        }
        e.preventDefault();
        switch (e.action) {
            case 'altDownArrow':
            case 'altUpArrow':
                var selected = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                if (selected.length) {
                    var rows = gObj.getContentTable().querySelector('tbody').children;
                    var dataRow = gObj.getDataRows()[selected[selected.length - 1]];
                    var grpRow = void 0;
                    for (var i = dataRow.rowIndex; i >= 0; i--) {
                        if (!rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-detailrow')) {
                            grpRow = rows[i];
                            break;
                        }
                    }
                    this.expandCollapseRows(grpRow.querySelector(e.action === 'altUpArrow' ?
                        '.e-recordplusexpand' : '.e-recordpluscollapse'));
                }
                break;
            case 'ctrlDownArrow':
                this.expandAll();
                break;
            case 'ctrlUpArrow':
                this.collapseAll();
                break;
            case 'enter':
                if (this.parent.isEdit || (closest(e.target, '#' + this.parent.element.id + '_searchbar') !== null)) {
                    return;
                }
                var element = this.focus.getFocusedElement();
                var row = element ? element.parentElement.querySelector('[class^="e-record"]') : null;
                if (!row) {
                    break;
                }
                this.expandCollapseRows(row);
                break;
            case 'ctrlSpace':
                var elem = gObj.focusModule.currentInfo.element;
                if (elem && elem.classList.contains('e-headercell')) {
                    var column = gObj.getColumnByUid(elem.firstElementChild.getAttribute('e-mappinguid'));
                    column.field && gObj.groupSettings.columns.indexOf(column.field) < 0 ?
                        this.groupColumn(column.field) : this.ungroupColumn(column.field);
                }
                break;
        }
    };
    Group.prototype.clickHandler = function (e) {
        this.expandCollapseRows(e.target);
        this.applySortFromTarget(e.target);
        this.unGroupFromTarget(e.target);
        this.toogleGroupFromHeader(e.target);
    };
    Group.prototype.unGroupFromTarget = function (target) {
        if (target.classList.contains('e-ungroupbutton')) {
            this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
        }
    };
    Group.prototype.toogleGroupFromHeader = function (target) {
        if (this.groupSettings.showToggleButton) {
            if (target.classList.contains('e-grptogglebtn')) {
                if (target.classList.contains('e-toggleungroup')) {
                    this.ungroupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                }
                else {
                    this.groupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                }
            }
            else {
                if (target.classList.contains('e-toggleungroup')) {
                    this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
                }
            }
        }
    };
    Group.prototype.applySortFromTarget = function (target) {
        var gObj = this.parent;
        var gHeader = closest(target, '.e-groupheadercell');
        if (gObj.allowSorting && gHeader && !target.classList.contains('e-ungroupbutton') &&
            !target.classList.contains('e-toggleungroup')) {
            var field = gHeader.firstElementChild.getAttribute('ej-mappingname');
            if (gObj.getColumnHeaderByField(field).querySelectorAll('.e-ascending').length) {
                gObj.sortColumn(field, 'Descending', true);
            }
            else {
                gObj.sortColumn(field, 'Ascending', true);
            }
        }
    };
    /**
     * Expands or collapses grouped rows by target element.
     * @param  {Element} target - Defines the target element of the grouped row.
     * @return {void}
     */
    Group.prototype.expandCollapseRows = function (target) {
        var trgt = parentsUntil(target, 'e-recordplusexpand') ||
            parentsUntil(target, 'e-recordpluscollapse');
        if (trgt) {
            var cellIdx = trgt.cellIndex;
            var rowIdx = trgt.parentElement.rowIndex;
            var rowNodes = this.parent.getContentTable().querySelector('tbody').children;
            var rows = [].slice.call(rowNodes).slice(rowIdx + 1, rowNodes.length);
            var isHide = void 0;
            var expandElem = void 0;
            var dataManager = void 0;
            var query = void 0;
            var toExpand = [];
            var gObj = this.parent;
            var indent = trgt.parentElement.querySelectorAll('.e-indentcell').length;
            var expand = false;
            if (isBlazor() && this.parent.isCollapseStateEnabled()) {
                this.parent.notify('group-expand-collapse', {
                    uid: trgt.parentElement.getAttribute('data-uid'),
                    isExpand: trgt.classList.contains('e-recordpluscollapse')
                });
                return;
            }
            if (trgt.classList.contains('e-recordpluscollapse')) {
                addClass([trgt], 'e-recordplusexpand');
                removeClass([trgt], 'e-recordpluscollapse');
                trgt.firstElementChild.className = 'e-icons e-gdiagonaldown e-icon-gdownarrow';
                expand = true;
                if (isGroupAdaptive(gObj)) {
                    this.updateVirtualRows(gObj, target, expand, query, dataManager);
                }
                if (this.parent.groupSettings.enableLazyLoading) {
                    this.parent.contentModule.captionExpand(trgt.parentElement);
                }
            }
            else {
                isHide = true;
                removeClass([trgt], 'e-recordplusexpand');
                addClass([trgt], 'e-recordpluscollapse');
                trgt.firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                if (isGroupAdaptive(gObj)) {
                    this.updateVirtualRows(gObj, target, !isHide, query, dataManager);
                }
                if (this.parent.groupSettings.enableLazyLoading) {
                    this.parent.contentModule.captionCollapse(trgt.parentElement);
                }
            }
            this.aria.setExpand(trgt, expand);
            if (!isGroupAdaptive(gObj) && !this.parent.groupSettings.enableLazyLoading) {
                for (var i = 0, len = rows.length; i < len; i++) {
                    if (rows[i].querySelectorAll('td')[cellIdx] &&
                        rows[i].querySelectorAll('td')[cellIdx].classList.contains('e-indentcell') && rows) {
                        if (isHide) {
                            rows[i].style.display = 'none';
                        }
                        else {
                            if (rows[i].querySelectorAll('.e-indentcell').length === indent + 1) {
                                rows[i].style.display = '';
                                expandElem = rows[i].querySelector('.e-recordplusexpand');
                                if (expandElem) {
                                    toExpand.push(expandElem);
                                }
                                if (rows[i].classList.contains('e-detailrow')) {
                                    if (rows[i - 1].querySelectorAll('.e-detailrowcollapse').length) {
                                        rows[i].style.display = 'none';
                                    }
                                }
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            for (var i = 0, len = toExpand.length; i < len; i++) {
                removeClass([toExpand[i]], 'e-recordplusexpand');
                addClass([toExpand[i]], 'e-recordpluscollapse');
                toExpand[i].firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                this.expandCollapseRows(toExpand[i]);
            }
        }
    };
    Group.prototype.updateVirtualRows = function (gObj, target, isExpand, query, dataManager) {
        var rObj = gObj.getRowObjectFromUID(target.closest('tr').getAttribute('data-uid'));
        rObj.isExpand = isExpand;
        updatecloneRow(gObj);
        query = gObj.getDataModule().generateQuery(false);
        query.queries = gObj.getDataModule().aggregateQuery(gObj.getQuery().clone()).queries;
        var args = { requestType: 'virtualscroll', rowObject: rObj };
        dataManager = gObj.getDataModule().getData(args, query.requiresCount());
        dataManager.then(function (e) { return gObj.renderModule.dataManagerSuccess(e, args); });
    };
    Group.prototype.expandCollapse = function (isExpand) {
        if (isBlazor() && this.parent.isCollapseStateEnabled()) {
            this.parent.notify('group-expand-collapse', { isExpand: isExpand });
            return;
        }
        if (!isExpand) {
            this.parent.notify(events.initialCollapse, isExpand);
        }
        var rowNodes = this.parent.getContentTable().querySelector('tbody').children;
        var row;
        for (var i = 0, len = rowNodes.length; i < len; i++) {
            if (rowNodes[i].querySelectorAll('.e-recordplusexpand, .e-recordpluscollapse').length) {
                row = rowNodes[i].querySelector(isExpand ? '.e-recordpluscollapse' : '.e-recordplusexpand');
                if (row) {
                    row.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
                    row.firstElementChild.className = isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' :
                        'e-icons e-gnextforward e-icon-grightarrow';
                }
                if (!(rowNodes[i].firstElementChild.classList.contains('e-recordplusexpand') ||
                    rowNodes[i].firstElementChild.classList.contains('e-recordpluscollapse'))) {
                    rowNodes[i].style.display = isExpand ? '' : 'none';
                }
            }
            else {
                rowNodes[i].style.display = isExpand ? '' : 'none';
            }
        }
    };
    /**
     * Expands all the grouped rows of the Grid.
     * @return {void}
     */
    Group.prototype.expandAll = function () {
        this.expandCollapse(true);
    };
    /**
     * Collapses all the grouped rows of the Grid.
     * @return {void}
     */
    Group.prototype.collapseAll = function () {
        this.expandCollapse(false);
    };
    /**
     * The function is used to render grouping
     * @return {Element}
     * @hidden
     */
    Group.prototype.render = function () {
        this.l10n = this.serviceLocator.getService('localization');
        this.renderGroupDropArea();
        this.initDragAndDrop();
        this.refreshToggleBtn();
    };
    Group.prototype.renderGroupDropArea = function () {
        var groupElem = this.parent.element.querySelector('.e-groupdroparea');
        if (groupElem) {
            remove(groupElem);
        }
        this.element = this.parent.createElement('div', { className: 'e-groupdroparea', attrs: { 'tabindex': '-1' } });
        if (this.groupSettings.allowReordering) {
            this.element.classList.add('e-group-animate');
        }
        this.updateGroupDropArea();
        this.parent.element.insertBefore(this.element, this.parent.element.firstChild);
        if (!this.groupSettings.showDropArea) {
            this.element.style.display = 'none';
        }
    };
    Group.prototype.updateGroupDropArea = function (clear) {
        if (this.groupSettings.showDropArea && !this.groupSettings.columns.length) {
            var dragLabel = this.l10n.getConstant('GroupDropArea');
            this.element.innerHTML = dragLabel;
            this.element.classList.remove('e-grouped');
        }
        else {
            if ((this.element.innerHTML === this.l10n.getConstant('GroupDropArea') && (this.groupSettings.columns.length === 1
                || !this.isAppliedGroup && !this.isAppliedUnGroup)) || clear) {
                this.element.innerHTML = '';
            }
            this.element.classList.add('e-grouped');
        }
    };
    Group.prototype.initDragAndDrop = function () {
        this.initializeGHeaderDrop();
        this.initializeGHeaderDrag();
    };
    Group.prototype.initializeGHeaderDrag = function () {
        var drag = new Draggable(this.element, {
            dragTarget: this.groupSettings.allowReordering ? '.e-drag' : '.e-groupheadercell',
            distance: this.groupSettings.allowReordering ? -10 : 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
    };
    Group.prototype.initializeGHeaderDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(this.element, {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    /**
     * Groups a column by column name.
     * @param  {string} columnName - Defines the column name to group.
     * @return {void}
     */
    Group.prototype.groupColumn = function (columnName) {
        var gObj = this.parent;
        var column = gObj.getColumnByField(columnName);
        if (isNullOrUndefined(column) || column.allowGrouping === false ||
            (this.contentRefresh && this.groupSettings.columns.indexOf(columnName) > -1)) {
            this.parent.log('action_disabled_column', { moduleName: this.getModuleName(), columnName: column.headerText });
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.groupColumn, arg1: columnName });
            return;
        }
        column.visible = gObj.groupSettings.showGroupedColumn;
        this.colName = columnName;
        this.isAppliedGroup = true;
        if (this.contentRefresh) {
            this.updateModel();
        }
        else {
            this.addColToGroupDrop(columnName);
        }
        this.updateGroupDropArea();
        this.isAppliedGroup = false;
    };
    /**
     * Ungroups a column by column name.
     * @param  {string} columnName - Defines the column name to ungroup.
     * @return {void}
     */
    Group.prototype.ungroupColumn = function (columnName) {
        var gObj = this.parent;
        var column = this.parent.enableColumnVirtualization ?
            this.parent.columns.filter(function (c) { return c.field === columnName; })[0] : gObj.getColumnByField(columnName);
        if (isNullOrUndefined(column) || column.allowGrouping === false || this.groupSettings.columns.indexOf(columnName) < 0) {
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, { instance: this, handler: this.ungroupColumn, arg1: columnName });
            return;
        }
        column.visible = true;
        if (isBlazor() && gObj.isServerRendered) {
            var setVisible = [];
            setVisible[0] = column;
            this.parent.notify('setvisibility', setVisible);
        }
        this.colName = column.field;
        var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
        columns.splice(columns.indexOf(this.colName), 1);
        if (this.sortedColumns.indexOf(columnName) < 0) {
            for (var i = 0, len = gObj.sortSettings.columns.length; i < len; i++) {
                if (columnName === gObj.sortSettings.columns[i].field) {
                    gObj.sortSettings.columns.splice(i, 1);
                    break;
                }
            }
        }
        var isServerRendered = 'isServerRendered';
        if (isBlazor() && this.parent[isServerRendered]) {
            gObj.sortSettings.columns = gObj.sortSettings.columns;
        }
        if (this.groupSettings.allowReordering) {
            this.reorderingColumns = columns;
        }
        this.groupSettings.columns = columns;
        if (gObj.allowGrouping) {
            this.isAppliedUnGroup = true;
            this.parent.dataBind();
        }
    };
    /**
     * The function used to update groupSettings
     * @return {void}
     * @hidden
     */
    Group.prototype.updateModel = function () {
        var gObj = this.parent;
        var i = 0;
        var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
        columns = this.reorderingColumns.length ? JSON.parse(JSON.stringify(this.reorderingColumns)) : columns;
        if (this.sortRequired) {
            if (columns.indexOf(this.colName) === -1) {
                columns.push(this.colName);
            }
            this.groupAddSortingQuery(this.colName);
        }
        this.sortRequired = true;
        this.parent.groupSettings.columns = columns;
        this.parent.dataBind();
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Group.prototype.onActionComplete = function (e) {
        if (isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        var gObj = this.parent;
        if (e.requestType === 'grouping') {
            this.addColToGroupDrop(this.colName);
        }
        else {
            this.removeColFromGroupDrop(this.colName);
        }
        var args = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
            columnName: this.colName, requestType: 'grouping', type: events.actionComplete
        } : { requestType: 'ungrouping', type: events.actionComplete };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.colName = null;
    };
    Group.prototype.groupAddSortingQuery = function (colName) {
        var i = 0;
        while (i < this.parent.sortSettings.columns.length) {
            if (this.parent.sortSettings.columns[i].field === colName) {
                break;
            }
            i++;
        }
        if (this.parent.sortSettings.columns.length === i) {
            this.parent.sortSettings.columns.push({ field: colName, direction: 'Ascending', isFromGroup: true });
            var isServerRendered = 'isServerRendered';
            if (isBlazor() && this.parent[isServerRendered]) {
                this.parent.sortSettings.columns = this.parent.sortSettings.columns;
            }
        }
        else if (!this.parent.allowSorting) {
            this.parent.sortSettings.columns[i].direction = 'Ascending';
        }
    };
    Group.prototype.createElement = function (field) {
        var gObj = this.parent;
        var direction = 'Ascending';
        var animator = this.parent.createElement('div', { className: 'e-grid-icon e-group-animator' });
        var groupedColumn = this.parent.createElement('div', { className: 'e-grid-icon e-groupheadercell' });
        var childDiv = this.parent.createElement('div', { attrs: { 'ej-mappingname': field } });
        var column = this.parent.getColumnByField(field);
        //Todo headerTemplateID for grouped column, disableHtmlEncode                          
        var headerCell = gObj.getColumnHeaderByUid(column.uid);
        // if (!isNullOrUndefined(column.headerTemplate)) {
        //     if (column.headerTemplate.indexOf('#') !== -1) {
        //         childDiv.innerHTML = document.querySelector(column.headerTemplate).innerHTML.trim();
        //     } else {
        //         childDiv.innerHTML = column.headerTemplate;
        //     }
        //     childDiv.firstElementChild.classList.add('e-grouptext');
        // } else {
        if (this.groupSettings.allowReordering) {
            childDiv.appendChild(this.parent.createElement('span', {
                className: 'e-drag e-icons e-icon-drag', innerHTML: '&nbsp;',
                attrs: { title: 'Drag', tabindex: '-1', 'aria-label': 'Drag the grouped column' }
            }));
        }
        childDiv.appendChild(this.parent.createElement('span', {
            className: 'e-grouptext', innerHTML: column.headerText,
            attrs: { tabindex: '-1', 'aria-label': 'sort the grouped column' }
        }));
        // }
        if (this.groupSettings.showToggleButton) {
            childDiv.appendChild(this.parent.createElement('span', {
                className: 'e-togglegroupbutton e-icons e-icon-ungroup e-toggleungroup', innerHTML: '&nbsp;',
                attrs: { tabindex: '-1', 'aria-label': 'ungroup button' }
            }));
        }
        if (headerCell.querySelectorAll('.e-ascending,.e-descending').length) {
            direction = headerCell.querySelector('.e-ascending') ? 'Ascending' : 'Descending';
        }
        childDiv.appendChild(this.parent.createElement('span', {
            className: 'e-groupsort e-icons ' +
                ('e-' + direction.toLowerCase() + ' e-icon-' + direction.toLowerCase()), innerHTML: '&nbsp;',
            attrs: { tabindex: '-1', 'aria-label': 'sort the grouped column' }
        }));
        childDiv.appendChild(this.parent.createElement('span', {
            className: 'e-ungroupbutton e-icons e-icon-hide', innerHTML: '&nbsp;',
            attrs: { title: isBlazor() ? this.l10n.getConstant('UnGroupButton') : this.l10n.getConstant('UnGroup'),
                tabindex: '-1', 'aria-label': 'ungroup the grouped column' },
            styles: this.groupSettings.showUngroupButton ? '' : 'display:none'
        }));
        groupedColumn.appendChild(childDiv);
        var index = this.groupSettings.columns.indexOf(field);
        if (this.groupSettings.allowReordering) {
            animator.appendChild(groupedColumn);
            animator.appendChild(this.createSeparator());
            groupedColumn = animator;
        }
        return groupedColumn;
    };
    Group.prototype.addColToGroupDrop = function (field) {
        if (this.groupSettings.allowReordering
            && this.parent.element.querySelector('.e-groupdroparea div[ej-mappingname=' + field + ']')) {
            return;
        }
        var column = this.parent.getColumnByField(field);
        if (isNullOrUndefined(column)) {
            return;
        }
        var groupedColumn = this.createElement(field);
        if (this.groupSettings.allowReordering) {
            var index = this.element.querySelectorAll('.e-group-animator').length;
            groupedColumn.setAttribute('index', index.toString());
        }
        this.element.appendChild(groupedColumn);
        //Todo:  rtl 
    };
    Group.prototype.createSeparator = function () {
        return this.parent.createElement('span', {
            className: 'e-nextgroup e-icons e-icon-next', innerHTML: '&nbsp;',
            attrs: { tabindex: '-1', 'aria-label': 'Separator for the grouped columns' },
            styles: this.groupSettings.showUngroupButton ? '' : 'display:none'
        });
    };
    Group.prototype.refreshToggleBtn = function (isRemove) {
        if (this.groupSettings.showToggleButton) {
            var headers = [].slice.call(this.parent.getHeaderTable().getElementsByClassName('e-headercelldiv'));
            for (var i = 0, len = headers.length; i < len; i++) {
                if (!((headers[i].classList.contains('e-emptycell')) || (headers[i].classList.contains('e-headerchkcelldiv')))) {
                    var column = this.parent.getColumnByUid(headers[i].getAttribute('e-mappinguid'));
                    if (!this.parent.showColumnMenu || (this.parent.showColumnMenu && !column.showColumnMenu)) {
                        if (headers[i].querySelectorAll('.e-grptogglebtn').length) {
                            remove(headers[i].querySelectorAll('.e-grptogglebtn')[0]);
                        }
                        if (!isRemove) {
                            headers[i].appendChild(this.parent.createElement('span', {
                                className: 'e-grptogglebtn e-icons ' +
                                    (this.groupSettings.columns.indexOf(column.field) > -1 ? 'e-toggleungroup e-icon-ungroup'
                                        : 'e-togglegroup e-icon-group'), attrs: { tabindex: '-1', 'aria-label': 'Group button' }
                            }));
                        }
                    }
                }
            }
        }
    };
    Group.prototype.removeColFromGroupDrop = function (field) {
        if (!isNullOrUndefined(this.getGHeaderCell(field))) {
            var elem = this.getGHeaderCell(field);
            if (this.groupSettings.allowReordering) {
                var parent_1 = parentsUntil(elem, 'e-group-animator');
                remove(parent_1);
            }
            else {
                remove(elem);
            }
            this.updateGroupDropArea();
        }
        this.isAppliedUnGroup = false;
    };
    Group.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'columns':
                    var args = void 0;
                    if (this.contentRefresh) {
                        if (!this.isAppliedUnGroup) {
                            if (!this.isAppliedGroup) {
                                this.updateGroupDropArea(true);
                                for (var i = 0; i < this.groupSettings.columns.length; i++) {
                                    this.colName = this.groupSettings.columns[i];
                                    var col = this.parent.getColumnByField(this.colName);
                                    col.visible = this.parent.groupSettings.showGroupedColumn;
                                    this.groupAddSortingQuery(this.colName);
                                    if (i < this.groupSettings.columns.length - 1) {
                                        this.addColToGroupDrop(this.groupSettings.columns[i]);
                                    }
                                }
                            }
                            args = {
                                columnName: this.colName, requestType: e.properties[prop].length ? 'grouping' : 'ungrouping',
                                type: events.actionBegin
                            };
                        }
                        else {
                            args = { columnName: this.colName, requestType: 'ungrouping', type: events.actionBegin };
                        }
                        if (!this.groupSettings.showGroupedColumn) {
                            var columns = e.oldProperties[prop];
                            for (var i = 0; i < columns.length; i++) {
                                if (e.properties[prop].indexOf(columns[i]) === -1) {
                                    this.parent.getColumnByField(columns[i]).visible = true;
                                }
                            }
                        }
                        var requestType = 'requestType';
                        if (isBlazor() && this.parent.isServerRendered && this.parent.isCollapseStateEnabled() &&
                            args[requestType] === 'grouping') {
                            this.parent.refreshHeader();
                        }
                        this.parent.notify(events.modelChanged, args);
                    }
                    break;
                case 'showDropArea':
                    this.updateGroupDropArea();
                    this.groupSettings.showDropArea ? this.element.style.display = '' : this.element.style.display = 'none';
                    break;
                case 'showGroupedColumn':
                    this.updateGroupedColumn(this.groupSettings.showGroupedColumn);
                    this.parent.notify(events.modelChanged, { requestType: 'refresh' });
                    break;
                case 'showUngroupButton':
                    this.updateButtonVisibility(this.groupSettings.showUngroupButton, 'e-ungroupbutton');
                    break;
                case 'showToggleButton':
                    this.updateButtonVisibility(this.groupSettings.showToggleButton, 'e-togglegroupbutton ');
                    this.parent.refreshHeader();
                    break;
                case 'enableLazyLoading':
                    this.parent.freezeRefresh();
                    break;
            }
        }
    };
    Group.prototype.updateGroupedColumn = function (isVisible) {
        for (var i = 0; i < this.groupSettings.columns.length; i++) {
            this.parent.getColumnByField(this.groupSettings.columns[i]).visible = isVisible;
        }
    };
    Group.prototype.updateButtonVisibility = function (isVisible, className) {
        var gHeader = [].slice.call(this.element.querySelectorAll('.' + className));
        for (var i = 0; i < gHeader.length; i++) {
            gHeader[i].style.display = isVisible ? '' : 'none';
        }
    };
    Group.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
        }
    };
    /**
     * To destroy the reorder
     * @return {void}
     * @hidden
     */
    Group.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        // tslint:disable-next-line:no-any
        if (!this.parent.isDestroyed && !this.parent.refreshing) {
            this.clearGrouping();
        }
        this.removeEventListener();
        this.refreshToggleBtn(true);
        remove(this.element);
        //call ejdrag and drop destroy
    };
    /**
     * Clears all the grouped columns of the Grid.
     * @return {void}
     */
    Group.prototype.clearGrouping = function () {
        var cols = JSON.parse(JSON.stringify(this.groupSettings.columns));
        this.contentRefresh = false;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (i === (len - 1)) {
                this.contentRefresh = true;
            }
            this.ungroupColumn(cols[i]);
        }
        this.contentRefresh = true;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Group.prototype.getModuleName = function () {
        return 'group';
    };
    Group.prototype.refreshSortIcons = function (e) {
        var gObj = this.parent;
        var header;
        var cols = gObj.sortSettings.columns;
        var gCols = gObj.groupSettings.columns;
        var fieldNames = this.parent.getColumns().map(function (c) { return c.field; });
        this.refreshToggleBtn();
        for (var i = 0, len = cols.length; i < len; i++) {
            if (fieldNames.indexOf(cols[i].field) === -1) {
                continue;
            }
            header = gObj.getColumnHeaderByField(cols[i].field);
            if (!gObj.allowSorting && (this.sortedColumns.indexOf(cols[i].field) > -1 ||
                this.groupSettings.columns.indexOf(cols[i].field) > -1)) {
                classList(header.querySelector('.e-sortfilterdiv'), ['e-ascending', 'e-icon-ascending'], []);
                if (cols.length > 1) {
                    header.querySelector('.e-headercelldiv').appendChild(this.parent.createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }));
                }
            }
            else if (this.getGHeaderCell(cols[i].field) && this.getGHeaderCell(cols[i].field).querySelectorAll('.e-groupsort').length) {
                if (cols[i].direction === 'Ascending') {
                    classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-ascending', 'e-icon-ascending'], ['e-descending', 'e-icon-descending']);
                }
                else {
                    classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-descending', 'e-icon-descending'], ['e-ascending', 'e-icon-ascending']);
                }
            }
        }
        for (var i = 0, len = gCols.length; i < len; i++) {
            if (fieldNames.indexOf(gCols[i]) === -1) {
                continue;
            }
            gObj.getColumnHeaderByField(gCols[i]).setAttribute('aria-grouped', 'true');
        }
    };
    Group.prototype.getGHeaderCell = function (field) {
        if (this.element && this.element.querySelector('[ej-mappingname="' + field + '"]')) {
            return this.element.querySelector('[ej-mappingname="' + field + '"]').parentElement;
        }
        return null;
    };
    Group.prototype.onGroupAggregates = function (editedData) {
        var aggregates = this.iterateGroupAggregates(editedData);
        var rowData = this.groupGenerator.generateRows(aggregates, {});
        var summaryRows = this.parent.getRowsObject().filter(function (row) { return !row.isDataRow; });
        var updateSummaryRows = rowData.filter(function (data) { return !data.isDataRow; });
        if (this.parent.isReact) {
            this.parent.destroyTemplate(['groupFooterTemplate', 'groupCaptionTemplate', 'footerTemplate']);
        }
        for (var i = 0; i < updateSummaryRows.length; i++) {
            var row = updateSummaryRows[i];
            var cells = row.cells.filter(function (cell) { return cell.isDataCell; });
            var args = { cells: cells, data: row.data, dataUid: summaryRows[i] ? summaryRows[i].uid : '' };
            this.parent.notify(events.refreshAggregateCell, args);
        }
    };
    Group.prototype.iterateGroupAggregates = function (editedData) {
        var updatedData = editedData instanceof Array ? editedData : [];
        var rows = this.parent.getRowsObject();
        var initData = this.parent.getCurrentViewRecords();
        var deletedCols = [];
        var changeds = rows.map(function (row) {
            if (row.edit === 'delete') {
                deletedCols.push(row.data);
            }
            return row.changes instanceof Object ? row.changes : row.data;
        });
        var field = this.parent.getPrimaryKeyFieldNames()[0];
        changeds = updatedData.length === 0 ? changeds : updatedData;
        var mergeData = initData.map(function (item) {
            var pKeyVal = DataUtil.getObject(field, item);
            var value;
            var hasVal = changeds.some(function (cItem) {
                value = cItem;
                return pKeyVal === DataUtil.getObject(field, cItem);
            });
            return hasVal ? value : item;
        });
        var eData = editedData;
        if (!(eData.type && eData.type === 'cancel') && deletedCols.length > 0) {
            for (var i = 0; i < deletedCols.length; i++) {
                var index = mergeData.indexOf(deletedCols[i]);
                mergeData.splice(index, 1);
            }
        }
        var aggregates = [];
        var aggregateRows = this.parent.aggregates;
        for (var j = 0; j < aggregateRows.length; j++) {
            var row = aggregateRows[j];
            for (var k = 0; k < row.columns.length; k++) {
                var aggr = {};
                var type = row.columns[k].type.toString();
                aggr = { type: type.toLowerCase(), field: row.columns[k].field };
                aggregates.push(aggr);
            }
        }
        var result;
        var aggrds;
        var groupedCols = this.parent.groupSettings.columns;
        for (var l = 0; l < groupedCols.length; l++) {
            aggrds = result ? result : mergeData;
            result = DataUtil.group(aggrds, groupedCols[l], aggregates, null, null);
        }
        return result;
    };
    Group.prototype.updateExpand = function (args) {
        var uid = args.uid;
        var isExpand = args.isExpand;
        var rows = this.parent.getRowsObject();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.uid === uid || isNullOrUndefined(uid)) {
                row.isExpand = isExpand;
                var _loop_1 = function (j) {
                    var childRow = rows[j];
                    var closestParent = void 0;
                    if (childRow.parentUid !== row.uid) {
                        closestParent = rows.filter(function (x) { return x.uid === childRow.parentUid; })[0];
                    }
                    if (childRow.parentUid === row.uid) {
                        childRow.visible = row.isExpand;
                    }
                    else if (!isNullOrUndefined(closestParent) && childRow.parentUid === closestParent.uid) {
                        if (closestParent.isExpand && closestParent.visible === true) {
                            childRow.visible = true;
                        }
                        else if (closestParent.isExpand && closestParent.visible === false) {
                            childRow.visible = false;
                        }
                    }
                    if (isNullOrUndefined(uid)) {
                        return "break";
                    }
                };
                for (var j = i + 1; j < rows.length; j++) {
                    var state_1 = _loop_1(j);
                    if (state_1 === "break")
                        break;
                }
            }
        }
        this.parent.notify(events.contentReady, { rows: rows, args: { isFrozen: false, rows: rows } });
    };
    return Group;
}());
export { Group };
