import { inView, renderFilterCell, checkConditionalFormat } from '../common/index';
import { hasTemplate, createHyperlinkElement, checkPrevMerge, createImageElement } from '../common/index';
import { getColumnHeaderText, getRangeIndexes, getRangeAddress } from '../../workbook/common/index';
import { setChart, refreshChart, getCellAddress } from '../../workbook/common/index';
import { getCell, skipDefaultValue, isHiddenRow, isHiddenCol } from '../../workbook/base/index';
import { getRowHeight, setRowHeight } from '../../workbook/base/index';
import { addClass, attributes, getNumberDependable, extend, compile, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getFormattedCellObject, applyCellFormat, workbookFormulaOperation, wrapEvent, cFRender } from '../../workbook/common/event';
import { getTypeFromFormat } from '../../workbook/index';
import { checkIsFormula } from '../../workbook/common/util';
/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
var CellRenderer = /** @class */ (function () {
    function CellRenderer(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('td');
        this.th = this.parent.createElement('th', { className: 'e-header-cell' });
        this.tableRow = parent.createElement('tr', { className: 'e-row' });
        this.parent.on('updateView', this.updateView, this);
    }
    CellRenderer.prototype.renderColHeader = function (index) {
        var headerCell = this.th.cloneNode();
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        var sheet = this.parent.getActiveSheet();
        if (isHiddenCol(sheet, index + 1)) {
            headerCell.classList.add('e-hide-start');
        }
        if (index !== 0 && isHiddenCol(sheet, index - 1)) {
            headerCell.classList.add('e-hide-end');
        }
        return headerCell;
    };
    CellRenderer.prototype.renderRowHeader = function (index) {
        var headerCell = this.element.cloneNode();
        addClass([headerCell], 'e-header-cell');
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    };
    CellRenderer.prototype.render = function (args) {
        args.td = this.element.cloneNode();
        args.td.className = 'e-cell';
        attributes(args.td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        var sheet = this.parent.getActiveSheet();
        if (this.checkMerged(args)) {
            return args.td;
        }
        var compiledTemplate = this.processTemplates(args.cell, args.rowIdx, args.colIdx);
        if (typeof compiledTemplate === 'string') {
            args.td.innerHTML = compiledTemplate;
        }
        else {
            args.td.appendChild(compiledTemplate);
        }
        args.isRefresh = false;
        this.update(args);
        if (args.cell && args.td) {
            this.parent.notify(cFRender, { rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.cell, td: args.td, isChecked: false });
        }
        if (!hasTemplate(this.parent, args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            this.parent.notify(renderFilterCell, { td: args.td, rowIndex: args.rowIdx, colIndex: args.colIdx });
        }
        var evtArgs = { cell: args.cell, element: args.td, address: args.address };
        this.parent.trigger('beforeCellRender', evtArgs);
        this.updateRowHeight({
            rowIdx: args.rowIdx,
            cell: evtArgs.element,
            lastCell: args.lastCell,
            rowHgt: 20,
            row: args.row,
            hRow: args.hRow
        });
        var isWrap = args.td.classList.contains('e-wraptext');
        var cellValue = args.td.innerHTML;
        if (cellValue.indexOf('\n') > -1 && !isWrap) {
            var splitVal = cellValue.split('\n');
            if (splitVal.length > 1) {
                this.parent.notify(wrapEvent, {
                    range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx], wrap: true, initial: true, sheet: this.parent.getActiveSheet(), td: args.td, row: args.row, hRow: args.hRow
                });
            }
        }
        return evtArgs.element;
    };
    // tslint:disable-next-line:max-func-body-length
    CellRenderer.prototype.update = function (args) {
        if (args.isRefresh) {
            if (args.td.rowSpan) {
                args.td.removeAttribute('rowSpan');
            }
            if (args.td.colSpan) {
                args.td.removeAttribute('colSpan');
            }
            if (this.checkMerged(args)) {
                return;
            }
        }
        if (args.cell && args.cell.formula && !args.cell.value) {
            var isFormula = checkIsFormula(args.cell.formula);
            var eventArgs = {
                action: 'refreshCalculate', value: args.cell.formula, rowIndex: args.rowIdx, colIndex: args.colIdx, isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            args.cell.value = getCell(args.rowIdx, args.colIdx, this.parent.getActiveSheet()).value;
        }
        var formatArgs = {
            type: args.cell && getTypeFromFormat(args.cell.format),
            value: args.cell && args.cell.value, format: args.cell && args.cell.format ? args.cell.format : 'General',
            formattedText: args.cell && args.cell.value, onLoad: true, isRightAlign: false, cell: args.cell,
            rowIdx: args.rowIdx.toString(), colIdx: args.colIdx.toString()
        };
        if (args.cell) {
            this.parent.notify(getFormattedCellObject, formatArgs);
        }
        if (!isNullOrUndefined(args.td)) {
            this.parent.refreshNode(args.td, { type: formatArgs.type, result: formatArgs.formattedText,
                curSymbol: getNumberDependable(this.parent.locale, 'USD'), isRightAlign: formatArgs.isRightAlign,
                value: formatArgs.value || ''
            });
        }
        var style = {};
        if (args.cell) {
            if (args.cell.style) {
                if (args.cell.style.properties) {
                    style = skipDefaultValue(args.cell.style, true);
                }
                else {
                    style = args.cell.style;
                }
            }
            if (args.cell.chart && args.cell.chart.length > 0) {
                this.parent.notify(setChart, { chart: args.cell.chart, isInitCell: true, range: getCellAddress(args.rowIdx, args.colIdx) });
            }
            if (args.cell.hyperlink) {
                this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
            }
            if (args.cell.wrap) {
                this.parent.notify(wrapEvent, {
                    range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx], wrap: true, sheet: this.parent.getActiveSheet(), initial: true, td: args.td, row: args.row, hRow: args.hRow
                });
            }
            if (args.cell.rowSpan > 1) {
                var rowSpan = args.cell.rowSpan - this.parent.hiddenCount(args.rowIdx, args.rowIdx + (args.cell.rowSpan - 1));
                if (rowSpan > 1) {
                    args.td.rowSpan = rowSpan;
                }
            }
            if (args.cell.colSpan > 1) {
                var colSpan = args.cell.colSpan -
                    this.parent.hiddenCount(args.colIdx, args.colIdx + (args.cell.colSpan - 1), 'columns');
                if (colSpan > 1) {
                    args.td.colSpan = colSpan;
                }
            }
            if (args.cell.image) {
                for (var i = 0; i < args.cell.image.length; i++) {
                    this.parent.notify(createImageElement, {
                        options: {
                            src: args.cell.image[i].src, imageId: args.cell.image[i].id,
                            height: args.cell.image[i].height, width: args.cell.image[i].width,
                            top: args.cell.image[i].top, left: args.cell.image[i].left
                        },
                        range: getRangeAddress([args.rowIdx, args.colIdx, args.rowIdx, args.colIdx]), isPublic: false
                    });
                }
            }
        }
        if (args.isRefresh) {
            this.removeStyle(args.td, args.rowIdx, args.colIdx);
        }
        if (this.parent.allowConditionalFormat && args.lastCell) {
            this.parent.notify(checkConditionalFormat, { rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.cell });
        }
        if (this.parent.allowChart && args.lastCell) {
            this.parent.notify(refreshChart, {
                cell: args.cell, rIdx: args.rowIdx, cIdx: args.colIdx, sheetIdx: this.parent.activeSheetIndex
            });
        }
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || args.lastCell) {
            this.parent.notify(applyCellFormat, {
                style: extend({}, this.parent.commonCellStyle, style), rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.td,
                first: args.first, row: args.row, lastCell: args.lastCell, hRow: args.hRow, pRow: args.pRow, isHeightCheckNeeded: args.isHeightCheckNeeded, manualUpdate: args.manualUpdate
            });
        }
        if (args.checkNextBorder === 'Row') {
            var borderTop = this.parent.getCellStyleValue(['borderTop'], [Number(this.parent.getContentTable().rows[0].getAttribute('aria-rowindex')) - 1, args.colIdx]).borderTop;
            if (borderTop !== '' && (!args.cell || !args.cell.style || !args.cell.style.bottomPriority)) {
                this.parent.notify(applyCellFormat, { style: { borderBottom: borderTop }, rowIdx: args.rowIdx,
                    colIdx: args.colIdx, cell: args.td });
            }
        }
        if (args.checkNextBorder === 'Column') {
            var borderLeft = this.parent.getCellStyleValue(['borderLeft'], [args.rowIdx, args.colIdx + 1]).borderLeft;
            if (borderLeft !== '' && (!args.cell || !args.cell.style || (!args.cell.style.borderRight && !args.cell.style.border))) {
                this.parent.notify(applyCellFormat, { style: { borderRight: borderLeft }, rowIdx: args.rowIdx, colIdx: args.colIdx,
                    cell: args.td });
            }
        }
        if (args.cell && args.cell.hyperlink && !hasTemplate(this.parent, args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            var address = void 0;
            if (typeof (args.cell.hyperlink) === 'string') {
                address = args.cell.hyperlink;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink = address.toLowerCase().indexOf('www.') === 0 ? 'http://' + address : address;
                }
            }
            else {
                address = args.cell.hyperlink.address;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink.address = address.toLowerCase().indexOf('www.') === 0 ? 'http://' + address : address;
                }
            }
            this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
        }
    };
    CellRenderer.prototype.checkMerged = function (args) {
        if (args.cell && (args.cell.colSpan < 0 || args.cell.rowSpan < 0)) {
            args.td.style.display = 'none';
            if (args.cell.colSpan < 0) {
                this.parent.notify(checkPrevMerge, args);
            }
            if (args.cell.rowSpan < 0) {
                args.isRow = true;
                this.parent.notify(checkPrevMerge, args);
            }
            return true;
        }
        return false;
    };
    CellRenderer.prototype.processTemplates = function (cell, rowIdx, colIdx) {
        var sheet = this.parent.getActiveSheet();
        var ranges = sheet.ranges;
        var range;
        for (var j = 0, len = ranges.length; j < len; j++) {
            if (ranges[j].template) {
                range = getRangeIndexes(ranges[j].address.length ? ranges[j].address : ranges[j].startCell);
                if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                    if (cell) {
                        return this.compileCellTemplate(ranges[j].template);
                    }
                    else {
                        if (!getCell(rowIdx, colIdx, sheet, true)) {
                            return this.compileCellTemplate(ranges[j].template);
                        }
                    }
                }
            }
        }
        return '';
    };
    CellRenderer.prototype.compileCellTemplate = function (template) {
        var compiledStr;
        if (typeof template === 'string') {
            var templateString = void 0;
            if (template.trim().indexOf('#') === 0) {
                templateString = document.querySelector(template).innerHTML.trim();
            }
            else {
                templateString = template;
            }
            compiledStr = compile(templateString);
            return compiledStr({}, null, null, '', true)[0].outerHTML;
        }
        else {
            compiledStr = compile(template);
            return compiledStr({}, null, null, '')[0];
        }
    };
    CellRenderer.prototype.updateRowHeight = function (args) {
        if (args.cell && args.cell.children.length) {
            var clonedCell = args.cell.cloneNode(true);
            this.tableRow.appendChild(clonedCell);
        }
        if (args.lastCell && this.tableRow.childElementCount) {
            var sheet = this.parent.getActiveSheet();
            var tableRow = args.row || this.parent.getRow(args.rowIdx);
            var previouseHeight = getRowHeight(sheet, args.rowIdx);
            var rowHeight = this.getRowHeightOnInit();
            if (rowHeight > previouseHeight) {
                tableRow.style.height = rowHeight + "px";
                if (sheet.showHeaders) {
                    (args.hRow || this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable())).style.height =
                        rowHeight + "px";
                }
                setRowHeight(sheet, args.rowIdx, rowHeight);
            }
            this.tableRow.innerHTML = '';
        }
    };
    CellRenderer.prototype.getRowHeightOnInit = function () {
        var tTable = this.parent.createElement('table', { className: 'e-table e-test-table' });
        var tBody = tTable.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.tableRow);
        this.parent.element.appendChild(tTable);
        var height = Math.round(this.tableRow.getBoundingClientRect().height);
        this.parent.element.removeChild(tTable);
        return height < 20 ? 20 : height;
    };
    CellRenderer.prototype.removeStyle = function (element, rowIdx, colIdx) {
        var cellStyle;
        if (element.style.length) {
            cellStyle = this.parent.getCellStyleValue(['borderLeft', 'border'], [rowIdx, colIdx + 1]);
            var rightBorder_1 = cellStyle.borderLeft || cellStyle.border;
            cellStyle = this.parent.getCellStyleValue(['borderTop', 'border'], [rowIdx + 1, colIdx]);
            var bottomBorder_1 = cellStyle.borderTop || cellStyle.border;
            if (rightBorder_1 || bottomBorder_1) {
                [].slice.call(element.style).forEach(function (style) {
                    if ((rightBorder_1 && !(style.indexOf('border-right') > -1) && !bottomBorder_1) ||
                        (bottomBorder_1 && !(style.indexOf('border-bottom') > -1) && !rightBorder_1)) {
                        element.style.removeProperty(style);
                    }
                });
            }
            else {
                element.removeAttribute('style');
            }
        }
        var prevRowCell = this.parent.getCell(rowIdx - 1, colIdx);
        if (prevRowCell && prevRowCell.style.borderBottom) {
            var prevRowIdx = Number(prevRowCell.parentElement.getAttribute('aria-rowindex')) - 1;
            cellStyle = this.parent.getCellStyleValue(['borderBottom', 'border'], [prevRowIdx, colIdx]);
            if (!(cellStyle.borderBottom || cellStyle.border)) {
                prevRowCell.style.borderBottom = '';
            }
        }
        var prevColCell = element.previousElementSibling;
        if (prevColCell && prevColCell.style.borderRight) {
            colIdx = Number(prevColCell.getAttribute('aria-colindex')) - 1;
            cellStyle = this.parent.getCellStyleValue(['borderRight', 'border'], [rowIdx, colIdx]);
            if (!(cellStyle.borderRight || cellStyle.border)) {
                prevColCell.style.borderRight = '';
            }
        }
    };
    /** @hidden */
    CellRenderer.prototype.refreshRange = function (range) {
        var sheet = this.parent.getActiveSheet();
        var cRange = range.slice();
        if (inView(this.parent, cRange, true)) {
            for (var i = cRange[0]; i <= cRange[2]; i++) {
                if (isHiddenRow(sheet, i)) {
                    continue;
                }
                for (var j = cRange[1]; j <= cRange[3]; j++) {
                    var cell = this.parent.getCell(i, j);
                    if (cell) {
                        this.update({ rowIdx: i, colIdx: j, td: cell, cell: getCell(i, j, sheet), lastCell: j === cRange[3], isRefresh: true, isHeightCheckNeeded: true, manualUpdate: true, first: '' });
                        this.parent.notify(renderFilterCell, { td: cell, rowIndex: i, colIndex: j });
                    }
                }
            }
        }
    };
    CellRenderer.prototype.refresh = function (rowIdx, colIdx, lastCell, element) {
        var sheet = this.parent.getActiveSheet();
        if (!element && (isHiddenRow(sheet, rowIdx) || isHiddenCol(sheet, colIdx))) {
            return;
        }
        if (element || !this.parent.scrollSettings.enableVirtualization || (rowIdx >= this.parent.viewport.topIndex && rowIdx <=
            this.parent.viewport.bottomIndex && colIdx >= this.parent.viewport.leftIndex && colIdx <=
            this.parent.viewport.rightIndex)) {
            var cell = element || this.parent.getCell(rowIdx, colIdx);
            this.update({ rowIdx: rowIdx, colIdx: colIdx, td: cell, cell: getCell(rowIdx, colIdx, sheet), lastCell: lastCell, isRefresh: true, isHeightCheckNeeded: true,
                manualUpdate: true, first: '' });
            this.parent.notify(renderFilterCell, { td: cell, rowIndex: rowIdx, colIndex: colIdx });
        }
    };
    CellRenderer.prototype.updateView = function (args) {
        this.refreshRange(args.indexes);
    };
    return CellRenderer;
}());
export { CellRenderer };
