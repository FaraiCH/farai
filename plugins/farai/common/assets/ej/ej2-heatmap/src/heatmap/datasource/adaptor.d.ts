/**
 * HeatMap Adaptor file
 */
import { HeatMap } from '../heatmap';
import { ChildProperty } from '@syncfusion/ej2-base';
import { AdaptorType } from '../utils/enum';
import { DataModel } from './adaptor-model';
import { BubbleDataModel } from '../model/base-model';
/**
 * Configures the Adaptor Property in the Heatmap.
 */
export declare class Data extends ChildProperty<Data> {
    /**
     * Specifies the provided datasource is an JSON data.
     * @default false
     */
    isJsonData: boolean;
    /**
     * specifies Adaptor type
     * @default None
     */
    adaptorType: AdaptorType;
    /**
     * Specifies xAxis mapping.
     * @default ''
     */
    xDataMapping: string;
    /**
     * Specifies yAxis mapping.
     * @default ''
     */
    yDataMapping: string;
    /**
     * Specifies value mapping.
     * @default ''
     */
    valueMapping: string;
    /**
     * Specifies data mapping for size and color bubble type.
     */
    bubbleDataMapping: BubbleDataModel;
}
export declare class AdaptiveMinMax {
    min: Object;
    max: Object;
}
/**
 *
 * The `Adaptor` module is used to handle JSON and Table data.
 */
export declare class Adaptor {
    private heatMap;
    reconstructData: Object[][];
    reconstructedXAxis: string[];
    reconstructedYAxis: string[];
    private tempSplitDataCollection;
    adaptiveXMinMax: AdaptiveMinMax;
    adaptiveYMinMax: AdaptiveMinMax;
    constructor(heatMap?: HeatMap);
    /**
     * Method to construct Two Dimentional Datasource.
     * @return {void}
     * @private
     */
    constructDatasource(dataSource: object, dataSourceSettings: DataModel): void;
    /**
     * Method to construct Axis Collection.
     * @return {void}
     * @private
     */
    private constructAdaptiveAxis;
    /**
     * Method to calculate Numeric Axis Collection.
     * @return {string[]}
     * @private
     */
    private getNumericAxisCollection;
    /**
     * Method to calculate DateTime Axis Collection.
     * @return {string[]}
     * @private
     */
    private getDateAxisCollection;
    /**
     * Method to calculate Maximum and Minimum Value from datasource.
     * @return {void}
     * @private
     */
    private getMinMaxValue;
    /**
     * Method to process Cell datasource.
     * @return {Object}
     * @private
     */
    private processCellData;
    /**
     * Method to process JSON Cell datasource.
     * @return {Object}
     * @private
     */
    private processJsonCellData;
    /**
     * Method to generate axis labels when labels are not given.
     * @return {string}
     * @private
     */
    private generateAxisLabels;
    /**
     * Method to get data from complex mapping.
     * @return {number|string}
     * @private
     */
    private getSplitDataValue;
    /**
     * Method to process JSON Table datasource.
     * @return {Object}
     * @private
     */
    private processJsonTableData;
    /**
     * To destroy the Adaptor.
     * @return {void}
     * @private
     */
    destroy(heatMap: HeatMap): void;
    /**
     * To get Module name
     */
    protected getModuleName(): string;
}
