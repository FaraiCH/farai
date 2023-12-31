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
import { VirtualRowModelGenerator } from '@syncfusion/ej2-grids';
import * as events from '../base/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { isCountRequired } from '../utils';
/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
var TreeVirtualRowModelGenerator = /** @class */ (function (_super) {
    __extends(TreeVirtualRowModelGenerator, _super);
    function TreeVirtualRowModelGenerator(parent) {
        var _this = _super.call(this, parent) || this;
        _this.addEventListener();
        return _this;
    }
    TreeVirtualRowModelGenerator.prototype.addEventListener = function () {
        this.parent.on(events.dataListener, this.getDatas, this);
    };
    TreeVirtualRowModelGenerator.prototype.getDatas = function (args) {
        this.visualData = args.data;
    };
    TreeVirtualRowModelGenerator.prototype.generateRows = function (data, notifyArgs) {
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            return _super.prototype.generateRows.call(this, data, notifyArgs);
        }
        else {
            if (!isNullOrUndefined(notifyArgs.requestType) && notifyArgs.requestType.toString() === 'collapseAll') {
                notifyArgs.requestType = 'refresh';
            }
            var rows = _super.prototype.generateRows.call(this, data, notifyArgs);
            for (var r = 0; r < rows.length; r++) {
                rows[r].index = (this.visualData).indexOf(rows[r].data);
            }
            return rows;
        }
    };
    TreeVirtualRowModelGenerator.prototype.checkAndResetCache = function (action) {
        var clear = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'reorder',
            'save', 'delete'].some(function (value) { return action === value; });
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            var model = 'model';
            var currentPage = this[model].currentPage;
            if (clear) {
                this.cache = {};
                this.data = {};
                this.groups = {};
            }
            else if (action === 'virtualscroll' && this.cache[currentPage] &&
                this.cache[currentPage].length > (this.parent.contentModule).getBlockSize()) {
                delete this.cache[currentPage];
            }
        }
        else {
            if (clear || action === 'virtualscroll') {
                this.cache = {};
                this.data = {};
                this.groups = {};
            }
        }
        return clear;
    };
    return TreeVirtualRowModelGenerator;
}(VirtualRowModelGenerator));
export { TreeVirtualRowModelGenerator };
