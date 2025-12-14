export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-4 text-4xl font-bold">Welcome to PROJECT_NAME</h1>
        <p className="mb-8 text-lg">
          A modern Next.js + TypeScript template with best practices built-in.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">TypeScript</h2>
            <p className="text-sm text-gray-600">Fully typed with strict mode enabled</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Tailwind CSS</h2>
            <p className="text-sm text-gray-600">Utility-first CSS framework</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Testing</h2>
            <p className="text-sm text-gray-600">Vitest for fast unit tests</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Code Quality</h2>
            <p className="text-sm text-gray-600">ESLint + Prettier configured</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">CI/CD</h2>
            <p className="text-sm text-gray-600">GitHub Actions workflows</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-semibold">Git Hooks</h2>
            <p className="text-sm text-gray-600">Husky + lint-staged</p>
          </div>
        </div>
      </div>
    </main>
  );
}
