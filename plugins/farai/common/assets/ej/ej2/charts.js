"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
var index = require("@syncfusion/ej2-charts");
index.Chart.Inject(index.LineSeries, index.ScatterSeries, index.ColumnSeries, index.SplineSeries, index.SplineAreaSeries, index.StripLine, index.AreaSeries, index.ScrollBar, index.StepLineSeries, index.StepAreaSeries, index.StackingColumnSeries, index.StackingLineSeries, index.StackingAreaSeries, index.StackingStepAreaSeries, index.BarSeries, index.StackingBarSeries, index.RangeColumnSeries, index.BubbleSeries, index.Tooltip, index.Crosshair, index.Category, index.DateTime, index.Logarithmic, index.Legend, index.Zoom, index.DataLabel, index.Selection, index.ChartAnnotation, index.HiloSeries, index.HiloOpenCloseSeries, index.WaterfallSeries, index.RangeAreaSeries, index.CandleSeries, index.PolarSeries, index.RadarSeries, index.SmaIndicator, index.TmaIndicator, index.EmaIndicator, index.AccumulationDistributionIndicator, index.MacdIndicator, index.AtrIndicator, index.RsiIndicator, index.MomentumIndicator, index.StochasticIndicator, index.BollingerBands, index.BoxAndWhiskerSeries, index.HistogramSeries, index.ErrorBar, index.Trendlines, index.DateTimeCategory, index.MultiColoredLineSeries, index.MultiColoredAreaSeries, index.MultiLevelLabel, index.ParetoSeries, index.Export, index.DataEditing, index.Highlight);
index.AccumulationChart.Inject(index.PieSeries, index.FunnelSeries, index.PyramidSeries, index.AccumulationTooltip, index.AccumulationLegend, index.AccumulationSelection, index.AccumulationDataLabel, index.AccumulationAnnotation, index.Export);
index.RangeNavigator.Inject(index.RangeTooltip, index.PeriodSelector, index.AreaSeries, index.StepLineSeries, index.DateTime, index.Logarithmic, index.Export);
index.Sparkline.Inject(index.SparklineTooltip);
index.Smithchart.Inject(index.SmithchartLegend, index.TooltipRender);
index.StockChart.Inject(index.LineSeries, index.ColumnSeries, index.SplineSeries, index.SplineAreaSeries, index.StripLine, index.AreaSeries, index.Tooltip, index.Crosshair, index.DateTime, index.Zoom, index.DataLabel, index.Selection, index.ChartAnnotation, index.HiloSeries, index.HiloOpenCloseSeries, index.CandleSeries, index.SmaIndicator, index.TmaIndicator, index.EmaIndicator, index.AccumulationDistributionIndicator, index.MacdIndicator, index.AtrIndicator, index.RsiIndicator, index.MomentumIndicator, index.StochasticIndicator, index.BollingerBands, index.Trendlines, index.RangeTooltip, index.Export);
index.BulletChart.Inject(index.BulletTooltip, index.BulletChartLegend);
__exportStar(require("@syncfusion/ej2-charts"), exports);
