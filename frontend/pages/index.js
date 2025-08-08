import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold">VulnWatchdog</h1>
        <p className="text-gray-600 mt-2">Automated dependency vulnerability monitoring with real-time alerts.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link className="btn" href="/login">Login</Link>
          <Link className="btn" href="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}


