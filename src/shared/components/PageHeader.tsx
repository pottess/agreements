import type { ReactNode } from 'react'
export function PageHeader({title,description,eyebrow,actions}:{title:string;description:string;eyebrow?:string;actions?:ReactNode}){return <header className="page-header"><div>{eyebrow&&<small>{eyebrow}</small>}<h1>{title}</h1><p>{description}</p></div>{actions&&<div className="page-header-actions">{actions}</div>}</header>}
