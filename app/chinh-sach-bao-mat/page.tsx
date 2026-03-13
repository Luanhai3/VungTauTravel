import PolicyLayout from "@/components/policy/PolicyLayout"

export const metadata = {
title:"Chính sách bảo mật | VungTauTravel",
description:"Tìm hiểu cách VungTauTravel thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng."
}

export default function Page(){

return(

<PolicyLayout
title="Chính Sách Bảo Mật"
description="Chúng tôi tôn trọng quyền riêng tư của người dùng và cam kết bảo vệ thông tin cá nhân."
>

<h2 className="text-2xl font-semibold">1. Thu thập thông tin</h2>

<p>
Chúng tôi có thể thu thập một số thông tin cá nhân như tên, email,
hoặc dữ liệu truy cập website nhằm cải thiện trải nghiệm người dùng
và cung cấp nội dung du lịch phù hợp.
</p>

<h2 className="text-2xl font-semibold">2. Mục đích sử dụng</h2>

<p>
Thông tin được sử dụng để nâng cao chất lượng dịch vụ,
cải thiện nội dung du lịch và hỗ trợ người dùng khi cần thiết.
</p>

<h2 className="text-2xl font-semibold">3. Bảo mật dữ liệu</h2>

<p>
Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức
để bảo vệ thông tin người dùng khỏi truy cập trái phép.
</p>

<h2 className="text-2xl font-semibold">4. Chia sẻ thông tin</h2>

<p>
VungTauTravel không bán hoặc chia sẻ dữ liệu cá nhân
cho bên thứ ba ngoại trừ khi được yêu cầu bởi pháp luật.
</p>

</PolicyLayout>

)

}