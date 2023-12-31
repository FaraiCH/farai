import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ElementBox } from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import { WRowFormat } from '../format/row-format';
/**
 * The revision class which holds the information related to changes made in the document
 */
var Revision = /** @class */ (function () {
    /**
     *
     */
    function Revision(documentHelper, author, date) {
        /**
         * Gets or sets the author name who made the change
         * @private
         */
        this.author = null;
        /**
         * Indicates when the track changes made
         * @private
         */
        this.date = null;
        /**
         * Holds the reference of the items which are under this revision.
         * @private
         */
        this.range = [];
        /**
         * @private
         */
        this.revisionID = '';
        /**
         * Used to update cursor position by ensuring items were removed or not
         */
        this.isContentRemoved = false;
        this.isTableRevision = false;
        /**
         * Indicates whether to skip unlinking ranges for table elements.
         */
        this.canSkipTableItems = false;
        this.skipUnLinkElement = false;
        this.author = author;
        this.date = date;
        this.owner = documentHelper;
    }
    /**
     * Handles Accept reject for the revision
     * @param isFromAccept
     */
    Revision.prototype.handleAcceptReject = function (isFromAccept) {
        this.owner.selection.selectRevision(this);
        var selection = this.owner.selection;
        var startPos = selection.start;
        var endPos = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        var blockInfo = selection.getParagraphInfo(startPos);
        this.owner.editor.initHistory(isFromAccept ? 'Accept Change' : 'Reject Change');
        if (this.revisionType === 'Deletion') {
            blockInfo = selection.getParagraphInfo(this.owner.selection.start);
            selection.editPosition = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        else {
            selection.editPosition = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        this.owner.editor.updateInsertPosition();
        this.isContentRemoved = false;
        this.canSkipTableItems = false;
        this.skipUnLinkElement = false;
        // Implement to accept/reject the revision
        // tslint:disable-next-line:max-line-length
        if (this.revisionType === 'Insertion' || this.revisionType === 'Deletion' || this.revisionType === 'MoveFrom' || this.revisionType === 'MoveTo') {
            var rangeIndex = 0;
            while (this.range.length > 0) {
                // tslint:disable-next-line:max-line-length
                if (this.range[rangeIndex] instanceof ElementBox || this.range[rangeIndex] instanceof WCharacterFormat || this.range[rangeIndex] instanceof WRowFormat) {
                    var moveToNextItem = this.unlinkRangeItem(this.range[rangeIndex], this, isFromAccept);
                    if (moveToNextItem) {
                        rangeIndex++;
                    }
                    else {
                        rangeIndex = 0;
                    }
                }
                else {
                    break;
                }
            }
        }
        this.isTableRevision = false;
        if (this.isContentRemoved) {
            var textPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
            this.owner.selection.selectContent(textPosition, true);
            this.owner.editor.updateEndPosition();
        }
        else {
            selection.selectRange(startPos, endPos);
            this.owner.editor.updateHistoryPosition(endPos, false);
        }
        if (this.owner.editorHistory && this.owner.editorHistory.currentBaseHistoryInfo.action !== 'BackSpace') {
            this.owner.editorHistory.currentBaseHistoryInfo.removedNodes.reverse();
        }
        /* tslint:disable:max-func-body-length */
        if (this.owner.editorHistory) {
            if (this.owner.trackChangesPane.isTrackingPageBreak) {
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'TrackingPageBreak';
            }
            var editorHistory = this.owner.editorHistory;
            // tslint:disable-next-line:max-line-length
            if (editorHistory.currentHistoryInfo && (editorHistory.currentHistoryInfo.action === 'Accept All' || editorHistory.currentHistoryInfo.action === 'Reject All')) {
                if (this.owner.documentHelper.blockToShift) {
                    this.owner.documentHelper.layout.shiftLayoutedItems(false);
                }
            }
            editorHistory.updateHistory();
        }
        this.owner.editor.reLayout(this.owner.selection);
    };
    /**
     * Method which accepts the selected revision, revision marks will be removed and changes will be included in the viewer.
     */
    Revision.prototype.accept = function () {
        this.handleAcceptReject(true);
    };
    /**
     * Method which rejects the selected revision, revision marks will be removed leaving the original content.
     */
    Revision.prototype.reject = function () {
        this.handleAcceptReject(false);
    };
    /**
     * Unlinks revision and its assosiated range
     * @private
     * @param item
     * @param revision
     * @param isFromAccept
     */
    /* tslint:disable:no-any */
    /* tslint:disable:max-func-body-length */
    Revision.prototype.unlinkRangeItem = function (item, revision, isFromAccept) {
        if (this.isTableRevision) {
            this.removeRangeRevisionForItem(item);
            if (revision.range.length === 0) {
                this.owner.revisions.remove(revision);
            }
            return false;
        }
        // tslint:disable-next-line:max-line-length
        var removeChanges = (!isNullOrUndefined(isFromAccept)) && ((revision.revisionType === 'MoveFrom' || revision.revisionType === 'Deletion') && isFromAccept) || ((revision.revisionType === 'Insertion' || revision.revisionType === 'MoveTo') && !isFromAccept);
        if (this.owner.selection.isTOC()) {
            if (removeChanges) {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
                if (revision.range.length === 0) {
                    this.owner.revisions.remove(revision);
                }
                this.isContentRemoved = true;
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'BackSpace';
            }
            else {
                while (this.range.length > 0) {
                    var currentElement = this.range[0];
                    this.removeRangeRevisionForItem(currentElement);
                    if (revision.range.length === 0) {
                        this.owner.revisions.remove(revision);
                    }
                }
                this.owner.editor.addRemovedNodes(this.revisionID);
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'AcceptTOC';
            }
            return false;
        }
        if (item instanceof ElementBox && !this.canSkipTableItems) {
            if (removeChanges) {
                if (!this.skipeElementRemoval(item)) {
                    this.owner.editor.addRemovedNodes(item.clone());
                }
                else {
                    this.skipUnLinkElement = true;
                    return true;
                }
            }
            else {
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'ClearRevisions';
                this.updateRevisionID();
            }
        }
        else if (!this.canSkipTableItems && (item instanceof WCharacterFormat) && (!removeChanges)) {
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'ClearRevisions';
            this.updateRevisionID();
        }
        else if (item instanceof WRowFormat && !removeChanges) {
            this.isTableRevision = true;
            var tableWidget = item.ownerBase.ownerTable;
            var currentRow = item.ownerBase;
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'RemoveRowTrack';
            this.owner.editor.cloneTableToHistoryInfo(tableWidget);
        }
        removeChanges = removeChanges && !this.canSkipTableItems;
        if (item instanceof ElementBox && removeChanges) {
            var currentPara = item.line.paragraph;
            this.removeRevisionItemsFromRange(item);
            this.removeItem(item);
            this.isContentRemoved = true;
            this.owner.documentHelper.layout.reLayoutParagraph(currentPara, 0, 0);
        }
        else if (item instanceof WCharacterFormat && removeChanges) {
            this.isContentRemoved = true;
            this.skipUnLinkElement = false;
            this.removeRevisionItemsFromRange(item);
            if (revision.range.length === 1) {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
            }
            else {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
                var rangeIndex = revision.range.indexOf(item);
                revision.range.splice(rangeIndex, 1);
                while (this.range.length > 0) {
                    this.removeRangeRevisionForItem(this.range[0]);
                }
            }
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'BackSpace';
        }
        else if (item instanceof WRowFormat && removeChanges) {
            var tableWidget = item.ownerBase.ownerTable;
            var currentRow = item.ownerBase;
            this.removeRevisionItemsFromRange(item);
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'DeleteCells';
            this.owner.editor.cloneTableToHistoryInfo(tableWidget);
            this.owner.editor.removeDeletedCellRevision(currentRow);
            this.isContentRemoved = true;
            tableWidget.removeChild(tableWidget.childWidgets.indexOf(currentRow));
            this.canSkipTableItems = true;
            currentRow.destroy();
            if (tableWidget.childWidgets.length === 0) {
                this.owner.selection.editPosition = this.owner.selection.getHierarchicalIndex(tableWidget, '0');
                this.owner.editor.removeBlock(tableWidget);
                tableWidget.destroy();
            }
            else {
                this.owner.editor.updateTable(tableWidget);
            }
        }
        // tslint:disable-next-line:max-line-length
        // if the range is of row format, we will remove the row and for history preservation we use whole table to be cloned, hence skipping this part
        if (!(item instanceof WRowFormat) || !removeChanges) {
            if (!this.skipUnLinkElement) {
                this.removeRangeRevisionForItem(item);
            }
        }
        if (revision.range.length === 0) {
            this.owner.revisions.remove(revision);
        }
        return false;
    };
    Revision.prototype.updateRevisionID = function () {
        this.owner.editor.addRemovedNodes(this.revisionID);
        while (this.range.length > 0) {
            this.removeRangeRevisionForItem(this.range[0]);
        }
    };
    /**
     * If we accept the reject revision or reject the insert revision, corresponding item should be removed its revision collection
     * @param item
     */
    /* tslint:disable:no-any */
    Revision.prototype.removeRevisionItemsFromRange = function (item) {
        if (item.revisions.length > 0) {
            for (var revisionIndex = 0; revisionIndex < item.revisions.length; revisionIndex++) {
                var currentRevision = item.revisions[revisionIndex];
                if (this.revisionID !== currentRevision.revisionID) {
                    var rangeIndex = currentRevision.range.indexOf(item);
                    item.revisions[revisionIndex].range.splice(rangeIndex, 1);
                }
                if (currentRevision.range.length === 0) {
                    this.owner.revisions.remove(currentRevision);
                }
            }
        }
    };
    /**
     * @private
     * Method to clear linked ranges in revision
     */
    /* tslint:disable:no-any */
    Revision.prototype.removeRangeRevisionForItem = function (item) {
        var revisionIndex = item.revisions.indexOf(this);
        if (revisionIndex >= 0) {
            item.revisions.splice(revisionIndex, 1);
            var rangeIndex = this.range.indexOf(item);
            this.range.splice(rangeIndex, 1);
        }
    };
    /**
     * @private
     * @param element
     * @param revision
     */
    Revision.prototype.skipeElementRemoval = function (element) {
        var elementPara = element.paragraph;
        if (elementPara.characterFormat.revisions.length > 0) {
            for (var i = 0; i < elementPara.characterFormat.revisions.length; i++) {
                var currentRevision = elementPara.characterFormat.revisions[i];
                var rangeIndex = currentRevision.range.indexOf(element);
                if (rangeIndex >= 0) {
                    return true;
                }
            }
        }
        return false;
    };
    Revision.prototype.removeRevisionFromRow = function (row) {
        this.owner.editor.unlinkRangeFromRevision(row.rowFormat);
        //this.owner.editor.addRemovedRevisionInfo(row.rowFormat, undefined);
        for (var i = 0; i < row.childWidgets.length; i++) {
            var cellWidget = row.childWidgets[i];
            this.owner.editor.removeRevisionForCell(cellWidget, false);
        }
    };
    /**
     * Method removes item from the widget
     */
    Revision.prototype.removeItem = function (element) {
        var paraWidget = element.line.paragraph;
        this.owner.editor.unLinkFieldCharacter(element);
        var elementIndex = element.line.children.indexOf(element);
        element.line.children.splice(elementIndex, 1);
        this.owner.editor.removeEmptyLine(paraWidget);
    };
    Revision.prototype.canSkipCloning = function () {
        if (!isNullOrUndefined(this.owner) && this.owner.editorHistory && this.owner.editorHistory.currentBaseHistoryInfo) {
            var baseHistoryInfo = this.owner.editorHistory.currentBaseHistoryInfo;
            if (baseHistoryInfo.action === 'DeleteCells') {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     */
    Revision.prototype.clone = function () {
        if (this.canSkipCloning()) {
            return this;
        }
        var revision = new Revision(undefined, this.author, this.date);
        revision.revisionID = this.revisionID;
        revision.revisionType = this.revisionType;
        return revision;
    };
    /**
     * Method to clone the revisions for the element
     * @param revisions | revision array
     */
    Revision.cloneRevisions = function (revisions) {
        var clonedRevisions = [];
        for (var i = 0; i < revisions.length; i++) {
            clonedRevisions.push(revisions[i].revisionID);
        }
        return clonedRevisions;
    };
    return Revision;
}());
export { Revision };
/**
 * Represents the revision collections in the document.
 */
var RevisionCollection = /** @class */ (function () {
    function RevisionCollection(owner) {
        /**
         * @private
         */
        this.changes = [];
        this.owner = owner;
    }
    /**
     * @private
     */
    RevisionCollection.prototype.get = function (index) {
        if (index >= this.changes.length || index < 0) {
            throw new ReferenceError('Provided index is not within the range');
        }
        return this.changes[index];
    };
    Object.defineProperty(RevisionCollection.prototype, "length", {
        get: function () {
            return this.changes.length;
        },
        enumerable: true,
        configurable: true
    });
    RevisionCollection.prototype.remove = function (revision) {
        if (isNullOrUndefined(revision) || this.changes.indexOf(revision) < 0) {
            return;
        }
        this.changes.splice(this.changes.indexOf(revision), 1);
    };
    /**
     * Method which accepts all the revision in the revision collection
     */
    RevisionCollection.prototype.acceptAll = function () {
        this.handleRevisionCollection(true);
    };
    /**
     * Method which rejects all the revision in the revision collection
     */
    RevisionCollection.prototype.rejectAll = function () {
        this.handleRevisionCollection(false);
    };
    /**
     * @private
     * @param isfromAcceptAll
     * @param changes
     */
    RevisionCollection.prototype.handleRevisionCollection = function (isfromAcceptAll, changes) {
        var selection = this.owner.selection;
        var startPos = selection.start;
        var endPos = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        startPos = startPos.clone();
        endPos = endPos.clone();
        if (isfromAcceptAll) {
            this.owner.editor.initComplexHistory('Accept All');
        }
        else {
            this.owner.editor.initComplexHistory('Reject All');
        }
        var revisionCollec = changes ? changes : this.changes;
        while (revisionCollec.length > 0) {
            if (isfromAcceptAll) {
                revisionCollec[0].accept();
            }
            else {
                revisionCollec[0].reject();
            }
            if (changes) {
                revisionCollec.splice(0, 1);
            }
        }
        var textPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
        this.owner.selection.selectContent(textPosition, true);
        if (this.owner.editorHistory) {
            this.owner.editorHistory.updateComplexHistory();
        }
        this.owner.editor.reLayout(this.owner.selection, false);
    };
    RevisionCollection.prototype.destroy = function () {
        this.changes = [];
    };
    return RevisionCollection;
}());
export { RevisionCollection };
