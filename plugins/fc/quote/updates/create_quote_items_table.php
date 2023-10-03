<?php namespace Fc\Quote\Updates;

use Schema;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

/**
 * CreateQuoteItemsTable Migration
 */
class CreateQuoteItemsTable extends Migration
{
    public function up()
    {
        Schema::create('fc_quote_quote_items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description');
            $table->integer('units');
            $table->decimal('price', 15, 2)->nullable();
            $table->integer('quote_id')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down()
    {
//        Schema::dropIfExists('fc_quote_quote_items');
    }
}
