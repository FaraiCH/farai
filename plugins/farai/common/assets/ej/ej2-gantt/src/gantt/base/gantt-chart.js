import { createElement, formatUnit, EventHandler, Browser, isBlazor, getElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined, closest, addClass, removeClass, getValue, setValue } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { ChartScroll } from '../actions/chart-scroll';
import { click } from '@syncfusion/ej2-grids';
import { VirtualContentRenderer } from '../renderer/virtual-content-render';
/**
 * module to render gantt chart - project view
 */
var GanttChart = /** @class */ (function () {
    function GanttChart(parent) {
        this.isExpandCollapseFromChart = false;
        this.isExpandAll = false;
        this.isGanttElement = false;
        this.parent = parent;
        this.chartTimelineContainer = null;
        this.rangeViewContainer =
            createElement('div', { className: cls.rangeContainer });
        this.virtualRender = new VirtualContentRenderer(this.parent);
        this.addEventListener();
    }
    GanttChart.prototype.addEventListener = function () {
        this.parent.on('renderPanels', this.renderChartContainer, this);
        this.parent.on('recordsUpdated', this.renderChartElements, this);
        this.parent.on('dataReady', this.renderInitialContents, this);
        this.parent.on('tree-grid-created', this.renderChartContents, this);
        this.parent.on('destroy', this.destroy, this);
    };
    GanttChart.prototype.renderChartContents = function () {
        this.parent.notify('refreshDayMarkers', {});
        this.wireEvents();
    };
    /**
     * Method to render top level containers in Gantt chart
     * @private
     */
    GanttChart.prototype.renderChartContainer = function () {
        this.chartElement = createElement('div', { id: this.parent.element.id + 'GanttChart', className: cls.ganttChart });
        this.parent.chartPane.appendChild(this.chartElement);
        this.renderTimelineContainer();
        this.renderBodyContainers();
        // render top level div header and content
        // Get timeline header from timeline class file and append to header div
        // render content div
        // Render scroll able div
        // Render container for all element like, table, weekend and holidays
        // Get rows element from rows renderer class
        // Get label related info label renderer class
        // Get baseline from baseline renderer class
        // Get weekend elements from weekend-holidays renderer class
    };
    /**
     * method to render timeline, holidays, weekends at load time
     */
    GanttChart.prototype.renderInitialContents = function () {
        this.parent.timelineModule.createTimelineSeries();
    };
    /**
     * @private
     */
    GanttChart.prototype.renderOverAllocationContainer = function () {
        for (var i = 0; i < this.parent.flatData.length; i++) {
            var data = this.parent.flatData[i];
            if (data.childRecords.length > 0) {
                this.parent.dataOperation.updateOverlappingValues(data);
            }
        }
        var rangeContainer = this.parent.element.querySelector('.' + cls.rangeContainer);
        if (rangeContainer) {
            rangeContainer.innerHTML = '';
        }
        if (this.parent.treeGrid.grid.filterSettings.columns.length === 0) {
            this.renderRangeContainer(this.parent.flatData);
        }
    };
    GanttChart.prototype.renderChartElements = function () {
        this.parent.chartRowsModule.renderChartRows();
        if (this.parent.predecessorModule && this.parent.taskFields.dependency) {
            this.parent.connectorLineIds = [];
            this.parent.updatedConnectorLineCollection = [];
            this.parent.predecessorModule.createConnectorLinesCollection();
        }
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
        if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation) {
            this.renderOverAllocationContainer();
        }
        this.updateWidthAndHeight();
        this.setOverflowStyle();
        this.parent.notify('selectRowByIndex', {});
    };
    GanttChart.prototype.setOverflowStyle = function () {
        var content = this.chartBodyContent;
        content.style.overflow = this.scrollElement.offsetHeight > content.offsetHeight ? 'hidden' : 'visible';
    };
    /**
     * @private
     */
    GanttChart.prototype.renderRangeContainer = function (records) {
        var recordLength = records.length;
        var count;
        var ganttRecord;
        var rangeCollection;
        if (this.parent.treeGrid.grid.filterSettings.columns.length === 0) {
            for (count = 0; count < recordLength; count++) {
                ganttRecord = records[count];
                rangeCollection = ganttRecord.ganttProperties.workTimelineRanges;
                if (rangeCollection) {
                    this.renderRange(rangeCollection, ganttRecord);
                }
            }
        }
    };
    GanttChart.prototype.getTopValue = function (currentRecord) {
        var updatedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        var recordIndex = updatedRecords.indexOf(currentRecord);
        if (!currentRecord.expanded) {
            return (recordIndex * this.parent.rowHeight);
        }
        return ((recordIndex + 1) * this.parent.rowHeight);
    };
    /*get height for range bar*/
    GanttChart.prototype.getRangeHeight = function (data) {
        if (!data.expanded && data.hasChildRecords) {
            return (this.parent.rowHeight - Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight)));
        }
        return (data.childRecords.length * this.parent.rowHeight) -
            Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight));
    };
    GanttChart.prototype.renderRange = function (rangeCollection, currentRecord) {
        var topValue = this.getTopValue(currentRecord);
        /* tslint:disable-next-line */
        var sameIDElement = this.rangeViewContainer.querySelector('.' + 'rangeContainer' + currentRecord.ganttProperties.rowUniqueID);
        if (sameIDElement) {
            sameIDElement.remove();
        }
        var parentDiv = createElement('div', {
            className: 'rangeContainer' + currentRecord.ganttProperties.rowUniqueID, styles: "top:" + topValue + "px; position: absolute;",
        });
        if (currentRecord.level === 0 && !currentRecord.expanded && isNullOrUndefined(currentRecord.parentItem)
            && !this.parent.enableMultiTaskbar) {
            return;
        }
        for (var i = 0; i < rangeCollection.length; i++) {
            var height = this.getRangeHeight(currentRecord);
            var leftDiv = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-leftarc', styles: "left:" + rangeCollection[i].left + "px;\n                top: " + Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2) + "px;\n                height: " + (height + 1) + "px; border-right: 0px"
            });
            var rightDiv = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-rightarc',
                styles: "left:" + (rangeCollection[i].left + rangeCollection[i].width - 5) + "px;\n                top: " + Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2) + "px; height: " + (height + 1) + "px;\n                border-left: 0px"
            });
            parentDiv.appendChild(leftDiv);
            parentDiv.appendChild(rightDiv);
            this.rangeViewContainer.appendChild(parentDiv);
        }
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.rangeViewContainer);
    };
    /**
     * @private
     */
    GanttChart.prototype.renderTimelineContainer = function () {
        this.chartTimelineContainer =
            createElement('div', { className: cls.timelineHeaderContainer });
        this.chartElement.appendChild(this.chartTimelineContainer);
    };
    /**
     * initiate chart container
     */
    GanttChart.prototype.renderBodyContainers = function () {
        this.chartBodyContainer = createElement('div', { className: cls.chartBodyContainer });
        this.chartElement.appendChild(this.chartBodyContainer);
        this.scrollElement = createElement('div', {
            className: cls.chartScrollElement + ' ' + cls.scrollContent, styles: 'position:relative;'
        });
        this.chartBodyContainer.appendChild(this.scrollElement);
        this.chartBodyContent = createElement('div', { className: cls.chartBodyContent, styles: 'position:relative; ' });
        this.scrollElement.appendChild(this.chartBodyContent);
        // this.parent.chartRowsModule.createChartTable();
        this.scrollObject = new ChartScroll(this.parent);
        //this.scrollObject.setWidth(this.chartProperties.width);
        var toolbarHeight = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.scrollObject.
            setHeight(this.parent.ganttHeight - this.chartTimelineContainer.offsetHeight - toolbarHeight);
    };
    /**
     * @private
     */
    GanttChart.prototype.updateWidthAndHeight = function () {
        //empty row height
        var emptydivHeight = isBlazor() ? 39 : 36;
        var emptyHeight = this.parent.contentHeight === 0 ? emptydivHeight : this.parent.contentHeight;
        this.chartBodyContent.style.height = formatUnit(emptyHeight);
        //let element: HTMLElement = this.chartTimelineContainer.querySelector('.' + cls.timelineHeaderTableContainer);
        this.chartBodyContent.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.parent.notify('updateHeight', {});
        this.parent.updateGridLineContainerHeight();
        this.updateLastRowBottomWidth();
    };
    /**
     * Method to update bottom border for chart rows
     */
    GanttChart.prototype.updateLastRowBottomWidth = function () {
        if (this.parent.currentViewData.length > 0 && this.parent.height !== 'auto') {
            var expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
            var lastExpandedRow = expandedRecords[expandedRecords.length - 1];
            var lastExpandedRowIndex = this.parent.currentViewData.indexOf(lastExpandedRow);
            var lastRow = this.parent.getRowByIndex(lastExpandedRowIndex);
            var table = this.parent.chartRowsModule.ganttChartTableBody;
            if (table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow')) {
                removeClass(table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow'), 'e-lastrow');
            }
            if (this.chartBodyContent.clientHeight < this.chartBodyContainer.clientHeight) {
                if (lastRow) {
                    addClass(lastRow.querySelectorAll('td'), 'e-lastrow');
                    this.chartBodyContent.style.height = formatUnit(this.parent.contentHeight + 1);
                }
            }
        }
    };
    GanttChart.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('renderPanels', this.renderChartContainer);
        this.parent.off('recordsUpdated', this.renderChartElements);
        this.parent.off('dataReady', this.renderInitialContents);
        this.parent.off('tree-grid-created', this.renderChartContents);
        this.parent.off('destroy', this.destroy);
    };
    /**
     * Click event handler in chart side
     */
    GanttChart.prototype.ganttChartMouseDown = function (e) {
        if (e.which !== 3) {
            this.parent.notify('chartMouseDown', e);
            this.parent.element.tabIndex = 0;
        }
    };
    GanttChart.prototype.ganttChartMouseClick = function (e) {
        if (this.parent.autoFocusTasks) {
            this.scrollToTarget(e); /** Scroll to task */
        }
        this.parent.notify('chartMouseClick', e);
    };
    GanttChart.prototype.ganttChartMouseUp = function (e) {
        this.parent.notify('chartMouseUp', e);
    };
    /**
     *
     * @param e
     */
    GanttChart.prototype.scrollToTarget = function (e) {
        var row = closest(e.target, 'tr');
        if (row && this.parent.element.contains(row) &&
            (this.parent.element.querySelectorAll('.e-chart-rows-container')[0].contains(e.target) ||
                this.parent.element.querySelectorAll('.e-gridcontent')[0].contains(e.target)) &&
            this.parent.currentViewData.length > 0) {
            var rowIndex = getValue('rowIndex', closest(e.target, 'tr'));
            var dateObject = this.parent.currentViewData[rowIndex].ganttProperties.startDate;
            if (!isNullOrUndefined(dateObject)) {
                var left = this.parent.dataOperation.getTaskLeft(dateObject, false);
                if (this.parent.autoFocusTasks) {
                    this.updateScrollLeft(left);
                }
            }
        }
    };
    /**
     * To focus selected task in chart side
     * @private
     */
    GanttChart.prototype.updateScrollLeft = function (scrollLeft) {
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        scrollLeft = this.scrollElement.scrollWidth <= scrollLeft ? this.scrollElement.scrollWidth : scrollLeft;
        if ((this.scrollElement.offsetWidth + this.parent.ganttChartModule.scrollElement.scrollLeft) < scrollLeft
            || (this.scrollElement.scrollLeft > scrollLeft)) {
            this.scrollObject.setScrollLeft(scrollLeft - 50);
        }
    };
    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    GanttChart.prototype.mouseUp = function (e) {
        if (!this.isGanttElement) {
            this.parent.notify('chartMouseUp', e);
        }
        this.isGanttElement = false;
    };
    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    GanttChart.prototype.documentMouseUp = function (e) {
        this.isGanttElement = true;
        if (this.parent.allowRowDragAndDrop) {
            var ganttDragElemet = this.parent.element.querySelector('.e-ganttdrag');
            if (ganttDragElemet) {
                ganttDragElemet.remove();
            }
        }
        if (this.parent.isDestroyed || e.which === 3) {
            return;
        }
        var isTaskbarEdited = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
            getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            isTaskbarEdited = true;
        }
        this.parent.notify('chartMouseUp', e);
        if (this.parent.showActiveElement) {
            if (this.focusedElement && !e.target.classList.contains('e-split-bar')) {
                this.focusedElement.tabIndex = this.focusedElement.tabIndex === 0 ? -1 : this.focusedElement.tabIndex;
                removeClass([this.focusedElement], 'e-active-container');
            }
        }
        if (!isTaskbarEdited) {
            /** Expand/collapse action */
            var target = e.target;
            var isOnTaskbarElement = e.target.classList.contains(cls.taskBarMainContainer)
                || closest(e.target, '.' + cls.taskBarMainContainer);
            if (closest(target, '.e-gantt-parent-taskbar')) {
                this.chartExpandCollapseRequest(e);
            }
            else if (!isOnTaskbarElement && this.parent.autoFocusTasks) {
                this.scrollToTarget(e); /** Scroll to task */
            }
        }
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            this.parent.editModule.taskbarEditModule.removeFalseLine(true);
        }
        if (!isNullOrUndefined(this.parent.onTaskbarClick) && !isTaskbarEdited) {
            var target = e.target;
            var taskbarElement = closest(target, '.e-gantt-parent-taskbar,.e-gantt-child-taskbar,.e-gantt-milestone');
            if (taskbarElement) {
                this.onTaskbarClick(e, target, taskbarElement);
            }
        }
    };
    /**
     * This event triggered when click on taskbar element
     * @return {void}
     */
    GanttChart.prototype.onTaskbarClick = function (e, target, taskbarElement) {
        var chartRow = closest(target, 'tr');
        var rowIndex = getValue('rowIndex', chartRow);
        var data = this.getRecordByTarget(e);
        var args = {
            data: data,
            taskbarElement: taskbarElement,
            rowIndex: rowIndex,
            target: target
        };
        this.parent.trigger('onTaskbarClick', args);
    };
    /**
     *  Method trigger while perform mouse leave action.
     * @return {void}
     * @private
     */
    GanttChart.prototype.ganttChartLeave = function (e) {
        this.parent.notify('chartMouseLeave', e);
    };
    /**
     *  Method trigger while perform mouse move action.
     * @return {void}
     * @private
     */
    GanttChart.prototype.ganttChartMove = function (e) {
        this.parent.notify('chartMouseMove', e);
        if (!isNullOrUndefined(this.parent.taskFields.dependency) && this.parent.connectorLineEditModule) {
            this.parent.connectorLineEditModule.updateConnectorLineEditElement(e);
        }
    };
    /**
     *  Method trigger while perform right click action.
     * @return {void}
     * @private
     */
    GanttChart.prototype.contextClick = function (e) {
        if (this.parent.allowFiltering && this.parent.filterModule) {
            this.parent.filterModule.closeFilterOnContextClick(e.srcElement);
        }
    };
    /**
     * Method to trigger while perform mouse move on Gantt.
     * @return {void}
     * @private
     */
    GanttChart.prototype.mouseMoveHandler = function (e) {
        if (!isNullOrUndefined(this.parent.onMouseMove) &&
            (this.parent.flatData.length ||
                e.target.classList.contains('e-header-cell-label') ||
                e.target.classList.contains('e-headercell'))) {
            var target = e.target;
            var args = { originalEvent: e };
            var element = closest(target, '.e-chart-row-cell,.e-connector-line-container,' +
                '.e-event-markers,.e-header-cell-label,.e-rowcell,.e-headercell,.e-indicator-span');
            if (element) {
                var rowData = void 0;
                var rowElement = closest(target, '.e-rowcell,.e-chart-row-cell');
                var columnElement = closest(target, '.e-rowcell,.e-headercell');
                if (rowElement) {
                    rowData = this.parent.ganttChartModule.getRecordByTarget(e);
                    args.data = rowData;
                }
                if (columnElement) {
                    var cellIndex = getValue('cellIndex', columnElement);
                    args.column = this.parent.treeGrid.columns[cellIndex];
                }
                if (closest(target, '.e-indicator-span')) {
                    var index = 0;
                    var indicators = rowData.ganttProperties.indicators;
                    if (indicators.length > 1) {
                        for (index = 0; index < indicators.length; index++) {
                            if (indicators[index].name === (element.innerText).trim()) {
                                break;
                            }
                        }
                    }
                    args.indicator = indicators[index];
                }
                if (closest(target, '.e-connector-line-container')) {
                    var obj = {};
                    obj.target = element;
                    args.predecessor = this.parent.tooltipModule.getPredecessorTooltipData(obj);
                }
                if (closest(target, '.e-event-markers')) {
                    var obj = {};
                    obj.target = element;
                    args.eventMarkers = this.parent.tooltipModule.getMarkerTooltipData(obj);
                }
                if (target.classList.contains('e-header-cell-label')) {
                    args.date = new Date(target.dataset.content);
                }
            }
            this.parent.trigger('onMouseMove', args);
        }
    };
    /**
     * Double click handler for chart
     * @param e
     */
    GanttChart.prototype.doubleClickHandler = function (e) {
        this.parent.notify('chartDblClick', e);
        var target = e.target;
        var row = closest(target, 'tr');
        var rowIndex = getValue('rowIndex', row);
        var rowData = this.parent.ganttChartModule.getRecordByTarget(e);
        var args = {
            row: row,
            rowData: rowData,
            rowIndex: rowIndex,
            target: target
        };
        this.recordDoubleClick(args);
    };
    /**
     * To trigger record double click event.
     * @return {void}
     * @private
     */
    GanttChart.prototype.recordDoubleClick = function (args) {
        this.parent.trigger('recordDoubleClick', args);
    };
    /**
     * @private
     */
    GanttChart.prototype.getRecordByTarget = function (e) {
        var ganttData;
        var row = closest(e.target, 'div.' + cls.taskBarMainContainer);
        if (!isNullOrUndefined(row)) {
            var id = row.getAttribute('rowUniqueId');
            ganttData = this.parent.getRecordByID(id);
        }
        else {
            row = closest(e.target, 'tr');
            if (row) {
                var rowIndex = getValue('rowIndex', closest(e.target, 'tr'));
                ganttData = this.parent.currentViewData[rowIndex];
            }
        }
        return ganttData;
    };
    /**
     * To get gantt chart row elements
     * @return {NodeListOf<Element>}
     * @private
     */
    GanttChart.prototype.getChartRows = function () {
        return document.getElementById(this.parent.element.id + 'GanttTaskTableBody').querySelectorAll('.e-chart-row');
    };
    /**
     * Expand Collapse operations from gantt chart side
     * @return {void}
     * @param target
     * @private
     */
    GanttChart.prototype.chartExpandCollapseRequest = function (e) {
        if (this.parent.enableMultiTaskbar) {
            return;
        }
        var target = e.target;
        var parentElement = closest(target, '.e-gantt-parent-taskbar');
        var record = this.getRecordByTarget(e);
        var chartRow = closest(target, 'tr');
        var rowIndex = getValue('rowIndex', chartRow);
        var gridRow = this.parent.treeGrid.getRows()[rowIndex];
        var args = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        this.isExpandCollapseFromChart = true;
        if (parentElement.classList.contains('e-row-expand')) {
            this.collapseGanttRow(args);
        }
        else if (parentElement.classList.contains('e-row-collapse')) {
            this.expandGanttRow(args);
        }
    };
    /**
     * @private
     */
    GanttChart.prototype.reRenderConnectorLines = function () {
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML = '';
        this.parent.connectorLineIds = [];
        this.parent.updatedConnectorLineCollection = [];
        this.parent.predecessorModule.createConnectorLinesCollection();
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
    };
    /**
     * To collapse gantt rows
     * @return {void}
     * @param args
     * @private
     */
    GanttChart.prototype.collapseGanttRow = function (args, isCancel) {
        var _this = this;
        if (isCancel) {
            this.collapsedGanttRow(args);
        }
        else {
            this.parent.trigger('collapsing', args, function (arg) {
                if (_this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                    if (isBlazor()) {
                        setValue('chartRow', getElement(getValue('chartRow', arg)), arg);
                        setValue('gridRow', getElement(getValue('gridRow', arg)), arg);
                    }
                    _this.collapsedGanttRow(arg);
                }
                _this.isExpandCollapseFromChart = false;
            });
        }
    };
    /**
     * @return {void}
     * @param args
     * @private
     */
    GanttChart.prototype.collapsedGanttRow = function (args) {
        var record = getValue('data', args);
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
            this.parent.treeGrid.collapseRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        }
        else {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
        }
        // To render the child record on parent row after collapsing
        if (this.parent.viewType === 'ResourceView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'false');
        this.parent.trigger('collapsed', args);
    };
    /**
     * To expand gantt rows
     * @return {void}
     * @param args
     * @private
     */
    GanttChart.prototype.expandGanttRow = function (args, isCancel) {
        var _this = this;
        if (isCancel) {
            this.expandedGanttRow(args);
        }
        else {
            this.parent.trigger('expanding', args, function (arg) {
                if (isBlazor()) {
                    setValue('chartRow', getElement(getValue('chartRow', arg)), arg);
                    setValue('gridRow', getElement(getValue('gridRow', arg)), arg);
                }
                if (_this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                    _this.expandedGanttRow(arg);
                }
                _this.isExpandCollapseFromChart = false;
            });
        }
    };
    /**
     * @return {void}
     * @param args
     * @private
     */
    GanttChart.prototype.expandedGanttRow = function (args) {
        var record = getValue('data', args);
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            this.parent.treeGrid.expandRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        }
        else {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
        }
        // To render the child record on parent row after expanding.
        if (this.parent.viewType === 'ResourceView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'true');
        this.parent.trigger('expanded', args);
    };
    GanttChart.prototype.renderMultiTaskbar = function (record) {
        if (this.parent.enableMultiTaskbar) {
            this.parent.chartRowsModule.refreshRecords([record], true);
        }
        else if (this.parent.showOverAllocation) {
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
    };
    /**
     * On expand collapse operation row properties will be updated here.
     * @return {void}
     * @param action
     * @param rowElement
     * @param record
     * @param isChild
     * @private
     */
    GanttChart.prototype.expandCollapseChartRows = function (action, rowElement, record, isChild) {
        var displayType;
        if (action === 'expand') {
            displayType = 'table-row';
            if (!isChild) {
                record.expanded = true;
            }
            var targetElement = rowElement.querySelectorAll('.e-row-collapse');
            for (var t = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-expand');
                removeClass([targetElement[t]], 'e-row-collapse');
            }
        }
        else if (action === 'collapse') {
            displayType = 'none';
            if (!isChild) {
                record.expanded = false;
            }
            var targetElement = rowElement.querySelectorAll('.e-row-expand');
            for (var t = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-collapse');
                removeClass([targetElement[t]], 'e-row-expand');
            }
        }
        var childRecords = record.childRecords;
        var chartRows = this.getChartRows();
        var rows = [];
        for (var i = 0; i < chartRows.length; i++) {
            if (chartRows[i].classList.contains('gridrowtaskId'
                + record.ganttProperties.rowUniqueID + 'level' + (record.level + 1))) {
                rows.push(chartRows[i]);
            }
        }
        for (var i = 0; i < rows.length; i++) {
            rows[i].style.display = displayType;
            if ((childRecords[i].childRecords && childRecords[i].childRecords.length)
                && (action === 'collapse' || childRecords[i].expanded || this.isExpandAll)) {
                this.expandCollapseChartRows(action, rows[i], childRecords[i], true);
            }
        }
    };
    /**
     * Public method to expand or collapse all the rows of Gantt
     * @return {void}
     * @param action
     * @private
     */
    GanttChart.prototype.expandCollapseAll = function (action) {
        if (action === 'expand') {
            this.isExpandAll = true;
            this.parent.treeGrid.expandAll();
        }
        else {
            this.parent.treeGrid.collapseAll();
        }
        this.isExpandAll = false;
        var focussedElement = this.parent.element.querySelector('.e-treegrid');
        focussedElement.focus();
    };
    /**
     * Public method to expand particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    GanttChart.prototype.expandAtLevel = function (level) {
        this.parent.treeGrid.expandAtLevel(level);
    };
    /**
     * Public method to collapse particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    GanttChart.prototype.collapseAtLevel = function (level) {
        this.parent.treeGrid.collapseAtLevel(level);
    };
    /**
     * Event Binding for gantt chart click
     */
    GanttChart.prototype.wireEvents = function () {
        var isIE11Pointer = Browser.isPointer;
        var mouseDown = Browser.touchStartEvent;
        var mouseUp = Browser.touchEndEvent;
        var mouseMove = Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.add(this.parent.chartPane, mouseDown, this.ganttChartMouseDown, this);
            EventHandler.add(this.parent.chartPane, cancel, this.ganttChartLeave, this);
            EventHandler.add(this.parent.chartPane, mouseMove, this.ganttChartMove, this);
            if (this.parent.isAdaptive) {
                EventHandler.add(this.parent.chartPane, click, this.ganttChartMouseClick, this);
                EventHandler.add(this.parent.chartPane, mouseUp, this.ganttChartMouseUp, this);
            }
        }
        if (!this.parent.isAdaptive) {
            EventHandler.add(this.parent.element, mouseUp, this.documentMouseUp, this);
            EventHandler.add(document, mouseUp, this.mouseUp, this);
        }
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document.body, 'contextmenu', this.contextClick, this);
        EventHandler.add(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler, this);
    };
    GanttChart.prototype.unWireEvents = function () {
        var isIE11Pointer = Browser.isPointer;
        var mouseDown = Browser.touchStartEvent;
        var mouseUp = Browser.touchEndEvent;
        var mouseMove = Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, mouseDown, this.ganttChartMouseDown);
            EventHandler.remove(this.parent.chartPane, cancel, this.ganttChartLeave);
            EventHandler.remove(this.parent.chartPane, mouseMove, this.ganttChartMove);
            if (this.parent.isAdaptive) {
                EventHandler.remove(this.parent.chartPane, click, this.ganttChartMouseClick);
                EventHandler.remove(this.parent.chartPane, mouseUp, this.ganttChartMouseUp);
            }
        }
        if (!this.parent.isAdaptive) {
            EventHandler.remove(this.parent.element, mouseUp, this.documentMouseUp);
            EventHandler.remove(document, mouseUp, this.mouseUp);
        }
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(document.body, 'contextmenu', this.contextClick);
        EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler);
    };
    /**
     * To get record by taskbar element.
     * @return {IGanttData}
     * @private
     */
    GanttChart.prototype.getRecordByTaskBar = function (target) {
        var item = this.parent.currentViewData[this.getIndexByTaskBar(target)];
        return item;
    };
    /**
     * Trigger Tab & Shift + Tab keypress to highlight active element.
     * @param e
     * @private
     */
    GanttChart.prototype.onTabAction = function (e) {
        this.parent.treeGrid.grid.enableHeaderFocus = this.parent.enableHeaderFocus;
        var isInEditedState = this.parent.editModule && this.parent.editModule.cellEditModule &&
            this.parent.editModule.cellEditModule.isCellEdit;
        if (!this.parent.showActiveElement && !isInEditedState) {
            return;
        }
        var $target = isInEditedState ? e.target.closest('.e-rowcell') : e.target;
        if ($target.closest('.e-rowcell') || $target.closest('.e-chart-row')) {
            this.parent.focusModule.setActiveElement($target);
        }
        /* tslint:disable-next-line:no-any */
        this.focusedRowIndex = $target.closest('.e-rowcell') ? $target.parentElement.rowIndex :
            /* tslint:disable-next-line:no-any */
            $target.closest('.e-chart-row') ? $target.closest('.e-chart-row').rowIndex : -1;
        var isTab = (e.action === 'tab') ? true : false;
        var nextElement = this.getNextElement($target, isTab);
        if (nextElement === 'noNextRow') {
            this.manageFocus($target, 'remove', true);
            return;
        }
        if (typeof nextElement !== 'string') {
            if ($target.classList.contains('e-rowcell') || $target.closest('.e-chart-row-cell') ||
                $target.classList.contains('e-headercell') || $target.closest('.e-segmented-taskbar')) {
                e.preventDefault();
            }
            if ($target.classList.contains('e-rowcell') && (nextElement && nextElement.classList.contains('e-rowcell')) ||
                $target.classList.contains('e-headercell')) {
                this.parent.treeGrid.grid.notify('key-pressed', e);
            }
            if (!isInEditedState) {
                if (nextElement) {
                    if ($target.classList.contains('e-rowcell')) {
                        this.manageFocus($target, 'remove', false);
                    }
                    else {
                        this.manageFocus($target, 'remove', true);
                    }
                    if (nextElement.classList.contains('e-rowcell')) {
                        if (!$target.classList.contains('e-rowcell')) {
                            this.parent.treeGrid.grid.notify('key-pressed', e);
                            var fmodule = getValue('focusModule', this.parent.treeGrid.grid);
                            fmodule.currentInfo.element = nextElement;
                            fmodule.currentInfo.elementToFocus = nextElement;
                            /* tslint:disable-next-line:no-any */
                            fmodule.content.matrix.current = [nextElement.parentElement.rowIndex, nextElement.cellIndex];
                        }
                        this.manageFocus(nextElement, 'add', false);
                    }
                    else {
                        this.manageFocus(nextElement, 'add', true);
                    }
                    this.parent.focusModule.setActiveElement(nextElement);
                }
            }
        }
    };
    /**
     * Get next/previous sibling element.
     * @param $target
     * @param isTab
     */
    GanttChart.prototype.getNextElement = function ($target, isTab) {
        var nextElement = isTab ? $target.nextElementSibling : $target.previousElementSibling;
        while (nextElement && nextElement.parentElement.classList.contains('e-row')) {
            if (!nextElement.matches('.e-hide') && !nextElement.matches('.e-rowdragdrop')) {
                return nextElement;
            }
            nextElement = isTab ? nextElement.nextElementSibling : nextElement.previousElementSibling;
        }
        if (!isNullOrUndefined(nextElement) && (nextElement.classList.contains('e-taskbar-main-container')
            || nextElement.classList.contains('e-right-connectorpoint-outer-div'))) {
            var record = this.parent.currentViewData[this.focusedRowIndex];
            if (!isNullOrUndefined(record.ganttProperties.segments) && record.ganttProperties.segments.length > 0) {
                nextElement = nextElement.classList.contains('e-right-connectorpoint-outer-div')
                    ? nextElement.parentElement.nextElementSibling
                    : nextElement.getElementsByClassName('e-gantt-child-taskbar-inner-div')[0];
            }
        }
        if (this.validateNextElement(nextElement)) {
            return nextElement;
        }
        else {
            var rowIndex = -1;
            var rowElement = null;
            if ($target.classList.contains('e-rowcell')) {
                /* tslint:disable-next-line:no-any */
                rowIndex = $target.parentElement.rowIndex;
                if (isTab) {
                    rowElement = this.parent.getRowByIndex(rowIndex);
                    if (this.validateNextElement(rowElement, 'e-left-label-container')) {
                        return rowElement.getElementsByClassName('e-left-label-container')[0];
                    }
                    else if (this.validateNextElement(rowElement, 'e-taskbar-main-container')) {
                        return rowElement.getElementsByClassName('e-taskbar-main-container')[0];
                    }
                    else if (this.validateNextElement(rowElement, 'e-right-label-container')) {
                        return rowElement.getElementsByClassName('e-right-label-container')[0];
                    }
                }
                else {
                    rowElement = this.getNextRowElement(rowIndex, isTab, false);
                    if (this.validateNextElement(rowElement, 'e-right-label-container')) {
                        return rowElement.getElementsByClassName('e-right-label-container')[0];
                    }
                    else if (this.validateNextElement(rowElement, 'e-taskbar-main-container')) {
                        return rowElement.getElementsByClassName('e-taskbar-main-container')[0];
                    }
                    else if (this.validateNextElement(rowElement, 'e-left-label-container')) {
                        return rowElement.getElementsByClassName('e-left-label-container')[0];
                    }
                }
            }
            else if ($target.parentElement.classList.contains('e-chart-row-cell') ||
                $target.parentElement.parentElement.classList.contains('e-chart-row-cell')) {
                var childElement = void 0;
                /* tslint:disable-next-line:no-any */
                rowIndex = closest($target, '.e-chart-row').rowIndex;
                if (isTab) {
                    rowElement = this.getNextRowElement(rowIndex, isTab, true);
                }
                else {
                    rowElement = this.parent.treeGrid.grid.getRowByIndex(rowIndex);
                }
                if (rowElement) {
                    childElement = isTab ? rowElement.children[0] : rowElement.children[rowElement.children.length - 1];
                    while (childElement) {
                        if (!childElement.matches('.e-hide') && !childElement.matches('.e-rowdragdrop')) {
                            return childElement;
                        }
                        childElement = isTab ? childElement.nextElementSibling : childElement.previousElementSibling;
                    }
                }
                else {
                    return 'noNextRow';
                }
            }
        }
        return null;
    };
    /**
     * Get next/previous row element.
     * @param rowIndex
     * @param isTab
     * @param isChartRow
     */
    GanttChart.prototype.getNextRowElement = function (rowIndex, isTab, isChartRow) {
        var expandedRecords = this.parent.getExpandedRecords(this.parent.currentViewData);
        var currentItem = this.parent.currentViewData[rowIndex];
        var expandedRecordIndex = expandedRecords.indexOf(currentItem);
        var nextRecord = isTab ? expandedRecords[expandedRecordIndex + 1] : expandedRecords[expandedRecordIndex - 1];
        var nextRowIndex = this.parent.currentViewData.indexOf(nextRecord);
        if (nextRecord) {
            return isChartRow ? this.parent.treeGrid.grid.getRowByIndex(nextRowIndex) : this.parent.getRowByIndex(nextRowIndex);
        }
        else {
            return null;
        }
    };
    /**
     * Validate next/previous sibling element haschilds.
     * @param $target
     * @param className
     */
    GanttChart.prototype.validateNextElement = function ($target, className) {
        if ($target && $target.classList.contains('e-rowcell')) {
            return true;
        }
        if ($target && className) {
            var elementByClass = $target.getElementsByClassName(className)[0];
            return (elementByClass && elementByClass.hasChildNodes()) ? true : false;
        }
        else if ($target) {
            return (!isNullOrUndefined($target) && $target.hasChildNodes()) ? true : false;
        }
        return false;
    };
    /**
     * Add/Remove active element.
     * @private
     * @param element
     * @param focus
     * @param isChartElement
     */
    GanttChart.prototype.manageFocus = function (element, focus, isChartElement) {
        if (isChartElement) {
            var childElement = null;
            if (element.classList.contains('e-left-label-container') ||
                element.classList.contains('e-right-label-container')) {
                childElement = element.getElementsByTagName('span')[0];
            }
            else if (element.classList.contains('e-taskbar-main-container')
                || element.classList.contains('e-gantt-child-taskbar-inner-div')) {
                /* tslint:disable-next-line:no-any */
                var rowIndex = closest(element, '.e-chart-row').rowIndex;
                var data = this.parent.currentViewData[rowIndex];
                var className = data.hasChildRecords ? data.ganttProperties.isAutoSchedule ? 'e-gantt-parent-taskbar' :
                    'e-manualparent-main-container' :
                    data.ganttProperties.isMilestone ? 'e-gantt-milestone' : !isNullOrUndefined(data.ganttProperties.segments)
                        && data.ganttProperties.segments.length > 0 ? 'e-segmented-taskbar' : 'e-gantt-child-taskbar';
                childElement = element.getElementsByClassName(className)[0];
                if (isNullOrUndefined(childElement)) {
                    childElement = element;
                }
            }
            if (focus === 'add' && !isNullOrUndefined(childElement)) {
                element.setAttribute('tabIndex', '0');
                addClass([childElement], 'e-active-container');
                element.focus();
                this.focusedElement = childElement;
            }
            else if (!isNullOrUndefined(childElement)) {
                removeClass([childElement], 'e-active-container');
                element.setAttribute('tabIndex', '-1');
                element.blur();
            }
        }
        else {
            if (focus === 'add') {
                element.setAttribute('tabIndex', '0');
                addClass([element], ['e-focused', 'e-focus']);
                element.focus();
            }
            else {
                element.setAttribute('tabIndex', '-1');
                removeClass([element], ['e-focused', 'e-focus']);
                element.blur();
            }
        }
    };
    /**
     * To get index by taskbar element.
     * @return {number}
     * @private
     */
    GanttChart.prototype.getIndexByTaskBar = function (target) {
        var row;
        var recordIndex;
        if (!target.classList.contains(cls.taskBarMainContainer)) {
            row = closest(target, 'div.' + cls.taskBarMainContainer);
        }
        else {
            row = target;
        }
        if (isNullOrUndefined(row)) {
            row = closest(target, 'tr.' + cls.chartRow);
            recordIndex = [].slice.call(this.parent.chartRowsModule.ganttChartTableBody.childNodes).indexOf(row);
        }
        else {
            var id = row.getAttribute('rowUniqueId');
            var record = this.parent.getRecordByID(id);
            recordIndex = this.parent.currentViewData.indexOf(record);
        }
        return recordIndex;
    };
    GanttChart.prototype.destroy = function () {
        this.removeEventListener();
        this.unWireEvents();
        this.scrollObject.destroy();
        this.scrollObject = null;
    };
    return GanttChart;
}());
export { GanttChart };
