<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;

/**
 * CmQuoteItem Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmQuoteItem extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'cmQuoteItem Component',
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
    public function onRun()
    {

    }
}
