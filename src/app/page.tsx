import { Suspense } from 'react';
import Profile from './Profile';
import Register from './Register';
import Login from './Login';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-center mb-4">New User</h3>
            <Register />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-center mb-4">Existing User</h3>
            <Login />
          </div>
        </div>
        <div className="mt-8">
          <Suspense fallback={'Loading profile...'}>{<Profile />}</Suspense>
        </div>
      </div>
    </div>
  );
}
