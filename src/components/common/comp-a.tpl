#export{name: "comp-a"}
#comps{
  lists:{
    a: "a",
    b: "b"
  }, 
  map: {a: {},b: {}}
}
#css{src:"./"}
#wxs{module:"m",src:"./wxs.js"}

div{}
  "comp-a"
button{class:"btn",@click:onTap}
  "comp-a button"
div{}
  span{class:"prefix"}
    $prefix
  "-" + $str + "-"
  span{class:"suffix"}
    $suffix
slot{}
div{}
  "testObj: " + $testObj.a + "-" + $testObj.b
div{}
  "testArr: "
  block{for:testArr, key:index}
    span{}
      $item
div{}
  "testDefaultVal: " + $testDefaultVal
div{}
  img{src:"./img.png"}
  "testObj: " + $testObj.a + $testObj.b

div{a: {}, b: {}}
