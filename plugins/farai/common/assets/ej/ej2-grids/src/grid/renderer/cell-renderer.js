import { remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend, isBlazor, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { doesImplementInterface, setStyleAndAttributes, appendChildren, extendObjWithFn } from '../base/util';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { foreignKeyData } from '../base/constant';
/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
var CellRenderer = /** @class */ (function () {
    function CellRenderer(parent, locator) {
        this.localizer = locator.getService('localization');
        this.formatter = locator.getService('valueFormatter');
        this.parent = parent;
        this.element = this.parent.createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell', tabindex: '-1' } });
        this.rowChkBox = this.parent.createElement('input', { className: 'e-checkselect', attrs: { 'type': 'checkbox' } });
    }
    /**
     * Function to return the wrapper for the TD content
     * @returns string
     */
    CellRenderer.prototype.getGui = function () {
        return '';
    };
    /**
     * Function to format the cell value.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.format = function (column, value, data) {
        if (!isNullOrUndefined(column.format)) {
            if (column.type === 'number' && isNaN(parseInt(value, 10))) {
                value = null;
            }
            value = this.formatter.toView(value, column.getFormatter());
        }
        return isNullOrUndefined(value) ? '' : value.toString();
    };
    CellRenderer.prototype.evaluate = function (node, cell, data, attributes, fData, isEdit) {
        var _a;
        var result;
        if (cell.column.template) {
            var isReactCompiler = this.parent.isReact && typeof (cell.column.template) !== 'string';
            var literals = ['index'];
            var dummyData = extendObjWithFn({}, data, (_a = {}, _a[foreignKeyData] = fData, _a.column = cell.column, _a));
            var templateID = this.parent.element.id + cell.column.uid;
            var str = 'isStringTemplate';
            var index = 'index';
            if (isBlazor() && isEdit) {
                var rNumber = this.parent.editSettings.mode !== 'Batch' ? parseInt(attributes[index], 10) : null;
                result = cell.column.getColumnTemplate()(extend({ 'index': attributes[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str], rNumber);
                window[templateID] = null;
                if (this.parent.editSettings.mode !== 'Batch') {
                    updateBlazorTemplate(templateID, 'Template', cell.column, false);
                }
            }
            else {
                if (isReactCompiler) {
                    var copied = { 'index': attributes[literals[0]] };
                    cell.column.getColumnTemplate()(extend(copied, dummyData), this.parent, 'columnTemplate', templateID, this.parent[str], null, node);
                    this.parent.renderTemplates();
                }
                else {
                    result = cell.column.getColumnTemplate()(extend({ 'index': attributes[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str]);
                }
            }
            if (!isReactCompiler) {
                appendChildren(node, result);
            }
            this.parent.notify('template-result', { template: result });
            result = null;
            node.setAttribute('aria-label', node.innerText + ' is template cell' + ' column header ' +
                cell.column.headerText);
            return false;
        }
        return true;
    };
    /**
     * Function to invoke the custom formatter available in the column object.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.invokeFormatter = function (column, value, data) {
        if (!isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                var formatter = column.formatter;
                value = new formatter().getValue(column, data);
            }
            else if (typeof column.formatter === 'function') {
                value = column.formatter(column, data);
            }
            else {
                value = column.formatter.getValue(column, data);
            }
        }
        return value;
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.render = function (cell, data, attributes, isExpand, isEdit) {
        return this.refreshCell(cell, data, attributes, isEdit);
    };
    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.refreshTD = function (td, cell, data, attributes) {
        var isEdit = this.parent.editSettings.mode === 'Batch' && td.classList.contains('e-editedbatchcell');
        if (this.parent.isReact) {
            td.innerHTML = '';
            var cellIndex = td.cellIndex;
            var parentRow = td.parentElement;
            remove(td);
            var newTD = this.refreshCell(cell, data, attributes, isEdit);
            this.cloneAttributes(newTD, td);
            parentRow.cells.length !== cellIndex - 1 ? parentRow.insertBefore(newTD, parentRow.cells[cellIndex])
                : parentRow.appendChild(newTD);
        }
        else {
            var node = this.refreshCell(cell, data, attributes, isEdit);
            td.innerHTML = '';
            td.setAttribute('aria-label', node.getAttribute('aria-label'));
            var elements = [].slice.call(node.childNodes);
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var elem = elements_1[_i];
                td.appendChild(elem);
            }
        }
    };
    // tslint:disable-next-line:no-any
    CellRenderer.prototype.cloneAttributes = function (target, source) {
        // tslint:disable-next-line:no-any
        var attrs = source.attributes;
        // tslint:disable-next-line:no-any
        var i = attrs.length;
        // tslint:disable-next-line:no-any
        var attr;
        while (i--) {
            attr = attrs[i];
            target.setAttribute(attr.name, attr.value);
        }
    };
    CellRenderer.prototype.refreshCell = function (cell, data, attributes, isEdit) {
        var _a;
        var node = this.element.cloneNode();
        var column = cell.column;
        var fData;
        if (cell.isForeignKey) {
            fData = cell.foreignKeyData[0] || (_a = {}, _a[column.foreignKeyValue] = column.format ? null : '', _a);
        }
        //Prepare innerHtml
        var innerHtml = this.getGui();
        var value = cell.isForeignKey ? this.getValue(column.foreignKeyValue, fData, column) :
            this.getValue(column.field, data, column);
        if ((column.type === 'date' || column.type === 'datetime') && !isNullOrUndefined(value)) {
            value = new Date(value);
        }
        value = this.format(column, value, data);
        innerHtml = value.toString();
        if (column.type === 'boolean' && !column.displayAsCheckBox) {
            var localeStr = (value !== 'true' && value !== 'false') ? null : value === 'true' ? 'True' : 'False';
            innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
        }
        var fromFormatter = this.invokeFormatter(column, value, data);
        innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
        node.setAttribute('aria-label', innerHtml + ' column header ' + cell.column.headerText);
        if (this.evaluate(node, cell, data, attributes, fData, isEdit) && column.type !== 'checkbox') {
            this.appendHtml(node, innerHtml, column.getDomSetter ? column.getDomSetter() : 'innerHTML');
        }
        else if (column.type === 'checkbox') {
            node.classList.add('e-gridchkbox');
            node.setAttribute('aria-label', 'checkbox');
            if (this.parent.selectionSettings.persistSelection) {
                value = value === 'true';
            }
            else {
                value = false;
            }
            var checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
            checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
            node.appendChild(checkWrap);
        }
        if (this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            cell.isSelected = true;
        }
        this.setAttributes(node, cell, attributes);
        if (column.type === 'boolean' && column.displayAsCheckBox) {
            var checked = isNaN(parseInt(value.toString(), 10)) ? value === 'true' : parseInt(value.toString(), 10) > 0;
            var checkWrap = createCheckBox(this.parent.createElement, false, { checked: checked, label: ' ' });
            node.innerHTML = '';
            checkWrap.classList.add('e-checkbox-disabled');
            node.appendChild(checkWrap);
            node.setAttribute('aria-label', checked + ' column header ' + cell.column.headerText);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    CellRenderer.prototype.appendHtml = function (node, innerHtml, property) {
        if (property === void 0) { property = 'innerHTML'; }
        node[property] = innerHtml;
        return node;
    };
    /**
     * @hidden
     */
    CellRenderer.prototype.setAttributes = function (node, cell, attributes) {
        var column = cell.column;
        this.buildAttributeFromCell(node, cell, column.type === 'checkbox');
        setStyleAndAttributes(node, attributes);
        setStyleAndAttributes(node, cell.attributes);
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.textAlign) {
            node.style.textAlign = column.textAlign;
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
    };
    CellRenderer.prototype.buildAttributeFromCell = function (node, cell, isCheckBoxType) {
        var attr = {};
        var prop = { 'colindex': 'aria-colindex' };
        var classes = [];
        if (cell.colSpan) {
            attr.colSpan = cell.colSpan;
        }
        if (cell.rowSpan) {
            attr.rowSpan = cell.rowSpan;
        }
        if (cell.isTemplate) {
            classes.push('e-templatecell');
        }
        if (cell.isSelected) {
            classes.push.apply(classes, ['e-selectionbackground', 'e-active']);
            if (isCheckBoxType) {
                node.querySelector('.e-frame').classList.add('e-check');
            }
        }
        if (cell.isColumnSelected) {
            classes.push.apply(classes, ['e-columnselection']);
        }
        if (!isNullOrUndefined(cell.index)) {
            attr[prop.colindex] = cell.index;
        }
        if (!cell.visible) {
            classes.push('e-hide');
        }
        attr.class = classes;
        setStyleAndAttributes(node, attr);
    };
    CellRenderer.prototype.getValue = function (field, data, column) {
        return column.valueAccessor(field, data, column);
    };
    return CellRenderer;
}());
export { CellRenderer };
