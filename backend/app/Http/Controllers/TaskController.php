<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * prikaz svih zadataka ulogovanog korisnika sa paginacijom
     */
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->paginate(10);
        
        return response()->json([
            'message' => 'Zadaci uspešno učitani',
            'data' => $tasks
        ]);
    }

   
     // kreiranje novog zadatka
     
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

    
     //prikaz određenog zadatka
     
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

    //ažuriranje zadatka
     
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

   
     // brisanje taska
     
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
}
