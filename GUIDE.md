# Agreements Futuro — Design Foundation

## Princípios

- Consuma tokens semânticos; nunca aplique valores de cor, sombra ou espaçamento no componente.
- Reutilize componentes base em todos os módulos. Componentes de domínio apenas compõem a base.
- Todo status usa ícone + texto + cor. Não dependa apenas de cor.
- Use `Primary` para a ação principal da página; `Secondary` para alternativa; `Tertiary` para ação de baixo peso; `Danger` exclusivamente para ações destrutivas confirmadas.

## Arquitetura

| Camada | Responsabilidade | Exemplos |
| --- | --- | --- |
| Tokens | Decisões globais e de marca | `--color-action-default`, `--space-md`, `--elevation-lg` |
| Base | Controles e estruturas reutilizáveis | Button, Input, Tag, Toast, Modal, DataTable |
| Domínio | Combina componentes base sem reinventar estilo | AgreementTable, ValueComparison, SAPReturnStatus |
| Página | Compõe header, toolbar, conteúdo e feedback | Desdobramento anual, Cadastro mensal, Apuração, Aprovação |

## Componentes previstos

Base: Button, IconButton, Input, Select, Textarea, Checkbox, Radio, Switch, Tag/Badge, Toast, Alert, Card, MetricCard, DataTable, TableToolbar, TableFilters, EmptyState, Modal, Drawer, Tabs, Stepper, Breadcrumb, PageHeader, SectionHeader, StatusIndicator, ProgressIndicator, FileUpload, BulkUpload, ConfirmationDialog, AuditTrail e InlineEditableField.

Domínio: AgreementTable, AgreementStatusBadge, ValueComparison, BudgetConsumptionCard, LeversTable, LeverAutomationBadge, MonthlyCheckTable, ApprovalBatchActions, PaymentStatusTimeline, ExceptionDrawer, SAPReturnStatus, ManualInputCell, ConfirmOkAction e UploadTemplateCard.

## Padrão de tabela

1. Toolbar: busca primeiro, filtros em seguida, ação de exportar/configurar por último.
2. Colunas: status deve aparecer cedo; números monetários alinhados à direita na implementação final.
3. Ações em lote surgem somente após seleção; ações por linha ficam na última coluna.
4. Edição inline usa confirmação explícita e feedback de salvo/erro.
5. Sempre oferecer loading, empty state, erro recuperável e paginação/contagem.

## Checklist visual

- [ ] Nenhum valor visual hardcoded fora de `styles/tokens.css`.
- [ ] Espaçamentos usam a escala Celebration (2/4/8 e múltiplos).
- [ ] Elevação limitada a SM, MD ou LG.
- [ ] Focus ring visível em controles interativos.
- [ ] Labels, ajuda e mensagens de erro estão associados aos campos.
- [ ] Status comunicam texto, ícone e cor.
- [ ] PageHeader, toolbar e estados seguem o padrão de página.
- [ ] Não há duplicação de componentes entre módulos.
