function appendChildDomInfo(obj){
  
  const { delayTime , style , className , msg} = {delayTime:4500,...obj};

  let docByClassArr =  document.getElementsByClassName('info-pop_up-box')
  let offHeight = docByClassArr[0]?docByClassArr[0].offsetHeight: 51 || 51
  let div = document.createElement('div');
      div.style        = style || '';
      div.innerText    = msg   || '';
      div.style.zIndex = 2020;
      div.className    = className || 'info-pop_up-box right';
      div.style.top    = 16 + ((  offHeight + 16)*docByClassArr.length) + 'px';
  //console.log(offHeight)
      //div.appendChild({ ...document.createElement('div') });
  document.body.appendChild(div);
  
  setTimeout(()=>{
    document.body.removeChild(div);
    docByClassArr =  document.getElementsByClassName('info-pop_up-box')
    for (let i = 0; i < docByClassArr.length; i++) {
      docByClassArr[i].style.top = parseInt(docByClassArr[i].style.top, 10) - offHeight - 16 + 'px';
    }
  },delayTime)
  
}

export default appendChildDomInfo