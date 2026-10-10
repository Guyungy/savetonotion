/* Native React control; its identical bundled copy runs inside the Save.to form. */
function StnFeishuControl(props) {
  props=props||{};
  var pair=o.useState({enabled:false,lastResult:null}),state=pair[0],setState=pair[1];
  var errors=o.useState(''),error=errors[0],setError=errors[1],loading=o.useState(false),busy=loading[0],setBusy=loading[1];
  async function ask(action,props) {
    var result=await chrome.runtime.sendMessage(Object.assign({type:'stn-feishu',action:action},props||{}));
    if(!result||!result.ok)throw new Error(result&&result.error||'扩展后台没有响应');return result.data;
  }
  o.useEffect(function(){
    var active=true;
    async function refresh(){try{var next=await ask('state');if(active){setState(next);setError('');}}catch(reason){if(active)setError(reason.message);}}
    function changed(changes,area){if(area==='local'&&(changes.stnFeishuConfig||changes.stnFeishuStatus))refresh();}
    refresh();chrome.storage.onChanged.addListener(changed);
    return function(){active=false;chrome.storage.onChanged.removeListener(changed);};
  },[]);
  async function toggle(event){
    var enabled=event.target.checked;setBusy(true);setError('');setState(Object.assign({},state,{enabled:enabled}));
    try{await ask('toggle',{enabled:enabled});setState(Object.assign({},state,{enabled:enabled}));}
    catch(reason){setState(Object.assign({},state));setError(reason.message);if(enabled&&!state.configured)await ask('open').catch(function(){});}
    finally{setBusy(false);}
  }
  var last=state.lastResult,message=error||(last&&last.state==='error'?last.permissionError||last.error||'飞书同步失败':last&&last.state==='saving'?'正在同步到飞书…':'');
  if(props.resultOnly){
    if(!last||!last.notionBlockId||!(props.notionUrl||'').replace(/-/g,'').includes(last.notionBlockId.replace(/-/g,'')))return null;
    var validUrl=/^https:\/\/feishu\.cn\/docx\//.test(last.url||'');
    return(0,sa.jsxs)('div',{'data-stn-feishu-result':'true',role:'status',style:{padding:16,display:'flex',flexDirection:'column',gap:8,maxWidth:340,overflowWrap:'anywhere',textAlign:'center'},children:[
      (0,sa.jsx)('span',{children:last.state==='saving'?'正在同步到飞书…':last.state==='success'?'已同步到飞书':last.permissionError||last.error||'飞书同步未完成'}),
      validUrl&&(0,sa.jsx)('a',{href:last.url,target:'_blank',rel:'noopener',style:{color:'#1769e0',textDecoration:'underline'},children:'打开飞书文档'}),
      validUrl&&(0,sa.jsx)('span',{style:{fontSize:12,color:'#64748b'},children:last.url})
    ]});
  }
  return(0,sa.jsxs)('div',{'data-stn-feishu-control':'true',style:{display:'flex',flexDirection:'column',alignItems:'flex-end',fontSize:13,color:'#374151'},children:[
    (0,sa.jsxs)('div',{style:{display:'flex',alignItems:'center',gap:6},children:[
      (0,sa.jsxs)('label',{style:{display:'inline-flex',alignItems:'center',gap:6,cursor:'pointer',whiteSpace:'nowrap'},children:[
        (0,sa.jsx)('input',{type:'checkbox',checked:state.enabled,disabled:busy,onChange:toggle,'aria-label':'同步到飞书',style:{appearance:'auto',width:16,height:16,margin:0,cursor:'pointer'}}),'同步到飞书'
      ]}),
      (0,sa.jsx)('button',{type:'button',title:'飞书同步设置','aria-label':'飞书同步设置',onClick:function(){ask('open').catch(function(reason){setError(reason.message);});},style:{border:0,background:'transparent',color:'#64748b',cursor:'pointer',padding:3},children:'⚙'})
    ]}),
    message&&(0,sa.jsx)('span',{role:'status',style:{fontSize:11,color:'#a14919',maxWidth:190,overflowWrap:'anywhere'},children:message}),
    last&&/^https:\/\/feishu\.cn\/docx\//.test(last.url||'')&&(0,sa.jsx)('a',{href:last.url,target:'_blank',rel:'noopener',style:{fontSize:11,color:'#1769e0'},children:'打开飞书文档'})
  ]});
}
