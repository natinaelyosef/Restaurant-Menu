const fs=require('fs');const s=fs.readFileSync('resources/js/Pages/SuperAdmin/RestaurantSettings.jsx','utf8');function findTagAt(pos){ // pos points at '<'
  const n=s.length; let i=pos+1; if(i>=n) return null; if(s[i]==='/'){ i++; // closing
    // read name
    let name=''; while(i<n && /[A-Za-z0-9_:\.]/.test(s[i])){ name+=s[i++]; }
    return {type:'close', name, start:pos, end:i};
  } else if(s[i]==='!'){ // comment or doctype
    return null;
  } else { // opening tag or self-closing
    let name=''; while(i<n && /[A-Za-z0-9_:\.]/.test(s[i])){ name+=s[i++]; }
    return {type:'open', name, start:pos, end:i};
  }
}
let i=0;const stack=[];const lines=s.split('\n');const lineOfIndex=(idx)=>s.slice(0,idx).split('\n').length;while(i<s.length){ if(s[i]==='<' ){ // try parse tag
    // skip if it's a JSX expression like <{...}
    const tag=findTagAt(i); if(!tag){ i++; continue; }
    // find tag end '>' considering braces and quotes
    let j=i+1; let inSq=false,inDq=false,inTpl=false,inExpr=0; let gt=-1;
    for(j=i+1;j<s.length;j++){
      const ch=s[j];
      if(ch==="'" && !inDq && !inTpl) inSq=!inSq;
      else if(ch==='"' && !inSq && !inTpl) inDq=!inDq;
      else if(ch==='`' && !inSq && !inDq) inTpl=!inTpl;
      else if(ch==='{' && !inSq && !inDq && !inTpl) inExpr++;
      else if(ch==='}' && !inSq && !inDq && !inTpl){ if(inExpr>0) inExpr--; }
      else if(ch==='>' && !inSq && !inDq && !inTpl && inExpr===0){ gt=j; break; }
    }
    if(gt===-1){ console.log('No closing > for tag starting at line',lineOfIndex(i)); break; }
    const isSelfClose = s[gt-1]==='/' || s[gt-1]==='?';
    const tagname=tag.name || ''; const l=lineOfIndex(i);
    if(tag.type==='open'){
      if(!isSelfClose){ stack.push({name:tagname,line:l,start:i}); }
    } else if(tag.type==='close'){
      const expected = stack.length?stack[stack.length-1].name:null;
      if(expected && expected!==tagname){ console.log('MISMATCH: expected closing for', expected, 'but found closing for', tagname, 'at line', l); console.log('Top of stack trace:'); stack.slice(-8).forEach(x=>console.log('  opened',x.name,'at line',x.line)); break; }
      stack.pop();
    }
    i=gt+1; continue;
  }
  i++;
}
if(i>=s.length){ if(stack.length) { console.log('Remaining unclosed tags (bottom->top):'); stack.forEach(x=>console.log(x.name,'opened at line',x.line)); } else console.log('All tags balanced'); }
