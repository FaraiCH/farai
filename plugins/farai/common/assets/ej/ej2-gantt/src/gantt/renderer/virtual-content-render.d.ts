import { Gantt } from '../base/gantt';
/**
 * virtual Content renderer for Gantt
 */
export declare class VirtualContentRenderer {
    private parent;
    private wrapper;
    constructor(parent: Gantt);
    /**
     * To render a wrapper for chart body content when virtualization is enabled.
     * @hidden
     */
    renderWrapper(height?: number): void;
    /**
     * To append child elements for wrappered element when virtualization is enabled.
     * @hidden
     */
    appendChildElements(element: HTMLElement): void;
    /**
     * To adjust gantt content table's style when virtualization is enabled
     * @hidden
     */
    adjustTable(): void;
}
