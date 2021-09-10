import React, { useEffect, useState } from 'react';

import ResizeObserver from 'resize-observer-polyfill'; // for other browsers support

//returns current dimensions of a html element, svg must be inside that element

function useResizeObserver(ref) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((coordss) => {
      coordss.forEach((coord) => {
        setDimensions(coord.contentRect);
      });
    });

    return () => {
      ResizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
}

export default useResizeObserver;
