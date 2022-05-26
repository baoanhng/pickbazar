<?php


namespace PickBazar\GraphQL\Mutation;

use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use PickBazar\Facades\Shop;

class CheckoutMutator
{

    public function verify($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\CheckoutController@verify', $args);
    }
}
