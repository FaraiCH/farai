import { Workbook } from '../base/index';
/**
 * Data binding module
 */
export declare class DataBind {
    private parent;
    private requestedInfo;
    constructor(parent: Workbook);
    private addEventListener;
    private removeEventListener;
    /**
     * Update given data source to sheet.
     */
    private updateSheetFromDataSourceHandler;
    private checkResolve;
    private getCellDataFromProp;
    private checkDataForFormat;
    private getLoadedInfo;
    private getMaxCount;
    private initRangeInfo;
    /**
     * Remove old data from sheet.
     */
    private dataSourceChangedHandler;
    private checkRangeHasChanges;
    /**
     * Triggers dataSourceChange event when cell data changes
     */
    private dataChangedHandler;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * Destroys the Data binding module.
     * @return {void}
     */
    destroy(): void;
}
