import { Spreadsheet } from '../base';
/**
 * Specifes to create or modify overlay.
 * @hidden
 */
export declare class Overlay {
    private parent;
    private minHeight;
    private minWidth;
    private isOverlayClicked;
    private isResizerClicked;
    private originalMouseX;
    private originalMouseY;
    private originalWidth;
    private originalHeight;
    private currentWidth;
    private currenHeight;
    private originalResizeLeft;
    private originalResizeTop;
    private originalReorderLeft;
    private originalReorderTop;
    private resizedReorderLeft;
    private resizedReorderTop;
    private resizer;
    private diffX;
    private diffY;
    /**
     * Constructor for initializing Overlay service.
     */
    constructor(parent: Spreadsheet);
    /**
     * To insert a shape.
     * @hidden
     */
    insertOverlayElement(id: string, range: string, sheetIndex: number): HTMLElement;
    private addEventListener;
    private overlayMouseMoveHandler;
    private overlayMouseUpHandler;
    private overlayClickHandler;
    private renderResizeHandles;
    private removeEventListener;
    /**
     * To clear private variables.
     */
    destroy(): void;
}
