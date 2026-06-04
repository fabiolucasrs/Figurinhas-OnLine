<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'announcement_id' => $this->announcement_id,
            'sticker_name' => $this->sticker_name,
            'sticker_number' => $this->sticker_number,
            'sticker_country' => $this->sticker_country,
            'price' => (float) $this->price,
            'seller_name' => $this->seller_name,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
