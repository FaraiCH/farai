/**
 * Barcode util
 */
import { BarcodeRenderer } from './../../barcode/rendering/renderer';
import { BarcodeCanvasRenderer } from './../../barcode/rendering/canvas-renderer';
/** @private */
export function removeChildElements(newProp, barcodeCanvas, mode, id) {
    var barCodeSVG = barcodeCanvas;
    if (mode === 'SVG' && !newProp.mode) {
        barCodeSVG.innerHTML = '';
    }
    else if (newProp.mode) {
        barCodeSVG.parentNode.removeChild(barCodeSVG);
    }
    return new BarcodeRenderer(id, mode === 'SVG');
}
/** @private */
export function getBaseAttributes(width, height, offSetX, offsetY, color, strokeColor) {
    var options = {
        width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
    };
    return options;
}
/** @private */
export function clearCanvas(view, barcodeCanvas) {
    var width;
    var height;
    width = view.element.offsetWidth * 1.5;
    height = view.element.offsetHeight * 1.5;
    var ctx = BarcodeCanvasRenderer.getContext(barcodeCanvas);
    ctx.clearRect(0, 0, width, height);
}
/** @private */
export function refreshCanvasBarcode(qrCodeGenerator, barcodeCanvas) {
    clearCanvas(qrCodeGenerator, barcodeCanvas);
}
/** @private */
export function triggerDownload(type, fileName, url) {
    var anchorElement = document.createElement('a');
    anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
    anchorElement.href = url;
    anchorElement.click();
}
/** @private */
export function exportAsImage(exportType, fileName, element, isReturnBase64, code) {
    var returnValue = imageExport(exportType, fileName, element, isReturnBase64, code);
    if (returnValue instanceof Promise) {
        returnValue.then(function (data) {
            return data;
        });
    }
    return returnValue;
}
/** @private */
export function imageExport(type, fileName, element, isReturnBase64, code) {
    /* tslint:disable */
    var promise = new Promise(function (resolve, reject) {
        var canvas = element.children[0];
        /* tslint:enable */
        var serializer = 'XMLSerializer';
        var canvasElement = document.createElement('canvas');
        canvasElement.height = element.clientHeight;
        canvasElement.width = element.clientWidth;
        var context = canvasElement.getContext('2d');
        var image = new Image();
        image.onload = function () {
            context.drawImage(image, 0, 0);
            if (!isReturnBase64) {
                triggerDownload(type, fileName, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                resolve(null);
            }
            else {
                var base64String = (type === 'JPG') ? canvasElement.toDataURL('image/jpg') :
                    canvasElement.toDataURL('image/png');
                resolve(base64String);
            }
        };
        if (code.mode === 'Canvas') {
            image.src = (type === 'JPG') ? canvas.toDataURL('image/jpg') : canvas.toDataURL('image/png');
            canvasElement.height = element.clientHeight * 1.5;
            canvasElement.width = element.clientWidth * 1.5;
            context.scale(2 / 3, 2 / 3);
        }
        else {
            image.src = window.URL.createObjectURL(new Blob([new window[serializer]().serializeToString(element.children[0])], { type: 'image/svg+xml' }));
        }
    });
    return promise;
}
