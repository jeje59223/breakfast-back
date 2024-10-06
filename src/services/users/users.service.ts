import { User } from '../../repository/api/user-api/models/User';
import * as UsersApi from '../../repository/api/user-api/user.api';

export async function getUsers(): Promise<User[]> {
  return UsersApi.getUsers();
}

export async function getUserById(id: string): Promise<User | null> {
  return UsersApi.getUserById(id);
}
