const assert=require("assert");const {createStore}=require("../ratings.js");
function mem(){const d={};return{getItem:k=>k in d?d[k]:null,setItem:(k,v)=>{d[k]=String(v)},d}}
(async()=>{
 const m=mem();let s=createStore({apiBase:"",storage:m});
 assert.deepStrictEqual(s.stats("v1"),{avg:0,count:0,favs:0});
 await s.rate("v1",4);assert.deepStrictEqual(s.stats("v1"),{avg:4,count:1,favs:0});
 await s.rate("v1",2);assert.deepStrictEqual(s.stats("v1"),{avg:2,count:1,favs:0}); // replaced, not added
 await s.fav("v1");assert.strictEqual(s.stats("v1").favs,1);assert(s.isFav("v1"));
 await s.fav("v1");assert.strictEqual(s.stats("v1").favs,0);
 await s.fav("v1",true);assert(s.isFav("v1"));
 assert.strictEqual((await s.rate("v1",9)),false);assert.strictEqual(s.myStars("v1"),2);
 const s2=createStore({storage:m});assert.strictEqual(s2.myStars("v1"),2);assert.strictEqual(s2.voter(),s.voter()); // persists
 // server mode with failing fetch -> local fallback
 const f=createStore({apiBase:"http://x",storage:mem(),fetch:()=>Promise.reject(new Error("down"))});
 assert.strictEqual(await f.load(),"local");await f.rate("v2",5);assert.strictEqual(f.stats("v2").avg,5);
 // server mode ok
 const calls=[];const srv={"v1":{avg:4.2,count:12,favs:3}};
 const g=createStore({apiBase:"http://x",storage:mem(),fetch:(u,o)=>{calls.push([u,o&&o.method,o&&o.body]);return Promise.resolve({ok:true,json:()=>Promise.resolve(srv)})}});
 assert.strictEqual(await g.load(),"server");assert.deepStrictEqual(g.stats("v1"),srv.v1);
 await g.rate("v1",5);const pc=calls.find(c=>c[1]==="POST");assert.strictEqual(pc[0],"http://x/rate");
 const b=JSON.parse(pc[2]);assert(b.version==="v1"&&b.stars===5&&b.voter===g.voter());
 await g.fav("v1",true);assert(calls.some(c=>c[0]==="http://x/fav"&&JSON.parse(c[2]).on===true));
 console.log("RATINGS TEST OK");
})().catch(e=>{console.error(e);process.exit(1)});
