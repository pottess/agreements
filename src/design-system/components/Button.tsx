import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Tooltip } from './Tooltip'
export function Button({variant='primary',size,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'tertiary'|'danger';size?:'sm';children:ReactNode}){return <button className={`btn btn-${variant}${size?' btn-sm':''}`} {...props}>{children}</button>}
export function IconButton({children,tooltip,className='',type='button',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{'aria-label':string;tooltip?:string;children:ReactNode}){const button=<button type={type} className={`icon-btn ${className}`} {...props}>{children}</button>;return tooltip?<Tooltip label={tooltip}>{button}</Tooltip>:button}
