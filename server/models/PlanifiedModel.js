import connection from "../utils/index.js";

class planifiedModel {

    static init = async () => {

        const query = `
            CREATE TABLE IF NOT EXISTS Programmer
            (
                idAdmin INTEGER NOT NULL,
                codeCours VARCHAR(255) NOT NULL,
                idSalle INTEGER NOT NULL,
                idJour INTEGER NOT NULL,
                heureDebut VARCHAR(255) NOT NULL,
                heureFin VARCHAR(255) NOT NULL,
                CONSTRAINT FK_ProgrammerAdmin FOREIGN KEY(idAdmin) REFERENCES Admin (idAdmin),
                CONSTRAINT FK_ProgrammerCours FOREIGN KEY(codeCours) REFERENCES Cours(codeCours),
                CONSTRAINT FK_ProgrammerSalle FOREIGN KEY(idSalle) REFERENCES Salle(idSalle),
                CONSTRAINT FK_ProgrammerJour FOREIGN KEY(idJour) REFERENCES Jour(idJour),
                CONSTRAINT PK_Programmer PRIMARY KEY (idAdmin, codeCours, idSalle, idJour, heureDebut)
            )
        `

        try{
            await connection.execute(query)
            console.log("Table Programmer OK!");
        }catch(err){
            console.log(err.message)

            return { error: "Some thing happend while creating table Programmer" }
        }

    }

    /**
     * fetch all the programs of the planing on database
     * @returns {object}
     */
    static getAllPrograms = async (payload) => {

        const { idAnneeAca, idSemestre } = payload

        const query = `SELECT DISTINCT P.codeCours, C.descriptionCours, nomSal, E.nomEns, nomJour, heureDebut, heureFin, Cla.codeClasse, F.nomFil
                        FROM Programmer P, Cours C,  Salle S, Jour J, Enseignant E, AnneeAcademique A, Semestre Se, Suivre Sui, Groupe G, Classe Cla, Filiere F
                        WHERE (C.idSemestre = (?))
                        AND (Se.idAnneeAca = (?))
                        AND (C.idSemestre = Se.idSemestre)
                        AND (E.matriculeEns = C.matriculeEns)
                        AND (P.idSalle = S.idSalle) 
                        AND (P.codeCours = C.codeCours) 
                        AND (P.idJour = J.idJour) 
                        AND (C.codeCours = Sui.codeCours)
                        AND (Sui.idGroupe = G.idGroupe)
                        AND (Cla.CodeClasse = G.codeClasse)
                        AND (Cla.idFil = F.idFil)
                       ORDER BY J.nomJour ASC
                       `
                  
        try{
            const [rows] = await connection.execute(query, [idSemestre, idAnneeAca])

            console.log(rows);

            return{ data: rows }
        }catch(err){

            console.log(err.message);
            return { error: "An error occured while geting Programs" }
        }
    }

    /**
     * Create Program from database
     * @param {Object} payload 
     * @returns {Object}
     */
    static createProgram = async (payload) => {

        const {
            idAdmin,
            codeCours,
            idSalle,
            idJour,
            heureDebut,
            heureFin
        } = payload

        const query = `
            INSERT INTO Programmer(idAdmin, codeCours, idSalle, idJour, heureDebut, heureFin)
            VALUES(?, ?, ?, ?, ?, ?)
        `

        const values = [idAdmin, codeCours, idSalle, idJour, heureDebut, heureFin]

        try{
            const [rows] = await connection.execute(query, values)
            console.log(rows)
            return { data: "Program has created on successfully!!" }
        }catch(err){
            console.log(err.message)

            return{ error: "An error occured while creating the program" }
        }
    }

    /**
     * Delete a program from database
     * @param {String} payload id for Program
     * @returns {Object} 
     */
    static deleteProgram = async (payload) => {

        const { 
            idAdmin, 
            codeCours, 
            idSalle, 
            idJour, 
            heureDebut
        } = payload

        
        const query = `
            DELETE
            FROM Programmer
            WHERE (idAdmin, codeCours, idSalle, idJour, heureDebut) = (?, ?, ?, ?, ?)
            `
            
        const values = [idAdmin, codeCours, idSalle, idJour, heureDebut]

        try {

            const { data, error } = await this.getProgram(payload)

            if(!data.length) return { error: "The course is not found on database" }

            const [rows] = await connection.execute(query, values)

            console.log(rows);

            return { data: "Program deleted on succesfully" }
        }catch(err){
            console.log(err.message)

            return { error: "An error occured while deleting the program" }
        }
    }

    /**
     * This method update a program on database
     * @param {Object} payload contain the beginig and the end hour to update
     * @returns {Object} message or error
     */
    static updateProgram = async (payload) => {

        const { 
            idAdmin, 
            codeCours, 
            idSalle, 
            idJour, 
            heureDebut
        } = payload.key

        const {
            newHeureDebut,
            newHeureFin
        } = payload.data
        
        const query = `
            UPDATE Programmer
            SET heureDebut = (?), heureFin = (?)
            WHERE (idAdmin, codeCours, idSalle, idJour, heureDebut) = (?, ?, ?, ?, ?)
            `
            
        const values = [newHeureDebut, newHeureFin, idAdmin, codeCours, idSalle, idJour, heureDebut]

        try {

            //check if the given program is in database
            const { data, error } = await this.getProgram(payload.key)

            console.log(data);

            if(!data.length) return { error: "The course is not found on database" }

            //update program
            const [rows] = await connection.execute(query, values)

            return { data: "Program updated on succesfully" }
        }catch(err){
            console.log(err.message)

            return { error: "An error occured while updating the program" }
        }
    }

    /**
     * This method get a specific program on database
     * @param {Object} payload id(containing multiple values)
     * @returns {Object}
     */
    static getProgram = async (payload) => {

        const { 
            idAdmin, 
            codeCours, 
            idSalle, 
            idJour, 
            heureDebut
        } = payload

        const query = `
            SELECT * 
            FROM Programmer
            WHERE (idAdmin, codeCours, idSalle, idJour, heureDebut) = (?, ?, ?, ?, ?)
            `
        const values = [idAdmin, codeCours, idSalle, idJour, heureDebut]

        try{
            const [rows] = await connection.execute(query, values)

            console.log(rows);

            return { data: rows }
        }catch(err){
            console.log(err.message)
            return { error: "An error occured while geting the program" }
        }
    }

}

export default planifiedModel