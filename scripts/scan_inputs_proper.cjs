const fs=require('fs');const path='resources/js/Pages/SuperAdmin/RestaurantSettings.jsx';const s=fs.readFileSync(path,'utf8');let pos=0;let results=[];while((pos=s.indexOf('<input',pos))!==-1){let i=pos;let inSq=false,inDq=false,inTpl=false,inExpr=0,prev='';let end=-1;for(i=pos;i<s.length;i++){const ch=s[i];if(ch==='\\\'' && !inDq && !inTpl){inSq=!inSq;}
else if(ch==='\"' && !inSq && !inTpl){inDq=!inDq;}
else if(ch==='`' && !inSq && !inDq){inTpl=!inTpl;}
else if(ch==='{' && !inSq && !inDq && !inTpl){inExpr++;}
else if(ch==='}' && !inSq && !inDq && !inTpl){ if(inExpr>0) inExpr--; }
else if(ch==='>' && !inSq && !inDq && !inTpl && inExpr===0){ end=i; break; }
prev=ch;
}
if(end===-1){results.push({line: s.slice(0,pos).split('\n').length, error:'no closing > found', pos}); break;}const before=s[end-1];const selfClosing=(before==='/');const snippet=s.slice(pos,end+1);results.push({line: s.slice(0,pos).split('\n').length, pos, end, selfClosing, snippet});pos=end+1;}console.log('Found',results.length,'<input> occurrences');results.forEach((r,idx)=>{console.log(idx+1, 'line',r.line,'selfClosing?',r.selfClosing);}); fs.writeFileSync('tmp_input_scan.json',JSON.stringify(results,null,2)); console.log('Details written to tmp_input_scan.json');