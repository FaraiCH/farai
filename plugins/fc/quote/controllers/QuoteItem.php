<?php namespace Fc\Quote\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Quote Item Backend Controller
 */
class QuoteItem extends Controller
{
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var string formConfig file
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var string listConfig file
     */
    public $listConfig = 'config_list.yaml';

    /**
     * __construct the controller
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('Fc.Quote', 'quote', 'quoteitem');
    }
}
