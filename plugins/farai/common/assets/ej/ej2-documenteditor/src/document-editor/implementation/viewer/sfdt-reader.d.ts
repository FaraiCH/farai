import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WCharacterFormat, WParagraphFormat, WSectionFormat } from '../format/index';
import { WStyles } from '../format/index';
import { LayoutViewer, DocumentHelper } from './viewer';
import { Widget, BodyWidget, BlockWidget, HeaderFooters, CommentElementBox, ContentControlProperties, Footnote } from './page';
import { Dictionary } from '../../base/dictionary';
import { Revision } from '../track-changes/track-changes';
/**
 * @private
 */
export declare class SfdtReader {
    private documentHelper;
    private fieldSeparator;
    private commentStarts;
    private commentEnds;
    /**
     * @private
     */
    commentsCollection: Dictionary<string, CommentElementBox>;
    /**
     * @private
     */
    revisionCollection: Dictionary<string, Revision>;
    private isPageBreakInsideTable;
    private editableRanges;
    private isParseHeader;
    footnotes: Footnote;
    endnotes: Footnote;
    /**
     * @private
     */
    isCutPerformed: boolean;
    /**
     * @private
     */
    isPaste: boolean;
    private readonly isPasting;
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    /**
     * @private
     * @param json
     */
    convertJsonToDocument(json: string): BodyWidget[];
    private parseFootnotes;
    private parseEndtnotes;
    private parseCustomXml;
    private parseDocumentProtection;
    private parseStyles;
    /**
     * @private
     */
    parseRevisions(data: any, revisions: Revision[]): void;
    /**
     * @private
     */
    parseRevision(data: any): Revision;
    private checkAndApplyRevision;
    /**
     * @private
     */
    parseComments(data: any, comments: CommentElementBox[]): void;
    private parseComment;
    private parseCommentText;
    parseStyle(data: any, style: any, styles: WStyles): void;
    private getStyle;
    /**
     * @private
     * @param data
     * @param abstractLists
     */
    parseAbstractList(data: any, abstractLists: WAbstractList[]): void;
    private parseListLevel;
    /**
     * @private
     * @param data
     * @param listCollection
     */
    parseList(data: any, listCollection: WList[]): void;
    private parseLevelOverride;
    private parseSections;
    /**
     * @private
     */
    parseHeaderFooter(data: any, headersFooters: any): HeaderFooters;
    private parseTextBody;
    addCustomStyles(data: any): void;
    parseBody(data: any, blocks: BlockWidget[], container?: Widget, isSectionBreak?: boolean, contentControlProperties?: ContentControlProperties): void;
    private parseTable;
    private parseRowGridValues;
    private parseContentControlProperties;
    private parseParagraph;
    private applyCharacterStyle;
    private parseEditableRangeStart;
    private addEditRangeCollection;
    private parseChartTitleArea;
    private parseChartDataFormat;
    private parseChartLayout;
    private parseChartLegend;
    private parseChartCategoryAxis;
    private parseChartDataTable;
    private parseChartArea;
    private parseChartData;
    private parseChartSeries;
    private parseChartDataLabels;
    private parseChartSeriesDataPoints;
    private parseChartTrendLines;
    private parseTableFormat;
    private parseCellFormat;
    private parseCellMargin;
    private parseRowFormat;
    private parseBorders;
    private parseBorder;
    private parseShading;
    /**
     * @private
     */
    parseCharacterFormat(sourceFormat: any, characterFormat: WCharacterFormat, writeInlineFormat?: boolean): void;
    private getColor;
    /**
     * @private
     */
    parseParagraphFormat(sourceFormat: any, paragraphFormat: WParagraphFormat): void;
    private parseListFormat;
    /**
     *
     * @param data @private
     * @param sectionFormat
     */
    parseSectionFormat(data: any, sectionFormat: WSectionFormat): void;
    private parseTabStop;
    private validateImageUrl;
}
