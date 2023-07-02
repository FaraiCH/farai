import { PivotView } from '../base/pivotview';
import { IAxisSet, IDataSet } from '../../base';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
/**
 * `DrillThrough` module.
 */
export declare class DrillThrough {
    private parent;
    /**
     * @hidden
     */
    drillThroughDialog: DrillThroughDialog;
    /**
     * Constructor.
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
    private unWireEvents;
    private mouseClickHandler;
    /** @hidden */
    executeDrillThrough(pivotValue: IAxisSet, rowIndex: number, colIndex: number, element?: Element): void;
    private frameData;
    /** @hidden */
    triggerDialog(valueCaption: string, aggType: string, rawData: IDataSet[], pivotValue: IAxisSet, element: Element): void;
}
