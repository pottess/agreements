import type { HTMLAttributes, ReactNode } from 'react'
export function Card({children,className='',...props}:HTMLAttributes<HTMLElement>&{children:ReactNode}){return <section className={`card ${className}`} {...props}>{children}</section>}
export function MetricCard({label,value,detail,icon='◎'}:{label:string;value:string;detail?:string;icon?:string}){return <Card className="metric"><span className="metric-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong>{detail&&<p>{detail}</p>}</div></Card>}
