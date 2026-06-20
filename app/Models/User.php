<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'current_team_id', 'role', 'is_offline', 'phone', 'support_type', 'last_call_at', 'age', 'gender', 'bio', 'photo_url'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user is a difabel.
     */
    public function isDifabel(): bool
    {
        return $this->role === 'difabel';
    }

    /**
     * Check if the user is a volunteer.
     */
    public function isVolunteer(): bool
    {
        return $this->role === 'volunteer';
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function friendsOfMine()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    public function friendOf()
    {
        return $this->belongsToMany(User::class, 'friendships', 'friend_id', 'user_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    public function getFriendsAttribute()
    {
        if (! array_key_exists('friends', $this->relations)) {
            $this->setRelation('friends', $this->friendsOfMine->merge($this->friendOf));
        }

        return $this->getRelation('friends');
    }

    public function pendingFriendRequestsSent()
    {
        return $this->hasMany(Friendship::class, 'user_id')->where('status', 'pending');
    }

    public function pendingFriendRequestsReceived()
    {
        return $this->hasMany(Friendship::class, 'friend_id')->where('status', 'pending');
    }
}
