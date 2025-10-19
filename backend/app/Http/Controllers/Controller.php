<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="poran.io API Dokumentacija",
 *     description="Platforma za upravljanje sopstvenim vremenom"
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Glavni API server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Unesite Bearer token dobijen pri prijavi"
 * )
 *
 * @OA\Tag(
 *     name="Autentifikacija",
 *     description="Operacije za registraciju, prijavu i odjavu korisnika"
 * )
 *
 * @OA\Tag(
 *     name="Zadaci",
 *     description="CRUD operacije za upravljanje zadacima"
 * )
 *
 * @OA\Tag(
 *     name="Beleške",
 *     description="CRUD operacije za upravljanje beleškama"
 * )
 *
 * @OA\Tag(
 *     name="Aktivnosti",
 *     description="Javne API operacije za dobijanje nasumičnih aktivnosti"
 * )
 *
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin operacije za pristup podacima svih korisnika"
 * )
 */
abstract class Controller
{
    //
}