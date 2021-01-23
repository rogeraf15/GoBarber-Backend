import { Router } from 'express';
import multer from 'multer';

import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';
import CreateUserService from '@modules/users/services/CreateUserService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const UsersRouter = Router();
const upload = multer(uploadConfig);

UsersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const usersRepository = new UsersRepository();

  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  // Com a atualização do TypeScript, isso se faz necessário
  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return response.json(userWithoutPassword);
});

UsersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateAvatar = new UpdateAvatarService(usersRepository);

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return response.json(userWithoutPassword);
  },
);

export default UsersRouter;
