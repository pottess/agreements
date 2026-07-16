import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
export function Input({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label?:string}){return <div className="field">{label&&<label>{label}</label>}<input {...props}/></div>}
export function Select({label,children,...props}:SelectHTMLAttributes<HTMLSelectElement>&{label?:string}){return <div className="field">{label&&<label>{label}</label>}<select {...props}>{children}</select></div>}
