<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $joao = User::where('email', 'joao@email.com')->first();
        $maria = User::where('email', 'maria@email.com')->first();
        $carlos = User::where('email', 'carlos@email.com')->first();

        $announcements = [
            [
                'seller_id' => $joao->id,
                'sticker_name' => 'Vinícius Júnior',
                'sticker_country' => 'Brasil',
                'sticker_position' => 'Atacante',
                'sticker_number' => 'BRA-11',
                'sticker_rarity' => 'Lendária',
                'price' => 150.00,
                'condition' => 'Nova',
                'quantity' => 1,
                'description' => 'Figurinha Lendária dourada em estado impecável, tirada diretamente do pacotinho para o protetor de plástico.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $maria->id,
                'sticker_name' => 'Lionel Messi',
                'sticker_country' => 'Argentina',
                'sticker_position' => 'Atacante',
                'sticker_number' => 'ARG-10',
                'sticker_rarity' => 'Lendária',
                'price' => 180.00,
                'condition' => 'Nova',
                'quantity' => 1,
                'description' => 'Item de colecionador! Figurinha Legend do Messi extra. Aceito negociações ou trocas por repetidas do Brasil.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $carlos->id,
                'sticker_name' => 'Neymar Jr',
                'sticker_country' => 'Brasil',
                'sticker_position' => 'Meio-Campista',
                'sticker_number' => 'BRA-10',
                'sticker_rarity' => 'Lendária',
                'price' => 120.00,
                'condition' => 'Repetida',
                'quantity' => 2,
                'description' => 'Tenho duas repetidas do Neymar Jr. Ambas em excelente estado de conservação, sem dobras ou marcas de manuseio.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $joao->id,
                'sticker_name' => 'Kylian Mbappé',
                'sticker_country' => 'França',
                'sticker_position' => 'Atacante',
                'sticker_number' => 'FRA-10',
                'sticker_rarity' => 'Lendária',
                'price' => 140.00,
                'condition' => 'Nova',
                'quantity' => 1,
                'description' => 'Figurinha do Mbappé em perfeito estado. Oportunidade única para completar a coleção da França.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $maria->id,
                'sticker_name' => 'Cristiano Ronaldo',
                'sticker_country' => 'Portugal',
                'sticker_position' => 'Atacante',
                'sticker_number' => 'POR-7',
                'sticker_rarity' => 'Lendária',
                'price' => 175.00,
                'condition' => 'Nova',
                'quantity' => 1,
                'description' => 'CR7 Lendária! Uma das figuras mais procuradas do álbum da Copa 2026.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $carlos->id,
                'sticker_name' => 'Rodri',
                'sticker_country' => 'Espanha',
                'sticker_position' => 'Meio-Campista',
                'sticker_number' => 'ESP-16',
                'sticker_rarity' => 'Rara',
                'price' => 45.00,
                'condition' => 'Usada',
                'quantity' => 1,
                'description' => 'Figurinha rara do Rodri, vencedor da Bola de Ouro. Em bom estado.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $joao->id,
                'sticker_name' => 'Jude Bellingham',
                'sticker_country' => 'Inglaterra',
                'sticker_position' => 'Meio-Campista',
                'sticker_number' => 'ENG-10',
                'sticker_rarity' => 'Rara',
                'price' => 60.00,
                'condition' => 'Nova',
                'quantity' => 3,
                'description' => 'Tenho 3 figurinhas do Bellingham. Excelente para troca ou venda.',
                'status' => 'Ativo',
            ],
            [
                'seller_id' => $maria->id,
                'sticker_name' => 'Erling Haaland',
                'sticker_country' => 'Holanda',
                'sticker_position' => 'Atacante',
                'sticker_number' => 'NOR-9',
                'sticker_rarity' => 'Rara',
                'price' => 55.00,
                'condition' => 'Nova',
                'quantity' => 2,
                'description' => 'Duas figurinhas do artilheiro norueguês em estado perfeito.',
                'status' => 'Ativo',
            ],
        ];

        foreach ($announcements as $data) {
            Announcement::updateOrCreate(
                [
                    'seller_id' => $data['seller_id'],
                    'sticker_number' => $data['sticker_number'],
                ],
                $data
            );
        }
    }
}
