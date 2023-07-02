import { TreeGrid, VirtualScroll as TreeGridVirtualScroll } from '@syncfusion/ej2-treegrid';
/**
 * Gantt Virtual Scroll module will handle Virtualization
 * @hidden
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent) {
        this.parent = parent;
        this.bindTreeGridProperties();
    }
    /**
     * Get module name
     */
    VirtualScroll.prototype.getModuleName = function () {
        return 'virtualScroll';
    };
    /**
     * Bind virtual-scroll related properties from Gantt to TreeGrid
     */
    VirtualScroll.prototype.bindTreeGridProperties = function () {
        this.parent.treeGrid.enableVirtualization = this.parent.enableVirtualization;
        TreeGrid.Inject(TreeGridVirtualScroll);
    };
    /**
     * @private
     */
    VirtualScroll.prototype.getTopPosition = function () {
        var virtualTable = this.parent.ganttChartModule.scrollElement.querySelector('.e-virtualtable');
        var top = virtualTable.style.transform.split(',')[1].trim().split(')')[0];
        return parseFloat(top);
    };
    /**
     * To destroy the virtual scroll module.
     * @return {void}
     * @private
     */
    VirtualScroll.prototype.destroy = function () {
        // destroy module
    };
    return VirtualScroll;
}());
export { VirtualScroll };
