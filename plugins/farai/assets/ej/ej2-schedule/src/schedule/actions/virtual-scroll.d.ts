import { TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
/**
 * Virtual Scroll
 */
export declare class VirtualScroll {
    private parent;
    private translateY;
    private itemSize;
    bufferCount: number;
    private renderedLength;
    private averageRowHeight;
    private startIndex;
    private timeValue;
    private isScrollHeightNull;
    private previousTop;
    constructor(parent: Schedule);
    private addEventListener;
    private removeEventListener;
    getRenderedCount(): number;
    private triggerScrolling;
    setTranslateValue(): void;
    private renderVirtualTrackHeight;
    renderVirtualTrack(contentWrap: Element): void;
    updateVirtualScrollHeight(): void;
    updateVirtualTrackHeight(wrap: HTMLElement): void;
    setItemSize(): void;
    private beforeInvoke;
    virtualScrolling(): void;
    private upScroll;
    private downScroll;
    updateContent(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, resCollection: TdData[]): void;
    private getBufferCollection;
    private setTranslate;
    destroy(): void;
}
