import { useState,type ReactNode } from 'react'
import { Button } from '../../design-system/components/Button'
export function TableToolbar({search,onSearch,children,actions}:{search:string;onSearch:(v:string)=>void;children?:ReactNode;actions?:ReactNode}){return <div className="toolbar"><input className="search" value={search} onChange={e=>onSearch(e.target.value)} placeholder="Buscar por rede, comprador ou alavanca"/>{children}<span className="spacer"/><div className="toolbar-actions"><button className="toolbar-link" type="button">⌄ Filtros avançados</button><button className="toolbar-icon" type="button" aria-label="Atualizar tabela" title="Atualizar">↻</button>{actions}</div></div>}
export function BulkActionsBar({count,children}:{count:number;children:ReactNode}){if(!count)return null;return <div className="bulk"><strong>{count} selecionado(s)</strong>{children}</div>}
export function InlineCurrencyInput({value,onSave}:{value?:number;onSave:(v:number)=>void}){
 const[editing,setEditing]=useState(false);const[draft,setDraft]=useState(value?.toString()??'');const[saved,setSaved]=useState(false)
 const commit=()=>{const normalized=Number(draft.replace(/\./g,'').replace(',','.'));if(Number.isFinite(normalized)&&normalized>=0){onSave(normalized);setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),1400)}}
 const cancel=()=>{setDraft(value?.toString()??'');setEditing(false)}
 if(!editing)return <button type="button" className={`inline-money-read ${saved?'is-saved':''}`} onClick={()=>setEditing(true)}>{saved?'Salvo':value===undefined?'Inserir valor':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value)}</button>
 return <input className="inline-money-input" autoFocus value={draft} placeholder="Inserir valor" onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();commit()}if(e.key==='Escape'){e.preventDefault();cancel()}}}/>
}
export function ConfirmOkButton({confirmed,onClick}:{confirmed?:string;onClick:()=>void}){return confirmed?<span className="badge badge-success">✓ {confirmed}</span>:<Button size="sm" onClick={onClick}>OK</Button>}
export function ValueDiff({base,value}:{base:number;value:number}){const diff=value-base;return <span className={`value-diff ${diff<0?'negative':''}`}>{diff>0?'+ ':''}{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(diff)}</span>}
