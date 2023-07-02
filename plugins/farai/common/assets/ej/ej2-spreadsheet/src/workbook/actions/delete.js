import { getCell, setCell, getSheetIndex } from '../base/index';
import { deleteModel, deleteAction, updateUsedRange } from '../../workbook/common/index';
import { activeCellMergedRange, setMerge, workbookFormulaOperation } from '../../workbook/common/index';
/**
 * The `WorkbookDelete` module is used to delete cells, rows, columns and sheets from workbook.
 */
var WorkbookDelete = /** @class */ (function () {
    /**
     * Constructor for the workbook delete module.
     * @private
     */
    function WorkbookDelete(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    // tslint:disable-next-line
    WorkbookDelete.prototype.deleteModel = function (args) {
        var _this = this;
        var sheetLength = this.parent.sheets.length;
        if (args.modelType === 'Sheet' && sheetLength === 1) {
            return;
        }
        var modelName = args.modelType.toLowerCase() + "s";
        args.start = args.start;
        if (args.start > args.end) {
            var temp = args.start;
            args.start = args.end;
            args.end = temp;
        }
        var deletedCells;
        var mergeArgsCollection = [];
        var count = (args.end - args.start) + 1;
        var range;
        var prevCell;
        var sheetIndex;
        if (args.modelType === 'Row') {
            args.model = args.model;
            if (args.start > args.model.usedRange.rowIndex) {
                return;
            }
            if (args.end > args.model.usedRange.rowIndex) {
                args.end -= (args.end - args.model.usedRange.rowIndex);
            }
            args.model.usedRange.rowIndex -= ((args.end - args.start) + 1);
            if (args.model.usedRange.rowIndex < 0) {
                args.model.usedRange.rowIndex = 0;
            }
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.rowIndex, update: 'row' });
            var curIdx = args.end + 1;
            var cell = void 0;
            var mergeArgs = void 0;
            if (args.model.rows[args.start] && args.model.rows[args.start].cells) {
                for (var i = 0; i <= args.model.usedRange.colIndex; i++) {
                    if (args.model.rows[args.start].cells[i] && args.model.rows[args.start].cells[i].rowSpan !== undefined &&
                        args.model.rows[args.start].cells[i].rowSpan < 0 && args.model.rows[args.start].cells[i].colSpan === undefined) {
                        mergeArgs = { range: [args.start, i, args.start, i] };
                        this.parent.notify(activeCellMergedRange, mergeArgs);
                        mergeArgs.range = mergeArgs.range;
                        if (mergeArgs.range[2] <= args.end) {
                            prevCell = getCell(mergeArgs.range[0], i, args.model);
                            if (prevCell && prevCell.rowSpan > 1) {
                                if (prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) > 1) {
                                    setCell(mergeArgs.range[0], i, args.model, { colSpan: prevCell.rowSpan - ((mergeArgs.range[2] - args.start) + 1) }, true);
                                }
                                else {
                                    delete args.model.rows[mergeArgs.range[0]].cells[i].rowSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[curIdx].cells && args.model.rows[curIdx].cells[i] &&
                        args.model.rows[curIdx].cells[i].rowSpan !== undefined &&
                        args.model.rows[curIdx].cells[i].rowSpan < 0 && args.model.rows[curIdx].cells[i].colSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [curIdx, i, curIdx, i] };
                            this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object();
                        mergeArgs.range = mergeArgs.range;
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.rowSpan && (cell.rowSpan > 1 || cell.colSpan > 1)) {
                            var indexes = [];
                            indexes[1] = i;
                            indexes[3] = cell.colSpan > 1 ? i + (cell.colSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range;
                            if (mergeArgs.range[0] < args.start) {
                                indexes[0] = indexes[2] = mergeArgs.range[0];
                                if (cell.rowSpan - count > 1) {
                                    indexes[2] += (cell.rowSpan - count - 1);
                                }
                            }
                            else {
                                indexes[0] = indexes[2] = args.start;
                                if (cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1) > 1) {
                                    indexes[2] += ((cell.rowSpan - ((args.end - mergeArgs.range[0]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push({
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    mergeArgs = null;
                }
            }
        }
        else if (args.modelType === 'Column') {
            args.model = args.model;
            if (args.start > args.model.usedRange.colIndex) {
                return;
            }
            if (args.end > args.model.usedRange.colIndex) {
                args.end -= (args.end - args.model.usedRange.colIndex);
            }
            args.model.usedRange.colIndex -= count;
            if (args.model.usedRange.colIndex < 0) {
                args.model.usedRange.colIndex = 0;
            }
            //this.setDeleteInfo(args.start, args.end, 'fldLen', 'Column');
            this.parent.notify(updateUsedRange, { index: args.model.usedRange.colIndex, update: 'col' });
            deletedCells = [];
            var curIdx = args.end + 1;
            var cell = void 0;
            var mergeArgs = void 0;
            for (var i = 0; i <= args.model.usedRange.rowIndex; i++) {
                deletedCells.push({});
                if (args.model.rows[i] && args.model.rows[i].cells) {
                    if (args.model.rows[i].cells[args.start] && args.model.rows[i].cells[args.start].colSpan !== undefined &&
                        args.model.rows[i].cells[args.start].colSpan < 0 && args.model.rows[i].cells[args.start].rowSpan === undefined) {
                        mergeArgs = { range: [i, args.start, i, args.start] };
                        this.parent.notify(activeCellMergedRange, mergeArgs);
                        mergeArgs.range = mergeArgs.range;
                        if (mergeArgs.range[3] <= args.end) {
                            var prevCell_1 = getCell(i, mergeArgs.range[1], args.model);
                            if (prevCell_1 && prevCell_1.colSpan > 1) {
                                if (prevCell_1.colSpan - ((mergeArgs.range[3] - args.start) + 1) > 1) {
                                    setCell(i, mergeArgs.range[1], args.model, { colSpan: prevCell_1.colSpan - ((mergeArgs.range[3] - args.start) + 1) }, true);
                                }
                                else {
                                    delete args.model.rows[i].cells[mergeArgs.range[1]].colSpan;
                                }
                            }
                            mergeArgs = null;
                        }
                    }
                    if (args.model.rows[i].cells[curIdx] && args.model.rows[i].cells[curIdx].colSpan !== undefined &&
                        args.model.rows[i].cells[curIdx].colSpan < 0 && args.model.rows[i].cells[curIdx].rowSpan === undefined) {
                        if (!mergeArgs) {
                            mergeArgs = { range: [i, curIdx, i, curIdx] };
                            this.parent.notify(activeCellMergedRange, mergeArgs);
                        }
                        cell = new Object();
                        mergeArgs.range = mergeArgs.range;
                        Object.assign(cell, getCell(mergeArgs.range[0], mergeArgs.range[1], args.model));
                        if (cell && cell.colSpan && (cell.colSpan > 1 || cell.rowSpan > 1)) {
                            var indexes = [];
                            indexes[0] = i;
                            indexes[2] = cell.rowSpan > 1 ? i + (cell.rowSpan - 1) : i;
                            mergeArgs.range = mergeArgs.range;
                            if (mergeArgs.range[1] < args.start) {
                                indexes[1] = indexes[3] = mergeArgs.range[1];
                                if (cell.colSpan - count > 1) {
                                    indexes[3] += (cell.colSpan - count - 1);
                                }
                            }
                            else {
                                indexes[1] = indexes[3] = args.start;
                                if (cell.colSpan - ((args.end - mergeArgs.range[1]) + 1) > 1) {
                                    indexes[3] += ((cell.colSpan - ((args.end - mergeArgs.range[1]) + 1)) - 1);
                                }
                            }
                            mergeArgsCollection.push({
                                range: indexes, isAction: false, preventRefresh: true, merge: true,
                                type: 'All', skipChecking: true
                            });
                        }
                    }
                    deletedCells[i].cells = args.model.rows[i].cells.splice(args.start, count);
                    mergeArgs = null;
                }
            }
        }
        var deletedModel = [];
        for (var i = args.start; i <= args.end; i++) {
            if (args.model[modelName][args.start]) {
                deletedModel.push(args.model[modelName][args.start]);
                args.model[modelName].splice(args.start, 1);
            }
            else {
                deletedModel.push({});
            }
            if (i === args.start) {
                deletedModel[0].index = args.start;
            }
        }
        mergeArgsCollection.forEach(function (merge) { _this.parent.notify(setMerge, merge); });
        sheetIndex = getSheetIndex(this.parent, args.model.name);
        var insertArgs = {
            action: 'refreshNamedRange', insertArgs: {
                startIndex: args.start, endIndex: args.end, modelType: args.modelType,
                isAction: args.isAction, deletedModel: deletedModel, deletedCellsModel: deletedCells,
                activeSheetIndex: this.parent.activeSheetIndex, name: 'delete'
            }
        };
        var eventArgs = {
            action: 'refreshInsDelFormula', insertArgs: {
                model: deletedModel, startIndex: args.start, endIndex: args.end, modelType: args.modelType,
                name: 'delete', activeSheetIndex: args.activeSheetIndex, sheetCount: this.parent.sheets.length
            }
        };
        this.parent.notify(workbookFormulaOperation, insertArgs);
        this.parent.notify(workbookFormulaOperation, eventArgs);
        this.parent.notify(deleteAction, {
            startIndex: args.start, endIndex: args.end, modelType: args.modelType,
            isAction: args.isAction, deletedModel: deletedModel, deletedCellsModel: deletedCells,
            activeSheetIndex: this.parent.activeSheetIndex
        });
    };
    WorkbookDelete.prototype.setDeleteInfo = function (startIndex, endIndex, totalKey, modelType) {
        if (modelType === void 0) { modelType = 'Row'; }
        var total = (endIndex - startIndex) + 1;
        var newRange = [];
        var insertRange;
        this.parent.getActiveSheet().ranges.forEach(function (range) {
            if (range.info && startIndex < range.info[totalKey]) {
                if (range.info["delete" + modelType + "Range"]) {
                    range.info["delete" + modelType + "Range"].push([startIndex, endIndex]);
                }
                else {
                    range.info["delete" + modelType + "Range"] = [[startIndex, endIndex]];
                }
                range.info[totalKey] -= total;
                if (range.info["insert" + modelType + "Range"]) {
                    range.info["insert" + modelType + "Range"] = newRange;
                }
            }
        });
    };
    WorkbookDelete.prototype.addEventListener = function () {
        this.parent.on(deleteModel, this.deleteModel, this);
    };
    /**
     * Destroy workbook delete module.
     */
    WorkbookDelete.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookDelete.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(deleteModel, this.deleteModel);
        }
    };
    /**
     * Get the workbook delete module name.
     */
    WorkbookDelete.prototype.getModuleName = function () {
        return 'workbookdelete';
    };
    return WorkbookDelete;
}());
export { WorkbookDelete };
