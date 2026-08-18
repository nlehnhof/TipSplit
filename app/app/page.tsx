/**
 * Placeholder — the real /app (saved roster CRUD, presets, shift history,
 * Pro-gated CSV export) is built in a later task. This route is protected by
 * middleware.ts: signed-out users are redirected to /login before they ever
 * reach this page.
 */
export default function AppHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">Your workspace</h1>
      <p className="max-w-sm text-sm leading-relaxed text-zinc-600">
        Coming soon — saved rosters, split presets, and shift history will live
        here.
      </p>
    </main>
  );
}
