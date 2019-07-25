const superAgent = require('superagent')
const cheerio = require('cheerio')
const readline = require('readline')
// 创建readlinde.Interface 实现命令行交互
const rl = readline.createInterface({
    input: process.stdin,//一个指向 标准输入流(stdin) 的可读流(Readable Stream)
    output: process.stdout,//一个指向标准输出流(stdout)的 可写的流(Writable Stream)：
    prompt: ' 😆  您正在使用多伟笑话-cli,按下回车查看笑话 😜 '
})
let url = 'https://www.hahaw.cn/';

let page = 1

// 使用数组来存放笑话
let jokeStories = [];
// 载入笑话并存入数组中
function loadJokes(){
    // 数组中的笑话不足三条时就请求下一页的数据
    if(jokeStories.length<3){
        superAgent
            .get(url+'home_'+page+'.html')
            .end((err, res)=>{
                if(err) return
				// console.log(res.text)
                const $ = cheerio.load(res.text)
				
                const jokeList = $('.content')
				
				
                jokeList.each(function(i, item){
					if($(this).text()){
						jokeStories.push($(this).text()) //存入数组
					}
                    
                });
                page++
            })
    }
}

rl.prompt();
loadJokes();
// line事件 每当 input 流接收到接收行结束符（\n、\r 或 \r\n）时触发 'line' 事件。 通常发生在用户按下 <Enter> 键或 <Return> 键。
// 按下回车键显示一条笑话
rl.on('line', (line) => {
    if(jokeStories.length>0){
        console.log('======================');
        console.log(jokeStories.shift());
        loadJokes()
    }else{
        console.log('正在加载中~~~请稍等')
    }
    rl.prompt()
}).on('close', () => {
    console.log('Bye!');
});