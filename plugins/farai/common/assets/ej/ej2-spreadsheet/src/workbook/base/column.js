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
import { Format } from '../common/index';
/**
 * Configures the Column behavior for the spreadsheet.
 */
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], Column.prototype, "index", void 0);
    __decorate([
        Property(64)
    ], Column.prototype, "width", void 0);
    __decorate([
        Property(false)
    ], Column.prototype, "customWidth", void 0);
    __decorate([
        Property(false)
    ], Column.prototype, "hidden", void 0);
    __decorate([
        Complex({}, Format)
    ], Column.prototype, "format", void 0);
    __decorate([
        Property(null)
    ], Column.prototype, "isLocked", void 0);
    return Column;
}(ChildProperty));
export { Column };
/**
 * @hidden
 */
export function getColumn(sheet, colIndex) {
    if (sheet.columns) {
        if (!sheet.columns[colIndex]) {
            sheet.columns[colIndex] = {};
        }
    }
    else {
        sheet.columns = [];
        sheet.columns[colIndex] = {};
    }
    return sheet.columns[colIndex];
}
/** @hidden */
export function setColumn(sheet, colIndex, column) {
    var curColumn = getColumn(sheet, colIndex);
    Object.keys(column).forEach(function (key) {
        curColumn[key] = column[key];
    });
}
/**
 * @hidden
 */
export function getColumnWidth(sheet, index, skipHidden) {
    if (sheet && sheet.columns && sheet.columns[index]) {
        if (!skipHidden && sheet.columns[index].hidden) {
            return 0;
        }
        return (sheet.columns[index].width || sheet.columns[index].customWidth) ? sheet.columns[index].width : 64;
    }
    else {
        return 64;
    }
}
/**
 * @hidden
 */
export function getColumnsWidth(sheet, startCol, endCol) {
    if (endCol === void 0) { endCol = startCol; }
    var width = 0;
    if (startCol > endCol) {
        var swap = startCol;
        startCol = endCol;
        endCol = swap;
    }
    for (var i = startCol; i <= endCol; i++) {
        width += getColumnWidth(sheet, i);
    }
    return width;
}
/** @hidden */
export function isHiddenCol(sheet, index) {
    return sheet.columns[index] && sheet.columns[index].hidden;
}
