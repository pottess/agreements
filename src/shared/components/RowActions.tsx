import { useEffect,useRef,useState } from 'react'
import { IconButton } from '../../design-system/components/Button'

export type RowAction={id:string;label:string;onClick:()=>void;disabled?:boolean}

export function RowActions({onView,actions=[]}:{onView:()=>void;actions?:RowAction[]}){
  const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{const close=(event:MouseEvent)=>{if(!ref.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[])
  return <div className="row-actions" ref={ref}>
    <IconButton aria-label="Ver detalhes do acordo" tooltip="Ver detalhes" onClick={onView}><svg className="action-eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg></IconButton>
    <IconButton aria-label="Mais ações" tooltip="Mais ações" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>⋮</IconButton>
    {open&&<div className="row-actions-menu" role="menu">{actions.length?actions.map(action=><button type="button" role="menuitem" key={action.id} disabled={action.disabled} onClick={()=>{action.onClick();setOpen(false)}}>{action.label}</button>):<span>Nenhuma ação disponível</span>}</div>}
  </div>
}
