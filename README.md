# poran.io - Platforma za upravljanje sopstvenim vremenom

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

Poranio je aplikacija za upravljanje vremenom, zadacima i beleškama, inspirisana aplikacijom Notion. Projekat je razvijen kao deo predmeta Internet Tehnologije, na Fakultetu organizacionih nauka, Univerzitet u Beogradu.

## Sadržaj

- [O projektu](#o-projektu)
- [Funkcionalnosti](#funkcionalnosti)
- [Tehnologije](#tehnologije)
- [Instalacija](#instalacija)
- [Pokretanje](#pokretanje)
- [Struktura projekta](#struktura-projekta)
- [API Dokumentacija](#api-dokumentacija)
- [Autori](#autori)

##  O projektu

**poran.io** je platforma za organizaciju vremena koja pomaže korisnicima da upravljaju svojim zadacima, beleškama i aktivnostima na jednom mestu. Aplikacija kombinuje Laravel backend sa  React frontend-om, a kroz minimalistički dizajn pruža prilično intuitivno korisničko iskustvo.

### Glavne karakteristike:

-  **Upravljanje beleškama** - Kreirajte, organizujte i pretražujte beleške
-  **Upravljanje zadacima** - Pratite zadatke
-  **Kalendar** - Vizualizujte zadatke na kalendaru sa pregledom po datumima
-  **Random aktivnosti** - Dobijte predloge za aktivnosti kada ne znate šta da radite
-  **Autentifikacija** - Sigurna prijava i registracija korisnika
-  **Dark mode** - Podrška za tamnu i svetlu temu
-  **Responsivnost** - Prilagođeno za razne veličine ekrana

##  Funkcionalnosti

### Beleške (Notes)
- Kreiranje, čitanje, ažuriranje i brisanje beležaka (CRUD)
- Dodavanje tagova za bolju organizaciju
- Pretraga beležaka
- Paginacija rezultata

### Zadaci (Tasks)
- Kompletno CRUD upravljanje zadacima
- Postavljanje rokova (due dates)
- Označavanje zadataka kao završenih
- Pretraga po naslovu
- Filtriranje po statusu (završeni/nezavršeni)
- Paginacija

### Kalendar
- Vizualni prikaz zadataka po datumima
- Indikatori za završene i nezavršene zadatke
- Klik na datum za pregled zadataka
- Statistika (ukupno, završeni, nezavršeni)

### Aktivnosti
- Integracija sa Bored API
- Predlozi random aktivnosti
- Dodavanje aktivnosti direktno u zadatke
- Informacije o tipu i broju učesnika

### Autentifikacija i Autorizacija
- Registracija novih korisnika
- Prijava sa generisanjem tokena
- Zaštita ruta pomoću Sanctum middleware
- Korisnički profili
- Admin uloga za napredne funkcionalnosti

## Tehnologije

### Backend
- **Framework:** Laravel 11
- **Autentifikacija:** Laravel Sanctum
- **Baza podataka:** MySQL
- **API Dokumentacija:** L5-Swagger (OpenAPI)

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Notifikacije:** React Hot Toast
- **Kalendar:** React Calendar
- **Build Tool:** Vite

## Instalacija

### Preduslov

Proverite da imate instalirano:
- PHP >= 8.2
- Composer
- Node.js >= 18
- npm ili yarn
- SQLite ekstenzija za PHP

### Backend Setup

```bash
# Navigirajte u backend folder
cd backend

# Instalirajte zavisnosti
composer install

# Kopirajte .env fajl
cp .env.example .env

# Generišite application key
php artisan key:generate

# Kreirajte bazu podataka (SQLite)
touch database/database.sqlite

# Pokrenite migracije
php artisan migrate

# (Opciono) Popunite bazu sa test podacima
php artisan db:seed
```

### Frontend Setup

```bash
# Navigirajte u frontend folder
cd frontend

# Instalirajte zavisnosti
npm install

# Kopirajte environment fajl (ako postoji)
# cp .env.example .env
```

## Pokretanje

### Pokretanje Backend-a

```bash
cd backend

# Pokrenite development server
php artisan serve

# Server će biti dostupan na http://localhost:8000
```

**Alternativno**, možete koristiti Docker:

```bash
cd backend
docker-compose up -d
```

### Pokretanje Frontend-a

```bash
cd frontend

# Pokrenite development server
npm run dev

# Aplikacija će biti dostupna na http://localhost:5173
```

### Build za Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
php artisan optimize
php artisan config:cache
php artisan route:cache
```

##  Struktura projekta

```
.
├── backend/                    # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API kontroleri
│   │   │   └── Middleware/    # Custom middleware
│   │   └── Models/            # Eloquent modeli
│   ├── database/
│   │   ├── migrations/        # Migracije baze
│   │   ├── seeders/          # Seeders za test podatke
│   │   └── factories/        # Model factories
│   ├── routes/
│   │   └── api.php           # API rute
│   └── storage/
│       └── api-docs/         # Swagger dokumentacija
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable komponente
│   │   ├── pages/           # Page komponente
│   │   ├── layouts/         # Layout komponente
│   │   ├── services/        # API servisi
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── main.tsx        # Entry point
│   └── public/             # Static assets
│
└── README.md               # Ovo što upravo čitate
```

## 🔌 API Dokumentacija

Backend API je dokumentovan koristeći OpenAPI 3.0 (Swagger).

### Pristup dokumentaciji

Nakon pokretanja backend servera, dokumentacija je dostupna na:
- **Swagger UI:** `http://localhost:8000/api/documentation`
- **JSON:** `http://localhost:8000/docs/api-docs.json`

### Glavne rute

#### Autentifikacija
```
POST   /api/register      - Registracija novog korisnika
POST   /api/login         - Prijava korisnika
POST   /api/logout        - Odjava korisnika (zahteva auth)
```

#### Zadaci (Tasks)
```
GET    /api/tasks         - Lista svih zadataka
POST   /api/tasks         - Kreiranje novog zadatka
GET    /api/tasks/{id}    - Detalji zadatka
PUT    /api/tasks/{id}    - Ažuriranje zadatka
DELETE /api/tasks/{id}    - Brisanje zadatka
```

#### Beleške (Notes)
```
GET    /api/notes         - Lista svih beležaka
POST   /api/notes         - Kreiranje nove beleške
GET    /api/notes/{id}    - Detalji beleške
PUT    /api/notes/{id}    - Ažuriranje beleške
DELETE /api/notes/{id}    - Brisanje beleške
```

#### Javni API
```
GET    /api/random-activity  - Dobavi random aktivnost
```

#### Admin rute
```
GET    /api/users/{user}/notes  - Sve beleške korisnika (samo admin)
GET    /api/users/{user}/tasks  - Svi zadaci korisnika (samo admin)
```

### Parametri pretrage

**Tasks:**
- `search` - Pretraga po naslovu
- `completed` - Filter (true/false)
- `page` - Broj stranice (paginacija)

**Notes:**
- `search` - Pretraga po naslovu
- `page` - Broj stranice

### Autentifikacija API-ja

Backend koristi Laravel Sanctum za token-based autentifikaciju:

1. Prijavite se preko `/api/login` i dobijte token
2. Dodajte token u Authorization header:
   ```
   Authorization: Bearer {vaštoken}
   ```

Frontend automatski upravlja tokenima pomoću Axios interceptora.

## Dizajn

Aplikacija koristi konzistentan dizajn sistem inspirisan Notion-om:

### Boje
- **Primarne:** Sive (gray-700, gray-800)
- **Pozadina:** White/Gray-50 (light), Gray-900/800 (dark)

### Komponente
- **Buttons:** Zaobljeni uglovi, glatke tranzicije
- **Cards:** Suptilne senke, hover efekti
- **Inputs:** Fokus indikatori, validacija
- **Modal:** Overlay sa escape key podrškom

## Testiranje

### Backend

```bash
cd backend

# Pokrenite sve testove
php artisan test

# Pokrenite specifičan test
php artisan test --filter TaskControllerTest
```

### Frontend

```bash
cd frontend

# Pokrenite testove (ako su konfigurisani)
npm run test
```

## Konfiguracija

### Backend (.env)

```env
APP_NAME=poran.io
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### Frontend

API endpoint je konfigurisan u `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});
```


## Autori

- **Student 1** - 2021/0357
- **Student 2** - 2021/0124

## Licenca

Ovaj projekat je razvijen u edukativne svrhe kao deo kursa Internet Tehnologije.
---

**Napomena:** Ova aplikacija je razvijena u edukativne svrhe. Za produkciono korišćenje, potrebne su dodatne sigurnosne mere i optimizacije. Ovako kako jeste, svakojaki sigurnosni propusti se mogu uočiti.

<3

