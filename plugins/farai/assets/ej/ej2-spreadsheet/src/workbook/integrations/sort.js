import { getCell, setCell, getData } from '../base/index';
import { DataManager, Query, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { getCellIndexes, getIndexesFromAddress, getColumnHeaderText, getRangeAddress, workbookLocale } from '../common/index';
import { getSwapRange } from '../common/index';
import { initiateSort } from '../common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `WorkbookSort` module is used to handle sort action in Spreadsheet.
 */
var WorkbookSort = /** @class */ (function () {
    /**
     * Constructor for WorkbookSort module.
     */
    function WorkbookSort(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     */
    WorkbookSort.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookSort.prototype.addEventListener = function () {
        this.parent.on(initiateSort, this.initiateSortHandler, this);
    };
    WorkbookSort.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateSort, this.initiateSortHandler);
        }
    };
    /**
     * Sorts range of cells in the sheet.
     * @param args - arguments for sorting.
     */
    WorkbookSort.prototype.initiateSortHandler = function (eventArgs) {
        var _this = this;
        var args = eventArgs.args;
        var deferred = new Deferred();
        var sheet = this.parent.getActiveSheet();
        var range = getSwapRange(getIndexesFromAddress(args.range));
        var sortOptions = args.sortOptions || { sortDescriptors: {}, containsHeader: true };
        var isSingleCell = false;
        eventArgs.promise = deferred.promise;
        if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
            deferred.reject(this.parent.serviceLocator.getService(workbookLocale).getConstant('SortOutOfRangeError'));
            return;
        }
        var containsHeader = sortOptions.containsHeader;
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
            range[0] = 0;
            range[1] = 0;
            range[2] = sheet.usedRange.rowIndex;
            range[3] = sheet.usedRange.colIndex;
            isSingleCell = true;
            containsHeader = isNullOrUndefined(sortOptions.containsHeader) ? true : sortOptions.containsHeader;
        }
        if ((isNullOrUndefined(args.sortOptions) || isNullOrUndefined(args.sortOptions.containsHeader)) && !isSingleCell) {
            if (!isNullOrUndefined(getCell(range[0], range[1], sheet)) && !isNullOrUndefined(getCell(range[0] + 1, range[1], sheet))) {
                if (typeof getCell(range[0], range[1], sheet).value === typeof getCell(range[0] + 1, range[1], sheet).value) {
                    containsHeader = false;
                }
                else {
                    containsHeader = true;
                }
            }
        }
        var sRIdx = range[0] = containsHeader ? range[0] + 1 : range[0];
        var sCIdx;
        var eCIdx;
        var cell = getCellIndexes(sheet.activeCell);
        var header = getColumnHeaderText(cell[1] + 1);
        var sortDescriptors = sortOptions.sortDescriptors;
        var address = getRangeAddress(range);
        getData(this.parent, sheet.name + "!" + address, true).then(function (jsonData) {
            var dataManager = new DataManager(jsonData);
            var query = new Query();
            if (Array.isArray(sortDescriptors)) { //multi-column sorting.
                if (!sortDescriptors || sortDescriptors.length === 0) {
                    sortDescriptors = [{ field: header }];
                }
                for (var length_1 = sortDescriptors.length, i = length_1 - 1; i > -1; i--) {
                    if (!sortDescriptors[length_1 - 1].field) {
                        sortDescriptors[length_1 - 1].field = header;
                    }
                    if (!sortDescriptors[i].field) {
                        continue;
                    }
                    var comparerFn = sortDescriptors[i].sortComparer
                        || _this.sortComparer.bind(_this, sortDescriptors[i], sortOptions.caseSensitive);
                    query.sortBy(sortDescriptors[i].field, comparerFn);
                }
            }
            else { //single column sorting.
                if (!sortDescriptors) {
                    sortDescriptors = { field: header };
                }
                if (!sortDescriptors.field) {
                    sortDescriptors.field = header;
                }
                var comparerFn = sortDescriptors.sortComparer
                    || _this.sortComparer.bind(_this, sortDescriptors, sortOptions.caseSensitive);
                query.sortBy(sortDescriptors.field, comparerFn);
            }
            dataManager.executeQuery(query).then(function (e) {
                var colName;
                var cell = {};
                var rowKey = '__rowIndex';
                Array.prototype.forEach.call(e.result, function (data, index) {
                    if (!data || !jsonData[index]) {
                        return;
                    }
                    sCIdx = range[1];
                    eCIdx = range[3];
                    sRIdx = parseInt(jsonData[index][rowKey], 10) - 1;
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        colName = getColumnHeaderText(sCIdx + 1);
                        cell = data[colName];
                        setCell(sRIdx, sCIdx, sheet, cell);
                    }
                });
                var eventArgs = { range: sheet.name + "!" + address, sortOptions: args.sortOptions };
                deferred.resolve(eventArgs);
            });
        });
    };
    /**
     * Compares the two cells for sorting.
     * @param sortDescriptor - protocol for sorting.
     * @param caseSensitive - value for case sensitive.
     * @param x - first cell
     * @param y - second cell
     */
    WorkbookSort.prototype.sortComparer = function (sortDescriptor, caseSensitive, x, y) {
        var direction = sortDescriptor.order || '';
        var comparer = DataUtil.fnSort(direction);
        var caseOptions = { sensitivity: caseSensitive ? 'case' : 'base' };
        if (x && y && typeof x.value === 'string') {
            var collator = new Intl.Collator(this.parent.locale, caseOptions);
            if (!direction || direction.toLowerCase() === 'ascending') {
                return collator.compare(x.value, y.value);
            }
            else {
                return collator.compare(x.value, y.value) * -1;
            }
        }
        return comparer(x ? x.value : x, y ? y.value : y);
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookSort.prototype.getModuleName = function () {
        return 'workbookSort';
    };
    return WorkbookSort;
}());
export { WorkbookSort };
