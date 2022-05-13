import { useState } from "react"
import Subject from "../../entities/subject"
import SubjectContext from "../contexts/subjectContext"

const SubjectProvider = ({ children }) => {
  // Set local state
  const [subjects, setSubjects] = useState([])

  // Some handlers
  const handleGetSubject = (id) => {
    const subject = subjects.find(sub => Number(sub.getCode) === Number(id))

    if (subject) return subject

    return null
  }

  /**
   * Add the entire list of rooms
   * @param {Array} data 
   */
  const handleAddSubjects = (data) => {
    const subjects = data.map(subject => {
      // Format specialities

      const subjectPayload = {
        code: subject.codeCours,
        description: subject.descriptionCours,
        speciality: subject.idSpecialite && {
          id: subject.idSpecialite,
          name: subject.nomSpecialite
        }
      }

      return new Subject(subjectPayload)
    })

    setSubjects(subjects)
  }

  /**
   * Add the single room
   * @param {Object} data 
   */
  const handleAddSubject = (data) => {
    const {
      code,
      description,
      speciality
    } = data

    if (
      code &&
      description
    ) {
      const subject = new Subject(data)

      const subjectsPrevState = [...subjects]

      subjectsPrevState.push(subject)

      setSubjects(subjectsPrevState)
    }
  }

  const handleUpdateSubject = (id, data) => {
    // nothing
  }

  const handleRemoveSubject = (codeSubject) => {
    
    const newSubjects = subjects.filter(subject => subject.code !== codeSubject)

    setSubjects(newSubjects)
  }

  // Context value
  const contextValue = {
    subjects,
    getSubject: handleGetSubject,
    addSubjects: handleAddSubjects,
    addSubject: handleAddSubject,
    updateSubject: handleUpdateSubject,
    removeSubject: handleRemoveSubject
  }

  return (
    <SubjectContext.Provider value={contextValue}>
      { children }
    </SubjectContext.Provider>
  )
}

export default SubjectProvider