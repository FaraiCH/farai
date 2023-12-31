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
import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { SnapConstraints } from '../enum/enum';
/**
 * Provides a visual guidance while dragging or arranging the objects on the Diagram surface
 */
var Gridlines = /** @class */ (function (_super) {
    __extends(Gridlines, _super);
    function Gridlines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('lightgray')
    ], Gridlines.prototype, "lineColor", void 0);
    __decorate([
        Property('')
    ], Gridlines.prototype, "lineDashArray", void 0);
    __decorate([
        Property([1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75])
    ], Gridlines.prototype, "lineIntervals", void 0);
    __decorate([
        Property([1, 19, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5, 0.5, 19.5])
    ], Gridlines.prototype, "dotIntervals", void 0);
    __decorate([
        Property([20])
    ], Gridlines.prototype, "snapIntervals", void 0);
    return Gridlines;
}(ChildProperty));
export { Gridlines };
/**
 * Defines the gridlines and defines how and when the objects have to be snapped
 * @default {}
 */
var SnapSettings = /** @class */ (function (_super) {
    __extends(SnapSettings, _super);
    function SnapSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Complex({}, Gridlines)
    ], SnapSettings.prototype, "horizontalGridlines", void 0);
    __decorate([
        Complex({}, Gridlines)
    ], SnapSettings.prototype, "verticalGridlines", void 0);
    __decorate([
        Property(SnapConstraints.All)
    ], SnapSettings.prototype, "constraints", void 0);
    __decorate([
        Property(5)
    ], SnapSettings.prototype, "snapAngle", void 0);
    __decorate([
        Property('Lines')
    ], SnapSettings.prototype, "gridType", void 0);
    __decorate([
        Property(5)
    ], SnapSettings.prototype, "snapObjectDistance", void 0);
    return SnapSettings;
}(ChildProperty));
export { SnapSettings };
