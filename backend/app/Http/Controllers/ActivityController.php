<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ActivityController extends Controller
{
    // radnom aktivnost    
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
