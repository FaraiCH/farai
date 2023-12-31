import { IModelGenerator, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { Action } from '../base/enum';
import { RowModelGenerator } from '../services/row-model-generator';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
export declare class GroupModelGenerator extends RowModelGenerator implements IModelGenerator<Column> {
    private rows;
    /** @hidden */
    index: number;
    private prevKey;
    private isInfiniteScroll;
    private summaryModelGen;
    private captionModelGen;
    constructor(parent?: IGrid);
    generateRows(data: {
        length: number;
    }, args?: {
        startIndex?: number;
        requestType?: Action;
    }): Row<Column>[];
    private getGroupedRecords;
    private getCaptionRowCells;
    /** @hidden */
    generateCaptionRow(data: GroupedData, indent: number, parentID?: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column>;
    private getForeignKeyData;
    /** @hidden */
    generateDataRows(data: Object[], indent: number, childID?: number, tIndex?: number, parentUid?: string): Row<Column>[];
    private generateIndentCell;
    refreshRows(input?: Row<Column>[]): Row<Column>[];
    ensureRowVisibility(): void;
}
export interface GroupedData {
    GroupGuid?: string;
    items?: GroupedData;
    field?: string;
    isDataRow?: boolean;
    level?: number;
    key?: string;
    foreignKey?: string;
    count?: number;
    headerText?: string;
}
