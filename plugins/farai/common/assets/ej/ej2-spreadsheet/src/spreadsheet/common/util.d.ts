import { StyleType, CollaborativeEditArgs, IAriaOptions } from './index';
import { IOffset } from './index';
import { Spreadsheet } from '../base/index';
import { SheetModel, CellStyleModel } from '../../workbook/index';
import { Workbook } from '../../workbook/index';
/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export declare function getUpdateUsingRaf(fn: Function): void;
/**
 * The function used to remove the dom element children.
 * @param  parent -
 * @hidden
 */
export declare function removeAllChildren(parent: Element, index?: number): void;
/**
 * The function used to get colgroup width based on the row index.
 * @param  parent -
 * @hidden
 */
export declare function getColGroupWidth(index: number): number;
/** @hidden */
export declare function getScrollBarWidth(): number;
/** @hidden */
export declare function getSiblingsHeight(element: HTMLElement, classList?: string[]): number;
/**
 * @hidden
 */
export declare function inView(context: Spreadsheet, range: number[], isModify?: boolean): boolean;
/**
 * To get the top left cell position in viewport.
 * @hidden
 */
export declare function getCellPosition(sheet: SheetModel, indexes: number[], offset?: {
    left: IOffset;
    top: IOffset;
}): {
    top: number;
    left: number;
};
/**
 * Position element with given range
 * @hidden
 */
export declare function locateElem(ele: HTMLElement, range: number[], sheet: SheetModel, isRtl: boolean, offset?: {
    left: IOffset;
    top: IOffset;
}): void;
/**
 * To update element styles using request animation frame
 * @hidden
 */
export declare function setStyleAttribute(styles: StyleType[]): void;
/**
 * @hidden
 */
export declare function getStartEvent(): string;
/**
 * @hidden
 */
export declare function getMoveEvent(): string;
/**
 * @hidden
 */
export declare function getEndEvent(): string;
/**
 * @hidden
 */
export declare function isTouchStart(e: Event): boolean;
/**
 * @hidden
 */
export declare function isTouchMove(e: Event): boolean;
/**
 * @hidden
 */
export declare function isTouchEnd(e: Event): boolean;
/**
 * @hidden
 */
export declare function getClientX(e: TouchEvent & MouseEvent): number;
/**
 * @hidden
 */
export declare function getClientY(e: MouseEvent & TouchEvent): number;
/** @hidden */
export declare function setAriaOptions(target: HTMLElement, options: IAriaOptions<boolean>): void;
/**
 * @hidden
 */
export declare function destroyComponent(element: HTMLElement, component: Object): void;
/**
 * @hidden
 */
export declare function setResize(index: number, value: string, isCol: boolean, parent: Spreadsheet): void;
/**
 * @hidden
 */
export declare function setWidthAndHeight(trgt: HTMLElement, value: number, isCol: boolean): void;
/**
 * @hidden
 */
export declare function findMaxValue(table: HTMLElement, text: HTMLElement[], isCol: boolean, parent: Spreadsheet, prevData?: string, isWrap?: boolean): number;
/**
 * @hidden
 */
export declare function updateAction(options: CollaborativeEditArgs, spreadsheet: Spreadsheet, isRedo?: boolean): void;
/**
 * @hidden
 */
export declare function hasTemplate(workbook: Workbook, rowIdx: number, colIdx: number, sheetIdx: number): boolean;
/**
 * Setting row height in view an model.
 * @hidden
 */
export declare function setRowEleHeight(parent: Spreadsheet, sheet: SheetModel, height: number, rowIdx: number, row?: HTMLElement, hRow?: HTMLElement, notifyRowHgtChange?: boolean): void;
/** @hidden */
export declare function getTextHeight(context: Workbook, style: CellStyleModel, lines?: number): number;
/** @hidden */
export declare function getTextWidth(text: string, style: CellStyleModel, parentStyle: CellStyleModel): number;
/**
 * @hidden
 */
export declare function getLines(text: string, colwidth: number, style: CellStyleModel, parentStyle: CellStyleModel): number;
/**
 * Setting maximum height while doing formats and wraptext
 * @hidden
 */
export declare function setMaxHgt(sheet: SheetModel, rIdx: number, cIdx: number, hgt: number): void;
/**
 * Getting maximum height by comparing each cell's modified height.
 * @hidden
 */
export declare function getMaxHgt(sheet: SheetModel, rIdx: number): number;
/** @hidden */
export declare function skipHiddenIdx(sheet: SheetModel, index: number, increase: boolean, layout?: string): number;
