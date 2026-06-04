<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/announcements/featured', [AnnouncementController::class, 'featured']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
    Route::patch('/announcements/{announcement}/toggle-status', [AnnouncementController::class, 'toggleStatus']);
    Route::get('/announcements/mine', [AnnouncementController::class, 'mine']);

    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::post('/purchases', [PurchaseController::class, 'store']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{announcement}', [FavoriteController::class, 'toggle']);

    Route::post('/reports', [ReportController::class, 'store']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/ban', [AdminUserController::class, 'ban']);
        Route::patch('/users/{user}/activate', [AdminUserController::class, 'activate']);

        Route::get('/announcements', [AdminAnnouncementController::class, 'index']);
        Route::delete('/announcements/{announcement}', [AdminAnnouncementController::class, 'destroy']);

        Route::get('/reports', [AdminReportController::class, 'index']);
        Route::patch('/reports/{report}/resolve', [AdminReportController::class, 'resolve']);
        Route::patch('/reports/{report}/ignore', [AdminReportController::class, 'ignore']);
    });
});
