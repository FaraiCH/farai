import { isNullOrUndefined, extend, addClass } from '@syncfusion/ej2-base';
import { attributes as addAttributes } from '@syncfusion/ej2-base';
import { rowDataBound, queryCellInfo } from '../base/constant';
import { setStyleAndAttributes, getObject, extendObjWithFn } from '../base/util';
import { CellType } from '../base/enum';
import { CellMergeRender } from './cell-merge-renderer';
/**
 * RowRenderer class which responsible for building row content.
 * @hidden
 */
var RowRenderer = /** @class */ (function () {
    function RowRenderer(serviceLocator, cellType, parent) {
        this.isSpan = false;
        this.cellType = cellType;
        this.serviceLocator = serviceLocator;
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { role: 'row' } });
    }
    /**
     * Function to render the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    RowRenderer.prototype.render = function (row, columns, attributes, rowTemplate, cloneNode) {
        return this.refreshRow(row, columns, attributes, rowTemplate, cloneNode);
    };
    /**
     * Function to refresh the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    RowRenderer.prototype.refresh = function (row, columns, isChanged, attributes, rowTemplate) {
        if (isChanged) {
            row.data = extendObjWithFn({}, row.changes);
            this.refreshMergeCells(row);
        }
        var node = this.parent.element.querySelector('[data-uid=' + row.uid + ']');
        var tr = this.refreshRow(row, columns, attributes, rowTemplate, null, isChanged);
        var cells = [].slice.call(tr.cells);
        node.innerHTML = '';
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            node.appendChild(cell);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    RowRenderer.prototype.refreshRow = function (row, columns, attributes, rowTemplate, cloneNode, isEdit) {
        var tr = !isNullOrUndefined(cloneNode) ? cloneNode : this.element.cloneNode();
        var rowArgs = { data: row.data };
        var cellArgs = { data: row.data };
        var attrCopy = extend({}, attributes, {});
        var chekBoxEnable = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox' && col.field; })[0];
        var value = false;
        if (chekBoxEnable) {
            value = getObject(chekBoxEnable.field, rowArgs.data);
        }
        if (row.isDataRow) {
            row.isSelected = this.parent.getSelectedRowIndexes().indexOf(row.index) > -1 || value;
        }
        if (row.isDataRow && this.parent.isCheckBoxSelection
            && this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            row.isSelected = true;
            if (this.parent.getSelectedRowIndexes().indexOf(row.index) === -1) {
                this.parent.getSelectedRowIndexes().push(row.index);
            }
        }
        this.buildAttributeFromRow(tr, row);
        addAttributes(tr, attrCopy);
        setStyleAndAttributes(tr, row.attributes);
        var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
        var _loop_1 = function (i, len) {
            var cell = row.cells[i];
            cell.isSelected = row.isSelected;
            cell.isColumnSelected = cell.column.isSelected;
            var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
            var attrs = { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' };
            if (row.isExpand && row.cells[i].cellType === CellType.DetailExpand) {
                attrs['class'] = this_1.parent.isPrinting ? 'e-detailrowcollapse' : 'e-detailrowexpand';
            }
            var td = cellRenderer.render(row.cells[i], row.data, attrs, row.isExpand, isEdit);
            if (row.cells[i].cellType !== CellType.Filter) {
                if (row.cells[i].cellType === CellType.Data || row.cells[i].cellType === CellType.CommandColumn) {
                    this_1.parent.trigger(queryCellInfo, extend(cellArgs, {
                        cell: td, column: cell.column, colSpan: 1,
                        rowSpan: 1, foreignKeyData: row.cells[i].foreignKeyData,
                        requestType: this_1.parent.requestTypeAction
                    }));
                    var isRowSpanned = false;
                    if (row.index > 0 && this_1.isSpan) {
                        var prevRowCells = this_1.parent.groupSettings.columns.length > 0 &&
                            !this_1.parent.getRowsObject()[row.index - 1].isDataRow ?
                            this_1.parent.getRowsObject()[row.index].cells : this_1.parent.getRowsObject()[row.index - 1].cells;
                        var uid_1 = 'uid';
                        var prevRowCell = prevRowCells.filter(function (cell) {
                            return cell.column.uid === row.cells[i].column[uid_1];
                        })[0];
                        isRowSpanned = prevRowCell.isRowSpanned ? prevRowCell.isRowSpanned : prevRowCell.rowSpanRange > 1;
                    }
                    if (cellArgs.colSpan > 1 || row.cells[i].cellSpan > 1 || cellArgs.rowSpan > 1 || isRowSpanned) {
                        this_1.isSpan = true;
                        var cellMerge = new CellMergeRender(this_1.serviceLocator, this_1.parent);
                        td = cellMerge.render(cellArgs, row, i, td);
                    }
                }
                if (!row.cells[i].isSpanned) {
                    tr.appendChild(td);
                }
            }
        };
        var this_1 = this;
        for (var i = 0, len = row.cells.length; i < len; i++) {
            _loop_1(i, len);
        }
        var args = { row: tr, rowHeight: this.parent.rowHeight };
        if (row.isDataRow) {
            this.parent.trigger(rowDataBound, extend(rowArgs, args));
            if (this.parent.childGrid || this.parent.isRowDragable() || this.parent.detailTemplate) {
                var td = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
            }
        }
        if (this.parent.enableVirtualization) {
            rowArgs.rowHeight = this.parent.rowHeight;
        }
        if (rowArgs.rowHeight) {
            tr.style.height = rowArgs.rowHeight + 'px';
        }
        else if (this.parent.rowHeight && (tr.querySelector('.e-headercell') || tr.querySelector('.e-groupcaption'))) {
            tr.style.height = this.parent.rowHeight + 'px';
        }
        if (row.cssClass) {
            tr.classList.add(row.cssClass);
        }
        if (row.lazyLoadCssClass) {
            tr.classList.add(row.lazyLoadCssClass);
        }
        var vFTable = this.parent.enableColumnVirtualization && this.parent.frozenColumns !== 0;
        if (!vFTable && this.parent.element.scrollHeight > this.parent.height && this.parent.aggregates.length) {
            for (var i = 0; i < this.parent.aggregates.length; i++) {
                var property = 'properties';
                var column = 'columns';
                if (this.parent.aggregates[i][property][column][0].footerTemplate) {
                    var summarycell = tr.querySelectorAll('.e-summarycell');
                    if (summarycell.length) {
                        var lastSummaryCell = (summarycell[summarycell.length - 1]);
                        addClass([lastSummaryCell], ['e-lastsummarycell']);
                        var firstSummaryCell = (summarycell[0]);
                        addClass([firstSummaryCell], ['e-firstsummarycell']);
                    }
                }
            }
        }
        return tr;
    };
    RowRenderer.prototype.refreshMergeCells = function (row) {
        for (var _i = 0, _a = row.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.isSpanned = false;
        }
        return row;
    };
    /**
     * Function to check and add alternative row css class.
     * @param  {Element} tr
     * @param  {{[x:string]:Object}} attr
     */
    RowRenderer.prototype.buildAttributeFromRow = function (tr, row) {
        var attr = {};
        var prop = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        var classes = [];
        if (row.isDataRow) {
            classes.push('e-row');
        }
        if (row.isAltRow) {
            classes.push('e-altrow');
        }
        if (!isNullOrUndefined(row.index)) {
            attr[prop.rowindex] = row.index;
        }
        if (row.rowSpan) {
            attr.rowSpan = row.rowSpan;
        }
        if (row.uid) {
            attr[prop.dataUID] = row.uid;
        }
        if (row.isSelected) {
            attr[prop.ariaSelected] = true;
        }
        if (row.visible === false) {
            classes.push('e-hide');
        }
        attr.class = classes;
        setStyleAndAttributes(tr, attr);
    };
    return RowRenderer;
}());
export { RowRenderer };
