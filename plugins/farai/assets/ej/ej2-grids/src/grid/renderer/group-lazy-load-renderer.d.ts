import { IRenderer, IGrid } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ContentRender } from './content-renderer';
import { Row } from '../models/row';
import { Column } from '../models/column';
/**
 * GroupLazyLoadRenderer is used to perform lazy load grouping
 * @hidden
 */
export declare class GroupLazyLoadRenderer extends ContentRender implements IRenderer {
    private locator;
    private groupGenerator;
    private summaryModelGen;
    private captionModelGen;
    private rowRenderer;
    constructor(parent: IGrid, locator?: ServiceLocator);
    private childCount;
    private scrollData;
    private rowIndex;
    private rowObjectIndex;
    private isFirstChildRow;
    private uid1;
    private uid2;
    private uid3;
    private blockSize;
    private groupCache;
    private startIndexes;
    private captionCounts;
    private rowsByUid;
    private objIdxByUid;
    private initialGroupCaptions;
    private requestType;
    /** @hidden */
    pageSize: number;
    /** @hidden */
    cacheMode: boolean;
    /** @hidden */
    cacheBlockSize: number;
    /** @hidden */
    ignoreAccent: boolean;
    /** @hidden */
    allowCaseSensitive: boolean;
    private eventListener;
    /** @hidden */
    captionExpand(tr: HTMLTableRowElement): void;
    /** @hidden */
    captionCollapse(tr: HTMLTableRowElement): void;
    /** @hidden */
    setLazyLoadPageSize(): void;
    /** @hidden */
    clearLazyGroupCache(): void;
    private clearCache;
    private refreshCaches;
    private getInitialCaptionIndexes;
    /** @hidden */
    getRowObjectIndexByUid(uid: string): number;
    private collapseShortcut;
    private getRowByUid;
    private actionBegin;
    private actionComplete;
    private resetRowMaintenance;
    private moveCells;
    private removeRows;
    private addClass;
    private getNextChilds;
    private lazyLoadHandler;
    private setRowIndexes;
    private getStartIndex;
    private prevCaptionCount;
    private setStartIndexes;
    private hasLastChildRow;
    private refreshCaptionRowCount;
    private render;
    /** @hidden */
    maintainRows(row: Row<Column>, index?: number): void;
    private confirmRowRendering;
    private refreshRowObjects;
    private getAggregateByCaptionIndex;
    private getChildRowsByParentIndex;
    /** @hidden */
    initialGroupRows(isReorder?: boolean): Row<Column>[];
    /** @hidden */
    getRenderedRowsObject(): Row<Column>[];
    private getCacheRowsOnDownScroll;
    private getCacheRowsOnUpScroll;
    private scrollHandler;
    private scrollUpEndRowHandler;
    private scrollDownHandler;
    private getCurrentBlockEndIndex;
    private removeBlock;
    private scrollUpHandler;
    private findRowElements;
    private getRowElementByUid;
    private removeTopRows;
    private removeBottomRows;
    private setCache;
    private getGroupKeysAndFields;
    private generateExpandPredicates;
    private getPredicates;
    private captionRowExpand;
    private scrollReset;
    private updateCurrentViewData;
    /** @hidden */
    getGroupCache(): {
        [x: number]: Row<Column>[];
    };
    /** @hidden */
    getRows(): Row<Column>[];
    /** @hidden */
    getRowElements(): Element[];
    /** @hidden */
    getRowByIndex(index: number): Element;
    /** @hidden */
    setVisible(columns?: Column[]): void;
    /** @hidden */
    setDisplayNone(tr: Object, idx: number, displayVal: string, rows: Row<Column>[], oriIdx?: number): void;
    private changeCaptionRow;
    private showAndHideCells;
}
