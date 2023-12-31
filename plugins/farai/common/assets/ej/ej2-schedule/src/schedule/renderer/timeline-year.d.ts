import { Schedule } from '../base/schedule';
import { Year } from './year';
/**
 * timeline year view
 */
export declare class TimelineYear extends Year {
    viewClass: string;
    isInverseTableSelect: boolean;
    /**
     * Constructor for timeline year view
     */
    constructor(parent: Schedule);
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    renderHeader(headerWrapper: HTMLElement): void;
    private renderResourceHeader;
    renderContent(contentWrapper: HTMLElement): void;
    private renderDefaultContent;
    private renderResourceContent;
    private renderCellTemplate;
    scrollToDate(scrollDate: Date): void;
    getScrollableElement(): Element;
}
