<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;

/**
 * CmPreview Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmPreview extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'CmPreview Component',
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

    public function onRun(){

    }
}
