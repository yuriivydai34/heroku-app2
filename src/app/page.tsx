import { Suspense } from 'react';
import Profile from './Profile';
import Register from './Register';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Register />
        <div className="mt-8">
          <Suspense fallback={'Loading profile...'}>{<Profile />}</Suspense>
        </div>
      </div>
    </div>
  );
}
