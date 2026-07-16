import type { Agreement } from '../../domain/agreements.types'

export type AvailableRowAction={id:'review-monthly'|'edit-exception'|'generate'|'refresh-di'|'confirm-kam'|'edit-real'|'attach-evidence'|'review-divergence'|'send-approval'|'view-approval'|'respond-adjustment'|'view-signature'|'view-payment'|'view-balance'|'history';label:string}
export function getAvailableRowActions(agreement:Agreement,_currentUser:string):AvailableRowAction[]{
  const history:AvailableRowAction={id:'history',label:'Ver histórico'}
  switch(agreement.status){
    case'Pré-preenchido':return[{id:'review-monthly',label:'Conferir cadastro'},history]
    case'Exceção':return[{id:'review-divergence',label:'Revisar exceção'},{id:'edit-exception',label:'Editar exceção'},history]
    case'Conferido':return[{id:'generate',label:'Gerar acordo'},history]
    case'Manual pendente':return[{id:'edit-real',label:'Inserir valor real'},{id:'attach-evidence',label:'Anexar evidência'},history]
    case'Apurado DI':return[{id:'confirm-kam',label:'Confirmar OK'},history]
    case'Com divergência':return[{id:'review-divergence',label:'Revisar divergência'},{id:'edit-real',label:'Editar valor real'},{id:'attach-evidence',label:'Anexar evidência'},history]
    case'Confirmado KAM':return[{id:'send-approval',label:'Enviar para aprovação'},history]
    case'Aguardando aprovação':return[{id:'view-approval',label:'Ver aprovação'},history]
    case'Ajuste solicitado':return[{id:'respond-adjustment',label:'Responder ajuste'},{id:'edit-real',label:'Editar valor real'},history]
    case'Aprovado':return[{id:'view-approval',label:'Ver aprovação'},{id:'view-signature',label:'Acompanhar assinatura'},history]
    case'Aguardando assinatura':return[{id:'view-signature',label:'Acompanhar assinatura'},history]
    case'Assinado':return[{id:'view-payment',label:'Acompanhar pagamento'},history]
    case'Saldo em aberto':return[{id:'view-balance',label:'Acompanhar saldo'},{id:'view-payment',label:'Ver pagamento'},history]
    case'Pago':return[{id:'view-payment',label:'Ver pagamento'},history]
    case'Pagamento solicitado':return[{id:'view-payment',label:'Acompanhar pagamento'},history]
    default:return[history]
  }
}
