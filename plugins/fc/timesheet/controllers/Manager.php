<?php namespace Fc\Timesheet\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Manager Backend Controller
 */
class Manager extends Controller
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

        BackendMenu::setContext('Fc.Timesheet', 'timesheet', 'manager');
    }
}
