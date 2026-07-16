import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { initialState } from './agreements.seed'
import type { Action, Agreement, AppState } from './agreements.types'
import { getAvailableAgreementActions } from '../shared/components/agreementRowActions'

const storageKey = 'agreements-spa-state-v7'
const now = 'Agora'
const update = (state: AppState, ids: string[], fn: (agreement: Agreement) => Agreement) => ({ ...state, agreements: state.agreements.map(agreement => ids.includes(agreement.id) ? fn(agreement) : agreement) })
const audited = (agreement: Agreement, user: string, action: string, description: string, patch: Partial<Agreement> = {}): Agreement => ({
  ...agreement, ...patch, updatedAt: `${now} · ${description}`, auditTrail: [...(agreement.auditTrail ?? []), { at: now, user, action, description }],
})
const message = (count: number, singular: string, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural} com sucesso.`

function applyAgreementAction(agreement: Agreement, actionId: Action['type'] extends never ? never : Extract<Action, {type:'EXECUTE_AGREEMENT_ACTION'}>['actionId'], user: 'KAM'|'PPM'): Agreement {
  switch (actionId) {
    case 'review-monthly': return audited(agreement, user, actionId, 'cadastro conferido', { status: 'Conferido' })
    case 'generate': return audited(agreement, user, actionId, 'acordo gerado', { stage: 'Apuração', status: agreement.automation === 'Manual' ? 'Manual pendente' : 'Apurado DI' })
    case 'refresh-di': return audited(agreement, user, actionId, 'consulta DI atualizada', { status: 'Apurado DI', diValue: agreement.diValue ?? agreement.budget })
    case 'confirm-kam': return audited(agreement, user, actionId, 'apuração confirmada pelo KAM', { status: 'Confirmado KAM', kamConfirmed: `${agreement.kam} · agora` })
    case 'send-approval': return audited(agreement, user, actionId, 'enviado para aprovação', { stage: 'Aprovação', status: 'Aguardando aprovação', proposedValue: agreement.diValue ?? agreement.realValue ?? agreement.budget })
    case 'approve': return audited(agreement, user, actionId, 'aprovado pelo PPM', { stage: 'Assinatura', status: 'Aprovado', approvedValue: agreement.proposedValue ?? agreement.budget, ppmDecision: 'Aprovado agora' })
    case 'reject': return audited(agreement, user, actionId, 'rejeitado pelo PPM', { status: 'Com divergência', ppmDecision: 'Rejeitado' })
    case 'request-adjustment': return audited(agreement, user, actionId, 'ajuste solicitado pelo PPM', { status: 'Ajuste solicitado' })
    case 'emit-po': return audited(agreement, user, actionId, 'PO emitida', { status: 'PO emitido', poStatus: 'issued' })
    case 'register-invoice': return audited(agreement, user, actionId, 'NF de serviço recebida', { status: 'NF recebida', invoiceStatus: 'received' })
    case 'validate-invoice': return audited(agreement, user, actionId, 'NF de serviço validada', { status: 'NF validada', invoiceStatus: 'validated' })
    case 'request-payment': return audited(agreement, user, actionId, 'pagamento solicitado', { stage: 'Pagamento', status: 'Pagamento solicitado' })
    default: return agreement
  }
}

function reducer(state: AppState, action: Action): AppState { switch (action.type) {
  case 'PUBLISH_ANNUAL': return { ...state, annualPublished: true, toast: 'Matriz anual publicada com sucesso' }
  case 'SET_MONTH': return { ...state, selectedMonth: action.month }
  case 'SET_VIGENCIA': return { ...state, selectedYear: action.year, selectedMonth: `${action.year}-${String(action.month).padStart(2, '0')}` }
  case 'CONFIRM_MONTHLY': return { ...update(state, action.ids, agreement => audited(agreement, 'KAM', 'review-monthly', 'cadastro conferido', { status: 'Conferido' })), toast: message(action.ids.length, 'item conferido', 'itens conferidos') }
  case 'SET_EXCEPTION': return { ...update(state, [action.id], agreement => audited(agreement, 'KAM', 'edit-exception', 'exceção atualizada', { budget: action.budget, status: 'Exceção', exceptionReason: action.reason })), toast: 'Exceção registrada no histórico' }
  case 'SET_TARGET': return { ...update(state, [action.id], agreement => audited(agreement, 'KAM', 'set-target', 'meta ajustada pelo KAM', { kamAdjustedTarget: action.value })), toast: 'Meta ajustada pelo KAM e registrada no histórico' }
  case 'GENERATE_AGREEMENTS': return { ...update(state, action.ids, agreement => applyAgreementAction(agreement, 'generate', 'KAM')), toast: message(action.ids.length, 'acordo gerado', 'acordos gerados') }
  case 'SET_REAL_VALUE': return { ...update(state, [action.id], agreement => audited(agreement, 'KAM', 'set-real-value', 'valor real atualizado pelo KAM', { realValue: action.value, status: Math.abs(agreement.budget - action.value) > 1 ? 'Com divergência' : 'Valor real informado' })), toast: 'Valor real salvo e registrado no histórico' }
  case 'SET_APURADO_VALUE': return { ...update(state, [action.id], agreement => audited(agreement, 'KAM', 'set-measured-value', 'valor apurado informado pelo KAM', { diValue: action.value, realValue: agreement.realValue ?? action.value, status: 'Apurado DI' })), toast: 'Valor apurado salvo; confirme OK para seguir' }
  case 'CONFIRM_KAM': return { ...update(state, action.ids, agreement => applyAgreementAction(agreement, 'confirm-kam', 'KAM')), toast: message(action.ids.length, 'acordo confirmado', 'acordos confirmados') }
  case 'SEND_APPROVAL': return { ...update(state, action.ids, agreement => applyAgreementAction(agreement, 'send-approval', 'KAM')), toast: message(action.ids.length, 'acordo enviado para aprovação', 'acordos enviados para aprovação') }
  case 'EXECUTE_AGREEMENT_ACTION': {
    const currentUser = action.user === 'PPM' ? 'PPM' : 'KAM'
    const selected = state.agreements.filter(agreement => action.ids.includes(agreement.id))
    if (selected.length !== action.ids.length || !selected.every(agreement => getAvailableAgreementActions(agreement, currentUser).some(available => available.id === action.actionId) || action.actionId === 'export')) return { ...state, toast: 'Ação não disponível para todos os acordos selecionados.' }
    if (action.actionId === 'export') return { ...state, toast: `${action.ids.length} acordo(s) preparado(s) para exportação.` }
    const labels: Record<string, [string, string]> = { 'review-monthly': ['cadastro conferido', 'cadastros conferidos'], generate: ['acordo gerado', 'acordos gerados'], 'refresh-di': ['DI atualizado', 'DIs atualizados'], 'confirm-kam': ['acordo confirmado', 'acordos confirmados'], 'send-approval': ['acordo enviado para aprovação', 'acordos enviados para aprovação'], approve: ['acordo aprovado', 'acordos aprovados'], reject: ['acordo rejeitado', 'acordos rejeitados'], 'request-adjustment': ['ajuste solicitado', 'ajustes solicitados'], 'emit-po': ['PO emitida', 'POs emitidas'], 'register-invoice': ['NF recebida', 'NFs recebidas'], 'validate-invoice': ['NF validada', 'NFs validadas'], 'request-payment': ['pagamento solicitado', 'pagamentos solicitados'] }
    const label = labels[action.actionId] ?? ['ação executada', 'ações executadas']
    return { ...update(state, action.ids, agreement => applyAgreementAction(agreement, action.actionId, action.user)), toast: message(action.ids.length, label[0], label[1]) }
  }
  case 'PPM_DECISION': return { ...update(state, action.ids, agreement => applyAgreementAction(agreement, action.decision === 'adjust' ? 'request-adjustment' : action.decision, 'PPM')), toast: 'Decisão PPM registrada' }
  case 'SEND_SIGNATURE': return { ...update(state, action.ids, agreement => audited(agreement, 'KAM', 'send-signature', 'enviado para assinatura', { status: 'Aguardando assinatura', signatureStatus: 'Enviado agora' })), toast: 'Acordos enviados para assinatura' }
  case 'COMPLETE_SIGNATURE': return { ...update(state, [action.id], agreement => audited(agreement, 'KAM', 'complete-signature', 'assinatura concluída', { stage: 'Pagamento', status: 'Assinado', signatureStatus: 'Assinado agora' })), toast: 'Assinatura concluída' }
  case 'UPDATE_SAP': return { ...state, toast: 'Retorno SAP atualizado agora' }
  case 'REGISTER_PAYMENT': return { ...update(state, [action.id], agreement => audited(agreement, 'Financeiro', 'register-payment', 'pagamento conciliado', { paidValue: action.value, status: action.value >= (agreement.approvedValue ?? agreement.budget) ? 'Pago' : 'Saldo em aberto', stage: action.value >= (agreement.approvedValue ?? agreement.budget) ? 'Finalizado' : 'Pagamento', sapStatus: 'Processado' })), toast: 'Pagamento conciliado' }
  case 'TOAST': return { ...state, toast: action.message }
  case 'RESET': return initialState
}}

const Ctx = createContext<{state: AppState; dispatch: React.Dispatch<Action>} | null>(null)
export function AgreementsProvider({children}: {children: ReactNode}) { const [state, dispatch] = useReducer(reducer, initialState, base => { try { return JSON.parse(localStorage.getItem(storageKey) ?? 'null') ?? base } catch { return base } }); useEffect(() => localStorage.setItem(storageKey, JSON.stringify(state)), [state]); const value = useMemo(() => ({state, dispatch}), [state]); return <Ctx.Provider value={value}>{children}</Ctx.Provider> }
export function useAgreements() { const value = useContext(Ctx); if (!value) throw new Error('AgreementsProvider ausente'); return value }
