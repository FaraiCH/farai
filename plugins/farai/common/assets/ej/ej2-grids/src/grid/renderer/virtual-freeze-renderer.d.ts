import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { ColumnFreezeContentRenderer } from './column-freeze-renderer';
import { IGrid, IRenderer, NotifyArgs, IModelGenerator } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { VirtualContentRenderer, VirtualHeaderRenderer } from './virtual-content-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import { freezeTable } from '../base/enum';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { ColumnWidthService } from '../services/width-controller';
/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
export declare class VirtualFreezeRenderer extends FreezeContentRender implements IRenderer {
    protected serviceLoc: ServiceLocator;
    rowModelGenerator: IModelGenerator<Column>;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    protected freezeRowGenerator: FreezeRowModelGenerator;
    /** @hidden */
    virtualRenderer: VirtualContentRenderer;
    protected firstPageRecords: Object[];
    protected scrollbar: HTMLElement;
    /** @hidden */
    frzRows: Row<Column>[];
    /** @hidden */
    mvblRows: Row<Column>[];
    /** @hidden */
    frRows: Row<Column>[];
    eventListener(action: string): void;
    protected actionComplete(args: NotifyArgs): void;
    private refreshVirtualFrozenRows;
    private getVirtualData;
    private setFreezeSelection;
    /**
     * @hidden
     */
    renderTable(): void;
    /**
     * @hidden
     */
    appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void;
    /**
     * @hidden
     */
    generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[];
    /**
     * @hidden
     */
    getRowByIndex(index: number): Element;
    /**
     * @hidden
     */
    getMovableRowByIndex(index: number): Element;
    private collectRows;
    /**
     * @hidden
     */
    getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getColGroup(): Element;
    /**
     * @hidden
     */
    getReorderedFrozenRows(args: NotifyArgs): Row<Column>[];
    protected isXaxis(): boolean;
    protected getHeaderCells(): Element[];
    protected getVirtualFreezeHeader(): Element;
    protected ensureFrozenCols(columns: Column[]): Column[];
    /**
     * @hidden
     */
    getRowObjectByIndex(index: number): Object;
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    setColGroup(colGroup: Element): Element;
}
/**
 * VirtualFreezeHdrRenderer is used to render the virtual table within the frozen and movable header table
 * @hidden
 */
export declare class VirtualFreezeHdrRenderer extends FreezeRender implements IRenderer {
    protected serviceLoc: ServiceLocator;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    virtualHdrRenderer: VirtualHeaderRenderer;
    /**
     * @hidden
     */
    renderTable(): void;
    protected rfshMovable(): void;
}
/** @hidden */
export declare function renderFrozenRows(args: NotifyArgs, data: Object[], selectedIdx: number[], parent: IGrid, rowModelGenerator: IModelGenerator<Column>, locator: ServiceLocator, virtualRenderer: VirtualContentRenderer, instance: VirtualFreezeRenderer | ColumnVirtualFreezeRenderer): void;
/** @hidden */
export declare function splitCells(data: Row<Column>[], tableName: freezeTable, parent: IGrid): Row<Column>[];
/** @hidden */
export declare function collectRows(tableName: freezeTable, virtualRenderer: VirtualContentRenderer, parent: IGrid): Row<Column>[];
/** @hidden */
export declare function setFreezeSelection(args: {
    uid: string;
    set: boolean;
    clearAll?: boolean;
}, virtualRenderer: VirtualContentRenderer): void;
/** @hidden */
export declare function selectFreezeRows(args: {
    uid: string;
    set: boolean;
    clearAll?: boolean;
}, cache: Row<Column>[]): void;
/** @hidden */
export declare function appendContent(virtualRenderer: VirtualContentRenderer, widthService: ColumnWidthService, target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void;
/** @hidden */
export declare function generateRows(virtualRenderer: VirtualContentRenderer, data: Object[], notifyArgs: NotifyArgs, freezeRowGenerator: FreezeRowModelGenerator, parent: IGrid): Row<Column>[];
/** @hidden */
export declare function getReorderedFrozenRows(args: NotifyArgs, virtualRenderer: VirtualContentRenderer, parent: IGrid, freezeRowGenerator: FreezeRowModelGenerator, firstPageRecords: Object[]): Row<Column>[];
/** @hidden */
export declare function splitReorderedRows(rows: Row<Column>[], parent: IGrid, freezeRowGenerator: FreezeRowModelGenerator): Row<Column>[];
/** @hidden */
export declare function isXaxis(virtualRenderer: VirtualContentRenderer): boolean;
/** @hidden */
export declare function getHeaderCells(virtualRenderer: VirtualContentRenderer, parent: IGrid): Element[];
/** @hidden */
export declare function getVirtualFreezeHeader(virtualRenderer: VirtualContentRenderer, parent: IGrid): Element;
/** @hidden */
export declare function ensureFrozenCols(columns: Column[], parent: IGrid): Column[];
/** @hidden */
export declare function setColGroup(colGroup: Element, virtualRenderer: VirtualContentRenderer, instance: ColumnVirtualFreezeRenderer | VirtualFreezeRenderer): Element;
/** @hidden */
export declare function setCache(instance: VirtualFreezeRenderer | ColumnVirtualFreezeRenderer, index: number): void;
/** @hidden */
export declare function setDebounce(parent: IGrid, virtualRenderer: VirtualContentRenderer, scrollbar: Element, mCont: Element): void;
/**
 * ColumnVirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
export declare class ColumnVirtualFreezeRenderer extends ColumnFreezeContentRenderer implements IRenderer {
    protected serviceLoc: ServiceLocator;
    rowModelGenerator: IModelGenerator<Column>;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    /** @hidden */
    virtualRenderer: VirtualContentRenderer;
    protected freezeRowGenerator: FreezeRowModelGenerator;
    protected firstPageRecords: Object[];
    protected scrollbar: HTMLElement;
    /** @hidden */
    frRows: Row<Column>[];
    /** @hidden */
    frzRows: Row<Column>[];
    /** @hidden */
    mvblRows: Row<Column>[];
    protected actionComplete(args: NotifyArgs): void;
    eventListener(action: string): void;
    private refreshVirtualFrozenRows;
    private setFreezeSelection;
    private getVirtualData;
    renderNextFrozentPart(e: NotifyArgs): void;
    /**
     * @hidden
     */
    renderTable(): void;
    private renderVirtualFrozenLeft;
    private renderVirtualFrozenRight;
    private renderVirtualFrozenLeftRight;
    /**
     * @hidden
     */
    appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void;
    /**
     * @hidden
     */
    generateRows(data: Object[], e?: NotifyArgs): Row<Column>[];
    /**
     * @hidden
     */
    getRowByIndex(index: number): Element;
    /**
     * @hidden
     */
    getFrozenRightRowByIndex(index: number): Element;
    private collectRows;
    /**
     * @hidden
     */
    getMovableRowByIndex(index: number): Element;
    /**
     * @hidden
     */
    getFrozenRightRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getColGroup(): Element;
    /**
     * @hidden
     */
    getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getReorderedFrozenRows(args: NotifyArgs): Row<Column>[];
    protected getHeaderCells(): Element[];
    protected isXaxis(): boolean;
    protected getVirtualFreezeHeader(): Element;
    /**
     * @hidden
     */
    getRowObjectByIndex(index: number): Object;
    protected ensureFrozenCols(columns: Column[]): Column[];
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    setColGroup(colGroup: Element): Element;
}
