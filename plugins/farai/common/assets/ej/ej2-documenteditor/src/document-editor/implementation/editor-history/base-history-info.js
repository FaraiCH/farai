import { WParagraphFormat } from '../format/paragraph-format';
import { WSectionFormat } from '../format/section-format';
import { WCharacterFormat } from '../format/character-format';
import { WListFormat } from '../format/list-format';
import { ModifiedLevel, RowHistoryFormat, TableHistoryInfo } from './history-helper';
import { BlockWidget, ParagraphWidget, BodyWidget, TableCellWidget, FieldElementBox, TableWidget, TableRowWidget, HeaderFooterWidget, CheckBoxFormField, TextFrame } from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { TextPosition, ImageFormat } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ElementBox } from '../viewer/page';
import { WTableFormat, WRowFormat, WCellFormat, WParagraphStyle } from '../format/index';
import { HelperMethods } from '../editor/editor-helper';
/**
 * @private
 */
var BaseHistoryInfo = /** @class */ (function () {
    function BaseHistoryInfo(node) {
        this.ownerIn = node;
        this.documentHelper = node.documentHelper;
        this.modifiedPropertiesIn = [];
        this.modifiedNodeLength = [];
        this.removedNodesIn = [];
    }
    Object.defineProperty(BaseHistoryInfo.prototype, "owner", {
        //Properties
        //gets owner control
        /**
         * gets the owner control
         * @private
         */
        get: function () { return this.ownerIn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "editorHistory", {
        /**
         * gets or sets action
         * @private
         */
        get: function () {
            return this.owner.editorHistory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "action", {
        /**
         * gets or sets action
         * @private
         */
        get: function () { return this.actionIn; },
        set: function (value) { this.actionIn = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "modifiedProperties", {
        /**
         * gets modified properties
         * @returns Object
         * @private
         */
        get: function () { return this.modifiedPropertiesIn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "removedNodes", {
        /**
         * @private
         */
        get: function () {
            return this.removedNodesIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "selectionStart", {
        /**
         * Gets or Sets the selection start
         * @private
         */
        //gets or sets selection start
        get: function () { return this.selectionStartIn; },
        set: function (value) { this.selectionStartIn = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "selectionEnd", {
        /**
         * Gets or Sets the selection end
         * @private
         */
        get: function () { return this.selectionEndIn; },
        set: function (value) { this.selectionEndIn = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "insertPosition", {
        /**
         * Gets or sets the insert position
         * @private
         */
        get: function () { return this.insertPositionIn; },
        set: function (value) { this.insertPositionIn = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "endPosition", {
        /**
         * Gets or sets end position
         * @private
         */
        get: function () { return this.endPositionIn; },
        set: function (value) { this.endPositionIn = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseHistoryInfo.prototype, "viewer", {
        get: function () {
            return this.ownerIn.viewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update the selection
     * @param selection
     * @private
     */
    BaseHistoryInfo.prototype.updateSelection = function () {
        var blockInfo = this.owner.selection.getParagraphInfo(this.owner.selection.start);
        this.selectionStart = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.owner.selection.getParagraphInfo(this.owner.selection.end);
        this.selectionEnd = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
    };
    BaseHistoryInfo.prototype.setBookmarkInfo = function (bookmark) {
        this.removedNodes.push({ 'bookmark': bookmark, 'startIndex': bookmark.indexInOwner, 'endIndex': bookmark.reference.indexInOwner });
    };
    /**
     * @private
     */
    BaseHistoryInfo.prototype.setFormFieldInfo = function (field, value) {
        this.removedNodes.push({ 'formField': field, 'value': value });
    };
    BaseHistoryInfo.prototype.setEditRangeInfo = function (editStart) {
        // tslint:disable-next-line:max-line-length
        this.removedNodes.push({ 'editStart': editStart, 'startIndex': editStart.indexInOwner, 'endIndex': editStart.editRangeEnd.indexInOwner });
    };
    BaseHistoryInfo.prototype.revertFormTextFormat = function () {
        /* tslint:disable:no-any */
        var fieldInfo = this.removedNodes[0];
        var text = fieldInfo.value;
        /* tslint:enable:no-any */
        var formField = fieldInfo.formField;
        if (this.editorHistory.isUndoing) {
            this.owner.editorModule.applyTextFormatInternal(formField, text);
            this.editorHistory.recordChanges(this);
        }
        else {
            text = HelperMethods.formatText(formField.formFieldData.format, text);
            this.owner.editorModule.applyTextFormatInternal(formField, text);
            this.editorHistory.undoStack.push(this);
        }
    };
    BaseHistoryInfo.prototype.revertFormField = function () {
        /* tslint:disable:no-any */
        var fieldInfo = this.removedNodes[0];
        /* tslint:enable:no-any */
        var field = fieldInfo.formField;
        if (field.formFieldData instanceof CheckBoxFormField) {
            this.owner.editorModule.toggleCheckBoxFormField(field, true, fieldInfo.value);
        }
        else {
            this.owner.editorModule.updateFormField(field, fieldInfo.value);
        }
    };
    BaseHistoryInfo.prototype.revertBookmark = function () {
        var bookmarkInfo = this.removedNodes[0];
        var bookmark = bookmarkInfo.bookmark;
        if (this.editorHistory.isUndoing) {
            this.documentHelper.bookmarks.add(bookmark.name, bookmark);
            bookmark.line.children.splice(bookmarkInfo.startIndex, 0, bookmark);
            var previousNode = bookmark.previousNode;
            if (previousNode instanceof FieldElementBox && !isNullOrUndefined(previousNode.formFieldData)) {
                previousNode.formFieldData.name = bookmark.name;
            }
            bookmark.reference.line.children.splice(bookmarkInfo.endIndex, 0, bookmark.reference);
            this.editorHistory.recordChanges(this);
        }
        else {
            this.owner.editorModule.deleteBookmarkInternal(bookmark);
            this.editorHistory.undoStack.push(this);
        }
    };
    BaseHistoryInfo.prototype.revertComment = function () {
        var editPosition = this.insertPosition;
        var comment = this.removedNodes[0];
        var insert = false;
        if (this.action === 'InsertCommentWidget') {
            insert = (this.editorHistory.isRedoing);
        }
        else if (this.action === 'DeleteCommentWidget') {
            insert = (this.editorHistory.isUndoing);
        }
        if (insert) {
            if (comment) {
                if (comment.isReply) {
                    this.owner.editor.addReplyComment(comment, this.insertPosition);
                }
                else {
                    this.owner.editor.addCommentWidget(comment, false, true, true);
                }
            }
        }
        else {
            var commentElement = this.owner.editor.getCommentElementBox(editPosition);
            this.owner.editor.deleteCommentWidget(commentElement);
        }
    };
    BaseHistoryInfo.prototype.revertEditRangeRegion = function () {
        var editRangeInfo = this.removedNodes[0];
        var editStart = editRangeInfo.editStart;
        if (this.editorHistory.isUndoing) {
            var user = editStart.user === '' ? editStart.group : editStart.user;
            this.owner.editor.updateRangeCollection(editStart, user);
            editStart.line.children.splice(editRangeInfo.startIndex, 0, editStart);
            editStart.editRangeEnd.line.children.splice(editRangeInfo.endIndex, 0, editStart.editRangeEnd);
            this.editorHistory.recordChanges(this);
        }
        else {
            this.owner.editorModule.removeUserRestrictionsInternal(editStart);
            this.editorHistory.undoStack.push(this);
        }
        this.owner.editor.fireContentChange();
    };
    /**
     * Reverts this instance
     * @private
     */
    // tslint:disable: max-func-body-length
    BaseHistoryInfo.prototype.revert = function () {
        if (this.action === 'FormTextFormat') {
            this.revertFormTextFormat();
            return;
        }
        if (this.action === 'UpdateFormField') {
            this.revertFormField();
            return;
        }
        if (this.action === 'DeleteBookmark') {
            this.revertBookmark();
            return;
        }
        if (this.action === 'RemoveEditRange') {
            this.revertEditRangeRegion();
            return;
        }
        if (this.action === 'InsertCommentWidget' || this.action === 'DeleteCommentWidget') {
            this.revertComment();
            return;
        }
        this.owner.isShiftingEnabled = true;
        var selectionStartTextPosition = undefined;
        var selectionEndTextPosition = undefined;
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var isForwardSelection = TextPosition.isForwardSelection(start, end);
        if (this.modifiedProperties.length > 0 || this.action === 'Selection' || this.action === 'ClearCharacterFormat'
            || this.action === 'ClearParagraphFormat') {
            selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(start);
            selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(end);
            this.revertModifiedProperties(selectionStartTextPosition, selectionEndTextPosition);
        }
        else {
            var sel = this.owner.selection;
            var deletedNodes = this.removedNodes;
            this.removedNodesIn = [];
            var isForward = TextPosition.isForwardSelection(this.insertPosition, this.endPosition);
            var insertTextPosition = sel.getTextPosBasedOnLogicalIndex(isForward ? this.insertPosition : this.endPosition);
            var endTextPosition = sel.getTextPosBasedOnLogicalIndex(isForward ? this.endPosition : this.insertPosition);
            if (this.lastElementRevision && this.editorHistory.isUndoing) {
                if (isNullOrUndefined(this.endRevisionLogicalIndex)) {
                    this.updateEndRevisionInfo();
                }
            }
            if (this.action === 'ClearRevisions') {
                this.undoRevisionForElements(insertTextPosition, endTextPosition, deletedNodes[deletedNodes.length - 1]);
                deletedNodes = [];
            }
            if (insertTextPosition.isAtSamePosition(endTextPosition)) {
                sel.selectContent(insertTextPosition, true);
            }
            else {
                sel.selectPosition(insertTextPosition, endTextPosition);
            }
            if (this.action === 'InsertHyperlink' && this.editorHistory.isRedoing) {
                var fieldBegin = this.owner.selection.getHyperlinkField();
                if (!isNullOrUndefined(fieldBegin)) {
                    var offset = (fieldBegin.line).getOffset(fieldBegin, 0);
                    insertTextPosition.setPositionParagraph(fieldBegin.line, offset);
                    this.owner.selection.start.setPositionInternal(insertTextPosition);
                    offset = fieldBegin.fieldEnd.line.getOffset(fieldBegin.fieldEnd, 1);
                    endTextPosition.setPositionParagraph(fieldBegin.fieldEnd.line, offset);
                }
            }
            this.editorHistory.currentBaseHistoryInfo = this;
            this.selectionStart = this.insertPosition;
            this.insertPosition = undefined;
            this.selectionEnd = this.endPosition;
            this.endPosition = undefined;
            var isRemoveContent = false;
            if (this.endRevisionLogicalIndex && deletedNodes.length > 0) {
                // tslint:disable-next-line:max-line-length      
                if (this.editorHistory.isUndoing || (this.editorHistory.isRedoing && insertTextPosition.isAtSamePosition(endTextPosition))) {
                    var currentPosition = sel.getTextPosBasedOnLogicalIndex(this.endRevisionLogicalIndex);
                    sel.selectPosition(insertTextPosition, currentPosition);
                }
                if (this.editorHistory.isUndoing) {
                    this.owner.editor.deleteSelectedContents(sel, true);
                }
            }
            if (!insertTextPosition.isAtSamePosition(endTextPosition)) {
                isRemoveContent = this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'ClearCells'
                    || this.action === 'DeleteCells';
                // tslint:disable-next-line:max-line-length
                var skipDelete = (deletedNodes.length > 0 && this.action === 'ParaMarkTrack') || this.action === 'ClearRevisions' || this.action === 'AcceptTOC';
                if (!(isRemoveContent) && this.action !== 'MergeCells' && this.action !== 'InsertRowAbove'
                    && this.action !== 'InsertRowBelow' && this.action !== 'InsertColumnLeft'
                    && this.action !== 'InsertColumnRight' && this.action !== 'Borders'
                    && this.action !== 'DeleteTable' && this.action !== 'DeleteColumn' && this.action !== 'DeleteRow') {
                    sel.end.setPositionInternal(endTextPosition);
                    if (!this.owner.selection.isEmpty && !skipDelete) {
                        if (this.editorHistory.isRedoing && this.action !== 'Accept Change' && this.action !== 'ParaMarkTrack' &&
                            this.action !== 'ParaMarkReject' && this.action !== 'RemoveRowTrack') {
                            this.owner.editorModule.removeSelectedContents(sel);
                        }
                        else {
                            this.owner.editorModule.deleteSelectedContents(sel, true);
                        }
                        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                            this.editorHistory.currentHistoryInfo.action === 'PageBreak' && this.documentHelper.blockToShift) {
                            this.documentHelper.layout.shiftLayoutedItems(false);
                        }
                    }
                }
            }
            var isRedoAction = this.editorHistory.isRedoing && !isRemoveContent;
            isRemoveContent = this.lastElementRevision ? false : isRemoveContent;
            this.revertModifiedNodes(deletedNodes, isRedoAction, isForwardSelection ? start : end, start === end);
            if (isRemoveContent) {
                this.removeContent(insertTextPosition, endTextPosition);
            }
            //this.owner.editorModule.reLayout(this.documentHelper.selection);
        }
        var isSelectionChanged = false;
        var updateSelection = false;
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) && (this.editorHistory.currentHistoryInfo.action === 'Reject All' || this.editorHistory.currentHistoryInfo.action === 'Accept All')) {
            updateSelection = true;
        }
        // tslint:disable-next-line:max-line-length
        if (!this.owner.trackChangesPane.isTrackingPageBreak && ((this.editorHistory.isUndoing || this.endRevisionLogicalIndex || this.action === 'RemoveRowTrack' || updateSelection) && isNullOrUndefined(this.editorHistory.currentHistoryInfo) || updateSelection) ||
            ((this.action === 'InsertRowAbove' || this.action === 'Borders' || this.action === 'InsertRowBelow'
                || this.action === 'InsertColumnLeft'
                || this.action === 'InsertColumnRight' || this.action === 'Accept Change') && (this.editorHistory.isRedoing
                || this.editorHistory.currentHistoryInfo.action === 'Paste'))) {
            if (this.action === 'RemoveRowTrack' && this.editorHistory.isRedoing) {
                selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionStart);
                selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionEnd);
            }
            else {
                selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(start);
                selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(end);
            }
            this.owner.selection.selectRange(selectionStartTextPosition, selectionEndTextPosition);
            isSelectionChanged = true;
        }
        this.owner.trackChangesPane.isTrackingPageBreak = false;
        // Updates insert position of history info instance.
        this.insertPosition = start;
        this.endPosition = end;
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) && (this.editorHistory.currentHistoryInfo.action === 'Accept All' || this.editorHistory.currentHistoryInfo.action === 'Reject All')) {
            if (this.owner.documentHelper.blockToShift) {
                this.owner.documentHelper.layout.shiftLayoutedItems(false);
            }
        }
        this.owner.editorModule.reLayout(this.owner.selection, this.owner.selection.isEmpty);
        if (isSelectionChanged) {
            this.documentHelper.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
        }
        this.highlightListText();
    };
    BaseHistoryInfo.prototype.highlightListText = function () {
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
            // tslint:disable-next-line:max-line-length
            if (this.action === 'ListCharacterFormat' || (this.editorHistory.currentHistoryInfo.action === 'ListSelect' && this.action === 'ListFormat')) {
                var selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionStart);
                var widget = selectionStartTextPosition.currentWidget;
                this.documentHelper.selection.highlightListText(widget);
            }
        }
    };
    BaseHistoryInfo.prototype.removeContent = function (insertTextPosition, endTextPosition) {
        //If the base parent of the insert text position and end text position is null 
        //then the paragraphs already removed.
        //Example scenario: In table editing that is delete cells operation 
        // we will backed up the entire table ad it will be replaced on undo operation.
        //At that time if the positions are in table 
        //which is already replaced in undo (revert modified nodes method) then the base parent of the paragraph will be null.
        //So again, selecting the content and deleting is unnecessary
        // and it will cause improper position updates and null reference exceptions. 
        if ((!isNullOrUndefined(insertTextPosition.paragraph.containerWidget) &&
            insertTextPosition.paragraph.containerWidget instanceof BodyWidget &&
            (!isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && endTextPosition.paragraph.containerWidget instanceof BodyWidget))
            || (!isNullOrUndefined(insertTextPosition.paragraph.containerWidget)
                && !isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && insertTextPosition.paragraph.containerWidget instanceof TableCellWidget
                && endTextPosition.paragraph.containerWidget instanceof TableCellWidget
                && !isNullOrUndefined(insertTextPosition.paragraph.bodyWidget)) ||
            (!isNullOrUndefined(insertTextPosition.paragraph.containerWidget)
                && !isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && insertTextPosition.paragraph.containerWidget instanceof TextFrame
                && endTextPosition.paragraph.containerWidget instanceof TextFrame)) {
            //Removes if any empty paragraph is added while delete.
            this.owner.selection.selectRange(insertTextPosition, endTextPosition);
            var isDelete = (this.action === 'BackSpace' || this.action === 'RemoveRowTrack') ? true : false;
            this.owner.editorModule.deleteSelectedContents(this.owner.selection, isDelete);
        }
    };
    /**
     * @private
     */
    BaseHistoryInfo.prototype.updateEndRevisionInfo = function () {
        this.lastElementRevision = this.checkAdjacentNodeForMarkedRevision(this.lastElementRevision);
        var currentRevision = this.retrieveEndPosition(this.lastElementRevision);
        var blockInfo = this.owner.selection.getParagraphInfo(currentRevision);
        this.endRevisionLogicalIndex = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        this.lastElementRevision.isMarkedForRevision = false;
    };
    BaseHistoryInfo.prototype.retrieveEndPosition = function (elementBox) {
        var endPosition = new TextPosition(this.owner);
        var offset = elementBox.line.getOffset(elementBox, 0) + elementBox.length;
        endPosition.setPositionFromLine(elementBox.line, offset);
        return endPosition;
    };
    /**
     * Method to retrieve exact spitted node which is marked as last available element.
     * @param elementBox
     */
    BaseHistoryInfo.prototype.checkAdjacentNodeForMarkedRevision = function (elementBox) {
        var nextItem = elementBox.nextNode;
        var markedNode;
        while (!isNullOrUndefined(nextItem) && nextItem.isMarkedForRevision) {
            markedNode = nextItem;
            nextItem = nextItem.nextNode;
        }
        return !isNullOrUndefined(markedNode) ? markedNode : elementBox;
    };
    BaseHistoryInfo.prototype.revertModifiedProperties = function (start, end) {
        if (this.action === 'CellFormat' || this.action === 'CellOptions' || this.action === 'TableOptions') {
            this.owner.isShiftingEnabled = false;
        }
        this.owner.selection.selectRange(start, end);
        if (this.action === 'RowResizing' || this.action === 'CellResizing') {
            this.revertResizing();
        }
        else if (this.action === 'CellOptions' || this.action === 'TableOptions') {
            this.revertTableDialogProperties(this.action);
        }
        else if (this.action !== 'Selection') {
            this.revertProperties();
        }
    };
    // Redoes the Action
    BaseHistoryInfo.prototype.redoAction = function () {
        var editor = this.owner.editorModule;
        switch (this.action) {
            case 'BackSpace':
                editor.singleBackspace(this.owner.selection, true);
                break;
            case 'Delete':
                editor.singleDelete(this.owner.selection, true);
                break;
            case 'DeleteTable':
                editor.deleteTable();
                break;
            case 'DeleteColumn':
                editor.deleteColumn();
                break;
            case 'DeleteRow':
                editor.deleteRow();
                break;
            case 'MergeCells':
                editor.mergeSelectedCellsInTable();
                break;
            case 'InsertRowAbove':
                editor.insertRow(true);
                break;
            case 'InsertRowBelow':
                editor.insertRow(false);
                break;
            case 'InsertColumnLeft':
                editor.insertColumn(true);
                break;
            case 'InsertColumnRight':
                editor.insertColumn(true);
                break;
            case 'SectionBreak':
                editor.insertSection(this.owner.selection, true);
                break;
            case 'TableAutoFitToContents':
                editor.autoFitTable('FitToContents');
                break;
            case 'TableAutoFitToWindow':
                editor.autoFitTable('FitToWindow');
                break;
            case 'TableFixedColumnWidth':
                editor.autoFitTable('FixedColumnWidth');
                break;
            case 'RemoveRowTrack':
                this.owner.selection.handleAcceptReject(true);
                break;
        }
    };
    /**
     * Revert the modified nodes
     * @param  {WNode[]} deletedNodes
     * @param  {boolean} isRedoAction
     * @param  {string} start
     * @param  {boolean} isEmptySelection
     */
    BaseHistoryInfo.prototype.revertModifiedNodes = function (deletedNodes, isRedoAction, start, isEmptySelection) {
        if (isRedoAction && (this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'DeleteTable'
            || this.action === 'DeleteColumn' || this.action === 'DeleteRow' || this.action === 'InsertRowAbove' ||
            this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft' || this.action === 'InsertColumnRight'
            || this.action === 'MergeCells' || this.action === 'SectionBreak' || this.action === 'TableAutoFitToContents' ||
            this.action === 'TableAutoFitToWindow' || this.action === 'TableFixedColumnWidth')) {
            this.redoAction();
            if (this.action === 'SectionBreak') {
                return;
            }
        }
        if (deletedNodes.length > 0) {
            if ((this.editorHistory.isUndoing && (this.action === 'RemoveRowTrack' || this.action === 'DeleteCells' ||
                this.action === 'DeleteColumn' || this.action === 'DeleteRow' || this.action === 'MergeCells'))
                || (this.action === 'InsertRowAbove' || this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft'
                    || this.action === 'ClearCells' || this.action === 'InsertColumnRight' || this.action === 'Borders' ||
                    this.action === 'TableAutoFitToContents' || this.action === 'TableAutoFitToWindow' ||
                    this.action === 'TableFixedColumnWidth' || this.action === 'RemoveRowTrack')) {
                var insertIndex = this.selectionStart;
                var block = this.owner.editorModule.getBlock({ index: insertIndex }).node;
                var lastNode = deletedNodes[deletedNodes.length - 1];
                if ((block instanceof TableWidget || block.previousRenderedWidget instanceof TableWidget || block.isInsideTable)
                    && lastNode instanceof TableWidget) {
                    if (block instanceof ParagraphWidget && !block.isInsideTable) {
                        block = block.previousRenderedWidget;
                    }
                    else if (block instanceof ParagraphWidget && block.isInsideTable) {
                        block = block.associatedCell.ownerTable;
                    }
                    block = block.combineWidget(this.viewer);
                    this.owner.editorModule.insertTableInternal(block, lastNode, false);
                    deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                }
                else if (lastNode instanceof TableWidget) {
                    this.owner.editorModule.insertBlock(lastNode);
                }
            }
            else {
                var initialStart = start;
                var block = this.owner.editorModule.getBlock({ index: initialStart }).node;
                // initialStart = blockObj.position;
                if (deletedNodes.length > 0 && (this.action === 'BackSpace' && isEmptySelection
                    || (!(block instanceof TableWidget) && !(block instanceof HeaderFooterWidget)))) {
                    var lastNode = deletedNodes[0];
                    if (this.action === 'TrackingPageBreak' || (this.action === 'SectionBreak' && lastNode instanceof BodyWidget ||
                        !isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                            this.editorHistory.currentHistoryInfo.action === 'PageBreak')) {
                        lastNode = deletedNodes[1];
                    }
                    if (lastNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0) {
                        this.owner.editorModule.insertNewParagraphWidget(lastNode, true);
                        if (lastNode.characterFormat.removedIds.length > 0) {
                            this.owner.editor.constructRevisionFromID(lastNode.characterFormat, undefined);
                        }
                        deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                        if (isNullOrUndefined(block)) {
                            // tslint:disable-next-line:max-line-length
                            var nextBlock = this.documentHelper.selection.getNextParagraphBlock(lastNode.getSplitWidgets().pop());
                            this.owner.selection.getNextRenderedBlock(lastNode);
                            if (isNullOrUndefined(nextBlock)) {
                                //Sets the selection as starting of last paragraph.
                                this.owner.selection.selectParagraphInternal(lastNode, true);
                            }
                        }
                    }
                    if (lastNode instanceof TableWidget && this.owner.selection.start.offset > 0) {
                        var firstBlock = deletedNodes[deletedNodes.length - 1];
                        if (firstBlock instanceof ParagraphWidget) {
                            this.owner.editorModule.insertNewParagraphWidget(firstBlock, true);
                            deletedNodes.splice(deletedNodes.indexOf(firstBlock), 1);
                            if (isNullOrUndefined(block)) {
                                // tslint:disable-next-line:max-line-length
                                var nextBlock = this.documentHelper.selection.getNextParagraphBlock(firstBlock.getSplitWidgets().pop());
                                if (isNullOrUndefined(nextBlock)) {
                                    //Sets the selection as starting of last paragraph.
                                    this.owner.selection.selectParagraphInternal(firstBlock, true);
                                }
                            }
                        }
                    }
                }
                if (deletedNodes.length > 0) {
                    var firstNode = deletedNodes[deletedNodes.length - 1];
                    if (block instanceof TableWidget) {
                        block = block.combineWidget(this.viewer);
                        if (firstNode instanceof TableWidget) {
                            this.owner.editorModule.insertTableInternal(block, firstNode, true);
                            deletedNodes.splice(deletedNodes.indexOf(firstNode), 1);
                            this.insertPosition = start;
                            var nextWidget = firstNode.getSplitWidgets().pop();
                            if (nextWidget.nextRenderedWidget instanceof TableWidget) {
                                block = nextWidget.nextRenderedWidget;
                            }
                            else {
                                initialStart = start;
                                block = this.owner.editorModule.getBlock({ index: initialStart }).node;
                            }
                        }
                    }
                    //Checks if first node is paragraph and current insert position is paragraph end.
                    // tslint:disable-next-line:max-line-length
                    if (firstNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0
                        && this.owner.selection.start.offset === this.owner.selection.getLineLength(this.owner.selection.start.paragraph.lastChild)) {
                        var editor = this.owner.editorModule;
                        editor.insertNewParagraphWidget(firstNode, false);
                        if (firstNode.characterFormat.removedIds.length > 0) {
                            this.owner.editor.constructRevisionFromID(firstNode.characterFormat, undefined);
                        }
                        deletedNodes.splice(deletedNodes.indexOf(firstNode), 1);
                        //Removes the intermediate empty paragraph instance.
                        if (this.action !== 'Paste') {
                            editor.removeBlock(this.owner.selection.start.paragraph);
                        }
                        // tslint:disable-next-line:max-line-length
                        var paragraph = this.documentHelper.selection.getNextParagraphBlock(firstNode.getSplitWidgets().pop());
                        if (!isNullOrUndefined(paragraph)) {
                            this.owner.selection.selectParagraphInternal(paragraph, true);
                        }
                    }
                    else if (deletedNodes[0] instanceof TableWidget && deletedNodes.length !== 1) {
                        var nextNode = deletedNodes[1];
                        if (nextNode instanceof ParagraphWidget && nextNode.isEmpty()) {
                            deletedNodes.splice(deletedNodes.indexOf(nextNode), 1);
                        }
                    }
                }
                if (deletedNodes.length > 0) {
                    if (block instanceof TableWidget) {
                        block = block.combineWidget(this.viewer);
                    }
                    this.insertRemovedNodes(deletedNodes, block);
                }
            }
        }
    };
    BaseHistoryInfo.prototype.insertRemovedNodes = function (deletedNodes, block) {
        for (var i = deletedNodes.length - 1, index = 0; i > -1; i--) {
            var node = deletedNodes[i];
            if (node instanceof ElementBox) {
                this.owner.editorModule.insertInlineInSelection(this.owner.selection, node);
            }
            else if (node instanceof BlockWidget) {
                if (node instanceof TableRowWidget) {
                    if (block instanceof TableWidget) {
                        block.childWidgets.splice(index, 0, node);
                        this.owner.editorModule.updateNextBlocksIndex(node, true);
                        if (i === 0 || !(deletedNodes[i - 1] instanceof TableRowWidget)) {
                            // tslint:disable-next-line:max-line-length
                            this.documentHelper.layout.layoutBodyWidgetCollection(block.index, block.containerWidget, block, false);
                        }
                    }
                }
                else if (block instanceof TableWidget) {
                    this.owner.editorModule.insertBlockTable(this.owner.selection, node, block);
                }
                else {
                    this.owner.editorModule.insertBlock(node);
                }
            }
            else if (node instanceof WCharacterFormat) {
                var insertIndex = this.selectionStart;
                var wiget = this.owner.editorModule.getBlock({ index: insertIndex }).node;
                if (wiget instanceof ParagraphWidget) {
                    if (node.removedIds.length > 0) {
                        wiget.characterFormat.removedIds = node.removedIds.slice();
                        this.owner.editor.constructRevisionFromID(wiget.characterFormat, true);
                    }
                    else if (wiget.characterFormat.revisions.length > 0) {
                        wiget.characterFormat = node.cloneFormat();
                    }
                }
            }
            else if (node instanceof BodyWidget) {
                this.owner.editorModule.insertSection(this.owner.selection, false);
            }
            else if (typeof (node) === 'string' && this.action === 'AcceptTOC') {
                var insertIndex = this.selectionStart;
                var widget = this.owner.editorModule.getBlock({ index: insertIndex }).node;
                var endWidget = this.owner.editorModule.getBlock({ index: this.selectionEnd }).node;
                var currentRevision = this.owner.documentHelper.revisionsInternal.get(node);
                if (this.editorHistory.isUndoing) {
                    while (widget instanceof ParagraphWidget && widget !== endWidget) {
                        this.owner.editor.insertRevisionForBlock(widget, currentRevision.revisionType, true, currentRevision);
                        // tslint:disable-next-line:max-line-length
                        widget = this.documentHelper.selection.getNextParagraphBlock(widget.getSplitWidgets().pop());
                    }
                    // tslint:disable-next-line:max-line-length
                    this.owner.editor.insertRevisionForBlock(endWidget, currentRevision.revisionType, true, currentRevision);
                }
                else {
                    while (currentRevision.range.length > 0) {
                        var item = currentRevision.range[0];
                        var revisionIndex = item.revisions.indexOf(currentRevision);
                        if (revisionIndex >= 0) {
                            item.revisions.splice(revisionIndex, 1);
                            var rangeIndex = currentRevision.range.indexOf(item);
                            currentRevision.range.splice(rangeIndex, 1);
                        }
                        if (currentRevision.range.length === 0) {
                            this.owner.revisions.remove(currentRevision);
                        }
                    }
                }
                this.owner.editor.addRemovedNodes(currentRevision.revisionID);
            }
        }
        deletedNodes = [];
    };
    /**
     * @private
     */
    BaseHistoryInfo.prototype.undoRevisionForElements = function (start, end, id) {
        var currentPara = start.paragraph;
        var endPara = end.paragraph;
        var currentRevision = this.documentHelper.revisionsInternal.get(id);
        var startoffset = this.owner.selection.getParagraphInfo(start).offset;
        var endoffset = this.owner.selection.getParagraphInfo(end).offset;
        var isSamePara = start.paragraph === end.paragraph;
        if (this.editorHistory.isUndoing) {
            while (currentPara !== endPara) {
                this.owner.editor.applyRevisionForCurrentPara(currentPara, startoffset, currentPara.getLength(), id, true);
                currentPara = this.documentHelper.selection.getNextParagraphBlock(currentPara.getSplitWidgets().pop());
                if (currentPara !== endPara) {
                    startoffset = 0;
                }
            }
            if (currentPara === endPara) {
                if (!isSamePara) {
                    startoffset = 0;
                }
                this.owner.editor.applyRevisionForCurrentPara(currentPara, startoffset, endoffset, id, false);
            }
        }
        else {
            while (currentRevision.range.length > 0) {
                var item = currentRevision.range[0];
                var revisionIndex = item.revisions.indexOf(currentRevision);
                if (revisionIndex >= 0) {
                    item.revisions.splice(revisionIndex, 1);
                    var rangeIndex = currentRevision.range.indexOf(item);
                    currentRevision.range.splice(rangeIndex, 1);
                }
                if (currentRevision.range.length === 0) {
                    this.owner.revisions.remove(currentRevision);
                }
            }
        }
        this.removedNodes.push(id);
    };
    BaseHistoryInfo.prototype.revertResizing = function () {
        this.editorHistory.currentBaseHistoryInfo = this;
        if (this.action === 'RowResizing') {
            if (this.modifiedProperties[0] instanceof RowHistoryFormat) {
                // tslint:disable-next-line:max-line-length
                this.modifiedProperties[0].revertChanges(this.editorHistory.isRedoing, this.owner);
            }
        }
        else {
            if (this.modifiedProperties[0] instanceof TableHistoryInfo) {
                //selected cell resizing the condition checks done based on the selected widgets only. so need to highlight the selection.
                if (this.owner.selection.selectedWidgets.length === 0) {
                    this.owner.selection.highlightSelection(true);
                }
                var prevTableHistoryInfo = this.modifiedProperties[0];
                var position = prevTableHistoryInfo.tableHierarchicalIndex;
                var block = this.owner.editorModule.getBlock({ index: position }).node;
                if (block instanceof TableWidget) {
                    var tableResize = this.owner.editorModule.tableResize;
                    this.owner.editor.setOffsetValue(this.owner.selection);
                    block = block.combineWidget(this.owner.viewer);
                    tableResize.currentResizingTable = block;
                    this.modifiedProperties.splice(0, 1);
                    if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
                        var tableHistoryInfoCurrent = new TableHistoryInfo(block, this.owner);
                        this.modifiedProperties.splice(0, 0, tableHistoryInfoCurrent);
                        this.owner.isLayoutEnabled = false;
                        tableResize.applyProperties(tableResize.currentResizingTable, prevTableHistoryInfo);
                        tableResize.currentResizingTable.isGridUpdated = true;
                        this.owner.isLayoutEnabled = true;
                        tableResize.updateGridValue(tableResize.currentResizingTable, false);
                        prevTableHistoryInfo.destroy();
                        prevTableHistoryInfo = undefined;
                    }
                }
            }
        }
    };
    BaseHistoryInfo.prototype.revertTableDialogProperties = function (action) {
        this.owner.isShiftingEnabled = false;
        this.editorHistory.currentBaseHistoryInfo = this;
        this.currentPropertyIndex = 0;
        if (action === 'CellOptions') {
            var selection = this.owner.selection;
            var cellFormat = this.modifiedProperties[0];
            this.owner.editorModule.updateCellMargins(selection, cellFormat);
        }
        else if (action === 'TableOptions') {
            this.owner.tableOptionsDialogModule.applyTableOptionsHelper(this.modifiedProperties[0]);
        }
        this.currentPropertyIndex = 0;
        this.owner.isShiftingEnabled = true;
    };
    /**
     * Add modified properties for section format
     * @param  {WSectionFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedPropertiesForSection = function (format, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            var modifiedProperties = this.modifiedProperties;
            var previousFormat = (this.currentPropertyIndex < modifiedProperties.length ?
                modifiedProperties[this.currentPropertyIndex] : modifiedProperties[modifiedProperties.length - 1]);
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
            }
            else {
                value = previousFormat.getPropertyValue(property);
                previousFormat.copyFormat(format);
            }
            this.currentPropertyIndex++;
        }
        else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            }
            else {
                var currentFormat = new WSectionFormat();
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
        }
        return value;
    };
    /**
     * Add the modified properties for character format
     * @param  {WCharacterFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedProperties = function (format, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length           
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            var skipRemove = false;
            if (format.ownerBase instanceof ElementBox) {
                var prevLength = this.modifiedNodeLength[this.currentPropertyIndex];
                if (format.ownerBase.length < prevLength) {
                    skipRemove = true;
                    this.modifiedNodeLength[this.currentPropertyIndex] = format.ownerBase.length;
                    this.modifiedNodeLength.splice(this.currentPropertyIndex + 1, 0, prevLength - format.ownerBase.length);
                    //Adds a copy of character format at next position for splitted inline.
                    var nextFormat = new WCharacterFormat(undefined);
                    nextFormat.copyFormat(previousFormat);
                    this.modifiedProperties.splice(this.currentPropertyIndex + 1, 0, nextFormat);
                }
            }
            if (this.action === 'ClearCharacterFormat') {
                if (this.editorHistory.isUndoing) {
                    value = previousFormat;
                    if (!skipRemove) {
                        this.modifiedProperties.splice(this.currentPropertyIndex, 1);
                        this.currentPropertyIndex--;
                    }
                }
                else {
                    this.modifiedProperties.push(format.cloneFormat());
                }
            }
            else {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
            }
            this.currentPropertyIndex++;
        }
        else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            }
            else {
                var currentFormat = new WCharacterFormat(undefined);
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
            if (format.ownerBase instanceof ElementBox) {
                this.modifiedNodeLength.push(format.ownerBase.length);
            }
            else {
                this.modifiedNodeLength.push(0);
            }
        }
        return value;
    };
    /**
     * Add the modified properties for paragraph format
     * @param  {WParagraphFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedPropertiesForParagraphFormat = function (format, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            if (this.action === 'ClearParagraphFormat') {
                if (this.editorHistory.isUndoing) {
                    value = previousFormat;
                    this.modifiedProperties.splice(this.currentPropertyIndex, 1);
                    this.currentPropertyIndex--;
                }
                else {
                    this.modifiedProperties.push(format.cloneFormat());
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'listFormat') {
                value = new WParagraphFormat(undefined);
                value.copyFormat(previousFormat);
                previousFormat.listFormat = new WListFormat();
                previousFormat.listFormat.copyFormat(format.listFormat);
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'styleName') {
                if (!isNullOrUndefined(previousFormat.baseStyle)) {
                    value = new WParagraphStyle();
                    value.copyStyle(previousFormat.baseStyle);
                    this.currentPropertyIndex++;
                    if (!isNullOrUndefined(format.baseStyle)) {
                        previousFormat.baseStyle = new WParagraphStyle();
                        previousFormat.baseStyle.copyStyle(format.baseStyle);
                    }
                    return value;
                }
                else {
                    if (!isNullOrUndefined(format.baseStyle)) {
                        previousFormat.baseStyle = new WParagraphStyle();
                        previousFormat.baseStyle.copyStyle(format.baseStyle);
                    }
                    return undefined;
                }
            }
            value = previousFormat.getPropertyValue(property);
            previousFormat.copyFormat(format);
            this.currentPropertyIndex++;
        }
        else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            }
            else {
                var currentFormat = new WParagraphFormat(undefined);
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
        }
        return value;
    };
    /**
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedPropertiesForContinueNumbering = function (paragraphFormat, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            value = previousFormat;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = paragraphFormat.cloneFormat();
            }
            else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = paragraphFormat.cloneFormat();
            }
            this.currentPropertyIndex++;
            return value;
        }
        else {
            var currentFormat = new WParagraphFormat();
            currentFormat.copyFormat(paragraphFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    };
    /**
     * @param listFormat
     * @param value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedPropertiesForRestartNumbering = function (listFormat, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var listId = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            value = listId;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = listFormat.listId;
            }
            else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = listFormat.listId;
            }
            this.currentPropertyIndex++;
            return value;
        }
        else {
            this.modifiedProperties.push(listFormat.listId);
        }
        return value;
    };
    /**
     * Add modified properties for list format
     * @param  {WListLevel} listLevel
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedPropertiesForList = function (listLevel) {
        var value;
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousLevel = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            value = previousLevel;
            previousLevel = new ModifiedLevel(listLevel, this.owner.editorModule.cloneListLevel(listLevel));
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = previousLevel;
            }
            else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = previousLevel;
            }
            this.currentPropertyIndex++;
        }
        else {
            this.modifiedProperties.push(new ModifiedLevel(listLevel, this.owner.editorModule.cloneListLevel(listLevel)));
            value = listLevel;
        }
        return value;
    };
    /**
     * Revert the properties
     * @param  {SelectionRange} selectionRange
     */
    BaseHistoryInfo.prototype.revertProperties = function () {
        this.editorHistory.currentBaseHistoryInfo = this;
        this.currentPropertyIndex = 0;
        var property = this.getProperty();
        this.viewer.owner.editorModule.setOffsetValue(this.documentHelper.selection);
        if (this.action === 'ClearCharacterFormat' || this.modifiedProperties[0] instanceof WCharacterFormat) {
            if (this.action === 'ListCharacterFormat') {
                this.owner.editorModule.updateListCharacterFormat(this.documentHelper.selection, property, undefined);
                return;
            }
            this.owner.editorModule.updateSelectionCharacterFormatting(property, undefined, false);
        }
        else if (this.action === 'ClearParagraphFormat' || this.modifiedProperties[0] instanceof WParagraphFormat) {
            if (this.action === 'ContinueNumbering') {
                // tslint:disable-next-line:max-line-length
                this.owner.editorModule.revertContinueNumbering(this.owner.selection, this.modifiedProperties[0]);
                return;
            }
            if (this.action === 'StyleName' && this.modifiedProperties[0] instanceof WParagraphFormat) {
                // tslint:disable-next-line:max-line-length
                this.owner.editorModule.updateSelectionParagraphFormatting(property, this.modifiedProperties[0].baseStyle, false);
                return;
            }
            var selection = this.owner.documentHelper.selection;
            var isBidiList = (selection.paragraphFormat.bidi ||
                (this.modifiedProperties[0] instanceof WParagraphFormat && this.modifiedProperties[0]).bidi) && (selection.paragraphFormat.listId !== -1 || property === 'listFormat');
            if (!isBidiList) {
                this.owner.documentHelper.layout.isBidiReLayout = true;
            }
            this.owner.editorModule.updateSelectionParagraphFormatting(property, undefined, false);
            if (!isBidiList) {
                this.owner.documentHelper.layout.isBidiReLayout = false;
            }
        }
        else if (this.modifiedProperties[0] instanceof WSectionFormat) {
            this.owner.editorModule.updateSectionFormat(property, undefined);
        }
        else if (this.action === 'RestartNumbering') {
            this.owner.editorModule.restartListAtInternal(this.owner.selection, this.modifiedProperties[0]);
            return;
        }
        else if (this.modifiedProperties[0] instanceof ImageFormat) {
            this.owner.selection.updateImageSize(this.modifiedProperties[0]);
        }
        else if (this.modifiedProperties[0] instanceof ModifiedLevel) {
            var modified = new Dictionary();
            for (var i = 0; i < this.modifiedProperties.length; i++) {
                var modifiedLevel = this.modifiedProperties[i];
                // modified.modifiedLevels.add(modifiedLevel.ownerListLevel.levelNumber, modifiedLevel);
                modified.add(i, modifiedLevel);
            }
            this.editorHistory.updateListChanges(modified);
            modified.destroy();
            modified = undefined;
        }
        else if (this.modifiedProperties[0] instanceof WTableFormat) {
            this.owner.editorModule.updateTableFormat(this.owner.selection, property, undefined);
        }
        else if (this.modifiedProperties[0] instanceof WCellFormat) {
            this.owner.isShiftingEnabled = true;
            this.owner.editorModule.updateCellFormat(this.owner.selection, property, undefined);
        }
        else if (this.modifiedProperties[0] instanceof WRowFormat) {
            this.owner.editorModule.updateRowFormat(this.owner.selection, property, undefined);
        }
        this.currentPropertyIndex = 0;
        if (this.action === 'ClearCharacterFormat' || this.action === 'ClearParagraphFormat') {
            this.owner.editorModule.getOffsetValue(this.documentHelper.selection);
        }
    };
    /**
     * Add modified properties for cell options dialog
     * @param  {WCellFormat} format
     * @param  {WTable} table
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedCellOptions = function (applyFormat, format, table) {
        var currentFormat;
        if (isNullOrUndefined(applyFormat.bottomMargin) && isNullOrUndefined(applyFormat.topMargin)
            && isNullOrUndefined(applyFormat.rightMargin) && isNullOrUndefined(applyFormat.leftMargin)) {
            currentFormat = this.copyCellOptions(table.tableFormat);
        }
        else {
            currentFormat = this.copyCellOptions(applyFormat);
        }
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            format = previousFormat;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = this.copyCellOptions(applyFormat);
            }
            else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = this.copyCellOptions(applyFormat);
            }
            this.currentPropertyIndex++;
            return format;
        }
        else {
            this.modifiedProperties.push(currentFormat);
        }
        return format;
    };
    BaseHistoryInfo.prototype.copyCellOptions = function (format) {
        var cellFormat = new WCellFormat();
        cellFormat.topMargin = format.topMargin;
        cellFormat.rightMargin = format.rightMargin;
        cellFormat.bottomMargin = format.bottomMargin;
        cellFormat.leftMargin = format.leftMargin;
        return cellFormat;
    };
    /**
     * Add modified properties for cell options dialog
     * @param  {WTableFormat} format
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedTableOptions = function (format) {
        var currentFormat = this.copyTableOptions(format);
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length           
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties.splice(this.currentPropertyIndex, 1, currentFormat);
            }
            else {
                this.modifiedProperties.splice(this.modifiedProperties.length - 1, 1, currentFormat);
            }
            this.currentPropertyIndex++;
        }
        else {
            this.modifiedProperties.push(currentFormat);
        }
    };
    BaseHistoryInfo.prototype.copyTableOptions = function (format) {
        var tableFormat = new WTableFormat();
        tableFormat.topMargin = format.topMargin;
        tableFormat.rightMargin = format.rightMargin;
        tableFormat.bottomMargin = format.bottomMargin;
        tableFormat.leftMargin = format.leftMargin;
        tableFormat.cellSpacing = format.cellSpacing;
        return tableFormat;
    };
    BaseHistoryInfo.prototype.getProperty = function () {
        switch (this.action) {
            case 'Bold':
                return 'bold';
            case 'Italic':
                return 'italic';
            case 'FontColor':
                return 'fontColor';
            case 'FontFamily':
                return 'fontFamily';
            case 'FontSize':
                return 'fontSize';
            case 'HighlightColor':
                return 'highlightColor';
            case 'BaselineAlignment':
                return 'baselineAlignment';
            case 'Strikethrough':
                return 'strikethrough';
            case 'Underline':
                return 'underline';
            case 'AfterSpacing':
                return 'afterSpacing';
            case 'BeforeSpacing':
                return 'beforeSpacing';
            case 'LeftIndent':
                return 'leftIndent';
            case 'RightIndent':
                return 'rightIndent';
            case 'FirstLineIndent':
                return 'firstLineIndent';
            case 'LineSpacingType':
                return 'lineSpacingType';
            case 'LineSpacing':
                return 'lineSpacing';
            case 'TextAlignment':
                return 'textAlignment';
            case 'ListFormat':
                return 'listFormat';
            case 'PageHeight':
                return 'pageHeight';
            case 'PageWidth':
                return 'pageWidth';
            case 'TableAlignment':
                return 'tableAlignment';
            case 'TableLeftIndent':
                return 'leftIndent';
            case 'DefaultCellSpacing':
                return 'cellSpacing';
            case 'LeftMargin':
            case 'CellLeftMargin':
            case 'DefaultCellLeftMargin':
                return 'leftMargin';
            case 'RightMargin':
            case 'CellRightMargin':
            case 'DefaultCellRightMargin':
                return 'rightMargin';
            case 'TopMargin':
            case 'CellTopMargin':
            case 'DefaultCellTopMargin':
                return 'topMargin';
            case 'BottomMargin':
            case 'CellBottomMargin':
            case 'DefaultCellBottomMargin':
                return 'bottomMargin';
            case 'CellContentVerticalAlignment':
                return 'verticalAlignment';
            case 'RowHeight':
                return 'height';
            case 'RowHeightType':
                return 'heightType';
            case 'RowHeader':
                return 'isHeader';
            case 'AllowBreakAcrossPages':
                return 'allowBreakAcrossPages';
            case 'TablePreferredWidth':
            case 'CellPreferredWidth':
                return 'preferredWidth';
            case 'TablePreferredWidthType':
            case 'CellPreferredWidthType':
                return 'preferredWidthType';
            case 'Shading':
                return 'shading';
            case 'StyleName':
                return 'styleName';
            case 'ParagraphBidi':
            case 'TableBidi':
                return 'bidi';
            case 'ContextualSpacing':
                return 'contextualSpacing';
        }
        return undefined;
    };
    BaseHistoryInfo.prototype.getCharacterPropertyValue = function (property, modifiedProperty) {
        var value;
        if (property === 'bold') {
            value = modifiedProperty.bold;
        }
        else if (property === 'italic') {
            value = modifiedProperty.italic;
        }
        else if (property === 'fontColor') {
            value = modifiedProperty.fontColor;
        }
        else if (property === 'fontFamily') {
            value = modifiedProperty.fontFamily;
        }
        else if (property === 'fontSize') {
            value = modifiedProperty.fontSize;
        }
        else if (property === 'highlightColor') {
            value = modifiedProperty.highlightColor;
        }
        else if (property === 'baselineAlignment') {
            value = modifiedProperty.baselineAlignment;
        }
        else if (property === 'strikethrough') {
            value = modifiedProperty.strikethrough;
        }
        else if (property === 'underline') {
            value = modifiedProperty.underline;
        }
        return value;
    };
    /**
     * Add modified properties for table format
     * @param  {WTableFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedTableProperties = function (format, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousTableFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            if (isNullOrUndefined(property)) {
                value = previousTableFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'shading') {
                value = previousTableFormat.shading;
            }
            else {
                value = previousTableFormat.getPropertyValue(property);
            }
            previousTableFormat.copyFormat(format);
            this.currentPropertyIndex++;
        }
        else {
            var currentFormat = new WTableFormat();
            currentFormat.copyFormat(format);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    };
    /**
     * Add modified properties for row format
     * @param  {WRowFormat} rowFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedRowProperties = function (rowFormat, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = rowFormat.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = rowFormat.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            value = previousFormat.getPropertyValue(property);
            previousFormat.copyFormat(rowFormat);
            this.currentPropertyIndex++;
        }
        else {
            var currentFormat = new WRowFormat();
            currentFormat.copyFormat(rowFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    };
    /**
     * Add modified properties for cell format
     * @param  {WCellFormat} cellFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    BaseHistoryInfo.prototype.addModifiedCellProperties = function (cellFormat, property, value) {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
            var previousFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = cellFormat.cloneFormat();
                }
                else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = cellFormat.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'shading') {
                value = previousFormat.shading;
            }
            else {
                value = previousFormat.getPropertyValue(property);
            }
            previousFormat.copyFormat(cellFormat);
            this.currentPropertyIndex++;
        }
        else {
            var currentFormat = new WCellFormat();
            currentFormat.copyFormat(cellFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    };
    /**
     * @private
     */
    BaseHistoryInfo.prototype.destroy = function () {
        this.selectionStart = undefined;
        this.selectionEnd = undefined;
        this.insertPosition = undefined;
        this.endPosition = undefined;
        if (!isNullOrUndefined(this.modifiedNodeLength)) {
            this.modifiedNodeLength = [];
            this.modifiedNodeLength = undefined;
        }
        if (!isNullOrUndefined(this.modifiedProperties)) {
            for (var i = 0; i < this.modifiedProperties.length; i++) {
                var property = this.modifiedProperties[i];
                if (property instanceof WCharacterFormat) {
                    property.destroy();
                }
                else if (property instanceof WParagraphFormat) {
                    property.destroy();
                }
                else if (property instanceof WSectionFormat) {
                    property.destroy();
                }
                else if (property instanceof ModifiedLevel) {
                    property.destroy();
                }
                this.modifiedProperties.splice(this.modifiedProperties.indexOf(property), 1);
                i--;
            }
            this.modifiedPropertiesIn = undefined;
        }
        if (!isNullOrUndefined(this.removedNodes)) {
            for (var i = 0; i < this.removedNodes.length; i++) {
                var node = this.removedNodes[i];
                if (node instanceof ParagraphWidget) {
                    node.destroyInternal(this.viewer);
                }
                else if (node instanceof ElementBox) {
                    node.destroy();
                }
                this.removedNodes.splice(this.removedNodes.indexOf(node), 1);
                i--;
            }
            this.removedNodesIn = undefined;
        }
        this.ownerIn = undefined;
    };
    return BaseHistoryInfo;
}());
export { BaseHistoryInfo };
