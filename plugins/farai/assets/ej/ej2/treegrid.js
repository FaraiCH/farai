"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
var index = require("@syncfusion/ej2-treegrid");
index.TreeGrid.Inject(index.Filter, index.Page, index.Sort, index.Reorder, index.Toolbar, index.Aggregate, index.Resize, index.ColumnMenu, index.ExcelExport, index.PdfExport, index.CommandColumn, index.ContextMenu, index.Edit, index.Selection, index.VirtualScroll, index.DetailRow, index.RowDD, index.Freeze, index.ColumnChooser, index.Logger);
__exportStar(require("@syncfusion/ej2-treegrid"), exports);
