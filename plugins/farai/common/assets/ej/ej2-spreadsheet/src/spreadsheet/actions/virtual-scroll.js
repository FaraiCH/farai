import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { spreadsheetDestroyed, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded } from '../common/index';
import { colWidthChanged, updateTableWidth } from '../common/index';
import { onVerticalScroll, onHorizontalScroll, rowHeightChanged, beforeHeaderLoaded, deInitProperties } from '../common/index';
import { getRowHeight, getRowsHeight, getColumnWidth, getColumnsWidth } from './../../workbook/index';
import { getRangeAddress } from '../../workbook/common/index';
import { updateUsedRange, sheetCreated, sheetsDestroyed } from '../../workbook/common/event';
/**
 * VirtualScroll module
 * @hidden
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent) {
        this.scroll = [];
        this.parent = parent;
        this.addEventListener();
    }
    VirtualScroll.prototype.createVirtualElement = function (args) {
        var sheet = this.parent.getActiveSheet();
        var container = this.parent.getMainContent();
        this.content = this.parent.createElement('div', { className: 'e-virtualable' });
        this.content.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.content);
        var vTrack = container.appendChild(this.parent.createElement('div', { className: 'e-virtualtrack' }));
        var colVTrack;
        var rowVTrack;
        var height;
        var width;
        if (this.parent.sheets.length > this.scroll.length) {
            this.initScroll();
        }
        var domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (sheet.rowCount > domCount || sheet.usedRange.rowIndex > domCount - 1) {
            if (!this.parent.scrollSettings.isFinite && sheet.rowCount <= sheet.usedRange.rowIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'rowCount', sheet.usedRange.rowIndex + 1);
            }
            this.setScrollCount(sheet.rowCount, 'row');
            height = getRowsHeight(sheet, 0, this.scroll[this.parent.activeSheetIndex].rowCount - 1);
        }
        else {
            if (!this.parent.scrollSettings.isFinite) {
                this.parent.setSheetPropertyOnMute(sheet, 'rowCount', domCount);
            }
            this.scroll[this.parent.activeSheetIndex].rowCount = sheet.rowCount;
            height = 1;
        }
        domCount = this.parent.viewport.colCount + 1 + (this.parent.getThreshold('col') * 2);
        var size;
        if (sheet.colCount > domCount || sheet.usedRange.colIndex > domCount - 1) {
            if (!this.parent.scrollSettings.isFinite && sheet.colCount <= sheet.usedRange.colIndex) {
                this.parent.setSheetPropertyOnMute(sheet, 'colCount', sheet.usedRange.colIndex + 1);
            }
            size = getColumnsWidth(sheet, 0, domCount - 1);
            this.setScrollCount(sheet.colCount, 'col');
            width = size + getColumnsWidth(sheet, domCount, this.scroll[this.parent.activeSheetIndex].colCount - 1);
        }
        else {
            if (!this.parent.scrollSettings.isFinite) {
                this.parent.setSheetPropertyOnMute(sheet, 'colCount', domCount);
            }
            size = getColumnsWidth(sheet, 0, sheet.colCount - 1);
            this.scroll[this.parent.activeSheetIndex].colCount = sheet.colCount;
            width = size;
        }
        if (args.startColIdx) {
            size = getColumnsWidth(sheet, args.startColIdx, args.startColIdx + domCount - 1);
        }
        if (isNullOrUndefined(this.parent.viewport.leftIndex)) {
            this.parent.viewport.leftIndex = 0;
        }
        if (isNullOrUndefined(this.parent.viewport.topIndex)) {
            this.parent.viewport.topIndex = 0;
        }
        if (isNullOrUndefined(this.translateX)) {
            this.translateX = 0;
        }
        if (isNullOrUndefined(this.translateY)) {
            this.translateY = 0;
        }
        if (sheet.showHeaders) {
            container = this.parent.getRowHeaderContent();
            this.rowHeader = this.content.cloneNode();
            this.rowHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.rowHeader);
            rowVTrack = container.appendChild(vTrack.cloneNode());
            this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
            container = this.parent.getColumnHeaderContent();
            this.colHeader = this.content.cloneNode();
            this.colHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.colHeader);
            colVTrack = container.appendChild(vTrack.cloneNode());
            this.colHeader.style.width = size + "px";
            rowVTrack.style.height = height + "px";
            colVTrack.style.width = width + "px";
            this.colHeader.style.transform = "translate(" + this.translateX + "px, 0px)";
        }
        this.content.style.transform = "translate(" + this.translateX + "px, " + this.translateY + "px)";
        this.content.style.width = size + "px";
        vTrack.style.height = height + "px";
        vTrack.style.width = width + "px";
    };
    VirtualScroll.prototype.initScroll = function () {
        var i = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i]) {
                this.scroll.push({ rowCount: 0, colCount: 0 });
            }
            i++;
        }
    };
    VirtualScroll.prototype.setScrollCount = function (count, layout) {
        var activeSheetIdx = this.parent.activeSheetIndex;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) {
            this.scroll[activeSheetIdx][layout + 'Count'] = count;
        }
    };
    VirtualScroll.prototype.getRowAddress = function (indexes) {
        return getRangeAddress([indexes[0], this.parent.viewport.leftIndex, indexes[1], this.parent.viewport.rightIndex]);
    };
    VirtualScroll.prototype.getColAddress = function (indexes) {
        return getRangeAddress([this.parent.viewport.topIndex, indexes[0], this.parent.viewport.bottomIndex, indexes[1]]);
    };
    VirtualScroll.prototype.updateScrollCount = function (idx, layout, threshold) {
        if (threshold === void 0) { threshold = idx; }
        var sheet = this.parent.getActiveSheet();
        var rowCount = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        var usedRangeCount = this.scroll[this.parent.activeSheetIndex][layout + 'Count'];
        if (rowCount < usedRangeCount) {
            if (sheet[layout + 'Count'] === usedRangeCount) {
                return;
            }
            rowCount = usedRangeCount;
        }
        if (!this.parent.scrollSettings.isFinite) {
            this.parent.setSheetPropertyOnMute(sheet, layout + 'Count', rowCount);
        }
    };
    VirtualScroll.prototype.onVerticalScroll = function (args) {
        var idx = args.cur.idx;
        var height = args.cur.size;
        var prevIdx = args.prev.idx;
        var idxDiff = Math.abs(idx - prevIdx);
        var threshold = this.parent.getThreshold('row');
        if (idxDiff > Math.round(threshold / 2)) {
            var startIdx = void 0;
            var lastIdx = void 0;
            var prevTopIdx = void 0;
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateY && prevIdx > threshold) {
                        this.translateY = 0;
                        this.parent.viewport.topIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                lastIdx = this.parent.viewport.topIndex - 1;
                                startIdx = this.parent.skipHidden(0, lastIdx)[0];
                                this.parent.viewport.topIndex = startIdx;
                                var hiddenCount = this.hiddenCount(startIdx, lastIdx);
                                var skippedHiddenIdx = this.skipHiddenIdx((this.parent.viewport.bottomIndex - ((lastIdx - startIdx + 1) - hiddenCount)), args.increase);
                                this.parent.viewport.bottomIndex -= (((lastIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex)));
                                this.parent.renderModule.refreshUI({
                                    colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart',
                                    skipUpdateOnFirst: true
                                }, this.getRowAddress([0, this.skipHiddenIdx(lastIdx, false)]));
                            }
                            else {
                                this.parent.renderModule.refreshUI({ rowIndex: 0, colIndex: this.parent.viewport.leftIndex, refresh: 'Row', skipUpdateOnFirst: true });
                            }
                            this.parent.element.focus();
                        }
                    }
                    this.updateScrollCount(threshold, 'row');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                prevTopIdx = this.parent.viewport.topIndex;
                this.parent.viewport.topIndex = idx - threshold;
                if (args.increase && prevTopIdx > this.parent.viewport.topIndex) {
                    this.parent.viewport.topIndex = prevTopIdx;
                    return;
                }
                this.translateY = height - this.getThresholdHeight(this.parent.viewport.topIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.bottomIndex + 1;
                            lastIdx = this.parent.viewport.bottomIndex + (this.parent.viewport.topIndex - prevTopIdx);
                            lastIdx -= this.hiddenCount(prevTopIdx, this.parent.viewport.topIndex - 1);
                            this.parent.viewport.topIndex = this.skipHiddenIdx(this.parent.viewport.topIndex, args.increase);
                            if (lastIdx <= this.parent.viewport.bottomIndex) {
                                return;
                            }
                            var indexes = this.parent.skipHidden(startIdx, lastIdx);
                            startIdx = indexes[0];
                            lastIdx = this.checkLastIdx(indexes[1], 'row');
                            this.parent.viewport.bottomIndex = lastIdx;
                            this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'first', refresh: 'RowPart' }, this.getRowAddress([startIdx, lastIdx]));
                        }
                        else {
                            startIdx = this.parent.viewport.topIndex;
                            lastIdx = startIdx + idxDiff - 1;
                            var hiddenCount = this.hiddenCount(startIdx, lastIdx);
                            var skippedHiddenIdx = this.skipHiddenIdx((this.parent.viewport.bottomIndex - ((lastIdx - startIdx) - hiddenCount)), args.increase);
                            this.parent.viewport.bottomIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.bottomIndex)));
                            startIdx = this.parent.skipHidden(startIdx, lastIdx)[0];
                            this.parent.viewport.topIndex = startIdx;
                            this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, rowIndex: startIdx, direction: 'last', refresh: 'RowPart' }, this.getRowAddress([startIdx, lastIdx]));
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                        });
                    }
                    this.updateScrollCount(idx, 'row', threshold);
                    this.parent.element.focus();
                }
            }
            args.prev.idx = idx;
        }
    };
    VirtualScroll.prototype.skipHiddenIdx = function (index, increase, layout, sheet) {
        if (layout === void 0) { layout = 'rows'; }
        if (sheet === void 0) { sheet = this.parent.getActiveSheet(); }
        if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
            increase ? index++ : index--;
            index = this.skipHiddenIdx(index, increase, layout, sheet);
        }
        return index;
    };
    VirtualScroll.prototype.hiddenCount = function (startIdx, endIdx, layout) {
        if (layout === void 0) { layout = 'rows'; }
        var index = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = startIdx; i <= endIdx; i++) {
            if ((sheet[layout])[i] && (sheet[layout])[i].hidden) {
                index++;
            }
        }
        return index;
    };
    VirtualScroll.prototype.checkLastIdx = function (idx, layout) {
        if (this.parent.scrollSettings.isFinite) {
            var count = this.parent.getActiveSheet()[layout + 'Count'] - 1;
            if (idx > count) {
                idx = count;
            }
        }
        return idx;
    };
    VirtualScroll.prototype.onHorizontalScroll = function (args) {
        var idx = args.cur.idx;
        var width = args.cur.size;
        var prevIdx = args.prev.idx;
        var idxDiff = Math.abs(idx - prevIdx);
        var threshold = this.parent.getThreshold('col');
        if (idxDiff > Math.round(threshold / 2)) {
            var startIdx = void 0;
            var endIdx = void 0;
            var prevLeftIdx = void 0;
            if (idx <= threshold) {
                if (!args.increase) {
                    if (this.translateX && prevIdx > threshold) {
                        this.translateX = 0;
                        this.parent.viewport.leftIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.colCount + threshold) {
                                endIdx = this.parent.viewport.leftIndex - 1;
                                startIdx = this.parent.skipHidden(0, endIdx, 'columns')[0];
                                this.parent.viewport.leftIndex = startIdx;
                                var hiddenCount = this.hiddenCount(startIdx, endIdx, 'columns');
                                var skippedHiddenIdx = this.skipHiddenIdx((this.parent.viewport.rightIndex - ((endIdx - startIdx + 1) - hiddenCount)), args.increase, 'columns');
                                this.parent.viewport.rightIndex -= (((endIdx - startIdx + 1) - hiddenCount) +
                                    (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                                this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart',
                                    skipUpdateOnFirst: true }, this.getColAddress([0, this.skipHiddenIdx(endIdx, false, 'columns')]));
                            }
                            else {
                                this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: 0, refresh: 'Column', skipUpdateOnFirst: true });
                            }
                            this.parent.element.focus();
                        }
                    }
                    this.updateScrollCount(threshold, 'col');
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                prevLeftIdx = this.parent.viewport.leftIndex;
                this.parent.viewport.leftIndex = idx - threshold;
                if (args.increase && prevLeftIdx > this.parent.viewport.leftIndex) {
                    this.parent.viewport.leftIndex = prevLeftIdx;
                    return;
                }
                this.translateX = width - this.getThresholdWidth(this.parent.viewport.leftIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            startIdx = this.parent.viewport.rightIndex + 1;
                            endIdx = this.parent.viewport.rightIndex + (this.parent.viewport.leftIndex - prevLeftIdx);
                            endIdx -= this.hiddenCount(prevLeftIdx, this.parent.viewport.leftIndex - 1, 'columns');
                            this.parent.viewport.leftIndex = this.skipHiddenIdx(this.parent.viewport.leftIndex, args.increase, 'columns');
                            if (endIdx <= this.parent.viewport.rightIndex) {
                                return;
                            }
                            var indexes = this.parent.skipHidden(startIdx, endIdx, 'columns');
                            startIdx = indexes[0];
                            endIdx = this.checkLastIdx(indexes[1], 'col');
                            this.parent.viewport.rightIndex = endIdx;
                            this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'first', refresh: 'ColumnPart' }, this.getColAddress([startIdx, endIdx]));
                        }
                        else {
                            startIdx = this.parent.viewport.leftIndex;
                            endIdx = startIdx + idxDiff - 1;
                            var hiddenCount = this.hiddenCount(startIdx, endIdx, 'columns');
                            var skippedHiddenIdx = this.skipHiddenIdx((this.parent.viewport.rightIndex - ((endIdx - startIdx) - hiddenCount)), args.increase, 'columns');
                            this.parent.viewport.rightIndex -= ((idxDiff - hiddenCount) +
                                (this.hiddenCount(skippedHiddenIdx, this.parent.viewport.rightIndex, 'columns')));
                            startIdx = this.parent.skipHidden(startIdx, endIdx, 'columns')[0];
                            this.parent.viewport.leftIndex = startIdx;
                            this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: startIdx, direction: 'last', refresh: 'ColumnPart' }, this.getColAddress([startIdx, endIdx]));
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex, refresh: 'Column'
                        });
                    }
                    this.updateScrollCount(idx, 'col', threshold);
                    this.parent.element.focus();
                }
            }
            args.prev.idx = idx;
        }
    };
    VirtualScroll.prototype.getThresholdHeight = function (idx, threshold) {
        var height = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = idx; i < idx + threshold; i++) {
            height += getRowHeight(sheet, i);
        }
        return height;
    };
    VirtualScroll.prototype.getThresholdWidth = function (idx, threshold) {
        var width = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = idx; i < idx + threshold; i++) {
            width += getColumnWidth(sheet, i);
        }
        return width;
    };
    VirtualScroll.prototype.translate = function (args) {
        var sheet = this.parent.getActiveSheet();
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = "translate(" + this.translateX + "px, " + this.translateY + "px)";
            if (sheet.showHeaders) {
                this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
            }
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            var translateX = this.parent.enableRtl ? -this.translateX : this.translateX;
            this.content.style.transform = "translate(" + translateX + "px, " + this.translateY + "px)";
            if (sheet.showHeaders) {
                this.colHeader.style.transform = "translate(" + translateX + "px, 0px)";
            }
        }
    };
    VirtualScroll.prototype.updateColumnWidth = function (args) {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            var width = getColumnsWidth(this.parent.getActiveSheet(), this.parent.viewport.leftIndex, this.parent.viewport.rightIndex);
            if (this.parent.getActiveSheet().showHeaders) {
                this.colHeader.style.width = width + 'px';
            }
            this.content.style.width = width + 'px';
        }
    };
    VirtualScroll.prototype.updateUsedRange = function (args) {
        if (!this.scroll.length) {
            return;
        }
        var sheet = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index !== this.scroll[this.parent.activeSheetIndex].rowCount - 1) {
                var height = this.getVTrackHeight('height');
                if (args.index >= this.scroll[this.parent.activeSheetIndex].rowCount) {
                    height += getRowsHeight(sheet, this.scroll[this.parent.activeSheetIndex].rowCount, args.index);
                }
                else {
                    height -= getRowsHeight(sheet, args.index + 1, this.scroll[this.parent.activeSheetIndex].rowCount - 1);
                }
                this.scroll[this.parent.activeSheetIndex].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, height, 'height');
                if (this.scroll[this.parent.activeSheetIndex].rowCount > sheet.rowCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'rowCount', this.scroll[this.parent.activeSheetIndex].rowCount);
                }
            }
        }
        else {
            if (args.index > this.scroll[this.parent.activeSheetIndex].colCount) {
                var width = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetIndex].colCount, args.index);
                this.scroll[this.parent.activeSheetIndex].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetIndex].colCount > sheet.colCount) {
                    this.parent.setSheetPropertyOnMute(sheet, 'colCount', this.scroll[this.parent.activeSheetIndex].colCount);
                }
            }
        }
    };
    VirtualScroll.prototype.createHeaderElement = function (args) {
        this.rowHeader = this.content.cloneNode();
        this.colHeader = this.rowHeader.cloneNode();
        this.rowHeader.style.width = '';
        this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
        this.colHeader.style.transform = "translate(" + (this.parent.enableRtl ? -this.translateX : this.translateX) + "px, 0px)";
        this.rowHeader.appendChild(args.element.querySelector('table'));
        args.element.appendChild(this.rowHeader);
        var container = this.parent.getColumnHeaderContent();
        this.colHeader.appendChild(container.querySelector('table'));
        container.appendChild(this.colHeader);
        var rowVTrack = this.content.nextElementSibling.cloneNode();
        var colVTrack = rowVTrack.cloneNode();
        rowVTrack.style.width = '';
        colVTrack.style.height = '';
        args.element.appendChild(rowVTrack);
        container.appendChild(colVTrack);
    };
    VirtualScroll.prototype.getVTrackHeight = function (str) {
        var height = this.content.nextElementSibling.style[str];
        if (height.includes('e+')) {
            height = height.split('px')[0];
            var heightArr = height.split('e+');
            return Number(heightArr[0]) * Math.pow(10, Number(heightArr[1]));
        }
        else {
            return parseInt(height, 10);
        }
    };
    VirtualScroll.prototype.updateVTrackHeight = function (args) {
        var domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetIndex].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    };
    VirtualScroll.prototype.updateVTrackWidth = function (args) {
        if (args.colIdx >= this.parent.viewport.leftIndex && args.colIdx <= this.parent.viewport.rightIndex) {
            if (this.parent.getActiveSheet().showHeaders) {
                var hdrVTrack = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0];
                hdrVTrack.style.width = parseInt(hdrVTrack.style.width, 10) + args.threshold + 'px';
            }
            var cntVTrack = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0];
            cntVTrack.style.width = parseInt(cntVTrack.style.width, 10) + args.threshold + 'px';
            if (this.parent.getActiveSheet().showHeaders) {
                var hdrColumn = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0];
                hdrColumn.style.width = parseInt(hdrColumn.style.width, 10) + args.threshold + 'px';
            }
            var cntColumn = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0];
            cntColumn.style.width = parseInt(cntColumn.style.width, 10) + args.threshold + 'px';
        }
    };
    VirtualScroll.prototype.updateVTrack = function (header, size, sizeStr) {
        if (this.parent.getActiveSheet().showHeaders) {
            header.nextElementSibling.style[sizeStr] = size + "px";
        }
        this.content.nextElementSibling.style[sizeStr] = size + "px";
    };
    VirtualScroll.prototype.deInitProps = function () {
        this.parent.viewport.leftIndex = null;
        this.parent.viewport.topIndex = null;
        this.parent.viewport.bottomIndex = null;
        this.translateX = null;
        this.translateY = null;
    };
    VirtualScroll.prototype.updateScrollProps = function (args) {
        var _this = this;
        if (args === void 0) { args = { sheetIndex: 0, sheets: this.parent.sheets }; }
        if (this.scroll.length === 0) {
            this.initScroll();
        }
        else {
            args.sheets.forEach(function () { _this.scroll.splice(args.sheetIndex, 0, { rowCount: 0, colCount: 0 }); });
        }
    };
    VirtualScroll.prototype.sliceScrollProps = function (args) {
        if (isNullOrUndefined(args.sheetIndex)) {
            this.scroll.length = 0;
        }
        else {
            this.scroll.splice(args.sheetIndex, 1);
        }
    };
    VirtualScroll.prototype.addEventListener = function () {
        this.parent.on(beforeContentLoaded, this.createVirtualElement, this);
        this.parent.on(beforeVirtualContentLoaded, this.translate, this);
        this.parent.on(virtualContentLoaded, this.updateColumnWidth, this);
        this.parent.on(updateTableWidth, this.updateColumnWidth, this);
        this.parent.on(onVerticalScroll, this.onVerticalScroll, this);
        this.parent.on(onHorizontalScroll, this.onHorizontalScroll, this);
        this.parent.on(updateUsedRange, this.updateUsedRange, this);
        this.parent.on(rowHeightChanged, this.updateVTrackHeight, this);
        this.parent.on(colWidthChanged, this.updateVTrackWidth, this);
        this.parent.on(beforeHeaderLoaded, this.createHeaderElement, this);
        this.parent.on(deInitProperties, this.deInitProps, this);
        this.parent.on(sheetsDestroyed, this.sliceScrollProps, this);
        this.parent.on(sheetCreated, this.updateScrollProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    VirtualScroll.prototype.destroy = function () {
        this.removeEventListener();
        this.rowHeader = null;
        this.colHeader = null;
        this.content = null;
        this.parent = null;
        this.scroll.length = 0;
        this.translateX = null;
        this.translateY = null;
    };
    VirtualScroll.prototype.removeEventListener = function () {
        this.parent.off(beforeContentLoaded, this.createVirtualElement);
        this.parent.off(beforeVirtualContentLoaded, this.translate);
        this.parent.off(virtualContentLoaded, this.updateColumnWidth);
        this.parent.off(updateTableWidth, this.updateColumnWidth);
        this.parent.off(onVerticalScroll, this.onVerticalScroll);
        this.parent.off(onHorizontalScroll, this.onHorizontalScroll);
        this.parent.off(updateUsedRange, this.updateUsedRange);
        this.parent.off(rowHeightChanged, this.updateVTrackHeight);
        this.parent.off(colWidthChanged, this.updateVTrackWidth);
        this.parent.off(beforeHeaderLoaded, this.createHeaderElement);
        this.parent.off(sheetsDestroyed, this.sliceScrollProps);
        this.parent.off(sheetCreated, this.updateScrollProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    };
    return VirtualScroll;
}());
export { VirtualScroll };
