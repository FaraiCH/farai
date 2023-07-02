import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { ContextMenu as Context } from '@syncfusion/ej2-navigations';
/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 * @hidden
 */
export declare class NavigationPane {
    private pdfViewer;
    private pdfViewerBase;
    private sideBarResizer;
    private sideBarContentSplitter;
    private sideBarTitleContainer;
    private thumbnailWidthMin;
    private thumbnailButton;
    private bookmarkButton;
    private mainContainerWidth;
    private closeDiv;
    private resizeIcon;
    private isDown;
    private offset;
    private contentContainerScrollWidth;
    private closeButtonLeft;
    private previousX;
    private toolbarElement;
    private toolbar;
    private searchInput;
    private toastObject;
    private isTooltipCreated;
    private isThumbnail;
    private annotationInputElement;
    private annotationXFdfInputElement;
    private annotationContextMenu;
    private isCommentPanelShow;
    private commentPanelWidthMin;
    private commentPanelResizeIcon;
    /**
     * @private
     */
    sideBarTitle: HTMLElement;
    /**
     * @private
     */
    annotationMenuObj: Context;
    /**
     * @private
     */
    isNavigationToolbarVisible: boolean;
    /**
     * @private
     */
    isBookmarkListOpen: boolean;
    /**
     * @private
     */
    isNavigationPaneResized: boolean;
    /**
     * @private
     */
    sideBarToolbar: HTMLElement;
    /**
     * @private
     */
    sideBarContent: HTMLElement;
    /**
     * @private
     */
    sideBarContentContainer: HTMLElement;
    /**
     * @private
     */
    sideBarToolbarSplitter: HTMLElement;
    /**
     * @private
     */
    isBookmarkOpen: boolean;
    /**
     * @private
     */
    isThumbnailOpen: boolean;
    /**
     * @private
     */
    commentPanelContainer: HTMLElement;
    /**
     * @private
     */
    commentsContentContainer: HTMLElement;
    /**
     * @private
     */
    accordionContentContainer: HTMLElement;
    /**
     * @private
     */
    commentPanelResizer: HTMLElement;
    /**
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase);
    /**
     * @private
     */
    initializeNavigationPane(): void;
    private createNavigationPane;
    /**
     * @private
     */
    adjustPane(): void;
    private getSideToolbarHeight;
    private createCommentPanel;
    private createCommentPanelTitleContainer;
    private createCommentPanelResizeIcon;
    private openAnnotationContextMenu;
    /**
     * @private
     */
    createAnnotationContextMenu(): void;
    private annotationMenuItemSelect;
    private createFileElement;
    private createXFdfFileElement;
    private importAnnotationIconClick;
    private importXFdfAnnotationIconClick;
    private loadImportAnnotation;
    /**
     * @private
     */
    closeCommentPanelContainer(): void;
    /**
     * @private
     */
    createNavigationPaneMobile(option: string): void;
    private initiateSearchBox;
    private enableSearchItems;
    private initiateBookmarks;
    private initiateTextSearch;
    /**
     * @private
     */
    goBackToToolbar(): void;
    private setSearchInputWidth;
    private getParentElementSearchBox;
    /**
     * @private
     */
    createTooltipMobile(text: string): void;
    private createMobileTooltip;
    private onTooltipClose;
    /**
     * @private
     */
    toolbarResize(): void;
    private createSidebarToolBar;
    private onTooltipBeforeOpen;
    /**
     * @private
     */
    enableThumbnailButton(): void;
    /**
     * @private
     */
    enableBookmarkButton(): void;
    private createSidebarTitleCloseButton;
    private createResizeIcon;
    /**
     * @private
     */
    setResizeIconTop(): void;
    /**
     * @private
     */
    setCommentPanelResizeIconTop(): void;
    private resizeIconMouseOver;
    private resizePanelMouseDown;
    private resizeViewerMouseLeave;
    /**
     * @private
     */
    readonly outerContainerWidth: number;
    /**
     *  @private
     */
    getViewerContainerScrollbarWidth(): number;
    /**
     *  @private
     */
    readonly sideToolbarWidth: number;
    /**
     * @private
     */
    readonly sideBarContentContainerWidth: number;
    /**
     *  @private
     */
    readonly commentPanelContainerWidth: number;
    private resizePanelMouseMove;
    private sideToolbarOnClose;
    /**
     * @private
     */
    updateViewerContainerOnClose(): void;
    /**
     * @private
     */
    updateViewerContainerOnExpand(): void;
    /**
     * @private
     */
    getViewerContainerLeft(): number;
    /**
     * @private
     */
    getViewerContainerRight(): number;
    /**
     * @private
     */
    getViewerMainContainerWidth(): number;
    private sideToolbarOnClick;
    /**
     * @private
     */
    openThumbnailPane: () => void;
    /**
     * @private
     */
    setThumbnailSelectionIconTheme(): void;
    private removeThumbnailSelectionIconTheme;
    private resetThumbnailIcon;
    /**
     * @private
     */
    resetThumbnailView(): void;
    private bookmarkButtonOnClick;
    private setBookmarkSelectionIconTheme;
    private removeBookmarkSelectionIconTheme;
    private sideToolbarOnMouseup;
    private sideBarTitleOnMouseup;
    /**
     * @private
     */
    openBookmarkcontentInitially(): void;
    /**
     * @private
     */
    disableBookmarkButton(): void;
    private commentPanelMouseDown;
    private updateCommentPanelContainer;
    private commentPanelMouseLeave;
    /**
     * @private
     */
    clear(): void;
    /**
     * @private
     */
    destroy(): void;
    getModuleName(): string;
}
