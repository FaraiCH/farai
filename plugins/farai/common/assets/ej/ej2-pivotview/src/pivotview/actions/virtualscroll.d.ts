import { PivotView } from '../base/pivotview';
/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
export declare class VirtualScroll {
    private parent;
    private previousValues;
    private frozenPreviousValues;
    private pageXY;
    private eventType;
    private engineModule;
    /** @hidden */
    direction: string;
    private keyboardEvents;
    /**
     * Constructor for PivotView scrolling.
     * @hidden
     */
    constructor(parent?: PivotView);
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    getModuleName(): string;
    private addInternalEvents;
    private wireEvents;
    private onWheelScroll;
    private getPointXY;
    private onTouchScroll;
    private update;
    private setPageXY;
    private common;
    private onHorizondalScroll;
    private onVerticalScroll;
    /**
     * @hidden
     */
    removeInternalEvents(): void;
    /**
     * To destroy the virtualscrolling event listener
     * @return {void}
     * @hidden
     */
    destroy(): void;
}
