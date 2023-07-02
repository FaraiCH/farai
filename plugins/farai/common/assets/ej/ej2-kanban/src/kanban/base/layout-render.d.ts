import { Kanban } from '../base/kanban';
import { HeaderArgs } from '../base/interface';
import { MobileLayout } from './mobile-layout';
/**
 * Kanban layout rendering module
 * @hidden
 */
export declare class LayoutRender extends MobileLayout {
    parent: Kanban;
    kanbanRows: HeaderArgs[];
    columnKeys: string[];
    swimlaneIndex: number;
    scrollLeft: number;
    private swimlaneRow;
    columnData: {
        [key: string]: Object[];
    };
    swimlaneData: {
        [key: string]: Object[];
    };
    /**
     * Constructor for layout module
     * @private
     */
    constructor(parent: Kanban);
    private initRender;
    private renderHeader;
    private renderContent;
    private initializeSwimlaneTree;
    private renderSwimlaneRow;
    private renderCards;
    private renderCard;
    private renderEmptyCard;
    private renderColGroup;
    private getRows;
    private swimlaneSorting;
    private createStackedRow;
    private scrollUiUpdate;
    private onContentScroll;
    private onColumnScroll;
    private onAdaptiveScroll;
    private isColumnVisible;
    private renderLimits;
    private renderValidation;
    private refreshValidation;
    getColumnData(columnValue: string, dataSource?: Object[]): Object[];
    private sortCategory;
    sortOrder(key: string, direction: string, cardData: Object[]): Object[];
    private documentClick;
    disableAttributeSelection(cards: HTMLElement[] | Element): void;
    getColumnCards(data?: Object[]): {
        [key: string]: Object[];
    };
    getSwimlaneCards(): {
        [key: string]: Object[];
    };
    refreshHeaders(): void;
    refreshCards(): void;
    refresh(): void;
    updateScrollPosition(): void;
    renderCardBasedOnIndex(data: {
        [key: string]: Object;
    }, index?: number): void;
    removeCard(data: {
        [key: string]: Object;
    }): void;
    wireEvents(): void;
    unWireEvents(): void;
    wireDragEvent(): void;
    unWireDragEvent(): void;
    destroy(): void;
}
