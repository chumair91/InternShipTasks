const bcrypt = require('bcrypt');
const User = require('../model/User');
jest.mock('bcrypt')
describe('User.comparePassword', () => {
  it('returns true when password matches', async () => {
    bcrypt.compare.mockResolvedValue(true);
    const user = new User({ password: 'hashed-password' });
    const result = await user.comparePassword('correct-password');
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'correct-password',
      'hashed-password'
    );
  });
});
