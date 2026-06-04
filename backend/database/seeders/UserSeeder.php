<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador do Sistema',
                'password' => Hash::make('123456'),
                'role' => 'admin',
                'balance' => 1500.00,
                'rating' => 5.0,
                'status' => 'Ativo',
            ]
        );

        User::updateOrCreate(
            ['email' => 'joao@email.com'],
            [
                'name' => 'João Silva',
                'password' => Hash::make('123456'),
                'role' => 'user',
                'balance' => 280.50,
                'rating' => 4.8,
                'status' => 'Ativo',
            ]
        );

        User::updateOrCreate(
            ['email' => 'maria@email.com'],
            [
                'name' => 'Maria Oliveira',
                'password' => Hash::make('123456'),
                'role' => 'user',
                'balance' => 420.00,
                'rating' => 4.9,
                'status' => 'Ativo',
            ]
        );

        User::updateOrCreate(
            ['email' => 'carlos@email.com'],
            [
                'name' => 'Carlos Santos',
                'password' => Hash::make('123456'),
                'role' => 'user',
                'balance' => 50.00,
                'rating' => 4.2,
                'status' => 'Ativo',
            ]
        );
    }
}
