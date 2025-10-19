<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Annotations as OA;

class TaskController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/tasks",
     *     summary="Prikaz svih zadataka korisnika",
     *     tags={"Zadaci"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="completed",
     *         in="query",
     *         description="Filtriranje po statusu završetka",
     *         required=false,
     *         @OA\Schema(type="boolean", example=true)
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Pretraga po naslovu zadatka",
     *         required=false,
     *         @OA\Schema(type="string", example="važan zadatak")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Broj stranice za paginaciju",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Zadaci uspešno učitani",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Zadaci uspešno učitani"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Task")),
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
        $query = $request->user()->tasks();

        // ovde filtrira po tome da li je zavrsen ili ne
        if ($request->has('completed')) {
            $completed = filter_var($request->completed, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_completed', $completed);
        }

        // ovde pretrazuje po naslovu
        if ($request->has('search') && !empty($request->search)) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $tasks = $query->paginate(10);
        
        return response()->json([
            'message' => 'Zadaci uspešno učitani',
            'data' => $tasks
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/tasks",
     *     summary="Kreiranje novog zadatka",
     *     tags={"Zadaci"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Podaci za kreiranje zadatka",
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="Kupiti mleko"),
     *             @OA\Property(property="is_completed", type="boolean", example=false),
     *             @OA\Property(property="due_date", type="string", format="date", example="2024-12-31")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Zadatak uspešno kreiran",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Zadatak uspešno kreiran"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
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
            'is_completed' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija neuspešna',
                'errors' => $validator->errors()
            ], 422);
        }

        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'is_completed' => $request->is_completed ?? false,
            'due_date' => $request->due_date,
        ]);

        return response()->json([
            'message' => 'Zadatak uspešno kreiran',
            'data' => $task
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/tasks/{task}",
     *     summary="Prikaz određenog zadatka",
     *     tags={"Zadaci"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         description="ID zadatka",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Zadatak uspešno učitan",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Zadatak nije pronađen"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function show(Request $request, string $id)
    {
        $task = $request->user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Zadatak nije pronađen'
            ], 404);
        }

        return response()->json([
            'data' => $task
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/tasks/{task}",
     *     summary="Ažuriranje zadatka",
     *     tags={"Zadaci"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         description="ID zadatka",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Podaci za ažuriranje zadatka",
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Kupiti mleko"),
     *             @OA\Property(property="is_completed", type="boolean", example=true),
     *             @OA\Property(property="due_date", type="string", format="date", example="2024-12-31")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Zadatak uspešno ažuriran",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Zadatak uspešno ažuriran"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Zadatak nije pronađen"
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
        $task = $request->user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Zadatak nije pronađen'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'is_completed' => 'sometimes|boolean',
            'due_date' => 'sometimes|nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija neuspešna',
                'errors' => $validator->errors()
            ], 422);
        }

        $task->update($request->only(['title', 'is_completed', 'due_date']));

        return response()->json([
            'message' => 'Zadatak uspešno ažuriran',
            'data' => $task
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/tasks/{task}",
     *     summary="Brisanje zadatka",
     *     tags={"Zadaci"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         description="ID zadatka",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Zadatak uspešno obrisan",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Zadatak uspešno obrisan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Zadatak nije pronađen"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovan pristup"
     *     )
     * )
     */
    public function destroy(Request $request, string $id)
    {
        $task = $request->user()->tasks()->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Zadatak nije pronađen'
            ], 404);
        }

        $task->delete();

        return response()->json([
            'message' => 'Zadatak uspešno obrisan'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{user}/tasks",
     *     summary="Prikaz zadataka određenog korisnika (Admin funkcija)",
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
     *         description="Zadaci korisnika uspešno učitani",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Zadaci korisnika Pera Peric uspešno učitani"),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Task")),
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
    public function TasksOdUser(User $user)
    {
        $tasks = $user->tasks()->paginate(10);
        
        return response()->json([
            'message' => "Zadaci korisnika {$user->name} uspešno učitani",
            'user' => $user,
            'data' => $tasks
        ]);
    }
}
