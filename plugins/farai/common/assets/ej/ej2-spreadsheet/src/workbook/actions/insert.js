import { insert, insertModel, workbookFormulaOperation, } from '../../workbook/common/index';
import { insertMerge } from '../../workbook/common/index';
/**
 * The `WorkbookInsert` module is used to insert cells, rows, columns and sheets in to workbook.
 */
var WorkbookInsert = /** @class */ (function () {
    /**
     * Constructor for the workbook insert module.
     * @private
     */
    function WorkbookInsert(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WorkbookInsert.prototype.insertModel = function (args) {
        var _this = this;
        var _a, _b, _c;
        var index;
        var model = [];
        var mergeCollection;
        if (typeof (args.start) === 'number') {
            index = args.start;
            args.end = args.end || index;
            if (index > args.end) {
                index = args.end;
                args.end = args.start;
            }
            for (var i = index; i <= args.end; i++) {
                model.push({});
            }
        }
        else {
            if (args.start) {
                index = args.start[0].index || 0;
                model = args.start;
            }
            else {
                index = 0;
                model.push({});
            }
        }
        if (args.modelType === 'Row') {
            args.model = args.model;
            if (!args.model.rows) {
                args.model.rows = [];
            }
            (_a = args.model.rows).splice.apply(_a, [index, 0].concat(model));
            //this.setInsertInfo(args.model, index, model.length, 'count');
            if (index > args.model.usedRange.rowIndex) {
                this.parent.setUsedRange(index + (model.length - 1), args.model.usedRange.colIndex);
            }
            else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex + model.length, args.model.usedRange.colIndex);
            }
            var curIdx = index + model.length;
            for (var i = 0; i <= args.model.usedRange.colIndex; i++) {
                if (args.model.rows[curIdx] && args.model.rows[curIdx].cells && args.model.rows[curIdx].cells[i] &&
                    args.model.rows[curIdx].cells[i].rowSpan !== undefined && args.model.rows[curIdx].cells[i].rowSpan < 0 &&
                    args.model.rows[curIdx].cells[i].colSpan === undefined) {
                    this.parent.notify(insertMerge, {
                        range: [curIdx, i, curIdx, i], insertCount: model.length,
                        insertModel: 'Row'
                    });
                }
            }
        }
        else if (args.modelType === 'Column') {
            args.model = args.model;
            if (!args.model.columns) {
                args.model.columns = [];
            }
            (_b = args.model.columns).splice.apply(_b, [index, 0].concat(model));
            //this.setInsertInfo(args.model, index, model.length, 'fldLen', 'Column');
            if (index > args.model.usedRange.colIndex) {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, index + (model.length - 1));
            }
            else {
                this.parent.setUsedRange(args.model.usedRange.rowIndex, args.model.usedRange.colIndex + model.length);
            }
            if (!args.model.rows) {
                args.model.rows = [];
            }
            var cellModel = [];
            if (!args.columnCellsModel) {
                args.columnCellsModel = [];
            }
            for (var i = 0; i < model.length; i++) {
                cellModel.push(null);
            }
            mergeCollection = [];
            for (var i = 0; i <= args.model.usedRange.rowIndex; i++) {
                if (!args.model.rows[i]) {
                    args.model.rows[i] = { cells: [] };
                }
                else if (!args.model.rows[i].cells) {
                    args.model.rows[i].cells = [];
                }
                if (index && !args.model.rows[i].cells[index - 1]) {
                    args.model.rows[i].cells[index - 1] = {};
                }
                (_c = args.model.rows[i].cells).splice.apply(_c, [index, 0].concat((args.columnCellsModel[i] && args.columnCellsModel[i].cells ?
                    args.columnCellsModel[i].cells : cellModel)));
                var curIdx = index + model.length;
                if (args.model.rows[i].cells[curIdx] && args.model.rows[i].cells[curIdx].colSpan !== undefined &&
                    args.model.rows[i].cells[curIdx].colSpan < 0 && args.model.rows[i].cells[curIdx].rowSpan === undefined) {
                    mergeCollection.push({
                        range: [i, curIdx, i, curIdx], insertCount: cellModel.length,
                        insertModel: 'Column'
                    });
                }
            }
            mergeCollection.forEach(function (mergeArgs) { _this.parent.notify(insertMerge, mergeArgs); });
        }
        else {
            if (args.checkCount !== undefined && args.checkCount === this.parent.sheets.length) {
                return;
            }
            this.parent.createSheet(index, model);
            var id_1;
            if (args.activeSheetIndex) {
                this.parent.setProperties({ activeSheetIndex: args.activeSheetIndex }, true);
            }
            model.forEach(function (sheet) {
                id_1 = sheet.id;
                _this.parent.notify(workbookFormulaOperation, {
                    action: 'addSheet', visibleName: sheet.name, sheetName: 'Sheet' + id_1, index: id_1
                });
            });
        }
        var insertArgs = {
            action: 'refreshNamedRange', insertArgs: {
                model: model, index: index, modelType: args.modelType, isAction: args.isAction, activeSheetIndex: args.activeSheetIndex, sheetCount: this.parent.sheets.length, name: 'insert'
            }
        };
        var eventArgs = {
            action: 'refreshInsDelFormula', insertArgs: {
                model: model, startIndex: args.start, endIndex: args.end, modelType: args.modelType, name: 'insert', activeSheetIndex: args.activeSheetIndex, sheetCount: this.parent.sheets.length
            }
        };
        if (args.modelType === 'Column' || args.modelType === 'Row') {
            this.parent.notify(workbookFormulaOperation, insertArgs);
            this.parent.notify(workbookFormulaOperation, eventArgs);
        }
        this.parent.notify(insert, {
            model: model, index: index, modelType: args.modelType, isAction: args.isAction, activeSheetIndex: args.activeSheetIndex, sheetCount: this.parent.sheets.length, insertType: args.insertType
        });
    };
    WorkbookInsert.prototype.setInsertInfo = function (sheet, startIndex, count, totalKey, modelType) {
        if (modelType === void 0) { modelType = 'Row'; }
        var endIndex = count = startIndex + (count - 1);
        sheet.ranges.forEach(function (range) {
            if (range.info && startIndex < range.info[totalKey]) {
                if (!range.info["insert" + modelType + "Range"]) {
                    range.info["insert" + modelType + "Range"] = [[startIndex, endIndex]];
                }
                else {
                    range.info["insert" + modelType + "Range"].push([startIndex, endIndex]);
                }
                range.info[totalKey] += ((endIndex - startIndex) + 1);
            }
        });
    };
    WorkbookInsert.prototype.addEventListener = function () {
        this.parent.on(insertModel, this.insertModel, this);
    };
    /**
     * Destroy workbook insert module.
     */
    WorkbookInsert.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookInsert.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(insertModel, this.insertModel);
        }
    };
    /**
     * Get the workbook insert module name.
     */
    WorkbookInsert.prototype.getModuleName = function () {
        return 'workbookinsert';
    };
    return WorkbookInsert;
}());
export { WorkbookInsert };
