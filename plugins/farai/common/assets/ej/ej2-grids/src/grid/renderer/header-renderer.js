import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, closest as getClosest, remove, isBlazor } from '@syncfusion/ej2-base';
import { classList } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { RowRenderer } from './row-renderer';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Draggable, Droppable } from '@syncfusion/ej2-base';
import { parentsUntil, wrap, measureColumnDepth, appendChildren, getFrozenTableName } from '../base/util';
/**
 * Content module is used to render grid content
 * @hidden
 */
var HeaderRender = /** @class */ (function () {
    /**
     * Constructor for header renderer module
     */
    function HeaderRender(parent, serviceLocator) {
        var _this = this;
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        this.isFirstCol = false;
        this.isReplaceDragEle = true;
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = _this.draggable.currentStateTarget;
            var parentEle = parentsUntil(target, 'e-headercell');
            if (!(gObj.allowReordering || gObj.allowGrouping) || (!isNullOrUndefined(parentEle)
                && parentEle.querySelectorAll('.e-checkselectall').length > 0)) {
                return false;
            }
            var visualElement = _this.parent.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
            var element = target.classList.contains('e-headercell') ? target : parentEle;
            if (!element || (!gObj.allowReordering && element.classList.contains('e-stackedheadercell'))) {
                return false;
            }
            var height = element.offsetHeight;
            var headercelldiv = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
            var col;
            if (headercelldiv) {
                if (element.querySelector('.e-stackedheadercelldiv')) {
                    col = gObj.getStackedHeaderColumnByHeaderText(headercelldiv.innerText.trim(), gObj.columns);
                }
                else {
                    col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
                }
                _this.column = col;
                if (_this.column.lockColumn) {
                    return false;
                }
                visualElement.setAttribute('e-mappinguid', _this.column.uid);
            }
            if (col && !isNullOrUndefined(col.headerTemplate)) {
                if (!isNullOrUndefined(col.headerTemplate)) {
                    var result = void 0;
                    var colIndex = gObj.getColumnIndexByField(col.field);
                    result = col.getHeaderTemplate()(extend({ 'index': colIndex }, col), gObj, 'headerTemplate');
                    appendChildren(visualElement, result);
                }
                else {
                    visualElement.innerHTML = col.headerTemplate;
                }
            }
            else {
                visualElement.innerHTML = headercelldiv ?
                    col.headerText : element.firstElementChild.innerHTML;
            }
            visualElement.style.width = element.offsetWidth + 'px';
            visualElement.style.height = element.offsetHeight + 'px';
            visualElement.style.lineHeight = (height - 6).toString() + 'px';
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            gObj.notify(events.columnDragStart, { target: _this.draggable.currentStateTarget, column: _this.column, event: e.event });
            if (isBlazor()) {
                e.bindEvents(e.dragElement);
            }
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var target = e.target;
            if (target) {
                var closest = getClosest(target, '.e-grid');
                var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    if (gObj.allowReordering) {
                        gObj.element.querySelector('.e-reorderuparrow').style.display = 'none';
                        gObj.element.querySelector('.e-reorderdownarrow').style.display = 'none';
                    }
                    if (!gObj.groupSettings.allowReordering) {
                        return;
                    }
                }
                gObj.notify(events.columnDrag, { target: e.target, column: _this.column, event: e.event });
            }
        };
        this.dragStop = function (e) {
            var gObj = _this.parent;
            var cancel;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
                (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
                (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
                remove(e.helper);
                cancel = true;
            }
            gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: _this.column, cancel: cancel });
        };
        this.drop = function (e) {
            var gObj = _this.parent;
            var uid = e.droppedElement.getAttribute('e-mappinguid');
            var closest = getClosest(e.target, '.e-grid');
            remove(e.droppedElement);
            if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
                !(gObj.allowReordering || gObj.allowGrouping)) {
                return;
            }
            gObj.notify(events.headerDrop, { target: e.target, uid: uid, droppedElement: e.droppedElement });
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.widthService = this.serviceLocator.getService('widthService');
        if (this.parent.isDestroyed) {
            return;
        }
        if (!this.parent.enableColumnVirtualization
            && !this.parent.getFrozenLeftColumnsCount() && !this.parent.getFrozenRightColumnsCount()) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.columnPositionChanged, this.colPosRefresh, this);
    }
    /**
     * The function is used to render grid header div
     */
    HeaderRender.prototype.renderPanel = function () {
        var div = this.parent.element.querySelector('.e-gridheader');
        var isRendered = (div != null);
        div = isRendered ? div : this.parent.createElement('div', { className: 'e-gridheader' });
        var innerDiv = isRendered ? div.querySelector('.e-headercontent') :
            this.parent.createElement('div', { className: 'e-headercontent' });
        this.toggleStackClass(div);
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (!isRendered) {
            this.parent.element.appendChild(div);
        }
    };
    /**
     * The function is used to render grid header table
     */
    HeaderRender.prototype.renderTable = function () {
        var headerDiv = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        if (!this.parent.getFrozenColumns() && !this.parent.getFrozenRightColumnsCount() && !this.parent.getFrozenLeftColumnsCount()) {
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
        }
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: this.parent.isFrozenGrid() } });
    };
    /**
     * Get the header content div element of grid
     * @return {Element}
     */
    HeaderRender.prototype.getPanel = function () {
        return this.headerPanel;
    };
    /**
     * Set the header content div element of grid
     * @param  {Element} panel
     */
    HeaderRender.prototype.setPanel = function (panel) {
        this.headerPanel = panel;
    };
    /**
     * Get the header table element of grid
     * @return {Element}
     */
    HeaderRender.prototype.getTable = function () {
        return this.headerTable;
    };
    /**
     * Set the header table element of grid
     * @param  {Element} table
     */
    HeaderRender.prototype.setTable = function (table) {
        this.headerTable = table;
    };
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    HeaderRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    HeaderRender.prototype.setColGroup = function (colGroup) {
        return this.colgroup = colGroup;
    };
    /**
     * Get the header row element collection.
     * @return {Element[]}
     */
    HeaderRender.prototype.getRows = function () {
        var table = this.getTable();
        return table.tHead.rows;
    };
    /**
     * The function is used to create header table elements
     * @return {Element}
     * @hidden
     */
    HeaderRender.prototype.createHeaderTable = function () {
        var skipDom = isBlazor() && this.parent.frozenRows !== 0;
        var table = this.createTable();
        var innerDiv = this.getPanel().querySelector('.e-headercontent');
        if (!skipDom) {
            innerDiv.appendChild(table);
        }
        return innerDiv;
    };
    /**
     * @hidden
     */
    HeaderRender.prototype.createTable = function (tableEle) {
        if (tableEle === void 0) { tableEle = null; }
        var skipDom = isBlazor() && this.parent.frozenRows !== 0;
        var gObj = this.parent;
        var isFrozen = gObj.isFrozenGrid();
        if (!(isBlazor() && !gObj.isJsComponent) && this.getTable() && !isFrozen) {
            remove(this.getTable());
        }
        var columns = gObj.getColumns();
        var innerDiv = this.getPanel().querySelector('.e-headercontent');
        var table = skipDom ? tableEle || innerDiv.querySelector('.e-table') :
            this.parent.createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        var findHeaderRow = this.createHeaderContent();
        var thead = findHeaderRow.thead;
        var tbody = this.parent.createElement('tbody', { className: this.parent.frozenRows ? '' : 'e-hide' });
        this.caption = this.parent.createElement('caption', { innerHTML: this.parent.element.id + '_header_table', className: 'e-hide' });
        var colGroup = this.parent.createElement('colgroup');
        var rowBody = this.parent.createElement('tr');
        var bodyCell;
        var rows = this.rows = findHeaderRow.rows;
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header, this.parent);
        for (var i = 0, len = rows.length; i < len; i++) {
            for (var j = 0, len_1 = rows[i].cells.length; j < len_1; j++) {
                var cell = rows[i].cells[j];
                bodyCell = this.parent.createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        if (!skipDom) {
            tbody.appendChild(rowBody);
        }
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        if (!skipDom) {
            table.appendChild(tbody);
        }
        table.appendChild(this.caption);
        this.ariaService.setOptions(table, { colcount: gObj.getColumns().length.toString() });
        return table;
    };
    HeaderRender.prototype.createHeaderContent = function () {
        var gObj = this.parent;
        var frozenMode = gObj.getFrozenMode();
        var columns = gObj.getColumns();
        var thead = this.parent.createElement('thead');
        var colHeader = this.parent.createElement('tr', { className: 'e-columnheader' });
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header, gObj);
        rowRenderer.element = colHeader;
        var rows = [];
        var headerRow;
        this.colDepth = measureColumnDepth(gObj.columns);
        for (var i = 0, len = this.colDepth; i < len; i++) {
            rows[i] = this.generateRow(i);
            rows[i].cells = [];
        }
        if (frozenMode !== 'Right') {
            rows = this.ensureColumns(rows);
        }
        rows = this.getHeaderCells(rows);
        if (frozenMode === 'Right') {
            rows = this.ensureColumns(rows);
        }
        var frzCols = this.parent.getFrozenColumns();
        if (this.parent.isRowDragable() && this.parent.isFrozenGrid() && rows[0].cells[1]) {
            var colFreezeMode = rows[0].cells[1].column.getFreezeTableName();
            if (colFreezeMode === 'movable' || (frozenMode === 'Left-Right' && colFreezeMode === 'frozen-right')) {
                if (frozenMode === 'Right') {
                    rows[0].cells.pop();
                }
                else {
                    rows[0].cells.shift();
                }
            }
            else if (!frzCols && colFreezeMode === 'frozen-left') {
                rows[0].cells[0].column.freeze = colFreezeMode === 'frozen-left' ? 'Left' : 'Right';
            }
            else if (frozenMode === 'Right' && colFreezeMode === 'frozen-right') {
                rows[0].cells[rows[0].cells.length - 1].column.freeze = 'Right';
            }
        }
        for (var i = 0, len = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[i], columns);
            if (this.parent.rowHeight && headerRow.querySelector('.e-headercell')) {
                headerRow.style.height = this.parent.rowHeight + 'px';
            }
            thead.appendChild(headerRow);
        }
        var findHeaderRow = {
            thead: thead,
            rows: rows
        };
        return findHeaderRow;
    };
    HeaderRender.prototype.updateColGroup = function (colGroup) {
        var cols = this.parent.getColumns();
        var col;
        var indexes = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
            && this.parent.contentModule.isXaxis()) {
            cols = extend([], this.parent.getColumns());
            cols.splice(0, this.parent.getFrozenColumns());
        }
        colGroup.id = this.parent.element.id + 'colGroup';
        if (this.parent.allowGrouping) {
            for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) {
                    continue;
                }
                col = this.parent.createElement('col', { className: 'e-group-intent' });
                colGroup.appendChild(col);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            col = this.parent.createElement('col', { className: 'e-detail-intent' });
            colGroup.appendChild(col);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            col = this.parent.createElement('col');
            if (cols[i].visible === false) {
                setStyleAttribute(col, { 'display': 'none' });
            }
            colGroup.appendChild(col);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        return colGroup;
    };
    HeaderRender.prototype.ensureColumns = function (rows) {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        var gObj = this.parent;
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (gObj.allowGrouping) {
                for (var c = 0, len_2 = gObj.groupSettings.columns.length; c < len_2; c++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(c) === -1) {
                        continue;
                    }
                    rows[i].cells.push(this.generateCell({}, CellType.HeaderIndent));
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                var args = {};
                this.parent.notify(events.detailIndentCellInfo, args);
                rows[i].cells.push(this.generateCell(args, CellType.DetailHeader));
            }
            if (gObj.isRowDragable()) {
                rows[i].cells.push(this.generateCell({}, CellType.RowDragHIcon));
            }
        }
        return rows;
    };
    HeaderRender.prototype.getHeaderCells = function (rows) {
        var column;
        var thead = this.parent.getHeaderTable() && this.parent.getHeaderTable().querySelector('thead');
        var cols = this.parent.enableColumnVirtualization ?
            this.parent.getColumns(this.parent.enablePersistence) : this.parent.columns;
        var tableName;
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()
            && this.parent.contentModule.isXaxis()) {
            tableName = 'movable';
        }
        else {
            tableName = getFrozenTableName(this.parent);
        }
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        if (this.parent.lockcolPositionCount) {
            for (var i = 0; i < cols.length; i++) {
                this.lockColsRendered = false;
                rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (cols.length - 1), thead, tableName);
            }
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            this.notfrzIdx = 0;
            this.lockColsRendered = true;
            rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (len - 1), thead, tableName);
        }
        return rows;
    };
    HeaderRender.prototype.appendCells = function (cols, rows, index, isFirstObj, isFirstCol, isLastCol, isMovable, tableName) {
        var lastCol = isLastCol ? 'e-lastcell' : '';
        var isFrozen = this.parent.isFrozenGrid();
        var isLockColumn = !this.parent.lockcolPositionCount
            || (cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered);
        var isFrozenLockColumn = !this.parent.lockcolPositionCount || (cols.lockColumn && !this.lockColsRendered)
            || (!cols.lockColumn && this.lockColsRendered);
        var scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        var left;
        if (isFrozen && scrollbar && this.parent.enableColumnVirtualization) {
            left = scrollbar.scrollLeft;
        }
        if (!cols.columns) {
            if (left && left > 0 && this.parent.contentModule.isXaxis()
                && this.parent.inViewIndexes[0] !== 0 && cols.getFreezeTableName() === 'movable') {
                rows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
            }
            else {
                if ((!isFrozen && isLockColumn) || (isFrozen && cols.getFreezeTableName() === tableName && isFrozenLockColumn)) {
                    rows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
                }
            }
            if (this.parent.lockcolPositionCount) {
                if ((this.frzIdx + this.notfrzIdx < this.parent.frozenColumns) &&
                    ((cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered))) {
                    this.frzIdx++;
                }
                else {
                    this.notfrzIdx++;
                }
            }
            else {
                this.frzIdx++;
            }
        }
        else {
            this.isFirstCol = false;
            var colSpan = this.getCellCnt(cols, 0);
            if (colSpan) {
                var stackedLockColsCount = this.getStackedLockColsCount(cols, 0);
                var isStackedLockColumn = this.parent.lockcolPositionCount === 0
                    || (!this.lockColsRendered && stackedLockColsCount !== 0)
                    || (this.lockColsRendered && (colSpan - stackedLockColsCount) !== 0);
                var isFrozenStack = isFrozen && this.ensureStackedFrozen(cols.columns, tableName, false);
                if ((!isFrozen && isStackedLockColumn) || isFrozenStack) {
                    rows[index].cells.push(new Cell({
                        cellType: CellType.StackedHeader, column: cols,
                        colSpan: this.getColSpan(colSpan, stackedLockColsCount, cols.columns, tableName, isFrozen)
                    }));
                }
            }
            if (this.parent.lockcolPositionCount && !this.lockColsRendered) {
                for (var i = 0; i < cols.columns.length; i++) {
                    rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, i === 0, i === (cols.columns.length - 1) && isLastCol, isMovable, tableName);
                }
            }
            if (this.lockColsRendered) {
                for (var i = 0, len = cols.columns.length; i < len; i++) {
                    var isFirstCol_1 = this.isFirstCol = cols.columns[i].visible && !this.isFirstCol && len !== 1;
                    var isLaststackedCol = i === (len - 1);
                    rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, isFirstCol_1, isLaststackedCol && isLastCol, isMovable, tableName);
                }
            }
        }
        return rows;
    };
    HeaderRender.prototype.ensureStackedFrozen = function (columns, tableName, isTrue) {
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            if (columns[i].columns) {
                isTrue = this.ensureStackedFrozen(columns[i].columns, tableName, isTrue);
            }
            else if (columns[i].getFreezeTableName() === tableName) {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    };
    HeaderRender.prototype.getStackedLockColsCount = function (col, lockColsCount) {
        if (col.columns) {
            for (var i = 0; i < col.columns.length; i++) {
                lockColsCount = this.getStackedLockColsCount(col.columns[i], lockColsCount);
            }
        }
        else if (col.lockColumn) {
            lockColsCount++;
        }
        return lockColsCount;
    };
    HeaderRender.prototype.getColSpan = function (colSpan, stackedLockColsCount, columns, tableName, isFrozen) {
        if (isFrozen) {
            colSpan = this.getFrozenColSpan(columns, tableName, 0);
        }
        else if (this.parent.lockcolPositionCount) {
            colSpan = !this.lockColsRendered ? stackedLockColsCount : colSpan - stackedLockColsCount;
        }
        return colSpan;
    };
    HeaderRender.prototype.getFrozenColSpan = function (columns, tableName, count) {
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            if (columns[i].columns) {
                count = this.getFrozenColSpan(columns[i].columns, tableName, count);
            }
            else if (columns[i].getFreezeTableName() === tableName) {
                count++;
            }
        }
        return count;
    };
    HeaderRender.prototype.generateRow = function (index) {
        return new Row({});
    };
    HeaderRender.prototype.generateCell = function (column, cellType, rowSpan, className, rowIndex, colIndex) {
        var opt = {
            'visible': column.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(column.headerTemplate),
            'rowID': '',
            'column': column,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': colIndex
        };
        if (!opt.rowSpan || opt.rowSpan < 2) {
            delete opt.rowSpan;
        }
        return new Cell(opt);
    };
    /**
     * Function to hide header table column based on visible property
     * @param  {Column[]} columns?
     */
    HeaderRender.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var rows = [].slice.call(this.getRows()); //NodeList -> Array        
        var displayVal;
        var idx;
        var className;
        var element;
        var frzCols = gObj.getFrozenColumns();
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            if (frzCols) {
                var normalizedfrzCols = this.parent.isRowDragable() ? frzCols + 1 : frzCols;
                if (idx < normalizedfrzCols) {
                    if (isBlazor() && gObj.isServerRendered) {
                        setStyleAttribute(this.getTable().querySelector('colgroup').children[idx], { 'display': displayVal });
                        setStyleAttribute(this.getTable().querySelectorAll('th')[idx], { 'display': displayVal });
                    }
                    else {
                        setStyleAttribute(this.getColGroup().children[idx], { 'display': displayVal });
                    }
                }
                else {
                    var mTblColGrp = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup');
                    var mTbl = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('table');
                    setStyleAttribute(mTblColGrp.children[idx - normalizedfrzCols], { 'display': displayVal });
                    if (isBlazor() && gObj.isServerRendered) {
                        setStyleAttribute(mTbl.querySelectorAll('th')[idx - frzCols], { 'display': displayVal });
                    }
                }
            }
            else {
                setStyleAttribute(this.getColGroup().children[idx], { 'display': displayVal });
            }
        }
        this.refreshUI();
    };
    HeaderRender.prototype.colPosRefresh = function () {
        if (isBlazor() && this.parent.isServerRendered && this.parent.frozenRows && this.parent.getFrozenColumns()) {
            this.freezeReorder = true;
        }
        this.refreshUI();
    };
    /**
     * Refresh the header of the Grid.
     * @returns {void}
     */
    HeaderRender.prototype.refreshUI = function () {
        var frzCols = this.parent.isFrozenGrid();
        var isVFTable = this.parent.enableColumnVirtualization && frzCols;
        var setFrozenTable = isBlazor() && this.parent.isServerRendered && this.parent.frozenRows !== 0 && frzCols;
        var headerDiv = this.getPanel();
        this.toggleStackClass(headerDiv);
        var table = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table')
            : this.getTable();
        if (isVFTable) {
            table = this.parent.contentModule.getVirtualFreezeHeader();
        }
        if (setFrozenTable && !isVFTable) {
            table = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table') :
                this.headerPanel.querySelector('.e-frozenheader').querySelector('.e-table');
        }
        if (table) {
            if (isBlazor() && this.parent.isServerRendered) {
                table.removeChild(table.querySelector('colgroup'));
                table.removeChild(table.querySelector('thead'));
            }
            else {
                remove(table);
                table.removeChild(table.firstChild);
                table.removeChild(table.childNodes[0]);
            }
            var colGroup = this.parent.createElement('colgroup');
            var findHeaderRow = this.createHeaderContent();
            this.rows = findHeaderRow.rows;
            table.insertBefore(findHeaderRow.thead, table.firstChild);
            this.updateColGroup(colGroup);
            table.insertBefore(this.setColGroup(colGroup), table.firstChild);
            if (!isVFTable && !setFrozenTable) {
                this.setTable(table);
            }
            if (!(isBlazor() && this.parent.isServerRendered)) {
                this.appendContent(table);
            }
            this.parent.notify(events.colGroupRefresh, {});
            this.widthService.setWidthToColumns();
            this.parent.updateDefaultCursor();
            if (!frzCols || (this.parent.enableColumnVirtualization && frzCols)) {
                this.initializeHeaderDrag();
            }
            var rows = [].slice.call(headerDiv.querySelectorAll('tr.e-columnheader'));
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var gCells = [].slice.call(row.querySelectorAll('.e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
            }
            if (!frzCols) {
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: frzCols } });
            }
            if (this.parent.enableColumnVirtualization && parentsUntil(table, 'e-movableheader')) {
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false, isXaxis: true } });
            }
            if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
                wrap(rows, true);
            }
        }
    };
    HeaderRender.prototype.toggleStackClass = function (div) {
        var column = this.parent.columns;
        var stackedHdr = column.some(function (column) { return !isNullOrUndefined(column.columns); });
        if (stackedHdr) {
            div.classList.add('e-stackedheader');
        }
        else {
            div.classList.remove('e-stackedheader');
        }
    };
    HeaderRender.prototype.appendContent = function (table) {
        this.getPanel().querySelector('.e-headercontent').appendChild(table);
    };
    HeaderRender.prototype.getCellCnt = function (col, cnt) {
        if (col.columns) {
            for (var i = 0, len = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[i], cnt);
            }
        }
        else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    };
    HeaderRender.prototype.initializeHeaderDrag = function () {
        var gObj = this.parent;
        if (!(this.parent.allowReordering || (this.parent.allowGrouping && this.parent.groupSettings.showDropArea))) {
            return;
        }
        this.draggable = new Draggable(gObj.getHeaderContent(), {
            dragTarget: '.e-headercell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop,
            abort: '.e-rhandler',
            isReplaceDragEle: this.isReplaceDragEle
        });
    };
    HeaderRender.prototype.initializeHeaderDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(gObj.getHeaderContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    return HeaderRender;
}());
export { HeaderRender };
