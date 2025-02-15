import React, { useContext, useMemo, useState } from "react"
import Input from "../../../components/utils/inputs/input"
import Button from "../../../components/utils/buttons/button"
import styles from '../css/auth.module.css'
import AuthApi from "../../../api/auth"
import { verifyEmail } from "../../../utils/regex"
import CurrentUserContext from '../../../datamanager/contexts/currentUserContext'
import { Navigate } from 'react-router-dom'
import LinearLoader from "../../../components/utils/loaders/linearLoader"
import ToastContext from "../../../datamanager/contexts/toastContext"

const SigninForm = () => {
  // Set local state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [redirectToDashboard, setRedirectToDashboard] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get global data
  const { login } = useContext(CurrentUserContext)
  const { showToast } = useContext(ToastContext)

  const passwordError = useMemo(() => {
    const isNotOk = password.length > 0 && password.length <= 4

    if (isNotOk) {
      return { error: true, helper: "mot de passe trop court" }
    }

    return { error: false, helper: "" }
  }, [password])

  const emailError = useMemo(() => {
    const isOk = verifyEmail(email)

    if (email.length > 0 && !isOk) {
      return { error: true, helper: "mauvais format" }
    }

    return { error: false, helper: "" }
  }, [email])

  // Some handler
  const handleChange = (type, value) => {
    if (!loading) {
      if (type === "email") {
        setEmail(value)
      } else {
        setPassword(value)
      }
    }
  }

  const handleSubmitForm = async () => {
    if (validateForm() && !loading) {
      // Start loading
      setLoading(true)

      // Send request and receive response
      const {data, error} = await AuthApi.login(email, password)

      // Stop loading
      setLoading(false)
      console.log(data)

      if (data) {
        // Store token
        localStorage.setItem("cpg-jwt", data.token)

        // Initialize payload
        const payload = {
          id: data.idAdmin,
          name: data.nomAdmin,
          email: data.emailAdmin,
          phone: data.numTelephone,
          sexe: data.sexe
        }

        // Login the user
        login(payload)

        // Show toast
        showToast(`Bienvenu ${payload.name}`)

        setRedirectToDashboard(true)
      } else {
        console.log(error)

        showToast("Soit votre adresse email soit votre mot de passe est incorrect", "error")
      }
    }
  }

  const validateForm = () => {
    if (
      email && 
      verifyEmail(email) && 
      password && 
      password.length > 4
    )
      return true

    return false
  }

  return (
    <section className={styles.Signinform}>
      {
        redirectToDashboard && <Navigate to="/" />
      }

      <div className={styles.titleSigninForm}>
        CONNEXION
      </div>
      <div className={styles.ContentSigninForm}>
        <Input 
          error={emailError.error}
          helperText={emailError.helper}
          type="text"
          value={email}
          className={styles.InputSpace} 
          placeholder="your email"
          onChange={(e) => handleChange('email', e.target.value)}
        />

        <Input 
          error={passwordError.error}
          helperText={passwordError.helper}
          type="password" 
          value={password}
          className={styles.InputSpace}
          placeholder="your password"
          onChange={(e) => handleChange('pasword', e.target.value)}
        />

        <Button 
          disabled={!validateForm()}
          className={styles.buttonForm}
          onClick={handleSubmitForm}
        > 
          Connexion 
        </Button>

        <span className={styles.signinPasword}> Vous avez oublié votre mot de passe?</span>
        <span className={styles.signinClick}> Cliquez ici </span>
      </div>

      {
        loading && <LinearLoader />
      }
    </section>
  )
}
  
  export default SigninForm
  