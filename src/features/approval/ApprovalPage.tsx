import { useMemo, useState } from 'react'
import { Button } from '../../design-system/components/Button'
import { MetricCard, Card } from '../../design-system/components/Card'
import { DataTable, type Column } from '../../design-system/components/DataTable'
import { PageHeader } from '../../shared/components/PageHeader'
import { TableToolbar, BulkActionsBar } from '../../shared/components/TableParts'
import { StatusBadge, AutomationTypeBadge } from '../../shared/components/StatusBadge'
import { DetailDrawer } from '../../shared/components/DetailDrawer'
import { RowActions } from '../../shared/components/RowActions'
import { getAvailableAgreementActions, getAvailableBulkActions, type AgreementActionId } from '../../shared/components/agreementRowActions'
import { useAgreements } from '../../domain/agreements.store'
import { brl, sortAgreementsByNetwork } from '../../domain/agreements.selectors'
import type { Agreement } from '../../domain/agreements.types'

export function ApprovalPage() {
  const {state, dispatch} = useAgreements()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [detail, setDetail] = useState<Agreement>()
  const rows = useMemo(() => sortAgreementsByNetwork(state.agreements.filter(agreement => agreement.stage === 'Aprovação' && (agreement.network + agreement.buyer + agreement.lever).toLowerCase().includes(search.toLowerCase()))), [state.agreements, search])
  const selectedRows = rows.filter(agreement => selected.includes(agreement.id))
  const bulkActions = getAvailableBulkActions(selectedRows, 'PPM')
  const operationalBulkActions = bulkActions.filter(action => action.id !== 'export')
  const toggle = (id:string) => setSelected(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id])
  const run = (actionId: AgreementActionId, agreements: Agreement[]) => {
    if (actionId === 'history' || actionId.startsWith('view-')) { setDetail(agreements[0]); return }
    dispatch({type:'EXECUTE_AGREEMENT_ACTION', ids:agreements.map(agreement => agreement.id), actionId, user:'PPM'})
    if (agreements.length >= 2) setSelected([])
  }
  const columns: Column<Agreement>[] = [
    {key:'name', label:'Rede · Comprador', render:agreement => <><strong>{agreement.network}</strong><small>{agreement.buyer}</small></>},
    {key:'lever', label:'Alavanca', render:agreement => agreement.lever},
    {key:'auto', label:'Apuração', render:agreement => <AutomationTypeBadge type={agreement.automation}/>},
    {key:'budget', label:'Orçado', render:agreement => brl(agreement.budget)},
    {key:'measured', label:'Apurado', render:agreement => brl((agreement.diValue ?? 0) + (agreement.realValue ?? 0))},
    {key:'proposed', label:'Proposto', render:agreement => <strong>{brl(agreement.proposedValue ?? agreement.budget)}</strong>},
    {key:'kam', label:'Confirmação KAM', render:agreement => <span>{agreement.kamConfirmed ?? '—'}</span>},
    {key:'status', label:'Status', render:agreement => <StatusBadge status={agreement.status}/>},
    {key:'actions', label:'Ações', align:'center', compact:true, render:agreement => <RowActions onView={() => setDetail(agreement)} actions={getAvailableAgreementActions(agreement, 'PPM').map(action => ({...action, onClick:() => run(action.id, [agreement])}))}/>},
  ]
  return <div className="page"><PageHeader title="Aprovação" description="Aprove, rejeite ou solicite ajustes nos acordos confirmados pelo KAM."/>
    <div className="metrics"><MetricCard label="Aguardando aprovação" value={String(rows.length)}/><MetricCard label="Valor orçado" value={brl(rows.reduce((total, agreement) => total + agreement.budget, 0))}/><MetricCard label="Valor apurado" value={brl(rows.reduce((total, agreement) => total + (agreement.diValue ?? 0) + (agreement.realValue ?? 0), 0))}/><MetricCard label="Valor proposto" value={brl(rows.reduce((total, agreement) => total + (agreement.proposedValue ?? agreement.budget), 0))}/><MetricCard label="Rejeições / ajustes" value={String(rows.filter(agreement => agreement.status === 'Ajuste solicitado').length)}/></div>
    <Card><TableToolbar search={search} onSearch={setSearch}/><BulkActionsBar count={selectedRows.length} onClear={() => setSelected([])} emptyMessage="Os acordos selecionados possuem status diferentes e não permitem a mesma ação em massa."><>{operationalBulkActions.length ? operationalBulkActions.filter(action => ['approve', 'reject', 'request-adjustment'].includes(action.id)).slice(0, 3).map(action => <Button key={action.id} size="sm" variant={action.id === 'reject' ? 'danger' : 'secondary'} onClick={() => run(action.id, selectedRows)}>{action.label}</Button>) : <span className="bulk-empty">Os acordos selecionados possuem status diferentes e não permitem a mesma ação em massa.</span>}<Button size="sm" variant="tertiary" onClick={() => run('export', selectedRows)}>Exportar selecionados</Button></></BulkActionsBar><DataTable rows={rows} columns={columns} selected={selected} onToggle={toggle} onToggleAll={() => setSelected(selected.length === rows.length ? [] : rows.map(row => row.id))}/></Card>
    {detail && <DetailDrawer agreement={detail} onClose={() => setDetail(undefined)}/>}</div>
}
