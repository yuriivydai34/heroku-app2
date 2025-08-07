import { Suspense } from 'react';
import Feeds from './Feeds';

export default function Home() {
  return (
    <div>
      <Suspense fallback={'Loading links...'}>{<Feeds />}</Suspense>
    </div>
  );
}
