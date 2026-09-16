import { cn } from "@/lib/utils"
import React from "react"
export function Button({className, variant='default', size='default', ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'default'|'outline'|'ghost'|'secondary', size?:'default'|'sm'|'lg'|'icon'}){
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
  const variants:any = {
    default:"bg-violet-600 text-white hover:bg-violet-700 shadow-sm",
    secondary:"bg-slate-900 text-white hover:bg-slate-800",
    outline:"border border-slate-200 bg-white hover:bg-slate-50 text-slate-900",
    ghost:"hover:bg-slate-100 text-slate-700"
  }
  const sizes:any={default:"h-10 px-5 py-2 text-sm", sm:"h-8 px-3 text-sm", lg:"h-11 px-8", icon:"h-9 w-9"}
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
export function Badge({className, ...props}: React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)} {...props}/> }
export function Card({className, ...props}: React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)} {...props}/> }
export function CardHeader({className, ...props}: React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}/> }
export function CardTitle({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>){ return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}/> }
export function CardContent({className, ...props}: React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("p-6 pt-0", className)} {...props}/> }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){ return <input className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" {...props}/> }
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>){ return <label className="text-sm font-medium text-slate-700" {...props}/> }
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){ return <textarea className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" {...props}/> }
export function Select({children, ...props}: React.SelectHTMLAttributes<HTMLSelectElement>){ return <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" {...props}>{children}</select> }
