import AdminModel from "./AdminModel.js"
import FacultyModel from "./FacultyModel.js"
import NiveauModel from "./NiveauModel.js"
import ClassModel from './ClassModel.js';
import RoomModel from './RoomModel.js';
import DayModel from './DayModel.js';

export const initializeDB = async () => {
  try {
    await AdminModel.init()
    await FacultyModel.init()
    await NiveauModel.init()
    await ClassModel.init()
    await RoomModel.init()
    await DayModel.init()
  } catch (err) {
    console.log(err)
  }
}