import { Gantt } from '../base/gantt';
import { SortDirection } from '@syncfusion/ej2-grids';
/**
 * The Sort module is used to handle sorting action.
 */
export declare class Sort {
    parent: Gantt;
    constructor(gantt: Gantt);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName;
    /**
     * @private
     */
    private addEventListener;
    /**
     * @hidden
     */
    private removeEventListener;
    /**
     * Destroys the Sorting of TreeGrid.
     * @private
     */
    destroy(): void;
    /**
     * Sort a column with given options.
     * @param {string} columnName - Defines the column name to sort.
     * @param {SortDirection} direction - Defines the direction of sort.
     * @param {boolean} isMultiSort - Defines whether the previously sorted columns are to be maintained.
     */
    sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void;
    /**
     * Method to clear all sorted columns.
     */
    clearSorting(): void;
    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    private updateModel;
    /**
     * To clear sorting for specific column.
     * @param {string} columnName - Defines the sorted column name to remove.
     */
    removeSortColumn(columnName: string): void;
}
