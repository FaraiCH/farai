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
var index = require("@syncfusion/ej2-documenteditor");
index.DocumentEditor.Inject(index.Print, index.SfdtExport, index.WordExport, index.TextExport, index.Selection, index.Search, index.Editor, index.EditorHistory, index.OptionsPane, index.ContextMenu, index.ImageResizer, index.HyperlinkDialog, index.TableDialog, index.BookmarkDialog, index.TableOfContentsDialog, index.PageSetupDialog, index.ParagraphDialog, index.ListDialog, index.StyleDialog, index.StylesDialog, index.BulletsAndNumberingDialog, index.FontDialog, index.TablePropertiesDialog, index.BordersAndShadingDialog, index.TableOptionsDialog, index.CellOptionsDialog, index.SpellChecker, index.SpellCheckDialog, index.CollaborativeEditing);
index.DocumentEditorContainer.Inject(index.Toolbar);
__exportStar(require("@syncfusion/ej2-documenteditor"), exports);
