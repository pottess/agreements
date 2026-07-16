import type { Action } from './agreements.types'
export const agreementActions={publishAnnual:():Action=>({type:'PUBLISH_ANNUAL'}),confirmKam:(ids:string[]):Action=>({type:'CONFIRM_KAM',ids}),sendApproval:(ids:string[]):Action=>({type:'SEND_APPROVAL',ids}),updateSap:():Action=>({type:'UPDATE_SAP'})}
