<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    /**
     * prikaz svih beleški ulogovanog korisnika sa paginacijom
     */
    public function index(Request $request)
    {
        $notes = $request->user()->notes()->paginate(10);
        
        return response()->json([
            'message' => 'Beleške uspešno učitane',
            'data' => $notes
        ]);
    }

    /**
     * kreiranje nove beleške
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija neuspešna',
                'errors' => $validator->errors()
            ], 422);
        }

        $note = $request->user()->notes()->create([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Beleška uspešno kreirana',
            'data' => $note
        ], 201);
    }

    /**
     * prikaz određene beleške
     */
    public function show(Request $request, string $id)
    {
        $note = $request->user()->notes()->find($id);

        if (!$note) {
            return response()->json([
                'message' => 'Beleška nije pronađena'
            ], 404);
        }

        return response()->json([
            'data' => $note
        ]);
    }

    /**
     * ažuriranje beleške
     */
    public function update(Request $request, string $id)
    {
        $note = $request->user()->notes()->find($id);

        if (!$note) {
            return response()->json([
                'message' => 'Beleška nije pronađena'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija neuspešna',
                'errors' => $validator->errors()
            ], 422);
        }

        $note->update($request->only(['title', 'content']));

        return response()->json([
            'message' => 'Beleška uspešno ažurirana',
            'data' => $note
        ]);
    }

    /**
     * brisanje beleške
     */
    public function destroy(Request $request, string $id)
    {
        $note = $request->user()->notes()->find($id);

        if (!$note) {
            return response()->json([
                'message' => 'Beleška nije pronađena'
            ], 404);
        }

        $note->delete();

        return response()->json([
            'message' => 'Beleška uspešno obrisana'
        ]);
    }

    // čitanje beleški za određenog korisnika (ali admin funkcija)

    public function NotesOdUser(User $user)
    {
        $notes = $user->notes()->paginate(10);
        
        return response()->json([
            'message' => "Beleške korisnika {$user->name} uspešno učitane",
            'user' => $user,
            'data' => $notes
        ]);
    }
}
