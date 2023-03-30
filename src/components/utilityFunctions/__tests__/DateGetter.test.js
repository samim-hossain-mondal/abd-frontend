import dateGetter from '../DateGetter';

describe('DateGetter', () => {
  it('should return the date in the correct format when time is not required', () => {
    const date = '2021-02-01T00:00:00';
    const expectedDate = '1 Feb, 2021';
    expect(dateGetter(date)).toEqual(expectedDate);
  });

  it('should return the date in the correct format when time is required', () => {
    const date = '2021-02-01T00:00:00';
    const expectedDate = '1 Feb, 2021 12:00 AM';
    expect(dateGetter(date, true)).toEqual(expectedDate);
  });

  it('should return [DD Mon, YYYY] when timestamp is null', () => {
    const date = null;
    const expectedDate = '[DD Mon, YYYY]';
    expect(dateGetter(date)).toEqual(expectedDate);
  });
});