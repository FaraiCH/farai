<?php namespace Fc\Booking\Updates;

use Schema;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

/**
 * CreateUserBookingsTable Migration
 */
class CreateUserBookingsTable extends Migration
{
    public function up()
    {
        Schema::create('fc_booking_user_bookings', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fc_booking_user_bookings');
    }
}
