<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'announcement_id' => 'required|exists:announcements,id',
            'reason' => 'required|string|min:10|max:500',
        ]);

        $announcement = Announcement::findOrFail($request->announcement_id);

        $report = $announcement->reports()->create([
            'reporter_id' => Auth::id(),
            'reporter_name' => Auth::user()->name,
            'sticker_name' => $announcement->sticker_name,
            'reason' => $request->reason,
            'status' => 'Pendente',
        ]);

        return response()->json(['data' => new ReportResource($report)], 201);
    }
}
