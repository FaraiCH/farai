<?php namespace Eddie\Delivery\Updates;

use Schema;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

/**
 * CreateManagersTable Migration
 */
class CreateManagersTable extends Migration
{
    public function up()
    {
        Schema::create('eddie_delivery_managers', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('eddie_delivery_managers');
    }
}
