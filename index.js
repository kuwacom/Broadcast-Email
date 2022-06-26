const nodemailer = require("nodemailer");
const dns = require("dns");

const mailList = ["kuwa@kuwa.dev","main@kuwa.dev"]

const fromMail = "noreply@mail.kuwa.app"
const fromName = "kuwa-network✔"

const sendMail = {
    "title": "notic test message📢",
    "text": "test mail",
    "html": "This email wassent to check the smtp port.<br>このメールはsmtpポートのチェック用に送信されたものです。"
}

async function getMX(domain){
    return new Promise((resolve) => {
        dns.resolveMx(domain, (err,address)=>{
            if(err){
                resolve(null)
            }else{
                resolve(address)
            }
        });
    })
}

(async ()=>{
    mailList.forEach( async (mail) =>{
    const mx = await getMX(mail.split("@")[1])//mx取得
    if(!mx){
        console.log("error domain")
        return
    }
    // console.log(mx)
    const mxPriority = mx.map((data) => data.priority).sort((a, b)=>{
            return a - b
        })//mxの優先順位高い順に優先リストに入れる
    for(const priority of mxPriority){//優先リスト高い順にfor
        try{
        const address = mx.find(data => data.priority == priority).exchange
        console.log(address)

        let transporter = nodemailer.createTransport({
        host: address,
        port: 25,
        // logger: true,
        // debug: true,
        // secure: true,
        });

        transporter.sendMail({
        from: `"${fromName}" <${fromMail}`,
        to: mail,
        subject: sendMail.title,
        text: sendMail.text,
        html: sendMail.html,
        
        });
    
        console.log(`Message sent to ${mail}`);

        break
        }catch (err){
            console.log
        }
    }
    })
})()