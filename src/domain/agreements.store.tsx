import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { initialState } from './agreements.seed'
import type { Action, AppState } from './agreements.types'

const storageKey='agreements-spa-state-v5'
const update=(s:AppState,ids:string[],fn:(a:AppState['agreements'][number])=>AppState['agreements'][number])=>({...s,agreements:s.agreements.map(a=>ids.includes(a.id)?fn(a):a)})
function reducer(s:AppState,a:Action):AppState{switch(a.type){
  case'PUBLISH_ANNUAL':return{...s,annualPublished:true,toast:'Matriz anual publicada com sucesso'}
  case'SET_MONTH':return{...s,selectedMonth:a.month}
  case'SET_VIGENCIA':return{...s,selectedYear:a.year,selectedMonth:`${a.year}-${String(a.month).padStart(2,'0')}`}
  case'CONFIRM_MONTHLY':return{...update(s,a.ids,x=>({...x,status:'Conferido'})),toast:`${a.ids.length} item(ns) conferido(s)`}
  case'SET_EXCEPTION':return{...update(s,[a.id],x=>({...x,budget:a.budget,status:'Exceção',exceptionReason:a.reason})),toast:'Exceção registrada no histórico'}
  case'SET_TARGET':return{...update(s,[a.id],x=>({...x,kamAdjustedTarget:a.value,updatedAt:'Agora · meta ajustada pelo KAM'})),toast:'Meta ajustada pelo KAM e registrada no histórico'}
  case'GENERATE_AGREEMENTS':return{...update(s,a.ids,x=>({...x,stage:'Apuração',status:x.automation==='Manual KAM'?'Manual pendente':'Apurado DI'})),toast:`${a.ids.length} acordo(s) gerado(s)`}
  case'SET_REAL_VALUE':return{...update(s,[a.id],x=>({...x,realValue:a.value,status:'Com divergência',updatedAt:'Agora · valor real atualizado pelo KAM'})),toast:'Valor real salvo e registrado no histórico'}
  case'CONFIRM_KAM':return{...update(s,a.ids,x=>({...x,status:'Confirmado KAM',kamConfirmed:`${x.kam} · agora`})),toast:'Apuração confirmada pelo KAM'}
  case'SEND_APPROVAL':return{...update(s,a.ids,x=>({...x,stage:'Aprovação',status:'Aguardando aprovação',proposedValue:x.diValue??x.realValue??x.budget})),toast:'Itens enviados para aprovação'}
  case'PPM_DECISION':return{...update(s,a.ids,x=>a.decision==='approve'?({...x,stage:'Assinatura',status:'Aprovado',approvedValue:a.value??x.proposedValue??x.budget,ppmDecision:'Aprovado agora'}):a.decision==='adjust'?({...x,status:'Ajuste solicitado'}):({...x,status:'Com divergência',ppmDecision:'Rejeitado'})),toast:'Decisão PPM registrada'}
  case'SEND_SIGNATURE':return{...update(s,a.ids,x=>({...x,status:'Aguardando assinatura',signatureStatus:'Enviado agora'})),toast:'Acordos enviados para assinatura'}
  case'COMPLETE_SIGNATURE':return{...update(s,[a.id],x=>({...x,stage:'Pagamento',status:'Assinado',signatureStatus:'Assinado agora'})),toast:'Assinatura concluída'}
  case'UPDATE_SAP':return{...s,toast:'Retorno SAP atualizado agora'}
  case'REGISTER_PAYMENT':return{...update(s,[a.id],x=>({...x,paidValue:a.value,status:a.value>=(x.approvedValue??x.budget)?'Pago':'Saldo em aberto',stage:a.value>=(x.approvedValue??x.budget)?'Finalizado':'Pagamento',sapStatus:'Processado'})),toast:'Pagamento conciliado'}
  case'TOAST':return{...s,toast:a.message}
  case'RESET':return initialState
}}
const Ctx=createContext<{state:AppState;dispatch:React.Dispatch<Action>}|null>(null)
export function AgreementsProvider({children}:{children:ReactNode}){const [state,dispatch]=useReducer(reducer,initialState,base=>{try{return JSON.parse(localStorage.getItem(storageKey)??'null')??base}catch{return base}});useEffect(()=>localStorage.setItem(storageKey,JSON.stringify(state)),[state]);const value=useMemo(()=>({state,dispatch}),[state]);return <Ctx.Provider value={value}>{children}</Ctx.Provider>}
export function useAgreements(){const v=useContext(Ctx);if(!v)throw new Error('AgreementsProvider ausente');return v}
