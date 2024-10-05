import { ObjectId } from "mongodb";
import { Role, User } from "../models/User";

export const userMock: User[] = [
    {
        _id: new ObjectId('6700f5bb73006f3927a9b8bf'),
        lastname: 'Cnockaert',
        firstname: 'Jérôme',
        email: 'jerome.cnockaert@leroymerlin.fr',
        login: { username: '10009628', password: '12345' },
        picture: 'undefined',
        roles: [ Role.ADMIN ],
        numberOfBreakFastOrganised: 3,
        nextOrganizedBreakfastDate: 'undefined',
        creationDate: '2023-02-12',
        ldap: '81'
    },
    {
        _id: new ObjectId('670101ac7c08a7bfefc557cc'),
        lastname: 'Korpi',
        firstname: 'Sanni',
        email: 'sanni.korpi@example.com',
        login: { username: 'purpleladybug163', password: '123' },
        picture: 'https://randomuser.me/api/portraits/women/90.jpg',
        roles: [ Role.USER ],
        numberOfBreakFastOrganised: 2,
        nextOrganizedBreakfastDate: 'Tue Mar 26 2024 00:00:00 GMT+0100 (heure normale d’Europe centrale)',
        creationDate: '2023-02-01',
        ldap: '1'
    }
];
