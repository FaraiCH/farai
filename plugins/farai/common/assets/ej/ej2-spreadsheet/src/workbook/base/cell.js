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
import { extend, Property, ChildProperty, Complex, Collection, } from '@syncfusion/ej2-base';
import { CellStyle, wrapEvent, Chart } from '../common/index';
import { Image } from '../common/index';
import { getRow } from './index';
import { getSheet } from './sheet';
/**
 * Represents the cell.
 */
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Collection([], Image)
    ], Cell.prototype, "image", void 0);
    __decorate([
        Collection([], Chart)
    ], Cell.prototype, "chart", void 0);
    __decorate([
        Property('')
    ], Cell.prototype, "value", void 0);
    __decorate([
        Property('')
    ], Cell.prototype, "formula", void 0);
    __decorate([
        Property(0)
    ], Cell.prototype, "index", void 0);
    __decorate([
        Property('General')
    ], Cell.prototype, "format", void 0);
    __decorate([
        Complex({}, CellStyle)
    ], Cell.prototype, "style", void 0);
    __decorate([
        Property('')
    ], Cell.prototype, "hyperlink", void 0);
    __decorate([
        Property(false)
    ], Cell.prototype, "wrap", void 0);
    __decorate([
        Property(true)
    ], Cell.prototype, "isLocked", void 0);
    __decorate([
        Property('')
    ], Cell.prototype, "validation", void 0);
    __decorate([
        Property(1)
    ], Cell.prototype, "colSpan", void 0);
    __decorate([
        Property(1)
    ], Cell.prototype, "rowSpan", void 0);
    return Cell;
}(ChildProperty));
export { Cell };
/**
 * @hidden
 */
export function getCell(rowIndex, colIndex, sheet, isInitRow) {
    var row = getRow(sheet, rowIndex);
    if (!row || !row.cells) {
        if (isInitRow) {
            if (!row) {
                sheet.rows[rowIndex] = { cells: [] };
            }
            else {
                sheet.rows[rowIndex].cells = [];
            }
        }
        else {
            return null;
        }
    }
    return sheet.rows[rowIndex].cells[colIndex] || null;
}
/**
 * @hidden
 */
export function setCell(rowIndex, colIndex, sheet, cell, isExtend) {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = { cells: [] };
    }
    else if (!sheet.rows[rowIndex].cells) {
        sheet.rows[rowIndex].cells = [];
    }
    if (isExtend && sheet.rows[rowIndex].cells[colIndex]) {
        extend(sheet.rows[rowIndex].cells[colIndex], cell, null, true);
    }
    else {
        sheet.rows[rowIndex].cells[colIndex] = cell;
    }
}
/** @hidden */
export function skipDefaultValue(style, defaultKey) {
    var defaultProps = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none',
        border: '', borderLeft: '', borderTop: '', borderRight: '', borderBottom: '' };
    var changedProps = {};
    Object.keys(defaultKey ? defaultProps : style).forEach(function (propName) {
        if (style[propName] !== defaultProps[propName]) {
            changedProps[propName] = style[propName];
        }
    });
    return changedProps;
}
/** @hidden */
export function wrap(address, wrap, context) {
    if (wrap === void 0) { wrap = true; }
    var addressInfo = context.getAddressInfo(address);
    var rng = addressInfo.indices;
    var sheet = getSheet(context, addressInfo.sheetIndex);
    for (var i = rng[0]; i <= rng[2]; i++) {
        for (var j = rng[1]; j <= rng[3]; j++) {
            setCell(i, j, sheet, { wrap: wrap }, true);
        }
    }
    context.setProperties({ sheets: context.sheets }, true);
    context.notify(wrapEvent, { range: rng, wrap: wrap, sheet: sheet });
}
