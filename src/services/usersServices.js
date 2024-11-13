const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const role = require("../helpers/role");

class UsersServices {
  #COLLECTION = "users";

  async getAllStudents() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const users = await db
      .collection(this.#COLLECTION)
      .aggregate([{ $match: { userType: role.student } }])
      .toArray();
    connection.close();
    return users;
  }

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

  async findTeacher() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const teacher = await db
      .collection(this.#COLLECTION)
      .aggregate([{ $match: { userType: role.teacher } }])
      .toArray();
    connection.close();
    return teacher.length;
  }

  async saveUser(user) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(user);
    connection.close();
  }
}

module.exports = new UsersServices();
