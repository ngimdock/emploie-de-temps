import axiosInstance from '../config'
import DefaultApiCall from '../config/defaultApi'

class FacultyAPI extends DefaultApiCall {
  static async getAll () {
    const instance = this.insertToken(axiosInstance)

    try {
      const { data, error } = await instance.get("/faculty/all")

      console.log(data)

      return data
    } catch (err) {
      console.log(err)

      return { error: "An error occured" }
    }
  }

  static async create(data){
    const instance = this.insertToken(axiosInstance)

    try {
      const { data: facData, error } = await instance.post("/faculty/create", data)

      console.log(facData)

      return { data: facData }
    } catch (err) {
      console.log(err)

      return { error: "An error occured" }
    }
  }
}

export default FacultyAPI