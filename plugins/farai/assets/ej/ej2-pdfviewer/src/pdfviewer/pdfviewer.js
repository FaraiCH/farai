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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// tslint:disable-next-line:max-line-length
import { Component, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, Property, Event } from '@syncfusion/ej2-base';
import { PdfViewerBase } from './index';
// tslint:disable-next-line:max-line-length
import { FontStyle, AnnotationResizerLocation, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, AnnotationDataFormat } from './base/types';
import { FormFields } from './index';
import { PdfAnnotationBase } from './drawing/pdf-annotation';
import { Drawing } from './drawing/drawing';
import { Selector } from './drawing/selector';
import { renderAdornerLayer } from './drawing/dom-util';
/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 */
var ToolbarSettings = /** @class */ (function (_super) {
    __extends(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], ToolbarSettings.prototype, "showTooltip", void 0);
    __decorate([
        Property()
    ], ToolbarSettings.prototype, "toolbarItems", void 0);
    __decorate([
        Property()
    ], ToolbarSettings.prototype, "annotationToolbarItems", void 0);
    return ToolbarSettings;
}(ChildProperty));
export { ToolbarSettings };
/**
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
 */
var AjaxRequestSettings = /** @class */ (function (_super) {
    __extends(AjaxRequestSettings, _super);
    function AjaxRequestSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], AjaxRequestSettings.prototype, "ajaxHeaders", void 0);
    __decorate([
        Property(false)
    ], AjaxRequestSettings.prototype, "withCredentials", void 0);
    return AjaxRequestSettings;
}(ChildProperty));
export { AjaxRequestSettings };
var CustomStamp = /** @class */ (function (_super) {
    __extends(CustomStamp, _super);
    function CustomStamp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], CustomStamp.prototype, "customStampName", void 0);
    __decorate([
        Property('')
    ], CustomStamp.prototype, "customStampImageSource", void 0);
    return CustomStamp;
}(ChildProperty));
export { CustomStamp };
/**
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 */
var AnnotationToolbarSettings = /** @class */ (function (_super) {
    __extends(AnnotationToolbarSettings, _super);
    function AnnotationToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], AnnotationToolbarSettings.prototype, "showTooltip", void 0);
    __decorate([
        Property()
    ], AnnotationToolbarSettings.prototype, "annotationToolbarItem", void 0);
    return AnnotationToolbarSettings;
}(ChildProperty));
export { AnnotationToolbarSettings };
/**
 * The `SignatureFieldSettings` module is used to set the properties of signature field in PDF Viewer
 */
var SignatureFieldSettings = /** @class */ (function (_super) {
    __extends(SignatureFieldSettings, _super);
    function SignatureFieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], SignatureFieldSettings.prototype, "signatureIndicatorSettings", void 0);
    return SignatureFieldSettings;
}(ChildProperty));
export { SignatureFieldSettings };
/**
 * The `SignatureIndicatorSettings` module is used to provide the properties of signature Indicator in the signature field
 */
var SignatureIndicatorSettings = /** @class */ (function (_super) {
    __extends(SignatureIndicatorSettings, _super);
    function SignatureIndicatorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], SignatureIndicatorSettings.prototype, "opacity", void 0);
    __decorate([
        Property('orange')
    ], SignatureIndicatorSettings.prototype, "backgroundColor", void 0);
    __decorate([
        Property(19)
    ], SignatureIndicatorSettings.prototype, "width", void 0);
    __decorate([
        Property(10)
    ], SignatureIndicatorSettings.prototype, "height", void 0);
    __decorate([
        Property(10)
    ], SignatureIndicatorSettings.prototype, "fontSize", void 0);
    __decorate([
        Property('Sign')
    ], SignatureIndicatorSettings.prototype, "text", void 0);
    __decorate([
        Property('black')
    ], SignatureIndicatorSettings.prototype, "color", void 0);
    return SignatureIndicatorSettings;
}(ChildProperty));
export { SignatureIndicatorSettings };
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 */
var ServerActionSettings = /** @class */ (function (_super) {
    __extends(ServerActionSettings, _super);
    function ServerActionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Load')
    ], ServerActionSettings.prototype, "load", void 0);
    __decorate([
        Property('Unload')
    ], ServerActionSettings.prototype, "unload", void 0);
    __decorate([
        Property('RenderPdfPages')
    ], ServerActionSettings.prototype, "renderPages", void 0);
    __decorate([
        Property('RenderPdfPages')
    ], ServerActionSettings.prototype, "print", void 0);
    __decorate([
        Property('Download')
    ], ServerActionSettings.prototype, "download", void 0);
    __decorate([
        Property('RenderThumbnailImages')
    ], ServerActionSettings.prototype, "renderThumbnail", void 0);
    __decorate([
        Property('RenderAnnotationComments')
    ], ServerActionSettings.prototype, "renderComments", void 0);
    __decorate([
        Property('ImportAnnotations')
    ], ServerActionSettings.prototype, "importAnnotations", void 0);
    __decorate([
        Property('ExportAnnotations')
    ], ServerActionSettings.prototype, "exportAnnotations", void 0);
    __decorate([
        Property('ImportFormFields')
    ], ServerActionSettings.prototype, "importFormFields", void 0);
    __decorate([
        Property('ExportFormFields')
    ], ServerActionSettings.prototype, "exportFormFields", void 0);
    __decorate([
        Property('RenderPdfTexts')
    ], ServerActionSettings.prototype, "renderTexts", void 0);
    return ServerActionSettings;
}(ChildProperty));
export { ServerActionSettings };
/**
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 */
var StrikethroughSettings = /** @class */ (function (_super) {
    __extends(StrikethroughSettings, _super);
    function StrikethroughSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], StrikethroughSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ff0000')
    ], StrikethroughSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], StrikethroughSettings.prototype, "author", void 0);
    __decorate([
        Property('')
    ], StrikethroughSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(null)
    ], StrikethroughSettings.prototype, "customData", void 0);
    __decorate([
        Property(false)
    ], StrikethroughSettings.prototype, "isLock", void 0);
    __decorate([
        Property(false)
    ], StrikethroughSettings.prototype, "enableMultiPageAnnotation", void 0);
    __decorate([
        Property(false)
    ], StrikethroughSettings.prototype, "enableTextMarkupResizer", void 0);
    __decorate([
        Property(['None'])
    ], StrikethroughSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], StrikethroughSettings.prototype, "isPrint", void 0);
    return StrikethroughSettings;
}(ChildProperty));
export { StrikethroughSettings };
/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
var UnderlineSettings = /** @class */ (function (_super) {
    __extends(UnderlineSettings, _super);
    function UnderlineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], UnderlineSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#00ff00')
    ], UnderlineSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], UnderlineSettings.prototype, "author", void 0);
    __decorate([
        Property('')
    ], UnderlineSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(null)
    ], UnderlineSettings.prototype, "customData", void 0);
    __decorate([
        Property(false)
    ], UnderlineSettings.prototype, "isLock", void 0);
    __decorate([
        Property(false)
    ], UnderlineSettings.prototype, "enableMultiPageAnnotation", void 0);
    __decorate([
        Property(false)
    ], UnderlineSettings.prototype, "enableTextMarkupResizer", void 0);
    __decorate([
        Property(['None'])
    ], UnderlineSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], UnderlineSettings.prototype, "isPrint", void 0);
    return UnderlineSettings;
}(ChildProperty));
export { UnderlineSettings };
/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
var HighlightSettings = /** @class */ (function (_super) {
    __extends(HighlightSettings, _super);
    function HighlightSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], HighlightSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffff00')
    ], HighlightSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], HighlightSettings.prototype, "author", void 0);
    __decorate([
        Property('')
    ], HighlightSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(null)
    ], HighlightSettings.prototype, "customData", void 0);
    __decorate([
        Property(false)
    ], HighlightSettings.prototype, "isLock", void 0);
    __decorate([
        Property(false)
    ], HighlightSettings.prototype, "enableMultiPageAnnotation", void 0);
    __decorate([
        Property(false)
    ], HighlightSettings.prototype, "enableTextMarkupResizer", void 0);
    __decorate([
        Property(['None'])
    ], HighlightSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], HighlightSettings.prototype, "isPrint", void 0);
    return HighlightSettings;
}(ChildProperty));
export { HighlightSettings };
/**
 * The `LineSettings` module is used to provide the properties to line annotation.
 */
var LineSettings = /** @class */ (function (_super) {
    __extends(LineSettings, _super);
    function LineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], LineSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], LineSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], LineSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], LineSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], LineSettings.prototype, "thickness", void 0);
    __decorate([
        Property('None')
    ], LineSettings.prototype, "lineHeadStartStyle", void 0);
    __decorate([
        Property('None')
    ], LineSettings.prototype, "lineHeadEndStyle", void 0);
    __decorate([
        Property(0)
    ], LineSettings.prototype, "borderDashArray", void 0);
    __decorate([
        Property('')
    ], LineSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], LineSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], LineSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], LineSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], LineSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], LineSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], LineSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], LineSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], LineSettings.prototype, "isPrint", void 0);
    return LineSettings;
}(ChildProperty));
export { LineSettings };
/**
 * The `ArrowSettings` module is used to provide the properties to arrow annotation.
 */
var ArrowSettings = /** @class */ (function (_super) {
    __extends(ArrowSettings, _super);
    function ArrowSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], ArrowSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], ArrowSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], ArrowSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], ArrowSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], ArrowSettings.prototype, "thickness", void 0);
    __decorate([
        Property('None')
    ], ArrowSettings.prototype, "lineHeadStartStyle", void 0);
    __decorate([
        Property('None')
    ], ArrowSettings.prototype, "lineHeadEndStyle", void 0);
    __decorate([
        Property(0)
    ], ArrowSettings.prototype, "borderDashArray", void 0);
    __decorate([
        Property('')
    ], ArrowSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], ArrowSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], ArrowSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], ArrowSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], ArrowSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], ArrowSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], ArrowSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], ArrowSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], ArrowSettings.prototype, "isPrint", void 0);
    return ArrowSettings;
}(ChildProperty));
export { ArrowSettings };
/**
 * The `RectangleSettings` module is used to provide the properties to rectangle annotation.
 */
var RectangleSettings = /** @class */ (function (_super) {
    __extends(RectangleSettings, _super);
    function RectangleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], RectangleSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], RectangleSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], RectangleSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], RectangleSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], RectangleSettings.prototype, "thickness", void 0);
    __decorate([
        Property('')
    ], RectangleSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], RectangleSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], RectangleSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], RectangleSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], RectangleSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], RectangleSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], RectangleSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], RectangleSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], RectangleSettings.prototype, "isPrint", void 0);
    return RectangleSettings;
}(ChildProperty));
export { RectangleSettings };
/**
 * The `CircleSettings` module is used to provide the properties to circle annotation.
 */
var CircleSettings = /** @class */ (function (_super) {
    __extends(CircleSettings, _super);
    function CircleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], CircleSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], CircleSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], CircleSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], CircleSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], CircleSettings.prototype, "thickness", void 0);
    __decorate([
        Property('')
    ], CircleSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], CircleSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], CircleSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], CircleSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], CircleSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], CircleSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], CircleSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], CircleSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], CircleSettings.prototype, "isPrint", void 0);
    return CircleSettings;
}(ChildProperty));
export { CircleSettings };
/**
 * The `ShapeLabelSettings` module is used to provide the properties to rectangle annotation.
 */
var ShapeLabelSettings = /** @class */ (function (_super) {
    __extends(ShapeLabelSettings, _super);
    function ShapeLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], ShapeLabelSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], ShapeLabelSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#000')
    ], ShapeLabelSettings.prototype, "fontColor", void 0);
    __decorate([
        Property(16)
    ], ShapeLabelSettings.prototype, "fontSize", void 0);
    __decorate([
        Property('Helvetica')
    ], ShapeLabelSettings.prototype, "fontFamily", void 0);
    __decorate([
        Property('Label')
    ], ShapeLabelSettings.prototype, "labelContent", void 0);
    __decorate([
        Property('')
    ], ShapeLabelSettings.prototype, "notes", void 0);
    return ShapeLabelSettings;
}(ChildProperty));
export { ShapeLabelSettings };
/**
 * The `PolygonSettings` module is used to provide the properties to polygon annotation.
 */
var PolygonSettings = /** @class */ (function (_super) {
    __extends(PolygonSettings, _super);
    function PolygonSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], PolygonSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], PolygonSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], PolygonSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], PolygonSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], PolygonSettings.prototype, "thickness", void 0);
    __decorate([
        Property('')
    ], PolygonSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], PolygonSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], PolygonSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], PolygonSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], PolygonSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], PolygonSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], PolygonSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], PolygonSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], PolygonSettings.prototype, "isPrint", void 0);
    return PolygonSettings;
}(ChildProperty));
export { PolygonSettings };
/**
 * The `stampSettings` module is used to provide the properties to stamp annotation.
 */
var StampSettings = /** @class */ (function (_super) {
    __extends(StampSettings, _super);
    function StampSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], StampSettings.prototype, "opacity", void 0);
    __decorate([
        Property('Guest')
    ], StampSettings.prototype, "author", void 0);
    __decorate([
        Property('')
    ], StampSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], StampSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], StampSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], StampSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], StampSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], StampSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], StampSettings.prototype, "customData", void 0);
    __decorate([
        Property([])
    ], StampSettings.prototype, "dynamicStamps", void 0);
    __decorate([
        Property([])
    ], StampSettings.prototype, "signStamps", void 0);
    __decorate([
        Property([])
    ], StampSettings.prototype, "standardBusinessStamps", void 0);
    __decorate([
        Property(['None'])
    ], StampSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], StampSettings.prototype, "isPrint", void 0);
    return StampSettings;
}(ChildProperty));
export { StampSettings };
/**
 * The `CustomStampSettings` module is used to provide the properties to customstamp annotation.
 */
var CustomStampSettings = /** @class */ (function (_super) {
    __extends(CustomStampSettings, _super);
    function CustomStampSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], CustomStampSettings.prototype, "opacity", void 0);
    __decorate([
        Property('Guest')
    ], CustomStampSettings.prototype, "author", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "width", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "height", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "left", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "top", void 0);
    __decorate([
        Property(false)
    ], CustomStampSettings.prototype, "isAddToMenu", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], CustomStampSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], CustomStampSettings.prototype, "isLock", void 0);
    __decorate([
        Property('')
    ], CustomStampSettings.prototype, "customStamps", void 0);
    __decorate([
        Property(true)
    ], CustomStampSettings.prototype, "enableCustomStamp", void 0);
    __decorate([
        Property(['None'])
    ], CustomStampSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], CustomStampSettings.prototype, "isPrint", void 0);
    return CustomStampSettings;
}(ChildProperty));
export { CustomStampSettings };
/**
 * The `DistanceSettings` module is used to provide the properties to distance calibrate annotation.
 */
var DistanceSettings = /** @class */ (function (_super) {
    __extends(DistanceSettings, _super);
    function DistanceSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], DistanceSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ff0000')
    ], DistanceSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], DistanceSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], DistanceSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], DistanceSettings.prototype, "thickness", void 0);
    __decorate([
        Property('None')
    ], DistanceSettings.prototype, "lineHeadStartStyle", void 0);
    __decorate([
        Property('None')
    ], DistanceSettings.prototype, "lineHeadEndStyle", void 0);
    __decorate([
        Property(0)
    ], DistanceSettings.prototype, "borderDashArray", void 0);
    __decorate([
        Property('')
    ], DistanceSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], DistanceSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], DistanceSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], DistanceSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], DistanceSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], DistanceSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], DistanceSettings.prototype, "customData", void 0);
    __decorate([
        Property(40)
    ], DistanceSettings.prototype, "leaderLength", void 0);
    __decorate([
        Property(CursorType.move)
    ], DistanceSettings.prototype, "resizeCursorType", void 0);
    __decorate([
        Property(['None'])
    ], DistanceSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], DistanceSettings.prototype, "isPrint", void 0);
    return DistanceSettings;
}(ChildProperty));
export { DistanceSettings };
/**
 * The `PerimeterSettings` module is used to provide the properties to perimeter calibrate annotation.
 */
var PerimeterSettings = /** @class */ (function (_super) {
    __extends(PerimeterSettings, _super);
    function PerimeterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], PerimeterSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], PerimeterSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], PerimeterSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], PerimeterSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], PerimeterSettings.prototype, "thickness", void 0);
    __decorate([
        Property('None')
    ], PerimeterSettings.prototype, "lineHeadStartStyle", void 0);
    __decorate([
        Property('None')
    ], PerimeterSettings.prototype, "lineHeadEndStyle", void 0);
    __decorate([
        Property(0)
    ], PerimeterSettings.prototype, "borderDashArray", void 0);
    __decorate([
        Property(0)
    ], PerimeterSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], PerimeterSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], PerimeterSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], PerimeterSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], PerimeterSettings.prototype, "isLock", void 0);
    __decorate([
        Property('')
    ], PerimeterSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(['None'])
    ], PerimeterSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], PerimeterSettings.prototype, "isPrint", void 0);
    return PerimeterSettings;
}(ChildProperty));
export { PerimeterSettings };
/**
 * The `AreaSettings` module is used to provide the properties to area calibrate annotation.
 */
var AreaSettings = /** @class */ (function (_super) {
    __extends(AreaSettings, _super);
    function AreaSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], AreaSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], AreaSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], AreaSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], AreaSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], AreaSettings.prototype, "thickness", void 0);
    __decorate([
        Property(0)
    ], AreaSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], AreaSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], AreaSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], AreaSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], AreaSettings.prototype, "isLock", void 0);
    __decorate([
        Property('')
    ], AreaSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(['None'])
    ], AreaSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], AreaSettings.prototype, "isPrint", void 0);
    return AreaSettings;
}(ChildProperty));
export { AreaSettings };
/**
 * The `RadiusSettings` module is used to provide the properties to radius calibrate annotation.
 */
var RadiusSettings = /** @class */ (function (_super) {
    __extends(RadiusSettings, _super);
    function RadiusSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], RadiusSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], RadiusSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], RadiusSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], RadiusSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], RadiusSettings.prototype, "thickness", void 0);
    __decorate([
        Property('')
    ], RadiusSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], RadiusSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], RadiusSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], RadiusSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], RadiusSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], RadiusSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], RadiusSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], RadiusSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], RadiusSettings.prototype, "isPrint", void 0);
    return RadiusSettings;
}(ChildProperty));
export { RadiusSettings };
/**
 * The `VolumeSettings` module is used to provide the properties to volume calibrate annotation.
 */
var VolumeSettings = /** @class */ (function (_super) {
    __extends(VolumeSettings, _super);
    function VolumeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], VolumeSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], VolumeSettings.prototype, "fillColor", void 0);
    __decorate([
        Property('#ff0000')
    ], VolumeSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property('Guest')
    ], VolumeSettings.prototype, "author", void 0);
    __decorate([
        Property('1')
    ], VolumeSettings.prototype, "thickness", void 0);
    __decorate([
        Property(0)
    ], VolumeSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], VolumeSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], VolumeSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], VolumeSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], VolumeSettings.prototype, "isLock", void 0);
    __decorate([
        Property('')
    ], VolumeSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(['None'])
    ], VolumeSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], VolumeSettings.prototype, "isPrint", void 0);
    return VolumeSettings;
}(ChildProperty));
export { VolumeSettings };
/**
 * The `Ink` module is used to provide the properties to Ink annotation.
 */
var InkAnnotationSettings = /** @class */ (function (_super) {
    __extends(InkAnnotationSettings, _super);
    function InkAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], InkAnnotationSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ff0000')
    ], InkAnnotationSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property(1)
    ], InkAnnotationSettings.prototype, "thickness", void 0);
    __decorate([
        Property('')
    ], InkAnnotationSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(false)
    ], InkAnnotationSettings.prototype, "isLock", void 0);
    __decorate([
        Property('Guest')
    ], InkAnnotationSettings.prototype, "author", void 0);
    __decorate([
        Property(['None'])
    ], InkAnnotationSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(null)
    ], InkAnnotationSettings.prototype, "customData", void 0);
    __decorate([
        Property(true)
    ], InkAnnotationSettings.prototype, "isPrint", void 0);
    return InkAnnotationSettings;
}(ChildProperty));
export { InkAnnotationSettings };
/**
 * The `stickyNotesSettings` module is used to provide the properties to sticky notes annotation.
 */
var StickyNotesSettings = /** @class */ (function (_super) {
    __extends(StickyNotesSettings, _super);
    function StickyNotesSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Guest')
    ], StickyNotesSettings.prototype, "author", void 0);
    __decorate([
        Property(1)
    ], StickyNotesSettings.prototype, "opacity", void 0);
    __decorate([
        Property('')
    ], StickyNotesSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(null)
    ], StickyNotesSettings.prototype, "customData", void 0);
    __decorate([
        Property(false)
    ], StickyNotesSettings.prototype, "isLock", void 0);
    __decorate([
        Property(['None'])
    ], StickyNotesSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], StickyNotesSettings.prototype, "isPrint", void 0);
    return StickyNotesSettings;
}(ChildProperty));
export { StickyNotesSettings };
/**
 * The `MeasurementSettings` module is used to provide the settings to measurement annotations.
 */
var MeasurementSettings = /** @class */ (function (_super) {
    __extends(MeasurementSettings, _super);
    function MeasurementSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], MeasurementSettings.prototype, "scaleRatio", void 0);
    __decorate([
        Property('in')
    ], MeasurementSettings.prototype, "conversionUnit", void 0);
    __decorate([
        Property('in')
    ], MeasurementSettings.prototype, "displayUnit", void 0);
    __decorate([
        Property(96)
    ], MeasurementSettings.prototype, "depth", void 0);
    return MeasurementSettings;
}(ChildProperty));
export { MeasurementSettings };
/**
 * The `FreeTextSettings` module is used to provide the properties to free text annotation.
 */
var FreeTextSettings = /** @class */ (function (_super) {
    __extends(FreeTextSettings, _super);
    function FreeTextSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], FreeTextSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffffff00')
    ], FreeTextSettings.prototype, "borderColor", void 0);
    __decorate([
        Property(1)
    ], FreeTextSettings.prototype, "borderWidth", void 0);
    __decorate([
        Property('solid')
    ], FreeTextSettings.prototype, "borderStyle", void 0);
    __decorate([
        Property('Guest')
    ], FreeTextSettings.prototype, "author", void 0);
    __decorate([
        Property('#ffffff00')
    ], FreeTextSettings.prototype, "fillColor", void 0);
    __decorate([
        Property(16)
    ], FreeTextSettings.prototype, "fontSize", void 0);
    __decorate([
        Property(151)
    ], FreeTextSettings.prototype, "width", void 0);
    __decorate([
        Property(24.6)
    ], FreeTextSettings.prototype, "height", void 0);
    __decorate([
        Property('#000')
    ], FreeTextSettings.prototype, "fontColor", void 0);
    __decorate([
        Property('Helvetica')
    ], FreeTextSettings.prototype, "fontFamily", void 0);
    __decorate([
        Property('TypeHere')
    ], FreeTextSettings.prototype, "defaultText", void 0);
    __decorate([
        Property('None')
    ], FreeTextSettings.prototype, "fontStyle", void 0);
    __decorate([
        Property('Left')
    ], FreeTextSettings.prototype, "textAlignment", void 0);
    __decorate([
        Property(false)
    ], FreeTextSettings.prototype, "allowEditTextOnly", void 0);
    __decorate([
        Property('')
    ], FreeTextSettings.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property(0)
    ], FreeTextSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], FreeTextSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], FreeTextSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], FreeTextSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], FreeTextSettings.prototype, "isLock", void 0);
    __decorate([
        Property(null)
    ], FreeTextSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], FreeTextSettings.prototype, "allowedInteractions", void 0);
    __decorate([
        Property(true)
    ], FreeTextSettings.prototype, "isPrint", void 0);
    return FreeTextSettings;
}(ChildProperty));
export { FreeTextSettings };
/**
 * The `AnnotationSelectorSettings` module is used to provide the properties to annotation selectors.
 */
var AnnotationSelectorSettings = /** @class */ (function (_super) {
    __extends(AnnotationSelectorSettings, _super);
    function AnnotationSelectorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], AnnotationSelectorSettings.prototype, "selectionBorderColor", void 0);
    __decorate([
        Property('black')
    ], AnnotationSelectorSettings.prototype, "resizerBorderColor", void 0);
    __decorate([
        Property('#FF4081')
    ], AnnotationSelectorSettings.prototype, "resizerFillColor", void 0);
    __decorate([
        Property(8)
    ], AnnotationSelectorSettings.prototype, "resizerSize", void 0);
    __decorate([
        Property(1)
    ], AnnotationSelectorSettings.prototype, "selectionBorderThickness", void 0);
    __decorate([
        Property('Square')
    ], AnnotationSelectorSettings.prototype, "resizerShape", void 0);
    __decorate([
        Property('')
    ], AnnotationSelectorSettings.prototype, "selectorLineDashArray", void 0);
    __decorate([
        Property(AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges)
    ], AnnotationSelectorSettings.prototype, "resizerLocation", void 0);
    __decorate([
        Property(null)
    ], AnnotationSelectorSettings.prototype, "resizerCursorType", void 0);
    return AnnotationSelectorSettings;
}(ChildProperty));
export { AnnotationSelectorSettings };
/**
 * The `TextSearchColorSettings` module is used to set the settings for the color of the text search highlight.
 */
var TextSearchColorSettings = /** @class */ (function (_super) {
    __extends(TextSearchColorSettings, _super);
    function TextSearchColorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('#fdd835')
    ], TextSearchColorSettings.prototype, "searchHighlightColor", void 0);
    __decorate([
        Property('#8b4c12')
    ], TextSearchColorSettings.prototype, "searchColor", void 0);
    return TextSearchColorSettings;
}(ChildProperty));
export { TextSearchColorSettings };
/**
 * The `HandWrittenSignatureSettings` module is used to provide the properties to handwritten signature.
 */
var HandWrittenSignatureSettings = /** @class */ (function (_super) {
    __extends(HandWrittenSignatureSettings, _super);
    function HandWrittenSignatureSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], HandWrittenSignatureSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#000000')
    ], HandWrittenSignatureSettings.prototype, "strokeColor", void 0);
    __decorate([
        Property(1)
    ], HandWrittenSignatureSettings.prototype, "thickness", void 0);
    __decorate([
        Property(150)
    ], HandWrittenSignatureSettings.prototype, "width", void 0);
    __decorate([
        Property(100)
    ], HandWrittenSignatureSettings.prototype, "height", void 0);
    __decorate([
        Property('')
    ], HandWrittenSignatureSettings.prototype, "annotationSelectorSettings", void 0);
    return HandWrittenSignatureSettings;
}(ChildProperty));
export { HandWrittenSignatureSettings };
/**
 * The `AnnotationSettings` module is used to provide the properties to annotations.
 */
var AnnotationSettings = /** @class */ (function (_super) {
    __extends(AnnotationSettings, _super);
    function AnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Guest')
    ], AnnotationSettings.prototype, "author", void 0);
    __decorate([
        Property(0)
    ], AnnotationSettings.prototype, "minHeight", void 0);
    __decorate([
        Property(0)
    ], AnnotationSettings.prototype, "minWidth", void 0);
    __decorate([
        Property(0)
    ], AnnotationSettings.prototype, "maxHeight", void 0);
    __decorate([
        Property(0)
    ], AnnotationSettings.prototype, "maxWidth", void 0);
    __decorate([
        Property(false)
    ], AnnotationSettings.prototype, "isLock", void 0);
    __decorate([
        Property(false)
    ], AnnotationSettings.prototype, "skipPrint", void 0);
    __decorate([
        Property(false)
    ], AnnotationSettings.prototype, "skipDownload", void 0);
    __decorate([
        Property(null)
    ], AnnotationSettings.prototype, "customData", void 0);
    __decorate([
        Property(['None'])
    ], AnnotationSettings.prototype, "allowedInteractions", void 0);
    return AnnotationSettings;
}(ChildProperty));
export { AnnotationSettings };
/**
 * The `DocumentTextCollectionSettings` module is used to provide the properties to DocumentTextCollection.
 */
var DocumentTextCollectionSettings = /** @class */ (function (_super) {
    __extends(DocumentTextCollectionSettings, _super);
    function DocumentTextCollectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], DocumentTextCollectionSettings.prototype, "textData", void 0);
    __decorate([
        Property()
    ], DocumentTextCollectionSettings.prototype, "pageText", void 0);
    __decorate([
        Property()
    ], DocumentTextCollectionSettings.prototype, "pageSize", void 0);
    return DocumentTextCollectionSettings;
}(ChildProperty));
export { DocumentTextCollectionSettings };
/**
 * The `TextDataSettings` module is used to provide the properties of text data.
 */
var TextDataSettings = /** @class */ (function (_super) {
    __extends(TextDataSettings, _super);
    function TextDataSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], TextDataSettings.prototype, "bounds", void 0);
    __decorate([
        Property()
    ], TextDataSettings.prototype, "text", void 0);
    return TextDataSettings;
}(ChildProperty));
export { TextDataSettings };
/**
 * The `RectangleBounds` module is used to provide the properties of rectangle bounds.
 */
var RectangleBounds = /** @class */ (function (_super) {
    __extends(RectangleBounds, _super);
    function RectangleBounds() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], RectangleBounds.prototype, "size", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "x", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "y", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "width", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "height", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "left", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "top", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "right", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "bottom", void 0);
    __decorate([
        Property()
    ], RectangleBounds.prototype, "isEmpty", void 0);
    return RectangleBounds;
}(ChildProperty));
export { RectangleBounds };
/**
 * The `TileRenderingSettings` module is used to provide the tile rendering settings of the PDF viewer.
 */
var TileRenderingSettings = /** @class */ (function (_super) {
    __extends(TileRenderingSettings, _super);
    function TileRenderingSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], TileRenderingSettings.prototype, "enableTileRendering", void 0);
    __decorate([
        Property(0)
    ], TileRenderingSettings.prototype, "x", void 0);
    __decorate([
        Property(0)
    ], TileRenderingSettings.prototype, "y", void 0);
    return TileRenderingSettings;
}(ChildProperty));
export { TileRenderingSettings };
/**
 * The `ScrollSettings` module is used to provide the settings of the scroll of the PDF viewer.
 */
var ScrollSettings = /** @class */ (function (_super) {
    __extends(ScrollSettings, _super);
    function ScrollSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(100)
    ], ScrollSettings.prototype, "delayPageRequestTimeOnScroll", void 0);
    return ScrollSettings;
}(ChildProperty));
export { ScrollSettings };
/**
 * The `FormField` is used to store the form fields of PDF document.
 */
var FormField = /** @class */ (function (_super) {
    __extends(FormField, _super);
    function FormField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], FormField.prototype, "name", void 0);
    __decorate([
        Property('')
    ], FormField.prototype, "id", void 0);
    __decorate([
        Property('')
    ], FormField.prototype, "value", void 0);
    __decorate([
        Property('')
    ], FormField.prototype, "type", void 0);
    __decorate([
        Property(false)
    ], FormField.prototype, "isReadOnly", void 0);
    __decorate([
        Property([''])
    ], FormField.prototype, "signatureType", void 0);
    __decorate([
        Property('')
    ], FormField.prototype, "fontName", void 0);
    return FormField;
}(ChildProperty));
export { FormField };
/**
 * The `ContextMenuSettings` is used to show the context menu of PDF document.
 */
var ContextMenuSettings = /** @class */ (function (_super) {
    __extends(ContextMenuSettings, _super);
    function ContextMenuSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('RightClick')
    ], ContextMenuSettings.prototype, "contextMenuAction", void 0);
    __decorate([
        Property([])
    ], ContextMenuSettings.prototype, "contextMenuItems", void 0);
    return ContextMenuSettings;
}(ChildProperty));
export { ContextMenuSettings };
/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */
var PdfViewer = /** @class */ (function (_super) {
    __extends(PdfViewer, _super);
    function PdfViewer(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * Get the Loaded document signature Collections in the PdfViewer control.
         */
        // tslint:disable-next-line
        _this.signatureCollection = [];
        /**
         * Gets or sets the document name loaded in the PdfViewer control.
         */
        _this.fileName = null;
        /**
         * Gets or sets the export annotations JSON file name in the PdfViewer control.
         */
        _this.exportAnnotationFileName = null;
        /**
         * @private
         */
        _this.zIndex = -1;
        /**
         * @private
         */
        _this.nameTable = {};
        /**   @private  */
        _this.clipboardData = {};
        /**
         * @private
         */
        _this.zIndexTable = [];
        _this.isTextSelectionStarted = false;
        /** @hidden */
        _this.defaultLocale = {
            'PdfViewer': 'PDF Viewer',
            'Cancel': 'Cancel',
            'Download file': 'Download file',
            'Download': 'Download',
            'Enter Password': 'This document is password protected. Please enter a password.',
            'File Corrupted': 'File Corrupted',
            'File Corrupted Content': 'The file is corrupted and cannot be opened.',
            'Fit Page': 'Fit Page',
            'Fit Width': 'Fit Width',
            'Automatic': 'Automatic',
            'Go To First Page': 'Show first page',
            'Invalid Password': 'Incorrect Password. Please try again.',
            'Next Page': 'Show next page',
            'OK': 'OK',
            'Open': 'Open file',
            'Page Number': 'Current page number',
            'Previous Page': 'Show previous page',
            'Go To Last Page': 'Show last page',
            'Zoom': 'Zoom',
            'Zoom In': 'Zoom in',
            'Zoom Out': 'Zoom out',
            'Page Thumbnails': 'Page thumbnails',
            'Bookmarks': 'Bookmarks',
            'Print': 'Print file',
            'Password Protected': 'Password Required',
            'Copy': 'Copy',
            'Text Selection': 'Text selection tool',
            'Panning': 'Pan mode',
            'Text Search': 'Find text',
            'Find in document': 'Find in document',
            'Match case': 'Match case',
            'Apply': 'Apply',
            'GoToPage': 'Go to Page',
            // tslint:disable-next-line:max-line-length
            'No matches': 'Viewer has finished searching the document. No more matches were found',
            'No Text Found': 'No Text Found',
            'Undo': 'Undo',
            'Redo': 'Redo',
            'Annotation': 'Add or Edit annotations',
            'Highlight': 'Highlight Text',
            'Underline': 'Underline Text',
            'Strikethrough': 'Strikethrough Text',
            'Delete': 'Delete annotation',
            'Opacity': 'Opacity',
            'Color edit': 'Change Color',
            'Opacity edit': 'Change Opacity',
            'Highlight context': 'Highlight',
            'Underline context': 'Underline',
            'Strikethrough context': 'Strike through',
            // tslint:disable-next-line:max-line-length
            'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.',
            // tslint:disable-next-line:max-line-length
            'Client error': 'Client-side error is found. Please check the custom headers provided in the AjaxRequestSettings property and web action methods in the ServerActionSettings property.',
            'Open text': 'Open',
            'First text': 'First Page',
            'Previous text': 'Previous Page',
            'Next text': 'Next Page',
            'Last text': 'Last Page',
            'Zoom in text': 'Zoom In',
            'Zoom out text': 'Zoom Out',
            'Selection text': 'Selection',
            'Pan text': 'Pan',
            'Print text': 'Print',
            'Search text': 'Search',
            'Annotation Edit text': 'Edit Annotation',
            'Line Thickness': 'Line Thickness',
            'Line Properties': 'Line Properties',
            'Start Arrow': 'Start Arrow',
            'End Arrow': 'End Arrow',
            'Line Style': 'Line Style',
            'Fill Color': 'Fill Color',
            'Line Color': 'Line Color',
            'None': 'None',
            'Open Arrow': 'Open',
            'Closed Arrow': 'Closed',
            'Round Arrow': 'Round',
            'Square Arrow': 'Square',
            'Diamond Arrow': 'Diamond',
            'Butt': 'Butt',
            'Cut': 'Cut',
            'Paste': 'Paste',
            'Delete Context': 'Delete',
            'Properties': 'Properties',
            'Add Stamp': 'Add Stamp',
            'Add Shapes': 'Add Shapes',
            'Stroke edit': 'Change Stroke Color',
            'Change thickness': 'Change Border Thickness',
            'Add line': 'Add Line',
            'Add arrow': 'Add Arrow',
            'Add rectangle': 'Add Rectangle',
            'Add circle': 'Add Circle',
            'Add polygon': 'Add Polygon',
            'Add Comments': 'Add Comments',
            'Comments': 'Comments',
            'SubmitForm': 'Submit Form',
            'No Comments Yet': 'No Comments Yet',
            'Accepted': 'Accepted',
            'Completed': 'Completed',
            'Cancelled': 'Cancelled',
            'Rejected': 'Rejected',
            'Leader Length': 'Leader Length',
            'Scale Ratio': 'Scale Ratio',
            'Calibrate': 'Calibrate',
            'Calibrate Distance': 'Calibrate Distance',
            'Calibrate Perimeter': 'Calibrate Perimeter',
            'Calibrate Area': 'Calibrate Area',
            'Calibrate Radius': 'Calibrate Radius',
            'Calibrate Volume': 'Calibrate Volume',
            'Depth': 'Depth',
            'Closed': 'Closed',
            'Round': 'Round',
            'Square': 'Square',
            'Diamond': 'Diamond',
            'Edit': 'Edit',
            'Comment': 'Comment',
            'Comment Panel': 'Comment Panel',
            'Set Status': 'Set Status',
            'Post': 'Post',
            'Page': 'Page',
            'Add a comment': 'Add a comment',
            'Add a reply': 'Add a reply',
            'Import Annotations': 'Import annotations from JSON file',
            'Export Annotations': 'Export annotation to JSON file',
            'Export XFDF': 'Export annotation to XFDF file',
            'Import XFDF': 'Import annotations from XFDF file',
            'Add': 'Add',
            'Clear': 'Clear',
            'Bold': 'Bold',
            'Italic': 'Italic',
            'Strikethroughs': 'Strikethrough',
            'Underlines': 'Underline',
            'Superscript': 'Superscript',
            'Subscript': 'Subscript',
            'Align left': 'Align Left',
            'Align right': 'Align Right',
            'Center': 'Center',
            'Justify': 'Justify',
            'Font color': 'Font Color',
            'Text Align': 'Text Align',
            'Text Properties': 'Font Style',
            'Draw Signature': 'Draw Signature',
            'Draw Ink': 'Draw Ink',
            'Create': 'Create',
            'Font family': 'Font Family',
            'Font size': 'Font Size',
            'Free Text': 'Free Text',
            'Import Failed': 'Invalid JSON file type or file name; please select a valid JSON file',
            'File not found': 'Imported JSON file is not found in the desired location',
            'Export Failed': 'Export annotations action has failed; please ensure annotations are added properly',
            'of': 'of ',
            'Dynamic': 'Dynamic',
            'Standard Business': 'Standard Business',
            'Sign Here': 'Sign Here',
            'Custom Stamp': 'Custom Stamp'
        };
        _this.viewerBase = new PdfViewerBase(_this);
        _this.drawing = new Drawing(_this);
        return _this;
    }
    Object.defineProperty(PdfViewer.prototype, "zoomPercentage", {
        /**
         * Returns the current zoom percentage of the PdfViewer control.
         * @asptype int
         * @blazorType int
         */
        get: function () {
            return this.magnificationModule.zoomFactor * 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "bookmark", {
        /**
         * Gets the bookmark view object of the pdf viewer.
         * @asptype BookmarkView
         * @blazorType BookmarkView
         * @returns { BookmarkView }
         */
        get: function () {
            return this.bookmarkViewModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "print", {
        /**
         * Gets the print object of the pdf viewer.
         * @asptype Print
         * @blazorType Print
         * @returns { Print }
         */
        get: function () {
            return this.printModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "magnification", {
        /**
         * Gets the magnification object of the pdf viewer.
         * @asptype Magnification
         * @blazorType Magnification
         * @returns { Magnification }
         */
        get: function () {
            return this.magnificationModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "navigation", {
        /**
         * Gets the navigation object of the pdf viewer.
         * @asptype Navigation
         * @blazorType Navigation
         * @returns { Navigation }
         */
        get: function () {
            return this.navigationModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "textSearch", {
        /**
         * Gets the text search object of the pdf viewer.
         * @asptype TextSearch
         * @blazorType TextSearch
         * @returns { TextSearch }
         */
        get: function () {
            return this.textSearchModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "toolbar", {
        /**
         * Gets the toolbar object of the pdf viewer.
         * @asptype Toolbar
         * @blazorType Toolbar
         * @returns { Toolbar }
         */
        get: function () {
            return this.toolbarModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "thumbnailView", {
        /**
         * Gets the thumbnail-view object of the pdf viewer.
         * @asptype ThumbnailView
         * @blazorType ThumbnailView
         * @returns { ThumbnailView }
         */
        get: function () {
            return this.thumbnailViewModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "annotation", {
        /**
         * Gets the annotation object of the pdf viewer.
         * @asptype Annotation
         * @blazorType Annotation
         * @returns { Annotation }
         */
        get: function () {
            return this.annotationModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "textSelection", {
        /**
         * Gets the TextSelection object of the pdf viewer.
         * @asptype TextSelection
         * @blazorType TextSelection
         * @returns { TextSelection }
         */
        get: function () {
            return this.textSelectionModule;
        },
        enumerable: true,
        configurable: true
    });
    PdfViewer.prototype.preRender = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    PdfViewer.prototype.render = function () {
        this.viewerBase.initializeComponent();
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        }
        else {
            this.viewerBase.disableTextSelectionMode();
        }
        this.drawing.renderLabels(this);
        this.renderComplete();
    };
    PdfViewer.prototype.getModuleName = function () {
        return 'PdfViewer';
    };
    /**
     * @private
     */
    PdfViewer.prototype.getLocaleConstants = function () {
        return this.defaultLocale;
    };
    /**
     * To modify the Json Data in ajax request.
     * @returns void
     * @deprecated
     */
    // tslint:disable-next-line
    PdfViewer.prototype.setJsonData = function (jsonData) {
        this.viewerBase.ajaxData = jsonData;
    };
    PdfViewer.prototype.onPropertyChanged = function (newProp, oldProp) {
        var requireRefresh = false;
        if (this.isDestroyed) {
            return;
        }
        var properties = Object.keys(newProp);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            switch (prop) {
                case 'locale':
                    if (this.viewerBase.loadedData) {
                        // tslint:disable-next-line
                        var data = window.sessionStorage.getItem(this.viewerBase.documentId + '_formfields');
                        this.viewerBase.formfieldvalue = JSON.parse(data);
                        // tslint:disable-next-line
                        var annotCollection = this.annotationCollection;
                        var filename = this.viewerBase.jsonDocumentId;
                        _super.prototype.refresh.call(this);
                        this.load(this.viewerBase.loadedData, null);
                        this.addAnnotation(annotCollection);
                        this.viewerBase.loadedData = null;
                        this.downloadFileName = filename;
                        this.fileName = filename;
                    }
                    break;
                case 'enableToolbar':
                    this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                    requireRefresh = true;
                    break;
                case 'enableCommentPanel':
                    this.notify('', { module: 'annotation', enable: this.enableCommentPanel });
                    requireRefresh = true;
                    if (this.toolbarModule && this.toolbarModule.annotationToolbarModule) {
                        this.toolbarModule.annotationToolbarModule.enableCommentPanelTool(this.enableCommentPanel);
                    }
                    if (!this.enableCommentPanel) {
                        if (this.viewerBase.navigationPane) {
                            this.viewerBase.navigationPane.closeCommentPanelContainer();
                        }
                    }
                    break;
                case 'documentPath':
                    this.load(newProp.documentPath, null);
                    break;
                case 'interactionMode':
                    this.interactionMode = newProp.interactionMode;
                    if (newProp.interactionMode === 'Pan') {
                        this.viewerBase.initiatePanning();
                        if (this.toolbar) {
                            this.toolbar.updateInteractionTools(false);
                        }
                    }
                    else if (newProp.interactionMode === 'TextSelection') {
                        this.viewerBase.initiateTextSelectMode();
                        if (this.toolbar) {
                            this.toolbar.updateInteractionTools(true);
                        }
                    }
                    break;
                case 'height':
                    this.height = newProp.height;
                    this.viewerBase.updateHeight();
                    this.viewerBase.onWindowResize();
                    if (this.toolbar.annotationToolbarModule && this.toolbar.annotationToolbarModule.isToolbarHidden) {
                        this.toolbar.annotationToolbarModule.adjustViewer(false);
                    }
                    else {
                        this.toolbar.annotationToolbarModule.adjustViewer(true);
                    }
                    break;
                case 'width':
                    this.width = newProp.width;
                    this.viewerBase.updateWidth();
                    this.viewerBase.onWindowResize();
                    break;
                case 'customStamp':
                    this.renderCustomerStamp(this.customStamp[0]);
                    break;
                case 'customStampSettings':
                    if (newProp.customStampSettings.customStamps) {
                        this.renderCustomerStamp(this.customStampSettings.customStamps[0]);
                    }
                    break;
                case 'enableFormFields':
                    if (this.enableFormFields && this.formFieldsModule) {
                        for (var m = 0; m < this.pageCount; m++) {
                            this.formFieldsModule.renderFormFields(m);
                        }
                    }
                    else {
                        this.formFieldsModule = new FormFields(this, this.viewerBase);
                        this.formFieldsModule.formFieldsReadOnly(this.enableFormFields);
                    }
                    break;
                case 'highlightSettings':
                case 'underlineSettings':
                case 'strikethroughSettings':
                    if (this.annotationModule && this.annotationModule.textMarkupAnnotationModule) {
                        this.annotationModule.textMarkupAnnotationModule.updateTextMarkupSettings(prop);
                    }
                    break;
            }
        }
    };
    // tslint:disable-next-line
    PdfViewer.prototype.renderCustomerStamp = function (customStamp) {
        this.annotation.stampAnnotationModule.isStampAddMode = true;
        this.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
        this.viewerBase.stampAdded = true;
        this.viewerBase.isAlreadyAdded = false;
        // tslint:disable-next-line:max-line-length
        this.annotation.stampAnnotationModule.createCustomStampAnnotation(customStamp.customStampImageSource, customStamp.customStampName);
    };
    PdfViewer.prototype.getPersistData = function () {
        return 'PdfViewer';
    };
    PdfViewer.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableMagnification) {
            modules.push({
                member: 'Magnification', args: [this, this.viewerBase]
            });
        }
        if (this.enableNavigation) {
            modules.push({
                member: 'Navigation', args: [this, this.viewerBase]
            });
        }
        if (this.enableToolbar || this.enableNavigationToolbar) {
            modules.push({
                member: 'Toolbar', args: [this, this.viewerBase]
            });
        }
        if (this.enableHyperlink) {
            modules.push({
                member: 'LinkAnnotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableThumbnail) {
            modules.push({
                member: 'ThumbnailView', args: [this, this.viewerBase]
            });
        }
        if (this.enableBookmark) {
            modules.push({
                member: 'BookmarkView', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSelection) {
            modules.push({
                member: 'TextSelection', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSearch) {
            modules.push({
                member: 'TextSearch', args: [this, this.viewerBase]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: [this, this.viewerBase]
            });
        }
        if (this.enableAnnotation) {
            modules.push({
                member: 'Annotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableFormFields) {
            modules.push({
                member: 'FormFields', args: [this, this.viewerBase]
            });
        }
        return modules;
    };
    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
     * @returns void
     */
    PdfViewer.prototype.load = function (document, password) {
        if (this.pageCount !== 0) {
            this.viewerBase.clear(true);
        }
        else {
            this.viewerBase.clear(false);
        }
        this.pageCount = 0;
        this.currentPageNumber = 0;
        if (!isBlazor()) {
            if (this.toolbarModule) {
                this.toolbarModule.resetToolbar();
            }
        }
        this.viewerBase.initiatePageRender(document, password);
    };
    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    PdfViewer.prototype.download = function () {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    };
    /**
     * Saves the PDF document being loaded in the PDF Viewer control as blob.
     * @returns Promise<Blob>
     */
    PdfViewer.prototype.saveAsBlob = function () {
        var _this = this;
        if (this.enableDownload) {
            return new Promise(function (resolve, reject) {
                resolve(_this.viewerBase.saveAsBlob());
            });
        }
        else {
            return null;
        }
    };
    /**
     * updates the PDF Viewer container width and height from externally.
     * @returns void
     */
    PdfViewer.prototype.updateViewerContainer = function () {
        this.viewerBase.updateViewerContainer();
    };
    /**
     * Specifies the message to be displayed  in the popup.
     * @returns void
     */
    PdfViewer.prototype.showNotificationPopup = function (errorString) {
        this.viewerBase.showNotificationPopup(errorString);
    };
    /**
     * Update the form field values from externally.
     * @returns void
     */
    // tslint:disable-next-line
    PdfViewer.prototype.updateFormFieldsValue = function (fieldValue) {
        // tslint:disable-next-line
        var target = document.getElementById(fieldValue.id);
        if (fieldValue.type === 'Textbox' || fieldValue.type === 'Password') {
            target.value = fieldValue.value;
        }
        else if (fieldValue.type === 'RadioButton' || fieldValue.type === 'CheckBox') {
            if (fieldValue.type === 'CheckBox') {
                target.style.appearance = 'auto';
            }
            target.checked = fieldValue.value;
        }
        else if (fieldValue.type === 'DropDown' || fieldValue.type === 'ListBox') {
            target.options[target.selectedIndex].text = fieldValue.value;
        }
        if (fieldValue.type === 'SignatureField') {
            this.formFieldsModule.drawSignature(fieldValue.signatureType, fieldValue.value, target, fieldValue.fontName);
        }
        else {
            this.formFieldsModule.updateDataInSession(target);
        }
    };
    /**
     * Perform undo action for the edited annotations
     * @returns void
     */
    PdfViewer.prototype.undo = function () {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    };
    /**
     * Perform redo action for the edited annotations
     * @returns void
     */
    PdfViewer.prototype.redo = function () {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    };
    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     * @returns void
     */
    PdfViewer.prototype.unload = function () {
        this.viewerBase.clear(true);
        this.pageCount = 0;
        if (!isBlazor()) {
            this.toolbarModule.resetToolbar();
        }
        else {
            this._dotnetInstance.invokeMethodAsync('ResetToolbar');
            this.viewerBase.blazorUIAdaptor.resetToolbar();
        }
        this.magnificationModule.zoomTo(100);
    };
    /**
     * Destroys all managed resources used by this object.
     */
    PdfViewer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (!isNullOrUndefined(this.element)) {
            if (!this.refreshing) {
                this.element.classList.remove('e-pdfviewer');
            }
            this.element.innerHTML = '';
        }
        this.viewerBase.destroy();
    };
    // tslint:disable-next-line
    /**
     * Perform imports annotations action in the PDF Viewer
     * @param  {any} importData - Specifies the data for annotation imports
     * @returns void
     */
    // tslint:disable-next-line
    PdfViewer.prototype.importAnnotation = function (importData, annotationDataFormat) {
        if (this.annotationModule) {
            if (typeof (importData) === 'string') {
                if (importData.split('.')[1] === 'json') {
                    this.viewerBase.importAnnotations(importData, AnnotationDataFormat.Json);
                }
                else {
                    this.viewerBase.importAnnotations(importData, AnnotationDataFormat.Xfdf);
                }
            }
            else {
                this.viewerBase.importAnnotations(importData);
            }
        }
    };
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns void
     */
    PdfViewer.prototype.exportAnnotation = function (annotationDataFormat) {
        if (this.annotationModule) {
            if (annotationDataFormat && annotationDataFormat === 'Xfdf') {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Xfdf);
            }
            else {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Json);
            }
        }
    };
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    PdfViewer.prototype.exportAnnotationsAsObject = function () {
        var _this = this;
        if (this.annotationModule) {
            return new Promise(function (resolve, reject) {
                _this.viewerBase.exportAnnotationsAsObject().then(function (value) {
                    resolve(value);
                });
            });
        }
        else {
            return null;
        }
    };
    /**
     * Perform to add annotations in the PDF Viewer
     * @returns void
     */
    // tslint:disable-next-line
    PdfViewer.prototype.addAnnotation = function (annotation) {
        if (this.viewerBase) {
            this.viewerBase.addAnnotation(annotation);
        }
    };
    // tslint:disable-next-line
    /**
     * Perform  action in the PDF Viewer
     * @returns void
     */
    // tslint:disable-next-line
    PdfViewer.prototype.importFormFields = function (formFields) {
        if (this.formFieldsModule) {
            this.viewerBase.importFormFields(formFields);
        }
    };
    /**
     * Perform export action in the PDF Viewer
     * @returns void
     */
    PdfViewer.prototype.exportFormFields = function (path) {
        if (this.formFieldsModule) {
            this.viewerBase.exportFormFields(path);
        }
    };
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    PdfViewer.prototype.exportFormFieldsAsObject = function () {
        var _this = this;
        if (this.formFieldsModule) {
            return new Promise(function (resolve, reject) {
                _this.viewerBase.exportFormFieldsAsObject().then(function (value) {
                    resolve(value);
                });
            });
        }
        else {
            return null;
        }
    };
    /**
     * reset all form fields data
     * @returns void
     */
    PdfViewer.prototype.resetFormFields = function () {
        this.formFieldsModule.resetFormFields();
    };
    /**
     * clear all form fields data
     * @returns void
     */
    PdfViewer.prototype.clearFormFields = function () {
        this.formFieldsModule.clearFormFields();
    };
    /**
     * To delete the annotation Collections in the PDF Document.
     * @returns void
     */
    PdfViewer.prototype.deleteAnnotations = function () {
        if (this.annotationModule) {
            this.viewerBase.deleteAnnotations();
        }
    };
    /**
     * To retrieve the form fields in the PDF Document.
     * @returns void
     */
    PdfViewer.prototype.retrieveFormFields = function () {
        return this.formFieldCollections;
    };
    /**
     * To update the form fields in the PDF Document.
     * @returns void
     */
    // tslint:disable-next-line
    PdfViewer.prototype.updateFormFields = function (formFields) {
        this.formFieldsModule.updateFormFieldValues(formFields);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAjaxRequestInitiate = function (JsonData) {
        var eventArgs = { name: 'ajaxRequestInitiate', JsonData: JsonData };
        this.trigger('ajaxRequestInitiate', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireButtonFieldClickEvent = function (value, fieldName, id) {
        var eventArgs = { name: 'buttonFieldClicked', buttonFieldValue: value, buttonFieldName: fieldName, id: id };
        this.trigger('buttonFieldClick', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireDocumentLoad = function (pageData) {
        var eventArgs = { name: 'documentLoad', documentName: this.fileName, pageData: pageData };
        this.trigger('documentLoad', eventArgs);
        if (isBlazor()) {
            //this._dotnetInstance.invokeMethodAsync('LoadDocument', null);
            this.viewerBase.blazorUIAdaptor.loadDocument();
        }
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDocumentUnload = function (fileName) {
        var eventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDocumentLoadFailed = function (isPasswordRequired, password) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireAjaxRequestFailed = function (errorStatusCode, errorMessage, action, retryCount) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage, action: action };
        if (retryCount) {
            eventArgs.retryCount = true;
        }
        this.trigger('ajaxRequestFailed', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireValidatedFailed = function (action) {
        if (!isBlazor()) {
            // tslint:disable-next-line:max-line-length
            var eventArgs = { formField: this.viewerBase.createFormfieldsJsonData(), documentName: this.fileName, nonFillableFields: this.formFieldsModule.nonFillableFields };
            this.trigger('validateFormFields', eventArgs);
        }
        else {
            // tslint:disable-next-line
            var eventArgs = {};
            eventArgs.documentName = this.fileName;
            eventArgs.formFields = this.formFieldCollections;
            eventArgs.nonFillableFields = this.formFieldsModule.nonFillableFields;
            this.trigger('validateFormFields', eventArgs);
        }
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePageClick = function (x, y, pageNumber) {
        var eventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePageChange = function (previousPageNumber) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
        if (isBlazor()) {
            //this._dotnetInstance.invokeMethodAsync('OnPageChanged', this.currentPageNumber);
            this.viewerBase.blazorUIAdaptor.pageChanged(this.currentPageNumber);
        }
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireZoomChange = function () {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireHyperlinkClick = function (hyperlink, hyperlinkElement) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink, hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkClick', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireHyperlinkHover = function (hyperlinkElement) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'hyperlinkMouseOver', hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkMouseOver', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireFocusOutFormField = function (fieldName, value) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'formFieldFocusOut', fieldName: fieldName, value: value };
        // tslint:disable-next-line
        this.trigger('formFieldFocusOut', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationAdd = function (pageNumber, index, type, bounds, settings, textMarkupContent, tmStartIndex, tmEndIndex, labelSettings, multiPageCollection) {
        var eventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            if (isBlazor()) {
                eventArgs.annotationSettings.textMarkupContent = textMarkupContent;
                eventArgs.annotationSettings.textMarkupStartIndex = tmStartIndex;
                eventArgs.annotationSettings.textMarkupEndIndex = tmEndIndex;
            }
            else {
                eventArgs.textMarkupContent = textMarkupContent;
                eventArgs.textMarkupStartIndex = tmStartIndex;
                eventArgs.textMarkupEndIndex = tmEndIndex;
            }
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.viewerBase.isAnnotationSelect = false;
        this.trigger('annotationAdd', eventArgs);
        if (isBlazor()) {
            // this._dotnetInstance.invokeMethodAsync('AnnotationAdd', null);
            this.viewerBase.blazorUIAdaptor.annotationAdd();
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationRemove = function (pageNumber, index, type, bounds, textMarkupContent, tmStartIndex, tmEndIndex, multiPageCollection) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBounds: bounds };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationRemove', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireBeforeAddFreeTextAnnotation = function (value) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'beforeAddFreeText', value: value };
        // tslint:disable-next-line
        this.trigger('beforeAddFreeText', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireCommentAdd = function (id, text, annotation) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'CommentAdd', id: id, text: text, annotation: annotation };
        // tslint:disable-next-line
        this.trigger('commentAdd', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireCommentEdit = function (id, text, annotation) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'CommentEdit', id: id, text: text, annotation: annotation };
        // tslint:disable-next-line
        this.trigger('commentEdit', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireCommentDelete = function (id, text, annotation) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'CommentDelete', id: id, text: text, annotation: annotation };
        // tslint:disable-next-line
        this.trigger('commentDelete', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireCommentSelect = function (id, text, annotation) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'CommentSelect', id: id, text: text, annotation: annotation };
        // tslint:disable-next-line
        this.trigger('commentSelect', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireCommentStatusChanged = function (id, text, annotation, statusChange) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'CommentStatusChanged', id: id, text: text, annotation: annotation, status: statusChange };
        // tslint:disable-next-line
        this.trigger('commentStatusChanged', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationPropertiesChange = function (pageNumber, index, type, isColorChanged, isOpacityChanged, isTextChanged, isCommentsChanged, textMarkupContent, tmStartIndex, tmEndIndex, multiPageCollection) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged, isTextChanged: isTextChanged, isCommentsChanged: isCommentsChanged };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationPropertiesChange', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignatureAdd = function (pageNumber, index, type, bounds, opacity, strokeColor, thickness) {
        var eventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds, opacity: opacity };
        if (thickness) {
            eventArgs.thickness = thickness;
        }
        if (strokeColor) {
            eventArgs.strokeColor = strokeColor;
        }
        this.trigger('addSignature', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignatureRemove = function (pageNumber, index, type, bounds) {
        var eventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds };
        this.trigger('removeSignature', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignatureMove = function (pageNumber, id, type, opacity, strokeColor, thickness, previousPosition, currentPosition) {
        var eventArgs = { pageIndex: pageNumber, id: id, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('moveSignature', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignaturePropertiesChange = function (pageNumber, index, type, isStrokeColorChanged, isOpacityChanged, isThicknessChanged, oldProp, newProp) {
        var eventArgs = { pageIndex: pageNumber, id: index, type: type, isStrokeColorChanged: isStrokeColorChanged, isOpacityChanged: isOpacityChanged, isThicknessChanged: isThicknessChanged, oldValue: oldProp, newValue: newProp };
        this.trigger('signaturePropertiesChange', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignatureResize = function (pageNumber, index, type, opacity, strokeColor, thickness, currentPosition, previousPosition) {
        var eventArgs = { pageIndex: pageNumber, id: index, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, currentPosition: currentPosition, previousPosition: previousPosition };
        this.trigger('resizeSignature', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireSignatureSelect = function (id, pageNumber, signature) {
        var eventArgs = { id: id, pageIndex: pageNumber, signature: signature };
        this.trigger('signatureSelect', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationSelect = function (id, pageNumber, annotation, annotationCollection, multiPageCollection, isSelected, annotationAddMode) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        if (annotationCollection) {
            // tslint:disable-next-line:max-line-length
            eventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation, annotationCollection: annotationCollection };
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        if (isSelected) {
            eventArgs.isProgrammaticSelection = isSelected;
        }
        if (annotationAddMode) {
            eventArgs.annotationAddMode = annotationAddMode;
        }
        if (isBlazor()) {
            if (annotation.type === 'FreeText') {
                // tslint:disable-next-line
                var fontStyle = { isBold: false, isItalic: false, isStrikeout: false, isUnderline: false };
                if (annotation.fontStyle === 1) {
                    fontStyle.isBold = true;
                }
                else if (annotation.fontStyle === 2) {
                    fontStyle.isItalic = true;
                }
                else if (annotation.fontStyle === 3) {
                    fontStyle.isStrikeout = true;
                }
                else if (annotation.fontStyle === 4) {
                    fontStyle.isUnderline = true;
                }
                annotation.fontStyle = fontStyle;
            }
            //this._dotnetInstance.invokeMethodAsync('AnnotationSelect', annotation.type);
            this.viewerBase.blazorUIAdaptor.annotationSelect(annotation.type);
        }
        this.trigger('annotationSelect', eventArgs);
    };
    /**
     *  @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationUnSelect = function (id, pageNumber, annotation) {
        if (isBlazor()) {
            this.viewerBase.blazorUIAdaptor.annotationUnSelect();
        }
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationUnSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationUnSelect', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationDoubleClick = function (id, pageNumber, annotation) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationDblClick', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationDoubleClick', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireTextSelectionStart = function (pageNumber) {
        this.isTextSelectionStarted = true;
        var eventArgs = { pageIndex: pageNumber };
        this.trigger('textSelectionStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireTextSelectionEnd = function (pageNumber, text, bound) {
        if (this.isTextSelectionStarted) {
            var eventArgs = { pageIndex: pageNumber, textContent: text, textBounds: bound };
            this.trigger('textSelectionEnd', eventArgs);
            this.isTextSelectionStarted = false;
        }
    };
    /**
     * @private
     */
    PdfViewer.prototype.renderDrawing = function (canvas, index) {
        if (!index && this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if (this.annotation) {
            this.annotation.renderAnnotations(index, null, null, null, canvas);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationResize = function (pageNumber, index, type, bounds, settings, textMarkupContent, tmStartIndex, tmEndIndex, labelSettings, multiPageCollection) {
        var eventArgs = { name: 'annotationResize', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationResize', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationMove = function (pageNumber, id, type, annotationSettings, previousPosition, currentPosition) {
        var eventArgs = { name: 'annotationMove', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMove', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationMouseover = function (id, pageNumber, annotationType, bounds, annotation, currentPosition, mousePosition) {
        var eventArgs = { name: 'annotationMouseover', annotationId: id, pageIndex: pageNumber, annotationType: annotationType, annotationBounds: bounds, annotation: annotation, pageX: currentPosition.left, pageY: currentPosition.top, X: mousePosition.left, Y: mousePosition.top };
        if (isBlazor()) {
            if (annotation.subject === 'Perimeter calculation') {
                eventArgs.annotationType = 'Perimeter';
            }
            else if (annotation.subject === 'Area calculation') {
                eventArgs.annotationType = 'Area';
            }
            else if (annotation.subject === 'Volume calculation') {
                eventArgs.annotationType = 'Volume';
            }
            else if (annotation.subject === 'Arrow') {
                eventArgs.annotationType = 'Arrow';
            }
            else if (annotation.subject === 'Circle') {
                eventArgs.annotationType = 'Circle';
            }
        }
        this.trigger('annotationMouseover', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationMouseLeave = function (pageNumber) {
        var eventArgs = { name: 'annotationMouseLeave', pageIndex: pageNumber };
        this.trigger('annotationMouseLeave', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePageMouseover = function (pageX, pageY) {
        var eventArgs = { pageX: pageX, pageY: pageY };
        this.trigger('pageMouseover', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDownloadStart = function (fileName) {
        var eventArgs = { fileName: fileName };
        this.trigger('downloadStart', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDownloadEnd = function (fileName, downloadData) {
        var eventArgs = { fileName: fileName, downloadDocument: downloadData };
        this.trigger('downloadEnd', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.firePrintStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var eventArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventArgs = { fileName: this.downloadFileName, cancel: false };
                        if (!isBlazor) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.triggerEvent('printStart', eventArgs)];
                    case 1:
                        eventArgs = (_a.sent()) || eventArgs;
                        return [3 /*break*/, 3];
                    case 2:
                        this.triggerEvent('printStart', eventArgs);
                        _a.label = 3;
                    case 3:
                        if (!eventArgs.cancel) {
                            this.printModule.print();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     */
    PdfViewer.prototype.triggerEvent = function (eventName, args) {
        return __awaiter(this, void 0, void 0, function () {
            var eventArgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.trigger(eventName, args)];
                    case 1:
                        eventArgs = _a.sent();
                        if (isBlazor && typeof eventArgs === 'string') {
                            eventArgs = JSON.parse(eventArgs);
                        }
                        return [2 /*return*/, eventArgs];
                }
            });
        });
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePrintEnd = function (fileName) {
        var eventArgs = { fileName: fileName };
        this.trigger('printEnd', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireThumbnailClick = function (pageNumber) {
        var eventArgs = { name: 'thumbnailClick', pageNumber: pageNumber };
        this.trigger('thumbnailClick', eventArgs);
    };
    /**
     *
     * @private
     */
    PdfViewer.prototype.fireBookmarkClick = function (pageNumber, position, text, fileName) {
        // tslint:disable-next-line
        var eventArgs = { name: 'bookmarkClick', pageNumber: pageNumber, position: position, text: text, fileName: fileName };
        this.trigger('bookmarkClick', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireImportStart = function (importData) {
        var eventArgs = { name: 'importAnnotationsStart', importData: importData, formFieldData: null };
        this.trigger('importStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireExportStart = function (exportData) {
        var eventArgs = { name: 'exportAnnotationsStart', exportData: exportData, formFieldData: null };
        this.trigger('exportStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireImportSuccess = function (importData) {
        var eventArgs = { name: 'importAnnotationsSuccess', importData: importData, formFieldData: null };
        this.trigger('importSuccess', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireExportSuccess = function (exportData, fileName) {
        var eventArgs = { name: 'exportAnnotationsSuccess', exportData: exportData, fileName: fileName, formFieldData: null };
        this.trigger('exportSuccess', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireImportFailed = function (data, errorDetails) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'importAnnotationsFailed', importData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('importFailed', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireExportFailed = function (data, errorDetails) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'exportAnnotationsFailed', exportData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('exportFailed', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormImportStarted = function (data) {
        var eventArgs = { name: 'importFormFieldsStart', importData: null, formFieldData: data };
        this.trigger('importStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormExportStarted = function (data) {
        var eventArgs = { name: 'exportFormFieldsStart', exportData: null, formFieldData: data };
        this.trigger('exportStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormImportSuccess = function (data) {
        var eventArgs = { name: 'importFormFieldsSuccess', importData: data, formFieldData: data };
        this.trigger('importSuccess', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormExportSuccess = function (data, fileName) {
        var eventArgs = { name: 'exportFormFieldsSuccess', exportData: data, fileName: fileName, formFieldData: data };
        this.trigger('exportSuccess', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormImportFailed = function (data, errorDetails) {
        //tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'importFormFieldsfailed', importData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('importFailed', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireFormExportFailed = function (data, errorDetails) {
        //tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'exportFormFieldsFailed', exportData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('exportFailed', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireTextExtractionCompleted = function (documentCollection) {
        var eventArgs = { documentTextCollection: documentCollection };
        this.trigger('extractTextCompleted', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireTextSearchStart = function (searchText, isMatchcase) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'textSearchStart', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchStart', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireTextSearchComplete = function (searchText, isMatchcase) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'textSearchComplete', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchComplete', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireTextSearchHighlight = function (searchText, isMatchcase, bounds, pageNumber) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'textSearchHighlight', searchText: searchText, matchCase: isMatchcase, bounds: bounds, pageNumber: pageNumber };
        this.trigger('textSearchHighlight', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.renderAdornerLayer = function (bounds, commonStyle, cavas, index) {
        renderAdornerLayer(bounds, commonStyle, cavas, index, this);
    };
    /**
     * @private
     */
    PdfViewer.prototype.renderSelector = function (index, currentSelector) {
        this.drawing.renderSelector(index, currentSelector);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PdfViewer.prototype.select = function (objArray, currentSelector, multipleSelection, preventUpdate) {
        var annotationSelect = this.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        // tslint:disable-next-line
        var annotation = this.selectedItems.annotations[0];
        if (annotationSelect) {
            this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect, true);
        }
        if (!multipleSelection) {
            if (this.viewerBase.activeElements && this.viewerBase.activeElements.activePageID >= 0) {
                if (annotation) {
                    this.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                }
                this.clearSelection(this.viewerBase.activeElements.activePageID);
            }
        }
        this.drawing.select(objArray, currentSelector, multipleSelection, preventUpdate);
    };
    /**
     * @private
     */
    PdfViewer.prototype.getPageTable = function (pageId) {
        return this.drawing.getPageTable(pageId);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PdfViewer.prototype.dragSelectedObjects = function (diffX, diffY, pageIndex, currentSelector, helper) {
        return this.drawing.dragSelectedObjects(diffX, diffY, pageIndex, currentSelector, helper);
    };
    /**
     * @private
     */
    PdfViewer.prototype.scaleSelectedItems = function (sx, sy, pivot) {
        return this.drawing.scaleSelectedItems(sx, sy, pivot);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PdfViewer.prototype.dragConnectorEnds = function (endPoint, obj, point, segment, target, targetPortId, currentSelector) {
        return this.drawing.dragConnectorEnds(endPoint, obj, point, segment, target, null, currentSelector);
    };
    /**
     * @private
     */
    PdfViewer.prototype.clearSelection = function (pageId) {
        var selectormodel = this.selectedItems;
        if (selectormodel.annotations.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.annotations = [];
            selectormodel.wrapper = null;
        }
        this.drawing.clearSelectorLayer(pageId);
        this.viewerBase.isAnnotationSelect = false;
    };
    /**
     * @private
     */
    PdfViewer.prototype.add = function (obj) {
        return this.drawing.add(obj);
    };
    /**
     * @private
     */
    PdfViewer.prototype.remove = function (obj) {
        return this.drawing.remove(obj);
    };
    /**
     * @private
     */
    PdfViewer.prototype.copy = function () {
        this.annotation.isShapeCopied = true;
        return this.drawing.copy();
    };
    /**
     * @private
     */
    PdfViewer.prototype.rotate = function (angle, currentSelector) {
        return this.drawing.rotate(this.selectedItems, angle, null, currentSelector);
    };
    /**
     * @private
     */
    PdfViewer.prototype.paste = function (obj) {
        var index;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        return this.drawing.paste(obj, index || 0);
    };
    /**
     * @private
     */
    PdfViewer.prototype.refresh = function () {
        for (var i = 0; i < this.annotations.length; i++) {
            if (this.zIndexTable.length !== undefined) {
                var notFound = true;
                for (var i_1 = 0; i_1 < this.zIndexTable.length; i_1++) {
                    var objects = this.zIndexTable[i_1].objects;
                    for (var j = 0; j < objects.length; j++) {
                        objects.splice(j, 1);
                    }
                    delete this.zIndexTable[i_1];
                }
                if (this.annotations[i]) {
                    delete this.annotations[i];
                }
                if (this.selectedItems.annotations && this.selectedItems.annotations[i]) {
                    delete this.selectedItems.annotations[i];
                }
                this.zIndexTable = [];
                this.renderDrawing();
            }
            if (this.annotations && this.annotations.length !== 0) {
                this.annotations.length = 0;
                this.selectedItems.annotations.length = 0;
            }
        }
    };
    /**
     * @private
     */
    PdfViewer.prototype.cut = function () {
        var index;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        this.annotation.isShapeCopied = true;
        return this.drawing.cut(index || 0);
    };
    /**
     * @private
     */
    PdfViewer.prototype.nodePropertyChange = function (actualObject, node) {
        this.drawing.nodePropertyChange(actualObject, node);
    };
    /**
     * @private
     */
    PdfViewer.prototype.checkBoundaryConstraints = function (tx, ty, pageIndex, nodeBounds, isStamp) {
        return this.drawing.checkBoundaryConstraints(tx, ty, pageIndex, nodeBounds, isStamp);
    };
    __decorate([
        Property()
    ], PdfViewer.prototype, "serviceUrl", void 0);
    __decorate([
        Property(0)
    ], PdfViewer.prototype, "pageCount", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isDocumentEdited", void 0);
    __decorate([
        Property(0)
    ], PdfViewer.prototype, "currentPageNumber", void 0);
    __decorate([
        Property()
    ], PdfViewer.prototype, "documentPath", void 0);
    __decorate([
        Property()
    ], PdfViewer.prototype, "downloadFileName", void 0);
    __decorate([
        Property('auto')
    ], PdfViewer.prototype, "height", void 0);
    __decorate([
        Property('auto')
    ], PdfViewer.prototype, "width", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableToolbar", void 0);
    __decorate([
        Property(1)
    ], PdfViewer.prototype, "retryCount", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "showNotificationDialog", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableNavigationToolbar", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableCommentPanel", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isCommandPanelOpen", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableTextMarkupResizer", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableMultiLineOverlap", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isValidFreeText", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isAnnotationToolbarOpen", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableMultiPageAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableDownload", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enablePrint", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableThumbnail", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isThumbnailViewOpen", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isSignatureEditable", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableBookmark", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableBookmarkStyles", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableHyperlink", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableHandwrittenSignature", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableInkAnnotation", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "restrictZoomRequest", void 0);
    __decorate([
        Property('CurrentTab')
    ], PdfViewer.prototype, "hyperlinkOpenState", void 0);
    __decorate([
        Property('RightClick')
    ], PdfViewer.prototype, "contextMenuOption", void 0);
    __decorate([
        Property([])
    ], PdfViewer.prototype, "disableContextMenuItems", void 0);
    __decorate([
        Property({ name: '', id: '', type: '', isReadOnly: false, value: '', signatureType: [''], fontName: '' })
    ], PdfViewer.prototype, "formFieldCollections", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableNavigation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableAutoComplete", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableMagnification", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableShapeLabel", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableImportAnnotationMeasurement", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enablePinchZoom", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableTextSelection", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableTextSearch", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableFormFields", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableFormFieldsValidation", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isFormFieldDocument", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "enableDesktopMode", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "hideSaveSignature", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableFreeText", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableTextMarkupAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableShapeAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableMeasureAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableStampAnnotations", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableStickyNotesAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableAnnotationToolbar", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isBookmarkPanelOpen", void 0);
    __decorate([
        Property('TextSelection')
    ], PdfViewer.prototype, "interactionMode", void 0);
    __decorate([
        Property('Default')
    ], PdfViewer.prototype, "zoomMode", void 0);
    __decorate([
        Property('Default')
    ], PdfViewer.prototype, "signatureFitMode", void 0);
    __decorate([
        Property('Default')
    ], PdfViewer.prototype, "printMode", void 0);
    __decorate([
        Property(0)
    ], PdfViewer.prototype, "zoomValue", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableZoomOptimization", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isExtractText", void 0);
    __decorate([
        Property(false)
    ], PdfViewer.prototype, "isMaintainSelection", void 0);
    __decorate([
        Property('M/d/yyyy h:mm:ss a')
    ], PdfViewer.prototype, "dateTimeFormat", void 0);
    __decorate([
        Property({ showTooltip: true, toolbarItems: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool', 'SubmitForm', 'AnnotationEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'], annotationToolbarItems: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool', 'StampAnnotationTool', 'HandWrittenSignatureTool', 'InkAnnotationTool', 'ShapeTool', 'CalibrateTool', 'StrokeColorEditTool', 'ThicknessEditTool', 'FreeTextAnnotationTool', 'FontFamilyAnnotationTool', 'FontSizeAnnotationTool', 'FontStylesAnnotationTool', 'FontAlignAnnotationTool', 'FontColorAnnotationTool', 'CommentPanelTool'] })
    ], PdfViewer.prototype, "toolbarSettings", void 0);
    __decorate([
        Property({ ajaxHeaders: [], withCredentials: false })
    ], PdfViewer.prototype, "ajaxRequestSettings", void 0);
    __decorate([
        Property({ customStampName: '', customStampImageSource: '' })
    ], PdfViewer.prototype, "customStamp", void 0);
    __decorate([
        Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages', print: 'PrintImages', renderComments: 'RenderAnnotationComments', importAnnotations: 'ImportAnnotations', exportAnnotations: 'ExportAnnotations', importFormFields: 'ImportFormFields', exportFormFields: 'ExportFormFields', renderTexts: 'RenderPdfTexts' })
    ], PdfViewer.prototype, "serverActionSettings", void 0);
    __decorate([
        Property({ signatureIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: 'Sign', color: 'black' } })
    ], PdfViewer.prototype, "signatureFieldSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#FFDF56', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "highlightSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#ff0000', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "strikethroughSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#00ff00', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "underlineSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'None', lineHeadEndStyle: 'None', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "lineSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "arrowSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "rectangleSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ff0000', fontColor: '#000', fontSize: 16, labelHeight: 24.6, labelMaxWidth: 151, labelContent: 'Label' })
    ], PdfViewer.prototype, "shapeLabelSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "circleSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "polygonSettings", void 0);
    __decorate([
        Property({ opacity: 1, author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, dynamicStamps: [DynamicStampItem.Revised, DynamicStampItem.Reviewed, DynamicStampItem.Received, DynamicStampItem.Confidential, DynamicStampItem.Approved, DynamicStampItem.NotApproved], signStamps: [SignStampItem.Witness, SignStampItem.InitialHere, SignStampItem.SignHere, SignStampItem.Accepted, SignStampItem.Rejected], standardBusinessStamps: [StandardBusinessStampItem.Approved, StandardBusinessStampItem.NotApproved, StandardBusinessStampItem.Draft, StandardBusinessStampItem.Final, StandardBusinessStampItem.Completed, StandardBusinessStampItem.Confidential, StandardBusinessStampItem.ForPublicRelease, StandardBusinessStampItem.NotForPublicRelease, StandardBusinessStampItem.ForComment, StandardBusinessStampItem.Void, StandardBusinessStampItem.PreliminaryResults, StandardBusinessStampItem.InformationOnly], allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "stampSettings", void 0);
    __decorate([
        Property({ opacity: 1, author: 'Guest', width: 0, height: 0, left: 0, top: 0, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, enableCustomStamp: true, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "customStampSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, leaderLength: 40, resizeCursorType: CursorType.move, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "distanceSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Open', lineHeadEndStyle: 'Open', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "perimeterSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "areaSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "radiusSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "volumeSettings", void 0);
    __decorate([
        Property({ author: 'Guest', opacity: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "stickyNotesSettings", void 0);
    __decorate([
        Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ffffff00', author: 'Guest', borderWidth: 1, width: 151, fontSize: 16, height: 24.6, fontColor: '#000', fontFamily: 'Helvetica', defaultText: 'Type Here', textAlignment: 'Left', fontStyle: FontStyle.None, allowTextOnly: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "freeTextSettings", void 0);
    __decorate([
        Property({ conversionUnit: 'in', displayUnit: 'in', scaleRatio: 1, depth: 96 })
    ], PdfViewer.prototype, "measurementSettings", void 0);
    __decorate([
        Property({ selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null })
    ], PdfViewer.prototype, "annotationSelectorSettings", void 0);
    __decorate([
        Property({ searchHighlightColor: '#fdd835', searchColor: '#8b4c12' })
    ], PdfViewer.prototype, "textSearchColorSettings", void 0);
    __decorate([
        Property({ opacity: 1, strokeColor: '#000000', width: 150, height: 100, thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'] })
    ], PdfViewer.prototype, "handWrittenSignatureSettings", void 0);
    __decorate([
        Property({ author: 'Guest', opacity: 1, strokeColor: '#ff0000', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    ], PdfViewer.prototype, "inkAnnotationSettings", void 0);
    __decorate([
        Property({ author: 'Guest', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, skipPrint: false, skipDownload: false, allowedInteractions: ['None'] })
    ], PdfViewer.prototype, "annotationSettings", void 0);
    __decorate([
        Property({ enableTileRendering: true, x: 0, y: 0 })
    ], PdfViewer.prototype, "tileRenderingSettings", void 0);
    __decorate([
        Property({ delayPageRequestTimeOnScroll: 100 })
    ], PdfViewer.prototype, "scrollSettings", void 0);
    __decorate([
        Property({ contextMenuAction: 'RightClick', contextMenuItems: [ContextMenuItem.Comment, ContextMenuItem.Copy, ContextMenuItem.Cut, ContextMenuItem.Delete, ContextMenuItem.Highlight, ContextMenuItem.Paste, ContextMenuItem.Properties, ContextMenuItem.ScaleRatio, ContextMenuItem.Strikethrough, ContextMenuItem.Underline] })
    ], PdfViewer.prototype, "contextMenuSettings", void 0);
    __decorate([
        Complex({}, Selector)
    ], PdfViewer.prototype, "selectedItems", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "created", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "documentLoad", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "documentUnload", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "documentLoadFailed", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "ajaxRequestFailed", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "validateFormFields", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "pageClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "pageChange", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "hyperlinkClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "hyperlinkMouseOver", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "zoomChange", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationAdd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationRemove", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationPropertiesChange", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationResize", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "addSignature", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "removeSignature", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "moveSignature", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "signaturePropertiesChange", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "resizeSignature", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "signatureSelect", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationSelect", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationUnSelect", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationDoubleClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationMove", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationMouseover", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationMouseLeave", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "pageMouseover", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "importStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "exportStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "importSuccess", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "exportSuccess", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "importFailed", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "exportFailed", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "extractTextCompleted", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "thumbnailClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "bookmarkClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "textSelectionStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "textSelectionEnd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "downloadStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "buttonFieldClick", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "downloadEnd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "printStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "printEnd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "textSearchStart", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "textSearchComplete", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "textSearchHighlight", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "ajaxRequestInitiate", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "commentAdd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "commentEdit", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "commentDelete", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "commentSelect", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "commentStatusChanged", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "beforeAddFreeText", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "formFieldFocusOut", void 0);
    __decorate([
        Collection([], PdfAnnotationBase)
    ], PdfViewer.prototype, "annotations", void 0);
    __decorate([
        Property()
    ], PdfViewer.prototype, "drawingObject", void 0);
    PdfViewer = __decorate([
        NotifyPropertyChanges
    ], PdfViewer);
    return PdfViewer;
}(Component));
export { PdfViewer };
