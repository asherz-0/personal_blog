import {lazy, Suspense} from 'react';
import {BentoLayout} from './components/BentoLayout';

const CardRailsPrototype = import.meta.env.DEV
  ? lazy(() =>
      import('./prototypes/CardRailsPrototype').then(({CardRailsPrototype: Component}) => ({
        default: Component,
      })),
    )
  : null;

export default function App() {
  const prototype = new URLSearchParams(window.location.search).get('prototype');

  if (prototype === 'card-rails' && CardRailsPrototype) {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-paper" />}>
        <CardRailsPrototype />
      </Suspense>
    );
  }

  return (
    <div className="selection:bg-orbit-blue selection:text-white">
      <BentoLayout />
    </div>
  );
}
