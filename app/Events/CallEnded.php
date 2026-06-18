<?php

namespace App\Events;

use App\Models\Call;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallEnded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $call;

    public function __construct(Call $call)
    {
        $this->call = $call->load('caller', 'receiver');
    }

    /**
     * Broadcast to BOTH participants so both sides can clean up.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->call->caller_id),
            new PrivateChannel('user.'.$this->call->receiver_id),
        ];
    }
}
