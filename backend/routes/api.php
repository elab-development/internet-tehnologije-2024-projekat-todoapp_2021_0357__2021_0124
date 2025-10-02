<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// rute za autentifikaciju
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// javne ruta
Route::get('/random-activity', [ActivityController::class, 'getRandomActivity']);

// zaštićene rute
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // rute za beleške
    Route::apiResource('notes', NoteController::class);
    
    // zadaci posle
    Route::apiResource('tasks', TaskController::class);
    
    // proba za admin midlver
    Route::get('/admin/test', function () {
        return response()->json(['message' => 'Korisnik je admin']);
    })->middleware('admin');
    
    // nested ruta za admin pristup beleškama bilo kog korisnika
    Route::get('/users/{user}/notes', [NoteController::class, 'NotesOdUser'])
        ->middleware('admin');
    
    // nested ruta za admin pristup zadacima bilo kog korisnika
    Route::get('/users/{user}/tasks', [TaskController::class, 'TasksOdUser'])
        ->middleware('admin');
});
