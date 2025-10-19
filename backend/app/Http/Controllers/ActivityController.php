<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use OpenApi\Annotations as OA;

class ActivityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/random-activity",
     *     summary="Dobijanje nasumične aktivnosti",
     *     tags={"Aktivnosti"},
     *     description="Dobija nasumičnu aktivnost sa javnog API-ja. Ova ruta ne zahteva autentifikaciju.",
     *     @OA\Response(
     *         response=200,
     *         description="Uspešno dobijena aktivnost",
     *         @OA\JsonContent(
     *             @OA\Property(property="activity", type="string", example="Learn a new programming language"),
     *             @OA\Property(property="type", type="string", example="education"),
     *             @OA\Property(property="participants", type="integer", example=1),
     *             @OA\Property(property="price", type="number", format="float", example=0.1),
     *             @OA\Property(property="link", type="string", example=""),
     *             @OA\Property(property="key", type="string", example="5881028"),
     *             @OA\Property(property="accessibility", type="number", format="float", example=0.2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=503,
     *         description="API za aktivnosti trenutno nije dostupan",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Nije moguće dobiti aktivnost"),
     *             @OA\Property(property="message", type="string", example="API za aktivnosti trenutno nije dostupan")
     *         )
     *     )
     * )
     */
    public function getRandomActivity()
    {
        // api call
        $response = Http::get('https://bored-api.appbrewery.com/random');
        
        // provera 
        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json([
                'error' => 'Nije moguće dobiti aktivnost',
                'message' => 'API za aktivnosti trenutno nije dostupan'
            ], 503);
        }
    }
}
