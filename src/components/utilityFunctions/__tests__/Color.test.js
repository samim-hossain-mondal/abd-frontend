import { statusCompleted, statusDraft } from '../Color';

describe('Color', () => {
  it('should return correct color for statusCompleted and statusDraft',()=>{
    expect(statusCompleted).toEqual('#40A737');
    expect(statusDraft).toEqual('#FF6E00');
  });
});