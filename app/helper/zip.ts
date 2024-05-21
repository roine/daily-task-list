type Zip<T> = {
  prev: T[];
  current: T;
  next: T[];
};

export namespace Zip {
  export const make = <T>(prev: T[], current: T, next: T[]): Zip<T> => {
    return {
      prev,
      current,
      next,
    };
  };

  export const shuffle = <T>(zip: Zip<T>): Zip<T> => {
    const newNext = [zip.current, ...zip.next];
    for (let i = newNext.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newNext[i], newNext[j]] = [newNext[j], newNext[i]];
    }

    return make(zip.prev, newNext[0], newNext.slice(1));
  };

  export const getCurrent = <T>(zip: Zip<T>): T | null => {
    return zip.current;
  };

  export const goNext = <T>(
    zip: Zip<T>,
    { cycle }: { cycle: boolean } | undefined = { cycle: false },
  ): Zip<T> => {
    if (cycle && isLast(zip)) {
      const newNext = zip.prev;
      return make([zip.current], newNext[0], newNext.slice(1));
    }
    // leave untouched if nowhere to go
    if (isLast(zip)) {
      return zip;
    }
    const newPrev = [...zip.prev, zip.current];
    const newCurrent = zip.next[0];
    const newNext = zip.next.slice(1);
    return make(newPrev, newCurrent, newNext);
  };

  export const goPrev = <T>(
    zip: Zip<T>,
    { cycle }: { cycle: boolean },
  ): Zip<T> => {
    if (cycle && isFirst(zip)) {
      const newPrev = zip.next;
      return make(
        newPrev.slice(0, newPrev.length - 1),
        newPrev[newPrev.length - 1],
        [zip.current],
      );
    }

    if (isFirst(zip)) {
      return zip;
    }

    const newNext = [zip.current, ...zip.next];
    const newCurrent = zip.prev[zip.prev.length - 1];
    const newPrev = zip.prev.slice(0, zip.prev.length - 1);
    return make(newPrev, newCurrent, newNext);
  };

  export const isLast = <T>(zip: Zip<T>): boolean => {
    return zip.next.length === 0;
  };

  export const isFirst = <T>(zip: Zip<T>): boolean => {
    return zip.prev.length === 0;
  };
}
