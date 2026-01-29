import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  interface NotificationEmailProps {
	subject: string;
	content: string;
  }
  
  export const NotificationEmail = ({
	subject,
	content,
  }: NotificationEmailProps) => {
	const previewText = subject;
  
	return (
	  <Html>
		<Head />
		<Preview>{previewText}</Preview>
  
		<Tailwind>
		  <Body className="bg-[#F0F9FF] my-auto mx-auto font-sans">
			<Container className="bg-white rounded-2xl shadow-lg my-[40px] mx-auto p-[28px] w-[480px]">
  
			  {/* Logo / Image */}
			  <Section className="text-center mt-[12px]">
				<Img
				  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop"
				  width="72"
				  height="72"
				  alt="Vũng Tàu Travel"
				  className="mx-auto rounded-full object-cover shadow-md"
				/>
			  </Section>
  
			  {/* Brand */}
			  <Heading className="text-center text-[26px] font-extrabold text-sky-600 my-[24px]">
				Vũng Tàu Travel
			  </Heading>
  
			  {/* Greeting */}
			  <Text className="text-gray-800 text-[15px] leading-[26px]">
				Xin chào bạn 👋
			  </Text>
  
			  {/* Content */}
			  <Text className="text-gray-700 text-[15px] leading-[26px]">
				{content}
			  </Text>
  
			  {/* CTA */}
			  <Section className="text-center my-[32px]">
				<Link
				  href="https://vungtautravel.com"
				  className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full text-white text-[14px] font-bold no-underline px-8 py-3 shadow-md"
				>
				  🌊 Khám phá Vũng Tàu ngay
				</Link>
			  </Section>
  
			  {/* Divider */}
			  <Section className="border-t border-gray-200 my-[24px]" />
  
			  {/* Footer */}
			  <Text className="text-gray-500 text-[12px] leading-[22px] text-center">
				Bạn nhận được email này vì đã đăng ký nhận thông tin từ{" "}
				<span className="font-semibold text-sky-600">
				  Vũng Tàu Travel
				</span>
				.
				<br />
				Đây là email tự động, vui lòng không trả lời email này.
			  </Text>
  
			</Container>
  
			{/* Footer background note */}
			<Text className="text-center text-[11px] text-gray-400 mb-[20px]">
			  © {new Date().getFullYear()} VungTauTravel. All rights reserved.
			</Text>
		  </Body>
		</Tailwind>
	  </Html>
	);
  };
  
  export default NotificationEmail;
  