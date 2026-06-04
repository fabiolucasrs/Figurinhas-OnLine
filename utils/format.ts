export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
