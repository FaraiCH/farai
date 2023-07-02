import { DataManager, Query } from '@syncfusion/ej2-data';
import { Kanban } from './kanban';
import { SaveChanges } from './interface';
/**
 * Kanban data module
 * @hidden
 */
export declare class Data {
    private parent;
    private kanbanData;
    dataManager: DataManager;
    private query;
    private keyField;
    /**
     * Constructor for data module
     * @private
     */
    constructor(parent: Kanban);
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    private initDataManager;
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    getQuery(): Query;
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    private getData;
    /**
     * The function used to get the table name from the given Query
     * @return {string}
     * @private
     */
    private getTable;
    /**
     * The function is used to send the request and get response from datamanager
     * @return {void}
     * @private
     */
    private refreshDataManager;
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerSuccess;
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerFailure;
    /**
     * The function is used to perform the insert, update, delete and batch actions in datamanager
     * @return {void}
     * @private
     */
    updateDataManager(updateType: string, params: SaveChanges, type: string, data: {
        [key: string]: Object;
    }, index?: number): void;
    /**
     * The function is used to refresh the UI once the datamanager action is completed
     * @return {void}
     * @private
     */
    private refreshUI;
}
