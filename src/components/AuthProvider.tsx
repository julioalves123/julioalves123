"use client"
import React, { useState, useEffect } from "react"
import { AuthContext, User } from "@/lib/store"

const STORAGE_KEY = "fluxa_user"

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user, setUser] = useState<User|null>(null)
  const [ready, setReady] = useState(false)

  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) try{ setUser(JSON.parse(raw)) }catch{}
    setReady(true)
  },[])

  const login = (email:string, pass:string)=>{
    // mock accepts any
    const mock:User = {id:'u1', name: email.split('@')[0] || 'Ana Financeiro', email, company:'Distribuidora Boa Vista', cnpj:'34.567.890/0001-12', plan:'growth', role:'owner'}
    if(email.includes('admin')) mock.role='admin'
    if(email.includes('scale')) mock.plan='scale'
    if(email.includes('starter')) mock.plan='starter'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock))
    setUser(mock)
    return true
  }
  const logout = ()=>{
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    window.location.href='/login'
  }
  const register = (data:any)=>{
    const mock:User = {id:'u2', name:data.name, email:data.email, company:data.company, cnpj:data.cnpj, plan:'growth', role:'owner'}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock))
    setUser(mock)
  }

  if(!ready) return null
  return <AuthContext.Provider value={{user, login, logout, register}}>{children}</AuthContext.Provider>
}
