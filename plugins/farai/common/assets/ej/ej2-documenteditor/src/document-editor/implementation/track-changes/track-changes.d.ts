import { RevisionType } from '../../base';
import { DocumentEditor } from '../../document-editor';
import { ElementBox } from '../viewer/page';
/**
 * The revision class which holds the information related to changes made in the document
 */
export declare class Revision {
    /**
     * Gets or sets the author name who made the change
     * @private
     */
    author: string;
    /**
     * Indicates when the track changes made
     * @private
     */
    date: string;
    /**
     * Indicates the type of track changes revision
     * @private
     */
    revisionType: RevisionType;
    /**
     * Holds the reference of the items which are under this revision.
     * @private
     */
    range: object[];
    /**
     * @private
     */
    revisionID: string;
    private owner;
    /**
     * Used to update cursor position by ensuring items were removed or not
     */
    private isContentRemoved;
    private isTableRevision;
    /**
     * Indicates whether to skip unlinking ranges for table elements.
     */
    private canSkipTableItems;
    private skipUnLinkElement;
    /**
     *
     */
    constructor(documentHelper: DocumentEditor, author: string, date: string);
    /**
     * Handles Accept reject for the revision
     * @param isFromAccept
     */
    private handleAcceptReject;
    /**
     * Method which accepts the selected revision, revision marks will be removed and changes will be included in the viewer.
     */
    accept(): void;
    /**
     * Method which rejects the selected revision, revision marks will be removed leaving the original content.
     */
    reject(): void;
    /**
     * Unlinks revision and its assosiated range
     * @private
     * @param item
     * @param revision
     * @param isFromAccept
     */
    unlinkRangeItem(item: any, revision: Revision, isFromAccept: boolean): boolean;
    private updateRevisionID;
    /**
     * If we accept the reject revision or reject the insert revision, corresponding item should be removed its revision collection
     * @param item
     */
    private removeRevisionItemsFromRange;
    /**
     * @private
     * Method to clear linked ranges in revision
     */
    removeRangeRevisionForItem(item: any): void;
    /**
     * @private
     * @param element
     * @param revision
     */
    skipeElementRemoval(element: ElementBox): boolean;
    private removeRevisionFromRow;
    /**
     * Method removes item from the widget
     */
    private removeItem;
    private canSkipCloning;
    /**
     * @private
     */
    clone(): Revision;
    /**
     * Method to clone the revisions for the element
     * @param revisions | revision array
     */
    static cloneRevisions(revisions: Revision[]): string[];
}
/**
 * Represents the revision collections in the document.
 */
export declare class RevisionCollection {
    /**
     * @private
     */
    changes: Revision[];
    private owner;
    /**
     * @private
     */
    get(index: number): Revision;
    readonly length: number;
    constructor(owner: DocumentEditor);
    remove(revision: Revision): any;
    /**
     * Method which accepts all the revision in the revision collection
     */
    acceptAll(): void;
    /**
     * Method which rejects all the revision in the revision collection
     */
    rejectAll(): void;
    /**
     * @private
     * @param isfromAcceptAll
     * @param changes
     */
    handleRevisionCollection(isfromAcceptAll: boolean, changes?: Revision[]): void;
    destroy(): void;
}
