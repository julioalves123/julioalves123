"use client"
import { createContext, useContext } from "react"

export type User = { id:string; name:string; email:string; company:string; cnpj:string; plan:'starter'|'growth'|'scale'; role:'owner'|'admin'|'finance' }

export const AuthContext = createContext<{
  user: User | null
  login: (email:string, pass:string)=>boolean
  logout: ()=>void
  register: (data:any)=>void
} | null>(null)

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('no auth')
  return ctx
}
