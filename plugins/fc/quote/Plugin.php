<?php namespace Fc\Quote;

use Backend;
use System\Classes\PluginBase;

/**
 * quote Plugin Information File
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
            'name'        => 'quote',
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
            'Fc\Quote\Components\CmQuote' => 'CmQuote',
            'Fc\Quote\Components\CmQuoteGenerator' => 'CmQuoteGenerator',
            'Fc\Quote\Components\CmQuoteItem' => 'CmQuoteItem',
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
            'fc.quote.some_permission' => [
                'tab' => 'quote',
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
            'quote' => [
                'label'       => 'quote',
                'url'         => Backend::url('fc/quote/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['fc.quote.*'],
                'order'       => 500,
            ],
        ];
    }
}
