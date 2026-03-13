import crypto from "crypto"

export async function POST(req:Request){

const body = await req.json()

const amount = body.amount

const tmnCode = process.env.VNPAY_TMN
const secret = process.env.VNPAY_SECRET
const returnUrl = "http://localhost:3000/payment-success"

const vnpParams:any = {}

vnpParams["vnp_Version"]="2.1.0"
vnpParams["vnp_Command"]="pay"
vnpParams["vnp_TmnCode"]=tmnCode
vnpParams["vnp_Amount"]=amount*100
vnpParams["vnp_CurrCode"]="VND"
vnpParams["vnp_TxnRef"]=Date.now()
vnpParams["vnp_OrderInfo"]="Dat phong VungTauTravel"
vnpParams["vnp_OrderType"]="billpayment"
vnpParams["vnp_Locale"]="vn"
vnpParams["vnp_ReturnUrl"]=returnUrl
vnpParams["vnp_IpAddr"]="127.0.0.1"

const sorted = Object.keys(vnpParams).sort()

let signData=""

sorted.forEach(key=>{
signData+=key+"="+vnpParams[key]+"&"
})

signData = signData.slice(0,-1)

const secureHash = crypto
.createHmac("sha512",secret!)
.update(signData)
.digest("hex")

const url =
"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?"
+signData
+"&vnp_SecureHash="+secureHash

return Response.json({url})

}