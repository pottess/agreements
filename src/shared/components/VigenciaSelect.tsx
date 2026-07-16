import { Select } from '../../design-system/components/Fields'
import { useAgreements } from '../../domain/agreements.store'

export function VigenciaSelect({annual=false}:{annual?:boolean}){const{state,dispatch}=useAgreements();return <Select label="Vigência" value={state.selectedMonth} onChange={event=>dispatch({type:'SET_MONTH',month:event.target.value})}><option value="2026-03">{annual?'Anual 2026':'Mar/2026'}</option><option value="2026-04">{annual?'Anual 2027':'Abr/2026'}</option><option value="2026-05">{annual?'Anual 2028':'Mai/2026'}</option></Select>}
