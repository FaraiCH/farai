<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;
use Auth;
use Fc\Quote\Models\QuoteGenerator;

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
        $quoteGenerator->ponumber = \Input::get("company");
        $quoteGenerator->logo = \Input::file("logo");
        $quoteGenerator->from = \Input::get("company");
        $quoteGenerator->billed = \Input::get("company");
        $quoteGenerator->shipped = \Input::get("company");
        $quoteGenerator->terms = \Input::get("company");
        $quoteGenerator->user_id = Auth::getUser()->id;
        $quoteGenerator->save();
        \Flash::success("Quote Process Done");
    }
}
