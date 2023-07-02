import { Dictionary } from '../../base/dictionary';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { WSectionFormat, WCharacterFormat, WParagraphFormat, WStyles } from '../format/index';
import { Layout } from './layout';
import { Renderer } from './render';
import { Page, Rect, Widget, FieldElementBox, ParagraphWidget, HeaderFooterWidget, EditRangeStartElementBox, CommentElementBox, Padding, ShapeElementBox, ContentControl, Footnote, FootnoteElementBox, FootNoteWidget } from './page';
import { DocumentEditor } from '../../document-editor';
import { BodyWidget, LineWidget, TableWidget, TableRowWidget, TableCellWidget, BlockWidget, HeaderFooters, BookmarkElementBox } from './page';
import { Point, PageInfo, CanvasInfo } from '../editor/editor-helper';
import { TextHelper, TextHeightInfo } from './text-helper';
import { Selection } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { Zoom } from './zooming';
import { Dialog } from '@syncfusion/ej2-popups';
import { HeaderFooterType, PageFitType, ProtectionType, FootnoteRestartIndex, FootEndNoteNumberFormat, FootnoteType } from '../../base/types';
import { RestrictEditing } from '../restrict-editing/restrict-editing-pane';
import { FormFieldPopUp } from '../dialogs/form-field-popup';
import { Revision } from '../track-changes/track-changes';
/**
 * @private
 */
export declare class DocumentHelper {
    /**
     * @private
     */
    scrollbarWidth: number;
    /**
     * @private
     */
    isWebPrinting: boolean;
    /**
     * @private
     */
    isHeaderFooter: boolean;
    /**
     * @private
     */
    owner: DocumentEditor;
    viewer: LayoutViewer;
    /**
     * @private
     */
    pageContainer: HTMLElement;
    /**
     * @private
     */
    viewerContainer: HTMLElement;
    /**
     * @private
     */
    optionsPaneContainer: HTMLElement;
    /**
     * @private
     */
    reviewPaneContainer: HTMLElement;
    /**
     * @private
     */
    pages: Page[];
    /**
     * @private
     */
    currentPage: Page;
    private selectionStartPageIn;
    private selectionEndPageIn;
    /**
     * @private
     */
    iframe: HTMLIFrameElement;
    /**
     * @private
     */
    editableDiv: HTMLElement;
    /**
     * @private
     */
    isShowReviewPane: boolean;
    /**
     * @private
     */
    fieldStacks: FieldElementBox[];
    /**
     * @private
     */
    showRevision: boolean;
    /**
     * @private
     */
    splittedCellWidgets: TableCellWidget[];
    /**
     * @private
     */
    tableLefts: number[];
    /**
     * @private
     */
    tapCount: number;
    private timer;
    private isTimerStarted;
    /**
     * @private
     */
    isFirstLineFitInShiftWidgets: boolean;
    /**
     * @private
     */
    preZoomFactor: number;
    /**
     * @private
     */
    preDifference: number;
    /**
     * @private
     */
    fieldEndParagraph: ParagraphWidget;
    /**
     * @private
     */
    fieldToLayout: FieldElementBox;
    /**
     * @private
     */
    backgroundColor: string;
    /**
     * @private
     */
    layout: Layout;
    /**
     * @private
     */
    render: Renderer;
    private containerCanvasIn;
    private selectionCanvasIn;
    /**
     * @private
     */
    zoomModule: Zoom;
    /**
     * @private
     */
    isMouseDown: boolean;
    private isMouseEntered;
    private scrollMoveTimer;
    /**
     * @private
     */
    isSelectionChangedOnMouseMoved: boolean;
    /**
     * @private
     */
    isControlPressed: boolean;
    /**
     * @private
     */
    touchStart: HTMLElement;
    /**
     * @private
     */
    touchEnd: HTMLElement;
    /**
     * @private
     */
    isTouchInput: boolean;
    /**
     * @private
     */
    isTouchMoved: boolean;
    /**
     * @private
     */
    useTouchSelectionMark: boolean;
    /**
     * @private
     */
    touchDownOnSelectionMark: number;
    /**
     * @private
     */
    textHelper: TextHelper;
    /**
     * @private
     */
    isComposingIME: boolean;
    /**
     * @private
     */
    lastComposedText: string;
    /**
     * @private
     */
    isCompositionStart: boolean;
    /**
     * @private
     */
    isCompositionUpdated: boolean;
    /**
     * @private
     */
    isCompositionCanceled: boolean;
    /**
     * @private
     */
    isCompositionEnd: boolean;
    /**
     * @private
     */
    prefix: string;
    /**
     * @private
     */
    suffix: string;
    private dialogInternal;
    private dialogTarget1;
    private dialogTarget2;
    private dialogInternal2;
    private dialogInternal3;
    private dialogTarget3;
    /**
     * @private
     */
    fields: FieldElementBox[];
    /**
     * @private
     */
    blockToShift: BlockWidget;
    /**
     * @private
     */
    heightInfoCollection: TextHeightInfo;
    private animationTimer;
    /**
     * @private
     */
    isListTextSelected: boolean;
    /**
     * @private
     */
    selectionLineWidget: LineWidget;
    /**
     * @private
     */
    characterFormat: WCharacterFormat;
    /**
     * @private
     */
    paragraphFormat: WParagraphFormat;
    /**
     * @private
     */
    renderedLists: Dictionary<WAbstractList, Dictionary<number, number>>;
    /**
     * @private
     */
    renderedLevelOverrides: WLevelOverride[];
    /**
     * @private
     */
    headersFooters: HeaderFooters[];
    private fieldSeparator;
    /**
     * @private
     */
    defaultTabWidth: number;
    /**
     * @private
     */
    dontUseHtmlParagraphAutoSpacing: boolean;
    /**
     * @private
     */
    alignTablesRowByRow: boolean;
    /**
     * @private
     */
    lists: WList[];
    /**
     * @private
     */
    comments: CommentElementBox[];
    /**
     * @private
     */
    authors: Dictionary<string, string>;
    /**
     * @private
     */
    revisionsInternal: Dictionary<string, Revision>;
    /**
     * @private
     */
    commentUserOptionId: number;
    /**
     * @private
     */
    abstractLists: WAbstractList[];
    /**
     * @private
     */
    styles: WStyles;
    /**
     * @private
     */
    listParagraphs: ParagraphWidget[];
    /**
     * @private
     */
    preDefinedStyles: Dictionary<string, string>;
    /**
     * @private
     */
    isRowOrCellResizing: boolean;
    /**
     * @private
     */
    bookmarks: Dictionary<string, BookmarkElementBox>;
    /**
     * @private
     */
    formFields: FieldElementBox[];
    /**
     * @private
     */
    editRanges: Dictionary<string, EditRangeStartElementBox[]>;
    private isMouseDownInFooterRegion;
    private pageFitTypeIn;
    /**
     * @private
     */
    fieldCollection: FieldElementBox[];
    /**
     * @private
     */
    isPageField: boolean;
    /**
     * @private
     */
    mouseDownOffset: Point;
    /**
     * @private
     */
    zoomX: number;
    /**
     * @private
     */
    zoomY: number;
    private zoomFactorInternal;
    /**
     * If movecaretposition is 1, Home key is pressed
     * If moveCaretPosition is 2, End key is pressed
     * @private
     */
    moveCaretPosition: number;
    /**
     * @private
     */
    isTextInput: boolean;
    /**
     * @private
     */
    isScrollHandler: boolean;
    /**
     * @private
     */
    triggerElementsOnLoading: boolean;
    /**
     * @private
     */
    triggerSpellCheck: boolean;
    /**
     * @private
     */
    scrollTimer: number;
    resizeTimer: number;
    /**
     * @private
     * @default false
     */
    isScrollToSpellCheck: boolean;
    /**
     * preserve the format
     * @private
     */
    restrictFormatting: boolean;
    /**
     * preserve the document protection type either readonly or no protection
     * @private
     */
    protectionType: ProtectionType;
    /**
     * Preserve the password protection is enforced or not
     * @private
     */
    isDocumentProtected: boolean;
    /**
     * preserve the hash value of password
     * @private
     */
    hashValue: string;
    /**
     * @private
     */
    saltValue: string;
    /**
     * @private
     */
    userCollection: string[];
    /**
     * @private
     */
    restrictEditingPane: RestrictEditing;
    formFillPopup: FormFieldPopUp;
    /**
     * @private
     */
    cachedPages: number[];
    longTouchTimer: number;
    /**
     * @private
     */
    skipScrollToPosition: boolean;
    /**
     * @private
     */
    isIosDevice: boolean;
    /**
     * @private
     */
    isMobileDevice: boolean;
    /**
     * @private
     */
    visibleBoundsIn: Rect;
    /**
     * @private
     */
    currentSelectedCommentInternal: CommentElementBox;
    /**
     * @private
     */
    currentSelectedRevisionInternal: Revision;
    /**
     * @private
     */
    resizerTimer: number;
    /**
     * @private
     */
    isFormFilling: boolean;
    /**
     * @private
     */
    customXmlData: Dictionary<string, string>;
    /**
     * @private
     */
    contentControlCollection: ContentControl[];
    /**
     * @private
     */
    footnotes: Footnote;
    /**
     * @private
     */
    endnotes: Footnote;
    /**
     * @private
     */
    endnoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * @private
     */
    footNoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * @private
     */
    restartIndexForFootnotes: FootnoteRestartIndex;
    /**
     * @private
     */
    restartIndexForEndnotes: FootnoteRestartIndex;
    /**
     * @private
     */
    footnoteCollection: FootnoteElementBox[];
    /**
     * @private
     */
    endnoteCollection: FootnoteElementBox[];
    /**
     * @private
     */
    isFootnoteWidget: boolean;
    /**
     * Gets visible bounds.
     * @private
     */
    readonly visibleBounds: Rect;
    /**
     * Gets container canvas.
     * @private
     */
    readonly containerCanvas: HTMLCanvasElement;
    /**
     * Gets selection canvas.
     * @private
     */
    readonly selectionCanvas: HTMLCanvasElement;
    /**
     * Gets container context.
     * @private
     */
    readonly containerContext: CanvasRenderingContext2D;
    /**
     * Gets selection context.
     * @private
     */
    readonly selectionContext: CanvasRenderingContext2D;
    /**
     * Gets the current rendering page.
     */
    readonly currentRenderingPage: Page;
    /**
     * Gets or sets zoom factor.
     * @private
     */
    zoomFactor: number;
    /**
     * Gets the selection.
     * @private
     */
    readonly selection: Selection;
    /**
     * Gets or sets selection start page.
     * @private
     */
    selectionStartPage: Page;
    /**
     * Gets or sets selection end page.
     * @private
     */
    selectionEndPage: Page;
    /**
     * Gets the initialized default dialog.
     * @private
     */
    readonly dialog: Dialog;
    /**
     * Gets the initialized default dialog.
     * @private
     */
    readonly dialog2: Dialog;
    /**
     * Gets the initialized default dialog.
     * @private
     */
    readonly dialog3: Dialog;
    /**
     * @private
     */
    /**
    * @private
    */
    currentSelectedComment: CommentElementBox;
    /**
     * @private
     */
    /**
    * @private
    */
    currentSelectedRevision: Revision;
    /**
     * @private
     */
    readonly isInlineFormFillProtectedMode: boolean;
    /**
     * @private
     */
    readonly isFormFillProtectedMode: boolean;
    constructor(owner: DocumentEditor);
    private initalizeStyles;
    /**
     * @private
     */
    clearDocumentItems(): void;
    /**
     * @private
     */
    setDefaultDocumentFormat(): void;
    private setDefaultCharacterValue;
    private setDefaultParagraphValue;
    /**
     * @private
     */
    getAbstractListById(id: number): WAbstractList;
    /**
     * @private
     */
    getListById(id: number): WList;
    /**
     * @private
     */
    static getListLevelNumber(listLevel: WListLevel): number;
    /**
     * Gets the bookmarks.
     * @private
     */
    getBookmarks(includeHidden?: boolean): string[];
    /**
     * @private
     */
    selectComment(comment: CommentElementBox): void;
    /**
     * @private
     */
    showComments(show: boolean): void;
    /**
     * @private
     */
    showRevisions(show: boolean): void;
    /**
     * Initializes components.
     * @private
     */
    initializeComponents(): void;
    private measureScrollbarWidth;
    /**
     * @private
     */
    private createEditableDiv;
    /**
     * @private
     */
    private createEditableIFrame;
    private initIframeContent;
    /**
     * Wires events and methods.
     */
    private wireEvent;
    private wireInputEvents;
    private onIframeLoad;
    /**
     * @private
     */
    private onTextInput;
    /**
     * Fires when composition starts.
     * @private
     */
    private compositionStart;
    /**
     * Fires on every input during composition.
     * @private
     */
    private compositionUpdated;
    /**
     * Fires when user selects a character/word and finalizes the input.
     * @private
     */
    private compositionEnd;
    private getEditableDivTextContent;
    /**
     * @private
     */
    updateAuthorIdentity(): void;
    /**
     * @private
     */
    getAvatar(userInfo: HTMLElement, userName: HTMLElement, comment: CommentElementBox, revision: Revision): void;
    /**
     * @private
     */
    getAuthorColor(author: string): string;
    /**
     * @private
     */
    generateRandomColor(): string;
    /**
     * @private
     */
    positionEditableTarget(): void;
    private onImageResizer;
    /**
     * @private
     */
    onKeyPressInternal: (event: KeyboardEvent) => void;
    private onTextInputInternal;
    /**
     * Fired on paste.
     * @param {ClipboardEvent} event
     * @private
     */
    onPaste: (event: ClipboardEvent) => void;
    /**
     * Initializes dialog template.
     */
    private initDialog;
    /**
     * Initializes dialog template.
     */
    private initDialog3;
    /**
     * @private
     */
    hideDialog(): void;
    /**
     * Initializes dialog template.
     */
    private initDialog2;
    /**
     * Fires when editable div loses focus.
     * @private
     */
    onFocusOut: () => void;
    /**
     * Updates focus to editor area.
     * @private
     */
    updateFocus: () => void;
    /**
     * Clears the context.
     * @private
     */
    clearContent(): void;
    /**
     * Fired when the document gets changed.
     * @param {WordDocument} document
     */
    onDocumentChanged(sections: BodyWidget[]): void;
    /**
     * Fires on scrolling.
     */
    private scrollHandler;
    /**
     * Fires when the window gets resized.
     * @private
     */
    onWindowResize: () => void;
    /**
     * @private
     */
    onContextMenu: (event: MouseEvent) => void;
    /**
     * Initialize touch ellipse.
     */
    private initTouchEllipse;
    /**
     * Updates touch mark position.
     * @private
     */
    updateTouchMarkPosition(): void;
    /**
     * Called on mouse down.
     * @param {MouseEvent} event
     * @private
     */
    onMouseDownInternal: (event: MouseEvent) => void;
    /**
     * Called on mouse move.
     * @param {MouseEvent} event
     * @private
     */
    onMouseMoveInternal: (event: MouseEvent) => void;
    /**
     * @private
     */
    onMouseLeaveInternal: (event: MouseEvent) => void;
    private scrollForwardOnSelection;
    private scrollBackwardOnSelection;
    /**
     * @private
     */
    onMouseEnterInternal: () => void;
    /**
     * Fired on double tap.
     * @param {MouseEvent} event
     * @private
     */
    onDoubleTap: (event: MouseEvent) => void;
    /**
     * Called on mouse up.
     * @param {MouseEvent} event
     * @private
     */
    onMouseUpInternal: (event: MouseEvent) => void;
    private isSelectionInListText;
    /**
     * @private
     */
    isInShapeBorder(floatElement: ShapeElementBox, cursorPoint: Point): boolean;
    /**
     * Check whether touch point is inside the rectangle or not.
     * @param x
     * @param y
     * @param width
     * @param height
     * @param touchPoint
     * @private
     */
    isInsideRect(x: number, y: number, width: number, height: number, touchPoint: Point): boolean;
    /**
     * @private
     */
    getLeftValue(widget: LineWidget): number;
    /**
     * Checks whether left mouse button is pressed or not.
     */
    private isLeftButtonPressed;
    /**
     * Fired on touch start.
     * @param {TouchEvent} event
     * @private
     */
    onTouchStartInternal: (event: Event) => void;
    /**
     * Fired on long touch
     * @param {TouchEvent} event
     * @private
     */
    onLongTouch: (event: TouchEvent) => void;
    /**
     * Fired on touch move.
     * @param {TouchEvent} event
     * @private
     */
    onTouchMoveInternal: (event: TouchEvent) => void;
    /**
     * Fired on touch up.
     * @param {TouchEvent} event
     * @private
     */
    onTouchUpInternal: (event: TouchEvent) => void;
    /**
     * Updates selection for touch position.
     * @param point
     * @param touchPoint
     */
    private updateSelectionOnTouch;
    /**
     * Gets touch offset value.
     * @private
     */
    getTouchOffsetValue(event: TouchEvent): Point;
    /**
     * Fired on pinch zoom in.
     * @param {TouchEvent} event
     * @private
     */
    onPinchInInternal(event: TouchEvent): void;
    /**
     * Fired on pinch zoom out.
     * @param {TouchEvent} event
     */
    private onPinchOutInternal;
    /**
     * Gets page width.
     * @private
     */
    getPageWidth(page: Page): number;
    /**
     * Removes specified page.
     * @private
     */
    removePage(page: Page): void;
    /**
     * Updates viewer size on window resize.
     * @private
     */
    updateViewerSize(): void;
    /**
     * Updates viewer size.
     */
    private updateViewerSizeInternal;
    /**
     * Inserts page in specified index.
     * @private
     */
    insertPage(index: number, page: Page): void;
    /**
     * Updates text position for selection.
     * @param cursorPoint
     * @param tapCount
     * @param clearMultiSelection
     * @private
     */
    updateTextPositionForSelection(cursorPoint: Point, tapCount: number): void;
    /**
     * Scrolls to specified position.
     * @param startPosition
     * @param endPosition
     * @private
     */
    scrollToPosition(startPosition: TextPosition, endPosition: TextPosition, skipCursorUpdate?: boolean): void;
    /**
     * Gets line widget using cursor point.
     * @private
     */
    getLineWidget(cursorPoint: Point): LineWidget;
    /**
     * Gets line widget.
     * @private
     */
    getLineWidgetInternal(cursorPoint: Point, isMouseDragged: boolean): LineWidget;
    private isInFootnoteWidget;
    /**
     * @private
     */
    private checkFloatingItems;
    /**
     * @private
     */
    isBlockInHeader(block: Widget): boolean;
    /**
     * Clears selection highlight.
     * @private
     */
    clearSelectionHighlight(): void;
    /**
     * Fired on keyup event.
     * @private
     */
    onKeyUpInternal: (event: KeyboardEvent) => void;
    /**
     * Fired on keydown.
     * @private
     */
    onKeyDownInternal: (event: KeyboardEvent) => void;
    /**
     * @private
     */
    removeEmptyPages(): void;
    /**
     * @private
     */
    scrollToBottom(): void;
    /**
     * Returns the field code result.
     * @private
     */
    getFieldResult(fieldBegin: FieldElementBox, page: Page): string;
    /**
     * Returns field text.
     */
    private getFieldText;
    /**
     * Destroys the internal objects maintained for control.
     */
    destroy(): void;
    /**
     * Un-Wires events and methods
     */
    private unWireEvent;
    /**
     * updateCursor
     * @private
     */
    updateCursor(event: MouseEvent): void;
}
export declare abstract class LayoutViewer {
    owner: DocumentEditor;
    constructor(owner: DocumentEditor);
    readonly documentHelper: DocumentHelper;
    /**
     * @private
     */
    visiblePages: Page[];
    /**
     * @private
     */
    padding: Padding;
    /**
     * @private
     */
    clientActiveArea: Rect;
    /**
     * @private
     */
    clientArea: Rect;
    /**
     * @private
     */
    textWrap: boolean;
    /**
     * @private
     */
    preVisibleWidth: number;
    /**
     * @private
     */
    private pageFitTypeIn;
    /**
     * @private
     */
    containerTop: number;
    /**
     * @private
     */
    containerLeft: number;
    /**
     * Gets or sets page fit type.
     * @private
     */
    pageFitType: PageFitType;
    /**
     * @private
     */
    updateClientArea(sectionFormat: WSectionFormat, page: Page, isRelayout?: boolean): void;
    /**
     * Updates client area left or top position.
     * @private
     */
    updateClientAreaTopOrLeft(tableWidget: TableWidget, beforeLayout: boolean): void;
    /**
     * Updates client area for table.
     * @private
     */
    updateClientAreaForTable(tableWidget: TableWidget): void;
    /**
     * Updates client area for row.
     * @private
     */
    updateClientAreaForRow(row: TableRowWidget, beforeLayout: boolean): void;
    /**
     * Updates client area for cell.
     * @private
     */
    updateClientAreaForCell(cell: TableCellWidget, beforeLayout: boolean): void;
    /**
     * Updates client area for TextBox shape.
     * @private
     */
    updateClientAreaForTextBoxShape(textBox: ShapeElementBox, beforeLayout: boolean): void;
    /**
    * Updates the client area based on widget.
    * @private
    */
    updateClientAreaByWidgetfootnote(widget: FootNoteWidget): void;
    /**
     * Updates the client area based on widget.
     * @private
     */
    updateClientAreaByWidget(widget: ParagraphWidget): void;
    /**
     * Updates client area location.
     * @param widget
     * @param area
     * @private
     */
    updateClientAreaLocation(widget: Widget, area: Rect): void;
    /**
     * Updates client area for block.
     * @private
     */
    updateClientAreaForBlock(block: BlockWidget, beforeLayout: boolean, tableCollection?: TableWidget[]): void;
    private tableAlignmentForBidi;
    /**
     * Updates client active area left.
     * @private
     */
    cutFromLeft(x: number): void;
    /**
     * Updates client active area top.
     * @private
     */
    cutFromTop(y: number): void;
    /**
     * Updates client width.
     * @private
     */
    updateClientWidth(width: number): void;
    /**
     * Finds focused page.
     * @private
     */
    findFocusedPage(currentPoint: Point, updateCurrentPage: boolean): Point;
    /**
     * @private
     */
    getPageHeightAndWidth(height: number, width: number, viewerWidth: number, viewerHeight: number): PageInfo;
    /**
     * Renders visible pages.
     * @private
     */
    renderVisiblePages(): void;
    handleZoom(): void;
    /**
     * @private
     */
    updateCanvasWidthAndHeight(viewerWidth: number, viewerHeight: number, containerHeight: number, containerWidth: number, width: number, height: number): CanvasInfo;
    /**
     * @private
     */
    updateScrollBarPosition(containerWidth: number, containerHeight: number, viewerWidth: number, viewerHeight: number, width: number, height: number): void;
    /**
     * @private
     */
    abstract readonly pageGap: number;
    /**
     * @private
     */
    abstract createNewPage(section: BodyWidget, index?: number): Page;
    /**
     * @private
     */
    abstract renderPage(page: Page, x: number, y: number, width: number, height: number): void;
    /**
     * @private
     */
    abstract updateScrollBars(): void;
    /**
     * private
     */
    abstract scrollToPage(pageIndex: number): void;
    /**
     * @private
     */
    abstract onPageFitTypeChanged(pageFitType: PageFitType): void;
    destroy(): void;
}
/**
 * @private
 */
export declare class PageLayoutViewer extends LayoutViewer {
    private pageLeft;
    /**
     * @private
     */
    readonly pageGap: number;
    /**
     * Initialize the constructor of PageLayoutViewer
     */
    constructor(owner: DocumentEditor);
    readonly documentHelper: DocumentHelper;
    /**
     * Creates new page.
     * @private
     */
    createNewPage(section: BodyWidget, index?: number): Page;
    /**
     * @private
     */
    updatePageBoundingRectange(section: BodyWidget, page: Page, yPos: number): void;
    /**
     * Fired when page fit type changed.
     * @private
     */
    onPageFitTypeChanged(pageFitType: PageFitType): void;
    /**
     * Gets current page header footer.
     * @private
     */
    getCurrentPageHeaderFooter(section: BodyWidget, isHeader: boolean): HeaderFooterWidget;
    /**
     * Get header footer type
     * @private
     */
    getHeaderFooterType(section: BodyWidget, isHeader: boolean): HeaderFooterType;
    /**
     * Gets current header footer.
     * @param type
     * @param section
     * @private
     */
    getCurrentHeaderFooter(type: HeaderFooterType, sectionIndex: number): HeaderFooterWidget;
    private createHeaderFooterWidget;
    /**
     * Gets header footer.
     * @param type
     * @private
     */
    getHeaderFooter(type: HeaderFooterType): number;
    /**
     * Updates header footer client area.
     * @private
     */
    updateHFClientArea(sectionFormat: WSectionFormat, isHeader: boolean): void;
    /**
     * @private
     */
    updateHCFClientAreaWithTop(sectionFormat: WSectionFormat, isHeader: boolean, page: Page): void;
    updateFooterWidgetTop(): void;
    /**
     * @private
     */
    updateFootnoteClientArea(sectionFormat: WSectionFormat, footnote: FootNoteWidget, footnotetype?: FootnoteType, para?: ParagraphWidget): void;
    /**
     * Scrolls to the specified page
     * @private
     */
    scrollToPage(pageIndex: number): void;
    /**
     * Updates scroll bars.
     * @private
     */
    updateScrollBars(): void;
    /**
     * Updates visible pages.
     * @private
     */
    updateVisiblePages(): void;
    /**
     * Adds visible pages.
     */
    private addVisiblePage;
    /**
     * Render specified page widgets.
     * @private
     */
    renderPage(page: Page, x: number, y: number, width: number, height: number): void;
}
export declare class WebLayoutViewer extends LayoutViewer {
    constructor(owner: DocumentEditor);
    readonly documentHelper: DocumentHelper;
    /**
     * @private
     */
    visiblePages: Page[];
    /**
     * @private
     */
    readonly pageGap: number;
    /**
     * Creates new page.
     * @private
     */
    createNewPage(section: BodyWidget, index?: number): Page;
    onPageFitTypeChanged(pageFitType: PageFitType): void;
    scrollToPage(pageIndex: number): void;
    getContentHeight(): number;
    /**
     * @private
     */
    getContentWidth(): number;
    updateScrollBars(): void;
    updateVisiblePages(): void;
    addVisiblePage(page: Page, x: number, y: number): void;
    /**
     * @private
     */
    renderPage(page: Page, x: number, y: number, width: number, height: number): void;
}
