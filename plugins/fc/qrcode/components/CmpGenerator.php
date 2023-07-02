<?php namespace Fc\Qrcode\Components;

use Auth;
use Cms\Classes\ComponentBase;

/**
 * CmpGenerator Component
 */
class CmpGenerator extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'CmpGenerator Component',
            'description' => 'No description provided yet...'
        ];
    }

    public function defineProperties()
    {
        return [];
    }
    public function loadAssets(){
        $this->addCss('/plugins/farai/common/assets/ej/ej2/bootstrap4.css', '1.0.0');
    }
    public function onRun()
    {
        $this->loadAssets();
    }

    public function onQRCode(){
        $qrvalue = \Input::get('qrvalue');
        $qrcolor = \Input::get('qrcolor');
        $user = Auth::getUser();
        return [
            '#qrcode_holder' => $this->renderPartial('@qrccode_holder.htm',['qrvalue' => $qrvalue, 'qrcolor' => $qrcolor, 'user' => $user])
        ];
    }
}
