<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Models\Announcement;
use App\Models\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(): JsonResponse
    {
        $purchases = Auth::user()->purchases()->latest()->get();

        return response()->json(['data' => PurchaseResource::collection($purchases)]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'announcement_id' => 'required|exists:announcements,id',
        ]);

        $announcement = Announcement::with('seller')->findOrFail($request->announcement_id);
        $buyer = Auth::user();

        if ($announcement->seller_id === $buyer->id) {
            return response()->json(['message' => 'Você não pode comprar sua própria figurinha.'], 422);
        }

        if ($announcement->status !== 'Ativo' || $announcement->quantity <= 0) {
            return response()->json(['message' => 'Esta figurinha não está disponível para venda.'], 422);
        }

        if ($buyer->balance < $announcement->price) {
            return response()->json(['message' => 'Saldo insuficiente para realizar esta compra.'], 422);
        }

        DB::transaction(function () use ($announcement, $buyer) {
            $buyer->decrement('balance', $announcement->price);
            $announcement->seller->increment('balance', $announcement->price);
            $announcement->decrement('quantity');

            if ($announcement->quantity <= 0) {
                $announcement->update(['status' => 'Vendido']);
            }

            Purchase::create([
                'announcement_id' => $announcement->id,
                'buyer_id' => $buyer->id,
                'sticker_name' => $announcement->sticker_name,
                'sticker_number' => $announcement->sticker_number,
                'sticker_country' => $announcement->sticker_country,
                'price' => $announcement->price,
                'seller_name' => $announcement->seller->name,
                'status' => 'Pendente',
            ]);
        });

        $purchase = $buyer->purchases()->latest()->first();

        return response()->json(['data' => new PurchaseResource($purchase)], 201);
    }
}
