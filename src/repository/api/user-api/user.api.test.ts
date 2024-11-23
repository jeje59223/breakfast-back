import { addUserByCurl, deleteUserByCurl, getUserByLdap, getUsersByCurl } from "./user.api";
import { fetchJson } from '../../../utils/fetchjJson';
import dotenv from 'dotenv';
import { userMock } from "./test-data/users";
import { Role, User } from "./models/User";

jest.mock('../../../utils/fetchjJson', () => ({
    fetchJson: jest.fn(),
}));

dotenv.config();

describe('Users collection', () => {
    beforeAll(() => {
        dotenv.config({ path: '.env.test' });
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET USERS', () => {
        it('Should return a user list successfully', async () => {
            (fetchJson as jest.Mock).mockResolvedValue(userMock);

            const users = await getUsersByCurl();

            expect(users).toEqual(userMock);
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/find`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: {},
                }
            );
        })

        it('Should show an error in console on failure', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (fetchJson as jest.Mock).mockRejectedValue(new Error('Network error'));

            await getUsersByCurl();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error retrieving users:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    })

    describe('ADD USER', () => {
        it('Should add user successfully', async () => {
            const mockUser: User = userMock[0];
            const mockResponse = { acknowledged: true, insertedId: 'mocked_id' };

            (fetchJson as jest.Mock).mockResolvedValue(mockResponse);

            const response = await addUserByCurl(mockUser);

            expect(response).toEqual(mockResponse);
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/insertOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    document: expect.objectContaining({
                        lastname: mockUser.lastname,
                        firstname: mockUser.firstname,
                        email: mockUser.email,
                        login: {
                            username: mockUser.login.username,
                            password: mockUser.login.password,
                        },
                        picture: null,
                        roles: mockUser.roles,
                        numberOfBreakFastOrganised: 0,
                        nextOrganizedBreakfastDate: null,
                        creationDate: expect.any(String),
                        ldap: mockUser.ldap,
                    }),
                }
            );
        });

        it('Should throw an error if required fields are missing', async () => {
            const incompleteUser: Partial<User> = {
                firstname: 'John',
                email: 'john.doe@example.com',
                login: { username: 'johndoe', password: 'securepassword' },
                roles: [Role.USER],
            };

            await expect(addUserByCurl(incompleteUser as User)).rejects.toThrow(
                'The lastname, firstname, email, login, roles and ldap fields are mandatory'
            );

            expect(fetchJson).not.toHaveBeenCalled();
        });

        it('Should return null on network error or failed request', async () => {
            const mockUser: User = userMock[1];

            (fetchJson as jest.Mock).mockRejectedValue(new Error('Network error'));

            const response = await addUserByCurl(mockUser);

            expect(response).toBeNull();
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/insertOne`,
                'POST',
                expect.any(Object)
            );
        });
    })

    describe('GET A USER BY LDAP', () => {
        it('Should return a user matching the provided LDAP', async () => {
            const ldap = 'test_ldap';
            const mockUser: User = userMock[0];
            const mockResponse = { document: mockUser };

            (fetchJson as jest.Mock).mockResolvedValue(mockResponse);

            const user = await getUserByLdap(ldap);

            expect(user).toEqual(mockUser);
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/findOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: { ldap: ldap },
                }
            );
        });

        it('Should return null if no users found', async () => {
            const ldap = 'unknown_ldap';

            const mockResponse = { document: null };

            (fetchJson as jest.Mock).mockResolvedValue(mockResponse);

            const user = await getUserByLdap(ldap);

            expect(user).toBeNull();
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/findOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: { ldap: ldap },
                }
            );
        });

        it('Should return null on network error or failed request', async () => {
            const ldap = 'test_ldap';
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            (fetchJson as jest.Mock).mockRejectedValue(new Error('Network error'));

            const user = await getUserByLdap(ldap);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error retrieving user by ldap:",
                expect.any(Error)
            );
            expect(user).toBeNull();
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/findOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: { ldap: ldap },
                }
            );
            consoleErrorSpy.mockRestore();
        });
    })

    describe('DELETE USER', () => {
        it('Should delete a user successfully', async () => {
            const ldap = 'test_ldap';
            const mockResponse = { acknowledged: true, deletedCount: 1 };

            (fetchJson as jest.Mock).mockResolvedValue(mockResponse);

            const response = await deleteUserByCurl(ldap);

            expect(response).toEqual(mockResponse);
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/deleteOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: { ldap: ldap },
                }
            );
        });

        it('Should throw an error if the ldap field is missing', async () => {
            await expect(deleteUserByCurl('')).rejects.toThrow(
                "The 'ldap' field is required to delete a user."
            );

            expect(fetchJson).not.toHaveBeenCalled();
        });

        it('Should return null on network error or failed request', async () => {
            const ldap = 'test_ldap';
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            (fetchJson as jest.Mock).mockRejectedValue(new Error('Network error'));

            const response = await deleteUserByCurl(ldap);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error deleting user:",
                expect.any(Error)
            );
            expect(response).toBeNull();
            expect(fetchJson).toHaveBeenCalledTimes(1);
            expect(fetchJson).toHaveBeenCalledWith(
                `${process.env.BASE_MONGODB_URL}/deleteOne`,
                'POST',
                {
                    dataSource: process.env.MONGO_DATASOURCE,
                    database: process.env.MONGO_DATABASE,
                    collection: process.env.MONGO_COLLECTION_USERS,
                    filter: { ldap: ldap },
                }
            );
            consoleErrorSpy.mockRestore();
        });
    })
});
