<?php

namespace PickBazar\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use PickBazar\Events\OrderReceived;
use PickBazar\Notifications\NewOrderReceived;

class SendOrderReceivedNotification implements ShouldQueue
{

    /**
     * Handle the event.
     *
     * @param OrderReceived $event
     * @return void
     */
    public function handle(OrderReceived $event)
    {
        $vendor = $event->order->shop->owner;
        $vendor->notify(new NewOrderReceived($event->order));
    }
}
