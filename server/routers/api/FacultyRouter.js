import express from "express"
import FacultyController from "../../controllers/FacultyController.js"
import authenticationMiddleware from "../../middlewares/auth.js"

const FacultyRouter = express.Router()

// set some routes
FacultyRouter.get("/all", authenticationMiddleware, FacultyController.getFaculties)
FacultyRouter.post("/create", authenticationMiddleware, FacultyController.createFaculty)

export default FacultyRouter