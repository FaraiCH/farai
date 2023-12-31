import { createElement, addClass, removeClass, remove, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { closest } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { PivotUtil } from '../../base/util';
/**
 * Module to render Field List
 */
/** @hidden */
var TreeViewRenderer = /** @class */ (function () {
    /** Constructor for render module */
    function TreeViewRenderer(parent) {
        this.selectedNodes = [];
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    TreeViewRenderer.prototype.render = function (axis) {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        this.fieldListSort = 'None';
        if (!this.parent.isAdaptive) {
            var fieldTable = createElement('div', {
                className: cls.FIELD_TABLE_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_TABLE_CLASS : '')
            });
            var treeHeader = createElement('div', {
                className: cls.FIELD_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant('allFields')
            });
            var treeOuterDiv = createElement('div', { className: cls.FIELD_LIST_TREE_CLASS + '-outer-div' });
            this.treeViewElement = createElement('div', {
                id: this.parent.element.id + '_TreeView',
                className: cls.FIELD_LIST_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_LIST_CLASS : '')
            });
            var fieldHeaderWrappper = createElement('div', { className: 'e-field-header-wrapper' });
            fieldHeaderWrappper.appendChild(treeHeader);
            fieldTable.appendChild(fieldHeaderWrappper);
            this.updateSortElements(fieldHeaderWrappper);
            treeOuterDiv.appendChild(this.treeViewElement);
            fieldTable.appendChild(treeOuterDiv);
            this.parentElement.appendChild(fieldTable);
            if (this.parent.renderMode === 'Fixed') {
                var centerDiv = createElement('div', { className: cls.STATIC_CENTER_DIV_CLASS });
                var axisHeader = createElement('div', {
                    className: cls.STATIC_CENTER_HEADER_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('centerHeader')
                });
                this.parentElement.appendChild(centerDiv);
                this.parentElement.appendChild(axisHeader);
            }
            this.renderTreeView();
        }
        else {
            this.renderTreeDialog(axis);
        }
    };
    TreeViewRenderer.prototype.updateSortElements = function (headerWrapper) {
        var options = { 'None': 'sortNone', 'Ascend': 'sortAscending', 'Descend': 'sortDescending' };
        var keys = Object.keys(options);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var option = keys_1[_i];
            var spanElement = createElement('span', {
                attrs: {
                    'tabindex': '0',
                    'aria-disabled': 'false',
                    'aria-label': 'Sort ' + option,
                    'data-sort': option,
                    'title': this.parent.localeObj.getConstant(options[option])
                },
                className: cls.ICON + ' ' + 'e-sort-' + option.toLowerCase() + ' ' +
                    (this.fieldListSort === option ? 'e-selected' : '')
            });
            headerWrapper.appendChild(spanElement);
            this.unWireFieldListEvent(spanElement);
            this.wireFieldListEvent(spanElement);
        }
    };
    TreeViewRenderer.prototype.renderTreeView = function () {
        this.fieldTable = new TreeView({
            /* tslint:disable-next-line:max-line-length */
            fields: { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            nodeChecked: this.nodeStateChange.bind(this),
            cssClass: cls.FIELD_LIST_TREE_CLASS,
            showCheckBox: true,
            allowDragAndDrop: true,
            sortOrder: 'None',
            autoCheck: false,
            loadOnDemand: this.parent.dataType === 'olap' ? false : true,
            enableRtl: this.parent.enableRtl,
            nodeDragStart: this.dragStart.bind(this),
            nodeDragStop: this.dragStop.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
            nodeSelected: function (args) {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            }
        });
        this.treeViewElement.innerHTML = '';
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(this.treeViewElement);
    };
    TreeViewRenderer.prototype.updateNodeIcon = function (args) {
        if (this.parent.dataType === 'olap') {
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
                var node = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-icon');
                addClass([node], 'e-folderCDB-open-icon');
            }
            else if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
                var node = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-open-icon');
                addClass([node], 'e-folderCDB-icon');
            }
        }
    };
    TreeViewRenderer.prototype.updateTreeNode = function (args) {
        var allowDrag = false;
        if (this.parent.dataType === 'olap') {
            allowDrag = this.updateOlapTreeNode(args);
        }
        else {
            allowDrag = true;
        }
        var liTextElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
        if (args.node.querySelector('.e-list-icon') && liTextElement) {
            var liIconElement = args.node.querySelector('.e-list-icon');
            liTextElement.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
        }
        if (allowDrag && !this.parent.isAdaptive) {
            /* tslint:disable */
            var field = PivotUtil.getFieldInfo(args.nodeData.id, this.parent);
            /* tslint:enable */
            allowDrag = false;
            var dragElement = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: (field.fieldItem ? field.fieldItem.allowDragAndDrop ?
                        this.parent.localeObj.getConstant('drag') : '' : this.parent.localeObj.getConstant('drag')),
                    'aria-disabled': 'false'
                },
                className: cls.ICON + ' ' + cls.DRAG_CLASS + ' ' +
                    (field.fieldItem ? field.fieldItem.allowDragAndDrop ? '' : cls.DRAG_DISABLE_CLASS : '')
            });
            if (args.node.querySelector('.e-checkbox-wrapper') &&
                !args.node.querySelector('.cls.DRAG_CLASS') && liTextElement) {
                liTextElement.insertBefore(dragElement, args.node.querySelector('.e-checkbox-wrapper'));
            }
        }
        if (args.node.querySelector('.' + cls.NODE_CHECK_CLASS)) {
            addClass([args.node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        }
    };
    TreeViewRenderer.prototype.updateOlapTreeNode = function (args) {
        var allowDrag = false;
        if (this.parent.dataType === 'olap') {
            /* tslint:disable-next-line:max-line-length */
            if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon,.e-folderCDB-open-icon,.e-dimensionCDB-icon,.e-kpiCDB-icon')) {
                args.node.querySelector('.e-checkbox-wrapper').style.display = 'none';
            }
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-level-members') > -1)) {
                if (this.parent.isAdaptive) {
                    args.node.querySelector('.e-checkbox-wrapper').style.display = 'none';
                }
                else {
                    args.node.querySelector('.e-checkbox-wrapper').style.visibility = 'hidden';
                }
            }
            if (args.node && (args.node.querySelector('.e-hierarchyCDB-icon,.e-attributeCDB-icon,.e-namedSetCDB-icon') ||
                args.node.querySelector('.e-measure-icon,.e-kpiGoal-icon,.e-kpiStatus-icon,.e-kpiTrend-icon,.e-kpiValue-icon') ||
                args.node.querySelector('.e-calc-measure-icon,.e-calc-dimension-icon'))) {
                if (args.node.querySelector('.e-measure-icon')) {
                    args.node.querySelector('.e-list-icon').style.display = 'none';
                    allowDrag = true;
                }
                else {
                    allowDrag = true;
                }
            }
        }
        else {
            allowDrag = true;
        }
        return allowDrag;
    };
    TreeViewRenderer.prototype.renderTreeDialog = function (axis) {
        var fieldListDialog = createElement('div', {
            id: this.parent.element.id + '_FieldListTreeView',
            className: cls.ADAPTIVE_FIELD_LIST_DIALOG_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-editor-dialog' : ''),
        });
        this.parentElement.appendChild(fieldListDialog);
        this.fieldDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('adaptiveFieldHeader'),
            content: this.createTreeView(this.getTreeData(axis)),
            isModal: true,
            visible: true,
            showCloseIcon: false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: '350px',
            position: { X: 'center', Y: 'center' },
            buttons: [{
                    click: this.closeTreeDialog.bind(this),
                    buttonModel: {
                        cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel')
                    }
                }, {
                    click: this.onFieldAdd.bind(this),
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('add'),
                        isPrimary: true
                    }
                }],
            closeOnEscape: false,
            target: this.parentElement.parentElement,
            close: this.dialogClose.bind(this)
        });
        this.fieldDialog.isStringTemplate = true;
        this.fieldDialog.appendTo(fieldListDialog);
        // this.fieldDialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('adaptiveFieldHeader');
    };
    TreeViewRenderer.prototype.dialogClose = function () {
        if (document.getElementById(this.parent.element.id + '_FieldListTreeView')) {
            remove(document.getElementById(this.parent.element.id + '_FieldListTreeView'));
        }
    };
    TreeViewRenderer.prototype.createTreeView = function (treeData) {
        var editorTreeWrapper = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS
        });
        var searchWrapper = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        var editorSearch = createElement('input', { attrs: { 'type': 'text' } });
        searchWrapper.appendChild(editorSearch);
        var treeOuterDiv = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS + '-outer-div' });
        var treeViewContainer = createElement('div', {
            className: cls.EDITOR_TREE_CONTAINER_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-field-list-tree' : '')
        });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            showClearButton: true,
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            cssClass: cls.EDITOR_SEARCH_CLASS,
            change: this.textChange.bind(this)
        });
        this.editorSearch.isStringTemplate = true;
        this.editorSearch.appendTo(editorSearch);
        var promptDiv = createElement('div', {
            className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE,
            innerHTML: this.parent.localeObj.getConstant('noMatches')
        });
        editorTreeWrapper.appendChild(promptDiv);
        treeOuterDiv.appendChild(treeViewContainer);
        editorTreeWrapper.appendChild(treeOuterDiv);
        this.fieldTable = new TreeView({
            /* tslint:disable-next-line:max-line-length */
            fields: { dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            showCheckBox: true,
            autoCheck: false,
            loadOnDemand: this.parent.dataType === 'olap' ? false : true,
            sortOrder: this.parent.dataType === 'olap' ? 'None' : 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeChecked: this.addNode.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
            nodeSelected: function (args) {
                removeClass([args.node], 'e-active');
                args.cancel = true;
            }
        });
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(treeViewContainer);
        return editorTreeWrapper;
    };
    TreeViewRenderer.prototype.textChange = function (e) {
        this.parent.pivotCommon.eventBase.searchTreeNodes(e, this.fieldTable, true);
        var promptDiv = this.fieldDialog.element.querySelector('.' + cls.EMPTY_MEMBER_CLASS);
        var liList = [].slice.call(this.fieldTable.element.querySelectorAll('li'));
        /* tslint:disable-next-line:max-line-length */
        var disabledList = [].slice.call(this.fieldTable.element.querySelectorAll('li.' + cls.ICON_DISABLE));
        if (liList.length === disabledList.length) {
            removeClass([promptDiv], cls.ICON_DISABLE);
        }
        else {
            addClass([promptDiv], cls.ICON_DISABLE);
        }
    };
    TreeViewRenderer.prototype.dragStart = function (args) {
        var _this = this;
        if (args.event.target.classList.contains(cls.DRAG_CLASS) &&
            !args.event.target.classList.contains(cls.DRAG_DISABLE_CLASS)) {
            var fieldInfo = PivotUtil.getFieldInfo(args.draggedNode.getAttribute('data-uid'), this.parent);
            var dragEventArgs = {
                fieldName: fieldInfo.fieldName, fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis,
                dataSourceSettings: this.parent.dataSourceSettings, cancel: false
            };
            var control = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
            control.trigger(events.fieldDragStart, dragEventArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    _this.parent.isDragging = true;
                    addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
                    var data = void 0;
                    if (_this.parent.dataType === 'olap') {
                        data = _this.parent.olapEngineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
                    }
                    else {
                        data = _this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
                    }
                    var axis = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
                    if (data && data.aggregateType === 'CalculatedField') {
                        for (var _i = 0, axis_1 = axis; _i < axis_1.length; _i++) {
                            var axisContent = axis_1[_i];
                            addClass([_this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                        }
                    }
                    var dragItem = args.clonedNode;
                    if (dragItem && (_this.parent.getModuleName() === 'pivotfieldlist' &&
                        _this.parent.renderMode) === 'Popup') {
                        dragItem.style.zIndex = (_this.parent.dialogRenderer.fieldListDialog.zIndex + 1).toString();
                    }
                }
                else {
                    _this.parent.isDragging = false;
                    args.cancel = true;
                }
            });
        }
        else {
            this.parent.isDragging = false;
            args.cancel = true;
        }
    };
    // private getFieldDragArgs(args: DragAndDropEventArgs): FieldDragStartEventArgs {
    //     let fieldInfo: FieldItemInfo = PivotUtil.getFieldInfo(args.draggedNode.getAttribute('data-uid'), this.parent);
    //     let dragEventArgs: any = {
    //         fieldName: fieldInfo.fieldName, fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis,
    //         dataSourceSettings: this.parent.dataSourceSettings, cancel: false
    //     }
    //     let treeModule: TreeViewRenderer = this;
    //     if (isBlazor()) {
    //         dragEventArgs = this.getFieldDragEventArgs(dragEventArgs);
    //         dragEventArgs.then((e: any) => {
    //             return e;
    //         });
    //     }
    //     let control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
    //     control.trigger(events.fieldDragStart, dragEventArgs);
    //     return dragEventArgs;
    // }
    // private getFieldDragEventArgs(dragEventArgs: FieldDragStartEventArgs): FieldDragStartEventArgs | Deferred {
    //     let callbackPromise: Deferred = new Deferred();
    //     let control: PivotView | PivotFieldList = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
    //     control.trigger(events.fieldDragStart, dragEventArgs, (observedArgs: FieldDragStartEventArgs) => {
    //         callbackPromise.resolve(observedArgs);
    //     });
    //     return callbackPromise;
    // }
    TreeViewRenderer.prototype.dragStop = function (args) {
        args.cancel = true;
        this.parent.isDragging = false;
        var axis = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (var _i = 0, axis_2 = axis; _i < axis_2.length; _i++) {
            var axisElement = axis_2[_i];
            removeClass([this.parentElement.querySelector('.' + axisElement)], cls.NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        var fieldName = args.draggedNodeData.id.toString();
        if (!this.isNodeDropped(args, fieldName)) {
            return;
        }
        var list = this.parent.pivotFieldList;
        var selectedNode = list[fieldName];
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            (this.parent.pivotGridModule ? this.parent.pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, fieldName)) {
            if (this.parent.allowDeferLayoutUpdate) {
                selectedNode.isSelected = true;
                this.updateDataSource();
            }
            else {
                this.parent.updateDataSource();
            }
            var parent_1 = this.parent;
            //setTimeout(() => {
            parent_1.axisFieldModule.render();
            //});
        }
    };
    TreeViewRenderer.prototype.isNodeDropped = function (args, targetID) {
        var isDropped = true;
        if (args.draggedNodeData.isChecked === 'true') {
            var target = this.getButton(targetID);
            var axisPanel = closest(target, '.' + cls.DROPPABLE_CLASS);
            var droppableElement = closest(args.target, '.' + cls.DROPPABLE_CLASS);
            if (target && axisPanel === droppableElement) {
                var pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                var dropTarget = closest(args.target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS);
                var sourcePosition = void 0;
                var dropPosition = -1;
                for (var i = 0, n = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        var droppableButton = dropTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    var parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    };
    TreeViewRenderer.prototype.getButton = function (fieldName) {
        var wrapperElement = document.getElementById(this.parent.element.id + '_Wrapper');
        var pivotButtons = [].slice.call(wrapperElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        var buttonElement;
        for (var i = 0, n = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i].id === fieldName) {
                buttonElement = pivotButtons[i];
                break;
            }
        }
        return buttonElement;
    };
    TreeViewRenderer.prototype.nodeStateChange = function (args) {
        var _this = this;
        var node = closest(args.node, '.' + cls.TEXT_CONTENT_CLASS);
        if (!isNullOrUndefined(node)) {
            var li_1 = closest(node, 'li');
            var id_1 = li_1.getAttribute('data-uid');
            if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
                this.parent.pivotCommon.filterDialog.dialogPopUp.close();
            }
            var list = this.parent.pivotFieldList;
            var selectedNode_1 = list[id_1];
            var fieldInfo_1 = PivotUtil.getFieldInfo(id_1, this.parent);
            var control = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
            if (args.action === 'check') {
                var eventdrop = {
                    fieldName: id_1, dropField: fieldInfo_1.fieldItem,
                    dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                    dropAxis: (selectedNode_1.type === 'number' || (selectedNode_1.type === 'CalculatedField' &&
                        selectedNode_1.formula && selectedNode_1.formula.indexOf('Measure') > -1 &&
                        this.parent.dataType === 'olap')) ? 'values' : 'rows',
                    dropPosition: fieldInfo_1.position, draggedAxis: 'fieldlist', cancel: false
                };
                control.trigger(events.fieldDrop, eventdrop, function (observedArgs) {
                    if (!observedArgs.cancel) {
                        addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        _this.updateSelectedNodes(li_1, args.action);
                        var addNode = _this.parent.pivotCommon.dataSourceUpdate.getNewField(id_1, fieldInfo_1.fieldItem);
                        _this.updateReportSettings(addNode, observedArgs);
                        _this.updateNodeStateChange(id_1, args, selectedNode_1);
                    }
                    else {
                        _this.updateCheckState(selectedNode_1);
                    }
                });
            }
            else {
                var removeFieldArgs = {
                    cancel: false, fieldName: id_1,
                    dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                    fieldItem: fieldInfo_1.fieldItem, axis: fieldInfo_1.axis
                };
                control.trigger(events.fieldRemove, removeFieldArgs, function (observedArgs) {
                    if (!observedArgs.cancel) {
                        removeClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                        _this.updateSelectedNodes(li_1, args.action);
                        _this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(id_1);
                        if (_this.parent.dataType === 'olap' && _this.parent.dataSourceSettings.values.length === 0) {
                            _this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[Measures]');
                        }
                        _this.updateNodeStateChange(id_1, args, selectedNode_1);
                    }
                    else {
                        _this.updateCheckState(selectedNode_1);
                    }
                });
            }
        }
    };
    TreeViewRenderer.prototype.updateReportSettings = function (newField, dropArgs) {
        var dropPosition = dropArgs.dropPosition;
        var dropClass = dropArgs.dropAxis;
        switch (dropClass) {
            case 'filters':
                dropPosition !== -1 ?
                    this.parent.dataSourceSettings.filters.splice(dropPosition, 0, newField) :
                    this.parent.dataSourceSettings.filters.push(newField);
                break;
            case 'rows':
                dropPosition !== -1 ?
                    this.parent.dataSourceSettings.rows.splice(dropPosition, 0, newField) :
                    this.parent.dataSourceSettings.rows.push(newField);
                break;
            case 'columns':
                dropPosition !== -1 ?
                    this.parent.dataSourceSettings.columns.splice(dropPosition, 0, newField) :
                    this.parent.dataSourceSettings.columns.push(newField);
                break;
            case 'values':
                dropPosition !== -1 ?
                    this.parent.dataSourceSettings.values.splice(dropPosition, 0, newField) :
                    this.parent.dataSourceSettings.values.push(newField);
                if (this.parent.dataType === 'olap' && this.parent.olapEngineModule &&
                    !(this.parent.olapEngineModule).isMeasureAvail) {
                    var measureField = {
                        name: '[Measures]', caption: 'Measures', baseField: undefined, baseItem: undefined,
                    };
                    var fieldAxis = this.parent.dataSourceSettings.valueAxis === 'row' ?
                        this.parent.dataSourceSettings.rows : this.parent.dataSourceSettings.columns;
                    fieldAxis.push(measureField);
                }
                break;
        }
    };
    TreeViewRenderer.prototype.updateCheckState = function (selectedNode) {
        var chkState = this.fieldTable.element.querySelectorAll('.e-checkbox-wrapper');
        var innerText = this.fieldTable.element.querySelectorAll('.e-list-text');
        var checkClass = this.fieldTable.element.querySelectorAll('.e-frame');
        for (var i = 0; i < chkState.length; i++) {
            if (selectedNode.caption === innerText[i].textContent) {
                if (chkState[i].getAttribute('aria-checked') === 'false') {
                    chkState[i].setAttribute('aria-checked', 'false');
                    checkClass[i].classList.add(cls.NODE_CHECK_CLASS);
                }
                else {
                    chkState[i].setAttribute('aria-checked', 'true');
                    checkClass[i].classList.remove(cls.NODE_CHECK_CLASS);
                }
            }
        }
    };
    TreeViewRenderer.prototype.updateNodeStateChange = function (id, args, selectedNode) {
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        }
        else {
            selectedNode.isSelected = args.action === 'check';
            if (this.parent.dataType === 'olap') {
                this.parent.olapEngineModule.updateFieldlistData(id, args.action === 'check');
            }
            this.updateDataSource();
        }
        var parent = this.parent;
        setTimeout(function () {
            parent.axisFieldModule.render();
        });
    };
    TreeViewRenderer.prototype.updateSelectedNodes = function (li, state) {
        if (li && li.querySelector('ul')) {
            for (var _i = 0, _a = [].slice.call(li.querySelectorAll('li')); _i < _a.length; _i++) {
                var element = _a[_i];
                if (state === 'check') {
                    addClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                }
                else {
                    removeClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                }
            }
        }
    };
    TreeViewRenderer.prototype.updateDataSource = function () {
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
            if (this.parent.dataType === 'olap') {
                this.parent.pivotGridModule.olapEngineModule = this.parent.olapEngineModule;
            }
            else {
                this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            }
            /* tslint:disable-next-line:max-line-length */
            this.parent.pivotGridModule.setProperties({ dataSourceSettings: this.parent.dataSourceSettings.properties }, true);
            this.parent.pivotGridModule.notify(events.uiUpdate, this);
        }
        else {
            this.parent.triggerPopulateEvent();
        }
    };
    TreeViewRenderer.prototype.addNode = function (args) {
        var _this = this;
        var fieldList = this.parent.pivotFieldList;
        var selectedNode = fieldList[args.data[0].id.toString()];
        var fieldInfo = PivotUtil.getFieldInfo(selectedNode.id.toString(), this.parent);
        var control = this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
        if (args.action === 'check') {
            var eventdrop = {
                fieldName: fieldInfo.fieldName, dropField: fieldInfo.fieldItem,
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                dropAxis: 'rows', draggedAxis: 'fieldlist', cancel: false
            };
            control.trigger(events.fieldDrop, eventdrop, function (observedArgs) {
                if (!observedArgs.cancel) {
                    _this.selectedNodes.push(selectedNode.id.toString());
                }
                else {
                    _this.updateCheckState(selectedNode);
                }
            });
        }
        else {
            var removeFieldArgs = {
                cancel: false, fieldName: fieldInfo.fieldName,
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
                fieldItem: fieldInfo.fieldItem, axis: fieldInfo.axis
            };
            control.trigger(events.fieldRemove, removeFieldArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    var count = _this.selectedNodes.length;
                    while (count--) {
                        if (_this.selectedNodes[count] === selectedNode.id.toString()) {
                            _this.selectedNodes.splice(count, 1);
                            break;
                        }
                    }
                }
                else {
                    _this.updateCheckState(selectedNode);
                }
            });
        }
    };
    TreeViewRenderer.prototype.refreshTreeView = function () {
        if (this.fieldTable) {
            var treeData = this.getUpdatedData();
            this.fieldTable.fields = {
                dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass'
            };
            this.fieldTable.dataBind();
        }
    };
    TreeViewRenderer.prototype.getUpdatedData = function () {
        var treeData = this.getTreeData();
        var expandedNodes = this.fieldTable.expandedNodes;
        this.updateExpandedNodes(treeData, expandedNodes);
        return this.applySorting(treeData, this.fieldListSort);
    };
    TreeViewRenderer.prototype.getTreeData = function (axis) {
        var data = [];
        if (this.parent.dataType === 'olap') {
            data = this.getOlapTreeData(axis);
        }
        else {
            var keys = this.parent.pivotFieldList ? Object.keys(this.parent.pivotFieldList) : [];
            var fieldList = {};
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                var member = this.parent.pivotFieldList[key];
                fieldList[key] = { id: member.id, caption: member.caption, isSelected: member.isSelected };
            }
            if (this.parent.isAdaptive) {
                /* tslint:disable-next-line:max-line-length */
                var fields = [this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns, this.parent.dataSourceSettings.rows,
                    this.parent.dataSourceSettings.values];
                var currentFieldSet = fields[axis];
                var len = keys.length;
                while (len--) {
                    fieldList[keys[len]].isSelected = false;
                }
                for (var _a = 0, currentFieldSet_1 = currentFieldSet; _a < currentFieldSet_1.length; _a++) {
                    var item = currentFieldSet_1[_a];
                    fieldList[item.name].isSelected = true;
                }
            }
            var list = fieldList;
            for (var _b = 0, keys_3 = keys; _b < keys_3.length; _b++) {
                var member = keys_3[_b];
                var obj = list[member];
                data.push(obj);
            }
        }
        return data;
    };
    TreeViewRenderer.prototype.getOlapTreeData = function (axis) {
        var data = [];
        var fieldListData = this.parent.olapEngineModule.fieldListData ? this.parent.olapEngineModule.fieldListData : [];
        if (this.parent.isAdaptive) {
            /* tslint:disable-next-line:max-line-length */
            var fields = [
                this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns,
                this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.values
            ];
            var currentFieldSet = fields[axis];
            var i = 0;
            while (i < fieldListData.length) {
                var item = fieldListData[i];
                /* tslint:disable */
                var framedSet = void 0;
                /* tslint:enable */
                if (axis === 3) {
                    if (item.id.toLowerCase() !== '[measures]' &&
                        (item.id.toLowerCase().indexOf('[measures]') === 0 ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1)) ||
                        (item.id.toLowerCase() === '[calculated members].[_0]' ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1))) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        if (framedSet.spriteCssClass && framedSet.spriteCssClass.indexOf('e-measureCDB') !== -1) {
                            framedSet.spriteCssClass = framedSet.spriteCssClass.replace('e-folderCDB-icon', 'e-measureGroupCDB-icon');
                            framedSet.pid = undefined;
                        }
                        for (var _i = 0, currentFieldSet_2 = currentFieldSet; _i < currentFieldSet_2.length; _i++) {
                            var field = currentFieldSet_2[_i];
                            if (framedSet.id === field.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                }
                else {
                    if (!(item.id.toLowerCase().indexOf('[measures]') === 0) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1)) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        for (var _a = 0, currentFieldSet_3 = currentFieldSet; _a < currentFieldSet_3.length; _a++) {
                            var item_1 = currentFieldSet_3[_a];
                            if (framedSet.id === item_1.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                }
                i++;
            }
        }
        else {
            data = PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData);
        }
        return data;
    };
    TreeViewRenderer.prototype.updateExpandedNodes = function (data, expandedNodes) {
        if (expandedNodes.length > 0) {
            var i = 0;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var field = data_1[_i];
                if (expandedNodes.indexOf(field.id) > -1) {
                    i++;
                    field.expanded = true;
                    field.spriteCssClass = (field.spriteCssClass &&
                        field.spriteCssClass.toString().indexOf('e-folderCDB-icon') > -1 ?
                        field.spriteCssClass.toString().replace('e-folderCDB-icon', 'e-folderCDB-open-icon') :
                        field.spriteCssClass);
                    if (i === (expandedNodes.length)) {
                        break;
                    }
                }
            }
        }
    };
    TreeViewRenderer.prototype.updateSorting = function (args) {
        var target = args.target;
        var option = target.getAttribute('data-sort');
        if (target.className.indexOf('e-selected') === -1) {
            switch (option) {
                case 'None':
                    this.fieldListSort = 'None';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Ascend':
                    this.fieldListSort = 'Ascend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Descend':
                    this.fieldListSort = 'Descend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    break;
            }
            this.refreshTreeView();
        }
    };
    TreeViewRenderer.prototype.applySorting = function (treeData, sortOrder) {
        if (this.parent.dataType === 'olap') {
            var measure = void 0;
            var calcMember = void 0;
            if (this.parent.dataSourceSettings.calculatedFieldSettings.length > 0 &&
                treeData[0].id.toLowerCase() === '[calculated members].[_0]') {
                calcMember = treeData[0];
                measure = treeData[1];
                treeData.splice(0, 2);
            }
            else {
                measure = treeData[0];
                treeData.splice(0, 1);
            }
            /* tslint:disable:typedef */
            treeData = sortOrder === 'Ascend' ?
                (treeData.sort(function (a, b) { return (a.caption > b.caption) ? 1 : ((b.caption > a.caption) ? -1 : 0); })) :
                sortOrder === 'Descend' ?
                    (treeData.sort(function (a, b) { return (a.caption < b.caption) ? 1 : ((b.caption < a.caption) ? -1 : 0); })) :
                    treeData;
            /* tslint:enable:typedef */
            if (calcMember) {
                treeData.splice(0, 0, calcMember, measure);
            }
            else {
                treeData.splice(0, 0, measure);
            }
        }
        else {
            this.fieldTable.sortOrder = ((sortOrder === 'Ascend' ? 'Ascending' : (sortOrder === 'Descend' ? 'Descending' : 'None')));
        }
        return treeData;
    };
    TreeViewRenderer.prototype.onFieldAdd = function (e) {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    };
    TreeViewRenderer.prototype.closeTreeDialog = function () {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    };
    TreeViewRenderer.prototype.keyPress = function (e) {
        var target = e.target;
        if (e.keyCode === 13 && e.target) {
            e.target.click();
            e.preventDefault();
            return;
        }
    };
    TreeViewRenderer.prototype.wireFieldListEvent = function (element) {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.updateSorting, this);
    };
    TreeViewRenderer.prototype.unWireFieldListEvent = function (element) {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.updateSorting);
    };
    /**
     * @hidden
     */
    TreeViewRenderer.prototype.addEventListener = function () {
        this.parent.on(events.treeViewUpdate, this.refreshTreeView, this);
    };
    /**
     * @hidden
     */
    TreeViewRenderer.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.treeViewUpdate, this.refreshTreeView);
    };
    /**
     * To destroy the tree view event listener
     * @return {void}
     * @hidden
     */
    TreeViewRenderer.prototype.destroy = function () {
        this.removeEventListener();
    };
    return TreeViewRenderer;
}());
export { TreeViewRenderer };
