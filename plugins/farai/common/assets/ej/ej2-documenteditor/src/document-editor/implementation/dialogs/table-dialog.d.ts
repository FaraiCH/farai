import { L10n } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
/**
 * The Table dialog is used to insert table at selection.
 */
export declare class TableDialog {
    private columnsCountBox;
    private rowsCountBox;
    private target;
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    private columnValueTexBox;
    private rowValueTextBox;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper);
    private getModuleName;
    /**
     * @private
     */
    initTableDialog(localValue: L10n): void;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    keyUpInsertTable: (event: KeyboardEvent) => void;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    onInsertTableClick: () => void;
    /**
     * @private
     */
    destroy(): void;
}
