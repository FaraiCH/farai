import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Action } from '../base/enum';
import { ColumnWidthService } from '../services/width-controller';
/**
 * Infinite Scrolling class
 * @hidden
 */
export declare class InfiniteScroll implements IAction {
    private parent;
    private serviceLocator;
    private maxPage;
    private infiniteCache;
    private infiniteFrozenCache;
    private isDownScroll;
    private isUpScroll;
    private isScroll;
    private top;
    private enableContinuousScroll;
    private initialRender;
    private pressedKey;
    private isRemove;
    private isInitialCollapse;
    private prevScrollTop;
    private actions;
    private keys;
    private rowIndex;
    private cellIndex;
    private rowTop;
    private empty;
    private isInitialMovableRender;
    private frozenFrag;
    private movableFrag;
    private editRowIndex;
    private virtualInfiniteData;
    private isAdd;
    private isEdit;
    private isCancel;
    private emptyRowData;
    private isNormaledit;
    /** @hidden */
    requestType: Action;
    private firstBlock;
    private firstIndex;
    private lastIndex;
    private rowModelGenerator;
    private isInfiniteScroll;
    private isLastPage;
    private isInitialRender;
    protected widthService: ColumnWidthService;
    /**
     * Constructor for the Grid infinite scrolling.
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator);
    getModuleName(): string;
    /**
     * @hidden
     */
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    private deleteComplate;
    private modelChanged;
    private infiniteAddActionBegin;
    private infiniteEditHandler;
    private createRow;
    private ensureRowAvailability;
    private generateRows;
    private resetRowIndex;
    private setDisplayNone;
    private refreshInfiniteCache;
    private getEditedRowObject;
    private infiniteEditSuccess;
    private updateCurrentViewRecords;
    private actionBegin;
    private actionComplete;
    private resetInfiniteEdit;
    private getVirtualInfiniteData;
    private editActionBegin;
    private dataSourceModified;
    private onDataReady;
    private ensureIntialCollapse;
    private infiniteScrollHandler;
    private makeRequest;
    private infinitePageQuery;
    private editPageQuery;
    private intialPageQuery;
    private infiniteCellFocus;
    private createEmptyRowdata;
    private getVirtualInfiniteEditedData;
    private restoreInfiniteEdit;
    private restoreInfiniteAdd;
    private appendInfiniteRows;
    private selectNewRow;
    private removeInfiniteCacheRows;
    private calculateScrollTop;
    private captionRowHeight;
    private removeTopRows;
    private removeBottomRows;
    private removeCaptionRows;
    private resetInfiniteBlocks;
    private setCache;
    private setInitialCache;
    private createFrozenCache;
    private setInitialGroupCache;
    private resetContentModuleCache;
    /**
     * @hidden
     */
    destroy(): void;
}
