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
import { EventHandler, formatUnit, remove, createElement, addClass, closest, prepend, isBlazor } from '@syncfusion/ej2-base';
import { ViewBase } from './view-base';
import { YearEvent } from '../event-renderer/year';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * year view
 */
var Year = /** @class */ (function (_super) {
    __extends(Year, _super);
    /**
     * Constructor for year view
     */
    function Year(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-year-view';
        _this.isInverseTableSelect = false;
        return _this;
    }
    Year.prototype.renderLayout = function (className) {
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([{ renderDates: this.parent.activeView.renderDates }]);
        }
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        var viewTypeClass = this.parent.activeViewOptions.orientation === 'Horizontal' ? 'e-horizontal' : 'e-vertical';
        addClass([this.element], [this.viewClass, viewTypeClass, className]);
        this.renderPanel(className);
        var calendarTable = this.createTableLayout(cls.OUTER_TABLE_CLASS);
        this.element.appendChild(calendarTable);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        var calendarTBody = calendarTable.querySelector('tbody');
        this.rowCount = this.getRowColumnCount('row');
        this.columnCount = this.getRowColumnCount('column');
        this.renderHeader(calendarTBody);
        this.renderContent(calendarTBody);
        if (this.parent.currentView !== 'Year' && this.parent.uiStateValues.isGroupAdaptive) {
            this.generateColumnLevels();
            this.renderResourceMobileLayout();
        }
        this.wireEvents(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll');
        this.parent.notify(event.contentReady, {});
    };
    // tslint:disable-next-line:no-empty
    Year.prototype.renderHeader = function (headerWrapper) {
    };
    Year.prototype.renderContent = function (content) {
        var tr = createElement('tr');
        content.appendChild(tr);
        var td = createElement('td');
        tr.appendChild(td);
        this.element.querySelector('tbody').appendChild(tr);
        var contentWrapper = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        td.appendChild(contentWrapper);
        var calendarTable = this.createTableLayout('e-calendar-table');
        contentWrapper.appendChild(calendarTable);
        var cTr = createElement('tr');
        calendarTable.querySelector('tbody').appendChild(cTr);
        var cTd = createElement('td');
        cTr.appendChild(cTd);
        var calendarWrapper = createElement('div', { className: 'e-calendar-wrapper' });
        cTd.appendChild(calendarWrapper);
        var monthCollection = Array.apply(null, { length: 12 }).map(function (value, index) { return index; });
        for (var _i = 0, monthCollection_1 = monthCollection; _i < monthCollection_1.length; _i++) {
            var month = monthCollection_1[_i];
            var currentMonth = new Date(this.parent.selectedDate.getFullYear(), month, this.parent.selectedDate.getDate());
            var calendarElement = createElement('div', {
                className: 'e-month-calendar e-calendar',
                attrs: { 'data-role': 'calendar' }
            });
            calendarElement.appendChild(this.renderCalendarHeader(currentMonth));
            calendarElement.appendChild(this.renderCalendarContent(currentMonth));
            calendarWrapper.appendChild(calendarElement);
        }
    };
    Year.prototype.renderCalendarHeader = function (currentDate) {
        var headerWrapper = createElement('div', { className: 'e-header e-month' });
        var headerContent = createElement('div', { className: 'e-day e-title', innerHTML: this.getMonthName(currentDate) });
        headerWrapper.appendChild(headerContent);
        this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: headerContent, date: currentDate });
        return headerWrapper;
    };
    Year.prototype.renderCalendarContent = function (currentDate) {
        var dateCollection = this.getMonthDates(currentDate);
        var contentWrapper = createElement('div', { className: 'e-content e-month' });
        var contentTable = this.createTableLayout('e-calendar-table ' + cls.CONTENT_TABLE_CLASS);
        contentWrapper.appendChild(contentTable);
        var thead = createElement('thead', { className: 'e-week-header' });
        var tr = createElement('tr');
        var currentWeek = util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.firstDayOfWeek);
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('th'));
        }
        for (var i = 0; i < util.WEEK_LENGTH; i++) {
            tr.appendChild(createElement('th', { innerHTML: this.parent.getDayNames('narrow')[currentWeek.getDay()] }));
            currentWeek = new Date(currentWeek.getTime() + util.MS_PER_DAY);
        }
        thead.appendChild(tr);
        prepend([thead], contentTable);
        var tbody = contentTable.querySelector('tbody');
        while (dateCollection.length > 0) {
            var weekDates = dateCollection.splice(0, util.WEEK_LENGTH);
            var tr_1 = createElement('tr', { attrs: { 'role': 'row' } });
            if (this.parent.activeViewOptions.showWeekNumber) {
                var weekNumber = util.getWeekNumber(weekDates.slice(-1)[0]);
                var td = createElement('td', {
                    className: 'e-week-number',
                    attrs: { 'role': 'gridcell', 'title': 'Week ' + weekNumber },
                    innerHTML: weekNumber.toString()
                });
                tr_1.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'weekNumberCells', element: td });
            }
            for (var _i = 0, weekDates_1 = weekDates; _i < weekDates_1.length; _i++) {
                var date = weekDates_1[_i];
                var td = createElement('td', {
                    className: 'e-cell ' + cls.WORK_CELLS_CLASS,
                    attrs: { 'role': 'gridcell', 'aria-selected': 'false', 'data-date': date.getTime().toString() }
                });
                td.appendChild(createElement('span', { className: 'e-day', innerHTML: date.getDate().toString() }));
                var classList = [];
                if (currentDate.getMonth() !== date.getMonth()) {
                    classList.push(cls.OTHERMONTH_CLASS);
                }
                if (this.isCurrentDate(date) && currentDate.getMonth() === date.getMonth()) {
                    classList = classList.concat(['e-today', 'e-selected']);
                }
                if (classList.length > 0) {
                    addClass([td], classList);
                }
                tr_1.appendChild(td);
                this.wireEvents(td, 'cell');
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
            tbody.appendChild(tr_1);
        }
        return contentWrapper;
    };
    Year.prototype.createTableColGroup = function (count) {
        var colGroupEle = createElement('colgroup');
        for (var i = 0; i < count; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        return colGroupEle;
    };
    Year.prototype.getMonthName = function (date) {
        var month = this.parent.globalize.formatDate(date, {
            format: this.parent.activeViewOptions.dateFormat || 'MMMM',
            calendar: this.parent.getCalendarMode()
        });
        return util.capitalizeFirstWord(month, 'multiple');
    };
    Year.prototype.generateColumnLevels = function () {
        var colLevels = [];
        var level = this.getDateSlots([this.parent.selectedDate], this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive) {
                var resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots([this.parent.selectedDate], resourceLevel.workDays)];
            }
        }
        else {
            colLevels.push(level);
        }
        colLevels.pop();
        this.colLevels = colLevels;
        return colLevels;
    };
    Year.prototype.getDateSlots = function (renderDates, workDays, startHour, endHour) {
        if (startHour === void 0) { startHour = this.parent.workHours.start; }
        if (endHour === void 0) { endHour = this.parent.workHours.end; }
        var dateCol = [{
                date: renderDates[0], type: 'dateHeader', className: [cls.HEADER_CELLS_CLASS], colSpan: 1, workDays: workDays,
                startHour: new Date(+this.parent.globalize.parseDate(startHour, isBlazor() ? { skeleton: 't' } : { skeleton: 'Hm' })),
                endHour: new Date(+this.parent.globalize.parseDate(endHour, isBlazor() ? { skeleton: 't' } : { skeleton: 'Hm' }))
            }];
        return dateCol;
    };
    Year.prototype.getMonthDates = function (date) {
        var startDate = util.getWeekFirstDate(util.firstDateOfMonth(date), this.parent.firstDayOfWeek);
        var endDate = util.addDays(new Date(+startDate), (6 * util.WEEK_LENGTH));
        var dateCollection = [];
        for (var start = startDate; start.getTime() < endDate.getTime(); start = util.addDays(start, 1)) {
            dateCollection.push(util.resetTime(new Date(start)));
        }
        return dateCollection;
    };
    Year.prototype.getRowColumnCount = function (type) {
        var monthCount = 12;
        var year = this.parent.selectedDate.getFullYear();
        var months = [];
        for (var month = 0; month < monthCount; month++) {
            months.push(new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate());
        }
        var maxCount = Math.max.apply(Math, months);
        var count;
        if (type === 'row') {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? monthCount : maxCount;
            if (!this.parent.activeViewOptions.timeScale.enable && this.parent.activeViewOptions.orientation === 'Vertical') {
                count = 1;
            }
        }
        else {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? maxCount : monthCount;
        }
        return count;
    };
    Year.prototype.isCurrentDate = function (date) {
        return util.resetTime(new Date()).getTime() === util.resetTime(new Date(date.getTime())).getTime();
    };
    Year.prototype.onCellClick = function (e) {
        var target = closest(e.target, '.' + cls.WORK_CELLS_CLASS);
        var startDate = this.parent.getDateFromElement(target);
        var endDate = util.addDays(new Date(startDate.getTime()), 1);
        var filteredEvents = this.parent.eventBase.filterEvents(startDate, endDate);
        var moreEventArgs = { date: startDate, event: filteredEvents, element: e.target };
        this.parent.quickPopup.moreEventClick(moreEventArgs, new Date());
    };
    Year.prototype.onContentScroll = function (e) {
        var target = e.target;
        var headerWrapper = this.getDatesHeaderElement();
        if (headerWrapper) {
            headerWrapper.firstElementChild.scrollLeft = target.scrollLeft;
        }
        var scrollTopSelector = "." + cls.MONTH_HEADER_WRAPPER + ",." + cls.RESOURCE_COLUMN_WRAP_CLASS;
        var scrollTopElement = this.element.querySelector(scrollTopSelector);
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
    };
    Year.prototype.onScrollUiUpdate = function (args) {
        var height = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        var headerWrapper = this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS);
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        var contentWrapper = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        if (contentWrapper) {
            contentWrapper.style.height = formatUnit(height);
        }
        var leftPanelSelector = "." + cls.MONTH_HEADER_WRAPPER + ",." + cls.RESOURCE_COLUMN_WRAP_CLASS;
        var leftPanelElement = this.element.querySelector(leftPanelSelector);
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(contentWrapper));
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            var scrollBarWidth = util.getScrollBarWidth();
            // tslint:disable:no-any
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            }
            else {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = '';
                headerWrapper.style[args.cssProperties.padding] = '';
            }
            // tslint:enable:no-any
        }
        this.setColWidth(this.getContentAreaElement());
    };
    Year.prototype.startDate = function () {
        var startDate = new Date(this.parent.selectedDate.getFullYear(), 0, 1);
        return util.getWeekFirstDate(startDate, this.parent.firstDayOfWeek);
    };
    Year.prototype.endDate = function () {
        var endDate = new Date(this.parent.selectedDate.getFullYear(), 11, 31);
        return util.addDays(util.getWeekLastDate(endDate, this.parent.firstDayOfWeek), 1);
    };
    Year.prototype.getEndDateFromStartDate = function (start) {
        var date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = util.lastDateOfMonth(date);
        }
        return util.addDays(new Date(date.getTime()), 1);
    };
    Year.prototype.getNextPreviousDate = function (type) {
        return util.addYears(this.parent.selectedDate, ((type === 'next') ? 1 : -1));
    };
    Year.prototype.getDateRangeText = function () {
        return this.parent.globalize.formatDate(this.parent.selectedDate, isBlazor() ? { format: 'yyyy' } : { skeleton: 'y' });
    };
    Year.prototype.addEventListener = function () {
        this.parent.on(event.scrollUiUpdate, this.onScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
    };
    Year.prototype.removeEventListener = function () {
        this.parent.off(event.scrollUiUpdate, this.onScrollUiUpdate);
        this.parent.off(event.dataReady, this.onDataReady);
    };
    Year.prototype.onDataReady = function (args) {
        var yearEventModule = new YearEvent(this.parent);
        yearEventModule.renderAppointments();
        this.parent.notify('events-loaded', args);
    };
    Year.prototype.wireEvents = function (element, type) {
        if (type === 'cell') {
            if (this.parent.currentView !== 'TimelineYear') {
                EventHandler.add(element, 'click', this.onCellClick, this);
            }
            else {
                EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
                if (!this.parent.isAdaptive) {
                    EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                }
            }
        }
        else {
            EventHandler.add(element, 'scroll', this.onContentScroll, this);
        }
    };
    /**
     * Get module name.
     */
    Year.prototype.getModuleName = function () {
        return 'year';
    };
    /**
     * To destroy the year.
     * @return {void}
     * @private
     */
    Year.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            if (isBlazor()) {
                this.parent.resetLayoutTemplates();
                this.parent.resetEventTemplates();
            }
            remove(this.element);
            this.element = null;
        }
    };
    return Year;
}(ViewBase));
export { Year };
