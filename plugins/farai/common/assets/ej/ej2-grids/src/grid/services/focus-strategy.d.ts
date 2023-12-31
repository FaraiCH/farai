import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IGrid, IFocus, FocusInfo, FocusedContainer, IIndex, CellFocusArgs, SwapInfo } from '../base/interface';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { NotifyArgs } from '../base/interface';
/**
 * FocusStrategy class
 * @hidden
 */
export declare class FocusStrategy {
    parent: IGrid;
    currentInfo: FocusInfo;
    oneTime: boolean;
    swap: SwapInfo;
    content: IFocus;
    header: IFocus;
    active: IFocus;
    fContent: IFocus;
    fHeader: IFocus;
    frContent: IFocus;
    frHeader: IFocus;
    private forget;
    private skipFocus;
    private focusByClick;
    private passiveHandler;
    private prevIndexes;
    private focusedColumnUid;
    private refMatrix;
    private rowModelGen;
    private activeKey;
    private empty;
    private actions;
    constructor(parent: IGrid);
    protected focusCheck(e: Event): void;
    protected onFocus(): void;
    protected passiveFocus(e: FocusEvent): void;
    protected onBlur(e?: FocusEvent): void;
    onClick(e: Event | {
        target: Element;
    }, force?: boolean): void;
    protected onKeyPress(e: KeyboardEventArgs): void;
    private skipOn;
    private focusVirtualElement;
    getFocusedElement(): HTMLElement;
    getContent(): IFocus;
    setActive(content: boolean, isFrozen?: boolean, isFrozenRight?: boolean): void;
    setFocusedElement(element: HTMLElement, e?: KeyboardEventArgs): void;
    focus(e?: KeyboardEventArgs): void;
    protected removeFocus(e?: FocusEvent): void;
    /** @hidden */
    addOutline(): void;
    /** @hidden */
    focusHeader(): void;
    /** @hidden */
    focusContent(): void;
    private resetFocus;
    protected addFocus(info: FocusInfo, e?: KeyboardEventArgs): void;
    protected refreshMatrix(content?: boolean): Function;
    addEventListener(): void;
    filterfocus(): void;
    removeEventListener(): void;
    destroy(): void;
    restoreFocus(): void;
    restoreFocusWithAction(e: NotifyArgs): void;
    clearOutline(): void;
    clearIndicator(): void;
    getPrevIndexes(): IIndex;
    forgetPrevious(): void;
    setActiveByKey(action: string, active: IFocus): void;
    internalCellFocus(e: CellFocusArgs): void;
}
/**
 * Create matrix from row collection which act as mental model for cell navigation
 * @hidden
 */
export declare class Matrix {
    matrix: number[][];
    current: number[];
    columns: number;
    rows: number;
    set(rowIndex: number, columnIndex: number, allow?: boolean): void;
    get(rowIndex: number, columnIndex: number, navigator: number[], action?: string, validator?: Function): number[];
    first(vector: number[], index: number, navigator: number[], moveTo?: boolean, action?: string): number;
    select(rowIndex: number, columnIndex: number): void;
    generate(rows: Row<Column>[], selector: Function, isRowTemplate?: boolean): number[][];
    inValid(value: number): boolean;
}
/**
 * @hidden
 */
export declare class ContentFocus implements IFocus {
    matrix: Matrix;
    parent: IGrid;
    keyActions: {
        [x: string]: number[];
    };
    indexesByKey: (action: string) => number[];
    constructor(parent: IGrid);
    getTable(): HTMLTableElement;
    onKeyPress(e: KeyboardEventArgs): void | boolean;
    private editNextRow;
    getCurrentFromAction(action: string, navigator?: number[], isPresent?: boolean, e?: KeyboardEventArgs): number[];
    onClick(e: Event, force?: boolean): void | boolean;
    getFocusInfo(): FocusInfo;
    getFocusable(element: HTMLElement): HTMLElement;
    selector(row: Row<Column>, cell: Cell<Column>, isRowTemplate?: boolean): boolean;
    jump(action: string, current: number[]): SwapInfo;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
    generateRows(rows?: Row<Column>[], optionals?: Object): void;
    getInfo(e?: KeyboardEventArgs): FocusedContainer;
    validator(): Function;
    protected shouldFocusChange(e: KeyboardEventArgs): boolean;
    protected getGridSeletion(): boolean;
}
/**
 * @hidden
 */
export declare class HeaderFocus extends ContentFocus implements IFocus {
    constructor(parent: IGrid);
    getTable(): HTMLTableElement;
    onClick(e: Event): void | boolean;
    getFocusInfo(): FocusInfo;
    selector(row: Row<Column>, cell: Cell<Column>): boolean;
    jump(action: string, current: number[]): SwapInfo;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
    generateRows(rows?: Row<Column>[]): void;
    getInfo(e?: KeyboardEventArgs): FocusedContainer;
    validator(): Function;
    protected shouldFocusChange(e: KeyboardEventArgs): boolean;
}
export declare class FixedContentFocus extends ContentFocus {
    getTable(): HTMLTableElement;
    jump(action: string, current: number[]): SwapInfo;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
}
export declare class FixedHeaderFocus extends HeaderFocus {
    jump(action: string, current: number[]): SwapInfo;
    getTable(): HTMLTableElement;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
}
/** @hidden */
export declare class SearchBox {
    searchBox: HTMLElement;
    constructor(searchBox: HTMLElement);
    protected searchFocus(args: Event): void;
    protected searchBlur(args: Event): void;
    wireEvent(): void;
    unWireEvent(): void;
}
export declare class FixedRightContentFocus extends ContentFocus {
    getTable(): HTMLTableElement;
    jump(action: string, current: number[]): SwapInfo;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
}
export declare class FixedRightHeaderFocus extends HeaderFocus {
    jump(action: string, current: number[]): SwapInfo;
    getTable(): HTMLTableElement;
    getNextCurrent(previous?: number[], swap?: SwapInfo, active?: IFocus, action?: string): number[];
}
