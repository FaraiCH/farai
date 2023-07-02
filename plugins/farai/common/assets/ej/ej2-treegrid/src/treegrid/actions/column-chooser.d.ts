import { TreeGrid } from '../base/treegrid';
/**
 * TreeGrid ColumnChooser module
 * @hidden
 */
export declare class ColumnChooser {
    private parent;
    /**
     * Constructor for render module
     */
    constructor(parent?: TreeGrid);
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    openColumnChooser(X?: number, Y?: number): void;
    /**
     * Destroys the openColumnChooser.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName;
}
