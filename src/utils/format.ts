export const formatCPF = (value: string) => {
  if (!value) return value;

  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value;
};

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  if (value.length > 13) {
    return value;
  }

  // Verifica o comprimento para aplicar o formato correto
  if (value.length === 13) {
    const prefix = `+${value.slice(0, -11)} `;

    // Aplica a máscara nos 11 últimos dígitos
    const formattedNumber = value
      .slice(-11)
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    return `${prefix}${formattedNumber}`;
  } else if (value.length === 12) {
    const prefix = `+${value.slice(0, -10)} `;

    // Aplica a máscara nos 11 últimos dígitos
    const formattedNumber = value
      .slice(-10)
      .replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

    return `${prefix}${formattedNumber}`;
  } else if (value.length > 10) {
    // Número com DDD e 9 dígitos (ex: +55 (11) 91234-5678)
    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (value.length === 10) {
    // Número com DDD e 8 dígitos (ex: +55 (11) 1234-5678)
    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (value.length === 9) {
    // Número sem DDD, com 9 dígitos (ex: 91234-5678)
    value = value.replace(/^(\d{5})(\d{4})$/, '$1-$2');
  } else if (value.length === 8) {
    // Número sem DDD, com 8 dígitos (ex: 1234-5678)
    value = value.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  } else if (value.length > 6) {
    // Formatação intermediária de DDD e parte do número (ex: (11) 91234)
    value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
  } else if (value.length > 2) {
    // Formatação intermediária com DDD e número parcial (ex: (11) 12)
    value = value.replace(/^(\d{2})(\d{1,4})$/, '($1) $2');
  } else if (value.length > 0) {
    // Apenas o DDD parcial (ex: (11)
    value = value.replace(/^(\d{1,2})$/, '($1');
  }

  return value;
};

export const formatCep = (cep: string) => {
  if (!cep) return cep;

  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const formatPrice = (value: number) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return formattedValue;
};
