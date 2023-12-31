import { PivotCommon } from '../base/pivot-common';
/**
 * Keyboard interaction
 */
/** @hidden */
export declare class CommonKeyboardInteraction {
    private parent;
    private keyConfigs;
    private keyboardModule;
    private timeOutObj;
    /**
     * Constructor
     */
    constructor(parent: PivotCommon);
    private keyActionHandler;
    private getButtonElement;
    private processEnter;
    private processSort;
    private processEdit;
    private processFilter;
    private processFilterNodeSelection;
    private processDelete;
    private processClose;
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    destroy(): void;
}
