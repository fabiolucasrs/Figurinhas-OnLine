<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Purchase;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_users' => User::where('role', 'user')->count(),
                'active_announcements' => Announcement::where('status', 'Ativo')->count(),
                'total_purchases' => Purchase::count(),
                'pending_reports' => Report::where('status', 'Pendente')->count(),
            ],
        ]);
    }
}
