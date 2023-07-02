import { closest, Browser } from '@syncfusion/ej2-base';
import { ribbonClick, inView, setMaxHgt, getMaxHgt, WRAPTEXT, setRowEleHeight, rowHeightChanged, beginAction } from '../common/index';
import { completeAction, getTextHeight, getLines, } from '../common/index';
import { getColumnWidth, getCell, wrap as wrapText, wrapEvent, getRow } from '../../workbook/index';
import { getRowHeight, getAddressFromSelectedRange } from '../../workbook/index';
/**
 * Represents Wrap Text support for Spreadsheet.
 */
var WrapText = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet Wrap Text module.
     * @private
     */
    function WrapText(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WrapText.prototype.addEventListener = function () {
        this.parent.on(ribbonClick, this.ribbonClickHandler, this);
        this.parent.on(wrapEvent, this.wrapTextHandler, this);
        this.parent.on(rowHeightChanged, this.rowHeightChangedHandler, this);
    };
    WrapText.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(wrapEvent, this.wrapTextHandler);
            this.parent.off(rowHeightChanged, this.rowHeightChangedHandler);
        }
    };
    WrapText.prototype.wrapTextHandler = function (args) {
        if (inView(this.parent, args.range, true)) {
            var ele = void 0;
            var cell = void 0;
            var colwidth = void 0;
            var isCustomHgt = void 0;
            var maxHgt = void 0;
            var hgt = void 0;
            for (var i = args.range[0]; i <= args.range[2]; i++) {
                maxHgt = 0;
                isCustomHgt = getRow(args.sheet, i).customHeight;
                for (var j = args.range[1]; j <= args.range[3]; j++) {
                    ele = args.initial ? args.td : this.parent.getCell(i, j);
                    if (ele) {
                        args.wrap ? ele.classList.add(WRAPTEXT) : ele.classList.remove(WRAPTEXT);
                        if (isCustomHgt) {
                            ele.innerHTML
                                = this.parent.createElement('span', { className: 'e-wrap-content', innerHTML: ele.innerHTML }).outerHTML;
                        }
                    }
                    if (Browser.isIE) {
                        ele.classList.add('e-ie-wrap');
                    }
                    if (!isCustomHgt) {
                        colwidth = getColumnWidth(args.sheet, j);
                        cell = getCell(i, j, args.sheet);
                        var displayText = this.parent.getDisplayText(cell);
                        if (displayText.indexOf('\n') < 0) {
                            var editElem = this.parent.element.querySelector('.e-spreadsheet-edit');
                            if (editElem) {
                                if (editElem.textContent.indexOf('\n') > -1) {
                                    displayText = editElem.textContent;
                                }
                            }
                        }
                        if (displayText) {
                            if (args.wrap) {
                                if (ele && ele.classList.contains('e-alt-unwrap')) {
                                    ele.classList.remove('e-alt-unwrap');
                                }
                                var lines = void 0;
                                var n = 0;
                                var p = void 0;
                                if (displayText.indexOf('\n') > -1) {
                                    var splitVal = displayText.split('\n');
                                    var valLength = splitVal.length;
                                    for (p = 0; p < valLength; p++) {
                                        lines = getLines(splitVal[p], colwidth, cell.style, this.parent.cellStyle);
                                        if (lines === 0) {
                                            lines = 1; // for empty new line
                                        }
                                        n = n + lines;
                                    }
                                    lines = n;
                                }
                                else {
                                    lines = getLines(displayText, colwidth, cell.style, this.parent.cellStyle);
                                }
                                hgt = getTextHeight(this.parent, cell.style || this.parent.cellStyle, lines) + 1;
                                maxHgt = Math.max(maxHgt, hgt);
                                setMaxHgt(args.sheet, i, j, hgt);
                            }
                            else {
                                if (displayText.indexOf('\n') > -1) {
                                    ele.classList.add('e-alt-unwrap');
                                }
                                hgt = getTextHeight(this.parent, cell.style || this.parent.cellStyle, 1);
                                setMaxHgt(args.sheet, i, j, hgt);
                                maxHgt = Math.max(getMaxHgt(args.sheet, i), 20);
                            }
                        }
                        else if (!args.wrap) {
                            setMaxHgt(args.sheet, i, j, 20);
                            maxHgt = 20;
                        }
                        if (j === args.range[3] && ((args.wrap && maxHgt > 20 && getMaxHgt(args.sheet, i) <= maxHgt) || (!args.wrap
                            && getMaxHgt(args.sheet, i) < getRowHeight(args.sheet, i) && getRowHeight(args.sheet, i) > 20))) {
                            setRowEleHeight(this.parent, args.sheet, maxHgt, i, args.row, args.hRow);
                        }
                    }
                }
            }
        }
    };
    WrapText.prototype.ribbonClickHandler = function (args) {
        var target = closest(args.originalEvent.target, '.e-btn');
        if (target && target.id === this.parent.element.id + '_wrap') {
            var wrap = target.classList.contains('e-active');
            var address = getAddressFromSelectedRange(this.parent.getActiveSheet());
            var eventArgs = { address: address, wrap: wrap, cancel: false };
            this.parent.notify(beginAction, { action: 'beforeWrap', eventArgs: eventArgs });
            if (!eventArgs.cancel) {
                wrapText(this.parent.getActiveSheet().selectedRange, wrap, this.parent);
                this.parent.notify(completeAction, { action: 'wrap', eventArgs: { address: address, wrap: wrap } });
            }
        }
    };
    WrapText.prototype.getTextWidth = function (text, style) {
        if (style === void 0) { style = this.parent.cellStyle; }
        var defaultStyle = this.parent.cellStyle;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = (style.fontStyle || defaultStyle.fontStyle) + ' ' + (style.fontWeight || defaultStyle.fontWeight) + ' '
            + (style.fontSize || defaultStyle.fontSize) + ' ' + (style.fontFamily || defaultStyle.fontFamily);
        return context.measureText(text).width;
    };
    WrapText.prototype.rowHeightChangedHandler = function (args) {
        if (args.isCustomHgt) {
            var sheet = this.parent.getActiveSheet();
            var leftIdx = this.parent.viewport.leftIndex;
            var rightIdx = leftIdx + this.parent.viewport.colCount + this.parent.getThreshold('col') * 2;
            for (var i = leftIdx; i < rightIdx; i++) {
                var cell = getCell(args.rowIdx, i, sheet);
                if (cell && cell.wrap) {
                    var ele = this.parent.getCell(args.rowIdx, i);
                    ele.innerHTML = this.parent.createElement('span', { className: 'e-wrap-content', innerHTML: ele.innerHTML }).outerHTML;
                }
            }
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    WrapText.prototype.getModuleName = function () {
        return 'wrapText';
    };
    WrapText.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return WrapText;
}());
export { WrapText };
