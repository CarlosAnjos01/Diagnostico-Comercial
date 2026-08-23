# Ginga Aí — Diagnóstico Comercial
## Especificação funcional v1.0

### 1. Papel do produto

O Diagnóstico Comercial é o produto de entrada da Ginga Aí.

Ele não deve ser tratado como formulário. Sua função é transformar respostas estruturadas em uma leitura objetiva da maturidade comercial da empresa e apontar prioridades de evolução.

### 2. Promessa

Em poucos minutos, o empresário deve descobrir:

- nível de maturidade comercial;
- desempenho por dimensão;
- principal gargalo;
- três prioridades;
- próximo passo recomendado.

### 3. Dimensões

1. Estratégia
2. Processo Comercial
3. Pessoas
4. Gestão e Indicadores
5. Tecnologia e Dados
6. Marketing e Geração de Demanda
7. Retenção e Expansão

### 4. Escala de maturidade

1 — Não existe  
2 — Informal  
3 — Parcial  
4 — Estruturado  
5 — Gerenciado

A resposta é convertida para uma escala de 0 a 100 por dimensão.

### 5. Maturidade global

0–29: Informal  
30–49: Emergente  
50–69: Estruturação  
70–84: Gerenciado  
85–100: Escalável

### 6. Regra de gargalo

O principal gargalo é a menor pontuação entre as dimensões.

As três menores dimensões formam as três prioridades iniciais.

### 7. Relação com G.I.N.G.A.

O diagnóstico é a porta de entrada da fase:

G — Diagnóstico

A entrega deve preparar a transição para:

I — Arquitetura  
N — Nivelamento  
G — Governança  
A — Aperfeiçoamento

### 8. Regra comercial

O resultado deve gerar clareza antes de gerar venda.

A recomendação para Estruturação ou Aceleração deve ser consequência do diagnóstico, não uma pressão comercial.

### 9. Ciclo de patrimônio

Cliente → Projeto → Conhecimento → Biblioteca → Framework → Produto → Novo Cliente.

Cada diagnóstico deve gerar dados estruturados que possam, respeitando privacidade e regras de uso, alimentar benchmarks e ativos internos.

### 10. Critérios de aceite do MVP

- usuário consegue completar diagnóstico sem intervenção;
- nenhuma pergunta pode ser pulada;
- respostas permanecem durante a sessão;
- score global é calculado automaticamente;
- score por dimensão é exibido;
- gargalo é identificado;
- três prioridades são exibidas;
- resultado pode ser impresso/salvo em PDF;
- diagnóstico é persistido quando API/D1 está configurada;
- produto funciona sem backend durante desenvolvimento;
- layout responsivo;
- código versionado no GitHub.
