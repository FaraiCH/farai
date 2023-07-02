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
var index = require("@syncfusion/ej2-spreadsheet");
index.Spreadsheet.Inject(index.Clipboard, index.Edit, index.KeyboardNavigation, index.KeyboardShortcut, index.CollaborativeEditing, index.Selection, index.ContextMenu, index.FormulaBar, index.Ribbon, index.Save, index.Open, index.SheetTabs, index.DataBind, index.AllModule, index.BasicModule, index.CellFormat, index.NumberFormat, index.Formula);
__exportStar(require("@syncfusion/ej2-spreadsheet"), exports);
