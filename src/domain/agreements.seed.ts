import type { Agreement, AppState, Lever } from './agreements.types'

export const leversSeed: Lever[] = [
  ['L01','Rede Extra','Ana Ribeiro','Juliana Silva','Cervejas','Ponta de Gôndola','Automática DI',3200,620000,620000,480000,240000,'Ativo'],
  ['L02','Rede Extra','Ana Ribeiro','Juliana Silva','Cervejas','Encante','Híbrida',1800,390000,390000,300000,180000,'Ativo'],
  ['L03','Bom Mercado','Carla Nunes','Carla Nunes','Não alcoólicas','Degustação','Manual KAM',900,210000,210000,150000,60000,'Pendente'],
  ['L04','Arena Atacado','Bruno Alves','Ana Ribeiro','Cervejas','Ilha Promocional','Híbrida',2400,540000,540000,420000,180000,'Ativo'],
  ['L05','Arena Atacado','Bruno Alves','Bruno Alves','Cervejas','Aniversário PDV','Automática DI',1600,330000,330000,260000,120000,'Ativo'],
  ['L06','Bom Mercado','Carla Nunes','Carla Nunes','Alimentos','Bonificação Sell-out','Automática DI',4200,480000,480000,350000,230000,'Ativo'],
  ['L07','Rede Extra','André Costa','Juliana Silva','Cervejas','Contrato Nacional','Híbrida',1200,280000,280000,190000,90000,'Ativo'],
  ['L08','Arena Atacado','Bruno Alves','Bruno Alves','Cervejas','Backlight','Manual KAM',500,160000,160000,120000,40000,'Pendente'],
  ['L09','Bom Mercado','Carla Nunes','Ana Ribeiro','Logística','Automática DI',3000,410000,410000,300000,170000,'Ativo'],
  ['L10','Rede Extra','Ana Ribeiro','Juliana Silva','Não alcoólicas','Ação Spot','Manual KAM',300,90000,90000,45000,0,'Inativo'],
].map(([id,network,buyer,kam,category,name,automation,annualTarget,annualBudget,allocated,committed,paid,status])=>({id,network,buyer,kam,category,name,automation,annualTarget,annualBudget,allocated,committed,paid,status} as Lever))

const base = (id:string, lever:Lever, status:Agreement['status'], stage:Agreement['stage'], budget:number):Agreement => ({id,leverId:lever.id,month:'2026-03',network:lever.network,buyer:lever.buyer,kam:lever.kam,ppm:id.charCodeAt(id.length-1)%2?'Mariana Costa':'Roberto Lima',lever:lever.name,automation:lever.automation,plannedTarget:lever.annualTarget/12,monthlyTarget:lever.annualTarget/12,budget,stage,status,updatedAt:'Hoje, 10:42'})
export const agreementsSeed:Agreement[] = [
  {...base('AC-0418',leversSeed[0],'Apurado DI','Apuração',20400),diValue:20400},
  {...base('AC-0419',leversSeed[1],'Com divergência','Apuração',18500),diValue:12000,realValue:4500},
  {...base('AC-0420',leversSeed[2],'Manual pendente','Apuração',8000)},
  {...base('AC-0421',leversSeed[3],'Confirmado KAM','Apuração',13000),diValue:9500,realValue:3500,kamConfirmed:'Juliana Silva · hoje 10:51'},
  {...base('AC-0422',leversSeed[4],'Aguardando aprovação','Aprovação',7500),diValue:7500,kamConfirmed:'Bruno Alves · hoje 10:48'},
  {...base('AC-0423',leversSeed[5],'Aprovado','Assinatura',17800),diValue:17800,approvedValue:17800,ppmDecision:'Mariana Costa · aprovado'},
  {...base('AC-0424',leversSeed[6],'Aguardando assinatura','Assinatura',16000),diValue:16000,approvedValue:16000,signatureStatus:'Aguardando Ana Ribeiro'},
  {...base('AC-0425',leversSeed[7],'Assinado','Pagamento',12000),realValue:12000,approvedValue:12000,signatureStatus:'Assinado'},
  {...base('AC-0426',leversSeed[8],'Pago','Finalizado',17000),diValue:17000,approvedValue:17000,paidValue:17000,sapDocument:'5100041091',sapStatus:'Pago'},
  {...base('AC-0427',leversSeed[9],'Saldo em aberto','Pagamento',9000),realValue:9000,approvedValue:9000,paidValue:5000,sapDocument:'5100041520',sapStatus:'Processado'},
  {...base('AC-0428',leversSeed[0],'Pré-preenchido','Cadastro',20000)},
  {...base('AC-0429',leversSeed[1],'Exceção','Cadastro',16500),exceptionReason:'Meta revisada pela rede'},
]
export const initialState:AppState={levers:leversSeed,agreements:agreementsSeed,annualPublished:true,selectedMonth:'2026-03'}
