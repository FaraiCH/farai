import { getData } from '../base/index';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getSwapRange, getRangeAddress } from '../common/index';
import { initiateFilter, clearAllFilter } from '../common/event';
/**
 * The `WorkbookFilter` module is used to handle filter action in Spreadsheet.
 */
var WorkbookFilter = /** @class */ (function () {
    /**
     * Constructor for WorkbookFilter module.
     */
    function WorkbookFilter(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the filter module.
     */
    WorkbookFilter.prototype.destroy = function () {
        this.removeEventListener();
        this.filterRange = null;
        this.parent = null;
    };
    WorkbookFilter.prototype.addEventListener = function () {
        this.parent.on(initiateFilter, this.initiateFilterHandler, this);
        this.parent.on(clearAllFilter, this.clearAllFilterHandler, this);
    };
    WorkbookFilter.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateFilter, this.initiateFilterHandler);
            this.parent.off(clearAllFilter, this.clearAllFilterHandler);
        }
    };
    /**
     * Filters a range of cells in the sheet.
     * @param args - arguments for filtering.
     */
    WorkbookFilter.prototype.initiateFilterHandler = function (eventArgs) {
        var _this = this;
        var args = eventArgs.args;
        var deferred = new Deferred();
        var sheet = this.parent.getActiveSheet();
        var filterOptions = args.filterOptions || {};
        eventArgs.promise = deferred.promise;
        this.filterRange = args.range;
        if (filterOptions.datasource) {
            this.setFilter(filterOptions.datasource, filterOptions.predicates);
            var filterEventArgs = { range: args.range, filterOptions: filterOptions };
            deferred.resolve(filterEventArgs);
        }
        else {
            var range = getSwapRange(getIndexesFromAddress(args.range));
            if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
                deferred.reject('Select a cell or range inside the used range and try again.');
                return;
            }
            if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
                range[0] = 0;
                range[1] = 0;
                range[3] = sheet.usedRange.colIndex;
            }
            range[2] = sheet.usedRange.rowIndex; //filter range should be till used range.
            range[0] = range[0] + 1; //ignore first row        
            var address_1 = getRangeAddress(range);
            getData(this.parent, sheet.name + "!" + address_1, true, true).then(function (jsonData) {
                var dataManager = new DataManager(jsonData);
                _this.setFilter(dataManager, filterOptions.predicates);
                var filterEventArgs = { range: address_1, filterOptions: filterOptions };
                deferred.resolve(filterEventArgs);
            });
        }
    };
    /**
     * Hides or unhides the rows based on the filter predicates.
     */
    WorkbookFilter.prototype.setFilter = function (dataManager, predicates) {
        var _this = this;
        if (dataManager && predicates) {
            var jsonData = dataManager.dataSource.json;
            var query = new Query();
            if (predicates.length) {
                query.where(Predicate.and(predicates));
            }
            var result_1 = dataManager.executeLocal(query);
            var rowKey_1 = '__rowIndex';
            jsonData.forEach(function (data, index) {
                if (!data) {
                    return;
                }
                _this.parent.hideRow(parseInt(data[rowKey_1], 10) - 1, undefined, result_1.indexOf(data) < 0);
            });
        }
    };
    /**
     * Clears all the filters in the sheet.
     */
    WorkbookFilter.prototype.clearAllFilterHandler = function () {
        if (this.filterRange) {
            var range = getCellIndexes(this.filterRange);
            var sheet = this.parent.getActiveSheet();
            this.parent.hideRow(range[0], sheet.usedRange.rowIndex - 1, false);
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookFilter.prototype.getModuleName = function () {
        return 'workbookFilter';
    };
    return WorkbookFilter;
}());
export { WorkbookFilter };
