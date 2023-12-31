import { Spreadsheet } from '../base/index';
import { RefreshArgs } from '../common/index';
/**
 * Render module is used to render the spreadsheet
 * @hidden
 */
export declare class Render {
    private parent;
    constructor(parent: Spreadsheet);
    render(): void;
    private checkTopLeftCell;
    private renderSheet;
    refreshUI(args: RefreshArgs, address?: string, initLoad?: boolean): void;
    private removeSheet;
    /**
     * Refresh the active sheet
     */
    refreshSheet(): void;
    /**
     * Used to set sheet panel size.
     */
    setSheetPanelSize(): void;
    private roundValue;
    /**
     * Registing the renderer related services.
     */
    private instantiateRenderer;
    /**
     * Destroy the Render module.
     * @return {void}
     */
    destroy(): void;
    private addEventListener;
    private removeEventListener;
}
