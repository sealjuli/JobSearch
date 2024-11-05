const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");

class UsersServices {
  #COLLECTION = "users";

  async findUserByLogin(login) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const user = await db
      .collection(this.#COLLECTION)
      .aggregate([{ $match: { login } }])
      .toArray();
    connection.close();
    return user[0];
  }

  async saveUser(user) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(user);
    connection.close();
  }
}

module.exports = new UsersServices();