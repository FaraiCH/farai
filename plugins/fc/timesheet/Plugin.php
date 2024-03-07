<?php namespace Fc\Timesheet;

use Backend;
use System\Classes\PluginBase;

/**
 * timesheet Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'timesheet',
            'description' => 'No description provided yet...',
            'author'      => 'fc',
            'icon'        => 'icon-leaf'
        ];
    }

    /**
     * Register method, called when the plugin is first registered.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Boot method, called right before the request route.
     *
     * @return void
     */
    public function boot()
    {

    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return []; // Remove this line to activate

        return [
            'Fc\Timesheet\Components\MyComponent' => 'myComponent',
        ];
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return []; // Remove this line to activate

        return [
            'fc.timesheet.some_permission' => [
                'tab' => 'timesheet',
                'label' => 'Some permission'
            ],
        ];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return []; // Remove this line to activate

        return [
            'timesheet' => [
                'label'       => 'timesheet',
                'url'         => Backend::url('fc/timesheet/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['fc.timesheet.*'],
                'order'       => 500,
            ],
        ];
    }
}
