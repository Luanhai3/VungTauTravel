import PolicyLayout from "@/components/policy/PolicyLayout"

export const metadata = {
title:"Liên hệ & khiếu nại | VungTauTravel",
description:"Thông tin liên hệ và hỗ trợ khách hàng của VungTauTravel."
}

export default function Page(){

return(

<PolicyLayout
title="Liên Hệ & Khiếu Nại"
description="Chúng tôi luôn sẵn sàng hỗ trợ và tiếp nhận phản hồi từ người dùng."
>

<h2 className="text-2xl font-semibold">Thông tin liên hệ</h2>

<p>
Email: support@vungtautravel.vn  
Hotline: 0900 000 000
</p>

<h2 className="text-2xl font-semibold">Gửi phản hồi</h2>

<p>
Nếu bạn gặp vấn đề khi sử dụng website
hoặc cần hỗ trợ du lịch,
vui lòng liên hệ với chúng tôi
để được hỗ trợ nhanh nhất.
</p>

</PolicyLayout>

)

}