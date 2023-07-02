import { Workbook } from '../base/index';
import { SheetModel, RowModel, CellModel } from './index';
/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
export declare function getData(context: Workbook, address: string, columnWiseData?: boolean, valueOnly?: boolean): Promise<Map<string, CellModel> | {
    [key: string]: CellModel;
}[]>;
/**
 * @hidden
 */
export declare function getModel(model: (SheetModel | RowModel | CellModel)[], idx: number): SheetModel | RowModel | CellModel;
/**
 * @hidden
 */
export declare function processIdx(model: (SheetModel | RowModel | CellModel)[], isSheet?: true, context?: Workbook): void;
/**
 * @hidden
 */
export declare function clearRange(context: Workbook, address: string, sheetIdx: number, valueOnly: boolean): void;
