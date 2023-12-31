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
import { Grid, VirtualScroll as GridVirtualScroll } from '@syncfusion/ej2-grids';
import { RenderType } from '@syncfusion/ej2-grids';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { getExpandStatus } from '../utils';
import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';
/**
 * TreeGrid Virtual Scroll module will handle Virtualization
 * @hidden
 */
var VirtualScroll = /** @class */ (function () {
    /**
     * Constructor for VirtualScroll module
     */
    function VirtualScroll(parent) {
        this.prevstartIndex = -1;
        this.prevendIndex = -1;
        this.parent = parent;
        var name = 'name';
        var injectedModules = 'injectedModules';
        var modules = Grid.prototype[injectedModules];
        for (var i = 0; i < modules.length; i++) {
            if (modules[i] === GridVirtualScroll) {
                modules.splice(i, 1);
                break;
            }
        }
        Grid.Inject(TreeVirtual);
        this.addEventListener();
    }
    VirtualScroll.prototype.returnVisualData = function (args) {
        args.data = this.visualData;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    VirtualScroll.prototype.getModuleName = function () {
        return 'virtualScroll';
    };
    /**
     * @hidden
     */
    VirtualScroll.prototype.addEventListener = function () {
        this.parent.on(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(events.pagingActions, this.virtualPageAction, this);
    };
    /**
     * @hidden
     */
    VirtualScroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(events.pagingActions, this.virtualPageAction);
    };
    VirtualScroll.prototype.collapseExpandVirtualchilds = function (row) {
        this.parent.grid.notify(events.virtualActionArgs, { isExpandCollapse: true });
        this.expandCollapseRec = row.record;
        row.record.expanded = row.action === 'collapse' ? false : true;
        var ret = {
            result: this.parent.flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: this.parent.flatData.length
        };
        this.parent.grid.clearSelection();
        var requestType = getValue('isCollapseAll', this.parent) ? 'collapseAll' : 'refresh';
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret, { requestType: requestType });
    };
    VirtualScroll.prototype.virtualPageAction = function (pageingDetails) {
        var _this = this;
        var dm = new DataManager(pageingDetails.result);
        var expanded = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        var parents = dm.executeLocal(new Query().where(expanded));
        var visualData = parents.filter(function (e) {
            return getExpandStatus(_this.parent, e, parents);
        });
        this.visualData = visualData;
        this.parent.grid.notify(events.dataListener, { data: visualData });
        var counts = { startIndex: -1, endIndex: -1, count: pageingDetails.count };
        this.parent.grid.notify(events.indexModifier, counts);
        var startIndex = counts.startIndex;
        var endIndex = counts.endIndex;
        pageingDetails.count = visualData.length;
        if (startIndex === -1 && endIndex === -1) {
            var query = new Query();
            var size = this.parent.grid.pageSettings.pageSize;
            var current = this.parent.grid.pageSettings.currentPage;
            var skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        else {
            var requestType = pageingDetails.actionArgs.requestType;
            if (requestType === 'filtering') {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize - 1;
                this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
            }
            //if ((this.prevendIndex !== -1 && this.prevstartIndex !== -1) && 
            //this.prevendIndex === endIndex && this.prevstartIndex === startIndex) {
            if (!isNullOrUndefined(this.expandCollapseRec)) {
                var resourceCount = this.parent.getRows();
                var sIndex = visualData.indexOf(this.expandCollapseRec);
                var tempdata = visualData.slice(sIndex, sIndex + resourceCount.length);
                if (tempdata.length < resourceCount.length && sIndex >= 0) {
                    sIndex = visualData.length - resourceCount.length;
                    sIndex = sIndex > 0 ? sIndex : 0;
                    startIndex = sIndex;
                    endIndex = visualData.length;
                }
                else if (getValue('isCollapseAll', this.parent)) {
                    startIndex = 0;
                    endIndex = this.parent.grid.pageSettings.pageSize - 1;
                    this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
                }
                this.expandCollapseRec = null;
            }
            //}
            pageingDetails.result = visualData.slice(startIndex, endIndex);
            this.prevstartIndex = startIndex;
            this.prevendIndex = endIndex;
        }
        this.parent.notify('updateAction', pageingDetails);
    };
    /**
     * To destroy the virtualScroll module
     * @return {void}
     * @hidden
     */
    VirtualScroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return VirtualScroll;
}());
export { VirtualScroll };
var TreeVirtual = /** @class */ (function (_super) {
    __extends(TreeVirtual, _super);
    function TreeVirtual(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        getValue('parent', _this).off('initial-load', getValue('instantiateRenderer', _this), _this);
        getValue('parent', _this).on('initial-load', _this.instantiateRenderers, _this);
        return _this;
    }
    TreeVirtual.prototype.instantiateRenderers = function () {
        getValue('parent', this).log(['limitation', 'virtual_height'], 'virtualization');
        var renderer = getValue('locator', this).getService('rendererFactory');
        getValue('addRenderer', renderer)
            .apply(renderer, [RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
        //renderer.addRenderer(RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this)));
        this.ensurePageSize();
    };
    TreeVirtual.prototype.ensurePageSize = function () {
        var parentGrid = getValue('parent', this);
        var rowHeight = parentGrid.getRowHeight();
        if (!isNullOrUndefined(parentGrid.height) && typeof (parentGrid.height) === 'string' && parentGrid.height.indexOf('%') !== -1) {
            parentGrid.element.style.height = parentGrid.height;
        }
        var vHeight = parentGrid.height.toString().indexOf('%') < 0 ? parentGrid.height :
            parentGrid.element.getBoundingClientRect().height;
        var blockSize = ~~(vHeight / rowHeight);
        var height = blockSize * 2;
        var size = parentGrid.pageSettings.pageSize;
        parentGrid.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    };
    return TreeVirtual;
}(GridVirtualScroll));
export { TreeVirtual };
