import { User } from '../../repository/api/user-api/models/User';
import * as UsersApi from '../../repository/api/user-api/user.api';

export async function getUsersByCurl() {
  return UsersApi.getUsersByCurl();
}

export async function getUserByLdap(ldap: User['ldap']): Promise<User | null> {
  return UsersApi.getUserByLdap(ldap);
}

export async function addNewUserByCurl(user: User) {
  try {
    const result = await UsersApi.addUserByCurl(user);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un nouvel utilisateur :', error);
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }
}

export async function deleteUserByLdap(ldap: User['ldap']) {
  try {
    return await UsersApi.deleteUserByCurl(ldap);
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un utilisateur :', error);
    throw new Error(`Erreur lors de la suppression de l'utilisateur : ${ldap}`);
  }
}
