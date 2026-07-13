export function getNameInDescription(texto: string): string {
  const indiceUsuario = texto.indexOf('usuario ');
  if (indiceUsuario === -1) return '';
  return texto.slice(indiceUsuario + 'usuario '.length).trim();
}
