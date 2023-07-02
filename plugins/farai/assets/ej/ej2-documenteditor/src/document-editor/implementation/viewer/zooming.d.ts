import { LayoutViewer, DocumentHelper } from './viewer';
/**
 * @private
 */
export declare class Zoom {
    private documentHelper;
    setZoomFactor(value: number): void;
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    private onZoomFactorChanged;
    private zoom;
    onMouseWheelInternal: (event: WheelEvent) => void;
}
