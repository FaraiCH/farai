import { PivotCommon } from '../base/pivot-common';
import { IFilter } from '../../base/engine';
import { MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { IOlapField } from '../../base/olap/engine';
/**
 * `EventBase` for active fields action.
 */
/** @hidden */
export declare class EventBase {
    parent: PivotCommon;
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotCommon);
    /**
     * Updates sorting order for the selected field.
     * @method updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    updateSorting(args: Event): void;
    /**
     * Updates sorting order for the selected field.
     * @method updateFiltering
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    updateFiltering(args: Event): void;
    /**
     * Returns boolean by checing the valid filter members from the selected filter settings.
     * @method isValidFilterItemsAvail
     * @param  {string} fieldName - Gets filter members for the given field name.
     * @return {boolean}
     * @hidden
     */
    isValidFilterItemsAvail(fieldName: string, filterObj: IFilter): boolean;
    private getOlapData;
    /**
     * Gets sorted filter members for the selected field.
     * @method sortFilterData
     * @param  {{ [key: string]: Object }[]} treeData - Gets filter members for the given field name.
     * @return {{ [key: string]: Object }[]}
     * @hidden
     */
    sortOlapFilterData(treeData: {
        [key: string]: Object;
    }[], order: string): {
        [key: string]: Object;
    }[];
    private getParentIDs;
    private getChildIDs;
    /**
     * show tree nodes using search text.
     * @hidden
     */
    searchTreeNodes(args: MaskChangeEventArgs, treeObj: TreeView, isFieldCollection: boolean, isHierarchy?: boolean): void;
    private updateOlapSearchTree;
    private getTreeData;
    private getOlapTreeData;
    private getOlapSearchTreeData;
    updateChildNodeStates(members: IOlapField[], fieldName: string, node: string, state: boolean): void;
    /**
     * get the parent node of particular filter members.
     * @hidden
     */
    getParentNode(fieldName: string, item: string, filterObj: {
        [key: string]: string;
    }): {
        [key: string]: string;
    };
    private getFilteredTreeNodes;
}
