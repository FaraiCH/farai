import { IGrid, IRenderer, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { ServiceLocator } from '../services/service-locator';
import { Row } from '../models/row';
import { ColumnWidthService } from '../services/width-controller';
import { freezeTable } from '../base/enum';
/**
 * ColumnFreezeHeaderRenderer is used to freeze the columns header at right and left
 * @hidden
 */
export declare class ColumnFreezeHeaderRenderer extends FreezeRender implements IRenderer {
    private frozenRightHeader;
    private destEle;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    addEventListener(): void;
    removeEventListener(): void;
    private setReorderElement;
    private refreshFrozenColumns;
    protected setWrapHeight(fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean, isContReset?: boolean, isStackedHdr?: boolean, frRows?: NodeListOf<HTMLElement>): void;
    protected refreshHeight(obj: {
        case: string;
        isModeChg?: boolean;
    }): void;
    /**
     * Function to hide header table column based on visible property
     * @param  {Column[]} columns?
     */
    setVisible(columns?: Column[]): void;
    protected filterRenderer(ele: Element, frozenColumn: number, total?: number): Element;
    refreshUI(): void;
    protected refreshFreeze(obj: {
        case: string;
        isModeChg?: boolean;
    }): void;
    private updateFrozenColGroup;
    private adjudtFilterBarCell;
    renderPanel(): void;
    renderTable(): void;
    protected rfshMovable(): void;
    protected refreshStackedHdrHgt(): void;
    private refreshFrozenRightStackedHdrHgt;
    /**
     * @hidden
     */
    updateColgroup(): void;
    private renderRightFrozenPanelAlone;
    private renderLeftWithRightFrozenPanel;
    private renderFrozenRightTableAlone;
    private updateFrozenLeftColGroup;
    private updateMovableColGroup;
    private updateFrozenRightColGroup;
    private setFrozenRightHeader;
    getFrozenRightHeader(): Element;
}
/**
 * ColumnFreezeContentRenderer is used to freeze the columns content at right and left
 * @hidden
 */
export declare class ColumnFreezeContentRenderer extends FreezeContentRender implements IRenderer {
    private frozenRigthContent;
    private movableRowElements;
    private frozenRightRows;
    private frozenRightRowElements;
    private frzCount;
    private isColGroupRefresh;
    protected widthService: ColumnWidthService;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    renderPanel(): void;
    renderTable(): void;
    protected appendScrollbar(frozen: Element, movable: Element, isRight?: boolean): void;
    private renderFrozenRightPanelAlone;
    private renderFrozenLeftWithRightPanel;
    private renderFrozenRightTableAlone;
    private renderFrozenLeftWithRightTable;
    private renderFrozenRightEmptyRowAlone;
    /**
     * @hidden
     */
    getFrozenHeader(tableName: string): HTMLElement;
    private renderFrozenLeftWithRightEmptyRow;
    private setFrozenRightContent;
    getFrozenRightContent(): Element;
    protected getHeaderColGroup(): Element;
    private getFrozenRightHeaderColGroup;
    setColGroup(colGroup: Element): Element;
    renderEmpty(tbody: HTMLElement): void;
    protected setHeightToContent(height: number): void;
    protected actionComplete(args: NotifyArgs): void;
    protected batchAdd(args: {
        name: string;
    }): void;
    /**
     * @hidden
     */
    getTbody(tableName: freezeTable): Element;
    /**
     * @hidden
     */
    setIsFrozen(args: NotifyArgs, tableName: freezeTable): void;
    /**
     * @hidden
     */
    appendContent(tbody: Element, frag: DocumentFragment | HTMLElement, args: NotifyArgs, tableName?: freezeTable): void;
    protected refreshHeight(): void;
    /**
     * @hidden
     */
    splitRows(tableName: freezeTable): void;
    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element}
     */
    getMovableRowElements(): Element[];
    /**
     * Get the Freeze pane frozen right content table data row elements
     * @return {Element}
     */
    getFrozenRightRowElements(): Element[];
    /**
     * Get the frozen right row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    getFrozenRightRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getFrozenRightRowByIndex(index: number): Element;
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    getRowElements(): Element[];
}
