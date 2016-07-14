```html
<ul id="list">
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>
<script>
  var list = document.getElementById("list");
  console.log(list.childNode);
  //[text, li, text, li, text, li, text, li, text, item: function]
</script>
```
关于元素的选择  
只有 document.getElementById 和 getElementsByTagName 可以全兼容外  
document.getElementsByClassName / document.querySelector / document.querSelectorAll 都是要IE9+  
讨厌的IE  
如果要获得list下面的全部li，原生JS我喜欢用document.querSelectorAll("#list li")  
返回的是全部li的NodeList，但是可能会有兼容问题  
如果我用上面的代码，返回的NodeList里会有TextNode！！！  
虽说可能有人会要用到，但是我还是很讨厌的，因为这样要处理某个子元素在父元素中的位置时会比较麻烦  
所以现在要想办法把TextNode去掉  
```javascript
var newList = [];
Array.prototype.map.call(list,function(node){
  if(node.nodeType==1) newList.push(node);
});
```
做了两件事，一是把NodeList转成了Array，二是把TextNode去掉了  
node的nodeType的代码是这样的  
元素 == 1  
属性 == 2  
文本 == 3  
注释 == 8  
文档 == 9  
