import {
  isBeforeThisMonth,
  isBeforeToday,
  isBeforeThisWeek,
  isBeforeThisYear,
} from "@/helper/date";

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe(isBeforeToday, () => {
  it("returns true if the date is yesterday", () => {
    expect(isBeforeToday(new Date("2019-12-31"))).toBe(true);
  });

  it("returns true if the date is anytime before today", () => {
    expect(isBeforeToday(new Date("1990-02-05"))).toBe(true);
  });

  it("returns false if the date today", () => {
    expect(isBeforeToday(new Date("2020-01-01"))).toBe(false);
  });

  it("returns false if the date tomorrow", () => {
    expect(isBeforeToday(new Date("2020-01-02"))).toBe(false);
  });

  it("returns false if the date anytime in the future", () => {
    expect(isBeforeToday(new Date("2024-02-05"))).toBe(false);
  });
});

describe(isBeforeThisWeek, () => {
  it("returns true if the date is a week older + one day", () => {
    expect(isBeforeThisWeek(new Date("2019-12-24"))).toBe(true);
  });

  it("returns true if the date is any time before out of the week range", () => {
    expect(isBeforeThisWeek(new Date("2009-12-24"))).toBe(true);
  });

  it("returns false if date is within the past week", () => {
    expect(isBeforeThisWeek(new Date("2019-12-30"))).toBe(false);
  });

  it("returns false if the date tomorrow", () => {
    expect(isBeforeThisWeek(new Date("2020-01-02"))).toBe(false);
  });

  it("returns false if the date anytime in the future", () => {
    expect(isBeforeThisWeek(new Date("2024-02-05"))).toBe(false);
  });
});

describe(isBeforeThisMonth, () => {
  it("returns true if the date is a month older + one day", () => {
    expect(isBeforeThisMonth(new Date("2019-11-30"))).toBe(true);
  });

  it("returns true if the date is any time before out of the month range", () => {
    expect(isBeforeThisMonth(new Date("2009-11-30"))).toBe(true);
  });

  it("returns false if date is within the past month", () => {
    expect(isBeforeThisMonth(new Date("2019-12-30"))).toBe(false);
  });

  it("returns false if the date tomorrow", () => {
    expect(isBeforeThisMonth(new Date("2020-01-02"))).toBe(false);
  });

  it("returns false if the date anytime in the future", () => {
    expect(isBeforeThisMonth(new Date("2024-02-05"))).toBe(false);
  });
});

describe(isBeforeThisYear, () => {
  it("returns true if the date is a year older + one day", () => {
    expect(isBeforeThisYear(new Date("2018-12-31"))).toBe(true);
  });

  it("returns true if the date is any time before out of the year range", () => {
    expect(isBeforeThisYear(new Date("2009-12-31"))).toBe(true);
  });

  it("returns false if date is within the past year", () => {
    expect(isBeforeThisYear(new Date("2019-12-30"))).toBe(false);
  });

  it("returns false if the date tomorrow", () => {
    expect(isBeforeThisYear(new Date("2020-01-02"))).toBe(false);
  });

  it("returns false if the date anytime in the future", () => {
    expect(isBeforeThisYear(new Date("2024-02-05"))).toBe(false);
  });
});
