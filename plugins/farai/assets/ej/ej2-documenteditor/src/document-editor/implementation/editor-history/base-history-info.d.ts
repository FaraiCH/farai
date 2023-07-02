import { WParagraphFormat } from '../format/paragraph-format';
import { WSectionFormat } from '../format/section-format';
import { WCharacterFormat } from '../format/character-format';
import { WListFormat } from '../format/list-format';
import { WListLevel } from '../list/list-level';
import { EditorHistory } from '../index';
import { IWidget, FieldElementBox, TableWidget, BookmarkElementBox, EditRangeStartElementBox } from '../viewer/page';
import { DocumentEditor } from '../../document-editor';
import { Action } from '../../index';
import { TextPosition } from '../index';
import { LayoutViewer } from '../index';
import { ElementBox } from '../viewer/page';
import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { DocumentHelper } from '../viewer';
/**
 * @private
 */
export declare class BaseHistoryInfo {
    private ownerIn;
    documentHelper: DocumentHelper;
    private actionIn;
    private removedNodesIn;
    private modifiedPropertiesIn;
    private modifiedNodeLength;
    private selectionStartIn;
    private selectionEndIn;
    private insertPositionIn;
    private endPositionIn;
    private currentPropertyIndex;
    private ignoredWord;
    /**
     * @private
     */
    lastElementRevision: ElementBox;
    /**
     * @private
     */
    endRevisionLogicalIndex: string;
    /**
     * gets the owner control
     * @private
     */
    readonly owner: DocumentEditor;
    /**
     * gets or sets action
     * @private
     */
    readonly editorHistory: EditorHistory;
    /**
     * gets or sets action
     * @private
     */
    action: Action;
    /**
     * gets modified properties
     * @returns Object
     * @private
     */
    readonly modifiedProperties: Object[];
    /**
     * @private
     */
    readonly removedNodes: IWidget[];
    /**
     * Gets or Sets the selection start
     * @private
     */
    selectionStart: string;
    /**
     * Gets or Sets the selection end
     * @private
     */
    selectionEnd: string;
    /**
     * Gets or sets the insert position
     * @private
     */
    insertPosition: string;
    /**
     * Gets or sets end position
     * @private
     */
    endPosition: string;
    constructor(node: DocumentEditor);
    readonly viewer: LayoutViewer;
    /**
     * Update the selection
     * @param selection
     * @private
     */
    updateSelection(): void;
    setBookmarkInfo(bookmark: BookmarkElementBox): void;
    /**
     * @private
     */
    setFormFieldInfo(field: FieldElementBox, value: string | number | boolean): void;
    setEditRangeInfo(editStart: EditRangeStartElementBox): void;
    private revertFormTextFormat;
    private revertFormField;
    private revertBookmark;
    private revertComment;
    private revertEditRangeRegion;
    /**
     * Reverts this instance
     * @private
     */
    revert(): void;
    private highlightListText;
    private removeContent;
    /**
     * @private
     */
    updateEndRevisionInfo(): void;
    private retrieveEndPosition;
    /**
     * Method to retrieve exact spitted node which is marked as last available element.
     * @param elementBox
     */
    private checkAdjacentNodeForMarkedRevision;
    private revertModifiedProperties;
    private redoAction;
    /**
     * Revert the modified nodes
     * @param  {WNode[]} deletedNodes
     * @param  {boolean} isRedoAction
     * @param  {string} start
     * @param  {boolean} isEmptySelection
     */
    private revertModifiedNodes;
    private insertRemovedNodes;
    /**
     * @private
     */
    undoRevisionForElements(start: TextPosition, end: TextPosition, id: string): void;
    private revertResizing;
    private revertTableDialogProperties;
    /**
     * Add modified properties for section format
     * @param  {WSectionFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedPropertiesForSection(format: WSectionFormat, property: string, value: Object): Object;
    /**
     * Add the modified properties for character format
     * @param  {WCharacterFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedProperties(format: WCharacterFormat, property: string, value: Object): Object;
    /**
     * Add the modified properties for paragraph format
     * @param  {WParagraphFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedPropertiesForParagraphFormat(format: WParagraphFormat, property: string, value: Object): Object;
    /**
     * @private
     */
    addModifiedPropertiesForContinueNumbering(paragraphFormat: WParagraphFormat, value: Object): Object;
    /**
     * @param listFormat
     * @param value
     * @private
     */
    addModifiedPropertiesForRestartNumbering(listFormat: WListFormat, value: Object): Object;
    /**
     * Add modified properties for list format
     * @param  {WListLevel} listLevel
     * @private
     */
    addModifiedPropertiesForList(listLevel: WListLevel): Object;
    /**
     * Revert the properties
     * @param  {SelectionRange} selectionRange
     */
    private revertProperties;
    /**
     * Add modified properties for cell options dialog
     * @param  {WCellFormat} format
     * @param  {WTable} table
     * @private
     */
    addModifiedCellOptions(applyFormat: WCellFormat, format: WCellFormat, table: TableWidget): WCellFormat;
    private copyCellOptions;
    /**
     * Add modified properties for cell options dialog
     * @param  {WTableFormat} format
     * @private
     */
    addModifiedTableOptions(format: WTableFormat): void;
    private copyTableOptions;
    private getProperty;
    private getCharacterPropertyValue;
    /**
     * Add modified properties for table format
     * @param  {WTableFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedTableProperties(format: WTableFormat, property: string, value: Object): Object;
    /**
     * Add modified properties for row format
     * @param  {WRowFormat} rowFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedRowProperties(rowFormat: WRowFormat, property: string, value: Object): Object;
    /**
     * Add modified properties for cell format
     * @param  {WCellFormat} cellFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    addModifiedCellProperties(cellFormat: WCellFormat, property: string, value: Object): Object;
    /**
     * @private
     */
    destroy(): void;
}
