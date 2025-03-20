import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store/store"
import { logoutUser, logoutAdmin } from "../store/authSlice"

const SESSION_TIMEOUT = 10 * 60 * 1000

export const useSessionTimeout = () => {
  const dispatch = useDispatch()
  const authState = useSelector((state: RootState) => state.auth)
  const { isAuthenticatedUser, isAuthenticatedAdmin, userToken, adminToken } =
    authState

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (isAuthenticatedUser) {
          dispatch(logoutUser())
        } else if (isAuthenticatedAdmin) {
          dispatch(logoutAdmin())
        }
      }, SESSION_TIMEOUT)
    }

    const handleActivity = () => {
      if (isAuthenticatedUser || isAuthenticatedAdmin) {
        resetTimeout()
      }
    }

    if (!isAuthenticatedUser && !isAuthenticatedAdmin) {
      if (userToken) {
        dispatch(logoutUser())
      } else if (adminToken) {
        dispatch(logoutAdmin())
      }
      return
    }

    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("click", handleActivity)

    resetTimeout()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("click", handleActivity)
    }
  }, [
    dispatch,
    isAuthenticatedUser,
    isAuthenticatedAdmin,
    userToken,
    adminToken
  ])
}
