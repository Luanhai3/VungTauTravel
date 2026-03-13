import PolicyLayout from "@/components/policy/PolicyLayout"

export const metadata = {
title:"Chính sách hoàn tiền | VungTauTravel",
description:"Chính sách hoàn tiền và hủy dịch vụ khi đặt tour hoặc dịch vụ du lịch."
}

export default function Page(){

return(

<PolicyLayout
title="Chính Sách Hoàn Tiền"
description="Áp dụng cho các dịch vụ du lịch được cung cấp thông qua VungTauTravel."
>

<h2 className="text-2xl font-semibold">1. Hủy dịch vụ</h2>

<p>
Người dùng có thể hủy dịch vụ trong thời gian quy định
tùy theo từng loại dịch vụ du lịch.
</p>

<h2 className="text-2xl font-semibold">2. Hoàn tiền</h2>

<p>
Việc hoàn tiền sẽ được xử lý
trong vòng 7–14 ngày làm việc
tùy theo phương thức thanh toán.
</p>

<h2 className="text-2xl font-semibold">3. Trường hợp không hoàn tiền</h2>

<p>
Một số dịch vụ đặc biệt
có thể không áp dụng hoàn tiền
theo điều khoản của nhà cung cấp.
</p>

</PolicyLayout>

)

}