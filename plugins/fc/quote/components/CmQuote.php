<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;

/**
 * CmQuote Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmQuote extends ComponentBase
{
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

    }
}
