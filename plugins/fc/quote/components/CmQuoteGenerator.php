<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;
use Auth;
use Fc\Quote\Models\QuoteGenerator;
use Fc\Quote\Models\QuoteItem;

/**
 * CmQuoteGenerator Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmQuoteGenerator extends ComponentBase
{
    public $user;
    public function componentDetails()
    {
        return [
            'name' => 'cmQuoteGenerator Component',
            'description' => 'No description provided yet...'
        ];
    }

    /**
     * @link https://docs.octobercms.com/3.x/element/inspector-types.html
     */
    public function defineProperties()
    {
        return [];
    }

    public function init()
    {
        $this->user = Auth::getUser();
    }

    public function onGenerate()
    {
        $quoteGenerator = new QuoteGenerator();
        $quoteGenerator->company = \Input::get("company");
        $quoteGenerator->ponumber = \Input::get("ponumber");
        $quoteGenerator->logo = \Input::file("logo");
        $quoteGenerator->address = \Input::get("from");
        $quoteGenerator->billed = \Input::get("billed");
        $quoteGenerator->shipped = \Input::get("shipped");
        $quoteGenerator->prefix = \Input::get("prefix");
        $quoteGenerator->terms = \Input::get("terms");
        $quoteGenerator->user_id = Auth::getUser()->id;
        $quoteGenerator->save();
        $qtys = \Input::get('qty');
        $descriptions = \Input::get('description');
        $price = \Input::get('price');
        $count = 0;
        if(!empty($qtys)){
            foreach ($qtys as $qty){
                $quoteItem = new QuoteItem();
                $quoteItem->units = $qty;
                $quoteItem->description = $descriptions[$count];
                $quoteItem->price = $price[$count];
                $quoteItem->quote_id = $quoteGenerator->id;
                $quoteItem->save();
            }
        }
        \Flash::success("Quote Process Done");
    }

    public function onItems(){

        if(\Input::get('no')){
            $no = \Input::get('no')+1;
            return[
                "#item_new_". $no => $this->renderPartial('@main_item', ['no' => $no]),
                "#button" => $this->renderPartial('@add_button', ['no' => $no]),
                \Flash::success("Item Created")
            ];
        }else{
            return[
                "#item" => $this->renderPartial('@main_item', ['no' => 1]),
                "#button"=> $this->renderPartial('@add_button', ['no' => 1]),
                \Flash::success("Item Created")
            ];
        }

    }
    public function onDeleteItem()
    {
        if(\Input::get('no')){
            $no = \Input::get('no');
            return[
                "#item_". $no => $this->renderPartial('@empty', ['no' => $no]),
                \Flash::success("Item Created")
            ];
        }
    }
}
