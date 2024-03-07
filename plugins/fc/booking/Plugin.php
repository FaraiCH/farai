<?php namespace Fc\Booking;

use Backend;
use System\Classes\PluginBase;

/**
 * booking Plugin Information File
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
            'name'        => 'booking',
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
        return [
            'Fc\Booking\Components\CmBooking' => 'CmBooking',
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
            'fc.booking.some_permission' => [
                'tab' => 'booking',
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
            'booking' => [
                'label'       => 'booking',
                'url'         => Backend::url('fc/booking/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['fc.booking.*'],
                'order'       => 500,
            ],
        ];
    }
}
