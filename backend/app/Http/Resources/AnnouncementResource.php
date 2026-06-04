<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sticker_name' => $this->sticker_name,
            'sticker_country' => $this->sticker_country,
            'sticker_position' => $this->sticker_position,
            'sticker_number' => $this->sticker_number,
            'sticker_rarity' => $this->sticker_rarity,
            'photo_url' => $this->photo_url,
            'price' => (float) $this->price,
            'condition' => $this->condition,
            'quantity' => (int) $this->quantity,
            'description' => $this->description,
            'status' => $this->status,
            'seller' => [
                'id' => $this->seller->id,
                'name' => $this->seller->name,
                'rating' => (float) $this->seller->rating,
                'avatar' => $this->seller->avatar,
            ],
            'is_favorited' => $this->is_favorited ?? false,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
