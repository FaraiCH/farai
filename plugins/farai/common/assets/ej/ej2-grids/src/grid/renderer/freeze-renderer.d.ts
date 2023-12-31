import { IGrid, IRenderer, IModelGenerator, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { Row } from '../models/row';
import { ColumnWidthService } from '../services/width-controller';
import { freezeTable } from '../base/enum';
/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
export declare class FreezeContentRender extends ContentRender implements IRenderer {
    private frozenContent;
    private movableContent;
    private idx;
    protected widthService: ColumnWidthService;
    protected isInitialRender: boolean;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    addEventListener(): void;
    protected batchAdd(args: {
        name: string;
    }): void;
    protected setHeightToContent(height: number): void;
    protected actionComplete(args: NotifyArgs): void;
    removeEventListener(): void;
    renderPanel(): void;
    renderFrozenRigthPanel(): void;
    renderEmpty(tbody: HTMLElement): void;
    protected renderFrozenRightEmpty(tbody: HTMLElement): void;
    private setFrozenContent;
    /**
     * @hidden
     */
    setMovableContent(ele: Element): void;
    getFrozenContent(): Element;
    getMovableContent(): Element;
    getModelGenerator(): IModelGenerator<Column>;
    protected renderFrozenRightTable(): void;
    renderTable(): void;
    protected getScrollbarDisplay(): string;
    protected renderHorizontalScrollbar(className: string, display: string, isRight?: boolean): void;
    protected appendScrollbar(frozen: Element, movable: Element, isRight?: boolean): void;
    private setScrollbarHeight;
    /**
     * @hidden
     */
    setIsFrozen(args: NotifyArgs, tableName: freezeTable): void;
    /**
     * @hidden
     */
    setTbody(modelData: Row<Column>[], args: NotifyArgs): freezeTable;
    /**
     * @hidden
     */
    splitRows(tableName: string): void;
    /**
     * @hidden
     */
    renderNextFrozentPart(args: NotifyArgs, tableName: string): void;
    appendContent(tbody: Element, frag: DocumentFragment | HTMLElement, args: NotifyArgs, tableName?: string): void;
    protected refreshScrollOffset(): void;
    /**
     * @hidden
     */
    getFrozenHeader(tableName: string): HTMLElement;
    protected refreshTbody(tbody: Element): void;
    protected refreshHeight(): void;
    private setIdx;
    protected getIdx(): number;
    /**
     * @hidden
     */
    getTbody(tableName: freezeTable): Element;
}
export declare class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader;
    private movableHeader;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    addEventListener(): void;
    removeEventListener(): void;
    renderTable(): void;
    renderPanel(): void;
    renderFrozenRightPanel(): void;
    renderFrozenRightTable(): void;
    refreshUI(): void;
    protected refreshFrozenLeftUI(): void;
    protected rfshMovable(): void;
    protected addMovableFirstCls(): void;
    protected refreshFreeze(obj: {
        case: string;
        isModeChg?: boolean;
    }): void;
    protected refreshHeight(obj: {
        case: string;
        isModeChg?: boolean;
    }): void;
    private enableAfterRender;
    private updateResizeHandler;
    protected setWrapHeight(fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean, isContReset?: boolean, isStackedHdr?: boolean): void;
    protected setFrozenHeight(height?: number): void;
    protected refreshStackedHdrHgt(): void;
    protected getRowSpan(row: Element): {
        min: number;
        max: number;
    };
    protected updateStackedHdrRowHgt(idx: number, maxRowSpan: number, row: Element, rows: NodeListOf<Element>): void;
    private setFrozenHeader;
    /**
     * @hidden
     */
    setMovableHeader(ele: Element): void;
    protected getFrozenHeader(): Element;
    getMovableHeader(): Element;
    /**
     * @hidden
     */
    updateColgroup(): void;
    protected filterRenderer(ele: Element, frozenColumn: number, total?: number): Element;
}
