import { ObjectId } from "mongodb";
import { client } from "../../../../server";
import { User } from "./models/User";

export async function getUsers(): Promise<User[]> {
    try {
        const database = client.db('TEST')
        const users = database.collection('Users')
        const allUser = await users.find({}).toArray();

        const mappedUsers: User[] = allUser.map(user => ({
            _id: user._id,
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            login: user.login,
            picture: user.picture,
            roles: user.roles,
            numberOfBreakFastOrganised: user.numberOfBreakFastOrganised,
            nextOrganizedBreakfastDate: user.nextOrganizedBreakfastDate,
            creationDate: user.creationDate,
            ldap: user.ldap
        }));

        return mappedUsers
    } catch (err) {
        console.log(err)
        return [];
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const database = client.db('TEST')
        const users = database.collection('Users')
        const query = { _id: new ObjectId(id) }
        const user = await users.findOne(query);

        if (!user) {
            return null;
        }

        const mappedUser: User = {
            _id: user._id,
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            login: user.login,
            picture: user.picture,
            roles: user.roles,
            numberOfBreakFastOrganised: user.numberOfBreakFastOrganised,
            nextOrganizedBreakfastDate: user.nextOrganizedBreakfastDate,
            creationDate: user.creationDate,
            ldap: user.ldap
        };

        return mappedUser
    } catch (err) {
        console.log(err)
        return null;
    }
}
