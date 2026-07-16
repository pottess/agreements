export type AutomationType = 'Automática DI' | 'Manual KAM' | 'Híbrida'
export type Stage = 'Cadastro' | 'Apuração' | 'Aprovação' | 'Assinatura' | 'Pagamento' | 'Finalizado'
export type AgreementStatus = 'Pré-preenchido' | 'Conferido' | 'Exceção' | 'Manual pendente' | 'Apurado DI' | 'Com divergência' | 'Confirmado KAM' | 'Aguardando aprovação' | 'Aprovado' | 'Ajuste solicitado' | 'Aguardando assinatura' | 'Assinado' | 'Pagamento solicitado' | 'Pago' | 'Saldo em aberto'
export type ResponsibilityState = 'kam_action_required' | 'waiting_external' | 'waiting_ppm' | 'waiting_signature' | 'waiting_payment' | 'completed' | 'blocked'
export type KamActionType = 'review' | 'exception' | 'generate' | 'input_value' | 'confirm' | 'send_approval' | 'respond_adjustment' | 'signature' | 'payment' | 'view'
export interface KamNextAction { label:string; type:KamActionType; enabled:boolean; reason?:string }

export interface Lever { id:string; network:string; buyer:string; kam:string; category:string; name:string; observation:string; automation:AutomationType; annualTarget:number; annualBudget:number; allocated:number; committed:number; paid:number; status:'Ativo'|'Pendente'|'Com erro'|'Inativo' }
export interface AuditEvent {at:string;user:string;action:string;description:string;changedFields?:string[]}
export interface Agreement { id:string; leverId:string; month:string; network:string; buyer:string; kam:string; ppm:string; lever:string; leverObservation:string; automation:AutomationType; plannedTarget:number; monthlyTarget:number; kamAdjustedTarget?:number; budget:number; diValue?:number; realValue?:number; proposedValue?:number; approvedValue?:number; paidValue?:number; stage:Stage; status:AgreementStatus; exceptionReason?:string; kamConfirmed?:string; ppmDecision?:string; signatureStatus?:string; sapDocument?:string; sapStatus?:string; evidence?:string; updatedAt:string; customFields?:Record<string,string|number|boolean>; auditTrail?:AuditEvent[] }
export interface AppState { levers:Lever[]; agreements:Agreement[]; annualPublished:boolean; selectedYear:number; selectedMonth:string; toast?:string }
export type Action =
  | {type:'PUBLISH_ANNUAL'} | {type:'SET_MONTH'; month:string} | {type:'SET_VIGENCIA'; year:number; month:number}
  | {type:'CONFIRM_MONTHLY'; ids:string[]} | {type:'SET_EXCEPTION'; id:string; budget:number; reason:string} | {type:'SET_TARGET'; id:string; value:number}
  | {type:'GENERATE_AGREEMENTS'; ids:string[]} | {type:'SET_REAL_VALUE'; id:string; value:number}
  | {type:'CONFIRM_KAM'; ids:string[]} | {type:'SEND_APPROVAL'; ids:string[]}
  | {type:'PPM_DECISION'; ids:string[]; decision:'approve'|'reject'|'adjust'; value?:number}
  | {type:'SEND_SIGNATURE'; ids:string[]} | {type:'COMPLETE_SIGNATURE'; id:string}
  | {type:'UPDATE_SAP'} | {type:'REGISTER_PAYMENT'; id:string; value:number}
  | {type:'TOAST'; message?:string} | {type:'RESET'}
