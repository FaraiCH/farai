import { Tooltip } from '@syncfusion/ej2-popups';
import { Kanban } from '../base';
/**
 * Tooltip for Kanban board
 * @hidden
 */
export declare class KanbanTooltip {
    private parent;
    tooltipObj: Tooltip;
    /**
     * Constructor for tooltip module
     * @private
     */
    constructor(parent: Kanban);
    private renderTooltip;
    private onBeforeRender;
    private onBeforeClose;
    destroy(): void;
}
