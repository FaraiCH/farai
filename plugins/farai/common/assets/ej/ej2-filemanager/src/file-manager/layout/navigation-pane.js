import { TreeView as BaseTreeView } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined as isNOU, select, setValue, getValue, Draggable } from '@syncfusion/ej2-base';
import { KeyboardEvents, closest } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { read, Download, GetDetails, Delete } from '../common/operations';
import { createDialog } from '../pop-up/dialog';
import { updatePath, getPath, getDirectories } from '../common/utility';
import { createVirtualDragElement, dragStopHandler, dragStartHandler, draggingHandler, getDirectoryPath, getModule } from '../common/index';
import { copyFiles, cutFiles, removeActive, pasteHandler, getParentPath, readDropPath } from '../common/index';
import { hasEditAccess, createDeniedDialog, hasDownloadAccess, getAccessClass } from '../common/index';
/**
 * NavigationPane module
 */
var NavigationPane = /** @class */ (function () {
    /**
     * Constructor for the TreeView module
     * @hidden
     */
    function NavigationPane(parent) {
        this.removeNodes = [];
        this.moveNames = [];
        this.expandTree = false;
        this.isDrag = false;
        this.isPathDragged = false;
        this.isRenameParent = false;
        this.isRightClick = false;
        this.renameParent = null;
        this.parent = parent;
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftF10: 'shift+F10',
            f2: 'f2'
        };
    }
    NavigationPane.prototype.onInit = function () {
        if (!isNOU(this.treeObj)) {
            return;
        }
        var rootData = getValue(this.parent.pathId[0], this.parent.feParent);
        setValue('_fm_icon', 'e-fe-folder', rootData);
        var attr = {};
        var id = getValue('id', rootData);
        if (!isNOU(id)) {
            setValue('data-id', id, attr);
        }
        if (!hasEditAccess(rootData)) {
            setValue('class', getAccessClass(rootData), attr);
        }
        if (!isNOU(attr)) {
            setValue('_fm_htmlAttr', attr, rootData);
        }
        this.treeObj = new BaseTreeView({
            fields: {
                dataSource: [rootData], id: '_fm_id', parentID: '_fm_pId', expanded: '_fm_expanded', selected: '_fm_selected', text: 'name',
                hasChildren: 'hasChild', iconCss: '_fm_icon', htmlAttributes: '_fm_htmlAttr', tooltip: 'name'
            },
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            nodeSelected: this.onNodeSelected.bind(this),
            nodeExpanding: this.onNodeExpand.bind(this),
            nodeClicked: this.onNodeClicked.bind(this),
            allowEditing: true,
            nodeEditing: this.onNodeEditing.bind(this),
            drawNode: this.onDrowNode.bind(this),
            enableRtl: this.parent.enableRtl,
            dataBound: this.addDragDrop.bind(this)
        });
        this.treeObj.isStringTemplate = true;
        this.treeObj.appendTo('#' + this.parent.element.id + CLS.TREE_ID);
        this.wireEvents();
    };
    NavigationPane.prototype.addDragDrop = function () {
        var _this = this;
        if (!this.parent.isMobile && this.treeObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) {
                    this.dragObj.destroy();
                }
                this.dragObj = new Draggable(this.treeObj.element, {
                    cursorAt: this.parent.dragCursorPosition,
                    dragTarget: '.' + CLS.FULLROW,
                    dragArea: this.parent.element,
                    drag: draggingHandler.bind(this, this.parent),
                    dragStart: function (args) {
                        dragStartHandler(_this.parent, args, _this.dragObj);
                    },
                    dragStop: dragStopHandler.bind(this, this.parent),
                    enableTailMode: true,
                    enableAutoScroll: true,
                    helper: this.dragHelper.bind(this)
                });
            }
            else if (!this.parent.allowDragAndDrop && this.dragObj) {
                this.dragObj.destroy();
            }
        }
    };
    NavigationPane.prototype.dragHelper = function (args) {
        var dragTarget = args.sender.target;
        if (!dragTarget.classList.contains(CLS.FULLROW)) {
            return null;
        }
        var dragLi = closest(dragTarget, 'li');
        this.parent.dragPath = '';
        this.parent.dragData = [];
        this.parent.activeElements = [];
        this.parent.activeElements = [dragLi];
        this.parent.dragNodes = [];
        getModule(this.parent, dragLi);
        this.parent.dragData = this.getTreeData(dragLi);
        this.parent.dragPath = this.getDragPath(dragLi, this.parent.dragData[0].name);
        this.parent.dragNodes.push(this.parent.dragData[0].name);
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    };
    NavigationPane.prototype.getDragPath = function (dragLi, text) {
        var path = this.getDropPath(dragLi, text);
        return getParentPath(path);
    };
    NavigationPane.prototype.getDropPath = function (node, text) {
        var id = node.getAttribute('data-id');
        var newText = this.parent.hasId ? id : text;
        return getPath(node, newText, this.parent.hasId);
    };
    NavigationPane.prototype.onDrowNode = function (args) {
        var eventArgs = {
            element: args.node,
            fileDetails: args.nodeData,
            module: 'NavigationPane'
        };
        this.parent.trigger('fileLoad', eventArgs);
    };
    NavigationPane.prototype.addChild = function (files, target, prevent) {
        var directories = getDirectories(files);
        if (directories.length > 0) {
            var length_1 = 0;
            var folders = directories;
            while (length_1 < directories.length) {
                folders[length_1]._fm_icon = 'e-fe-folder';
                var attr = {};
                var id = getValue('id', folders[length_1]);
                if (!isNOU(id)) {
                    setValue('data-id', id, attr);
                }
                if (!hasEditAccess(folders[length_1])) {
                    setValue('class', getAccessClass(folders[length_1]), attr);
                }
                if (!isNOU(attr)) {
                    setValue('_fm_htmlAttr', attr, folders[length_1]);
                }
                length_1++;
            }
            this.treeObj.addNodes(directories, target, null, prevent);
        }
    };
    NavigationPane.prototype.onNodeSelected = function (args) {
        if (this.parent.breadcrumbbarModule && this.parent.breadcrumbbarModule.searchObj && !this.renameParent) {
            this.parent.breadcrumbbarModule.searchObj.element.value = '';
            this.parent.isFiltered = false;
        }
        this.parent.searchedItems = [];
        if (!args.isInteracted && !this.isRightClick && !this.isPathDragged && !this.isRenameParent) {
            return;
        }
        this.activeNode = args.node;
        this.parent.activeModule = 'navigationpane';
        var nodeData = this.getTreeData(getValue('id', args.nodeData));
        if (!this.renameParent) {
            var eventArgs = { cancel: false, fileDetails: nodeData[0], module: 'NavigationPane' };
            delete eventArgs.cancel;
            this.parent.trigger('fileOpen', eventArgs);
        }
        this.parent.selectedItems = [];
        this.parent.itemData = nodeData;
        updatePath(args.node, this.parent.itemData[0], this.parent);
        this.expandNodeTarget = null;
        if (args.node.querySelector('.' + CLS.ICONS) && args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
            this.expandNodeTarget = 'add';
        }
        read(this.parent, this.isPathDragged ? events.pasteEnd : events.pathChanged, this.parent.path);
        this.parent.visitedItem = args.node;
        this.isPathDragged = this.isRenameParent = this.isRightClick = false;
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onPathDrag = function (args) {
        this.isPathDragged = true;
        this.selectResultNode(args[0]);
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onNodeExpand = function (args) {
        if (!args.isInteracted && !this.isDrag) {
            return;
        }
        if (args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
            var text = getValue('text', args.nodeData);
            var id = args.node.getAttribute('data-id');
            var isId = isNOU(id) ? false : true;
            var newText = isNOU(id) ? text : id;
            var path = getPath(args.node, newText, isId);
            this.expandNodeTarget = args.node.getAttribute('data-uid');
            this.parent.expandedId = this.expandNodeTarget;
            this.parent.itemData = this.getTreeData(getValue('id', args.nodeData));
            read(this.parent, events.nodeExpand, path);
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onNodeExpanded = function (args) {
        this.addChild(args.files, this.expandNodeTarget, false);
        this.parent.expandedId = null;
    };
    NavigationPane.prototype.onNodeClicked = function (args) {
        this.parent.activeModule = 'navigationpane';
        this.activeNode = args.node;
        if ((args.event.which === 3) && (args.node.getAttribute('data-uid') !== this.treeObj.selectedNodes[0])) {
            this.isRightClick = true;
            this.treeObj.selectedNodes = [args.node.getAttribute('data-uid')];
        }
        else if (args.node.getAttribute('data-uid') === this.treeObj.selectedNodes[0] && this.parent.selectedItems.length !== 0) {
            this.parent.setProperties({ selectedItems: [] }, true);
            var layout = (this.parent.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
            this.parent.notify(events.modelChanged, { module: layout, newProp: { selectedItems: [] } });
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onNodeEditing = function (args) {
        if (!isNOU(args.innerHtml)) {
            args.cancel = true;
        }
    };
    NavigationPane.prototype.onPathChanged = function (args) {
        this.parent.isCut = false;
        var currFiles = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feFiles);
        if (this.expandNodeTarget === 'add') {
            var sNode = select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
            var ul = select('.' + CLS.LIST_PARENT, sNode);
            if (isNOU(ul)) {
                this.addChild(args.files, this.treeObj.selectedNodes[0], !this.expandTree);
            }
            this.expandNodeTarget = '';
        }
        this.expandTree = false;
        if (isNOU(currFiles)) {
            setValue(this.parent.pathId[this.parent.pathId.length - 1], args.files, this.parent.feFiles);
        }
    };
    NavigationPane.prototype.updateTree = function (args) {
        if (this.treeObj) {
            var id = this.treeObj.selectedNodes[0];
            this.updateTreeNode(args, id);
        }
    };
    NavigationPane.prototype.updateTreeNode = function (args, id) {
        var toExpand = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
        this.removeChildNodes(id);
        this.addChild(args.files, id, !toExpand);
    };
    NavigationPane.prototype.removeChildNodes = function (id) {
        var sNode = select('[data-uid="' + id + '"]', this.treeObj.element);
        var parent = select('.' + CLS.LIST_PARENT, sNode);
        var childs = parent ? Array.prototype.slice.call(parent.children) : null;
        if (childs) {
            this.treeObj.removeNodes(childs);
        }
    };
    NavigationPane.prototype.onOpenEnd = function (args) {
        var sleId = this.parent.pathId[this.parent.pathId.length - 1];
        this.treeObj.expandAll(this.treeObj.selectedNodes);
        this.treeObj.selectedNodes = [sleId];
        this.expandNodeTarget = 'add';
        this.onPathChanged(args);
    };
    NavigationPane.prototype.onOpenInit = function (args) {
        if (this.parent.activeModule === 'navigationpane') {
            if (args.target.querySelector('.' + CLS.ICONS)) {
                this.treeObj.expandAll(this.treeObj.selectedNodes);
            }
        }
    };
    NavigationPane.prototype.onInitialEnd = function (args) {
        this.onInit();
        this.addChild(args.files, getValue('_fm_id', args.cwd), false);
    };
    NavigationPane.prototype.onFinalizeEnd = function (args) {
        this.onInit();
        var id = getValue('_fm_id', args.cwd);
        this.removeChildNodes(id);
        this.addChild(args.files, id, false);
        this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
    };
    NavigationPane.prototype.onCreateEnd = function (args) {
        this.updateTree(args);
    };
    NavigationPane.prototype.onSelectedData = function () {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateItemData();
        }
    };
    NavigationPane.prototype.onDeleteInit = function () {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateActionData();
            var name_1 = getValue('name', this.parent.itemData[0]);
            Delete(this.parent, [name_1], this.parent.path, 'delete');
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDeleteEnd = function (args) {
        if (this.parent.activeModule === 'navigationpane') {
            var selectedNode = this.treeObj.selectedNodes[0];
            var selcetedEle = select('[data-uid="' + selectedNode + '"]', this.treeObj.element);
            var selectedNodeEle = closest(selcetedEle, '.' + CLS.LIST_PARENT).parentElement;
            this.treeObj.selectedNodes = [selectedNodeEle.getAttribute('data-uid')];
            this.treeObj.dataBind();
        }
        this.updateTree(args);
    };
    NavigationPane.prototype.onRefreshEnd = function (args) {
        this.updateTree(args);
    };
    NavigationPane.prototype.onRenameInit = function () {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateRenameData();
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onRenameEndParent = function (args) {
        var id = this.renameParent ? this.renameParent : this.parent.pathId[this.parent.pathId.length - 1];
        this.expandTree = this.treeObj.expandedNodes.indexOf(this.treeObj.selectedNodes[0]) !== -1;
        this.updateTreeNode(args, id);
        this.parent.expandedId = null;
        if (this.renameParent) {
            this.renameParent = null;
        }
        else {
            var resultData = [];
            if (this.parent.hasId) {
                resultData = new DataManager(this.treeObj.getTreeData()).
                    executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
            }
            else {
                var nData = new DataManager(this.treeObj.getTreeData()).
                    executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.renameText, false));
                if (nData.length > 0) {
                    resultData = new DataManager(nData).
                        executeLocal(new Query().where('_fm_pId', 'equal', id, false));
                }
            }
            if (resultData.length > 0) {
                this.isRenameParent = true;
                var id_1 = getValue(this.treeObj.fields.id, resultData[0]);
                this.treeObj.selectedNodes = [id_1];
                this.treeObj.dataBind();
            }
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onRenameEnd = function (args) {
        if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
            this.updateTree(args);
        }
        else {
            var data = this.treeObj.getTreeData();
            var resultData = [];
            if (this.parent.hasId) {
                resultData = new DataManager(data).
                    executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
            }
            else {
                var nData = new DataManager(data).
                    executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
                if (nData.length > 0) {
                    resultData = new DataManager(nData).
                        executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
                }
            }
            if (resultData.length > 0) {
                this.renameParent = getValue(this.treeObj.fields.parentID, resultData[0]);
                this.parent.expandedId = this.renameParent;
                this.parent.itemData = this.getTreeData(this.renameParent);
                read(this.parent, events.renameEndParent, this.parent.filterPath.replace(/\\/g, '/'));
            }
        }
    };
    NavigationPane.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'allowDragAndDrop':
                    this.addDragDrop();
                    break;
                case 'navigationPaneSettings':
                    read(this.parent, events.finalizeEnd, '/');
                    break;
            }
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDownLoadInit = function () {
        this.doDownload();
    };
    NavigationPane.prototype.onSelectionChanged = function (e) {
        this.treeObj.selectedNodes = [e.selectedNode];
    };
    NavigationPane.prototype.onClearPathInit = function (e) {
        this.removeChildNodes(e.selectedNode);
    };
    NavigationPane.prototype.onDragEnd = function (args) {
        var moveNames = [];
        if (this.parent.isPasteError || this.parent.isSearchDrag) {
            moveNames = this.getMoveNames(args.files, this.parent.isSearchDrag, this.parent.dragPath);
        }
        else {
            moveNames = this.moveNames;
        }
        this.treeObj.removeNodes(moveNames);
    };
    NavigationPane.prototype.getMoveNames = function (files, flag, path) {
        var moveNames = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].isFile) {
                if (!this.parent.hasId) {
                    var name_2 = (files[i].previousName);
                    if (flag) {
                        path = path + files[i].previousName;
                        var index = path.lastIndexOf('/');
                        name_2 = path.substring(index + 1);
                        path = path.substring(0, index + 1);
                    }
                    var resultData = new DataManager(this.treeObj.getTreeData()).
                        executeLocal(new Query().where(this.treeObj.fields.text, 'equal', name_2, false));
                    for (var j = 0; j < resultData.length; j++) {
                        var fPath = getValue('filterPath', resultData[j]);
                        fPath = fPath.replace(/\\/g, '/');
                        if (fPath === path) {
                            moveNames.push(getValue(this.treeObj.fields.id, resultData[j]));
                            break;
                        }
                    }
                }
            }
        }
        return moveNames;
    };
    NavigationPane.prototype.onCutEnd = function (args) {
        var moveNames = [];
        if (this.parent.isPasteError || this.parent.isSearchCut) {
            this.moveNames = this.getMoveNames(args.files, this.parent.isSearchCut, this.parent.targetPath);
        }
        else {
            moveNames = this.moveNames;
        }
        this.treeObj.removeNodes(moveNames);
    };
    /* istanbul ignore next */
    NavigationPane.prototype.selectResultNode = function (resultObj) {
        if (!this.parent.hasId) {
            var path = getValue('filterPath', resultObj);
            var itemname = getValue('name', resultObj);
            var data = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where(this.treeObj.fields.text, 'equal', itemname, false));
            if (data.length > 0) {
                var resultData = new DataManager(data).
                    executeLocal(new Query().where('filterPath', 'equal', path, false));
                if (resultData.length > 0) {
                    var id = getValue(this.treeObj.fields.id, resultData[0]);
                    this.treeObj.selectedNodes = [id];
                    this.treeObj.dataBind();
                }
            }
        }
        else {
            this.treeObj.selectedNodes = [getValue('_fm_id', resultObj)];
            this.treeObj.dataBind();
        }
    };
    NavigationPane.prototype.onDropPath = function (args) {
        this.onpasteEnd(args);
        this.selectResultNode(this.parent.dropData);
        this.parent.isDropEnd = !this.parent.isPasteError;
    };
    NavigationPane.prototype.onpasteEnd = function (args) {
        var resultData = [];
        if (this.parent.hasId) {
            resultData = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where('id', 'equal', getValue('id', args.cwd), false));
        }
        else {
            var nData = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where(this.treeObj.fields.text, 'equal', getValue('name', args.cwd), false));
            if (nData.length > 0) {
                resultData = new DataManager(nData).
                    executeLocal(new Query().where('filterPath', 'equal', getValue('filterPath', args.cwd), false));
            }
        }
        if (resultData.length > 0) {
            var id = getValue(this.treeObj.fields.id, resultData[0]);
            var toExpand = this.treeObj.expandedNodes.indexOf(id) === -1;
            this.removeChildNodes(id);
            this.addChild(args.files, id, toExpand);
        }
        this.parent.expandedId = null;
        this.onPathChanged(args);
        if (this.parent.isDragDrop) {
            this.checkDropPath(args);
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.checkDropPath = function (args) {
        if (this.parent.hasId) {
            this.parent.isDropEnd = !this.parent.isPasteError;
            return;
        }
        if ((this.parent.dropPath.indexOf(getDirectoryPath(this.parent, args)) === -1)) {
            this.parent.isDropEnd = false;
            readDropPath(this.parent);
        }
        else {
            this.parent.isDropEnd = !this.parent.isPasteError;
        }
    };
    NavigationPane.prototype.onpasteInit = function () {
        if (this.parent.activeModule === this.getModuleName()) {
            this.updateItemData();
        }
        this.moveNames = [];
        var obj = this.parent.isDragDrop ? this.parent.dragData : this.parent.actionRecords;
        for (var i = 0; i < obj.length; i++) {
            if (getValue('isFile', obj[i]) === false) {
                this.moveNames.push(getValue('_fm_id', obj[i]));
            }
        }
    };
    NavigationPane.prototype.oncutCopyInit = function () {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.activeRecords = this.getTreeData(this.treeObj.selectedNodes[0]);
            this.parent.activeElements = [this.activeNode];
        }
    };
    NavigationPane.prototype.addEventListener = function () {
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.downloadInit, this.onDownLoadInit, this);
        this.parent.on(events.initialEnd, this.onInitialEnd, this);
        this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(events.pathChanged, this.onPathChanged, this);
        this.parent.on(events.pasteEnd, this.onpasteEnd, this);
        this.parent.on(events.cutEnd, this.onCutEnd, this);
        this.parent.on(events.pasteInit, this.onpasteInit, this);
        this.parent.on(events.nodeExpand, this.onNodeExpanded, this);
        this.parent.on(events.createEnd, this.onCreateEnd, this);
        this.parent.on(events.selectedData, this.onSelectedData, this);
        this.parent.on(events.deleteInit, this.onDeleteInit, this);
        this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
        this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
        this.parent.on(events.updateTreeSelection, this.onSelectionChanged, this);
        this.parent.on(events.openInit, this.onOpenInit, this);
        this.parent.on(events.openEnd, this.onOpenEnd, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.renameInit, this.onRenameInit, this);
        this.parent.on(events.renameEnd, this.onRenameEnd, this);
        this.parent.on(events.renameEndParent, this.onRenameEndParent, this);
        this.parent.on(events.clearPathInit, this.onClearPathInit, this);
        this.parent.on(events.cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(events.dropInit, this.onDropInit, this);
        this.parent.on(events.menuItemData, this.onMenuItemData, this);
        this.parent.on(events.dragEnd, this.onDragEnd, this);
        this.parent.on(events.dragging, this.onDragging, this);
        this.parent.on(events.dropPath, this.onDropPath, this);
        this.parent.on(events.detailsInit, this.onDetailsInit, this);
        this.parent.on(events.pathDrag, this.onPathDrag, this);
    };
    NavigationPane.prototype.removeEventListener = function () {
        this.parent.off(events.initialEnd, this.onInitialEnd);
        this.parent.off(events.downloadInit, this.onDownLoadInit);
        this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
        this.parent.off(events.selectedData, this.onSelectedData);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.pathChanged, this.onPathChanged);
        this.parent.off(events.pasteEnd, this.onpasteEnd);
        this.parent.off(events.cutEnd, this.onCutEnd);
        this.parent.off(events.pasteInit, this.onpasteInit);
        this.parent.off(events.updateTreeSelection, this.onSelectionChanged);
        this.parent.off(events.nodeExpand, this.onNodeExpanded);
        this.parent.off(events.createEnd, this.onCreateEnd);
        this.parent.off(events.refreshEnd, this.onRefreshEnd);
        this.parent.off(events.openInit, this.onOpenInit);
        this.parent.off(events.openEnd, this.onOpenEnd);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.renameInit, this.onRenameInit);
        this.parent.off(events.renameEnd, this.onRenameEnd);
        this.parent.off(events.renameEndParent, this.onRenameEndParent);
        this.parent.off(events.clearPathInit, this.onClearPathInit);
        this.parent.off(events.deleteInit, this.onDeleteInit);
        this.parent.off(events.deleteEnd, this.onDeleteEnd);
        this.parent.off(events.cutCopyInit, this.oncutCopyInit);
        this.parent.off(events.dropInit, this.onDropInit);
        this.parent.off(events.dragEnd, this.onDragEnd);
        this.parent.off(events.dragging, this.onDragging);
        this.parent.off(events.dropPath, this.onDropPath);
        this.parent.off(events.detailsInit, this.onDetailsInit);
        this.parent.off(events.menuItemData, this.onMenuItemData);
        this.parent.off(events.pathDrag, this.onPathDrag);
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDetailsInit = function () {
        if (this.parent.activeModule === this.getModuleName()) {
            var dataobj = this.getTreeData(this.treeObj.selectedNodes[0]);
            this.parent.itemData = dataobj;
        }
    };
    NavigationPane.prototype.onMenuItemData = function (args) {
        if (this.parent.activeModule === this.getModuleName()) {
            var liEle = closest(args.target, 'li');
            this.parent.itemData = this.getTreeData(liEle.getAttribute('data-uid'));
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDragging = function (args) {
        var ele = closest(args.target, 'li');
        if (ele.classList.contains('e-node-collapsed')) {
            this.isDrag = true;
            var level = parseInt(ele.getAttribute('aria-level'), 10);
            this.treeObj.expandAll([ele.getAttribute('data-uid')], level + 1);
            this.isDrag = false;
        }
    };
    NavigationPane.prototype.onDropInit = function (args) {
        if (this.parent.targetModule === this.getModuleName()) {
            var dropLi = closest(args.target, 'li');
            this.parent.dropData = this.getTreeData(dropLi)[0];
            this.parent.dropPath = this.getDropPath(dropLi, getValue('name', this.parent.dropData));
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    NavigationPane.prototype.getModuleName = function () {
        return 'navigationpane';
    };
    NavigationPane.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.treeObj) {
            this.unWireEvents();
            this.treeObj.destroy();
        }
    };
    NavigationPane.prototype.wireEvents = function () {
        this.keyboardModule = new KeyboardEvents(this.treeObj.element, {
            keyAction: this.keyDown.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    NavigationPane.prototype.unWireEvents = function () {
        this.keyboardModule.destroy();
    };
    /* istanbul ignore next */
    NavigationPane.prototype.keyDown = function (e) {
        var action = e.action;
        switch (action) {
            case 'altEnter':
                this.parent.notify(events.detailsInit, {});
                GetDetails(this.parent, [], this.parent.path, 'details');
                break;
            case 'esc':
                removeActive(this.parent);
                break;
            case 'del':
                this.updateItemData();
                if (!hasEditAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionEdit);
                }
                else {
                    this.removeNodes = [];
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'ctrlC':
                copyFiles(this.parent);
                break;
            case 'ctrlV':
                this.parent.folderPath = '';
                pasteHandler(this.parent);
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                break;
            case 'shiftF10':
                this.updateItemData();
                if (!hasDownloadAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionDownload);
                    return;
                }
                if (this.parent.selectedItems.length !== 0) {
                    this.doDownload();
                }
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 0) {
                    var data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
                    if (!hasEditAccess(data)) {
                        createDeniedDialog(this.parent, data, events.permissionEdit);
                    }
                    else {
                        this.updateRenameData();
                        createDialog(this.parent, 'Rename');
                    }
                }
                break;
        }
    };
    NavigationPane.prototype.getTreeData = function (args) {
        var data = this.treeObj.getTreeData(args);
        for (var i = 0; i < data.length; i++) {
            if (isNOU(getValue('hasChild', data[i]))) {
                setValue('hasChild', false, data[i]);
            }
        }
        return data;
    };
    NavigationPane.prototype.updateRenameData = function () {
        this.updateItemData();
        this.parent.currentItemText = getValue('name', this.parent.itemData[0]);
    };
    NavigationPane.prototype.updateItemData = function () {
        var data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
        this.parent.itemData = [data];
        this.parent.isFile = false;
    };
    NavigationPane.prototype.updateActionData = function () {
        this.updateItemData();
        var newPath = getParentPath(this.parent.path);
        this.parent.setProperties({ path: newPath }, true);
        this.parent.pathId.pop();
        this.parent.pathNames.pop();
    };
    /* istanbul ignore next */
    NavigationPane.prototype.doDownload = function () {
        var newPath = getParentPath(this.parent.path);
        var itemId = this.treeObj.selectedNodes[0];
        var name = (itemId === this.parent.pathId[0]) ? '' : getValue('name', this.parent.itemData[0]);
        Download(this.parent, newPath, [name]);
    };
    return NavigationPane;
}());
export { NavigationPane };
