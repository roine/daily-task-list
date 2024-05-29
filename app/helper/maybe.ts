const Nothing = Symbol();
const Just = Symbol();

export namespace Maybe {
  export type Nothing = {
    readonly _tag: typeof Nothing;
  };

  export type Just<V> = {
    readonly _tag: typeof Just;
    readonly value: V;
  };

  export type Model<V> = Just<V> | Nothing;

  // ASSIGN

  export const nothing: Nothing = { _tag: Nothing };

  export const just = <V>(value: V): Model<V> => {
    if (value === null) {
      return nothing;
    }
    return {
      _tag: Just,
      value,
    };
  };

  // ASSERT

  export const isNothing = <V>(maybe: Model<V>): maybe is Nothing =>
    maybe._tag === Nothing;

  export const isJust = <V>(maybe: Model<V>): maybe is Just<V> =>
    maybe._tag === Just;

  // GET

  export const fromJust = <V>(maybe: Model<V>): V => {
    if (isJust(maybe)) {
      return maybe.value;
    } else {
      throw new Error("Maybe.fromJust: Nothing");
    }
  };

  // MAP

  /**
   * const val = Maybe.nothing
   * Maybe.withDefault("tree", val)
   * // "tree
   *
   * const val = Maybe.just("leaf")
   * Maybe.withDefault("tree", val)
   * // "leaf"
   */
  export const withDefault = <V>(defaultValue: V, maybe: Model<V>): V => {
    if (isJust(maybe)) {
      return maybe.value;
    } else {
      return defaultValue;
    }
  };

  /**
   * const val = Maybe.just(4)
   * Maybe.map((v) => v + 2, val) // Maybe.just(6)
   *
   *
   * const val = Maybe.nothing
   * Maybe.map((v) => v + 2, val) // Maybe.nothing
   *
   * it is also curried and can be composed
   * const val = Maybe.just(4)
   * compose(Maybe.map((v) => v + 2), Maybe.map((v) => v + 8))(0) // Maybe.just(10)
   *
   */
  export const map = <V, W>(fn: (just: V) => W, maybe: Model<V>): Model<W> => {
    if (isJust(maybe)) {
      return just(fn(maybe.value));
    } else {
      return maybe;
    }
  };

  export const map2 = <V, W, X>(
    fn: (just: V, just2: W) => X,
    maybe: Model<V>,
    maybe2: Model<W>,
  ): Model<X> => {
    if (isNothing(maybe)) {
      return nothing;
    } else {
      if (isNothing(maybe2)) {
        return nothing;
      } else {
        return just(fn(maybe.value, maybe2.value));
      }
    }
  };

  export const map3 = <V, W, X, Y>(
    fn: (just: V, just2: W, just3: X) => Y,
    maybe: Model<V>,
    maybe2: Model<W>,
    maybe3: Model<X>,
  ): Model<Y> => {
    if (isNothing(maybe)) {
      return nothing;
    } else if (isNothing(maybe2)) {
      return nothing;
    } else {
      if (isNothing(maybe3)) {
        return nothing;
      } else {
        return just(fn(maybe.value, maybe2.value, maybe3.value));
      }
    }
  };

  export const flatMap = <V, W>(
    fn: (just: V) => Model<W>,
    maybe: Model<V>,
  ): Model<W> => {
    if (isJust(maybe)) {
      return fn(maybe.value);
    } else {
      return maybe;
    }
  };
}
