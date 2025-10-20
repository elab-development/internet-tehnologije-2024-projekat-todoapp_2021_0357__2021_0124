<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Annotations as OA;

class NoteController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/notes",
     *     summary="Prikaz svih beleški korisnika",
     *     tags={"Beleške"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Broj stranice za paginaciju",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Beleške uspešno učitane",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Beleške uspešno učitane"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Note")),
     *                 @OA\Property(property="last_page", type="integer"),
     *                 @OA\Property(property="per_page", type="integer"),
     *                 @OA\Property(property="total", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = $request->user()->notes()->with('tags');

        // jednostavan filter po nazivu taga: ?tag=ime
        if ($request->filled('tag')) {
            $tagName = $request->query('tag');
            $query->whereHas('tags', function ($q) use ($tagName) {
                $q->where('name', $tagName);
            });
        }

        $notes = $query->paginate(10);
        
        return response()->json([
            'message' => 'Beleške uspešno učitane',
            'data' => $notes
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/notes",
     *     summary="Kreiranje nove beleške",
     *     tags={"Beleške"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Podaci za kreiranje beleške",
     *         @OA\JsonContent(
     *             required={"title","content"},
     *             @OA\Property(property="title", type="string", example="Moja beleška"),
     *             @OA\Property(property="content", type="string", example="Sadržaj beleške...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Beleška uspešno kreirana",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Beleška uspešno kreirana"),
     *             @OA\Property(property="data", ref="#/components/schemas/Note")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Greška pri validaciji"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:255',
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

        // Ako su prosleđeni tagovi kao imena, kreiraj ih po potrebi i poveži
        if ($request->filled('tags') && is_array($request->tags)) {
            $tagIds = collect($request->tags)
                ->filter(fn ($name) => is_string($name) && trim($name) !== '')
                ->map(function ($name) {
                    return Tag::firstOrCreate(['name' => trim($name)])->id;
                })
                ->unique()
                ->values()
                ->all();

            if (!empty($tagIds)) {
                $note->tags()->sync($tagIds);
            }
        }

        $note->load('tags');

        return response()->json([
            'message' => 'Beleška uspešno kreirana',
            'data' => $note
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/notes/{note}",
     *     summary="Prikaz određene beleške",
     *     tags={"Beleške"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID beleške",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Beleška uspešno učitanа",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Note")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Beleška nije pronađena"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function show(Request $request, string $id)
    {
        $note = $request->user()->notes()->with('tags')->find($id);

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
     * @OA\Put(
     *     path="/api/notes/{note}",
     *     summary="Ažuriranje beleške",
     *     tags={"Beleške"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID beleške",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Podaci za ažuriranje beleške",
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Ažurirana beleška"),
     *             @OA\Property(property="content", type="string", example="Novi sadržaj beleške...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Beleška uspešno ažurirana",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Beleška uspešno ažurirana"),
     *             @OA\Property(property="data", ref="#/components/schemas/Note")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Beleška nije pronađena"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Greška pri validaciji"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
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
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija neuspešna',
                'errors' => $validator->errors()
            ], 422);
        }

        $note->update($request->only(['title', 'content']));

        // ako su prosleđeni tagovi, ažuriraj pivot
        if ($request->has('tags') && is_array($request->tags)) {
            $tagIds = collect($request->tags)
                ->filter(fn ($name) => is_string($name) && trim($name) !== '')
                ->map(function ($name) {
                    return Tag::firstOrCreate(['name' => trim($name)])->id;
                })
                ->unique()
                ->values()
                ->all();

            $note->tags()->sync($tagIds);
        }

        $note->load('tags');

        return response()->json([
            'message' => 'Beleška uspešno ažurirana',
            'data' => $note
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/notes/{note}",
     *     summary="Brisanje beleške",
     *     tags={"Beleške"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="note",
     *         in="path",
     *         description="ID beleške",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Beleška uspešno obrisana",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Beleška uspešno obrisana")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Beleška nije pronađena"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
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

    /**
     * @OA\Get(
     *     path="/api/users/{user}/notes",
     *     summary="Prikaz beleški određenog korisnika (Admin funkcija)",
     *     tags={"Admin"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="ID korisnika",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Beleške korisnika uspešno učitane",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Beleške korisnika Pera Peric uspešno učitane"),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Note")),
     *                 @OA\Property(property="last_page", type="integer"),
     *                 @OA\Property(property="per_page", type="integer"),
     *                 @OA\Property(property="total", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Nemate dozvolu za pristup"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function NotesOdUser(User $user)
    {
        $notes = $user->notes()->with('tags')->paginate(10);
        
        return response()->json([
            'message' => "Beleške korisnika {$user->name} uspešno učitane",
            'user' => $user,
            'data' => $notes
        ]);
    }
}
