import { findNextInArray, findPreviousInArray } from "@/helper/array";

describe(findNextInArray, () => {
  it("finds the next item in the array", () => {
    expect(
      findNextInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        { id: 2 },
        { trackBy: "id" },
      ),
    ).toEqual({ id: 3 });
  });

  describe("cycle option", () => {
    it("goes to the first item if element is in last position", () => {
      expect(
        findNextInArray(
          [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          { id: 4 },
          { trackBy: "id", cycle: true },
        ),
      ).toEqual({ id: 1 });
    });
  });

  it("returns null if no element in the array", () => {
    expect(findNextInArray([], { id: 2 }, { trackBy: "id" })).toEqual(null);
  });

  it("returns null if element not in the array in the array", () => {
    expect(
      findNextInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        { id: 5 },
        { trackBy: "id" },
      ),
    ).toEqual(null);
  });

  it("returns null if nt next element in the array", () => {
    expect(
      findNextInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        { id: 4 },
        { trackBy: "id" },
      ),
    ).toEqual(null);
  });
});

describe(findPreviousInArray, () => {
  it("finds the previous item in the array", () => {
    expect(
      findPreviousInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        {
          id: 2,
        },
        { trackBy: "id" },
      ),
    ).toEqual({ id: 1 });
  });

  it("returns null if no element in the array", () => {
    expect(findPreviousInArray([], { id: 2 }, { trackBy: "id" })).toEqual(null);
  });

  it("returns null if element not in the array in the array", () => {
    expect(
      findPreviousInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        {
          id: 5,
        },
        { trackBy: "id" },
      ),
    ).toEqual(null);
  });

  it("returns null if no previous element in the array", () => {
    expect(
      findPreviousInArray(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        {
          id: 1,
        },
        { trackBy: "id" },
      ),
    ).toEqual(null);
  });

  describe("cycle option", () => {
    it("goes to the last item if element is in first position", () => {
      expect(
        findPreviousInArray(
          [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
          { id: 1 },
          { trackBy: "id", cycle: true },
        ),
      ).toEqual({ id: 4 });
    });
  });
});
