import type { ReactNode } from 'react'
export function Badge({tone='neutral',children}:{tone?:'success'|'warning'|'danger'|'info'|'neutral';children:ReactNode}){return <span className={`badge badge-${tone}`}>{children}</span>}
