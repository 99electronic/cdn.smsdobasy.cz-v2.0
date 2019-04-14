!function($){"use strict";var toggle='[data-toggle="dropdown"]',Dropdown=function(element){var $el=$(element).on('click.dropdown.data-api',this.toggle)
$('html').on('click.dropdown.data-api',function(){$el.parent().removeClass('open')})}
Dropdown.prototype={constructor:Dropdown,toggle:function(e){var $this=$(this),$parent,selector,isActive
if($this.is('.disabled, :disabled'))return
selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
$parent=$(selector)
$parent.length||($parent=$this.parent())
isActive=$parent.hasClass('open')
clearMenus()
if(!isActive)$parent.toggleClass('open')
return!1}}
function clearMenus(){$(toggle).parent().removeClass('open')}
$.fn.dropdown=function(option){return this.each(function(){var $this=$(this),data=$this.data('dropdown')
if(!data)$this.data('dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
$.fn.dropdown.Constructor=Dropdown
$(function(){$('html').on('click.dropdown.data-api',clearMenus)
$('body').on('click.dropdown','.dropdown form',function(e){e.stopPropagation()}).on('click.dropdown.data-api',toggle,Dropdown.prototype.toggle)})}(window.jQuery);!function($){"use strict";var Modal=function(content,options){this.options=options
this.$element=$(content).delegate('[data-dismiss="modal"]','click.dismiss.modal',$.proxy(this.hide,this))}
Modal.prototype={constructor:Modal,toggle:function(){return this[!this.isShown?'show':'hide']()},show:function(){var that=this,e=$.Event('show')
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
$('body').addClass('modal-open')
this.isShown=!0
escape.call(this)
backdrop.call(this,function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(document.body)}
that.$element.show()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in')
transition?that.$element.one($.support.transition.end,function(){that.$element.trigger('shown')}):that.$element.trigger('shown')})},hide:function(e){e&&e.preventDefault()
var that=this
e=$.Event('hide')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=!1
$('body').removeClass('modal-open')
escape.call(this)
this.$element.removeClass('in')
$.support.transition&&this.$element.hasClass('fade')?hideWithTransition.call(this):hideModal.call(this)}}
function hideWithTransition(){var that=this,timeout=setTimeout(function(){that.$element.off($.support.transition.end)
hideModal.call(that)},500)
this.$element.one($.support.transition.end,function(){clearTimeout(timeout)
hideModal.call(that)})}
function hideModal(that){this.$element.hide().trigger('hidden')
backdrop.call(this)}
function backdrop(callback){var that=this,animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(document.body)
if(this.options.backdrop!='static'){this.$backdrop.click($.proxy(this.hide,this))}
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
doAnimate?this.$backdrop.one($.support.transition.end,callback):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one($.support.transition.end,$.proxy(removeBackdrop,this)):removeBackdrop.call(this)}else if(callback){callback()}}
function removeBackdrop(){this.$backdrop.remove()
this.$backdrop=null}
function escape(){var that=this
if(this.isShown&&this.options.keyboard){$(document).on('keyup.dismiss.modal',function(e){e.which==27&&that.hide()})}else if(!this.isShown){$(document).off('keyup.dismiss.modal')}}
$.fn.modal=function(option){return this.each(function(){var $this=$(this),data=$this.data('modal'),options=$.extend({},$.fn.modal.defaults,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option]()
else if(options.show)data.show()})}
$.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0}
$.fn.modal.Constructor=Modal
$(function(){$('body').on('click.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this),href,$target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')),option=$target.data('modal')?'toggle':$.extend({},$target.data(),$this.data())
e.preventDefault()
$target.modal(option)})})}(window.jQuery);!function($){"use strict";var Tooltip=function(element,options){this.init('tooltip',element,options)}
Tooltip.prototype={constructor:Tooltip,init:function(type,element,options){var eventIn,eventOut
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.enabled=!0
if(this.options.trigger!='manual'){eventIn=this.options.trigger=='hover'?'mouseenter':'focus'
eventOut=this.options.trigger=='hover'?'mouseleave':'blur'
this.$element.on(eventIn,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut,this.options.selector,$.proxy(this.leave,this))}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()},getOptions:function(options){options=$.extend({},$.fn[this.type].defaults,options,this.$element.data())
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options},enter:function(e){var self=$(e.currentTarget)[this.type](this._options).data(this.type)
if(!self.options.delay||!self.options.delay.show)return self.show()
clearTimeout(this.timeout)
self.hoverState='in'
this.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)},leave:function(e){var self=$(e.currentTarget)[this.type](this._options).data(this.type)
if(this.timeout)clearTimeout(this.timeout)
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.hoverState='out'
this.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)},show:function(){var $tip,inside,pos,actualWidth,actualHeight,placement,tp
if(this.hasContent()&&this.enabled){$tip=this.tip()
this.setContent()
if(this.options.animation){$tip.addClass('fade')}
placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
inside=/in/.test(placement)
$tip.remove().css({top:0,left:0,display:'block'}).appendTo(inside?this.$element:document.body)
pos=this.getPosition(inside)
actualWidth=$tip[0].offsetWidth
actualHeight=$tip[0].offsetHeight
switch(inside?placement.split(' ')[1]:placement){case 'bottom':tp={top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}
break
case 'top':tp={top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}
break
case 'left':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}
break
case 'right':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}
break}
$tip.css(tp).addClass(placement).addClass('in')}},isHTML:function(text){return typeof text!='string'||(text.charAt(0)==="<"&&text.charAt(text.length-1)===">"&&text.length>=3)||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)},setContent:function(){var $tip=this.tip(),title=this.getTitle()
$tip.find('.tooltip-inner')[this.isHTML(title)?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')},hide:function(){var that=this,$tip=this.tip()
$tip.removeClass('in')
function removeWithAnimation(){var timeout=setTimeout(function(){$tip.off($.support.transition.end).remove()},500)
$tip.one($.support.transition.end,function(){clearTimeout(timeout)
$tip.remove()})}
$.support.transition&&this.$tip.hasClass('fade')?removeWithAnimation():$tip.remove()},fixTitle:function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').removeAttr('title')}},hasContent:function(){return this.getTitle()},getPosition:function(inside){return $.extend({},(inside?{top:0,left:0}:this.$element.offset()),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var title,$e=this.$element,o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title},tip:function(){return this.$tip=this.$tip||$(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass('in')?'hide':'show']()}}
$.fn.tooltip=function(option){return this.each(function(){var $this=$(this),data=$this.data('tooltip'),options=typeof option=='object'&&option
if(!data)$this.data('tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.defaults={animation:!0,placement:'top',selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover',title:'',delay:0}}(window.jQuery);var b64EncodeUnicode=function(str){return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,function(match,p1){return String.fromCharCode(parseInt(p1,16))}))}
var b64DecodeUnicode=function(str){return decodeURIComponent(atob(str).split('').map(function(c){return'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)}).join(''))}
function switchClass(id,oldClass,newClass){$('#'+id).removeClass(oldClass).addClass(newClass)}
function openDetails(obj,textClosed,textOpened,moreClass,lessClass,closeOthers){if(closeOthers==!0){$('.collapsibleDetailsSet').collapse('hide')}
if($('#details'+obj).hasClass('fa-'+moreClass)){switchClass('details'+obj,'fa-'+moreClass,'fa-'+lessClass);$('#print'+obj).collapse('show');$('#linkText'+obj).html(textClosed)}else{switchClass('details'+obj,'fa-'+lessClass,'fa-'+moreClass);$('#print'+obj).collapse('hide');$('#linkText'+obj).html(textOpened)}}
function switchToggle(switchID,action){if(action=='on'){var inputValue=0}
if(action=='off'){var inputValue=1}
if(!action){var inputValue=$('#'+switchID).val()}
if(inputValue!='1'){var newClass='on';var oldClass='off';var oldColor='off';var newColor='on';$('#'+switchID).val('1')}
if(inputValue=='1'){var newClass='off';var oldClass='on';var oldColor='on';var newColor='off';$('#'+switchID).val('0')}
switchClass(switchID+'Switch','fa-toggle-'+oldClass,'fa-toggle-'+newClass);switchClass(switchID+'Switch','faswitch-'+oldColor,'faswitch-'+newColor)}
function removePopovers(e){$('.popOverQ').each(function(){if(!$(this).is(e.target)&&$(this).has(e.target).length===0&&$('.popover').has(e.target).length===0){$(this).popover('hide')}})}
$('html').on('mouseup',function(e){removePopovers(e)});$(window).resize(function(e){removePopovers(e)});function expandLineItem(id){var q_container=$('#q'+id);if(q_container.is(':visible')){q_container.hide('slow');$('#caret_'+id).removeClass('fa-caret-down');$('#caret_'+id).addClass('fa-caret-right')}else{q_container.show('slow');$('#caret_'+id).addClass('fa-caret-down');$('#caret_'+id).removeClass('fa-caret-right')}}
$(function(){$(".popOverQ").popover({html:!0,container:'body'})});function isMobile(){if(window.innerWidth<768){return!0}else{return!1}}
$(document).ready(function(){$('.collapse').collapse({toggle:!1})});var hex_chr="0123456789abcdef";function rhex(num)
{str="";for(j=0;j<=3;j++)
str+=hex_chr.charAt((num>>(j*8+4))&0x0F)+hex_chr.charAt((num>>(j*8))&0x0F);return str}
function str2blks_MD5(str)
{nblk=((str.length+8)>>6)+1;blks=new Array(nblk*16);for(i=0;i<nblk*16;i++)blks[i]=0;for(i=0;i<str.length;i++)
blks[i>>2]|=str.charCodeAt(i)<<((i%4)*8);blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=str.length*8;return blks}
function add(x,y)
{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF)}
function rol(num,cnt)
{return(num<<cnt)|(num>>>(32-cnt))}
function cmn(q,a,b,x,s,t)
{return add(rol(add(add(a,q),add(x,t)),s),b)}
function ff(a,b,c,d,x,s,t)
{return cmn((b&c)|((~b)&d),a,b,x,s,t)}
function gg(a,b,c,d,x,s,t)
{return cmn((b&d)|(c&(~d)),a,b,x,s,t)}
function hh(a,b,c,d,x,s,t)
{return cmn(b^c^d,a,b,x,s,t)}
function ii(a,b,c,d,x,s,t)
{return cmn(c^(b|(~d)),a,b,x,s,t)}
function calcMD5(str)
{x=str2blks_MD5(str);a=1732584193;b=-271733879;c=-1732584194;d=271733878;for(i=0;i<x.length;i+=16)
{olda=a;oldb=b;oldc=c;oldd=d;a=ff(a,b,c,d,x[i+0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+0],20,-373897302);a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651);a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);a=add(a,olda);b=add(b,oldb);c=add(c,oldc);d=add(d,oldd)}
return rhex(a)+rhex(b)+rhex(c)+rhex(d)}
function gotoLoginPage(htaccess1,htaccess2,action){if(action=='relogin'){window.location.replace("/"+htaccess1+"/"+htaccess2)}else{window.location.replace("/"+htaccess1+"/")}}
function openNav(){$('#top-menu-mobile-links').html($('#desktopLinks').html());document.getElementById("myNav").style.width="100%"}
function closeNav(){document.getElementById("myNav").style.width="0%"}
var didScroll;var lastScrollTop=0;var delta=70;var navbarHeight='33';$(window).scroll(function(event){didScroll=!0});setInterval(function(){if(didScroll){hasScrolled();didScroll=!1}},250);function hasScrolled(){var st=$(this).scrollTop();if(Math.abs(lastScrollTop-st)<=delta)
return;if(st>lastScrollTop&&st>navbarHeight){$('header').removeClass('nav-down').addClass('nav-up')}else{if(st+$(window).height()<$(document).height()){showHeader()}}
lastScrollTop=st}
function showHeader(){$('header').removeClass('nav-up').addClass('nav-down')}
jQuery(function($){function tog(v){return v?'addClass':'removeClass'}
$(document).on('input','.clearable',function(){$(this)[tog(this.value)]('x')}).on('mousemove','.x',function(e){$(this)[tog(this.offsetWidth-18<e.clientX-this.getBoundingClientRect().left)]('onX')}).on('touchstart click','.onX',function(ev){ev.preventDefault();$(this).removeClass('x onX').val('').change()})})
