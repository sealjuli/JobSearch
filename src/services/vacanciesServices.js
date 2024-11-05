const { ObjectId } = require("mongodb");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");

class VacanciesServices {
  #COLLECTION = "vacancies";

  async createVacancy(vacancy) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(vacancy);
    connection.close();
  }

  async getAllVacancies() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).find({}).toArray();
    connection.close();
    return data;
  }

  async getStudentVacancies(userId) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .find({ studentId: userId })
      .toArray();
    connection.close();
    return data;
  }

  async getStudentVacanciesByStatus(userId, status) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .find({ studentId: userId, status })
      .toArray();
    connection.close();
    return data;
  }

  async getAllVacanciesByStatus(status) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .find({ status })
      .toArray();
    connection.close();
    return data;
  }

  async findVacancyById(userId, id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .aggregate([{ $match: { _id: new ObjectId(id), studentId: userId } }])
      .toArray();
    connection.close();
    return data[0];
  }

  async updateVacancy(id, body) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db
      .collection(this.#COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...body } });
    connection.close();
  }

  async deleteVacancy(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).deleteOne({ _id: new ObjectId(id) });
    connection.close();
  }
}

module.exports = new VacanciesServices();
