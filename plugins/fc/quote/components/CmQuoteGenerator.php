<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;
use Auth;
use Fc\Quote\Models\QuoteGenerator;
use Fc\Quote\Models\QuoteItem;
use Renatio\DynamicPDF\Classes\PDF;

/**
 * CmQuoteGenerator Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmQuoteGenerator extends ComponentBase
{
    public $user;
    public $quote;
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
        return [
            'item' => [
                'title'       => 'Quote Item',
                'description' => 'Slug for business item',
                'default'     => '{{ :item }}',
                'type'        => 'integer'
            ],
        ];
    }

    public function init()
    {
        $item = $this->property('item');
        if(!empty(Auth::getUser())){
            $this->user = Auth::getUser();
            if(!empty($item)){
                $this->quote = QuoteGenerator::where('id', $item)->where('user_id',  $this->user->id)->first();;
            }
        }
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
                $count++;
            }
        }
        return \Redirect::to('/quote/preview/'. $quoteGenerator->id);
    }

    public function onItems(){

        if(\Input::get('no')){
            $no = \Input::get('no')+1;
            return[
                "#item_new_". $no => $this->renderPartial('@main_item', ['no' => $no]),
                "#button" => $this->renderPartial('@add_button', ['no' => $no]),
                \Flash::success("Item Created For Edit!")
            ];
        }else{
            return[
                "#item" => $this->renderPartial('@main_item', ['no' => 1]),
                "#button"=> $this->renderPartial('@add_button', ['no' => 1]),
                \Flash::success("Item Created For Edit!")
            ];
        }

    }
    public function onDeleteItem()
    {
        if(\Input::get('no')){
            $no = \Input::get('no');
            return[
                "#item_". $no => $this->renderPartial('@empty', ['no' => $no]),
                \Flash::success("Item Deleted!")
            ];
        }
    }

    public function onEdit(){
        if(\Input::has('id')){
            $quoteGenerator = QuoteGenerator::find(\Input::get('id'));
            $quoteGenerator->company = \Input::get("company");
            $quoteGenerator->ponumber = \Input::get("ponumber");
            if(!empty(\Input::file("logo")))
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
            QuoteItem::where('quote_id', $quoteGenerator->id)->delete();
            if(!empty($qtys)){
                foreach ($qtys as $qty){
                    $quoteItem = new QuoteItem();
                    $quoteItem->units = $qty;
                    $quoteItem->description = $descriptions[$count];
                    $quoteItem->price = $price[$count];
                    $quoteItem->quote_id = $quoteGenerator->id;
                    $quoteItem->save();
                    $count++;
                }
            }
            return \Redirect::to('/quote/preview/'. $quoteGenerator->id);
        }

    }
}
