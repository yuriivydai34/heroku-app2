import { Suspense } from 'react';
import Profile from './Profile';

export default function Home() {
  return (
    <div>
      <Suspense fallback={'Loading profile...'}>{<Profile />}</Suspense>
    </div>
  );
}
