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
import { processIdx } from './data';
import { ConditionalFormat } from '../common/index';
import { ProtectSettings } from '../common/index';
import { isUndefined, ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';
/**
 * Configures the range processing for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                  name: 'First Sheet',
 *                  ranges: [{ dataSource: defaultData }],
 *                  rows: [{
 *                          index: 30,
 *                          cells: [{ index: 4, value: 'Total Amount:' },
 *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                  }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
var Range = /** @class */ (function (_super) {
    __extends(Range, _super);
    function Range() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Range.prototype.setProperties = function (prop, muteOnChange) {
        var _this = this;
        var name = 'name';
        var instance = 'instance';
        var parentObj = 'parentObj';
        var currRangeIdx = 'currRangeIdx';
        var controlParent = 'controlParent';
        if (this[parentObj].isComplexArraySetter && this[controlParent] && this[controlParent].isAngular) {
            if (Object.keys(prop).length) {
                if (this[parentObj][currRangeIdx] === undefined) {
                    this[parentObj][currRangeIdx] = 0;
                }
                else {
                    this[parentObj][currRangeIdx] += 1;
                }
                var range = this[parentObj].ranges[this[parentObj][currRangeIdx]];
                if (range && range.info) {
                    this.info = range.info;
                }
                setTimeout(function () {
                    if (_this[parentObj][currRangeIdx] !== undefined) {
                        delete _this[parentObj][currRangeIdx];
                    }
                });
            }
            else if (this[controlParent].tagObjects[0].instance && this[controlParent].tagObjects[0].instance.hasChanges
                && !this[controlParent].tagObjects[0].instance.isInitChanges) {
                var sheetIdx = this[controlParent].sheets.indexOf(this[parentObj]);
                if (this[parentObj].changedRangeIdx === undefined) {
                    var rangeIdx_1;
                    var tagObjects = this[controlParent].tagObjects[0].instance.list[sheetIdx].tagObjects;
                    for (var i = 0; i < tagObjects.length; i++) {
                        if (tagObjects[i][name] === 'ranges') {
                            tagObjects[i][instance].list
                                .forEach(function (range, idx) {
                                if (range.hasChanges) {
                                    rangeIdx_1 = idx;
                                }
                            });
                            break;
                        }
                    }
                    this[parentObj].changedRangeIdx = rangeIdx_1;
                }
            }
        }
        _super.prototype.setProperties.call(this, prop, muteOnChange);
    };
    __decorate([
        Property(null)
    ], Range.prototype, "dataSource", void 0);
    __decorate([
        Property('A1')
    ], Range.prototype, "startCell", void 0);
    __decorate([
        Property(null)
    ], Range.prototype, "query", void 0);
    __decorate([
        Property(true)
    ], Range.prototype, "showFieldAsHeader", void 0);
    __decorate([
        Property('')
    ], Range.prototype, "template", void 0);
    __decorate([
        Property('A1')
    ], Range.prototype, "address", void 0);
    return Range;
}(ChildProperty));
export { Range };
/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
var UsedRange = /** @class */ (function (_super) {
    __extends(UsedRange, _super);
    function UsedRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], UsedRange.prototype, "rowIndex", void 0);
    __decorate([
        Property(0)
    ], UsedRange.prototype, "colIndex", void 0);
    return UsedRange;
}(ChildProperty));
export { UsedRange };
/**
 * Configures the sheet behavior for the spreadsheet.
 */
var Sheet = /** @class */ (function (_super) {
    __extends(Sheet, _super);
    function Sheet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], Sheet.prototype, "rows", void 0);
    __decorate([
        Property([])
    ], Sheet.prototype, "columns", void 0);
    __decorate([
        Complex({}, ProtectSettings)
    ], Sheet.prototype, "protectSettings", void 0);
    __decorate([
        Collection([], Range)
    ], Sheet.prototype, "ranges", void 0);
    __decorate([
        Collection([], ConditionalFormat)
    ], Sheet.prototype, "conditionalFormats", void 0);
    __decorate([
        Property(0)
    ], Sheet.prototype, "index", void 0);
    __decorate([
        Property('')
    ], Sheet.prototype, "name", void 0);
    __decorate([
        Property(100)
    ], Sheet.prototype, "rowCount", void 0);
    __decorate([
        Property(100)
    ], Sheet.prototype, "colCount", void 0);
    __decorate([
        Property('A1:A1')
    ], Sheet.prototype, "selectedRange", void 0);
    __decorate([
        Property('A1')
    ], Sheet.prototype, "activeCell", void 0);
    __decorate([
        Property({})
    ], Sheet.prototype, "usedRange", void 0);
    __decorate([
        Property('A1')
    ], Sheet.prototype, "topLeftCell", void 0);
    __decorate([
        Property(true)
    ], Sheet.prototype, "showHeaders", void 0);
    __decorate([
        Property(true)
    ], Sheet.prototype, "showGridLines", void 0);
    __decorate([
        Property(false)
    ], Sheet.prototype, "isProtected", void 0);
    __decorate([
        Property('Visible')
    ], Sheet.prototype, "state", void 0);
    return Sheet;
}(ChildProperty));
export { Sheet };
/**
 * To get sheet index from address.
 * @hidden
 */
export function getSheetIndex(context, name) {
    var idx;
    for (var i = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].name.toLowerCase() === name.toLowerCase()) {
            idx = i;
            break;
        }
    }
    return idx;
}
/**
 * To get sheet index from sheet id.
 * @hidden
 */
export function getSheetIndexFromId(context, id) {
    var idx;
    for (var i = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].id === id) {
            idx = i;
            break;
        }
    }
    return idx;
}
/**
 * To get sheet name from address.
 * @hidden
 */
export function getSheetNameFromAddress(address) {
    return address.split('!')[0].replace(/\'/gi, '');
}
/**
 * To get sheet index from sheet name.
 * @hidden
 */
export function getSheetIndexByName(context, name, info) {
    var len = info.length;
    for (var i = 0; i < len; i++) {
        if (info[i].sheet.toUpperCase() === name.toUpperCase()) {
            return info[i].index;
        }
    }
    return -1;
}
/**
 * update selected range
 * @hidden
 */
export function updateSelectedRange(context, range, sheet) {
    if (sheet === void 0) { sheet = {}; }
    context.setSheetPropertyOnMute(sheet, 'selectedRange', range);
}
/**
 * get selected range
 * @hidden
 */
export function getSelectedRange(sheet) {
    return sheet && sheet.selectedRange || 'A1';
}
/**
 * @hidden
 */
export function getSheet(context, idx) {
    return context.sheets[idx];
}
/**
 * @hidden
 */
export function getSheetNameCount(context) {
    var name = [];
    context.sheets.forEach(function (sheet) {
        name.push(sheet.name.toLowerCase());
    });
    for (var i = 0; i < name.length; i++) {
        if (name.indexOf('sheet' + context.sheetNameCount) > -1) {
            context.sheetNameCount++;
        }
        else {
            return context.sheetNameCount++;
        }
    }
    return context.sheetNameCount++;
}
/**
 * @hidden
 */
export function getMaxSheetId(sheets) {
    var cnt = 0;
    sheets.forEach(function (sheet) {
        cnt = Math.max(sheet.id, cnt);
    });
    return cnt + 1;
}
/**
 * @hidden
 */
export function initSheet(context, sheet) {
    var sheets = sheet ? sheet : context.sheets;
    sheets.forEach(function (sheet) {
        sheet.id = sheet.id || 0;
        sheet.name = sheet.name || '';
        sheet.rowCount = isUndefined(sheet.rowCount) ? 100 : sheet.rowCount;
        sheet.colCount = isUndefined(sheet.colCount) ? 100 : sheet.colCount;
        sheet.topLeftCell = sheet.topLeftCell || 'A1';
        sheet.activeCell = sheet.activeCell || 'A1';
        sheet.selectedRange = sheet.selectedRange || 'A1:A1';
        sheet.usedRange = sheet.usedRange || { rowIndex: 0, colIndex: 0 };
        context.setSheetPropertyOnMute(sheet, 'ranges', sheet.ranges ? sheet.ranges : []);
        sheet.rows = sheet.rows || [];
        sheet.columns = sheet.columns || [];
        sheet.showHeaders = isUndefined(sheet.showHeaders) ? true : sheet.showHeaders;
        sheet.showGridLines = isUndefined(sheet.showGridLines) ? true : sheet.showGridLines;
        sheet.state = sheet.state || 'Visible';
        sheet.maxHgts = [];
        sheet.protectSettings = sheet.protectSettings || { selectCells: false, formatCells: false, formatRows: false, formatColumns: false,
            insertLink: false };
        sheet.isProtected = sheet.isProtected || false;
        processIdx(sheet.columns);
        initRow(sheet.rows);
    });
    processIdx(sheets, true, context);
}
function initRangeSettings(ranges) {
    ranges.forEach(function (range) {
        range.startCell = range.startCell || 'A1';
        range.address = range.address || 'A1';
        range.template = range.template || '';
        range.showFieldAsHeader = isUndefined(range.showFieldAsHeader) ? true : range.showFieldAsHeader;
    });
    return ranges;
}
function initRow(rows) {
    rows.forEach(function (row) {
        if (row && row.cells) {
            processIdx(row.cells);
        }
    });
    processIdx(rows);
}
/**
 * get sheet name
 * @hidden
 */
export function getSheetName(context, idx) {
    if (idx === void 0) { idx = context.activeSheetIndex; }
    return getSheet(context, idx).name;
}
