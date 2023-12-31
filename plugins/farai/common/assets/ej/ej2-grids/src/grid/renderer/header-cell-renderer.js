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
import { isNullOrUndefined, extend, isBlazor } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { setStyleAndAttributes, appendChildren } from '../base/util';
import { CellRenderer } from './cell-renderer';
import { AriaService } from '../services/aria-service';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { headerCellInfo } from '../base/constant';
/**
 * HeaderCellRenderer class which responsible for building header cell content.
 * @hidden
 */
var HeaderCellRenderer = /** @class */ (function (_super) {
    __extends(HeaderCellRenderer, _super);
    function HeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent
            .createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
        _this.ariaService = new AriaService();
        _this.hTxtEle = _this.parent.createElement('span', { className: 'e-headertext' });
        _this.sortEle = _this.parent.createElement('div', { className: 'e-sortfilterdiv e-icons' });
        _this.gui = _this.parent.createElement('div');
        _this.chkAllBox = _this.parent.createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox' } });
        return _this;
    }
    /**
     * Function to return the wrapper for the TH content.
     * @returns string
     */
    HeaderCellRenderer.prototype.getGui = function () {
        return this.gui.cloneNode();
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {Element}
     */
    HeaderCellRenderer.prototype.render = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        var fltrMenuEle = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Element} node
     */
    HeaderCellRenderer.prototype.refresh = function (cell, node) {
        this.clean(node);
        var fltrMenuEle = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    HeaderCellRenderer.prototype.clean = function (node) {
        node.innerHTML = '';
    };
    /* tslint:disable-next-line:max-func-body-length */
    HeaderCellRenderer.prototype.prepareHeader = function (cell, node, fltrMenuEle) {
        var column = cell.column;
        var ariaAttr = {};
        //Prepare innerHtml
        var innerDIV = this.getGui();
        var hValueAccer;
        attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        if (!isNullOrUndefined(column.headerValueAccessor)) {
            hValueAccer = this.getValue(column.headerText, column);
        }
        if (column.type !== 'checkbox') {
            var value = column.headerText;
            if (!isNullOrUndefined(hValueAccer)) {
                value = hValueAccer;
            }
            var headerText = this.hTxtEle.cloneNode();
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
        }
        else {
            column.editType = 'booleanedit';
            var checkAllWrap = createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
            checkAllWrap.insertBefore(this.chkAllBox.cloneNode(), checkAllWrap.firstChild);
            innerDIV.appendChild(checkAllWrap);
            innerDIV.classList.add('e-headerchkcelldiv');
        }
        this.buildAttributeFromCell(node, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(this.sortEle.cloneNode());
        if ((this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') &&
            (column.allowFiltering && !isNullOrUndefined(column.field)) &&
            !(this.parent.showColumnMenu && column.showColumnMenu)) {
            attributes(fltrMenuEle, {
                'e-mappinguid': 'e-flmenu-' + column.uid,
            });
            node.classList.add('e-fltr-icon');
            var matchFlColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFlColumns.length) {
                for (var index = 0; index < this.parent.columns.length; index++) {
                    for (var count = 0; count < this.parent.filterSettings.columns.length; count++) {
                        if (this.parent.filterSettings.columns[count].field === column.field) {
                            fltrMenuEle.classList.add('e-filtered');
                            matchFlColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.appendChild(fltrMenuEle.cloneNode());
        }
        if (cell.className) {
            node.classList.add(cell.className);
        }
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.allowSorting) {
            ariaAttr.sort = 'none';
        }
        if (column.allowGrouping) {
            ariaAttr.grabbed = false;
        }
        node = this.extendPrepareHeader(column, node);
        var result;
        var gridObj = this.parent;
        var colIndex = gridObj.getColumnIndexByField(column.field);
        if (!isNullOrUndefined(column.headerTemplate)) {
            //need to pass the template id for blazor headertemplate
            var headerTempID = gridObj.element.id + column.uid + 'headerTemplate';
            var str = 'isStringTemplate';
            var col = isBlazor() ? column.toJSON() : column;
            var isReactCompiler = this.parent.isReact && typeof (column.headerTemplate) !== 'string';
            if (isReactCompiler) {
                var copied = { 'index': colIndex };
                node.firstElementChild.innerHTML = '';
                column.getHeaderTemplate()(extend(copied, col), gridObj, 'headerTemplate', headerTempID, this.parent[str], null, node.firstElementChild);
                this.parent.renderTemplates();
            }
            else {
                result = column.getHeaderTemplate()(extend({ 'index': colIndex }, col), gridObj, 'headerTemplate', headerTempID, this.parent[str]);
                node.firstElementChild.innerHTML = '';
                appendChildren(node.firstElementChild, result);
            }
        }
        this.ariaService.setOptions(node, ariaAttr);
        if (!isNullOrUndefined(column.headerTextAlign) || !isNullOrUndefined(column.textAlign)) {
            var alignment = column.headerTextAlign || column.textAlign;
            innerDIV.style.textAlign = alignment;
            if (alignment === 'Right' || alignment === 'Left') {
                node.classList.add(alignment === 'Right' ? 'e-rightalign' : 'e-leftalign');
            }
            else if (alignment === 'Center') {
                node.classList.add('e-centeralign');
            }
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
        node.setAttribute('aria-rowspan', (!isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        this.parent.trigger(headerCellInfo, { cell: cell, node: node });
        return node;
    };
    HeaderCellRenderer.prototype.getValue = function (field, column) {
        return column.headerValueAccessor(field, column);
    };
    HeaderCellRenderer.prototype.extendPrepareHeader = function (column, node) {
        if (this.parent.showColumnMenu && column.showColumnMenu && !isNullOrUndefined(column.field)) {
            var element = (this.parent.createElement('div', { className: 'e-icons e-columnmenu' }));
            var matchFilteredColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFilteredColumns.length) {
                for (var i = 0; i < this.parent.columns.length; i++) {
                    for (var j = 0; j < this.parent.filterSettings.columns.length; j++) {
                        if (this.parent.filterSettings.columns[j].field === column.field) {
                            element.classList.add('e-filtered');
                            matchFilteredColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.classList.add('e-fltr-icon');
            node.appendChild(element);
        }
        if (this.parent.allowResizing) {
            var handler = this.parent.createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    return HeaderCellRenderer;
}(CellRenderer));
export { HeaderCellRenderer };
