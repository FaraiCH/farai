import { Column, NotifyArgs, SentinelType } from '@syncfusion/ej2-grids';
import { Offsets, VirtualInfo, ServiceLocator, IGrid, IModelGenerator } from '@syncfusion/ej2-grids';
import { VirtualContentRenderer } from '@syncfusion/ej2-grids';
import { InterSectionObserver } from '@syncfusion/ej2-grids';
export declare class VirtualTreeContentRenderer extends VirtualContentRenderer {
    getModelGenerator(): IModelGenerator<Column>;
    constructor(parent: IGrid, locator?: ServiceLocator);
    private isExpandCollapse;
    private observers;
    private translateY;
    private maxiPage;
    private rowPosition;
    private addRowIndex;
    private ariaRowIndex;
    private recordAdded;
    /** @hidden */
    startIndex: number;
    private endIndex;
    private totalRecords;
    private contents;
    private fn;
    private preTranslate;
    private isRemoteExpand;
    private previousInfo;
    /** @hidden */
    isDataSourceChanged: boolean;
    getRowByIndex(index: number): Element;
    addEventListener(): void;
    private virtualOtherAction;
    private indexModifier;
    eventListener(action: string): void;
    protected onDataReady(e?: NotifyArgs): void;
    renderTable(): void;
    protected getTranslateY(sTop: number, cHeight: number, info?: VirtualInfo, isOnenter?: boolean): number;
    private beginEdit;
    private beginAdd;
    private restoreEditState;
    private resetIseditValue;
    private virtualEditSuccess;
    private cancelEdit;
    private restoreNewRow;
    private getData;
    private onActionComplete;
    scrollListeners(scrollArgs: ScrollArg): void;
    appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void;
    removeEventListener(): void;
}
export declare class TreeInterSectionObserver extends InterSectionObserver {
    private isWheeling;
    private newPos;
    private lastPos;
    private timer;
    observes(callback: Function): void;
    private clear;
    private virtualScrollHandlers;
}
declare type ScrollArg = {
    direction: string;
    isWheel: boolean;
    sentinel: SentinelType;
    offset: Offsets;
    focusElement: HTMLElement;
};
export {};
