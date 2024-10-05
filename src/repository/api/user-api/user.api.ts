import { ObjectId } from "mongodb";
import { client } from "../../../../server";
import { User } from "./models/User";

export async function getUsers(): Promise<User[]> {
    try {
        const database = client.db('TEST')
        const users = database.collection('Users')
        const allUsers = await users.find<User>({}).toArray();

        return allUsers;
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
        const user = await users.findOne<User>(query);

        return user || null;
    } catch (err) {
        console.log(err)
        return null;
    }
}
