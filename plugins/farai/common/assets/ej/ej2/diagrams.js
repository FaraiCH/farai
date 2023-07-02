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
var index = require("@syncfusion/ej2-diagrams");
index.Diagram.Inject(index.HierarchicalTree, index.MindMap, index.RadialTree, index.ComplexHierarchicalTree, index.DataBinding, index.Snapping, index.PrintAndExport, index.BpmnDiagrams, index.SymmetricLayout, index.ConnectorBridging, index.UndoRedo, index.LayoutAnimation, index.DiagramContextMenu, index.LineRouting, index.ConnectorEditing, index.BlazorTooltip, index.LineDistribution);
index.SymbolPalette.Inject(index.BpmnDiagrams);
__exportStar(require("@syncfusion/ej2-diagrams"), exports);
