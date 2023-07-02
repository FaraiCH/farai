import { DocumentEditor } from '../../document-editor';
import { BaseHistoryInfo } from './base-history-info';
import { EditRangeStartElementBox } from '../viewer/page';
import { DocumentHelper } from '../viewer';
/**
 * EditorHistory preservation class
 */
/**
 * @private
 */
export declare class HistoryInfo extends BaseHistoryInfo {
    documentHelper: DocumentHelper;
    /**
     * @private
     */
    modifiedActions: BaseHistoryInfo[];
    private isChildHistoryInfo;
    editRangeStart: EditRangeStartElementBox;
    /**
     * @private
     */
    readonly hasAction: boolean;
    constructor(node: DocumentEditor, isChild: boolean);
    /**
     * Adds the modified actions
     * @param  {BaseHistoryInfo} baseHistoryInfo
     * @private
     */
    addModifiedAction(baseHistoryInfo: BaseHistoryInfo): void;
    /**
     * Reverts this instance
     * @private
     */
    revert(): void;
    /**
     * @private
     */
    destroy(): void;
}
