import { TreeGrid, RowDD as TreeGridRowDD } from '@syncfusion/ej2-treegrid';
import { isNullOrUndefined, extend, classList, addClass, getValue, closest } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
/**
 * Gantt Excel Export module
 */
var RowDD = /** @class */ (function () {
    /**
     * Constructor for Excel Export module
     */
    function RowDD(gantt) {
        this.isTest = false;
        /** @hidden */
        this.updateParentRecords = [];
        /** @hidden */
        this.isaddtoBottom = false;
        /** @hidden */
        this.isSharedTask = false;
        /** @hidden */
        this.canDrop = true;
        this.parent = gantt;
        TreeGrid.Inject(TreeGridRowDD);
        this.parent.treeGrid.allowRowDragAndDrop = this.parent.allowRowDragAndDrop;
        this.bindEvents();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    RowDD.prototype.getModuleName = function () {
        return 'rowDragAndDrop';
    };
    /**
     * To destroy excel export module.
     * @private
     */
    RowDD.prototype.destroy = function () {
        // Destroy Method
    };
    /**
     * To bind excel exporting events.
     * @return {void}
     * @private
     */
    RowDD.prototype.bindEvents = function () {
        this.parent.treeGrid.rowDragStart = this.rowDragStart.bind(this);
        this.parent.treeGrid.rowDragStartHelper = this.rowDragStartHelper.bind(this);
        this.parent.treeGrid.rowDrag = this.rowDrag.bind(this);
        this.parent.treeGrid.rowDrop = this.rowDrop.bind(this);
    };
    RowDD.prototype.rowDragStart = function (args) {
        this.parent.trigger('rowDragStart', args);
        this.parent.element.style.position = 'relative'; // for positioning the drag element properly
    };
    RowDD.prototype.addErrorElem = function () {
        var dragelem = document.getElementsByClassName('e-ganttdrag')[0];
        var errorelem = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem) {
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
    RowDD.prototype.rowDrag = function (args) {
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        cloneElement.style.display = 'none';
        var ganttDragElement = cloneElement.cloneNode(true);
        ganttDragElement.classList.add('e-ganttdrag');
        ganttDragElement.style.display = '';
        if (this.parent.element.querySelectorAll('.e-cloneproperties').length <= 1) {
            this.parent.element.appendChild(ganttDragElement);
        }
        else {
            if (document.getElementsByClassName('e-cloneproperties')[0].querySelectorAll('.e-errorelem').length) {
                this.addErrorElem();
            }
            else {
                this.removeErrorElem();
            }
        }
        if (this.parent.gridLines === 'Both') {
            addClass(this.parent.element.querySelectorAll('.e-ganttdrag .e-rowcell'), ['e-bothganttlines']);
        }
        var dragElement = this.parent.element.querySelector('.e-ganttdrag');
        var ganttTop = this.parent.element.getClientRects()[0].top;
        var ganttLeft = this.parent.element.getClientRects()[0].left;
        var left = getValue('event', args.originalEvent).clientX - ganttLeft;
        var top = getValue('event', args.originalEvent).clientY - ganttTop;
        dragElement.style.left = left + 20 + 'px';
        dragElement.style.top = top + 20 + 'px';
        this.parent.trigger('rowDrag', args);
    };
    RowDD.prototype.rowDragStartHelper = function (args) {
        this.parent.trigger('rowDragStartHelper', args);
        if (this.parent.readOnly || this.parent.filterSettings.columns.length > 0) {
            args.cancel = true;
        }
        if (this.parent.viewType === 'ResourceView' && getValue('level', args.data[0]) === 0) {
            args.cancel = true;
        }
    };
    RowDD.prototype.rowDrop = function (args) {
        var ganttDragelem = document.querySelector('.e-ganttdrag');
        if (ganttDragelem) {
            ganttDragelem.remove();
        }
        var gridRow = closest(args.target, '.e-row');
        var dropIndex = gridRow ? parseInt(gridRow.getAttribute('aria-rowindex'), 10) : args.dropIndex;
        args.dropIndex = dropIndex;
        args.dropRecord = this.parent.currentViewData[args.dropIndex];
        this.parent.trigger('rowDrop', args);
        if (this.parent.viewType === 'ResourceView') {
            if (args.dropPosition === 'middleSegment') {
                if (args.dropRecord.level === 1 || args.dropRecord.uniqueID === getValue('parentItem', args.data[0]).uniqueID) {
                    args.cancel = true; // preventing to drop the record as child to any child records 
                }
            }
            if (args.dropPosition !== 'middleSegment') {
                if (args.dropRecord.level === 0 || getValue('parentItem', args.data[0]).uniqueID === args.dropRecord.parentItem.uniqueID) {
                    args.cancel = true;
                }
            }
        }
        if (!args.cancel) {
            args.cancel = true;
            args.requestType = 'beforeDrop';
            this.parent.trigger('actionBegin', args);
            this.dropRows(args, true); // method to update the data collections based on drop action
        }
    };
    /* tslint:disable-next-line:max-func-body-length */
    RowDD.prototype.dropRows = function (args, isByMethod) {
        if (!this.parent.readOnly) {
            this.dropPosition = args.dropPosition;
            if (args.dropPosition !== 'Invalid' && this.parent.editModule) {
                var gObj = this.parent;
                var draggedRecord = void 0;
                var droppedRecord = void 0;
                this.droppedRecord = gObj.currentViewData[args.dropIndex];
                var dragRecords = [];
                droppedRecord = this.droppedRecord;
                if (!args.data[0]) {
                    dragRecords.push(args.data);
                }
                else {
                    dragRecords = args.data;
                }
                var count = 0;
                var dragLength = dragRecords.length;
                for (var i = 0; i < dragLength; i++) {
                    this.parent.isOnEdit = true;
                    draggedRecord = dragRecords[i];
                    this.draggedRecord = draggedRecord;
                    if (this.dropPosition !== 'Invalid') {
                        if (this.parent.viewType === 'ResourceView') {
                            this.checkisSharedTask();
                            this.previousParent = this.draggedRecord.parentItem.uniqueID;
                        }
                        if (this.isSharedTask) {
                            return;
                        }
                        if (isByMethod) {
                            this.deleteDragRow();
                        }
                        var recordIndex1 = this.treeGridData.indexOf(droppedRecord);
                        if (this.dropPosition === 'topSegment') {
                            this.dropAtTop(recordIndex1);
                        }
                        if (this.dropPosition === 'bottomSegment') {
                            if (!this.isSharedTask) {
                                if (!droppedRecord.hasChildRecords) {
                                    if (this.parent.taskFields.parentID && this.ganttData.length > 0) {
                                        this.ganttData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                                    }
                                    this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                                    this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                                    if (this.parent.viewType === 'ResourceView') {
                                        /* tslint:disable-next-line */
                                        var taskId = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                                        this.parent.getTaskIds().splice(recordIndex1 + 1, 0, taskId);
                                    }
                                }
                                else {
                                    count = this.parent.editModule.getChildCount(droppedRecord, 0);
                                    if (this.parent.taskFields.parentID && this.ganttData.length > 0) {
                                        this.ganttData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                                    }
                                    this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                                    this.parent.ids.splice(recordIndex1 + count + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                                    if (this.parent.viewType === 'ResourceView') {
                                        /* tslint:disable-next-line */
                                        var spliceId = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                                        this.parent.getTaskIds().splice(recordIndex1 + count + 1, 0, spliceId);
                                    }
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
                                    var rec = this.parent.getParentTask(droppedRecord.parentItem).childRecords;
                                    var childRecords = rec;
                                    var droppedRecordIndex = childRecords.indexOf(droppedRecord) + 1;
                                    childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                                }
                            }
                        }
                        if (this.dropPosition === 'middleSegment') {
                            this.dropMiddle(recordIndex1);
                        }
                        if (!isNullOrUndefined(draggedRecord.parentItem && this.updateParentRecords.indexOf(draggedRecord.parentItem) !== -1)) {
                            this.updateParentRecords.push(draggedRecord.parentItem);
                        }
                    }
                    gObj.rowDragAndDropModule.refreshDataSource();
                }
                if (this.dropPosition === 'middleSegment') {
                    if (droppedRecord.ganttProperties.predecessor) {
                        this.parent.editModule.removePredecessorOnDelete(droppedRecord);
                        droppedRecord.ganttProperties.predecessor = null;
                        droppedRecord.ganttProperties.predecessorsName = null;
                        droppedRecord[this.parent.taskFields.dependency] = null;
                        droppedRecord.taskData[this.parent.taskFields.dependency] = null;
                    }
                    if (droppedRecord.ganttProperties.isMilestone) {
                        this.parent.setRecordValue('isMilestone', false, droppedRecord.ganttProperties, true);
                        if (!isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.milestone])) {
                            if (droppedRecord.taskData[this.parent.taskFields.milestone] === true) {
                                droppedRecord.taskData[this.parent.taskFields.milestone] = false;
                            }
                        }
                    }
                }
                if (this.parent.viewType === 'ResourceView' && !this.isSharedTask) {
                    var parentUniqueID = void 0;
                    if (this.dropPosition === 'middleSegment') {
                        parentUniqueID = this.droppedRecord.uniqueID;
                    }
                    else {
                        parentUniqueID = this.droppedRecord.parentItem.uniqueID;
                    }
                    var droppedParentItem = this.parent.getTaskByUniqueID(parentUniqueID);
                    var editedObj = {};
                    editedObj[this.parent.taskFields.resourceInfo] = [];
                    editedObj[this.parent.taskFields.resourceInfo].push(droppedParentItem.ganttProperties.taskId);
                    this.removeExistingResources();
                    var tempResourceInfo = this.parent.dataOperation.setResourceInfo(editedObj);
                    var currentTask = this.draggedRecord;
                    if (isNullOrUndefined(currentTask.ganttProperties.resourceInfo)) {
                        currentTask.ganttProperties.resourceInfo = [];
                    }
                    if (droppedParentItem.ganttProperties.taskName === 'Unassigned Task') {
                        currentTask.ganttProperties.resourceInfo = [];
                        currentTask.ganttProperties.sharedTaskUniqueIds = [currentTask.ganttProperties.rowUniqueID];
                    }
                    else {
                        currentTask.ganttProperties.resourceInfo.push(tempResourceInfo[0]);
                    }
                    this.updateCurrentTask(currentTask);
                    if (droppedParentItem.ganttProperties.taskName === 'Unassigned Task') {
                        this.deleteSharedResourceTask();
                    }
                    else {
                        this.updateSharedResourceTask();
                    }
                }
                // method to update the edited parent records
                for (var j = 0; j < this.updateParentRecords.length; j++) {
                    this.parent.dataOperation.updateParentItems(this.updateParentRecords[j]);
                }
                this.updateParentRecords = [];
                this.parent.isOnEdit = false;
            }
            this.parent.treeGrid.parentData = [];
            this.parent.treeGrid.refresh();
            args.requestType = 'rowDropped';
            args.modifiedRecords = this.parent.editedRecords;
            this.parent.trigger('actionComplete', args);
            this.parent.editedRecords = [];
        }
    };
    RowDD.prototype.updateCurrentTask = function (currentTask) {
        this.parent.dataOperation.updateMappingData(currentTask, 'resourceInfo');
        this.parent.editModule.updateResourceRelatedFields(currentTask, 'resource');
        /* tslint:disable-next-line:no-any */
        this.parent.editModule.dialogModule.dialogEditValidationFlag = false;
        this.parent.editModule.dialogModule.validateDuration(currentTask);
        this.parent.dataOperation.updateWidthLeft(currentTask);
        this.parent.dataOperation.updateTaskData(currentTask);
    };
    RowDD.prototype.deleteSharedResourceTask = function () {
        for (var i = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i] === 'T' + this.draggedRecord.ganttProperties.taskId) {
                /* tslint:disable-next-line */
                if (this.parent.getTaskByUniqueID(this.parent.currentViewData[i].parentItem.uniqueID).ganttProperties.taskName !== 'Unassigned Task') {
                    this.removeRecords(this.parent.currentViewData[i]);
                }
                /* tslint:disable-next-line */
                if (!isNullOrUndefined(this.parent.currentViewData[i].parentItem && this.updateParentRecords.indexOf(this.parent.currentViewData[i].parentItem) !== -1)) {
                    this.updateParentRecords.push(this.parent.currentViewData[i].parentItem);
                }
            }
        }
    };
    RowDD.prototype.removeExistingResources = function () {
        var preParentRecord = this.parent.getTaskByUniqueID(this.previousParent);
        if (this.draggedRecord.ganttProperties.resourceInfo) {
            for (var count = 0; count < this.draggedRecord.ganttProperties.resourceInfo.length; count++) {
                /* tslint:disable-next-line */
                if (this.draggedRecord.ganttProperties.resourceInfo[count][this.parent.resourceFields.id] === preParentRecord.ganttProperties.taskId) {
                    this.draggedRecord.ganttProperties.resourceInfo.splice(count, 1);
                    break;
                }
            }
        }
    };
    /*update the record for the same task which are shared with other tasks*/
    RowDD.prototype.updateSharedResourceTask = function () {
        for (var i = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i] === 'T' + this.draggedRecord.ganttProperties.taskId) {
                this.parent.editModule.updateGanttProperties(this.draggedRecord, this.parent.currentViewData[i]);
                this.parent.dataOperation.updateTaskData(this.parent.currentViewData[i]);
                /* tslint:disable-next-line */
                if (!isNullOrUndefined(this.parent.currentViewData[i].parentItem && this.updateParentRecords.indexOf(this.parent.currentViewData[i].parentItem) !== -1)) {
                    this.updateParentRecords.push(this.parent.currentViewData[i].parentItem);
                }
            }
        }
    };
    RowDD.prototype._getExistingTaskWithID = function (record) {
        var existingTasks = [];
        for (var i = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i] === 'T' + record.ganttProperties.taskId) {
                existingTasks.push(this.parent.currentViewData[i]);
            }
        }
        return existingTasks;
    };
    /*Method to remove resource from resource Info collection and update reosurce related fields*/
    RowDD.prototype.removeResourceInfo = function (record) {
        var droppedParentItem = this.parent.getTaskByUniqueID(this.draggedRecord.parentItem.uniqueID);
        if (record.ganttProperties.resourceInfo && record.ganttProperties.resourceInfo.length > 1) {
            var sameIdTasks = this._getExistingTaskWithID(record);
            var currentTask = void 0;
            if (sameIdTasks == null) {
                return;
            }
            for (var i = 0; i < sameIdTasks.length; i++) {
                currentTask = sameIdTasks[i];
                var resources = currentTask.ganttProperties.resourceInfo;
                for (var count = 0; count < resources.length; count++) {
                    if (resources[count][this.parent.resourceFields.id] === droppedParentItem.ganttProperties.taskId) {
                        resources.splice(count, 1);
                        this.parent.setRecordValue('resourceInfo', resources, currentTask.ganttProperties, true);
                        this.updateCurrentTask(currentTask);
                        if (!isNullOrUndefined(currentTask.parentItem && this.updateParentRecords.indexOf(currentTask.parentItem) !== -1)) {
                            this.updateParentRecords.push(currentTask.parentItem);
                        }
                        break;
                    }
                }
            }
        }
    };
    RowDD.prototype.refreshDataSource = function () {
        var draggedRecord = this.draggedRecord;
        var droppedRecord = this.droppedRecord;
        var proxy = this.parent;
        var tempDataSource;
        var idx;
        if (this.parent.dataSource instanceof DataManager) {
            tempDataSource = getValue('dataOperation.dataArray', this.parent);
        }
        else {
            tempDataSource = proxy.dataSource;
        }
        if (tempDataSource.length > 0 && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (var i = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.taskFields.child] === droppedRecord.taskData[this.parent.taskFields.child]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.taskFields.parentID) {
                    tempDataSource.splice(idx, 0, draggedRecord.taskData);
                }
            }
            else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.taskFields.parentID) {
                    tempDataSource.splice(idx + 1, 0, draggedRecord.taskData);
                }
            }
        }
        else if (!this.parent.taskFields.parentID && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                var rowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRecord;
                this.parent.editModule.updateRealDataSource(draggedRecord, rowPosition);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
            if (draggedRecord.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRecord[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.parentID];
                    draggedRecord.taskData[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.parentID];
                    draggedRecord.ganttProperties.parentId = droppedRecord[this.parent.taskFields.parentID];
                }
                else {
                    draggedRecord[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.id];
                    draggedRecord.taskData[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.id];
                    draggedRecord.ganttProperties.parentId = droppedRecord[this.parent.taskFields.id];
                }
            }
            else {
                draggedRecord[this.parent.taskFields.parentID] = null;
                draggedRecord.taskData[this.parent.taskFields.parentID] = null;
                draggedRecord.ganttProperties.parentId = null;
            }
        }
    };
    RowDD.prototype.dropMiddle = function (recordIndex1) {
        var gObj = this.parent;
        var childRecords = this.parent.editModule.getChildCount(this.droppedRecord, 0);
        var childRecordsLength = (isNullOrUndefined(childRecords) ||
            childRecords === 0) ? recordIndex1 + 1 :
            childRecords + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment' && !this.isSharedTask) {
            if (gObj.taskFields.parentID && this.ganttData.length > 0) {
                this.ganttData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
            if (this.parent.viewType === 'ResourceView') {
                /* tslint:disable-next-line */
                var recordId = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                this.parent.getTaskIds().splice(childRecordsLength, 0, recordId);
            }
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
            this.recordLevel();
            if (isNullOrUndefined(this.draggedRecord.parentItem &&
                this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
        }
    };
    RowDD.prototype.recordLevel = function () {
        var gObj = this.parent;
        var draggedRecord = this.draggedRecord;
        var droppedRecord = this.droppedRecord;
        var childItem = gObj.taskFields.child;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            if (!droppedRecord.childRecords.length) {
                droppedRecord.childRecords = [];
                if (!gObj.taskFields.parentID && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            var parentItem = extend({}, droppedRecord);
            delete parentItem.childRecords;
            var createParentItem = {
                uniqueID: parentItem.uniqueID,
                expanded: parentItem.expanded,
                level: parentItem.level,
                index: parentItem.index,
                taskId: parentItem.ganttProperties.rowUniqueID
            };
            draggedRecord.parentItem = createParentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !gObj.taskFields.parentID && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[gObj.taskFields.child].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
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
        }
    };
    RowDD.prototype.deleteDragRow = function () {
        this.treeGridData = this.parent.treeGrid.dataSource;
        if (this.parent.dataSource instanceof DataManager) {
            this.ganttData = getValue('dataOperation.dataArray', this.parent);
        }
        else {
            this.ganttData = this.parent.dataSource;
        }
        var deletedRow;
        deletedRow = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    };
    //method to check the dropped record has already present in the child collection
    RowDD.prototype.checkisSharedTask = function () {
        this.isSharedTask = false;
        var sharedTask = null;
        var parentUniqueID = this.droppedRecord.level === 0 ? this.droppedRecord.uniqueID : this.droppedRecord.parentItem.uniqueID;
        var droppedParentItem = this.parent.getTaskByUniqueID(parentUniqueID);
        var childTasks = droppedParentItem.childRecords;
        for (var i = 0; i < childTasks.length; i++) {
            if ('T' + this.draggedRecord.ganttProperties.taskId === 'T' + childTasks[i].ganttProperties.taskId) {
                this.isSharedTask = true;
                sharedTask = childTasks[i];
            }
        }
        if (this.isSharedTask) {
            this.removeResourceInfo(sharedTask);
        }
    };
    RowDD.prototype.dropAtTop = function (recordIndex1) {
        var gObj = this.parent;
        if (!this.isSharedTask) {
            if (gObj.taskFields.parentID && this.ganttData.length > 0) {
                this.ganttData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            this.draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
            this.draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
            this.draggedRecord.level = this.treeGridData[recordIndex1].level;
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            this.parent.ids.splice(recordIndex1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
            if (this.parent.viewType === 'ResourceView') {
                /* tslint:disable-next-line */
                var id = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                this.parent.getTaskIds().splice(recordIndex1, 0, id);
            }
            if (this.draggedRecord.hasChildRecords) {
                var level = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                var rec = this.parent.getParentTask(this.droppedRecord.parentItem).childRecords;
                var childRecords = rec;
                var droppedRecordIndex = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
            /* tslint:disable-next-line */
            if (!isNullOrUndefined(this.draggedRecord.parentItem && this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
        }
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
                parentData = this.parent.getParentTask(record.parentItem);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    };
    RowDD.prototype.updateChildRecord = function (record, count, expanded) {
        var currentRecord;
        var gObj = this.parent;
        var length = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (var i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            gObj.flatData.splice(count, 0, currentRecord);
            this.parent.ids.splice(count, 0, currentRecord.ganttProperties.rowUniqueID.toString());
            if (gObj.taskFields.parentID && gObj.dataSource.length > 0) {
                this.ganttData.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    };
    RowDD.prototype.removeRecords = function (record) {
        var gObj = this.parent;
        var dataSource;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = getValue('dataOperation.dataArray', this.parent);
        }
        else {
            dataSource = this.parent.dataSource;
        }
        var deletedRow = record;
        var flatParentData = this.parent.getParentTask(deletedRow.parentItem);
        if (deletedRow) {
            if (deletedRow.parentItem) {
                var childRecords = flatParentData ? flatParentData.childRecords : [];
                var childIndex = 0;
                if (childRecords && childRecords.length > 0) {
                    if (this.parent.viewType === 'ResourceView' && childRecords.length === 1) {
                        //For updating the parent record which has zero parent reords.
                        this.parent.isOnDelete = true;
                        childRecords[0].isDelete = true;
                        this.parent.dataOperation.updateParentItems(flatParentData);
                        this.parent.isOnDelete = false;
                        childRecords[0].isDelete = false;
                    }
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.taskFields.parentID) {
                        flatParentData.taskData[this.parent.taskFields.child].splice(childIndex, 1);
                    }
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParentData);
                }
            }
            //method to delete the record from datasource collection
            if (!this.parent.taskFields.parentID) {
                var deleteRecordIDs = [];
                deleteRecordIDs.push(deletedRow.ganttProperties.rowUniqueID.toString());
                this.parent.editModule.removeFromDataSource(deleteRecordIDs);
            }
            if (gObj.taskFields.parentID) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                var idx = void 0;
                var ganttData = dataSource.length > 0 && this.parent.viewType !== 'ResourceView' ?
                    dataSource : this.parent.currentViewData;
                for (var i = 0; i < ganttData.length; i++) {
                    if (this.parent.viewType === 'ResourceView') {
                        if (ganttData[i].ganttProperties.rowUniqueID === deletedRow.ganttProperties.rowUniqueID) {
                            idx = i;
                        }
                    }
                    else {
                        if (ganttData[i][this.parent.taskFields.id] === deletedRow.taskData[this.parent.taskFields.id]) {
                            idx = i;
                        }
                    }
                }
                if (idx !== -1) {
                    if (dataSource.length > 0) {
                        dataSource.splice(idx, 1);
                    }
                    this.treeGridData.splice(idx, 1);
                    this.parent.ids.splice(idx, 1);
                    if (this.parent.treeGrid.parentData.indexOf(deletedRow) !== -1) {
                        this.parent.treeGrid.parentData.splice(this.parent.treeGrid.parentData.indexOf(deletedRow), 1);
                    }
                    if (this.parent.viewType === 'ResourceView') {
                        this.parent.getTaskIds().splice(idx, 1);
                    }
                }
            }
            var recordIndex = this.treeGridData.indexOf(deletedRow);
            if (!gObj.taskFields.parentID) {
                var deletedRecordCount = this.parent.editModule.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
                this.parent.ids.splice(recordIndex, deletedRecordCount + 1);
                var parentIndex = this.ganttData.indexOf(deletedRow.taskData);
                if (parentIndex !== -1) {
                    this.ganttData.splice(parentIndex, 1);
                    this.parent.treeGrid.parentData.splice(parentIndex, 1);
                }
                if (this.parent.viewType === 'ResourceView') {
                    this.parent.getTaskIds().splice(recordIndex, deletedRecordCount + 1);
                }
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
            }
        }
    };
    RowDD.prototype.removeChildItem = function (record) {
        var currentRecord;
        var idx;
        for (var i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            var ganttData = void 0;
            if (this.parent.dataSource instanceof DataManager) {
                ganttData = getValue('dataOperation.dataArray', this.parent);
            }
            else {
                ganttData = this.parent.dataSource;
            }
            for (var j = 0; j < ganttData.length; j++) {
                if (ganttData[j][this.parent.taskFields.id] === currentRecord.taskData[this.parent.taskFields.id]) {
                    idx = j;
                }
            }
            if (idx !== -1) {
                if (ganttData.length > 0) {
                    ganttData.splice(idx, 1);
                }
                this.treeGridData.splice(idx, 1);
                this.parent.ids.splice(idx, 1);
                if (this.parent.viewType === 'ResourceView') {
                    this.parent.getTaskIds().splice(idx, 1);
                }
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    };
    /**
     * Reorder the rows based on given indexes and position
     */
    RowDD.prototype.reorderRows = function (fromIndexes, toIndex, position) {
        if (!this.parent.readOnly) {
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
                    data[i] = this.parent.currentViewData[fromIndexes[i]];
                }
                var isByMethod = true;
                var args = {
                    data: data,
                    dropIndex: toIndex,
                    dropPosition: this.dropPosition
                };
                this.dropRows(args, isByMethod);
            }
            else {
                return;
            }
        }
    };
    return RowDD;
}());
export { RowDD };
