import { HumanizeDurationPipe } from '../pipes/humanize-duration.pipe';

describe('HumanizeDurationPipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizeDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
