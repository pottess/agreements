import type { Agreement } from '../../domain/agreements.types'

export type AgreementActionId =
  | 'review-monthly' | 'edit-exception' | 'generate' | 'refresh-di' | 'confirm-kam'
  | 'edit-real' | 'attach-evidence' | 'review-divergence' | 'send-approval'
  | 'view-approval' | 'respond-adjustment' | 'view-signature' | 'view-payment'
  | 'view-balance' | 'history' | 'approve' | 'reject' | 'request-adjustment'
  | 'emit-po' | 'register-invoice' | 'validate-invoice' | 'request-payment' | 'export'

export type AvailableRowAction = { id: AgreementActionId; label: string }
const history: AvailableRowAction = { id: 'history', label: 'Ver histórico' }
const isPPM = (user: string) => user === 'PPM'

/** Single source of truth for the contextual menu and for bulk actions. */
export function getAvailableAgreementActions(agreement: Agreement, currentUser: string): AvailableRowAction[] {
  if (isPPM(currentUser) && agreement.status === 'Aguardando aprovação') {
    return [
      { id: 'approve', label: 'Aprovar' },
      { id: 'request-adjustment', label: 'Solicitar ajuste' },
      { id: 'reject', label: 'Rejeitar' },
      history,
    ]
  }

  if (agreement.agreementType === 'service') {
    if (['Aprovado', 'Assinado'].includes(agreement.status) && agreement.poStatus === 'pending') return [{ id: 'emit-po', label: 'Emitir PO' }, history]
    if (agreement.poStatus === 'issued' && agreement.invoiceStatus === 'pending') return [{ id: 'register-invoice', label: 'Registrar NF recebida' }, history]
    if (agreement.invoiceStatus === 'received') return [{ id: 'validate-invoice', label: 'Validar NF' }, history]
    if (agreement.invoiceStatus === 'validated') return [{ id: 'request-payment', label: 'Solicitar pagamento' }, history]
  }
  if (agreement.agreementType === 'other' && agreement.status === 'Assinado') return [{ id: 'request-payment', label: 'Solicitar pagamento' }, history]

  switch (agreement.status) {
    case 'Pré-preenchido': return [{ id: 'review-monthly', label: 'Conferir cadastro' }, history]
    case 'Exceção': return [{ id: 'review-divergence', label: 'Revisar exceção' }, { id: 'edit-exception', label: 'Editar exceção' }, history]
    case 'Conferido': return [{ id: 'generate', label: 'Gerar acordo' }, history]
    case 'Aguardando DI': return [{ id: 'refresh-di', label: 'Atualizar DI' }, history]
    case 'Manual pendente': return [{ id: 'edit-real', label: 'Inserir valor real' }, { id: 'attach-evidence', label: 'Anexar evidência' }, history]
    case 'Apurado DI': return [{ id: 'confirm-kam', label: 'Confirmar OK' }, history]
    case 'Valor real informado': return [{ id: 'confirm-kam', label: 'Confirmar OK' }, { id: 'attach-evidence', label: 'Anexar evidência' }, history]
    case 'Com divergência': return [{ id: 'review-divergence', label: 'Revisar divergência' }, { id: 'edit-real', label: 'Editar valor real' }, { id: 'attach-evidence', label: 'Anexar evidência' }, history]
    case 'Confirmado KAM': return [{ id: 'send-approval', label: 'Enviar para aprovação' }, history]
    case 'Aguardando aprovação': return [{ id: 'view-approval', label: 'Ver aprovação' }, history]
    case 'Ajuste solicitado': return [{ id: 'respond-adjustment', label: 'Responder ajuste' }, { id: 'edit-real', label: 'Editar valor real' }, history]
    case 'Aprovado': return [{ id: 'view-approval', label: 'Ver aprovação' }, { id: 'view-signature', label: 'Acompanhar assinatura' }, history]
    case 'Aguardando assinatura': return [{ id: 'view-signature', label: 'Acompanhar assinatura' }, history]
    case 'Assinado': return [{ id: 'view-payment', label: 'Acompanhar pagamento' }, history]
    case 'Saldo em aberto': return [{ id: 'view-balance', label: 'Acompanhar saldo' }, { id: 'view-payment', label: 'Ver pagamento' }, history]
    case 'Pago': return [{ id: 'view-payment', label: 'Ver pagamento' }, history]
    case 'Pagamento solicitado': return [{ id: 'view-payment', label: 'Acompanhar pagamento' }, history]
    default: return [history]
  }
}

const bulkable = new Set<AgreementActionId>([
  'review-monthly', 'generate', 'confirm-kam', 'send-approval', 'approve', 'reject',
  'request-adjustment', 'emit-po', 'register-invoice', 'validate-invoice',
  'request-payment', 'refresh-di', 'export',
])

export function getAvailableBulkActions(selected: Agreement[], currentUser: string): AvailableRowAction[] {
  if (selected.length < 2) return []
  const actionIds = selected.map(agreement => new Set(getAvailableAgreementActions(agreement, currentUser).map(action => action.id)))
  const common = getAvailableAgreementActions(selected[0], currentUser).filter(action => bulkable.has(action.id) && actionIds.every(ids => ids.has(action.id)))
  // Export is status-independent and is intentionally available for every selected set.
  return [...common, { id: 'export', label: 'Exportar selecionados' }]
}

export const getAvailableRowActions = getAvailableAgreementActions
