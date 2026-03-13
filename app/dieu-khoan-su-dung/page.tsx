import PolicyLayout from "@/components/policy/PolicyLayout"

export const metadata = {
title:"Điều khoản sử dụng | VungTauTravel",
description:"Các điều khoản và điều kiện khi sử dụng website du lịch VungTauTravel."
}

export default function Page(){

return(

<PolicyLayout
title="Điều Khoản Sử Dụng"
description="Bằng việc truy cập website, bạn đồng ý tuân thủ các điều khoản dưới đây."
>

<h2 className="text-2xl font-semibold">1. Quyền sử dụng nội dung</h2>

<p>
Nội dung trên website bao gồm bài viết, hình ảnh
và dữ liệu du lịch chỉ được sử dụng cho mục đích cá nhân
và không được sao chép cho mục đích thương mại
nếu không có sự cho phép.
</p>

<h2 className="text-2xl font-semibold">2. Trách nhiệm người dùng</h2>

<p>
Người dùng cam kết sử dụng website
phù hợp với quy định pháp luật
và không gây ảnh hưởng đến hệ thống.
</p>

<h2 className="text-2xl font-semibold">3. Giới hạn trách nhiệm</h2>

<p>
Chúng tôi không chịu trách nhiệm
đối với các thay đổi về giá dịch vụ,
thời tiết hoặc thông tin từ bên thứ ba.
</p>

</PolicyLayout>

)

}