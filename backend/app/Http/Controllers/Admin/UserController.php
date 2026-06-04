<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => UserResource::collection($users)]);
    }

    public function ban(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Não é possível banir um administrador.'], 422);
        }

        $user->update(['status' => 'Banido']);
        $user->announcements()->update(['status' => 'Pausado']);
        $user->tokens()->delete();

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    public function activate(User $user): JsonResponse
    {
        $user->update(['status' => 'Ativo']);
        $user->announcements()->where('status', 'Pausado')->update(['status' => 'Ativo']);

        return response()->json(['data' => new UserResource($user->fresh())]);
    }
}
