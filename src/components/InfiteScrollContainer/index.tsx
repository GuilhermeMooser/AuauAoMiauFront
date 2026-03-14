import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollContainerProps {
  children: ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  loader?: ReactNode;
}


export function InfiniteScrollContainer({
  children,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 300,
  loader,
}: InfiniteScrollContainerProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // Threshold: percentage of the element that needs to be visible
        threshold: 0.1,
        
        // rootMargin: Additional margin to anticipate loading
        // At 300px, it starts loading when it is 300px before the end.
        rootMargin: `0px 0px ${threshold}px 0px`,
      }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return (
    <>
      {children}
      
      <div 
        ref={observerTarget} 
        className="w-full min-h-[1px]"
        aria-hidden="true"
      >
        {isFetchingNextPage && (
          loader || (
            <div className="flex items-center justify-center gap-2 py-8">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-gray-600">Carregando mais...</span>
            </div>
          )
        )}
      </div>
    </>
  );
}