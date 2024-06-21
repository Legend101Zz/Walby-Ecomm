import "./globals.css";

export const metadata = {
	title: "Walby",
	description: "Customer centric ecommerce",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-black">{children}</body>
		</html>
	);
}
