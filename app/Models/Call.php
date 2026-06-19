<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Call extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';

    const STATUS_ACCEPTED = 'accepted';

    const STATUS_DECLINED = 'declined';

    const STATUS_BUSY = 'busy';

    const STATUS_MISSED = 'missed';

    const STATUS_FAILED = 'failed';

    const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'caller_id',
        'receiver_id',
        'status',
        'room_name',
        'accepted_at',
        'ended_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    /**
     * Scope: only calls that are truly "active" (blocking a volunteer from receiving new calls).
     *
     * - pending calls created within last 5 minutes
     * - accepted calls updated within last 2 hours (without ended_at)
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->where(function ($inner) {
                $inner->where('status', self::STATUS_PENDING)
                    ->where('created_at', '>=', now()->subMinutes(5));
            })
                ->orWhere(function ($inner) {
                    $inner->where('status', self::STATUS_ACCEPTED)
                        ->whereNull('ended_at')
                        ->where('updated_at', '>=', now()->subHours(2));
                });
        });
    }

    /**
     * Get the caller (difabel).
     */
    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    /**
     * Get the receiver (volunteer).
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
