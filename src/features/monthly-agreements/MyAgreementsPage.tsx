import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../design-system/components/Button'
import { Modal } from '../../design-system/components/Modal'
import { Card, MetricCard } from '../../design-system/components/Card'
import { DataTable, type Column } from '../../design-system/components/DataTable'
import { Select } from '../../design-system/components/Fields'
import { PageHeader } from '../../shared/components/PageHeader'
import { BulkActionsBar, InlineCurrencyInput, InlineOkToggle, InlineTargetInput, TableToolbar } from '../../shared/components/TableParts'
import { AutomationTypeBadge, StatusBadge } from '../../shared/components/StatusBadge'
import { RowActions } from '../../shared/components/RowActions'
import { getAvailableAgreementActions, getAvailableBulkActions, type AgreementActionId } from '../../shared/components/agreementRowActions'
import { Tooltip } from '../../design-system/components/Tooltip'
import { VigenciaSelect } from '../../shared/components/VigenciaSelect'
import { useAgreements } from '../../domain/agreements.store'
import { brl, currentKAM, effectiveTarget, selectAgreementsByVigencia, sortAgreementsByNetwork } from '../../domain/agreements.selectors'
import type { Agreement } from '../../domain/agreements.types'

export function MyAgreementsPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useAgreements()
  const [search, setSearch] = useState('')
  const [automation, setAutomation] = useState('Todos')
  const [selected, setSelected] = useState<string[]>([])
  const [signing, setSigning] = useState<Agreement[]>()
  const [confirming, setConfirming] = useState<Agreement[]>()
  const current = state.selectedMonth === '2026-07'
  const all = sortAgreementsByNetwork(selectAgreementsByVigencia(state))
  const rows = useMemo(() => all.filter(agreement => (automation === 'Todos' || agreement.automation === automation) && (agreement.network + agreement.buyer + agreement.lever + agreement.leverObservation + agreement.id).toLowerCase().includes(search.toLowerCase())), [all, automation, search])
  const selectedRows = rows.filter(agreement => selected.includes(agreement.id))
  const bulkActions = getAvailableBulkActions(selectedRows, 'KAM')
  const toggle = (id: string) => setSelected(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])
  const run = (actionId: AgreementActionId, agreements: Agreement[]) => {
    if (actionId === 'sign-agreement') { setSigning(agreements); return }
    if (actionId === 'confirm-settlement') { setConfirming(agreements); return }
    if (['adjust-data','inform-settlement','edit-settlement','respond-adjustment'].includes(actionId)) { navigate(`/acordos/${agreements[0].id}`); return }
    dispatch({ type: 'EXECUTE_AGREEMENT_ACTION', ids: agreements.map(agreement => agreement.id), actionId, user: 'KAM' })
    if (agreements.length >= 2) setSelected([])
  }
  const columns: Column<Agreement>[] = [
    { key: 'network', label: 'Rede', render: agreement => <strong>{agreement.network}</strong> },
    { key: 'lever', label: 'Alavanca', render: agreement => <><strong>{agreement.lever}</strong><small>{agreement.leverObservation}</small></> },
    { key: 'buyer', label: 'Comprador', render: agreement => agreement.buyer },
    { key: 'lever-type', label: 'Tipo alavanca', render: agreement => <span className={`badge badge-${agreement.agreementType === 'service' ? 'info' : 'neutral'}`}>{agreement.agreementType === 'service' ? 'Serviço' : 'Outros'}</span> },
    { key: 'target', label: 'Meta', render: agreement => current ? <InlineTargetInput value={effectiveTarget(agreement)} adjusted={agreement.kamAdjustedTarget !== undefined} onSave={value => dispatch({type:'SET_TARGET', id:agreement.id, value})}/> : <span>{Math.round(effectiveTarget(agreement))}</span> },
    { key: 'id', label: 'Acordo', render: agreement => <strong>{agreement.id}</strong> },
    { key: 'automation', label: 'Tipo de apuração', render: agreement => <AutomationTypeBadge type={agreement.automation}/> },
    { key: 'budget', label: 'Orçado', render: agreement => brl(agreement.budget) },
    { key: 'measured', label: 'Apurado', render: agreement => agreement.measurementType === 'qualitative' && agreement.automation === 'Manual' && current ? <InlineOkToggle checked={agreement.qualitativeResult==='ok'} onToggle={checked => dispatch({type:'TOGGLE_QUALITATIVE_OK', id:agreement.id, checked})}/> : agreement.measurementType === 'qualitative' ? <span>{agreement.qualitativeResult==='ok'?'OK':agreement.qualitativeResult==='not_met'?'Não cumprido':'—'}</span> : agreement.automation === 'Manual' && current ? <InlineCurrencyInput value={agreement.diValue} onSave={value => dispatch({type:'SET_APURADO_VALUE', id:agreement.id, value})}/> : agreement.diValue === undefined ? <span>Aguardando DI</span> : brl(agreement.diValue) },
    { key: 'real', label: 'Real', render: agreement => current ? <InlineCurrencyInput value={agreement.realValue} onSave={value => dispatch({type:'SET_REAL_VALUE', id:agreement.id, value})}/> : <Tooltip label="Valor real disponível apenas no mês vigente."><span>{agreement.realValue === undefined ? '—' : brl(agreement.realValue)}</span></Tooltip> },
    { key: 'status', label: 'Status', render: agreement => <StatusBadge status={agreement.status}/> },
    { key: 'actions', label: 'Ações', align: 'center', compact: true, render: agreement => <RowActions onView={() => navigate(`/acordos/${agreement.id}`)} actions={getAvailableAgreementActions(agreement, currentKAM).map(action => ({...action, onClick: () => run(action.id, [agreement])}))}/> },
  ]
  return <div className="page">
    <PageHeader title="Acordos" description="Consulte, acompanhe e atue nos acordos comerciais conforme o status." rightSlot={<VigenciaSelect/>}/>
    <div className="metrics"><MetricCard label="Total no mês" value={String(all.length)}/><MetricCard label="Em apuração" value={String(all.filter(agreement => ['in_settlement','waiting_di','manual_pending'].includes(agreement.status)).length)}/><MetricCard label="Pendentes KAM" value={String(all.filter(agreement => ['manual_pending','di_settled'].includes(agreement.status)).length)}/><MetricCard label="Em aprovação" value={String(all.filter(agreement => agreement.status === 'waiting_approval').length)}/><MetricCard label="Aguardando assinatura" value={String(all.filter(agreement => agreement.status === 'waiting_signature').length)}/><MetricCard label="Concluídos" value={String(all.filter(agreement => ['paid','finished'].includes(agreement.status)).length)}/></div>
    <Card><TableToolbar search={search} onSearch={setSearch} actions={<Button size="sm" variant="tertiary">⇩ Exportar</Button>}><Select label="Tipo de apuração" value={automation} onChange={event => setAutomation(event.target.value)}><option>Todos</option><option>DI</option><option>Manual</option></Select></TableToolbar>
      <BulkActionsBar count={selectedRows.length} onClear={() => setSelected([])} emptyMessage="Os acordos selecionados possuem status diferentes e não permitem a mesma ação em massa.">
        {bulkActions.length ? <>{bulkActions.slice(0, 2).map(action => <Button key={action.id} size="sm" variant="secondary" onClick={() => run(action.id, selectedRows)}>{action.label}</Button>)}{bulkActions.length > 2 && <Button size="sm" variant="tertiary" onClick={() => dispatch({type:'TOAST', message:'Ações adicionais disponíveis no menu de cada acordo.'})}>Mais ações ⋮</Button>}</> : undefined}
      </BulkActionsBar>
      <DataTable rows={rows} columns={columns} selected={selected} onToggle={toggle} onToggleAll={() => setSelected(selected.length === rows.length ? [] : rows.map(row => row.id))}/>
    </Card>
    {signing && <Modal title={signing.length === 1 ? 'Assinar acordo' : 'Assinar acordos'} onClose={() => setSigning(undefined)} actions={<><Button variant="tertiary" onClick={() => setSigning(undefined)}>Cancelar</Button><Button onClick={() => { dispatch({type:'EXECUTE_AGREEMENT_ACTION',ids:signing.map(agreement => agreement.id),actionId:'sign-agreement',user:'KAM'}); setSelected([]); setSigning(undefined) }}>{signing.length === 1 ? 'Confirmar assinatura' : 'Confirmar assinaturas'}</Button></>}><p>{signing.length === 1 ? 'Tem certeza que deseja assinar este acordo?' : `Tem certeza que deseja assinar os ${signing.length} acordos selecionados?`}</p></Modal>}
    {confirming && <Modal title="Confirmar apurações" onClose={() => setConfirming(undefined)} actions={<><Button variant="tertiary" onClick={() => setConfirming(undefined)}>Cancelar</Button><Button onClick={() => { dispatch({type:'EXECUTE_AGREEMENT_ACTION',ids:confirming.map(agreement => agreement.id),actionId:'confirm-settlement',user:'KAM'}); setSelected([]); setConfirming(undefined) }}>Confirmar apurações</Button></>}><p>Tem certeza que deseja confirmar a apuração dos {confirming.length} acordos selecionados?</p></Modal>}
  </div>
}
