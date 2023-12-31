import { PivotCommon } from '../base/pivot-common';
import { IFieldOptions } from '../../base/engine';
import { PivotButton } from '../actions/pivot-button';
/**
 * `DataSourceUpdate` module is used to update the dataSource.
 */
/** @hidden */
export declare class DataSourceUpdate {
    parent: PivotCommon;
    /** @hidden */
    btnElement: HTMLElement;
    /** @hidden */
    control: any;
    /** @hidden */
    pivotButton: PivotButton;
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotCommon);
    /**
     * Updates the dataSource by adding the given field along with field dropped position to the dataSource.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @param  {string} droppedClass -  Defines dropped field axis name to update dataSource.
     * @param  {number} fieldCaption - Defines dropped position to the axis based on field position.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    updateDataSource(fieldName: string, droppedClass: string, droppedPosition: number): void;
    /**
     * Updates the dataSource by removing the given field from the dataSource.
     * @param  {string} fieldName - Defines dropped field name to remove dataSource.
     * @method removeFieldFromReport
     * @return {void}
     * @hidden
     */
    removeFieldFromReport(fieldName: string): IFieldOptions;
    /**
     * Creates new field object given field name from the field list data.
     * @param  {string} fieldName - Defines dropped field name to add dataSource.
     * @method getNewField
     * @return {void}
     * @hidden
     */
    getNewField(fieldName: string, fieldItem?: IFieldOptions): IFieldOptions;
}
