import { Selection } from './selection';
import { TextAlignment, Underline, HighlightColor, BaselineAlignment, WidthType, Strikethrough, LineSpacingType, CellVerticalAlignment, HeightType, TableAlignment, FootEndNoteNumberFormat, FootnoteRestartIndex } from '../../base/types';
import { WSectionFormat, WCharacterFormat, WParagraphFormat, WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { DocumentHelper } from '../index';
import { TableWidget, ImageElementBox } from '../viewer/page';
import { WList } from '../list/list';
/**
 * Selection character format implementation
 */
export declare class SelectionCharacterFormat {
    /**
     * @private
     */
    selection: Selection;
    private boldIn;
    private italicIn;
    private underlineIn;
    private strikeThroughIn;
    private baselineAlignmentIn;
    private highlightColorIn;
    private fontSizeIn;
    private fontFamilyIn;
    private fontColorIn;
    private allCapsIn;
    /**
     * @private
     */
    boldBidi: boolean;
    /**
     * @private
     */
    italicBidi: boolean;
    /**
     * @private
     */
    fontSizeBidi: number;
    /**
     * @private
     */
    fontFamilyBidi: string;
    /**
     * @private
     */
    bidi: boolean;
    /**
     * @private
     */
    private bdo;
    /**
     * @private
     */
    styleName: string;
    /**
     * Gets the font size of selected contents.
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the font size of selected contents.
    * @aspType int
    * @blazorType int
    */
    fontSize: number;
    /**
     * Gets or sets the font family of selected contents.
     * @aspType string
     * @blazorType string
     */
    /**
    * Sets the font family of selected contents.
    * @aspType string
    * @blazorType string
    */
    fontFamily: string;
    /**
     * Gets or sets the font color of selected contents.
     * @aspType string
     * @blazorType string
     */
    /**
    * Sets the font color of selected contents.
    * @aspType string
    * @blazorType string
    */
    fontColor: string;
    /**
     * Gets or sets the bold formatting of selected contents.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets the bold formatting of selected contents.
    * @aspType bool
    * @blazorType bool
    */
    bold: boolean;
    /**
     * Gets or sets the italic formatting of selected contents.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets the italic formatting of selected contents.
    * @aspType bool
    * @blazorType bool
    */
    italic: boolean;
    /**
     * Gets or sets the strikethrough property of selected contents.
     */
    /**
    * Sets the strikethrough property of selected contents.
    */
    strikethrough: Strikethrough;
    /**
     * Gets or sets the baseline alignment property of selected contents.
     */
    /**
    * Sets the baseline alignment property of selected contents.
    */
    baselineAlignment: BaselineAlignment;
    /**
     * Gets or sets the underline style of selected contents.
     */
    /**
    * Sets the underline style of selected contents.
    */
    underline: Underline;
    /**
     * Gets or sets the highlight color of selected contents.
     */
    /**
    * Sets the highlight color of selected contents.
    */
    highlightColor: HighlightColor;
    /**
     * Gets or sets the allCaps formatting of selected contents.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets the allCaps formatting of selected contents.
    * @aspType bool
    * @blazorType bool
    */
    allCaps: boolean;
    /**
     * @private
     */
    constructor(selection: Selection);
    private getPropertyValue;
    /**
     * Notifies whenever property gets changed.
     * @param  {string} propertyName
     */
    private notifyPropertyChanged;
    /**
     * Copies the source format.
     * @param  {WCharacterFormat} format
     * @returns void
     * @private
     */
    copyFormat(format: WCharacterFormat): void;
    /**
     * Combines the format.
     * @param  {WCharacterFormat} format
     * @private
     */
    combineFormat(format: WCharacterFormat): void;
    /**
     * Clones the format.
     * @param  {SelectionCharacterFormat} selectionCharacterFormat
     * @returns void
     * @private
     */
    cloneFormat(selectionCharacterFormat: SelectionCharacterFormat): void;
    /**
     * Checks whether current format is equal to the source format or not.
     * @param  {SelectionCharacterFormat} format
     * @returns boolean
     * @private
     */
    isEqualFormat(format: SelectionCharacterFormat): boolean;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Destroys the maintained resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection paragraph format implementation
 */
export declare class SelectionParagraphFormat {
    private selection;
    private leftIndentIn;
    private rightIndentIn;
    private beforeSpacingIn;
    private afterSpacingIn;
    private textAlignmentIn;
    private firstLineIndentIn;
    private lineSpacingIn;
    private lineSpacingTypeIn;
    private bidiIn;
    private contextualSpacingIn;
    /**
     * @private
     */
    listId: number;
    private listLevelNumberIn;
    private documentHelper;
    /**
     * @private
     */
    styleName: string;
    /**
     * Gets or Sets the left indent for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the left indent for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    leftIndent: number;
    /**
     * Gets or Sets the right indent for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the right indent for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    rightIndent: number;
    /**
     * Gets or Sets the first line indent for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the first line indent for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    firstLineIndent: number;
    /**
     * Gets or Sets the text alignment for selected paragraphs.
     * @default undefined
     */
    /**
    * Sets the text alignment for selected paragraphs.
    * @default undefined
    */
    textAlignment: TextAlignment;
    /**
     * Sets the after spacing for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the after spacing for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    afterSpacing: number;
    /**
     * Gets or Sets the before spacing for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the before spacing for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    beforeSpacing: number;
    /**
     * Gets or Sets the line spacing for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the line spacing for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    lineSpacing: number;
    /**
     * Gets or Sets the line spacing type for selected paragraphs.
     * @default undefined
     */
    /**
    * Gets or Sets the line spacing type for selected paragraphs.
    * @default undefined
    */
    lineSpacingType: LineSpacingType;
    /**
     * Sets the list level number for selected paragraphs.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the list level number for selected paragraphs.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    listLevelNumber: number;
    /**
     * Gets or Sets the bidirectional property for selected paragraphs
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets the bidirectional property for selected paragraphs
    * @aspType bool
    * @blazorType bool
    */
    bidi: boolean;
    /**
     * Gets or sets a value indicating whether to add space between the paragraphs of same style.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets a value indicating whether to add space between the paragraphs of same style.
    * @aspType bool
    * @blazorType bool
    */
    contextualSpacing: boolean;
    private validateLineSpacing;
    /**
     * Gets the list text for selected paragraphs.
     * @aspType string
     * @blazorType string
     */
    readonly listText: string;
    /**
     * @private
     */
    constructor(selection: Selection, documentHelper: DocumentHelper);
    private getPropertyValue;
    /**
     * Notifies whenever the property gets changed.
     * @param  {string} propertyName
     */
    private notifyPropertyChanged;
    /**
     * Copies the format.
     * @param  {WParagraphFormat} format
     * @returns void
     * @private
     */
    copyFormat(format: WParagraphFormat): void;
    /**
     * Copies to format.
     * @param  {WParagraphFormat} format
     * @private
     */
    copyToFormat(format: WParagraphFormat): void;
    /**
     * Combines the format.
     * @param  {WParagraphFormat} format
     * @private
     */
    combineFormat(format: WParagraphFormat): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Gets the clone of list at current selection.
     * @returns WList
     * @private
     */
    getList(): WList;
    /**
     * Modifies the list at current selection.
     * @param  {WList} listAdv
     * @private
     */
    setList(listAdv: WList): void;
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection section format implementation
 */
export declare class SelectionSectionFormat {
    private selection;
    private differentFirstPageIn;
    private differentOddAndEvenPagesIn;
    private headerDistanceIn;
    private footerDistanceIn;
    private pageHeightIn;
    private pageWidthIn;
    private leftMarginIn;
    private topMarginIn;
    private rightMarginIn;
    private bottomMarginIn;
    private restartPageNumberingIn;
    private pageStartingNumberIn;
    private endnoteNumberFormatIn;
    private footNoteNumberFormatIn;
    private restartIndexForFootnotesIn;
    private restartIndexForEndnotesIn;
    private initialFootNoteNumberIn;
    private initialEndNoteNumberIn;
    /**
     * private
     */
    bidi: boolean;
    /**
     * Gets or sets the page height.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page height.
    * @aspType int
    * @blazorType int
    */
    pageHeight: number;
    /**
     * Gets or sets the page width.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page width.
    * @aspType int
    * @blazorType int
    */
    pageWidth: number;
    /**
     * Gets or sets the page left margin.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page left margin.
    * @aspType int
    * @blazorType int
    */
    leftMargin: number;
    /**
     * Gets or sets the page bottom margin.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page bottom margin.
    * @aspType int
    * @blazorType int
    */
    bottomMargin: number;
    /**
     * Gets or sets the page top margin.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page top margin.
    * @aspType int
    * @blazorType int
    */
    topMargin: number;
    /**
     * Gets or sets the page right margin.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the page right margin.
    * @aspType int
    * @blazorType int
    */
    rightMargin: number;
    /**
     * Gets or sets the header distance.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the header distance.
    * @aspType int
    * @blazorType int
    */
    headerDistance: number;
    /**
     * Gets or sets the starting page number.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the starting page number.
    * @aspType int
    * @blazorType int
    */
    pageStartingNumber: number;
    /**
     * Gets or sets a value indicating whether to restart page numbering.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or sets a value indicating whether to restart page numbering.
    * @aspType bool
    * @blazorType bool
    */
    restartPageNumbering: boolean;
    /**
     * Gets or sets the footer distance.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or sets the footer distance.
    * @aspType int
    * @blazorType int
    */
    footerDistance: number;
    /**
     * Gets or sets a value indicating whether the section has different first page.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or sets a value indicating whether the section has different first page.
    * @aspType bool
    * @blazorType bool
    */
    differentFirstPage: boolean;
    /**
     * Gets or sets a value indicating whether the section has different odd and even page.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or sets a value indicating whether the section has different odd and even page.
    * @aspType bool
    * @blazorType bool
    */
    differentOddAndEvenPages: boolean;
    /**
     * Gets or sets the number format of endnote.
     */
    /**
    * Gets or sets the number format of endnote.
    */
    endnoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * Gets or sets the number format of footnote.
     */
    /**
    * Gets or sets the number format of footnote.
    */
    footNoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * Gets or sets the number format of footnote.
     */
    /**
    * Gets or sets the number format of footnote.
    */
    initialFootNoteNumber: number;
    /**
     * Gets or sets the number format of footnote.
     */
    /**
    * Gets or sets the number format of footnote.
    */
    initialEndNoteNumber: number;
    /**
     * Gets or sets the restart index of footnote
     */
    /**
    * Gets or sets the restart index of footnote
    */
    restartIndexForFootnotes: FootnoteRestartIndex;
    /**
     * Gets or sets the restart index of endnote
     */
    /**
    * Gets or sets the restart index of endnote
    */
    restartIndexForEndnotes: FootnoteRestartIndex;
    /**
     * @private
     */
    constructor(selection: Selection);
    /**
     * Copies the format.
     * @param  {WSectionFormat} format
     * @returns void
     * @private
     */
    copyFormat(format: WSectionFormat): void;
    private notifyPropertyChanged;
    private getPropertyvalue;
    /**
     * Combines the format.
     * @param  {WSectionFormat} format
     * @private
     */
    combineFormat(format: WSectionFormat): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection table format implementation
 */
export declare class SelectionTableFormat {
    private selection;
    private tableIn;
    private leftIndentIn;
    private backgroundIn;
    private tableAlignmentIn;
    private cellSpacingIn;
    private leftMarginIn;
    private rightMarginIn;
    private topMarginIn;
    private bottomMarginIn;
    private preferredWidthIn;
    private preferredWidthTypeIn;
    private bidiIn;
    /**
     * Gets or sets the table.
     * @private
     */
    table: TableWidget;
    /**
     * Gets or Sets the left indent for selected table.
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the left indent for selected table.
    * @aspType int
    * @blazorType int
    */
    leftIndent: number;
    /**
     * Gets or Sets the default top margin of cell for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the default top margin of cell for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    topMargin: number;
    /**
     * Gets or Sets the background for selected table.
     * @default undefined
     * @aspType string
     * @blazorType string
     */
    /**
    * Gets or Sets the background for selected table.
    * @default undefined
    * @aspType string
    * @blazorType string
    */
    background: string;
    /**
     * Gets or Sets the table alignment for selected table.
     * @default undefined
     */
    /**
    * Gets or Sets the table alignment for selected table.
    * @default undefined
    */
    tableAlignment: TableAlignment;
    /**
     * Gets or Sets the default left margin of cell for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the default left margin of cell for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    leftMargin: number;
    /**
     * Gets or Sets the default bottom margin of cell for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the default bottom margin of cell for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    bottomMargin: number;
    /**
     * Gets or Sets the cell spacing for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the cell spacing for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    cellSpacing: number;
    /**
     * Gets or Sets the default right margin of cell for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the default right margin of cell for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    rightMargin: number;
    /**
     * Gets or Sets the preferred width for selected table.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the preferred width for selected table.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    preferredWidth: number;
    /**
     * Gets or Sets the preferred width type for selected table.
     * @default undefined
     */
    /**
    * Gets or Sets the preferred width type for selected table.
    * @default undefined
    */
    preferredWidthType: WidthType;
    /**
     * Gets or sets the bidi property
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or sets the bidi property
    * @aspType bool
    * @blazorType bool
    */
    bidi: boolean;
    /**
     * @private
     */
    constructor(selection: Selection);
    private getPropertyValue;
    private notifyPropertyChanged;
    /**
     * Copies the format.
     * @param  {WTableFormat} format Format to copy.
     * @returns void
     * @private
     */
    copyFormat(format: WTableFormat): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection cell format implementation
 */
export declare class SelectionCellFormat {
    private selection;
    private verticalAlignmentIn;
    private leftMarginIn;
    private rightMarginIn;
    private topMarginIn;
    private bottomMarginIn;
    private backgroundIn;
    private preferredWidthIn;
    private preferredWidthTypeIn;
    /**
     * Gets or sets the vertical alignment of the selected cells.
     * @default undefined
     */
    /**
    * Gets or sets the vertical alignment of the selected cells.
    * @default undefined
    */
    verticalAlignment: CellVerticalAlignment;
    /**
     * Gets or Sets the left margin for selected cells.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the left margin for selected cells.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    leftMargin: number;
    /**
     * Gets or Sets the right margin for selected cells.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the right margin for selected cells.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    rightMargin: number;
    /**
     * Gets or Sets the top margin for selected cells.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the top margin for selected cells.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    topMargin: number;
    /**
     * Gets or Sets the bottom margin for selected cells.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the bottom margin for selected cells.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    bottomMargin: number;
    /**
     * Gets or Sets the background for selected cells.
     * @default undefined
     * @aspType string
     * @blazorType string
     */
    /**
    * Gets or Sets the background for selected cells.
    * @default undefined
    * @aspType string
    * @blazorType string
    */
    /* tslint:enable */
    background: string;
    /**
     * Gets or Sets the preferred width type for selected cells.
     * @default undefined
     */
    /**
    * Gets or Sets the preferred width type for selected cells.
    * @default undefined
    */
    preferredWidthType: WidthType;
    /**
     * Gets or Sets the preferred width  for selected cells.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the preferred width  for selected cells.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    preferredWidth: number;
    /**
     * @private
     */
    constructor(selection: Selection);
    private notifyPropertyChanged;
    private getPropertyValue;
    /**
     * Copies the format.
     * @param  {WCellFormat} format Source Format to copy.
     * @returns void
     * @private
     */
    copyFormat(format: WCellFormat): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearCellFormat(): void;
    /**
     * Combines the format.
     * @param  {WCellFormat} format
     * @private
     */
    combineFormat(format: WCellFormat): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Destroys the manages resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection row format implementation
 */
export declare class SelectionRowFormat {
    private selection;
    private heightIn;
    private heightTypeIn;
    private isHeaderIn;
    private allowRowBreakAcrossPagesIn;
    /**
     * Gets or Sets the height for selected rows.
     * @default undefined
     * @aspType int
     * @blazorType int
     */
    /**
    * Gets or Sets the height for selected rows.
    * @default undefined
    * @aspType int
    * @blazorType int
    */
    height: number;
    /**
     * Gets or Sets the height type for selected rows.
     * @default undefined
     */
    /**
    * Gets or Sets the height type for selected rows.
    * @default undefined
    */
    heightType: HeightType;
    /**
     * Gets or Sets a value indicating whether the selected rows are header rows or not.
     * @default undefined
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or Sets a value indicating whether the selected rows are header rows or not.
    * @default undefined
    * @aspType bool
    * @blazorType bool
    */
    isHeader: boolean;
    /**
     * Gets or Sets a value indicating whether to allow break across pages for selected rows.
     * @default undefined
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Gets or Sets a value indicating whether to allow break across pages for selected rows.
    * @default undefined
    * @aspType bool
    * @blazorType bool
    */
    allowBreakAcrossPages: boolean;
    /**
     * @private
     */
    constructor(selection: Selection);
    private notifyPropertyChanged;
    private getPropertyValue;
    /**
     * Copies the format.
     * @param  {WRowFormat} format
     * @returns void
     * @private
     */
    copyFormat(format: WRowFormat): void;
    /**
     * Combines the format.
     * @param  {WRowFormat} format
     * @private
     */
    combineFormat(format: WRowFormat): void;
    /**
     * Clears the row format.
     * @returns void
     * @private
     */
    clearRowFormat(): void;
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    clearFormat(): void;
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    destroy(): void;
}
/**
 * Selection image format implementation
 */
export declare class SelectionImageFormat {
    /**
     * @private
     */
    image: ImageElementBox;
    /**
     * @private
     */
    selection: Selection;
    /**
     * Gets the width of the image.
     * @aspType int
     * @blazorType int
     */
    readonly width: number;
    /**
     * Gets the height of the image.
     * @aspType int
     * @blazorType int
     */
    readonly height: number;
    /**
     * @private
     */
    constructor(selection: Selection);
    /**
     * Resizes the image based on given size.
     * @param width
     * @param height
     */
    resize(width: number, height: number): void;
    /**
     * Update image width and height
     * @private
     */
    updateImageFormat(width: number, height: number): void;
    /**
     * @private
     */
    copyImageFormat(image: ImageElementBox): void;
    /**
     * @private
     */
    clearImageFormat(): void;
}
