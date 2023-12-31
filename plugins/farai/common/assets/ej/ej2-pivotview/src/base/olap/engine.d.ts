import { Internationalization, Ajax } from '@syncfusion/ej2-base';
import { IField, IDataOptions, IMembers, IDrillOptions, IDrilledItem, IFieldOptions, IPageSettings, ISort } from '../engine';
import { IAxisSet, IGridValues, IPivotValues, IFilter, ICustomProperties, IValueSortSettings, ICalculatedFieldSettings } from '../engine';
import { IFormatSettings, IMatrix2D } from '../engine';
/**
 * OlapEngine is used to manipulate the olap or Multi-Dimensional data as pivoting values.
 */
/** @hidden */
export declare class OlapEngine {
    /** @hidden */
    isEmptyData: boolean;
    /** @hidden */
    globalize: Internationalization;
    /** @hidden */
    fieldList: IOlapFieldListOptions;
    /** @hidden */
    fields: string[];
    /** @hidden */
    rows: IFieldOptions[];
    /** @hidden */
    columns: IFieldOptions[];
    /** @hidden */
    values: IFieldOptions[];
    /** @hidden */
    filters: IFieldOptions[];
    /** @hidden */
    calculatedFieldSettings: ICalculatedFieldSettings[];
    /** @hidden */
    isMutiMeasures: boolean;
    /** @hidden */
    drilledMembers: IDrillOptions[];
    /** @hidden */
    valueSortSettings: IValueSortSettings;
    /** @hidden */
    isEngineUpdated: boolean;
    /** @hidden */
    savedFieldList: IOlapFieldListOptions;
    /** @hidden */
    savedFieldListData: IOlapField[];
    /** @hidden */
    valueAxis: string;
    /** @hidden */
    columnCount: number;
    /** @hidden */
    rowCount: number;
    /** @hidden */
    colFirstLvl: number;
    /** @hidden */
    rowFirstLvl: number;
    /** @hidden */
    pageColStartPos: number;
    /** @hidden */
    enableSort: boolean;
    /** @hidden */
    enableValueSorting: boolean;
    /** @hidden */
    isHeaderAvail: boolean;
    /** @hidden */
    fieldListData: IOlapField[];
    /** @hidden */
    fieldListObj: FieldData;
    /** @hidden */
    dataFields: {
        [key: string]: IFieldOptions;
    };
    /** @hidden */
    formats: IFormatSettings[];
    /** @hidden */
    formatFields: {
        [key: string]: IFormatSettings;
    };
    /** @hidden */
    emptyCellTextContent: string;
    /** @hidden */
    isMondrian: boolean;
    /** @hidden */
    isMeasureAvail: boolean;
    /** @hidden */
    selectedItems: string[];
    /** @hidden */
    filterSettings: IFilter[];
    /** @hidden */
    sortSettings: ISort[];
    /** @hidden */
    filterMembers: {
        [key: string]: string[] | IFilter[];
    };
    /** @hidden */
    allowMemberFilter: boolean;
    /** @hidden */
    allowLabelFilter: boolean;
    /** @hidden */
    allowValueFilter: boolean;
    /** @hidden */
    mdxQuery: string;
    /** @hidden */
    isPaging: boolean;
    /** @hidden */
    pageSettings: IPageSettings;
    /** @hidden */
    calcChildMembers: IOlapField[];
    /** @hidden */
    drilledSets: {
        [key: string]: HTMLElement;
    };
    /** @hidden */
    aggregatedValueMatrix: IMatrix2D;
    private localeObj;
    private measureReportItems;
    private locale;
    private customRegex;
    private formatRegex;
    /** @hidden */
    xmlaCellSet: NodeListOf<Element>;
    /** @hidden */
    pivotValues: IPivotValues;
    /** @hidden */
    dataSourceSettings: IDataOptions;
    /** @hidden */
    valueContent: IGridValues;
    /** @hidden */
    headerContent: IGridValues;
    /** @hidden */
    colMeasurePos: number;
    /** @hidden */
    rowStartPos: number;
    /** @hidden */
    pageRowStartPos: number;
    /** @hidden */
    rowMeasurePos: number;
    /** @hidden */
    tupColumnInfo: ITupInfo[];
    /** @hidden */
    tupRowInfo: ITupInfo[];
    /** @hidden */
    gridJSON: string;
    /** @hidden */
    namedSetsPosition: {
        [key: string]: {
            [key: number]: string;
        };
    };
    private colDepth;
    private totalCollection;
    private parentObjCollection;
    private colMeasures;
    private curDrillEndPos;
    private headerGrouping;
    private lastLevel;
    private xmlDoc;
    private request;
    private customArgs;
    private onDemandDrillEngine;
    private showRowSubTotals;
    private showColumnSubTotals;
    private hideRowTotalsObject;
    private hideColumnTotalsObject;
    private sortObject;
    private isColDrill;
    renderEngine(dataSourceSettings?: IDataOptions, customProperties?: IOlapCustomProperties): void;
    generateGridData(dataSourceSettings: IDataOptions, action?: string): void;
    generatePagingData(xmlDoc: Document, request: Ajax, customArgs: FieldData): void;
    scrollPage(direction: string, newPage?: number, prevPage?: number): void;
    generateEngine(xmlDoc: Document, request: Ajax, customArgs: FieldData): void;
    private getSubTotalsVisibility;
    private frameRowHeader;
    private getDepth;
    private checkAttributeDrill;
    private frameTupCollection;
    private getCaptionCollectionWithMeasure;
    /** hidden */
    setNamedSetsPosition(): void;
    private updateRowEngine;
    private updateTupCollection;
    private frameColumnHeader;
    private orderTotals;
    private setParentCollection;
    private setDrillInfo;
    private levelCompare;
    private mergeTotCollection;
    private getLevelsAsString;
    private frameCommonColumnLoop;
    private isAttributeDrill;
    private isAdjacentToMeasure;
    private getDrilledParent;
    private performRowSorting;
    private performColumnSorting;
    private frameUniqueName;
    private getMeasurePosition;
    private sortRowHeaders;
    private sortColumnHeaders;
    private frameSortObject;
    private getParentUname;
    private performColumnSpanning;
    private frameValues;
    /** hidden */
    getFormattedValue(value: number, fieldName: string, formattedText: string): string;
    private getMeasureInfo;
    private frameMeasureOrder;
    getDrilledSets(uNameCollection: string, currentCell: IAxisSet, fieldPos: number, axis: string): {
        [key: string]: string;
    };
    updateDrilledInfo(dataSourceSettings: IDataOptions): void;
    updateCalcFields(dataSourceSettings: IDataOptions, lastcalcInfo: ICalculatedFieldSettings): void;
    onSort(dataSourceSettings: IDataOptions): void;
    private updateFieldlist;
    updateFieldlistData(name: string, isSelect?: boolean): void;
    private getFormattedFields;
    private getFieldList;
    getTreeData(args: ConnectionInfo, successMethod: Function, customArgs: object): void;
    private getAxisFields;
    private getAggregateType;
    getUniqueName(name: string): string;
    private updateFilterItems;
    private getParentNode;
    updateDrilledItems(drilledMembers: IDrillOptions[]): IDrillOptions[];
    /**
     * @hidden
     */
    getDrillThroughData(pivotValue: IAxisSet, maxRows: number): void;
    private drillThroughSuccess;
    getFilterMembers(dataSourceSettings: IDataOptions, fieldName: string, levelCount: number, isSearchFilter?: boolean, loadLevelMember?: boolean): string;
    getMembers(dataSourceSettings: IDataOptions, fieldName: string, isAllFilterData?: boolean, filterParentQuery?: string, loadLevelMember?: boolean): void;
    getChildMembers(dataSourceSettings: IDataOptions, memberUQName: string, fieldName: string): void;
    getCalcChildMembers(dataSourceSettings: IDataOptions, memberUQName: string): void;
    getSearchMembers(dataSourceSettings: IDataOptions, fieldName: string, searchString: string, maxNodeLimit: number, isAllFilterData?: boolean, levelCount?: number): void;
    private generateMembers;
    private getFieldListItems;
    private loadCalculatedMemberElements;
    private loadDimensionElements;
    private loadNamedSetElements;
    private loadHierarchyElements;
    private loadLevelElements;
    private loadMeasureElements;
    private loadMeasureGroups;
    doAjaxPost(type: string, url: string, data: string, success: Function, customArgs?: Object): void;
    private beforeSend;
    private getSoapMsg;
    getConnectionInfo(connectionString: string, locale: string | number): ConnectionInfo;
    getMDXQuery(dataSourceSettings: IDataOptions): string;
}
/**
 * @hidden
 */
export interface IOlapFieldListOptions {
    [index: string]: IOlapField;
}
/**
 * @hidden
 */
export interface IOlapField extends IField {
    pid?: string;
    tag?: string;
    hasChildren?: boolean;
    expanded?: boolean;
    spriteCssClass?: string;
    name?: string;
    defaultHierarchy?: string;
    hasAllMember?: boolean;
    allMember?: string;
    isChecked?: boolean;
    filterMembers?: IOlapField[];
    childMembers?: IOlapField[];
    searchMembers?: IOlapField[];
    htmlAttributes?: {
        [key: string]: string;
    };
    currrentMembers?: IMembers;
    isHierarchy?: boolean;
    isNamedSets?: boolean;
    formatString?: string;
    actualFilter?: string[];
    levels?: IOlapField[];
    levelCount?: number;
    memberType?: number;
    fieldType?: string;
    parentHierarchy?: string;
}
/**
 * @hidden
 */
export interface ConnectionInfo {
    url?: string;
    LCID?: string;
    catalog?: string;
    cube?: string;
    request?: string;
}
/**
 * @hidden
 */
export interface FieldData {
    hierarchy?: IOlapField[];
    hierarchySuccess?: Document;
    measures?: any;
    dataSourceSettings?: IDataOptions;
    action?: string;
    reportElement?: string[];
    measuresGroups?: HTMLElement[];
    fieldName?: string;
    drillInfo?: IDrilledItem;
    loadLevelMembers?: boolean;
}
/** @hidden */
export interface IOlapCustomProperties extends ICustomProperties {
    savedFieldList?: IOlapFieldListOptions;
    savedFieldListData?: IOlapField[];
}
/** @hidden */
export interface ITupInfo {
    allCount?: number;
    allStartPos?: number;
    measure?: Element;
    measureName?: string;
    measurePosition?: number;
    members?: NodeListOf<Element>;
    typeCollection?: string[];
    levelCollection?: number[];
    uNameCollection?: string;
    captionCollection?: string;
    drillInfo?: IDrillInfo[];
    drillStartPos?: number;
    drillEndPos?: number;
    startDrillUniquename?: string;
    endDrillUniquename?: string;
    showTotals?: boolean;
}
/** @hidden */
export interface IDrillInfo {
    level: number;
    uName: string;
    hierarchy: string;
    isDrilled: boolean;
}
/** @hidden */
export interface ITotCollection {
    allCount: number;
    allStartPos?: number;
    ordinal: number;
    members: NodeListOf<Element>;
    drillInfo?: IDrillInfo[];
}
/** @hidden */
export interface IParentObjCollection {
    [key: number]: {
        [key: number]: Element;
    };
}
/** @hidden */
export interface ILastSavedInfo {
    [key: string]: string | number;
}
/** @hidden */
export interface IMeasureInfo {
    measureAxis: string;
    measureIndex: number;
    valueInfo: string[];
}
/** @hidden */
export interface IOrderedInfo {
    orderedValueTuples: Element[];
    orderedHeaderTuples: Element[];
}
