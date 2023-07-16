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
        $this->addJs('/plugins/farai/common/assets/ej/ej2/dist/ej2.min.js', '1.0.0');

    }
    public function onRun()
    {
        $this->loadAssets();
    }

    public function onQRCode(){
        $qrvalue = \Input::get('color');
        $color = \Input::get('val');
        $user = Auth::getUser();
        return [
            '#qrcode_holder' => $this->renderPartial('@qrccode_holder.htm',['qrvalue' => $qrvalue, 'user' => $user, 'choseColor' => $color])
        ];
    }
}
