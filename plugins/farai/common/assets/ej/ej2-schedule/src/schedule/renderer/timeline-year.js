var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { append, addClass, createElement, isBlazor } from '@syncfusion/ej2-base';
import { Year } from './year';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
/**
 * timeline year view
 */
var TimelineYear = /** @class */ (function (_super) {
    __extends(TimelineYear, _super);
    /**
     * Constructor for timeline year view
     */
    function TimelineYear(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-timeline-year-view';
        _this.isInverseTableSelect = true;
        return _this;
    }
    /**
     * Get module name.
     */
    TimelineYear.prototype.getModuleName = function () {
        return 'timelineYear';
    };
    TimelineYear.prototype.renderHeader = function (headerWrapper) {
        var tr = createElement('tr');
        headerWrapper.appendChild(tr);
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        else {
            var leftHeaderCells = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            tr.appendChild(leftHeaderCells);
            leftHeaderCells.appendChild(this.renderResourceHeader(cls.LEFT_INDENT_WRAP_CLASS));
        }
        var td = createElement('td');
        tr.appendChild(td);
        var container = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        td.appendChild(container);
        if (this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            container.appendChild(this.renderResourceHeader(cls.DATE_HEADER_WRAP_CLASS));
            this.columnCount = this.colLevels.slice(-1)[0].length;
        }
        else {
            var wrapper = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
            container.appendChild(wrapper);
            var table = this.createTableLayout();
            wrapper.appendChild(table);
            table.appendChild(this.createTableColGroup(this.columnCount));
            var innerTr = createElement('tr');
            table.querySelector('tbody').appendChild(innerTr);
            for (var column = 0; column < this.columnCount; column++) {
                var innerTd = createElement('td', { className: cls.HEADER_CELLS_CLASS });
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    innerTd.innerHTML = "<span>" + this.parent.getDayNames('abbreviated')[column % 7] + "</span>";
                }
                else {
                    var date = new Date(this.parent.selectedDate.getFullYear(), column, 1);
                    innerTd.innerHTML = "<span>" + this.getMonthName(date) + "</span>";
                    innerTd.setAttribute('data-date', date.getTime().toString());
                }
                innerTr.appendChild(innerTd);
                this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: innerTd });
            }
        }
    };
    TimelineYear.prototype.renderResourceHeader = function (className) {
        var wrap = createElement('div', { className: className });
        var tbl = this.createTableLayout();
        wrap.appendChild(tbl);
        var trEle = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.colLevels = this.generateColumnLevels();
        }
        else {
            var colData = [{ className: [cls.HEADER_CELLS_CLASS], type: 'headerCell' }];
            this.colLevels = [colData];
        }
        for (var _i = 0, _a = this.colLevels; _i < _a.length; _i++) {
            var col = _a[_i];
            var ntr = trEle.cloneNode();
            var count = className === cls.DATE_HEADER_WRAP_CLASS ? col : [col[0]];
            for (var _b = 0, count_1 = count; _b < count_1.length; _b++) {
                var c = count_1[_b];
                var tdEle = createElement('td');
                if (c.className) {
                    addClass([tdEle], c.className);
                }
                if (className === cls.DATE_HEADER_WRAP_CLASS) {
                    if (c.template) {
                        append(c.template, tdEle);
                    }
                    if (c.colSpan) {
                        tdEle.setAttribute('colspan', c.colSpan.toString());
                    }
                    this.setResourceHeaderContent(tdEle, c);
                }
                var args = { elementType: c.type, element: tdEle, date: c.date, groupIndex: c.groupIndex };
                this.parent.trigger(event.renderCell, args);
                ntr.appendChild(tdEle);
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        if (className === cls.DATE_HEADER_WRAP_CLASS) {
            tbl.appendChild(this.createTableColGroup(this.colLevels.slice(-1)[0].length));
        }
        return wrap;
    };
    TimelineYear.prototype.renderContent = function (contentWrapper) {
        var tr = createElement('tr');
        contentWrapper.appendChild(tr);
        var firstTd = createElement('td');
        var lastTd = createElement('td');
        var tdCollection = [];
        var monthTBody;
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            tdCollection.push(firstTd);
            firstTd.appendChild(this.parent.resourceBase.createResourceColumn());
            this.rowCount = this.parent.resourceBase.lastResourceLevel.length;
        }
        else {
            tdCollection.push(firstTd);
            var monthWrapper = createElement('div', { className: cls.MONTH_HEADER_WRAPPER });
            firstTd.appendChild(monthWrapper);
            monthWrapper.appendChild(this.createTableLayout());
            monthTBody = monthWrapper.querySelector('tbody');
        }
        tdCollection.push(lastTd);
        append(tdCollection, tr);
        var content = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        lastTd.appendChild(content);
        var contentTable = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        content.appendChild(contentTable);
        var eventWrapper = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        content.appendChild(eventWrapper);
        var contentTBody = contentTable.querySelector('tbody');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            if (this.parent.rowAutoHeight) {
                addClass([contentTable], cls.AUTO_HEIGHT);
            }
            var colCount = this.parent.activeViewOptions.orientation === 'Horizontal' ? this.colLevels.slice(-1)[0].length : 12;
            contentTable.appendChild(this.createTableColGroup(colCount));
            this.renderResourceContent(eventWrapper, monthTBody, contentTBody);
        }
        else {
            contentTable.appendChild(this.createTableColGroup(this.columnCount));
            this.renderDefaultContent(eventWrapper, monthTBody, contentTBody);
        }
    };
    TimelineYear.prototype.renderDefaultContent = function (wrapper, monthBody, contentBody) {
        for (var month = 0; month < this.rowCount; month++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            var monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            var monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            var tr = createElement('tr', { attrs: { 'role': 'row' } });
            var monthTr = tr.cloneNode();
            monthBody.appendChild(monthTr);
            var contentTr = tr.cloneNode();
            contentBody.appendChild(contentTr);
            var monthTd = createElement('td', { className: cls.MONTH_HEADER_CLASS, attrs: { 'role': 'gridcell' } });
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                monthTd.setAttribute('data-date', monthDate.getTime().toString());
                monthTd.innerHTML = "<span>" + this.getMonthName(monthDate) + "</span>";
            }
            else {
                monthTd.innerHTML = "<span>" + this.parent.getDayNames('abbreviated')[month % 7] + "</span>";
            }
            monthTr.appendChild(monthTd);
            this.parent.trigger(event.renderCell, { elementType: 'leftHeaderCells', element: monthTd });
            var date = new Date(monthStart.getTime());
            for (var column = 0; column < this.columnCount; column++) {
                var isDateAvail = void 0;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), column, 1);
                    monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                    monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
                    var dayDate = (month - monthStart.getDay()) + 1;
                    date = new Date(this.parent.selectedDate.getFullYear(), column, dayDate);
                    isDateAvail = dayDate > 0 && date.getTime() < monthEnd.getTime();
                }
                else {
                    isDateAvail = column >= monthStart.getDay() && date.getTime() < monthEnd.getTime();
                }
                var td = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: { 'role': 'gridcell', 'aria-selected': 'false' }
                });
                contentTr.appendChild(td);
                var dateHeader = createElement('div', {
                    className: cls.DATE_HEADER_CLASS + ' ' + cls.NAVIGATE_CLASS,
                    innerHTML: (isDateAvail) ? date.getDate().toString() : ''
                });
                var skeleton = isBlazor() ? 'D' : 'full';
                var annocementText = this.parent.globalize.formatDate(date, {
                    skeleton: skeleton,
                    calendar: this.parent.getCalendarMode()
                });
                dateHeader.setAttribute('aria-label', annocementText);
                if (isDateAvail) {
                    var tds = [td];
                    var classList = [];
                    if (this.parent.activeViewOptions.workDays.indexOf(date.getDay()) > -1) {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    if (this.isCurrentDate(date)) {
                        classList.push(cls.CURRENT_DAY_CLASS);
                        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                            tds.push(this.element.querySelector('.' + cls.HEADER_CELLS_CLASS + (":nth-child(" + (column + 1) + ")")));
                        }
                        else {
                            tds.push(this.element.querySelectorAll('.' + cls.MONTH_HEADER_CLASS).item(month));
                        }
                    }
                    if (classList.length > 0) {
                        addClass(tds, classList);
                    }
                }
                else {
                    addClass([td], cls.OTHERMONTH_CLASS);
                }
                td.appendChild(dateHeader);
                if (isDateAvail) {
                    td.setAttribute('data-date', date.getTime().toString());
                    this.wireEvents(td, 'cell');
                }
                this.renderCellTemplate({ date: date, type: 'workCells' }, td);
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
                if (isDateAvail) {
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        date = util.addDays(new Date(date.getTime()), 1);
                    }
                }
            }
        }
    };
    TimelineYear.prototype.renderResourceContent = function (wrapper, monthBody, contentBody) {
        for (var row = 0; row < this.rowCount; row++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            var tr = createElement('tr', { attrs: { 'role': 'row' } });
            contentBody.appendChild(tr);
            var resData = void 0;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.lastResourceLevel[row];
            }
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), row, 1);
            var date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                var monthTr = tr.cloneNode();
                monthBody.appendChild(monthTr);
                var monthTd = createElement('td', {
                    className: cls.MONTH_HEADER_CLASS,
                    innerHTML: "<span>" + this.getMonthName(monthDate) + "</span>",
                    attrs: { 'role': 'gridcell', 'data-date': date.getTime().toString() }
                });
                monthTr.appendChild(monthTd);
            }
            for (var month = 0; month < this.columnCount; month++) {
                var classList = [];
                var groupIndex = row;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    classList = classList.concat(resData.className);
                    if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                        classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                    }
                    else {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), month, 1);
                    date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                }
                else {
                    groupIndex = this.colLevels.slice(-1)[0][month].groupIndex;
                    classList.push(cls.WORKDAY_CLASS);
                }
                var td = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'role': 'gridcell', 'aria-selected': 'false',
                        'data-date': date.getTime().toString()
                    }
                });
                addClass([td], classList);
                td.setAttribute('data-group-index', groupIndex.toString());
                this.renderCellTemplate({ date: date, type: 'workCells', groupIndex: groupIndex }, td);
                this.wireEvents(td, 'cell');
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
        }
        if (this.parent.activeViewOptions.orientation === 'Vertical') {
            this.collapseRows(this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS));
        }
    };
    TimelineYear.prototype.renderCellTemplate = function (data, td) {
        if (!this.parent.activeViewOptions.cellTemplate) {
            return;
        }
        var dateValue = util.addLocalOffset(data.date);
        var args = { date: dateValue, type: data.type };
        if (data.groupIndex) {
            args.groupIndex = data.groupIndex;
        }
        var scheduleId = this.parent.element.id + '_';
        var viewName = this.parent.activeViewOptions.cellTemplateName;
        var templateId = scheduleId + viewName + 'cellTemplate';
        var cellTemplate = [].slice.call(this.parent.getCellTemplate()(args, this.parent, 'cellTemplate', templateId, false));
        append(cellTemplate, td);
    };
    TimelineYear.prototype.scrollToDate = function (scrollDate) {
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            var date = +new Date(util.resetTime(scrollDate));
            var element = this.element.querySelector('[data-date="' + date + '"]');
            if (element) {
                this.getScrollableElement().scrollLeft = element.offsetLeft;
                this.getScrollableElement().scrollTop = element.offsetTop;
            }
        }
    };
    TimelineYear.prototype.getScrollableElement = function () {
        if (this.parent.isAdaptive && !this.isTimelineView() && !this.parent.isServerRenderer()) {
            return this.element.querySelector('.' + cls.SCROLL_CONTAINER_CLASS);
        }
        else {
            return this.getContentAreaElement();
        }
    };
    return TimelineYear;
}(Year));
export { TimelineYear };
