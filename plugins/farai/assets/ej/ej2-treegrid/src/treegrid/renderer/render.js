import { getObject, appendChildren } from '@syncfusion/ej2-grids';
import { templateCompiler, extend } from '@syncfusion/ej2-grids';
import { addClass, createElement, isNullOrUndefined, getValue, isBlazor } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { isRemoteData, isOffline, getExpandStatus, isFilterChildHierarchy } from '../utils';
/**
 * TreeGrid render module
 * @hidden
 */
var Render = /** @class */ (function () {
    /**
     * Constructor for render module
     */
    function Render(parent) {
        this.parent = parent;
        this.templateResult = null;
        this.parent.grid.on('template-result', this.columnTemplateResult, this);
        this.parent.grid.on('reactTemplateRender', this.reactTemplateRender, this);
    }
    /**
     * Updated row elements for TreeGrid
     */
    Render.prototype.RowModifier = function (args) {
        if (!args.data) {
            return;
        }
        var data = args.data;
        var parentData = data.parentItem;
        var index;
        if (!isNullOrUndefined(data.parentItem) && !isFilterChildHierarchy(this.parent) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent)))) {
            index = data.parentItem.index;
            var collapsed = (this.parent.initialRender && (!(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
                parentData[this.parent.expandStateMapping]) || this.parent.enableCollapseAll)) ||
                !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
            if (collapsed) {
                args.row.style.display = 'none';
            }
        }
        else {
            index = +args.row.getAttribute('aria-rowindex');
        }
        if (isRemoteData(this.parent) && !isOffline(this.parent)) {
            var proxy_1 = this.parent;
            var parentrec = this.parent.getCurrentViewRecords().filter(function (rec) {
                return getValue(proxy_1.idMapping, rec) === getValue(proxy_1.parentIdMapping, data);
            });
            if (parentrec.length > 0) {
                var display = parentrec[0].expanded ? 'table-row' : 'none';
                args.row.setAttribute('style', 'display: ' + display + ';');
            }
        }
        //addClass([args.row], 'e-gridrowindex' + index + 'level' + (<ITreeData>args.data).level);
        var summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        if (args.row.querySelector('.e-treegridexpand')) {
            args.row.setAttribute('aria-expanded', 'true');
        }
        else if (args.row.querySelector('.e-treegridcollapse')) {
            args.row.setAttribute('aria-expanded', 'false');
        }
        if (this.parent.enableCollapseAll && this.parent.initialRender) {
            if (!isNullOrUndefined(data.parentItem)) {
                args.row.style.display = 'none';
            }
        }
        this.parent.trigger(events.rowDataBound, args);
    };
    /**
     * cell renderer for tree column index cell
     */
    Render.prototype.cellRender = function (args) {
        if (!args.data) {
            return;
        }
        var grid = this.parent.grid;
        var data = args.data;
        var index;
        var ispadfilter = isNullOrUndefined(data.filterLevel);
        var pad = ispadfilter ? data.level : data.filterLevel;
        var totalIconsWidth = 0;
        var cellElement;
        var column = this.parent.getColumnByUid(args.column.uid);
        var summaryRow = data.isSummaryRow;
        if (!isNullOrUndefined(data.parentItem)) {
            index = data.parentItem.index;
        }
        else {
            index = data.index;
        }
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex && (args.requestType === 'add' || args.requestType
            === 'rowDragAndDrop' || args.requestType === 'delete' || isNullOrUndefined(args.cell.querySelector('.e-treecell')))) {
            var container = createElement('div', { className: 'e-treecolumn-container' });
            var emptyExpandIcon = createElement('span', {
                className: 'e-icons e-none',
                styles: 'width: 10px; display: inline-block'
            });
            for (var n = 0; n < pad; n++) {
                totalIconsWidth += 10;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            var iconRequired = !isNullOrUndefined(data.hasFilteredChildRecords)
                ? data.hasFilteredChildRecords : data.hasChildRecords;
            if (iconRequired && !isNullOrUndefined(data.childRecords)) {
                iconRequired = !(data.childRecords.length === 0);
            }
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                var expandIcon = createElement('span', { className: 'e-icons' });
                var expand = void 0;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                }
                else {
                    expand = !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                addClass([expandIcon], (expand) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px';
                totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            else if (pad || !pad && !data.level) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            cellElement = createElement('span', { className: 'e-treecell' });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
            this.updateTreeCell(args, cellElement, container);
            container.appendChild(cellElement);
            args.cell.appendChild(container);
        }
        if (this.parent.frozenColumns > this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        else if (this.parent.frozenColumns < this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            (grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns
                || grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns - 1)) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        else if (this.parent.frozenColumns === this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex - 1) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        if (!isNullOrUndefined(column) && column.showCheckbox) {
            this.parent.notify('columnCheckbox', args);
            if (this.parent.allowTextWrap) {
                var checkboxElement = args.cell.querySelectorAll('.e-frame')[0];
                var width = parseInt(checkboxElement.style.width, 16);
                totalIconsWidth += width;
                totalIconsWidth += 10;
                if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
                    cellElement = args.cell.querySelector('.e-treecell');
                }
                else {
                    cellElement = args.cell.querySelector('.e-treecheckbox');
                }
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
        }
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            var summaryData = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        if (isNullOrUndefined(this.parent.rowTemplate)) {
            this.parent.trigger(events.queryCellInfo, args);
        }
    };
    Render.prototype.updateTreeCell = function (args, cellElement, container) {
        var treeColumn = this.parent.columns[this.parent.treeColumnIndex];
        var templateFn = 'templateFn';
        var colindex = args.column.index;
        if (isNullOrUndefined(treeColumn.field)) {
            args.cell.setAttribute('aria-colindex', colindex + '');
        }
        if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template) && !isBlazor()) {
            args.column.template = treeColumn.template;
            args.column[templateFn] = templateCompiler(args.column.template);
            args.cell.classList.add('e-templatecell');
        }
        var textContent = args.cell.querySelector('.e-treecell') != null ?
            args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
        if (typeof (args.column.template) === 'object' && this.templateResult) {
            appendChildren(cellElement, this.templateResult);
            this.templateResult = null;
            args.cell.innerHTML = '';
        }
        else if (args.cell.classList.contains('e-templatecell')) {
            var len = args.cell.children.length;
            var tempID = this.parent.element.id + args.column.uid;
            if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template) && !isBlazor()) {
                var portals = 'portals';
                var renderReactTemplates = 'renderReactTemplates';
                if (this.parent.isReact) {
                    args.column[templateFn](args.data, this.parent, 'template', tempID, null, null, cellElement);
                    if (isNullOrUndefined(this.parent.grid[portals])) {
                        this.parent.grid[portals] = this.parent[portals];
                    }
                    this.parent[renderReactTemplates]();
                }
                else {
                    var str = 'isStringTemplate';
                    var result = void 0;
                    result = args.column[templateFn](extend({ 'index': '' }, args.data), this.parent, 'template', tempID, this.parent[str]);
                    appendChildren(cellElement, result);
                }
                delete args.column.template;
                delete args.column[templateFn];
                args.cell.innerHTML = '';
            }
            else {
                for (var i = 0; i < len; len = args.cell.children.length) {
                    cellElement.appendChild(args.cell.children[i]);
                }
            }
        }
        else {
            cellElement.innerHTML = textContent;
            args.cell.innerHTML = '';
        }
    };
    Render.prototype.columnTemplateResult = function (args) {
        this.templateResult = args.template;
    };
    Render.prototype.reactTemplateRender = function (args) {
        var renderReactTemplates = 'renderReactTemplates';
        var portals = 'portals';
        this.parent[portals] = args;
        this.parent.notify('renderReactTemplate', this.parent[portals]);
        this.parent[renderReactTemplates]();
    };
    Render.prototype.destroy = function () {
        this.parent.grid.off('template-result', this.columnTemplateResult);
        this.parent.grid.off('reactTemplateRender', this.reactTemplateRender);
    };
    return Render;
}());
export { Render };
