import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
/**
 * IndentCellRenderer class which responsible for building group indent cell.
 * @hidden
 */
export declare class IndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {
    element: HTMLElement;
    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    render(cell: Cell<Column>, data: Object): Element;
}
