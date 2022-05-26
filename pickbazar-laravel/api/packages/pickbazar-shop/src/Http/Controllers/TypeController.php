<?php

namespace PickBazar\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PickBazar\Database\Models\Type;
use PickBazar\Database\Repositories\TypeRepository;
use PickBazar\Exceptions\PickbazarException;
use PickBazar\Http\Requests\TypeRequest;
use Prettus\Validator\Exceptions\ValidatorException;

class TypeController extends CoreController
{
    public $repository;

    public function __construct(TypeRepository $repository)
    {
        $this->repository = $repository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Type[]
     */
    public function index(Request $request)
    {
        return $this->repository->all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TypeRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(TypeRequest $request)
    {
        return $this->repository->storeType($request);
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function show($slug)
    {
        try {
            return $this->repository->with('banners')->findOneByFieldOrFail('slug', $slug);
        } catch (\Exception $e) {
            throw new PickbazarException('PICKBAZAR_ERROR.NOT_FOUND');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TypeRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TypeRequest $request, $id)
    {
        $request->id = $id;
        return $this->updateType($request);
        // try {
        //     $validatedData = $request->validated();
        //     return $this->repository->findOrFail($id)->update($validatedData);
        // } catch (\Exception $e) {
        //     throw new PickbazarException('PICKBAZAR_ERROR.NOT_FOUND');
        // }
    }

    public function updateType(TypeRequest $request)
    {
        try {
            $type = $this->repository->with('banners')->findOrFail($request->id);
        } catch (\Exception $e) {
            Log::debug($e->getMessage());
            throw new PickbazarException('PICKBAZAR_ERROR.NOT_FOUND');
        }
        return $this->repository->updateType($request, $type);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new PickbazarException('PICKBAZAR_ERROR.NOT_FOUND');
        }
    }
}
