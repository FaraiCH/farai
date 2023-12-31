import { setCell, setRow } from '../base/index';
import { setCFRule, clearCFRule, getRangeAddress, applyCellFormat } from '../common/index';
import { getRangeIndexes } from '../common/index';
import { cFInitialCheck, clearCF } from '../common/index';
import { completeAction } from '../../spreadsheet/common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `WorkbookConditionalFormat` module is used to handle conditional formatting action in Spreadsheet.
 */
var WorkbookConditionalFormat = /** @class */ (function () {
    /**
     * Constructor for WorkbookConditionalFormat module.
     */
    function WorkbookConditionalFormat(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the conditional format module.
     */
    WorkbookConditionalFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookConditionalFormat.prototype.addEventListener = function () {
        this.parent.on(setCFRule, this.setCFrulHandler, this);
        this.parent.on(clearCFRule, this.clearRules, this);
    };
    WorkbookConditionalFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCFRule, this.setCFrulHandler);
            this.parent.off(clearCFRule, this.clearRules);
        }
    };
    WorkbookConditionalFormat.prototype.setCFrulHandler = function (args) {
        var conditionalFormat = args.conditionalFormat;
        var range = conditionalFormat.range;
        var sheet = this.parent.getActiveSheet();
        range = range || sheet.selectedRange;
        conditionalFormat.range = range;
        var indexes = getRangeIndexes(range);
        var cfrCount;
        if (!sheet.conditionalFormats) {
            this.parent.setSheetPropertyOnMute(sheet, 'conditionalFormats', []);
        }
        cfrCount = sheet.conditionalFormats.length;
        sheet.conditionalFormats[cfrCount] = conditionalFormat;
        for (var rIdx = indexes[0]; rIdx <= indexes[2]; rIdx++) {
            if (!sheet.rows[rIdx]) {
                setRow(sheet, rIdx, {});
            }
            for (var cIdx = indexes[1]; cIdx <= indexes[3]; cIdx++) {
                if (!sheet.rows[rIdx].cells || !sheet.rows[rIdx].cells[cIdx]) {
                    setCell(rIdx, cIdx, sheet, {});
                }
                var cell = sheet.rows[rIdx].cells[cIdx];
                this.parent.notify(cFInitialCheck, { rowIdx: rIdx, colIdx: cIdx, cell: cell, conditionalFormat: conditionalFormat });
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    WorkbookConditionalFormat.prototype.clearRules = function (args) {
        var isPublic = isNullOrUndefined(args.isPublic) ? true : false;
        var cFormats = [];
        var oldRange = [];
        var isFirst = true;
        var top;
        var bottom;
        var left;
        var right;
        var frontColIdx;
        var backColIdx;
        var topRowIdx;
        var bottomRowIdx;
        var sheet = this.parent.getActiveSheet();
        var cFRules = sheet.conditionalFormats;
        var range = args.range;
        var rangeIndexes = getRangeIndexes(range);
        for (var rIdx = rangeIndexes[0]; rIdx <= rangeIndexes[2]; rIdx++) {
            for (var cIdx = rangeIndexes[1]; cIdx <= rangeIndexes[3]; cIdx++) {
                this.parent.notify(clearCF, { rIdx: rIdx, cIdx: cIdx });
            }
        }
        if (!cFRules) {
            return;
        }
        for (var cFRulesIdx = cFRules.length - 1; cFRulesIdx >= 0; cFRulesIdx--) {
            var isPresent = false;
            var result = '';
            var cFRule = cFRules[cFRulesIdx];
            var cFRanges = cFRule.range.split(',');
            for (var cFRangeIdx = 0; cFRangeIdx < cFRanges.length; cFRangeIdx++) {
                var isFull = false;
                var cFRange = cFRanges[cFRangeIdx];
                var cFRangeIndexes = getRangeIndexes(cFRange);
                topRowIdx = cFRangeIndexes[0];
                bottomRowIdx = cFRangeIndexes[0];
                frontColIdx = cFRangeIndexes[1];
                backColIdx = cFRangeIndexes[1];
                if (cFRangeIndexes[0] >= rangeIndexes[0] && cFRangeIndexes[2] <= rangeIndexes[2] &&
                    cFRangeIndexes[1] >= rangeIndexes[1] && cFRangeIndexes[3] <= rangeIndexes[3]) {
                    isFull = true;
                }
                for (var cFRRowIdx = cFRangeIndexes[0]; cFRRowIdx <= cFRangeIndexes[2]; cFRRowIdx++) {
                    var isTrue = 0;
                    for (var cFRColIdx = cFRangeIndexes[1]; cFRColIdx <= cFRangeIndexes[3]; cFRColIdx++) {
                        for (var rRowIdx = rangeIndexes[0]; rRowIdx <= rangeIndexes[2]; rRowIdx++) {
                            for (var rColIdx = rangeIndexes[1]; rColIdx <= rangeIndexes[3]; rColIdx++) {
                                if (rRowIdx === cFRRowIdx && rColIdx === cFRColIdx) {
                                    var style = this.parent.getCellStyleValue(['backgroundColor', 'color'], [rRowIdx, rColIdx]);
                                    this.parent.notify(applyCellFormat, {
                                        style: style, rowIdx: rRowIdx, colIdx: rColIdx,
                                        lastCell: true, isHeightCheckNeeded: true, manualUpdate: true
                                    });
                                    isTrue = isTrue + 1;
                                    isPresent = true;
                                    if (rRowIdx === cFRangeIndexes[0]) {
                                        if (rColIdx === cFRangeIndexes[3]) {
                                            if (frontColIdx === cFRangeIndexes[1]) {
                                                if (backColIdx === rColIdx) {
                                                    backColIdx = rColIdx;
                                                }
                                                else {
                                                    frontColIdx = rColIdx - 1;
                                                }
                                            }
                                            else if (frontColIdx !== cFRangeIndexes[1] && backColIdx + 1 === rColIdx) {
                                                backColIdx = cFRangeIndexes[1];
                                                frontColIdx = frontColIdx - 1;
                                            }
                                            else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                frontColIdx = rangeIndexes[1] - 1;
                                            }
                                        }
                                        else if (rColIdx === cFRangeIndexes[1]) {
                                            if (backColIdx === cFRangeIndexes[1]) {
                                                backColIdx = rColIdx + 1;
                                            }
                                        }
                                        else {
                                            if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                frontColIdx = rColIdx;
                                                backColIdx = rColIdx;
                                            }
                                            else if (frontColIdx === cFRangeIndexes[1] && backColIdx !== cFRangeIndexes[1]) {
                                                backColIdx = rColIdx + 1;
                                            }
                                            else {
                                                backColIdx = rColIdx;
                                            }
                                        }
                                    }
                                    else {
                                        if (rColIdx === cFRangeIndexes[1]) {
                                            if (backColIdx === cFRangeIndexes[1] && cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                                backColIdx = rColIdx + 1;
                                            }
                                        }
                                        else if (rColIdx === cFRangeIndexes[3]) {
                                            if (frontColIdx === cFRangeIndexes[1]) {
                                                if (backColIdx === rColIdx) {
                                                    backColIdx = rColIdx;
                                                }
                                                else {
                                                    frontColIdx = rColIdx - 1;
                                                }
                                            }
                                            else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                frontColIdx = rangeIndexes[1] - 1;
                                            }
                                            else if (frontColIdx !== cFRangeIndexes[1] && backColIdx + 1 === rColIdx) {
                                                backColIdx = cFRangeIndexes[1];
                                                frontColIdx = rangeIndexes[1] - 1;
                                            }
                                            else {
                                                bottomRowIdx = rRowIdx;
                                            }
                                        }
                                        else {
                                            if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                frontColIdx = rColIdx;
                                                backColIdx = rColIdx;
                                            }
                                            else if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                                                backColIdx = rColIdx;
                                            }
                                            else if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                                                frontColIdx = rColIdx;
                                            }
                                            else {
                                                backColIdx = rColIdx + 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (isTrue > 0 && !isFull) {
                        if (isFirst) {
                            top = topRowIdx;
                            bottom = bottomRowIdx;
                            left = frontColIdx;
                            right = backColIdx;
                        }
                        if (frontColIdx === cFRangeIndexes[1] && backColIdx !== cFRangeIndexes[1]) {
                            if (backColIdx === cFRangeIndexes[3]) {
                                if (topRowIdx !== cFRRowIdx) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, left, bottom, cFRangeIndexes[3]]);
                                }
                                if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[3]) {
                                    if (cFRRowIdx === cFRangeIndexes[2]) {
                                        if (cFRangeIndexes[1] === rangeIndexes[3]) {
                                            result = result + ' ' + getRangeAddress([cFRRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                        }
                                    }
                                    else {
                                        if (rangeIndexes[2] === cFRangeIndexes[0] && backColIdx !== cFRangeIndexes[3]) {
                                            result = result + ' ' + getRangeAddress([cFRRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                                        }
                                        topRowIdx = cFRRowIdx + 1;
                                        bottomRowIdx = cFRRowIdx + 1;
                                        backColIdx = cFRangeIndexes[1];
                                    }
                                }
                            }
                            else if (right !== backColIdx) {
                                result = result + ' ' + getRangeAddress([topRowIdx, right, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                if (backColIdx === cFRangeIndexes[3] && frontColIdx === cFRangeIndexes[1]) {
                                    topRowIdx = cFRRowIdx + 1;
                                    bottomRowIdx = cFRRowIdx + 1;
                                    backColIdx = cFRangeIndexes[1];
                                }
                                else {
                                    topRowIdx = cFRRowIdx;
                                    bottomRowIdx = cFRRowIdx;
                                }
                                if (backColIdx === cFRangeIndexes[3] && frontColIdx !== cFRangeIndexes[1]) {
                                    frontColIdx = cFRangeIndexes[1];
                                }
                            }
                            else if (left !== frontColIdx) {
                                result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], cFRRowIdx - 1, left]);
                                topRowIdx = cFRRowIdx + 1;
                                bottomRowIdx = cFRRowIdx + 1;
                                frontColIdx = cFRangeIndexes[1];
                                backColIdx = cFRangeIndexes[1];
                            }
                            else if (cFRRowIdx === cFRangeIndexes[2]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                            }
                            else {
                                if (bottomRowIdx < cFRRowIdx || (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[3])) {
                                    bottomRowIdx = cFRRowIdx;
                                }
                            }
                        }
                        else if (backColIdx === cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                            if (right !== backColIdx) {
                                result = result + ' ' + getRangeAddress([topRowIdx, right, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                topRowIdx = cFRRowIdx;
                                bottomRowIdx = cFRRowIdx;
                            }
                            if (left !== frontColIdx) {
                                result = result + ' ' + getRangeAddress([topRowIdx, left, cFRRowIdx - 1, cFRangeIndexes[3]]);
                                topRowIdx = cFRRowIdx;
                                bottomRowIdx = cFRRowIdx;
                            }
                            if (cFRRowIdx === cFRangeIndexes[2]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, cFRRowIdx, frontColIdx]);
                            }
                            else {
                                bottomRowIdx = cFRRowIdx;
                            }
                        }
                        else if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                            if (cFRRowIdx === cFRangeIndexes[2] && cFRangeIndexes[2] === rangeIndexes[0]) {
                                if (cFRangeIndexes[0] === cFRangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], bottomRowIdx, frontColIdx - 1]);
                                    result = result + ' ' +
                                        getRangeAddress([topRowIdx, backColIdx + 1, bottomRowIdx, cFRangeIndexes[3]]);
                                }
                                else {
                                    result =
                                        result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], bottomRowIdx, cFRangeIndexes[3]]);
                                    result = result + ' ' +
                                        getRangeAddress([cFRangeIndexes[2], cFRangeIndexes[1], cFRangeIndexes[2], frontColIdx - 1]);
                                    result = result + ' ' +
                                        getRangeAddress([cFRangeIndexes[2], backColIdx + 1, cFRangeIndexes[2], cFRangeIndexes[3]]);
                                }
                            }
                            else if (cFRRowIdx === cFRangeIndexes[2]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], cFRRowIdx, frontColIdx - 1]);
                                result = result + ' ' + getRangeAddress([topRowIdx, backColIdx + 1, cFRRowIdx, cFRangeIndexes[3]]);
                            }
                            else {
                                if (left === cFRangeIndexes[1] && right === cFRangeIndexes[1]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, left, bottomRowIdx, cFRangeIndexes[3]]);
                                    topRowIdx = cFRRowIdx;
                                }
                                bottomRowIdx = cFRRowIdx;
                            }
                        }
                        else if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                            if (rangeIndexes[2] !== cFRangeIndexes[0]) {
                                if (cFRangeIndexes[2] >= rangeIndexes[2] && cFRRowIdx > rangeIndexes[2]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, cFRangeIndexes[3]]);
                                }
                                if (cFRangeIndexes[1] === cFRangeIndexes[3] &&
                                    cFRRowIdx <= cFRangeIndexes[2] && top !== cFRangeIndexes[2] && cFRRowIdx !== top) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, cFRangeIndexes[3]]);
                                }
                                if (cFRangeIndexes[1] === cFRangeIndexes[3]) {
                                    topRowIdx = cFRRowIdx + 1;
                                    bottomRowIdx = cFRRowIdx + 1;
                                }
                            }
                            else {
                                if (cFRRowIdx === cFRangeIndexes[2] || cFRRowIdx === cFRangeIndexes[0] &&
                                    cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                    result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, bottomRowIdx, backColIdx]);
                                }
                                topRowIdx = cFRRowIdx + 1;
                                bottomRowIdx = cFRRowIdx + 1;
                            }
                            if (cFRRowIdx === cFRangeIndexes[2] && cFRangeIndexes[0] !== cFRangeIndexes[2] &&
                                cFRangeIndexes[1] !== cFRangeIndexes[3]) {
                                result = result + ' ' + getRangeAddress([cFRRowIdx, frontColIdx, cFRRowIdx, backColIdx]);
                            }
                        }
                        if (!isFirst) {
                            top = topRowIdx;
                            bottom = bottomRowIdx <= cFRangeIndexes[2] ? bottomRowIdx : cFRangeIndexes[2];
                            left = frontColIdx;
                            right = backColIdx <= cFRangeIndexes[3] ? backColIdx : cFRangeIndexes[3];
                        }
                        isFirst = false;
                    }
                    else if (!isFull) {
                        if (isFirst) {
                            top = topRowIdx;
                            bottom = bottomRowIdx;
                            left = frontColIdx;
                            right = backColIdx;
                        }
                        if (frontColIdx === cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                            if (cFRRowIdx === cFRangeIndexes[2]) {
                                result = result + ' ' + getRangeAddress([topRowIdx, frontColIdx, cFRRowIdx, cFRangeIndexes[3]]);
                            }
                            bottomRowIdx = cFRRowIdx;
                        }
                        if (backColIdx !== cFRangeIndexes[1] && frontColIdx !== cFRangeIndexes[1]) {
                            result = result + ' ' + getRangeAddress([topRowIdx, cFRangeIndexes[1], (cFRRowIdx - 1), frontColIdx - 1]);
                            result = result + ' ' + getRangeAddress([topRowIdx, backColIdx + 1, (cFRRowIdx - 1), cFRangeIndexes[3]]);
                            topRowIdx = cFRRowIdx;
                            bottomRowIdx = cFRRowIdx;
                            frontColIdx = cFRangeIndexes[1];
                            backColIdx = cFRangeIndexes[1];
                        }
                        if (backColIdx !== cFRangeIndexes[1] && frontColIdx === cFRangeIndexes[1]) {
                            result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, (cFRRowIdx - 1), cFRangeIndexes[3]]);
                            topRowIdx = cFRRowIdx;
                            bottomRowIdx = cFRRowIdx;
                            frontColIdx = cFRangeIndexes[1];
                            backColIdx = cFRangeIndexes[1];
                        }
                        if (frontColIdx !== cFRangeIndexes[1] && backColIdx === cFRangeIndexes[1]) {
                            result = result + ' ' + getRangeAddress([topRowIdx, backColIdx, (cFRRowIdx - 1), frontColIdx]);
                            topRowIdx = cFRRowIdx;
                            bottomRowIdx = cFRRowIdx;
                            frontColIdx = cFRangeIndexes[1];
                            backColIdx = cFRangeIndexes[1];
                        }
                        if (!isFirst) {
                            top = topRowIdx;
                            bottom = bottomRowIdx <= cFRangeIndexes[2] ? bottomRowIdx : cFRangeIndexes[2];
                            left = frontColIdx;
                            right = backColIdx <= cFRangeIndexes[3] ? backColIdx : cFRangeIndexes[3];
                        }
                        isFirst = false;
                    }
                }
            }
            if (result === '') {
                oldRange.push(this.parent.getActiveSheet().conditionalFormats[cFRulesIdx].range);
                sheet.conditionalFormats.splice(cFRulesIdx, 1);
            }
            else {
                oldRange.push(this.parent.getActiveSheet().conditionalFormats[cFRulesIdx].range);
                sheet.conditionalFormats[cFRulesIdx].range = result.trim().replace(' ', ',');
            }
            if (isPresent && !isPublic) {
                cFRule.range = result.trim().replace(' ', ',');
                cFormats.push(cFRule);
            }
        }
        if (!isPublic) {
            var eventArgs = { cFormats: cFormats, oldRange: oldRange, selectedRange: range };
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clearCF' });
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookConditionalFormat.prototype.getModuleName = function () {
        return 'workbookConditionalFormatting';
    };
    return WorkbookConditionalFormat;
}());
export { WorkbookConditionalFormat };
