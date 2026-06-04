<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'announcement_id' => $this->announcement_id,
            'sticker_name' => $this->sticker_name,
            'reporter_name' => $this->reporter_name,
            'reason' => $this->reason,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
