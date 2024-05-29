const Prev = Symbol();
const Next = Symbol();
const Current = Symbol();

type Zip<T> = {
  [Prev]: T[];
  [Current]: T;
  [Next]: T[];
};

export namespace Zip {
  export const make = <T>(prev: T[], current: T, next: T[]): Zip<T> => {
    return {
      [Prev]: prev,
      [Current]: current,
      [Next]: next,
    };
  };

  /**
   * reorder the zip next items
   */
  export const shuffle = <T>(zip: Zip<T>): Zip<T> => {
    const newNext = [getCurrent(zip), ...getNext(zip)];
    for (let i = newNext.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newNext[i], newNext[j]] = [newNext[j], newNext[i]];
    }

    return make(getPrev(zip), newNext[0], newNext.slice(1));
  };

  export const getCurrent = <T>(zip: Zip<T>): T => {
    return zip[Current];
  };

  export const getPrev = <T>(zip: Zip<T>): T[] => {
    return zip[Prev];
  };

  export const getNext = <T>(zip: Zip<T>): T[] => {
    return zip[Next];
  };

  export const goNext = <T>(
    zip: Zip<T>,
    { cycle }: { cycle: boolean } | undefined = { cycle: false },
  ): Zip<T> => {
    const oldPrev = getPrev(zip);
    const oldNext = getNext(zip);
    const oldCurrent = getCurrent(zip);

    if (cycle && isLast(zip)) {
      const newNext = oldPrev;
      return make([oldCurrent], newNext[0], newNext.slice(1));
    }
    // leave untouched if nowhere to go
    if (isLast(zip)) {
      return zip;
    }
    const newPrev = [...oldPrev, oldCurrent];
    const newCurrent = oldNext[0];
    const newNext = oldNext.slice(1);
    return make(newPrev, newCurrent, newNext);
  };

  export const goPrev = <T>(
    zip: Zip<T>,
    { cycle }: { cycle: boolean },
  ): Zip<T> => {
    const oldPrev = getPrev(zip);
    const oldNext = getNext(zip);
    const oldCurrent = getCurrent(zip);

    if (cycle && isFirst(zip)) {
      const newPrev = oldNext;
      return make(
        newPrev.slice(0, newPrev.length - 1),
        newPrev[newPrev.length - 1],
        [oldCurrent],
      );
    }

    if (isFirst(zip)) {
      return zip;
    }

    const newNext = [oldCurrent, ...oldNext];
    const newCurrent = oldPrev[oldPrev.length - 1];
    const newPrev = oldPrev.slice(0, oldPrev.length - 1);
    return make(newPrev, newCurrent, newNext);
  };

  export const isLast = <T>(zip: Zip<T>): boolean => {
    return getNext(zip).length === 0;
  };

  export const isFirst = <T>(zip: Zip<T>): boolean => {
    return getPrev(zip).length === 0;
  };
}
