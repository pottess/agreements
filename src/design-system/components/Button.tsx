import type { ButtonHTMLAttributes, ReactNode } from 'react'
export function Button({variant='primary',size,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'tertiary'|'danger';size?:'sm';children:ReactNode}){return <button className={`btn btn-${variant}${size?' btn-sm':''}`} {...props}>{children}</button>}
export function IconButton(props:ButtonHTMLAttributes<HTMLButtonElement>){return <button className="icon-btn" {...props}/>} 
