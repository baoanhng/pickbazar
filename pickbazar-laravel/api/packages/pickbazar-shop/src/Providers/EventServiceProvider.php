<?php

namespace PickBazar\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use PickBazar\Events\OrderCreated;
use PickBazar\Events\OrderReceived;
use PickBazar\Listeners\ManageProductInventory;
use PickBazar\Listeners\SendOrderCreationNotification;
use PickBazar\Listeners\SendOrderReceivedNotification;

class EventServiceProvider extends ServiceProvider
{

    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        OrderCreated::class => [
            SendOrderCreationNotification::class,
            ManageProductInventory::class,
        ],
        OrderReceived::class => [
            SendOrderReceivedNotification::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
