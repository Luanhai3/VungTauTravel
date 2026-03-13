import crypto from "crypto"

export async function POST(req:Request){

try{

const body = await req.json()

const amount = body.amount

const paymentUrl =
"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

return Response.json({
url: paymentUrl
})

}catch(err){

return Response.json(
{ error:"payment error"},
{ status:500 }
)

}

}