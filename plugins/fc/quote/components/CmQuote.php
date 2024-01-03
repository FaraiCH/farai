<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;
use Fc\Quote\Models\QuoteGenerator;
use RainLab\User\Models\User;
use Auth;
/**
 * CmQuote Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmQuote extends ComponentBase
{
    public $quote;
    public $user;

    public function componentDetails()
    {
        return [
            'name' => 'cmQuote Component',
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

    public function onRun()
    {
        $this->quote = QuoteGenerator::all();
        $this->user = Auth::getUser();
    }
}
