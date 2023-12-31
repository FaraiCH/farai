import { getRangeIndexes, inRange } from '../common/index';
import { setCell, getSheetIndex, getCell, getSheetNameFromAddress } from '../base/index';
import { setChart, initiateChart, refreshChart, updateChart, deleteChartColl, refreshChartSize, focusChartBorder } from '../common/event';
import { closest, isNullOrUndefined, getComponent } from '@syncfusion/ej2-base';
/**
 * The `WorkbookChart` module is used to handle chart action in Spreadsheet.
 */
var WorkbookChart = /** @class */ (function () {
    /**
     * Constructor for WorkbookChart module.
     */
    function WorkbookChart(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WorkbookChart.prototype.addEventListener = function () {
        this.parent.on(setChart, this.setChartHandler, this);
        this.parent.on(refreshChart, this.refreshChartData, this);
        this.parent.on(deleteChartColl, this.deleteChartColl, this);
        this.parent.on(refreshChartSize, this.refreshChartSize, this);
        this.parent.on(focusChartBorder, this.focusChartBorder, this);
    };
    WorkbookChart.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setChart, this.setChartHandler);
            this.parent.off(refreshChart, this.refreshChartData);
            this.parent.off(deleteChartColl, this.deleteChartColl);
            this.parent.off(refreshChartSize, this.refreshChartSize);
            this.parent.off(focusChartBorder, this.focusChartBorder);
        }
    };
    WorkbookChart.prototype.setChartHandler = function (args) {
        var i = 0;
        args.isInitCell = isNullOrUndefined(args.isInitCell) ? false : args.isInitCell;
        args.isUndoRedo = isNullOrUndefined(args.isUndoRedo) ? true : args.isUndoRedo;
        args.isPaste = isNullOrUndefined(args.isPaste) ? false : args.isPaste;
        var chart = args.chart;
        if (chart.length > 0) {
            while (i < chart.length) {
                if (args.isCut === false) {
                    if (document.getElementById(args.chart[i].id)) {
                        chart[i] = {
                            range: chart[i].range, id: 'e_spreadsheet_chart_' + this.parent.chartCount,
                            isSeriesInRows: chart[i].isSeriesInRows, theme: chart[i].theme, type: chart[i].type
                        };
                        chart[i].id = 'e_spreadsheet_chart_' + this.parent.chartCount;
                        args.isIdAvailabe = false;
                    }
                }
                if (document.getElementById(args.chart[i].id)) {
                    return;
                }
                var idAvailable = isNullOrUndefined(args.isIdAvailabe) ? true : args.isIdAvailabe;
                chart[i].theme = chart[i].theme || 'Material';
                chart[i].type = chart[i].type || 'Line';
                chart[i].isSeriesInRows = chart[i].isSeriesInRows || false;
                chart[i].range = chart[i].range || this.parent.getActiveSheet().selectedRange;
                if (isNullOrUndefined(chart[i].id)) {
                    chart[i].id = 'e_spreadsheet_chart_' + this.parent.chartCount;
                    idAvailable = false;
                }
                this.parent.notify(initiateChart, {
                    option: chart[i], chartCount: this.parent.chartCount, isInitCell: args.isInitCell, isUndoRedo: args.isUndoRedo,
                    dataSheetIdx: args.dataSheetIdx, range: args.range
                });
                this.parent.chartColl.push(chart[i]);
                if (!idAvailable) {
                    this.parent.chartCount++;
                }
                if (!args.isInitCell || args.isPaste) {
                    var sheetIdx = (chart[i].range && chart[i].range.indexOf('!') > 0) ?
                        getSheetIndex(this.parent, chart[i].range.split('!')[0]) : this.parent.activeSheetIndex;
                    var indexes = args.isPaste ? getRangeIndexes(args.range) : getRangeIndexes(chart[i].range);
                    var sheet = sheetIdx ? this.parent.sheets[sheetIdx] : this.parent.getActiveSheet();
                    var cell = getCell(indexes[0], indexes[1], sheet);
                    if (cell && cell.chart) {
                        cell.chart.push(chart[i]);
                    }
                    else {
                        setCell(indexes[0], indexes[1], sheet, { chart: [chart[i]] }, true);
                    }
                }
                i++;
            }
        }
    };
    WorkbookChart.prototype.refreshChartData = function (args) {
        var i;
        var j = 1;
        var cnt = this.parent.sheets.length + 1;
        while (j < cnt) {
            var charts = this.parent.chartColl;
            i = charts ? charts.length : 0;
            if (i) {
                while (i--) {
                    var chart = this.parent.chartColl[i];
                    var isInRange = inRange(getRangeIndexes(chart.range), args.rIdx, args.cIdx)
                        && (chart.range.indexOf('!') > -1 ?
                            getSheetIndex(this.parent, getSheetNameFromAddress(chart.range)) !== this.parent.activeSheetIndex : true);
                    if (isInRange) {
                        this.parent.notify(updateChart, { chart: chart });
                    }
                }
            }
            j++;
        }
    };
    WorkbookChart.prototype.refreshChartSize = function (args) {
        var chartCnt;
        var j = 1;
        var sheetCnt = this.parent.sheets.length + 1;
        while (j < sheetCnt) {
            var charts = this.parent.chartColl;
            chartCnt = charts ? charts.length : 0;
            if (chartCnt) {
                while (chartCnt--) {
                    var chart = this.parent.chartColl[chartCnt];
                    if (!isNullOrUndefined(args.overlayEle.querySelector('#' + chart.id))) {
                        var chartObj = this.parent.element.querySelector('.' + chart.id);
                        var excelFilter = getComponent(chartObj, 'chart');
                        excelFilter.height = args.height;
                        excelFilter.width = args.width;
                    }
                }
            }
            j++;
        }
    };
    WorkbookChart.prototype.focusChartBorder = function (args) {
        for (var idx = 0; idx < this.parent.chartColl.length; idx++) {
            var overlayEle = document.getElementById(args.id);
            var chartEle = document.getElementById(this.parent.chartColl[idx].id);
            if (overlayEle && chartEle && closest(chartEle, '.' + overlayEle.classList[1]) === overlayEle) {
                this.parent.notify(initiateChart, {
                    option: this.parent.chartColl[idx], chartCount: this.parent.chartCount, isRefresh: true
                });
            }
        }
    };
    WorkbookChart.prototype.deleteChartColl = function (args) {
        for (var idx = 0; idx < this.parent.chartColl.length; idx++) {
            var chartElement = document.getElementById(this.parent.chartColl[idx].id);
            var overlayElement = document.getElementById(args.id);
            if (overlayElement && chartElement && closest(chartElement, '.' + overlayElement.classList[1]) === overlayElement) {
                this.parent.chartColl.splice(idx, 1);
            }
        }
    };
    /**
     * To Remove the event listeners.
     */
    WorkbookChart.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook chart module name.
     */
    WorkbookChart.prototype.getModuleName = function () {
        return 'workbookChart';
    };
    return WorkbookChart;
}());
export { WorkbookChart };
