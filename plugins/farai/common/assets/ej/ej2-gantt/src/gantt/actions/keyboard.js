import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
/**
 * Focus module is used to handle certain action on focus elements in keyboard navigations.
 */
var FocusModule = /** @class */ (function () {
    function FocusModule(parent) {
        this.parent = parent;
        this.activeElement = null;
        this.previousActiveElement = null;
    }
    FocusModule.prototype.getActiveElement = function (isPreviousActiveElement) {
        return isPreviousActiveElement ? this.previousActiveElement : this.activeElement;
    };
    FocusModule.prototype.setActiveElement = function (element) {
        this.previousActiveElement = this.activeElement;
        this.activeElement = element;
    };
    /**
     * To perform key interaction in Gantt
     * @private
     */
    /* tslint:disable-next-line:max-func-body-length */
    FocusModule.prototype.onKeyPress = function (e) {
        var ganttObj = this.parent;
        var expandedRecords = ganttObj.getExpandedRecords(ganttObj.currentViewData);
        var targetElement = this.parent.focusModule.getActiveElement();
        if (e.action === 'home' || e.action === 'end' || e.action === 'downArrow' || e.action === 'upArrow' || e.action === 'delete' ||
            e.action === 'rightArrow' || e.action === 'leftArrow' || e.action === 'focusTask' || e.action === 'focusSearch' ||
            e.action === 'expandAll' || e.action === 'collapseAll') {
            if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule) &&
                ganttObj.editModule.cellEditModule.isCellEdit === true) {
                return;
            }
        }
        if (ganttObj.isAdaptive) {
            if (e.action === 'addRowDialog' || e.action === 'editRowDialog' || e.action === 'delete'
                || e.action === 'addRow') {
                if (ganttObj.selectionModule && ganttObj.selectionSettings.type === 'Multiple') {
                    ganttObj.selectionModule.hidePopUp();
                    document.getElementsByClassName('e-gridpopup')[0].style.display = 'none';
                }
            }
        }
        switch (e.action) {
            case 'home':
                if (ganttObj.selectionModule && ganttObj.selectionSettings.mode !== 'Cell') {
                    if (ganttObj.selectedRowIndex === 0) {
                        return;
                    }
                    ganttObj.selectionModule.selectRow(0, false, true);
                }
                break;
            case 'end':
                if (ganttObj.selectionModule && ganttObj.selectionSettings.mode !== 'Cell') {
                    var currentSelectingRecord = expandedRecords[expandedRecords.length - 1];
                    if (ganttObj.selectedRowIndex === ganttObj.flatData.indexOf(currentSelectingRecord)) {
                        return;
                    }
                    ganttObj.selectionModule.selectRow(ganttObj.flatData.indexOf(currentSelectingRecord), false, true);
                }
                break;
            case 'downArrow':
            case 'upArrow':
                var searchElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar');
                if (searchElement && searchElement.parentElement.classList.contains('e-input-focus')) {
                    ganttObj.selectionModule.clearSelection();
                }
                if (!ganttObj.element.classList.contains('e-scroll-disabled')) {
                    this.upDownKeyNavigate(e);
                    if (!isNullOrUndefined(targetElement) && !isNullOrUndefined(targetElement.closest('.e-chart-row'))) {
                        ganttObj.ganttChartModule.manageFocus(this.getActiveElement(), 'remove', true);
                    }
                }
                break;
            case 'expandAll':
                ganttObj.ganttChartModule.expandCollapseAll('expand');
                break;
            case 'collapseAll':
                ganttObj.ganttChartModule.expandCollapseAll('collapse');
                break;
            case 'expandRow':
            case 'collapseRow':
                this.expandCollapseKey(e);
                break;
            case 'saveRequest':
                if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule) &&
                    ganttObj.editModule.cellEditModule.isCellEdit) {
                    var col = ganttObj.editModule.cellEditModule.editedColumn;
                    if (col.field === ganttObj.columnMapping.duration && !isNullOrUndefined(col.edit) &&
                        !isNullOrUndefined(col.edit.read)) {
                        var textBox = e.target.ej2_instances[0];
                        var textValue = e.target.value;
                        var ganttProp = ganttObj.currentViewData[ganttObj.selectedRowIndex].ganttProperties;
                        var tempValue = void 0;
                        if (col.field === ganttObj.columnMapping.duration) {
                            tempValue = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read) ? col.edit.read() :
                                !isNullOrUndefined(col.valueAccessor) ? col.valueAccessor(ganttObj.columnMapping.duration, ganttObj.editedRecords, col) :
                                    ganttObj.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
                            if (textValue !== tempValue.toString()) {
                                textBox.value = textValue;
                                textBox.dataBind();
                            }
                        }
                    }
                    if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                        return;
                    }
                    ganttObj.editModule.cellEditModule.isCellEdit = false;
                    ganttObj.treeGrid.grid.saveCell();
                    var focussedElement_1 = ganttObj.element.querySelector('.e-treegrid');
                    focussedElement_1.focus();
                }
                if (!isNullOrUndefined(this.parent.onTaskbarClick) && !isNullOrUndefined(targetElement)
                    && !isNullOrUndefined(targetElement.closest('.e-chart-row'))) {
                    var target = e.target;
                    var taskbarElement = targetElement.querySelector('.e-gantt-parent-taskbar,' +
                        '.e-gantt-child-taskbar,.e-gantt-milestone');
                    if (taskbarElement) {
                        this.parent.ganttChartModule.onTaskbarClick(e, target, taskbarElement);
                    }
                }
                break;
            case 'cancelRequest':
                if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule)) {
                    ganttObj.editModule.cellEditModule.isCellEdit = false;
                    if (!isNullOrUndefined(ganttObj.toolbarModule)) {
                        ganttObj.toolbarModule.refreshToolbarItems();
                    }
                }
                break;
            case 'addRow':
                e.preventDefault();
                var focussedElement = ganttObj.element.querySelector('.e-gantt-chart');
                focussedElement.focus();
                ganttObj.addRecord();
                break;
            case 'addRowDialog':
                e.preventDefault();
                if (ganttObj.editModule && ganttObj.editModule.dialogModule && ganttObj.editSettings.allowAdding) {
                    if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                        return;
                    }
                    ganttObj.editModule.dialogModule.openAddDialog();
                }
                break;
            case 'editRowDialog':
                e.preventDefault();
                var focussedTreeElement = ganttObj.element.querySelector('.e-treegrid');
                focussedTreeElement.focus();
                if (ganttObj.editModule && ganttObj.editModule.dialogModule && ganttObj.editSettings.allowEditing) {
                    if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                        return;
                    }
                    ganttObj.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case 'delete':
                if (ganttObj.selectionModule && ganttObj.editModule && (!ganttObj.editModule.dialogModule.dialogObj ||
                    (ganttObj.editModule.dialogModule.dialogObj &&
                        !ganttObj.editModule.dialogModule.dialogObj.visible)) && (!ganttObj.editSettings.allowTaskbarEditing
                    || (ganttObj.editSettings.allowTaskbarEditing && !ganttObj.editModule.taskbarEditModule.touchEdit))) {
                    if ((ganttObj.selectionSettings.mode !== 'Cell' && ganttObj.selectionModule.selectedRowIndexes.length)
                        || (ganttObj.selectionSettings.mode === 'Cell' && ganttObj.selectionModule.getSelectedRowCellIndexes().length)) {
                        ganttObj.editModule.startDeleteAction();
                    }
                }
                break;
            case 'focusTask':
                e.preventDefault();
                var selectedId = void 0;
                if (ganttObj.selectionModule) {
                    var currentViewData = ganttObj.currentViewData;
                    if (ganttObj.selectionSettings.mode !== 'Cell' &&
                        !isNullOrUndefined(currentViewData[ganttObj.selectedRowIndex])) {
                        selectedId = ganttObj.currentViewData[ganttObj.selectedRowIndex].ganttProperties.rowUniqueID;
                    }
                    else if (ganttObj.selectionSettings.mode === 'Cell' &&
                        ganttObj.selectionModule.getSelectedRowCellIndexes().length > 0) {
                        var selectCellIndex = ganttObj.selectionModule.getSelectedRowCellIndexes();
                        selectedId = currentViewData[selectCellIndex[selectCellIndex.length - 1].rowIndex].ganttProperties.rowUniqueID;
                    }
                }
                if (selectedId) {
                    ganttObj.scrollToTask(selectedId.toString());
                }
                break;
            case 'focusSearch':
                if (ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar')) {
                    var searchElement_1 = ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar');
                    searchElement_1.setAttribute('tabIndex', '-1');
                    searchElement_1.focus();
                }
                break;
            case 'tab':
            case 'shiftTab':
                if (!ganttObj.element.classList.contains('e-scroll-disabled')) {
                    ganttObj.ganttChartModule.onTabAction(e);
                }
                break;
            case 'contextMenu':
                var contextMenu = document.getElementById(this.parent.element.id +
                    '_contextmenu').ej2_instances[0];
                var containerPosition = this.parent.getOffsetRect(e.target);
                var top_1 = containerPosition.top + (containerPosition.height / 2);
                var left = containerPosition.left + (containerPosition.width / 2);
                this.setActiveElement(e.target);
                contextMenu.open(top_1, left);
                e.preventDefault();
                break;
            default:
                var eventArgs = {
                    requestType: 'keyPressed',
                    action: e.action,
                    keyEvent: e
                };
                ganttObj.trigger('actionComplete', eventArgs);
                break;
        }
    };
    FocusModule.prototype.upDownKeyNavigate = function (e) {
        e.preventDefault();
        var ganttObj = this.parent;
        var expandedRecords = ganttObj.getExpandedRecords(ganttObj.currentViewData);
        if (ganttObj.selectionModule) {
            if (ganttObj.selectionSettings.mode !== 'Cell' && ganttObj.selectedRowIndex !== -1) {
                var selectedItem = ganttObj.currentViewData[ganttObj.selectedRowIndex];
                var focusedRowIndex = this.parent.ganttChartModule.focusedRowIndex;
                var selectingRowIndex = focusedRowIndex > -1 ? focusedRowIndex : expandedRecords.indexOf(selectedItem);
                var currentSelectingRecord = e.action === 'downArrow' ? expandedRecords[selectingRowIndex + 1] :
                    expandedRecords[selectingRowIndex - 1];
                ganttObj.selectionModule.selectRow(ganttObj.currentViewData.indexOf(currentSelectingRecord), false, true);
            }
            else if (ganttObj.selectionSettings.mode === 'Cell' && ganttObj.selectionModule.getSelectedRowCellIndexes().length > 0) {
                var selectCellIndex = ganttObj.selectionModule.getSelectedRowCellIndexes();
                var selectedCellItem = selectCellIndex[selectCellIndex.length - 1];
                var currentCellIndex = selectedCellItem.cellIndexes[selectedCellItem.cellIndexes.length - 1];
                var selectedItem = ganttObj.currentViewData[selectedCellItem.rowIndex];
                var selectingRowIndex = expandedRecords.indexOf(selectedItem);
                var currentSelectingRecord = e.action === 'downArrow' ? expandedRecords[selectingRowIndex + 1] :
                    expandedRecords[selectingRowIndex - 1];
                var cellInfo = {
                    rowIndex: ganttObj.currentViewData.indexOf(currentSelectingRecord),
                    cellIndex: currentCellIndex
                };
                ganttObj.selectionModule.selectCell(cellInfo);
            }
            this.parent.ganttChartModule.focusedRowIndex = this.parent.selectedRowIndex;
        }
    };
    FocusModule.prototype.expandCollapseKey = function (e) {
        var ganttObj = this.parent;
        if (ganttObj.selectionModule && ganttObj.selectedRowIndex !== -1) {
            var selectedRowIndex = void 0;
            if (ganttObj.selectionSettings.mode !== 'Cell') {
                selectedRowIndex = ganttObj.selectedRowIndex;
            }
            else if (ganttObj.selectionSettings.mode === 'Cell' && ganttObj.selectionModule.getSelectedRowCellIndexes().length > 0) {
                var selectCellIndex = ganttObj.selectionModule.getSelectedRowCellIndexes();
                selectedRowIndex = selectCellIndex[selectCellIndex.length - 1].rowIndex;
            }
            if (e.action === 'expandRow') {
                ganttObj.expandByIndex(selectedRowIndex);
            }
            else {
                ganttObj.collapseByIndex(selectedRowIndex);
            }
        }
    };
    return FocusModule;
}());
export { FocusModule };
