import { Gantt } from '../base/gantt';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
/**
 * Focus module is used to handle certain action on focus elements in keyboard navigations.
 */
export declare class FocusModule {
    private parent;
    private activeElement;
    private previousActiveElement;
    constructor(parent: Gantt);
    getActiveElement(isPreviousActiveElement?: boolean): HTMLElement;
    setActiveElement(element: HTMLElement): void;
    /**
     * To perform key interaction in Gantt
     * @private
     */
    onKeyPress(e: KeyboardEventArgs): void | boolean;
    private upDownKeyNavigate;
    private expandCollapseKey;
}
