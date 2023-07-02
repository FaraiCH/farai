/**
 * Open properties.
 */
import { Spreadsheet } from '../base/index';
/**
 * Represents Chart support for Spreadsheet.
 */
export declare class SpreadsheetChart {
    private parent;
    private chart;
    /**
     * Constructor for the Spreadsheet Chart module.
     */
    constructor(parent: Spreadsheet);
    /**
     * Adding event listener for success and failure
     */
    private addEventListener;
    private insertChartHandler;
    private getPropertyValue;
    private updateChartHandler;
    private refreshChartCellObj;
    private processChartRange;
    private toIntrnlRange;
    private getRangeData;
    private pushRowData;
    private toArrayData;
    private getVirtualXValues;
    private processChartSeries;
    private primaryYAxisFormat;
    private focusChartRange;
    private clearBorder;
    private initiateChartHandler;
    deleteChart(args: {
        id: string;
        range?: string;
    }): void;
    /**
     * Removing event listener for success and failure
     */
    private removeEventListener;
    /**
     * To Remove the event listeners.
     */
    destroy(): void;
    /**
     * Get the sheet chart module name.
     */
    getModuleName(): string;
}
