<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use App\Models\Task;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // kreiraj 5 korisnika
        $users = User::factory(5)->create();

        // za svakog korisnika kreiraj 10 beleški i 15 zadataka
        foreach ($users as $user) {
            // kreiraj 10 nasmičnih beleški za korisnika
            Note::factory(10)->create([
                'user_id' => $user->id,
            ]);

            // kreiraj 15 nasumičnih zadataka za korisnika
            Task::factory(15)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
