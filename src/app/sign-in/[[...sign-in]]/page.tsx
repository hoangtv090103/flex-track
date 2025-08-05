import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">FlexTrack</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại!</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
              card: 'shadow-lg',
            }
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  )
}
