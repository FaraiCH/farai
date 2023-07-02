/**
 * Barcode util
 */
import { BarcodeRenderer } from './../../barcode/rendering/renderer';
import { QRCodeGeneratorModel } from '../../qrcode/qrcode-model';
import { DataMatrixGeneratorModel } from '../../datamatrix/datamatrix-model';
import { QRCodeGenerator } from '../../qrcode/qrcode';
import { DataMatrixGenerator } from '../../datamatrix/datamatrix';
import { RenderingMode } from '../enum/enum';
import { BaseAttributes } from './../../barcode/rendering/canvas-interface';
import { BarcodeGenerator } from '../barcode';
/** @private */
export declare function removeChildElements(newProp: QRCodeGeneratorModel | DataMatrixGeneratorModel, barcodeCanvas: HTMLElement, mode: RenderingMode, id: string): BarcodeRenderer;
/** @private */
export declare function getBaseAttributes(width: number, height: number, offSetX: number, offsetY: number, color: string, strokeColor?: string): BaseAttributes;
/** @private */
export declare function clearCanvas(view: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void;
/** @private */
export declare function refreshCanvasBarcode(qrCodeGenerator: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void;
/** @private */
export declare function triggerDownload(type: string, fileName: string, url: string): void;
/** @private */
export declare function exportAsImage(exportType: string, fileName: string, element: Element, isReturnBase64: boolean, code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string>;
/** @private */
export declare function imageExport(type: string, fileName: string, element: Element, isReturnBase64: boolean, code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string>;
