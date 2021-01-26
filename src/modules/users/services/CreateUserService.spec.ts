import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      email: 'teste@teste.com',
      name: 'teste',
      password: 'teste123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      email: 'teste@teste.com',
      name: 'teste',
      password: 'teste123',
    });

    expect(
      createUser.execute({
        email: 'teste@teste.com',
        name: 'teste',
        password: 'teste123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});