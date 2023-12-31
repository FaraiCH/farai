import { createElement, append, prepend, isNullOrUndefined, getValue, getDefaultDateObject, cldrData, addClass, setStyleAttribute, formatUnit, isBlazor, EventHandler } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
/**
 * view base
 */
export var ViewHelper;
(function (ViewHelper) {
    ViewHelper.getDayName = function (proxy, date) {
        return proxy.getDayNames('abbreviated')[date.getDay()];
    };
    ViewHelper.getDate = function (proxy, date) {
        return proxy.globalize.formatDate(date, { format: 'd', calendar: proxy.getCalendarMode() });
    };
    ViewHelper.getTime = function (proxy, date) {
        if (proxy.isAdaptive) {
            if (proxy.timeFormat === 'HH:mm' || proxy.timeFormat === 'HH.mm') {
                return proxy.globalize.formatDate(date, { format: 'H', calendar: proxy.getCalendarMode() });
            }
            return isBlazor() ?
                proxy.globalize.formatDate(date, { format: 'h', calendar: proxy.getCalendarMode() }) :
                proxy.globalize.formatDate(date, { skeleton: 'h', calendar: proxy.getCalendarMode() });
        }
        return proxy.getTimeString(date);
    };
    ViewHelper.getTimelineDate = function (proxy, date) {
        var skeleton = isBlazor() ? 'M' : 'MMMd';
        var text = proxy.globalize.formatDate(date, { skeleton: skeleton, calendar: proxy.getCalendarMode() }) + ', ' +
            proxy.getDayNames('wide')[date.getDay()];
        return util.capitalizeFirstWord(text, 'multiple');
    };
})(ViewHelper || (ViewHelper = {}));
var ViewBase = /** @class */ (function () {
    /**
     * Constructor
     */
    function ViewBase(parent) {
        this.parent = parent;
    }
    ViewBase.prototype.isTimelineView = function () {
        return this.parent.currentView.indexOf('Timeline') !== -1;
    };
    ViewBase.prototype.getContentRows = function () {
        return [];
    };
    ViewBase.prototype.serverRenderLayout = function () {
        // Need only for layout server rendering
    };
    ViewBase.prototype.createEventTable = function (trCount) {
        var eventTable = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        append(this.getEventRows(trCount), eventTable);
        return eventTable;
    };
    ViewBase.prototype.getEventRows = function (trCount) {
        var eventRows = [];
        var eventContainer;
        for (var row = 0; row < trCount; row++) {
            eventContainer = createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS });
            if (this.parent.resourceBase && !this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.renderedResources) {
                eventContainer.setAttribute('data-group-index', this.parent.resourceBase.renderedResources[row].groupIndex.toString());
            }
            eventRows.push(eventContainer);
        }
        return eventRows;
    };
    ViewBase.prototype.collapseRows = function (wrap) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('tbody'));
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('.' + cls.EVENT_TABLE_CLASS));
        }
    };
    ViewBase.prototype.createTableLayout = function (className) {
        var clsName = className || '';
        var table = createElement('table', { className: cls.SCHEDULE_TABLE_CLASS + ' ' + clsName });
        var tbody = createElement('tbody');
        table.appendChild(tbody);
        return table;
    };
    ViewBase.prototype.createColGroup = function (table, lastRow) {
        var length = lastRow.length;
        if (lastRow[0] && lastRow[0].colSpan) {
            length = lastRow.map(function (value) { return value.colSpan; }).reduce(function (prev, next) { return prev + next; });
        }
        var colGroupEle = createElement('colgroup');
        for (var i = 0; i < length; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        prepend([colGroupEle], table);
    };
    ViewBase.prototype.getScrollXIndent = function (content) {
        return content.offsetHeight - content.clientHeight > 0 ? util.getScrollBarWidth() : 0;
    };
    ViewBase.prototype.scrollTopPanel = function (target) {
        this.getDatesHeaderElement().firstElementChild.scrollLeft = target.scrollLeft;
    };
    ViewBase.prototype.scrollHeaderLabels = function (target) {
        var headerTable = this.element.querySelector('.e-date-header-wrap table');
        var colWidth = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        var applyLeft = function (headerCells, isRtl) {
            var currentCell;
            var tdLeft = 0;
            var colSpan = 0;
            var hiddenLeft = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (var _i = 0, headerCells_2 = headerCells; _i < headerCells_2.length; _i++) {
                var cell = headerCells_2[_i];
                colSpan += parseInt(cell.getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = cell;
                    break;
                }
                tdLeft += cell.offsetWidth;
            }
            currentCell.children[0].style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
        };
        var classNames = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
            var className = classNames_1[_i];
            var headerCells = [].slice.call(this.element.querySelectorAll(className));
            if (headerCells.length > 0) {
                for (var _a = 0, headerCells_1 = headerCells; _a < headerCells_1.length; _a++) {
                    var element = headerCells_1[_a];
                    element.children[0].style[this.parent.enableRtl ? 'right' : 'left'] = '';
                }
                applyLeft(headerCells, this.parent.enableRtl);
            }
        }
    };
    ViewBase.prototype.addAttributes = function (td, element) {
        if (td.template) {
            append(td.template, element);
        }
        if (td.colSpan) {
            element.setAttribute('colspan', td.colSpan.toString());
        }
        if (td.className) {
            addClass([element], td.className);
        }
    };
    ViewBase.prototype.getHeaderBarHeight = function () {
        var headerBarHeight = 2;
        if (this.parent.headerModule) {
            headerBarHeight += util.getOuterHeight(this.parent.headerModule.getHeaderElement());
        }
        if (this.parent.uiStateValues.isGroupAdaptive) {
            var resHeader = this.parent.element.querySelector('.' + cls.RESOURCE_HEADER_TOOLBAR);
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    };
    ViewBase.prototype.renderPanel = function (type) {
        if (type === cls.PREVIOUS_PANEL_CLASS || isBlazor()) {
            prepend([this.element], this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS));
        }
        else {
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.element);
        }
    };
    ViewBase.prototype.setPanel = function (panel) {
        this.element = panel;
    };
    ViewBase.prototype.getPanel = function () {
        return this.element;
    };
    ViewBase.prototype.getDatesHeaderElement = function () {
        return this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS);
    };
    ViewBase.prototype.getDateSlots = function (renderDates, workDays) {
        // Here getDateSlots only need in vertical and month views
        return [];
    };
    ViewBase.prototype.generateColumnLevels = function () {
        // Here generateColumnLevels only need in vertical and month views
        return [];
    };
    ViewBase.prototype.getColumnLevels = function () {
        return this.colLevels;
    };
    ViewBase.prototype.highlightCurrentTime = function () {
        // Here showTimeIndicator functionalities
    };
    ViewBase.prototype.startDate = function () {
        return this.renderDates[0];
    };
    ViewBase.prototype.endDate = function () {
        return util.addDays(this.renderDates[this.renderDates.length - 1], 1);
    };
    ViewBase.prototype.getStartHour = function () {
        var startHour = this.parent.getStartEndTime(this.parent.activeViewOptions.startHour);
        if (isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    };
    ViewBase.prototype.getEndHour = function () {
        var endHour = this.parent.getStartEndTime(this.parent.activeViewOptions.endHour);
        if (isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    };
    ViewBase.prototype.isCurrentDate = function (date) {
        return date.setHours(0, 0, 0, 0) === this.parent.getCurrentTime().setHours(0, 0, 0, 0);
    };
    ViewBase.prototype.isCurrentMonth = function (date) {
        return date.getFullYear() ===
            this.parent.getCurrentTime().getFullYear() && date.getMonth() === this.parent.getCurrentTime().getMonth();
    };
    ViewBase.prototype.isWorkDay = function (date, workDays) {
        if (workDays === void 0) { workDays = this.parent.activeViewOptions.workDays; }
        if (workDays.indexOf(date.getDay()) >= 0) {
            return true;
        }
        return false;
    };
    ViewBase.prototype.isWorkHour = function (date, startHour, endHour, workDays) {
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour)) {
            return false;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        return !(util.getDateInMs(date) < util.getDateInMs(startHour) || util.getDateInMs(date) >= util.getDateInMs(endHour) ||
            !this.isWorkDay(date, workDays));
    };
    ViewBase.prototype.getRenderDates = function (workDays) {
        var renderDates = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.currentView === 'Week' || this.parent.currentView === 'TimelineWeek') {
            var selectedDate = util.resetTime(this.parent.selectedDate);
            var start = util.getWeekFirstDate(selectedDate, this.parent.activeViewOptions.firstDayOfWeek);
            for (var i = 0, length_1 = util.WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_1; i++) {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                }
                else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = util.addDays(start, 1);
            }
        }
        else if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek') {
            var start = util.getWeekFirstDate(util.resetTime(this.parent.selectedDate), this.parent.activeViewOptions.firstDayOfWeek);
            for (var i = 0, length_2 = util.WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_2; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = util.addDays(start, 1);
            }
        }
        else {
            var start = util.resetTime(this.parent.selectedDate);
            do {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                }
                else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = util.addDays(start, 1);
            } while (this.parent.activeViewOptions.interval !== renderDates.length);
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.previousNextIconHandler();
        }
        return renderDates;
    };
    ViewBase.prototype.getNextPreviousDate = function (type) {
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            if (this.parent.activeViewOptions.showWeekend) {
                var daysCount = this.parent.activeViewOptions.interval;
                return util.addDays(this.parent.selectedDate, type === 'next' ? daysCount : -daysCount);
            }
            else {
                var date = void 0;
                if (type === 'next') {
                    date = util.addDays(this.renderDates.slice(-1)[0], 1);
                    while (!this.isWorkDay(date)) {
                        date = util.addDays(date, 1);
                    }
                }
                else {
                    date = util.addDays(this.renderDates[0], -1);
                    var count = 0;
                    do {
                        if (this.isWorkDay(date)) {
                            count += 1;
                        }
                        if (this.parent.activeViewOptions.interval !== count) {
                            date = util.addDays(date, -1);
                        }
                    } while (this.parent.activeViewOptions.interval !== count);
                }
                return date;
            }
        }
        var weekLength = type === 'next' ? util.WEEK_LENGTH : -util.WEEK_LENGTH;
        return util.addDays(this.parent.selectedDate, weekLength * this.parent.activeViewOptions.interval);
    };
    ViewBase.prototype.getLabelText = function (view) {
        var viewStr = view.charAt(0).toLowerCase() + view.substring(1);
        return this.parent.localeObj.getConstant(viewStr) + ' of ' + util.capitalizeFirstWord(isBlazor() ?
            this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'D', calendar: this.parent.getCalendarMode() }) :
            this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'long', calendar: this.parent.getCalendarMode() }), 'single');
    };
    ViewBase.prototype.getDateRangeText = function () {
        if (this.parent.isAdaptive) {
            var formatDate = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
            return util.capitalizeFirstWord(this.parent.globalize.formatDate(this.parent.selectedDate, { format: formatDate, calendar: this.parent.getCalendarMode() }), 'single');
        }
        return this.formatDateRange(this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
    };
    ViewBase.prototype.formatDateRange = function (startDate, endDate) {
        var globalize = this.parent.globalize;
        var mode = this.parent.getCalendarMode();
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            var text = '';
            if (!endDate) {
                text = globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode });
                return util.capitalizeFirstWord(text, 'multiple');
            }
            text = (globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }) +
                ' - ' + globalize.formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat, calendar: mode }));
            return util.capitalizeFirstWord(text, 'multiple');
        }
        var formattedStr;
        var longDateFormat;
        if (isBlazor()) {
            longDateFormat = 'MMMM d, y';
        }
        else {
            if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
                longDateFormat = getValue('dateFormats.long', getDefaultDateObject(mode));
            }
            else {
                longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.' + mode + '.dateFormats.long', cldrData);
            }
        }
        if (!endDate) {
            return util.capitalizeFirstWord(globalize.formatDate(startDate, { format: longDateFormat, calendar: mode }), 'single');
        }
        var dateFormat = longDateFormat.trim().toLocaleLowerCase();
        if (dateFormat.substr(0, 1) === 'd') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMMM yyyy', calendar: mode });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd MMM', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: mode });
                }
            }
            else {
                formattedStr = globalize.formatDate(startDate, { format: 'dd MMM yyyy', calendar: mode }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: mode });
            }
        }
        else if (dateFormat.substr(0, 1) === 'm') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMMM dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd, yyyy', calendar: mode });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMM dd', calendar: mode }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: mode });
                }
            }
            else {
                formattedStr = globalize.
                    formatDate(startDate, { format: 'MMM dd, yyyy', calendar: mode }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: mode });
            }
        }
        else {
            formattedStr = globalize.formatDate(startDate, { format: longDateFormat, calendar: mode }) + ' - ' +
                globalize.formatDate(endDate, { format: longDateFormat, calendar: mode });
        }
        return util.capitalizeFirstWord(formattedStr, 'multiple');
    };
    ViewBase.prototype.getMobileDateElement = function (date, className) {
        var wrap = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(date, { format: 'd', calendar: this.parent.getCalendarMode() }) + '</div>' + '<div class="e-m-day">' +
                util.capitalizeFirstWord(this.parent.globalize.formatDate(date, { format: 'E', calendar: this.parent.getCalendarMode() }), 'single') + '</div>'
        });
        return wrap;
    };
    ViewBase.prototype.setResourceHeaderContent = function (tdElement, tdData, className) {
        if (className === void 0) { className = cls.TEXT_ELLIPSIS; }
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            var data = { resource: tdData.resource, resourceData: tdData.resourceData };
            var scheduleId = this.parent.element.id + '_';
            var viewName = this.parent.activeViewOptions.resourceHeaderTemplateName;
            var templateId = scheduleId + viewName + 'resourceHeaderTemplate';
            var quickTemplate = [].slice.call(this.parent.getResourceHeaderTemplate()(data, this.parent, 'resourceHeaderTemplate', templateId, false));
            append(quickTemplate, tdElement);
        }
        else {
            tdElement.appendChild(createElement('div', {
                className: className, innerHTML: tdData.resourceData[tdData.resource.textField]
            }));
        }
    };
    ViewBase.prototype.renderResourceMobileLayout = function () {
        if (this.parent.resourceBase.lastResourceLevel && this.parent.resourceBase.lastResourceLevel.length <= 0) {
            return;
        }
        this.parent.resourceBase.renderResourceHeader();
        this.parent.resourceBase.renderResourceTree();
    };
    ViewBase.prototype.addAutoHeightClass = function (element) {
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([element], cls.AUTO_HEIGHT);
        }
    };
    ViewBase.prototype.getColElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' col, .' + cls.DATE_HEADER_WRAP_CLASS + ' col'));
    };
    ViewBase.prototype.setColWidth = function (content) {
        if (this.isTimelineView()) {
            var colElements = this.getColElements();
            var contentBody = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody');
            var colWidth_1 = Math.ceil(contentBody.offsetWidth / (colElements.length / 2));
            colElements.forEach(function (col) { return setStyleAttribute(col, { 'width': formatUnit(colWidth_1) }); });
            if (content.offsetHeight !== content.clientHeight) {
                var resourceColumn = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
                if (!isNullOrUndefined(resourceColumn)) {
                    setStyleAttribute(resourceColumn, { 'height': formatUnit(content.clientHeight) });
                }
            }
        }
    };
    ViewBase.prototype.resetColWidth = function () {
        var colElements = this.getColElements();
        for (var _i = 0, colElements_1 = colElements; _i < colElements_1.length; _i++) {
            var col = colElements_1[_i];
            col.style.width = '';
        }
    };
    ViewBase.prototype.getContentAreaElement = function () {
        return this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
    };
    ViewBase.prototype.wireExpandCollapseIconEvents = function () {
        if (this.parent.resourceBase && this.parent.resourceBase.resourceCollection.length > 1) {
            var treeIcons = [].slice.call(this.element.querySelectorAll('.' + cls.RESOURCE_TREE_ICON_CLASS));
            for (var _i = 0, treeIcons_1 = treeIcons; _i < treeIcons_1.length; _i++) {
                var icon = treeIcons_1[_i];
                EventHandler.clearEvents(icon);
                EventHandler.add(icon, 'click', this.parent.resourceBase.onTreeIconClick, this.parent.resourceBase);
            }
        }
    };
    ViewBase.prototype.scrollToDate = function (scrollDate) {
        if (['Month', 'TimelineMonth'].indexOf(this.parent.currentView) === -1 || isNullOrUndefined(scrollDate)) {
            return;
        }
        var scrollWrap = this.getContentAreaElement();
        var tdDate = this.parent.getMsFromDate(new Date(util.resetTime(new Date(+scrollDate)).getTime()));
        var dateElement = scrollWrap.querySelector("." + cls.WORK_CELLS_CLASS + "[data-date=\"" + tdDate + "\"]");
        if (this.parent.currentView === 'Month' && dateElement) {
            scrollWrap.scrollTop = dateElement.offsetTop;
        }
        if (this.parent.currentView === 'TimelineMonth' && dateElement) {
            scrollWrap.scrollLeft = dateElement.offsetLeft;
        }
    };
    return ViewBase;
}());
export { ViewBase };
