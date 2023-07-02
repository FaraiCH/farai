import { IRenderer, IGrid, NotifyArgs, IModelGenerator } from '../base/interface';
import { VirtualInfo } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
/**
 * Content module is used to render grid content
 * @hidden
 */
export declare class ContentRender implements IRenderer {
    private contentTable;
    private contentPanel;
    protected rows: Row<Column>[];
    protected freezeRows: Row<Column>[];
    protected movableRows: Row<Column>[];
    protected rowElements: Element[];
    protected freezeRowElements: Element[];
    private index;
    /** @hidden */
    prevInfo: VirtualInfo;
    /** @hidden */
    currentInfo: VirtualInfo;
    /** @hidden */
    prevCurrentView: Object[];
    colgroup: Element;
    protected isLoaded: boolean;
    protected tbody: HTMLElement;
    private droppable;
    private viewColIndexes;
    private drop;
    private args;
    private infiniteCache;
    private isRemove;
    private pressedKey;
    private visibleRows;
    private visibleFrozenRows;
    protected rightFreezeRows: Row<Column>[];
    private isAddRows;
    private currentMovableRows;
    private initialPageRecords;
    private isInfiniteFreeze;
    private useGroupCache;
    private mutableData;
    private rafCallback;
    protected parent: IGrid;
    private serviceLocator;
    private ariaService;
    protected generator: IModelGenerator<Column>;
    /**
     * Constructor for content renderer module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator);
    private beforeCellFocused;
    /**
     * The function is used to render grid content div
     */
    renderPanel(): void;
    /**
     * The function is used to render grid content table
     */
    renderTable(): void;
    /**
     * The function is used to create content table elements
     * @return {Element}
     * @hidden
     */
    createContentTable(id: String): Element;
    /**
     * Refresh the content of the Grid.
     * @return {void}
     */
    refreshContentRows(args?: NotifyArgs): void;
    appendContent(tbody: Element, frag: DocumentFragment, args: NotifyArgs, tableName?: string): void;
    private setRowsInLazyGroup;
    private setGroupCache;
    private ensureFrozenHeaderRender;
    private ensureVirtualFrozenHeaderRender;
    private checkCache;
    private setInfiniteVisibleRows;
    private getCurrentBlockInfiniteRecords;
    private getReorderedVFRows;
    private virtualFrozenHdrRefresh;
    protected getInfiniteRows(): Row<Column>[];
    private getInfiniteMovableRows;
    /**
     * Get the content div element of grid
     * @return {Element}
     */
    getPanel(): Element;
    /**
     * Set the content div element of grid
     * @param  {Element} panel
     */
    setPanel(panel: Element): void;
    /**
     * Get the content table element of grid
     * @return {Element}
     */
    getTable(): Element;
    /**
     * Set the content table element of grid
     * @param  {Element} table
     */
    setTable(table: Element): void;
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    getRowElements(): Element[];
    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element}
     */
    getMovableRowElements(): Element[];
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    setRowElements(elements: Element[]): void;
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    getColGroup(): Element;
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    setColGroup(colGroup: Element): Element;
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    setVisible(columns?: Column[]): void;
    /**
     * @hidden
     */
    setDisplayNone(tr: Object, idx: number, displayVal: string, rows: Row<Column>[]): void;
    private infiniteRowVisibility;
    private colGroupRefresh;
    protected getHeaderColGroup(): Element;
    private initializeContentDrop;
    private droppableDestroy;
    private canSkip;
    getModelGenerator(): IModelGenerator<Column>;
    renderEmpty(tbody: HTMLElement): void;
    setSelection(uid: string, set: boolean, clearAll?: boolean): void;
    getRowByIndex(index: number): Element;
    private getInfiniteRowIndex;
    getVirtualRowIndex(index: number): number;
    getMovableRowByIndex(index: number): Element;
    private enableAfterRender;
    setRowObjects(rows: Row<Column>[]): void;
    /** @hidden */
    immutableModeRendering(args?: NotifyArgs): void;
    private objectEqualityChecker;
    private getBatchEditedRecords;
    private refreshImmutableContent;
    private updateCellIndex;
}
