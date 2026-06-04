<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::with('seller');

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $announcements = $query->latest()->get();

        return response()->json(['data' => AnnouncementResource::collection($announcements)]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->reports()->update(['status' => 'Resolvida']);
        $announcement->delete();

        return response()->json(['message' => 'Anúncio removido com sucesso.']);
    }
}
