import type { Agreement } from '../../domain/agreements.types'
export type AgreementActionId='adjust-data'|'remove-agreement'|'refresh-di'|'inform-settlement'|'edit-settlement'|'confirm-settlement'|'send-approval'|'respond-adjustment'|'send-signature'|'sign-agreement'|'emit-po'|'register-invoice'|'validate-invoice'|'request-payment'|'refresh-sap'|'register-discount'|'finish'|'approve'|'reject'|'request-adjustment'|'export'
export type AvailableRowAction={id:AgreementActionId;label:string}
const isPPM=(user:string)=>user==='PPM'
export function getAvailableAgreementActions(agreement:Agreement,currentUser:string):AvailableRowAction[]{
 if(isPPM(currentUser)&&agreement.status==='waiting_approval')return[{id:'approve',label:'Aprovar'},{id:'request-adjustment',label:'Solicitar ajuste'},{id:'reject',label:'Rejeitar'}]
 switch(agreement.status){
  case'in_settlement':return[{id:'adjust-data',label:'Ajustar dados'},{id:'remove-agreement',label:'Retirar acordo'}]
  case'waiting_di':return[{id:'refresh-di',label:'Atualizar DI'}]
  case'di_settled':return[{id:'confirm-settlement',label:'Confirmar apuração'},{id:'send-approval',label:'Enviar para aprovação'}]
  case'manual_pending':return[{id:'inform-settlement',label:'Informar apurado'},{id:'remove-agreement',label:'Retirar acordo'}]
  case'manual_value_informed':return[{id:'confirm-settlement',label:'Confirmar apuração'},{id:'edit-settlement',label:'Editar apurado'},{id:'remove-agreement',label:'Retirar acordo'}]
  case'settled_by_kam':return[{id:'send-approval',label:'Enviar para aprovação'}]
  case'adjustment_requested':return[{id:'respond-adjustment',label:'Responder ajuste'}]
  case'approved':return[{id:'send-signature',label:'Enviar para assinatura'}]
  case'waiting_signature':return[{id:'sign-agreement',label:'Assinar acordo'}]
  case'signed':return agreement.agreementType==='service'?[{id:'emit-po',label:'Emitir PO'}]:[{id:'request-payment',label:'Solicitar pagamento'}]
  case'po_pending':return[{id:'emit-po',label:'Emitir PO'}]
  case'po_issued':case'waiting_service_invoice':return[{id:'register-invoice',label:'Registrar NF recebida'}]
  case'service_invoice_received':return[{id:'validate-invoice',label:'Validar NF'}]
  case'service_invoice_validated':return[{id:'request-payment',label:'Solicitar pagamento'}]
  case'sap_document_generated':return[{id:'refresh-sap',label:'Atualizar status SAP'}]
  case'open_balance':return[{id:'register-discount',label:'Registrar abatimento'},{id:'finish',label:'Finalizar pendência'}]
  default:return[]
 }
}
const bulkable=new Set<AgreementActionId>(['confirm-settlement','send-approval','sign-agreement','emit-po','register-invoice','validate-invoice','request-payment','refresh-di','remove-agreement','approve','reject','request-adjustment'])
export function getAvailableBulkActions(selected:Agreement[],currentUser:string):AvailableRowAction[]{if(selected.length<2)return[];const all=selected.map(a=>new Set(getAvailableAgreementActions(a,currentUser).map(x=>x.id)));return getAvailableAgreementActions(selected[0],currentUser).filter(action=>bulkable.has(action.id)&&all.every(ids=>ids.has(action.id)))}
export const getAvailableRowActions=getAvailableAgreementActions
