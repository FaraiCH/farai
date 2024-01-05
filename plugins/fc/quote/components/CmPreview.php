<?php namespace Fc\Quote\Components;

use Cms\Classes\ComponentBase;
use Fc\Quote\Models\QuoteGenerator;
use Auth;
/**
 * CmPreview Component
 *
 * @link https://docs.octobercms.com/3.x/extend/cms-components.html
 */
class CmPreview extends ComponentBase
{
    public $quote;
    public $user;
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
        $item = $this->property('item');
        $this->user = Auth::getUser();
        if(!empty($this->user)){
            $quoteMade = QuoteGenerator::where('user_id',  $this->user->id)->where('id', $item)->first();
            if(!empty($quoteMade)){
                $this->quote = $quoteMade;
            }else{
                $this->quote = [];
            }
        }
    }
}
