# GymTrack

Aplikasi web tracking kebugaran berbasis Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, dan MySQL.

## Menjalankan
1. Pastikan Node.js dan MySQL terpasang.
2. Buat database MySQL bernama `gymtrack2`.
3. Salin `.env.example` menjadi `.env` dan sesuaikan `DATABASE_URL` serta `SESSION_SECRET`.
4. Jalankan:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

5. Buka `http://localhost:3000`.

## Struktur OOP
Business logic dipisahkan dalam class `NutritionCalculator`, `WorkoutCalculator`, `UserService`, `NutritionService`, `WorkoutService`, `ProgressService`, dan `NutritionFacade`.

## Catatan
Upload foto disimpan pada `public/uploads`. Folder ini diabaikan Git agar foto pengguna tidak ikut version control.

## Docker

Aplikasi GymTrack telah dikontainerisasi menggunakan Docker.

### Docker Image

Docker Hub:
https://hub.docker.com/r/khalish16/project-popl-gymtrack

Image Tag:
`submit-UTS`

### Build Image

```bash
docker build -t project-popl-gymtrack:submit-UTS .
