import { Grid, Toolbar as tool } from '@syncfusion/ej2-grids';
import * as events from '../base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Toolbar Module for TreeGrid
 * @hidden
 */
var Toolbar = /** @class */ (function () {
    function Toolbar(parent) {
        Grid.Inject(tool);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Toolbar.prototype.getModuleName = function () {
        return 'toolbar';
    };
    /**
     * @hidden
     */
    Toolbar.prototype.addEventListener = function () {
        this.parent.on(events.rowSelected, this.refreshToolbar, this);
        this.parent.on(events.toolbarClick, this.toolbarClickHandler, this);
    };
    /**
     * @hidden
     */
    Toolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.rowSelected, this.refreshToolbar);
        this.parent.off(events.toolbarClick, this.toolbarClickHandler);
    };
    Toolbar.prototype.refreshToolbar = function (args) {
        var tObj = this.parent;
        var isParent;
        if (args.row.rowIndex === 0 || tObj.getSelectedRecords().length > 1) {
            this.enableItems([tObj.element.id + '_gridcontrol_indent', tObj.element.id + '_gridcontrol_outdent'], false);
        }
        else {
            if (!isNullOrUndefined(tObj.getCurrentViewRecords()[args.row.rowIndex])) {
                if (!isNullOrUndefined(tObj.getCurrentViewRecords()[args.row.rowIndex]) &&
                    (tObj.getCurrentViewRecords()[args.row.rowIndex].level >
                        tObj.getCurrentViewRecords()[args.row.rowIndex - 1].level)) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], false);
                }
                else {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level ===
                    tObj.getCurrentViewRecords()[args.row.rowIndex - 1].level) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level === 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], false);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level !== 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
                }
            }
        }
        if (args.row.rowIndex === 0 && !isNullOrUndefined(args.data.parentItem)) {
            this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
        }
    };
    Toolbar.prototype.toolbarClickHandler = function (args) {
        var tObj = this.parent;
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.editSettings.mode === 'Batch' &&
            args.item.id === this.parent.grid.element.id + '_update') {
            args.cancel = true;
            this.parent.grid.editModule.saveCell();
        }
        if (args.item.id === this.parent.grid.element.id + '_expandall') {
            this.parent.expandAll();
        }
        if (args.item.id === this.parent.grid.element.id + '_collapseall') {
            this.parent.collapseAll();
        }
        if (args.item.id === tObj.grid.element.id + '_indent' && tObj.getSelectedRecords().length) {
            var record = tObj.getCurrentViewRecords()[tObj.getSelectedRowIndexes()[0] - 1];
            var dropIndex = void 0;
            if (record.level > tObj.getSelectedRecords()[0].level) {
                for (var i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                    if (tObj.getCurrentViewRecords()[i].taskData === record.parentItem.taskData) {
                        dropIndex = i;
                    }
                }
            }
            else {
                dropIndex = tObj.getSelectedRowIndexes()[0] - 1;
            }
            tObj.reorderRows([tObj.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
        if (args.item.id === tObj.grid.element.id + '_outdent' && tObj.getSelectedRecords().length) {
            var index = tObj.getSelectedRowIndexes()[0];
            var dropIndex = void 0;
            var parentItem = tObj.getSelectedRecords()[0].parentItem;
            for (var i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                if (tObj.getCurrentViewRecords()[i].taskData === parentItem.taskData) {
                    dropIndex = i;
                }
            }
            tObj.reorderRows([index], dropIndex, 'below');
        }
    };
    /**
     * Gets the toolbar of the TreeGrid.
     * @return {Element}
     * @hidden
     */
    Toolbar.prototype.getToolbar = function () {
        return this.parent.grid.toolbarModule.getToolbar();
    };
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    Toolbar.prototype.enableItems = function (items, isEnable) {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    Toolbar.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Toolbar;
}());
export { Toolbar };
