import { Column } from '../models/column';
import { IGrid } from '../base/interface';
/**
 * The `ShowHide` module is used to control column visibility.
 */
export declare class ShowHide {
    private parent;
    /**
     * Constructor for the show hide module.
     * @hidden
     */
    constructor(parent: IGrid);
    /**
     * Shows a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    show(columnName: string | string[], showBy?: string): void;
    /**
     * Hides a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    hide(columnName: string | string[], hideBy?: string): void;
    private getToggleFields;
    private getColumns;
    /**
     * Shows or hides columns by given column collection.
     * @private
     * @param  {Column[]} columns - Specifies the columns.
     * @return {void}
     */
    setVisible(columns?: Column[], changedStateColumns?: Column[]): void;
}
