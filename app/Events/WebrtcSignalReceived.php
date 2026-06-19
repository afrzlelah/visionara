<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WebrtcSignalReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $callId;

    public int $senderId;

    public array $signal;

    protected int $targetUserId;

    /**
     * Create a new event instance.
     */
    public function __construct(int $callId, int $senderId, int $targetUserId, array $signal)
    {
        $this->callId = $callId;
        $this->senderId = $senderId;
        $this->targetUserId = $targetUserId;
        $this->signal = $signal;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->targetUserId),
        ];
    }
}
