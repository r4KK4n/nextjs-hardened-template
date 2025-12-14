export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to PROJECT_NAME</h1>
        <p className="text-lg mb-8">
          A modern Next.js + TypeScript template with best practices built-in.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">TypeScript</h2>
            <p className="text-sm text-gray-600">Fully typed with strict mode enabled</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Tailwind CSS</h2>
            <p className="text-sm text-gray-600">Utility-first CSS framework</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Testing</h2>
            <p className="text-sm text-gray-600">Vitest for fast unit tests</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Code Quality</h2>
            <p className="text-sm text-gray-600">ESLint + Prettier configured</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">CI/CD</h2>
            <p className="text-sm text-gray-600">GitHub Actions workflows</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Git Hooks</h2>
            <p className="text-sm text-gray-600">Husky + lint-staged</p>
          </div>
        </div>
      </div>
    </main>
  );
}
