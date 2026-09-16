import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatBRL(v:number){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
export function formatDate(d:string){ return new Date(d).toLocaleDateString('pt-BR')}
export function daysOverdue(due:string){ const diff = Math.floor((Date.now() - new Date(due).getTime())/86400000); return diff }
