<?php

use Fc\Quote\Models\QuoteGenerator;
use Renatio\DynamicPDF\Classes\PDF;
use RainLab\User\Facades\Auth;

Route::any('/quote/preview/stream/{id}', function ($id){
    $user = Auth::getUser();
    if(!empty($user)){
        $quote = QuoteGenerator::where('user_id',  $user->id)->where('id', $id)->first();
        if(!empty($quote)){
            $pdf = PDF::loadView('fc.quote::pdfQuote', ['quote' => $quote]);
            return $pdf->setPaper('a4')->stream('Quote No: ' . $quote->prefix . '.pdf');
        }else{
            return view('fc.quote::fail');
        }
    }else{
        return view('fc.quote::fail');
    }
})->middleware('web');;
