import { DocumentEditor } from '../../document-editor';
import { BlockWidget, TableWidget } from '../viewer/page';
import { CollaborativeEditingEventArgs } from './editor-helper';
/**
 * Collaborative editing module
 */
export declare class CollaborativeEditing {
    private owner;
    private version;
    private lockStart;
    private saveTimer;
    /**
     * @private
     */
    private readonly documentHelper;
    private readonly selection;
    private readonly collaborativeEditingSettings;
    /**
     * @private
     */
    constructor(editor: DocumentEditor);
    /**
     * @private
     */
    getModuleName(): string;
    /**
     * To update the action which need to perform.
     */
    updateAction(data: CollaborativeEditingEventArgs | CollaborativeEditingEventArgs[]): void;
    private transFormLockRegion;
    /**
     * Lock selected region from editing by other users.
     */
    lockContent(user: string): void;
    /**
     * @private
     */
    canLock(): boolean;
    private getPreviousLockedRegion;
    /**
     * @private
     */
    unlockContent(user: string): void;
    private removeEditRange;
    /**
     * Save locked content to other clients.
     * @private
     */
    saveContent(): void;
    private saveContentInternal;
    private serializeEditableRegion;
    private successHandler;
    private failureHandler;
    /**
     * Locker specified region for specified user.
     * @private
     */
    lockRegion(start: string, end: string, user: string): void;
    private lockRegionInternal;
    /**
     * @private
     */
    private insertElements;
    /**
     * @private
     */
    private insertElementsInternal;
    private insertElementInternal;
    private setEditableRegion;
    private isSelectionInEditableRange;
    /**
     * Updated modified content from remote user
     */
    updateRegion(user: string, content: string): void;
    private updateRevisionCollection;
    private getRevisionTextPosition;
    private tranformSelection;
    private tranformHistoryPosition;
    private transformHistory;
    private transformBaseHistoryInfo;
    private tranformPosition;
    private getParentBlock;
    private removeDuplicateCollection;
    /**
     * @private
     */
    removeFieldInBlock(block: BlockWidget, isBookmark?: boolean, contentControl?: boolean): void;
    /**
     * @private
     */
    removeFieldTable(table: TableWidget, isBookmark?: boolean, contentControl?: boolean): void;
    private removeComment;
    /**
     * @private
     */
    private updateNextBlocksIndex;
    /**
     * @private
     */
    updateLockRegion(user?: string, isLocked?: boolean): void;
    private updateLockInfo;
    /**
     * Pull pending actions from server.
     */
    pullAction(): void;
    /**
     * Destroy collaborative editing module.
     */
    destroy(): void;
}
