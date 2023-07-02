import { RowModelGenerator } from '../services/row-model-generator';
import { isBlazor } from '@syncfusion/ej2-base';
import { getFrozenTableName, splitFrozenRowObjectCells } from '../base/util';
/**
 * FreezeRowModelGenerator is used to generate grid data rows with freeze row and column.
 * @hidden
 */
var FreezeRowModelGenerator = /** @class */ (function () {
    function FreezeRowModelGenerator(parent) {
        this.parent = parent;
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }
    FreezeRowModelGenerator.prototype.generateRows = function (data, notifyArgs, virtualRows) {
        var frzCols = this.parent.getFrozenColumns();
        var tableName = getFrozenTableName(this.parent);
        frzCols = frzCols && this.parent.isRowDragable() ? frzCols + 1 : frzCols;
        if (notifyArgs.requestType === 'virtualscroll' && notifyArgs.virtualInfo.sentinelInfo.axis === 'X') {
            if (tableName !== 'movable') {
                return null;
            }
        }
        var row = this.parent.enableVirtualization && !notifyArgs.isFrozenRowsRender ? virtualRows
            : this.rowModelGenerator.generateRows(data, notifyArgs);
        if (isBlazor() && !this.parent.isJsComponent) {
            return row;
        }
        for (var i = 0, len = row.length; i < len; i++) {
            row[i].cells = splitFrozenRowObjectCells(this.parent, row[i].cells, tableName);
        }
        return row;
    };
    return FreezeRowModelGenerator;
}());
export { FreezeRowModelGenerator };
