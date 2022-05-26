<?php


namespace PickBazar\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use PickBazar\Facades\Shop;

class TypeMutator
{
    public function storeType($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\TypeController@store', $args);
    }
    public function updateType($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\TypeController@updateType', $args);
    }
}
