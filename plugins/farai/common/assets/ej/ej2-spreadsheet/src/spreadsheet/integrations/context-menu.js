import { ContextMenu as ContextMenuComponent } from '@syncfusion/ej2-navigations';
import { closest, extend, detach } from '@syncfusion/ej2-base';
import { removeSheetTab, cMenuBeforeOpen, renameSheetTab, cut, copy, paste } from '../common/index';
import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems, initiateCustomSort, hideSheet } from '../common/index';
import { openHyperlink, initiateHyperlink, editHyperlink, hideShow, applyProtect } from '../common/index';
import { filterByCellValue, reapplyFilter, clearFilter, getFilteredColumn, applySort, locale } from '../common/index';
import { getRangeIndexes, getColumnHeaderText, getCellIndexes, insertModel } from '../../workbook/common/index';
import { getSwapRange } from '../../workbook/index';
/**
 * Represents context menu for Spreadsheet.
 */
var ContextMenu = /** @class */ (function () {
    /**
     * Constructor for ContextMenu module.
     */
    function ContextMenu(parent) {
        this.parent = parent;
        this.init();
    }
    ContextMenu.prototype.init = function () {
        this.initContextMenu();
        this.addEventListener();
    };
    ContextMenu.prototype.initContextMenu = function () {
        var ul = document.createElement('ul');
        ul.id = this.parent.element.id + '_contextmenu';
        this.parent.element.appendChild(ul);
        this.contextMenuInstance = new ContextMenuComponent({
            cssClass: 'e-spreadsheet-contextmenu',
            target: '#' + this.parent.element.id,
            filter: 'e-numericcontainer e-active-cell e-selection e-row e-header-row e-select-all-cell e-sheet-tabs-items',
            select: this.selectHandler.bind(this),
            beforeOpen: this.beforeOpenHandler.bind(this),
            beforeClose: this.beforeCloseHandler.bind(this)
        }, ul);
    };
    /**
     * Before close event handler.
     */
    ContextMenu.prototype.beforeCloseHandler = function (args) {
        this.parent.trigger('contextMenuBeforeClose', args);
    };
    /**
     * Select event handler.
     */
    // tslint:disable-next-line
    ContextMenu.prototype.selectHandler = function (args) {
        var selectArgs = extend({ cancel: false }, args);
        this.parent.trigger('contextMenuItemSelect', selectArgs);
        var id = this.parent.element.id + '_cmenu';
        if (!selectArgs.cancel) {
            var l10n = this.parent.serviceLocator.getService(locale);
            var indexes = void 0;
            switch (args.item.id) {
                case id + '_cut':
                    this.parent.notify(cut, { isAction: true, promise: Promise });
                    break;
                case id + '_copy':
                    this.parent.notify(copy, { isAction: true, promise: Promise });
                    break;
                case id + '_paste':
                    this.parent.notify(paste, { isAction: true, isInternal: true });
                    break;
                case id + '_pastevalues':
                    this.parent.notify(paste, { type: 'Values', isAction: true, isInternal: true });
                    break;
                case id + '_pasteformats':
                    this.parent.notify(paste, { type: 'Formats', isAction: true, isInternal: true });
                    break;
                case id + '_rename':
                    this.parent.notify(renameSheetTab, {});
                    break;
                case id + '_delete_sheet':
                    this.parent.notify(removeSheetTab, {});
                    break;
                case id + '_insert_sheet':
                    this.parent.notify(insertModel, { model: this.parent, start: this.parent.activeSheetIndex,
                        end: this.parent.activeSheetIndex, modelType: 'Sheet', isAction: true });
                    break;
                case id + '_hide_sheet':
                    this.parent.notify(hideSheet, null);
                    break;
                case id + '_ascending':
                    this.parent.notify(applySort, null);
                    break;
                case id + '_descending':
                    this.parent.notify(applySort, { sortOptions: { sortDescriptors: { order: 'Descending' } } });
                    break;
                case id + '_customsort':
                    this.parent.notify(initiateCustomSort, null);
                    break;
                case id + '_filtercellvalue':
                    this.parent.notify(filterByCellValue, null);
                    break;
                case id + '_clearfilter':
                    var field = getColumnHeaderText(getCellIndexes(this.parent.getActiveSheet().activeCell)[1] + 1);
                    this.parent.notify(clearFilter, { field: field });
                    break;
                case id + '_reapplyfilter':
                    this.parent.notify(reapplyFilter, null);
                    break;
                case id + '_hide_row':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(hideShow, {
                        startIndex: indexes[0], endIndex: indexes[2], hide: true, isCol: false, actionUpdate: true
                    });
                    this.parent.element.focus();
                    break;
                case id + '_unhide_row':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(hideShow, {
                        startIndex: indexes[0], endIndex: indexes[2], hide: false, isCol: false, actionUpdate: true
                    });
                    this.parent.element.focus();
                    break;
                case id + '_hide_column':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(hideShow, {
                        startIndex: indexes[1], endIndex: indexes[3], hide: true, isCol: true, actionUpdate: true
                    });
                    this.parent.element.focus();
                    break;
                case id + '_unhide_column':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(hideShow, {
                        startIndex: indexes[1], endIndex: indexes[3], hide: false, isCol: true, actionUpdate: true
                    });
                    this.parent.element.focus();
                    break;
                case id + '_insert_row_above':
                case id + '_delete_row':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(args.item.id.substr(id.length + 1, 6) + "Model", { model: this.parent.getActiveSheet(), start: indexes[0], end: indexes[2], modelType: 'Row', isAction: true,
                        insertType: 'above' });
                    this.parent.element.focus();
                    break;
                case id + '_insert_row_below':
                    indexes = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
                    this.parent.notify(insertModel, { model: this.parent.getActiveSheet(), start: indexes[2] + 1, end: indexes[2] + 1 + (indexes[2] - indexes[0]), modelType: 'Row', isAction: true,
                        insertType: 'below' });
                    this.parent.element.focus();
                    break;
                case id + '_insert_column_before':
                case id + '_delete_column':
                    indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                    this.parent.notify(args.item.id.substr(id.length + 1, 6) + "Model", { model: this.parent.getActiveSheet(), start: indexes[1], end: indexes[3], modelType: 'Column', isAction: true });
                    this.parent.element.focus();
                    break;
                case id + '_insert_column_after':
                    indexes = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
                    this.parent.notify(insertModel, { model: this.parent.getActiveSheet(), start: indexes[3] + 1, end: indexes[3] + 1 + (indexes[3] - indexes[1]), modelType: 'Column', isAction: true });
                    this.parent.element.focus();
                    break;
                case id + '_hyperlink':
                    this.parent.notify(initiateHyperlink, null);
                    break;
                case id + '_editHyperlink':
                    this.parent.notify(editHyperlink, null);
                    break;
                case id + '_openHyperlink':
                    this.parent.notify(openHyperlink, null);
                    break;
                case id + '_removeHyperlink':
                    this.parent.removeHyperlink(this.parent.getActiveSheet().selectedRange);
                    break;
                case id + '_protect':
                    var sheet = this.parent.getActiveSheet();
                    this.parent.setSheetPropertyOnMute(sheet, 'isProtected', !sheet.isProtected);
                    var isActive = void 0;
                    sheet.isProtected ? isActive = false : isActive = true;
                    this.parent.notify(applyProtect, { isActive: isActive });
                    break;
            }
        }
    };
    ContextMenu.prototype.getInsertModel = function (startIndex, endIndex) {
        var model = [];
        for (var i = startIndex; i <= endIndex; i++) {
            if (i === startIndex) {
                model.push({ index: i });
            }
            else {
                model.push({});
            }
        }
        return model;
    };
    /**
     * Before open event handler.
     */
    ContextMenu.prototype.beforeOpenHandler = function (args) {
        var target = this.getTarget(args.event.target);
        var items;
        if (args.element.classList.contains('e-contextmenu')) {
            items = this.getDataSource(target);
            this.contextMenuInstance.items = items;
            this.contextMenuInstance.dataBind();
        }
        else {
            items = args.items;
        }
        this.parent.trigger('contextMenuBeforeOpen', args);
        this.parent.notify(cMenuBeforeOpen, extend(args, { target: target, items: items }));
    };
    /**
     * To get target area based on right click.
     */
    ContextMenu.prototype.getTarget = function (target) {
        if (closest(target, '.e-sheet-content')) {
            return 'Content';
        }
        else if (closest(target, '.e-column-header')) {
            return 'ColumnHeader';
        }
        else if (closest(target, '.e-row-header')) {
            return 'RowHeader';
        }
        else if (closest(target, '.e-sheet-tabs-items')) {
            return 'Footer';
        }
        else if (closest(target, '.e-selectall-container')) {
            return 'SelectAll';
        }
        else {
            return '';
        }
    };
    /**
     * To populate context menu items based on target area.
     */
    ContextMenu.prototype.getDataSource = function (target) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var items = [];
        var id = this.parent.element.id + '_cmenu';
        if (target === 'Content') {
            this.setClipboardData(items, l10n, id);
            items.push({ separator: true });
            //push filter and sort items here
            this.setFilterItems(items, id);
            this.setSortItems(items, id);
            items.push({ separator: true });
            this.setHyperLink(items, id);
        }
        else if (target === 'RowHeader') {
            this.setClipboardData(items, l10n, id);
            var indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            this.setInsertDeleteItems(items, l10n, 'Row', id, [indexes[0], indexes[2]], ['Above', 'Below']);
            this.setHideShowItems(items, l10n, 'Row', id, [indexes[0], indexes[2]]);
        }
        else if (target === 'ColumnHeader') {
            this.setClipboardData(items, l10n, id);
            var indexes = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            this.setInsertDeleteItems(items, l10n, 'Column', id, [indexes[1], indexes[3]], ['Before', 'After']);
            this.setHideShowItems(items, l10n, 'Column', id, [indexes[1], indexes[3]]);
        }
        else if (target === 'SelectAll') {
            this.setClipboardData(items, l10n, id);
            this.setFilterItems(items, id);
            this.setSortItems(items, id);
        }
        else if (target === 'Footer') {
            items.push({
                text: l10n.getConstant('Insert'), id: id + '_insert_sheet'
            });
            items.push({
                text: l10n.getConstant('Delete'), iconCss: 'e-icons e-delete', id: id + '_delete_sheet'
            });
            items.push({
                text: l10n.getConstant('Rename'), id: id + '_rename'
            });
            items.push({
                text: l10n.getConstant('Hide'), id: id + '_hide_sheet'
            });
            this.setProtectSheetItems(items, id);
        }
        return items;
    };
    ContextMenu.prototype.setProtectSheetItems = function (items, id) {
        var l10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.getActiveSheet().isProtected) {
            items.push({
                text: l10n.getConstant('UnprotectSheet'), id: id + '_protect', iconCss: 'e-icons e-protect-icon',
            });
        }
        else {
            items.push({
                text: l10n.getConstant('ProtectSheet'), id: id + '_protect', iconCss: 'e-icons e-protect-icon',
            });
        }
    };
    /**
     * Sets sorting related items to the context menu.
     */
    ContextMenu.prototype.setFilterItems = function (items, id) {
        if (this.parent.allowFiltering) {
            var l10n = this.parent.serviceLocator.getService(locale);
            var args = { clearFilterText: null, isFiltered: false };
            this.parent.notify(getFilteredColumn, args);
            items.push({
                text: l10n.getConstant('Filter'), id: id + '_filter',
                iconCss: '',
                items: [
                    { text: args.clearFilterText, iconCss: 'e-icons e-filter-clear', id: id + '_clearfilter' },
                    { text: l10n.getConstant('ReapplyFilter'), iconCss: 'e-icons e-filter-reapply', id: id + '_reapplyfilter' },
                    { separator: true },
                    { text: l10n.getConstant('FilterCellValue'), iconCss: '', id: id + '_filtercellvalue' }
                ]
            });
        }
    };
    /**
     * Sets sorting related items to the context menu.
     */
    ContextMenu.prototype.setSortItems = function (items, id) {
        var l10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.allowSorting) {
            items.push({
                text: l10n.getConstant('Sort'), id: id + '_sort',
                iconCss: 'e-icons e-sort-icon',
                items: [
                    { text: l10n.getConstant('SortAscending'), iconCss: 'e-icons e-sort-asc', id: id + '_ascending' },
                    { text: l10n.getConstant('SortDescending'), iconCss: 'e-icons e-sort-desc', id: id + '_descending' },
                    { text: l10n.getConstant('CustomSort') + '...', iconCss: 'e-icons e-sort-custom', id: id + '_customsort' }
                ]
            });
        }
    };
    ContextMenu.prototype.setHyperLink = function (items, id) {
        var sheet = this.parent.getActiveSheet();
        if (this.parent.allowHyperlink) {
            var l10n = this.parent.serviceLocator.getService(locale);
            if ((!document.activeElement.getElementsByClassName('e-hyperlink')[0] &&
                !document.activeElement.classList.contains('e-hyperlink')) || (sheet.isProtected && !sheet.protectSettings.insertLink)) {
                items.push({
                    text: l10n.getConstant('Hyperlink'), iconCss: 'e-icons e-hyperlink-icon', id: id + '_hyperlink'
                });
            }
            else {
                items.push({ text: l10n.getConstant('EditHyperlink'), iconCss: 'e-icons e-edithyperlink-icon', id: id + '_editHyperlink' }, { text: l10n.getConstant('OpenHyperlink'), iconCss: 'e-icons e-openhyperlink-icon', id: id + '_openHyperlink' }, { text: l10n.getConstant('RemoveHyperlink'), iconCss: 'e-icons e-removehyperlink-icon', id: id + '_removeHyperlink' });
            }
        }
    };
    ContextMenu.prototype.setClipboardData = function (items, l10n, id) {
        if (this.parent.enableClipboard) {
            items.push({
                text: l10n.getConstant('Cut'),
                iconCss: 'e-icons e-cut-icon', id: id + '_cut'
            });
            items.push({
                text: l10n.getConstant('Copy'),
                iconCss: 'e-icons e-copy-icon', id: id + '_copy'
            });
            items.push({
                text: l10n.getConstant('Paste'),
                iconCss: 'e-icons e-paste-icon', id: id + '_paste'
            });
            items.push({
                text: l10n.getConstant('PasteSpecial'), id: id + '_pastespecial',
                items: [
                    { text: l10n.getConstant('Values'), id: id + '_pastevalues' },
                    { text: l10n.getConstant('Formats'), id: id + '_pasteformats' }
                ]
            });
        }
    };
    ContextMenu.prototype.setInsertDeleteItems = function (items, l10n, layout, id, indexes, subItems) {
        items.push({ separator: true });
        ['Insert', 'Delete'].forEach(function (action) {
            if (indexes[0] === indexes[1]) {
                items.push({ text: l10n.getConstant("" + action + layout), id: id + ("_" + action.toLowerCase() + "_" + layout.toLowerCase()) });
            }
            else {
                items.push({ text: l10n.getConstant("" + action + layout + "s"), id: id + ("_" + action.toLowerCase() + "_" + layout.toLowerCase()) });
            }
            if (action === 'Insert') {
                items[items.length - 1].items = [];
                subItems.forEach(function (item) {
                    items[items.length - 1].items.push({
                        text: l10n.getConstant(item), id: items[items.length - 1].id + "_" + item.toLowerCase()
                    });
                });
            }
        });
    };
    ContextMenu.prototype.setHideShowItems = function (items, l10n, layout, id, indexes) {
        if (indexes[0] === indexes[1]) {
            items.push({ text: l10n.getConstant("Hide" + layout), id: id + ("_hide_" + layout.toLowerCase()) });
        }
        else {
            items.push({ text: l10n.getConstant("Hide" + layout + "s"), id: id + ("_hide_" + layout.toLowerCase()) });
        }
        if (this.parent.hiddenCount(indexes[0], indexes[1], layout.toLowerCase() + "s")) {
            items.push({ text: l10n.getConstant("UnHide" + layout + "s"), id: id + ("_unhide_" + layout.toLowerCase()) });
        }
    };
    /**
     * To add event listener.
     */
    ContextMenu.prototype.addEventListener = function () {
        this.parent.on(addContextMenuItems, this.addItemsHandler, this);
        this.parent.on(removeContextMenuItems, this.removeItemsHandler, this);
        this.parent.on(enableContextMenuItems, this.enableItemsHandler, this);
    };
    /**
     * To add context menu items before / after particular item.
     */
    ContextMenu.prototype.addItemsHandler = function (args) {
        if (args.insertAfter) {
            this.contextMenuInstance.insertAfter(args.items, args.text, args.isUniqueId);
        }
        else {
            this.contextMenuInstance.insertBefore(args.items, args.text, args.isUniqueId);
        }
    };
    /**
     * To remove context menu items.
     */
    ContextMenu.prototype.removeItemsHandler = function (args) {
        this.contextMenuInstance.removeItems(args.items, args.isUniqueId);
    };
    /**
     * To enable / disable context menu items.
     */
    ContextMenu.prototype.enableItemsHandler = function (args) {
        this.contextMenuInstance.enableItems(args.items, args.enable, args.isUniqueId);
    };
    /**
     * To remove event listener.
     */
    ContextMenu.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(addContextMenuItems, this.addItemsHandler);
            this.parent.off(removeContextMenuItems, this.removeItemsHandler);
            this.parent.off(enableContextMenuItems, this.enableItemsHandler);
        }
    };
    /**
     * To get module name.
     */
    ContextMenu.prototype.getModuleName = function () {
        return 'contextMenu';
    };
    /**
     * Destroy method.
     */
    ContextMenu.prototype.destroy = function () {
        this.removeEventListener();
        this.contextMenuInstance.destroy();
        var ele = document.getElementById(this.parent.element.id + '_contextmenu');
        if (ele) {
            detach(ele);
        }
        this.parent = null;
    };
    return ContextMenu;
}());
export { ContextMenu };
