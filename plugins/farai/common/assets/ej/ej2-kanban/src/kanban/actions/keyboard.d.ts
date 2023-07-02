import { Kanban } from '../base';
/**
 * Kanban keyboard module
 * @hidden
 */
export declare class Keyboard {
    private parent;
    private keyboardModule;
    private multiSelection;
    private keyConfigs;
    /**
     * Constructor for keyboard module
     * @private
     */
    constructor(parent: Kanban);
    private keyActionHandler;
    private processCardSelection;
    private processLeftRightArrow;
    private processUpDownArrow;
    private removeSelection;
    cardTabIndexRemove(): void;
    private processEnter;
    addRemoveTabIndex(action: string): void;
    destroy(): void;
}
