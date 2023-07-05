import enLangs from './en.lang';
import esLangs from './es.lang';

const map = new Map<string, Map<string, string>>();

map.set('es', esLangs);
map.set('en-US', enLangs);

export default map;
