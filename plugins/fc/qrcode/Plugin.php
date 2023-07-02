<?php namespace Fc\Qrcode;

use Backend;
use System\Classes\PluginBase;

/**
 * Plugin Information File
 *
 * @link https://docs.octobercms.com/3.x/extend/system/plugins.html
 */
class Plugin extends PluginBase
{
    /**
     * pluginDetails about this plugin.
     */
    public function pluginDetails()
    {
        return [
            'name' => 'qrcode',
            'description' => 'No description provided yet...',
            'author' => 'fc',
            'icon' => 'icon-leaf'
        ];
    }

    /**
     * register method, called when the plugin is first registered.
     */
    public function register()
    {
        //
    }

    /**
     * boot method, called right before the request route.
     */
    public function boot()
    {
        //
    }

    /**
     * registerComponents used by the frontend.
     */
    public function registerComponents()
    {

        return [
            'Fc\Qrcode\Components\CmpGenerator' => 'CmpGenerator',
        ];
    }

    /**
     * registerPermissions used by the backend.
     */
    public function registerPermissions()
    {
        return []; // Remove this line to activate

        return [
            'fc.qrcode.some_permission' => [
                'tab' => 'qrcode',
                'label' => 'Some permission'
            ],
        ];
    }

    /**
     * registerNavigation used by the backend.
     */
    public function registerNavigation()
    {
        return []; // Remove this line to activate

        return [
            'qrcode' => [
                'label' => 'qrcode',
                'url' => Backend::url('fc/qrcode/mycontroller'),
                'icon' => 'icon-leaf',
                'permissions' => ['fc.qrcode.*'],
                'order' => 500,
            ],
        ];
    }
}
