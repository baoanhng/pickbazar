<?php


namespace PickBazar\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use PickBazar\Facades\Shop;

class ProductMutator
{
    public function store($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\ProductController@store', $args);
    }

    public function updateProduct($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\ProductController@updateProduct', $args);
    }

    public function importProducts($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\ProductController@importProducts', $args);
    }
    public function importVariationOptions($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('PickBazar\Http\Controllers\ProductController@importVariationOptions', $args);
    }
}
