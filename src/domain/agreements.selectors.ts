import type { AppState } from './agreements.types'
export const brl=(v=0)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v)
export const totals=(s:AppState)=>({planned:s.levers.reduce((n,l)=>n+l.annualBudget,0),budget:s.agreements.reduce((n,a)=>n+a.budget,0),measured:s.agreements.reduce((n,a)=>n+(a.diValue??a.realValue??0),0),approved:s.agreements.reduce((n,a)=>n+(a.approvedValue??0),0),paid:s.agreements.reduce((n,a)=>n+(a.paidValue??0),0)})
