import { IGrid } from '@syncfusion/ej2-grids';
import { TreeGrid } from './base/treegrid';
import { ITreeData } from './base/interface';
export declare function isRemoteData(parent: TreeGrid): boolean;
export declare function isCountRequired(parent: TreeGrid | IGrid): boolean;
export declare function isCheckboxcolumn(parent: TreeGrid): boolean;
export declare function isFilterChildHierarchy(parent: TreeGrid): boolean;
/**
 * @hidden
 */
export declare function findParentRecords(records: Object): Object;
/**
 * @hidden
 */
export declare function getExpandStatus(parent: TreeGrid, record: ITreeData, parents: ITreeData[]): boolean;
/**
 * @hidden
 */
export declare function findChildrenRecords(records: ITreeData): Object[];
export declare function isOffline(parent: TreeGrid): boolean;
export declare function extendArray(array: Object[]): Object[];
export declare function getPlainData(value: ITreeData): ITreeData;
export declare function getParentData(parent: TreeGrid, value: string, requireFilter?: Boolean): ITreeData;
export declare function isHidden(el: HTMLTableRowElement): boolean;
