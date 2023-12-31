import { PivotEngine, IPivotValues } from '../../base/engine';
import { INumberIndex } from '../../base/engine';
import { IMultiLevelLabelClickEventArgs } from '@syncfusion/ej2-charts';
import { ChartSettingsModel } from '../../pivotview/model/chartsettings-model';
import { PivotView } from '../../pivotview';
import { OlapEngine } from '../../base/olap/engine';
export declare class PivotChart {
    private chartSeries;
    private dataSourceSettings;
    private accumulationMenu;
    private currentColumn;
    private pivotIndex;
    private chartSettings;
    private element;
    private templateFn;
    private chartElement;
    private measureList;
    private headerColl;
    private maxLevel;
    private columnGroupObject;
    private persistSettings;
    private fieldPosition;
    private measurePos;
    private measuresNames;
    private accumulationType;
    private accEmptyPoint;
    /** @hidden */
    calculatedWidth: number;
    /** @hidden */
    currentMeasure: string;
    /** @hidden */
    engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    parent: PivotView;
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName(): string;
    loadChart(parent: PivotView, chartSettings: ChartSettingsModel): void;
    /**
     * Refreshing chart based on the updated chartSettings.
     * @returns void
     */
    refreshChart(): void;
    private frameObjectWithKeys;
    private frameChartSeries;
    private bindChart;
    private pointClick;
    private frameAxesWithRows;
    private getFormat;
    /** @hidden */
    getColumnTotalIndex(pivotValues: IPivotValues): INumberIndex;
    private groupHierarchyWithLevels;
    private frameMultiLevelLabels;
    private getZoomFactor;
    private configTooltipSettings;
    private configLegendSettings;
    private configXAxis;
    private configZoomSettings;
    private tooltipRender;
    private tooltipTemplateFn;
    private loaded;
    /** @hidden */
    updateView(): void;
    private creatMenu;
    private drillMenuOpen;
    private getMenuItems;
    private drillMenuSelect;
    private getChartHeight;
    private getChartAutoHeight;
    private axisLabelRender;
    private multiLevelLabelClick;
    /** @hidden */
    onDrill(args: IMultiLevelLabelClickEventArgs | any): void;
    private isAttributeDrill;
    private load;
    private resized;
    /**
     * To destroy the chart module
     * @returns void
     * @hidden
     */
    destroy(): void;
}
