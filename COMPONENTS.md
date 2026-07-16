# Biblioteca de componentes

Esta foundation define uma única implementação por componente. Na fase funcional, cada item deve ser criado no diretório compartilhado de componentes e receber dados por propriedades — nunca copiado para um módulo.

| Componente | Variações/estados obrigatórios | Uso em Agreements |
| --- | --- | --- |
| Button | primary, secondary, tertiary, danger; default, hover, focus, disabled, loading | ações de página, confirmação e lote |
| IconButton | ghost, subtle, disabled, tooltip acessível | ações compactas de tabela e cabeçalho |
| Input / Select / Textarea | label, help, required, error, disabled, read-only | cadastro e exceções |
| Checkbox / Radio / Switch | default, checked, indeterminate, disabled | seleção, escolha e automações |
| Tag / StatusIndicator | neutro, sucesso, aviso, erro, informação | estados de acordo e SAP |
| Toast / Alert | success, warning, error, info; ação opcional | retorno de salvar, importar e aprovar |
| Card / MetricCard | default, clickable, loading | orçamento, métricas e resumo |
| DataTable | loading, empty, error, selected, inline edit | padrão único de listas do produto |
| Modal / ConfirmationDialog | default, danger, blocking action | criar, aprovar, rejeitar, excluir |
| Drawer / ExceptionDrawer | detalhes, filtros, exceção | contexto sem perder a lista |
| Tabs / Stepper / Breadcrumb | seleção atual, disabled, concluído | navegação e fluxo de acordo |
| PageHeader / SectionHeader | título, descrição, ações | estrutura consistente de páginas |
| ProgressIndicator | determinate, indeterminate, erro | carga, envio e progresso de etapas |
| FileUpload / BulkUpload / UploadTemplateCard | idle, dragging, processing, success, error | templates e cargas de dados |
| AuditTrail | evento, ator, data, comentário | rastreabilidade de aprovação |
| InlineEditableField / ManualInputCell | leitura, edição, salvando, erro, salvo | apuração manual com confirmação |

## Composições de domínio

- `AgreementTable` compõe `TableToolbar`, `TableFilters`, `DataTable`, `AgreementStatusBadge`, `ManualInputCell` e `ApprovalBatchActions`.
- `ValueComparison` compõe valores orçado/apurado/pago e um `StatusIndicator`; a diferença nunca é apenas cromática.
- `BudgetConsumptionCard` compõe `MetricCard` e `ProgressIndicator`.
- `LeversTable` é a matriz anual carregada por template e usa `LeverAutomationBadge` (manual, automático ou híbrido).
- `MonthlyCheckTable` consome a matriz anual pré-preenchida, registra exceções e usa os mesmos estados e regras de seleção de `AgreementTable`.
- `PaymentStatusTimeline` é a visualização de eventos, não uma nova fonte de status: consome o token de status existente.
- `SAPReturnStatus` usa Tag/Alert, com código e orientação recuperável quando houver falha.
- `ConfirmOkAction` é a composição de confirmação positiva, nunca um novo estilo de botão.

## Contrato de estado

Todo componente de domínio deve expor: `loading`, `empty`, `error`, `disabled` (quando aplicável) e uma mensagem de recuperação. Os estados de negócio são: pendente, em revisão, confirmado, aprovado, rejeitado, pago, parcialmente pago, com divergência, manual, automático e híbrido.
