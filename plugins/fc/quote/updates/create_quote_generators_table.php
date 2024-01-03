<?php namespace Fc\Quote\Updates;

use Schema;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

/**
 * CreateQuoteGeneratorsTable Migration
 */
class CreateQuoteGeneratorsTable extends Migration
{
    public function up()
    {
        Schema::create('fc_quote_quote_generators', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->nullable()->index();
            $table->string('company');
            $table->string('ponumber');
            $table->string('prefix');
            $table->text('address');
            $table->text('billed');
            $table->text('shipped');
            $table->text('terms');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fc_quote_quote_generators');
    }
}
