<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::with('seller')->where('status', 'Ativo');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('sticker_name', 'like', "%{$search}%")
                  ->orWhere('sticker_country', 'like', "%{$search}%")
                  ->orWhere('sticker_number', 'like', "%{$search}%");
            });
        }

        if ($country = $request->get('country')) {
            $query->where('sticker_country', $country);
        }

        if ($position = $request->get('position')) {
            $query->where('sticker_position', $position);
        }

        if ($condition = $request->get('condition')) {
            $query->where('condition', $condition);
        }

        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        $announcements = $query->latest()->paginate(12);

        if (Auth::check()) {
            $favoritedIds = Auth::user()->favorites()->pluck('announcement_id')->toArray();
            $announcements->each(function ($ad) use ($favoritedIds) {
                $ad->is_favorited = in_array($ad->id, $favoritedIds);
            });
        }

        return response()->json(AnnouncementResource::collection($announcements)->response()->getData(true));
    }

    public function featured(): JsonResponse
    {
        $announcements = Announcement::with('seller')
            ->where('status', 'Ativo')
            ->latest()
            ->limit(4)
            ->get();

        return response()->json(['data' => AnnouncementResource::collection($announcements)]);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        $announcement->load('seller');

        if (Auth::check()) {
            $announcement->is_favorited = Auth::user()->favorites()
                ->where('announcement_id', $announcement->id)
                ->exists();
        }

        return response()->json(['data' => new AnnouncementResource($announcement)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sticker_name' => 'required|string|max:255',
            'sticker_country' => 'required|string|max:100',
            'sticker_position' => 'required|in:Goleiro,Defensor,Meio-Campista,Atacante',
            'sticker_number' => 'required|string|max:20',
            'sticker_rarity' => 'required|in:Comum,Rara,Lendária',
            'price' => 'required|numeric|min:0.01',
            'condition' => 'required|in:Nova,Usada,Repetida',
            'quantity' => 'required|integer|min:1|max:99',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('announcements', 'public');
        }

        $announcement = Auth::user()->announcements()->create([
            ...$validated,
            'photo_path' => $photoPath,
            'status' => 'Ativo',
        ]);

        $announcement->load('seller');

        return response()->json(['data' => new AnnouncementResource($announcement)], 201);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        if ($announcement->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Sem permissão para editar este anúncio.'], 403);
        }

        $validated = $request->validate([
            'sticker_name' => 'sometimes|string|max:255',
            'sticker_country' => 'sometimes|string|max:100',
            'sticker_position' => 'sometimes|in:Goleiro,Defensor,Meio-Campista,Atacante',
            'sticker_number' => 'sometimes|string|max:20',
            'sticker_rarity' => 'sometimes|in:Comum,Rara,Lendária',
            'price' => 'sometimes|numeric|min:0.01',
            'condition' => 'sometimes|in:Nova,Usada,Repetida',
            'quantity' => 'sometimes|integer|min:1|max:99',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($announcement->photo_path) {
                Storage::disk('public')->delete($announcement->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('announcements', 'public');
        }

        $announcement->update($validated);
        $announcement->load('seller');

        return response()->json(['data' => new AnnouncementResource($announcement)]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        if ($announcement->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Sem permissão para excluir este anúncio.'], 403);
        }

        $announcement->delete();

        return response()->json(['message' => 'Anúncio excluído com sucesso.']);
    }

    public function toggleStatus(Announcement $announcement): JsonResponse
    {
        if ($announcement->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Sem permissão.'], 403);
        }

        $newStatus = $announcement->status === 'Ativo' ? 'Pausado' : 'Ativo';
        $announcement->update(['status' => $newStatus]);
        $announcement->load('seller');

        return response()->json(['data' => new AnnouncementResource($announcement)]);
    }

    public function mine(Request $request): JsonResponse
    {
        $announcements = Auth::user()->announcements()->with('seller')->latest()->get();

        return response()->json(['data' => AnnouncementResource::collection($announcements)]);
    }
}
