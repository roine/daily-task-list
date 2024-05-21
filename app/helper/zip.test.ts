import { Zip } from "./zip";

describe("Zip functionality", () => {
  const prev = [1, 2, 3];
  const current = 4;
  const next = [5, 6, 7];
  const zip = Zip.make(prev, current, next);

  it("getCurrent returns the current element", () => {
    expect(Zip.getCurrent(zip)).toBe(current);
  });

  it("goNext moves to the next element", () => {
    const newZip = Zip.goNext(zip);
    expect(Zip.getCurrent(newZip)).toBe(next[0]);
  });

  it("goNext cycles to the first element when at the end and cycle is true", () => {
    const endZip = Zip.make([...prev, current], next[next.length - 1], []);
    const cycledZip = Zip.goNext(endZip, { cycle: true });
    expect(Zip.getCurrent(cycledZip)).toBe(prev[0]);
  });

  it("goPrev moves to the previous element", () => {
    const newZip = Zip.goPrev(zip, { cycle: false });
    expect(Zip.getCurrent(newZip)).toBe(prev[prev.length - 1]);
  });

  it("goPrev cycles to the last element when at the start and cycle is true", () => {
    const startZip = Zip.make([], prev[0], [
      ...prev.slice(1),
      current,
      ...next,
    ]);
    const cycledZip = Zip.goPrev(startZip, { cycle: true });
    expect(Zip.getCurrent(cycledZip)).toBe(next[next.length - 1]);
  });

  it("isLast returns true when at the last element", () => {
    const endZip = Zip.make([...prev, current], next[next.length - 1], []);
    expect(Zip.isLast(endZip)).toBe(true);
  });

  it("isFirst returns true when at the first element", () => {
    const startZip = Zip.make([], prev[0], [
      ...prev.slice(1),
      current,
      ...next,
    ]);
    expect(Zip.isFirst(startZip)).toBe(true);
  });
});
