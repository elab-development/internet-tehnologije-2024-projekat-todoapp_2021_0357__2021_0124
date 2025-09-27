<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'is_completed' => $this->faker->boolean(30), // 30% šanse da bude završen
            'due_date' => $this->faker->optional(0.7)->dateTimeBetween('now', '+1 month'),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
