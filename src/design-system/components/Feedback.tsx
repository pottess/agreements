export function ProgressBar({value}:{value:number}){return <span className="progress"><i style={{width:`${Math.min(100,value)}%`}}/></span>}
export function Toast({message}:{message:string}){return <div className="toast">✓ {message}</div>}
export function EmptyState({message}:{message:string}){return <div className="empty">{message}</div>}
