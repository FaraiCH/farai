import { getSheetIndex, isHiddenRow, getCell, setCell } from '../../workbook/base/index';
import { initiateChart, getRangeIndexes, isNumber, isDateTime, dateToInt } from '../../workbook/common/index';
import { overlay, locale, refreshChartCellObj, getRowIdxFromClientY, getColIdxFromClientX, deleteChart } from '../common/index';
import { beginAction, completeAction, clearChartBorder, focusBorder } from '../common/index';
import { Chart, ColumnSeries, Category, StackingColumnSeries, BarSeries } from '@syncfusion/ej2-charts';
import { AreaSeries, StackingAreaSeries, AccumulationChart } from '@syncfusion/ej2-charts';
import { Legend, StackingBarSeries, LineSeries, StackingLineSeries, ScatterSeries } from '@syncfusion/ej2-charts';
import { AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel } from '@syncfusion/ej2-charts';
import { isNullOrUndefined, getComponent, closest, detach } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { getTypeFromFormat } from '../../workbook/integrations/index';
import { updateChart, deleteChartColl, getFormattedCellObject, setChart, getCellAddress } from '../../workbook/common/index';
import { insertChart } from '../common/index';
Chart.Inject(ColumnSeries, LineSeries, BarSeries, AreaSeries, StackingColumnSeries, StackingLineSeries, StackingBarSeries, ScatterSeries);
Chart.Inject(StackingAreaSeries, Category, Legend, Tooltip);
AccumulationChart.Inject(PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationLegend);
/**
 * Represents Chart support for Spreadsheet.
 */
var SpreadsheetChart = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet Chart module.
     */
    function SpreadsheetChart(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Adding event listener for success and failure
     */
    SpreadsheetChart.prototype.addEventListener = function () {
        this.parent.on(initiateChart, this.initiateChartHandler, this);
        this.parent.on(refreshChartCellObj, this.refreshChartCellObj, this);
        this.parent.on(updateChart, this.updateChartHandler, this);
        this.parent.on(deleteChart, this.deleteChart, this);
        this.parent.on(clearChartBorder, this.clearBorder, this);
        this.parent.on(insertChart, this.insertChartHandler, this);
    };
    SpreadsheetChart.prototype.insertChartHandler = function (args) {
        var chartType = 'Column';
        switch (args.id) {
            case 'clusteredColumn':
                chartType = 'Column';
                break;
            case 'stackedColumn':
                chartType = 'StackingColumn';
                break;
            case 'stackedColumn100':
                chartType = 'StackingColumn100';
                break;
            case 'clusteredBar':
                chartType = 'Bar';
                break;
            case 'stackedBar':
                chartType = 'StackingBar';
                break;
            case 'stackedBar100':
                chartType = 'StackingBar100';
                break;
            case 'area':
                chartType = 'Area';
                break;
            case 'stackedArea':
                chartType = 'StackingArea';
                break;
            case 'stackedArea100':
                chartType = 'StackingArea100';
                break;
            case 'line':
                chartType = 'Line';
                break;
            case 'stackedLine':
                chartType = 'StackingLine';
                break;
            case 'stackedLine100':
                chartType = 'StackingLine100';
                break;
            case 'pie':
                chartType = 'Pie';
                break;
            case 'doughnut':
                chartType = 'Doughnut';
                break;
            //  case 'radar':
            //     chartType = ;
            //     break;
            //  case 'radar_markers':
            //     chartType = 'Column';
            //     break;
            case 'scatter':
                chartType = 'Scatter';
                break;
        }
        var chart = [{ type: chartType }];
        this.parent.notify(setChart, { chart: chart });
    };
    SpreadsheetChart.prototype.getPropertyValue = function (rIdx, cIdx, sheetIndex) {
        var sheets = this.parent.sheets;
        if (sheets[sheetIndex] && sheets[sheetIndex].rows[rIdx] && sheets[sheetIndex].rows[rIdx].cells[cIdx]) {
            var cell = getCell(rIdx, cIdx, this.parent.sheets[sheetIndex]);
            var value = '';
            if (cell.format) {
                var formatObj = {
                    type: getTypeFromFormat(cell.format),
                    value: cell && cell.value, format: cell && cell.format ?
                        cell.format : 'General', formattedText: cell && cell.value,
                    onLoad: true, isRightAlign: false, cell: cell,
                    rowIdx: rIdx.toString(), colIdx: cIdx.toString()
                };
                if (cell) {
                    this.parent.notify(getFormattedCellObject, formatObj);
                    if (typeof (formatObj.value) === 'number') {
                        var escapeRegx = new RegExp('[!@#$%^&()+=\';,{}|\":<>~_-]', 'g');
                        formatObj.formattedText = (formatObj.formattedText.toString()).replace(escapeRegx, '');
                        value = parseInt(formatObj.formattedText.toString(), 10);
                    }
                    else {
                        value = formatObj.formattedText.toString();
                        parseFloat('');
                    }
                }
            }
            else {
                value = this.parent.sheets[sheetIndex].rows[rIdx].cells[cIdx].value;
            }
            return value;
        }
        else {
            return '';
        }
    };
    SpreadsheetChart.prototype.updateChartHandler = function (args) {
        var series = this.initiateChartHandler({ option: args.chart, isRefresh: true });
        var chartObj = this.parent.element.querySelector('.' + args.chart.id);
        var excelFilter = getComponent(chartObj, 'chart');
        excelFilter.series = series;
    };
    SpreadsheetChart.prototype.refreshChartCellObj = function (args) {
        var currRowIdx = { clientY: args.currentTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, currRowIdx);
        var prevRowIdx = { clientY: args.prevTop, isImage: true };
        this.parent.notify(getRowIdxFromClientY, prevRowIdx);
        var currColIdx = { clientX: args.currentLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, currColIdx);
        var prevColIdx = { clientX: args.prevLeft, isImage: true };
        this.parent.notify(getColIdxFromClientX, prevColIdx);
        var sheet = this.parent.sheets[this.parent.activeSheetIndex];
        var prevCellObj = getCell(prevRowIdx.clientY, prevColIdx.clientX, sheet);
        var currCellObj = getCell(currRowIdx.clientY, currColIdx.clientX, sheet);
        var prevCellChart = prevCellObj ? prevCellObj.chart : [];
        var prevChartObj;
        var currChartObj;
        var prevCellImgLen = (prevCellChart && prevCellChart.length) ? prevCellChart.length : 0;
        if (prevCellObj && prevCellObj.chart) {
            for (var i = 0; i < prevCellImgLen; i++) {
                var overlayEle = document.getElementById(args.id);
                var chartEleClassName = document.getElementById(prevCellChart[i].id);
                if (closest(chartEleClassName, '.' + overlayEle.classList[1]) === overlayEle) {
                    prevChartObj = prevCellChart[i];
                    prevCellChart.splice(i, 1);
                }
            }
            if (currCellObj && currCellObj.chart) {
                currChartObj = currCellObj.chart;
                if (prevChartObj) {
                    currChartObj.push(prevChartObj);
                }
            }
            (currChartObj) ? setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { chart: currChartObj }, true) :
                setCell(currRowIdx.clientY, currColIdx.clientX, sheet, { chart: [prevChartObj] }, true);
            if (args.requestType === 'chartRefresh' && !args.isUndoRedo) {
                var eventArgs = {
                    requestType: 'chartRefresh', currentRowIdx: currRowIdx.clientY, currentColIdx: currColIdx.clientX,
                    currentWidth: args.currentWidth, prevHeight: args.prevHeight, prevWidth: args.prevWidth,
                    prevRowIdx: prevRowIdx.clientY, prevColIdx: prevColIdx.clientX, prevTop: args.prevTop, prevLeft: args.prevLeft,
                    currentTop: args.currentTop, currentLeft: args.currentLeft, currentHeight: args.currentHeight,
                    id: args.id, sheetIdx: this.parent.activeSheetIndex
                };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'chartRefresh' });
            }
        }
    };
    SpreadsheetChart.prototype.processChartRange = function (range, dataSheetIdx, opt) {
        var xRange;
        var yRange;
        var lRange;
        var trVal;
        var blVal;
        var tlVal;
        var minr = range[0];
        var minc = range[1];
        var isStringSeries = false;
        var maxr = range[2];
        var maxc = range[3];
        var isSingleRow = minr === maxr;
        var isSingleCol = minc === maxc;
        trVal = this.getPropertyValue(minr, maxc, dataSheetIdx);
        // trVal = this.getParseValue(trVal);
        blVal = this.getPropertyValue(maxr, minc, dataSheetIdx);
        // blVal = this.getParseValue(blVal);
        tlVal = this.getPropertyValue(minr, minc, dataSheetIdx);
        // tlVal = this.getParseValue(tlVal);
        if (!isNumber(blVal) || !tlVal) {
            isStringSeries = true;
        }
        if (isNullOrUndefined(tlVal) && !isSingleRow && !isSingleCol || (opt.type === 'Scatter' && range[3] - range[1] === 1)) {
            xRange = [minr + 1, minc, maxr, minc];
            yRange = [minr + 1, minc + 1, maxr, maxc];
            lRange = [minr, minc + 1, minr, maxc];
        }
        else if ((!isNullOrUndefined(blVal) && isStringSeries && !isSingleRow && !isSingleCol)) {
            if (!isNullOrUndefined(trVal) && (!isNumber(trVal) || !tlVal)) {
                xRange = [minr + 1, minc, maxr, minc];
                yRange = [minr + 1, minc + 1, maxr, maxc];
                lRange = [minr, minc + 1, minr, maxc];
            }
            else {
                xRange = [minr, minc, maxr, minc];
                yRange = [minr, minc + 1, maxr, maxc];
            }
        }
        else {
            yRange = [minr, minc, maxr, maxc];
            if ((!isNullOrUndefined(trVal) && !isNumber(trVal) && !isDateTime(trVal))) {
                lRange = [minr, minc, minr, maxc];
                yRange[0] = yRange[0] + 1;
            }
            else if (isNullOrUndefined(tlVal) && (isSingleRow || isSingleCol)) {
                lRange = [minr, minc, minr, maxc];
                if (isSingleRow) {
                    yRange[1] = yRange[1] + 1;
                    lRange[3] = lRange[1];
                }
                else {
                    yRange[0] = yRange[0] + 1;
                }
            }
        }
        return { xRange: xRange, yRange: yRange, lRange: lRange };
    };
    SpreadsheetChart.prototype.toIntrnlRange = function (range, sheetIdx) {
        if (!range) {
            range = getRangeIndexes[this.parent.sheets[sheetIdx].selectedRange];
        }
        else if (typeof (range) === 'string') {
            range = getRangeIndexes[range];
        }
        return range;
    };
    SpreadsheetChart.prototype.getRangeData = function (options) {
        options.sheetIdx = isNullOrUndefined(options.sheetIdx) ? this.parent.getActiveSheet().index : options.sheetIdx;
        var sheet = this.parent.sheets[options.sheetIdx];
        options.range = this.toIntrnlRange(options.range, options.sheetIdx);
        var minc;
        var minr;
        var maxr;
        var maxc;
        var skipVirtualHiddenRow;
        var isRowHidden;
        var rowIdx = [];
        var arr = [];
        skipVirtualHiddenRow = false;
        minr = options.range[0];
        maxr = options.range[2];
        maxc = options.range[3];
        isRowHidden = isHiddenRow(sheet, minr);
        if (skipVirtualHiddenRow && isRowHidden) {
            maxr++;
        }
        else if (!isRowHidden) {
            minc = skipVirtualHiddenRow ? 0 : options.range[1];
            this.pushRowData(options, minr, minc, maxr, maxc, arr, rowIdx, true, options.isYvalue);
        }
        return arr;
    };
    SpreadsheetChart.prototype.pushRowData = function (options, minr, minc, maxr, maxc, arr, rowIdx, isDataSrcEnsured, isYvalue) {
        var minCol = minc;
        while (minr <= maxr) {
            minc = minCol;
            while (minc <= maxc) {
                var value = '';
                var cell = getCell(minr, minc, this.parent.getActiveSheet());
                if (cell && cell.format && !isYvalue) {
                    var forArgs = {
                        value: cell && cell.value, format: cell && cell.format ? cell.format : 'General',
                        formattedText: cell && cell.value, onLoad: true,
                        type: cell && getTypeFromFormat(cell.format),
                        rowIdx: minr.toString(), colIdx: minc.toString(),
                        isRightAlign: false, cell: cell,
                    };
                    this.parent.notify(getFormattedCellObject, forArgs);
                    value = forArgs.formattedText.toString();
                }
                else {
                    value = this.parent.getValueRowCol(options.sheetIdx, minr + 1, minc + 1);
                }
                // = this.parent.getValueRowCol(options.sheetIdx, minr + 1, minc + 1);
                arr.push({ value: value });
                minc++;
            }
            minr++;
        }
        rowIdx.push(minr);
    };
    SpreadsheetChart.prototype.toArrayData = function (args) {
        var prop = 'value';
        var obj;
        var i = 0;
        var temp = [];
        var len = args.length;
        while (i < len) {
            obj = args[i];
            if (Object.keys(obj).length) {
                if (prop in obj) {
                    temp.push(obj[prop]);
                }
            }
            else {
                temp.push('');
            }
            i++;
        }
        return temp;
    };
    SpreadsheetChart.prototype.getVirtualXValues = function (limit) {
        var i = 1;
        var arr = [];
        while (i < limit) {
            arr.push(i.toString());
            i++;
        }
        return arr;
    };
    // tslint:disable-next-line:max-func-body-length
    SpreadsheetChart.prototype.processChartSeries = function (options, sheetIndex, xRange, yRange, lRange) {
        options = options || {};
        var seriesName = '';
        var val;
        var len;
        var xValue;
        var yValue;
        var lValue;
        var diff;
        var pArr;
        var pObj = {};
        var j;
        var inc;
        var i = 0;
        var yInc = 0;
        var sArr = [];
        var tArr = ['value2'];
        var dtVal;
        yValue = this.getRangeData({ range: yRange, sheetIdx: sheetIndex, skipFormula: true, isYvalue: true });
        var rDiff = (yRange[2] - yRange[0]) + 1;
        var cDiff = (yRange[3] - yRange[1]) + 1;
        if (options.isSeriesInRows) {
            xValue = lRange ? this.toArrayData(this.getRangeData({ range: lRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false })) :
                this.getVirtualXValues(cDiff + 1);
            if (xRange) {
                lValue = this.toArrayData(this.getRangeData({ range: xRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false }));
            }
            diff = rDiff;
        }
        else {
            xValue = xRange ? this.toArrayData(this.getRangeData({ range: xRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false })) :
                this.getVirtualXValues(rDiff + 1);
            if (lRange) {
                lValue = this.toArrayData(this.getRangeData({ range: lRange, sheetIdx: sheetIndex, skipFormula: false, isYvalue: false }));
            }
            diff = cDiff;
        }
        len = xValue.length;
        inc = options.isSeriesInRows ? 1 : diff;
        while (i < diff) {
            j = 0;
            pArr = [];
            yInc = options.isSeriesInRows ? yInc : i;
            while (j < len) {
                if (yValue[yInc]) {
                    val = yValue[yInc].value;
                    if (isNumber(val)) {
                        val = Number(val);
                    }
                    else {
                        dtVal = dateToInt(val);
                        val = isNaN(dtVal) ? 0 : dtVal;
                    }
                    pArr.push({ x: xValue[j], y: val });
                }
                yInc += inc;
                j++;
            }
            if (lValue && lValue.length > 0) {
                seriesName = lValue[i];
            }
            else {
                seriesName = 'series' + i;
            }
            if (options.type) {
                var type = options.type;
                if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), marker: {
                            visible: true,
                            width: 10,
                            height: 10
                        }
                    };
                }
                else if (type === 'Scatter') {
                    pObj = {
                        dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString(), marker: {
                            visible: false,
                            width: 12,
                            height: 12,
                            shape: 'Circle'
                        }
                    };
                }
                else if (type === 'Pie' || type === 'Doughnut') {
                    var innerRadius = options.type === 'Pie' ? '0%' : '40%';
                    pObj = {
                        dataSource: pArr,
                        dataLabel: {
                            visible: true, position: 'Inside', name: 'text', font: { fontWeight: '600' }
                        },
                        radius: '100%', xName: 'x', yName: 'y', startAngle: 0, endAngle: 360, innerRadius: innerRadius, explode: true,
                        explodeOffset: '10%', explodeIndex: 0, name: 'Browser'
                    };
                }
                else {
                    pObj = { dataSource: pArr, type: options.type, xName: 'x', yName: 'y', name: seriesName.toString() };
                }
            }
            sArr.push(pObj);
            i++;
        }
        var retVal;
        if (options.type) {
            var type = options.type;
            retVal = {
                series: sArr, xRange: options.isSeriesInRows ? lRange : xRange,
                yRange: yRange, lRange: options.isSeriesInRows ? xRange : lRange
            };
        }
        return retVal;
    };
    SpreadsheetChart.prototype.primaryYAxisFormat = function (yRange) {
        if (isNullOrUndefined(yRange)) {
            return '{value}';
        }
        var type;
        var cell = getCell(yRange[0], yRange[1], this.parent.getActiveSheet());
        if (cell && cell.format) {
            type = getTypeFromFormat(cell.format);
            if (type === 'Accounting') {
                return '${value}';
            }
            else if (type === 'Currency') {
                return '${value}';
            }
            else if (type === 'Percentage') {
                return '{value}%';
            }
        }
        return '{value}';
    };
    SpreadsheetChart.prototype.focusChartRange = function (xRange, yRange, lRange) {
        var border = ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        this.clearBorder();
        if (lRange) {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: lRange[0], colIndex: lRange[1] },
                endcell: { rowIndex: lRange[2], colIndex: lRange[3] }, classes: [border[0], border[1]]
            });
        }
        if (xRange) {
            this.parent.notify(focusBorder, {
                startcell: { rowIndex: xRange[0], colIndex: xRange[1] },
                endcell: { rowIndex: xRange[2], colIndex: xRange[3] }, classes: [border[2], border[3]]
            });
        }
        this.parent.notify(focusBorder, {
            startcell: { rowIndex: yRange[0], colIndex: yRange[1] },
            endcell: { rowIndex: yRange[2], colIndex: yRange[3] }, classes: [border[4], border[5]]
        });
    };
    SpreadsheetChart.prototype.clearBorder = function () {
        var mainCont = this.parent.getMainContent();
        var border = ['e-rcborderright', 'e-rcborderbottom', 'e-vcborderright', 'e-vcborderbottom', 'e-bcborderright', 'e-bcborderbottom'];
        for (var borderIdx = 0; borderIdx < border.length; borderIdx++) {
            var eleColl = mainCont.querySelectorAll('.' + border[borderIdx]);
            for (var tdIdx = 0; tdIdx < eleColl.length; tdIdx++) {
                var td = eleColl[tdIdx];
                td.classList.remove(border[borderIdx]);
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    SpreadsheetChart.prototype.initiateChartHandler = function (argsOpt) {
        var isRangeSelect = true;
        isRangeSelect = isNullOrUndefined(argsOpt.isInitCell) ? true : !argsOpt.isInitCell;
        var l10n = this.parent.serviceLocator.getService(locale);
        argsOpt.isUndoRedo = isNullOrUndefined(argsOpt.isUndoRedo) ? true : argsOpt.isUndoRedo;
        var seriesModel;
        argsOpt.isRefresh = isNullOrUndefined(argsOpt.isRefresh) ? false : argsOpt.isRefresh;
        var sheet = this.parent.getActiveSheet();
        var range = argsOpt.option.range ? (argsOpt.option.range.indexOf('!') > 0) ?
            argsOpt.option.range.split('!')[1] : argsOpt.option.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        var rangeIdx = getRangeIndexes(range);
        var top;
        var left;
        var position;
        var options = {};
        var isRowLesser;
        var xRange;
        var yRange;
        var lRange;
        var eventArgs;
        if (!this.parent.allowChart && sheet.isProtected) {
            return seriesModel;
        }
        var sheetIdx = (argsOpt.option.range && argsOpt.option.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, argsOpt.option.range.split('!')[0]) : this.parent.activeSheetIndex;
        var args = {
            sheetIndex: sheetIdx, reqType: 'shape', type: 'actionBegin', shapeType: 'chart',
            action: 'create', options: argsOpt.option, range: range, operation: 'create',
        };
        options = args.options;
        range = args.range;
        options = options || {};
        var chartOptions;
        var chartRange;
        var type = 'chart';
        if (rangeIdx.length > 0) {
            var rDiff = rangeIdx[2] - rangeIdx[0];
            var cDiff = rangeIdx[3] - rangeIdx[1];
            if (rDiff < cDiff) {
                isRowLesser = true;
            }
        }
        options.isSeriesInRows = isRowLesser ? true : options.isSeriesInRows ? options.isSeriesInRows : false;
        argsOpt.dataSheetIdx = isNullOrUndefined(argsOpt.dataSheetIdx) ? sheetIdx : argsOpt.dataSheetIdx;
        chartRange = this.processChartRange(rangeIdx, argsOpt.dataSheetIdx, options);
        xRange = chartRange.xRange;
        yRange = chartRange.yRange;
        lRange = chartRange.lRange;
        if (sheetIdx === this.parent.activeSheetIndex && isRangeSelect) {
            this.focusChartRange(xRange, yRange, lRange);
        }
        chartOptions = this.processChartSeries(options, argsOpt.dataSheetIdx, xRange, yRange, lRange);
        var primaryXAxis = {
            majorGridLines: { width: 0 },
            minorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 },
            lineStyle: { width: 0 },
            valueType: 'Category'
        };
        var primaryYAxis = {
            lineStyle: { width: 0 },
            majorTickLines: { width: 0 },
            majorGridLines: { width: 1 },
            minorGridLines: { width: 1 },
            minorTickLines: { width: 0 },
            labelFormat: this.primaryYAxisFormat(yRange)
        };
        if (argsOpt.isRefresh) {
            return chartOptions.series;
        }
        if (argsOpt.isUndoRedo) {
            eventArgs = {
                type: argsOpt.option.type, theme: argsOpt.option.theme, isSeriesInRows: argsOpt.option.isSeriesInRows,
                range: argsOpt.option.range, id: argsOpt.option.id, posRange: argsOpt.range, isInitCell: argsOpt.isInitCell, cancel: false
            };
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeInsertChart' });
            if (eventArgs.cancel) {
                return [];
            }
            argsOpt.option.type = eventArgs.type;
            argsOpt.option.theme = eventArgs.theme;
            argsOpt.option.isSeriesInRows = eventArgs.isSeriesInRows;
            argsOpt.option.range = eventArgs.range;
            argsOpt.option.id = eventArgs.id;
        }
        var id = argsOpt.option.id + '_overlay';
        var sheetIndex = (argsOpt.option.range && argsOpt.option.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, argsOpt.option.range.split('!')[0]) : this.parent.activeSheetIndex;
        var overlayObj = this.parent.serviceLocator.getService(overlay);
        var eleRange = !isNullOrUndefined(argsOpt.isInitCell) && argsOpt.isInitCell ? argsOpt.range : range;
        var element = overlayObj.insertOverlayElement(id, eleRange, sheetIndex);
        element.classList.add('e-datavisualization-chart');
        element.style.width = '482px';
        element.style.height = '290px';
        var chartContent = this.parent.createElement('div', {
            id: argsOpt.option.id, className: argsOpt.option.id
        });
        if (argsOpt.option.type !== 'Pie' && argsOpt.option.type !== 'Doughnut') {
            this.chart = new Chart({
                primaryXAxis: primaryXAxis,
                primaryYAxis: primaryYAxis,
                chartArea: {
                    border: {
                        width: 0
                    }
                },
                series: chartOptions.series,
                tooltip: {
                    enable: true
                },
                width: element.style.width,
                height: element.style.height,
                load: function (args) {
                    var selectedTheme = argsOpt.option.theme;
                    selectedTheme = selectedTheme ? selectedTheme : 'Material';
                    args.chart.theme = (selectedTheme.charAt(0).toUpperCase() +
                        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
                }
            });
            this.chart.appendTo(chartContent);
        }
        else {
            this.chart = new AccumulationChart({
                series: chartOptions.series,
                width: element.style.width,
                height: element.style.height,
                center: { x: '50%', y: '50%' },
                enableSmartLabels: true,
                enableAnimation: true,
                legendSettings: { visible: true, position: 'Bottom' },
                load: function (args) {
                    var selectedTheme = location.hash.split('/')[1];
                    selectedTheme = selectedTheme ? selectedTheme : 'Material';
                    args.accumulation.theme = (selectedTheme.charAt(0).toUpperCase() +
                        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
                }
            });
            this.chart.appendTo(chartContent);
        }
        element.appendChild(chartContent);
        if (argsOpt.isUndoRedo) {
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'insertChart' });
        }
        return seriesModel;
    };
    SpreadsheetChart.prototype.deleteChart = function (args) {
        this.clearBorder();
        var chartElements = null;
        var sheet;
        if (isNullOrUndefined(args.id)) {
            chartElements = document.querySelector('.e-datavisualization-chart.e-ss-overlay-active');
            args.id = chartElements ? chartElements.getElementsByClassName('e-control')[0].id : null;
        }
        else {
            args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
            chartElements = document.getElementById(args.id);
        }
        if (isNullOrUndefined(args.id) || isNullOrUndefined(chartElements)) {
            return;
        }
        else {
            args.id = args.id.includes('overlay') ? args.id : args.id + '_overlay';
        }
        var rowIdx;
        var colIdx;
        var cellObj;
        var prevCellChart;
        var chartLength;
        var isRemoveEle = false;
        var chartObj;
        for (var i = 0; i < this.parent.chartColl.length; i++) {
            if (this.parent.chartColl[i].id === args.id.split('_overlay')[0]) {
                chartObj = this.parent.chartColl[i];
                break;
            }
        }
        var eventArgs = {
            id: chartObj.id, range: chartObj.range, type: chartObj.type, theme: chartObj.theme,
            isSeriesInRows: chartObj.isSeriesInRows, isInitCell: true, posRange: null, cancel: false
        };
        if (chartElements) {
            this.parent.notify(deleteChartColl, { id: args.id });
            var imgTop = { clientY: chartElements.offsetTop, isImage: true };
            this.parent.notify(getRowIdxFromClientY, imgTop);
            var imgleft = { clientX: chartElements.offsetLeft, isImage: true };
            this.parent.notify(getColIdxFromClientX, imgleft);
            isRemoveEle = true;
            rowIdx = imgTop.clientY;
            colIdx = imgleft.clientX;
            sheet = this.parent.sheets[this.parent.activeSheetIndex];
        }
        else {
            this.parent.notify(deleteChartColl, { id: args.id });
            var sheetIndex = args.range && args.range.indexOf('!') > 0 ? getSheetIndex(this.parent, args.range.split('!')[0]) :
                this.parent.activeSheetIndex;
            var rangeVal = args.range ? args.range.indexOf('!') > 0 ? args.range.split('!')[1] : args.range.split('!')[0] :
                this.parent.getActiveSheet().selectedRange;
            var index = getRangeIndexes(rangeVal);
            rowIdx = index[0];
            colIdx = index[1];
            sheet = this.parent.sheets[sheetIndex];
        }
        cellObj = getCell(rowIdx, colIdx, sheet);
        if (cellObj) {
            prevCellChart = cellObj.chart;
        }
        chartLength = prevCellChart ? prevCellChart.length : chartLength;
        for (var i = 0; i < chartLength; i++) {
            var overlayEle = document.getElementById(args.id);
            var chartEleClassName = document.getElementById(prevCellChart[i].id);
            if (closest(chartEleClassName, '.' + overlayEle.classList[1]) === overlayEle) {
                prevCellChart.splice(i, 1);
            }
        }
        if (isRemoveEle) {
            document.getElementById(args.id).remove();
        }
        setCell(rowIdx, colIdx, sheet, { chart: prevCellChart }, true);
        eventArgs.posRange = getCellAddress(rowIdx, colIdx);
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteChart' });
    };
    /**
     * Removing event listener for success and failure
     */
    SpreadsheetChart.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateChart, this.initiateChartHandler);
            this.parent.off(refreshChartCellObj, this.refreshChartCellObj);
            this.parent.off(updateChart, this.updateChartHandler);
            this.parent.off(deleteChart, this.deleteChart);
            this.parent.off(clearChartBorder, this.clearBorder);
            this.parent.off(insertChart, this.insertChartHandler);
        }
    };
    /**
     * To Remove the event listeners.
     */
    SpreadsheetChart.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        var chartEle = null;
        if (this.chart) {
            chartEle = this.chart.element;
            this.chart.destroy();
        }
        if (chartEle) {
            detach(chartEle);
        }
        this.chart = null;
    };
    /**
     * Get the sheet chart module name.
     */
    SpreadsheetChart.prototype.getModuleName = function () {
        return 'spreadsheetChart';
    };
    return SpreadsheetChart;
}());
export { SpreadsheetChart };
