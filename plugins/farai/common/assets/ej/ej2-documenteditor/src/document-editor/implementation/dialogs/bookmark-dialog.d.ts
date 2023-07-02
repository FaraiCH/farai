import { L10n } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
/**
 * The Bookmark dialog is used to add, navigate or delete bookmarks.
 */
export declare class BookmarkDialog {
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    private target;
    private listviewInstance;
    private textBoxInput;
    private addButton;
    private deleteButton;
    private gotoButton;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper);
    /**
     * @private
     */
    getModuleName(): string;
    /**
     * @private
     */
    initBookmarkDialog(localValue: L10n, bookmarks: string[], isRtl?: boolean): void;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    onKeyUpOnTextBox: (event: KeyboardEvent) => void;
    private enableOrDisableButton;
    private addBookmark;
    private selectHandler;
    private focusTextBox;
    private removeObjects;
    private gotoBookmark;
    private deleteBookmark;
    /**
     * @private
     */
    destroy(): void;
}
