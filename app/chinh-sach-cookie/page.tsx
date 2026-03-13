import PolicyLayout from "@/components/policy/PolicyLayout"

export const metadata = {
title:"Chính sách Cookie | VungTauTravel",
description:"Tìm hiểu cách VungTauTravel sử dụng cookie để cải thiện trải nghiệm người dùng."
}

export default function Page(){

return(

<PolicyLayout
title="Chính Sách Cookie"
description="Website sử dụng cookie để tối ưu trải nghiệm và phân tích lưu lượng truy cập."
>

<h2 className="text-2xl font-semibold">1. Cookie là gì?</h2>

<p>
Cookie là các tệp nhỏ được lưu trên trình duyệt
giúp ghi nhớ thông tin truy cập và cải thiện trải nghiệm.
</p>

<h2 className="text-2xl font-semibold">2. Cách chúng tôi sử dụng cookie</h2>

<p>
Cookie được sử dụng để phân tích lưu lượng truy cập,
cải thiện hiệu suất website
và cá nhân hóa nội dung du lịch.
</p>

<h2 className="text-2xl font-semibold">3. Quản lý cookie</h2>

<p>
Người dùng có thể tắt cookie trong cài đặt trình duyệt
nhưng điều này có thể ảnh hưởng đến một số chức năng.
</p>

</PolicyLayout>

)

}