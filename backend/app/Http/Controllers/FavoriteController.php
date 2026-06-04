<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index(): JsonResponse
    {
        $favorites = Auth::user()
            ->favorites()
            ->with('announcement.seller')
            ->latest()
            ->get()
            ->pluck('announcement')
            ->filter()
            ->map(function ($ad) {
                $ad->is_favorited = true;
                return $ad;
            });

        return response()->json(['data' => AnnouncementResource::collection($favorites)]);
    }

    public function toggle(Announcement $announcement): JsonResponse
    {
        $user = Auth::user();
        $existing = $user->favorites()->where('announcement_id', $announcement->id)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favorited' => false]);
        }

        $user->favorites()->create(['announcement_id' => $announcement->id]);

        return response()->json(['favorited' => true]);
    }
}
