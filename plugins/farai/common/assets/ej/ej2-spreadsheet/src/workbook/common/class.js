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
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
/**
 * Represents the cell style.
 */
var CellStyle = /** @class */ (function (_super) {
    __extends(CellStyle, _super);
    function CellStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Calibri')
    ], CellStyle.prototype, "fontFamily", void 0);
    __decorate([
        Property('bottom')
    ], CellStyle.prototype, "verticalAlign", void 0);
    __decorate([
        Property('left')
    ], CellStyle.prototype, "textAlign", void 0);
    __decorate([
        Property('0pt')
    ], CellStyle.prototype, "textIndent", void 0);
    __decorate([
        Property('#000000')
    ], CellStyle.prototype, "color", void 0);
    __decorate([
        Property('#ffffff')
    ], CellStyle.prototype, "backgroundColor", void 0);
    __decorate([
        Property('normal')
    ], CellStyle.prototype, "fontWeight", void 0);
    __decorate([
        Property('normal')
    ], CellStyle.prototype, "fontStyle", void 0);
    __decorate([
        Property('11pt')
    ], CellStyle.prototype, "fontSize", void 0);
    __decorate([
        Property('none')
    ], CellStyle.prototype, "textDecoration", void 0);
    __decorate([
        Property('')
    ], CellStyle.prototype, "border", void 0);
    __decorate([
        Property('')
    ], CellStyle.prototype, "borderTop", void 0);
    __decorate([
        Property('')
    ], CellStyle.prototype, "borderBottom", void 0);
    __decorate([
        Property('')
    ], CellStyle.prototype, "borderLeft", void 0);
    __decorate([
        Property('')
    ], CellStyle.prototype, "borderRight", void 0);
    return CellStyle;
}(ChildProperty));
export { CellStyle };
/**
 * Represents the DefineName.
 */
var DefineName = /** @class */ (function (_super) {
    __extends(DefineName, _super);
    function DefineName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], DefineName.prototype, "name", void 0);
    __decorate([
        Property('')
    ], DefineName.prototype, "scope", void 0);
    __decorate([
        Property('')
    ], DefineName.prototype, "comment", void 0);
    __decorate([
        Property('')
    ], DefineName.prototype, "refersTo", void 0);
    return DefineName;
}(ChildProperty));
export { DefineName };
/**
 * Configures the Protect behavior for the spreadsheet.
 */
var ProtectSettings = /** @class */ (function (_super) {
    __extends(ProtectSettings, _super);
    function ProtectSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], ProtectSettings.prototype, "selectCells", void 0);
    __decorate([
        Property(false)
    ], ProtectSettings.prototype, "formatCells", void 0);
    __decorate([
        Property(false)
    ], ProtectSettings.prototype, "formatRows", void 0);
    __decorate([
        Property(false)
    ], ProtectSettings.prototype, "formatColumns", void 0);
    __decorate([
        Property(false)
    ], ProtectSettings.prototype, "insertLink", void 0);
    return ProtectSettings;
}(ChildProperty));
export { ProtectSettings };
/**
 * Represents the Hyperlink.
 */
var Hyperlink = /** @class */ (function (_super) {
    __extends(Hyperlink, _super);
    function Hyperlink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], Hyperlink.prototype, "address", void 0);
    return Hyperlink;
}(ChildProperty));
export { Hyperlink };
/**
 * Represents the DataValidation.
 */
var Validation = /** @class */ (function (_super) {
    __extends(Validation, _super);
    function Validation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('WholeNumber')
    ], Validation.prototype, "type", void 0);
    __decorate([
        Property('Between')
    ], Validation.prototype, "operator", void 0);
    __decorate([
        Property('0')
    ], Validation.prototype, "value1", void 0);
    __decorate([
        Property('0')
    ], Validation.prototype, "value2", void 0);
    __decorate([
        Property(true)
    ], Validation.prototype, "ignoreBlank", void 0);
    __decorate([
        Property(true)
    ], Validation.prototype, "inCellDropDown", void 0);
    __decorate([
        Property(false)
    ], Validation.prototype, "isHighlighted", void 0);
    return Validation;
}(ChildProperty));
export { Validation };
/**
 * Represents the Format.
 */
var Format = /** @class */ (function (_super) {
    __extends(Format, _super);
    function Format() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('General')
    ], Format.prototype, "format", void 0);
    __decorate([
        Complex({}, CellStyle)
    ], Format.prototype, "style", void 0);
    __decorate([
        Property(true)
    ], Format.prototype, "isLocked", void 0);
    return Format;
}(ChildProperty));
export { Format };
/**
 * Represents the Conditional Formatting.
 */
var ConditionalFormat = /** @class */ (function (_super) {
    __extends(ConditionalFormat, _super);
    function ConditionalFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('GreaterThan')
    ], ConditionalFormat.prototype, "type", void 0);
    __decorate([
        Complex({}, Format)
    ], ConditionalFormat.prototype, "format", void 0);
    __decorate([
        Property('RedFT')
    ], ConditionalFormat.prototype, "cFColor", void 0);
    __decorate([
        Property('')
    ], ConditionalFormat.prototype, "value", void 0);
    __decorate([
        Property('')
    ], ConditionalFormat.prototype, "range", void 0);
    return ConditionalFormat;
}(ChildProperty));
export { ConditionalFormat };
/**
 * Represents the Chart.
 */
var Chart = /** @class */ (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Line')
    ], Chart.prototype, "type", void 0);
    __decorate([
        Property('Material')
    ], Chart.prototype, "theme", void 0);
    __decorate([
        Property(false)
    ], Chart.prototype, "isSeriesInRows", void 0);
    __decorate([
        Property('')
    ], Chart.prototype, "range", void 0);
    __decorate([
        Property('')
    ], Chart.prototype, "id", void 0);
    return Chart;
}(ChildProperty));
export { Chart };
/**
 * Represents the Image.
 */
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], Image.prototype, "src", void 0);
    __decorate([
        Property('')
    ], Image.prototype, "id", void 0);
    __decorate([
        Property(300)
    ], Image.prototype, "height", void 0);
    __decorate([
        Property(400)
    ], Image.prototype, "width", void 0);
    __decorate([
        Property(0)
    ], Image.prototype, "top", void 0);
    __decorate([
        Property(0)
    ], Image.prototype, "left", void 0);
    return Image;
}(ChildProperty));
export { Image };
