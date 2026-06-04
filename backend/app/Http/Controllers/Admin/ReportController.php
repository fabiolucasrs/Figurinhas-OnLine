<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Report::query();

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $reports = $query->latest()->get();

        return response()->json(['data' => ReportResource::collection($reports)]);
    }

    public function resolve(Report $report): JsonResponse
    {
        $report->update(['status' => 'Resolvida']);

        return response()->json(['data' => new ReportResource($report)]);
    }

    public function ignore(Report $report): JsonResponse
    {
        $report->update(['status' => 'Resolvida']);

        return response()->json(['data' => new ReportResource($report)]);
    }
}
