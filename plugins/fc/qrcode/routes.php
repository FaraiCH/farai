<?php
use October\Rain\Html\HtmlBuilder;
use Illuminate\Support\HtmlString;

Route::any('/qrcode/api/v1/getcode/{apikey}/{value}/{color}', function ($apikey, $value, $color){

    $div = '<div id="barcode"></div>';
    $script = '
    <link href="/plugins/farai/common/assets/ej/ej2/bootstrap4.css" rel="stylesheet">
            <script src="/plugins/farai/common/assets/ej/ej2/dist/ej2.min.js"></script>
            <script>
                var barcodeValue = "'. $value . '";
                var barcode = new ej.barcodegenerator.BarcodeGenerator({
                    type: "Code39",
                    value: barcodeValue
                });
                barcode.appendTo("#barcode");
            </script>
        ';
    $grand = new HtmlString($div . $script);

    $imageData = $grand->__toString();
    $image = Image::make($imageData);
    trace_log($image);
    return Response::view('fc.qrcode::api');
});

