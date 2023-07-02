import { LayoutViewer } from '../index';
import { Selection } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { IWidget, ParagraphWidget, LineWidget, ElementBox, Page, ImageElementBox, BlockWidget, BodyWidget, TableWidget, TableCellWidget, TableRowWidget, Widget, BookmarkElementBox, HeaderFooterWidget, FieldTextElementBox, EditRangeStartElementBox, CommentElementBox, FormField, FootNoteWidget } from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import { IndexInfo, BlockInfo, Base64, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo } from './editor-helper';
import { WParagraphFormat, WSectionFormat, WTableFormat, WRowFormat, WCellFormat, WBorder, WBorders, WShading } from '../index';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { FieldElementBox } from '../viewer/page';
import { HighlightColor, BaselineAlignment, Strikethrough, Underline, LineSpacingType, TextAlignment, ListLevelPattern, HeaderFooterType } from '../../base/index';
import { Action } from '../../index';
import { TableResizer } from './table-resizer';
import { CellVerticalAlignment, BorderType, LineStyle, TabLeader, AutoFitType, ProtectionType, PasteOptions, FormFieldType, RevisionType } from '../../base/types';
import { DocumentHelper } from '../viewer';
import { Revision } from '../track-changes/track-changes';
/**
 * Editor module
 */
export declare class Editor {
    documentHelper: DocumentHelper;
    private nodes;
    private editHyperlinkInternal;
    private startOffset;
    private startParagraph;
    private endOffset;
    private pasteRequestHandler;
    private endParagraph;
    private removeEditRange;
    private currentProtectionType;
    private alertDialog;
    private formFieldCounter;
    private skipFieldDeleteTracking;
    private isForHyperlinkFormat;
    private isTrackingFormField;
    /**
     * @private
     */
    isRemoveRevision: boolean;
    /**
     * @private
     */
    isHandledComplex: boolean;
    /**
     * @private
     */
    tableResize: TableResizer;
    /**
     * @private
     */
    tocStyles: TocLevelSettings;
    private refListNumber;
    private incrementListNumber;
    private removedBookmarkElements;
    /**
     * @private
     */
    tocBookmarkId: number;
    /**
     * @private
     */
    copiedData: string;
    private animationTimer;
    private pageRefFields;
    private delBlockContinue;
    private delBlock;
    private delSection;
    /**
     * @private
     */
    isInsertingTOC: boolean;
    private editStartRangeCollection;
    private skipReplace;
    private skipTableElements;
    /**
     * @private
     */
    isXmlMapped: boolean;
    /**
     * @private
     */
    readonly restrictFormatting: boolean;
    /**
     * @private
     */
    readonly restrictEditing: boolean;
    readonly canEditContentControl: boolean;
    copiedContent: any;
    private copiedTextContent;
    private previousParaFormat;
    private previousCharFormat;
    private currentPasteOptions;
    private pasteTextPosition;
    isSkipHistory: boolean;
    isPaste: boolean;
    isPasteListUpdated: boolean;
    base64: Base64;
    /**
     * @private
     */
    isInsertField: boolean;
    /**
     * Initialize the editor module
     * @param  {LayoutViewer} viewer
     * @private
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    private readonly editorHistory;
    /**
     * @private
     */
    isBordersAndShadingDialog: boolean;
    private readonly selection;
    private readonly owner;
    private getModuleName;
    /**
     * Inserts the specified field at cursor position
     * @param code
     * @param result
     */
    insertField(code: string, result?: string): void;
    /**
     * To update style for paragraph
     * @param style - style name
     * @param clearDirectFormatting - Removes manual formatting (formatting not applied using a style)
     * from the selected text, to match the formatting of the applied style. Default value is false.
     */
    applyStyle(style: string, clearDirectFormatting?: boolean): void;
    /**
     * Moves the selected content in the document editor control to clipboard.
     */
    cut(): void;
    /**
     * Insert editing region where everyone can edit.
     */
    insertEditingRegion(): void;
    /**
     * Insert editing region where mentioned user can edit.
     */
    insertEditingRegion(user: string): void;
    /**
     * Enforce document protection by protection type.
     */
    enforceProtection(credential: string, protectionType: ProtectionType): void;
    /**
     * Enforce document protection.
     */
    enforceProtection(credential: string, limitToFormatting: boolean, isReadOnly: boolean): void;
    private getCommentHierarchicalIndex;
    /**
     * Insert comment
     * @param text - comment text.
     */
    insertComment(text?: string): void;
    private insertCommentInternal;
    /**
     * Delete all the comments in current document
     */
    deleteAllComments(): void;
    /**
     * Delete current selected comment.
     */
    deleteComment(): void;
    /**
     * @private
     */
    deleteCommentInternal(comment: CommentElementBox): void;
    /**
     * @private
     */
    deleteCommentWidget(comment: CommentElementBox): void;
    /**
     * @private
     */
    resolveComment(comment: CommentElementBox): void;
    /**
     * @private
     */
    reopenComment(comment: CommentElementBox): void;
    private resolveOrReopenComment;
    /**
     * @private
     */
    replyComment(parentComment: CommentElementBox, text?: string): void;
    private removeInline;
    /**
     * @private
     */
    addCommentWidget(commentWidget: CommentElementBox, isNewComment: boolean, showComments: boolean, selectComment: boolean): void;
    /**
     * @private
     */
    addReplyComment(comment: CommentElementBox, hierarchicalIndex: string): void;
    /**
     * @private
     */
    addProtection(password: string, protectionType: ProtectionType): void;
    private protectionFailureHandler;
    private enforceProtectionInternal;
    private protectDocument;
    /**
     * Stop document protection.
     */
    stopProtection(password: string): void;
    private onUnProtectionSuccess;
    private validateHashValue;
    /**
     * @private
     */
    unProtectDocument(): void;
    /**
     * Notify content change event
     * @private
     */
    fireContentChange(): void;
    /**
     * Update physical location for text position
     * @private
     */
    updateSelectionTextPosition(isSelectionChanged: boolean): void;
    /**
     * @private
     */
    onTextInputInternal: (event: KeyboardEvent) => void;
    /**
     * Predict text
     * @private
     */
    predictText(): void;
    /**
     * Gets prefix and suffix.
     * @private
     */
    getPrefixAndSuffix(): void;
    /**
     * Fired on paste.
     * @param {ClipboardEvent} event
     * @private
     */
    onPaste: (event: ClipboardEvent) => void;
    /**
     * key action
     * @private
     */
    onKeyDownInternal(event: KeyboardEvent, ctrl: boolean, shift: boolean, alt: boolean): void;
    /**
     * @private
     */
    handleShiftEnter(): void;
    /**
     * Handles back key.
     * @private
     */
    handleBackKey(): void;
    /**
     * Handles delete
     * @private
     */
    handleDelete(): void;
    /**
     * Handles enter key.
     * @private
     */
    handleEnterKey(): void;
    /**
     * Handles Control back key.
     * @private
     */
    handleCtrlBackKey(): void;
    /**
     * Handles Ctrl delete
     * @private
     */
    handleCtrlDelete(): void;
    /**
     * @private
     */
    handleTextInput(text: string): void;
    /**
     * Copies to format.
     * @param  {WCharacterFormat} format
     * @private
     */
    copyInsertFormat(format: WCharacterFormat, copy: boolean): WCharacterFormat;
    private getResultContentControlText;
    private updateXmlMappedContentControl;
    private updateCustomXml;
    /**
     * Inserts the specified text at cursor position
     * @param  {string} text - text to insert
     */
    insertText(text: string): void;
    /**
     * @private
     */
    insertTextInternal(text: string, isReplace: boolean, revisionType?: RevisionType): void;
    private updateElementInFieldRevision;
    /**
     * @private
     */
    retrieveFieldResultantText(item: FieldElementBox): string;
    /**
     * Method to combine revisions in blocks
     */
    private checkToCombineRevisionsinBlocks;
    private checkToMapRevisionWithNextNode;
    private checkToMapRevisionWithPreviousNode;
    /**
     * Method to combine revisions withtin the inline text
     */
    private checkToMapRevisionWithInlineText;
    /**
     * Method to combine element revisions
     */
    private combineElementRevisions;
    /**
     * Method to apply matched revisions
     */
    private applyMatchedRevisionInorder;
    /**
     * Method to copy element revision which is
     * @param elementToCopy
     * @param elementToInclude
     */
    private copyElementRevision;
    /**
     * Method to map the matched revisions
     */
    private mapMatchedRevisions;
    /**
     * Retrieve matched revisions
     */
    private getMatchedRevisionsToCombine;
    private decideInlineForTrackChanges;
    /**
     * @private
     */
    insertIMEText(text: string, isUpdate: boolean): void;
    /**
     * Insert Section break at cursor position
     */
    insertSectionBreak(): void;
    /**
     * Method used to
     */
    private combineRevisionWithBlocks;
    /**
     * Method checks to combine new element to be inserted can be matched with next para's first element.
     */
    private checkToCombineRevisionWithNextPara;
    /**
     * Method checks to combine new element to be inserted can be matched with previous para's last element.
     */
    private checkToCombineRevisionWithPrevPara;
    /**
     * Method to combine revision with next para, returns true if it requires new revision
     */
    private combineRevisionWithNextPara;
    private combineRevisionWithPrevPara;
    removeRevision(revisionToRemove: Revision): any;
    insertHistoryRevision(revisionToInsert: Revision): any;
    clearElementRevision(revision: Revision): void;
    insertRevision(item: any, type: RevisionType, author?: string, date?: string, spittedRange?: object[]): void;
    /**
     * Method help to clear previous revisions and include new revision at specified index
     * @param range - range of elements to be cleared
     * @param revision - revision to be inserted
     * @param index - index at which to be included in the revision range
     */
    private clearAndUpdateRevisons;
    private splitRevisionByElement;
    /**
     * Method to update revision for the splitted text element
     * @param inline - Original text element
     * @param splittedSpan - Splitted element
     */
    private updateRevisionForSpittedTextElement;
    private isRevisionMatched;
    /**
     * Method to compare revisions of two
     * @param element
     * @param compare
     */
    private compareElementRevision;
    private canInsertRevision;
    private insertRevisionAtEnd;
    private insertRevisionAtPosition;
    private insertRevisionAtBegining;
    /**
     * Method to split the revision from the element from which it was splitted.
     * @param {element} - element from which it was spitted
     * @param {spittedElement} - element which is splitted
     */
    private splitRevisionForSpittedElement;
    /**
     * Method to combine element revision if not inserts new revision
     */
    private combineElementRevision;
    /**
     *
     * @param block
     * @param startPosition
     * @param endposition
     */
    private combineRevisions;
    /**
     * Method to update the revision for whole block
     * @private
     */
    insertRevisionForBlock(widget: ParagraphWidget, revisionType: RevisionType, isTOC?: boolean, revision?: Revision): void;
    /**
     * Method to update revision collection
     * @private
     */
    private updateRevisionCollection;
    /**
     * @private
     */
    insertSection(selection: Selection, selectFirstBlock: boolean): BlockWidget;
    /**
     * @private
     */
    splitBodyWidget(bodyWidget: BodyWidget, sectionFormat: WSectionFormat, startBlock: BlockWidget): BodyWidget;
    private insertRemoveHeaderFooter;
    private updateBlockIndex;
    /**
     * @private
     */
    updateSectionIndex(sectionFormat: WSectionFormat, startBodyWidget: BodyWidget, increaseIndex: boolean): void;
    private checkAndConvertList;
    private checkNextLevelAutoList;
    private getNumber;
    private getListLevelPattern;
    private autoConvertList;
    private checkNumberFormat;
    private checkLeadingZero;
    private getPageFromBlockWidget;
    /**
     * @private
     */
    insertTextInline(element: ElementBox, selection: Selection, text: string, index: number, skipReLayout?: boolean): void;
    private insertFieldBeginText;
    private insertBookMarkText;
    private insertFieldSeparatorText;
    private insertFieldEndText;
    private insertImageText;
    /**
     * @private
     */
    private isListTextSelected;
    private checkAndConvertToHyperlink;
    private autoFormatHyperlink;
    private appylingHyperlinkFormat;
    private createHyperlinkElement;
    private insertHyperlinkfield;
    /**
     * @private
     */
    unlinkRangeFromRevision(inline: any, removeCollection?: boolean): void;
    /**
     * @private
     */
    unlinkWholeRangeInRevision(item: any, revision: Revision): void;
    /**
     * @private
     */
    unLinkFieldCharacter(inline: ElementBox): void;
    private getCharacterFormat;
    /**
     * Insert Hyperlink
     * @param  {string} address - Hyperlink URL
     * @param  {string} displayText - Display text for the hyperlink
     */
    insertHyperlink(address: string, displayText?: string): void;
    /**
     * @private
     */
    insertHyperlinkInternal(url: string, displayText: string, remove: boolean, isBookmark?: boolean): void;
    private insertHyperlinkInternalInternal;
    private insertHyperlinkByFormat;
    private initInsertInline;
    /**
     * @private
     */
    insertElementInCurrentLine(selection: Selection, inline: ElementBox): void;
    /**
     * Edit Hyperlink
     * @param  {Selection} selection
     * @param  {string} url
     * @param  {string} displayText
     * @private
     */
    editHyperlink(selection: Selection, url: string, displayText: string, isBookmark?: boolean): boolean;
    private insertClonedFieldResult;
    private getClonedFieldResultWithSel;
    private getClonedFieldResult;
    /**
     * Removes the hyperlink if selection is within hyperlink.
     */
    removeHyperlink(): void;
    /**
     * Paste copied clipboard content on Paste event
     * @param  {ClipboardEvent} event
     * @param  {any} pasteWindow?
     * @private
     */
    pasteInternal(event: ClipboardEvent, pasteWindow?: any): void;
    private pasteImage;
    /**
     * @private
     */
    onPasteImage(data: string): void;
    /**
     * @private
     */
    pasteAjax(content: string, type: string): void;
    /**
     * @private
     */
    pasteFormattedContent(result: any): void;
    private onPasteFailure;
    /**
     * Pastes provided sfdt content or the data present in local clipboard if any .
     * @param {string} sfdt? insert the specified sfdt content at current position
     */
    paste(sfdt?: string, defaultPasteOption?: PasteOptions): void;
    private getUniqueListOrAbstractListId;
    private checkSameLevelFormat;
    private listLevelPatternInCollection;
    private getBlocksToUpdate;
    private updateListIdForBlocks;
    private updatePasteContent;
    /**
     * @private
     */
    getBlocks(pasteContent: any, isPaste: boolean, sections?: BodyWidget[], comments?: CommentElementBox[], revision?: Revision[]): BodyWidget[];
    private applyMergeFormat;
    private applyFormatInternal;
    applyPasteOptions(options: PasteOptions): void;
    /**
     * @private
     */
    pasteContents(content: any, currentFormat?: WParagraphFormat): void;
    private pasteContentsInternal;
    private pasteContent;
    private pasteCopiedData;
    private isSectionEmpty;
    /**
     * Insert Table on undo
     * @param  {WTable} table
     * @param  {WTable} newTable
     * @param  {boolean} moveRows
     * @private
     */
    insertTableInternal(table: TableWidget, newTable: TableWidget, moveRows: boolean): void;
    private canConstructRevision;
    private constructRevisionsForTable;
    /**
     * @private
     */
    constructRevisionsForBlock(paragraph: ParagraphWidget, canConstructRevision: boolean): void;
    /**
     * @private
     * @param paraWidget
     * @param startoffset
     * @param endoffset
     * @param revisionId
     * @param isParaMarkIncluded
     */
    applyRevisionForCurrentPara(paraWidget: ParagraphWidget, startoffset: number, endoffset: number, revisionId: string, isParaMarkIncluded: boolean): void;
    /**
     * Insert Table on undo
     * @param  {Selection} selection
     * @param  {WBlock} block
     * @param  {WTable} table
     * @private
     */
    insertBlockTable(selection: Selection, block: BlockWidget, table: TableWidget): void;
    /**
     * On cut handle selected content remove and relayout
     * @param  {Selection} selection
     * @param  {TextPosition} startPosition
     * @param  {TextPosition} endPosition
     * @private
     */
    handleCut(selection: Selection): void;
    /**
     * @private
     */
    insertInlineInternal(element: ElementBox, revisionType?: RevisionType): void;
    private insertElement;
    private updateRevisionForElement;
    private insertElementInternal;
    /**
     * @private
     */
    constructRevisionFromID(insertElement: any, isEnd: boolean, prevElement?: ElementBox): void;
    /**
     * Insert Block on undo
     * @param  {Selection} selection
     * @param  {WBlock} block
     * @private
     */
    insertBlock(block: BlockWidget): void;
    /**
     * Insert new Block on specific index
     * @param  {Selection} selection
     * @param  {BlockWidget} block
     * @private
     */
    insertBlockInternal(block: BlockWidget): void;
    /**
     * Inserts the image with specified size at cursor position in the document editor.
     * @param {string} imageString  Base64 string, web URL or file URL.
     * @param {number} width? Image width
     * @param {number} height? Image height
     */
    insertImage(imageString: string, width?: number, height?: number): void;
    /**
     * Inserts a table of specified size at cursor position
     *  in the document editor.
     * @param {number} rows Default value of ‘rows’ parameter is 1.
     * @param {number} columns Default value of ‘columns’ parameter is 1.
     */
    insertTable(rows?: number, columns?: number): void;
    /**
     * Inserts the specified number of rows to the table above or below to the row at cursor position.
     * @param {boolean} above The above parameter is optional and if omitted,
     * it takes the value as false and inserts below the row at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     */
    insertRow(above?: boolean, count?: number): void;
    /**
     * Fits the table based on AutoFitType.
     * @param {AutoFitType} - auto fit type
     */
    autoFitTable(fitType: AutoFitType): void;
    private updateCellFormatForInsertedRow;
    private updateRowspan;
    private insertTableRows;
    /**
     * Inserts the specified number of columns to the table left or right to the column at cursor position.
     * @param {number} left The left parameter is optional and if omitted, it takes the value as false and
     * inserts to the right of column at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     */
    insertColumn(left?: boolean, count?: number): void;
    /**
     * Creates table with specified rows and columns.
     * @private
     */
    createTable(rows: number, columns: number): TableWidget;
    private createRowAndColumn;
    private createColumn;
    private getColumnCountToInsert;
    private getRowCountToInsert;
    private getOwnerCell;
    private getOwnerRow;
    private getOwnerTable;
    /**
     * Merge Selected cells
     * @private
     */
    mergeSelectedCellsInTable(): void;
    private confirmCellMerge;
    private mergeSelectedCells;
    private mergeBorders;
    private updateBlockIndexAfterMerge;
    /**
     * Determines whether merge cell operation can be done.
     */
    canMergeCells(): boolean;
    private canMergeSelectedCellsInTable;
    private checkCellWidth;
    private checkCellWithInSelection;
    private checkPrevOrNextCellIsWithinSel;
    private checkCurrentCell;
    private checkRowSpannedCells;
    /**
     * @private
     */
    insertNewParagraphWidget(newParagraph: ParagraphWidget, insertAfter: boolean): void;
    private insertParagraph;
    private moveInlines;
    /**
     * @private
     */
    moveContent(lineWidget: LineWidget, startOffset: number, endOffset: number, insertIndex: number, paragraph: ParagraphWidget): number;
    private updateRevisionForMovedContent;
    /**
     * update complex changes when history is not preserved
     * @param  {number} action?
     * @param  {string} start?
     * @param  {string} end?
     * @private
     */
    updateComplexWithoutHistory(action?: number, start?: string, end?: string): void;
    /**
     * reLayout
     * @param selection
     * @param isSelectionChanged
     * @private
     */
    reLayout(selection: Selection, isSelectionChanged?: boolean): void;
    /**
     * @private
     */
    updateHeaderFooterWidget(headerFooterWidget?: HeaderFooterWidget): void;
    /**
     * @private
     */
    updateHeaderFooterWidgetToPage(node: HeaderFooterWidget): void;
    /**
     * @private
     */
    updateHeaderFooterWidgetToPageInternal(page: Page, widget: HeaderFooterWidget, isHeader: boolean): void;
    /**
     * @private
     */
    removeFieldInWidget(widget: Widget, isBookmark?: boolean, isContentControl?: boolean): void;
    /**
     * @private
     */
    removeFieldInBlock(block: BlockWidget, isBookmark?: boolean, isContentControl?: boolean): void;
    /**
     * @private
     */
    removeFieldTable(table: TableWidget, isBookmark?: boolean, isContentControl?: boolean): void;
    shiftFootnotePageContent(): void;
    /**
     * @private
     */
    shiftPageContent(type: HeaderFooterType, sectionFormat: WSectionFormat): void;
    /**
     * @private
     */
    checkAndShiftFromBottom(page: Page, footerWidget: HeaderFooterWidget | FootNoteWidget): void;
    /**
     * @private
     */
    allowFormattingInFormFields(property: string): boolean;
    private getContentControl;
    private checkPlainTextContentControl;
    /**
     * Change HighlightColor
     * @param  {HighlightColor} highlightColor
     * Applies character format for selection.
     * @param {string} property
     * @param {Object} value
     * @param {boolean} update
     * @private
     */
    onApplyCharacterFormat(property: string, value: Object, update?: boolean): void;
    /**
     * @private
     */
    applyCharacterFormatForListText(selection: Selection, property: string, values: Object, update: boolean): void;
    private applyListCharacterFormatByValue;
    /**
     * @private
     */
    updateListCharacterFormat(selection: Selection, property: string, value: Object): void;
    private updateListTextSelRange;
    /**
     * @private
     */
    updateInsertPosition(): void;
    /**
     * preserve paragraph and offset value for selection
     * @private
     */
    setOffsetValue(selection: Selection): void;
    /**
     * Toggles the highlight color property of selected contents.
     * @param {HighlightColor} highlightColor Default value of ‘underline’ parameter is Yellow.
     */
    toggleHighlightColor(highlightColor?: HighlightColor): void;
    /**
     * Toggles the subscript formatting of selected contents.
     */
    toggleSubscript(): void;
    /**
     * Toggles the superscript formatting of selected contents.
     */
    toggleSuperscript(): void;
    /**
     * Toggles the text alignment property of selected contents.
     * @param {TextAlignment} textAlignment Default value of ‘textAlignment parameter is TextAlignment.Left.
     */
    /**
     * Increases the left indent of selected paragraphs to a factor of 36 points.
     */
    increaseIndent(): void;
    /**
     * Decreases the left indent of selected paragraphs to a factor of 36 points.
     */
    decreaseIndent(): void;
    /**
     * Clears the list format for selected paragraphs.
     */
    clearList(): void;
    /**
     * Applies the bullet list to selected paragraphs.
     * @param {string} bullet Bullet character
     * @param {string} fontFamily Bullet font family
     */
    applyBullet(bullet: string, fontFamily: string): void;
    /**
     * Applies the numbering list to selected paragraphs.
     * @param numberFormat  “%n” representations in ‘numberFormat’ parameter will be replaced by respective list level’s value.
     * `“%1)” will be displayed as “1)” `
     * @param listLevelPattern  Default value of ‘listLevelPattern’ parameter is ListLevelPattern.Arabic
     */
    applyNumbering(numberFormat: string, listLevelPattern?: ListLevelPattern): void;
    /**
     * Toggles the baseline alignment property of selected contents.
     * @param  {Selection} selection
     * @param  {BaselineAlignment} baseAlignment
     */
    toggleBaselineAlignment(baseAlignment: BaselineAlignment): void;
    /**
     * Clears the formatting.
     */
    clearFormatting(): void;
    /**
     * Toggles the specified property. If property is assigned already. Then property will be changed
     * @param  {Selection} selection
     * @param  {number} type
     * @param  {Object} value
     * @private
     */
    updateProperty(type: number, value: Object): void;
    private getCompleteStyles;
    /**
     * Initialize default styles
     * @private
     */
    intializeDefaultStyles(): void;
    /**
     * Creates a new instance of Style.
     */
    createStyle(styleString: string): void;
    /**
     * Create a Style.
     * @private
     */
    createStyleIn(styleString: string): Object;
    /**
     * @private
     */
    getUniqueStyleName(name: string): string;
    private getUniqueName;
    /**
     * Update Character format for selection
     * @private
     */
    updateSelectionCharacterFormatting(property: string, values: Object, update: boolean): void;
    /**
     * Update character format for selection range
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @returns void
     * @private
     */
    updateCharacterFormat(property: string, value: Object): void;
    private updateCharacterFormatWithUpdate;
    private applyCharFormatSelectedContent;
    private applyCharFormatForSelectedPara;
    private splittedLastParagraph;
    private getNextParagraphForCharacterFormatting;
    private applyCharFormat;
    /**
     * Toggles the bold property of selected contents.
     */
    toggleBold(): void;
    /**
     * Toggles the bold property of selected contents.
     */
    toggleItalic(): void;
    /**
     * Toggle All Caps formatting for the selected content.
     */
    toggleAllCaps(): void;
    private getCurrentSelectionValue;
    /**
     * Toggles the underline property of selected contents.
     * @param underline Default value of ‘underline’ parameter is Single.
     */
    toggleUnderline(underline?: Underline): void;
    /**
     * Toggles the strike through property of selected contents.
     * @param {Strikethrough} strikethrough Default value of strikethrough parameter is SingleStrike.
     */
    toggleStrikethrough(strikethrough?: Strikethrough): void;
    private updateFontSize;
    private applyCharFormatInline;
    private formatInline;
    private applyCharFormatCell;
    private applyCharFormatForSelectedCell;
    private applyCharFormatRow;
    private applyCharFormatForTable;
    private applyCharFormatForSelTable;
    private applyCharFormatForTableCell;
    private updateSelectedCellsInTable;
    private getCharacterFormatValueOfCell;
    /**
     * Apply Character format for selection
     * @private
     */
    applyCharFormatValueInternal(selection: Selection, format: WCharacterFormat, property: string, value: Object): void;
    private copyInlineCharacterFormat;
    private applyCharFormatValue;
    /**
     * @private
     */
    onImageFormat(elementBox: ImageElementBox, width: number, height: number): void;
    /**
     * Toggles the text alignment of selected paragraphs.
     * @param  {TextAlignment} textAlignment
     */
    toggleTextAlignment(textAlignment: TextAlignment): void;
    /**
     * Applies paragraph format for the selection ranges.
     * @param {string} property
     * @param {Object} value
     * @param {boolean} update
     * @param {boolean} isSelectionChanged
     * @private
     */
    onApplyParagraphFormat(property: string, value: Object, update: boolean, isSelectionChanged: boolean): void;
    /**
     * Update the list level
     * @param  {boolean} increaseLevel
     * @private
     */
    updateListLevel(increaseLevel: boolean): void;
    /**
     * Applies list
     * @param  {WList} list
     * @param  {number} listLevelNumber
     * @private
     */
    onApplyListInternal(list: WList, listLevelNumber: number): void;
    /**
     * Apply paragraph format to selection range
     * @private
     */
    updateSelectionParagraphFormatting(property: string, value: Object, update: boolean): void;
    private getIndentIncrementValue;
    private getIndentIncrementValueInternal;
    private updateParagraphFormatInternal;
    /**
     * Update paragraph format on undo
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @param  {boolean} update
     * @private
     */
    updateParagraphFormat(property: string, value: Object, update: boolean): void;
    private applyParaFormatSelectedContent;
    /**
     * Apply Paragraph format
     * @private
     */
    applyParaFormatProperty(paragraph: ParagraphWidget, property: string, value: Object, update: boolean): void;
    private copyParagraphFormat;
    private onListFormatChange;
    private updateListParagraphFormat;
    /**
     * Copies list level paragraph format
     * @param  {WParagraphFormat} oldFormat
     * @param  {WParagraphFormat} newFormat
     * @private
     */
    copyFromListLevelParagraphFormat(oldFormat: WParagraphFormat, newFormat: WParagraphFormat): void;
    /**
     * To apply continue numbering from the previous list
     */
    applyContinueNumbering(): void;
    /**
     * @private
     */
    applyContinueNumberingInternal(selection: Selection): void;
    /**
     * @private
     */
    getContinueNumberingInfo(paragraph: ParagraphWidget): ContinueNumberingInfo;
    /**
     * @private
     */
    revertContinueNumbering(selection: Selection, format: WParagraphFormat): void;
    private changeListId;
    private getParagraphFormat;
    private checkNumberArabic;
    /**
     * @private
     */
    applyRestartNumbering(selection: Selection): void;
    /**
     * @private
     */
    restartListAt(selection: Selection): void;
    /**
     * @private
     */
    restartListAtInternal(selection: Selection, listId: number): void;
    private changeRestartNumbering;
    private applyParaFormat;
    private applyCharacterStyle;
    private applyParaFormatInCell;
    private applyParaFormatCellInternal;
    private getParaFormatValueInCell;
    private applyParagraphFormatRow;
    private applyParaFormatTableCell;
    private applyParaFormatTable;
    private getNextParagraphForFormatting;
    private applyParagraphFormatTableInternal;
    /**
     * Apply section format selection changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    onApplySectionFormat(property: string, value: Object): void;
    /**
     * Update section format
     * @param  {string} property
     * @param  {Object} value
     * @returns TextPosition
     * @private
     */
    updateSectionFormat(property: string, value: Object): void;
    /**
     * Apply table format property changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    onApplyTableFormat(property: string, value: Object): void;
    private getTableFormatAction;
    /**
     * Apply table row format property changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    onApplyTableRowFormat(property: string, value: Object): void;
    private getRowAction;
    /**
     * Apply table cell property changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    onApplyTableCellFormat(property: string, value: Object): void;
    private getTableCellAction;
    private applyPropertyValueForSection;
    /**
     * @private
     */
    layoutWholeDocument(isLayoutChanged?: boolean): void;
    private combineSection;
    private combineSectionChild;
    private updateSelectionTableFormat;
    /**
     * Update Table Format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {object} value
     * @private
     */
    updateTableFormat(selection: Selection, property: string, value: object): void;
    /**
     * update cell format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    updateCellFormat(selection: Selection, property: string, value: Object): void;
    /**
     * update row format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    updateRowFormat(selection: Selection, property: string, value: Object): void;
    private initHistoryPosition;
    private startSelectionReLayouting;
    private reLayoutSelectionOfTable;
    private reLayoutSelection;
    private reLayoutSelectionOfBlock;
    /**
     * @private
     */
    layoutItemBlock(block: BlockWidget, shiftNextWidget: boolean): void;
    /**
     * @private
     */
    removeSelectedContents(selection: Selection): boolean;
    private removeSelectedContentInternal;
    private removeSelectedContent;
    private deleteSelectedContent;
    /**
     * Merge the selected cells.
     */
    mergeCells(): void;
    /**
     * Deletes the entire table at selection.
     */
    deleteTable(): void;
    /**
     * Deletes the selected column(s).
     */
    deleteColumn(): void;
    private onDeleteColumnConfirmed;
    /**
     * Deletes the selected row(s).
     */
    deleteRow(): void;
    /**
     * Method to track row deletion
     * @param row
     */
    private trackRowDeletion;
    private trackInnerTable;
    private returnDeleteRevision;
    private removeRow;
    /**
     * @private
     * @param table
     */
    updateTable(table: TableWidget): void;
    private getParagraphForSelection;
    private deletePara;
    private deleteSection;
    private combineSectionInternal;
    /**
     * @private
     */
    checkAndInsertBlock(block: BlockWidget, start: TextPosition, end: TextPosition, editAction: number, previousParagraph: BlockWidget): ParagraphWidget;
    /**
     * @private
     */
    splitParagraph(paragraphAdv: ParagraphWidget, startLine: LineWidget, startOffset: number, endLine: LineWidget, endOffset: number, removeBlock: boolean): ParagraphWidget;
    /**
     * @private
     */
    removeBlock(block: BlockWidget, isSkipShifting?: boolean): void;
    private toCheckForTrack;
    private removeFootnote;
    private removeEndnote;
    private removeAutoShape;
    /**
     * @private
     */
    removeField(block: BlockWidget, isBookmark?: boolean, isContentControl?: boolean): void;
    /**
     * @private
     */
    addRemovedNodes(node: IWidget): void;
    private deleteBlock;
    private deleteTableCell;
    private deleteCellsInTable;
    /**
     * @private
     */
    removeDeletedCellRevision(row: TableRowWidget): any;
    /**
     * Method to handle table cells deletion
     * @param table
     * @param selection
     * @param startRowIndex
     * @param endRowIndex
     * @param startColumnIndex
     * @param endColumnIndex
     * @param isDeleteCells
     * @param editAction
     * @param isRowSelected
     * @param action
     */
    private onConfirmedTableCellsDeletion;
    /**
     * Method to handle cell deletion on confirmation
     * @param row
     * @param selection
     * @param startRowIndex
     * @param endRowIndex
     * @param startColumnIndex
     * @param endColumnIndex
     * @param isDeleteCells
     * @param editAction
     */
    private onConfirmedCellDeletion;
    /**
     * @private
     */
    removeRevisionForRow(rowWidget: TableRowWidget): any;
    /**
     * @private
     */
    removeRevisionsInRow(rowWidget: TableRowWidget): any;
    /**
     * @private
     */
    removeRevisionForCell(cellWidget: TableCellWidget, removeCollection: boolean): any;
    private removeRevisionForInnerTable;
    /**
     * @private
     */
    removeRevisionForBlock(paraWidget: ParagraphWidget, revision: Revision, skipParaMark: boolean, addToRevisionInfo: boolean): any;
    private unlinkRangeByRevision;
    private isWholeRowSelected;
    private deleteCell;
    private deleteContainer;
    private deleteTableBlock;
    private splitTable;
    private updateEditPosition;
    /**
     * @private
     */
    deleteContent(table: TableWidget, selection: Selection, editAction: number): void;
    private setActionInternal;
    private checkClearCells;
    private isEndInAdjacentTable;
    /**
     * @private
     * @param table
     */
    cloneTableToHistoryInfo(table: TableWidget): TableWidget;
    private insertParagraphPaste;
    private removeInlines;
    private skipTracking;
    private canHandleDeletion;
    /**
     * @private
     */
    removeContent(lineWidget: LineWidget, startOffset: number, endOffset: number): void;
    /**
     * @private
     * Method to clear linked ranges in revision
     */
    clearFieldElementRevisions(inline: ElementBox, revision: Revision[]): void;
    /**
     * @private
     * @param currentElement
     * @param spittedElement
     */
    addRemovedRevisionInfo(currentElement: any, spittedElement: ElementBox, removePrevRevisions?: boolean): void;
    /**
     * @private
     */
    removeEmptyLine(paragraph: ParagraphWidget): void;
    /**
     * clone the list level
     * @param  {WListLevel} source
     * @private
     */
    cloneListLevel(source: WListLevel): WListLevel;
    /**
     * Copies the list level
     * @param  {WListLevel} destination
     * @param  {WListLevel} listLevel
     * @private
     */
    copyListLevel(destination: WListLevel, listLevel: WListLevel): void;
    /**
     * Clone level override
     * @param  {WLevelOverride} source
     * @private
     */
    cloneLevelOverride(source: WLevelOverride): WLevelOverride;
    /**
     * Update List Paragraph
     * @private
     */
    updateListParagraphs(): void;
    /**
     * @private
     */
    updateListParagraphsInBlock(block: BlockWidget): void;
    /**
     * Applies list format
     * @param  {WList} list
     * @private
     */
    onApplyList(list: WList): void;
    /**
     * Applies bullets or numbering list
     * @param  {string} format
     * @param  {ListLevelPattern} listLevelPattern
     * @param  {string} fontFamily
     * @private
     */
    applyBulletOrNumbering(format: string, listLevelPattern: ListLevelPattern, fontFamily: string): void;
    private addListLevels;
    /**
     * Insert page break at cursor position
     */
    insertPageBreak(): void;
    /**
     * @private
     */
    onEnter(isInsertPageBreak?: boolean): void;
    private splitParagraphInternal;
    /**
     * Method to insert revision for para marks
     * @param paragraph
     * @param firstChild
     */
    private insertParaRevision;
    private applyRevisionForParaMark;
    private checkParaMarkMatchedWithElement;
    private checkToMatchEmptyParaMark;
    /**
     * @private
     */
    updateNextBlocksIndex(block: BlockWidget, increaseIndex: boolean): void;
    private updateIndex;
    /**
     * @private
     */
    updateEndPosition(): void;
    /**
     * @private
     */
    onBackSpace(): void;
    /**
     * @private
     */
    insertRemoveBookMarkElements(): boolean;
    /**
     * @private
     */
    deleteSelectedContents(selection: Selection, isBackSpace: boolean): boolean;
    private removeWholeElement;
    /**
     * @private
     */
    singleBackspace(selection: Selection, isRedoing: boolean): void;
    private setPositionForHistory;
    private removeAtOffset;
    private removeCharacter;
    private removeCharacterInLine;
    private removeRevisionsInformation;
    private handleDeleteTracking;
    private toCombineOrInsertRevision;
    /**
     * @private
     * @param elementBox
     */
    updateLastElementRevision(elementBox: ElementBox): void;
    /**
     * Method to upate previous history end revision index on deletion
     */
    private updateEndRevisionIndex;
    private retrieveRevisionInOder;
    /**
     * Handles deletion for element already has insert revision
     * @param elementToEnsure
     * @param currentElement
     * @param spittedSpan
     * @param endOffset
     * @param indexInInline
     */
    private handleDeletionForInsertRevision;
    private handleDeleteBySplitting;
    /**
     * Update cursor position for inserting text
     */
    private updateCursorForInsertRevision;
    private checkToCombineRevisionsInSides;
    /**
     * Remove the current selected content or one character right of cursor.
     */
    delete(): void;
    private deleteEditElement;
    /**
     * Remove single character on right of cursor position
     * @param  {Selection} selection
     * @param  {boolean} isRedoing
     * @private
     */
    singleDelete(selection: Selection, isRedoing: boolean): void;
    private singleDeleteInternal;
    /**
     * @private
     */
    deleteParagraphMark(paragraph: ParagraphWidget, selection: Selection, editAction: number, handleParaMark?: boolean): void;
    private handleDeleteParaMark;
    private insertDeleteParaMarkRevision;
    /**
     * Method to retrieve delete revision
     * @param item
     */
    private retrieveRevisionByType;
    private combineRevisionOnDeleteParaMark;
    private updateEditPositionOnMerge;
    private checkEndPosition;
    private checkInsertPosition;
    private checkIsNotRedoing;
    private deleteSelectedContentInternal;
    /**
     * Init EditorHistory
     * @private
     */
    initHistory(action: Action): void;
    /**
     * Init Complex EditorHistory
     * @private
     */
    initComplexHistory(action: Action): void;
    /**
     * Insert image
     * @param  {string} base64String
     * @param  {number} width
     * @param  {number} height
     * @private
     */
    insertPicture(base64String: string, width: number, height: number): void;
    private insertPictureInternal;
    private fitImageToPage;
    /**
     * @private
     */
    insertInlineInSelection(selection: Selection, elementBox: ElementBox): void;
    /**
     * @private
     */
    onPortrait(): void;
    /**
     * @private
     */
    onLandscape(): void;
    private copyValues;
    /**
     * @private
     */
    changeMarginValue(property: string): void;
    /**
     * @private
     */
    onPaperSize(property: string): void;
    /**
     * @private
     */
    updateListItemsTillEnd(blockAdv: BlockWidget, updateNextBlockList: boolean): void;
    /**
     * @private
     */
    updateWholeListItems(block: BlockWidget): void;
    private updateListItems;
    private updateListItemsForTable;
    private updateListItemsForRow;
    private updateListItemsForCell;
    /**
     * @private
     */
    updateRenderedListItems(block: BlockWidget): void;
    private updateRenderedListItemsForTable;
    private updateRenderedListItemsForRow;
    private updateRenderedListItemsForCell;
    private updateListItemsForPara;
    private updateRenderedListItemsForPara;
    private updateListNumber;
    /**
     * Get offset value to update in selection
     * @private
     */
    getOffsetValue(selection: Selection): void;
    /**
     * @private
     */
    setPositionParagraph(paragraph: ParagraphWidget, offset: number, skipSelectionChange: boolean): void;
    /**
     * @private
     */
    setPositionForCurrentIndex(textPosition: TextPosition, editPosition: string): void;
    /**
     * @private
     */
    insertPageNumber(numberFormat?: string): void;
    /**
     * @private
     */
    insertPageCount(numberFormat?: string): void;
    private createFields;
    /**
     * Insert Bookmark at current selection range
     * @param  {string} name - Name of bookmark
     */
    insertBookmark(name: string): void;
    /**
     * Deletes specific bookmark
     * @param  {string} name - Name of bookmark
     */
    deleteBookmark(bookmarkName: string): void;
    /**
     * @private
     */
    deleteBookmarkInternal(bookmark: BookmarkElementBox): void;
    /**
     * @private
     */
    getSelectionInfo(): SelectionInfo;
    /**
     * @private
     */
    insertElements(endElements: ElementBox[], startElements?: ElementBox[]): void;
    /**
     * @private
     */
    insertElementsInternal(position: TextPosition, elements: ElementBox[], isRelayout?: boolean): void;
    /**
     * @private
     */
    getCommentElementBox(index: string): CommentElementBox;
    /**
     * @private
     */
    getBlock(position: IndexInfo): BlockInfo;
    /**
     * Return Block relative to position
     * @private
     */
    getBlockInternal(widget: Widget, position: IndexInfo): BlockInfo;
    /**
     * @private
     */
    updateHistoryPosition(position: TextPosition | string, isInsertPosition: boolean): void;
    /**
     * Applies the borders based on given settings.
     * @param {BorderSettings} settings
     */
    applyBorders(settings: BorderSettings): void;
    private applyAllBorders;
    private applyInsideBorders;
    /**
     * @private
     */
    getTopBorderCellsOnSelection(): TableCellWidget[];
    /**
     * @private
     */
    getLeftBorderCellsOnSelection(): TableCellWidget[];
    /**
     * @private
     */
    getRightBorderCellsOnSelection(): TableCellWidget[];
    /**
     * @private
     */
    getBottomBorderCellsOnSelection(): TableCellWidget[];
    /**
     * @private
     */
    clearAllBorderValues(borders: WBorders): void;
    private clearBorder;
    /**
     * @private
     */
    getAdjacentCellToApplyBottomBorder(): TableCellWidget[];
    private getAdjacentBottomBorderOnEmptyCells;
    /**
     * @private
     */
    getAdjacentCellToApplyRightBorder(): TableCellWidget[];
    private getSelectedCellsNextWidgets;
    /**
     * @private
     */
    getBorder(borderColor: string, lineWidth: number, borderStyle: LineStyle): WBorder;
    /**
     * Applies borders
     * @param  {WBorders} sourceBorders
     * @param  {WBorders} applyBorders
     * @private
     */
    applyBordersInternal(sourceBorders: WBorders, applyBorders: WBorders): void;
    /**
     * Apply shading to table
     * @param  {WShading} sourceShading
     * @param  {WShading} applyShading
     * @private
     */
    applyShading(sourceShading: WShading, applyShading: WShading): void;
    private applyBorder;
    /**
     * Apply Table Format changes
     * @param  {Selection} selection
     * @param  {WTableFormat} format
     * @private
     */
    onTableFormat(format: WTableFormat, isShading?: boolean): void;
    /**
     * @private
     */
    applyTableFormat(table: TableWidget, property: string, value: object): void;
    private applyTablePropertyValue;
    private handleTableFormat;
    private updateGridForTableDialog;
    /**
     * Applies Row Format Changes
     * @param  {Selection} selection
     * @param  {WRowFormat} format
     * @param  {WRow} row
     * @private
     */
    onRowFormat(format: WRowFormat): void;
    private applyRowFormat;
    private applyRowPropertyValue;
    private handleRowFormat;
    /**
     * Applies Cell Format changes
     * @param  {Selection} selection
     * @param  {WCellFormat} format
     * @param  {WCell} cell
     * @private
     */
    onCellFormat(format: WCellFormat): void;
    /**
     * @private
     */
    updateCellMargins(selection: Selection, value: WCellFormat): void;
    /**
     * @private
     */
    updateFormatForCell(selection: Selection, property: string, value: Object): void;
    /**
     * @private
     */
    getSelectedCellInColumn(table: TableWidget, rowStartIndex: number, columnIndex: number, rowEndIndex: number): TableCellWidget[];
    private getColumnCells;
    /**
     * @private
     */
    getTableWidth(table: TableWidget): number;
    private applyCellPropertyValue;
    private handleCellFormat;
    /**
     * @private
     */
    destroy(): void;
    private isTocField;
    /**
     * Updates the table of contents.
     * @private
     */
    updateToc(tocField?: FieldElementBox): void;
    private getTocSettings;
    private decodeTSwitch;
    /**
     * Inserts, modifies or updates the table of contents based on given settings.
     * @param {TableOfContentsSettings} tableOfContentsSettings
     */
    insertTableOfContents(tableOfContentsSettings?: TableOfContentsSettings): void;
    private appendEmptyPara;
    private constructTocFieldCode;
    private constructTSwitch;
    /**
     * Appends the end filed to the given line.
     */
    private appendEndField;
    private validateTocSettings;
    /**
     * Builds the TOC
     * @private
     */
    buildToc(tocSettings: TableOfContentsSettings, fieldCode: string, isFirstPara: boolean, isStartParagraph?: boolean): ParagraphWidget[];
    private createOutlineLevels;
    /**
     * Creates TOC heading styles
     * @param start - lower heading level
     * @param end - higher heading level
     */
    private createHeadingLevels;
    /**
     * Checks the current style is heading style.
     */
    private isHeadingStyle;
    private isOutlineLevelStyle;
    /**
     * Creates TOC field element.
     */
    private createTocFieldElement;
    /**
     * Updates TOC para
     */
    private createTOCWidgets;
    /**
     * Inserts toc hyperlink.
     */
    private insertTocHyperlink;
    /**
     * Inserts toc page number.
     */
    private insertTocPageNumber;
    private updatePageRef;
    /**
     * Inserts toc bookmark.
     */
    private insertTocBookmark;
    /**
     * Generates bookmark id.
     */
    private generateBookmarkName;
    /**
     * Change cell content alignment
     * @private
     */
    onCellContentAlignment(verticalAlignment: CellVerticalAlignment, textAlignment: TextAlignment): void;
    /**
     * @private
     */
    insertEditRangeElement(user: string): void;
    /**
     * @private
     */
    private insertEditRangeInsideTable;
    /**
     * @private
     */
    addRestrictEditingForSelectedArea(user: string): void;
    /**
     * @private
     */
    addEditElement(user: string): EditRangeStartElementBox;
    /**
     * @private
     */
    protect(protectionType: ProtectionType): void;
    /**
     * @private
     */
    addEditCollectionToDocument(): void;
    /**
     * @private
     */
    updateRangeCollection(editStart: EditRangeStartElementBox, user: string): void;
    /**
     * @private
     */
    removeUserRestrictions(user: string): void;
    /**
     * @private
     */
    removeUserRestrictionsInternal(editStart: EditRangeStartElementBox, currentUser?: string): void;
    /**
     * @private
     */
    removeAllEditRestrictions(): void;
    /**
     * Insert specified form field at current selection.
     * @param type Form field type
     */
    insertFormField(type: FormFieldType): void;
    private insertFormFieldInternal;
    private getFormFieldData;
    /**
     * @private
     */
    setFormField(field: FieldElementBox, info: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void;
    /**
     * @private
     */
    editFormField(type: FormFieldType, formData: FormField): boolean;
    private getDefaultText;
    private getFormFieldCode;
    /**
     * @private
     */
    toggleCheckBoxFormField(field: FieldElementBox, reset?: boolean, value?: boolean): void;
    /**
     * @private
     */
    updateFormField(field: FieldElementBox, value: string | number, reset?: boolean): void;
    /**
     * @private
     */
    updateFormFieldInternal(field: FieldElementBox, formFieldData: FormField, value: string | number, reset?: boolean): void;
    private updateFormFieldResult;
    /**
     * @private
     */
    private checkBookmarkAvailability;
    /**
     * @private
     */
    private getBookmarkName;
    /**
     * @private
     */
    applyFormTextFormat(formField: FieldElementBox): void;
    private insertSpaceInFormField;
    /**
     * @private
     */
    getFormFieldText(formField?: FieldElementBox): string;
    private getNextRenderedWidgetText;
    /**
     * @private
     */
    applyTextFormatInternal(field: FieldElementBox, text: string): void;
    private constructCommentInitial;
    /**
     * Insert Footnote at current selection
     */
    insertFootnote(): void;
    private updateFootnoteCollection;
    /**
     * Insert Endnote at current selection
     */
    insertEndnote(): void;
    private updateEndnoteCollection;
    private separator;
    private continuationSeparator;
}
/**
 * @private
 */
export interface SelectionInfo {
    start: string;
    end: string;
}
/**
 * @private
 */
export interface ContinueNumberingInfo {
    currentList: WList;
    listLevelNumber: number;
    listPattern: ListLevelPattern;
}
/**
 * Specifies the settings for border.
 */
export interface BorderSettings {
    /**
     * Specifies the border type.
     */
    type: BorderType;
    /**
     * Specifies the border color.
     */
    borderColor?: string;
    /**
     * Specifies the line width.
     */
    lineWidth?: number;
    /**
     * Specifies the border style.
     */
    borderStyle?: LineStyle;
}
/**
 * @private
 */
export interface TocLevelSettings {
    [key: string]: number;
}
/**
 * @private
 */
export interface PageRefFields {
    [key: string]: FieldTextElementBox;
}
/**
 * Specifies the settings for table of contents.
 */
export interface TableOfContentsSettings {
    /**
     * Specifies the start level.
     */
    startLevel?: number;
    /**
     * Specifies the end level.
     */
    endLevel?: number;
    /**
     * Specifies whether hyperlink can be included.
     */
    includeHyperlink?: boolean;
    /**
     * Specifies whether page number can be included.
     */
    includePageNumber?: boolean;
    /**
     * Specifies whether the page number can be right aligned.
     */
    rightAlign?: boolean;
    /**
     * Specifies the tab leader.
     */
    tabLeader?: TabLeader;
    /**
     * @private
     */
    levelSettings?: TocLevelSettings;
    /**
     * Specifies whether outline levels can be included.
     */
    includeOutlineLevels?: boolean;
}
/**
 * Defines the character format properties of document editor
 */
export interface CharacterFormatProperties {
    /**
     * Defines the bold formatting
     */
    bold?: boolean;
    /**
     * Defines the italic formatting
     */
    italic?: boolean;
    /**
     * Defines the font size
     */
    fontSize?: number;
    /**
     * Defines the font family
     */
    fontFamily?: string;
    /**
     * Defines the underline property
     */
    underline?: Underline;
    /**
     * Defines the strikethrough
     */
    strikethrough?: Strikethrough;
    /**
     * Defines the subscript or superscript property
     */
    baselineAlignment?: BaselineAlignment;
    /**
     * Defines the highlight color
     */
    highlightColor?: HighlightColor;
    /**
     * Defines the font color
     */
    fontColor?: string;
    /**
     * Defines the bidirectional property
     */
    bidi?: boolean;
    /**
     * Defines the allCaps formatting
     */
    allCaps?: boolean;
}
/**
 * Defines the paragraph format properties of document editor
 */
export interface ParagraphFormatProperties {
    /**
     * Defines the left indent
     */
    leftIndent?: number;
    /**
     * Defines the right indent
     */
    rightIndent?: number;
    /**
     * Defines the first line indent
     */
    firstLineIndent?: number;
    /**
     * Defines the text alignment property
     */
    textAlignment?: TextAlignment;
    /**
     * Defines the spacing value after the paragraph
     */
    afterSpacing?: number;
    /**
     * Defines the spacing value before the paragraph
     */
    beforeSpacing?: number;
    /**
     * Defines the spacing between the lines
     */
    lineSpacing?: number;
    /**
     * Defines the spacing type(AtLeast,Exactly or Multiple) between the lines
     */
    lineSpacingType?: LineSpacingType;
    /**
     * Defines the bidirectional property of paragraph
     */
    bidi?: boolean;
}
/**
 * Defines the section format properties of document editor
 */
export interface SectionFormatProperties {
    /**
     * Defines the header distance.
     */
    headerDistance?: number;
    /**
     * Defines the footer distance.
     */
    footerDistance?: number;
    /**
     * Defines the page width.
     */
    pageWidth?: number;
    /**
     * Defines the page height.
     */
    pageHeight?: number;
    /**
     * Defines the left margin of the page.
     */
    leftMargin?: number;
    /**
     * Defines the top margin of the page.
     */
    topMargin?: number;
    /**
     * Defines the bottom margin of the page.
     */
    bottomMargin?: number;
    /**
     * Defines the right margin of the page.
     */
    rightMargin?: number;
}
