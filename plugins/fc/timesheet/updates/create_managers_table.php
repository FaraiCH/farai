<?php namespace Fc\Timesheet\Updates;

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
        Schema::create('fc_timesheet_managers', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fc_timesheet_managers');
    }
}
