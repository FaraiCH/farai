import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { contentLoaded, spreadsheetDestroyed, onVerticalScroll, onHorizontalScroll, getScrollBarWidth } from '../common/index';
import { onContentScroll, deInitProperties, setScrollEvent, skipHiddenIdx } from '../common/index';
import { getRowHeight, getColumnWidth, getCellAddress } from '../../workbook/index';
import { isFormulaBarEdit } from '../common/index';
/**
 * The `Scroll` module is used to handle scrolling behavior.
 * @hidden
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet scroll module.
     * @private
     */
    function Scroll(parent) {
        this.parent = parent;
        this.addEventListener();
        this.initProps();
    }
    Scroll.prototype.onContentScroll = function (e) {
        var target = this.parent.getMainContent();
        var scrollLeft = e.scrollLeft || target.scrollLeft;
        var top = e.scrollTop || target.scrollTop;
        var left = this.parent.enableRtl ? this.initScrollValue - scrollLeft : scrollLeft;
        var scrollArgs;
        var prevSize;
        if (this.prevScroll.scrollLeft !== left) {
            var scrollRight = left > this.prevScroll.scrollLeft;
            prevSize = this.offset.left.size;
            this.offset.left = this.getColOffset(left, scrollRight, e.skipHidden);
            if (this.parent.getActiveSheet().showHeaders) {
                this.parent.getColumnHeaderContent().scrollLeft = scrollLeft;
            }
            scrollArgs = {
                cur: this.offset.left, prev: { idx: this.leftIndex, size: prevSize }, increase: scrollRight, preventScroll: e.preventScroll
            };
            this.parent.notify(onHorizontalScroll, scrollArgs);
            this.updateTopLeftCell(scrollRight);
            if (!this.parent.scrollSettings.enableVirtualization && scrollRight && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualCols();
            }
            this.leftIndex = scrollArgs.prev.idx;
            this.prevScroll.scrollLeft = left;
        }
        if (this.prevScroll.scrollTop !== top) {
            var scrollDown = top > this.prevScroll.scrollTop;
            prevSize = this.offset.top.size;
            this.offset.top = this.getRowOffset(top, scrollDown);
            if (this.parent.getActiveSheet().showHeaders) {
                this.parent.getRowHeaderContent().scrollTop = top;
            }
            scrollArgs = {
                cur: this.offset.top, prev: { idx: this.topIndex, size: prevSize }, increase: scrollDown, preventScroll: e.preventScroll
            };
            this.parent.notify(onVerticalScroll, scrollArgs);
            this.updateTopLeftCell(scrollDown);
            if (!this.parent.scrollSettings.enableVirtualization && scrollDown && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualRows();
            }
            this.topIndex = scrollArgs.prev.idx;
            this.prevScroll.scrollTop = top;
        }
        var isEdit = false;
        var args = { isEdit: isEdit };
        this.parent.notify(isFormulaBarEdit, args);
        if (args.isEdit) {
            var textArea = this.parent.element.querySelector('.e-formula-bar');
            textArea.focus();
        }
    };
    Scroll.prototype.updateNonVirtualRows = function () {
        var sheet = this.parent.getActiveSheet();
        var threshold = this.parent.getThreshold('row');
        if (this.offset.top.idx > sheet.rowCount - (this.parent.viewport.rowCount + threshold)) {
            this.parent.renderModule.refreshUI({ colIndex: 0, direction: 'first', refresh: 'RowPart' }, getCellAddress(sheet.rowCount, 0) + ":" + getCellAddress(sheet.rowCount + threshold - 1, sheet.colCount - 1));
            sheet.rowCount += threshold;
        }
    };
    Scroll.prototype.updateNonVirtualCols = function () {
        var sheet = this.parent.getActiveSheet();
        var threshold = this.parent.getThreshold('col');
        if (this.offset.left.idx > sheet.colCount - (this.parent.viewport.colCount + threshold)) {
            this.parent.renderModule.refreshUI({ rowIndex: 0, colIndex: sheet.colCount, direction: 'first', refresh: 'ColumnPart' }, getCellAddress(0, sheet.colCount) + ":" + getCellAddress(sheet.rowCount - 1, sheet.colCount + threshold - 1));
            sheet.colCount += threshold;
        }
    };
    Scroll.prototype.updateTopLeftCell = function (increase) {
        var top = this.offset.top.idx;
        var left = this.offset.left.idx;
        if (!increase) {
            var sheet = this.parent.getActiveSheet();
            top = skipHiddenIdx(sheet, top, true);
            left = skipHiddenIdx(sheet, left, true, 'columns');
        }
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'topLeftCell', getCellAddress(top, left));
    };
    Scroll.prototype.getRowOffset = function (scrollTop, scrollDown) {
        var temp = this.offset.top.size;
        var sheet = this.parent.getActiveSheet();
        var i = scrollDown ? this.offset.top.idx + 1 : (this.offset.top.idx ? this.offset.top.idx - 1 : 0);
        var count;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.rowCount;
            if (scrollDown && i + this.parent.viewport.rowCount + this.parent.getThreshold('row') >= count) {
                return { idx: this.offset.top.idx, size: this.offset.top.size };
            }
        }
        else {
            count = Infinity;
        }
        while (i < count) {
            if (scrollDown) {
                temp += getRowHeight(sheet, i - 1);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollTop) {
                    return { idx: i - 1, size: temp - getRowHeight(sheet, i - 1) };
                }
                i++;
            }
            else {
                if (temp === 0) {
                    return { idx: 0, size: 0 };
                }
                temp -= getRowHeight(sheet, i);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollTop) {
                    temp += getRowHeight(sheet, i);
                    if (temp > scrollTop) {
                        return { idx: i, size: temp - getRowHeight(sheet, i) };
                    }
                    else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.top.idx, size: this.offset.top.size };
    };
    Scroll.prototype.getColOffset = function (scrollLeft, increase, skipHidden) {
        var temp = this.offset.left.size;
        var sheet = this.parent.getActiveSheet();
        var i = increase ? this.offset.left.idx + 1 : this.offset.left.idx - 1;
        var count;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.colCount;
            if (increase && i + this.parent.viewport.colCount + this.parent.getThreshold('col') >= count) {
                return { idx: this.offset.left.idx, size: this.offset.left.size };
            }
        }
        else {
            count = Infinity;
        }
        while (i < count) {
            if (increase) {
                temp += getColumnWidth(sheet, i - 1, skipHidden);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollLeft) {
                    return { idx: i - 1, size: temp - getColumnWidth(sheet, i - 1, skipHidden) };
                }
                i++;
            }
            else {
                if (temp === 0) {
                    return { idx: 0, size: 0 };
                }
                temp -= getColumnWidth(sheet, i, skipHidden);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollLeft) {
                    temp += getColumnWidth(sheet, i, skipHidden);
                    if (temp > scrollLeft) {
                        return { idx: i, size: temp - getColumnWidth(sheet, i, skipHidden) };
                    }
                    else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.left.idx, size: this.offset.left.size };
    };
    Scroll.prototype.contentLoaded = function () {
        this.onScroll = this.onContentScroll.bind(this);
        this.setScrollEvent();
        if (this.parent.enableRtl) {
            this.initScrollValue = this.parent.getMainContent().scrollLeft;
        }
    };
    Scroll.prototype.setScrollEvent = function (args) {
        if (args === void 0) { args = { set: true }; }
        args.set ? EventHandler.add(this.parent.getMainContent(), 'scroll', this.onScroll, this) :
            EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
    };
    Scroll.prototype.initProps = function () {
        this.topIndex = 0;
        this.leftIndex = 0;
        this.prevScroll = { scrollLeft: 0, scrollTop: 0 };
        this.offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    };
    Scroll.prototype.getThreshold = function () {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        if (Browser.info.name === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        if (!this.parent.allowScrolling) {
            return;
        }
        var colHeader = this.parent.getColumnHeaderContent();
        var rowHeader = this.parent.getRowHeaderContent();
        var scrollWidth = getScrollBarWidth() - this.getThreshold();
        var cssProps = this.parent.enableRtl ? { padding: 'paddingLeft', border: 'borderLeftWidth' }
            : { padding: 'paddingRight', border: 'borderRightWidth' };
        if (scrollWidth > 0) {
            colHeader.parentElement.style[cssProps.padding] = scrollWidth + 'px';
            colHeader.style[cssProps.border] = '1px';
            rowHeader.style.marginBottom = scrollWidth + 'px';
        }
    };
    Scroll.prototype.addEventListener = function () {
        this.parent.on(contentLoaded, this.contentLoaded, this);
        this.parent.on(onContentScroll, this.onContentScroll, this);
        this.parent.on(deInitProperties, this.initProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
        this.parent.on(setScrollEvent, this.setScrollEvent, this);
    };
    Scroll.prototype.destroy = function () {
        EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
        this.removeEventListener();
        this.parent = null;
    };
    Scroll.prototype.removeEventListener = function () {
        this.parent.off(contentLoaded, this.contentLoaded);
        this.parent.off(onContentScroll, this.onContentScroll);
        this.parent.off(deInitProperties, this.initProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
        this.parent.off(setScrollEvent, this.setScrollEvent);
    };
    return Scroll;
}());
export { Scroll };
