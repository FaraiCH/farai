import { Gantt } from '../base/gantt';
/**
 * Gantt Virtual Scroll module will handle Virtualization
 * @hidden
 */
export declare class VirtualScroll {
    private parent;
    constructor(parent?: Gantt);
    /**
     * Get module name
     */
    protected getModuleName(): string;
    /**
     * Bind virtual-scroll related properties from Gantt to TreeGrid
     */
    private bindTreeGridProperties;
    /**
     * @private
     */
    getTopPosition(): number;
    /**
     * To destroy the virtual scroll module.
     * @return {void}
     * @private
     */
    destroy(): void;
}
