export interface Theme {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;
}

export const light: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  linkColor: '#0070f3',
  borderColor: '#e0e0e0'
};

export const dark: Theme = {
  backgroundColor: '#333333',
  textColor: '#ffffff',
  linkColor: '#1e90ff',
  borderColor: '#444444'
};
