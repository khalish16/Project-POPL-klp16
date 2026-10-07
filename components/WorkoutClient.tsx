"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";

export default function WorkoutClient() {
  const [active, setActive] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [name, setName] = useState("Workout Saya");
  const [exercise, setExercise] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  async function load() {
    const response = await fetch("/api/workouts");

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setActive(data.active);
    setHistory(data.history);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const elapsed = useMemo(() => {
    if (!active?.startedAt) {
      return "00:00";
    }

    const seconds = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(active.startedAt).getTime()) / 1000
      )
    );

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, [active, tick]);

  async function api(
    url: string,
    body?: any,
    method: string = "POST"
  ) {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Terjadi kesalahan.");
        return;
      }

      await load();
    } finally {
      setLoading(false);
    }
  }

  async function addExercise() {
    if (!exercise.trim() || !active) {
      return;
    }

    await api("/api/exercises", {
      workoutId: active.id,
      name: exercise.trim(),
    });

    setExercise("");
  }

  return (
    <>
      <Sidebar />

      <main className="min-h-screen bg-gray-50 md:ml-64">
        <div className="mx-auto max-w-6xl p-5 pt-16 md:p-8">
          <h1 className="text-2xl font-bold">Workout</h1>

          {!active ? (
            <div className="card mt-7 max-w-xl p-6">
              <h2 className="text-lg font-bold">Mulai Workout</h2>

              <p className="mt-1 text-sm text-gray-500">
                Buat sesi latihan baru dan mulai timer.
              </p>

              <input
                className="input mt-5"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama workout"
              />

              <button
                className="btn-primary mt-4 w-full"
                onClick={() =>
                  api("/api/workouts", {
                    name,
                  })
                }
                disabled={loading}
              >
                Mulai Workout
              </button>
            </div>
          ) : (
            <div className="mt-7">
              <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-brand-600">
                    Workout aktif
                  </p>

                  <h2 className="text-xl font-bold">
                    {active.name}
                  </h2>

                  <p className="mt-1 font-mono text-2xl">
                    {elapsed}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      api(`/api/workouts/${active.id}/finish`)
                    }
                  >
                    Selesai
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() =>
                      api(`/api/workouts/${active.id}/cancel`)
                    }
                  >
                    Batalkan
                  </button>
                </div>
              </div>

              <div className="card mt-5 p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="input"
                    value={exercise}
                    onChange={(event) =>
                      setExercise(event.target.value)
                    }
                    placeholder="Nama exercise, mis. Bench Press"
                  />

                  <button
                    className="btn-primary"
                    onClick={addExercise}
                  >
                    Tambah Exercise
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {active.exercises?.map((item: any) => (
                    <Exercise
                      key={item.id}
                      ex={item}
                      api={api}
                    />
                  ))}
                </div>

                {!active.exercises?.length && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    Belum ada exercise. Tambahkan exercise pertama.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 font-bold">
              Riwayat Workout
            </h2>

            <div className="space-y-2">
              {history
                .filter((item) => item.status !== "AKTIF")
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={item.id}
                    className="card flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString("id-ID")}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-gray-500">
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Exercise({
  ex,
  api,
}: {
  ex: any;
  api: (
    url: string,
    body?: any,
    method?: string
  ) => Promise<void>;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [note, setNote] = useState("");

  async function addSet() {
    if (!weight || !reps) {
      return;
    }

    await api("/api/sets", {
      exerciseId: ex.id,
      weight: Number(weight),
      reps: Number(reps),
      note,
    });

    setWeight("");
    setReps("");
    setNote("");
  }

  async function deleteSet(id: number) {
    await api(`/api/sets/${id}`, undefined, "DELETE");
  }

  const volume = ex.sets.reduce(
    (total: number, item: any) =>
      total + item.weight * item.reps,
    0
  );

  return (
    <div className="rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{ex.name}</h3>

          <p className="text-xs text-gray-500">
            {ex.sets.length} set · Volume{" "}
            {volume.toFixed(0)} kg
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <input
          className="input"
          type="number"
          placeholder="Berat kg"
          value={weight}
          onChange={(event) =>
            setWeight(event.target.value)
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Repetisi"
          value={reps}
          onChange={(event) =>
            setReps(event.target.value)
          }
        />

        <input
          className="input"
          placeholder="Catatan (opsional)"
          value={note}
          onChange={(event) =>
            setNote(event.target.value)
          }
        />

        <button
          className="btn-secondary"
          onClick={addSet}
        >
          Tambah Set
        </button>
      </div>

      {ex.sets.length > 0 && (
        <div className="mt-3 space-y-1">
          {ex.sets.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
            >
              <span>
                Set {index + 1}: {item.weight} kg ×{" "}
                {item.reps}
              </span>

              <button
                className="text-red-500"
                onClick={() => deleteSet(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Up Next: exercise berikutnya mengikuti urutan
        exercise.
      </p>
    </div>
  );
}