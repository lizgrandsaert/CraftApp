export const tools = ['Drill','Hot glue gun','Scissors','Canary cutter','Hand-saw'];
export const materials = ['Cardboard','Glue','Tape','String','Craft paper','Collage materials'];
const aliases = {
 'Drill': /\bdrill(?:s|ing)?\b/i, 'Hot glue gun': /\bhot[ -]?glue\s*guns?\b/i,
 'Scissors': /\bscissors\b/i, 'Canary cutter': /\bcanary\s*(?:cutter|knife)s?\b/i,
 'Hand-saw': /\bhand[ -]?saws?\b/i, 'Cardboard': /\b(?:cardboard|paperboard)\b/i,
 'Glue': /\bglue\b/i, 'Tape': /\btape\b/i, 'String': /\bstring\b/i,
 'Craft paper': /\b(?:craft|construction) paper\b/i, 'Collage materials': /\bcollage materials\b/i
};
export function matchRecord(r, options) {
 const f=r.fields;
 if (!(f['Activity Steps']||[]).length || /reference|curriculum|multi-activity/i.test((f['Source type']||[]).join(' '))) return null;
 const notes=[];
 const raw=(f['Age Range']||f['Age range']||[])[0]||'';
 const age=raw.match(/^\s*(\d+)\s*[-–]\s*(\d+)\s*$/);
 if(age) {if(Number(age[2])<options.min || Number(age[1])>options.max)return null;}
 else notes.push('Age range not specified or needs review');
 const lines=(f.Materials||[]).flatMap(x=>x.split('\n')).filter(x=>x.trim());
 const text=lines.join('\n');
 const requirements=[...tools,...materials].filter(x=>aliases[x].test(text));
 // A named requirement cannot be satisfied by an unchecked item.
 if(requirements.some(x=>!options.available.includes(x)))return null;
 // Preserve uncertainty: headings, alternatives and uncatalogued supplies need review.
 const remainder=lines.filter(line=>!/:\s*$/.test(line)).map(line=>{
  let s=line; for(const name of requirements)s=s.replace(new RegExp(aliases[name].source,'ig'),'');
  return s.replace(/\b(?:and|or|for|students?|instructors?|tools?|materials?|the|a|an)\b/ig,'').replace(/[\s\d\W_]+/g,'');
 }).filter(Boolean);
 if(!lines.length)notes.push('Materials not specified');
 else if(remainder.length)notes.push('Additional supplies or alternatives need checking in the source list');
 if(notes.length&&!options.includeUnknown)return null;
 return {record:r,notes};
}
