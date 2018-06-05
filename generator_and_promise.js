const name_2_id_map = {
    abby:'1',
    bobby:'2',
    candy:'3',
    tim:'4'
};
const id_2_score_map = {
    1:99,
    2:88,
    3:77,
    5:66
};
//模拟异步请求,返回一个promise
let getIdByName = (name)=>{
    //console.log(`getIdByName: input:[${name}] / output:[${map[name]}]`);
    return new Promise((good,bad)=>{
        setTimeout(()=>{
            if(typeof name_2_id_map[name]!=='undefined'){
                good(name_2_id_map[name]);
            }else{
                bad('id not found');
            }
        },500);
    })
}

let getScoreById = (id)=>{
    //console.log(`getScoreById: input:[${id}] / output:[${map[id]}]`);
    return new Promise((good,bad)=>{
        setTimeout(()=>{
            if(typeof id_2_score_map[id]!=='undefined'){
                good(id_2_score_map[id]);
            }else{
                bad('score not found');
            }
        },500);
    })
}
//获取分数的generator函数
function* getScoreByNameGenerator(name){
    let id = yield getIdByName(name);
    let score = yield getScoreById(id);
    return score
}
//generator的执行器
let getScoreByName = (name)=>{
    //实例化generator
    let gen = getScoreByNameGenerator(name);
    //包装一个promise，知道什么时候generator执行完或者出错
    return new Promise((good,bad)=>{
        let run = (lastPromise)=>{
            let {value,done} = gen.next(lastPromise);
            //异步会返回一个promise
            //判断是否结束
            //未结束则递归调用
            //结束则resolve大promise
            if(!done){
                value.then(run,bad);
            }else{
                good(value);
            }
        }
        run();
    });
}
//用promise封装generator
getScoreByName('tim').then(suc=>{
    console.log(`suc : ${suc}`)
},fail=>{
    console.error(fail)
});

//generator其实就是可以把异步请求序列化，好像先请求A，再根据A的结果去请求B，再根据B的结果去请求C。
//这个如果用普通回调来写的话，请求一多就变成回调地狱了。
//但是generator是让你可以在函数里暂停，然后和外界交换下数据，再继续执行
//通常我们是在异步序列化的时候才能体现generator的价值
//但是异步请求的时候我们不知道结果什么时候会返回，就是说我们不知道应该什么时候去调next()来取yield后面的值
//知道什么时候数据会返回，就是要知道请求的状态的变化~
//可以用监听~当然~
//但是我们有promise~
//只要我们把异步请求包成一个Promise，我们就可以知道数据什么时候返回，也就知道什么时候要去调用next()
//但是执行generator的时候我们需要去调用next()让流程往下走，调用的时候还有通过next函数来和generator交流数据
//所以需要一个generator执行器，来控制generator的执行
