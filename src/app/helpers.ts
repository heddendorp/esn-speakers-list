export const transformRole = (raw: string): string => {
  return raw
    .replace('regular', '')
    .replace('nationalRepresentative', 'Representative')
    .replace('localRepresentative', 'Representative')
    .replace('IT', 'It')
    .split(/(?=[A-Z])|\./)
    .map(toTitleCase)
    .join(' ');
};

function toTitleCase(str): string {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
