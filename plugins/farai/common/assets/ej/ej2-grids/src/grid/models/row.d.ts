import { Cell } from './cell';
import { IGrid } from '../base/interface';
/**
 * Row
 * @hidden
 */
export declare class Row<T> {
    parent?: IGrid;
    uid: string;
    data: Object;
    tIndex: number;
    isCaptionRow: boolean;
    changes: Object;
    isDirty: boolean;
    aggregatesCount: number;
    edit: string;
    isSelected: boolean;
    isFreezeRow: boolean;
    isReadOnly: boolean;
    isAltRow: boolean;
    isDataRow: boolean;
    isExpand: boolean;
    rowSpan: number;
    cells: Cell<T>[];
    index: number;
    indent: number;
    subRowDetails: Object;
    height: string;
    visible: boolean;
    attributes: {
        [x: string]: Object;
    };
    cssClass: string;
    lazyLoadCssClass: string;
    foreignKeyData: Object;
    isDetailRow: boolean;
    childGrid: IGrid;
    parentUid: string;
    constructor(options: {
        [x: string]: Object;
    }, parent?: IGrid);
    clone(): Row<T>;
    /**
     * Replaces the row data and grid refresh the particular row element only.
     * @param  {Object} data - To update new data for the particular row.
     * @return {void}
     */
    setRowValue(data: Object): void;
    /**
     * Replaces the given field value and refresh the particular cell element only.
     * @param {string} field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     * @return {void}
     */
    setCellValue(field: string, value: string | number | boolean | Date): void;
    private makechanges;
}
