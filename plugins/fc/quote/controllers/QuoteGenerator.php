<?php namespace Fc\Quote\Controllers;


use BackendMenu;
use Backend\Classes\Controller;

/**
 * Quote Generator Backend Controller
 */
class QuoteGenerator extends Controller
{
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class,
        \Backend\Behaviors\RelationController::class
    ];

    /**
     * @var string formConfig file
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var string listConfig file
     */
    public $listConfig = 'config_list.yaml';
    public $relationConfig = 'config_relation.yaml';
    /**
     * __construct the controller
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('Fc.Quote', 'quote', 'quotegenerator');
    }
}
