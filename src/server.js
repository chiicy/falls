const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const serve = require('koa-static');
const sizeOf = require('image-size')
const returnValuePath = path.join(__dirname, './mock.json')
const imagesPath = path.join(__dirname, '../server')
let returnValue = fs.readFileSync(returnValuePath).toString()
let returnImgs = fs.readdirSync(imagesPath)
console.log(returnImgs)
console.log(JSON.parse(returnValue))
returnValue = JSON.parse(returnValue).data.object_list

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
const app = new Koa()

router.get('/api/getData', function (ctx, next) {
  console.log('getData')
  const range = []
  for (let i = 0; i < 20; i ++){
    var img = returnImgs[getRandomInt(0, returnImgs.length - 1)]
    const dimensions = sizeOf(path.join(__dirname, '../server/'+img))
    range[i] = {value:returnValue[getRandomInt(0, 23)].msg, img: img, dimensions: dimensions}
}
  ctx.body = {status: 1 ,data: range}
});

app
  .use(serve(path.join(__dirname, '../server')))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8886)
